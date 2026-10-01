import { defineConfig } from 'astro/config';

/**
 * The site lives in `site/` so the repo root stays readable; the rendered
 * output is published by site/scripts/publish.mjs into `docs/`, which is what
 * GitHub Pages serves from main.
 */
export default defineConfig({
  root: './site',
  outDir: './dist',
  trailingSlash: 'always',
  site: 'https://awesome-deepseekharness.github.io/awesome-deepseek-harness',
  base: '/awesome-deepseek-harness',
  build: { assets: 'assets', inlineStylesheets: 'auto' },
  compressHTML: true,
});