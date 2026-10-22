import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { validateEndpoint, runGhRead } from './gh-read.mjs';

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

test('allows only the documented read-only endpoint prefixes', () => {
  for (const endpoint of ['repos/o/r', 'users/alice', 'search/issues?q=author:alice+type:pr', 'rate_limit']) {
    assert.equal(validateEndpoint([endpoint]), endpoint);
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
    assert.throws(() => validateEndpoint(args), /not allowed|unsupported|Usage/);
  }
});

test('always invokes gh api with an explicit GET and no shell', async () => {
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

test('surfaces gh failures without writing anything', async () => {
  await assert.rejects(runGhRead('repos/o/r', {
    spawnFn: () => fakeChild({ code: 1, stderr: 'HTTP 404: Not Found' }),
  }), /gh api GET failed \(1\): HTTP 404: Not Found/);
});
