/**
 * 工具 2（做装模拟器）自有前瞻数据：1.0 赛季「瓦尔克拉斯征服者」攻城宝库 6 种新通货定义（体验尝鲜）
 * 包含离线内联 SVG 图标与等级/部位限定元数据
 */
(function (global) {
  "use strict";

  const svgUri = (svg) => "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim());
  const S10_ICONS = {
    crimson_iron: svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e36b4f"/><stop offset="55%" stop-color="#8b261d"/><stop offset="100%" stop-color="#2c1210"/></linearGradient></defs><polygon points="14,42 24,18 50,18 42,42" fill="url(#g1)" stroke="#f0b26c" stroke-width="2.5" stroke-linejoin="round"/><polygon points="14,42 42,42 48,48 18,48" fill="#521612" stroke="#c98548" stroke-width="2"/><path d="M29 24 L35 30 L29 36 L25 32 Z" fill="#ffd89b" opacity="0.9"/></svg>'),
    scarlet_hide: svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d94e4e"/><stop offset="60%" stop-color="#7c1d24"/><stop offset="100%" stop-color="#2a0d10"/></linearGradient></defs><path d="M18 14 C28 18 36 18 46 14 L50 28 C44 34 44 42 48 50 C36 46 28 46 16 50 C20 42 20 34 14 28 Z" fill="url(#g2)" stroke="#e6a760" stroke-width="2.4" stroke-linejoin="round"/><circle cx="32" cy="32" r="6" fill="none" stroke="#ffd28e" stroke-width="2"/><path d="M29 32 L32 29 L35 32 L32 35 Z" fill="#ffd28e"/></svg>'),
    vermilion_gold: svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffcf70"/><stop offset="52%" stop-color="#c96528"/><stop offset="100%" stop-color="#5c1b12"/></linearGradient></defs><polygon points="16,40 24,20 48,20 42,40" fill="url(#g3)" stroke="#ffe3a1" stroke-width="2.5" stroke-linejoin="round"/><polygon points="16,40 42,40 46,47 20,47" fill="#7a2d15" stroke="#eab05e" stroke-width="2"/><path d="M28 26 H38 M33 23 V35" stroke="#fff2cf" stroke-width="2.2" stroke-linecap="round"/></svg>'),
    bloodvial_komaki: svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="bv1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f25757"/><stop offset="60%" stop-color="#9c141f"/><stop offset="100%" stop-color="#3d070c"/></linearGradient></defs><rect x="26" y="8" width="12" height="7" rx="2" fill="#d4a656" stroke="#755320" stroke-width="1.5"/><path d="M27 15 H37 L38 22 L48 34 C51 39 48 52 38 54 H26 C16 52 13 39 16 34 L26 22 Z" fill="#1b0d0e" stroke="#d4a656" stroke-width="2.2"/><path d="M18 36 C24 33 40 39 46 36 C48 42 44 50 37 52 H27 C20 50 16 42 18 36 Z" fill="url(#bv1)"/><path d="M26 42 L38 30 M38 42 L26 30" stroke="#ffd8b0" stroke-width="2" stroke-linecap="round" opacity="0.85"/></svg>'),
    bloodvial_eldra: svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="bv2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e84a68"/><stop offset="60%" stop-color="#8a122e"/><stop offset="100%" stop-color="#360612"/></linearGradient></defs><rect x="26" y="8" width="12" height="7" rx="2" fill="#d4a656" stroke="#755320" stroke-width="1.5"/><path d="M27 15 H37 L38 22 L48 34 C51 39 48 52 38 54 H26 C16 52 13 39 16 34 L26 22 Z" fill="#1b0d0e" stroke="#d4a656" stroke-width="2.2"/><path d="M18 36 C24 33 40 39 46 36 C48 42 44 50 37 52 H27 C20 50 16 42 18 36 Z" fill="url(#bv2)"/><path d="M32 30 L39 33 V39 C39 44 32 47 32 47 C32 47 25 44 25 39 V33 Z" fill="none" stroke="#ffd8b0" stroke-width="2" opacity="0.88"/></svg>'),
    bloodvial_rithva: svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="bv3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff5e7e"/><stop offset="60%" stop-color="#9e1435"/><stop offset="100%" stop-color="#3d0514"/></linearGradient></defs><rect x="26" y="8" width="12" height="7" rx="2" fill="#d4a656" stroke="#755320" stroke-width="1.5"/><path d="M27 15 H37 L38 22 L48 34 C51 39 48 52 38 54 H26 C16 52 13 39 16 34 L26 22 Z" fill="#1b0d0e" stroke="#d4a656" stroke-width="2.2"/><path d="M18 36 C24 33 40 39 46 36 C48 42 44 50 37 52 H27 C20 50 16 42 18 36 Z" fill="url(#bv3)"/><circle cx="32" cy="39" r="6" fill="none" stroke="#ffd8b0" stroke-width="2" opacity="0.9"/><polygon points="32,30 35,34 32,37 29,34" fill="#ffe8c7"/></svg>')
  };

  global.POE2_SEASON10_FORECAST = [
    {
      id: "crimson_iron",
      markKind: "forgemark",
      equipGroup: "weapon_quiver",
      maxItemLvl: 64,
      minModLvl: 1,
      suffixOnly: false,
      stackSize: 20,
      name: "腥红铁锭",
      name_tw: "腥紅鐵錠",
      name_us: "Crimson Iron",
      equipLabel: "武器 / 箭袋",
      equipLabel_tw: "武器 / 箭袋",
      equipLabel_us: "Weapon / Quiver",
      desc: "最高物品等级 64 · 稀有武器/箭袋：将自选任意 1 条词缀替换为 [Forgemark]",
      desc_tw: "最高物品等級 64 · 稀有武器/箭袋：將自選任意 1 條詞綴替換為 [Forgemark]",
      desc_us: "Max Item Level 64 · Rare Weapon/Quiver: Replace a chosen modifier with [Forgemark]",
      icon: S10_ICONS.crimson_iron
    },
    {
      id: "scarlet_hide",
      markKind: "forgemark",
      equipGroup: "armour_belt",
      maxItemLvl: 64,
      minModLvl: 1,
      suffixOnly: false,
      stackSize: 20,
      name: "鲜红皮革",
      name_tw: "鮮紅皮革",
      name_us: "Scarlet Hide",
      equipLabel: "护甲 / 腰带",
      equipLabel_tw: "護甲 / 腰帶",
      equipLabel_us: "Armour / Belt",
      desc: "最高物品等级 64 · 稀有护甲/腰带：将自选任意 1 条词缀替换为 [Forgemark]",
      desc_tw: "最高物品等級 64 · 稀有護甲/腰帶：將自選任意 1 條詞綴替換為 [Forgemark]",
      desc_us: "Max Item Level 64 · Rare Armour/Belt: Replace a chosen modifier with [Forgemark]",
      icon: S10_ICONS.scarlet_hide
    },
    {
      id: "vermilion_gold",
      markKind: "forgemark",
      equipGroup: "jewellery",
      maxItemLvl: 64,
      minModLvl: 1,
      suffixOnly: false,
      stackSize: 20,
      name: "朱红金锭",
      name_tw: "朱紅金錠",
      name_us: "Vermilion Gold",
      equipLabel: "项链 / 戒指",
      equipLabel_tw: "項鍊 / 戒指",
      equipLabel_us: "Amulet / Ring",
      desc: "最高物品等级 64 · 稀有项链/戒指：将自选任意 1 条词缀替换为 [Forgemark]",
      desc_tw: "最高物品等級 64 · 稀有項鍊/戒指：將自選任意 1 條詞綴替換為 [Forgemark]",
      desc_us: "Max Item Level 64 · Rare Amulet/Ring: Replace a chosen modifier with [Forgemark]",
      icon: S10_ICONS.vermilion_gold
    },
    {
      id: "bloodvial_komaki",
      markKind: "bloodmark",
      equipGroup: "weapon_quiver",
      maxItemLvl: 100,
      minModLvl: 65,
      suffixOnly: false,
      stackSize: 20,
      name: "科马凯的血瓶",
      name_tw: "科馬凱的血瓶",
      name_us: "Bloodvial of Komaki",
      equipLabel: "武器 / 箭袋",
      equipLabel_tw: "武器 / 箭袋",
      equipLabel_us: "Weapon / Quiver",
      desc: "最低词缀等级 65 · 稀有武器/箭袋：将自选任意 1 条词缀替换为 [Bloodmark]",
      desc_tw: "最低詞綴等級 65 · 稀有武器/箭袋：將自選任意 1 條詞綴替換為 [Bloodmark]",
      desc_us: "Min Mod Level 65 · Rare Weapon/Quiver: Replace a chosen modifier with [Bloodmark]",
      icon: S10_ICONS.bloodvial_komaki
    },
    {
      id: "bloodvial_eldra",
      markKind: "bloodmark",
      equipGroup: "armour_belt",
      maxItemLvl: 100,
      minModLvl: 65,
      suffixOnly: false,
      stackSize: 20,
      name: "艾尔德拉的血瓶",
      name_tw: "艾爾德拉的血瓶",
      name_us: "Bloodvial of Eldra",
      equipLabel: "护甲 / 腰带",
      equipLabel_tw: "護甲 / 腰帶",
      equipLabel_us: "Armour / Belt",
      desc: "最低词缀等级 65 · 稀有护甲/腰带：将自选任意 1 条词缀替换为 [Bloodmark]",
      desc_tw: "最低詞綴等級 65 · 稀有護甲/腰帶：將自選任意 1 條詞綴替換為 [Bloodmark]",
      desc_us: "Min Mod Level 65 · Rare Armour/Belt: Replace a chosen modifier with [Bloodmark]",
      icon: S10_ICONS.bloodvial_eldra
    },
    {
      id: "bloodvial_rithva",
      markKind: "bloodmark",
      equipGroup: "jewellery",
      maxItemLvl: 100,
      minModLvl: 65,
      suffixOnly: false,
      stackSize: 20,
      name: "瑞瑟瓦的血瓶",
      name_tw: "瑞瑟瓦的血瓶",
      name_us: "Bloodvial of Rithva",
      equipLabel: "项链 / 戒指",
      equipLabel_tw: "項鍊 / 戒指",
      equipLabel_us: "Amulet / Ring",
      desc: "最低词缀等级 65 · 稀有项链/戒指：将自选任意 1 条词缀替换为 [Bloodmark]",
      desc_tw: "最低詞綴等級 65 · 稀有項鍊/戒指：將自選任意 1 條詞綴替換為 [Bloodmark]",
      desc_us: "Min Mod Level 65 · Rare Amulet/Ring: Replace a chosen modifier with [Bloodmark]",
      icon: S10_ICONS.bloodvial_rithva
    }
  ];
})(window);
