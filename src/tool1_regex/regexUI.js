/**
 * 工具 1：PoE2 市集与仓库词缀正则生成器界面控制器
 * 基于 PoE2DB (https://poe2db.tw/) 官方三语词缀库与无碰撞短片段算法构建
 */
(function () {
  "use strict";
  var D = window.POE2_DATA || { waystone: [], tablet: [] };
  var R = window.POE2_REGEX;
  var I = window.POE2_I18N;
  var HV = window.POE2_HIGHVALUE || {};
  var $ = function (id) { return document.getElementById("rex-" + id); };

  var KEY = "poe2.regex.v8";
  var LEGACY_KEYS = ["poe2.regex.v7"];
  var TABS = ["waystone", "tablet"];
  var RATE = { E: 1, C: 56, D: 468 };
  var HOT_IDS = ["wt025", "wt026", "wt027", "wt023", "wt022", "wt024"];

  function freshPage() {
    return {
      prefix: true, suffix: true, search: "", match: "all",
      types: [], basic: { revives: "", rarities: [], corruption: "" }, selected: {},
      tierMin: "", tierMax: "",
      summary: { eff: "", itemRarity: "", monsterRarity: "", packSize: "", waystone: "" }
    };
  }

  function defaults() {
    var o = {
      version: 8, language: "cn", tab: "waystone",
      presets: { waystone: [], tablet: [] },
      hvPrice: "", hvCurrency: "E", hvTypes: []
    };
    for (var i = 0; i < TABS.length; i++) o[TABS[i]] = freshPage();
    return o;
  }

  function allAffixes() { return D.waystone.concat(D.tablet); }

  function sanitizeSnapshot(src) {
    var out = { prefix: true, suffix: true, match: "all", types: [], basic: { revives: "", rarities: [], corruption: "" }, selected: {}, summary: {}, tierMin: "", tierMax: "" };
    if (!src || typeof src !== "object") return out;
    if (typeof src.prefix === "boolean") out.prefix = src.prefix;
    if (typeof src.suffix === "boolean") out.suffix = src.suffix;
    out.match = src.match === "any" ? "any" : "all";
    out.types = Array.isArray(src.types) ? src.types.slice(0, 16) : [];
    if (typeof src.tierMin === "string") out.tierMin = src.tierMin.slice(0, 2);
    if (typeof src.tierMax === "string") out.tierMax = src.tierMax.slice(0, 2);
    if (src.basic && typeof src.basic === "object") {
      ["rarity", "corruption", "revives"].forEach(function (k) {
        if (typeof src.basic[k] === "string") out.basic[k] = src.basic[k];
      });
      out.basic.rarities = Array.isArray(src.basic.rarities)
        ? src.basic.rarities.filter(function (x) { return ["normal", "magic", "rare", "unique"].indexOf(x) >= 0; }).slice(0, 4)
        : [];
    }
    if (src.summary && typeof src.summary === "object") {
      ["eff", "itemRarity", "monsterRarity", "packSize", "waystone"].forEach(function (k) {
        if (typeof src.summary[k] === "string" && src.summary[k].length <= 4) out.summary[k] = src.summary[k];
      });
    }
    if (src.selected && typeof src.selected === "object") {
      var all = allAffixes();
      Object.keys(src.selected).slice(0, 400).forEach(function (id) {
        var v = src.selected[id];
        if (!v || (v.mode !== "include" && v.mode !== "exclude")) return;
        if (!all.some(function (a) { return a.id === id; })) return;
        out.selected[id] = {
          mode: v.mode,
          value: typeof v.value === "string" ? v.value.slice(0, 8) : "",
          value2: typeof v.value2 === "string" ? v.value2.slice(0, 8) : ""
        };
      });
    }
    return out;
  }

  function restore(raw) {
    var out = defaults();
    if (!raw || (raw.version < 1 || raw.version > 8)) return out;
    if (TABS.indexOf(raw.tab) >= 0) out.tab = raw.tab;
    if (raw.language && (raw.language === "cn" || raw.language === "tw" || raw.language === "en")) out.language = raw.language;
    if (raw.hvCurrency && Object.prototype.hasOwnProperty.call(RATE, raw.hvCurrency)) out.hvCurrency = raw.hvCurrency;
    if (typeof raw.hvPrice === "string" || typeof raw.hvPrice === "number") out.hvPrice = String(raw.hvPrice).slice(0, 8);
    if (Array.isArray(raw.hvTypes)) {
      out.hvTypes = raw.hvTypes.filter(function (t) {
        return I.tabletTypes.some(function (x) { return x.id === t; });
      }).slice(0, 16);
    }
    if (raw.presets && typeof raw.presets === "object") {
      TABS.forEach(function (name) {
        var arr = raw.presets[name];
        if (!Array.isArray(arr)) return;
        out.presets[name] = arr.slice(0, 40).map(function (pr) {
          if (!pr || typeof pr !== "object") return null;
          return {
            id: typeof pr.id === "string" ? pr.id : "p" + Math.random().toString(36).slice(2),
            name: String(pr.name == null ? "" : pr.name).slice(0, 24),
            data: sanitizeSnapshot(pr.data)
          };
        }).filter(function (x) { return x && x.name; });
      });
    }
    for (var t = 0; t < TABS.length; t++) {
      var name = TABS[t], src = raw[name], p = out[name];
      if (!src || typeof src !== "object") continue;
      if (typeof src.prefix === "boolean") p.prefix = src.prefix;
      if (typeof src.suffix === "boolean") p.suffix = src.suffix;
      if (typeof src.search === "string" && src.search.length <= 64) p.search = src.search;
      p.match = src.match === "any" ? "any" : "all";
      p.types = Array.isArray(src.types) ? src.types.slice(0, 16) : [];
      if (typeof src.tierMin === "string" && src.tierMin.length <= 2) p.tierMin = src.tierMin;
      if (typeof src.tierMax === "string" && src.tierMax.length <= 2) p.tierMax = src.tierMax;
      if (src.basic && typeof src.basic === "object") {
        ["rarity", "corruption", "revives"].forEach(function (k) {
          if (typeof src.basic[k] === "string" && src.basic[k].length <= 12) p.basic[k] = src.basic[k];
        });
        if (Array.isArray(src.basic.rarities)) {
          p.basic.rarities = src.basic.rarities.filter(function (x) { return ["normal", "magic", "rare", "unique"].indexOf(x) >= 0; }).slice(0, 4);
        }
      }
      if (src.summary && typeof src.summary === "object") {
        Object.keys(p.summary).forEach(function (k) {
          if (typeof src.summary[k] === "string" && src.summary[k].length <= 4) p.summary[k] = src.summary[k];
        });
      }
      if (src.selected && typeof src.selected === "object") {
        var all = allAffixes();
        Object.keys(src.selected).slice(0, 400).forEach(function (id) {
          var v = src.selected[id];
          if (!v || (v.mode !== "include" && v.mode !== "exclude")) return;
          if (!all.some(function (a) { return a.id === id; })) return;
          p.selected[id] = {
            mode: v.mode,
            value: typeof v.value === "string" && v.value.length <= 8 ? v.value : "",
            value2: typeof v.value2 === "string" && v.value2.length <= 8 ? v.value2 : ""
          };
        });
      }
    }
    return out;
  }

  var state = defaults(), storageOK = true;
  try {
    var rawJson = localStorage.getItem(KEY);
    if (!rawJson) {
      for (var lk = 0; lk < LEGACY_KEYS.length; lk++) {
        rawJson = localStorage.getItem(LEGACY_KEYS[lk]);
        if (rawJson) break;
      }
    }
    state = restore(JSON.parse(rawJson || "null"));
  } catch (e) { storageOK = false; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOK = true; }
    catch (e) { storageOK = false; }
    var el = $("status");
    if (el) el.textContent = storageOK ? tr("saved") : tr("saveBlocked");
  }

  function tr(key) { var v = I.t[key]; if (!v) return key; return v[state.language] || v.cn || key; }
  function loc(obj) { if (!obj) return null; return obj[state.language] || obj.cn || obj.en || null; }
  function typeObjOf(id) {
    for (var i = 0; i < I.tabletTypes.length; i++) if (I.tabletTypes[i].id === id) return I.tabletTypes[i];
    return null;
  }
  function nameOfType(id) { var t = typeObjOf(id); return t ? loc(t) : id; }
  function stemOfType(id) { var t = typeObjOf(id); return t && t.stem ? loc(t.stem) : nameOfType(id); }
  function html(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function page() { return state[state.tab]; }
  function affixById(id) { var all = allAffixes(); for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i]; return null; }

  var SUMMARY_FIELDS = [
    { id: "itemRarity", label: "smItemRarity", regexPrefix: { cn: "物品稀有度", tw: "物品稀有度", en: "Item Rarity" } },
    { id: "packSize", label: "smPackSize", regexPrefix: { cn: "怪物群规模", tw: "怪物?群大小", en: "(?:Monster )?Pack Size" }, isRegexPrefix: true },
    { id: "eff", label: "smEff", regexPrefix: { cn: "怪物(?:强度|效能)", tw: "怪物(?:效用|效能)", en: "Monster Effectiveness" }, isRegexPrefix: true },
    { id: "monsterRarity", label: "smMonsterRarity", regexPrefix: { cn: "怪物稀有度", tw: "怪物稀有度", en: "Monster Rarity" } },
    { id: "waystone", label: "smWaystone", regexPrefix: { cn: "引路石掉落几率", tw: "換界石掉落機率", en: "Waystone Drop Chance" } }
  ];

  function filtered() {
    var p = page(), tab = state.tab;
    if (tab === "tablet" && !p.types.length) return [];
    var q = p.search.trim().toLowerCase();
    return (D[tab] || []).filter(function (a) {
      // 传奇石板始终独立展现；普通前后缀受前后缀开关控制
      if (!a.unique && !p[a.side === "suffix" ? "suffix" : "prefix"]) return false;
      if (tab === "tablet" && a.types && a.types.length && p.types.length && !a.types.some(function (t) { return p.types.indexOf(t) >= 0; })) return false;
      if (q) {
        var modNames = a.modName ? [a.modName.cn, a.modName.tw, a.modName.en] : [];
        var hay = [loc(a.tpl), a.tpl.cn, a.tpl.tw, a.tpl.en].concat(modNames).filter(Boolean).join(" ").toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function affixLines(a) {
    var L = a.lines || {};
    var cur = L[state.language];
    if (cur && cur.length) return cur;
    if (L.cn && L.cn.length) return L.cn;
    var t = loc(a.tpl);
    return t ? [t] : [];
  }

  function parseOptNum(raw) {
    if (raw === undefined || raw === null) return undefined;
    var s = String(raw).trim();
    if (!s || s === "-" || s === "+") return undefined;
    var n = Number(s);
    return isNaN(n) ? undefined : n;
  }

  /**
   * 为单条词缀生成正则片段：
   * - 绝不跨 `\n` 拼接多行复合词缀（取第 1 行主语义确保游戏内逐行命中）
   * - opts.compact = true 时使用语料库算出的无碰撞最短片段 + 保留数值门槛
   * - opts.relaxNumbers = true 时在保持文本区别的前提下放宽数值匹配
   */
  function fragmentFor(a, sel, opts) {
    opts = opts || {};
    var tab = opts.tab || state.tab;
    var lang = opts.lang || state.language;
    var lines = (a.lines && a.lines[lang]) || affixLines(a);
    if (!lines || !lines.length) return null;

    var mainLine = lines[0];
    var corpusMap = R.getCorpusMap(D[tab] || D.tablet, lang);
    var corpusEntry = corpusMap[a.id];

    var hasMin = sel && sel.mode === "include" && parseOptNum(sel.value) !== undefined;
    var hasMax = sel && sel.mode === "include" && parseOptNum(sel.value2) !== undefined;
    var tOpts = {
      atLeast: hasMin ? parseOptNum(sel.value) : undefined,
      atMost: hasMax ? parseOptNum(sel.value2) : undefined,
      lang: lang,
      stackMax: a.stackMax,
      compact: !!opts.compact,
      relaxNumbers: !!opts.relaxNumbers
    };

    if (hasMin || hasMax) {
      // 用户填写门槛时即便是默认层级也优先检测有效性（若填反如 20..10 则返回 null）
      var thr = opts.compact
        ? R.compactThreshold(a, corpusEntry, tOpts)
        : R.threshold(mainLine, tOpts);
      return thr || null;
    }

    if (opts.compact && corpusEntry && corpusEntry.presence) {
      return corpusEntry.presence;
    }
    return R.presence(mainLine, { lang: lang, compact: !!opts.compact });
  }

  function tierFragments(p, tab, compact) {
    var out = [];
    if (tab !== "waystone") return out;
    var min = p.tierMin ? parseInt(p.tierMin, 10) : null;
    var max = p.tierMax ? parseInt(p.tierMax, 10) : null;
    if (min === null && max === null) return out;
    if (min === null) min = 1;
    if (max === null) max = 16;
    if (min < 1) min = 1;
    if (max > 16) max = 16;
    if (min > max) { var tmp = min; min = max; max = tmp; }
    if (min === 1 && max === 16) return out;
    var range = R.numberInRange(min, max);
    if (!range) return out;
    var lang = state.language;
    if (lang === "en") out.push((compact ? "r " : "Tier\\s+") + range + "\\)");
    else if (lang === "tw") out.push((compact ? "級\\s*" : "階級\\s*") + range + "[）)]");
    else out.push((compact ? "[（(]\\s*" : "[（(]\\s*") + range + "\\s*阶[）)]");
    return out;
  }

  function summaryFragments(p, tab, compact) {
    var out = [];
    if (tab !== "waystone") return out;
    SUMMARY_FIELDS.forEach(function (f) {
      var raw = p.summary[f.id];
      if (raw === "" || raw == null) return;
      var min = parseInt(raw, 10);
      if (isNaN(min) || min <= 0) return;
      var prefixRaw = loc(f.regexPrefix);
      var prefix = f.isRegexPrefix ? prefixRaw : R.esc(prefixRaw);
      var range = R.numberInRange(min, f.max || 999);
      if (prefix && range) {
        var sep = compact ? "\\s*[:：]\\s*\\+?" : R.fieldSep;
        out.push(prefix + sep + range + "%");
      }
    });
    return out;
  }

  function buildAlwaysBlocks(p, tab, compact) {
    var always = [];
    var lang = state.language;
    var smFrags = summaryFragments(p, tab, compact);
    for (var s = 0; s < smFrags.length; s++) always.push(smFrags[s]);
    var tf = tierFragments(p, tab, compact);
    for (var ti = 0; ti < tf.length; ti++) always.push(tf[ti]);

    // 石板类型底材锚点（全部 8 种全选或未选时自动省略；多选合并为一个清晰底材正则以免与词缀正文“深渊/裂隙”混淆）
    if (tab === "tablet" && p.types.length > 0 && p.types.length < I.tabletTypes.length) {
      var stems = p.types.map(stemOfType).filter(Boolean).map(R.esc);
      if (stems.length) {
        var baseSuf = lang === "en" ? " Tablet" : lang === "tw" ? "碑牌" : "石板";
        if (stems.length === 1) always.push(stems[0] + baseSuf);
        else always.push("(" + stems.join("|") + ")" + baseSuf);
      }
    }

    // 稀有度过滤（全部可选稀有度都选中或全未选时自动省略）
    var maxRarCount = (tab === "waystone" ? 3 : 4);
    if (p.basic.rarities && p.basic.rarities.length > 0 && p.basic.rarities.length < maxRarCount) {
      var rarLine = loc(I.anchors.rarityLine) || "";
      var rarWord = p.basic.rarities.map(function (k) {
        return R.esc(loc(I.anchors[k]) || "");
      }).filter(Boolean);
      if (rarLine && rarWord.length) {
        var rarJoined = rarWord.length === 1 ? rarWord[0] : "(" + rarWord.join("|") + ")";
        always.push((compact && lang === "en" ? "y: " : R.esc(rarLine) + "\\s*[:：]\\s*") + rarJoined);
      }
    }

    // 复活次数（仅引路石）
    if (tab === "waystone" && p.basic.revives !== "" && p.basic.revives != null) {
      var revLbl = loc(I.t.revivesLabel);
      if (revLbl) {
        var revPre = compact && lang === "en" ? "le: "
          : (lang === "cn" ? "(?:可用)?复活次数" : R.esc(revLbl)) + "\\s*[:：]?\\s*";
        always.push(revPre + p.basic.revives);
      }
    }

    if (p.basic.corruption === "yes") always.push(loc(I.anchors.corrupted));
    return always.filter(Boolean);
  }

  /**
   * 检测当前处于“仅魔法石板”模式时，是否需要附加官方词缀名来进一步区分同文本前缀/后缀
   */
  function needsMagicModNameAnchor(a, sel, p, tab) {
    if (tab !== "tablet" || !sel || sel.mode !== "include") return false;
    if (!a.modName || !a.statGroup) return false;
    var rars = p.basic.rarities || [];
    if (rars.length !== 1 || rars[0] !== "magic") return false;
    if (p.match === "any") return false;
    var minVal = parseOptNum(sel.value);
    // 如果后缀明确要求 >=2，数值本身已经彻底排除了 +1 前缀，无需再耗字符拼词缀名
    if (minVal !== undefined && minVal >= 2) return false;
    return true;
  }

  function compose() {
    var p = page(), tab = state.tab;
    var unresolved = [];
    var selIds = Object.keys(p.selected);

    function collectAffixLists(opts) {
      var incs = [], excs = [];
      for (var i = 0; i < selIds.length; i++) {
        var id = selIds[i], sel = p.selected[id];
        var a = affixById(id);
        if (!a) continue;
        var frag = fragmentFor(a, sel, opts);
        if (!frag) {
          if (opts.recordUnresolved) unresolved.push(loc(a.tpl) || id);
          continue;
        }
        if (sel.mode === "exclude") {
          excs.push(frag);
        } else {
          incs.push(frag);
          if (needsMagicModNameAnchor(a, sel, p, tab)) {
            var mName = loc(a.modName);
            if (mName) incs.push(R.esc(mName));
          }
        }
      }
      if (p.basic.corruption === "no") excs.push(loc(I.anchors.corrupted));
      return { includes: incs, excludes: excs };
    }

    // 三级生成策略：
    // Level 0: 完整清晰原文版（含精确数值门槛）
    // Level 1: 语料库无碰撞最短片段版（仍保留全部精确数值门槛！）
    // Level 2: 仅当超 248 字符时退化为无门槛最短片段版（绝不粗暴破坏数字字符类）
    var d0 = collectAffixLists({ compact: false, relaxNumbers: false, recordUnresolved: true });
    var d1 = collectAffixLists({ compact: true, relaxNumbers: false });
    var d2 = collectAffixLists({ compact: true, relaxNumbers: true });

    var alwaysFull = buildAlwaysBlocks(p, tab, false);
    var alwaysCompact = buildAlwaysBlocks(p, tab, true);

    var levels = [
      { includes: d0.includes, excludes: d0.excludes, always: alwaysFull, match: p.match },
      { includes: d1.includes, excludes: d1.excludes, always: alwaysCompact, match: p.match },
      { includes: d2.includes, excludes: d2.excludes, always: alwaysCompact, match: p.match }
    ];
    var fitted = R.fit(levels, R.BUDGET_SAFE);

    var smActiveCount = SUMMARY_FIELDS.filter(function (f) { return p.summary[f.id]; }).length;
    var hasTier = (tab === "waystone" && (p.tierMin || p.tierMax) && !(p.tierMin === "1" && p.tierMax === "16")) ? 1 : 0;
    var hasTypeFilter = (tab === "tablet" && p.types.length > 0 && p.types.length < I.tabletTypes.length) ? 1 : 0;
    var maxRar = tab === "waystone" ? 3 : 4;
    var hasRarity = (p.basic.rarities && p.basic.rarities.length > 0 && p.basic.rarities.length < maxRar) ? 1 : 0;

    return {
      ok: fitted.level >= 0 && !fitted.empty && unresolved.length === 0,
      source: fitted.source || "",
      length: fitted.length || 0,
      level: fitted.level,
      over: !!fitted.over,
      unresolved: unresolved,
      count: selIds.length + smActiveCount + hasTier + hasTypeFilter +
        ((tab === "waystone" && p.basic.revives !== "" && p.basic.revives != null) ? 1 : 0) +
        hasRarity + (p.basic.corruption ? 1 : 0)
    };
  }

  var SOURCE_LINKS = [
    { name: "PoE2DB", href: "https://poe2db.tw/" },
    { name: "炖了一锅鱼", href: "https://space.bilibili.com/27021867" }
  ];

  function renderHvHint() {
    var el = $("hv-hint");
    if (!el) return;
    var link = '<a class="footer-link" href="https://space.bilibili.com/27021867" target="_blank" rel="noopener noreferrer">' + html(SOURCE_LINKS[1].name) + "</a>";
    el.innerHTML = html(tr("hvHint")) + " " + html(tr("hvHintSource")) + " " + link;
  }

  function renderChrome() {
    if (!$("tab-waystone")) return;
    $("tab-waystone").textContent = tr("tabWaystone");
    $("tab-tablet").textContent = tr("tabTablet");
    $("language-label").textContent = tr("language");
    $("affix-heading").textContent = tr("affixFilter");
    $("search").placeholder = tr("searchPlaceholder");
    $("toggle-prefix").textContent = tr("prefix");
    $("toggle-suffix").textContent = tr("suffix");
    $("match-all").textContent = tr("matchAll");
    $("match-any").textContent = tr("matchAny");
    $("clear-selected").textContent = tr("clearSelected");
    $("result-heading").textContent = tr("selectedConditions");
    $("regex-heading").textContent = tr("tradePreview");
    $("copy").textContent = tr("copyRegex");
    $("clear").textContent = tr("clearAll");
    $("tier-heading").textContent = tr("tierHeading");
    $("tier-hint").textContent = tr("tierHint");
    $("tier-clear").textContent = tr("summaryClear");
    $("summary-heading").textContent = tr("summaryHeading");
    $("summary-hint").textContent = tr("summaryHint");
    $("summary-clear").textContent = tr("summaryClear");
    if ($("hot-label")) $("hot-label").textContent = tr("hotHeading");
    $("fav-heading").textContent = tr("favHeading");
    $("fav-name").placeholder = tr("favPlaceholder");
    $("fav-save").textContent = tr("favSave");
    $("hv-heading").textContent = tr("hvHeading");
    renderHvHint();
    $("hv-price-label").textContent = tr("hvPrice");

    var tabs = $("tabs").querySelectorAll("button");
    for (var i = 0; i < tabs.length; i++) {
      var active = tabs[i].getAttribute("data-tab") === state.tab;
      tabs[i].classList.toggle("active", active);
      tabs[i].setAttribute("aria-pressed", active ? "true" : "false");
    }
    var p = page();
    $("toggle-prefix").classList.toggle("active", !!p.prefix);
    $("toggle-prefix").setAttribute("aria-pressed", p.prefix ? "true" : "false");
    $("toggle-suffix").classList.toggle("active", !!p.suffix);
    $("toggle-suffix").setAttribute("aria-pressed", p.suffix ? "true" : "false");
    $("match-all").classList.toggle("active", p.match !== "any");
    $("match-all").setAttribute("aria-pressed", p.match !== "any" ? "true" : "false");
    $("match-any").classList.toggle("active", p.match === "any");
    $("match-any").setAttribute("aria-pressed", p.match === "any" ? "true" : "false");
    $("language").value = state.language;
  }

  function renderPrimary() {
    var p = page(), tab = state.tab;
    $("primary-heading").textContent = tab === "tablet" ? tr("tabTablet") : tr("tabWaystone");
    var out = [];
    if (tab === "tablet") {
      out.push('<div class="rex-filter-block"><span class="hint-text">' + html(tr("tabletType")) + '</span><div class="pill-group" id="rex-type-chips">');
      I.tabletTypes.forEach(function (t) {
        var on = p.types.indexOf(t.id) >= 0;
        out.push('<button type="button" class="pill ' + (on ? "active" : "") + '" data-type="' + t.id + '" aria-pressed="' + (on ? "true" : "false") + '">' + html(loc(t)) + "</button>");
      });
      out.push("</div></div>");
    }
    out.push('<div class="rex-primary-row">');
    if (tab === "waystone") {
      out.push('<div class="rex-filter-block"><span class="hint-text">' + html(tr("revivesLabel")) + '</span><div class="pill-group" id="rex-revives-chips">');
      [["", "any"], ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]].forEach(function (r) {
        var on = (p.basic.revives || "") === r[0];
        out.push('<button type="button" class="pill ' + (on ? "active" : "") + '" data-revives="' + r[0] + '" aria-pressed="' + (on ? "true" : "false") + '">' + html(r[0] === "" ? tr("any") : r[1]) + "</button>");
      });
      out.push("</div></div>");
    }
    out.push('<div class="rex-filter-block"><span class="hint-text">' + html(tr("rarity")) + '</span><div class="pill-group" id="rex-rarity-chips">');
    var rarSel = p.basic.rarities || [];
    var rarityOpts = [["", "any"], ["rarityNormal", "normal"], ["rarityMagic", "magic"], ["rarityRare", "rare"]];
    if (tab !== "waystone") rarityOpts.push(["rarityUnique", "unique"]);
    rarityOpts.forEach(function (r) {
      var val = r[1] === "any" ? "" : r[1];
      var label = r[0] ? tr(r[0]) : tr("any");
      var on = val === "" ? (rarSel.length === 0) : (rarSel.indexOf(val) >= 0);
      out.push('<button type="button" class="pill ' + (on ? "active" : "") + '" data-rarity="' + val + '" aria-pressed="' + (on ? "true" : "false") + '">' + html(label) + "</button>");
    });
    out.push("</div></div>");

    out.push('<div class="rex-filter-block"><span class="hint-text">' + html(tr("corrupted")) + '</span><div class="pill-group" id="rex-corruption-chips">');
    [["", "any"], ["no", "corruptedNo"], ["yes", "corruptedYes"]].forEach(function (r) {
      var on = (p.basic.corruption || "") === r[0];
      out.push('<button type="button" class="pill ' + (on ? "active" : "") + '" data-corruption="' + r[0] + '" aria-pressed="' + (on ? "true" : "false") + '">' + html(r[0] === "" ? tr("any") : tr(r[1])) + "</button>");
    });
    out.push("</div></div></div>");
    $("primary-body").innerHTML = out.join("");
  }

  function renderTierPanel() {
    var card = $("tier-card");
    card.classList.toggle("hidden", state.tab !== "waystone");
    if (state.tab !== "waystone") return;
    var p = page();
    $("tier-body").innerHTML =
      '<div class="field"><label for="rex-tier-min">' + html(tr("tierMin")) + '</label>' +
      '<input id="rex-tier-min" type="number" inputmode="numeric" min="1" max="16" data-tier="min" placeholder="1" value="' + html(p.tierMin || "") + '"></div>' +
      '<div class="field"><label for="rex-tier-max">' + html(tr("tierMax")) + '</label>' +
      '<input id="rex-tier-max" type="number" inputmode="numeric" min="1" max="16" data-tier="max" placeholder="16" value="' + html(p.tierMax || "") + '"></div>';
  }

  function renderSummaryPanel() {
    var card = $("summary-card");
    card.classList.toggle("hidden", state.tab !== "waystone");
    if (state.tab !== "waystone") return;
    var p = page();
    var out = [];
    SUMMARY_FIELDS.forEach(function (f) {
      var v = p.summary[f.id] || "";
      out.push('<div class="field"><label for="rex-sm-' + f.id + '">' + html(tr(f.label)) + '</label>');
      out.push('<input id="rex-sm-' + f.id + '" type="number" inputmode="numeric" min="0" max="' + (f.max || 999) + '" step="1" data-summary="' + f.id + '" placeholder="' + html(tr("unlimited")) + '" value="' + html(v) + '"></div>');
    });
    $("summary-body").innerHTML = out.join("");
  }

  function renderHotBar() {
    var card = $("hot-bar");
    card.classList.toggle("hidden", state.tab === "tablet");
    if (state.tab === "tablet") return;
    var p = page(), rows = [];
    HOT_IDS.forEach(function (id) {
      var a = affixById(id);
      if (!a) return;
      var sel = p.selected[id];
      var cls = "rex-hot-row" + (sel ? (sel.mode === "include" ? " inc" : " exc") : "");
      var text = loc(a.tpl) || a.tpl.cn || id;
      rows.push(
        '<div class="' + cls + '" data-hot="' + html(id) + '">' +
          '<span class="rex-hot-text">' + html(text) + '</span>' +
          '<span class="rex-row-actions">' +
            '<button type="button" class="rex-icon-btn inc" data-hotact="include" title="' + html(tr("include")) + '" aria-label="' + html(tr("include")) + '">+</button>' +
            '<button type="button" class="rex-icon-btn exc" data-hotact="exclude" title="' + html(tr("exclude")) + '" aria-label="' + html(tr("exclude")) + '">−</button>' +
          "</span></div>"
      );
    });
    card.innerHTML = '<span class="rex-hot-label" id="rex-hot-label">' + html(tr("hotHeading")) + '</span><div class="rex-hot-list">' + rows.join("") + "</div>";
  }

  function hvName(item) {
    if (state.language === "en") return item.en || item.cn || item.n || "";
    if (state.language === "tw") return (item.n || item.cn || "").split("阿茲莫裡").join("阿茲莫里");
    return item.cn || item.n || "";
  }

  function formatPrice(e) {
    if (e >= 468) return (Math.round(e / 468 * 10) / 10) + "D";
    if (e >= 56) return (Math.round(e / 56 * 10) / 10) + "C";
    return Math.round(e) + "E";
  }

  /**
   * 为高价值碑牌组合生成精准且自动压缩的安全正则（≤ 250 字符，完整支持 2+/3+ 叠加与英文单复数）
   */
  function hvBuild(item, tid) {
    function genList(compact) {
      var frags = [];
      for (var i = 0; i < item.a.length; i++) {
        var id = item.a[i][0], min = item.a[i][1];
        var a = affixById(id);
        if (!a) continue;
        var fakeSel = min != null ? { mode: "include", value: String(min), value2: "" } : { mode: "include", value: "", value2: "" };
        var frag = fragmentFor(a, fakeSel, { tab: "tablet", lang: state.language, compact: compact, relaxNumbers: false });
        if (frag) frags.push(frag);
      }
      return frags;
    }
    var f0 = genList(false);
    var f1 = genList(true);
    if (!f0.length && !f1.length) return null;
    // 同时附带底材类型（单选高价值时用户按类型浏览，或直接保留词缀正则便于贴进市集/仓库搜索）
    var fitted = R.fit([
      { includes: f0, match: "all" },
      { includes: f1, match: "all" }
    ], R.BUDGET_SAFE);
    return (fitted.level >= 0 && !fitted.empty) ? fitted : null;
  }

  function renderHighValue() {
    var card = $("hv-card");
    card.classList.toggle("hidden", state.tab !== "tablet");
    if (state.tab !== "tablet") return;
    var chips = ['<button type="button" class="pill ' + (state.hvTypes.length === 0 ? "active" : "") + '" data-hvtype="__all">' + html(tr("hvTypeAny")) + "</button>"];
    I.tabletTypes.forEach(function (t) {
      var on = state.hvTypes.indexOf(t.id) >= 0;
      chips.push('<button type="button" class="pill ' + (on ? "active" : "") + '" data-hvtype="' + t.id + '">' + html(loc(t)) + "</button>");
    });
    $("hv-types").innerHTML = chips.join("");
    $("hv-price").value = state.hvPrice || "";
    $("hv-currency").value = state.hvCurrency || "E";
    var minE = 0;
    if (state.hvPrice !== "" && state.hvPrice != null) {
      var num = parseFloat(state.hvPrice);
      if (!isNaN(num)) minE = num * (RATE[state.hvCurrency] || 1);
    }
    var types = state.hvTypes.length ? state.hvTypes : I.tabletTypes.map(function (t) { return t.id; });
    var rows = [];
    types.forEach(function (tid) {
      (HV[tid] || []).forEach(function (item) {
        if (minE > 0 && item.p < minE) return;
        var built = hvBuild(item, tid);
        if (built) rows.push({ tid: tid, item: item, built: built });
      });
    });
    rows.sort(function (a, b) { return b.item.p - a.item.p; });
    $("hv-count").textContent = rows.length + " " + tr("hvTotal");
    if (!rows.length) { $("hv-list").innerHTML = '<div class="empty-mini">' + html(tr("hvEmpty")) + "</div>"; return; }
    var out = [];
    rows.forEach(function (r) {
      out.push('<div class="rex-hv-item">');
      out.push('<span class="badge-muted">' + html(nameOfType(r.tid)) + "</span>");
      out.push('<span class="rex-hv-main"><span class="rex-hv-name">' + html(hvName(r.item)) + "</span>");
      out.push('<div class="rex-hv-regex" title="' + html(r.built.source) + '">' + html(r.built.source) + "</div></span>");
      out.push('<span class="rex-hv-price">' + formatPrice(r.item.p) + "</span>");
      out.push('<button type="button" class="btn btn-sm btn-ghost" data-hvcopy="' + html(r.built.source) + '">' + html(tr("hvCopy")) + "</button>");
      out.push("</div>");
    });
    $("hv-list").innerHTML = out.join("");
  }

  function renderFavorites() {
    var list = state.presets[state.tab] || [];
    $("fav-count").textContent = list.length;
    if (!list.length) { $("fav-list").innerHTML = '<p class="hint-text">' + html(tr("favEmpty")) + "</p>"; return; }
    var out = [];
    list.forEach(function (pr) {
      var n = Object.keys(pr.data.selected || {}).length +
        SUMMARY_FIELDS.filter(function (f) { return pr.data.summary && pr.data.summary[f.id]; }).length +
        (pr.data.tierMin || pr.data.tierMax ? 1 : 0);
      out.push('<div class="rex-fav-item" data-fav="' + html(pr.id) + '">');
      out.push('<span class="rex-fav-name" title="' + html(pr.name) + '">' + html(pr.name) + "</span>");
      out.push('<span class="badge-muted">' + n + " " + html(tr("favCountUnit")) + "</span>");
      out.push('<button type="button" class="slot-action-btn danger" data-favdel="' + html(pr.id) + '" title="' + html(tr("favDelete")) + '">×</button>');
      out.push("</div>");
    });
    $("fav-list").innerHTML = out.join("");
  }

  function savePreset() {
    var name = $("fav-name").value.trim();
    if (!name) {
      $("status").textContent = tr("favNameRequired");
      if (window.PoE2ShowFeedback) window.PoE2ShowFeedback(tr("favNameRequired"), "error");
      return;
    }
    var p = page();
    var snap = sanitizeSnapshot({ prefix: p.prefix, suffix: p.suffix, match: p.match, types: p.types, basic: p.basic, selected: p.selected, summary: p.summary, tierMin: p.tierMin, tierMax: p.tierMax });
    if (!state.presets[state.tab]) state.presets[state.tab] = [];
    state.presets[state.tab].push({ id: "p" + Date.now() + Math.floor(Math.random() * 1000), name: name.slice(0, 24), data: snap });
    $("fav-name").value = "";
    $("status").textContent = tr("favSaved");
    if (window.PoE2ShowFeedback) window.PoE2ShowFeedback(tr("favSaved"), "success");
    save(); renderFavorites();
  }

  function applyPreset(id) {
    var list = state.presets[state.tab] || [], pr = null;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) pr = list[i];
    if (!pr) return;
    var p = page(), d = pr.data;
    p.prefix = d.prefix; p.suffix = d.suffix; p.match = d.match;
    p.types = (d.types || []).slice();
    p.basic = JSON.parse(JSON.stringify(d.basic || {}));
    p.selected = JSON.parse(JSON.stringify(d.selected || {}));
    p.summary = JSON.parse(JSON.stringify(d.summary || {}));
    p.tierMin = d.tierMin || "";
    p.tierMax = d.tierMax || "";
    SUMMARY_FIELDS.forEach(function (f) { if (!p.summary[f.id]) p.summary[f.id] = ""; });
    $("status").textContent = tr("favApplied") + pr.name;
    if (window.PoE2ShowFeedback) window.PoE2ShowFeedback(tr("favApplied") + pr.name, "success");
    save(); renderAll();
  }

  function deletePreset(id) {
    var list = state.presets[state.tab] || [];
    state.presets[state.tab] = list.filter(function (x) { return x.id !== id; });
    save(); renderFavorites();
  }

  function rowActions() {
    return '<span class="rex-row-actions">' +
      '<button type="button" class="rex-icon-btn inc" data-act="include" title="' + html(tr("include")) + '" aria-label="' + html(tr("include")) + '">+</button>' +
      '<button type="button" class="rex-icon-btn exc" data-act="exclude" title="' + html(tr("exclude")) + '" aria-label="' + html(tr("exclude")) + '">−</button>' +
      "</span>";
  }

  function affixTextHtml(a) {
    var lines = affixLines(a);
    if (!lines.length) return html("(?)");
    if (lines.length === 1) return html(lines[0]);
    return lines.map(function (l) { return '<span class="ln">' + html(l) + "</span>"; }).join("");
  }

  function renderList() {
    var list = filtered(), p = page(), host = $("affix-list");
    $("visible-count").textContent = list.length + " " + tr("resultCount");
    $("primary-badge").textContent = Object.keys(p.selected).length;
    if (!list.length) {
      var msg = state.tab === "tablet" && !p.types.length ? tr("selectTypeFirst") : tr("noConditions");
      host.innerHTML = '<div class="empty-mini">' + html(msg) + "</div>";
      return;
    }
    var groups = { prefix: [], suffix: [], unique: [] };
    list.forEach(function (a) {
      if (a.unique) groups.unique.push(a);
      else if (a.side === "suffix") groups.suffix.push(a);
      else groups.prefix.push(a);
    });
    var order = ["prefix", "suffix", "unique"].filter(function (k) { return groups[k].length > 0; });
    var out = [];
    order.forEach(function (key) {
      var gTitle = key === "unique" ? tr("uniqueGroup") : (key === "suffix" ? tr("suffix") : tr("prefix"));
      out.push('<div class="rex-group-label">' + html(gTitle) + "</div>");
      groups[key].forEach(function (a) {
        var sel = p.selected[a.id];
        var cls = "rex-affix-row" + (a.composite ? " composite" : "") + (sel ? (sel.mode === "include" ? " inc" : " exc") : "");
        out.push('<div class="' + cls + '" data-id="' + html(a.id) + '">');
        out.push('<span class="rex-affix-text">' + affixTextHtml(a));
        if (a.modName) {
          var mn = loc(a.modName);
          if (mn) out.push(' <span class="rex-mod-name">' + html(mn) + "</span>");
        }
        out.push("</span>");
        if (a.unique) {
          out.push('<span class="gen-badge rex-badge-unique">' + html(tr("uniqueTag")) + "</span>");
        } else {
          if (a.types && a.types.length === 1) {
            out.push('<span class="rex-badge-exclusive">' + html(stemOfType(a.types[0]) + " " + tr("exclusiveTag")) + "</span>");
          }
          out.push('<span class="gen-badge ' + (a.side === "suffix" ? "s" : "p") + '">' + html(a.side === "suffix" ? tr("suffix") : tr("prefix")) + "</span>");
        }
        out.push(rowActions());
        if (sel && sel.mode === "include" && a.rng) {
          var isNeg = a.rng[0] < 0;
          var minAttr = isNeg ? "-999" : "0";
          var maxAttr = a.stackMax ? String(Math.max(a.rng[1], a.stackMax, 9)) : "999";
          var rngHint = tr("referenceRange") + " " + a.rng[0] + "–" + a.rng[1];
          if (a.stackMax) rngHint += " (" + tr("stackMaxHint") + " " + a.stackMax + ")";
          out.push('<span class="rex-threshold">');
          out.push("<span>" + html(tr("atLeast")) + "</span>");
          out.push('<input type="number" inputmode="' + (isNeg ? "text" : "numeric") + '" data-thr="value" min="' + minAttr + '" max="' + maxAttr + '" placeholder="' + html(tr("unlimited")) + '" value="' + html(sel.value || "") + '">');
          out.push("<span>" + html(tr("atMost")) + "</span>");
          out.push('<input type="number" inputmode="' + (isNeg ? "text" : "numeric") + '" data-thr="value2" min="' + minAttr + '" max="' + maxAttr + '" placeholder="' + html(tr("unlimited")) + '" value="' + html(sel.value2 || "") + '">');
          out.push('<span class="hint-text">' + html(rngHint) + "</span>");
          out.push("</span>");
        }
        out.push("</div>");
      });
    });
    host.innerHTML = out.join("");
  }

  function renderResult() {
    var p = page(), res = compose();
    $("condition-count").textContent = res.count;
    var selIds = Object.keys(p.selected);
    var smActive = SUMMARY_FIELDS.filter(function (f) { return p.summary[f.id]; });
    var hasTier = (state.tab === "waystone" && (p.tierMin || p.tierMax));
    var hasRevives = (state.tab === "waystone" && p.basic.revives !== "" && p.basic.revives != null);
    var rarSel = p.basic.rarities || [];
    var hasRarity = rarSel.length > 0 && rarSel.length < (state.tab === "waystone" ? 3 : 4);
    var summary = $("summary");

    if (!selIds.length && !smActive.length && !hasTier && !hasRevives && !hasRarity && !p.basic.corruption) {
      summary.innerHTML = '<div class="empty-mini">' + html(tr("noConditions")) + "</div>";
    } else {
      var rows = [];
      if (hasTier) {
        rows.push('<div class="rex-result-item inc"><span class="mode">T</span><span class="label">' + html(tr("tierHeading")) + '</span><span class="thr">' + html((p.tierMin || "1") + "–" + (p.tierMax || "16")) + "</span></div>");
      }
      if (hasRevives) {
        rows.push('<div class="rex-result-item inc"><span class="mode">=</span><span class="label">' + html(tr("revivesLabel")) + '</span><span class="thr">' + html(String(p.basic.revives)) + "</span></div>");
      }
      if (hasRarity) {
        var rarNames = rarSel.map(function (k) { return tr(k === "normal" ? "rarityNormal" : k === "magic" ? "rarityMagic" : k === "rare" ? "rarityRare" : "rarityUnique"); }).join(" / ");
        rows.push('<div class="rex-result-item inc"><span class="mode">=</span><span class="label">' + html(tr("rarity")) + '</span><span class="thr">' + html(rarNames) + "</span></div>");
      }
      if (p.basic.corruption) {
        var cCls = p.basic.corruption === "no" ? "exc" : "inc";
        var cMode = p.basic.corruption === "no" ? "−" : "=";
        rows.push('<div class="rex-result-item ' + cCls + '"><span class="mode">' + cMode + '</span><span class="label">' + html(p.basic.corruption === "no" ? tr("corruptedNo") : tr("corruptedYes")) + "</span></div>");
      }
      smActive.forEach(function (f) {
        rows.push('<div class="rex-result-item inc"><span class="mode">≥</span><span class="label">' + html(tr(f.label)) + '</span><span class="thr">' + html(p.summary[f.id]) + "%</span></div>");
      });
      selIds.forEach(function (id) {
        var sel = p.selected[id];
        var a = affixById(id);
        if (!a) return;
        var label = loc(a.tpl) || a.tpl.cn || a.id;
        if (a.modName && loc(a.modName)) label = "[" + loc(a.modName) + "] " + label;
        var thr = "";
        if (sel.mode === "include" && (sel.value || sel.value2)) {
          thr = (sel.value ? "≥" + sel.value : "") + (sel.value && sel.value2 ? " " : "") + (sel.value2 ? "≤" + sel.value2 : "");
        }
        rows.push('<div class="rex-result-item ' + (sel.mode === "include" ? "inc" : "exc") + '">' +
          '<span class="mode">' + (sel.mode === "include" ? "+" : "−") + "</span>" +
          '<span class="label" title="' + html(label) + '">' + html(label) + "</span>" +
          (thr ? '<span class="thr">' + html(thr) + "</span>" : "") +
          '<button type="button" class="rex-result-rm" data-rm-id="' + html(id) + '" title="' + html(tr("favDelete")) + '">×</button></div>');
      });
      summary.innerHTML = '<div class="rex-result-list">' + rows.join("") + "</div>";
    }

    var src = $("regex-source"), msg = $("regex-message"), lenEl = $("regex-length");
    if (!res.source || (!res.ok && res.unresolved.length)) {
      src.textContent = "";
      src.classList.add("empty");
      msg.textContent = res.unresolved.length ? (tr("copyDisabled") + "：" + res.unresolved.join(" / ")) : tr("noConditions");
      msg.className = "rex-regex-msg" + (res.unresolved.length ? " error" : "");
      $("copy").disabled = true;
      lenEl.textContent = "0 / " + R.BUDGET;
      lenEl.className = "badge-muted";
    } else {
      src.textContent = res.source;
      src.classList.remove("empty");
      lenEl.textContent = res.length + " / " + R.BUDGET;
      lenEl.className = "badge-muted" + (res.over ? " over" : "");
      var notes = [];
      if (res.level === 1) notes.push(tr("noteShort"));
      else if (res.level >= 2) notes.push(tr("noteLoose"));
      if (res.over) notes.push(tr("noteOver"));
      if (res.unresolved.length) notes.push(tr("noteUnready") + "：" + res.unresolved.join(" / "));
      msg.textContent = notes.join(" · ");
      msg.className = "rex-regex-msg" + (res.over || res.unresolved.length ? " error" : "");
      $("copy").disabled = res.unresolved.length > 0 || res.over;
    }
  }

  function renderAll() {
    if (!$("tabs")) return;
    renderChrome(); renderPrimary(); renderTierPanel(); renderSummaryPanel(); renderHotBar(); renderHighValue(); renderList(); renderResult(); renderFavorites();
  }

  function copyText(text) {
    if (!text) return;
    var done = function () {
      $("status").textContent = tr("copied");
      if (window.PoE2ShowFeedback) window.PoE2ShowFeedback(tr("copied"), "success");
      setTimeout(function () { save(); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        if (window.PoE2ShowFeedback) window.PoE2ShowFeedback(tr("copyFailed"), "error");
      });
    }
  }

  function pruneIncompatibleSelected(p) {
    var removed = false;
    Object.keys(p.selected).forEach(function (id) {
      var a = affixById(id);
      if (a && a.types && a.types.length > 0 && p.types.length > 0) {
        if (!a.types.some(function (t) { return p.types.indexOf(t) >= 0; })) {
          delete p.selected[id];
          removed = true;
        }
      }
    });
    if (removed && window.PoE2ShowFeedback) {
      window.PoE2ShowFeedback(tr("removedIncompatible"), "info");
    }
  }

  function bind() {
    if (!$("tabs")) return;
    $("tabs").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-tab]");
      if (!b) return;
      state.tab = b.getAttribute("data-tab");
      save(); renderAll();
    });
    $("language").addEventListener("change", function (e) {
      state.language = e.target.value;
      save(); renderAll();
      var siteLang = state.language === "en" ? "us" : state.language;
      if (window.PoE2Layout && window.PoE2Layout.getLanguage() !== siteLang) window.PoE2Layout.setLanguage(siteLang);
    });
    $("toggle-prefix").addEventListener("click", function () {
      var p = page(); p.prefix = !p.prefix;
      save(); renderChrome(); renderList(); renderResult();
    });
    $("toggle-suffix").addEventListener("click", function () {
      var p = page(); p.suffix = !p.suffix;
      save(); renderChrome(); renderList(); renderResult();
    });
    $("match-mode").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-match]");
      if (!b) return;
      page().match = b.getAttribute("data-match");
      save(); renderChrome(); renderResult();
    });
    var searchTimer = null;
    $("search").addEventListener("input", function (e) {
      page().search = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () { save(); renderList(); }, 120);
    });
    $("clear-selected").addEventListener("click", function () { page().selected = {}; save(); renderList(); renderResult(); renderPrimary(); renderHotBar(); });
    $("clear").addEventListener("click", function () { state[state.tab] = freshPage(); save(); renderAll(); });

    $("primary-body").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var p = page();
      if (b.hasAttribute("data-type")) {
        var t = b.getAttribute("data-type"); var i = p.types.indexOf(t);
        if (i >= 0) p.types.splice(i, 1); else p.types.push(t);
        pruneIncompatibleSelected(p);
        save(); renderList(); renderResult(); renderPrimary();
      } else if (b.hasAttribute("data-revives")) {
        p.basic.revives = b.getAttribute("data-revives"); save(); renderPrimary(); renderResult();
      } else if (b.hasAttribute("data-rarity")) {
        var rv = b.getAttribute("data-rarity");
        if (!p.basic.rarities) p.basic.rarities = [];
        if (rv === "") p.basic.rarities = [];
        else {
          var ix = p.basic.rarities.indexOf(rv);
          if (ix >= 0) p.basic.rarities.splice(ix, 1); else p.basic.rarities.push(rv);
        }
        save(); renderPrimary(); renderResult();
      } else if (b.hasAttribute("data-corruption")) {
        p.basic.corruption = b.getAttribute("data-corruption"); save(); renderPrimary(); renderResult();
      }
    });

    $("tier-body").addEventListener("input", function (e) {
      var el = e.target;
      if (!el.hasAttribute || !el.hasAttribute("data-tier")) return;
      var key = el.getAttribute("data-tier") === "min" ? "tierMin" : "tierMax";
      page()[key] = String(el.value || "").replace(/[^0-9]/g, "").slice(0, 2);
      save(); renderResult();
    });
    $("tier-body").addEventListener("blur", function (e) {
      var el = e.target;
      if (!el.hasAttribute || !el.hasAttribute("data-tier")) return;
      var v = String(el.value || "").replace(/[^0-9]/g, "").slice(0, 2);
      if (v && parseInt(v, 10) > 16) v = "16";
      if (v && parseInt(v, 10) < 1) v = "1";
      el.value = v;
      page()[el.getAttribute("data-tier") === "min" ? "tierMin" : "tierMax"] = v;
      save(); renderResult();
    }, true);
    $("tier-clear").addEventListener("click", function () {
      var p = page(); p.tierMin = ""; p.tierMax = "";
      save(); renderTierPanel(); renderResult();
    });

    $("summary-body").addEventListener("input", function (e) {
      var el = e.target;
      if (!el.hasAttribute || !el.hasAttribute("data-summary")) return;
      var key = el.getAttribute("data-summary");
      page().summary[key] = String(el.value || "").replace(/[^0-9]/g, "").slice(0, 3);
      save(); renderResult();
    });
    $("summary-clear").addEventListener("click", function () {
      var p = page(); SUMMARY_FIELDS.forEach(function (f) { p.summary[f.id] = ""; });
      save(); renderSummaryPanel(); renderResult();
    });

    $("hot-bar").addEventListener("click", function (e) {
      if (state.tab === "tablet") return;
      var row = e.target.closest(".rex-hot-row[data-hot]");
      if (!row) return;
      var id = row.getAttribute("data-hot"), p = page();
      var act = e.target.closest("button[data-hotact]");
      var mode = act ? act.getAttribute("data-hotact") : null;
      var cur = p.selected[id];
      if (!mode) mode = cur ? null : "include";
      if (mode === null || (cur && cur.mode === mode)) delete p.selected[id];
      else p.selected[id] = { mode: mode, value: (cur && cur.value) || "", value2: (cur && cur.value2) || "" };
      save(); renderHotBar(); renderList(); renderResult(); renderPrimary();
    });

    $("summary").addEventListener("click", function (e) {
      var rm = e.target.closest("button[data-rm-id]");
      if (!rm) return;
      var id = rm.getAttribute("data-rm-id");
      delete page().selected[id];
      save(); renderList(); renderResult(); renderPrimary(); renderHotBar();
    });

    $("fav-save").addEventListener("click", savePreset);
    $("fav-name").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); savePreset(); } });
    $("fav-list").addEventListener("click", function (e) {
      var del = e.target.closest("button[data-favdel]");
      if (del) { e.stopPropagation(); deletePreset(del.getAttribute("data-favdel")); return; }
      var item = e.target.closest(".rex-fav-item");
      if (item) applyPreset(item.getAttribute("data-fav"));
    });

    var hvTimer = null;
    $("hv-price").addEventListener("input", function (e) {
      state.hvPrice = String(e.target.value || "").replace(/[^0-9.]/g, "").slice(0, 8);
      clearTimeout(hvTimer); hvTimer = setTimeout(function () { save(); renderHighValue(); }, 200);
    });
    $("hv-currency").addEventListener("change", function (e) { state.hvCurrency = e.target.value; save(); renderHighValue(); });
    $("hv-types").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-hvtype]");
      if (!b) return;
      var v = b.getAttribute("data-hvtype");
      if (v === "__all") state.hvTypes = [];
      else { var i = state.hvTypes.indexOf(v); if (i >= 0) state.hvTypes.splice(i, 1); else state.hvTypes.push(v); }
      save(); renderHighValue();
    });
    $("hv-list").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-hvcopy]");
      if (b) copyText(b.getAttribute("data-hvcopy"));
    });

    $("affix-list").addEventListener("click", function (e) {
      if (e.target.tagName === "INPUT") return;
      var row = e.target.closest(".rex-affix-row");
      if (!row) return;
      var id = row.getAttribute("data-id"), p = page();
      var act = e.target.closest("button[data-act]");
      var mode = act ? act.getAttribute("data-act") : null;
      var cur = p.selected[id];
      if (!mode) mode = cur ? null : "include";
      if (mode === null || (cur && cur.mode === mode)) delete p.selected[id];
      else p.selected[id] = { mode: mode, value: (cur && cur.value) || "", value2: (cur && cur.value2) || "" };
      save(); renderList(); renderResult(); renderPrimary(); renderHotBar();
    });
    $("affix-list").addEventListener("input", function (e) {
      if (!e.target.hasAttribute("data-thr")) return;
      var row = e.target.closest(".rex-affix-row");
      if (!row) return;
      var id = row.getAttribute("data-id");
      var sel = page().selected[id];
      if (!sel) return;
      var a = affixById(id);
      var allowNeg = a && a.rng && a.rng[0] < 0;
      var rawVal = String(e.target.value || "");
      var cleaned = allowNeg
        ? rawVal.replace(/[^0-9\-]/g, "").replace(/(?!^)-/g, "").slice(0, 4)
        : rawVal.replace(/[^0-9]/g, "").slice(0, 3);
      sel[e.target.getAttribute("data-thr")] = cleaned;
      save(); renderResult();
    });

    $("copy").addEventListener("click", function () { copyText($("regex-source").textContent); });
  }

  window.PoE2RegexTool = {
    setLanguage: function (siteLang) {
      var next = siteLang === "us" ? "en" : (siteLang === "tw" ? "tw" : "cn");
      if (state.language !== next) {
        state.language = next;
        save();
      }
      renderAll();
    },
    getLanguage: function () { return state.language; },
    compose: compose,
    renderAll: renderAll
  };

  function boot() {
    if (window.PoE2Layout) {
      var initLang = window.PoE2Layout.getLanguage();
      state.language = initLang === "us" ? "en" : (initLang === "tw" ? "tw" : "cn");
      window.PoE2Layout.onLanguageChange(function (siteLang) {
        if (window.PoE2RegexTool) window.PoE2RegexTool.setLanguage(siteLang);
      });
    }
    var st = R.selfTest();
    if (!st.ok && window.console) console.warn("regex engine self-test failed", st.fails);
    bind();
    renderAll();
    var el = $("status");
    if (el) el.textContent = st.ok ? tr("saved") : (tr("selfTestFail") + ": " + st.fails.join(", "));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
