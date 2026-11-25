/**
 * PoE2DB 赛季数据路径解析与按需资源加载管理器
 */
(function (global) {
  "use strict";

  function getBasePath() {
    return typeof global.POE2_BASE_PATH === "string" ? global.POE2_BASE_PATH : "";
  }

  function resolvePath(relPath) {
    const base = getBasePath();
    if (!base) return relPath;
    return base.replace(/\/+$/, "") + "/" + String(relPath || "").replace(/^\/+/, "");
  }

  function getSeasonsMeta() {
    return global.POE2_SEASONS || {
      current: "0.4",
      seasons: [{ id: "0.4", status: "current", basePath: "data/poe2db/current" }]
    };
  }

  function getActiveSeason(seasonId) {
    const meta = getSeasonsMeta();
    const targetId = seasonId || meta.current || "0.4";
    return (meta.seasons || []).find((s) => s.id === targetId) || (meta.seasons && meta.seasons[0]) || {
      id: "0.4",
      status: "current",
      basePath: "data/poe2db/current"
    };
  }

  function getCategoryScriptUrl(slug, seasonId) {
    const season = getActiveSeason(seasonId);
    const rel = season.basePath.replace(/\/+$/, "") + "/equipment/categories/" + encodeURIComponent(slug) + ".js";
    return resolvePath(rel);
  }

  global.PoE2SeasonManager = {
    getBasePath,
    resolvePath,
    getSeasonsMeta,
    getActiveSeason,
    getCategoryScriptUrl
  };
})(window);
