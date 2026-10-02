# Automatic OpenCode free-model selection

The curator, ambiguous-PR classifier and independent reviewer share `opencode-free.mjs`.

1. Run `opencode models opencode --refresh --verbose`. If refresh fails, read the CLI's existing catalog with `--verbose`.
2. Keep only models with explicitly zero input/output/cache/tier prices and text + tool-call capabilities. A `-free` suffix alone is not sufficient.
3. Sort by release date, then reasoning support and context size. This prefers recent capable models; it is not an intelligence benchmark.
4. Make a short real request in a temporary directory with tools denied. Only the expected assistant response passes.
5. Run the task with both `model` and `small_model` set to that free model. On errors, timeouts or invalid output, try the next current candidate. Each process remembers failures and successful probes; no obsolete model roster is committed.

The curator has a nine-minute selection/task budget; the reviewer has six minutes. Individual task attempts are bounded. A missing or failed independent reviewer leaves `REQUEST_CHANGES`; it cannot inherit approval from the curator. Curator reports must be freshly generated and contain Sources.

## Local commands

Install the current CLI with `npm install -g opencode-ai`, then:

```sh
npm run models:list
npm run models:check
npm run test:models
node scripts/opencode-auto.mjs --agent reviewer --prompt-file request.md --output result.json
```

`models:check` makes an actual free-model request but does not run the curator or post to GitHub. The task runner writes the selected model and validated assistant text to the output JSON. On Windows, it resolves the npm-installed native executable to avoid passing prompts through a shell; custom installations can supply `OPENCODE_BIN`.

Prices and availability are the current CLI provider's metadata, not a permanent promise from this repository. If the CLI cannot identify any zero-cost candidate, the automation stops model attempts and retains its deterministic/report fallback; it never substitutes a paid model.
