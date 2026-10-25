# curator-report.md — 2026-10-25 07:33 UTC

## Summary
Routine health audit with no PR/Issue event. README tables are healthy: bilingual parity holds, no duplicate rows, the star-milestone CTA matches the live count exactly, and an 8-row star-drift sample shows no drift above 20%. One actionable finding: the `titanwings/colleague-skill` repository was renamed to `titanwings/distilly` (old URL still redirects, so nothing is broken, but the canonical link should be refreshed).

## Preliminary Checks

| Check | Result |
| --- | --- |
| Event | No PR / no Issue — general health audit only |
| Bilingual parity | README.md and README.zh.md both have 152 table rows — in sync |
| Duplicate owner/repo rows | None (repeated GitHub URLs are header/footer links only) |
| Star CTA vs live | README CTA "27 → 100 (73 to go)"; live `stargazers_count` = 27 → remaining = 73 — exact match (Source: gh-read) |
| ZH milestone line | "27 → 100 颗星是第一里程碑（还差 73）" — matches EN and live count |
| Site (GitHub Pages) | Live; shows 152 projects, 27/100 stars, 73 to go — consistent with READMEs (snapshot dated 2026-10-24, one day behind README refresh 2026-10-25 — cosmetic only) |
| Author trust | N/A — no PR/Issue author in this run |

## New Project Verification
Not applicable — no new `owner/repo` proposal in this run (no PR/Issue event). All sampled repositories verified as existing via `gh-read` during the drift check (see Repo Health).

## Maintainer Review Opinion
RECOMMEND: Approve — confidence high.
Rationale: This was a no-event health audit and every deterministic check passed: bilingual tables are in lockstep at 152 rows, zero duplicate entries, the milestone CTA (27 → 100, 73 remaining) matches the live `stargazers_count` of 27 returned by the GitHub API via `scripts/curate.mjs gh-read`, and the 8-row star sample (dsh-market/dsh-market, liustack/modlens, volcengine/OpenViking, anywhere-labs/dsh-desktop, tt-a1i/archify, titanwings/colleague-skill, hardes11/dsh-squeeze-command, deepseek-ai/deepseek-harness) shows worst-case drift of +12.2% (modlens 3962 → 4447), well inside the 20% threshold. The only follow-up is a cosmetic canonical-link refresh for the renamed `titanwings/distilly` repo; no data integrity or availability issue exists.

## Auto Labels
None — no PR/Issue to label in this run.

## Repo Health
- **Star drift sample (8 rows, README vs live via gh-read):**
  - dsh-market/dsh-market: 8760 → 8761 (~0%) ✓
  - liustack/modlens: 3962 → 4447 (+12.2%) ✓ within tolerance
  - volcengine/OpenViking: 37172 → 40763 (+9.7%) ✓
  - anywhere-labs/dsh-desktop: 32280 → 32987 (+2.2%) ✓
  - tt-a1i/archify: 88867 → 88869 (~0%) ✓
  - titanwings/colleague-skill: 24710 → 25990 (+5.2%) ✓ — **repo renamed to `titanwings/distilly`** (GitHub API `full_name` returns distilly; old URL redirects)
  - hardes11/dsh-squeeze-command: 1 → 1 ✓
  - deepseek-ai/deepseek-harness: 260.8k → 260806 ✓
- **No drift >20%** in the sample; no broken links detected (all 8 sampled repos resolve; Pages site returns 200).
- **Duplicates:** none.
- **Actionable finding (low risk):** update the `titanwings/colleague-skill` row to `titanwings/distilly` in README.md (line 203), README.zh.md (line 204), and let the site catalog regenerate from README. The repo is alive and well (26k stars, `dsh-plugin` topic present, MIT license, README explicitly notes "Formerly Colleague Skill").

## Proposed Patches
none (no files edited in this run; the rename refresh is listed under Next Steps for a maintainer or a follow-up `docs:` PR)

## Next Steps
- Optional follow-up PR: rename `titanwings/colleague-skill` → `titanwings/distilly` in both README tables (EN line 203, ZH line 204) and refresh the snapshot count to ~25990.
- No `gh pr comment` / `gh pr create` needed — no open PR in this run; `review-comment.md` intentionally contains no postable comment.

## Sources
- `node scripts/curate.mjs gh-read repos/awesome-deepseekharness/awesome-deepseek-harness` (live stars 27, license CC0-1.0, topics incl. `dsh-plugin`)
- `node scripts/curate.mjs gh-read repos/{dsh-market/dsh-market, liustack/modlens, volcengine/OpenViking, anywhere-labs/dsh-desktop, tt-a1i/archify, titanwings/colleague-skill, hardes11/dsh-squeeze-command, deepseek-ai/deepseek-harness}` (drift sample + rename detection)
- `README.md`, `README.zh.md` (local read: table counts, milestone lines, duplicate scan)
- https://github.com/titanwings/colleague-skill (webfetch — redirects to titanwings/distilly; `dsh-plugin` topic + MIT confirmed on page)
- https://awesome-deepseekharness.github.io/awesome-deepseek-harness/ (webfetch — site live, 152 projects, 27/100 stars)

<sub>model: opencode/glm-5.3-flash-free</sub>
