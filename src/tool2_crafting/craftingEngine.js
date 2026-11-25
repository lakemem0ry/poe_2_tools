/**
 * 流放之路 2 (PoE2) 做装核心引擎
 * 支持三语词缀与日志、复合词缀相加合并、预兆、精华/合金、深渊渎灵、奥杜尔秘符、神庙通货与腐化机制
 */
(function (global) {
  "use strict";

  const CDN_IMG = "https://cdn.poe2db.tw/image/";
  const img = (p) => CDN_IMG + "Art/2DItems/Currency/" + p;
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const toMap = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

  const mkOrb = (id, name, name_tw, name_us, tier, minModLvl, icon, desc, desc_tw, desc_us) =>
    ({ id, name, name_tw, name_us, tier, minModLvl, icon: img(icon), desc, desc_tw, desc_us });

  const mkOmen = (id, name, name_tw, name_us, short, short_tw, short_us, group, excludes, icon) =>
    ({ id, name, name_tw, name_us, short, short_tw, short_us, group, excludes, icon: img("Omens/" + icon) });

  const mkBone = (id, name, name_tw, name_us, sub, sub_tw, sub_us, minModLvl, maxModLvl, icon) =>
    ({ id, name, name_tw, name_us, sub, sub_tw, sub_us, minModLvl, maxModLvl, icon: img("Abyss/" + icon) });

  const mkRune = (id, name, name_tw, name_us, kind, extra, allowedCategories, bondStat, bondStat_tw, bondStat_us, desc, desc_tw, desc_us, icon) =>
    ({ id, name, name_tw, name_us, kind, ...extra, allowedCategories, bondStat, bondStat_tw, bondStat_us, desc, desc_tw, desc_us, icon: img("Expedition2/" + icon) });

  const mkTemple = (id, name, name_tw, name_us, desc, desc_tw, desc_us, icon) =>
    ({ id, name, name_tw, name_us, desc, desc_tw, desc_us, icon: img("IncursionCraftingOrbs/" + icon) });

  const mkQual = (id, qualityType, name, name_tw, name_us, desc, desc_tw, desc_us, icon) =>
    ({ id, qualityType, name, name_tw, name_us, desc, desc_tw, desc_us, icon: img(icon) });

  // 1.0 赛季通货预测数据由 data/tool_data/tool2_crafting/season10_forecast.js 提供
  const SEASON10_CURRENCIES = global.POE2_SEASON10_FORECAST || [];

  const WEAPONS = ["单手武器", "双手武器"];
  const ALL_EQUIP = ["单手武器", "双手武器", "手套", "鞋子", "护甲", "头盔", "副手"];

  // 核心与阶梯通货
  const CURRENCIES = [
    mkOrb("transmute", "蜕变石", "蛻變石", "Orb of Transmutation", "", 1, "CurrencyUpgradeToMagic.webp", "普通 → 魔法（+1 随机词缀）", "普通 → 魔法（+1 隨機詞綴）", "Normal → Magic (+1 Mod)"),
    mkOrb("greater_transmute", "高级蜕变石", "高階蛻變石", "Greater Orb of Transmutation", "II", 44, "CurrencyUpgradeToMagic.webp", "普通 → 魔法（+1 词缀，最低 Lv44）", "普通 → 魔法（+1 詞綴，最低 Lv44）", "Normal → Magic (+1 Mod, Min Lv44)"),
    mkOrb("perfect_transmute", "完美蜕变石", "完美蛻變石", "Perfect Orb of Transmutation", "III", 70, "CurrencyUpgradeToMagic.webp", "普通 → 魔法（+1 词缀，最低 Lv70）", "普通 → 魔法（+1 詞綴，最低 Lv70）", "Normal → Magic (+1 Mod, Min Lv70)"),
    mkOrb("aug", "增幅石", "增幅石", "Orb of Augmentation", "", 1, "CurrencyAddModToMagic.webp", "魔法物品 +1 随机词缀", "魔法物品 +1 隨機詞綴", "Magic item +1 Mod"),
    mkOrb("greater_aug", "高级增幅石", "高階增幅石", "Greater Orb of Augmentation", "II", 44, "CurrencyAddModToMagic.webp", "魔法物品 +1 词缀（最低 Lv44）", "魔法物品 +1 詞綴（最低 Lv44）", "Magic item +1 Mod (Min Lv44)"),
    mkOrb("perfect_aug", "完美增幅石", "完美增幅石", "Perfect Orb of Augmentation", "III", 70, "CurrencyAddModToMagic.webp", "魔法物品 +1 词缀（最低 Lv70）", "魔法物品 +1 詞綴（最低 Lv70）", "Magic item +1 Mod (Min Lv70)"),
    mkOrb("regal", "富豪石", "富豪石", "Regal Orb", "", 1, "CurrencyUpgradeMagicToRare.webp", "魔法 → 稀有（+1 随机词缀）", "魔法 → 稀有（+1 隨機詞綴）", "Magic → Rare (+1 Mod)"),
    mkOrb("greater_regal", "高级富豪石", "高階富豪石", "Greater Regal Orb", "II", 35, "CurrencyUpgradeMagicToRare.webp", "魔法 → 稀有（+1 词缀，最低 Lv35）", "魔法 → 稀有（+1 詞綴，最低 Lv35）", "Magic → Rare (+1 Mod, Min Lv35)"),
    mkOrb("perfect_regal", "完美富豪石", "完美富豪石", "Perfect Regal Orb", "III", 50, "CurrencyUpgradeMagicToRare.webp", "魔法 → 稀有（+1 词缀，最低 Lv50）", "魔法 → 稀有（+1 詞綴，最低 Lv50）", "Magic → Rare (+1 Mod, Min Lv50)"),
    mkOrb("chaos", "混沌石", "混沌石", "Chaos Orb", "", 1, "CurrencyRerollRare.webp", "稀有物品移除 1 条并新增 1 条词缀", "稀有物品移除 1 條並新增 1 條詞綴", "Rare: Remove 1, Add 1 Mod"),
    mkOrb("greater_chaos", "高级混沌石", "高階混沌石", "Greater Chaos Orb", "II", 35, "CurrencyRerollRare.webp", "稀有移除 1 条并新增 1 条（最低 Lv35）", "稀有移除 1 條並新增 1 條（最低 Lv35）", "Rare: Remove 1, Add 1 (Min Lv35)"),
    mkOrb("perfect_chaos", "完美混沌石", "完美混沌石", "Perfect Chaos Orb", "III", 50, "CurrencyRerollRare.webp", "稀有移除 1 条并新增 1 条（最低 Lv50）", "稀有移除 1 條並新增 1 條（最低 Lv50）", "Rare: Remove 1, Add 1 (Min Lv50)"),
    mkOrb("exalt", "崇高石", "崇高石", "Exalted Orb", "", 1, "CurrencyAddModToRare.webp", "稀有物品 +1 随机词缀", "稀有物品 +1 隨機詞綴", "Rare item +1 Mod"),
    mkOrb("greater_exalt", "高级崇高石", "高階崇高石", "Greater Exalted Orb", "II", 35, "CurrencyAddModToRare.webp", "稀有物品 +1 词缀（最低 Lv35）", "稀有物品 +1 詞綴（最低 Lv35）", "Rare item +1 Mod (Min Lv35)"),
    mkOrb("perfect_exalt", "完美崇高石", "完美崇高石", "Perfect Exalted Orb", "III", 50, "CurrencyAddModToRare.webp", "稀有物品 +1 词缀（最低 Lv50）", "稀有物品 +1 詞綴（最低 Lv50）", "Rare item +1 Mod (Min Lv50)"),
    mkOrb("alc", "点金石", "點金石", "Orb of Alchemy", "", 1, "CurrencyUpgradeToRare.webp", "普通/魔法 → 4 词缀稀有", "普通/魔法 → 4 詞綴稀有", "Normal/Magic → 4-Mod Rare"),
    mkOrb("annul", "剥离石", "無效石", "Orb of Annulment", "", 1, "AnnullOrb.webp", "魔法/稀有物品移除 1 条随机词缀", "魔法/稀有物品移除 1 條隨機詞綴", "Remove 1 random mod"),
    mkOrb("divine", "神圣石", "神聖石", "Divine Orb", "", 1, "CurrencyModValues.webp", "重置所有词缀数值区间", "重置所有詞綴數值區間", "Reroll numeric values of modifiers"),
    mkOrb("fracture", "破溃宝珠", "破裂石", "Fracturing Orb", "", 1, "FracturingOrb.webp", "需 ≥4 词缀稀有，随机分裂锁定 1 条", "需 ≥4 詞綴稀有，隨機破裂鎖定 1 條", "Fracture 1 random mod (4+ mod Rare)"),
    mkOrb("artificer", "巧匠石", "巧匠石", "Artificer's Orb", "", 1, "CurrencyAddEquipmentSocket.webp", "为装备添加一个增幅器插槽（打孔）", "為裝備添加一個增幅器插槽（打孔）", "Adds an Augment Socket to equipment"),
    mkOrb("vaal", "瓦尔宝珠", "瓦爾寶珠", "Vaal Orb", "", 1, "CurrencyVaal.webp", "腐化物品（附魔/改词缀/有几率+1孔/改品质）", "腐化物品（附魔/改詞綴/有機率+1孔/改品質）", "Corrupt item (+1 Socket / Enchant / Reroll / Quality)")
  ];

  // 常规与深渊预兆
  const OMENS = [
    mkOmen("omen_greater_exaltation", "强效崇高预兆", "大幅提升之兆", "Omen of Greater Exaltation", "崇高石添加 2 条词缀", "崇高石添加 2 條詞綴", "Exalted adds 2 modifiers", "main", [], "VoodooOmens1Yellow.webp"),
    mkOmen("omen_sinistral_exaltation", "左旋崇高预兆", "左旋提升之兆", "Omen of Sinistral Exaltation", "崇高石只添加前缀", "崇高石只添加前綴", "Exalted adds prefix only", "main", ["omen_dextral_exaltation"], "VoodooOmens2Yellow.webp"),
    mkOmen("omen_dextral_exaltation", "右旋崇高预兆", "右旋提升之兆", "Omen of Dextral Exaltation", "崇高石只添加后缀", "崇高石只添加後綴", "Exalted adds suffix only", "main", ["omen_sinistral_exaltation"], "VoodooOmens3Yellow.webp"),
    mkOmen("omen_whittling", "消减预兆", "削切之兆", "Omen of Whittling", "混沌石移除最低等级词缀", "混沌石移除最低等級詞綴", "Chaos removes lowest iLvl mod", "main", [], "VoodooOmens1Dark.webp"),
    mkOmen("omen_sinistral_erasure", "左旋消抹预兆", "左旋抹除之兆", "Omen of Sinistral Erasure", "混沌石只移除前缀", "混沌石只移除前綴", "Chaos removes prefix only", "main", ["omen_dextral_erasure"], "VoodooOmens2Dark.webp"),
    mkOmen("omen_dextral_erasure", "右旋消抹预兆", "右旋抹除之兆", "Omen of Dextral Erasure", "混沌石只移除后缀", "混沌石只移除後綴", "Chaos removes suffix only", "main", ["omen_sinistral_erasure"], "VoodooOmens3Dark.webp"),
    mkOmen("omen_sinistral_annulment", "左旋剥离预兆", "左旋廢止之兆", "Omen of Sinistral Annulment", "剥离石只移除前缀", "無效石只移除前綴", "Annulment removes prefix only", "main", ["omen_dextral_annulment"], "VoodooOmens2Purple.webp"),
    mkOmen("omen_dextral_annulment", "右旋剥离预兆", "右旋廢止之兆", "Omen of Dextral Annulment", "剥离石只移除后缀", "無效石只移除後綴", "Annulment removes suffix only", "main", ["omen_sinistral_annulment"], "VoodooOmens3Purple.webp"),
    mkOmen("omen_sinistral_crystallisation", "左旋结晶预兆", "左旋結晶之兆", "Omen of Sinistral Crystallisation", "下个精华将移除一个前缀", "下個精髓將移除一個前綴", "Next Essence will remove a Prefix", "main", ["omen_dextral_crystallisation"], "OmenOnPerfectEssencePrefix.webp"),
    mkOmen("omen_dextral_crystallisation", "右旋结晶预兆", "右旋結晶之兆", "Omen of Dextral Crystallisation", "下个精华将移除一个后缀", "下個精髓將移除一個後綴", "Next Essence will remove a Suffix", "main", ["omen_sinistral_crystallisation"], "OmenOnPerfectEssenceSuffix.webp"),
    mkOmen("omen_blessing", "祝福预兆", "祝福之兆", "Omen of the Blessed", "神圣石只重置基底数值", "神聖石只重置基底數值", "Divine rerolls implicit only", "main", ["omen_sanctification"], "OmenOnDivineRerollImplicits.webp"),
    mkOmen("omen_sanctification", "神圣预兆", "聖化之兆", "Omen of Sanctification", "神圣石圣化稀有物品", "神聖石聖化稀有物品", "Divine sanctifies Rare item", "main", ["omen_blessing"], "OmenOnDivineSanctify.webp"),
    mkOmen("omen_corruption", "腐化预兆", "腐化之兆", "Omen of Corruption", "瓦尔宝珠必定造成变化", "瓦爾寶珠必定造成變化", "Vaal Orb guarantees change", "main", [], "VoodooOmens3Red.webp"),
    mkOmen("omen_light", "光明预兆", "光明之兆", "Omen of Light", "剥离石只移除渎灵词缀", "無效石只移除褻瀆詞綴", "Annulment removes Desecrated only", "desecrate", [], "OmenOnAnnulRemoveAbyssMod.webp"),
    mkOmen("omen_abyssal_echoes", "深渊回响预兆", "深淵迴響之兆", "Omen of Abyssal Echoes", "渎灵揭示可重骰 1 次", "褻瀆揭示可重骰 1 次", "Reroll Desecrated reveal once", "desecrate", [], "OmenOnAbyssRerollOptions.webp"),
    mkOmen("omen_sinistral_necromancy", "左旋死灵预兆", "左旋死靈術之兆", "Omen of Sinistral Necromancy", "渎灵只添加前缀", "褻瀆只添加前綴", "Desecrate adds prefix only", "desecrate", ["omen_dextral_necromancy"], "VoodooOmens2Purple.webp"),
    mkOmen("omen_dextral_necromancy", "右旋死灵预兆", "右旋死靈術之兆", "Omen of Dextral Necromancy", "渎灵只添加后缀", "褻瀆只添加後綴", "Desecrate adds suffix only", "desecrate", ["omen_sinistral_necromancy"], "VoodooOmens3Purple.webp"),
    mkOmen("omen_sovereign", "至高预兆", "領主之兆", "Omen of the Sovereign", "必出乌拉曼 (Ulaman) 词缀", "必出烏拉曼 (Ulaman) 詞綴", "Guarantees Ulaman mod", "desecrate", ["omen_liege", "omen_blackblooded"], "OmenOnAbyssGuarenteedLichTypeMod1.webp"),
    mkOmen("omen_liege", "领主预兆", "諸侯之兆", "Omen of the Liege", "必出阿曼娜姆 (Amanamu) 词缀", "必出阿曼娜姆 (Amanamu) 詞綴", "Guarantees Amanamu mod", "desecrate", ["omen_sovereign", "omen_blackblooded"], "OmenOnAbyssGuarenteedLichTypeMod1.webp"),
    mkOmen("omen_blackblooded", "黑血预兆", "黑血者之兆", "Omen of the Blackblooded", "必出古加尔 (Kurgal) 词缀", "必出古加爾 (Kurgal) 詞綴", "Guarantees Kurgal mod", "desecrate", ["omen_sovereign", "omen_liege"], "OmenOnAbyssGuarenteedLichTypeMod1.webp")
  ];

  // 深渊遗骨
  const ABYSS_BONES = [
    mkBone("bone_gnawed", "啮痕遗骨", "啃噬遺骨", "Gnawed Jawbone", "最高词缀等级 Lv64", "最高詞綴等級 Lv64", "Max mod level 64", 1, 64, "GnawedJawbone.webp"),
    mkBone("bone_preserved", "防腐遗骨", "防腐遺骨", "Preserved Jawbone", "全等级渎灵词缀", "全等級褻瀆詞綴", "All desecrated levels", 1, 100, "PreservedJawbone.webp"),
    mkBone("bone_ancient", "远古遗骨", "遠古遺骨", "Ancient Jawbone", "最低词缀等级 Lv40", "最低詞綴等級 Lv40", "Min mod level 40", 40, 100, "AncientJawbone.webp")
  ];

  // 奥杜尔秘符
  const ALDUR_RUNES = [
    mkRune("vorana_carnage", "沃拉娜的屠戮", "沃拉娜的殘殺", "Vorana's Carnage", "pool_unlock", { poolKey: "berserking" }, ["头盔"], "头盔：近战击中时获得 2 怒火", "頭盔：近戰擊中時獲得 2 怒火", "Helmet: Gain 2 Rage on Melee Hit", "镶嵌于头盔：解锁盛怒词缀池（berserking）", "鑲嵌於頭盔：解鎖盛怒詞綴池（berserking）", "Socket in Helmet: Unlocks Vorana's modifiers", "GameWarpRunePhysical.webp"),
    mkRune("medved_tending", "梅德维德的照料", "梅德偉的照料", "Medved's Tending", "pool_unlock", { poolKey: "soul" }, ["护甲"], "胸甲：生命上限提高 3%，魔力上限提高 3%", "胸甲：生命上限提高 3%，魔力上限提高 3%", "Body Armour: 3% increased Max Life & Mana", "镶嵌于胸甲：解锁灵魂词缀池（soul）", "鑲嵌於胸甲：解鎖靈魂詞綴池（soul）", "Socket in Body Armour: Unlocks Medved's modifiers", "GameWarpRuneCold.webp"),
    mkRune("uhtred_sidereus", "乌崔德的星辰", "烏特雷的星空", "Uhtred's Sidereus", "pool_unlock", { poolKey: "chronomancy" }, ["鞋子"], "鞋子：冷却回复速度提高 10%", "鞋子：冷卻回復速度提高 10%", "Boots: 10% increased Cooldown Recovery Rate", "镶嵌于鞋子：解锁塑时术师词缀池（chronomancy）", "鑲嵌於鞋子：解鎖塑時術師詞綴池（chronomancy）", "Socket in Boots: Unlocks Chronomancy modifiers", "GameWarpRuneTime.webp"),
    mkRune("katla_gloom", "卡塔拉的阴霾", "卡特拉的愁悵", "Katla's Gloom", "pool_unlock", { poolKey: "decay" }, ["手套"], "手套：受到的非伤害性异常状态效果降低 25%", "手套：受到的非傷害性異常狀態效果降低 25%", "Gloves: 25% reduced Effect of Non-Damaging Ailments on you", "镶嵌于手套：解锁腐蚀词缀池（decay）", "鑲嵌於手套：解鎖腐蝕詞綴池（decay）", "Socket in Gloves: Unlocks Katla's (Decay) modifiers", "GameWarpRuneChaos.webp"),
    mkRune("thrud_might", "斯鲁德的神力", "索魯德的強權", "Thrud's Might", "pool_unlock", { poolKey: "destruction" }, WEAPONS, "武器：所有元素抗性 +5%", "武器：所有元素抗性 +5%", "Weapon: +5% to all Elemental Resistances", "镶嵌于武器：解锁毁灭词缀池（destruction）", "鑲嵌於武器：解鎖毀滅詞綴池（destruction）", "Socket in Weapon: Unlocks Thrud's (Destruction) modifiers", "GameWarpRuneFire.webp"),
    mkRune("kolr_hunt", "克尔的狩猎", "克洛爾的狩獵", "Kolr's Hunt", "pool_unlock", { poolKey: "marksman" }, ["手套"], "手套：投射物伤害提高 20%", "手套：投射物傷害提高 20%", "Gloves: 20% increased Projectile Damage", "镶嵌于手套：解锁神射手词缀池（marksman）", "鑲嵌於手套：解鎖神射手詞綴池（marksman）", "Socket in Gloves: Unlocks Kolr's (Marksman) modifiers", "GameWarpRuneDex.webp"),
    mkRune("serle_triumph", "瑟尔的凯旋", "瑟雷的凱旋", "Serle's Triumph", "extra_suffix", {}, ALL_EQUIP, "允许的后缀上限 +1", "允許的後綴上限 +1", "+1 to Maximum Suffixes allowed", "镶嵌于装备：允许的后缀上限 +1", "鑲嵌於裝備：允許的後綴上限 +1", "Socketed: +1 maximum Suffixes allowed", "GameWarpRune2.webp"),
    mkRune("astrid_creativity", "阿斯特丽德的创造", "阿斯垂德的創造", "Astrid's Creativity", "extra_craft", {}, ALL_EQUIP, "可额外拥有 1 个工艺/奥杜尔词缀", "可額外擁有 1 個工藝/阿德爾詞綴", "Can have 1 additional Crafted modifier", "镶嵌于装备：可多容纳 1 个工艺前缀/总词缀", "鑲嵌於裝備：可多容納 1 個工藝詞綴", "Can have 1 additional Crafted modifier", "GameWarpRune1.webp"),
    mkRune("cadigan_epiphany", "卡迪甘的顿悟", "卡迪根的頓悟", "Cadigan's Epiphany", "jewel_socket", {}, ["手套"], "手套：将插槽转化为 1 个珠宝插槽", "手套：將插槽轉化為 1 個珠寶插槽", "Gloves: Converts Augment Sockets into a Jewel Socket", "手套专用：摧毁增幅器插槽并生成一个珠宝插槽", "手套專用：摧毀增幅器插槽並生成一個珠寶插槽", "Gloves: Destroys Augment Sockets for 1 Jewel Socket", "GameWarpRune3.webp"),
    mkRune("passion_aldur", "奥杜尔之热情", "阿德爾的熱情", "Passion of Aldur", "convert_elem", { targetElem: "fire" }, WEAPONS, "武器：火焰伤害提高 25%", "武器：火焰傷害提高 25%", "Weapon: 25% increased Fire Damage", "武器专用：将冰霜与闪电词缀转化为等值火焰词缀", "武器專用：將冰霜與閃電詞綴轉化為等值火焰詞綴", "Weapon: Converts Cold/Lightning mods to Fire", "ElementalConversionRuneFire.webp"),
    mkRune("breath_aldur", "奥杜尔之呼吸", "阿德爾的吐息", "Breath of Aldur", "convert_elem", { targetElem: "cold" }, WEAPONS, "武器：冰霜伤害提高 25%", "武器：冰霜傷害提高 25%", "Weapon: 25% increased Cold Damage", "武器专用：将火焰与闪电词缀转化为等值冰霜词缀", "武器專用：將火焰與閃電詞綴轉化為等值冰霜詞綴", "Weapon: Converts Fire/Lightning mods to Cold", "ElementalConversionRuneCold.webp"),
    mkRune("ire_aldur", "奥杜尔之忿怒", "阿德爾的聖怒", "Ire of Aldur", "convert_elem", { targetElem: "lightning" }, WEAPONS, "武器：闪电伤害提高 25%", "武器：閃電傷害提高 25%", "Weapon: 25% increased Lightning Damage", "武器专用：将火焰与冰霜词缀转化为等值闪电词缀", "武器專用：將火焰與冰霜詞綴轉化為等值閃電詞綴", "Weapon: Converts Fire/Cold mods to Lightning", "ElementalConversionRuneLightning.webp"),
    mkRune("betrayal_aldur", "奥杜尔之背叛", "阿德爾的背叛", "Betrayal of Aldur", "convert_elem", { targetElem: "chaos" }, WEAPONS, "武器：混沌伤害提高 25%", "武器：混沌傷害提高 25%", "Weapon: 25% increased Chaos Damage", "武器专用：将火焰/冰霜/闪电词缀转化为等值混沌词缀", "武器專用：將火焰/冰霜/閃電詞綴轉化為等值混沌詞綴", "Weapon: Converts Elemental mods to Chaos", "ElementalConversionRuneChaos.webp")
  ];

  // 阿兹里神庙通货
  const TEMPLE_CURRENCIES = [
    mkTemple("vaal_blacksmith_infuser", "瓦尔铁匠注能装置", "瓦爾鐵匠的灌注器", "Vaal Blacksmith's Infuser", "战斗武器品质提升至超上限最高 30%（有几率腐化）", "戰鬥武器品質提升至超上限最高 30%（有機率腐化）", "Martial Weapon quality up to 30% (chance to Corrupt)", "VaalBlacksmithsWhetstone.webp"),
    mkTemple("vaal_armourer_infuser", "瓦尔护甲师注能装置", "瓦爾護甲鍛造師的灌注器", "Vaal Armourer's Infuser", "护甲品质提升至超上限最高 30%（有几率腐化）", "護甲品質提升至超上限最高 30%（有機率腐化）", "Armour quality up to 30% (chance to Corrupt)", "VaakArmourersScrap.webp"),
    mkTemple("vaal_arcanist_infuser", "瓦尔秘术师注能装置", "瓦爾奧術師的灌注器", "Vaal Arcanist's Infuser", "法杖/长杖/权杖品质提升至超上限最高 30%（有几率腐化）", "法杖/長杖/權杖品質提升至超上限最高 30%（有機率腐化）", "Wand/Staff/Sceptre quality up to 30% (chance to Corrupt)", "VaalArcanistsEtcher.webp"),
    mkTemple("vaal_catalysing_infuser", "瓦尔催化注能装置", "瓦爾催化灌注器", "Vaal Catalysing Infuser", "戒指/项链品质提升至超上限最高 30%（有几率腐化）", "戒指/項鍊品質提升至超上限最高 30%（有機率腐化）", "Ring/Amulet quality up to 30% (chance to Corrupt)", "VaalCatalyst.webp"),
    mkTemple("yaomac_sacrifice", "约马克之献祭宝珠", "堯馬克奉獻寶珠", "Yaomac's Orb of Sacrifice", "稀有武器/箭袋：升级腐化附魔，同时移除 1 条随机词缀", "稀有武器/箭袋：升級腐化附魔，同時移除 1 條隨機詞綴", "Rare Weapon/Quiver: Upgrades Corrupted Enchant & removes 1 mod", "IncursionCorruptionOrb1.webp"),
    mkTemple("kopec_sacrifice", "科佩克之献祭宝珠", "科佩克奉獻寶珠", "Kopec's Orb of Sacrifice", "稀有护甲：升级腐化附魔，同时移除 1 条随机词缀", "稀有護甲：升級腐化附魔，同時移除 1 條隨機詞綴", "Rare Armour: Upgrades Corrupted Enchant & removes 1 mod", "IncursionCorruptionOrb2.webp"),
    mkTemple("kamasa_sacrifice", "卡马萨之献祭宝珠", "卡瑪薩奉獻寶珠", "Kamasa's Orb of Sacrifice", "稀有饰品/腰带：升级腐化附魔，同时移除 1 条随机词缀", "稀有飾品/腰帶：升級腐化附魔，同時移除 1 條隨機詞綴", "Rare Jewellery: Upgrades Corrupted Enchant & removes 1 mod", "IncursionCorruptionOrb3.webp"),
    mkTemple("yugul_sacrifice", "尤格尔之献祭宝珠", "伊果奉獻寶珠", "Yugul's Orb of Sacrifice", "稀有珠宝：升级腐化附魔，同时移除 1 条随机词缀", "稀有珠寶：升級腐化附魔，同時移除 1 條隨機詞綴", "Rare Jewel: Upgrades Corrupted Enchant & removes 1 mod", "IncursionCorruptionOrb4.webp"),
    mkTemple("architects_orb", "建筑师宝珠", "策匠石", "Architect's Orb", "对已腐化装备进行双重腐化（限使用 1 次，可+1孔/重塑/腐化附魔）", "對已腐化裝備進行雙重腐化（限使用 1 次，可+1孔/重塑/腐化附魔）", "Twice-Corrupts a Corrupted item once (socket / reforge / enchant)", "IncursionGreaterVaalOrb.webp"),
    mkTemple("vaal_siphoner", "瓦尔虹吸者", "瓦爾虹吸者", "Vaal Siphoner", "已腐化稀有饰品：吸取 1 条随机词缀，强化其余词缀数值", "已腐化稀有飾品：吸取 1 條隨機詞綴，強化其餘詞綴數值", "Corrupted Rare Jewellery: Siphons 1 mod, boosts remaining values", "IncursionVaalSiphoner.webp"),
    mkTemple("orb_of_extraction", "萃取石", "萃取石", "Orb of Extraction", "提取并清空装备上镶嵌的非绑定符文/增幅器", "提取並清空裝備上鑲嵌的非綁定符文/增幅器", "Extracts socketed non-bound Augments from equipment", "IncursionSocketableExtractorCurrency.webp")
  ];

  // 常规品质通货（按 qualityType 严格校验对象）
  const QUALITY_CURRENCIES = [
    mkQual("whetstone", "martial_weapon", "磨刀石", "磨刀石", "Blacksmith's Whetstone", "战斗武器品质 +5%（最高 20%）", "戰鬥武器品質 +5%（最高 20%）", "Martial Weapon quality +5% (max 20%)", "CurrencyWeaponQuality.webp"),
    mkQual("scrap", "armour", "护甲片", "護甲片", "Armourer's Scrap", "护甲/盾/头/手/鞋品质 +5%（最高 20%）", "護甲/盾/頭/手/鞋品質 +5%（最高 20%）", "Armour quality +5% (max 20%)", "CurrencyArmourQuality.webp"),
    mkQual("etcher", "caster_weapon", "奥术师的铭刻", "奧術蝕刻師", "Arcanist's Etcher", "法杖/长杖/权杖品质 +5%（最高 20%）", "法杖/長杖/權杖品質 +5%（最高 20%）", "Wand/Staff/Sceptre quality +5% (max 20%)", "CurrencyWeaponMagicQuality.webp"),
    mkQual("bauble", "flask", "玻璃弹珠", "玻璃彈珠", "Glassblower's Bauble", "药剂品质 +5%（最高 20%）", "藥劑品質 +5%（最高 20%）", "Flask quality +5% (max 20%)", "CurrencyFlaskQuality.webp")
  ];

  const EXTRA_POOL_LABELS = {
    breach_otherworldly: { cn: "异界裂隙", tw: "異界裂隙", us: "Otherworldly" },
    chronomancy: { cn: "乌崔德星辰", tw: "烏特雷星空", us: "Chronomancy" },
    marksman: { cn: "克尔狩猎", tw: "克洛爾狩獵", us: "Marksman" },
    decay: { cn: "卡塔拉阴霾", tw: "卡特拉愁悵", us: "Decay" },
    soul: { cn: "梅德维德照料", tw: "梅德偉照料", us: "Soul" },
    destruction: { cn: "斯鲁德神力", tw: "索魯德強權", us: "Destruction" },
    berserking: { cn: "沃拉娜屠戮", tw: "沃拉娜殘殺", us: "Berserking" },
    liquid: { cn: "液化情感", tw: "液態情感", us: "Liquid Emotions" }
  };

  const ALDUR_POOL_KEYS = new Set(["chronomancy", "marksman", "decay", "soul", "destruction", "berserking"]);
  const CURRENCY_MAP = toMap(CURRENCIES);
  const OMEN_MAP = toMap(OMENS);
  const BONE_MAP = toMap(ABYSS_BONES);
  const ALDUR_MAP = toMap(ALDUR_RUNES);
  const TEMPLE_MAP = toMap(TEMPLE_CURRENCIES);
  const QUALITY_MAP = toMap(QUALITY_CURRENCIES);
  const SEASON10_MAP = toMap(SEASON10_CURRENCIES);

  const QUALITY_TARGET_LABELS = {
    martial_weapon: { cn: "战斗武器", tw: "戰鬥武器", us: "Martial Weapons" },
    armour: { cn: "护甲/盾牌/头手鞋", tw: "護甲/盾牌/頭手鞋", us: "Armour" },
    caster_weapon: { cn: "法杖/长杖/权杖", tw: "法杖/長杖/權杖", us: "Wands/Staves/Sceptres" },
    flask: { cn: "药剂", tw: "藥劑", us: "Flasks" },
    catalyst: { cn: "戒指/项链", tw: "戒指/項鍊", us: "Rings/Amulets" }
  };

  const INFUSER_TARGET = {
    vaal_blacksmith_infuser: "martial_weapon",
    vaal_armourer_infuser: "armour",
    vaal_arcanist_infuser: "caster_weapon",
    vaal_catalysing_infuser: "catalyst"
  };

  let uidCounter = 1;
  const nextUid = () => "m_" + (uidCounter++);
  const loadingPromises = {};

  function loadCategory(slug) {
    global.POE2_CATEGORY_DATA = global.POE2_CATEGORY_DATA || {};
    if (global.POE2_CATEGORY_DATA[slug]) return Promise.resolve(global.POE2_CATEGORY_DATA[slug]);
    if (loadingPromises[slug]) return loadingPromises[slug];

    loadingPromises[slug] = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = global.PoE2SeasonManager ? global.PoE2SeasonManager.getCategoryScriptUrl(slug) : ("data/poe2db/current/equipment/categories/" + encodeURIComponent(slug) + ".js");
      script.async = true;
      script.onload = () => {
        if (global.POE2_CATEGORY_DATA[slug]) resolve(global.POE2_CATEGORY_DATA[slug]);
        else reject(new Error("Missing category payload: " + slug));
      };
      script.onerror = () => reject(new Error("Failed to load category: " + slug));
      document.head.appendChild(script);
    });
    return loadingPromises[slug];
  }

  function rollValue(minV, maxV, scale) {
    const s = typeof scale === "number" ? scale : 1;
    const isFloat = !Number.isInteger(minV) || !Number.isInteger(maxV);
    let raw = minV === maxV
      ? minV
      : isFloat
        ? Math.round((minV + Math.random() * (maxV - minV)) * 10) / 10
        : Math.floor(minV + Math.random() * (maxV - minV + 1));
    if (s !== 1) raw = isFloat ? Math.round(raw * s * 10) / 10 : Math.round(raw * s);
    return raw;
  }

  function formatLineText(tpl, values) {
    let idx = 0;
    return String(tpl || "")
      .replace(/\{#\}/g, () => String(idx < values.length ? values[idx++] : 0))
      .replace(/\+-(\d)/g, "-$1");
  }

  function resolveLang(lang) {
    if (lang === "cn" || lang === "tw" || lang === "us") return lang;
    if (typeof document !== "undefined" && document.documentElement.lang) {
      if (document.documentElement.lang === "en") return "us";
      if (document.documentElement.lang === "zh-TW") return "tw";
    }
    return "cn";
  }

  function L(lang, cn, tw, us) {
    const use = resolveLang(lang);
    return use === "tw" ? tw : use === "us" ? us : cn;
  }

  function pickObjField(obj, field, lang) {
    if (!obj) return "";
    const use = resolveLang(lang);
    if (use === "tw" && obj[field + "_tw"]) return obj[field + "_tw"];
    if (use === "us" && obj[field + "_us"]) return obj[field + "_us"];
    return obj[field] || "";
  }

  const pickLineTpl = (ln, lang) => pickObjField(ln, "tpl", lang);
  const pickModName = (mod, lang) => pickObjField(mod, "name", lang);

  function formatModTagName(mod, lang) {
    const use = resolveLang(lang);
    const ps = mod.gen === 1 ? (use === "us" ? "P" : "前") : mod.gen === 2 ? (use === "us" ? "S" : use === "tw" ? "後" : "后") : "E";
    let label = pickModName(mod, use);
    if (use !== "us" && /^[A-Za-z0-9_.\s'-]+$/.test(label) && mod.lines && mod.lines.length > 0) {
      label = formatLineText(pickLineTpl(mod.lines[0], use), mod.lines[0].values || []);
    }
    return `[${ps} T${mod.tier}] ${label}`;
  }

  function classifyEssence(poolName, mod) {
    if (!mod) return "normal";
    const en = String(mod.name_us || "");
    const cn = String(mod.name || "");
    if (poolName === "essence") {
      if (/^Lesser\b/i.test(en) || /^次级/.test(cn)) return "lesser";
      if (/^Greater\b/i.test(en) || /^强效/.test(cn)) return "greater";
      return "normal";
    }
    if (/^Perfect\b/i.test(en) || /^完美/.test(cn)) return "perfect";
    if (/\bAlloy$/i.test(en) || /合金/.test(cn)) return "alloy";
    return "special";
  }

  function matchesEssenceSearch(mod, query, lang) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return true;
    const norm = (s) => String(s || "").toLowerCase().replace(/精髓/g, "精华");
    const qNorm = norm(q);
    if ([mod.name, mod.name_tw, mod.name_us].some((n) => { const v = norm(n); return v.includes(qNorm) || v.includes(q); })) return true;
    const statLines = (mod.lines || []).map((l) => pickLineTpl(l, lang)).join(" ").toLowerCase();
    return norm(statLines).includes(qNorm) || statLines.includes(q);
  }

  function msgResult(ok, extra, renderFn, lang) {
    const fn = typeof renderFn === "function" ? renderFn : () => String(renderFn || "");
    return { ok, ...extra, renderMessage: fn, message: fn(resolveLang(lang)) };
  }

  const fail = (cn, tw, us, lang, extra) => msgResult(false, extra || {}, (l) => L(l, cn, tw, us), lang);
  const okRes = (item, usedOmens, fn, lang) => msgResult(true, { item, usedOmens: usedOmens || [] }, fn, lang);

  function instantiateMod(modDef, source, scale) {
    const s = typeof scale === "number" ? scale : 1;
    return {
      uid: nextUid(),
      id: modDef.id,
      gen: modDef.gen,
      name: modDef.name || "",
      name_tw: modDef.name_tw || modDef.name || "",
      name_us: modDef.name_us || modDef.name || "",
      lvl: modDef.lvl || 1,
      tier: modDef.tier || 1,
      w: modDef.w || 0,
      fam: modDef.fam ? [...modDef.fam] : [],
      tags: modDef.tags ? [...modDef.tags] : [],
      icon: modDef.icon || "",
      faction: modDef.faction || "",
      source: source || "normal",
      fractured: false,
      lines: (modDef.lines || []).map((ln) => ({
        tpl: ln.tpl,
        tpl_tw: ln.tpl_tw || ln.tpl,
        tpl_us: ln.tpl_us || ln.tpl,
        ranges: ln.ranges || [],
        values: (ln.ranges || []).map((r) => rollValue(r[0], r[1], s))
      }))
    };
  }

  const canSupportsQuality = (catData) => !!(catData && catData.canQuality && catData.qualityType && catData.qualityType !== "none");

  const RARE_P_CN = ["苍穹", "劫火", "噬魂", "星陨", "暮光", "幽冥", "碎星", "凛冬", "天罚", "深渊"];
  const RARE_S_CN = ["之翼", "之怒", "挽歌", "壁垒", "圣契", "统御", "裁决", "低语", "冠冕", "烙印"];
  const RARE_P_US = ["Miracle", "Vortex", "Dusk", "Doom", "Blight", "Rift", "Gale", "Foe", "Grim", "Soul"];
  const RARE_S_US = ["Wing", "Fury", "Song", "Bastion", "Edge", "Reign", "Verdict", "Whisper", "Crown", "Brand"];

  function generateRareName(lang) {
    return resolveLang(lang) === "us"
      ? pickRandom(RARE_P_US) + " " + pickRandom(RARE_S_US)
      : pickRandom(RARE_P_CN) + pickRandom(RARE_S_CN);
  }

  function createInitialItem(catData, baseIdx, ilvl, quality, lang) {
    const base = (catData.bases && catData.bases[baseIdx]) || catData.bases[0];
    return {
      slug: catData.slug,
      baseIdx: baseIdx || 0,
      baseName: base.name,
      ilvl: typeof ilvl === "number" ? ilvl : 84,
      quality: canSupportsQuality(catData) ? (typeof quality === "number" ? quality : 20) : 0,
      rarity: "normal",
      corrupted: false,
      doubleCorrupted: false,
      corruptSocketAdded: false,
      sanctified: false,
      sanctifyFactor: 1,
      markReforged: false,
      rareName: generateRareName(lang),
      sockets: 0,
      jewelSockets: 0,
      socketedRunes: [],
      implicits: (base.implicits || []).map((imp) => ({
        tpl: imp.tpl,
        tpl_tw: imp.tpl_tw || imp.tpl,
        tpl_us: imp.tpl_us || imp.tpl,
        ranges: imp.ranges || [],
        values: (imp.ranges || []).map((r) => rollValue(r[0], r[1], 1))
      })),
      corruptedEnchants: [],
      mods: []
    };
  }

  const cloneItem = (item) => (typeof structuredClone === "function" ? structuredClone(item) : JSON.parse(JSON.stringify(item)));

  function countAffixes(item) {
    let p = 0, s = 0;
    for (const m of item.mods) {
      if (m.gen === 1) p++;
      else if (m.gen === 2) s++;
    }
    return { p, s, total: p + s };
  }

  function getMaxSlots(catData, itemOrRarity) {
    const rarity = typeof itemOrRarity === "string" ? itemOrRarity : itemOrRarity.rarity;
    const item = typeof itemOrRarity === "object" ? itemOrRarity : null;
    if (rarity === "normal") return { maxP: 0, maxS: 0 };
    if (rarity === "magic") return { maxP: 1, maxS: 1 };
    const runes = (item && item.socketedRunes) || [];
    return {
      maxP: (catData.maxP || 3) + (runes.includes("astrid_creativity") ? 1 : 0),
      maxS: (catData.maxS || 3) + (runes.includes("serle_triumph") ? 1 : 0)
    };
  }

  function getSocketLimits(catData) {
    const normalMax = catData.baseSockets || 0;
    return { normalMax, corruptMax: normalMax > 0 ? Math.min(3, normalMax + 1) : 0 };
  }

  function getEligibleAldurRunes(catData) {
    if (!catData || (catData.baseSockets || 0) === 0) return [];
    return ALDUR_RUNES.filter((r) => r.allowedCategories.includes(catData.category));
  }

  function getActiveAldurPools(catData, item) {
    const active = [];
    for (const rId of (item.socketedRunes || [])) {
      const def = ALDUR_MAP[rId];
      if (def && def.kind === "pool_unlock" && catData.pools && catData.pools[def.poolKey]) {
        active.push(def.poolKey);
      }
    }
    return active;
  }

  function getBlockedFamilies(item) {
    const blocked = new Set();
    for (const m of item.mods) {
      for (const f of (m.fam || [])) blocked.add(f);
    }
    return blocked;
  }

  function getRollablePool(catData, item, primaryPoolName) {
    const basePool = (catData.pools && catData.pools[primaryPoolName]) || [];
    if (primaryPoolName !== "normal") return basePool;
    const aldurPools = getActiveAldurPools(catData, item);
    if (aldurPools.length === 0) return basePool;
    const combined = [...basePool];
    for (const pk of aldurPools) {
      for (const m of ((catData.pools && catData.pools[pk]) || [])) {
        combined.push({ ...m, w: Math.max(m.w || 0, 250), _poolSrc: pk });
      }
    }
    return combined;
  }

  function getEligibleMods(catData, item, poolName, opts) {
    const options = opts || {};
    const pool = options.includeAldur === false
      ? ((catData.pools && catData.pools[poolName]) || [])
      : getRollablePool(catData, item, poolName);
    const { maxP, maxS } = getMaxSlots(catData, { ...item, rarity: options.targetRarity || item.rarity });
    const counts = countAffixes(item);
    const blocked = getBlockedFamilies(item);
    const minLvl = options.minModLvl || 1;
    const maxLvl = options.maxModLvl || 100;
    const genOnly = options.genOnly || 0;
    const factionOnly = options.factionOnly || "";

    // 带有最低词缀等级要求的通货/物品，不可作用于物等低于该等级的物品
    if (minLvl > 1 && item.ilvl < minLvl) return [];

    const baseCandidates = pool.filter((mod) =>
      mod.lvl <= item.ilvl &&
      mod.lvl <= maxLvl &&
      (poolName !== "normal" || (mod.w || 0) > 0) &&
      (mod.gen === 1 || mod.gen === 2) &&
      (!genOnly || mod.gen === genOnly) &&
      !(mod.gen === 1 && counts.p >= maxP) &&
      !(mod.gen === 2 && counts.s >= maxS) &&
      !(mod.fam || []).some((f) => blocked.has(f)) &&
      (!factionOnly || mod.faction === factionOnly)
    );

    if (minLvl <= 1) return baseCandidates;

    // 按词缀类型（同族+同词条模版）分组：若存在 >= minLvl 的阶级则只留达标阶级；
    // 若该词缀类型最高阶（T1）仍低于 minLvl，则允许保留 T1（禁止 T2 及以下）
    const bySubType = new Map();
    for (const mod of baseCandidates) {
      const tplSig = (mod.lines || []).map((l) => l.tpl).join(" / ");
      const key = `${mod.gen}|${(mod.fam && mod.fam[0]) || mod.id}|${tplSig}`;
      if (!bySubType.has(key)) bySubType.set(key, []);
      bySubType.get(key).push(mod);
    }

    const filtered = [];
    for (const group of bySubType.values()) {
      const aboveMin = group.filter((m) => m.lvl >= minLvl);
      if (aboveMin.length > 0) {
        filtered.push(...aboveMin);
      } else {
        const bestTier = Math.min(...group.map((m) => m.tier || 999));
        const maxGroupLvl = Math.max(...group.map((m) => m.lvl));
        for (const m of group) {
          if ((m.tier || 999) === bestTier && m.lvl === maxGroupLvl) filtered.push(m);
        }
      }
    }
    return filtered;
  }

  function rollWeighted(mods) {
    if (!mods || mods.length === 0) return null;
    let totalW = 0;
    for (const m of mods) totalW += Math.max(1, m.w || 1);
    let r = Math.random() * totalW;
    for (const m of mods) {
      r -= Math.max(1, m.w || 1);
      if (r <= 0) return m;
    }
    return mods[mods.length - 1];
  }

  // 左/右旋定向移除预兆通用过滤（混沌/剥离/完美精华共用）
  function filterByDirectionalOmen(removable, omens, usedOmens, sinId, dexId, lang) {
    if (omens.has(sinId)) {
      const pre = removable.filter((m) => m.gen === 1);
      if (pre.length === 0) {
        const oDef = OMEN_MAP[sinId];
        return {
          ok: false,
          res: msgResult(false, {}, (l) => L(l,
            `${pickObjField(oDef, "name", l)}生效中，但没有可移除的前缀。`,
            `${pickObjField(oDef, "name", l)}生效中，但沒有可移除的前綴。`,
            `${pickObjField(oDef, "name", l)} active, but no removable Prefix found.`
          ), lang)
        };
      }
      usedOmens.push(sinId);
      return { ok: true, list: pre };
    }
    if (omens.has(dexId)) {
      const suf = removable.filter((m) => m.gen === 2);
      if (suf.length === 0) {
        const oDef = OMEN_MAP[dexId];
        return {
          ok: false,
          res: msgResult(false, {}, (l) => L(l,
            `${pickObjField(oDef, "name", l)}生效中，但没有可移除的后缀。`,
            `${pickObjField(oDef, "name", l)}生效中，但沒有可移除的後綴。`,
            `${pickObjField(oDef, "name", l)} active, but no removable Suffix found.`
          ), lang)
        };
      }
      usedOmens.push(dexId);
      return { ok: true, list: suf };
    }
    return { ok: true, list: removable };
  }

  const canonicalTplKey = (tpl) => String(tpl || "").replace(/、/g, "，").replace(/和/g, "与").replace(/\s+/g, " ").trim();

  // 复合词缀拆行并与同类相加合并
  function aggregateItemStats(catData, item, lang) {
    const useLang = lang || "cn";
    const prefixes = item.mods.filter((m) => m.gen === 1);
    const suffixes = item.mods.filter((m) => m.gen === 2);
    const others = item.mods.filter((m) => m.gen !== 1 && m.gen !== 2);
    const orderedSlots = [
      ...prefixes.map((mod, i) => ({ mod, slotLabel: "P" + (i + 1) })),
      ...suffixes.map((mod, i) => ({ mod, slotLabel: "S" + (i + 1) })),
      ...others.map((mod) => ({ mod, slotLabel: "E" }))
    ];

    const mergedMap = new Map();
    const mergedList = [];

    for (const { mod, slotLabel } of orderedSlots) {
      const isComposite = (mod.lines || []).length > 1;
      const isEss = mod.source === "essence" || mod.source === "perfect_essence";
      const isAldur = ALDUR_POOL_KEYS.has(mod.source);
      const markType = mod.markType || "";
      for (const ln of (mod.lines || [])) {
        const canon = canonicalTplKey(ln.tpl);
        const key = markType ? `mark::${mod.uid}` : `${canon}::${ln.values ? ln.values.length : 0}`;
        const displayTpl = pickLineTpl(ln, useLang);
        const contributor = {
          uid: mod.uid,
          slotLabel,
          modName: pickModName(mod, useLang),
          tier: mod.tier,
          isComposite,
          text: formatLineText(displayTpl, ln.values || []),
          values: [...(ln.values || [])]
        };

        const existing = mergedMap.get(key);
        if (!existing) {
          const entry = {
            key,
            tpl: ln.tpl,
            displayTpl,
            canon,
            values: [...(ln.values || [])],
            isCompositePart: isComposite,
            hasFractured: mod.fractured,
            hasDesecrated: mod.source === "desecrated",
            hasEssence: isEss,
            hasAldur: isAldur,
            markType,
            contributors: [contributor]
          };
          mergedMap.set(key, entry);
          mergedList.push(entry);
        } else {
          for (let i = 0; i < existing.values.length; i++) {
            existing.values[i] = Math.round((existing.values[i] + (ln.values[i] || 0)) * 100) / 100;
          }
          existing.isCompositePart = existing.isCompositePart || isComposite;
          existing.hasFractured = existing.hasFractured || mod.fractured;
          existing.hasDesecrated = existing.hasDesecrated || mod.source === "desecrated";
          existing.hasEssence = existing.hasEssence || isEss;
          existing.hasAldur = existing.hasAldur || isAldur;
          existing.contributors.push(contributor);
        }
      }
    }

    for (const entry of mergedList) {
      entry.text = formatLineText(entry.displayTpl, entry.values);
      entry.isMerged = entry.contributors.length > 1;
    }
    return { mergedList, prefixes, suffixes, others };
  }

  function computeItemProperties(catData, item, mergedList, lang) {
    const useLang = lang || "cn";
    const base = (catData.bases && catData.bases[item.baseIdx]) || catData.bases[0];
    const qMult = 1 + (item.quality || 0) / 100;
    const rawProps = base.props || [];
    const sumByCanon = Object.fromEntries(mergedList.map((m) => [m.canon, m.values]));
    const val1 = (c) => (sumByCanon[c] && sumByCanon[c][0]) || 0;
    const valPair = (c) => sumByCanon[c] || [0, 0];
    const lbl = (cn, tw, us) => L(useLang, cn, tw, us);
    const propLbl = (p) => pickObjField(p, "label", useLang);

    const computedLines = [];
    let summaryStrip = null;

    if (catData.qualityType === "martial_weapon") {
      let basePhys = null, baseAps = 1.2, baseCrit = 5;
      const extraBaseProps = [];
      for (const p of rawProps) {
        if (p.label === "物理伤害") {
          const mm = p.val.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
          if (mm) basePhys = [parseFloat(mm[1]), parseFloat(mm[2])];
        } else if (p.label === "每秒攻击次数") baseAps = parseFloat(p.val) || 1.2;
        else if (p.label === "暴击率") baseCrit = parseFloat(p.val) || 5;
        else extraBaseProps.push(p);
      }

      const flatPhys = valPair("附加 {#} - {#} 物理伤害");
      const physInc = val1("物理伤害提高 {#}%");
      const iasInc = val1("攻击速度提高 {#}%") - val1("攻击速度降低 {#}%");
      const critFlat = val1("暴击几率 +{#}%");
      const critInc = val1("暴击率提高 {#}%");
      const finalAps = Math.round(baseAps * (1 + iasInc / 100) * 100) / 100;
      const finalCrit = Math.round((baseCrit + critFlat) * (1 + critInc / 100) * 100) / 100;

      let pdps = 0;
      if (basePhys) {
        const minP = Math.round((basePhys[0] + flatPhys[0]) * (1 + physInc / 100) * qMult);
        const maxP = Math.round((basePhys[1] + flatPhys[1]) * (1 + physInc / 100) * qMult);
        pdps = ((minP + maxP) / 2) * finalAps;
        computedLines.push({ label: lbl("物理伤害", "物理傷害", "Physical Damage"), val: `${minP}-${maxP}`, augmented: flatPhys[0] > 0 || physInc !== 0 || item.quality > 0 });
      }

      let edps = 0;
      for (const [elLbl, rng] of [
        [lbl("火焰伤害", "火焰傷害", "Fire Damage"), valPair("附加 {#} - {#} 火焰伤害")],
        [lbl("冰霜伤害", "冰霜傷害", "Cold Damage"), valPair("附加 {#} - {#} 冰霜伤害")],
        [lbl("闪电伤害", "閃電傷害", "Lightning Damage"), valPair("附加 {#} - {#} 闪电伤害")],
        [lbl("混沌伤害", "混沌傷害", "Chaos Damage"), valPair("该装备附加 {#} - {#} 基础混沌伤害")]
      ]) {
        if (rng[0] > 0 || rng[1] > 0) {
          edps += ((rng[0] + rng[1]) / 2) * finalAps;
          computedLines.push({ label: elLbl, val: `${rng[0]}-${rng[1]}`, augmented: true });
        }
      }
      for (const ep of extraBaseProps) computedLines.push({ label: propLbl(ep), val: ep.val, augmented: false });
      computedLines.push({ label: lbl("暴击率", "暴擊率", "Critical Hit Chance"), val: `${finalCrit}%`, augmented: critFlat !== 0 || critInc !== 0 });
      computedLines.push({ label: lbl("每秒攻击次数", "每秒攻擊次數", "Attacks per Second"), val: `${finalAps}`, augmented: iasInc !== 0 });

      summaryStrip = {
        pdps: Math.round(pdps * 10) / 10,
        edps: Math.round(edps * 10) / 10,
        tdps: Math.round((pdps + edps) * 10) / 10
      };
    } else if (catData.qualityType === "armour") {
      const baseDef = { 护甲: 0, 闪避值: 0, 能量护盾: 0, 符文结界: 0 };
      const otherProps = [];
      for (const p of rawProps) {
        if (p.label in baseDef) baseDef[p.label] = parseFloat(p.val) || 0;
        else otherProps.push(p);
      }
      const incAll = val1("护甲，闪避与能量护盾提高 {#}%");
      const incAE = val1("护甲与闪避提高 {#}%");
      const incAS = val1("护甲与能量护盾提高 {#}%");
      const incES = val1("闪避与能量护盾提高 {#}%");

      const defs = [
        [baseDef["护甲"], val1("+{#} 护甲"), val1("护甲提高 {#}%") + incAE + incAS + incAll, lbl("护甲", "護甲", "Armour")],
        [baseDef["闪避值"], val1("+{#} 点闪避值"), val1("闪避值提高 {#}%") + incAE + incES + incAll, lbl("闪避值", "閃避值", "Evasion Rating")],
        [baseDef["能量护盾"], val1("+{#} 能量护盾上限"), val1("能量护盾提高 {#}%") + incAS + incES + incAll, lbl("能量护盾", "能量護盾", "Energy Shield")],
        [baseDef["符文结界"], val1("+{#} 符文结界上限"), val1("符文结界提高 {#}%"), lbl("符文结界", "符文結界", "Ward")]
      ];
      for (const [bVal, flat, inc, label] of defs) {
        if (bVal > 0 || flat > 0) {
          computedLines.push({ label, val: String(Math.round((bVal + flat) * (1 + inc / 100) * qMult)), augmented: flat > 0 || inc !== 0 || item.quality > 0 });
        }
      }
      for (const op of otherProps) computedLines.push({ label: propLbl(op), val: op.val, augmented: false });
    } else {
      for (const p of rawProps) computedLines.push({ label: propLbl(p), val: p.val, augmented: false });
    }

    return { computedLines, summaryStrip };
  }

  function punchSocket(catData, currentItem, lang) {
    if (currentItem.corrupted) return fail("物品已腐化，无法使用巧匠石打孔。", "物品已腐化，無法使用巧匠石打孔。", "Item is Corrupted; cannot add sockets with Artificer's Orb.", lang);
    const { normalMax } = getSocketLimits(catData);
    if (normalMax === 0) return fail("该类型物品无法打孔。", "該類型物品無法打孔。", "This item class cannot have sockets.", lang);
    if ((currentItem.sockets || 0) >= normalMax) {
      return fail(
        `已达到常规插槽上限 (${normalMax} 孔)，需通过腐化（+1 孔）突破上限。`,
        `已達到常規插槽上限 (${normalMax} 孔)，需透過腐化（+1 孔）突破上限。`,
        `Reached normal socket limit (${normalMax}); only Corruption (+1 Socket) can exceed it.`,
        lang
      );
    }
    const item = cloneItem(currentItem);
    item.sockets = (item.sockets || 0) + 1;
    const def = CURRENCY_MAP.artificer;
    return okRes(item, [], (l) => L(l,
      `使用 ${pickObjField(def, "name", l)}：装备插槽增加至 ${item.sockets} 孔`,
      `使用 ${pickObjField(def, "name", l)}：裝備插槽增加至 ${item.sockets} 孔`,
      `Used ${pickObjField(def, "name", l)}: Sockets increased to ${item.sockets}`
    ), lang);
  }

  function clearSockets(currentItem, lang) {
    const item = cloneItem(currentItem);
    item.socketedRunes = [];
    item.jewelSockets = 0;
    return okRes(item, [], (l) => L(l, "已清空所有镶嵌符文", "已清空所有鑲嵌符文", "Cleared all socketed runes"), lang);
  }

  function applyAldurRune(catData, currentItem, runeId, isToggle, lang) {
    const def = ALDUR_MAP[runeId];
    if (!def) return fail("未知奥杜尔道具。", "未知阿德爾道具。", "Unknown Aldur Rune.", lang);
    if (!def.allowedCategories.includes(catData.category)) {
      return msgResult(false, {}, (l) => L(l,
        `「${pickObjField(def, "name", l)}」无法用于当前分类（${pickObjField(catData, "label", l)}）。`,
        `「${pickObjField(def, "name", l)}」無法用於當前分類（${pickObjField(catData, "label", l)}）。`,
        `"${pickObjField(def, "name", l)}" cannot be used on ${pickObjField(catData, "label", l)}.`
      ), lang);
    }

    const item = cloneItem(currentItem);
    const socketed = item.socketedRunes || [];

    if (isToggle && socketed.includes(runeId)) {
      item.socketedRunes = socketed.filter((id) => id !== runeId);
      return okRes(item, [], (l) => L(l, `已取消镶嵌：${pickObjField(def, "name", l)}`, `已取消鑲嵌：${pickObjField(def, "name", l)}`, `Removed socketed rune: ${pickObjField(def, "name", l)}`), lang);
    }

    if (def.kind === "jewel_socket") {
      if ((item.sockets || 0) === 0) return fail("请先为手套打孔。", "請先為手套打孔。", "Add a socket to Gloves first.", lang);
      item.sockets = 0;
      item.socketedRunes = [runeId];
      item.jewelSockets = 1;
      return okRes(item, [], (l) => L(l,
        `使用 ${pickObjField(def, "name", l)}：摧毁增幅器插槽并生成 1 个珠宝插槽`,
        `使用 ${pickObjField(def, "name", l)}：摧毀增幅器插槽並生成 1 個珠寶插槽`,
        `Used ${pickObjField(def, "name", l)}: Converted Augment Sockets into 1 Jewel Socket`
      ), lang);
    }

    if ((item.sockets || 0) === 0) {
      return msgResult(false, {}, (l) => L(l,
        `「${pickObjField(def, "name", l)}」需要装备先拥有至少 1 个空插槽，请点击「打孔」。`,
        `「${pickObjField(def, "name", l)}」需要裝備先擁有至少 1 個空插槽，請點擊「打孔」。`,
        `"${pickObjField(def, "name", l)}" requires at least 1 empty socket.`
      ), lang);
    }
    if (socketed.includes(runeId)) {
      return msgResult(false, {}, (l) => L(l, `「${pickObjField(def, "name", l)}」已镶嵌（限 1 个）。`, `「${pickObjField(def, "name", l)}」已鑲嵌（限 1 個）。`, `"${pickObjField(def, "name", l)}" is already socketed (limit 1).`), lang);
    }
    if (socketed.length >= item.sockets) {
      return fail(
        `插槽已满 (${socketed.length}/${item.sockets})。请先打孔或卸下现有符文。`,
        `插槽已滿 (${socketed.length}/${item.sockets})。請先打孔或卸下現有符文。`,
        `Sockets full (${socketed.length}/${item.sockets}). Add a socket or remove an existing rune.`,
        lang
      );
    }

    if (def.kind === "convert_elem") {
      const elemMap = {
        fire: { cn: "火焰", tw: "火焰", us: "Fire" },
        cold: { cn: "冰霜", tw: "冰霜", us: "Cold" },
        lightning: { cn: "闪电", tw: "閃電", us: "Lightning" },
        chaos: { cn: "混沌", tw: "混沌", us: "Chaos" }
      };
      const tgt = elemMap[def.targetElem];
      let convertedCount = 0;
      for (const m of item.mods) {
        for (const ln of m.lines) {
          let replaced = false;
          for (const [k, names] of Object.entries(elemMap)) {
            if (k === def.targetElem || (def.targetElem !== "chaos" && k === "chaos")) continue;
            if (ln.tpl.includes(names.cn)) {
              ln.tpl = ln.tpl.split(names.cn).join(tgt.cn);
              ln.tpl_tw = (ln.tpl_tw || ln.tpl).split(names.tw).join(tgt.tw);
              ln.tpl_us = (ln.tpl_us || "").split(names.us).join(tgt.us);
              replaced = true;
            }
          }
          if (replaced) convertedCount++;
        }
      }
      item.socketedRunes = [...socketed, runeId];
      return okRes(item, [], (l) => L(l,
        `镶嵌 ${pickObjField(def, "name", l)}：已将 ${convertedCount} 条元素词缀转化为 ${tgt[resolveLang(l)]}`,
        `鑲嵌 ${pickObjField(def, "name", l)}：已將 ${convertedCount} 條元素詞綴轉化為 ${tgt[resolveLang(l)]}`,
        `Socketed ${pickObjField(def, "name", l)}: Converted ${convertedCount} elemental mod(s) to ${tgt.us}`
      ), lang);
    }

    item.socketedRunes = [...socketed, runeId];
    return okRes(item, [], (l) => L(l,
      `已镶嵌 ${pickObjField(def, "name", l)}（${pickObjField(def, "desc", l)}）`,
      `已鑲嵌 ${pickObjField(def, "name", l)}（${pickObjField(def, "desc", l)}）`,
      `Socketed ${pickObjField(def, "name", l)} (${pickObjField(def, "desc", l)})`
    ), lang);
  }

  function applyQualityCurrency(catData, currentItem, qualityId, lang) {
    const def = QUALITY_MAP[qualityId];
    if (!def) return fail("未知品质通货。", "未知品質通貨。", "Unknown quality currency.", lang);
    if (currentItem.corrupted) return fail("物品已腐化，无法使用常规品质通货。", "物品已腐化，無法使用常規品質通貨。", "Item is Corrupted; cannot use regular quality currency.", lang);
    if (!canSupportsQuality(catData)) return fail("该类型物品不支持提升品质。", "該類型物品不支援提升品質。", "This item class does not support Quality.", lang);
    if (catData.qualityType !== def.qualityType) {
      return msgResult(false, {}, (l) => {
        const ul = resolveLang(l);
        const tgtName = (QUALITY_TARGET_LABELS[def.qualityType] && QUALITY_TARGET_LABELS[def.qualityType][ul]) || def.qualityType;
        return L(ul, `${pickObjField(def, "name", ul)} 只能对「${tgtName}」使用。`, `${pickObjField(def, "name", ul)} 只能對「${tgtName}」使用。`, `${pickObjField(def, "name", ul)} can only be used on ${tgtName}.`);
      }, lang);
    }
    if ((currentItem.quality || 0) >= 20) return fail("物品品质已达常规上限 +20%（更高品质需使用神庙注能装置）。", "物品品質已達常規上限 +20%（更高品質需使用神廟灌注器）。", "Item Quality is already at normal cap (+20%). Use a Temple Infuser for higher Quality.", lang);

    const item = cloneItem(currentItem);
    item.quality = Math.min(20, (item.quality || 0) + 5);
    return okRes(item, [], (l) => L(l,
      `使用 ${pickObjField(def, "name", l)}：品质提升至 +${item.quality}%`,
      `使用 ${pickObjField(def, "name", l)}：品質提升至 +${item.quality}%`,
      `Used ${pickObjField(def, "name", l)}: Quality increased to +${item.quality}%`
    ), lang);
  }

  function applyTempleCurrency(catData, currentItem, templeId, lang) {
    const def = TEMPLE_MAP[templeId];
    if (!def) return fail("未知神庙通货。", "未知神廟通貨。", "Unknown Temple currency.", lang);
    const item = cloneItem(currentItem);

    // 1. 注能装置
    if (templeId in INFUSER_TARGET) {
      if (item.corrupted) return fail("物品已腐化，无法使用注能装置。", "物品已腐化，無法使用灌注器。", "Item is Corrupted; cannot use Infuser.", lang);
      if (!canSupportsQuality(catData)) return fail("该类型物品不支持品质。", "該類型物品不支援品質。", "This item class does not support Quality.", lang);
      const reqType = INFUSER_TARGET[templeId];
      if (catData.qualityType !== reqType) {
        return msgResult(false, {}, (l) => {
          const ul = resolveLang(l);
          const tgt = QUALITY_TARGET_LABELS[reqType][ul];
          return L(ul, `${pickObjField(def, "name", ul)} 仅限「${tgt}」使用。`, `${pickObjField(def, "name", ul)} 僅限「${tgt}」使用。`, `${pickObjField(def, "name", ul)} can only be used on ${tgt}.`);
        }, lang);
      }
      if ((item.quality || 0) >= 30) return fail("物品品质已达最高上限 +30%。", "物品品質已達最高上限 +30%。", "Item Quality is already at max cap (+30%).", lang);
      item.quality = Math.min(30, (item.quality || 0) + 1 + Math.floor(Math.random() * 5));
      const didCorrupt = Math.random() < 0.35;
      if (didCorrupt) item.corrupted = true;
      return okRes(item, [], (l) => L(l,
        `使用 ${pickObjField(def, "name", l)}：品质提升至 +${item.quality}%${didCorrupt ? "（触发腐化！）" : ""}`,
        `使用 ${pickObjField(def, "name", l)}：品質提升至 +${item.quality}%${didCorrupt ? "（觸發腐化！）" : ""}`,
        `Used ${pickObjField(def, "name", l)}: Quality +${item.quality}%${didCorrupt ? " (Corrupted!)" : ""}`
      ), lang);
    }

    // 2. 献祭宝珠
    if (templeId.endsWith("_sacrifice")) {
      if (item.corrupted) return fail("物品已腐化。", "物品已腐化。", "Item is already Corrupted.", lang);
      if (item.rarity !== "rare") return fail("献祭宝珠只能用于稀有物品。", "奉獻寶珠只能用於稀有物品。", "Sacrifice Orbs can only be used on Rare items.", lang);
      const upgPool = (catData.pools && (catData.pools.corruption_upgrade || catData.pools.corrupted)) || [];
      if (upgPool.length === 0) return fail("当前分类没有可用的升级腐化附魔池。", "當前分類沒有可用的升級腐化附魔池。", "No upgraded corrupted enchant pool for this item class.", lang);

      const removable = item.mods.filter((m) => !m.fractured && !m.markType);
      const victim = removable.length > 0 ? pickRandom(removable) : null;
      if (victim) item.mods = item.mods.filter((m) => m.uid !== victim.uid);
      item.corruptedEnchants = [instantiateMod(pickRandom(upgPool), "corrupted")];
      return okRes(item, [], (l) => L(l,
        `使用 ${pickObjField(def, "name", l)}：${victim ? `移除 ${formatModTagName(victim, l)}，` : ""}获得升级腐化附魔`,
        `使用 ${pickObjField(def, "name", l)}：${victim ? `移除 ${formatModTagName(victim, l)}，` : ""}獲得升級腐化附魔`,
        `Used ${pickObjField(def, "name", l)}: ${victim ? `Removed ${formatModTagName(victim, l)}, ` : ""}Granted upgraded Corrupted Enchant`
      ), lang);
    }

    // 3. 建筑师宝珠（单次双重腐化）
    if (templeId === "architects_orb") {
      if (!item.corrupted) return fail("建筑师宝珠只能对「已腐化」的装备或珠宝使用。", "策匠石只能對「已腐化」的裝備或珠寶使用。", "Architect's Orb can only be used on Corrupted items.", lang);
      if (item.doubleCorrupted) return fail("物品已完成双重腐化，建筑师宝珠只能对已腐化物品使用一次。", "物品已完成雙重腐化，策匠石只能對已腐化物品使用一次。", "Item is already Twice-Corrupted; Architect's Orb can only be used once.", lang);

      item.doubleCorrupted = true;
      const { corruptMax } = getSocketLimits(catData);
      const roll = Math.random();
      if (corruptMax > 0 && !item.corruptSocketAdded && (item.sockets || 0) < corruptMax && roll < 0.35) {
        item.sockets = (item.sockets || 0) + 1;
        item.corruptSocketAdded = true;
        return okRes(item, [], (l) => L(l,
          `使用 ${pickObjField(def, "name", l)}：双重腐化触发插槽 +1（当前 ${item.sockets} 孔）！`,
          `使用 ${pickObjField(def, "name", l)}：雙重腐化觸發插槽 +1（當前 ${item.sockets} 孔）！`,
          `Used ${pickObjField(def, "name", l)}: Twice-Corrupted (+1 Socket, now ${item.sockets})!`
        ), lang);
      }
      if (roll < 0.7 && catData.pools && catData.pools.normal) {
        const removable = item.mods.filter((m) => !m.fractured && !m.markType);
        if (removable.length > 0) {
          const victim = pickRandom(removable);
          item.mods = item.mods.filter((m) => m.uid !== victim.uid);
        }
        const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: item.rarity === "normal" ? "rare" : item.rarity }));
        if (picked) {
          if (item.rarity === "normal") { item.rarity = "rare"; item.rareName = generateRareName(lang); }
          item.mods.push(instantiateMod(picked, "normal"));
        }
        return okRes(item, [], (l) => L(l, `使用 ${pickObjField(def, "name", l)}：双重腐化并重塑了词缀。`, `使用 ${pickObjField(def, "name", l)}：雙重腐化並重塑了詞綴。`, `Used ${pickObjField(def, "name", l)}: Twice-Corrupted and reforged modifiers.`), lang);
      }
      const corrPool = (catData.pools && catData.pools.corrupted) || [];
      if (corrPool.length > 0) {
        const existingIds = new Set((item.corruptedEnchants || []).map((ce) => ce.id));
        const unused = corrPool.filter((c) => !existingIds.has(c.id));
        const inst = instantiateMod(pickRandom(unused.length > 0 ? unused : corrPool), "corrupted");
        item.corruptedEnchants = (item.corruptedEnchants || []).length === 1 && unused.length > 0 ? [...item.corruptedEnchants, inst] : [inst];
        return okRes(item, [], (l) => L(l, `使用 ${pickObjField(def, "name", l)}：双重腐化并附加腐化附魔。`, `使用 ${pickObjField(def, "name", l)}：雙重腐化並附加腐化附魔。`, `Used ${pickObjField(def, "name", l)}: Twice-Corrupted with Corrupted Enchant.`), lang);
      }
      return okRes(item, [], (l) => L(l, `使用 ${pickObjField(def, "name", l)}：完成双重腐化（属性保持不变）。`, `使用 ${pickObjField(def, "name", l)}：完成雙重腐化（屬性保持不變）。`, `Used ${pickObjField(def, "name", l)}: Twice-Corrupted (stats unchanged).`), lang);
    }

    // 4. 瓦尔虹吸者
    if (templeId === "vaal_siphoner") {
      if (!item.corrupted || item.rarity !== "rare" || catData.qualityType !== "catalyst") {
        return fail("瓦尔虹吸者仅限「已腐化的稀有饰品（戒指/项链/腰带）」使用。", "瓦爾虹吸者僅限「已腐化的稀有飾品（戒指/項鍊/腰帶）」使用。", "Vaal Siphoner can only be used on Corrupted Rare Jewellery.", lang);
      }
      const removable = item.mods.filter((m) => !m.fractured && !m.markType);
      if (removable.length === 0) return fail("没有可被虹吸的词缀。", "沒有可被虹吸的詞綴。", "No modifiers available to siphon.", lang);
      const victim = pickRandom(removable);
      item.mods = item.mods.filter((m) => m.uid !== victim.uid);
      for (const m of item.mods) {
        for (const ln of m.lines) {
          ln.values = ln.values.map((v) => (Number.isInteger(v) ? Math.round(v * 1.2) : Math.round(v * 1.2 * 10) / 10));
        }
      }
      return okRes(item, [], (l) => L(l,
        `使用 ${pickObjField(def, "name", l)}：吸取 ${formatModTagName(victim, l)} 并强化其余词缀数值 +20%`,
        `使用 ${pickObjField(def, "name", l)}：吸取 ${formatModTagName(victim, l)} 並強化其餘詞綴數值 +20%`,
        `Used ${pickObjField(def, "name", l)}: Siphoned ${formatModTagName(victim, l)} and boosted remaining mods by +20%`
      ), lang);
    }

    // 5. 萃取石
    if (templeId === "orb_of_extraction") {
      if ((item.socketedRunes || []).length === 0) return fail("装备上没有可萃取的增幅器/符文。", "裝備上沒有可萃取的增幅器/符文。", "No socketed Augments/Runes to extract.", lang);
      const count = item.socketedRunes.length;
      item.socketedRunes = [];
      return okRes(item, [], (l) => L(l, `使用 ${pickObjField(def, "name", l)}：已提取 ${count} 个镶嵌符文。`, `使用 ${pickObjField(def, "name", l)}：已提取 ${count} 個鑲嵌符文。`, `Used ${pickObjField(def, "name", l)}: Extracted ${count} socketed rune(s).`), lang);
    }

    return fail("该神庙通货当前不可用。", "該神廟通貨當前不可用。", "This Temple currency is currently unavailable.", lang);
  }

  function applyCurrency(catData, currentItem, currencyId, activeOmensSet, lang) {
    if (currencyId === "artificer") return punchSocket(catData, currentItem, lang);
    if (currentItem.corrupted) {
      return fail(
        "物品已腐化，无法继续使用常规通货修改（可使用神庙「建筑师宝珠」或重置底材）。",
        "物品已腐化，無法繼續使用常規通貨修改（可使用神廟「策匠石」或重置基底）。",
        "Item is Corrupted; cannot use regular currency (use Architect's Orb or Reset Base).",
        lang
      );
    }

    const item = cloneItem(currentItem);
    const omens = activeOmensSet || new Set();
    const usedOmens = [];
    const counts = countAffixes(item);
    const curDef = CURRENCY_MAP[currencyId];
    const minModLvl = curDef ? curDef.minModLvl : 1;

    if (minModLvl > 1 && item.ilvl < minModLvl && (
      currencyId.endsWith("transmute") ||
      currencyId.endsWith("aug") ||
      currencyId.endsWith("regal") ||
      currencyId.endsWith("chaos") ||
      currencyId.endsWith("exalt")
    )) {
      return msgResult(false, {}, (l) => L(l,
        `「${pickObjField(curDef, "name", l)}」最低词缀等级 Lv${minModLvl}，不能用于物品等级低于 ${minModLvl} 的装备（当前 iLvl ${item.ilvl}）。`,
        `「${pickObjField(curDef, "name", l)}」最低詞綴等級 Lv${minModLvl}，不能用於物品等級低於 ${minModLvl} 的裝備（當前 iLvl ${item.ilvl}）。`,
        `"${pickObjField(curDef, "name", l)}" (Min Mod Level ${minModLvl}) cannot be used on items below iLvl ${minModLvl} (current iLvl ${item.ilvl}).`
      ), lang);
    }

    if (currencyId.endsWith("transmute")) {
      if (item.rarity !== "normal") return msgResult(false, {}, (l) => L(l, `${pickObjField(curDef, "name", l)} 只能对普通（白色）物品使用。`, `${pickObjField(curDef, "name", l)} 只能對普通（白色）物品使用。`, `${pickObjField(curDef, "name", l)} can only be used on Normal items.`), lang);
      const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "magic", minModLvl }));
      if (!picked) return fail(`当前物品等级 Lv${item.ilvl} 下没有符合最低 Lv${minModLvl} 的词缀。`, `當前物品等級 Lv${item.ilvl} 下沒有符合最低 Lv${minModLvl} 的詞綴。`, `No eligible modifiers at iLvl ${item.ilvl} (Min Lv${minModLvl}).`, lang);
      item.rarity = "magic";
      const inst = instantiateMod(picked, picked._poolSrc || "normal");
      item.mods.push(inst);
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：升级为魔法并获得 ${formatModTagName(inst, l)}`, `使用 ${pickObjField(curDef, "name", l)}：升級為魔法並獲得 ${formatModTagName(inst, l)}`, `Used ${pickObjField(curDef, "name", l)}: Upgraded to Magic with ${formatModTagName(inst, l)}`), lang);
    }

    if (currencyId.endsWith("aug")) {
      if (item.rarity !== "magic") return msgResult(false, {}, (l) => L(l, `${pickObjField(curDef, "name", l)} 只能对魔法（蓝色）物品使用。`, `${pickObjField(curDef, "name", l)} 只能對魔法（藍色）物品使用。`, `${pickObjField(curDef, "name", l)} can only be used on Magic items.`), lang);
      if (counts.p >= 1 && counts.s >= 1) return fail("魔法物品已满词缀（1 前缀 + 1 后缀）。", "魔法物品已滿詞綴（1 前綴 + 1 後綴）。", "Magic item already has full affixes (1 Prefix + 1 Suffix).", lang);
      const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "magic", minModLvl }));
      if (!picked) return fail(`当前没有可用的额外魔法词缀（最低 Lv${minModLvl}）。`, `當前沒有可用的額外魔法詞綴（最低 Lv${minModLvl}）。`, `No eligible Magic modifiers available (Min Lv${minModLvl}).`, lang);
      const inst = instantiateMod(picked, picked._poolSrc || "normal");
      item.mods.push(inst);
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：新增 ${formatModTagName(inst, l)}`, `使用 ${pickObjField(curDef, "name", l)}：新增 ${formatModTagName(inst, l)}`, `Used ${pickObjField(curDef, "name", l)}: Added ${formatModTagName(inst, l)}`), lang);
    }

    if (currencyId.endsWith("regal")) {
      if (catData.maxRarity === "magic") return fail("该类型物品最高仅支持魔法品质，无法升级为稀有。", "該類型物品最高僅支援魔法品質，無法升級為稀有。", "This item class cannot exceed Magic rarity.", lang);
      if (item.rarity !== "magic") return msgResult(false, {}, (l) => L(l, `${pickObjField(curDef, "name", l)} 只能对魔法物品使用。`, `${pickObjField(curDef, "name", l)} 只能對魔法物品使用。`, `${pickObjField(curDef, "name", l)} can only be used on Magic items.`), lang);
      const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare", minModLvl }));
      if (!picked) return fail("当前等级条件下没有可添加的词缀。", "當前等級條件下沒有可添加的詞綴。", "No eligible modifiers available at this iLvl.", lang);
      item.rarity = "rare";
      item.rareName = generateRareName(lang);
      const inst = instantiateMod(picked, picked._poolSrc || "normal");
      item.mods.push(inst);
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：升级为稀有并获得 ${formatModTagName(inst, l)}`, `使用 ${pickObjField(curDef, "name", l)}：升級為稀有並獲得 ${formatModTagName(inst, l)}`, `Used ${pickObjField(curDef, "name", l)}: Upgraded to Rare with ${formatModTagName(inst, l)}`), lang);
    }

    if (currencyId === "alc") {
      if (catData.maxRarity === "magic") return fail("该类型物品最高仅支持魔法品质，无法使用点金石。", "該類型物品最高僅支援魔法品質，無法使用點金石。", "This item class cannot exceed Magic rarity.", lang);
      if (item.rarity === "rare") return fail("点金石只能对普通或魔法物品使用。", "點金石只能對普通或魔法物品使用。", "Orb of Alchemy can only be used on Normal or Magic items.", lang);
      const maxSlots = getMaxSlots(catData, { ...item, rarity: "rare" });
      const targetMods = Math.min(4, maxSlots.maxP + maxSlots.maxS);
      item.rarity = "rare";
      item.rareName = generateRareName(lang);
      item.mods = item.mods.filter((m) => m.fractured || m.markType);
      while (item.mods.length < targetMods) {
        const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare" }));
        if (!picked) break;
        item.mods.push(instantiateMod(picked, picked._poolSrc || "normal"));
      }
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：生成 ${item.mods.length} 条词缀的稀有装备`, `使用 ${pickObjField(curDef, "name", l)}：生成 ${item.mods.length} 條詞綴的稀有裝備`, `Used ${pickObjField(curDef, "name", l)}: Created Rare item with ${item.mods.length} mod(s)`), lang);
    }

    if (currencyId.endsWith("exalt")) {
      if (item.rarity !== "rare") return msgResult(false, {}, (l) => L(l, `${pickObjField(curDef, "name", l)} 只能对稀有（金色）物品使用。`, `${pickObjField(curDef, "name", l)} 只能對稀有（金色）物品使用。`, `${pickObjField(curDef, "name", l)} can only be used on Rare items.`), lang);
      const maxSlots = getMaxSlots(catData, item);
      if (counts.total >= maxSlots.maxP + maxSlots.maxS) return fail("稀有物品词缀槽位已满。", "稀有物品詞綴欄位已滿。", "Rare item modifier slots are full.", lang);

      let genOnly = 0;
      if (omens.has("omen_sinistral_exaltation")) { genOnly = 1; usedOmens.push("omen_sinistral_exaltation"); }
      else if (omens.has("omen_dextral_exaltation")) { genOnly = 2; usedOmens.push("omen_dextral_exaltation"); }

      const addCount = omens.has("omen_greater_exaltation") ? 2 : 1;
      if (addCount === 2) usedOmens.push("omen_greater_exaltation");

      const addedMods = [];
      for (let step = 0; step < addCount; step++) {
        const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare", minModLvl, genOnly }));
        if (!picked) {
          if (step === 0) return fail("当前条件/预兆下没有可添加的词缀。", "當前條件/預兆下沒有可添加的詞綴。", "No eligible modifiers available under current Omen/slot constraints.", lang);
          break;
        }
        const inst = instantiateMod(picked, picked._poolSrc || "normal");
        item.mods.push(inst);
        addedMods.push(inst);
      }
      return okRes(item, usedOmens, (l) => {
        const modStr = addedMods.map((m) => formatModTagName(m, l)).join(resolveLang(l) === "us" ? ", " : "、");
        return L(l, `使用 ${pickObjField(curDef, "name", l)}：+${modStr}`, `使用 ${pickObjField(curDef, "name", l)}：+${modStr}`, `Used ${pickObjField(curDef, "name", l)}: +${modStr}`);
      }, lang);
    }

    if (currencyId.endsWith("chaos")) {
      if (item.rarity !== "rare") return msgResult(false, {}, (l) => L(l, `${pickObjField(curDef, "name", l)} 只能对稀有物品使用。`, `${pickObjField(curDef, "name", l)} 只能對稀有物品使用。`, `${pickObjField(curDef, "name", l)} can only be used on Rare items.`), lang);
      let removable = item.mods.filter((m) => !m.fractured && !m.markType);
      if (removable.length === 0) return fail("没有可被移除的非分裂/非标记词缀。", "沒有可被移除的非破裂/非標記詞綴。", "No removable non-Fractured/unmarked modifiers.", lang);

      const dir = filterByDirectionalOmen(removable, omens, usedOmens, "omen_sinistral_erasure", "omen_dextral_erasure", lang);
      if (!dir.ok) return dir.res;
      removable = dir.list;

      let victim;
      if (omens.has("omen_whittling")) {
        usedOmens.push("omen_whittling");
        const minL = Math.min(...removable.map((m) => m.lvl));
        victim = pickRandom(removable.filter((m) => m.lvl === minL));
      } else {
        victim = pickRandom(removable);
      }

      item.mods = item.mods.filter((m) => m.uid !== victim.uid);
      const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare", minModLvl }));
      if (!picked) return fail("移除后找不到符合条件的新词缀。", "移除後找不到符合條件的新詞綴。", "No eligible replacement modifier found after removal.", lang);
      const inst = instantiateMod(picked, picked._poolSrc || "normal");
      item.mods.push(inst);
      return okRes(item, usedOmens, (l) => L(l,
        `使用 ${pickObjField(curDef, "name", l)}：移除 ${formatModTagName(victim, l)} → 获得 ${formatModTagName(inst, l)}`,
        `使用 ${pickObjField(curDef, "name", l)}：移除 ${formatModTagName(victim, l)} → 獲得 ${formatModTagName(inst, l)}`,
        `Used ${pickObjField(curDef, "name", l)}: Removed ${formatModTagName(victim, l)} → Added ${formatModTagName(inst, l)}`
      ), lang);
    }

    if (currencyId === "annul") {
      if (item.rarity !== "magic" && item.rarity !== "rare") return fail("剥离石只能对魔法或稀有物品使用。", "無效石只能對魔法或稀有物品使用。", "Orb of Annulment can only be used on Magic or Rare items.", lang);
      let removable = item.mods.filter((m) => !m.fractured && !m.markType);
      if (omens.has("omen_light")) {
        const des = removable.filter((m) => m.source === "desecrated");
        if (des.length === 0) return fail("光明预兆生效中，但没有可移除的渎灵词缀。", "光明之兆生效中，但沒有可移除的褻瀆詞綴。", "Omen of Light active, but no Desecrated modifier found.", lang);
        removable = des;
        usedOmens.push("omen_light");
      } else {
        const dir = filterByDirectionalOmen(removable, omens, usedOmens, "omen_sinistral_annulment", "omen_dextral_annulment", lang);
        if (!dir.ok) return dir.res;
        removable = dir.list;
      }
      if (removable.length === 0) return fail("没有可被剥离的非分裂词缀。", "沒有可被移除的非破裂詞綴。", "No removable non-Fractured modifiers.", lang);
      const victim = pickRandom(removable);
      item.mods = item.mods.filter((m) => m.uid !== victim.uid);
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：移除 ${formatModTagName(victim, l)}`, `使用 ${pickObjField(curDef, "name", l)}：移除 ${formatModTagName(victim, l)}`, `Used ${pickObjField(curDef, "name", l)}: Removed ${formatModTagName(victim, l)}`), lang);
    }

    if (currencyId === "divine") {
      if (omens.has("omen_blessing")) {
        if (item.implicits.length === 0) return fail("该底材没有可重置数值的基底词缀。", "該基底沒有可重置數值的基底詞綴。", "This base item has no Implicit modifiers to reroll.", lang);
        usedOmens.push("omen_blessing");
        for (const imp of item.implicits) imp.values = (imp.ranges || []).map((r) => rollValue(r[0], r[1], 1));
        const omenDef = OMEN_MAP.omen_blessing;
        return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)} + ${pickObjField(omenDef, "name", l)}：已重置基底词缀数值`, `使用 ${pickObjField(curDef, "name", l)} + ${pickObjField(omenDef, "name", l)}：已重置基底詞綴數值`, `Used ${pickObjField(curDef, "name", l)} + ${pickObjField(omenDef, "name", l)}: Rerolled Implicit values`), lang);
      }
      if (item.mods.length === 0) return fail("物品上没有任何显式词缀。", "物品上沒有任何顯式詞綴。", "Item has no explicit modifiers.", lang);
      if (omens.has("omen_sanctification")) {
        if (item.rarity !== "rare") return fail("神圣预兆只能用于稀有物品。", "聖化之兆只能用於稀有物品。", "Omen of Sanctification can only be used on Rare items.", lang);
        if (item.sanctified) return fail("物品已经被圣化过了。", "物品已經被聖化過了。", "Item is already Sanctified.", lang);
        usedOmens.push("omen_sanctification");
        const factor = Math.round((0.8 + Math.random() * 0.4) * 100) / 100;
        item.sanctified = true;
        item.sanctifyFactor = factor;
        for (const m of item.mods) for (const ln of m.lines) ln.values = (ln.ranges || []).map((r) => rollValue(r[0], r[1], factor));
        const omenDef = OMEN_MAP.omen_sanctification;
        return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)} + ${pickObjField(omenDef, "name", l)}：圣化成功（数值倍率 ×${factor}）`, `使用 ${pickObjField(curDef, "name", l)} + ${pickObjField(omenDef, "name", l)}：聖化成功（數值倍率 ×${factor}）`, `Used ${pickObjField(curDef, "name", l)} + ${pickObjField(omenDef, "name", l)}: Sanctified (multiplier ×${factor})`), lang);
      }
      for (const m of item.mods) if (!m.fractured && !m.markType) for (const ln of m.lines) ln.values = (ln.ranges || []).map((r) => rollValue(r[0], r[1], item.sanctifyFactor || 1));
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：已重置所有非锁定词缀数值（破裂词缀保持不变）`, `使用 ${pickObjField(curDef, "name", l)}：已重置所有非鎖定詞綴數值（破裂詞綴保持不變）`, `Used ${pickObjField(curDef, "name", l)}: Rerolled unlocked modifier values (Fractured mods preserved)`), lang);
    }

    if (currencyId === "fracture") {
      if (item.rarity !== "rare") return fail("破溃宝珠只能对稀有物品使用。", "破裂石只能對稀有物品使用。", "Fracturing Orb can only be used on Rare items.", lang);
      if (item.mods.some((m) => m.fractured)) return fail("该物品已有分裂锁定的词缀。", "該物品已有破裂鎖定的詞綴。", "Item already has a Fractured modifier.", lang);
      const candidates = item.mods.filter((m) => !m.markType);
      if (candidates.length < 4) return fail("需要至少 4 条非标记词缀才能使用破溃宝珠。", "需要至少 4 條非標記詞綴才能使用破裂石。", "Requires at least 4 unmarked modifiers to use Fracturing Orb.", lang);
      const target = pickRandom(candidates);
      target.fractured = true;
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：成功分裂锁定 ${formatModTagName(target, l)}`, `使用 ${pickObjField(curDef, "name", l)}：成功破裂鎖定 ${formatModTagName(target, l)}`, `Used ${pickObjField(curDef, "name", l)}: Fractured ${formatModTagName(target, l)}`), lang);
    }

    if (currencyId === "vaal") {
      const guaranteedChange = omens.has("omen_corruption");
      if (guaranteedChange) usedOmens.push("omen_corruption");
      item.corrupted = true;

      const corrPool = (catData.pools && catData.pools.corrupted) || [];
      const { corruptMax } = getSocketLimits(catData);
      const outcomes = ["enchant", "reroll"];
      if (canSupportsQuality(catData)) outcomes.push("quality");
      if (corruptMax > 0 && !item.corruptSocketAdded && (item.sockets || 0) < corruptMax) outcomes.push("add_socket");
      if (!guaranteedChange) outcomes.push("nothing");
      const roll = pickRandom(outcomes);

      if (roll === "add_socket") {
        item.sockets = (item.sockets || 0) + 1;
        item.corruptSocketAdded = true;
        return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：腐化出额外 +1 插槽！（当前 ${item.sockets} 孔）`, `使用 ${pickObjField(curDef, "name", l)}：腐化出額外 +1 插槽！（當前 ${item.sockets} 孔）`, `Used ${pickObjField(curDef, "name", l)}: Corrupted +1 Socket! (${item.sockets} socket(s))`), lang);
      }
      if (roll === "enchant" && corrPool.length > 0) {
        item.corruptedEnchants = [instantiateMod(pickRandom(corrPool), "corrupted")];
        return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：获得腐化附魔！`, `使用 ${pickObjField(curDef, "name", l)}：獲得腐化附魔！`, `Used ${pickObjField(curDef, "name", l)}: Added Corrupted Enchant!`), lang);
      }
      if (roll === "reroll" && item.mods.length > 0) {
        const removable = item.mods.filter((m) => !m.fractured && !m.markType);
        if (removable.length > 0) {
          const victim = pickRandom(removable);
          item.mods = item.mods.filter((m) => m.uid !== victim.uid);
          const picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: item.rarity === "normal" ? "magic" : item.rarity }));
          if (picked) item.mods.push(instantiateMod(picked, picked._poolSrc || "normal"));
        }
        return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：重塑了部分词缀并腐化。`, `使用 ${pickObjField(curDef, "name", l)}：重塑了部分詞綴並腐化。`, `Used ${pickObjField(curDef, "name", l)}: Reforged modifier(s) and Corrupted.`), lang);
      }
      if (roll === "quality" && canSupportsQuality(catData)) {
        const delta = Math.floor(Math.random() * 14) - 6;
        item.quality = Math.max(0, Math.min(30, (item.quality || 0) + (delta === 0 ? 3 : delta)));
        return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：物品品质变为 ${item.quality}% 并腐化。`, `使用 ${pickObjField(curDef, "name", l)}：物品品質變為 ${item.quality}% 並腐化。`, `Used ${pickObjField(curDef, "name", l)}: Quality set to ${item.quality}% and Corrupted.`), lang);
      }
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickObjField(curDef, "name", l)}：未产生额外变化（物品已腐化）。`, `使用 ${pickObjField(curDef, "name", l)}：未產生額外變化（物品已腐化）。`, `Used ${pickObjField(curDef, "name", l)}: No other outcome (Item Corrupted).`), lang);
    }

    return fail("未知的通货操作：" + currencyId, "未知的通貨操作：" + currencyId, "Unknown currency: " + currencyId, lang);
  }

  function applyEssence(catData, currentItem, poolName, modDef, activeOmensSet, lang) {
    if (currentItem.corrupted) return fail("物品已腐化，无法使用精华。", "物品已腐化，無法使用精髓。", "Item is Corrupted; cannot use Essence.", lang);
    if (!catData.canEssence) return fail("该类型物品无法使用精华。", "該類型物品無法使用精髓。", "Essences cannot be used on this item class.", lang);

    const item = cloneItem(currentItem);
    const omens = activeOmensSet || new Set();
    const usedOmens = [];

    if (poolName === "essence") {
      if (item.rarity !== "magic") return fail("普通/强效精华只能对魔法（蓝色）物品使用。", "一般/高階精髓只能對魔法（藍色）物品使用。", "Regular/Greater Essences can only be used on Magic items.", lang);
      const blocked = getBlockedFamilies(item);
      if ((modDef.fam || []).some((f) => blocked.has(f))) return fail("物品上已存在同族冲突词缀。", "物品上已存在同族衝突詞綴。", "Item already has a conflicting modifier family.", lang);
      const counts = countAffixes(item);
      const maxSlots = getMaxSlots(catData, { ...item, rarity: "rare" });
      if (modDef.gen === 1 && counts.p >= maxSlots.maxP) return fail("前缀槽位已满。", "前綴欄位已滿。", "Prefix slots are full.", lang);
      if (modDef.gen === 2 && counts.s >= maxSlots.maxS) return fail("后缀槽位已满。", "後綴欄位已滿。", "Suffix slots are full.", lang);

      item.rarity = "rare";
      item.rareName = generateRareName(lang);
      item.mods.push(instantiateMod(modDef, "essence"));
      return okRes(item, usedOmens, (l) => L(l, `使用 ${pickModName(modDef, l)}：升级为稀有并必出精华词缀`, `使用 ${pickModName(modDef, l)}：升級為稀有並必出精髓詞綴`, `Used ${pickModName(modDef, l)}: Upgraded to Rare with guaranteed Essence mod`), lang);
    }

    if (poolName === "perfect_essence") {
      if (item.rarity !== "rare") return fail("完美/腐化/合金精华只能对稀有物品使用。", "完美/腐化/合金精髓只能對稀有物品使用。", "Perfect/Corrupted/Alloy Essences can only be used on Rare items.", lang);
      let removable = item.mods.filter((m) => !m.fractured && !m.markType);
      const dir = filterByDirectionalOmen(removable, omens, usedOmens, "omen_sinistral_crystallisation", "omen_dextral_crystallisation", lang);
      if (!dir.ok) return dir.res;
      removable = dir.list;
      if (removable.length === 0) return fail("没有可被移除的非分裂词缀。", "沒有可被移除的非破裂詞綴。", "No removable non-Fractured modifiers.", lang);

      const victim = pickRandom(removable);
      item.mods = item.mods.filter((m) => m.uid !== victim.uid);
      const blocked = getBlockedFamilies(item);
      if ((modDef.fam || []).some((f) => blocked.has(f))) return fail("存在同族冲突词缀。", "存在同族衝突詞綴。", "Conflicting modifier family already exists on item.", lang);
      const counts = countAffixes(item);
      const maxSlots = getMaxSlots(catData, item);
      if (modDef.gen === 1 && counts.p >= maxSlots.maxP) return fail("前缀槽位已满，可搭配左旋结晶预兆。", "前綴欄位已滿，可搭配左旋結晶之兆。", "Prefix slots are full; try Omen of Sinistral Crystallisation.", lang);
      if (modDef.gen === 2 && counts.s >= maxSlots.maxS) return fail("后缀槽位已满，可搭配右旋结晶预兆。", "後綴欄位已滿，可搭配右旋結晶之兆。", "Suffix slots are full; try Omen of Dextral Crystallisation.", lang);

      item.mods.push(instantiateMod(modDef, "perfect_essence"));
      return okRes(item, usedOmens, (l) => L(l,
        `使用 ${pickModName(modDef, l)}：移除 ${formatModTagName(victim, l)} → 必出精华词缀`,
        `使用 ${pickModName(modDef, l)}：移除 ${formatModTagName(victim, l)} → 必出精髓詞綴`,
        `Used ${pickModName(modDef, l)}: Removed ${formatModTagName(victim, l)} → Added Essence mod`
      ), lang);
    }

    return fail("不支持的精华类型。", "不支援的精髓類型。", "Unsupported Essence pool.", lang);
  }

  function rollDesecratedChoices(catData, item, boneDef, activeOmensSet, lang) {
    if (item.corrupted) return fail("物品已腐化，无法注入渎灵词缀。", "物品已腐化，無法注入褻瀆詞綴。", "Item is Corrupted; cannot Desecrate.", lang);
    if (!catData.canDesecrate) return fail("该类型物品不支持渎灵词缀。", "該類型物品不支援褻瀆詞綴。", "This item class does not support Desecrated modifiers.", lang);
    if (item.rarity !== "rare") return fail("深渊遗骨只能对稀有物品使用。", "深淵遺骨只能對稀有物品使用。", "Abyssal Jawbones can only be used on Rare items.", lang);
    if ((boneDef.minModLvl || 1) > 1 && item.ilvl < boneDef.minModLvl) {
      return msgResult(false, {}, (l) => L(l,
        `「${pickObjField(boneDef, "name", l)}」最低词缀等级 Lv${boneDef.minModLvl}，不能用于物品等级低于 ${boneDef.minModLvl} 的装备（当前 iLvl ${item.ilvl}）。`,
        `「${pickObjField(boneDef, "name", l)}」最低詞綴等級 Lv${boneDef.minModLvl}，不能用於物品等級低於 ${boneDef.minModLvl} 的裝備（當前 iLvl ${item.ilvl}）。`,
        `"${pickObjField(boneDef, "name", l)}" (Min Mod Level ${boneDef.minModLvl}) cannot be used on items below iLvl ${boneDef.minModLvl} (current iLvl ${item.ilvl}).`
      ), lang);
    }
    const counts = countAffixes(item);
    const maxSlots = getMaxSlots(catData, item);
    if (counts.total >= maxSlots.maxP + maxSlots.maxS) return fail("词缀已满，请先剥离腾出空位。", "詞綴已滿，請先移除騰出空位。", "Modifier slots are full; annul a mod first.", lang);

    const omens = activeOmensSet || new Set();
    const usedOmens = [];
    let genOnly = 0;
    if (omens.has("omen_sinistral_necromancy")) { genOnly = 1; usedOmens.push("omen_sinistral_necromancy"); }
    else if (omens.has("omen_dextral_necromancy")) { genOnly = 2; usedOmens.push("omen_dextral_necromancy"); }

    let factionOnly = "";
    if (omens.has("omen_sovereign")) { factionOnly = "ulaman_mod"; usedOmens.push("omen_sovereign"); }
    else if (omens.has("omen_liege")) { factionOnly = "amanamu_mod"; usedOmens.push("omen_liege"); }
    else if (omens.has("omen_blackblooded")) { factionOnly = "kurgal_mod"; usedOmens.push("omen_blackblooded"); }

    const baseOpts = { targetRarity: "rare", minModLvl: boneDef.minModLvl, maxModLvl: boneDef.maxModLvl, genOnly, includeAldur: false };
    let pool = getEligibleMods(catData, item, "desecrated", { ...baseOpts, factionOnly });
    if (pool.length === 0 && factionOnly) return fail("当前装备/等级下没有符合该巫妖预兆的渎灵词缀。", "當前裝備/等級下沒有符合該巫妖預兆的褻瀆詞綴。", "No eligible Desecrated modifiers matching this Lich Omen.", lang);
    if (pool.length < 3 && !factionOnly) pool = pool.concat(getEligibleMods(catData, item, "normal", baseOpts));

    const choices = [];
    const seenFam = new Set();
    const candidates = [...pool];
    while (choices.length < 3 && candidates.length > 0) {
      const picked = rollWeighted(candidates);
      if (!picked) break;
      const famKey = (picked.fam && picked.fam[0]) || picked.id;
      if (!seenFam.has(famKey)) {
        seenFam.add(famKey);
        choices.push(instantiateMod(picked, picked.id.startsWith("desecrated_") ? "desecrated" : "normal"));
      }
      for (let i = candidates.length - 1; i >= 0; i--) {
        if (((candidates[i].fam && candidates[i].fam[0]) || candidates[i].id) === famKey) candidates.splice(i, 1);
      }
    }

    if (choices.length === 0) return fail("当前空位或等级下没有可揭示的渎灵词缀。", "當前空位或等級下沒有可揭示的褻瀆詞綴。", "No revealable Desecrated modifiers for available slots/iLvl.", lang);
    return { ok: true, choices, usedOmens, canReroll: omens.has("omen_abyssal_echoes") };
  }

  function addModDirectly(catData, currentItem, modDef, poolName, lang, opts) {
    const item = cloneItem(currentItem);
    const allowRareUpgrade = !!(opts && opts.allowRareUpgrade);
    if (poolName === "corrupted" || poolName === "corruption_upgrade") {
      item.corrupted = true;
      item.corruptedEnchants = [instantiateMod(modDef, "corrupted")];
      return okRes(item, [], (l) => L(l, "已添加腐化附魔", "已添加腐化附魔", "Added Corrupted Enchant"), lang);
    }

    const blocked = getBlockedFamilies(item);
    if ((modDef.fam || []).some((f) => blocked.has(f))) return fail("物品上已有相同或冲突词缀家族，无法重复添加。", "物品上已有相同或衝突詞綴家族，無法重複添加。", "Item already has a modifier from a conflicting family.", lang);

    if (item.rarity === "normal") {
      item.rarity = "magic";
    } else if (item.rarity === "magic") {
      const mc = countAffixes(item);
      if ((modDef.gen === 1 && mc.p >= 1) || (modDef.gen === 2 && mc.s >= 1)) {
        if (catData.maxRarity === "magic") return fail("该类型物品最高仅支持魔法品质（最多 1 前 1 后）。", "該類型物品最高僅支援魔法品質（最多 1 前 1 後）。", "This item class cannot exceed Magic rarity (1P/1S max).", lang);
        if (!allowRareUpgrade) {
          return msgResult(false, { needsRareUpgrade: true, modDef, poolName }, (l) => {
            const side = modDef.gen === 1 ? L(l, "前缀", "前綴", "Prefix") : L(l, "后缀", "後綴", "Suffix");
            const mName = pickModName(modDef, l);
            return L(l,
              `当前魔法物品${side}已达上限（仅限 1 前 1 后），是否升级为稀有物品并添加「${mName}」？`,
              `當前魔法物品${side}已達上限（僅限 1 前 1 後），是否升級為稀有物品並加入「${mName}」？`,
              `Magic item ${side} limit reached (1P/1S max). Upgrade to Rare and add "${mName}"?`
            );
          }, lang);
        }
        item.rarity = "rare";
        item.rareName = generateRareName(lang);
      }
    }

    const counts = countAffixes(item);
    const { maxP, maxS } = getMaxSlots(catData, item);
    if (modDef.gen === 1 && counts.p >= maxP) return fail(`前缀已满（${counts.p}/${maxP}），请先移除一条前缀。`, `前綴已滿（${counts.p}/${maxP}），請先移除一條前綴。`, `Prefix slots full (${counts.p}/${maxP}); remove a Prefix first.`, lang);
    if (modDef.gen === 2 && counts.s >= maxS) return fail(`后缀已满（${counts.s}/${maxS}），请先移除一条后缀。`, `後綴已滿（${counts.s}/${maxS}），請先移除一條後綴。`, `Suffix slots full (${counts.s}/${maxS}); remove a Suffix first.`, lang);

    const inst = instantiateMod(modDef, poolName || "normal");
    item.mods.push(inst);
    return okRes(item, [], (l) => L(l,
      allowRareUpgrade ? `升级为稀有并添加 ${formatModTagName(inst, l)}` : `沙盒添加 ${formatModTagName(inst, l)}`,
      allowRareUpgrade ? `升級為稀有並加入 ${formatModTagName(inst, l)}` : `沙盒加入 ${formatModTagName(inst, l)}`,
      allowRareUpgrade ? `Upgraded to Rare & added ${formatModTagName(inst, l)}` : `Sandbox added ${formatModTagName(inst, l)}`
    ), lang);
  }

  function computePoolOdds(catData, item, poolName, activeOmensSet) {
    const omens = activeOmensSet || new Set();
    let genOnly = 0;
    if (omens.has("omen_sinistral_exaltation") || omens.has("omen_sinistral_necromancy")) genOnly = 1;
    else if (omens.has("omen_dextral_exaltation") || omens.has("omen_dextral_necromancy")) genOnly = 2;

    const eligible = getEligibleMods(catData, item, poolName, {
      targetRarity: item.rarity === "normal" ? "rare" : item.rarity,
      genOnly,
      includeAldur: poolName === "normal"
    });
    let totalWeight = 0;
    for (const m of eligible) totalWeight += Math.max(0, m.w || 0);
    return { eligibleIds: new Set(eligible.map((m) => m.id)), totalWeight };
  }

  // ========= 1.0 赛季通货预测：熔炉标记 & 鲜血血瓶 =========
  function getMarkEquipGroup(catData) {
    if (!catData) return "none";
    if (catData.category === "单手武器" || catData.category === "双手武器" || catData.slug === "Quivers") return "weapon_quiver";
    if (["护甲", "头盔", "手套", "鞋子", "Belt"].includes(catData.category) || catData.qualityType === "armour") return "armour_belt";
    if (catData.category === "饰品") return "jewellery";
    return "none";
  }

  function checkSeason10MarkEligibility(catData, item, currencyId, lang) {
    const def = SEASON10_MAP[currencyId];
    if (!def) return { ok: false, targets: [], message: L(lang, "未知 1.0 标记通货。", "未知 1.0 標記通貨。", "Unknown 1.0 mark currency.") };
    if (!item || !catData) return { ok: false, targets: [], message: L(lang, "尚未加载装备。", "尚未載入裝備。", "Item not loaded.") };
    if (item.corrupted) return { ok: false, targets: [], message: L(lang, "物品已腐化，无法使用 1.0 标记通货。", "物品已腐化，無法使用 1.0 標記通貨。", "Item is Corrupted; cannot apply 1.0 mark currency.") };
    if (item.markReforged) {
      return {
        ok: false,
        targets: [],
        message: L(lang,
          "该装备已完成标记重铸并锁定为破裂词缀（一次性定型工序），无法再次使用熔炉或鲜血标记。",
          "該裝備已完成標記重鑄並鎖定為破裂詞綴（一次性定型工序），無法再次使用熔爐或鮮血標記。",
          "Item has already been Reforged via Mark -> Fractured (one-time finalization) and cannot be marked again."
        )
      };
    }
    const group = getMarkEquipGroup(catData);
    if (group !== def.equipGroup) {
      return {
        ok: false,
        targets: [],
        message: L(lang,
          `「${def.name}」仅适用于稀有「${def.equipLabel}」（当前为 ${catData.label}）。`,
          `「${def.name_tw}」僅適用於稀有「${def.equipLabel_tw}」（當前為 ${catData.label_tw || catData.label}）。`,
          `"${def.name_us}" only works on Rare ${def.equipLabel_us} (current: ${catData.label_us || catData.label}).`
        )
      };
    }
    if (item.rarity !== "rare") {
      return {
        ok: false,
        targets: [],
        message: L(lang,
          `「${def.name}」只能对稀有（黄色）装备使用。`,
          `「${def.name_tw}」只能對稀有（黃色）裝備使用。`,
          `"${def.name_us}" can only be used on Rare items.`
        )
      };
    }
    if (def.markKind === "forgemark" && item.ilvl > def.maxItemLvl) {
      return {
        ok: false,
        targets: [],
        message: L(lang,
          `「${def.name}」最高仅可用于物品等级 ${def.maxItemLvl}（当前 iLvl ${item.ilvl}）。`,
          `「${def.name_tw}」最高僅可用於物品等級 ${def.maxItemLvl}（當前 iLvl ${item.ilvl}）。`,
          `"${def.name_us}" has Maximum Item Level ${def.maxItemLvl} (current iLvl ${item.ilvl}).`
        )
      };
    }
    if (def.markKind === "bloodmark" && item.ilvl < def.minModLvl) {
      return {
        ok: false,
        targets: [],
        message: L(lang,
          `「${def.name}」要求最低词缀等级 ${def.minModLvl}，请先将物品等级调至 ${def.minModLvl}+（当前 iLvl ${item.ilvl}）。`,
          `「${def.name_tw}」要求最低詞綴等級 ${def.minModLvl}，請先將物品等級調至 ${def.minModLvl}+（當前 iLvl ${item.ilvl}）。`,
          `"${def.name_us}" requires Minimum Modifier Level ${def.minModLvl}; raise iLvl to ${def.minModLvl}+ (current iLvl ${item.ilvl}).`
        )
      };
    }

    const targets = item.mods.filter((m) => !m.fractured && !m.markType && (!def.suffixOnly || m.gen === 2));
    if (targets.length === 0) {
      return {
        ok: false,
        targets: [],
        message: def.suffixOnly
          ? L(lang, "当前装备上没有可被「鲜血血瓶」替换的未锁定后缀词缀（英文原版限 suffix）。", "當前裝備上沒有可被「鮮血血瓶」替換的未鎖定後綴詞綴（英文原版限 suffix）。", "No eligible unlocked Suffix modifier available for Bloodvial (suffix only).")
          : L(lang, "当前装备上没有可被「熔炉标记」替换的未锁定词缀。", "當前裝備上沒有可被「熔爐標記」替換的未鎖定詞綴。", "No eligible unlocked modifier available to replace with [Forgemark].")
      };
    }
    return { ok: true, targets, def };
  }

  function applySeason10Mark(catData, currentItem, currencyId, targetUid, lang) {
    const check = checkSeason10MarkEligibility(catData, currentItem, currencyId, lang);
    if (!check.ok) return fail(check.message, check.message, check.message, lang);

    const def = check.def;
    const item = cloneItem(currentItem);
    const idx = item.mods.findIndex((m) => m.uid === targetUid);
    const victim = idx >= 0 ? item.mods[idx] : null;
    if (!victim || victim.fractured || victim.markType || (def.suffixOnly && victim.gen !== 2)) {
      return fail("所选词缀不符合该标记通货替换条件。", "所選詞綴不符合該標記通貨替換條件。", "Selected modifier is not eligible for this mark currency.", lang);
    }

    const isBlood = def.markKind === "bloodmark";
    const markedSlot = {
      uid: nextUid(),
      id: `${def.markKind}_${victim.uid}`,
      gen: victim.gen,
      name: isBlood ? "[鲜血标记]" : "[熔炉标记]",
      name_tw: isBlood ? "[鮮血標記]" : "[熔爐標記]",
      name_us: isBlood ? "[Bloodmark]" : "[Forgemark]",
      lvl: victim.lvl || 1,
      tier: 0,
      w: 0,
      fam: [],
      tags: [],
      icon: def.icon,
      faction: "",
      source: def.markKind,
      fractured: false,
      markType: def.markKind,
      markCurrencyId: def.id,
      lines: [
        isBlood
          ? {
              tpl: "[Bloodmark] 待重铸词缀槽位（重铸后转为 Lv65+ 或低上限 T1 破裂词缀）",
              tpl_tw: "[Bloodmark] 待重鑄詞綴欄位（重鑄後轉為 Lv65+ 或低上限 T1 破裂詞綴）",
              tpl_us: "[Bloodmark] Marked Affix Slot (Reforges into Lv65+ / T1-cap Fractured Mod)",
              ranges: [],
              values: []
            }
          : {
              tpl: "[Forgemark] 待重铸词缀槽位（重铸后转为 ≤Lv64 随机破裂词缀）",
              tpl_tw: "[Forgemark] 待重鑄詞綴欄位（重鑄後轉為 ≤Lv64 隨機破裂詞綴）",
              tpl_us: "[Forgemark] Marked Affix Slot (Reforges into ≤Lv64 Fractured Mod)",
              ranges: [],
              values: []
            }
      ]
    };

    item.mods.splice(idx, 1, markedSlot);
    return okRes(item, [], (l) => L(l,
      `使用 ${pickObjField(def, "name", l)}：将 ${formatModTagName(victim, l)} 替换为 ${isBlood ? "[Bloodmark]" : "[Forgemark]"}`,
      `使用 ${pickObjField(def, "name", l)}：將 ${formatModTagName(victim, l)} 替換為 ${isBlood ? "[Bloodmark]" : "[Forgemark]"}`,
      `Used ${pickObjField(def, "name", l)}: Replaced ${formatModTagName(victim, l)} with ${isBlood ? "[Bloodmark]" : "[Forgemark]"}`
    ), lang);
  }

  function reforgeSeason10Marks(catData, currentItem, lang) {
    if (!currentItem || !catData) return fail("尚未加载装备。", "尚未載入裝備。", "Item not loaded.", lang);
    if (currentItem.corrupted) return fail("物品已腐化，无法重铸标记词缀。", "物品已腐化，無法重鑄標記詞綴。", "Item is Corrupted; cannot reforge marked slots.", lang);
    if (currentItem.markReforged) return fail("该装备已完成标记重铸定型。", "該裝備已完成標記重鑄定型。", "Item has already been Reforged via marks.", lang);

    const markedMods = currentItem.mods.filter((m) => m.markType);
    if (markedMods.length === 0) return fail("当前装备没有待重铸的 [Forgemark] 或 [Bloodmark] 槽位。", "當前裝備沒有待重鑄的 [Forgemark] 或 [Bloodmark] 欄位。", "No [Forgemark] or [Bloodmark] slots to reforge.", lang);
    if (markedMods.some((m) => m.markType === "bloodmark") && currentItem.ilvl < 65) {
      return fail("装备含 [Bloodmark] 槽位，重铸要求物品等级至少 iLvl 65。", "裝備含 [Bloodmark] 欄位，重鑄要求物品等級至少 iLvl 65。", "Item has [Bloodmark] slot(s); Reforge requires iLvl 65+.", lang);
    }

    const item = cloneItem(currentItem);
    // 先处理限制更严的 Bloodmark（仅后缀 Lv65+），再处理 Forgemark（保留后缀空位防冲突）
    const orderedMarks = [
      ...item.mods.filter((m) => m.markType === "bloodmark"),
      ...item.mods.filter((m) => m.markType === "forgemark")
    ];

    const outcomes = [];
    for (const markMod of orderedMarks) {
      const idx = item.mods.findIndex((m) => m.uid === markMod.uid);
      if (idx < 0) continue;
      item.mods.splice(idx, 1);

      let picked = null;
      if (markMod.markType === "bloodmark") {
        picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare", minModLvl: 65 }));
        if (!picked) {
          picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare" }));
        }
      } else {
        picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare", maxModLvl: 64 }));
        if (!picked) {
          picked = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare" }));
        }
      }
      if (!picked) {
        return fail("重铸失败：当前词缀池或槽位下没有可用替换词缀。", "重鑄失敗：當前詞綴池或欄位下沒有可用替換詞綴。", "Reforge failed: no eligible replacement modifiers in pool.", lang);
      }
      const inst = instantiateMod(picked, markMod.markType);
      inst.fractured = true;
      item.mods.splice(Math.min(idx, item.mods.length), 0, inst);
      outcomes.push({ markType: markMod.markType, mod: inst });
    }

    item.markReforged = true;
    return okRes(item, [], (l) => {
      const sep = resolveLang(l) === "us" ? ", " : "、";
      const listTxt = outcomes.map((o) => formatModTagName(o.mod, l)).join(sep);
      return L(l,
        `1.0 标记重铸完成：已永久锁定破裂词缀 ${listTxt}`,
        `1.0 標記重鑄完成：已永久鎖定破裂詞綴 ${listTxt}`,
        `1.0 Mark Reforge complete: Locked Fractured mod(s) ${listTxt}`
      );
    }, lang);
  }

  function prepareSeason10DemoRare(catData, currentItem, targetIlvl, lang) {
    if (!catData || !currentItem) return fail("尚未加载底材。", "尚未載入基底。", "Base not loaded.", lang);
    if (getMarkEquipGroup(catData) === "none") {
      return fail("1.0 熔炉/鲜血标记仅适用于武器/箭袋、护甲/腰带、项链/戒指。", "1.0 熔爐/鮮血標記僅適用於武器/箭袋、護甲/腰帶、項鍊/戒指。", "1.0 marks only apply to Weapons/Quivers, Armour/Belts, and Amulets/Rings.", lang);
    }
    const base = (catData.bases && catData.bases[currentItem.baseIdx]) || catData.bases[0];
    const ilvl = Math.max(1, Math.min(100, targetIlvl || 64));
    const item = createInitialItem(catData, currentItem.baseIdx, ilvl, currentItem.quality, lang);
    item.rarity = "rare";
    item.rareName = generateRareName(lang);
    item.sockets = currentItem.sockets || 0;
    item.socketedRunes = [...(currentItem.socketedRunes || [])];

    // 尽量生成 2 前缀 + 2 后缀（保证血瓶必定有可替换后缀），最多补到 4-5 条
    for (let i = 0; i < 2; i++) {
      const p = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare", genOnly: 1 }));
      if (p) item.mods.push(instantiateMod(p, p._poolSrc || "normal"));
    }
    for (let i = 0; i < 2; i++) {
      const s = rollWeighted(getEligibleMods(catData, item, "normal", { targetRarity: "rare", genOnly: 2 }));
      if (s) item.mods.push(instantiateMod(s, s._poolSrc || "normal"));
    }
    return okRes(item, [], (l) => L(l,
      `已生成 Lv${ilvl} 测试稀有${pickObjField(base, "name", l)}（${item.mods.length} 词缀）供 1.0 体验尝鲜`,
      `已產生 Lv${ilvl} 測試稀有${pickObjField(base, "name", l)}（${item.mods.length} 詞綴）供 1.0 體驗嘗鮮`,
      `Generated iLvl ${ilvl} test Rare ${pickObjField(base, "name", l)} (${item.mods.length} mods) for 1.0 preview`
    ), lang);
  }

  function exportItemText(catData, item, lang) {
    const useLang = lang || "cn";
    const T = global.PoE2I18n ? global.PoE2I18n.t : (_, k) => k;
    const pick = global.PoE2I18n ? global.PoE2I18n.pickLoc : (_, o, f) => o[f];
    const base = (catData.bases && catData.bases[item.baseIdx]) || catData.bases[0];
    const { mergedList } = aggregateItemStats(catData, item, useLang);
    const { computedLines, summaryStrip } = computeItemProperties(catData, item, mergedList, useLang);

    const lines = [
      `${T(useLang, "itemCategory")}: ${pick(useLang, catData, "label")}`,
      `${T(useLang, "itemRarity")}: ${T(useLang, item.rarity === "normal" ? "rarityNormal" : item.rarity === "magic" ? "rarityMagic" : "rarityRare")}`
    ];
    if (item.rarity === "rare") lines.push(item.rareName);
    lines.push(pick(useLang, base, "name"), "--------");
    if (item.quality > 0) lines.push(`${T(useLang, "itemQuality")}: +${item.quality}%`);
    if (item.sockets > 0) lines.push(`${T(useLang, "itemSockets")}: ${item.sockets}`);
    for (const cl of computedLines) lines.push(cl.label ? `${cl.label}: ${cl.val}` : cl.val);
    if (summaryStrip) lines.push(`${T(useLang, "physDps")}: ${summaryStrip.pdps} | ${T(useLang, "elemDps")}: ${summaryStrip.edps} | ${T(useLang, "totalDps")}: ${summaryStrip.tdps}`);
    lines.push("--------", `${T(useLang, "itemLevel")}: ${item.ilvl}`);

    if (item.implicits.length > 0) {
      lines.push("--------", ...item.implicits.map((imp) => formatLineText(pickLineTpl(imp, useLang), imp.values) + " (implicit)"));
    }
    if (item.corruptedEnchants.length > 0) {
      lines.push("--------");
      for (const ce of item.corruptedEnchants) {
        for (const ln of ce.lines) lines.push(formatLineText(pickLineTpl(ln, useLang), ln.values) + " (enchant)");
      }
    }
    if (mergedList.length > 0) {
      lines.push("--------", ...mergedList.map((m) =>
        m.text +
        (m.markType === "bloodmark" ? " (bloodmark)" : m.markType === "forgemark" ? " (forgemark)" : "") +
        (m.hasFractured ? " (fractured)" : "") +
        (m.hasDesecrated ? " (desecrated)" : "")
      ));
    }
    if (item.markReforged) lines.push("Mark Reforged (1.0 Forecast)");
    if (item.corrupted) lines.push("--------", T(useLang, item.doubleCorrupted ? "doubleCorruptedLabel" : "corruptedLabel"));
    if (item.sanctified) lines.push(T(useLang, "sanctifiedLabel"));
    return lines.join("\n");
  }

  global.PoE2CraftingEngine = {
    CURRENCIES, OMENS, ABYSS_BONES, ALDUR_RUNES, TEMPLE_CURRENCIES, QUALITY_CURRENCIES, SEASON10_CURRENCIES,
    CURRENCY_MAP, OMEN_MAP, BONE_MAP, ALDUR_MAP, TEMPLE_MAP, QUALITY_MAP, SEASON10_MAP,
    EXTRA_POOL_LABELS, ALDUR_POOL_KEYS,
    canSupportsQuality, loadCategory, rollValue, createInitialItem, cloneItem, instantiateMod,
    formatLineText, pickLineTpl, pickModName, pickObjField, formatModTagName,
    classifyEssence, matchesEssenceSearch, resolveLang, L,
    countAffixes, getMaxSlots, getSocketLimits, getEligibleAldurRunes, getActiveAldurPools, getBlockedFamilies,
    aggregateItemStats, computeItemProperties, punchSocket, clearSockets,
    applyAldurRune, applyQualityCurrency, applyTempleCurrency, applyCurrency, applyEssence,
    rollDesecratedChoices, addModDirectly, computePoolOdds, exportItemText,
    getMarkEquipGroup, checkSeason10MarkEligibility, applySeason10Mark, reforgeSeason10Marks, prepareSeason10DemoRare
  };
})(window);
