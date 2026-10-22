# curator-report.md — 2026-10-22 06:07 UTC

## Summary
Routine health audit with no PR/Issue event. This branch applies the two actionable catalog fixes found by the audit: it follows the renamed DSH Web and DSH Desktop repositories and refreshes their displayed star counts in both language editions. The bilingual tables remain in sync, contain no duplicate plugin entries, and the milestone CTA matches the live star count.

## Preliminary Checks
| Check | Result |
| --- | --- |
| Event | No PR/Issue event — general health audit; the two rename patches below were applied before gate review |
| Bilingual tables | ✅ 146 project rows in README.md and 146 in README.zh.md, same repo set |
| Duplicates | ✅ No duplicate plugin entries (repeated URLs are self/official/topic links only) |
| Milestone CTA vs live | ✅ README says "23 → 100 stars (77 to go)"; live `stargazers_count` = 23 via GitHub API → CTA current, first milestone goal (100) preserved |
| Renamed repositories | ✅ Old URLs redirect to the new names; both new URLs resolve and are bilingual |
| Author trust | N/A (no PR/Issue author); no trust signals to fuse |

## Changes in This PR
- `README.md:105` / `README.zh.md:105`: rename `zhu1090093659/dsh-web-ui` → `zhu1090093659/dsh-web` and refresh the displayed count to 9270.
- `README.md:128` / `README.zh.md:129`: rename `anywhere-labs/deepseek-harness-desktop` → `anywhere-labs/dsh-desktop` and refresh the displayed count to 32280.
- `curator-report.md`: record the actual patches, redirect checks, and current sources so this report is consistent with the diff.

## New Project Verification
Not applicable — no new `owner/repo` proposal in this event. No PR or Issue was attached to this run.

## Maintainer Review Opinion
RECOMMEND: Approve — confidence high.

Rationale: Both renamed repositories are live and the old URLs are GitHub redirects to the new names (`zhu1090093659/dsh-web-ui` → `zhu1090093659/dsh-web`, `anywhere-labs/deepseek-harness-desktop` → `anywhere-labs/dsh-desktop`). The replacement rows keep the same descriptions, categories, and bilingual positions, and the live counts were refreshed at update time (9270 and 32280). The catalog remains structurally healthy: both tables contain 146 project rows with the same URL set, the duplicate scan found no repeated plugin entries, and the milestone call-out matches the live repository count of 23. The larger star-drift findings below are real upward drift on live repos; they are documented as non-blocking follow-ups rather than silently rewritten in this rename-focused branch.

## Repo Health
- **Star drift (>20% threshold), sampled 8 of 146 rows:**
  - `dsh-market/dsh-market`: README 3887 → live 8067 (+107%) — refresh candidate
  - `tt-a1i/archify`: README 61772 → live 87214 (+41%) — refresh candidate
  - Within tolerance: `liustack/modlens` (3962→4392), `volcengine/OpenViking` (37172→40546), `junhoyeo/tokscale` (5428→5720), `anywhere-labs/dsh-desktop` (live count refreshed here), `hardes11/dsh-squeeze-command` (1→1 exact), `zhengjy01/dsh-npm` (0→0 exact)
  - All 8 sampled repos are live with `dsh-plugin` topic and a license (MIT/AGPL-3.0) present.
- **Bilingual sync:** identical entry sets and counts; one cosmetic ordering difference — `Moonshile/moonshile-dsh-plugins` sits after `weibaohui/dsh-fireworks` in README.md but before it in README.zh.md (Web UI section).
- **Milestone CTA:** current and correct (23 live vs "23 → 100, 77 to go"). Note: `scripts/update-repo-stars.mjs` only refreshes the CTA, not per-row stars; per-row values are manual ("as of 2026-09-14"), which explains the remaining drift.
- **Broken links:** not exhaustively crawled this run; all sampled repo URLs resolved via the GitHub API (200-equivalent `full_name` match).

## Proposed Patches
Applied in this branch:
- Rename the DSH Web row to `zhu1090093659/dsh-web` and refresh its count.
- Rename the DSH Desktop row to `anywhere-labs/dsh-desktop` and refresh its count.
- Align the bilingual rows and update this report accordingly.

Recommended follow-ups (not applied here):
- Refresh the two high-drift rows (`dsh-market/dsh-market`, `tt-a1i/archify`) and the "Star counts as of" date in both READMEs in a later star-refresh pass.
- Optionally reorder the Moonshile row in README.zh.md to match README.md.

## Next Steps
- Merge this branch after the second AI gate confirms the renamed rows and refreshed counts.
- Schedule the broader star refresh described above; it is not a merge blocker for the rename fixes.

## Sources
- `node scripts/curate.mjs gh-read repos/awesome-deepseekharness/awesome-deepseek-harness` — live stars (23), license CC0-1.0, pushed_at 2026-10-22
- `node scripts/curate.mjs gh-read repos/zhu1090093659/dsh-web-ui` — redirects to zhu1090093659/dsh-web
- `node scripts/curate.mjs gh-read repos/zhu1090093659/dsh-web` — live stars (9270 at update time)
- `node scripts/curate.mjs gh-read repos/anywhere-labs/deepseek-harness-desktop` — redirects to anywhere-labs/dsh-desktop
- `node scripts/curate.mjs gh-read repos/anywhere-labs/dsh-desktop` — live stars (32280 at update time)
- `node scripts/curate.mjs gh-read repos/dsh-market/dsh-market` — live stars (8067), drift sample
- `node scripts/curate.mjs gh-read repos/tt-a1i/archify` — live stars (87214), drift sample
- `node scripts/curate.mjs gh-read repos/liustack/modlens` — drift sample
- `node scripts/curate.mjs gh-read repos/volcengine/OpenViking` — drift sample
- `node scripts/curate.mjs gh-read repos/junhoyeo/tokscale` — drift sample
- `node scripts/curate.mjs gh-read repos/hardes11/dsh-squeeze-command` — drift sample
- `node scripts/curate.mjs gh-read repos/zhengjy01/dsh-npm` — drift sample
- Local `README.md`, `README.zh.md` (table row counts, duplicate scan, CTA text), `scripts/update-repo-stars.mjs` (CTA-only refresh scope)

<sub>model: opencode/glm-5.3-flash-free</sub>
