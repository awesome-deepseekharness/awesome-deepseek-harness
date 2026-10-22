import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { EventEmitter } from 'node:events';
import { approvalGatedAgent, parseModels, rankFreeModels, responseText, runModel, probeModel, withFreeModel } from './opencode-free.mjs';
import { parseDecision } from './opencode-auto.mjs';
import { classifierConfig, isPluginTopicInvalid, runGhRead, validateGhReadEndpoint } from './curate.mjs';

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
test('only the final assistant step becomes a reviewer decision, never tool-call preambles', () => {
  const output = [
    { type: 'step_start' },
    { type: 'text', part: { text: 'I will read the report first.' } },
    { type: 'tool_use', part: { text: 'DECISION: APPROVE' } },
    { type: 'step_finish' },
    { type: 'step_start' },
    { type: 'text', part: { text: 'DECISION: REQUEST_CHANGES' } },
    { type: 'text', part: { text: 'Missing PR context.' } },
    { type: 'step_finish' },
  ].map(event => JSON.stringify(event)).join('\n');
  const text = responseText(output);
  assert.equal(text, 'DECISION: REQUEST_CHANGES\nMissing PR context.');
  assert.equal(parseDecision(text), 'REQUEST_CHANGES');
  assert.throws(() => responseText(output + '\n' + JSON.stringify({ type: 'step_start' })), /no assistant text/);
});

test('headless runner never auto-approves tools and pins both models', async () => {
  const text = await runModel('opencode/selected-free', 'quoted "prompt" & literal', {
    agent: 'probe', cwd: 'test-directory', timeoutMs: 1234,
    config: { model: 'paid/ignored', small_model: 'paid/ignored', permission: { '*': 'ask' } },
    cli: async (args, options) => {
      assert.deepEqual(args, ['run', '--dir', 'test-directory', '--format', 'json', '--model', 'opencode/selected-free', '--agent', 'probe', 'quoted "prompt" & literal']);
      assert.equal(options.cwd, 'test-directory');
      assert.equal(options.timeoutMs, 1234);
      assert.deepEqual(JSON.parse(options.env.OPENCODE_CONFIG_CONTENT), {
        model: 'opencode/selected-free', small_model: 'opencode/selected-free', permission: { '*': 'ask' },
      });
      return { out: JSON.stringify({ type: 'text', part: { text: 'OPENCODE_FREE_OK' } }) };
    },
  });
  assert.equal(text, 'OPENCODE_FREE_OK');
});

test('probe keeps tools approval-gated, uses the selected model, caches success and cleans up', async () => {
  let calls = 0, directory;
  const run = async (id, prompt, options) => {
    calls++;
    assert.equal(id, 'opencode/test-probe-success');
    assert.match(prompt, /Do not use tools/);
    assert.equal(options.agent, 'probe');
    assert.equal(options.timeoutMs, 1234);
    assert.deepEqual(options.config.permission, { '*': 'ask' });
    assert.deepEqual(options.config.agent.probe.permission, { '*': 'ask' });
    directory = options.cwd;
    assert.equal(existsSync(directory), true);
    return 'OPENCODE_FREE_OK';
  };
  await probeModel('opencode/test-probe-success', 1234, { run });
  assert.equal(existsSync(directory), false);
  await probeModel('opencode/test-probe-success', 1234, { run });
  assert.equal(calls, 1);
});

test('failed or invalid probes clean up and are not cached as available', async () => {
  let calls = 0, directory;
  const run = async (_id, _prompt, options) => {
    calls++;
    directory = options.cwd;
    if (calls === 1) throw new Error('Provider unavailable');
    return 'not the expected marker';
  };
  await assert.rejects(probeModel('opencode/test-probe-failure', 1234, { run }), /Provider unavailable/);
  assert.equal(existsSync(directory), false);
  await assert.rejects(probeModel('opencode/test-probe-failure', 1234, { run }), /expected response/);
  assert.equal(existsSync(directory), false);
  assert.equal(calls, 2);
});

test('v1 agent definitions use permission and shell, with deny-by-default shell rules', () => {
  for (const agent of ['curator', 'reviewer']) {
    const source = readFileSync(new URL('../.opencode/agent/' + agent + '.md', import.meta.url), 'utf8');
    const frontmatter = source.split('---')[1];
    assert.match(frontmatter, /^permission:/m);
    assert.doesNotMatch(frontmatter, /^permissions:/m);
    // `bash` is not a V1 permission key; it is silently ignored. `shell` is.
    assert.match(frontmatter, /^  shell:$/m);
    assert.doesNotMatch(frontmatter, /^  bash:/m);
    assert.match(frontmatter, /^    "\*": deny$/m);
    // The only shell command allowed is the deterministic GitHub-read wrapper.
    const shellBlock = frontmatter.split(/^  shell:$/m)[1]?.split(/^  [a-z]/m)[0] || '';
    const shellAllows = [...shellBlock.matchAll(/^    "([^"]+)": allow$/gm)].map(m => m[1]);
    assert.deepEqual(shellAllows, ['node scripts/curate.mjs gh-read *']);
    assert.doesNotMatch(frontmatter, /gh api/);
    if (agent === 'reviewer') {
      // `edit` covers edit, write and apply_patch; a separate write rule is unnecessary.
      assert.match(frontmatter, /^  edit: deny$/m);
    }
  }
});

test('ambiguous-PR classifier uses the same approval-gated profile as the probe', () => {
  const config = classifierConfig();
  assert.deepEqual(config, approvalGatedAgent('classifier'));
  assert.deepEqual(config, {
    agent: { classifier: { mode: 'primary', permission: { '*': 'ask' } } },
  });
});

test('profile rejection preserves provider details and stops catalog-wide retries', async () => {
  const message = "OpenCode's free tier can only be used from within OpenCode. Download it at https://opencode.ai and keep building.";
  const output = JSON.stringify({ type: 'error', error: { data: { message } } });
  assert.throws(() => responseText(output), /free tier can only be used/);
  let probes = 0, tasks = 0;
  const failures = new Set();
  await assert.rejects(withFreeModel(async () => { tasks++; }, {
    discover: async () => [model('a'), model('b')], failures,
    probe: async () => { probes++; responseText(output); },
  }), error => {
    assert.match(error.message, /agent\/tool profile/);
    assert.match(error.message, /free tier can only be used from within OpenCode/);
    return true;
  });
  assert.equal(probes, 1);
  assert.equal(tasks, 0);
  assert.equal(failures.size, 0);
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

function fakeChild({ code = 0, stdout = '', stderr = '' } = {}) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  setImmediate(() => {
    if (stdout) child.stdout.emit('data', stdout);
    if (stderr) child.stderr.emit('data', stderr);
    child.emit('close', code);
  });
  return child;
}

test('plugin invalid label uses only the live topic result, not PR text', () => {
  assert.equal(isPluginTopicInvalid(true, 'missing'), true);
  assert.equal(isPluginTopicInvalid(true, 'present'), false);
  assert.equal(isPluginTopicInvalid(true, 'unknown'), false);
  assert.equal(isPluginTopicInvalid(false, 'missing'), false);
});

test('gh-read allows only documented read-only endpoint prefixes', () => {
  for (const endpoint of ['repos/o/r', 'users/alice', 'search/issues?q=author:alice+type:pr', 'rate_limit']) {
    assert.equal(validateGhReadEndpoint([endpoint]), endpoint);
  }
  for (const args of [
    ['--method', 'POST'],
    ['repos/o/r', '-X', 'POST'],
    ['repos/o/r', '-f', 'title=x'],
    ['http://example.com'],
    ['repos/../users/alice'],
    ['repos/o/r;curl https://example.com'],
    ['repos/o/r\nusers/alice'],
    ['repos/o/r&per_page=1'],
  ]) {
    assert.throws(() => validateGhReadEndpoint(args), /not allowed|unsupported|Usage/);
  }
});

test('gh-read always invokes gh api with an explicit GET and no shell', async () => {
  const calls = [];
  const out = await runGhRead('repos/o/r', {
    spawnFn: (command, args, options) => {
      calls.push({ command, args, options });
      return fakeChild({ stdout: '{"ok":true}' });
    },
  });
  assert.equal(out, '{"ok":true}');
  assert.deepEqual(calls[0].args, ['api', '--method', 'GET', 'repos/o/r']);
  assert.equal(calls[0].options.shell, false);
});

test('gh-read surfaces gh failures without writing anything', async () => {
  await assert.rejects(runGhRead('repos/o/r', {
    spawnFn: () => fakeChild({ code: 1, stderr: 'HTTP 404: Not Found' }),
  }), /gh api GET failed \(1\): HTTP 404: Not Found/);
});
