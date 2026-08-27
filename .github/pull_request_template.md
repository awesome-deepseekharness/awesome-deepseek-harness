<!-- 感谢你为 Awesome DeepSeek Harness 贡献！请按此模板填写，规范的 PR 24h 内优先合并。 -->
<!-- Thanks for contributing! Fill this template — well-formed PRs get merged within 24h. -->

## Project / 项目

| Field | Value |
| --- | --- |
| **Repo** | `owner/repo` → https://github.com/owner/repo |
| **Category** | <!-- 例如：🧩 Tools, Workflows & Presets / 🎨 Web UI, Skins & Desktop Pets --> |
| **Stars (verified)** | <!-- 运行: gh api repos/owner/repo --jq .stargazers_count --> |
| **Language (EN)** | <!-- 一句话英文描述，用于 README.md --> |
| **Language (ZH)** | <!-- 一句话中文描述，用于 README.zh.md --> |

> ⚠️ **Bilingual required / 双语必填**：必须同时更新 `README.md` **和** `README.zh.md` 同一分类的同一位置。只改一份会被 request changes。

## Relationship to DSH / 与 DSH 的关系

<!-- 1–2 句说明：这是 dsh 的什么类型（plugin / skill / bundle / app），如何与 harness 集成（例如 injects webServer / provides dsh.bundle / SKILL.md），为何属于上面的分类 -->

## Install & Verification / 安装与验证

```bash
# 已本地验证可运行的安装命令（必填）
dsh plugin --profile web add git+https://github.com/owner/repo
# 或
dsh plugin add owner/repo
```

- [ ] 已本地验证安装成功 / Verified locally
- [ ] 仓库已打 `dsh-plugin` topic / `dsh-plugin` topic added (Settings → Topics)
- [ ] 含 LICENSE 与 README / Has LICENSE & README
- [ ] 已发布版本/Tag（如 `v0.1.0` 或 npm 包）/ Has release/tag

## Screenshot / Demo (UI 插件必填)

<!-- 拖入 GIF/截图，若无可删除此节 -->

## Checklist / 检查清单

- [ ] 标题符合 `Add owner/repo to Category` 或 `docs: add owner/repo to Category`
- [ ] `README.md` 和 `README.zh.md` 已同步添加一行，位置正确，格式 `| [owner/repo](link) | description | ⭐ |`
- [ ] 星标数已核实，非 0 则填真实值
- [ ] 无重复条目（已搜索 `owner/repo` 在两份 README 中不存在）
- [ ] 一个 PR 只添加一个项目
- [ ] 已给本仓库点 Star ⭐（会收到更新提醒，也让评审更快）并考虑分享：[X](https://twitter.com/intent/tweet?text=Awesome%20DeepSeek%20Harness%20%E2%80%94%20Everything%20is%20a%20Plugin&url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness) · [Reddit](https://www.reddit.com/submit?url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness) · [Discord](https://discord.gg/Ycq5dCaS4)

## Additional Notes / 备注

<!-- 可选：分类选择的理由、与已有项目的区别、后续计划等 -->

---

> 💡 **小技巧**：在你的插件 README 底部加上 `Found via [Awesome DSH](https://github.com/awesome-deepseekharness/awesome-deepseek-harness) — star if useful` 对双方曝光都有帮助。若 48 小时内无人评审，欢迎在 PR 里友善地 @`hdjekuue` 或其他维护者。
