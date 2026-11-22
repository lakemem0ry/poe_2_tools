<div align="center">

# Path of Exile 2 Tools

**Crafting Simulator & Trade Regex Builder · 做装模拟器与市集词缀正则工具 · 做裝模擬器與市集詞綴正則工具**

<p align="center">
  <a href="#english"><img src="https://img.shields.io/badge/Language-English-d4a656?style=for-the-badge" alt="English" /></a>
  &nbsp;&nbsp;
  <a href="#简体中文"><img src="https://img.shields.io/badge/语言-简体中文-d4a656?style=for-the-badge" alt="简体中文" /></a>
  &nbsp;&nbsp;
  <a href="#繁體中文"><img src="https://img.shields.io/badge/語言-繁體中文-d4a656?style=for-the-badge" alt="繁體中文" /></a>
</p>

**[English](#english)** &nbsp;|&nbsp; **[简体中文](#简体中文)** &nbsp;|&nbsp; **[繁體中文](#繁體中文)**

**Online Web App / 在线网页版 / 線上網頁版**: [https://lakemem0ry.github.io/poe_2_tools/](https://lakemem0ry.github.io/poe_2_tools/)  
**Offline Archive / 本地离线包 / 本地離線包**: [GitHub Releases](https://github.com/lakemem0ry/poe_2_tools/releases)

</div>

---

<a id="english"></a>

## English

**[English](#english)** &nbsp;|&nbsp; **[简体中文](#简体中文)** &nbsp;|&nbsp; **[繁體中文](#繁體中文)**

A lightweight, zero-build, pure-frontend **Path of Exile 2 (PoE 2) All-in-One Tools Hub** integrating two core tools under a unified dark obsidian and antique bronze Path of Exile 2 aesthetic:

1. **PoE 2 Crafting Simulator** (**Workbench Mode** & **Currency Stash Sim Mode**): Full 81 item classes synced with PoE2DB modifier pools, supporting tiered currencies, omens, essences & alloys, abyssal desecration (3-choose-1 Well of Souls reveal), Atziri's temple currencies, Runes of Aldur, composite modifier auto-summing, and live DPS / defence calculation.
2. **PoE 2 Trade Regex Tool** (**Waystones** & **Tablets**): Instant search-regex generator for the Path of Exile 2 trade site with tier-merged affixes, numeric thresholds, 148 high-value tablet combos, favorite presets, and automatic 250-character budget degradation.

Supports real-time trilingual switching across **English (`EN`, default)**, **Simplified Chinese (`简中`)**, and **Traditional Chinese (`繁體`)**.

### Quick Start & Usage

#### Option 1: Online Web Version (GitHub Pages)
No download or installation required. Open directly in your browser:
- **Main Hub (Crafting Simulator & Regex Tool)**: [https://lakemem0ry.github.io/poe_2_tools/](https://lakemem0ry.github.io/poe_2_tools/)
- **Direct Link to Trade Regex Tool**: [https://lakemem0ry.github.io/poe_2_tools/#regex](https://lakemem0ry.github.io/poe_2_tools/#regex)

#### Option 2: Local Offline Deployment (Releases Archive)
1. Go to [**GitHub Releases**](https://github.com/lakemem0ry/poe_2_tools/releases) and download the latest tool archive (`.zip`).
2. Extract the archive to any local folder on your computer.
3. Double-click **`index.html`** to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).
4. **No local server, Node.js, or internet connection is required**—all 81 item category datasets and regex databases work 100% offline.

### 1. Crafting Simulator Features

- **Dual Crafting Views**:
  - **Workbench Mode**: Symmetric 3-column layout—crafting orbs, omens, essences, abyssal bones, and temple currencies on the left; live item tooltip, affix slot sandbox controls, composite merge breakdown, and cost/log tracker in the center; sticky PoE2DB modifier pool and real-time roll probability calculator on the right.
  - **Currency Stash Sim Mode**: Recreates the in-game currency stash altar (3×5 tiered orbs on the left wing, 5 core orbs + item pedestal in the center, 2×4 quality/socket/abyssal bone quick slots on the right wing), with an immediate 3-choice **Well of Souls Reveal** panel and a 6-tab tool drawer right beneath the pedestal for zero vertical scrolling.
- **Complete PoE 2 Crafting Mechanics**:
  - **Core & Tiered Currencies**: Transmutation, Augmentation, Regal, Chaos, Exalted (Regular / Greater II / Perfect III), Alchemy, Annulment, Divine, Fracturing, Artificer's Orb, and Vaal Orb.
  - **Crafting & Abyssal Omens**: Sinistral/Dextral Exaltation, Greater Exaltation, Whittling, Sinistral/Dextral Erasure, Sinistral/Dextral Annulment, Sinistral/Dextral Crystallisation, Blessed, Sanctification, Corruption, Light, Abyssal Echoes, Sinistral/Dextral Necromancy, and Lich Omens (Sovereign/Liege/Blackblooded), with a reusable **Lock Omens** toggle.
  - **Essences & Alloys**: Filterable by *All / Lesser / Regular / Greater / Perfect / Special / Alloy* with trilingual & alias search.
  - **Abyssal Desecration**: Gnawed, Preserved, and Ancient Jawbones trigger a 3-choose-1 Well of Souls reveal with Echoes reroll support.
  - **Atziri's Temple Currencies & Runes of Aldur**: Infusers (up to 30% Quality), Orbs of Sacrifice, Architect's Orb (single-use Twice-Corrupted outcome), Vaal Siphoner, Orb of Extraction, and class-specific Aldur Runes that unlock influence mod pools, expand affix slots, or convert elemental modifiers.
- **Composite Modifiers & Auto-Summed Stats**: Multi-line hybrid modifiers occupy a single affix slot and are added/removed atomically. Same-stat lines automatically sum into final in-game values, with an `Alt` breakdown view and live Weapon DPS / Armour defense calculations.

### 2. Trade Regex Tool Features (`PoE2_RexTool`)

Tick affixes, enter numeric thresholds, and assemble a quoted search regex you can paste straight into the Path of Exile 2 trade site search box.

- **Waystone Filters**:
  - **Tier Filter (T1–T16)**: Generates the exact client-specific word order (`Tier\s*16` in English, `階級\s*16\s*` in Traditional Chinese, `\s*16\s*阶` in Simplified Chinese).
  - **Revives Available (`0–5`)**, **Multi-Select Rarity** (*Normal / Magic / Rare* for Waystones; includes *Unique* for Tablets), **Corrupted Status**, and **Waystone Effect Thresholds** (*Item Rarity, Pack Size, Monster Effectiveness, Monster Rarity, Waystone Drop Chance*).
- **Affix Filters & Tier Merging**:
  - **34 Waystone Affixes** (15 prefixes / 19 suffixes) & **92 Tablet Affixes** across **8 Tablet Types** (*Irradiated, Ritual, Delirium, Breach, Abyss, Temple, Overseer, Expedition*).
  - **Tier-Merged Ranges**: Different tiers of the same affix are merged into a single entry spanning the union of all tiers (e.g., `(5—24)%`), eliminating repetitive per-tier checkboxes.
  - **Composite Affixes**: Multi-line hybrid affixes render across multiple lines while sharing a single `+` (Include) / `−` (Exclude) toggle and are never falsely merged with single-line affixes.
  - **Hot Affixes Bar**: Quick include/exclude access for the most frequently filtered Waystone ground effects and curses.
  - **High-Value Tablet Combos**: 148 curated high-value tablet affix combinations filterable by minimum price (`E` / `C` / `D`) and tablet type, each with one-click regex copy.
  - **250-Character Trade Budget & Auto-Degradation**: The PoE 2 trade search box caps input at **250 characters**. The regex engine budgets a safe **248 characters** and automatically relaxes numeric ranges to `[0-9]` when needed so the generated regex stays within the limit.
  - **Favorites & Local Auto-Save**: Save condition sets as named presets and restore them in one click; all settings persist in `localStorage`.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Hold `Alt` | Temporarily inspect individual modifier tiers & hybrid line breakdown (Crafting Simulator) |
| `Ctrl + Z` / `Cmd + Z` | Undo last crafting action (up to 60 steps) |
| `Ctrl + Y` / `Cmd + Y` | Redo crafting action |
| `Escape` | Clear affix search input when focused (Regex Tool) |

### Project Structure

```text
poe_2_tools/
├── index.html               # Unified PoE 2 Tools entry (Workbench / Stash Sim / Regex Tool)
├── styles.css               # Path of Exile 2 dark obsidian & antique bronze visual system
├── src/
│   ├── craftingEngine.js    # Core crafting engine, mod rolling, DPS & stat aggregation
│   ├── regexTool.js         # Trade regex builder engine & Regex Tool UI controller
│   ├── app.js               # Main UI state controller, mode switcher & mod pool odds view
│   └── i18n.js              # Trilingual dictionary (English / Simplified & Traditional Chinese)
└── data/
    ├── catalog.js           # 81 item categories index & trilingual tag mappings
    ├── regexData.js         # Offline Waystone (34), Tablet (92) & High-Value (148) regex datasets
    └── categories/          # 81 on-demand modifier pool data files
```

### 100% Free & Anti-Resale Notice

- This tool is provided completely free of charge by the author. All features are directly accessible without payment or license purchase.
- The author has **never** authorized any individual or organization to sell this tool, its source code, or related files.
- If you paid to obtain this tool or related files, please note: that charge has nothing to do with the author. The author did not receive your payment and cannot issue a refund. Please contact the seller or platform that charged you directly for a refund; if they are unreachable or suspected of fraud, file a complaint via your payment platform, consumer protection agency, or regulatory authority, and keep your payment receipts.
- This statement only clarifies the free nature of this tool and does not constitute a guarantee or commitment regarding any third-party actions.
- If you find this tool helpful, feel free to voluntarily support the author on Bilibili: [LMemory氿忆](https://space.bilibili.com/7132721). Sponsorship is completely voluntary and does not constitute a purchase or paid service, nor does it grant extra features, services, licenses, or priority support, and it does not affect your normal use of this tool.

### Credits & Data Attribution

- **[PoE2DB](https://poe2db.tw/)** — Item bases, modifier ranges, weights, Waystone/Tablet affixes, and trilingual localization data.
- **[炖了一锅鱼](https://space.bilibili.com/27021867)** — High-value tablet affix data reference.
- **Author**: [LMemory氿忆](https://space.bilibili.com/7132721)
- This is a community-made open-source tool and is not affiliated with or endorsed by Grinding Gear Games. In-game item art and icons are the property of Grinding Gear Games.

---

<a id="简体中文"></a>

## 简体中文

**[English](#english)** &nbsp;|&nbsp; **[简体中文](#简体中文)** &nbsp;|&nbsp; **[繁體中文](#繁體中文)**

一款轻量级、零构建依赖的纯前端 **《流放之路 2》(Path of Exile 2) 二合一综合工具站**，在统一的黑曜石与暗金古铜界面风格下整合了两大核心工具：

1. **PoE 2 做装模拟器**（**工作台模式** & **通货仓库模拟模式**）：完整收录与 PoE2DB 同步的 81 类装备词缀池，支持各阶通货、预兆、精华与合金、深渊亵渎（灵魂之井三选一揭晓）、阿兹里神庙通货、奥尔杜尔符文、复合词缀自动合并累加，以及实时武器 DPS 与护甲防御重算。
2. **PoE 2 市集词缀正则工具**（**引路石** & **碑牌**）：专为《流放之路 2》交易市集与仓库搜索框打造，支持多阶级词缀合并、数值阈值过滤、148 组高价值碑牌词缀参考、自定义收藏夹预设，以及 250 字符预算自动降级压缩。

支持 **English (`EN`)**、**简体中文 (`简中`)**、**繁體中文 (`繁體`)** 三语实时无缝切换。

### 快速开始与使用方式

#### 方式一：在线网页版（GitHub Pages 推荐）
无需下载或安装任何环境，直接在浏览器打开即可使用：
- **工具站主页（做装模拟器 & 词缀正则工具）**：[https://lakemem0ry.github.io/poe_2_tools/](https://lakemem0ry.github.io/poe_2_tools/)
- **直达词缀正则工具**：[https://lakemem0ry.github.io/poe_2_tools/#regex](https://lakemem0ry.github.io/poe_2_tools/#regex)

#### 方式二：本地离线使用（解压即用，无需本地服务器）
1. 前往本仓库的 [**GitHub Releases**](https://github.com/lakemem0ry/poe_2_tools/releases) 页面，下载最新发布的工具压缩包（`.zip`）。
2. 将压缩包解压到电脑本地任意文件夹。
3. 直接双击打开文件夹中的 **`index.html`** 即可在任意现代浏览器（Chrome、Edge、Firefox、Safari）中离线运行。
4. **无需启动本地服务器、无需安装 Node.js 或 Python，也无需联网**——全部 81 类装备词缀库与正则词缀数据均已内置。

### 1. 做装模拟器功能特性

- **双视图做装体验**：
  - **工作台模式 (Workbench Mode)**：对称三栏布局——左侧为制作通货、预兆、精华、深渊骨头与神庙通货；中栏为实时装备悬浮窗、词缀槽沙盒管理、复合词缀拆解与消耗日志；右侧为常驻 PoE2DB 词缀池与实时抽取概率计算器。
  - **通货仓库模拟模式 (Currency Stash Sim Mode)**：还原游戏内通货仓库祭坛（左翼 3×5 阶级通货、中央 5 枚核心通货与装备放置台、右翼 2×4 品质/插槽/深渊骨头快捷槽），放置台正下方紧邻 **灵魂之井三选一揭晓** 面板与 6 标签工具抽屉，全程无需上下滚动页面。
- **完整的 PoE 2 做装机制**：
  - **基础与阶级通货**：蜕变石、增幅石、富豪石、混沌石、崇高石（普通 / 高阶 II / 完美 III）、点金石、剥离石、神圣石、破裂石、工匠石与瓦尔宝珠。
  - **制作与深渊预兆**：左旋/右旋崇高、高阶崇高、削切、左旋/右旋抹除、左旋/右旋剥离、左旋/右旋结晶、祝福、圣化、腐化、光明、深渊回响、左旋/右旋死灵术及巫妖预兆（君主/领主/黑血），支持 **锁定预兆** 开关以便连续做装。
  - **精华与合金**：支持按 *全部 / 次级 / 普通 / 高阶 / 完美 / 特殊 / 合金* 分类筛选及三语别名搜索。
  - **深渊亵渎系统**：啃噬、完好、古老颚骨可触发灵魂之井三选一揭晓，并支持深渊回响重掷。
  - **阿兹里神庙通货与奥尔杜尔符文**：注入器（最高 30% 品质）、献祭宝珠、建筑师宝珠（单件装备限用一次的双瓦结果）、瓦尔吸取器、提取宝珠，以及可解锁专属词缀池、扩展词缀槽或转换元素词缀的奥尔杜尔符文。
- **复合词缀与同属性自动累加**：多行混合词缀仅占 1 个词缀槽位并整体增删；相同属性行自动合并累加为最终游戏面板数值，按住 `Alt` 键可随时查看各阶词缀明细与实时武器 DPS / 防御面板。

### 2. 市集词缀正则工具功能特性 (`PoE2_RexTool`)

勾选词缀、填入数值下限，自动拼出可直接粘贴到《流放之路 2》交易市集或游戏内搜索框的带引号正则表达式。

- **引路石专属过滤**：
  - **阶级过滤 (T1–T16)**：严格匹配不同语言客户端的词序（英文 `Tier\s*16`、繁中 `階級\s*16\s*`、简中 `\s*16\s*阶`）。
  - **可用复活次数 (`0–5`)**、**稀有度多选**（引路石支持 *普通 / 魔法 / 稀有*，碑牌额外包含 *传奇*）、**腐化状态**，以及 **引路石效果下限过滤**（*物品稀有度、怪物群大小、怪物效能、怪物稀有度、引路石掉落几率*）。
- **词缀过滤与多阶合并**：
  - **34 条引路石词缀**（15 前缀 / 19 后缀）与覆盖 **8 大碑牌类型**（*辐射、祭祀、谵妄、裂隙、深渊、神庙、督军、先祖秘藏*）的 **92 条碑牌词缀**。
  - **同词缀多阶合并**：同一词缀的不同 Tier 自动合并为单条并取全阶级总范围（如 `(5—24)%`），告别重复勾选。
  - **复合词缀精准展示**：多行混合词缀在卡片内逐行完整展示，共用同一组 `+`（包含）/ `−`（排除）开关，绝不与单行词缀误合并。
  - **热门词缀栏**：高频地面效果与诅咒词缀一键包含或排除。
  - **148 组高价值碑牌组合参考**：支持按最低参考价格（`E` / `C` / `D`）与碑牌类型筛选，一键复制对应正则。
  - **250 字符限制与自动降级**：PoE 2 市集搜索框上限为 **250 字符**，引擎按 **248 字符** 安全预算生成，超长时自动将数值范围逐个降级为 `[0-9]` 以确保不截断。
  - **收藏夹与本地自动保存**：支持将常用筛选组合命名保存到收藏夹一键还原，所有配置自动持久化保存在 `localStorage`。

### 键盘快捷键

| 快捷键 | 功能说明 |
|---|---|
| 按住 `Alt` | 临时展开查看每条词缀的独立阶级与复合词缀拆分明细（做装模拟器） |
| `Ctrl + Z` / `Cmd + Z` | 撤销上一步做装操作（最多 60 步历史） |
| `Ctrl + Y` / `Cmd + Y` | 重做上一步撤销的做装操作 |
| `Escape` | 在词缀搜索框聚焦时一键清空搜索词（词缀正则工具） |

### 项目目录结构

```text
poe_2_tools/
├── index.html               # PoE 2 工具站统一入口（工作台 / 通货仓库模拟 / 词缀正则工具）
├── styles.css               # 流放之路 2 黑曜石与暗金古铜视觉样式系统
├── src/
│   ├── craftingEngine.js    # 核心做装引擎、词缀权重抽取、DPS 与属性累加计算
│   ├── regexTool.js         # 市集正则生成引擎与词缀正则工具交互控制器
│   ├── app.js               # 主界面状态控制、三模式切换与词缀池概率视图
│   └── i18n.js              # 三语本地化字典（English / 简体中文 / 繁體中文）
└── data/
    ├── catalog.js           # 81 类装备目录索引与三语标签映射
    ├── regexData.js         # 离线引路石(34)、碑牌(92)与高价值碑牌组合(148)数据集
    └── categories/          # 81 个按需加载的装备词缀池数据文件
```

### 免费公开与严禁倒卖声明

- **本工具完全免费**：本工具由作者免费公开提供，所有功能均可直接使用，无需付费、无需购买授权。作者未授权任何个人或组织以收费方式销售本工具、源码或相关文件。
- 如果您是通过付费方式获得本工具或相关文件，请注意：该收费行为与作者无关，作者未收到您的款项，也无法为您办理退款。请直接联系向您收费的商家/平台协商退款；如遇无法联系或涉嫌欺诈，建议通过支付平台投诉、向消费者协会或相关监管部门反映，并保留付款凭证。
- 本声明仅为说明免费性质，不构成对任何第三方行为的担保或承诺。
- 如果您觉得好用，可以通过 Bilibili 联系 B站 [LMemory氿忆](https://space.bilibili.com/7132721) 自愿赞助。赞助完全自愿，不构成购买或付费服务，也不会获得额外功能、服务、授权或优先支持，不影响您正常使用本工具。作者未授权任何第三方收费销售本工具；如您是付费获得，该收费与作者无关，作者无法办理退款，请联系收款方处理。感谢支持。

### 致谢与数据来源

- **[PoE2DB (流亡编年史)](https://poe2db.tw/)** — 提供装备基底、词缀数值范围、权重、引路石/碑牌词缀及三语本地化数据支持。
- **[炖了一锅鱼](https://space.bilibili.com/27021867)** — 提供高价值碑牌词缀组合参考数据。
- **作者**：[LMemory氿忆](https://space.bilibili.com/7132721)
- 本项目为玩家社区开源工具，与 Grinding Gear Games 无隶属或合作关系，游戏内图标与美术资源版权归 Grinding Gear Games 所有。

---

<a id="繁體中文"></a>

## 繁體中文

**[English](#english)** &nbsp;|&nbsp; **[简体中文](#简体中文)** &nbsp;|&nbsp; **[繁體中文](#繁體中文)**

一款輕量級、零建置依賴的純前端 **《流亡黯道 2》(Path of Exile 2) 二合一綜合工具站**，在統一的黑曜石與暗金古銅介面風格下整合了兩大核心工具：

1. **PoE 2 做裝模擬器**（**工作台模式** & **通貨倉庫模擬模式**）：完整收錄與 PoE2DB 同步的 81 類裝備詞綴池，支援各階通貨、預兆、精髓與合金、深淵褻瀆（靈魂之井三選一揭曉）、阿茲里神廟通貨、奧爾杜爾符文、複合詞綴自動合併累加，以及即時武器 DPS 與護甲防禦重算。
2. **PoE 2 市集詞綴正則工具**（**換界石** & **碑牌**）：專為《流亡黯道 2》交易市集與倉庫搜尋框打造，支援多階級詞綴合併、數值閾值過濾、148 組高價值碑牌詞綴參考、自訂收藏夾預設，以及 250 字元預算自動降級壓縮。

支援 **English (`EN`)**、**简体中文 (`简中`)**、**繁體中文 (`繁體`)** 三語即時無縫切換。

### 快速開始與使用方式

#### 方式一：線上網頁版（GitHub Pages 推薦）
無需下載或安裝任何環境，直接在瀏覽器開啟即可使用：
- **工具站首頁（做裝模擬器 & 詞綴正則工具）**：[https://lakemem0ry.github.io/poe_2_tools/](https://lakemem0ry.github.io/poe_2_tools/)
- **直達詞綴正則工具**：[https://lakemem0ry.github.io/poe_2_tools/#regex](https://lakemem0ry.github.io/poe_2_tools/#regex)

#### 方式二：本地離線使用（解壓即用，無需本地伺服器）
1. 前往本儲存庫的 [**GitHub Releases**](https://github.com/lakemem0ry/poe_2_tools/releases) 頁面，下載最新發佈的工具壓縮包（`.zip`）。
2. 將壓縮包解壓縮到電腦本地任意資料夾。
3. 直接雙擊開啟資料夾中的 **`index.html`** 即可在任意現代瀏覽器（Chrome、Edge、Firefox、Safari）中離線執行。
4. **無需啟動本地伺服器、無需安裝 Node.js 或 Python，也無需連網**——全部 81 類裝備詞綴庫與正則詞綴資料均已內建。

### 1. 做裝模擬器功能特性

- **雙視圖做裝體驗**：
  - **工作台模式 (Workbench Mode)**：對稱三欄佈局——左側為製作通貨、預兆、精髓、深淵骨頭與神廟通貨；中欄為即時裝備懸浮窗、詞綴槽沙盒管理、複合詞綴拆解與消耗日誌；右側為常駐 PoE2DB 詞綴池與即時抽取機率計算機。
  - **通貨倉庫模擬模式 (Currency Stash Sim Mode)**：還原遊戲內通貨倉庫祭壇（左翼 3×5 階級通貨、中央 5 枚核心通貨與裝備放置台、右翼 2×4 品質/插槽/深淵骨頭快捷槽），放置台正下方緊鄰 **靈魂之井三選一揭曉** 面板與 6 標籤工具抽屜，全程無需上下捲動頁面。
- **完整的 PoE 2 做裝機制**：
  - **基礎與階級通貨**：蛻變石、增幅石、富豪石、混沌石、崇高石（普通 / 高階 II / 完美 III）、點金石、剝離石、神聖石、破裂石、工匠石與瓦爾寶珠。
  - **製作與深淵預兆**：左旋/右旋崇高、高階崇高、削切、左旋/右旋抹除、左旋/右旋剝離、左旋/右旋結晶、祝福、聖化、腐化、光明、深淵迴響、左旋/右旋死靈術及巫妖預兆（君主/領主/黑血），支援 **鎖定預兆** 開關以便連續做裝。
  - **精髓與合金**：支援按 *全部 / 次級 / 普通 / 高階 / 完美 / 特殊 / 合金* 分類篩選及三語別名搜尋。
  - **深淵褻瀆系統**：啃噬、完好、古老顎骨可觸發靈魂之井三選一揭曉，並支援深淵迴響重擲。
  - **阿茲里神廟通貨與奧爾杜爾符文**：注入器（最高 30% 品質）、獻祭寶珠、建築師寶珠（單件裝備限用一次的雙瓦結果）、瓦爾吸取器、提取寶珠，以及可解鎖專屬詞綴池、擴展詞綴槽或轉換元素詞綴的奧爾杜爾符文。
- **複合詞綴與同屬性自動累加**：多行混合詞綴僅佔 1 個詞綴槽位並整體增刪；相同屬性行自動合併累加為最終遊戲面板數值，按住 `Alt` 鍵可隨時查看各階詞綴明細與即時武器 DPS / 防禦面板。

### 2. 市集詞綴正則工具功能特性 (`PoE2_RexTool`)

勾選詞綴、填入數值下限，自動拼出可直接貼上到《流亡黯道 2》交易市集或遊戲內搜尋框的帶引號正則表達式。

- **換界石專屬過濾**：
  - **階級過濾 (T1–T16)**：嚴格匹配不同語言客戶端的詞序（英文 `Tier\s*16`、繁中 `階級\s*16\s*`、簡中 `\s*16\s*阶`）。
  - **可用復活次數 (`0–5`)**、**稀有度多選**（換界石支援 *普通 / 魔法 / 稀有*，碑牌額外包含 *傳奇*）、**腐化狀態**，以及 **換界石效果下限過濾**（*物品稀有度、怪物群大小、怪物效能、怪物稀有度、換界石掉落機率*）。
- **詞綴過濾與多階合併**：
  - **34 條換界石詞綴**（15 前綴 / 19 後綴）與涵蓋 **8 大碑牌類型**（*輻射、祭祀、譫妄、裂痕、深淵、神廟、督軍、探險*）的 **92 條碑牌詞綴**。
  - **同詞綴多階合併**：同一詞綴的不同 Tier 自動合併為單條並取全階級總範圍（如 `(5—24)%`），告別重複勾選。
  - **複合詞綴精準展示**：多行混合詞綴在卡片內逐行完整展示，共用同一組 `+`（包含）/ `−`（排除）開關，絕不與單行詞綴誤合併。
  - **熱門詞綴欄**：高頻地面效果與詛咒詞綴一鍵包含或排除。
  - **148 組高價值碑牌組合參考**：支援按最低參考價格（`E` / `C` / `D`）與碑牌類型篩選，一鍵複製對應正則。
  - **250 字元限制與自動降級**：PoE 2 市集搜尋框上限為 **250 字元**，引擎按 **248 字元** 安全預算產生，超長時自動將數值範圍逐個降級為 `[0-9]` 以確保不截斷。
  - **收藏夾與本地自動儲存**：支援將常用篩選組合命名儲存到收藏夾一鍵還原，所有設定自動持久化儲存在 `localStorage`。

### 鍵盤快捷鍵

| 快捷鍵 | 功能說明 |
|---|---|
| 按住 `Alt` | 臨時展開查看每條詞綴的獨立階級與複合詞綴拆分明細（做裝模擬器） |
| `Ctrl + Z` / `Cmd + Z` | 復原上一步做裝操作（最多 60 步歷史） |
| `Ctrl + Y` / `Cmd + Y` | 重做上一步復原的做裝操作 |
| `Escape` | 在詞綴搜尋框聚焦時一鍵清空搜尋詞（詞綴正則工具） |

### 專案目錄結構

```text
poe_2_tools/
├── index.html               # PoE 2 工具站統一入口（工作台 / 通貨倉庫模擬 / 詞綴正則工具）
├── styles.css               # 流亡黯道 2 黑曜石與暗金古銅視覺樣式系統
├── src/
│   ├── craftingEngine.js    # 核心做裝引擎、詞綴權重抽取、DPS 與屬性累加計算
│   ├── regexTool.js         # 市集正則產生引擎與詞綴正則工具互動控制器
│   ├── app.js               # 主介面狀態控制、三模式切換與詞綴池機率視圖
│   └── i18n.js              # 三語本地化字典（English / 简体中文 / 繁體中文）
└── data/
    ├── catalog.js           # 81 類裝備目錄索引與三語標籤映射
    ├── regexData.js         # 離線換界石(34)、碑牌(92)與高價值碑牌組合(148)資料集
    └── categories/          # 81 個按需載入的裝備詞綴池資料檔案
```

### 免費公開與嚴禁倒賣聲明

- **本工具完全免費**：本工具由作者免費公開提供，所有功能均可直接使用，無需付費、無需購買授權。作者未授權任何個人或組織以收費方式銷售本工具、原始碼或相關檔案。
- 如果您是透過付費方式獲得本工具或相關檔案，請注意：該收費行為與作者無關，作者未收到您的款項，也無法為您辦理退款。請直接聯繫向您收費的商家/平台協商退款；如遇無法聯繫或涉嫌詐欺，建議透過支付平台投訴、向消費者保護機構或相關監管部門反映，並保留付款憑證。
- 本聲明僅為說明免費性質，不構成對任何第三方行為的擔保或承諾。
- 如果您覺得好用，可以透過 Bilibili 聯繫 B站 [LMemory氿忆](https://space.bilibili.com/7132721) 自願贊助。贊助完全自願，不構成購買或付費服務，也不會獲得額外功能、服務、授權或優先支援，不影響您正常使用本工具。作者未授權任何第三方收費銷售本工具；如您是付費獲得，該收費與作者無關，作者無法辦理退款，請聯繫收款方處理。感謝支援。

### 致謝與資料來源

- **[PoE2DB (流亡編年史)](https://poe2db.tw/)** — 提供裝備基底、詞綴數值範圍、權重、換界石/碑牌詞綴及三語本地化資料支援。
- **[炖了一锅鱼](https://space.bilibili.com/27021867)** — 提供高價值碑牌詞綴組合參考資料。
- **作者**：[LMemory氿忆](https://space.bilibili.com/7132721)
- 本專案為玩家社群開源工具，與 Grinding Gear Games 無隸屬或合作關係，遊戲內圖示與美術資源版權歸 Grinding Gear Games 所有。
