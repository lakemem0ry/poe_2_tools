/**
 * 全站用户本地存储与跨页备份导入/导出管家
 */
(function (global) {
  "use strict";

  const DEFAULTS = global.POE2_USER_DEFAULTS || {
    lang: "us",
    season: "0.4",
    tool1_regex: { storageKey: "poe2.regex.v7" },
    tool2_crafting: { season10OpenKey: "poe2_season10_open", defaultSeason10Open: true }
  };

  const LANG_KEY = "poe2.site.lang";
  const VALID_LANGS = new Set(["cn", "tw", "us"]);

  function readRaw(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val === null ? fallback : val;
    } catch (_) {
      return fallback;
    }
  }

  function writeRaw(key, val) {
    try {
      localStorage.setItem(key, val);
      return true;
    } catch (_) {
      return false;
    }
  }

  function getLang() {
    try {
      const params = new URLSearchParams(global.location.search || "");
      const qLang = params.get("lang");
      if (VALID_LANGS.has(qLang)) {
        writeRaw(LANG_KEY, qLang);
        return qLang;
      }
    } catch (_) {}
    const saved = readRaw(LANG_KEY, DEFAULTS.lang || "us");
    return VALID_LANGS.has(saved) ? saved : "us";
  }

  function setLang(lang) {
    const clean = VALID_LANGS.has(lang) ? lang : "us";
    writeRaw(LANG_KEY, clean);
    return clean;
  }

  function getSeason10Open() {
    const key = (DEFAULTS.tool2_crafting && DEFAULTS.tool2_crafting.season10OpenKey) || "poe2_season10_open";
    const raw = readRaw(key, null);
    if (raw === null) return !!(DEFAULTS.tool2_crafting ? DEFAULTS.tool2_crafting.defaultSeason10Open : true);
    return raw === "1";
  }

  function setSeason10Open(open) {
    const key = (DEFAULTS.tool2_crafting && DEFAULTS.tool2_crafting.season10OpenKey) || "poe2_season10_open";
    writeRaw(key, open ? "1" : "0");
  }

  function exportUserBackup() {
    const regexKey = (DEFAULTS.tool1_regex && DEFAULTS.tool1_regex.storageKey) || "poe2.regex.v7";
    let regexData = null;
    try { regexData = JSON.parse(readRaw(regexKey, "null")); } catch (_) { regexData = null; }
    return {
      schema: "poe2_tools_user_backup_v1",
      exportedAt: new Date().toISOString(),
      lang: getLang(),
      season10Open: getSeason10Open(),
      tool1_regex: regexData
    };
  }

  function importUserBackup(jsonText) {
    const parsed = JSON.parse(String(jsonText || ""));
    if (!parsed || typeof parsed !== "object" || parsed.schema !== "poe2_tools_user_backup_v1") {
      throw new Error("Invalid backup schema");
    }
    if (VALID_LANGS.has(parsed.lang)) setLang(parsed.lang);
    if (typeof parsed.season10Open === "boolean") setSeason10Open(parsed.season10Open);
    if (parsed.tool1_regex && typeof parsed.tool1_regex === "object") {
      const regexKey = (DEFAULTS.tool1_regex && DEFAULTS.tool1_regex.storageKey) || "poe2.regex.v7";
      writeRaw(regexKey, JSON.stringify(parsed.tool1_regex));
    }
    return parsed;
  }

  global.PoE2Storage = {
    LANG_KEY,
    readRaw,
    writeRaw,
    getLang,
    setLang,
    getSeason10Open,
    setSeason10Open,
    exportUserBackup,
    importUserBackup
  };
})(window);
