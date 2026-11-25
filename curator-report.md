# curator-report.md — 2026-11-22 09:52 UTC

## Summary
Health audit of the 181-entry bilingual directory: structure is sound (no duplicate `owner/repo`, EN/ZH tables in parity, site catalog renders 181 projects across 11 blocks, star CTA matches live 46 → 100 / 54 to go). The one real problem is freshness: the per-row star snapshots are still dated 2026-09-14, and 5 of 13 sampled rows drift by more than 20% versus the live GitHub API. One bilingual typo in `README.zh.md` was fixed.

## Preliminary Checks
| Check | Result |
| --- | --- |
| Event | none — `GH_PR`/`GH_ISSUE` empty, general health audit |
| Title / PR format | n/a (no PR) |
| Bilingual parity | pass — same categories, same row order and same item count in `README.md` and `README.zh.md` (181 entries) |
| Star live-vs-README (repo CTA) | pass — README/zh say `46 → 100 stars (54 to go)`; live `stargazers_count` = 46, remaining = 100 − 46 = 54 |
| Star live-vs-README (project rows) | **fail — stale snapshot dated 2026-09-14; 5/13 sampled rows >20% drift** |
| `dsh-plugin` topic | pass on all 11 sampled repos (market, vision, memory, UI, TUI, skills, core, infra) |
| Duplicates | pass — 181 unique `name` values in `docs/catalog.json`; no repeated `owner/repo` found |
| Files | `README.md`, `README.zh.md`, `docs/catalog.json` (generated 2026-11-21), `site/` all consistent on entry count |

Author trust: n/a (no submission author in this run — no risk-adjusted scrutiny needed).

## New Project Verification
No new project was proposed in this run, so there is nothing to admit. Sampled re-verification of already-listed rows (existence, live stars, license, `dsh-plugin` topic) via the read-only GitHub helper:

| Repo | Exists | `dsh-plugin` topic | License | README ⭐ | Live ⭐ | Drift |
| --- | --- | --- | --- | --- | --- | --- |
| dsh-market/dsh-market | yes | yes | MIT | 3887 | 13188 | +239% |
| liustack/modlens | yes | yes | MIT | 3962 | 5055 | +27.6% |
| anywhere-labs/dsh-desktop | yes | yes | MIT | 32280 | 36584 | +13.3% |
| deepseek-ai/deepseek-harness | yes | yes | MIT | 104.5k | 285290 | +173% |
| tt-a1i/archify | yes | yes | Apache-2.0 | 61772 | 98675 | +59.7% |
| volcengine/OpenViking | yes | yes | AGPL-3.0 | 37172 | 42589 | +14.6% |
| omdsh-dev/DSH-better-sidebar | yes | yes | MIT | 3593 | 5280 | +47.0% |
| ccch1mneyyy/dsh-TUI | yes | yes | MIT | 3030 | 8087 | +167% |
| cordiverse/cordis | yes | n/a (framework, not plugin) | MIT | 8488 | 10007 | +17.9% |
| Nagi-ovo/dsh-find-plugins | yes | yes | BSD-3-Clause | 172 | 183 | +6.4% |
| LaplaceYoung/oh-my-dsh | yes | yes | **none** | 58 | 59 | +1.7% |
| hardes11/dsh-squeeze-command | yes | yes | MIT | 1 | 1 | 0% |
| CorsenAI/deepseek-harness-connector | yes | yes | MIT | 0 | 0 | 0% |

All 11 GitHub rows resolve through the API (no 404s, none archived/disabled). The public site `https://awesome-deepseekharness.github.io/awesome-deepseek-harness/` returned 200 and rendered the full catalog (MKT 5, VIS 5, WEB 5, MEM 15, UI 22, TUI 9, TLS 74, SKL 18, APP 13, INF 5, LRN 10 = 181).

## Maintainer Review Opinion
RECOMMEND: Request changes — confidence high.

Rationale: The list is structurally healthy — 181 unique entries, exact EN/ZH parity, a working site catalog, and a milestone CTA that matches the live API (46 stars, 54 remaining), so no milestone patch is needed. What does need action is the star table: every row still carries the 2026-09-14 snapshot, and live reads show large movement (deepseek-harness 104.5k → 285,290; dsh-market 3,887 → 13,188; dsh-TUI 3,030 → 8,087; archify 61,772 → 98,675; DSH-better-sidebar 3,593 → 5,280), i.e. 5 of 13 sampled rows beyond 20% drift and 8 of 13 beyond 10%. Two smaller items: `LaplaceYoung/oh-my-dsh` is listed without any license upstream (`license: null`), and the site renders no star value for the `104.5k` shorthand in INF.01 — worth normalising if numeric display matters. The only edit made here is the `README.zh.md` dsh-ATN row, which still contained an English `Install:` fragment inside Chinese prose. Confidence is high because every number above comes from the live repository API, not from the README.

## Auto Labels
No PR or Issue in this run, so nothing is applied. If a follow-up star-refresh/bilingual-fix PR is opened, it should carry `curator`, `documentation`, `auto-labeled` and `needs-review` (infra/docs, not `plugin`).

## Repo Health
- Star drift: 5/13 sampled rows >20%, 8/13 >10%; the README footer still says "Star counts as of 2026-09-14", so the snapshot is ~10 weeks old. `scripts/update-repo-stars.mjs` only refreshes the repo's own milestone line — there is no per-row refresher in the repo, which is why the table ages silently.
- Duplicates: none. `docs/catalog.json` has `total: 181` and 181 distinct project names.
- Bilingual parity: pass (same 181 rows; the zh dsh-ATN row was the only mixed-language artifact, now fixed).
- Broken links: none in the sample; all GitHub URLs resolve and the Pages site is up. Non-GitHub learning links (dshlearn.com, dseek.app, deepseekdsh.com) were not re-fetched this run.
- Metadata gap: `LaplaceYoung/oh-my-dsh` has no upstream license; INF.01's `104.5k` shorthand is non-numeric, so the site shows a blank star for it.

## Proposed Patches
Applied (1 file, 1 line) — `README.zh.md`, Tools section:

```diff
-| [ff66ccff/dsh-ATN](https://github.com/ff66ccff/dsh-ATN) | 面向 DeepSeek Harness 的自适应拓扑多智能体预设，提供点对点通信、共享白板、任务交接和实时网络可视化。 Install: `dsh plugin --profile web add dsh-atn@0.4.1`. | 2 |
+| [ff66ccff/dsh-ATN](https://github.com/ff66ccff/dsh-ATN) | 面向 DeepSeek Harness 的自适应拓扑多智能体预设，提供点对点通信、共享白板、任务交接和实时网络可视化。安装：`dsh plugin --profile web add dsh-atn@0.4.1`。 | 2 |
```

Not applied (needs a decision): the 181-row star refresh. Rewriting only the sampled rows would leave the table internally inconsistent, so it should be done as one generated pass (script or batched API reads) that also updates the "as of" date and regenerates `docs/catalog.json`.

## Next Steps
```bash
# 1. Refresh the repo milestone line (already correct at 46, safe no-op)
node scripts/update-repo-stars.mjs

# 2. Refresh per-row stars (needs a one-off script or batched API reads), then
#    update the "Star counts as of YYYY-MM-DD" footer in README.md / README.zh.md
#    and regenerate the catalog:
node site/scripts/publish.mjs   # or the documented catalog build step

# 3. Ship the applied zh fix
git checkout -b docs/zh-dsh-atn-install
git add README.zh.md curator-report.md review-comment.md
git commit -m "docs(zh): fix mixed-language install note in dsh-ATN row"
gh pr create --title "docs: fix zh install note for dsh-ATN" --body-file review-comment.md
```

## Sources
- `node scripts/curate.mjs gh-read repos/awesome-deepseekharness/awesome-deepseek-harness` (live repo: 46 stars, CC0-1.0, 17 topics)
- `node scripts/curate.mjs gh-read repos/dsh-market/dsh-market` (13188 ⭐, MIT, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/liustack/modlens` (5055 ⭐, MIT, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/anywhere-labs/dsh-desktop` (36584 ⭐, MIT, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/deepseek-ai/deepseek-harness` (285290 ⭐, MIT, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/tt-a1i/archify` (98675 ⭐, Apache-2.0, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/volcengine/OpenViking` (42589 ⭐, AGPL-3.0, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/omdsh-dev/DSH-better-sidebar` (5280 ⭐, MIT, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/ccch1mneyyy/dsh-TUI` (8087 ⭐, MIT, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/cordiverse/cordis` (10007 ⭐, MIT)
- `node scripts/curate.mjs gh-read repos/Nagi-ovo/dsh-find-plugins` (183 ⭐, BSD-3-Clause, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/LaplaceYoung/oh-my-dsh` (59 ⭐, license: null, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/hardes11/dsh-squeeze-command` (1 ⭐, MIT, `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/CorsenAI/deepseek-harness-connector` (0 ⭐, MIT, `dsh-plugin`)
- `README.md`, `README.zh.md`, `docs/catalog.json`, `scripts/update-repo-stars.mjs` (local files)
- `https://awesome-deepseekharness.github.io/awesome-deepseek-harness/` (site renders 181 projects, 11 blocks, 46/100 stars)

<sub>model: opencode/deepseek-v4.1-flash-free</sub>
