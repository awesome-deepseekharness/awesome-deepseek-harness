import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { lastCommitDate, loadCatalog, REPO, OFFICIAL, REPO_STARS, STAR_GOAL } from '../src/lib/catalog.mjs';
import { FAQ } from '../src/lib/faq.mjs';

/**
 * Publishes the Astro build into `docs/`, which is what GitHub Pages serves
 * from main. The README-derived sitemap and robots.txt are written here rather
 * than shipped as static files, because their lastmod has to follow the commit
 * date of the README that produced them.
 */

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(ROOT, 'site/dist');
const DOCS = path.join(ROOT, 'docs');
const SITE = 'https://awesome-deepseekharness.github.io/awesome-deepseek-harness';

if (!existsSync(DIST)) {
  console.error('site/dist is missing — run `astro build --root site` first.');
  process.exit(1);
}

rmSync(DOCS, { recursive: true, force: true });
mkdirSync(DOCS, { recursive: true });
cpSync(DIST, DOCS, { recursive: true });

writeFileSync(path.join(DOCS, '.nojekyll'), '');
writeFileSync(
  path.join(DOCS, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`
);

const en = lastCommitDate('README.md');
const zh = lastCommitDate('README.zh.md');
const catalog = loadCatalog();
const alternates = `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/" />\n` +
  `    <xhtml:link rel="alternate" hreflang="zh" href="${SITE}/zh/" />\n` +
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/" />\n`;

writeFileSync(
  path.join(DOCS, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `  <url><loc>${SITE}/</loc><lastmod>${en}</lastmod>\n${alternates}  </url>\n` +
    `  <url><loc>${SITE}/zh/</loc><lastmod>${zh}</lastmod>\n${alternates}  </url>\n` +
    `</urlset>\n`
);

writeFileSync(path.join(DOCS, 'catalog.json'), JSON.stringify({
  schemaVersion: 1,
  name: 'Awesome DeepSeek Harness',
  url: `${SITE}/`,
  repository: REPO,
  officialProject: OFFICIAL,
  languages: ['en', 'zh-CN'],
  sourceUpdated: { en, zh },
  sources: { en: `${REPO}/blob/main/README.md`, zh: `${REPO}/blob/main/README.zh.md` },
  starCountNote: 'Project star counts are README snapshots, not live counts. Verify installation and compatibility in the linked upstream repository.',
  repositoryStars: REPO_STARS,
  firstStarGoal: STAR_GOAL,
  total: catalog.total,
  groups: catalog.groups,
}, null, 2) + '\n');

writeFileSync(path.join(DOCS, 'llms.txt'), `# Awesome DeepSeek Harness (dsh)

> Independent community directory of DeepSeek Harness plugins, tools, skills and learning resources. Not an official DeepSeek product.

The English and Chinese READMEs are the source of the catalog. Project star counts are snapshots, not live data. Check each upstream repository for current installation instructions, licensing and compatibility. DeepSeek Harness is a Developer Preview; APIs can change.

## Directory
- [English website](${SITE}/): Search and browse ${catalog.total} projects across ${catalog.blocks} categories.
- [中文网站](${SITE}/zh/): 中文项目说明与分类。
- [Bilingual catalog JSON](${SITE}/catalog.json): Structured project names, descriptions, categories, repository URLs and snapshot stars.
- [Full bilingual text](${SITE}/llms-full.txt): All catalog entries and common questions in plain text.

## Original sources
- [English README](${REPO}/blob/main/README.md): Canonical English catalog.
- [Chinese README](${REPO}/blob/main/README.zh.md): Canonical Chinese catalog.
- [Contributing](${REPO}/blob/main/CONTRIBUTING.md): Submission criteria and bilingual contribution workflow.
- [贡献指南](${REPO}/blob/main/CONTRIBUTING.zh.md): 中文投稿说明。
- [Official DeepSeek Harness repository](${OFFICIAL}): Upstream product documentation; separate from this community directory.
`);

const plain = (value) => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
const full = ['# Awesome DeepSeek Harness (dsh)',
  `Community directory: ${SITE}/`, `Source repository: ${REPO}`,
  `README last commits: English ${en}; Chinese ${zh}. Star counts are snapshots, not live data.`,
  'This directory is independent of DeepSeek. Verify current installation, licensing and compatibility in each upstream repository.'];
for (const group of catalog.groups) {
  full.push(`\n## ${group.title} / ${group.zhTitle}`);
  for (const item of group.items) {
    full.push(`\n### ${item.name}`, `Repository: ${item.url}`, plain(item.desc), plain(item.zhDesc), `Stars (README snapshot): ${item.stars ?? 'unknown'}`);
  }
}
for (const lang of ['en', 'zh']) {
  full.push(`\n## ${lang === 'en' ? 'Common questions' : '常见问题'}`);
  for (const [question, answer] of FAQ[lang]) full.push(`\n### ${question}`, answer);
}
writeFileSync(path.join(DOCS, 'llms-full.txt'), full.join('\n\n') + '\n');

console.log(JSON.stringify({ published: 'docs/', lastmod: { en, zh } }));
