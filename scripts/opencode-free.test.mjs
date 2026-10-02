import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseModels, rankFreeModels, responseText, withFreeModel } from './opencode-free.mjs';
import { parseDecision } from './opencode-auto.mjs';

const model = (id, overrides = {}) => ({
  fullID: `opencode/${id}`, release_date: '2026-01-01', status: 'active',
  cost: { input: 0, output: 0, cache: { read: 0, write: 0 } },
  capabilities: { toolcall: true, input: { text: true }, output: { text: true }, reasoning: true },
  limit: { context: 200000 }, ...overrides,
});
test('parses actual CLI verbose framing, CRLF and refresh banners', () => {
  const output = '\x1b[92mModels cache refreshed\x1b[0m\r\n'
    + 'opencode/new-model\r\n' + JSON.stringify(model('new-model'), null, 2) + '\r\n'
    + 'opencode/bad-record\r\ninvalid JSON\r\n'
    + 'opencode/another\n' + JSON.stringify(model('another'));
  assert.deepEqual(parseModels(output).map(m => m.fullID), ['opencode/new-model', 'opencode/another']);
});
test('requires zero pricing and tool/text capability, not a free-looking name', () => {
  const input = [model('plain-name'), model('paid-free', { cost: { input: 1, output: 0 } }),
    model('unknown-free', { cost: undefined }), model('deprecated-free', { status: 'deprecated' }),
    model('cache-paid', { cost: { input: 0, output: 0, cache: { read: 1 } } }),
    model('tier-paid', { cost: { input: 0, output: 0, context_over_200k: { input: 1 } } }),
    model('no-tools', { capabilities: { toolcall: false } }), model('string-price', { cost: { input: '0', output: '0' } })];
  assert.deepEqual(rankFreeModels(input).map(m => m.fullID), ['opencode/plain-name']);
});
test('new releases rank first and dates missing do not pretend to be newest', () => {
  const input = [model('a-old'), model('z-new', { release_date: '2026-10-01' }), model('unknown', { release_date: undefined }), model('a-old')];
  assert.deepEqual(rankFreeModels(input).map(m => m.fullID), ['opencode/z-new', 'opencode/a-old', 'opencode/unknown']);
});
test('only assistant text becomes output; errors, empty output and tool echoes fail', () => {
  const event = text => JSON.stringify({ type: 'text', part: { text } });
  assert.equal(responseText('noise\n' + event('hello')), 'hello');
  assert.throws(() => responseText(JSON.stringify({ type: 'tool_use', part: { text: 'DECISION: APPROVE' } })));
  assert.throws(() => responseText(event('hello') + '\n' + JSON.stringify({ type: 'error' })));
  assert.throws(() => responseText(''));
});
test('reviewer decisions must be first and unambiguous', () => {
  assert.equal(parseDecision('DECISION: REQUEST_CHANGES\nEvidence follows.'), 'REQUEST_CHANGES');
  assert.throws(() => parseDecision('Echoed instructions: DECISION: APPROVE'));
  assert.throws(() => parseDecision('DECISION: APPROVE\nDECISION: CLOSE'));
});
test('probe failures and task failures both advance to the next live candidate', async () => {
  const calls = [];
  const result = await withFreeModel(async id => {
    calls.push(`task:${id}`);
    if (id.endsWith('b')) throw new Error('No fresh report');
    return 'fresh report';
  }, {
    discover: async () => [model('a'), model('b'), model('c')], failures: new Set(),
    probe: async id => { calls.push(`probe:${id}`); if (id.endsWith('a')) throw new Error('Unavailable'); },
  });
  assert.equal(result.model, 'opencode/c');
  assert.deepEqual(calls, ['probe:opencode/a', 'probe:opencode/b', 'task:opencode/b', 'probe:opencode/c', 'task:opencode/c']);
});
test('budget exhaustion stops before another task and never chooses a paid fallback', async () => {
  let clock = 0, taskCalls = 0;
  await assert.rejects(withFreeModel(async () => { taskCalls++; }, {
    totalMs: 20, now: () => clock, failures: new Set(),
    discover: async () => [model('a'), model('b')], probe: async () => { clock += 21; },
  }), /within budget/);
  assert.equal(taskCalls, 0);
  await assert.rejects(withFreeModel(async () => {}, { discover: async () => [], failures: new Set() }), /No free model/);
});
