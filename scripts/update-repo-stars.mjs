import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);
const endpoint = 'https://api.github.com/repos/awesome-deepseekharness/awesome-deepseek-harness';

export function updateMilestone(text, stars, lang) {
  if (!Number.isSafeInteger(stars) || stars < 0) throw new Error('Invalid stargazers_count');
  const pattern = lang === 'en'
    ? /\*\*\d+ → (\d+) stars is our first milestone \(\d+ to go\)\*\*/
    : /\*\*\d+ → (\d+) 颗星是第一里程碑（还差 \d+）\*\*/;
  const matches = [...text.matchAll(new RegExp(pattern, 'g'))];
  if (matches.length !== 1) throw new Error(`Expected one ${lang} milestone`);
  const goal = Number(matches[0][1]);
  if (!Number.isSafeInteger(goal) || goal <= 0) throw new Error('Invalid star goal');
  const remaining = Math.max(0, goal - stars);
  return text.replace(pattern, lang === 'en'
    ? `**${stars} → ${goal} stars is our first milestone (${remaining} to go)**`
    : `**${stars} → ${goal} 颗星是第一里程碑（还差 ${remaining}）**`);
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}; snapshots unchanged`);
  const { stargazers_count: stars } = await response.json();
  // Validate both translations before writing either file.
  const updates = [['README.md', 'en'], ['README.zh.md', 'zh']].map(([file, lang]) => {
    const url = new URL(file, root);
    return [url, updateMilestone(readFileSync(url, 'utf8'), stars, lang)];
  });
  const goals = updates.map(([, text]) => text.match(/\*\*\d+ → (\d+)/)[1]);
  if (goals[0] !== goals[1]) throw new Error('Bilingual star goals differ');
  for (const [url, text] of updates) writeFileSync(url, text);
  console.log(`Repository milestone refreshed: ${stars} stars. Source: ${endpoint}`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
