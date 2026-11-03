import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findStale } from './stale-pr-sweep.mjs';

const NOW = Date.parse('2026-11-03T12:00:00Z');
const day = n => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString();
const maintainer = new Set(['hdjekuue', 'github-actions[bot]']);
const pr = { state: 'open', number: 5, user: { login: 'contrib' }, head: { ref: 'feature' } };
const comment = (login, when, body = 'Please update the bilingual rows.') => ({ user: { login }, created_at: when, body });

test('closes when the ask is past the cutoff and the author went silent', () => {
  const hit = findStale({
    pr, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('contrib', day(30), 'opened'), comment('hdjekuue', day(25))],
    commits: [{ commit: { committer: { date: day(31) } } }],
  });
  assert.equal(hit.pr.number, 5);
});

test('keeps the PR while the ask is fresh', () => {
  assert.equal(findStale({
    pr, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('hdjekuue', day(3))], commits: [],
  }), null);
});

test('keeps the PR when the author pushed or replied after the ask', () => {
  assert.equal(findStale({
    pr, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('hdjekuue', day(30)), comment('contrib', day(10), 'done!')],
    commits: [],
  }), null);
  assert.equal(findStale({
    pr, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('hdjekuue', day(30))],
    commits: [{ commit: { committer: { date: day(5) } } }],
  }), null);
});

test('bot receipts are not asks; only the gate request-changes comment is', () => {
  assert.equal(findStale({
    pr, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('github-actions[bot]', day(30), 'labels added')],
    commits: [],
  }), null);
  const hit = findStale({
    pr, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('github-actions[bot]', day(30), 'decision: **REQUEST_CHANGES**')],
    commits: [],
  });
  assert.equal(hit.pr.number, 5);
});

test('strangers do not count as askers, and the gate drafts are out of scope', () => {
  assert.equal(findStale({
    pr, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('random-user', day(30))], commits: [],
  }), null);
  assert.equal(findStale({
    pr: { ...pr, head: { ref: 'curator/report-x' } }, now: NOW, cutoffDays: 21, maintainerLogins: maintainer,
    comments: [comment('hdjekuue', day(30))], commits: [],
  }), null);
});
