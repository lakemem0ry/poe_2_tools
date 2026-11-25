/**
 * PoE2DB 0.4 历史赛季归档清单占位
 * 后续大版本（如 1.0 正式服）上线时，将原 current/ 下的 equipment/、atlas/、currency/ 整体归档至此目录
 */
(function (global) {
  "use strict";

  global.POE2_ARCHIVE_04_META = {
    season: "0.4",
    note: "Current live baseline stored under data/poe2db/current/; archived structure pre-created for seamless 1.0 rollout.",
    folders: ["equipment", "atlas", "currency"]
  };
})(window);
