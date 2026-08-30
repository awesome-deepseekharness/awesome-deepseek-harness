<div align="center">

# Awesome DeepSeek Harness (dsh)

**万物皆可插件。Everything is a Plugin.**

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(`dsh`)生态的精选项目合集——插件、工具、技能与资源。dsh 是 DeepSeek AI 开源的 agent harness,基于 [Cordis](https://github.com/cordiverse/cordis) 构建。

[English](README.md) | 中文

[官方仓库](https://github.com/deepseek-ai/deepseek-harness) · [官方网站](https://deepseek.com/harness) · [Discord](https://discord.gg/Ycq5dCaS4) · [官方讨论区](https://github.com/deepseek-ai/deepseek-harness/discussions) · [dsh-plugin 话题](https://github.com/topics/dsh-plugin) · [官方动态跟踪](https://github.com/awesome-deepseekharness/deepseek-official-tracker)

</div>

<p align="center">
  <a href="https://github.com/awesome-deepseekharness/awesome-deepseek-harness"><img src="https://img.shields.io/github/stars/awesome-deepseekharness/awesome-deepseek-harness?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/awesome-deepseekharness/awesome-deepseek-harness/fork"><img src="https://img.shields.io/github/forks/awesome-deepseekharness/awesome-deepseek-harness?style=social" alt="GitHub forks"></a>
  <img src="https://img.shields.io/github/last-commit/awesome-deepseekharness/awesome-deepseek-harness" alt="last commit">
  <a href="CONTRIBUTING.zh.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"></a>
  <a href="https://github.com/topics/dsh-plugin"><img src="https://img.shields.io/badge/topic-dsh--plugin-ff7a45" alt="dsh-plugin topic"></a>
</p>

> ⭐ **这个列表帮你省了 1 小时找插件？点个 Star 吧 — 2 秒钟，却是对所有插件作者最大的支持。**
> 你的 ⭐ 不只是收藏：它会让 GitHub 更优先推荐本列表，从而让这里的每一个插件被更多 1000+ dsh 开发者看到；同时你会自动收到每周 2–3 个新插件的更新提醒。目前 **3 → 100 颗星是第一里程碑（还差 97）**，早期 Star 的用户将决定后续收录方向。成为前 100 个 Star 吧 — 你的名字会出现在 Star 历史里。
>
> **顺手分享，功德 +10×：** 你做/喜欢的插件在列表里？一次分享 = 10 倍曝光。[一键分享到 X](https://twitter.com/intent/tweet?text=Awesome%20DeepSeek%20Harness%20%E2%80%94%20%E4%B8%87%E7%89%A9%E7%9A%86%E5%8F%AF%E6%8F%92%E4%BB%B6%20%E2%9A%A1%20%E7%B2%BE%E9%80%89%20dsh%20%E6%8F%92%E4%BB%B6%E3%80%81%E5%B7%A5%E5%85%B7%E4%B8%8E%E6%8A%80%E8%83%BD&url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness&hashtags=dsh,deepseek) · [分享到 Reddit](https://www.reddit.com/submit?url=https://github.com/awesome-deepseekharness/awesome-deepseek-harness&title=Awesome%20DeepSeek%20Harness%20%E2%80%94%20%E4%B8%87%E7%89%A9%E7%9A%86%E5%8F%AF%E6%8F%92%E4%BB%B6%E7%B2%BE%E9%80%89) · [去 Discord 讨论](https://discord.gg/Ycq5dCaS4) · [复制链接](https://github.com/awesome-deepseekharness/awesome-deepseek-harness)
>
> *小提示：配上动图/演示的 README 往往更容易被关注。给仓库打上 `dsh-plugin` 便于被发现，Star 本列表也能及时收到新插件提醒。*

## 什么是 dsh?

DeepSeek Harness 是 DeepSeek AI 开源的 agent harness。它的核心哲学是 **everything is a plugin(万物皆可插件)**:模型适配器、工具注册表、会话日志、权限模型,甚至 agent loop 本身都是可替换的插件,「没有需要打补丁的特权核心」。运行时基于 [Cordis](https://github.com/cordiverse/cordis)(时空可组合性元框架)构建。

| 模式 | 说明 |
| --- | --- |
| **Standard** | 完整编码 agent:文件编辑、shell、文件/网页搜索、skills、规划、目标、子代理、工作流 |
| **Code** | Standard 全部能力 + 通过 Code Mode SDK 以 TypeScript 程序组合多步操作 |
| **Minimal** | 双工具编码 agent(持久 bash + str_replace_editor),用于模型基准评测 |
| **Creator** | 运行时检查、内存内插件实验、组合新模式,用于编写自定义 agent 预设 |

> ⚠️ **开发者预览版**:官方明确警告将有破坏性兼容变更,API 与插件契约可能会变化。

---

## 📦 插件(核心内容)

> 想上架自己的插件?给仓库打上 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题标签即可被发现。

### 🛍️ 插件市场与发现

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market) | DSH 内置插件市场:浏览、搜索、一键安装 | 156 |
| [bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace) | 在 DSH Web GUI 中一键浏览、安装与更新全部 GitHub `dsh-plugin` 插件 | 46 |
| [Nagi-ovo/dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | 帮 DSH 搜索、安装并验证插件的 Skill | 78 |
| [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | 自动扫描 dsh 插件候选的前部索引仓库(Radar) | 908 |
| [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | 700+ 插件,只通过扩展接缝注册,不改 agent-loop 骨架 | 45 |

### 👁️ 视觉插件

让纯文本模型「看得见」——DSH 生态最热门的品类。

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [liustack/modlens](https://github.com/liustack/modlens) | 全网第一个 DSH 视觉插件:粘贴图片即得结构化 JSON 证据(OCR、版面、语义) | 1525 |
| [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) | 带意图的图片问答、长截图 OCR、UI 还原、grounding、pixel diff、Artifacts、Web UI | 384 |
| [Anionex/agent-vision-toolkit](https://github.com/Anionex/agent-vision-toolkit) | 纯文本模型的视觉工具箱与技能:多图理解、图片问答、前端 UI 还原、GUI 自动化 | 871 |
| [ysr666/dsh-vision-router](https://github.com/ysr666/dsh-vision-router) | 内置免费视觉链(无需 key)+ 像素级视觉工具,一键安装,无需 Python | 94 |
| [QwenLM/Qwen-MM-Plugins](https://github.com/QwenLM/Qwen-MM-Plugins) | 让任意 agent harness 具备多模态能力(跨 harness) | 2549 |

### 🌐 Web 与浏览器

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [liustack/modsearch](https://github.com/liustack/modsearch) | DSH 的 web 插件:问网页或 X,拿回结构化 JSON 证据(搜索、抓取、引用) | 98 |
| [Lum1104/dsh-browser](https://github.com/Lum1104/dsh-browser) | Chrome 侧边栏扩展,让 DSH 直接操控浏览器——无需视觉能力 | 114 |
| [taxueseek/argo](https://github.com/taxueseek/argo) | 为 agent 打造的搜索工具:中/英/学术/代码/购物/金融/新闻/百科 | 73 |

### 🧠 记忆插件

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [csyangwen/dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) | 跨会话长期记忆 + 后台自我进化:五轨记忆、git 分支感知、技能自我进化、四轨待办 | 68 |
| [adoresever/graph-memory](https://github.com/adoresever/graph-memory) | 知识图谱记忆:从对话抽取三元组,上下文压缩 75%,跨会话经验复用 | 513 |
| [mnemon-dev/mnemon](https://github.com/mnemon-dev/mnemon) | LLM 监督的持久记忆:图召回、跨会话知识,单二进制,兼容 DSH/Claude Code/OpenClaw | 443 |
| [tinqiao-oss/engramory](https://github.com/tinqiao-oss/engramory) | 可移植的 agent 记忆协议:常驻规则加载、策展纪律 + 参考规范 | 152 |
| [text2future/flowix](https://github.com/text2future/flowix) | 给你笔记、给 agent 记忆 | 280 |
| [Ariestar/sivtr](https://github.com/Ariestar/sivtr) | 人与 agent 的统一记忆工作区 | 131 |

### 🎨 Web UI、皮肤与桌面宠物

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | DSH Web UI 插件与皮肤合集:任务看板、git 图、右侧面板、移动端 UI、宠物、实时 token 统计、皮肤中心 | 2250 |
| [Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web「鲸鱼娘」皮肤系列(深海女仆工坊) | 742 |
| [vlln/whale-girl](https://github.com/vlln/whale-girl) | DSH Web GUI 桌面宠物插件(QQ 宠物形态):可拖拽/投喂/玩耍 | 151 |
| [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | 侧边栏完整工作台:文件渲染编辑/终端/Git/子代理,支持三方扩展页面 | 911 |
| [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | 选中批注插件:选文字→批注→随消息发送 | 45 |
| [Nagi-ovo/dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | 把 DSH 变成 2005 年门户网站:恶搞广告、小游戏与弹窗 | 371 |
| [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | 在 DSH 对话中生成交互式可视化卡片 | 88 |
| [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) | GenUI:内联交互式 UI 组件(layout、图表、表单、mermaid、3D)+ 动作事件回环 | 87 |
| [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil 设计预览与编辑插件 | 71 |
| [zizaiwo/dsh_plugins](https://github.com/zizaiwo/dsh_plugins) | dsh 侧边栏会话分类插件：零配置接管官方工作区浏览器，按自定义分类文件夹管理会话（拖拽归类/分类内建会话/每工作区独立） | 0 |
| [lcsdg/dsh-quick-prompts](https://github.com/lcsdg/dsh-quick-prompts) | 输入框上方的快捷指令胶囊栏：按分类存常用 prompt，橙色高亮占位符，两栏管理，分类记忆按会话独立持久化 | 0 |
| [Moonshile/moonshile-dsh-plugins](https://github.com/Moonshile/moonshile-dsh-plugins) | 侧边栏工作区每日按最近活动排序一次，当天顺序稳定 | 0 |

### 🖥️ TUI 与桌面端

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | Claude Code 风格全屏交互终端插件:像素鲸鱼顶栏、思考流式展开、双击 Esc 回滚、TPS 仪表 | 1047 |
| [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | 交互式终端 UI + harness 工作流:增加 TDD、证据门、视觉图像模块 | 143 |
| [anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) | 为 DSH 生态打造的现代化桌面端体验 | 3596 |
| [hust-open-atom-club/oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) | DSH 社区发行版:TUI、桌面端与 Web UI 三种形态统一,分层安装 | 176 |
| [vibeinging/deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) | 本地 AI 桌面工作区:Sessions、项目、文件、网页研究、插件、Office 工件 | 111 |
| [ChisaAlter/Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | DSH Web UI 的 Electron 桌面壳,支持主题与背景图 | 74 |
| [Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | Windows 轻量启动器:开机静默自启 + WebView2 窗口 | 87 |
| [Jensen-Yao/dsh-plus-plus](https://github.com/Jensen-Yao/dsh-plus-plus) | Windows WPF 桌面控制台：一键启停 dsh web、手机入口（同一 Wi-Fi/自定义域名/Tailscale）、防火墙放行、存储位置管理与实时日志，深浅双主题 | 0 |

### 🧩 工具、工作流与预设

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [xiaobright/dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) | 两阶段 DSH 预设:先 Minimal 对齐启动,再补全 Standard 工具 | 1336 |
| [icetomoyo/dsh_workflow](https://github.com/icetomoyo/dsh_workflow) | 把 DSH 一次性多 Agent 调度升级为可生成/保存/治理/观察/恢复的 Workflow 层 | 55 |
| [liceses/dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset) | 一键安装「极简模式 (Git Bash)」预设,让 Windows 极简模式真正可用 | 48 |
| [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex 风格 `@file` 引用:在 composer 中搜索工作区文件并附加内容 | 169 |
| [omdsh-dev/dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) | 从 Web GUI 直接在 VS Code 打开 DSH 工作区目录 | 41 |
| [omdsh-dev/dsh-notification](https://github.com/omdsh-dev/dsh-notification) | 回合完成桌面通知,支持按结果类型与关键词规则 | 43 |
| [pitetow/dsh-notify-on-complete](https://github.com/pitetow/dsh-notify-on-complete) | 零依赖桌面通知:运行结束/提问/审批时提醒 | 4 |
| [hxyz486/dsh-archived-conversations](https://github.com/hxyz486/dsh-archived-conversations) | 在设置页查看、恢复与删除归档会话 | 6 |
| [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) | 对话与代码状态回退,基于持久化 Change Ledger | 50 |
| [william-jin-cmu/dsh-evolve](https://github.com/william-jin-cmu/dsh-evolve) | 自进化插件:session 内热挂载/卸载 Cordis 插件,重启自动恢复 | 5 |
| [Francis-Xavier-code/dsh-balance-plugin](https://github.com/Francis-Xavier-code/dsh-balance-plugin) | DeepSeek 余额监控与用量统计 + 官方充值入口 | 7 |
| [Cassius0924/dsh-usage-dashboard](https://github.com/Cassius0924/dsh-usage-dashboard) | DeepSeek 额度与用量仪表盘 | 4 |
| [dustinmoon78/dsh-usage-stats](https://github.com/dustinmoon78/dsh-usage-stats) | DSH 用量统计：聚合会话 token 用量（总览/按模型/按天）+ 单价费用估算 + 设置页展示 | 0 |
| [null5069/dsh-better-stats](https://github.com/null5069/dsh-better-stats) | DSH Web 输入框增强统计条：官方 CNY 计价（峰谷时段、分模型）、实时结算、LLM/工具实时计时、余额直连、预算预警 | 2 |
| [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams 多代理协作插件 | 290 |
| [btspoony/mstar-harness](https://github.com/btspoony/mstar-harness) | Skill 驱动的 Harness/Loop 工程工作流 Agent 插件 | 43 |
| [weshopai/weshop-dsh-plugin](https://github.com/weshopai/weshop-dsh-plugin) | 原生 WeShop 插件:无限画布 + 无限创意技能 | 6 |
| [morluto/jacobian](https://github.com/morluto/jacobian) | 纯数学工具:搜索例子与反例、精确计算、独立验证 | 43 |
| [thedeveloper256/dsh-model-router](https://github.com/thedeveloper256/dsh-model-router) | 基于角色的模型路由:规划者(根 agent)跑 deepseek-v4-pro,委派执行子 agent 跑 deepseek-v4-flash;附带 prompt 段与 `pro-flash-routing` 技能 | 1 |
| [zhengjy01/dsh-task-dispatcher](https://github.com/zhengjy01/dsh-task-dispatcher) | 滴答清单每日任务分发器：定时拉取今日到期任务、变更感知 flomo+macOS 通知、可选无头会话自动执行、工作区选择、Web 任务看板 | 0 |
| [PerryLink/dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | DSH 审批请求的第二模型自动评审：只读评审子代理返回带理由的结构化允许/拒绝裁决，默认故障关闭、全程可从会话日志审计。可通过 `dsh plugin --profile web add dsh-auto-review` 安装 | 119 |
| [PerryLink/dsh-click](https://github.com/PerryLink/dsh-click) | DeepSeek Harness 的跨平台原生桌面控制（Windows 优先）：screen_shot、screen_read、click、type、scroll 与 key 动作，全部经审批门与进程身份校验。 | 3 |

### 📚 Skills 与技能包

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [titanwings/colleague-skill](https://github.com/titanwings/colleague-skill) | 数字生命 1.0:将离别化为温暖 Skill | 22228 |
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | 架构/工作流/时序/数据流/生命周期图:自包含 HTML,带动画与清晰导出 | 12744 |
| [hyhmrright/brooks-lint](https://github.com/hyhmrright/brooks-lint) | 以 12 本经典工程书为基础的 AI 代码审查:衰减风险诊断、6 种分析模式 | 1329 |
| [GanyuanRan/Aegis](https://github.com/GanyuanRan/Aegis) | 让编码 agent 具备架构意识:基线优先、证据验证、漂移检查 | 1013 |
| [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | 设计技能:告别 AI-slop UI,产出可交付的精致前端 | 411 |
| [yogsoth-ai/de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) | 900+ 纯 markdown 研究技能:4 层层级、9 个自由组合包、6 个 MCP 集成 | 378 |
| [Minara-AI/minara-skills](https://github.com/Minara-AI/minara-skills) | 交易技能包:让 agent 帮你赚钱 | 324 |
| [linhay/harmony-next.skills](https://github.com/linhay/harmony-next.skills) | HarmonyOS NEXT (API 12+) 开发专家指导 | 321 |
| [alaliqing/claude-paper](https://github.com/alaliqing/claude-paper) | 跨 agent 论文工具:快速摘要、深度学习材料、代码演示、本地阅读器 | 294 |
| [dhicoc/dsh-reverse-skill](https://github.com/dhicoc/dsh-reverse-skill) | 85 个 SKILL.md 的逆向工程/安全研究技能包(Cordis 插件) | 10 |
| [Lyn-77/ProMentor](https://github.com/Lyn-77/ProMentor) | AI 编程导师:项目架构扫描、阶梯式 Chapter、手写核心逻辑、自动判题 | 54 |
| [Jayden-X-L/forkprobe](https://github.com/Jayden-X-L/forkprobe) | 同一任务对比多个 skill,选出胜者 | 65 |
| [Mikuzjc/dsh-office-for-mso](https://github.com/Mikuzjc/dsh-office-for-mso) | DSH ↔ Microsoft Office 桥接技能：操控已打开的 Word/Excel/PowerPoint（33 动作、AI 编排、Office 插件） | 1 |
| [suyukun/dsh-tech-selection](https://github.com/suyukun/dsh-tech-selection) | 面向任意 AI Agent 的技术选型研究协议（DSH/Claude/Cursor/Codex 通用）：T1-T6 信源分级、质量门禁、量化权衡、可追溯结论 | 0 |
| [morluto/rea](https://github.com/morluto/rea) | 用 agent 逆向任何东西:从应用行为到原生二进制 | 322 |

### 🚀 集成 DSH 的应用与运行时

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [Devin-AXIS/iPolloWork](https://github.com/Devin-AXIS/iPolloWork) | 自进化 agent 运行时 AI 工作区,集成 DSH 子代理委派与双插件生态 | 4067 |
| [whiteguo233/OpenBiliClaw](https://github.com/whiteguo233/OpenBiliClaw) | 本地私有内容发现 Agent:B站/小红书/抖音/YouTube/X/知乎/Reddit/微博(支持 DSH 插件) | 2457 |
| [sandbaseai/sandbase-harness](https://github.com/sandbaseai/sandbase-harness) | 开源 CMA 兼容 agent 运行时:MCP 工具、沙箱会话、审计回放,含原生 DSH bundle | 581 |
| [hellowind777/helloagents](https://github.com/hellowind777/helloagents) | 自主高级智能伙伴:持续工作直到完成实现与验证 | 680 |
| [yejiming/MuseAI](https://github.com/yejiming/MuseAI) | 创建 AI 角色、进入故事世界(支持 DSH 插件) | 548 |
| [ctxrs/ctx](https://github.com/ctxrs/ctx) | 即时回忆:搜索本机 agent 会话历史——agent 会话版的 git blame | 1029 |
| [strukto-ai/mirage](https://github.com/strukto-ai/mirage) | 业界首个面向 AI agent 的统一虚拟文件系统 | 3430 |
| [junhoyeo/tokscale](https://github.com/junhoyeo/tokscale) | 终端跟踪 AI 编码 agent 的 token 用量,全球排行榜 | 4963 |
| [xiufengsun/TokenTracker](https://github.com/xiufengsun/TokenTracker) | 31 种编码工具的本地 token 与成本跟踪(含 DSH),有原生应用 | 1315 |
| [JingbiaoMei/Tokdash](https://github.com/JingbiaoMei/Tokdash) | Sessions 与配额的可视化分析:热力图、成本追踪 | 54 |
| [EthanYoQ/Invoice-Downloader](https://github.com/EthanYoQ/Invoice-Downloader) | 用于本地 IMAP 发票下载、OCR 识别、归档和 Excel 报销汇总的 DSH bundle | 141 |

---

## 🧱 核心基础设施

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) | 官方仓库:Everything is a Plugin | 104.5k |
| [cordiverse/cordis](https://github.com/cordiverse/cordis) | 时空可组合性元框架——DSH 背后的插件运行时 | 3607 |
| [cordiverse/paper](https://github.com/cordiverse/paper) | *A Programming Paradigm for Spatiotemporal Composability*(Cordis 设计论文) | — |
| [@deepseek-ai/dsh](https://www.npmjs.com/package/@deepseek-ai/dsh) | 官方 npm 包:`npx @deepseek-ai/dsh web` 快速启动 | — |
| [create-dsh-plugin](https://www.npmjs.com/package/create-dsh-plugin) | 秒级脚手架 DSH 插件(tool/events/webui 模板 + 内置验证) | — |

## 🎓 学习资源

| 项目 | 说明 | ⭐ |
| --- | --- | --- |
| [Electricitysheep/dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | DSH 从 0 到 1 深度手册:安装/插件开发/性能调优/实测案例(中英 PDF) | 248 |
| [pingfanfan/hello-dsh](https://github.com/pingfanfan/hello-dsh) | 零基础插件开发教程「万物皆可插件」:含 22 个中文技能实例 | 45 |
| [omdsh-dev/dsh-plugin-dev](https://github.com/omdsh-dev/dsh-plugin-dev) | DSH 插件开发踩坑档案:cordis 双副本、tsconfig 三件套、Windows junction、多帧 zstd 等实测记录 | 10 |
| [hikariming/dshfind](https://github.com/hikariming/dshfind) | DSH 原理学习、插件市场与最佳实践 | 76 |
| [DeepWiki: deepseek-harness](https://deepwiki.com/deepseek-ai/deepseek-harness) | 官方仓库的 DeepWiki 自动文档 | — |
| [deepseekagent.io 指南](https://deepseekagent.io/guides/deepseek-harness) | dsh 安装与架构指南(社区) | — |

**官方文档:** [development.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/development.md) · [architecture.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) · [cordis-primer](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md) · [cordis-tutorial](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/index.md)(7 篇插件教程) · [cookbook](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/cookbook) · [capability-seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md)

## 🤝 社区

- [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) — 反馈与讨论
- [Discord](https://discord.gg/Ycq5dCaS4) — DeepSeek Harness 官方社区
- [dsh-plugin 话题](https://github.com/topics/dsh-plugin) — 给插件仓库打这个话题以便被发现

## 🔗 友链

- [DeepSeek Official Tracker](https://github.com/awesome-deepseekharness/deepseek-official-tracker) — 自动跟踪 DeepSeek 官方新闻/变更日志/发布/npm 更新(GitHub Actions 每 6 小时)

---

## ⭐ Star 历史与社区增长

<!-- star-history start -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/star-history/star-history-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/star-history/star-history-light.svg">
  <img alt="Star History Chart" src="assets/star-history/star-history-light.svg" width="600">
</picture>
<!-- star-history end -->

> **社区势头：** 我们正朝 100 Stars 迈进，随着关注度提升，部分受关注的插件 *可能* 会在本列表/站点内获得置顶或额外曝光（例如小范围精选区），不做确定性承诺，仅作为社区偏好的参考以持续优化收录。[去 GitHub 点 Star](https://github.com/awesome-deepseekharness/awesome-deepseek-harness) · [关注 DeepSeek 官方](https://x.com/deepseek_ai) · [加入 Discord](https://discord.gg/Ycq5dCaS4)

<sub>图表由 GitHub Action（`narayann7/star-history-action`）自托管，每 6 小时及有新 Star 时刷新。原 `api.star-history.com/svg` 因 [GitHub stargazers 接口限制](https://star-history.com/blog/github-stargazer-api-restriction) 已失效。若图片为空，请等待首次工作流运行或[查看交互式图表](https://star-history.com/#awesome-deepseekharness/awesome-deepseek-harness&Date)。</sub>

## 贡献

发现了好项目?欢迎[提交 PR](CONTRIBUTING.zh.md)或提 Issue。收录标准:与 DSH 相关、可安装可用、有明确用途。

> 💡 **PR 24h 内合并秘籍：** 严格按新的 [PR 模板](.github/pull_request_template.md) + [贡献指南](CONTRIBUTING.zh.md) 清单来（双语条目、正确分类、已验证安装、`dsh-plugin` topic）。格式规范的 PR 会自动打 label 并优先评审。若 48 小时内无人评审，欢迎在 PR 里友善地 @`hdjekuue` 或其他维护者。

*本列表持续更新。星标数截止 2026-08-15。*

## License

[CC0-1.0](LICENSE) — 公共领域,随意使用。
