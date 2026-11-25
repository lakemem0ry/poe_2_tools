/**
 * PoE2DB 原始数据赛季索引
 * 用于区分当前赛季（current/）与按赛季归档的历史赛季（archive/<season>/）
 */
(function (global) {
  "use strict";

  global.POE2_SEASONS = {
    current: "0.4",
    seasons: [
      {
        id: "0.4",
        status: "current",
        label: "0.4 当前赛季（默认）",
        label_tw: "0.4 當前賽季（預設）",
        label_us: "0.4 Current Season",
        basePath: "data/poe2db/current",
        categories: ["equipment", "atlas", "currency"]
      }
    ],
    archiveLayout: {
      baseDir: "data/poe2db/archive",
      subCategories: ["equipment", "atlas", "currency"]
    }
  };
})(window);
