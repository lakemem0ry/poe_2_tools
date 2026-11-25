/**
 * 用户默认配置预设（配合浏览器 localStorage 自动保存与 JSON 备份导出/导入）
 */
(function (global) {
  "use strict";

  global.POE2_USER_DEFAULTS = {
    lang: "us",
    season: "0.4",
    tool1_regex: {
      storageKey: "poe2.regex.v7"
    },
    tool2_crafting: {
      defaultSlug: "Bows",
      defaultMode: "workbench",
      season10OpenKey: "poe2_season10_open",
      defaultSeason10Open: true
    }
  };
})(window);
