# curator-report.md — 2026-09-14 15:10 UTC

## Summary

General health audit only (no PR/Issue event). README tables are consistent: 126 unique project links, no duplicates, and full EN/ZH parity. One notable star drift on the official `deepseek-ai/deepseek-harness` row; all other samples within noise.

## Preliminary Checks

| Check | Result |
| --- | --- |
| Event type | No PR/Issue — health audit only |
| Table entries | 126 project links, 126 unique, no duplicates |
| Bilingual parity | EN 126 / ZH 126, zero symmetric diff |
| Link liveness | 4/4 GitHub URLs 200; npm package page 403 via curl (bot-blocking, inconclusive, not counted as broken) |
| Star drift sample | 7/8 rows within ~1%; official harness row drifted (see Repo Health) |

Author trust: N/A (no PR/Issue author for this audit).

## Maintainer Review Opinion

RECOMMEND: Approve (no blocking action; optional star-count refresh noted below) — confidence high. Rationale: the list is structurally healthy with no duplicates, no EN/ZH divergence, and live links resolving; the only material finding is the official-repo star figure lagging live counts, which is cosmetic and can be refreshed by the normal star-refresh workflow rather than a manual patch.

## Auto Labels

No PR/Issue to label — none applied.

## Repo Health

- Duplicates: none (126 links, 126 unique).
- EN/ZH parity: full match, no missing entries either direction.
- Star drift sample (README → live via `gh api`): modlens 3962 → 3961, OpenViking 37172 → 37180, archify 61772 → 61816, dsh-web-ui 7558 → 7560, ouroboros 5839 → 5839, colleague-skill 24710 → 24711, dsh-agent-teams 1633 → 1634 — all negligible. Exception: `deepseek-ai/deepseek-harness` README shows 104.5k vs live 223654 — recommend refreshing that cell on next star-update pass.
- Broken links: none confirmed (npm 403 is curl bot-blocking, page exists).

## Proposed Patches

None (no edits made; optional official-repo star refresh left to maintainer workflow).

## Next Steps

No action required. Optionally refresh the official harness star cell when convenient.

## Sources

- Local: `README.md`, `README.zh.md`
- `gh api repos/<owner/repo> --jq .stargazers_count` for 8 sampled rows
- `curl -w "%{http_code}"` on 4 GitHub URLs + 1 npm URL

<sub>model: opencode/muse-spark-1.3-contributor-free</sub>
