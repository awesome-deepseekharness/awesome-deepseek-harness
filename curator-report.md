# curator-report.md — 2026-09-14 14:12 UTC (model: opencode/muse-spark-1.3-contributor-free)

## Summary — 2-3 sentences

No PR/Issue event — general health audit only. EN/ZH READMEs are in full parity (120 unique repo links each, 117 table rows, no duplicate project entries). Star counts (stamped 2026-08-15) have drifted significantly on hot plugins (up to +236%); all sampled links return HTTP 200.

## Preliminary Checks — table: Title ✅/❌, Bilingual ✅/❌, Star ✅/❌ (live N vs PR N), dsh-plugin ✅/❌, Files ✅/❌, Author trust high/medium/low (fused only, no raw dates/counts)

| Check | Result |
| --- | --- |
| Event type | No PR/Issue event — health audit only (N/A for title/bilingual/star/topic/files) |
| Bilingual parity (EN↔ZH project links) | ✅ 120 / 120 unique links, zero diff in either direction |
| Duplicate project entries | ✅ None (repeated links are expected infra: deepseek-harness docs, cordis, topics/dsh-plugin, self-links) |
| Table row count | 117 data rows in README.md |
| Link liveness (5-spot curl) | ✅ All 200 (modlens, dsh-web-ui, deepseek-harness, OpenViking, deepseek.com/harness) |
| Author trust | N/A — no PR/Issue author in this run |

## New Project Verification — for owner/repo: existence, topics, stars, license, README install, search hits (with [Source](url) for each, via webfetch/websearch/kitesurf)

No new project proposed in this run — nothing to verify.

## Maintainer Review Opinion — RECOMMEND: Approve / Request changes (missing ZH, star drift, wrong category) / Needs discussion; confidence low/medium/high (must reflect author-trust risk: low-trust caps at medium); 1-paragraph rationale citing evidence + fused author-trust line. Do NOT paste the full postable comment here — write it to review-comment.md instead.

**RECOMMEND: No merge action (health audit only); schedule a star-refresh run — confidence: high.** Rationale: structural health is good (bilingual parity exact, no duplicate entries, all sampled URLs 200), but the 8-repo star sample shows systematic upward drift one month after the 2026-08-15 stamp — 5 of 8 repos drifted >10% (modlens 1525→3962, dsh-vision-toolkit 384→880, dsh-web-ui 2250→7558, dsh-TUI 1047→3030, colleague-skill 22228→24708) while 3 stayed within ~10% (OpenViking, ouroboros, Qwen-MM-Plugins). No author-trust dimension applies (no submitter).

## Auto Labels — labels added via `gh pr/issue edit` (e.g., auto-labeled, needs-review, plugin/ai-draft/curator) + any new labels created

None — no PR/Issue to label in this run.

## Repo Health — star drift, broken links, duplicates (or "no health event")

- **Star drift (live via `gh api repos/<owner/repo> --jq .stargazers_count`, 2026-09-14):**
  - liustack/modlens: listed 1525 → live 3962 (+160%) ⚠️
  - Anionex/dsh-vision-toolkit: 384 → 880 (+129%) ⚠️
  - zhu1090093659/dsh-web-ui: 2250 → 7558 (+236%) ⚠️
  - ccch1mneyyy/dsh-TUI: 1047 → 3030 (+189%) ⚠️
  - titanwings/colleague-skill: 22228 → 24708 (+11%) ⚠️
  - QwenLM/Qwen-MM-Plugins: 2549 → 2817 (+10%) ~
  - volcengine/OpenViking: 35688 → 37170 (+4%) ✅
  - Q00/ouroboros: 5777 → 5839 (+1%) ✅
  - Stamp in README says "Star counts as of 2026-08-15" — refresh overdue (~1 month).
- **Broken links:** none in 5-spot curl sample (all HTTP 200).
- **Duplicates:** none among project entries (117 rows, 120 unique links incl. infra/docs links).
- **Bilingual parity:** EN↔ZH exact match, zero diff.

## Proposed Patches — unified diff preview if you edited README (or "none")

None — star refresh should run via the curator workflow (`scripts/curate.mjs`), not hand-edited here.

## Next Steps — `gh pr comment` / `gh pr create` commands for human

- `node scripts/curate.mjs --refresh-stars` (or equivalent workflow dispatch) to refresh ⭐ columns + date stamp in both READMEs, then open a `chore(curator): refresh stars` PR.
- No `gh pr comment` / `gh pr create` needed for this audit run.

## Sources — all URLs/files you actually fetched (gh api, webfetch, websearch, kitesurf)

- Local files: `README.md` (265 lines, 117 rows), `README.zh.md` (266 lines), repo root listing, `git log --oneline -8`, `git status --short`
- `gh api repos/liustack/modlens`, `Anionex/dsh-vision-toolkit`, `QwenLM/Qwen-MM-Plugins`, `zhu1090093659/dsh-web-ui`, `ccch1mneyyy/dsh-TUI`, `volcengine/OpenViking`, `titanwings/colleague-skill`, `Q00/ouroboros` (`--jq .stargazers_count`)
- `curl -s -o /dev/null -w "%{http_code}" -L` for 5 URLs (all 200): https://github.com/liustack/modlens, https://github.com/zhu1090093659/dsh-web-ui, https://github.com/deepseek-ai/deepseek-harness, https://github.com/volcengine/OpenViking, https://deepseek.com/harness
