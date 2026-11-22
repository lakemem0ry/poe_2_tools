/**
 * 流放之路 2 (PoE2) 词缀正则生成器引擎与视图控制器
 * 支持引路石 (Waystones) 与石板/碑牌 (Tablets) 交易站搜索正则构建、250 字符安全降级、高价值碑牌筛选与最爱预设
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.POE2_REGEX = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  var VERSION = "1.3.0";
  var BUDGET = 250;
  var BUDGET_SAFE = 248;
  function clamp(n) { return Math.max(0, Math.min(999, trunc(Number(n) || 0))); }
  function trunc(n) { return n < 0 ? Math.ceil(n) : Math.floor(n); }
  var META = /[.*+?^${}()|[\]\\]/g;
  function esc(text) { return String(text == null ? "" : text).replace(META, "\\$&"); }

  var FIELD_SEP = "\\s*[:：]\\s*\\+?";
  var LOOSE_SEP = "\\s*[:：]?\\s*\\+?";
  function rangeSameWidth(loStr, hiStr) {
    var w = loStr.length;
    if (loStr === strRepeat("0", w) && hiStr === strRepeat("9", w)) return strRepeat("[0-9]", w);
    if (w === 1) return loStr === hiStr ? loStr : "[" + loStr + "-" + hiStr + "]";
    var a = loStr.charAt(0), b = hiStr.charAt(0);
    if (loStr.slice(1) === strRepeat("0", w - 1) && hiStr.slice(1) === strRepeat("9", w - 1)) {
      return (a === b ? a : "[" + a + "-" + b + "]") + strRepeat("[0-9]", w - 1);
    }
    if (a === b) return a + rangeSameWidth(loStr.slice(1), hiStr.slice(1));
    var parts = [];
    parts.push(a + rangeSameWidth(loStr.slice(1), strRepeat("9", w - 1)));
    if (+b > +a + 1) parts.push(charClass(+a + 1, +b - 1) + strRepeat("[0-9]", w - 1));
    parts.push(b + rangeSameWidth(strRepeat("0", w - 1), hiStr.slice(1)));
    return parts.length === 1 ? parts[0] : "(" + parts.join("|") + ")";
  }
  function charClass(lo, hi) { return lo === hi ? String(lo) : "[" + lo + "-" + hi + "]"; }
  function strRepeat(s, n) { var o = ""; for (var i = 0; i < n; i++) o += s; return o; }
  function numberInRange(min, max) {
    min = clamp(min); max = clamp(max);
    if (min > max) return null;
    if (min === max) return String(min);
    var parts = [], minW = String(min).length, maxW = String(max).length;
    for (var w = minW; w <= maxW; w++) {
      var lo = w === minW ? min : Math.pow(10, w - 1);
      var hi = w === maxW ? max : Math.pow(10, w) - 1;
      parts.push(rangeSameWidth(String(lo), String(hi)));
    }
    return parts.length === 1 ? parts[0] : "(" + parts.join("|") + ")";
  }
  var PH = /\(\s*([+\-]?\d{1,3})\s*[—–-]\s*([+\-]?\d{1,3})\s*\)%?|(?:[#X~])\s*%?/g;
  function isSpaceChar(code) { return code === 32 || code === 9 || code === 10 || code === 13 || code === 12 || code === 11 || code === 160 || code === 0x3000; }
  function litEscape(s, spaceToken) {
    s = String(s); var out = []; var buf = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (isSpaceChar(s.charCodeAt(i))) {
        if (buf) { out.push(esc(buf)); buf = ""; }
        if (out.length === 0 || out[out.length - 1] !== spaceToken) out.push(spaceToken);
      } else buf += ch;
    }
    if (buf) out.push(esc(buf));
    return out.join("");
  }
  var SP = ".*";
  function stripNumbers(text) {
    var s = String(text == null ? "" : text); var out = []; var last = 0, m;
    PH.lastIndex = 0;
    while ((m = PH.exec(s)) !== null) {
      out.push(litEscape(s.slice(last, m.index), SP)); out.push(null);
      last = m.index + m[0].length;
    }
    out.push(litEscape(s.slice(last), SP));
    return out;
  }
  function presence(text, minLen) {
    if (!text) return null;
    var limit = (typeof minLen === "number" && minLen > 0) ? minLen : 4;
    var chunks = stripNumbers(text); var pieces = [];
    for (var i = 0; i < chunks.length; i++) {
      var c = chunks[i];
      if (c === null) { if (pieces.length && pieces[pieces.length - 1] !== ".*") pieces.push(".*"); }
      else { var lit = c.split(" ").join(SP); if (lit) pieces.push(lit); }
    }
    while (pieces.length && pieces[0] === ".*") pieces.shift();
    while (pieces.length && pieces[pieces.length - 1] === ".*") pieces.pop();
    var p = normalizeDots(pieces.join(""));
    if (!p || p.length < limit) return null;
    return p;
  }
  var ESC_DOT = "\u0001ESCDOT\u0001";
  var WILD = "\u0002";
  function normalizeDots(p) {
    if (!p) return p;
    var out = p.replace(/\\\./g, ESC_DOT);
    out = out.replace(/\.\*/g, WILD);
    out = out.replace(/\./g, WILD);
    out = out.replace(/\u0002+/g, WILD);
    out = out.split(WILD).join(".*");
    out = out.replace(/^(?:\.\*)+/, "");
    out = out.replace(/(?:\.\*)+$/, "");
    return out.split(ESC_DOT).join("\\.");
  }
  function threshold(text, opts) {
    if (!text) return null;
    opts = opts || {};
    var s = String(text); var parts = []; var last = 0, m;
    PH.lastIndex = 0; var hit = false; var slot = 0;
    var tightAny = (opts.atLeast !== undefined && opts.atLeast !== null && opts.atLeast !== "") ||
                   (opts.atMost !== undefined && opts.atMost !== null && opts.atMost !== "");
    while ((m = PH.exec(s)) !== null) {
      hit = true;
      parts.push(litEscape(s.slice(last, m.index), SP));
      var lo = 0, hi = 999;
      if (m[1] !== undefined) { lo = +m[1]; hi = +m[2]; }
      var primary = (slot === 0);
      if (primary) {
        if (opts.atLeast !== undefined && opts.atLeast !== null && opts.atLeast !== "") lo = Math.max(lo, clamp(opts.atLeast));
        if (opts.atMost !== undefined && opts.atMost !== null && opts.atMost !== "") hi = Math.min(hi, clamp(opts.atMost));
        if (lo > hi) return null;
      }
      var tight = primary && tightAny;
      parts.push(tight ? (numberInRange(lo, hi) || "[0-9]+") : "[0-9]+");
      parts.push("(?:" + SP + "\\([0-9]+[-–—][0-9]+\\))?");
      last = m.index + m[0].length; slot++;
    }
    if (!hit) return null;
    parts.push(litEscape(s.slice(last), SP));
    return normalizeDots(parts.join("")) || null;
  }
  function build(opts) {
    opts = opts || {};
    var includes = dedupe(compact(opts.includes || []));
    var excludes = dedupe(compact(opts.excludes || []));
    var always = dedupe(compact(opts.always || []));
    var match = opts.match === "any" ? "any" : "all";
    var allBlocks = always.concat(includes, excludes);
    if (!allBlocks.length) return { ok: false, reason: "no-conditions", source: "", blocks: [], length: 0 };
    for (var i = 0; i < allBlocks.length; i++) {
      if (!isSafe(allBlocks[i])) return { ok: false, reason: "invalid-fragment", source: "", blocks: [], length: 0, detail: allBlocks[i] };
    }
    var blocks = always.slice();
    if (includes.length) {
      if (match === "all") { for (var j = 0; j < includes.length; j++) blocks.push(includes[j]); }
      else blocks.push(includes.join("|"));
    }
    if (excludes.length) blocks.push("!" + excludes.join("|"));
    var source = quoteAll(blocks);
    return { ok: true, reason: "ok", source: source, blocks: blocks, length: source.length };
  }
  function quoteAll(blocks) {
    var out = [];
    for (var i = 0; i < blocks.length; i++) out.push('"' + blocks[i] + '"');
    return out.join(" ");
  }
  function isSafe(p) { return typeof p === "string" && p.length > 0 && p.indexOf('"') === -1 && p.indexOf("\n") === -1 && p.indexOf("\r") === -1; }
  function compact(list) { var out = []; for (var i = 0; i < list.length; i++) { if (list[i]) out.push(list[i]); } return out; }
  function dedupe(list) {
    var seen = {}, out = [];
    for (var i = 0; i < list.length; i++) { if (seen[list[i]]) continue; seen[list[i]] = 1; out.push(list[i]); }
    return out;
  }
  function fit(levels, budget) {
    budget = budget || BUDGET;
    var chosen = null;
    for (var i = 0; i < levels.length; i++) {
      var r = build(levels[i]);
      if (r.ok && r.length <= budget) { chosen = { level: i, source: r.source, length: r.length, blocks: r.blocks }; break; }
    }
    if (!chosen) {
      var best = null;
      for (var k = 0; k < levels.length; k++) {
        var rr = build(levels[k]);
        if (rr.ok && (!best || rr.length < best.length)) best = { level: k, source: rr.source, length: rr.length, blocks: rr.blocks };
      }
      if (best) { best.over = true; return best; }
      return { level: -1, source: "", length: 0, blocks: [], empty: true };
    }
    chosen.over = false;
    return chosen;
  }
  function selfTest() {
    var fails = [];
    var probes = [[0, 9], [0, 10], [5, 5], [1, 999], [15, 19], [30, 40], [70, 100], [100, 119], [200, 240], [25, 35], [0, 0], [99, 101], [150, 150], [12, 18], [5, 20], [8, 12], [3, 6], [10, 25], [50, 239], [7, 700]];
    for (var i = 0; i < probes.length; i++) {
      var lo = probes[i][0], hi = probes[i][1];
      var frag = numberInRange(lo, hi);
      if (!frag) { fails.push(lo + "-" + hi + ": null"); continue; }
      var re;
      try { re = new RegExp("^(?:" + frag + ")$"); } catch (e) { fails.push(lo + "-" + hi + ": bad"); continue; }
      for (var v = 0; v <= 999; v++) {
        if (re.test(String(v)) !== (v >= lo && v <= hi)) { fails.push(lo + "-" + hi + " v=" + v); break; }
      }
    }
    if (esc("a.b") !== "a\\.b") fails.push("escape");
    var b = build({ includes: ["abc", "def"], excludes: ["xyz"], always: ["aaa"], match: "all" });
    if (!b.ok || b.source !== '"aaa" "abc" "def" "!xyz"') fails.push("build-all");
    var b2 = build({ includes: ["abc", "def"], match: "any" });
    if (!b2.ok || b2.source !== '"abc|def"') fails.push("build-any");
    return { ok: fails.length === 0, fails: fails };
  }
  return { VERSION: VERSION, BUDGET: BUDGET, BUDGET_SAFE: BUDGET_SAFE, esc: esc, fieldSep: FIELD_SEP, looseSep: LOOSE_SEP, numberInRange: numberInRange, presence: presence, threshold: threshold, build: build, fit: fit, selfTest: selfTest };
});

(function () {
  "use strict";
  var D = window.POE2_DATA || { waystone: [], tablet: [] };
  var R = window.POE2_REGEX;
  var I = window.POE2_I18N;
  var HV = window.POE2_HIGHVALUE || {};
  var $ = function (id) { return document.getElementById("rex-" + id); };

  var KEY = "poe2.regex.v7";
  var TABS = ["waystone", "tablet"];
  var RATE = { E: 1, C: 56, D: 468 };
  var HOT_IDS = ["wt025", "wt026", "wt027", "wt023", "wt022", "wt024"];

  function freshPage() {
    return {
      prefix: true, suffix: true, search: "", match: "all",
      types: [], basic: { revives: "", rarities: [] }, selected: {},
      tierMin: "", tierMax: "",
      summary: { eff: "", itemRarity: "", monsterRarity: "", packSize: "", waystone: "" }
    };
  }

  function defaults() {
    var o = {
      version: 7, language: "en", tab: "waystone",
      presets: { waystone: [], tablet: [] },
      hvPrice: "", hvCurrency: "E", hvTypes: []
    };
    for (var i = 0; i < TABS.length; i++) o[TABS[i]] = freshPage();
    return o;
  }

  function allAffixes() { return D.waystone.concat(D.tablet); }

  function sanitizeSnapshot(src) {
    var out = { prefix: true, suffix: true, match: "all", types: [], basic: {}, selected: {}, summary: {}, tierMin: "", tierMax: "" };
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
    if (!raw || (raw.version < 1 || raw.version > 7)) return out;
    if (TABS.indexOf(raw.tab) >= 0) out.tab = raw.tab;
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
  try { state = restore(JSON.parse(localStorage.getItem(KEY) || "null")); } catch (e) { storageOK = false; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOK = true; }
    catch (e) { storageOK = false; }
    var el = $("status");
    if (el) el.textContent = storageOK ? tr("saved") : tr("saveBlocked");
  }

  function tr(key) { var v = I.t[key]; if (!v) return key; return v[state.language] || v.cn || key; }
  function loc(obj) { if (!obj) return null; return obj[state.language] || obj.cn || obj.en || null; }
  function nameOfType(id) { var t = I.tabletTypes.filter(function (x) { return x.id === id; })[0]; return t ? loc(t) : id; }
  function html(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function page() { return state[state.tab]; }
  function affixById(id) { var all = allAffixes(); for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i]; return null; }

  var SUMMARY_FIELDS = [
    { id: "itemRarity", label: "smItemRarity", prefix: { cn: "物品稀有度", tw: "物品稀有度", en: "Item Rarity" } },
    { id: "packSize", label: "smPackSize", prefix: { cn: "怪物群规模", tw: "怪群大小", en: "Pack Size" } },
    { id: "eff", label: "smEff", prefix: { cn: "怪物效能", tw: "怪物效能", en: "Monster Effectiveness" } },
    { id: "monsterRarity", label: "smMonsterRarity", prefix: { cn: "怪物稀有度", tw: "怪物稀有度", en: "Monster Rarity" } },
    { id: "waystone", label: "smWaystone", prefix: { cn: "引路石掉落几率", tw: "換界石掉落機率", en: "WayStone Drop Chance" } }
  ];

  function filtered() {
    var p = page(), tab = state.tab;
    if (tab === "tablet" && !p.types.length) return [];
    var q = p.search.trim().toLowerCase();
    return (D[tab] || []).filter(function (a) {
      if (!p[a.side === "suffix" ? "suffix" : "prefix"]) return false;
      if (tab === "tablet" && a.types && a.types.length && p.types.length && !a.types.some(function (t) { return p.types.indexOf(t) >= 0; })) return false;
      if (q) {
        var hay = [loc(a.tpl), a.tpl.cn, a.tpl.tw, a.tpl.en].filter(Boolean).join(" ").toLowerCase();
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

  function fragmentFor(a, sel) {
    var lines = affixLines(a);
    if (!lines || !lines.length) return null;
    var text = lines.join(" ");
    if (sel && sel.mode === "include" && (sel.value !== "" || sel.value2 !== "")) {
      var t = R.threshold(text, { atLeast: sel.value !== "" ? Number(sel.value) : undefined, atMost: sel.value2 !== "" ? Number(sel.value2) : undefined });
      if (t) return t;
    }
    return R.presence(text);
  }

  function tierFragments(p, tab) {
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
    var range = R.numberInRange(min, max);
    if (!range) return out;
    var pre = state.language === "en" ? "Tier\\s*" : state.language === "tw" ? "階級\\s*" : "\\s*";
    var suf = state.language === "en" ? "" : state.language === "tw" ? "\\s*" : "\\s*阶";
    out.push(pre + range + suf);
    return out;
  }

  function summaryFragments(p, tab) {
    var out = [];
    if (tab !== "waystone") return out;
    SUMMARY_FIELDS.forEach(function (f) {
      var raw = p.summary[f.id];
      if (raw === "" || raw == null) return;
      var min = parseInt(raw, 10);
      if (isNaN(min) || (!f.zeroOk && min <= 0) || min < 0) return;
      var prefix = loc(f.prefix);
      var range = R.numberInRange(min, f.max || 999);
      if (prefix && range) out.push(R.esc(prefix) + R.fieldSep + range + (f.noPercent ? "" : "%"));
    });
    return out;
  }

  function compose() {
    var p = page(), tab = state.tab;
    var includes = [], excludes = [], always = [], unresolved = [];
    var selIds = Object.keys(p.selected);
    for (var i = 0; i < selIds.length; i++) {
      var id = selIds[i], sel = p.selected[id];
      var a = affixById(id);
      if (!a) continue;
      var frag = fragmentFor(a, sel);
      if (!frag) { unresolved.push(loc(a.tpl) || id); continue; }
      (sel.mode === "exclude" ? excludes : includes).push(frag);
    }
    var smFrags = summaryFragments(p, tab);
    for (var s = 0; s < smFrags.length; s++) always.push(smFrags[s]);
    var tf = tierFragments(p, tab);
    for (var ti = 0; ti < tf.length; ti++) always.push(tf[ti]);
    if (tab === "tablet" && p.types.length) {
      var names = p.types.map(function (t) { return nameOfType(t); }).filter(Boolean);
      if (names.length) always.push("(" + names.map(R.esc).join("|") + ")");
    }
    if (p.basic.rarities && p.basic.rarities.length) {
      var rarLine = loc(I.anchors.rarityLine) || "";
      var rarWord = p.basic.rarities.map(function (k) {
        var t = loc(I.anchors[k]);
        return t ? R.presence(t, 1) : null;
      }).filter(Boolean);
      if (rarLine && rarWord.length) always.push(R.esc(rarLine) + R.fieldSep + ".*(?:" + rarWord.join("|") + ")");
    }
    if (tab === "waystone" && p.basic.revives !== "" && p.basic.revives != null) {
      var revLbl = loc(I.t.revivesLabel);
      if (revLbl) always.push(R.esc(revLbl) + R.looseSep + p.basic.revives);
    }
    if (p.basic.corruption === "no") excludes.push(R.esc(loc(I.anchors.corrupted)));
    if (p.basic.corruption === "yes") always.push(R.esc(loc(I.anchors.corrupted)));
    always = always.filter(Boolean);

    var levels = [
      { includes: includes, excludes: excludes, always: always, match: p.match },
      { includes: includes.map(function (s2) { return s2.replace(/\[\d-\d\]|\[0-9\]|\([0-9|\[\]\-]+\)/g, "[0-9]"); }), excludes: excludes, always: always, match: p.match }
    ];
    var fitted = R.fit(levels, R.BUDGET_SAFE);

    return {
      ok: fitted.level >= 0 && !fitted.empty,
      source: fitted.source || "",
      length: fitted.length || 0,
      level: fitted.level,
      over: !!fitted.over,
      unresolved: unresolved,
      count: selIds.length + smFrags.length + tf.length +
        ((tab === "waystone" && p.basic.revives !== "" && p.basic.revives != null) ? 1 : 0) +
        ((p.basic.rarities && p.basic.rarities.length) ? 1 : 0)
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

  function hvBuild(item) {
    var frags = [];
    for (var i = 0; i < item.a.length; i++) {
      var id = item.a[i][0], min = item.a[i][1];
      var a = affixById(id);
      if (!a) continue;
      var text = loc(a.tpl);
      if (!text) continue;
      var frag = min != null ? R.threshold(text, { atLeast: min }) : null;
      if (!frag) frag = R.presence(text);
      if (frag) frags.push(frag);
    }
    if (!frags.length) return null;
    var built = R.build({ includes: frags, match: "all" });
    return built.ok ? built : null;
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
        var built = hvBuild(item);
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
    var groups = {}, order = [];
    list.forEach(function (a) {
      var key = a.side;
      if (!groups[key]) { groups[key] = []; order.push(key); }
      groups[key].push(a);
    });
    var out = [];
    order.forEach(function (key) {
      out.push('<div class="rex-group-label">' + html(key === "suffix" ? tr("suffix") : tr("prefix")) + "</div>");
      groups[key].forEach(function (a) {
        var sel = p.selected[a.id];
        var cls = "rex-affix-row" + (a.composite ? " composite" : "") + (sel ? (sel.mode === "include" ? " inc" : " exc") : "");
        out.push('<div class="' + cls + '" data-id="' + html(a.id) + '">');
        out.push('<span class="rex-affix-text">' + affixTextHtml(a) + "</span>");
        out.push('<span class="gen-badge ' + (a.side === "suffix" ? "s" : "p") + '">' + html(a.side === "suffix" ? tr("suffix") : tr("prefix")) + "</span>");
        out.push(rowActions());
        if (sel && sel.mode === "include" && a.rng) {
          out.push('<span class="rex-threshold">');
          out.push("<span>" + html(tr("atLeast")) + "</span>");
          out.push('<input type="number" inputmode="numeric" data-thr="value" min="0" max="999" placeholder="' + html(tr("unlimited")) + '" value="' + html(sel.value || "") + '">');
          out.push("<span>" + html(tr("atMost")) + "</span>");
          out.push('<input type="number" inputmode="numeric" data-thr="value2" min="0" max="999" placeholder="' + html(tr("unlimited")) + '" value="' + html(sel.value2 || "") + '">');
          out.push('<span class="hint-text">' + html(tr("referenceRange")) + " " + a.rng[0] + "–" + a.rng[1] + "</span>");
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
    var hasTier = (p.tierMin || p.tierMax);
    var hasRevives = (state.tab === "waystone" && p.basic.revives !== "" && p.basic.revives != null);
    var rarSel = p.basic.rarities || [];
    var hasRarity = rarSel.length > 0;
    var summary = $("summary");

    if (!selIds.length && !smActive.length && !hasTier && !hasRevives && !hasRarity) {
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
      smActive.forEach(function (f) {
        rows.push('<div class="rex-result-item inc"><span class="mode">≥</span><span class="label">' + html(tr(f.label)) + '</span><span class="thr">' + html(p.summary[f.id]) + "</span></div>");
      });
      selIds.forEach(function (id) {
        var sel = p.selected[id];
        var a = affixById(id);
        if (!a) return;
        var label = loc(a.tpl) || a.tpl.cn || a.id;
        var thr = "";
        if (sel.mode === "include" && (sel.value || sel.value2)) {
          thr = (sel.value ? "≥" + sel.value : "") + (sel.value && sel.value2 ? " " : "") + (sel.value2 ? "≤" + sel.value2 : "");
        }
        rows.push('<div class="rex-result-item ' + (sel.mode === "include" ? "inc" : "exc") + '">' +
          '<span class="mode">' + (sel.mode === "include" ? "+" : "−") + "</span>" +
          '<span class="label" title="' + html(label) + '">' + html(label) + "</span>" +
          (thr ? '<span class="thr">' + html(thr) + "</span>" : "") + "</div>");
      });
      summary.innerHTML = '<div class="rex-result-list">' + rows.join("") + "</div>";
    }

    var src = $("regex-source"), msg = $("regex-message"), lenEl = $("regex-length");
    if (!res.ok || !res.source) {
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
      if (res.level === 1) notes.push(tr("noteLoose"));
      else if (res.level === 2) notes.push(tr("noteShort"));
      else if (res.level >= 3) notes.push(tr("noteMini"));
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
      var topBtn = document.querySelector('[data-lang="' + siteLang + '"]');
      if (topBtn && !topBtn.classList.contains("active")) topBtn.click();
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
      var sel = page().selected[row.getAttribute("data-id")];
      if (!sel) return;
      sel[e.target.getAttribute("data-thr")] = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
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
    renderAll: renderAll
  };

  function boot() {
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
