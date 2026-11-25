/**
 * 流放之路 2 (PoE2) 词缀正则生成器核心引擎
 * 严格遵循 PoE 2 客户端与市集搜索框语法：
 * - 多条件与 (AND)：空格分隔的多个双引号区块，如 `"block1" "block2"`
 * - 多条件或 (OR)：同一双引号区块内用 `|` 连接，如 `"a|b"`
 * - 排除条件 (NOT)：带 `!` 前缀的区块，如 `"!a|b"`（对任一行命中即排除）
 * - 逐行匹配约束：游戏内按行评估正则，严禁跨 `\n` 拼接多个独立行
 * - 长度上限约束：最多 250 字符，支持保留数值门槛的无碰撞短片段压缩
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.POE2_REGEX = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var VERSION = "2.1.0";
  var BUDGET = 250;
  var BUDGET_SAFE = 248;

  var META = /[.*+?^${}()|[\]\\]/g;
  function esc(text) {
    return String(text == null ? "" : text).replace(META, "\\$&");
  }

  function trunc(n) { return n < 0 ? Math.ceil(n) : Math.floor(n); }
  function clampUnsigned(n) { return Math.max(0, Math.min(999, trunc(Number(n) || 0))); }
  function clampSigned(n) { return Math.max(-999, Math.min(999, trunc(Number(n) || 0))); }

  var FIELD_SEP = "\\s*[:：]\\s*\\+?";
  var LOOSE_SEP = "\\s*[:：]?\\s*\\+?";

  function strRepeat(s, n) {
    var o = "";
    for (var i = 0; i < n; i++) o += s;
    return o;
  }

  function charClass(lo, hi) {
    return lo === hi ? String(lo) : "[" + lo + "-" + hi + "]";
  }

  function rangeSameWidth(loStr, hiStr) {
    var w = loStr.length;
    if (loStr === strRepeat("0", w) && hiStr === strRepeat("9", w)) {
      return strRepeat("[0-9]", w);
    }
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

  function unsignedInRange(min, max) {
    min = clampUnsigned(min);
    max = clampUnsigned(max);
    if (min > max) return null;
    if (min === max) return String(min);
    var parts = [];
    var minW = String(min).length;
    var maxW = String(max).length;
    for (var w = minW; w <= maxW; w++) {
      var lo = w === minW ? min : Math.pow(10, w - 1);
      var hi = w === maxW ? max : Math.pow(10, w) - 1;
      parts.push(rangeSameWidth(String(lo), String(hi)));
    }
    return parts.length === 1 ? parts[0] : "(" + parts.join("|") + ")";
  }

  /**
   * 为整数区间 [min, max]（支持 -999 到 999，含负数及跨零区间）生成最优精确数字正则
   */
  function numberInRange(min, max) {
    min = clampSigned(min);
    max = clampSigned(max);
    if (min > max) return null;
    if (min === max) return String(min);
    if (min >= 0) return unsignedInRange(min, max);
    if (max < 0) {
      var negInner = unsignedInRange(-max, -min);
      return negInner ? "-" + negInner : null;
    }
    var pieces = [];
    var negPart = unsignedInRange(1, -min);
    if (negPart) pieces.push("-" + negPart);
    var posPart = unsignedInRange(0, max);
    if (posPart) pieces.push(posPart);
    return pieces.length === 1 ? pieces[0] : "(" + pieces.join("|") + ")";
  }

  var RANGE_OR_NUM_RE = /\(\s*([+\-]?\d{1,3})\s*[—–-]\s*([+\-]?\d{1,3})\s*\)|([+\-]?\d{1,3})\s*[—–]\s*([+\-]?\d{1,3})|([+\-]?\d{1,3})/g;

  function isSpaceCode(code) {
    return code === 32 || code === 9 || code === 10 || code === 13 || code === 12 || code === 11 || code === 160 || code === 0x3000;
  }

  function hasLatinOrDigit(ch) {
    if (!ch) return false;
    var c = ch.charCodeAt(0);
    return (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
  }

  /**
   * 安全的静态文本转义：
   * - trimLeft / trimRight 控制是否裁切最外侧空白（与数字槽邻接的那一侧必须保留空白转义！）
   * - 英文单词/数字之间使用单空格 ' ' 或 '\s+'，绝不使用贪婪 .*
   * - 中文字符与数字之间的空白使用 '\s*' 以同时兼容客户端有无空格排版
   */
  function litEscape(s, compact, trimLeft, trimRight) {
    s = String(s == null ? "" : s);
    if (trimLeft) s = s.replace(/^\s+/, "");
    if (trimRight) s = s.replace(/\s+$/, "");
    var out = "";
    var buf = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (isSpaceCode(s.charCodeAt(i))) {
        if (buf) { out += esc(buf); buf = ""; }
        var prev = i > 0 ? s.charAt(i - 1) : "";
        var next = i + 1 < s.length ? s.charAt(i + 1) : "";
        // 前后都是拉丁字母，或左侧是数字与空白邻接；英文默认用单空格保持简洁并确保单复数替换命中
        var cjkSide = (/[\u4e00-\u9fff]/.test(prev) || /[\u4e00-\u9fff]/.test(next));
        var token = cjkSide ? "\\s*"
          : (prev === "" || next === "") ? (compact ? " " : " ")
          : (hasLatinOrDigit(prev) && hasLatinOrDigit(next)) ? " "
          : " ";
        // 去重连续空格 token
        if (out.slice(-3) !== "\\s*" && out.slice(-3) !== "\\s+" && out.slice(-1) !== " ") {
          out += token;
        }
      } else {
        buf += ch;
      }
    }
    if (buf) out += esc(buf);
    return out;
  }

  function tokenizeStatText(text) {
    var s = String(text == null ? "" : text);
    var tokens = [];
    var last = 0;
    var m;
    RANGE_OR_NUM_RE.lastIndex = 0;
    while ((m = RANGE_OR_NUM_RE.exec(s)) !== null) {
      if (m.index > last) {
        tokens.push({ type: "lit", text: s.slice(last, m.index) });
      }
      var raw = m[0];
      var lo = 0, hi = 999, isVar = true;
      if (m[1] !== undefined) {
        lo = Number(m[1]);
        hi = Number(m[2]);
      } else if (m[3] !== undefined) {
        lo = Number(m[3]);
        hi = Number(m[4]);
      } else if (m[5] !== undefined) {
        lo = Number(m[5]);
        hi = Number(m[5]);
        isVar = false;
      }
      tokens.push({
        type: "num",
        raw: raw,
        lo: Math.min(lo, hi),
        hi: Math.max(lo, hi),
        isVar: isVar
      });
      last = m.index + raw.length;
    }
    if (last < s.length) {
      tokens.push({ type: "lit", text: s.slice(last) });
    }
    return tokens;
  }

  /**
   * 针对英文单复数与繁中「1/一」的客户端文本适配
   */
  function adaptClientVariant(pat, lang, lo, hi, anchorEnd) {
    if (lang === "tw") {
      if (lo <= 1 && hi >= 1) {
        pat = pat.replace(/(額外的?(?:\\s\*)?|含有(?:\\s\*)?)(1|\[[^\]]+\]|\([^)]+\))((?:\\s\*)?個)/g, function (_, pre, np, suf) {
          if (lo === 1 && hi === 1) return pre + "(1|一)" + suf;
          return pre + "(" + np + "|一)" + suf;
        });
      }
      return pat;
    }
    if (lang !== "en") return pat;

    var hasOne = (lo <= 1 && hi >= 1);
    var hasMulti = (hi > 1);
    var tail = anchorEnd ? "$" : "";

    // 匹配 "*additional Strongboxes|Azmeri Spirits|..." 以及前导数字片段
    pat = pat.replace(
      /(?:(contains(?:\s+|\\s\+))|(?:inhabited(?:\s+|\\s\+)by(?:\s+|\\s\+))|(?:^|(?:\s+|\\s\+)))(1|\[[^\]]+\]|\([^)]+\)|[0-9]+\+?)((?:\s+|\\s\+)additional(?:\s+|\\s\+))(Strongboxes|Shrines|Essences|Azmeri Spirits|Summoning Circles|Abysses|Rogue Exiles|Rare Modifiers|Modifiers)/gi,
      function (full, hasContains, numPat, mid, noun) {
        var prefix = hasContains || (full.indexOf("by") >= 0 ? full.slice(0, full.indexOf(numPat)) : "");
        var leadWs = (!hasContains && full.indexOf("by") < 0 && /^(?:\s|\\s\+)/.test(full)) ? full.slice(0, full.indexOf(numPat)) : prefix;
        var sing = noun;
        if (noun === "Strongboxes") sing = "Strongbox";
        else if (noun === "Essences") sing = "Essence";
        else if (noun === "Abysses") sing = "Abyss";
        else if (noun === "Azmeri Spirits") sing = "Azmeri Spirit";
        else if (noun === "Rogue Exiles") sing = "Rogue Exile";
        else if (noun === "Summoning Circles") sing = "Summoning Circle";
        else if (noun === "Rare Modifiers") sing = "Rare Modifier";
        else if (noun === "Modifiers") sing = "Modifier";
        else if (noun === "Shrines") sing = "Shrine";

        if (hasOne && !hasMulti) {
          var np1 = (noun === "Azmeri Spirits" || noun === "Rogue Exiles") ? "1" : "(1|an)";
          return leadWs + np1 + mid + sing + tail;
        }
        if (hasOne && hasMulti) {
          var npMix = (noun === "Azmeri Spirits" || noun === "Rogue Exiles") ? numPat : "(an|" + numPat + ")";
          var plSuf = /Strongbox|Abyss/i.test(noun) ? "(es)?" : "s?";
          return leadWs + npMix + mid + sing + plSuf;
        }
        return leadWs + numPat + mid + noun + tail;
      }
    );

    // Temple "1 extra packs of Monsters"（兼容单复数）
    pat = pat.replace(
      /(1|\[[^\]]+\]|\([^)]+\))((?:\s+|\\s\+)extra(?:\s+|\\s\+)pack)s/gi,
      function (_, numPat, rest) {
        if (hasOne) return numPat + rest + "s?";
        return numPat + rest + "s";
      }
    );

    return pat;
  }

  function resolveRangeBounds(tok, opts) {
    var baseLo = tok.lo;
    var baseHi = tok.hi;
    var hasMin = opts.atLeast !== undefined && opts.atLeast !== null && opts.atLeast !== "";
    var hasMax = opts.atMost !== undefined && opts.atMost !== null && opts.atMost !== "";
    var lo = baseLo;
    var hi = baseHi;

    if (hasMin) lo = clampSigned(opts.atLeast);
    if (hasMax) {
      hi = clampSigned(opts.atMost);
    } else if (hasMin) {
      if (baseHi < 0) {
        hi = baseHi;
      } else {
        var stackCap = (opts.stackMax && opts.stackMax > baseHi) ? opts.stackMax : baseHi;
        if (lo > stackCap) {
          hi = baseHi <= 9 && lo <= 9 ? 9 : (lo <= 99 ? 99 : 999);
        } else {
          hi = stackCap;
        }
      }
    }

    if (lo > hi) return null;
    return { lo: lo, hi: hi };
  }

  /**
   * 完整精确单行词缀正则（支持正负数值范围、叠加高值与英文单复数适配）
   */
  function threshold(text, opts) {
    if (!text) return null;
    opts = opts || {};
    var lang = opts.lang || detectLang(text);
    var s = firstLineOf(text);
    var tokens = tokenizeStatText(s);
    var numTokens = tokens.filter(function (t) { return t.type === "num"; });
    if (!numTokens.length) return null;

    var slot = 0;
    var out = "";
    var primaryBounds = null;
    var hasUserBounds = (opts.atLeast !== undefined && opts.atLeast !== null && opts.atLeast !== "") ||
                        (opts.atMost !== undefined && opts.atMost !== null && opts.atMost !== "");

    for (var i = 0; i < tokens.length; i++) {
      var tk = tokens[i];
      if (tk.type === "lit") {
        var trimL = (i === 0);
        var trimR = (i === tokens.length - 1);
        out += litEscape(tk.text, !!opts.compact, trimL, trimR);
      } else {
        var isPrimary = (slot === 0);
        var bounds = isPrimary && hasUserBounds
          ? resolveRangeBounds(tk, opts)
          : { lo: tk.lo, hi: tk.hi };
        if (!bounds) return null;
        if (isPrimary) primaryBounds = bounds;

        var numPat = (opts.relaxNumbers && tk.isVar)
          ? (bounds.lo < 0 ? "-?[0-9]+" : "[0-9]+")
          : numberInRange(bounds.lo, bounds.hi);
        if (!numPat) return null;
        if (bounds.lo < 0 && out.slice(-2) === "\\+") {
          out = out.slice(0, -2) + "\\+?";
        }
        out += numPat;
        slot++;
      }
    }

    if (primaryBounds) {
      out = adaptClientVariant(out, lang, primaryBounds.lo, primaryBounds.hi, opts.anchorEnd !== false);
    }
    if (primaryBounds && /[0-9\])]$/.test(out)) {
      out += "$";
    }
    return cleanPattern(out);
  }

  /**
   * 构造不含数值门槛的词缀存在性/排除正则（保留固定数值、支持客户端单复数适配）
   */
  function presence(text, opts) {
    if (!text) return null;
    opts = typeof opts === "number" ? { minLen: opts } : (opts || {});
    var lang = opts.lang || detectLang(text);
    var s = firstLineOf(text);
    var tokens = tokenizeStatText(s);
    var out = "";
    var primaryBounds = null;
    var slot = 0;

    for (var i = 0; i < tokens.length; i++) {
      var tk = tokens[i];
      if (tk.type === "lit") {
        var trimL = (i === 0);
        var trimR = (i === tokens.length - 1);
        out += litEscape(tk.text, !!opts.compact, trimL, trimR);
      } else {
        var isPrimary = (slot === 0);
        if (isPrimary) primaryBounds = { lo: tk.lo, hi: tk.hi };
        if (tk.isVar) {
          if (tk.lo < 0 && out.slice(-2) === "\\+") out = out.slice(0, -2) + "\\+?";
          out += (tk.lo < 0 ? "-?[0-9]+" : "[0-9]+");
        } else {
          out += String(tk.lo);
        }
        slot++;
      }
    }
    if (primaryBounds) {
      var needEnd = (tokens.length > 0 && tokens[tokens.length - 1].type === "lit" && primaryBounds.lo === 1 && primaryBounds.hi === 1);
      out = adaptClientVariant(out, lang, primaryBounds.lo, primaryBounds.hi, needEnd);
    }
    return cleanPattern(out) || null;
  }

  function firstLineOf(text) {
    if (Array.isArray(text)) return String(text[0] || "");
    return String(text || "").split(/\r?\n/)[0];
  }

  function detectLang(text) {
    var s = String(text || "");
    if (/[\u4e00-\u9fff]/.test(s)) {
      if (/[地圖怪物機率換界碑牌詞綴額個增加減少]/.test(s)) return "tw";
      return "cn";
    }
    return "en";
  }

  function cleanPattern(p) {
    if (!p) return null;
    return p
      .replace(/^(?:\\s[*+])+/, "")
      .replace(/(?:\\s[*+])+$/, "")
      .replace(/^\s+|\s+$/g, "");
  }

  // ==================== 无碰撞最短区别片段语料库编译器 ====================
  var _corpusCache = {};

  // 游戏内物品面板的非词缀头部与底材行，加入禁区以防短关键词撞车物品名称或总览行
  var HEADER_FORBIDDEN = {
    cn: [
      "物品类别: 引路石", "物品类别: 石板", "引路石（ 15 阶）", "稀 有 度: 稀有",
      "稀有度: 普通", "稀有度: 魔法", "稀有度: 稀有", "稀有度: 传奇",
      "物品稀有度: +100%", "怪物群规模: +30%", "怪物强度: +40%", "怪物稀有度: +50%",
      "引路石掉落几率: +200%", "复活次数: 1", "被腐化", "已腐化",
      "能量辐照石板", "驱灵仪式石板", "惊悸迷雾石板", "裂隙石板", "深渊石板", "神庙石板", "霸主石板", "先祖秘藏石板"
    ],
    tw: [
      "物品種類: 換界石", "物品種類: 碑牌", "換界石（階級 15）",
      "稀有度: 普通", "稀有度: 魔法", "稀有度: 稀有", "稀有度: 傳奇",
      "物品稀有度: +100%", "怪群大小: +30%", "怪物效用: +40%", "怪物稀有度: +50%",
      "換界石掉落機率: +200%", "可用的復活數: 1", "已汙染",
      "輻照碑牌", "祭祀碑牌", "譫妄碑牌", "裂痕碑牌", "深淵碑牌", "神廟碑牌", "總督碑牌", "探險碑牌"
    ],
    en: [
      "Item Class: Waystones", "Item Class: Tablet", "Waystone (Tier 15)",
      "Rarity: Normal", "Rarity: Magic", "Rarity: Rare", "Rarity: Unique",
      "Item Rarity: +100%", "Monster Pack Size: +30%", "Monster Effectiveness: +40%",
      "Monster Rarity: +50%", "Waystone Drop Chance: +200%", "Revives Available: 1", "Corrupted",
      "Irradiated Tablet", "Ritual Tablet", "Delirium Tablet", "Breach Tablet",
      "Abyss Tablet", "Temple Tablet", "Overseer Tablet", "Expedition Tablet"
    ]
  };

  function expandAffixSamples(affix, lang) {
    var lines = (affix.lines && affix.lines[lang]) || [];
    var line = lines[0] || (affix.tpl && affix.tpl[lang]) || "";
    if (!line) return [];
    var tokens = tokenizeStatText(line);
    var numTokens = tokens.filter(function (t) { return t.type === "num"; });
    if (!numTokens.length) return [{ val: null, text: line }];

    var samples = [];
    var t0 = numTokens[0];
    var probeVals = [t0.lo];
    if (t0.isVar) {
      if (t0.hi !== t0.lo) probeVals.push(Math.round((t0.lo + t0.hi) / 2), t0.hi);
      if (affix.stackMax && affix.stackMax > t0.hi) probeVals.push(affix.stackMax);
    }
    var seen = {};
    probeVals = probeVals.filter(function (v) { if (seen[v]) return false; seen[v] = 1; return true; });

    for (var pi = 0; pi < probeVals.length; pi++) {
      var val = probeVals[pi];
      var s = "";
      var slot = 0;
      for (var i = 0; i < tokens.length; i++) {
        var tk = tokens[i];
        if (tk.type === "lit") s += tk.text;
        else {
          var v = slot === 0 ? val : tk.lo;
          if (v < 0 && s.slice(-1) === "+") s = s.slice(0, -1);
          s += String(v);
          slot++;
        }
      }
      samples.push({ val: val, text: s });
      if (lang === "en" && val === 1) {
        var sg = s.replace(/\b1 additional (Strongboxes|Shrines|Essences|Summoning Circles|Abysses|Azmeri Spirits|Rogue Exiles|Rare Modifiers|Modifiers)\b/g, function (_, noun) {
          var one = noun === "Strongboxes" ? "Strongbox"
            : noun === "Essences" ? "Essence"
            : noun === "Abysses" ? "Abyss"
            : noun === "Azmeri Spirits" ? "Azmeri Spirit"
            : noun === "Rogue Exiles" ? "Rogue Exile"
            : noun === "Summoning Circles" ? "Summoning Circle"
            : noun === "Rare Modifiers" ? "Rare Modifier"
            : noun === "Modifiers" ? "Modifier" : "Shrine";
          return (noun === "Azmeri Spirits" || noun === "Rogue Exiles" ? "1 additional " : "an additional ") + one;
        });
        if (sg !== s) samples.push({ val: 1, text: sg });
      }
      if (lang === "tw" && val === 1 && /額外的1個/.test(s)) {
        samples.push({ val: 1, text: s.replace("額外的1個", "額外的一個") });
      }
    }
    return samples;
  }

  function compileStatPattern(affix, allAffixes, lang) {
    var mySamples = expandAffixSamples(affix, lang);
    if (!mySamples.length) return { presence: null, rangeTpl: null };

    var myTexts = mySamples.map(function (s) { return s.text; });
    var forbiddenTexts = (HEADER_FORBIDDEN[lang] || []).slice();
    var hasPhysicalOverlap = false;

    for (var i = 0; i < allAffixes.length; i++) {
      var other = allAffixes[i];
      if (other.id === affix.id) continue;
      var oSamples = expandAffixSamples(other, lang);
      for (var j = 0; j < oSamples.length; j++) {
        var oTxt = oSamples[j].text;
        var sameExact = myTexts.some(function (mt) { return mt.toLowerCase() === oTxt.toLowerCase(); });
        if (sameExact) {
          hasPhysicalOverlap = true;
        } else {
          forbiddenTexts.push(oTxt);
        }
      }
    }

    function matchesAllMine(re) {
      for (var k = 0; k < myTexts.length; k++) {
        if (!re.test(myTexts[k])) return false;
      }
      return true;
    }
    function matchesNoForbidden(re) {
      for (var k = 0; k < forbiddenTexts.length; k++) {
        if (re.test(forbiddenTexts[k])) return false;
      }
      return true;
    }

    var line = (affix.lines && affix.lines[lang] && affix.lines[lang][0]) || (affix.tpl && affix.tpl[lang]) || "";
    var tokens = tokenizeStatText(line);
    var isCjk = lang !== "en";
    var minChunk = isCjk ? 2 : 3;

    var firstNumIdx = -1;
    for (var fi = 0; fi < tokens.length; fi++) { if (tokens[fi].type === "num") { firstNumIdx = fi; break; } }

    // 1) 搜索最短“存在性/排除”片段
    var presCandidates = [];
    // 若无物理字面重叠（两词缀数值一模一样），可安全搜索纯文字连续子串；若有重叠，优先搜索带数字窗口防止纯文字漏掉数值区分度
    if (!hasPhysicalOverlap) {
      for (var ti = 0; ti < tokens.length; ti++) {
        if (tokens[ti].type !== "lit") continue;
        var rawSeg = tokens[ti].text.replace(/^\s+|\s+$/g, "");
        if (rawSeg.length < minChunk) continue;
        for (var L = minChunk; L <= Math.min(rawSeg.length, isCjk ? 14 : 24); L++) {
          for (var pos = 0; pos <= rawSeg.length - L; pos++) {
            var sub = rawSeg.slice(pos, pos + L);
            if (/^\s|\s$/.test(sub)) continue;
            if (!isCjk && !/[a-z]{2}/i.test(sub)) continue;
            var pat = litEscape(sub, true, true, true);
            presCandidates.push(pat);
            if (pos === 0 && ti === 0) presCandidates.push("^" + pat);
            if (pos + L === rawSeg.length && ti === tokens.length - 1) presCandidates.push(pat + "$");
          }
        }
      }
    }

    // 带数字窗候选
    if (firstNumIdx >= 0) {
      var nTok0 = tokens[firstNumIdx];
      var lRaw0 = firstNumIdx > 0 && tokens[firstNumIdx - 1].type === "lit" ? tokens[firstNumIdx - 1].text : "";
      var rRaw0 = tokens.slice(firstNumIdx + 1).map(function (t) { return t.type === "lit" ? t.text : String(t.lo); }).join("");
      var numPat0 = nTok0.isVar
        ? numberInRange(nTok0.lo, Math.max(nTok0.hi, affix.stackMax || nTok0.hi))
        : String(nTok0.lo);
      var maxLw = Math.min(lRaw0.length, isCjk ? 10 : 18);
      var maxRw = Math.min(rRaw0.length, isCjk ? 18 : 48);
      var winPairs = [];
      for (var lw = 0; lw <= maxLw; lw++) {
        for (var rw = 0; rw <= maxRw; rw++) {
          if (lw === 0 && rw === 0) continue;
          winPairs.push({ lw: lw, rw: rw, cost: lw + rw });
        }
      }
      winPairs.sort(function (a, b) { return a.cost - b.cost; });
      for (var wp = 0; wp < winPairs.length; wp++) {
        var lwVal = winPairs[wp].lw, rwVal = winPairs[wp].rw;
        var pL0 = lwVal > 0 ? lRaw0.slice(lRaw0.length - lwVal) : "";
        var pR0 = rwVal > 0 ? rRaw0.slice(0, rwVal) : "";
        if (!pL0 && !(firstNumIdx === 0)) continue;
        if (pL0 && /^\s/.test(pL0)) continue;
        if (pR0 && /\s$/.test(pR0)) continue;
        var escL0 = litEscape(pL0, true, lwVal === lRaw0.length && firstNumIdx === 1, false);
        var escR0 = litEscape(pR0, true, false, rwVal === rRaw0.length);
        // 中文数字旁如果原串有空格，litEscape 对单独空白字符在非 CJK 前后可能返回 " "，统一转为 \s*
        if (isCjk && pL0 && /\s$/.test(pL0) && !/\\s\*$/.test(escL0)) escL0 = escL0.replace(/\s+$/, "\\s*");
        if (isCjk && pR0 && /^\s/.test(pR0) && !/^\\s\*/.test(escR0)) escR0 = escR0.replace(/^\s+/, "\\s*");
        var isFullRight0 = (rwVal === rRaw0.length);
        var cand0 = (lwVal === lRaw0.length && firstNumIdx === 1 && pL0 === "" ? "^" : "") + escL0 + numPat0 + escR0;
        cand0 = adaptClientVariant(cand0, lang, nTok0.lo, Math.max(nTok0.hi, affix.stackMax || nTok0.hi), isFullRight0);
        if (isFullRight0 && !/\$$/.test(cand0) && (hasPhysicalOverlap || /[0-9\])s]$/.test(cand0))) {
          cand0 += "$";
        }
        presCandidates.push(cand0);
      }
    }

    presCandidates.sort(function (a, b) { return a.length - b.length; });
    var chosenPres = null;
    for (var ci = 0; ci < presCandidates.length; ci++) {
      var candP = presCandidates[ci];
      if (!candP || candP.length < 2) continue;
      var reP;
      try { reP = new RegExp(candP, "i"); } catch (e) { continue; }
      if (matchesAllMine(reP) && matchesNoForbidden(reP)) {
        chosenPres = candP;
        break;
      }
    }
    if (!chosenPres) {
      chosenPres = presence(line, { lang: lang, compact: true });
    }

    // 2) 为“数值门槛模式”搜索最短无碰撞锚点模板（带左侧数字锚防 15 当 5）
    var chosenRangeTpl = null;
    if (firstNumIdx >= 0) {
      var nTok = tokens[firstNumIdx];
      var lFull = tokens.slice(0, firstNumIdx).map(function (t) { return t.type === "lit" ? t.text : String(t.lo); }).join("");
      var rFull = tokens.slice(firstNumIdx + 1).map(function (t) { return t.type === "lit" ? t.text : String(t.lo); }).join("");
      var maxL = Math.min(lFull.length, isCjk ? 14 : 26);
      var maxR = Math.min(rFull.length, isCjk ? 20 : 52);
      var rPairs = [];
      for (var rl = 0; rl <= maxL; rl++) {
        for (var rr = 0; rr <= maxR; rr++) {
          if (rl === 0 && rr === 0) continue;
          rPairs.push({ rl: rl, rr: rr, cost: rl + rr });
        }
      }
      rPairs.sort(function (a, b) { return a.cost - b.cost; });

      var probeHi = Math.max(nTok.hi, affix.stackMax || nTok.hi);
      var genericNumPat = nTok.lo < 0 ? "-?[0-9]+" : "[0-9]+";
      outerSearch:
      for (var ri = 0; ri < rPairs.length; ri++) {
        var pL = rPairs[ri].rl > 0 ? lFull.slice(lFull.length - rPairs[ri].rl) : "";
        var pR = rPairs[ri].rr > 0 ? rFull.slice(0, rPairs[ri].rr) : "";
        // 数字左边界必须非空、非数字、且绝不以空白起头或以空白收尾（避免 cleanPattern 裁边前后行为不一致）
        var atNumAtStart = (firstNumIdx === 0);
        if (!pL && !atNumAtStart) continue;
        if (pL && /^\s/.test(pL)) continue;
        if (!pR && rFull.length > 0) continue;
        if (pR && /\s$/.test(pR)) continue;

        if (nTok.lo < 0 && pL.slice(-1) === "+") pL = pL.slice(0, -1);
        var canAnchorStart = (atNumAtStart && !pL) || (rPairs[ri].rl === lFull.length && firstNumIdx === 1);
        var startOpts = canAnchorStart ? ((atNumAtStart && !pL) ? [true] : [false, true]) : [false];

        var escL = litEscape(pL, true, rPairs[ri].rl === lFull.length && !atNumAtStart, false);
        var escR = litEscape(pR, true, false, rPairs[ri].rr === rFull.length);
        if (isCjk) {
          if (pL && /\s$/.test(pL) && !/\\s\*$/.test(escL)) escL = escL.replace(/\s+$/, "\\s*");
          if (pR && /^\s/.test(pR) && !/^\\s\*/.test(escR)) escR = escR.replace(/^\s+/, "\\s*");
        }
        var isFullRight = (rPairs[ri].rr === rFull.length);
        var numRangePat = numberInRange(nTok.lo, probeHi);
        if (!numRangePat) continue;

        for (var si = 0; si < startOpts.length; si++) {
          var useStart = startOpts[si];
          var buildCand = function (nPat, loV, hiV) {
            var s = (useStart ? "^" : "") + escL + nPat + escR;
            s = adaptClientVariant(s, lang, loV, hiV, isFullRight);
            if (isFullRight && !/\$$/.test(s) && (hasPhysicalOverlap || /[0-9\])]$/.test(s))) s += "$";
            return s;
          };

          var testPat = buildCand(numRangePat, nTok.lo, probeHi);
          var reTest;
          try { reTest = new RegExp(testPat, "i"); } catch (e) { continue; }
          if (!matchesAllMine(reTest) || !matchesNoForbidden(reTest)) continue;

          // 当非物理字面重合同形词缀时，进一步用通配数字校验禁区 0 碰撞，杜绝放宽门槛或 Level 2 退化时串台！
          if (!hasPhysicalOverlap) {
            var genPat = buildCand(genericNumPat, nTok.lo, Math.max(probeHi, 99));
            var reGen;
            try { reGen = new RegExp(genPat, "i"); } catch (e) { continue; }
            if (!matchesNoForbidden(reGen)) continue;
          }

          // 严格防数字膨胀自检：把数字换成 probeHi+10，验证绝对不会被误命中！
          var inflatedText = lFull + String(probeHi >= 0 ? probeHi + 10 : nTok.lo - 10) + rFull;
          if (reTest.test(inflatedText)) continue;

          chosenRangeTpl = {
            left: pL,
            right: pR,
            anchorStart: useStart,
            anchorEnd: isFullRight
          };
          break outerSearch;
        }
      }
    }

    return { presence: chosenPres, rangeTpl: chosenRangeTpl };
  }

  function getCorpusMap(affixes, lang) {
    var sig = lang + ":" + affixes.length + ":" + (affixes[0] ? affixes[0].id : "") + ":" + (affixes[affixes.length - 1] ? affixes[affixes.length - 1].id : "");
    if (_corpusCache[sig]) return _corpusCache[sig];
    var map = {};
    for (var i = 0; i < affixes.length; i++) {
      map[affixes[i].id] = compileStatPattern(affixes[i], affixes, lang);
    }
    _corpusCache[sig] = map;
    return map;
  }

  function compactThreshold(affix, corpusEntry, opts) {
    opts = opts || {};
    var lang = opts.lang || "cn";
    var line = (affix.lines && affix.lines[lang] && affix.lines[lang][0]) || (affix.tpl && affix.tpl[lang]) || "";
    if (!corpusEntry || !corpusEntry.rangeTpl) {
      return threshold(line, Object.assign({}, opts, { compact: true, stackMax: affix.stackMax }));
    }
    var tokens = tokenizeStatText(line);
    var firstNum = null;
    for (var i = 0; i < tokens.length; i++) { if (tokens[i].type === "num") { firstNum = tokens[i]; break; } }
    if (!firstNum) return corpusEntry.presence || null;

    var bounds = resolveRangeBounds(firstNum, Object.assign({}, opts, { stackMax: affix.stackMax }));
    if (!bounds) return null;

    var numPat = (opts.relaxNumbers && firstNum.isVar)
      ? (bounds.lo < 0 ? "-?[0-9]+" : "[0-9]+")
      : numberInRange(bounds.lo, bounds.hi);
    if (!numPat) return null;

    var tpl = corpusEntry.rangeTpl;
    var pL = litEscape(tpl.left, true, false, false);
    var pR = litEscape(tpl.right, true, false, tpl.anchorEnd);
    if (lang !== "en") {
      if (tpl.left && /\s$/.test(tpl.left) && !/\\s\*$/.test(pL)) pL = pL.replace(/\s+$/, "\\s*");
      if (tpl.right && /^\s/.test(tpl.right) && !/^\\s\*/.test(pR)) pR = pR.replace(/^\s+/, "\\s*");
    }
    if (bounds.lo < 0 && pL.slice(-2) === "\\+") pL = pL.slice(0, -2) + "\\+?";
    var res = (tpl.anchorStart ? "^" : "") + pL + numPat + pR;
    res = adaptClientVariant(res, lang, bounds.lo, bounds.hi, tpl.anchorEnd);
    if (tpl.anchorEnd && !/\$$/.test(res) && /[0-9\])A-Za-z]$/.test(res)) {
      res += "$";
    }
    return cleanPattern(res);
  }

  function hasTopLevelPipe(s) {
    var depth = 0, inClass = false;
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "\\") { i++; continue; }
      if (c === "[" && !inClass) inClass = true;
      else if (c === "]" && inClass) inClass = false;
      else if (!inClass) {
        if (c === "(") depth++;
        else if (c === ")" && depth > 0) depth--;
        else if (c === "|" && depth === 0) return true;
      }
    }
    return false;
  }

  function wrapBranch(s) {
    if (!s) return s;
    return hasTopLevelPipe(s) ? "(" + s + ")" : s;
  }

  function isSafe(p) {
    if (typeof p !== "string" || p.length === 0) return false;
    if (p.indexOf('"') !== -1 || p.indexOf("\n") !== -1 || p.indexOf("\r") !== -1) return false;
    try { new RegExp(p, "i"); return true; } catch (e) { return false; }
  }

  function compactList(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) { if (list[i]) out.push(list[i]); }
    return out;
  }

  function dedupe(list) {
    var seen = {}, out = [];
    for (var i = 0; i < list.length; i++) {
      if (seen[list[i]]) continue;
      seen[list[i]] = 1;
      out.push(list[i]);
    }
    return out;
  }

  function quoteAll(blocks) {
    var out = [];
    for (var i = 0; i < blocks.length; i++) out.push('"' + blocks[i] + '"');
    return out.join(" ");
  }

  function build(opts) {
    opts = opts || {};
    var includes = dedupe(compactList(opts.includes || []));
    var excludes = dedupe(compactList(opts.excludes || []));
    var always = dedupe(compactList(opts.always || []));
    var match = opts.match === "any" ? "any" : "all";
    var allFrags = always.concat(includes, excludes);
    if (!allFrags.length) return { ok: false, reason: "no-conditions", source: "", blocks: [], length: 0 };

    for (var i = 0; i < allFrags.length; i++) {
      if (!isSafe(allFrags[i])) {
        return { ok: false, reason: "invalid-fragment", source: "", blocks: [], length: 0, detail: allFrags[i] };
      }
    }

    var blocks = always.slice();
    if (includes.length) {
      if (match === "all") {
        for (var j = 0; j < includes.length; j++) blocks.push(includes[j]);
      } else if (includes.length === 1) {
        blocks.push(includes[0]);
      } else {
        blocks.push(includes.map(wrapBranch).join("|"));
      }
    }
    if (excludes.length) {
      var exJoined = excludes.length === 1 ? excludes[0] : excludes.map(wrapBranch).join("|");
      blocks.push("!" + exJoined);
    }

    var source = quoteAll(blocks);
    return { ok: true, reason: "ok", source: source, blocks: blocks, length: source.length };
  }

  function fit(levels, budget) {
    budget = budget || BUDGET;
    var chosen = null;
    for (var i = 0; i < levels.length; i++) {
      var r = build(levels[i]);
      if (r.ok && r.length <= budget) {
        chosen = { level: i, source: r.source, length: r.length, blocks: r.blocks };
        break;
      }
    }
    if (!chosen) {
      var best = null;
      for (var k = 0; k < levels.length; k++) {
        var rr = build(levels[k]);
        if (rr.ok && (!best || rr.length < best.length)) {
          best = { level: k, source: rr.source, length: rr.length, blocks: rr.blocks };
        }
      }
      if (best) { best.over = true; return best; }
      return { level: -1, source: "", length: 0, blocks: [], empty: true };
    }
    chosen.over = false;
    return chosen;
  }

  function testTooltip(source, tooltipText) {
    if (!source || typeof tooltipText !== "string") return false;
    var lines = tooltipText.split(/\r?\n/);
    var blocks = [];
    var m;
    var qRe = /"([^"]+)"/g;
    while ((m = qRe.exec(source)) !== null) {
      blocks.push(m[1]);
    }
    if (!blocks.length) return false;
    for (var i = 0; i < blocks.length; i++) {
      var blk = blocks[i];
      var negate = blk.charAt(0) === "!";
      var body = negate ? blk.slice(1) : blk;
      var re;
      try { re = new RegExp(body, "i"); } catch (e) { return false; }
      var anyLineHit = lines.some(function (ln) { return re.test(ln); });
      if (negate && anyLineHit) return false;
      if (!negate && !anyLineHit) return false;
    }
    return true;
  }

  function selfTest() {
    var fails = [];
    var probes = [
      [0, 9], [0, 10], [5, 5], [1, 999], [15, 19], [30, 40], [70, 100],
      [100, 119], [200, 240], [25, 35], [-10, -3], [-8, -5], [-10, 10]
    ];
    for (var i = 0; i < probes.length; i++) {
      var lo = probes[i][0], hi = probes[i][1];
      var frag = numberInRange(lo, hi);
      if (!frag) { fails.push(lo + ".." + hi + ": null"); continue; }
      var re;
      try { re = new RegExp("^(?:" + frag + ")$"); } catch (e) { fails.push(lo + ".." + hi + ": bad"); continue; }
      for (var v = -50; v <= 300; v++) {
        if (re.test(String(v)) !== (v >= lo && v <= hi)) { fails.push(lo + ".." + hi + " v=" + v); break; }
      }
    }
    if (esc("a.b") !== "a\\.b") fails.push("escape");
    var b = build({ includes: ["abc", "def|ghi"], excludes: ["x|y", "z"], always: ["aaa"], match: "any" });
    if (!b.ok || b.source !== '"aaa" "abc|(def|ghi)" "!(x|y)|z"') fails.push("build-pipe");
    var t1 = presence("Map contains 1 additional Azmeri Spirits", { lang: "en" });
    if (!new RegExp(t1, "i").test("Map contains 1 additional Azmeri Spirit")) fails.push("en-singular");
    var mockItem = "霸主石板\n稀有度: 稀有\n地图包含 2 个额外的阿兹莫里之灵\n地图包含保险箱的几率提高 85%";
    if (!testTooltip('"霸主石板" "包含\\s*[2-3]\\s*个额外"', mockItem)) fails.push("tooltip-match");
    if (testTooltip('"霸主石板" "!保险箱"', mockItem)) fails.push("tooltip-exclude");
    return { ok: fails.length === 0, fails: fails };
  }

  return {
    VERSION: VERSION,
    BUDGET: BUDGET,
    BUDGET_SAFE: BUDGET_SAFE,
    esc: esc,
    litEscape: litEscape,
    fieldSep: FIELD_SEP,
    looseSep: LOOSE_SEP,
    numberInRange: numberInRange,
    presence: presence,
    threshold: threshold,
    getCorpusMap: getCorpusMap,
    compactThreshold: compactThreshold,
    build: build,
    fit: fit,
    testTooltip: testTooltip,
    selfTest: selfTest
  };
});
