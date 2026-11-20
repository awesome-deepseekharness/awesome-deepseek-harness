# curator-report.md — 2026-11-19 10:21 UTC

## Summary

Health-only audit: no GH_PR/GH_ISSUE event, so there is no submission to triage, no new project to verify, and no labels or public PR comment to apply. The bilingual CTA milestone is consistent with the live repository (45 stars, 55 remaining toward the 100 goal), and no duplicate `owner/repo` entries were found. The one actionable finding is stale catalog star counts: 5 of 8 sampled rows differ from live by more than 20% (all understated), and the same stale values are present in both README files.

## Preliminary Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Event type | No PR / no issue (health audit only) | task context `GH_PR=`, `GH_ISSUE=`; preChecks "No PR/Issue event — general health audit only" |
| Title (`Add owner/repo to …`) | N/A — no PR | local context |
| Bilingual README touch | N/A — no PR; both READMEs present and structurally aligned | `README.md`, `README.zh.md` |
| Star live-vs-PR | N/A — no PR; CTA live-vs-local checked instead: 45 = 45 | `gh-read repos/awesome-deepseekharness/awesome-deepseek-harness`, both README line 26 |
| `dsh-plugin` topic present (submission) | N/A — no PR; catalog repo itself carries `dsh-plugin` topic | `gh-read` topics array |
| Files / additions | N/A — no PR | local context |
| Files spot-checked for link liveness | 8/8 sampled GitHub links resolve (API returns matching `full_name`) | `gh-read` results in Sources |

Author trust: N/A — no PR/issue author in this health-only run; no trust fusion or scrutiny escalation required.

## New Project Verification

No new project proposal was submitted in this run (no PR body/diff and no issue to extract `owner/repo` from), so no webfetch/websearch/kitesurf verification was performed and no repo can be assessed for approval here. This section is file-only and is stripped from any public PR comment by the workflow.

## Maintainer Review Opinion

RECOMMEND: Needs discussion — confidence high.

Rationale: With no submission on the table there is nothing to approve or reject, but the audit produced one concrete maintainer decision: the catalog's star counts are stale relative to live GitHub data even though both READMEs agree with each other and the CTA milestone is correct. In the 8-row sample, `dsh-market/dsh-market` (3,887 → 12,942), `superdesigndev/treg` (1,400 → 8,461), `xmanrui/dsh-im` (1,307 → 3,710), `NanmiCoder/dsh-agent-teams` (1,633 → 3,033) and `liustack/modlens` (3,962 → 5,032) all exceed the 20% drift threshold, while `anywhere-labs/dsh-desktop`, `QwenLM/Qwen-MM-Plugins` and `Anionex/dsh-vision-toolkit` are below it; all deltas are upward and consistent with the README's own "Star counts as of 2026-09-14" note. No duplicate entries or dead sample links were found, so this is a data-freshness question rather than a correctness emergency — maintainer should decide whether to trigger the existing star-refresh workflow rather than have the curator hand-edit a partial set of rows.

## Auto Labels

None — no PR or issue to label in this run. (For reference, when a submission does arrive: always `auto-labeled` + `needs-review`; `ai-draft` only for bot/curator PRs; `plugin` + `enhancement` for bilingual plugin adds; `curator` for infra/health PRs only.)

## Repo Health

- **CTA milestone:** `README.md` line 26 and `README.zh.md` line 26 both read "45 → 100 stars … (55 to go)" / "45 → 100 颗星 … （还差 55）". Live `stargazers_count` = 45; goal 100 preserved; remaining = max(100 − 45, 0) = 55. In sync, no milestone patch needed.
- **Duplicates:** scanned all 183 `github.com/…` links in `README.md`; owners with multiple entries (e.g. `zhengjy01`, `PerryLink`, `weibaohui`, `omdsh-dev`, `Anionex`, `Nagi-ovo`, `lengrufeng2008`, `lo2589`, `superdesigndev`, `morluto`) all point to distinct repos. No exact duplicate `owner/repo` listing found.
- **Star drift (README vs live, threshold >20%):**

| Repo | README | Live | Drift |
| --- | --- | --- | --- |
| `superdesigndev/treg` | 1,400 | 8,461 | +504% ⚠ |
| `dsh-market/dsh-market` | 3,887 | 12,942 | +233% ⚠ |
| `xmanrui/dsh-im` | 1,307 | 3,710 | +184% ⚠ |
| `NanmiCoder/dsh-agent-teams` | 1,633 | 3,033 | +86% ⚠ |
| `liustack/modlens` | 3,962 | 5,032 | +27% ⚠ |
| `QwenLM/Qwen-MM-Plugins` | 2,817 | 3,210 | +14% |
| `anywhere-labs/dsh-desktop` | 32,280 | 36,397 | +13% |
| `Anionex/dsh-vision-toolkit` | 880 | 947 | +8% |

  5/8 exceed the threshold. `README.zh.md` carries the identical stale values (verified for `dsh-market/dsh-market`, `liustack/modlens`, `superdesigndev/treg`, `xmanrui/dsh-im`), so this is a whole-list refresh, not a single-file typo.
- **Broken links:** all 8 sampled rows returned a matching `full_name` from the GitHub API, confirming the URLs resolve; no broken sample link found. No website files were modified (the site reads the README milestone).

## Proposed Patches

none — no README edit made. A hand-edit of a few rows would leave the rest of the ~160 entries inconsistent; the appropriate low-risk fix is to run the existing `node scripts/update-repo-stars.mjs` refresh workflow, which updates both READMEs, rather than a partial curator patch.

## Next Steps

- Human maintainer: `node scripts/update-repo-stars.mjs` (or re-run the star-refresh workflow) to bring both READMEs' star columns up to date, then verify the CTA line still reads 45 → 100.
- Human maintainer: if a star-count PR or health PR is opened, `gh pr comment <n> -F review-comment.md` after reviewing this report; no PR exists in this run, so no comment should be posted now.
- No `gh pr create` needed — no new project was proposed in this run.

## Sources

- Local files: `README.md` (lines 26, 55–321, link scan of 183 matches), `README.zh.md` (lines 26, 57, 69, 79, 152), `.opencode/agent/curator.md`, task context (`GH_PR=`, `GH_ISSUE=`, preChecks)
- `shell: node scripts/curate.mjs gh-read repos/awesome-deepseekharness/awesome-deepseek-harness` (stargazers_count=45, topics include `dsh-plugin`)
- `shell: node scripts/curate.mjs gh-read repos/dsh-market/dsh-market` (12,942)
- `shell: node scripts/curate.mjs gh-read repos/liustack/modlens` (5,032)
- `shell: node scripts/curate.mjs gh-read repos/anywhere-labs/dsh-desktop` (36,397)
- `shell: node scripts/curate.mjs gh-read repos/QwenLM/Qwen-MM-Plugins` (3,210)
- `shell: node scripts/curate.mjs gh-read repos/Anionex/dsh-vision-toolkit` (947)
- `shell: node scripts/curate.mjs gh-read repos/superdesigndev/treg` (8,461)
- `shell: node scripts/curate.mjs gh-read repos/NanmiCoder/dsh-agent-teams` (3,033)
- `shell: node scripts/curate.mjs gh-read repos/xmanrui/dsh-im` (3,710)
- Code Mode runtime `new Date().toISOString()` for the report timestamp (2026-11-19T10:21:34Z)

<sub>model: opencode/hy4-flash-free</sub>
