import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Use CLI metadata, never a hard-coded model roster or a "free" name alone.
// OpenCode v2 dropped the verbose model listing; the CLI now prints bare model
// IDs and full metadata lives in the public Zen catalog. Map those records to
// the shape rankFreeModels expects. A missing price reads as paid (never free).
export const ZEN_MODELS_URL = 'https://opencode.ai/zen/v1/models';

export function zenModelRecords(rows) {
  return (Array.isArray(rows) ? rows : []).filter(row => typeof row?.id === 'string').map(row => ({
    fullID: `opencode/${row.id}`,
    release_date: row.release_date || row.last_updated || undefined,
    status: row.status || 'active',
    cost: {
      input: row.cost?.text?.input?.price,
      output: row.cost?.text?.output?.price,
      // The catalog omits cache prices on free models; absent means zero.
      cache: { read: row.cost?.text?.input?.cache?.read ?? 0, write: row.cost?.text?.input?.cache?.write ?? 0 },
    },
    capabilities: {
      toolcall: row.capabilities?.tools?.supported === true,
      input: { text: (row.modalities?.input || []).includes('text') },
      output: { text: (row.modalities?.output || []).includes('text') },
      reasoning: row.capabilities?.reasoning?.supported === true,
    },
    limit: { context: row.limit?.context ?? 0 },
  }));
}

async function cliModelIds() {
  try {
    const result = await runCli(['models']);
    const ids = result.out.split(/\r?\n/).map(line => line.trim()).filter(line => /^opencode\//.test(line));
    if (ids.length) return new Set(ids);
  } catch (error) {
    console.warn(`[models] CLI listing unavailable: ${error.message}; using the Zen catalog alone`);
  }
  return null;
}

function zeroCost(value) {
  if (typeof value === 'number') return value === 0;
  if (value && typeof value === 'object') return Object.values(value).every(zeroCost);
  return false;
}

// Vendor preference is a deliberate trust policy, not a capability claim. The
// order is the maintainer priority: proven model families before a newer
// release from a vendor with no track record. Add a vendor here only after its
// free models have a reliable history in this automation.
export const TRUSTED_FREE_MODEL_VENDORS = Object.freeze([
  'deepseek', 'glm', 'minimax', 'kimi', 'qwen', 'step', 'muse',
]);
const vendorPatterns = TRUSTED_FREE_MODEL_VENDORS.map(vendor =>
  [vendor, new RegExp(`^${vendor}(?:$|[-_.\\d])`, 'i')]);

function vendorRank(model) {
  const id = (model.fullID || '').replace(/^opencode\//i, '');
  const index = vendorPatterns.findIndex(([, pattern]) => pattern.test(id));
  return index === -1 ? TRUSTED_FREE_MODEL_VENDORS.length : index;
}

export function rankFreeModels(models) {
  const released = (model) => Date.parse(model.release_date) || 0;
  return [...new Map(models.filter(model =>
    /^opencode\/[a-zA-Z0-9._:/-]+$/.test(model.fullID || '') &&
    model.cost?.input === 0 && model.cost?.output === 0 && zeroCost(model.cost) &&
    model.capabilities?.toolcall === true &&
    model.capabilities?.input?.text === true && model.capabilities?.output?.text === true &&
    (!model.status || model.status === 'active')
  ).map(model => [model.fullID, model])).values()].sort((a, b) =>
    vendorRank(a) - vendorRank(b) ||
    released(b) - released(a) ||
    Number(!!b.capabilities.reasoning) - Number(!!a.capabilities.reasoning) ||
    (b.limit?.context || 0) - (a.limit?.context || 0) ||
    a.fullID.localeCompare(b.fullID)
  );
}

function executable() {
  if (process.env.OPENCODE_BIN) return process.env.OPENCODE_BIN;
  if (process.platform !== 'win32') return 'opencode';
  // npm's Windows shim is a .cmd. Resolve the shipped executable so prompts
  // never pass through cmd.exe quoting or shell interpolation.
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    for (const candidate of [path.join(dir, 'opencode.exe'), path.join(dir, 'node_modules/@opencode/cli/bin/opencode.exe'), path.join(dir, 'node_modules/opencode-ai/bin/opencode.exe')]) {
      if (existsSync(candidate)) return candidate;
    }
  }
  throw new Error('OpenCode executable not found; install @opencode/cli or set OPENCODE_BIN');
}

function errorMessage(event) {
  return event.error?.data?.message || event.error?.message || event.error?.name || 'Provider error';
}

// POSIX shell quoting for the wrapped command below.
function posixQuote(arg) {
  return `'` + String(arg).replace(/'/g, `'\\''`) + `'`;
}

export function runCli(args, { cwd = process.cwd(), timeoutMs = 30000, env = {} } = {}) {
  return new Promise((resolve, reject) => {
    // OpenCode v2 does not load .opencode agent definitions when the CLI is
    // spawned directly with a non-shell stdin (every agent lookup then fails
    // with `Agent not found`). Routing the same command through `sh -c exec`
    // makes v2 load the project agents reliably; exec replaces the shell, so
    // the process-group kill below still reaches the CLI.
    const posix = process.platform !== 'win32';
    const command = posix ? ['sh', ['-c', `exec ${[executable(), ...args].map(posixQuote).join(' ')}`]] : [executable(), args];
    const child = spawn(command[0], command[1], {
      cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true, detached: posix, shell: false,
    });
    let out = '', err = '', timedOut = false;
    const stop = () => {
      if (process.platform === 'win32') {
        if (child.pid) spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore', windowsHide: true });
      } else if (child.pid) {
        try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill('SIGKILL'); }
      }
    };
    const timer = setTimeout(() => { timedOut = true; stop(); }, timeoutMs);
    child.stdout.on('data', data => { out += data; if (out.length > 8_000_000) { timedOut = true; stop(); } });
    child.stderr.on('data', data => { err = (err + data).slice(-8000); });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => {
      clearTimeout(timer);
      if (timedOut) reject(new Error(`OpenCode exceeded its time/output limit (${timeoutMs}ms)`));
      else if (code !== 0) {
        const errors = out.split(/\r?\n/).flatMap(line => {
          try {
            const event = JSON.parse(line);
            return event.type === 'error' ? [errorMessage(event)] : [];
          } catch { return []; }
        });
        reject(new Error(`OpenCode exited ${code}: ${(errors.join('; ') || err || 'No error details').slice(-500)}`));
      }
      else resolve({ out, err });
    });
  });
}

let discovered;
export async function discoverFreeModels() {
  if (!discovered) discovered = (async () => {
    const ids = await cliModelIds();
    let zen = [];
    try {
      const response = await fetch(ZEN_MODELS_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      zen = zenModelRecords((await response.json())?.data);
    } catch (error) {
      throw new Error(`Zen model catalog unavailable: ${error.message}`);
    }
    const models = rankFreeModels(ids ? zen.filter(model => ids.has(model.fullID)) : zen);
    if (!models.length) throw new Error('No verified zero-cost, tool-capable text models in the catalog');
    console.log(`[models] Free candidates (trusted vendors first, then release date): ${models.map(m => `${m.fullID} [${m.release_date || 'date unknown'}]`).join(', ')}`);
    return models;
  })();
  try { return await discovered; } catch (error) { discovered = undefined; throw error; }
}

export function responseText(output) {
  const events = output.split(/\r?\n/).flatMap(line => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  const errors = events.filter(event => event.type === 'error');
  if (errors.length) throw new Error(`OpenCode returned an error event: ${errors.map(errorMessage).join('; ')}`);
  // Only the final assistant step is the answer. Earlier steps can contain
  // planning text before tool calls, which must not contaminate a strict decision.
  // A final step without text must fail rather than reuse an earlier approval.
  const lastStep = events.findLastIndex(event => event.type === 'step_start');
  const finalEvents = lastStep < 0 ? events : events.slice(lastStep + 1);
  // Tool input and echoed prompts must never become reviewer decisions.
  const text = finalEvents.filter(event => event.type === 'text' && typeof event.part?.text === 'string')
    .map(event => event.part.text).join('\n').trim();
  if (!text) throw new Error('OpenCode returned no assistant text');
  return text;
}

export async function runModel(model, prompt, { agent = 'curator', cwd = process.cwd(), timeoutMs = 180000, config = {}, cli = runCli } = {}) {
  // v2 dropped --dir; the child-process cwd selects the project (agents live in
  // .opencode/agent there), so run from it explicitly.
  const result = await cli(['run', '--format', 'json', '--model', model, '--agent', agent, prompt], {
    cwd, timeoutMs,
    // Both the main and auxiliary model stay on the selected free model.
    env: { OPENCODE_CONFIG_CONTENT: JSON.stringify({ ...config, model, small_model: model }) },
  });
  return responseText(result.out);
}

// A deny-all profile removes the coding tool definitions and currently makes
// Zen reject even valid CLI requests with FreeTierError. Keep tools defined
// but approval-gated: non-interactive `run` rejects every ask unless --auto is
// passed. Never add --auto or allow tools for this probe.
export const APPROVAL_GATED_PERMISSION = Object.freeze({ '*': 'ask' });

// v2 no longer registers agents defined through OPENCODE_CONFIG_CONTENT: the
// probe agent has to exist as a file under <cwd>/.opencode/agents/. This
// renders that file in native v2 shape (ordered permissions array, effect ask
// on every action), so an unattended run rejects every tool use.
export function agentFileSource(agent, body) {
  return [
    '---',
    `description: ${agent} agent for this automation; never edits anything.`,
    'mode: primary',
    'permissions:',
    '  - action: "*"',
    '    resource: "*"',
    '    effect: ask',
    '---',
    '',
    body,
    '',
  ].join('\n');
}

export function approvalGatedAgent(agent, options = {}) {
  return { agent: { [agent]: { mode: 'primary', permission: APPROVAL_GATED_PERMISSION, ...options } } };
}

const verified = new Set();
const failed = new Set();
export async function probeModel(model, timeoutMs = 35000, { run = runModel } = {}) {
  if (verified.has(model)) return;
  const cwd = mkdtempSync(path.join(os.tmpdir(), 'opencode-probe-'));
  try {
    // v2 discovers agents only from the run's project directory, so the probe
    // agent file has to live inside this temporary cwd.
    mkdirSync(path.join(cwd, '.opencode', 'agents'), { recursive: true });
    writeFileSync(
      path.join(cwd, '.opencode', 'agents', 'probe.md'),
      agentFileSource('probe', 'Follow the response instruction exactly. Never use tools.'),
    );
    const text = await run(model, 'Reply with exactly OPENCODE_FREE_OK. Do not use tools.', {
      cwd, agent: 'probe', timeoutMs,
      config: {
        permission: APPROVAL_GATED_PERMISSION,
        ...approvalGatedAgent('probe', { prompt: 'Follow the response instruction exactly.' }),
      },
    });
    if (text.trim() !== 'OPENCODE_FREE_OK') throw new Error('Probe did not return the expected response');
    verified.add(model);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

export async function withFreeModel(task, {
  totalMs = 540000, attemptMs = 180000, probeMs = 90000,
  discover = discoverFreeModels, probe = probeModel, now = Date.now,
  failures = failed,
} = {}) {
  const deadline = now() + totalMs;
  const models = await discover();
  let lastError;
  for (const { fullID } of models) {
    if (failures.has(fullID) || now() >= deadline) continue;
    try {
      console.log(`[models] Checking ${fullID}`);
      // Free-tier cold starts (CLI boot + provider handshake) regularly exceed 35s;
      // a probe killed too early burns the whole candidate list without a verdict.
      await probe(fullID, Math.min(probeMs, deadline - now()));
      if (now() >= deadline) break;
      const result = await task(fullID, Math.min(attemptMs, deadline - now()));
      console.log(`[models] Task succeeded with ${fullID}`);
      return { model: fullID, result };
    } catch (error) {
      // This is a request/profile rejection, not a model outage. Rotating through
      // the whole free catalog only repeats the same 403 and hides the cause.
      if (/free tier can only be used from within OpenCode/i.test(error.message)) {
        throw new Error(`OpenCode rejected the agent/tool profile; check permissions and CLI compatibility. ${error.message}`);
      }
      failures.add(fullID);
      lastError = error;
      console.warn(`[models] ${fullID} failed: ${error.message}; trying next free candidate`);
    }
  }
  throw new Error(`No free model completed the task within budget${lastError ? `: ${lastError.message}` : ''}`);
}
