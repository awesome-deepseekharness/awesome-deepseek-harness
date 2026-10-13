# Curator Report — 2026-10-10T08:32 UTC (model: fallback)

## Summary
No LLM run (no current free CLI model completed the task). This is a deterministic health snapshot. Trigger opencode with free-model traversal to get AI triage.

## Repo Health
- Found 146 project rows in README.md. Sample: | [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market) | The plugin | | [bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugi
- Star drift: not checked (fallback). Run `gh api repos/owner/repo --jq .stargazers_count` manually for 2–3 rows.
- Duplicates: not checked.

## PR Triage
- No PR event.

## Issue Triage
- No issue event.

## Proposed Patches
- None (fallback).

## Next Steps
- To enable AI: ensure opencode installed and run `node scripts/curate.mjs` (or wait for scheduled Action). Free candidates come from the current OpenCode CLI model metadata.
- Reviewer: verify any AI suggestion before merging.

## Sources
- Local: README.md, README.zh.md, CONTRIBUTING.md
- Live free models: `opencode models opencode --refresh --verbose`

---
*Generated at 2026-10-10T08:32:09.450Z UTC. Set OPENCODE_API_KEY or just use public provider to enable AI.*
