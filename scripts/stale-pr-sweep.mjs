// Stale change-request sweep: when a maintainer or the gate asks a PR author
// for changes and the author neither pushes nor comments for STALE_DAYS, close
// the PR politely. Deterministic on purpose: this rule must not depend on an
// LLM run completing.
import { runGhRead } from './curate.mjs';
import { spawn } from 'node:child_process';

const DAY_MS = 24 * 60 * 60 * 1000;
// Bot receipts (labels, approvals) are not asks. The gate's REQUEST_CHANGES
// comment is: only gate comments carrying one of these markers count.
const GATE_ASK_MARKERS = ['REQUEST_CHANGES', 'Please address', 'Please update'];

function isAsk(comment, author, maintainerLogins) {
  const login = comment?.user?.login || '';
  if (!login || login === author) return false;
  // Bot receipts (labels, approvals) are never asks; only the gate's
  // request-changes comment counts, by marker.
  if (login.endsWith('[bot]')) {
    const body = comment.body || '';
    return GATE_ASK_MARKERS.some(marker => body.includes(marker));
  }
  return maintainerLogins.has(login);
}

function lastAskAt(comments, author, maintainerLogins) {
  const asks = (comments || []).filter(comment => isAsk(comment, author, maintainerLogins));
  if (!asks.length) return null;
  return asks[asks.length - 1];
}

function authorActivityAfter(comments, commits, author, ask) {
  const askMs = Date.parse(ask.created_at);
  const lastComment = (comments || []).filter(c => c?.user?.login === author && Date.parse(c.created_at) > askMs).pop();
  const lastCommit = (commits || []).filter(c => {
    const when = c?.commit?.committer?.date || c?.commit?.author?.date;
    return when && Date.parse(when) > askMs;
  }).pop();
  return lastCommit || lastComment || null;
}

export function findStale({ pr, comments, commits, now = Date.now(), cutoffDays = 21, maintainerLogins = new Set() }) {
  if (pr.state !== 'open') return null;
  if ((pr.head?.ref || '').startsWith('curator/report-')) return null; // gate's job
  const ask = lastAskAt(comments, pr.user?.login, maintainerLogins);
  if (!ask) return null;
  if (now - Date.parse(ask.created_at) < cutoffDays * DAY_MS) return null;
  if (authorActivityAfter(comments, commits, pr.user?.login, ask)) return null;
  return { pr, ask };
}

function gh(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('gh', [command, ...args], { env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve(out) : reject(new Error(`gh ${command} failed: ${err.slice(-400)}`)));
  });
}

const CLOSE_MESSAGE = login =>
  `Hi @${login}! Thanks again for the contribution. We asked for a few changes about three weeks ago and this PR hasn't been updated since, so we're closing it to keep the queue tidy. ` +
  `If you'd still like it included, push the updates or leave a comment and we will gladly take another look. See CONTRIBUTING.md for the submission guidelines.`;

export async function sweep({ repository, cutoffDays = 21, apply = false, maintainerLogins = new Set(), read = runGhRead, ghWrite = gh, now = Date.now() } = {}) {
  const search = await read(`search/issues?q=repo:${repository}+is:pr+is:open`);
  const prs = (JSON.parse(search)?.items || []).map(item => ({ ...item, head: { ref: item.head?.ref || item.pull_request?.head?.ref || '' } }));
  const stale = [];
  for (const pr of prs) {
    const [commentsRaw, commitsRaw] = await Promise.all([
      read(`repos/${repository}/issues/${pr.number}/comments`),
      read(`repos/${repository}/pulls/${pr.number}/commits`),
    ]);
    const hit = findStale({
      pr, now,
      cutoffDays, maintainerLogins,
      comments: JSON.parse(commentsRaw) || [],
      commits: JSON.parse(commitsRaw) || [],
    });
    if (hit) stale.push(hit);
  }
  for (const { pr, ask } of stale) {
    console.log(`[stale] PR #${pr.number} (${pr.user?.login}): last change-request ${ask.created_at}, no author activity since${apply ? '' : ' — dry run'}`);
    if (!apply) continue;
    try {
      await ghWrite('pr', [String(pr.number), '--comment', CLOSE_MESSAGE(pr.user?.login || 'there')]);
      await ghWrite('pr', [String(pr.number), '--close']);
      console.log(`[stale] PR #${pr.number}: commented and closed`);
    } catch (error) {
      console.error(`[stale] PR #${pr.number}: close failed: ${error.message}`);
    }
  }
  console.log(`[stale] ${stale.length} stale change-request PR${stale.length === 1 ? '' : 's'}${apply ? ' handled' : ' found (dry run)'}`);
  return stale;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) { console.error('GITHUB_REPOSITORY is required'); process.exit(1); }
  const maintainers = new Set((process.env.STALE_MAINTAINERS || 'hdjekuue').split(',').map(s => s.trim()).filter(Boolean));
  await sweep({
    repository,
    cutoffDays: Number(process.env.STALE_DAYS || 21),
    apply: process.env.STALE_APPLY === '1',
    maintainerLogins: maintainers,
  });
}
