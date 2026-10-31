# curator-report.md — 2026-10-31 08:23 UTC

## Summary
No PR or Issue event, so this run is a repository health audit. The bilingual README milestone is accurate (32 → 100 stars, 68 to go) and the EN/ZH tables stay structurally in sync (157 rows each, 152 GitHub repos, no table duplicates), but two entries still use pre-rename repo names and displayed star counts show material drift versus live API data. The site catalog mirrors the README exactly, so any README refresh should be followed by the normal Pages rebuild.

## Preliminary Checks
| Check | Result | Evidence |
| --- | --- | --- |
| Event | No PR, no Issue (`GH_PR`/`GH_ISSUE` empty) | dispatcher context |
| README rows | 157 per language (152 GitHub repos + 5 non-GitHub resources); per-section counts identical | `README.md`, `README.zh.md` |
| Bilingual parity | Same repo set and order, except `Moonshile/moonshile-dsh-plugins` sits after `weibaohui/dsh-fireworks` in EN but before `weibaohui/dsh-gaokao` in ZH | `README.md:119`, `README.zh.md:117` |
| Milestone CTA | `32 → 100 stars (68 to go)` EN; `32 → 100 颗星（还差 68）` ZH; live repo 32 stars | `README.md:26`, `README.zh.md:26`, gh-read repo API |
| Duplicates | None inside either table; repeated links are self/sister/topic references in the header, footer and `## Sister Project` | link extraction + `uniq -d` |
| Star drift sample | 13 rows checked; 5 meaningful drifts >20% (`dsh-market` +154.8%, `dsh-context` +184.4%, `treg` +382.3%, `PerryLink/dsh-auto-review` +45.0%, `ChisaAlter` +21.3%), plus one 2→1 change | gh-read per-repo API vs README star column |
| Renamed upstreams | `ChisaAlter/Deepseek-Harness-Desktop` → `ChisaAlter/WhaleIsle`; `AdamPlatin123/awesome-dsh-plugins` → `AdamPlatin123/dsh-plugin-radar`; both still 200 via redirect | gh-read `full_name`, webfetch |
| Site catalog | 152 items, `repositoryStars: 32`, `firstStarGoal: 100`, star values mirror README | `docs/catalog.json` |

Author trust: n/a (no PR/Issue author in this event).

## New Project Verification
None — no new project was proposed in this event. No `owner/repo` verification target exists.

## Maintainer Review Opinion
RECOMMEND: Request changes — confidence high.

Rationale: Direct API reads confirm the README milestone and bilingual row parity are correct, and none of the 13 sampled repo links is broken. However, two curated entries still advertise pre-rename identities (`ChisaAlter/Deepseek-Harness-Desktop` now resolves to `ChisaAlter/WhaleIsle` with 199 stars vs 164 shown; `AdamPlatin123/awesome-dsh-plugins` now resolves to `AdamPlatin123/dsh-plugin-radar` with 1488 vs 1466), and 5 of 13 sampled star counts have drifted more than 20% — most dramatically `dsh-market` 3,887 → 9,904 and `superdesigndev/treg` 1,400 → 6,752 — against a footer that still says "Star counts as of 2026-09-14". Updating the two canonical URLs is low-risk; the star column needs either a batch refresh or an extension of `scripts/update-repo-stars.mjs` so counts are not refreshed only by ad-hoc PRs. Author trust is not applicable here, so no stricter scrutiny was required.

## Auto Labels
None applied — no PR or Issue event. `auto-labeled` / `needs-review` are reserved for triage targets; `scripts/curate.mjs` has nothing to write in this run.

## Repo Health
- Milestone: live `stargazers_count` 32, first goal 100 preserved, remaining 68 — matches both READMEs. No milestone diff was staged, so no low-risk refresh was pending.
- Star freshness: table values are README snapshots dated 2026-09-14 while `docs/catalog.json` claims `sourceUpdated: 2026-10-30`. Confirmed drift beyond 20% in 5 of 13 sampled rows, so the displayed column no longer reflects the "continuously updated" claim.
- Renames: both old URLs redirect successfully today, so nothing is hard-broken, but canonical names should be updated before GitHub releases the old slugs.
- Duplicates: none within tables; the only repeats are intentional header/footer/sister-project references.
- Parity: 157 rows per language, per-section counts identical, same repo set; only the `Moonshile` row position differs (minor ordering inconsistency in the Web UI section).
- Non-GitHub resources: `@deepseek-ai/dsh` and `create-dsh-plugin` exist on the npm registry (verified via registry JSON); `deepwiki.com` returned HTTP 429 to the fetcher, so that single link is unverified, not known-broken.
- Site data: `docs/catalog.json` is consistent with the README (152 items, 32 repo stars, goal 100); rebuild Pages after any README edit.

## Proposed Patches
Diff preview only — not applied to the workspace. Applies to both `README.md` and `README.zh.md`.

```diff
--- a/README.md
+++ b/README.md
@@
-| [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | Radar index repo that auto-scans dsh plugin candidates | 1466 |
+| [AdamPlatin123/dsh-plugin-radar](https://github.com/AdamPlatin123/dsh-plugin-radar) | Radar index repo that auto-scans dsh plugin candidates | 1488 |
@@
-| [ChisaAlter/Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | Electron desktop shell for the DSH web UI, with themes & backgrounds | 164 |
+| [ChisaAlter/WhaleIsle](https://github.com/ChisaAlter/WhaleIsle) | Electron desktop shell for the DSH web UI, with themes & backgrounds | 199 |
--- a/README.zh.md
+++ b/README.zh.md
@@
-| [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | 自动扫描 dsh 插件候选的前部索引仓库(Radar) | 1466 |
+| [AdamPlatin123/dsh-plugin-radar](https://github.com/AdamPlatin123/dsh-plugin-radar) | 自动扫描 dsh 插件候选的前部索引仓库(Radar) | 1488 |
@@
-| [ChisaAlter/Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | DSH Web UI 的 Electron 桌面壳,支持主题与背景图 | 164 |
+| [ChisaAlter/WhaleIsle](https://github.com/ChisaAlter/WhaleIsle) | DSH Web UI 的 Electron 桌面壳,支持主题与背景图 | 199 |
```

Separately, consider moving `Moonshile/moonshile-dsh-plugins` to the same position in both files (currently EN line 119, ZH line 117) and refreshing the remaining star column in one batch.

## Next Steps
1. Open a small `chore: refresh canonical repo URLs and star counts` PR with the diff above (and any additional rows refreshed in the same batch), then let the Pages build regenerate `docs/`.
2. Prefer making the star refresh routine instead of PR-by-PR: extend `scripts/update-repo-stars.mjs` (or the health workflow) to update the table star column from the API, preserving the manual date footnote.
3. Align the one out-of-order `Moonshile` row across both READMEs.
4. Re-check `deepwiki.com/deepseek-ai/deepseek-harness` manually — it returned 429 to this audit and remains the only unverified external resource.

## Sources
- https://api.github.com/repos/awesome-deepseekharness/awesome-deepseek-harness (via `node scripts/curate.mjs gh-read`)
- https://api.github.com/repos/dsh-market/dsh-market, /liustack/modlens, /bowenliang123/dsh-context, /superdesigndev/treg, /Nagi-ovo/dsh-find-plugins, /AdamPlatin123/awesome-dsh-plugins, /LaplaceYoung/oh-my-dsh, /zhengjy01/dsh-qqbot-panel, /whiteguo233/OpenBiliClaw, /RaulLazaro/dsh-server-setup, /ChisaAlter/Deepseek-Harness-Desktop, /thedeveloper256/dsh-model-router, /PerryLink/dsh-auto-review (via `node scripts/curate.mjs gh-read`)
- https://github.com/AdamPlatin123/awesome-dsh-plugins (webfetch; redirects to `dsh-plugin-radar`)
- https://registry.npmjs.org/create-dsh-plugin
- https://registry.npmjs.org/@deepseek-ai/dsh
- Local: `README.md`, `README.zh.md`, `docs/catalog.json`, `.github/curator-policy.yml`, `scripts/update-repo-stars.mjs`

<sub>model: opencode/deepseek-v4.1-flash-free</sub>
