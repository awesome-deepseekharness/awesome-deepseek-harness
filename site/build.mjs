import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

const SITE = 'https://awesome-deepseekharness.github.io/awesome-deepseek-harness';
const BASE = '/awesome-deepseek-harness';

const CSS = `
:root{--bg:#0d1117;--card:#161b22;--border:#30363d;--fg:#e6edf3;--muted:#8b949e;--accent:#4d9fff;--orange:#ff7a45}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;line-height:1.6}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:1100px;margin:0 auto;padding:0 20px}
header{position:sticky;top:0;background:rgba(13,17,23,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);z-index:10}
.nav{display:flex;align-items:center;justify-content:space-between;height:56px}
.nav .logo{font-weight:700;font-size:17px;color:var(--fg)}
.nav .logo span{color:var(--orange)}
.nav .lang a{margin-left:12px;font-size:14px}
.hero{padding:56px 0 40px;text-align:center;border-bottom:1px solid var(--border)}
.hero h1{font-size:40px;letter-spacing:-.5px}
.hero .tagline{color:var(--orange);font-weight:600;margin:8px 0 14px}
.hero p{color:var(--muted);max-width:760px;margin:0 auto}
.hero .links{margin-top:18px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{display:inline-block;padding:8px 18px;border-radius:8px;background:var(--card);border:1px solid var(--border);color:var(--fg);font-size:14px}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
section{padding:36px 0;border-bottom:1px solid var(--border)}
h2{font-size:24px;margin-bottom:6px}
.sub{color:var(--muted);margin-bottom:18px;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
.card{display:block;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;color:var(--fg);transition:border-color .15s}
.card:hover{border-color:var(--accent);text-decoration:none}
.card h3{font-size:15px;margin-bottom:6px;word-break:break-all}
.card p{font-size:13px;color:var(--muted);margin-bottom:8px}
.card .stars{font-size:12px;color:var(--orange)}
table{width:100%;border-collapse:collapse;margin-top:10px}
th,td{text-align:left;padding:10px 12px;border:1px solid var(--border);font-size:14px;vertical-align:top}
th{background:var(--card)}
.warn{background:rgba(255,122,69,.1);border:1px solid var(--orange);border-radius:8px;padding:12px 16px;font-size:14px;margin-top:14px}
.cta{background:linear-gradient(135deg,rgba(77,159,255,.12),rgba(255,122,69,.12));border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin:20px auto;max-width:760px;text-align:center}
.cta strong{color:var(--fg)}
.cta .share{margin-top:10px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.cta .share a{font-size:13px;padding:6px 12px;border-radius:20px;background:var(--card);border:1px solid var(--border);color:var(--fg)}
.cta .share a:hover{border-color:var(--accent);text-decoration:none}
.starbar{position:sticky;top:56px;z-index:9;background:rgba(255,122,69,.08);border-bottom:1px solid rgba(255,122,69,.2);text-align:center;padding:8px 12px;font-size:13px}
.starbar a{color:var(--orange);font-weight:600}
footer{padding:28px 0;color:var(--muted);font-size:13px;text-align:center}
@media(max-width:640px){.hero h1{font-size:30px}.grid{grid-template-columns:1fr}}
`;

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseSections(md) {
  const sections = [];
  let cur = null;
  let pending = null;
  let gotHeader = false;
  const isHeaderRow = (cells) =>
    cells.some((c) => /^(项目|Project|说明|Description|Mode|模式|--+)$/.test(c)) || cells.every((c) => !c.includes('['));
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2 || h3) {
      cur = null;
      pending = { title: (h2 || h3)[1].trim(), level: h2 ? 2 : 3, items: [] };
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
      continue;
    }
  }
  return sections.filter((s) => s.items.length > 0);
}

function renderCards(items) {
  return items.map((it) =>
    `<a class="card" href="${it.url}" target="_blank" rel="noopener"><h3>${escapeHtml(it.name)}</h3><p>${escapeHtml(it.desc)}</p><span class="stars">${escapeHtml(it.stars) || '&nbsp;'}</span></a>`
  ).join('\n');
}

function renderPage({ lang, dir, title, desc, keywords, canonical, altUrl, ogLocale, heroTitle, tagline, about, sections, modeTable, footerNote }) {
  const itemList = sections.flatMap((s) => s.items.map((it) => ({ '@type': 'ListItem', position: 1, name: it.name, url: it.url })));
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
      itemListElement: itemList.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url })),
    },
  ];
  const zhLabel = lang === 'en' ? '中文' : 'English';
  const zhHref = lang === 'en' ? `${BASE}/zh/` : `${BASE}/`;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="awesome-deepseekharness">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0d1117">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="zh" href="${SITE}/zh/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐋</text></svg>')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Awesome DeepSeek Harness">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${ogLocale}">
<meta property="og:locale:alternate" content="${lang === 'en' ? 'zh_CN' : 'en_US'}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container nav">
    <a class="logo" href="${BASE}/">Awesome <span>DeepSeek Harness</span></a>
    <nav class="lang"><a href="${zhHref}">${zhLabel}</a></nav>
  </div>
</header>
<main>
<div class="hero">
  <div class="container">
    <h1>${heroTitle}</h1>
    <div class="tagline">${tagline}</div>
    <p>${about}</p>
    <div class="links">
      <a class="btn primary" href="https://github.com/awesome-deepseekharness/awesome-deepseek-harness" target="_blank" rel="noopener">⭐ Star on GitHub</a>
      <a class="btn" href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noopener">DeepSeek Harness</a>
      <a class="btn" href="https://deepseek.com/harness" target="_blank" rel="noopener">deepseek.com/harness</a>
      <a class="btn" href="https://github.com/awesome-deepseekharness/deepseek-official-tracker" target="_blank" rel="noopener">Official Tracker</a>
    </div>
    <div class="cta">
      <div><strong>${lang === 'en' ? '⭐ Found this useful? Star it — 2 seconds, and it helps 1000+ dsh developers discover plugins.' : '⭐ 觉得有用？点个 Star — 2 秒钟，让 1000+ dsh 开发者发现这些插件。'}</strong><br><span style="color:var(--muted);font-size:13px">${lang === 'en' ? '3 → 100 stars is our first milestone (97 to go). As we approach 100, noteworthy plugins may be pinned or highlighted within this list/site — no guarantees, just community signal.' : '3 → 100 颗星是第一里程碑（还差 97）。接近 100 时，受关注的插件可能在本列表/站点内获得置顶或高亮 — 不做承诺，仅作社区信号。'}</span></div>
      <div class="share">
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(lang === 'en' ? 'Awesome DeepSeek Harness — Everything is a Plugin ⚡ Curated dsh plugins, tools & skills' : 'Awesome DeepSeek Harness — 万物皆可插件 ⚡ dsh 插件精选')}&url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness&hashtags=dsh,deepseek" target="_blank" rel="noopener">Share on X</a>
        <a href="https://www.reddit.com/submit?url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness&title=Awesome%20DeepSeek%20Harness" target="_blank" rel="noopener">Reddit</a>
        <a href="https://discord.gg/Ycq5dCaS4" target="_blank" rel="noopener">Discord</a>
        <a href="https://github.com/awesome-deepseekharness/awesome-deepseek-harness" target="_blank" rel="noopener">${lang === 'en' ? '⭐ Star now' : '⭐ 去点 Star'}</a>
      </div>
    </div>
  </div>
</div>
<div class="starbar">⭐ <a href="https://github.com/awesome-deepseekharness/awesome-deepseek-harness" target="_blank" rel="noopener">${lang === 'en' ? 'Help us reach 100 stars — only 97 to go! Click ⭐ to star' : '帮我们冲 100 Stars — 还差 97！点击 ⭐ 点 Star'}</a> · <span style="color:var(--muted)">${lang === 'en' ? 'Your star notifies you of 2–3 new plugins weekly' : 'Star 后每周自动收到 2–3 个新插件提醒'}</span></div>
<section id="about">
  <div class="container">
    <h2>${lang === 'en' ? 'What is dsh?' : '什么是 dsh?'}</h2>
    <p class="sub">${lang === 'en' ? 'DeepSeek Harness (dsh) is DeepSeek AI\'s open-source agent harness. Its core philosophy: <strong>everything is a plugin</strong> — model adapter, tool registry, session log, permission model, even the agent loop itself are replaceable plugins, powered by Cordis.' : 'DeepSeek Harness (dsh) 是 DeepSeek AI 开源的 agent harness,核心哲学:<strong>万物皆可插件</strong>——模型适配器、工具注册表、会话日志、权限模型,甚至 agent loop 本身都是可替换的插件,基于 Cordis 构建。'}</p>
    <div class="warn">⚠️ ${lang === 'en' ? 'Developer Preview — compatibility-breaking changes are coming.' : '开发者预览版——官方警告将有破坏性兼容变更。'}</div>
    ${modeTable ? `<table><thead><tr><th>${lang === 'en' ? 'Mode' : '模式'}</th><th>${lang === 'en' ? 'Description' : '说明'}</th></tr></thead><tbody>${modeTable}</tbody></table>` : ''}
  </div>
</section>
${sections.map((s, i) => `<section id="cat-${i}">
  <div class="container">
    <h2>${escapeHtml(s.title)}</h2>
    <p class="sub">${s.items.length} ${lang === 'en' ? 'projects' : '个项目'}</p>
    <div class="grid">${renderCards(s.items)}</div>
  </div>
</section>`).join('\n')}
</main>
<footer>
  <div class="container">
    <p>${footerNote}</p>
    <p><a href="https://github.com/awesome-deepseekharness/awesome-deepseek-harness" target="_blank" rel="noopener">github.com/awesome-deepseekharness/awesome-deepseek-harness</a></p>
  </div>
</footer>
</body>
</html>
`;
}

function build() {
  const enMd = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const zhMd = fs.readFileSync(path.join(ROOT, 'README.zh.md'), 'utf8');
  const enSections = parseSections(enMd);
  const zhSections = parseSections(zhMd);

  const enModeTable = `<tr><td>Standard</td><td>${enMd.includes('Full coding agent') ? 'Full coding agent: file editing, shell, search, skills, planning, subagents, workflows' : ''}</td></tr>`;
  const modes = [
    ['Standard', 'Full coding agent: file editing, shell, file & web search, skills, planning, goals, subagents, workflows'],
    ['Code', 'All of Standard, plus multi-step TypeScript programs via the Code Mode SDK'],
    ['Minimal', 'Two-tool coding agent (bash + str_replace_editor) for benchmarking models'],
    ['Creator', 'Runtime inspection, in-memory plugin experiments, and composing new modes'],
  ];
  const modesZh = [
    ['Standard', '完整编码 agent:文件编辑、shell、文件/网页搜索、skills、规划、目标、子代理、工作流'],
    ['Code', 'Standard 全部能力 + 通过 Code Mode SDK 以 TypeScript 程序组合多步操作'],
    ['Minimal', '双工具编码 agent(bash + str_replace_editor),用于模型基准评测'],
    ['Creator', '运行时检查、内存内插件实验、组合新模式,用于编写自定义 agent 预设'],
  ];
  const modeTableEn = modes.map((m) => `<tr><td>${m[0]}</td><td>${m[1]}</td></tr>`).join('');
  const modeTableZh = modesZh.map((m) => `<tr><td>${m[0]}</td><td>${m[1]}</td></tr>`).join('');

  const enHtml = renderPage({
    lang: 'en',
    dir: 'ltr',
    title: 'Awesome DeepSeek Harness — Everything is a Plugin | Curated dsh Plugins, Tools & Skills',
    desc: 'A curated collection of the best plugins, tools, skills, and resources for DeepSeek Harness (dsh) — the open-source plugin-first agent harness from DeepSeek AI, powered by Cordis.',
    keywords: 'DeepSeek Harness, dsh, DeepSeek, plugin, Cordis, AI agent, awesome list, coding agent, MCP, agent harness, dsh-plugin',
    canonical: `${SITE}/`,
    altUrl: `${SITE}/zh/`,
    ogLocale: 'en_US',
    heroTitle: 'Awesome DeepSeek Harness',
    tagline: 'Everything is a Plugin.',
    about: 'Curated collection of the best plugins, tools, skills, and resources built for DeepSeek Harness (dsh) — the open-source agent harness from DeepSeek AI, powered by Cordis.',
    sections: enSections,
    modeTable: modeTableEn,
    footerNote: 'Star counts as of 2026-08-15. This site is auto-generated from README.md.',
  });

  const zhHtml = renderPage({
    lang: 'zh-CN',
    dir: 'ltr',
    title: 'Awesome DeepSeek Harness — 万物皆可插件 | dsh 插件、工具与技能精选',
    desc: '面向 DeepSeek Harness (dsh) 生态的精选项目合集——插件、工具、技能与资源。dsh 是 DeepSeek AI 开源的 agent harness,基于 Cordis 构建,核心哲学是「万物皆可插件」。',
    keywords: 'DeepSeek Harness, dsh, DeepSeek, 插件, Cordis, AI agent, 精选列表, 编码智能体, agent harness, dsh-plugin',
    canonical: `${SITE}/zh/`,
    altUrl: `${SITE}/`,
    ogLocale: 'zh_CN',
    heroTitle: 'Awesome DeepSeek Harness',
    tagline: '万物皆可插件。',
    about: '面向 DeepSeek Harness (dsh) 生态的精选项目合集——插件、工具、技能与资源。dsh 是 DeepSeek AI 开源的 agent harness,基于 Cordis 构建。',
    sections: zhSections,
    modeTable: modeTableZh,
    footerNote: '星标数截止 2026-08-15。本站由 README.zh.md 自动生成。',
  });

  fs.mkdirSync(path.join(DOCS, 'zh'), { recursive: true });
  fs.writeFileSync(path.join(DOCS, 'index.html'), enHtml);
  fs.writeFileSync(path.join(DOCS, 'zh', 'index.html'), zhHtml);
  fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');
  fs.writeFileSync(path.join(DOCS, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  fs.writeFileSync(path.join(DOCS, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>${SITE}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    `  <url><loc>${SITE}/zh/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n` +
    `</urlset>\n`);

  console.log(JSON.stringify({ en: enSections.length, zh: zhSections.length, enItems: enSections.reduce((a, s) => a + s.items.length, 0), zhItems: zhSections.reduce((a, s) => a + s.items.length, 0) }));
}

build();