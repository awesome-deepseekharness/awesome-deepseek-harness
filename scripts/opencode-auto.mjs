import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { discoverFreeModels, runModel, withFreeModel } from './opencode-free.mjs';

export function parseDecision(text) {
  const matches = [...text.matchAll(/^DECISION:\s*(APPROVE|CLOSE|REQUEST_CHANGES)\s*(?:#.*)?$/gm)];
  if (matches.length !== 1 || !text.trimStart().startsWith('DECISION:')) throw new Error('Reviewer must emit exactly one decision first');
  return matches[0][1];
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--list') {
    const models = await discoverFreeModels();
    console.log(JSON.stringify(models.map(model => ({ id: model.fullID, released: model.release_date, context: model.limit?.context })), null, 2));
    return;
  }
  if (args[0] === '--probe') {
    const { model } = await withFreeModel(async model => model, { totalMs: 180000 });
    console.log(`Verified free model: ${model}`);
    return;
  }
  const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
  const promptFile = option('--prompt-file');
  const output = option('--output');
  const agent = option('--agent', 'reviewer');
  if (!promptFile || !output) throw new Error('Usage: node scripts/opencode-auto.mjs --prompt-file FILE --output JSON [--agent reviewer] | --list | --probe');
  const prompt = readFileSync(promptFile, 'utf8');
  const result = await withFreeModel(async (model, timeoutMs) => {
    const text = await runModel(model, prompt, { agent, timeoutMs });
    return { text, decision: agent === 'reviewer' ? parseDecision(text) : undefined };
  }, { totalMs: 360000, attemptMs: 170000 });
  writeFileSync(output, JSON.stringify({ model: result.model, ...result.result }, null, 2) + '\n');
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
