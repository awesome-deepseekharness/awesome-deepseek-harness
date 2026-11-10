# curator-report.md — 2026-11-10 09:44 UTC

## Summary
Health audit of the curated list: 158 table rows in each language, 9 categories, zero duplicates, zero missing translations, and the star CTA is accurate (41 → 100, 59 to go, verified against the live API). One real rendering bug was found and patched in `README.zh.md` (a row detached from its table by a blank line), and the sampled star column is materially stale (7 of 18 sampled rows drift >20%, because the table is a 2026-09-14 snapshot).

## Preliminary Checks
| Check | Result | Evidence |
| --- | --- | --- |
| Event | No PR, no Issue — health audit only | `GH_PR=` / `GH_ISSUE=` empty, workflow `curator.yml` schedule |
| Title convention | N/A (no PR) | — |
| Bilingual parity | Pass — 158 rows each, identical repo sets in all 9 sections | parsed `README.md` + `README.zh.md` (raw main) |
| Duplicates | Pass — 0 duplicated `owner/repo` in either file | slug count over all table rows |
| CTA milestone | Pass — `41 → 100 stars (59 to go)`, EN and ZH agree | live `stargazers_count: 41` via `gh-read` |
| `dsh-plugin` topic | Pass — 25/25 plugin entries sampled carry the topic | GitHub topics API |
| Link liveness | Pass — 26/26 sampled repos HTTP 200, none archived; 4 path-based links resolve | GitHub API + site fetches |
| Star freshness | **Warn** — 7/18 sampled rows off by >20% | see Repo Health |
| Files | `README.md`, `README.zh.md` only | working tree |

Author trust: N/A (no PR/Issue author — health audit).

## New Project Verification
None — this event carries no new `owner/repo`, so there is nothing to verify for admission. Instead, existing entries were re-verified live:

- **26 sampled repositories** returned HTTP 200 and `archived: false` (e.g. `liustack/modlens`, `zhu1090093659/dsh-web`, `anywhere-labs/dsh-desktop`, `omdsh-dev/dsh-annotation`, `tinqiao-oss/engramory`, `pavel-logachev/dsh-mobile`, `ChisaAlter/WhaleIsle`).
- **Topic coverage:** 25/25 plugin/skill/app entries in the sample carry `dsh-plugin` (`deepseek-ai/deepseek-harness`, `dsh-market/dsh-market`, `superdesigndev/treg`, `AdamPlatin123/dsh-plugin-radar`, `LaplaceYoung/oh-my-dsh`, `Lum1104/dsh-browser`, `volcengine/OpenViking`, …). `cordiverse/cordis` correctly has no topic — it is Core Infrastructure, not a plugin.
- **Path-based links resolve:** `Q00/ouroboros/tree/main/integrations/dsh-plugin`, `vectorize-io/hindsight/tree/main/hindsight-integrations/coding-agents`, `klarkxy/dsh-plugins/tree/main/plugins/dsh-dev-index`, `volcengine/OpenViking/tree/main/examples/dsh-memory-plugin` all return 200.
- **Non-GitHub links:** site `/`, `/catalog.json` (81.5 KB), `/llms.txt` all 200; `deepseek.com/harness`, `dseek.app/cli`, `dshlearn.com`, `deepseekagent.io/guides/deepseek-harness`, `github.com/topics/dsh-plugin`, `discord.gg/Ycq5dCaS4` all 200. npmjs.com and deepwiki.com return 403/429 bot walls, not dead links — `registry.npmjs.org` confirms `@deepseek-ai/dsh@0.2.2-rc.1` and `create-dsh-plugin@0.2.3`.
- **Site ↔ README consistency:** `catalog.json` reports `total: 172` (= 158 table rows + 5 Core Infrastructure + 9 Learning & Guides), `repositoryStars: 41`, `firstStarGoal: 100` — all match the READMEs.

## Maintainer Review Opinion
RECOMMEND: Approve — confidence high.

Rationale: The only change in this audit is a one-line structural fix in `README.zh.md` that re-attaches `dongsheng123132/dsh-move-up` to the Web UI table (it was separated by a blank line and therefore rendered as a plain paragraph, not a list entry) — no content, category, translation, or star value is altered, and the other 157 rows are untouched. Bilingual parity is verified mechanically (158 rows per file, identical repo sets per section, zero duplicates), the CTA milestone matches the live API (`41 → 100`, 59 to go), and all 26 sampled upstream repos are alive with the `dsh-plugin` topic. Separately, and *not* a blocker for this patch, the ⭐ column is a 2026-09-14 snapshot and now materially stale (e.g. official repo `104.5k` vs live `277,815`; `dsh-market` `3887` vs `11769`; `treg` `1400` vs `7740`), so a batch refresh should be scheduled as its own change rather than partially patched here. Author trust: N/A (no PR/Issue author).

## Auto Labels
`ai-draft`, `needs-review`, `curator`, `auto-labeled` — this is a bot-generated health/infra draft, not a plugin submission, so no `plugin` / `enhancement`.

## Repo Health
- Rows: 158 per language, 9 categories (5 / 5 / 4 / 15 / 20 / 9 / 70 / 17 / 13); catalog total 172 including 5 core + 9 learning entries.
- Duplicates: none; EN/ZH sets identical (`onlyEn: []`, `onlyZh: []`).
- Broken links: none found in 26 repos + 8 external properties.
- **Rendering bug (fixed):** `README.zh.md` line 128 `dongsheng123132/dsh-move-up` sat after a blank line inside the Web UI table → rendered outside the table. Repaired in this patch.
- Minor: EN/ZH row order differs slightly inside the Web UI section (ZH has `12we21/cute-fat-fish-pet` and `VictorKozachek/dsh-user-code-block` before `weibaohui/dsh-sidebar-tidy`; EN has sidebar-tidy before both). Cosmetic only — sets and counts match.
- **Star drift sample** (README value → live):

| Repo | README | Live | Δ |
| --- | --- | --- | --- |
| deepseek-ai/deepseek-harness | 104.5k | 277,815 | +166% |
| superdesigndev/treg | 1400 | 7740 | +453% |
| dsh-market/dsh-market | 3887 | 11,769 | +203% |
| tt-a1i/archify | 61772 | 95,224 | +54% |
| omdsh-dev/dsh-annotation | 116 | 167 | +44% |
| liustack/modlens | 3962 | 4887 | +23% |
| cordiverse/cordis | 8488 | 9811 | +16% |
| volcengine/OpenViking | 37172 | 41,910 | +13% |
| zhu1090093659/dsh-web | 9270 | 10,303 | +11% |
| anywhere-labs/dsh-desktop | 32280 | 35,583 | +10% |
| titanwings/colleague-skill | 24710 | 26,491 | +7% |
| tinqiao-oss/engramory | 190 | 204 | +7% |
| AdamPlatin123/dsh-plugin-radar | 1492 | 1498 | +0.4% |
| LaplaceYoung/oh-my-dsh | 58 | 58 | 0% |
| dustinmoon78/dsh-usage-stats | 0 | 0 | 0% |
| ChisaAlter/WhaleIsle | 200 | 202 | +1% |
| pavel-logachev/dsh-mobile | 1 | 12 | new-ish |
| weibaohui/dsh-flow | 0 | 1 | 0 → 1 |

  Root cause: no automation refreshes the ⭐ column — `scripts/update-repo-stars.mjs` only rewrites the milestone sentence, and both READMEs still say "*Star counts as of 2026-09-14*". `catalog.json` already discloses this ("README snapshots, not live counts"), so it is a known limitation, but 8 weeks of drift is now visible in the top rows.

## Proposed Patches
```diff
--- a/README.zh.md
+++ b/README.zh.md
@@ -124,8 +124,7 @@
 | [VictorKozachek/dsh-user-code-block](…) | DSH 用户消息中的代码块… | 1 |
 | [weibaohui/dsh-sidebar-tidy](…) | 侧栏收纳… | 0 |
 | [mengge237/dsh-composer-ease](…) | dsh-composer-ease：给 DSH Web 输入框加一个补全提示框… | 0 |
-
 | [dongsheng123132/dsh-move-up](https://github.com/dongsheng123132/dsh-move-up) | 工作区菜单里加一项「移到最上面」… | 0 |
 
 ### 🖥️ TUI 与桌面端
```
(Context rows abbreviated with `…`; only the blank line is removed — the row text is unchanged.)

## Next Steps
1. Let `curator.yml` open the draft PR for the `README.zh.md` fix (`add-paths` already includes `README.md`/`README.zh.md`), then human-merge after `curator-gate.yml` re-review: `gh pr list --label ai-draft`.
2. **Star refresh follow-up (separate PR):** add a table-refresh step (e.g. extend `scripts/update-repo-stars.mjs`, or a new `scripts/refresh-table-stars.mjs`) that maps each `github.com/owner/repo` cell to `stargazers_count`, rewrites the ⭐ column in both READMEs, and bumps the `*Star counts as of …*` footer. ~158 API calls per run with `GITHUB_TOKEN`; run weekly or on the existing 3-day curator schedule.
3. Optional cosmetic: align the ZH Web UI row order with EN (positions 15–18) in a docs-only PR.
4. No action needed for the CTA/milestone — it is already correct at 41/100.

## Sources
- Local files: `README.md`, `README.zh.md`, `CONTRIBUTING.md`, `.github/curator-policy.yml`, `.github/workflows/curator.yml`, `scripts/update-repo-stars.mjs`
- `node scripts/curate.mjs gh-read repos/awesome-deepseekharness/awesome-deepseek-harness` → `stargazers_count: 41`, `license: CC0-1.0`, `topics` incl. `dsh-plugin`
- `node scripts/curate.mjs gh-read repos/dsh-market/dsh-market` → `stargazers_count: 11769`
- GitHub REST API (`api.github.com/repos/...`) for the 26 sampled repos and 4 tree paths
- `raw.githubusercontent.com/awesome-deepseekharness/awesome-deepseek-harness/main/{README.md,README.zh.md}` (row/duplicate parsing)
- `https://awesome-deepseekharness.github.io/awesome-deepseek-harness/` , `/catalog.json` , `/llms.txt`
- `https://registry.npmjs.org/@deepseek-ai/dsh` , `https://registry.npmjs.org/create-dsh-plugin`
- `https://deepseek.com/harness`, `https://dseek.app/cli`, `https://dshlearn.com`, `https://deepseekagent.io/guides/deepseek-harness`, `https://github.com/topics/dsh-plugin`, `https://discord.gg/Ycq5dCaS4`

<sub>model: opencode/deepseek-v4.1-flash-free</sub>
