#!/usr/bin/env node
/**
 * curate.mjs — experimental headless curator for Awesome DSH
 * - Fetches live free models from https://opencode.ai/zen/v1/models (public, no key)
 * - Traverses free models: latest first, fallback to static list if endpoint fails
 * - Runs `opencode run --model opencode/<id> --agent curator` with auto fallback
 * - Always succeeds: if opencode unavailable or all models fail, writes deterministic template to curator-report.md
 * - Intended for GitHub Action (schedule / issue / PR) and local `node scripts/curate.mjs`
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_FILE = path.join(ROOT, 'curator-report.md');
const ZEN_MODELS_URL = 'https://opencode.ai/zen/v1/models';

// Keep in sync with public free list — will be traversed latest-first
const STATIC_FREE_FALLBACK = [
  'muse-spark-1.2-contributor-free',
  'mimo-v2.5-free',
  'hy3-free',
  'deepseek-v4-flash-free',
  'nemotron-3-ultra-free',
  'nemotron-3.5-lightning-free',
  'laguna-s-2.1-free',
  'big-pickle',
  'north-mini-code-free',
  'qwen3-coder-free',
  'ministral-3-14b-free',
  'grok-build-0.1',
];

async function fetchText(url, opts = {}) {
  const headers = { 'User-Agent': 'awesome-dsh-curator/1.0', ...(opts.headers || {}) };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs || 10000);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal });
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    return await res.text();
  } finally { clearTimeout(t); }
}

function randHex(bytes = 12) {
  const chars = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < bytes * 2; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}

async function fetchLiveFreeModels() {
  try {
    const headers = {
      'x-opencode-client': 'cli',
      'x-opencode-session': `ses_${randHex(12)}`,
      'x-opencode-project': 'global',
      'x-opencode-request': `msg_${randHex(12)}`,
      'User-Agent': 'opencode/1.18.18/cli',
    };
    const raw = await fetchText(ZEN_MODELS_URL, { timeoutMs: 8000, headers });
    const data = JSON.parse(raw);
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const free = list
      .filter(m => {
        const id = (m.id || '').toLowerCase();
        const rawId = (m.id || '').toLowerCase();
        // Zen returns ids like deepseek-v4-flash-free (without opencode/ prefix) or with
        if (rawId.includes('-free') || (m.name || '').toLowerCase().includes(' free')) return true;
        if (m.pricing && m.pricing.input === 0 && m.pricing.output === 0) return true;
        return false;
      })
      .map(m => (m.id || '').replace(/^opencode\//, '').replace(/^oc\//, '').trim())
      .filter(Boolean);
    if (free.length) {
      const uniq = [...new Set(free)];
      // Keep API order (approx latest-first), no extra sort — ensures newest free first as requested
      console.log(`Live free models from Zen (${uniq.length}): ${uniq.slice(0, 12).join(', ')}`);
      return uniq;
    }
  } catch (e) {
    console.warn(`Zen fetch failed: ${e.message}`);
  }
  console.log(`Using static fallback: ${STATIC_FREE_FALLBACK.slice(0, 8).join(', ')}`);
  return STATIC_FREE_FALLBACK;
}

async function runPreliminaryChecks(pr, issue) {
  const out = [];
  const exec = (cmd, args) => new Promise(res => {
    const isWin = process.platform === 'win32';
    const useShell = cmd === 'opencode' && isWin; // gh is binary, no shell needed; opencode on Win is .ps1
    const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'], shell: useShell });
    let o = '', e = '';
    child.stdout.on('data', d => o += d.toString());
    child.stderr.on('data', d => e += d.toString());
    child.on('close', code => res({ code, out: o, err: e }));
    child.on('error', err => res({ code: 1, out: '', err: err.message }));
  });
  if (pr) {
    out.push(`## Preliminary PR #${pr} checks (deterministic)`);
    const prInfo = await exec('gh', ['pr', 'view', String(pr), '--json', 'title,body,files,author,additions', '--jq', '.']);
    if (prInfo.code === 0) {
      try {
        const j = JSON.parse(prInfo.out);
        const titleOk = /^(Add|docs: add) .+ to .+/i.test(j.title || '');
        out.push(`- Title: "${j.title}" ${titleOk ? '✅ matches Add owner/repo to Category' : '❌ should be Add owner/repo to Category'}`);
        const files = (j.files || []).map(f => f.path).join(', ');
        out.push(`- Files: ${files || '(none)'} ${files.includes('README.md') && files.includes('README.zh.md') ? '✅ bilingual' : '❌ missing README.md or README.zh.md'}`);
        // Extract owner/repo from diff via title or body
        // Robust owner/repo extraction: prefer https://github.com/owner/repo, fallback to generic but ignore github.com
        let repo = null;
        const ghMatch = (j.title + ' ' + (j.body || '')).match(/https?:\/\/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/i);
        if (ghMatch) repo = ghMatch[1].replace(/\.git$|\/$/, '');
        else {
          const generic = (j.title + ' ' + (j.body || '')).match(/(?<![a-zA-Z0-9_.-])([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)(?![a-zA-Z0-9_.-])/);
          if (generic && generic[1] !== 'github.com/thedeveloper256' && !generic[1].startsWith('github.com/')) repo = generic[1];
          // Also try files diff: look for owner/repo in body via gh pr diff? fallback to files path check
          if (!repo && j.files) {
            const fromFiles = JSON.stringify(j.files).match(/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/);
            if (fromFiles && fromFiles[1].includes('/')) repo = fromFiles[1];
          }
        }
        if (repo) {
          // sanitize
          repo = repo.replace(/^github\.com\//, '');
          out.push(`- Detected repo: ${repo}`);
          const api = await exec('gh', ['api', `repos/${repo}`, '--jq', '{stars: .stargazers_count, topics: .topics, license: .license.spdx_id}']);
          if (api.code === 0) {
            try {
              const info = JSON.parse(api.out);
              out.push(`- Live: stars=${info.stars}, topics=${(info.topics||[]).join(',') || '(none)'}, license=${info.license || '(none)'} ${info.topics?.includes('dsh-plugin') ? '✅ dsh-plugin' : '❌ missing dsh-plugin'}`);
            } catch { out.push(`- Live fetch parse failed: ${api.out.slice(0,200)}`); }
          } else {
            out.push(`- Live fetch failed for ${repo}: ${api.err.slice(0,200)}`);
          }
        } else {
          out.push(`- Could not detect owner/repo from title/body`);
        }
      } catch (e) { out.push(`- PR parse failed: ${e.message}`); }
    } else {
      out.push(`- gh pr view failed: ${prInfo.err.slice(0,300)}`);
    }
  }
  if (issue) {
    out.push(`## Preliminary Issue #${issue} checks`);
    const iss = await exec('gh', ['issue', 'view', String(issue), '--json', 'title,body,labels,author', '--jq', '.']);
    if (iss.code === 0) {
      try {
        const j = JSON.parse(iss.out);
        out.push(`- Title: ${j.title}`);
        out.push(`- Labels: ${(j.labels||[]).map(l=>l.name).join(', ') || '(none)'} — suggest: plugin suggestion / fix / question`);
        let mRepo = null;
        const ghM = (j.title + ' ' + (j.body||'')).match(/https?:\/\/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/i);
        if (ghM) mRepo = ghM[1].replace(/\.git$|\/$/, '');
        else {
          const gen = (j.title + ' ' + (j.body||'')).match(/(?<![a-zA-Z0-9_.-])([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)(?![a-zA-Z0-9_.-])/);
          if (gen && !gen[1].startsWith('github.com/')) mRepo = gen[1];
        }
        if (mRepo) {
          mRepo = mRepo.replace(/^github\.com\//, '');
          out.push(`- Detected repo: ${mRepo} — check if already listed via grep`);
          const api2 = await exec('gh', ['api', `repos/${mRepo}`, '--jq', '{stars: .stargazers_count, topics: .topics}']);
          if (api2.code === 0) {
            try { const inf = JSON.parse(api2.out); out.push(`- Live: stars=${inf.stars}, topics=${(inf.topics||[]).join(',')}`); } catch {}
          }
        }
      } catch (e) { out.push(`- Issue parse failed: ${e.message}`); }
    }
  }
  if (!pr && !issue) out.push('No PR/Issue event — general health audit only');
  return out.join('\n');
}

async function runAutoLabel(pr, issue, preChecks) {
  const exec = (cmd, args) => new Promise(res => {
    const child = spawn(cmd, args, { stdio: ['pipe','pipe','pipe'], shell: false });
    let o='', e='';
    child.stdout.on('data', d=>o+=d); child.stderr.on('data', d=>e+=d);
    child.on('close', code=>res({code,out:o,err:e})); child.on('error', err=>res({code:1,out:'',err:err.message}));
  });
  const labelsToAdd = new Set(['auto-labeled']);
  let target = null, isPR = false;
  if (pr) { target = String(pr); isPR = true; labelsToAdd.add('needs-review'); }
  else if (issue) { target = String(issue); isPR = false; labelsToAdd.add('needs-review'); }
  else return;

  // Heuristic based on preChecks content
  const lower = preChecks.toLowerCase();
  if (lower.includes('bilingual') && lower.includes('❌')) labelsToAdd.add('needs-review');
  if (lower.includes('missing dsh-plugin')) labelsToAdd.add('invalid');
  else if (lower.includes('dsh-plugin')) labelsToAdd.add('plugin');
  if (lower.includes('title') && lower.includes('❌')) labelsToAdd.add('needs-review');
  // For PRs that look like plugin additions, also add plugin
  if (isPR && lower.includes('detected repo:')) labelsToAdd.add('plugin');
  // For issues, map to existing labels
  if (!isPR) {
    if (lower.includes('plugin suggestion') || lower.includes('detected repo:')) labelsToAdd.add('enhancement');
    if (lower.includes('question')) labelsToAdd.add('question');
    if (lower.includes('fix') || lower.includes('bug')) labelsToAdd.add('bug');
  }
  // Always add curator for tracking
  labelsToAdd.add('curator');

  const labels = [...labelsToAdd].join(',');
  console.log(`[curate] Auto labeling ${isPR ? 'PR' : 'Issue'} #${target} with: ${labels}`);
  const cmd = isPR ? 'pr' : 'issue';
  const res = await exec('gh', [cmd, 'edit', target, '--add-label', labels]);
  if (res.code === 0) console.log(`[curate] Labels added: ${labels}`);
  else console.warn(`[curate] Label add failed: ${res.err.slice(0,300)} — trying individual`);
  // Fallback: try one by one if bulk failed
  if (res.code !== 0) {
    for (const lbl of labelsToAdd) {
      const r = await exec('gh', [cmd, 'edit', target, '--add-label', lbl]);
      if (r.code === 0) console.log(`[curate] Label ${lbl} added`);
      else console.warn(`[curate] Label ${lbl} failed: ${r.err.slice(0,200)}`);
    }
  }
}

function runOpencode(modelId, prompt) {
  return new Promise((resolve, reject) => {
    const model = `opencode/${modelId}`;
    const args = ['run', '--model', model, '--agent', 'curator', prompt];
    console.log(`\n[curate] Trying model: ${model} ...`);
    const isWin = process.platform === 'win32';
    const child = spawn('opencode', args, {
      cwd: ROOT,
      env: { ...process.env, OPENCODE_API_KEY: process.env.OPENCODE_API_KEY || 'public' },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: isWin,
    });
    let out = '', err = '';
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`opencode timeout for ${model}`));
    }, 180000);
    child.stdout.on('data', d => { out += d.toString(); process.stdout.write(d); });
    child.stderr.on('data', d => { err += d.toString(); process.stderr.write(d); });
    child.on('error', e => { clearTimeout(timeout); reject(e); });
    child.on('close', code => {
      clearTimeout(timeout);
      if (code === 0) resolve({ code, out, err });
      else reject(new Error(`opencode ${model} exit ${code}: ${err.slice(0, 800)}`));
    });
  });
}

async function generateWithTraversal(prompt) {
  const live = await fetchLiveFreeModels();
  const combined = [...new Set([...live, ...STATIC_FREE_FALLBACK])];
  console.log(`[curate] Traversal order (${combined.length}): ${combined.slice(0, 12).join(', ')}${combined.length > 12 ? ' ...' : ''}`);
  let lastErr = null;
  for (const modelId of combined) {
    try {
      const hasOpencode = await new Promise(res => {
        const isWin = process.platform === 'win32';
        const c = spawn('opencode', ['--version'], { stdio: 'ignore', shell: isWin });
        c.on('error', () => res(false));
        c.on('close', code => res(code === 0));
      });
      if (!hasOpencode) throw new Error('opencode binary not found');
      await runOpencode(modelId, prompt);
      if (fs.existsSync(REPORT_FILE)) {
        const content = fs.readFileSync(REPORT_FILE, 'utf8');
        if (content.includes('# Curator Report') || content.includes('## Summary')) {
          console.log(`[curate] Success with ${modelId}`);
          return { modelId, success: true };
        }
        console.warn(`[curate] ${modelId} produced report without expected header, trying next`);
        lastErr = new Error('invalid report');
        continue;
      }
      console.warn(`[curate] ${modelId} did not create curator-report.md`);
      lastErr = new Error('no report');
    } catch (e) {
      console.warn(`[curate] ${modelId} failed: ${e.message}`);
      lastErr = e;
      await sleep(1500);
    }
  }
  throw lastErr || new Error('all free models failed');
}

function buildPrompt({ pr, issue, preChecks }) {
  const now = new Date().toISOString();
  const prInfo = pr ? `PR #${pr} (check via gh pr view ${pr})` : 'no PR event';
  const issueInfo = issue ? `Issue #${issue}` : 'no issue event';
  return [
    `You are the autonomous Awesome DSH Curator (see .opencode/agent/curator.md). Be agentic, not mechanical.`,
    ``,
    `Context as of ${now} UTC:`,
    `- Repo: https://github.com/awesome-deepseekharness/awesome-deepseek-harness`,
    `- Event: ${prInfo}, ${issueInfo}`,
    `- Env: GH_PR=${pr || ''} GH_ISSUE=${issue || ''}`,
    ``,
    `Preliminary deterministic checks (already run by scripts/curate.mjs — use as ground truth, then do deeper verification):`,
    preChecks ? preChecks.split('\n').map(l => `> ${l}`).join('\n') : '> (no preliminary checks)',
    ``,
    `Task: Do a quick health audit (README tables, duplicates, star drift sample), and if GH_PR/GH_ISSUE is set, preprocess that PR/Issue per curator.md. For any new project (owner/repo), autonomously verify with websearch/webfetch/kitesurf browser (chrome-devtools-mcp via wss://kitesurf.cloudflare.app/devtools/browser) — fetch repo page, check README for dsh install, verify dsh-plugin topic via gh api, and search for the project to confirm it's real. Then provide a maintainer review opinion (Approve / Request changes / Needs discussion) with confidence and suggested comment body (friendly, in PR language, ping @hdjekuue if needed). Always overwrite curator-report.md with the required structure including Preliminary Checks and Maintainer Review Opinion.`,
    ``,
    `Toolbox hints:`,
    `- Prefer gh api for GitHub data, curl + jq for APIs, webfetch first then kitesurf browser for JS-heavy pages, websearch for auto-discovery.`,
    `- Use opencode public provider (https://opencode.ai/zen/v1, apiKey public) — you are already on a free model via traversal.`,
    `- kitesurf MCP is available as local MCP "kitesurf" (command: npx chrome-devtools-mcp --wsEndpoint=wss://kitesurf.cloudflare.app/devtools/browser) — use it to open https://github.com/owner/repo or demo URLs when webfetch returns shell.`,
    ``,
    `Proceed autonomously. After writing curator-report.md, echo DONE and list Sources.`,
  ].join('\n');
}

function buildDeterministicReport({ pr, issue }) {
  const now = new Date().toISOString();
  let health = '';
  try {
    const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
    const lines = readme.split('\n').filter(l => l.startsWith('| ['));
    health = `Found ${lines.length} project rows in README.md. Sample: ${lines.slice(0, 2).map(l => l.slice(0, 80)).join(' | ')}`;
  } catch { health = 'README.md not readable'; }
  return `# Curator Report — ${now.slice(0, 16)} UTC (model: fallback)

> Auto-generated by scripts/curate.mjs deterministic fallback (no LLM). Experimental, needs human review.

## Summary
No LLM run (opencode free models unavailable or OPENCODE_API_KEY missing). This is a deterministic health snapshot. Trigger opencode with free-model traversal to get AI triage.

## Repo Health
- ${health}
- Star drift: not checked (fallback). Run \`gh api repos/owner/repo --jq .stargazers_count\` manually for 2–3 rows.
- Duplicates: not checked.

## PR Triage
${pr ? `- PR #${pr} detected. Please run \`gh pr view ${pr} --json title,body,files\` and check bilingual, star, dsh-plugin topic per CONTRIBUTING.md.` : '- No PR event.'}

## Issue Triage
${issue ? `- Issue #${issue} detected. Suggest labels: plugin suggestion / fix / question. Check if repo already listed.` : '- No issue event.'}

## Proposed Patches
- None (fallback).

## Next Steps
- To enable AI: ensure opencode installed and run \`node scripts/curate.mjs\` (or wait for scheduled Action). Free models are public via https://opencode.ai/zen/v1.
- Reviewer: verify any AI suggestion before merging.

## Sources
- Local: README.md, README.zh.md, CONTRIBUTING.md
- Live free models: ${ZEN_MODELS_URL}

---
*Generated at ${now} UTC. Set OPENCODE_API_KEY or just use public provider to enable AI.*
`;
}

async function main() {
  console.log(`[curate] Starting at ${new Date().toISOString()}`);
  const pr = process.env.GH_PR || process.env.PR_NUMBER || '';
  const issue = process.env.GH_ISSUE || process.env.ISSUE_NUMBER || '';
  const preChecks = await runPreliminaryChecks(pr, issue);
  console.log(`[curate] Preliminary checks:\n${preChecks}\n---`);
  try { await runAutoLabel(pr, issue, preChecks); } catch (e) { console.warn(`[curate] autoLabel failed: ${e.message}`); }
  const prompt = buildPrompt({ pr, issue, preChecks });
  fs.writeFileSync(path.join(ROOT, '.curate-prompt.md'), prompt, 'utf8');
  console.log(`[curate] Prompt written to .curate-prompt.md`);

  // Detect opencode binary
  const hasOpencode = await new Promise(res => {
    const isWin = process.platform === 'win32';
    const c = spawn('opencode', ['--version'], { stdio: 'ignore', shell: isWin });
    c.on('error', () => res(false));
    c.on('close', code => res(code === 0));
  });
  if (!hasOpencode) {
    console.warn('[curate] opencode not found, writing fallback');
    fs.writeFileSync(REPORT_FILE, buildDeterministicReport({ pr, issue }), 'utf8');
    return;
  }

  try {
    await generateWithTraversal(prompt);
  } catch (e) {
    console.warn(`[curate] All models failed (${e.message}), fallback`);
    fs.writeFileSync(REPORT_FILE, buildDeterministicReport({ pr, issue }), 'utf8');
  }
  const final = fs.readFileSync(REPORT_FILE, 'utf8');
  console.log(`[curate] Done. Preview:\n${final.slice(0, 900)}\n...`);
}

main().catch(e => { console.error(e); process.exit(1); });
