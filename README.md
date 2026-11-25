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

A lightweight, zero-build, pure-frontend **Path of Exile 2 (PoE 2) All-in-One Tools Hub** integrating two core tools under a unified **Path of Exile 2 Theme**:

1. **Tool 1 · PoE 2 Trade Regex Builder** (`pages/tool1_regex/`): Instant search-regex generator for the Path of Exile 2 trade site (`Waystones` & `Tablets`) with tier-merged affixes, numeric thresholds, 148 high-value tablet combos, favorite presets, and automatic 250-character budget degradation.
2. **Tool 2 · PoE 2 Crafting Simulator** (`pages/tool2_crafting/`): Full 81 item classes synced with PoE2DB modifier pools (`Workbench Mode` & `Currency Stash Sim Mode`), supporting tiered currencies, omens, essences & alloys, abyssal desecration (3-choose-1 Well of Souls reveal), Atziri's temple currencies, Runes of Aldur, composite modifier auto-summing, live DPS / defence calculation, and a toggleable **1.0 Season Currency Forecast (Early Preview)** box.

Supports real-time trilingual switching across **English (`EN`, default)**, **Simplified Chinese (`简中`)**, and **Traditional Chinese (`繁體`)**, plus JSON backup export/import from the hub index.

### Quick Start & Usage

#### Option 1: Online Web Version (GitHub Pages)
No download or installation required. Open directly in your browser:
- **Tools Hub (Index Portal)**: [https://lakemem0ry.github.io/poe_2_tools/](https://lakemem0ry.github.io/poe_2_tools/)
- **Tool 1 · Trade Regex Builder**: [https://lakemem0ry.github.io/poe_2_tools/pages/tool1_regex/](https://lakemem0ry.github.io/poe_2_tools/pages/tool1_regex/) (or `#regex`)
- **Tool 2 · Crafting Simulator**: [https://lakemem0ry.github.io/poe_2_tools/pages/tool2_crafting/](https://lakemem0ry.github.io/poe_2_tools/pages/tool2_crafting/)

#### Option 2: Local Offline Deployment (Releases Archive)
1. Go to [**GitHub Releases**](https://github.com/lakemem0ry/poe_2_tools/releases) and download the latest tool archive (`.zip`).
2. Extract the archive to any local folder on your computer.
3. Double-click **`index.html`** to open the Tools Hub directly in any modern browser (Chrome, Edge, Firefox, Safari) and launch either tool.
4. **No local server, Node.js, or internet connection is required**—all 81 item category datasets and regex databases work 100% offline.

### 1. Trade Regex Tool Features (`PoE2_RexTool`)

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
  - **Favorites & Backup**: Save presets in `localStorage` or export/import a portable `.json` backup from the Hub index.

### 2. Crafting Simulator Features

- **Dual Crafting Views**:
  - **Workbench Mode**: Symmetric 3-column layout—crafting orbs, omens, essences, abyssal bones, and temple currencies on the left; live item tooltip, affix slot sandbox controls, composite merge breakdown, and cost/log tracker in the center; sticky PoE2DB modifier pool and real-time roll probability calculator on the right.
  - **Currency Stash Sim Mode**: Recreates the in-game currency stash altar (3×5 tiered orbs on the left wing, 5 core orbs + item pedestal in the center, 2×4 quality/socket/abyssal bone quick slots on the right wing), with an immediate 3-choice **Well of Souls Reveal** panel and a 6-tab tool drawer right beneath the pedestal for zero vertical scrolling.
- **Complete PoE 2 Crafting Mechanics**:
  - **Core & Tiered Currencies**: Transmutation, Augmentation, Regal, Chaos, Exalted (Regular / Greater II / Perfect III), Alchemy, Annulment, Divine, Fracturing, Artificer's Orb, and Vaal Orb.
  - **Crafting & Abyssal Omens**: Sinistral/Dextral Exaltation, Greater Exaltation, Whittling, Sinistral/Dextral Erasure, Sinistral/Dextral Annulment, Sinistral/Dextral Crystallisation, Blessed, Sanctification, Corruption, Light, Abyssal Echoes, Sinistral/Dextral Necromancy, and Lich Omens (Sovereign/Liege/Blackblooded), with a reusable **Lock Omens** toggle.
  - **Essences & Alloys**: Filterable by *All / Lesser / Regular / Greater / Perfect / Special / Alloy* with trilingual & alias search.
  - **Abyssal Desecration**: Gnawed, Preserved, and Ancient Jawbones trigger a 3-choose-1 Well of Souls reveal with Echoes reroll support.
  - **Atziri's Temple Currencies & Runes of Aldur**: Infusers (up to 30% Quality), Orbs of Sacrifice, Architect's Orb (single-use Twice-Corrupted outcome), Vaal Siphoner, Orb of Extraction, and class-specific Aldur Runes.
  - **1.0 Season Currency Forecast (Early Preview)**: Toggleable standalone panel showcasing the 6 Conquerors of Wraeclast Castle Treasury marks (`[Forgemark]` ≤ iLvl 64 & `[Bloodmark]` Min Mod Lv65, both supporting prefix/suffix selection and one-time Reforge → Fractured locking).

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
├── index.html                           # Modular Hub Index (links to Tool 1 & Tool 2 + JSON backup)
├── pages/
│   ├── tool1_regex/index.html           # Tool 1: Trade Regex Builder page
│   └── tool2_crafting/index.html        # Tool 2: Crafting Simulator page (?mode=workbench / stash)
├── styles/
│   ├── base.css                         # Path of Exile 2 Theme shared visual system & portal cards
│   ├── tool1_regex.css                  # Tool 1 styles
│   └── tool2_crafting.css               # Tool 2 styles
├── src/
│   ├── shared/                          # layout.js, i18n.js, seasonManager.js, storage.js
│   ├── tool1_regex/                     # regexEngine.js, regexUI.js
│   └── tool2_crafting/                  # craftingEngine.js, craftingUI.js
└── data/
    ├── poe2db/
    │   ├── seasons_index.js             # Season manifest (current & archive structure)
    │   ├── current/                     # equipment/ (catalog + 81 classes), atlas/, currency/
    │   └── archive/0.4/                 # Archived season structure
    ├── tool_data/
    │   ├── tool1_regex/high_value_combos.js
    │   └── tool2_crafting/season10_forecast.js
    └── user/default_profile.js          # Default preferences & backup schema
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

一款轻量级、零构建依赖的纯前端 **《流放之路 2》(Path of Exile 2) 二合一综合工具站**，基于统一的 **流放之路 2 主题** 与多页索引架构整合两大核心工具：

1. **工具 1 · PoE 2 市集词缀正则工具**（`pages/tool1_regex/`）：专为《流放之路 2》交易市集与仓库搜索框打造，支持引路石/碑牌多阶级词缀合并、数值阈值过滤、148 组高价值碑牌词缀参考、自定义收藏夹预设，以及 250 字符预算自动降级压缩。
2. **工具 2 · PoE 2 做装模拟器**（`pages/tool2_crafting/`）：完整收录与 PoE2DB 同步的 81 类装备词缀池，提供 **工作台模式** 与 **通货仓库模拟模式**，支持各阶通货、预兆、精华与合金、深渊亵渎（三选一揭示）、阿兹里神庙通货、奥杜尔符文、复合词缀自动累加、实时武器 DPS / 护甲防御计算，并内置可开关的 **1.0 赛季通货预测（体验尝鲜）** 方框。

支持 **English (`EN`)**、**简体中文 (`简中`)**、**繁體中文 (`繁體`)** 跨页面三语同步切换，并在首页支持用户设置与收藏夹的一键 JSON 导出/导入备份。

### 快速开始与使用方式

#### 方式一：在线网页版（GitHub Pages 推荐）
无需下载或安装任何环境，直接在浏览器打开即可使用：
- **工具站总索引门户**：[https://lakemem0ry.github.io/poe_2_tools/](https://lakemem0ry.github.io/poe_2_tools/)
- **工具 1 · 市集词缀正则工具**：[https://lakemem0ry.github.io/poe_2_tools/pages/tool1_regex/](https://lakemem0ry.github.io/poe_2_tools/pages/tool1_regex/)（兼容 `#regex` 旧书签）
- **工具 2 · 做装模拟器**：[https://lakemem0ry.github.io/poe_2_tools/pages/tool2_crafting/](https://lakemem0ry.github.io/poe_2_tools/pages/tool2_crafting/)

#### 方式二：本地离线使用（解压即用，无需本地服务器）
1. 前往本仓库的 [**GitHub Releases**](https://github.com/lakemem0ry/poe_2_tools/releases) 页面，下载最新发布的工具压缩包（`.zip`）。
2. 将压缩包解压到电脑本地任意文件夹。
3. 直接双击打开根目录的 **`index.html`**，即可通过门户首页进入任意独立工具页面（Chrome、Edge、Firefox、Safari 均完美离线兼容）。
4. **无需启动本地服务器、无需安装 Node.js 或 Python，也无需联网**——全部 81 类装备词缀库与正则词缀数据均已按赛季结构内置。

### 1. 市集词缀正则工具功能特性 (`PoE2_RexTool`)

勾选词缀、填入数值下限，自动拼出可直接粘贴到《流放之路 2》交易市集或游戏内搜索框的带引号正则表达式。

- **引路石专属过滤**：
  - **阶级过滤 (T1–T16)**：严格匹配不同语言客户端的词序（英文 `Tier\s*16`、繁中 `階級\s*16\s*`、简中 `\s*16\s*阶`）。
  - **可用复活次数 (`0–5`)**、**稀有度多选**（引路石支持 *普通 / 魔法 / 稀有*，碑牌额外包含 *传奇*）、**腐化状态**，以及 **引路石效果下限过滤**。
- **词缀过滤与多阶合并**：
  - **34 条引路石词缀** 与覆盖 **8 大碑牌类型** 的 **92 条碑牌词缀**。
  - **同词缀多阶合并 & 复合词缀精准展示**：同一词缀的不同 Tier 自动合并总范围；多行混合词缀共用同一组 `+` / `−` 开关。
  - **热门词缀栏 & 148 组高价值碑牌组合参考**：支持按最低参考价格（`E` / `C` / `D`）与碑牌类型筛选并一键复制正则。
  - **250 字符限制与自动降级**：按 **248 字符** 安全预算生成，超长时自动将数值范围逐个降级为 `[0-9]` 确保不截断。
  - **收藏夹与备份**：自动保存在 `localStorage`，也可在首页一键导出/导入 `.json` 备份文件。

### 2. 做装模拟器功能特性

- **双视图做装体验**：
  - **工作台模式 (Workbench Mode)**：左侧通货/预兆/精华/深渊/神庙；中栏实时装备悬浮窗、词缀槽沙盒、复合词缀拆解与消耗日志；右侧 PoE2DB 词缀池与实时概率计算器。
  - **通货仓库模拟模式 (Currency Stash Sim Mode)**：还原游戏内通货仓库祭坛，搭配灵魂之井三选一揭示与 6 标签工具抽屉。
- **完整的 PoE 2 做装机制**：
  - **基础与阶级通货、制作与深渊预兆（支持锁定预兆）、精华与合金、深渊亵渎三选一、阿兹里神庙通货、奥杜尔秘符**。
  - **1.0 赛季通货预测（体验尝鲜）**：独立可开关方框，支持「瓦尔克拉斯征服者」攻城宝库 6 种新通货（≤Lv64 熔炉标记 & Lv65+ 鲜血血瓶，均支持自选任意前后缀打标记并一次性重铸锁定为永久破裂词缀，仅供参考）。
- **复合词缀与同属性自动累加**：按住 `Alt` 键可随时展开查看各阶明细，并实时重算武器 DPS 与护甲防御面板。

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
├── index.html                           # 门户总索引页（跳转工具 1/2 + 用户存档导出导入）
├── pages/
│   ├── tool1_regex/index.html           # 工具 1：市集词缀正则工具独立页面
│   └── tool2_crafting/index.html        # 工具 2：做装模拟器独立页面（支持 ?mode=workbench / stash）
├── styles/
│   ├── base.css                         # 流放之路 2 主题全站公共样式与门户样式
│   ├── tool1_regex.css                  # 工具 1 专属样式
│   └── tool2_crafting.css               # 工具 2 专属样式
├── src/
│   ├── shared/                          # 公共基础层（layout.js / i18n.js / seasonManager.js / storage.js）
│   ├── tool1_regex/                     # 工具 1 引擎与视图（regexEngine.js / regexUI.js）
│   └── tool2_crafting/                  # 工具 2 引擎与视图（craftingEngine.js / craftingUI.js）
└── data/
    ├── poe2db/
    │   ├── seasons_index.js             # 赛季版本清单索引
    │   ├── current/                     # 当前赛季 PoE2DB 原数据（equipment / atlas / currency）
    │   └── archive/0.4/                 # 历史赛季按赛季归档结构（equipment / atlas / currency）
    ├── tool_data/
    │   ├── tool1_regex/high_value_combos.js
    │   └── tool2_crafting/season10_forecast.js
    └── user/default_profile.js          # 默认用户配置与备份结构定义
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

一款輕量級、零建置依賴的純前端 **《流亡黯道 2》(Path of Exile 2) 二合一綜合工具站**，基於統一的 **流亡黯道 2 主題** 與多頁索引架構整合兩大核心工具：

1. **工具 1 · PoE 2 市集詞綴正則工具**（`pages/tool1_regex/`）：專為《流亡黯道 2》交易市集與倉庫搜尋框打造，支援換界石/碑牌多階級詞綴合併、數值閾值過濾、148 組高價值碑牌詞綴參考、自訂收藏夾預設，以及 250 字元預算自動降級壓縮。
2. **工具 2 · PoE 2 做裝模擬器**（`pages/tool2_crafting/`）：完整收錄與 PoE2DB 同步的 81 類裝備詞綴池，提供 **工作台模式** 與 **通貨倉庫模擬模式**，支援各階通貨、預兆、精髓與合金、深淵褻瀆（三選一揭示）、阿茲里神廟通貨、奧杜爾符文、複合詞綴自動累加、即時武器 DPS / 護甲防禦計算，並內建可開關的 **1.0 賽季通貨預測（體驗嘗鮮）** 方框。

支援 **English (`EN`)**、**简体中文 (`简中`)**、**繁體中文 (`繁體`)** 跨頁面三語同步切換，並在首頁支援使用者設定與收藏夾的一鍵 JSON 匯出/匯入備份。

### 快速開始與使用方式

#### 方式一：線上網頁版（GitHub Pages 推薦）
無需下載或安裝任何環境，直接在瀏覽器開啟即可使用：
- **工具站總索引門戶**：[https://lakemem0ry.github.io/poe_2_tools/](https://lakemem0ry.github.io/poe_2_tools/)
- **工具 1 · 市集詞綴正則工具**：[https://lakemem0ry.github.io/poe_2_tools/pages/tool1_regex/](https://lakemem0ry.github.io/poe_2_tools/pages/tool1_regex/)（相容 `#regex` 舊書籤）
- **工具 2 · 做裝模擬器**：[https://lakemem0ry.github.io/poe_2_tools/pages/tool2_crafting/](https://lakemem0ry.github.io/poe_2_tools/pages/tool2_crafting/)

#### 方式二：本地離線使用（解壓即用，無需本地伺服器）
1. 前往本儲存庫的 [**GitHub Releases**](https://github.com/lakemem0ry/poe_2_tools/releases) 頁面，下載最新發佈的工具壓縮包（`.zip`）。
2. 將壓縮包解壓縮到電腦本地任意資料夾。
3. 直接雙擊開啟根目錄的 **`index.html`**，即可透過門戶首頁進入任意獨立工具頁面（Chrome、Edge、Firefox、Safari 均完美離線相容）。
4. **無需啟動本地伺服器、無需安裝 Node.js 或 Python，也無需連網**——全部 81 類裝備詞綴庫與正則詞綴資料均已按賽季結構內建。

### 1. 市集詞綴正則工具功能特性 (`PoE2_RexTool`)

勾選詞綴、填入數值下限，自動拼出可直接貼上到《流亡黯道 2》交易市集或遊戲內搜尋框的帶引號正則表達式。

- **換界石專屬過濾**：
  - **階級過濾 (T1–T16)**：嚴格匹配不同語言客戶端的詞序（英文 `Tier\s*16`、繁中 `階級\s*16\s*`、簡中 `\s*16\s*阶`）。
  - **可用復活次數 (`0–5`)**、**稀有度多選**、**腐化狀態**，以及 **換界石效果下限過濾**。
- **詞綴過濾與多階合併**：
  - **34 條換界石詞綴** 與涵蓋 **8 大碑牌類型** 的 **92 條碑牌詞綴**。
  - **同詞綴多階合併 & 複合詞綴精準展示**：同一詞綴的不同 Tier 自動合併總範圍；多行混合詞綴共用同一組 `+` / `−` 開關。
  - **熱門詞綴欄 & 148 組高價值碑牌組合參考**：支援按最低參考價格（`E` / `C` / `D`）與碑牌類型篩選並一鍵複製正則。
  - **250 字元限制與自動降級**：按 **248 字元** 安全預算產生，超長時自動將數值範圍逐個降級為 `[0-9]` 確保不截斷。
  - **收藏夾與備份**：自動儲存在 `localStorage`，也可在首頁一鍵匯出/匯入 `.json` 備份檔案。

### 2. 做裝模擬器功能特性

- **雙視圖做裝體驗**：
  - **工作台模式 (Workbench Mode)**：左側通貨/預兆/精髓/深淵/神廟；中欄即時裝備懸浮窗、詞綴槽沙盒、複合詞綴拆解與消耗日誌；右側 PoE2DB 詞綴池與即時機率計算機。
  - **通貨倉庫模擬模式 (Currency Stash Sim Mode)**：還原遊戲內通貨倉庫祭壇，搭配靈魂之井三選一揭示與 6 標籤工具抽屜。
- **完整的 PoE 2 做裝機制**：
  - **基礎與階級通貨、製作與深淵預兆（支援鎖定預兆）、精髓與合金、深淵褻瀆三選一、阿茲里神廟通貨、奧杜爾符文**。
  - **1.0 賽季通貨預測（體驗嘗鮮）**：獨立可開關方框，支援「瓦爾克拉斯征服者」攻城寶庫 6 種新通貨（≤Lv64 熔爐標記 & Lv65+ 鮮血血瓶，均支援自選任意前後綴打標記並一次性重鑄鎖定為永久破裂詞綴，僅供參考）。
- **複合詞綴與同屬性自動累加**：按住 `Alt` 鍵可隨時展開查看各階明細，並即時重算武器 DPS 與護甲防禦面板。

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
├── index.html                           # 門戶總索引頁（跳轉工具 1/2 + 使用者存檔匯出匯入）
├── pages/
│   ├── tool1_regex/index.html           # 工具 1：市集詞綴正則工具獨立頁面
│   └── tool2_crafting/index.html        # 工具 2：做裝模擬器獨立頁面（支援 ?mode=workbench / stash）
├── styles/
│   ├── base.css                         # 流亡黯道 2 主題全站公共樣式與門戶樣式
│   ├── tool1_regex.css                  # 工具 1 專屬樣式
│   └── tool2_crafting.css               # 工具 2 專屬樣式
├── src/
│   ├── shared/                          # 公共基礎層（layout.js / i18n.js / seasonManager.js / storage.js）
│   ├── tool1_regex/                     # 工具 1 引擎與視圖（regexEngine.js / regexUI.js）
│   └── tool2_crafting/                  # 工具 2 引擎與視圖（craftingEngine.js / craftingUI.js）
└── data/
    ├── poe2db/
    │   ├── seasons_index.js             # 賽季版本清單索引
    │   ├── current/                     # 當前賽季 PoE2DB 原資料（equipment / atlas / currency）
    │   └── archive/0.4/                 # 歷史賽季按賽季歸檔結構（equipment / atlas / currency）
    ├── tool_data/
    │   ├── tool1_regex/high_value_combos.js
    │   └── tool2_crafting/season10_forecast.js
    └── user/default_profile.js          # 預設使用者設定與備份結構定義
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
