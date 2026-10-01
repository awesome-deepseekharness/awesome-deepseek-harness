import { readFileSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/**
 * The READMEs are the only source of truth for site content. Every table row
 * under a `##` / `###` heading becomes one pad in the catalog.
 */

/**
 * Astro bundles this module, so its own `import.meta.dirname` points into
 * site/dist during prerendering. The repo root is found by walking up from the
 * build's working directory until both READMEs and the Astro config are there.
 */
function findRoot() {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (
      existsSync(path.join(dir, 'README.md')) &&
      existsSync(path.join(dir, 'README.zh.md')) &&
      existsSync(path.join(dir, 'astro.config.mjs'))
    ) {
      return dir;
    }
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  throw new Error(`could not locate the repo root from ${process.cwd()}`);
}

const ROOT = findRoot();

/**
 * Designators are stable across languages: they are locators, not labels, so a
 * pad is `MKT.03` in both the English and the Chinese catalog. Keyed by the
 * English heading; the Chinese headings are matched by position because the two
 * READMEs are edited by hand and must not be allowed to renumber the die.
 */
export const BLOCKS = [
  { id: 'MKT', en: 'Marketplaces & Discovery', zh: '插件市场与发现' },
  { id: 'VIS', en: 'Vision', zh: '视觉插件' },
  { id: 'WEB', en: 'Web & Browser', zh: 'Web 与浏览器' },
  { id: 'MEM', en: 'Memory', zh: '记忆插件' },
  { id: 'UI', en: 'Web UI, Skins & Desktop Pets', zh: 'Web UI、皮肤与桌面宠物' },
  { id: 'TUI', en: 'TUI & Desktop', zh: 'TUI 与桌面端' },
  { id: 'TLS', en: 'Tools, Workflows & Presets', zh: '工具、工作流与预设' },
  { id: 'SKL', en: 'Skills', zh: 'Skills 与技能包' },
  { id: 'APP', en: 'Apps & Runtimes Built on DSH', zh: '集成 DSH 的应用与运行时' },
  { id: 'INF', en: 'Core Infrastructure', zh: '核心基础设施' },
  { id: 'LRN', en: 'Learning & Guides', zh: '学习资源' },
];

const HEADER_CELL = /^(项目|Project|说明|Description|Mode|模式|Star|Stars|--+)$/i;
const isHeaderRow = (cells) =>
  cells.some((c) => HEADER_CELL.test(c)) || cells.every((c) => !c.includes('['));
const stripEmoji = (s) => s.replace(/^[\p{Extended_Pictographic}\p{Emoji_Component}\u200d\ufe0f\s]+/u, '').trim();

export function parseSections(md) {
  const sections = [];
  let cur = null;
  let pending = null;
  let gotHeader = false;
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{2,3})\s+(.+)$/);
    if (h) {
      cur = null;
      pending = { title: stripEmoji(h[2]) };
      gotHeader = false;
      continue;
    }
    if (!line.startsWith('| ')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (!cur && pending && !gotHeader && isHeaderRow(cells)) {
      gotHeader = true;
      continue;
    }
    if (!cur && pending) {
      cur = { title: pending.title, items: [] };
      sections.push(cur);
      pending = null;
      gotHeader = true;
    }
    if (!cur) continue;
    const link = (cells[0] || '').match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (link && cells[1]) {
      cur.items.push({ name: link[1], url: link[2], desc: cells[1], stars: (cells[2] || '').trim() });
    }
  }
  return sections.filter((s) => s.items.length > 0);
}

/** Stars as written in the README are a snapshot; keep them verbatim. */
export const stars = (raw) => (/^\d+$/.test(raw || '') ? Number(raw) : null);

export function loadCatalog() {
  const en = parseSections(readFileSync(path.join(ROOT, 'README.md'), 'utf8'));
  const zh = parseSections(readFileSync(path.join(ROOT, 'README.zh.md'), 'utf8'));

  const total = en.reduce((a, s) => a + s.items.length, 0);

  const groups = BLOCKS.map((b, i) => {
    const enSec = en[i];
    const zhSec = zh[i];
    if (!enSec || !zhSec) throw new Error(`block ${b.id} is missing a section (en:${!!enSec} zh:${!!zhSec})`);
    const items = enSec.items.map((it, j) => ({
      ...it,
      stars: stars(it.stars),
      zhName: zhSec.items[j]?.name ?? it.name,
      zhDesc: zhSec.items[j]?.desc ?? it.desc,
    }));
    return {
      id: b.id,
      title: enSec.title,
      zhTitle: zhSec.title,
      items,
      count: items.length,
      // `U` is the usual instance prefix for a functional block on a die.
      prefix: `U${i + 1}`,
    };
  });

  return {
    groups,
    total,
    blocks: groups.length,
    updated: lastCommitDate('README.md'),
    updatedZh: lastCommitDate('README.zh.md'),
    readmeBytes: statSync(path.join(ROOT, 'README.md')).size,
  };
}

export function lastCommitDate(rel) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', rel], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* not a git checkout — fall back to today */
  }
  return new Date().toISOString().slice(0, 10);
}

export const SITE = 'https://awesome-deepseekharness.github.io/awesome-deepseek-harness';
/** Absolute URL for a site-relative path, independent of Astro.site. */
export const abs = (p) => new URL(p, `${SITE}/`).href;

export const REPO = 'https://github.com/awesome-deepseekharness/awesome-deepseek-harness';
export const OFFICIAL = 'https://github.com/deepseek-ai/deepseek-harness';
export const TRACKER = 'https://github.com/awesome-deepseekharness/deepseek-official-tracker';
export const REPO_STARS = 17;
export const STAR_GOAL = 100;