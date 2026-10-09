import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Use CLI metadata, never a hard-coded model roster or a "free" name alone.
export function parseModels(output) {
  const clean = output.replace(/\x1b\[[0-9;]*m/g, '');
  const records = [...clean.matchAll(/^(opencode\/[a-zA-Z0-9._:/-]+)\s*\r?$/gm)];
  return records.flatMap((match, index) => {
    const body = clean.slice(match.index + match[0].length, records[index + 1]?.index).trim();
    try { return [{ ...JSON.parse(body), fullID: match[1] }]; } catch { return []; }
  });
}

function zeroCost(value) {
  if (typeof value === 'number') return value === 0;
  if (value && typeof value === 'object') return Object.values(value).every(zeroCost);
  return false;
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
    for (const candidate of [path.join(dir, 'opencode.exe'), path.join(dir, 'node_modules/opencode-ai/bin/opencode.exe')]) {
      if (existsSync(candidate)) return candidate;
    }
  }
  throw new Error('OpenCode executable not found; install opencode-ai or set OPENCODE_BIN');
}

export function runCli(args, { cwd = process.cwd(), timeoutMs = 30000, env = {} } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable(), args, {
      cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true, detached: process.platform !== 'win32', shell: false,
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
            return event.type === 'error' ? [event.error?.data?.message || event.error?.message || event.error?.name || 'Provider error'] : [];
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
    let result;
    try {
      result = await runCli(['models', 'opencode', '--refresh', '--verbose']);
      if (!parseModels(result.out).length) throw new Error('No model metadata returned');
    } catch (error) {
      console.warn(`[models] Refresh unavailable: ${error.message}; trying the CLI cache`);
      result = await runCli(['models', 'opencode', '--verbose']);
    }
    const models = rankFreeModels(parseModels(result.out));
    if (!models.length) throw new Error('CLI lists no verified zero-cost, tool-capable text models');
    console.log(`[models] Free candidates (release date, then capabilities): ${models.map(m => `${m.fullID} [${m.release_date || 'date unknown'}]`).join(', ')}`);
    return models;
  })();
  try { return await discovered; } catch (error) { discovered = undefined; throw error; }
}

export function responseText(output) {
  const events = output.split(/\r?\n/).flatMap(line => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  if (events.some(event => event.type === 'error')) throw new Error('OpenCode returned an error event');
  // Tool input and echoed prompts must never become reviewer decisions.
  const text = events.filter(event => event.type === 'text' && typeof event.part?.text === 'string')
    .map(event => event.part.text).join('\n').trim();
  if (!text) throw new Error('OpenCode returned no assistant text');
  return text;
}

export async function runModel(model, prompt, { agent = 'curator', cwd = process.cwd(), timeoutMs = 180000, config = {} } = {}) {
  const result = await runCli(['run', '--format', 'json', '--model', model, '--agent', agent, prompt], {
    cwd, timeoutMs,
    // Both the main and auxiliary model stay on the selected free model.
    env: { OPENCODE_CONFIG_CONTENT: JSON.stringify({ ...config, model, small_model: model }) },
  });
  return responseText(result.out);
}

const verified = new Set();
const failed = new Set();
export async function probeModel(model, timeoutMs = 35000) {
  if (verified.has(model)) return;
  const cwd = mkdtempSync(path.join(os.tmpdir(), 'opencode-probe-'));
  try {
    const text = await runModel(model, 'Reply with exactly OPENCODE_FREE_OK. Do not use tools.', {
      cwd, agent: 'probe', timeoutMs,
      config: { permission: { '*': 'deny' }, agent: { probe: { mode: 'primary', prompt: 'Follow the response instruction exactly.', permission: { '*': 'deny' } } } },
    });
    if (text.trim() !== 'OPENCODE_FREE_OK') throw new Error('Probe did not return the expected response');
    verified.add(model);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

export async function withFreeModel(task, {
  totalMs = 540000, attemptMs = 180000,
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
      await probe(fullID, Math.min(35000, deadline - now()));
      if (now() >= deadline) break;
      const result = await task(fullID, Math.min(attemptMs, deadline - now()));
      console.log(`[models] Task succeeded with ${fullID}`);
      return { model: fullID, result };
    } catch (error) {
      failures.add(fullID);
      lastError = error;
      console.warn(`[models] ${fullID} failed: ${error.message}; trying next free candidate`);
    }
  }
  throw new Error(`No free model completed the task within budget${lastError ? `: ${lastError.message}` : ''}`);
}
