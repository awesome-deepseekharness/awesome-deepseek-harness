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

function buildPrompt({ pr, issue }) {
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
    `Task: Do a quick health audit (README tables, duplicates, star drift sample), and if GH_PR/GH_ISSUE is set, preprocess that PR/Issue per curator.md. Always overwrite curator-report.md with the required structure.`,
    ``,
    `Toolbox hints:`,
    `- Prefer gh api for GitHub data, curl + jq for APIs, webfetch for HTML.`,
    `- Use opencode public provider (https://opencode.ai/zen/v1, apiKey public) — you are already on a free model via traversal.`,
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
  const prompt = buildPrompt({ pr, issue });
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
