import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { lastCommitDate } from '../src/lib/catalog.mjs';

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
const latest = [en, zh].sort().pop();

writeFileSync(
  path.join(DOCS, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>${SITE}/</loc><lastmod>${en}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    `  <url><loc>${SITE}/zh/</loc><lastmod>${zh}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n` +
    `</urlset>\n`
);

console.log(JSON.stringify({ published: 'docs/', lastmod: { en, zh } }));