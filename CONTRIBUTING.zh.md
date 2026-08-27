# 贡献指南

[English](CONTRIBUTING.md) | 中文

感谢你帮助完善 Awesome DeepSeek Harness！

> ⭐ **先做 2 秒小动作**：右上角点 **Star**，你会自动收到每周新插件更新提醒，也让更多开发者通过 GitHub 推荐发现本列表与你的插件。分享一次 = 10× 曝光：([X 分享](https://twitter.com/intent/tweet?text=Awesome%20DeepSeek%20Harness%20%E2%80%94%20%E4%B8%87%E7%89%A9%E7%9A%86%E5%8F%AF%E6%8F%92%E4%BB%B6&url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness) · [Reddit](https://www.reddit.com/submit?url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness) · [Discord](https://discord.gg/Ycq5dCaS4))

---

## 收录标准

- [ ] **DSH 相关**：插件、工具、技能、教程或基于 DSH 的应用。需在 README/描述中明确说明与 `deepseek-harness` / `dsh` 的关系（例如 `dsh plugin add ...` 可安装、或提供 `dsh.bundle` / `skill` / `dsh-client` 等）。
- [ ] **可安装、可运行、有明确用途**：有安装命令、版本标签（`v0.1.0` 等）或 npm/Git 发布，开箱可用；避免仅有空仓库或截图无代码。
- [ ] **开源或至少公开可访问**：仓库 public，含 LICENSE（推荐 MIT/Apache-2.0/CC0），有 README 说明。
- [ ] **已打 `dsh-plugin` topic**（插件类强要求）：前往仓库 Settings → Topics 添加 `dsh-plugin`，便于被市场与本列表发现。权威性与可发现性 = 更多 Star。
- [ ] **单一、去重**：一个项目只出现一次，放在最贴切的分类（见下表）；若跨分类，选用户最可能寻找的那个。
- [ ] **质量门槛**：有清晰描述、一句话说明价值；有 UI 的请附动图/截图。无意义 fork、抄袭、仅改名的 wrapper 不收录。

---

## 如何添加（3 分钟）

### 1. Fork & Branch

```bash
gh repo fork awesome-deepseekharness/awesome-deepseek-harness --clone
git checkout -b add-owner-repo
```

### 2. 选分类

| 分类 | 放什么 |
| --- | --- |
| 🛍️ Marketplaces & Discovery | 市场、发现、索引类 |
| 👁️ Vision | 视觉、OCR、grounding |
| 🌐 Web & Browser | 搜索、浏览器、网络 |
| 🧠 Memory | 记忆、上下文、知识图谱 |
| 🎨 Web UI, Skins & Desktop Pets | Web UI 增强、皮肤、宠物、GenUI |
| 🖥️ TUI & Desktop | 终端 UI、桌面壳、启动器 |
| 🧩 Tools, Workflows & Presets | 工具、工作流、预设、统计、通知 |
| 📚 Skills | Skill / 技能包 |
| 🚀 Apps & Runtimes Built on DSH | 集成 DSH 的完整应用/运行时 |
| 🧱 Core Infrastructure | 官方基础设施 |
| 🎓 Learning & Guides | 教程、手册、原理 |
| 新增分类 | 若无合适分类，可新建 `### 🆕 Your Category` 并说明理由 |

### 3. 按格式添加一行

**`README.md`（必填，英文）** — 找到对应表格，按字母或热度顺序插入：

```markdown
| [owner/repo](https://github.com/owner/repo) | One-sentence description (what it does for dsh, installable via `dsh plugin add ...`) | 123 |
```

**`README.zh.md`（必填，中文，同一分类/位置）** — 插入中文描述：

```markdown
| [owner/repo](https://github.com/owner/repo) | 一句话中文说明（面向 dsh 的作用 + 安装方式） | 123 |
```

**星标列 ⭐**：填当前 GitHub star 数（大致准确即可，维护者会定期刷新）。不要写 `0` 除非确实 0；从 `gh api repos/owner/repo --jq .stargazers_count` 获取。

> ⚠️ **双语是硬性要求**：只改 `README.md` 而不改 `README.zh.md` 的 PR 会被要求补齐。机器人会检测。

### 4. PR 标题与描述

**标题规范**（任选一，用于快速检索）：

- `Add owner/repo to Category`
- `docs: add owner/repo to Category`

**描述必须包含**（复制 PR 模板 checklist）：

- 与 DSH 的关系（1–2 句）
- 安装命令（已验证可运行）
- License、是否已打 `dsh-plugin` topic、npm/版本信息
- 若是 UI 插件：动图/截图
- 确认无重复条目

提交后机器人会在 24h 内检查；格式规范者 <24h 合并。

---

## PR 内容规范化指引（必读）

> 遵循此指引可显著提升合并速度，并让你的插件获得更多 Star（规范的描述 = 信任感）。

### ✅ 好例子

```markdown
Title: Add dustinmoon78/dsh-usage-stats to Tools/Workflows/Presets

Body:
- **Relation to DSH**: DSH Web plugin (injects webServer/sessionPersistence),
  `dsh plugin --profile web add dsh-usage-stats` verified, dsh-plugin topic set.
- **Install**: `dsh plugin --profile web add dustinmoon78/dsh-usage-stats` (npm: dsh-usage-stats@0.1.8)
- **License**: MIT · **Stars**: 3 (as of 2026-08-27)
- **Why here**: Tools/Workflows fits better than Memory.
```

对应表格行：

```markdown
| [dustinmoon78/dsh-usage-stats](https://github.com/dustinmoon78/dsh-usage-stats) | DSH usage stats: aggregated token usage (overview/by-model/by-day) + cost estimate in Settings | 3 |
```

### ❌ 反面例子

```markdown
Title: add my plugin
Body: (empty)
Row: | [my/repo](https://github.com/my/repo) | my cool plugin |  |
```

**问题**：缺分类、缺与 DSH 关系、无安装验证、缺中文、star 为空。

### 检查清单（PR 模板自动带）

- [ ] 我已在 `README.md` **和** `README.zh.md` 同步添加（同一分类、同一位置）
- [ ] 标题符合 `Add owner/repo to Category` 规范
- [ ] 描述含：与 DSH 关系 + 安装命令（已本地验证）+ License/topic + 版本
- [ ] 星标数已核实（`gh api repos/owner/repo --jq .stargazers_count`）
- [ ] 无重复条目（搜索 `owner/repo` 在两份 README 中均不存在）
- [ ] 一个 PR 只添加一个项目
- [ ] 已给本仓库点 Star ⭐（会收到更新提醒，也让评审更快）并考虑分享

---

## 审核与合并

- **时效**：规范 PR 24–48h 内合并；需补齐的会评论 `request changes`，作者 7 天内未响应可能被关闭（可重开）。
- **冲突处理**：多个 PR 同时改同一表格尾部会产生冲突。维护者会批量 rebase 并保留所有条目，无需你手动解决（但保持 PR 仅改一行可降低冲突概率）。
- **合并方式**：Squash merge，commit message 保留 `Add owner/repo (#PR)`。
- **Star 刷新**：维护者定期用脚本刷新全表 star 数；PR 中的 star 数以提交时为准即可。

---

## 分享与曝光小技巧

> 几个小习惯，能让你的插件更容易被看到，也让本列表对大家更有用。

1. 在你的插件 README 底部，可以顺手加一句 `Found via [Awesome DSH](https://github.com/awesome-deepseekharness/awesome-deepseek-harness) — star if useful` — 通过本列表找到你的读者，往往也会顺手 star，双方曝光都会更好。
2. 在 PR 描述里提一下仓库已打 `dsh-plugin` topic，以及大致的 star 数，方便 reviewer 快速判断项目活跃且易于发现。
3. 列表还在早期阶段，现在提交的项目更容易被看到，也更容易在整理时保持靠前位置。
4. Star 本列表后，GitHub 会在每周新增 2–3 个插件时提醒你，不会错过相关更新。
5. 合并后如愿意分享：

   - X: `https://twitter.com/intent/tweet?text=My%20plugin%20owner/repo%20is%20now%20on%20Awesome%20DSH!&url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness`
   - Reddit: `https://www.reddit.com/submit?url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness`
   - Discord: 直接贴到 https://discord.gg/Ycq5dCaS4 #showcase

---

## 注意事项

- 请保留星标列 `⭐`，大致准确即可
- 一个项目只出现一次，放在最贴切的分类
- 优先收录打上了 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic 的仓库
- 若你的插件刚发布 star 为 0，完全可以提交 — 我们鼓励早期项目（早期收录 = 早期曝光）
- 如需帮助，在 PR 中 @maintainer 或去 [Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) 提问
