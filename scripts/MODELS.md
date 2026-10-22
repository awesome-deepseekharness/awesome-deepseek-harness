# Automatic OpenCode free-model selection

The curator, ambiguous-PR classifier and independent reviewer share `opencode-free.mjs`.

1. Run `opencode models opencode --refresh --verbose`. If refresh fails, read the CLI's existing catalog with `--verbose`.
2. Keep only models with explicitly zero input/output/cache/tier prices and text + tool-call capabilities. A `-free` suffix alone is not sufficient.
3. Sort by release date, then reasoning support and context size. This prefers recent capable models; it is not an intelligence benchmark.
4. Make a short real request in a temporary directory with every tool approval-gated (`permission: { "*": "ask" }`). Non-interactive `opencode run` automatically rejects approval requests; the runner must never pass `--auto`. Only the expected assistant response passes.
5. Run the task with an explicit `--dir` for the intended project and both `model` and `small_model` set to that free model. On model errors, timeouts or invalid output, try the next current candidate. A free-tier agent/tool-profile rejection stops immediately with a diagnostic instead of repeating the same 403 across the catalog. Each process remembers model failures and successful probes; no obsolete model roster is committed.

The curator has a nine-minute selection/task budget; the reviewer has six minutes. Individual task attempts are bounded. A missing or failed independent reviewer leaves `REQUEST_CHANGES`; it cannot inherit approval from the curator. Curator reports must be freshly generated and contain Sources.

## Compatibility and the free-tier 403

The GitHub Actions logs can show success even when every AI attempt failed: the curator intentionally writes a deterministic fallback report. Check for `[models] Task succeeded` rather than relying on the workflow conclusion.

With `opencode-ai` 1.19.3, a deny-all probe removes the coding tool definitions and triggers `OpenCode's free tier can only be used from within OpenCode`, even though the request comes from the official CLI. Approval-gating keeps the normal tool definitions without allowing their execution in a headless probe. Do not fix this by allowing all probe tools, spoofing client headers, or selecting a paid fallback. Upstream reports and investigation: [#53347](https://github.com/anomalyco/opencode/issues/53347).

The committed agents use the V1 `permission` mapping accepted by `opencode-ai` 1.19.3. The plural `permissions` mapping is silently treated as an unrelated option by that CLI, not as access rules. The reviewer explicitly denies file-editing tools; its shell access remains necessary for the existing `git diff` and `gh api` checks (it is not an OS-level read-only sandbox). These configurations are not a claim of OpenCode V2 compatibility.

## Local commands

Install the current CLI with `npm install -g opencode-ai`, then:

```sh
npm run models:list
npm run models:check
npm run test:models
node scripts/opencode-auto.mjs --agent reviewer --prompt-file request.md --output result.json
```

`models:check` makes an actual free-model request but does not run the curator or post to GitHub. The task runner writes the selected model and validated final-step assistant text to the output JSON; planning text before tool calls is not part of the reviewer decision. On Windows, it resolves the npm-installed native executable to avoid passing prompts through a shell; custom installations can supply `OPENCODE_BIN`.

Prices and availability are the current CLI provider's metadata, not a permanent promise from this repository. If the CLI cannot identify any zero-cost candidate, the automation stops model attempts and retains its deterministic/report fallback; it never substitutes a paid model.
