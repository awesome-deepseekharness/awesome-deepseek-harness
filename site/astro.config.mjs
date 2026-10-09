import { defineConfig } from 'astro/config';

/**
 * Astro 7 dropped `--root`/`--config` from the CLI, so this file has to live
 * next to `src/` or it is never read — and an unread config silently means no
 * `base`, which means every asset URL is emitted root-absolute and 404s under
 * GitHub Pages. npm scripts pass `--root site`.
 */
export default defineConfig({
  outDir: './dist',
  trailingSlash: 'always',
  site: 'https://awesome-deepseekharness.github.io/awesome-deepseek-harness',
  base: '/awesome-deepseek-harness',
  build: { assets: 'assets', inlineStylesheets: 'auto' },
  compressHTML: true,
});