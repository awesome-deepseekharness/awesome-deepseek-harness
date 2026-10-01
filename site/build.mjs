import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

const SITE = 'https://awesome-deepseekharness.github.io/awesome-deepseek-harness';
const BASE = '/awesome-deepseek-harness';
const REPO = 'https://github.com/awesome-deepseekharness/awesome-deepseek-harness';
const REPO_STARS = 17;
const STAR_GOAL = 100;

/* ── Design tokens ─────────────────────────────────────────────────────────
   DeepSeek blue on white. One accent hue (#4d6bfe), hairline borders,
   no gradients on interactive elements, no decorative noise.
   Text colours are picked to clear WCAG AA on their own background:
   --accent-ink 6.1:1 · --accent-strong + white 5.8:1 · --muted 5.3:1.
   ---------------------------------------------------------------------- */
const CSS = `
:root{
  --bg:#ffffff;
  --bg-wash:#f5f7fc;
  --fg:#0d1526;
  --fg-2:#33415a;
  --muted:#5c6b82;
  --border:#e6eaf1;
  --border-2:#d5dce7;
  --accent:#4d6bfe;
  --accent-ink:#3d55d6;
  --accent-strong:#3f56e0;
  --accent-wash:#eef2ff;
  --ring:rgba(77,107,254,.35);
  --wrap:1120px;
  --radius:10px;
  --font:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#0b1020;
    --bg-wash:#111830;
    --fg:#e9edf7;
    --fg-2:#b3bfd4;
    --muted:#8e9cb4;
    --border:#1d2740;
    --border-2:#2b3859;
    --accent:#7b93ff;
    --accent-ink:#9db0ff;
    --accent-strong:#4a66e8;
    --accent-wash:#141c3a;
    --ring:rgba(123,147,255,.45);
  }
  .btn.primary:hover,.chip[aria-pressed="true"]:hover{background:var(--accent);border-color:var(--accent);color:#0b1020}
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
[hidden]{display:none!important}
html{scroll-behavior:smooth;scroll-padding-top:118px}
body{
  background:var(--bg);
  color:var(--fg);
  font-family:var(--font);
  font-size:16px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
a{color:var(--accent-ink);text-decoration:none}
a:hover{text-decoration:underline}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 24px}
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:absolute;left:-9999px;top:0;z-index:60;background:var(--accent-strong);color:#fff;padding:10px 18px}
.skip:focus{left:0}

/* Header */
.site-header{position:sticky;top:0;z-index:30;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid var(--border)}
.hdr{display:flex;align-items:center;gap:14px;height:60px}
.brand{display:flex;align-items:center;gap:9px;color:var(--fg);font-weight:650;letter-spacing:-.01em;white-space:nowrap}
.brand:hover{text-decoration:none}
.mark{display:grid;place-items:center;width:24px;height:24px;border-radius:7px;background:var(--accent);color:#fff;font-size:14px;font-weight:700}
.brand em{font-style:normal;font-weight:500;color:var(--muted)}
.hdr nav{display:flex;align-items:center;gap:6px;margin-left:auto}
.hdr nav a{padding:6px 10px;border-radius:7px;color:var(--fg-2);font-size:14px}
.hdr nav a:hover{color:var(--accent-ink);background:var(--bg-wash);text-decoration:none}
.lang{margin-left:6px;border:1px solid var(--border-2);font-weight:600;color:var(--fg-2)}

/* Hero */
.hero{border-bottom:1px solid var(--border);background:linear-gradient(180deg,var(--accent-wash) 0%,var(--bg) 82%)}
.hero-inner{padding:clamp(44px,7vw,80px) 0 clamp(38px,5vw,56px);max-width:860px}
.hero h1{font-size:clamp(32px,5.2vw,48px);line-height:1.08;letter-spacing:-.028em;font-weight:700}
.hero h1 span{color:var(--accent-ink)}
.tagline{margin-top:12px;font-size:clamp(18px,2.2vw,21px);font-weight:600;letter-spacing:-.01em;color:var(--fg)}
.lede{margin-top:14px;max-width:64ch;font-size:17px;line-height:1.65;color:var(--fg-2)}
.milestone{margin-top:18px;max-width:60ch;font-size:14px;line-height:1.6;color:var(--muted)}
.actions{margin-top:26px;display:flex;flex-wrap:wrap;gap:10px}
.btn{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 18px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--fg);font-family:inherit;font-size:14px;font-weight:600;transition:background-color .15s ease,border-color .15s ease,color .15s ease}
.btn:hover{border-color:var(--accent);color:var(--accent-ink);text-decoration:none}
.btn.primary{background:var(--accent-strong);border-color:var(--accent-strong);color:#fff}
.btn.primary:hover{background:#3146c9;border-color:#3146c9;color:#fff}
.stats{margin-top:34px;padding-top:20px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:12px 40px}
.stat b{display:block;font-size:21px;font-weight:650;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.stat b.sm{font-size:16px;font-weight:600;letter-spacing:0}
.stat span{font-size:13px;color:var(--muted)}

/* Toolbar */
.toolbar{position:sticky;top:60px;z-index:20;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid var(--border)}
.toolbar-inner{display:grid;grid-template-columns:minmax(200px,340px) auto;grid-template-rows:auto auto;align-items:center;gap:12px 18px;padding:12px 0}
.search{position:relative;grid-column:1;grid-row:1}
.search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}
.search input{width:100%;height:38px;padding:0 34px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--fg);font-family:inherit;font-size:14px}
.search input::placeholder{color:var(--muted)}
.search input:focus{outline:2px solid var(--ring);outline-offset:1px;border-color:var(--accent)}
.search button{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:26px;height:26px;border:0;border-radius:6px;background:none;color:var(--muted);font-size:15px;line-height:1;cursor:pointer}
.search button:hover{background:var(--bg-wash);color:var(--fg)}
.chips{grid-column:1 / -1;grid-row:2;display:flex;flex-wrap:wrap;gap:6px}
.chip{height:30px;padding:0 12px;border:1px solid var(--border);border-radius:999px;background:var(--bg);color:var(--fg-2);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:background-color .15s ease,border-color .15s ease,color .15s ease}
.chip:hover{border-color:var(--accent);color:var(--accent-ink)}
.chip[aria-pressed="true"]{background:var(--accent-strong);border-color:var(--accent-strong);color:#fff}
.count{grid-column:2;grid-row:1;justify-self:end;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.submit{margin:0;padding:22px 0 0;font-size:14px;line-height:2.1;color:var(--muted)}
.submit code{font-family:var(--mono);font-size:12.5px;padding:2px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg-wash);color:var(--fg-2)}

/* Sections */
.section{padding:42px 0;border-bottom:1px solid var(--border)}
.section-head{display:flex;align-items:baseline;gap:12px;margin-bottom:18px;flex-wrap:wrap}
.section-head .idx{font-family:var(--mono);font-size:12px;letter-spacing:.08em;color:var(--accent-ink)}
.section-head h2{font-size:22px;font-weight:650;letter-spacing:-.018em}
.section-head .meta{margin-left:auto;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.prose{max-width:70ch;color:var(--fg-2);line-height:1.7}
.prose strong{color:var(--fg)}
.prose a{text-decoration:underline;text-underline-offset:2px}

.grid{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(360px,100%),1fr));gap:12px}
.card{display:flex;flex-direction:column;gap:8px;min-width:0;height:100%;padding:16px 18px;border:1px solid var(--border);border-radius:var(--radius);color:var(--fg);transition:border-color .15s ease,background-color .15s ease,transform .15s ease}
.card:hover{border-color:var(--accent);background:var(--accent-wash);transform:translateY(-1px);text-decoration:none}
.card-top{display:flex;align-items:center;gap:10px}
.item-name{font-size:15.5px;font-weight:620;letter-spacing:-.01em;overflow-wrap:anywhere}
.card:hover .item-name{color:var(--accent-ink)}
.stars{margin-left:auto;flex:none;display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--bg-wash);font-size:12.5px;color:var(--fg-2);font-variant-numeric:tabular-nums}
.stars .star{color:var(--accent)}
.item-desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;font-size:14px;line-height:1.6;color:var(--fg-2)}

table{width:100%;margin-top:20px;border-collapse:collapse;font-size:14.5px}
th,td{text-align:left;padding:12px 14px;border-bottom:1px solid var(--border);vertical-align:top;line-height:1.55}
thead th{font-size:12.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--border-2)}
tbody tr:hover{background:var(--bg-wash)}
td:first-child{font-weight:600;color:var(--fg);white-space:nowrap}
.note{margin-top:20px;padding:13px 16px;border:1px solid var(--accent);border-left-width:3px;border-radius:8px;background:var(--accent-wash);font-size:14px;line-height:1.6;color:var(--fg-2)}
.note strong{color:var(--fg)}

.growth-lede{max-width:64ch;color:var(--fg-2)}
.share{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.share a{padding:6px 13px;border:1px solid var(--border-2);border-radius:999px;color:var(--fg-2);font-size:13px}
.share a:hover{border-color:var(--accent);color:var(--accent-ink);text-decoration:none}

.site-footer{padding:34px 0 44px;color:var(--muted);font-size:13px}
.footer-inner{display:flex;flex-wrap:wrap;gap:10px 22px;align-items:center}
.footer-inner a{color:var(--fg-2)}
.footer-inner .sep{color:var(--border-2)}
.site-footer p{margin-top:8px}

@media (max-width:860px){
  .wrap{padding:0 18px}
  .hdr nav a:not(.lang){display:none}
  .grid{grid-template-columns:1fr}
  .toolbar-inner{grid-template-columns:1fr auto}
  html{scroll-padding-top:130px}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *{transition:none!important}
}
@media print{
  .site-header,.toolbar,.actions,.share{display:none}
}
`;

const SCRIPT = `
(function(){
  var items = [].slice.call(document.querySelectorAll('.grid > li'));
  var blocks = [].slice.call(document.querySelectorAll('[data-section]'));
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var input = document.getElementById('q');
  var clear = document.getElementById('clear-search');
  var out = document.getElementById('result-count');
  var total = items.length;
  var cat = 'all';

  function apply(){
    var term = input.value.trim().toLowerCase();
    var shown = 0;
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var okCat = cat === 'all' || el.getAttribute('data-cat') === cat;
      var hay = el.getAttribute('data-hay') || '';
      var ok = okCat && (term === '' || hay.indexOf(term) !== -1);
      el.hidden = !ok;
      if (ok) shown++;
    }
    for (var j = 0; j < blocks.length; j++) {
      blocks[j].hidden = !blocks[j].querySelector('.grid > li:not([hidden])');
    }
    clear.hidden = term === '';
    out.textContent = shown + ' / ' + total + ' ' + out.getAttribute('data-unit');
    for (var k = 0; k < chips.length; k++) {
      chips[k].setAttribute('aria-pressed', chips[k].getAttribute('data-cat') === cat ? 'true' : 'false');
    }
  }

  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener('click', function () {
      cat = cat === this.getAttribute('data-cat') ? 'all' : this.getAttribute('data-cat');
      apply();
    });
  }
  input.addEventListener('input', apply);
  clear.addEventListener('click', function () { input.value = ''; apply(); input.focus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); }
    if (e.key === 'Escape' && document.activeElement === input && input.value !== '') { input.value = ''; apply(); }
  });
})();
`;

const T = {
  en: {
    lang: 'en',
    ogLocale: 'en_US',
    otherHref: `${BASE}/zh/`,
    otherLabel: '中文',
    navPlugins: 'Plugins',
    navAbout: 'What is dsh?',
    navGrowth: 'Growth',
    searchLabel: 'Search plugins',
    searchPlaceholder: 'Search plugins…',
    clearLabel: 'Clear search',
    all: 'All',
    unitProjects: 'projects',
    unitCategories: 'categories',
    statProjects: 'Curated projects',
    statCategories: 'Categories',
    statStars: 'GitHub stars',
    statUpdated: 'List updated',
    aboutTitle: 'What is dsh?',
    submit: 'Built something for dsh? Tag your repo with the <code>dsh-plugin</code> topic, then <a href="{repo}/blob/main/CONTRIBUTING.md">open a PR</a>.',
    modeCol: 'Mode',
    modeDescCol: 'What it is',
    growthTitle: 'Growth &amp; community',
    growthLede: 'This list is free and community-run. A star is the only thing GitHub uses to rank starred lists higher, so it is the single most useful thing you can do for every plugin author here.',
    shareTitle: 'Share this list',
    footerNote: 'Star counts as of {date}. Generated from README.md.',
  },
  zh: {
    lang: 'zh-CN',
    ogLocale: 'zh_CN',
    otherHref: `${BASE}/`,
    otherLabel: 'English',
    navPlugins: '插件',
    navAbout: '什么是 dsh',
    navGrowth: '增长',
    searchLabel: '搜索插件',
    searchPlaceholder: '搜索插件…',
    clearLabel: '清空搜索',
    all: '全部',
    unitProjects: '个项目',
    unitCategories: '个分类',
    statProjects: '收录项目',
    statCategories: '分类数',
    statStars: 'GitHub 星标',
    statUpdated: '列表更新于',
    aboutTitle: '什么是 dsh',
    submit: '为 dsh 做了东西？给你的仓库打上 <code>dsh-plugin</code> topic，然后<a href="{repo}/blob/main/CONTRIBUTING.md">提一个 PR</a>。',
    modeCol: '模式',
    modeDescCol: '说明',
    growthTitle: '增长与社区',
    growthLede: '这个列表免费且由社区维护。GitHub 会把被 Star 的列表排得更靠前，所以一颗 Star 是这里所有插件作者最需要的支持。',
    shareTitle: '分享这个列表',
    footerNote: '星标数截止 {date}。本页由 README.zh.md 生成。',
  },
};

const MODES = {
  en: [
    ['Standard', 'Full coding agent: file editing, shell, file &amp; web search, skills, planning, goals, subagents, workflows'],
    ['Code', 'All of Standard, plus tools exposed through the Code Mode SDK so one TypeScript program can chain multi-step operations'],
    ['Minimal', 'Two-tool coding agent (persistent bash + str_replace_editor) for benchmarking models'],
    ['Creator', 'Runtime inspection, in-memory plugin experiments, composing new modes — for authoring custom agent presets'],
  ],
  zh: [
    ['Standard', '完整编码 agent：文件编辑、shell、文件与网页搜索、skills、规划、目标、子代理、工作流'],
    ['Code', 'Standard 的全部能力，再加上 Code Mode SDK——把多步操作组合进一段 TypeScript 程序'],
    ['Minimal', '双工具编码 agent（常驻 bash + str_replace_editor），用于模型基准评测'],
    ['Creator', '运行时检查、内存内插件实验、组合新模式，用于编写自定义 agent 预设'],
  ],
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripEmoji(s) {
  return s.replace(/^[\p{Extended_Pictographic}\p{Emoji_Component}\u200d\ufe0f\s]+/u, '').trim();
}

function lastCommitDate(rel) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', rel], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* not a git checkout (e.g. shallow export) — fall back to today */
  }
  return new Date().toISOString().slice(0, 10);
}

function parseSections(md) {
  const sections = [];
  let cur = null;
  let pending = null;
  let gotHeader = false;
  const isHeaderRow = (cells) =>
    cells.some((c) => /^(项目|Project|说明|Description|Mode|模式|Star|Stars|--+)$/i.test(c)) ||
    cells.every((c) => !c.includes('['));
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2 || h3) {
      cur = null;
      pending = { title: stripEmoji((h2 || h3)[1]), items: [] };
      gotHeader = false;
      continue;
    }
    if (line.startsWith('| ')) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (!cur && pending && !gotHeader && isHeaderRow(cells)) {
        gotHeader = true;
        continue;
      }
      if (!cur && pending) {
        cur = pending;
        sections.push(cur);
        pending = null;
        gotHeader = true;
      }
      if (cur) {
        const link = (cells[0] || '').match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (link && cells[1]) {
          cur.items.push({ name: link[1], url: link[2], desc: cells[1], stars: cells[2] || '' });
        }
      }
    }
  }
  return sections.filter((s) => s.items.length > 0);
}

function renderItem(it, catIndex) {
  const raw = it.stars.trim();
  const stars = /^\d+$/.test(raw)
    ? `<span class="stars"><span class="star">★</span>${escapeHtml(raw)}</span>`
    : '';
  const hay = escapeHtml(`${it.name} ${it.desc}`.toLowerCase());
  return `<li data-cat="${catIndex}" data-hay="${hay}"><a class="card" href="${it.url}" target="_blank" rel="noopener">`
    + `<span class="card-top"><span class="item-name">${escapeHtml(it.name)}</span>${stars}</span>`
    + `<span class="item-desc">${escapeHtml(it.desc)}</span></a></li>`;
}

function renderPage({ lang, title, desc, keywords, canonical, heroTitle, tagline, about, aboutLong, sections, updated }) {
  const t = T[lang];
  const otherUrl = lang === 'en' ? `${SITE}/zh/` : `${SITE}/`;
  const total = sections.reduce((a, s) => a + s.items.length, 0);
  const toGoal = Math.max(STAR_GOAL - REPO_STARS, 0);
  const milestone = lang === 'en'
    ? `First milestone is ${STAR_GOAL} stars — ${toGoal} to go. Early stargazers help decide what gets curated next.`
    : `第一个里程碑是 ${STAR_GOAL} 颗星，还差 ${toGoal} 颗。早期星标会影响后续收录与推荐。`;
  const shareText = lang === 'en'
    ? 'Awesome DeepSeek Harness — Everything is a Plugin ⚡'
    : 'Awesome DeepSeek Harness — 万物皆可插件 ⚡';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Awesome DeepSeek Harness',
      alternateName: 'Awesome dsh',
      url: canonical,
      description: desc,
      inLanguage: [lang, lang === 'en' ? 'zh' : 'en'],
      publisher: { '@type': 'Organization', name: 'awesome-deepseekharness', url: 'https://github.com/awesome-deepseekharness' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'DeepSeek Harness Plugins',
      itemListElement: sections
        .flatMap((s) => s.items)
        .map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url })),
    },
  ];

  const modeTable = MODES[lang]
    .map((m) => `<tr><td>${m[0]}</td><td>${m[1]}</td></tr>`)
    .join('');

  const sectionBlocks = sections.map((s, i) => `<section class="section" id="cat-${i}" data-section>
    <div class="wrap">
      <div class="section-head">
        <span class="idx">${String(i + 1).padStart(2, '0')}</span>
        <h2>${escapeHtml(s.title)}</h2>
        <span class="meta">${s.items.length} ${t.unitProjects}</span>
      </div>
      <ul class="grid">
${s.items.map((it) => renderItem(it, String(i))).join('\n')}
      </ul>
    </div>
  </section>`).join('\n');

  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<meta name="keywords" content="${escapeHtml(keywords)}">
<meta name="author" content="awesome-deepseekharness">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b1020" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="zh" href="${SITE}/zh/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐋</text></svg>')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Awesome DeepSeek Harness">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${t.ogLocale}">
<meta property="og:locale:alternate" content="${lang === 'en' ? 'zh_CN' : 'en_US'}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#main">${lang === 'en' ? 'Skip to content' : '跳到主要内容'}</a>
<header class="site-header">
  <div class="wrap hdr">
    <a class="brand" href="${BASE}/"><span class="mark" aria-hidden="true">d</span>Awesome <em>DeepSeek Harness</em></a>
    <nav aria-label="${lang === 'en' ? 'Primary' : '主导航'}">
      <a href="#cat-0">${t.navPlugins}</a>
      <a href="#about">${t.navAbout}</a>
      <a href="#growth">${t.navGrowth}</a>
      <a class="lang" href="${t.otherHref}" lang="${lang === 'en' ? 'zh' : 'en'}" hreflang="${lang === 'en' ? 'zh' : 'en'}">${t.otherLabel}</a>
    </nav>
  </div>
</header>
<main id="main">
<div class="hero">
  <div class="wrap hero-inner">
    <h1>Awesome <span>${heroTitle}</span></h1>
    <p class="tagline">${tagline}</p>
    <p class="lede">${about}</p>
    <p class="milestone">${milestone}</p>
    <div class="actions">
      <a class="btn primary" href="${REPO}" target="_blank" rel="noopener">★ ${lang === 'en' ? 'Star on GitHub' : '在 GitHub 上点 Star'}</a>
      <a class="btn" href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noopener">${lang === 'en' ? 'DeepSeek Harness' : 'DeepSeek Harness 官方仓库'}</a>
      <a class="btn" href="https://github.com/awesome-deepseekharness/deepseek-official-tracker" target="_blank" rel="noopener">${lang === 'en' ? 'Official Tracker' : '官方动态追踪'}</a>
    </div>
    <dl class="stats">
      <div class="stat"><dt class="visually-hidden">${t.statProjects}</dt><dd><b>${total}</b><span>${t.statProjects}</span></dd></div>
      <div class="stat"><dt class="visually-hidden">${t.statCategories}</dt><dd><b>${sections.length}</b><span>${t.statCategories}</span></dd></div>
      <div class="stat"><dt class="visually-hidden">${t.statStars}</dt><dd><b>★ ${REPO_STARS}</b><span>${t.statStars}</span></dd></div>
      <div class="stat"><dt class="visually-hidden">${t.statUpdated}</dt><dd><b class="sm">${updated}</b><span>${t.statUpdated}</span></dd></div>
    </dl>
  </div>
</div>
<div class="toolbar">
  <div class="wrap toolbar-inner">
    <div class="search">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.5"></circle><path d="M10.5 10.5 14 14"></path></svg>
      <label class="visually-hidden" for="q">${t.searchLabel}</label>
      <input id="q" type="search" placeholder="${t.searchPlaceholder}" autocomplete="off" spellcheck="false">
      <button id="clear-search" type="button" aria-label="${t.clearLabel}" hidden>×</button>
    </div>
    <div class="chips" role="group" aria-label="${lang === 'en' ? 'Filter by category' : '按分类筛选'}">
      <button class="chip" type="button" data-cat="all" aria-pressed="true">${t.all}</button>
${sections.map((s, i) => `      <button class="chip" type="button" data-cat="${i}" aria-pressed="false">${escapeHtml(s.title)}</button>`).join('\n')}
    </div>
    <p class="count" id="result-count" role="status" data-unit="${t.unitProjects}">${total} / ${total} ${t.unitProjects}</p>
  </div>
</div>
<div id="plugins">
  <div class="wrap">
    <p class="submit">${t.submit.replace('{repo}', REPO)}</p>
  </div>
${sectionBlocks}
</div>
<section class="section" id="about">
  <div class="wrap">
    <div class="section-head"><h2>${t.aboutTitle}</h2></div>
    <p class="prose">${aboutLong}</p>
    <table>
      <thead><tr><th>${t.modeCol}</th><th>${t.modeDescCol}</th></tr></thead>
      <tbody>${modeTable}</tbody>
    </table>
    <p class="note"><strong>⚠ ${lang === 'en' ? 'Developer Preview.' : '开发者预览版。'}</strong> ${lang === 'en' ? 'The official release warns that compatibility-breaking changes are coming — APIs and plugin contracts may change.' : '官方警告将有破坏性的兼容变更：API 与插件契约都可能改动。'}</p>
  </div>
</section>
<section class="section" id="growth">
  <div class="wrap">
    <div class="section-head"><h2>${t.growthTitle}</h2></div>
    <p class="growth-lede">${t.growthLede}</p>
    <div class="actions">
      <a class="btn primary" href="${REPO}" target="_blank" rel="noopener">★ ${lang === 'en' ? 'Star this list' : '给这个列表点 Star'}</a>
      <a class="btn" href="https://discord.gg/Ycq5dCaS4" target="_blank" rel="noopener">Discord</a>
      <a class="btn" href="https://github.com/deepseek-ai/deepseek-harness/discussions" target="_blank" rel="noopener">${lang === 'en' ? 'Discussions' : '讨论区'}</a>
    </div>
    <p class="share"><span>${t.shareTitle}</span>
      <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&amp;url=${encodeURIComponent(REPO)}&amp;hashtags=dsh,deepseek" target="_blank" rel="noopener">X</a>
      <a href="https://www.reddit.com/submit?url=${encodeURIComponent(REPO)}&amp;title=${encodeURIComponent(shareText)}" target="_blank" rel="noopener">Reddit</a>
      <a href="https://github.com/topics/dsh-plugin" target="_blank" rel="noopener">dsh-plugin</a>
      <a href="${REPO}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">${lang === 'en' ? 'Contributing' : '贡献指南'}</a>
    </p>
  </div>
</section>
</main>
<footer class="site-footer">
  <div class="wrap footer-inner">
    <span>${t.footerNote.replace('{date}', updated)}</span>
    <span class="sep">·</span>
    <a href="${REPO}" target="_blank" rel="noopener">github.com/awesome-deepseekharness/awesome-deepseek-harness</a>
    <span class="sep">·</span>
    <a href="${otherUrl}" hreflang="${lang === 'en' ? 'zh' : 'en'}" lang="${lang === 'en' ? 'zh' : 'en'}">${t.otherLabel}</a>
  </div>
</footer>
<script>${SCRIPT}</script>
</body>
</html>
`;
}

function build() {
  const enMd = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const zhMd = fs.readFileSync(path.join(ROOT, 'README.zh.md'), 'utf8');
  const enSections = parseSections(enMd);
  const zhSections = parseSections(zhMd);
  const enDate = lastCommitDate('README.md');
  const zhDate = lastCommitDate('README.zh.md');

  const enHtml = renderPage({
    lang: 'en',
    title: 'Awesome DeepSeek Harness — Everything is a Plugin | Curated dsh Plugins, Tools & Skills',
    desc: 'A curated collection of the best plugins, tools, skills, and resources for DeepSeek Harness (dsh) — the open-source plugin-first agent harness from DeepSeek AI, powered by Cordis.',
    keywords: 'DeepSeek Harness, dsh, DeepSeek, plugin, Cordis, AI agent, awesome list, coding agent, MCP, agent harness, dsh-plugin',
    canonical: `${SITE}/`,
    heroTitle: 'DeepSeek Harness',
    tagline: 'Everything is a Plugin.',
    about: 'A curated index of the plugins, tools, skills and resources the community has built on DeepSeek Harness (dsh) — DeepSeek AI’s open-source agent harness.',
    aboutLong: 'DeepSeek Harness (dsh) is DeepSeek AI’s open-source agent harness. Its core philosophy is <strong>everything is a plugin</strong>: the model adapter, tool registry, session log, permission model and even the agent loop itself are replaceable plugins — “no privileged core to patch”. The runtime is built on <a href="https://github.com/cordiverse/cordis" target="_blank" rel="noopener">Cordis</a>, a meta-framework of spatiotemporal composability.',
    sections: enSections,
    updated: enDate,
  });

  const zhHtml = renderPage({
    lang: 'zh',
    title: 'Awesome DeepSeek Harness — 万物皆可插件 | dsh 插件、工具与技能精选',
    desc: '面向 DeepSeek Harness (dsh) 生态的精选项目合集——插件、工具、技能与资源。dsh 是 DeepSeek AI 开源的 agent harness，基于 Cordis 构建，核心哲学是「万物皆可插件」。',
    keywords: 'DeepSeek Harness, dsh, DeepSeek, 插件, Cordis, AI agent, 精选列表, 编码智能体, agent harness, dsh-plugin',
    canonical: `${SITE}/zh/`,
    heroTitle: 'DeepSeek Harness',
    tagline: '万物皆可插件。',
    about: '面向 dsh 生态的精选索引——社区在 DeepSeek Harness 之上造出来的插件、工具、技能与资源。',
    aboutLong: 'DeepSeek Harness (dsh) 是 DeepSeek AI 开源的 agent harness，核心哲学是<strong>万物皆可插件</strong>：模型适配器、工具注册表、会话日志、权限模型，甚至 agent loop 本身都是可替换的插件——没有需要打补丁的特权内核。运行时基于 <a href="https://github.com/cordiverse/cordis" target="_blank" rel="noopener">Cordis</a>（时空可组合的元框架）构建。',
    sections: zhSections,
    updated: zhDate,
  });

  fs.mkdirSync(path.join(DOCS, 'zh'), { recursive: true });
  fs.writeFileSync(path.join(DOCS, 'index.html'), enHtml);
  fs.writeFileSync(path.join(DOCS, 'zh', 'index.html'), zhHtml);
  fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');
  fs.writeFileSync(path.join(DOCS, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  const latest = [enDate, zhDate].sort().pop();
  fs.writeFileSync(path.join(DOCS, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>${SITE}/</loc><lastmod>${latest}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    `  <url><loc>${SITE}/zh/</loc><lastmod>${latest}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n` +
    `</urlset>\n`);

  console.log(JSON.stringify({
    enSections: enSections.length,
    zhSections: zhSections.length,
    enItems: enSections.reduce((a, s) => a + s.items.length, 0),
    zhItems: zhSections.reduce((a, s) => a + s.items.length, 0),
    updated: { en: enDate, zh: zhDate },
  }));
}

build();