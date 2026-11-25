/**
 * PoE2DB 当前赛季通货索引数据（供目录归类与版本审计使用）
 * 实际做装规则与本地化文案由 src/tool2_crafting/craftingEngine.js 挂载运行
 */
(function (global) {
  "use strict";

  global.POE2_CURRENCY_META = {
    season: "0.4",
    source: "poe2db.tw",
    groups: [
      "core_tiered_orbs",
      "crafting_and_abyss_omens",
      "abyssal_jawbones",
      "essences_and_alloys",
      "aldur_runes",
      "atziri_temple_currencies",
      "quality_currencies"
    ]
  };
})(window);
