#!/usr/bin/env node
/**
 * Read-only GitHub API helper for headless agents.
 *
 * The agent shell allowlist can only match command strings with globs, so
 * `gh api --method GET repos/*` still accepts a later `-X POST` override.
 * This wrapper accepts exactly one endpoint, validates it, and always invokes
 * `gh api --method GET` with no way to add method/body flags.
 */
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ALLOWED_PREFIXES = ['repos/', 'users/', 'search/', 'rate_limit'];
// Conservative endpoint alphabet: no whitespace or shell metacharacters.
const ENDPOINT_CHARS = /^[A-Za-z0-9._~:/?#@!%+,=-]+$/;

export function validateEndpoint(args) {
  if (args.length !== 1) {
    throw new Error('Usage: node scripts/gh-read.mjs <endpoint>');
  }
  const endpoint = args[0];
  if (!ALLOWED_PREFIXES.some(prefix => endpoint === prefix.replace(/\/$/, '') || endpoint.startsWith(prefix))) {
    throw new Error(`Endpoint not allowed: ${endpoint}`);
  }
  if (!ENDPOINT_CHARS.test(endpoint) || endpoint.split('/').includes('..')) {
    throw new Error('Endpoint contains unsupported characters or traversal');
  }
  return endpoint;
}

export function runGhRead(endpoint, { gh = 'gh', spawnFn = spawn } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawnFn(gh, ['api', '--method', 'GET', endpoint], {
      stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true, shell: false,
    });
    let out = '', err = '';
    child.stdout.on('data', data => { out += data; });
    child.stderr.on('data', data => { err = (err + data).slice(-4000); });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) resolve(out);
      else reject(new Error(`gh api GET failed (${code}): ${err.trim() || 'no error details'}`));
    });
  });
}

async function main() {
  const endpoint = validateEndpoint(process.argv.slice(2));
  process.stdout.write(await runGhRead(endpoint));
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
