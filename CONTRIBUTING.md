# Contributing Guide

[中文](CONTRIBUTING.zh.md) | English

Thanks for helping grow Awesome DeepSeek Harness!

> ⭐ **2-second favor first**: Star this repo — you'll get notified of 2–3 new plugins each week and help others discover this list via GitHub recommendations. Sharing once = 10× exposure: ([Share on X](https://twitter.com/intent/tweet?text=Awesome%20DeepSeek%20Harness%20%E2%80%94%20Everything%20is%20a%20Plugin&url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness) · [Reddit](https://www.reddit.com/submit?url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness) · [Discord](https://discord.gg/Ycq5dCaS4))

---

## Criteria

- [ ] **DSH relevance**: Plugin, tool, skill, tutorial or app built on `deepseek-harness` / `dsh`. Must explain the relation in README/description (e.g., installable via `dsh plugin add ...`, provides `dsh.bundle` / `skill` / `dsh-client`).
- [ ] **Installable, runnable, and purposeful**: Has an install command, version tag (`v0.1.0`) or npm/Git release, works out-of-the-box. Avoid empty repos or screenshot-only projects.
- [ ] **Open source or at least publicly accessible**: Public repo with LICENSE (MIT/Apache-2.0/CC0 recommended) and a README.
- [ ] **`dsh-plugin` topic** (strongly required for plugins): Add `dsh-plugin` in repo Settings → Topics for discoverability. More visibility = more stars.
- [ ] **Unique and de-duplicated**: Each project appears only once, in the most fitting category (see table below). If cross-category, pick where users would look first.
- [ ] **Quality bar**: Clear description, one-sentence value proposition; include GIF/screenshot for UI. No meaningless forks, plagiarized or rename-only wrappers.

---

## How to Add (3 minutes)

### 1. Fork & Branch

```bash
gh repo fork awesome-deepseekharness/awesome-deepseek-harness --clone
git checkout -b add-owner-repo
```

### 2. Choose Category

| Category | What goes there |
| --- | --- |
| 🛍️ Marketplaces & Discovery | Marketplaces, discovery, indexes |
| 👁️ Vision | Vision, OCR, grounding |
| 🌐 Web & Browser | Search, browser, networking |
| 🧠 Memory | Memory, context, knowledge graph |
| 🎨 Web UI, Skins & Desktop Pets | Web UI enhancements, skins, pets, GenUI |
| 🖥️ TUI & Desktop | Terminal UI, desktop shells, launchers |
| 🧩 Tools, Workflows & Presets | Tools, workflows, presets, stats, notifications |
| 📚 Skills | Skills / skill packs |
| 🚀 Apps & Runtimes Built on DSH | Full apps/runtimes integrating DSH |
| 🧱 Core Infrastructure | Official infrastructure |
| 🎓 Learning & Guides | Tutorials, handbooks, principles |
| New category | If none fits, create `### 🆕 Your Category` with rationale |

### 3. Add One Row

**`README.md` (required, English)** — find the category table and insert in alphabetical or popularity order:

```markdown
| [owner/repo](https://github.com/owner/repo) | One-sentence description (what it does for dsh, installable via `dsh plugin add ...`) | 123 |
```

**`README.zh.md` (required, Chinese, same category/position)** — insert the Chinese description:

```markdown
| [owner/repo](https://github.com/owner/repo) | 一句话中文说明（面向 dsh 的作用 + 安装方式） | 123 |
```

**Stars column ⭐**: Use current GitHub star count (approx. is fine, maintainers refresh periodically). Don't use `0` unless it truly is 0; get it via `gh api repos/owner/repo --jq .stargazers_count`.

> ⚠️ **Bilingual is mandatory**: PRs touching only `README.md` without `README.zh.md` will be marked as request changes. CI checks this.

### 4. PR Title & Body

**Title convention** (pick one, for quick triage):

- `Add owner/repo to Category`
- `docs: add owner/repo to Category`

**Body must include** (copy from PR template checklist):

- Relation to DSH (1–2 sentences)
- Verified install command
- License, `dsh-plugin` topic status, npm/version
- GIF/screenshot for UI plugins
- Confirmation of no duplicate

Well-formed PRs are checked within 24h and usually merged in <24h.

---

## PR Content Guidelines (must-read)

> Following this gets you merged faster and earns more stars for your plugin (clear description = trust).

### ✅ Good Example

```markdown
Title: Add dustinmoon78/dsh-usage-stats to Tools/Workflows/Presets

Body:
- **Relation to DSH**: DSH Web plugin (injects webServer/sessionPersistence),
  `dsh plugin --profile web add dsh-usage-stats` verified, dsh-plugin topic set.
- **Install**: `dsh plugin --profile web add dustinmoon78/dsh-usage-stats` (npm: dsh-usage-stats@0.1.8)
- **License**: MIT · **Stars**: 3 (as of 2026-08-27)
- **Why here**: Tools/Workflows fits better than Memory.
```

Corresponding row:

```markdown
| [dustinmoon78/dsh-usage-stats](https://github.com/dustinmoon78/dsh-usage-stats) | DSH usage stats: aggregated token usage (overview/by-model/by-day) + cost estimate in Settings | 3 |
```

### ❌ Bad Example

```markdown
Title: add my plugin
Body: (empty)
Row: | [my/repo](https://github.com/my/repo) | my cool plugin |  |
```

**Problems**: Missing category, missing DSH relation, no verified install, no Chinese row, empty star count.

### Checklist (auto-included via PR template)

- [ ] Added one row to **both** `README.md` **and** `README.zh.md` at the correct category/position with format `| [owner/repo](link) | description | ⭐ |`
- [ ] Title follows `Add owner/repo to Category`
- [ ] Body includes: DSH relation + verified install + License/topic + version
- [ ] Star count verified (`gh api repos/owner/repo --jq .stargazers_count`)
- [ ] No duplicate (searched `owner/repo` in both READMEs)
- [ ] One PR adds one project only
- [ ] Starred this repo ⭐ (you'll get update notifications and reviews go faster) and considered sharing

---

## Review & Merge

- **Timeline**: Well-formed PRs are merged within 24–48h; those needing fixes get a `request changes` comment. If no response in 7 days, the PR may be closed (reopen anytime).
- **Conflicts**: Multiple PRs editing the tail of the same table will conflict. Maintainers batch-rebase and keep all entries — you don't need to fix it manually, but keeping a PR to one row reduces conflict risk.
- **Merge method**: Squash merge, message `Add owner/repo (#PR)`.
- **Star refresh**: Maintainers periodically refresh the whole table; star count at submission time is fine.

---

## Share & Visibility Tips

> A few small habits help your plugin get noticed and keep this list useful for everyone.

1. At the bottom of your plugin README, consider adding `Found via [Awesome DSH](https://github.com/awesome-deepseekharness/awesome-deepseek-harness) — star if useful` — readers who found you through the list often star both, which helps with discovery.
2. In your PR description, note that the repo has the `dsh-plugin` topic and a brief star count — it helps reviewers quickly see it's active and easy to find.
3. Early contributions are especially visible while the list is growing — submitting now means your project stays near the top as we organize.
4. Starring the list subscribes you to updates (2–3 new plugins weekly), so you won't miss relevant additions.
5. After merge, if you like, share with:

   - X: `https://twitter.com/intent/tweet?text=My%20plugin%20owner/repo%20is%20now%20on%20Awesome%20DSH!&url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness`
   - Reddit: `https://www.reddit.com/submit?url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness`
   - Discord: Paste in https://discord.gg/Ycq5dCaS4 #showcase

---

## Notes

- Keep the `⭐` column, approx. is fine
- One project appears only once, in the most fitting category
- Prefer repos with the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic
- Star `0` is fine at submission — we encourage early-stage projects (early listing = early exposure)
- Need help? @maintainer in the PR or ask in [Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)
