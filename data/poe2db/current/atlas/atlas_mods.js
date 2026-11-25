/**
 * PoE 2 词缀正则工具离线数据包（引路石 35 词缀 + 石板/碑牌 101 词缀 + PoE2DB 三语词典）
 * 所有词缀与名称严格逐字提取自 PoE2DB (https://poe2db.tw/)，由构建脚本自动对齐生成
 */
window.POE2_DATA = {"meta":{"version":"1.5.0","built":"2026-11-25","counts":{"waystone":35,"tablet":101},"source":"poe2db.tw (CN/TW/US verbatim official texts)"},"waystone":[{"id":"wt001","side":"prefix","tpl":{"cn":"怪物造成相当于伤害 (5—24)% 的额外火焰伤害","tw":"怪物造成等同於傷害(5—24)%的額外火焰傷害","en":"Monsters deal (5—24)% of Damage as Extra Fire"},"lines":{"cn":["怪物造成相当于伤害 (5—24)% 的额外火焰伤害"],"tw":["怪物造成等同於傷害(5—24)%的額外火焰傷害"],"en":["Monsters deal (5—24)% of Damage as Extra Fire"]},"rng":[5,24],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt002","side":"prefix","tpl":{"cn":"怪物造成相当于伤害 (5—24)% 的额外冰霜伤害","tw":"怪物造成等同於傷害(5—24)%的額外冰冷傷害","en":"Monsters deal (5—24)% of Damage as Extra Cold"},"lines":{"cn":["怪物造成相当于伤害 (5—24)% 的额外冰霜伤害"],"tw":["怪物造成等同於傷害(5—24)%的額外冰冷傷害"],"en":["Monsters deal (5—24)% of Damage as Extra Cold"]},"rng":[5,24],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt003","side":"prefix","tpl":{"cn":"怪物造成相当于伤害 (5—24)% 的额外闪电伤害","tw":"怪物造成等同於傷害(5—24)%的額外閃電傷害","en":"Monsters deal (5—24)% of Damage as Extra Lightning"},"lines":{"cn":["怪物造成相当于伤害 (5—24)% 的额外闪电伤害"],"tw":["怪物造成等同於傷害(5—24)%的額外閃電傷害"],"en":["Monsters deal (5—24)% of Damage as Extra Lightning"]},"rng":[5,24],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt004","side":"prefix","tpl":{"cn":"怪物伤害提高 (5—24)%","tw":"增加(5—24)%怪物傷害","en":"(5—24)% increased Monster Damage"},"lines":{"cn":["怪物伤害提高 (5—24)%"],"tw":["增加(5—24)%怪物傷害"],"en":["(5—24)% increased Monster Damage"]},"rng":[5,24],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt005","side":"prefix","tpl":{"cn":"怪物的攻击，施法，移动速度提高 (10—15)%","tw":"怪物增加(10—15)%攻擊、施放、移動速度","en":"Monsters have (10—15)% increased Attack, Cast and Movement Speed"},"lines":{"cn":["怪物的攻击，施法，移动速度提高 (10—15)%"],"tw":["怪物增加(10—15)%攻擊、施放、移動速度"],"en":["Monsters have (10—15)% increased Attack, Cast and Movement Speed"]},"rng":[10,15],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"unit":"%"},{"id":"wt006","side":"prefix","tpl":{"cn":"怪物暴击率提高 (80—300)% +(11—30)% 怪物暴击伤害加成","tw":"增加(80—300)%怪物的暴擊率 +(11—30)%怪物暴擊傷害加成","en":"Monsters have (80—300)% increased Critical Hit Chance Monsters have +(11—30)% Critical Damage Bonus"},"lines":{"cn":["怪物暴击率提高 (80—300)%","+(11—30)% 怪物暴击伤害加成"],"tw":["增加(80—300)%怪物的暴擊率","+(11—30)%怪物暴擊傷害加成"],"en":["Monsters have (80—300)% increased Critical Hit Chance","Monsters have +(11—30)% Critical Damage Bonus"]},"rng":[80,300],"hasRange":true,"ph":1,"tiers":4,"composite":true,"types":[],"unit":"%"},{"id":"wt007","side":"prefix","tpl":{"cn":"怪物生命总增 (10—30)%","tw":"(10—30)%更多怪物生命","en":"(10—30)% more Monster Life"},"lines":{"cn":["怪物生命总增 (10—30)%"],"tw":["(10—30)%更多怪物生命"],"en":["(10—30)% more Monster Life"]},"rng":[10,30],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt008","side":"suffix","tpl":{"cn":"+(20—40)% 怪物的元素抗性","tw":"+(20—40)%怪物元素抗性","en":"+(20—40)% Monster Elemental Resistances"},"lines":{"cn":["+(20—40)% 怪物的元素抗性"],"tw":["+(20—40)%怪物元素抗性"],"en":["+(20—40)% Monster Elemental Resistances"]},"rng":[20,40],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt009","side":"suffix","tpl":{"cn":"怪物具有护甲","tw":"怪物為裝甲的","en":"Monsters are Armoured"},"lines":{"cn":["怪物具有护甲"],"tw":["怪物為裝甲的"],"en":["Monsters are Armoured"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":[],"unit":null},{"id":"wt010","side":"suffix","tpl":{"cn":"怪物具有闪避","tw":"怪物為閃避的","en":"Monsters are Evasive"},"lines":{"cn":["怪物具有闪避"],"tw":["怪物為閃避的"],"en":["Monsters are Evasive"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":[],"unit":null},{"id":"wt011","side":"suffix","tpl":{"cn":"怪物将生命上限的 (12—25)% 转化为额外能量护盾上限","tw":"怪物獲得等同於最大生命(12—25)%的額外最大能量護盾","en":"Monsters gain (12—25)% of maximum Life as Extra maximum Energy Shield"},"lines":{"cn":["怪物将生命上限的 (12—25)% 转化为额外能量护盾上限"],"tw":["怪物獲得等同於最大生命(12—25)%的額外最大能量護盾"],"en":["Monsters gain (12—25)% of maximum Life as Extra maximum Energy Shield"]},"rng":[12,25],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"unit":"%"},{"id":"wt012","side":"prefix","tpl":{"cn":"怪物的击中有 (13—40)% 的几率造成中毒","tw":"怪物有(13—40)%機率在擊中時造成中毒","en":"Monsters have (13—40)% chance to Poison on Hit"},"lines":{"cn":["怪物的击中有 (13—40)% 的几率造成中毒"],"tw":["怪物有(13—40)%機率在擊中時造成中毒"],"en":["Monsters have (13—40)% chance to Poison on Hit"]},"rng":[13,40],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt013","side":"prefix","tpl":{"cn":"怪物的击中有 (5—25)% 的几率造成流血","tw":"怪物有(5—25)%機率在擊中時引起流血","en":"Monsters have (5—25)% chance to inflict Bleeding on Hit"},"lines":{"cn":["怪物的击中有 (5—25)% 的几率造成流血"],"tw":["怪物有(5—25)%機率在擊中時引起流血"],"en":["Monsters have (5—25)% chance to inflict Bleeding on Hit"]},"rng":[5,25],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt014","side":"suffix","tpl":{"cn":"怪物的异常状态阈值提高 (30—79)% 怪物的晕眩阈值提高 (30—79)%","tw":"增加(30—79)%怪物異常狀態門檻 增加(30—79)%怪物的暈眩門檻","en":"Monsters have (30—79)% increased Ailment Threshold Monsters have (30—79)% increased Stun Threshold"},"lines":{"cn":["怪物的异常状态阈值提高 (30—79)%","怪物的晕眩阈值提高 (30—79)%"],"tw":["增加(30—79)%怪物異常狀態門檻","增加(30—79)%怪物的暈眩門檻"],"en":["Monsters have (30—79)% increased Ailment Threshold","Monsters have (30—79)% increased Stun Threshold"]},"rng":[30,79],"hasRange":true,"ph":1,"tiers":4,"composite":true,"types":[],"unit":"%"},{"id":"wt015","side":"prefix","tpl":{"cn":"怪物粉碎护甲，相当于造成物理伤害的 (15—45)%","tw":"怪物破壞的護甲值等同於造成的(15—45)%物理傷害","en":"Monsters Break Armour equal to (15—45)% of Physical Damage dealt"},"lines":{"cn":["怪物粉碎护甲，相当于造成物理伤害的 (15—45)%"],"tw":["怪物破壞的護甲值等同於造成的(15—45)%物理傷害"],"en":["Monsters Break Armour equal to (15—45)% of Physical Damage dealt"]},"rng":[15,45],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt016","side":"prefix","tpl":{"cn":"怪物的命中值提高 (10—50)%","tw":"怪物增加(10—50)%命中值","en":"Monsters have (10—50)% increased Accuracy Rating"},"lines":{"cn":["怪物的命中值提高 (10—50)%"],"tw":["怪物增加(10—50)%命中值"],"en":["Monsters have (10—50)% increased Accuracy Rating"]},"rng":[10,50],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt017","side":"prefix","tpl":{"cn":"怪物造成相当于伤害 (5—24)% 的额外混沌伤害","tw":"怪物造成等同於傷害(5—24)%的額外混沌傷害","en":"Monsters deal (5—24)% of Damage as Extra Chaos"},"lines":{"cn":["怪物造成相当于伤害 (5—24)% 的额外混沌伤害"],"tw":["怪物造成等同於傷害(5—24)%的額外混沌傷害"],"en":["Monsters deal (5—24)% of Damage as Extra Chaos"]},"rng":[5,24],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt018","side":"prefix","tpl":{"cn":"怪物的晕眩积蓄提高 (50—110)%","tw":"增加(50—110)%怪物的暈眩累積","en":"Monsters have (50—110)% increased Stun Buildup"},"lines":{"cn":["怪物的晕眩积蓄提高 (50—110)%"],"tw":["增加(50—110)%怪物的暈眩累積"],"en":["Monsters have (50—110)% increased Stun Buildup"]},"rng":[50,110],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt019","side":"suffix","tpl":{"cn":"怪物的元素异常状态应用提高 (60—130)%","tw":"怪物增加(60—130)%元素異常狀態施加","en":"Monster have (60—130)% increased Elemental Ailment Application"},"lines":{"cn":["怪物的元素异常状态应用提高 (60—130)%"],"tw":["怪物增加(60—130)%元素異常狀態施加"],"en":["Monster have (60—130)% increased Elemental Ailment Application"]},"rng":[60,130],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt020","side":"prefix","tpl":{"cn":"怪物可以发射 2—3 个额外投射物","tw":"怪物發射2—3個額外投射物","en":"Monsters fire 2—3 additional Projectiles"},"lines":{"cn":["怪物可以发射 2—3 个额外投射物"],"tw":["怪物發射2—3個額外投射物"],"en":["Monsters fire 2—3 additional Projectiles"]},"rng":[2,3],"hasRange":true,"ph":1,"tiers":2,"composite":false,"types":[],"unit":null},{"id":"wt021","side":"suffix","tpl":{"cn":"怪物效果区域的提高 50%","tw":"增加怪物50%範圍效果","en":"Monsters have 50% increased Area of Effect"},"lines":{"cn":["怪物效果区域的提高 50%"],"tw":["增加怪物50%範圍效果"],"en":["Monsters have 50% increased Area of Effect"]},"rng":[50,50],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"unit":"%"},{"id":"wt022","side":"suffix","tpl":{"cn":"玩家周期性受到衰弱诅咒","tw":"玩家正在持續被衰弱詛咒","en":"Players are periodically Cursed with Enfeeble"},"lines":{"cn":["玩家周期性受到衰弱诅咒"],"tw":["玩家正在持續被衰弱詛咒"],"en":["Players are periodically Cursed with Enfeeble"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":[],"unit":null},{"id":"wt023","side":"suffix","tpl":{"cn":"玩家周期性受到时空锁链诅咒","tw":"玩家正在持續被時空鎖鏈詛咒","en":"Players are periodically Cursed with Temporal Chains"},"lines":{"cn":["玩家周期性受到时空锁链诅咒"],"tw":["玩家正在持續被時空鎖鏈詛咒"],"en":["Players are periodically Cursed with Temporal Chains"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":[],"unit":null},{"id":"wt024","side":"suffix","tpl":{"cn":"玩家周期性受到元素要害诅咒","tw":"玩家正在持續被元素要害詛咒","en":"Players are periodically Cursed with Elemental Weakness"},"lines":{"cn":["玩家周期性受到元素要害诅咒"],"tw":["玩家正在持續被元素要害詛咒"],"en":["Players are periodically Cursed with Elemental Weakness"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":[],"unit":null},{"id":"wt025","side":"suffix","tpl":{"cn":"区域内有点燃地面","tw":"區域中有多個點燃地面","en":"Area has patches of Ignited Ground"},"lines":{"cn":["区域内有点燃地面"],"tw":["區域中有多個點燃地面"],"en":["Area has patches of Ignited Ground"]},"rng":null,"hasRange":false,"ph":0,"tiers":4,"composite":false,"types":[],"unit":null},{"id":"wt026","side":"suffix","tpl":{"cn":"区域内有冰缓地面","tw":"區域會有多塊冰緩地面","en":"Area has patches of Chilled Ground"},"lines":{"cn":["区域内有冰缓地面"],"tw":["區域會有多塊冰緩地面"],"en":["Area has patches of Chilled Ground"]},"rng":null,"hasRange":false,"ph":0,"tiers":4,"composite":false,"types":[],"unit":null},{"id":"wt027","side":"suffix","tpl":{"cn":"区域内有感电地面","tw":"區域會有多塊感電地面","en":"Area has patches of Shocked Ground"},"lines":{"cn":["区域内有感电地面"],"tw":["區域會有多塊感電地面"],"en":["Area has patches of Shocked Ground"]},"rng":null,"hasRange":false,"ph":0,"tiers":4,"composite":false,"types":[],"unit":null},{"id":"wt028","side":"prefix","tpl":{"cn":"召唤生物的伤害穿透 (6—16)% 元素抗性","tw":"怪物傷害穿透(6—16)%元素抗性","en":"Monster Damage Penetrates (6—16)% Elemental Resistances"},"lines":{"cn":["召唤生物的伤害穿透 (6—16)% 元素抗性"],"tw":["怪物傷害穿透(6—16)%元素抗性"],"en":["Monster Damage Penetrates (6—16)% Elemental Resistances"]},"rng":[6,16],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt029","side":"suffix","tpl":{"cn":"玩家的抗性上限 (-10—-3)%","tw":"玩家(-10—-3)%最大抗性","en":"(-10—-3)% maximum Player Resistances"},"lines":{"cn":["玩家的抗性上限 (-10—-3)%"],"tw":["玩家(-10—-3)%最大抗性"],"en":["(-10—-3)% maximum Player Resistances"]},"rng":[-10,-3],"hasRange":true,"ph":1,"tiers":4,"composite":false,"types":[],"unit":"%"},{"id":"wt030","side":"suffix","tpl":{"cn":"玩家获得的药剂充能降低 (20—35)%","tw":"減少(20—35)%玩家獲得的藥劑充能","en":"Players gain (20—35)% reduced Flask Charges"},"lines":{"cn":["玩家获得的药剂充能降低 (20—35)%"],"tw":["減少(20—35)%玩家獲得的藥劑充能"],"en":["Players gain (20—35)% reduced Flask Charges"]},"rng":[20,35],"hasRange":true,"ph":1,"tiers":3,"composite":false,"types":[],"unit":"%"},{"id":"wt031","side":"suffix","tpl":{"cn":"玩家的生命和能量护盾总回复速度总降 (20—40)%","tw":"玩家擁有(20—40)%更少生命和能量護盾恢復率","en":"Players have (20—40)% less Recovery Rate of Life and Energy Shield"},"lines":{"cn":["玩家的生命和能量护盾总回复速度总降 (20—40)%"],"tw":["玩家擁有(20—40)%更少生命和能量護盾恢復率"],"en":["Players have (20—40)% less Recovery Rate of Life and Energy Shield"]},"rng":[20,40],"hasRange":true,"ph":1,"tiers":3,"composite":false,"types":[],"unit":"%"},{"id":"wt032","side":"suffix","tpl":{"cn":"玩家的冷却回复率总降 (15—30)%","tw":"玩家有(15—30)%更少冷卻時間恢復率","en":"Players have (15—30)% less Cooldown Recovery Rate"},"lines":{"cn":["玩家的冷却回复率总降 (15—30)%"],"tw":["玩家有(15—30)%更少冷卻時間恢復率"],"en":["Players have (15—30)% less Cooldown Recovery Rate"]},"rng":[15,30],"hasRange":true,"ph":1,"tiers":3,"composite":false,"types":[],"unit":"%"},{"id":"wt033","side":"suffix","tpl":{"cn":"怪物受到的暴击伤害降低 (15—30)%","tw":"怪物遭暴擊時，減少(15—30)%承受的額外傷害","en":"Monsters take (15—30)% reduced Extra Damage from Critical Hits"},"lines":{"cn":["怪物受到的暴击伤害降低 (15—30)%"],"tw":["怪物遭暴擊時，減少(15—30)%承受的額外傷害"],"en":["Monsters take (15—30)% reduced Extra Damage from Critical Hits"]},"rng":[15,30],"hasRange":true,"ph":1,"tiers":3,"composite":false,"types":[],"unit":"%"},{"id":"wt034","side":"suffix","tpl":{"cn":"怪物受到的诅咒效果总降 (20—50)%","tw":"怪物身上的詛咒具有(20—50)%更少效果","en":"(20—50)% less effect of Curses on Monsters"},"lines":{"cn":["怪物受到的诅咒效果总降 (20—50)%"],"tw":["怪物身上的詛咒具有(20—50)%更少效果"],"en":["(20—50)% less effect of Curses on Monsters"]},"rng":[20,50],"hasRange":true,"ph":1,"tiers":3,"composite":false,"types":[],"unit":"%"},{"id":"wt035","side":"suffix","tpl":{"cn":"稀有怪物额外具有 1 个词缀","tw":"稀有怪物有1個額外詞綴","en":"Rare Monsters have 1 additional Modifiers"},"lines":{"cn":["稀有怪物额外具有 1 个词缀"],"tw":["稀有怪物有1個額外詞綴"],"en":["Rare Monsters have 1 additional Modifiers"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"unit":null}],"tablet":[{"id":"wt-1","side":"prefix","modName":{"cn":"司库的","tw":"司庫的","en":"Treasurer's"},"tpl":{"cn":"地图包含 (2—3) 个额外的稀有宝箱","tw":"地圖內含有額外的(2—3)個稀有箱子","en":"Map contains (2—3) additional Rare Chests"},"lines":{"cn":["地图包含 (2—3) 个额外的稀有宝箱"],"tw":["地圖內含有額外的(2—3)個稀有箱子"],"en":["Map contains (2—3) additional Rare Chests"]},"rng":[2,3],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-2","side":"prefix","modName":{"cn":"结晶的","tw":"晶化的","en":"Crystallised"},"tpl":{"cn":"地图包含 1 个额外的精华","tw":"地圖內含有額外的1個精髓","en":"Map contains 1 additional Essences"},"lines":{"cn":["地图包含 1 个额外的精华"],"tw":["地圖內含有額外的1個精髓"],"en":["Map contains 1 additional Essences"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"essence","stackMax":null,"unit":null},{"id":"wt-3","side":"prefix","modName":{"cn":"召唤者的","tw":"召喚師的","en":"Summoner's"},"tpl":{"cn":"地图包含 1 个额外的召唤法阵","tw":"地圖內含有額外的1個召喚法陣","en":"Map contains 1 additional Summoning Circles"},"lines":{"cn":["地图包含 1 个额外的召唤法阵"],"tw":["地圖內含有額外的1個召喚法陣"],"en":["Map contains 1 additional Summoning Circles"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"summoning_circle","stackMax":null,"unit":null},{"id":"wt-4","side":"prefix","modName":{"cn":"睿智的","tw":"昇華的","en":"Elevated"},"tpl":{"cn":"地图内的经验值获取提高 (12—18)%","tw":"增加(12—18)%地圖內所獲取的經驗量","en":"(12—18)% increased Experience gain in Map"},"lines":{"cn":["地图内的经验值获取提高 (12—18)%"],"tw":["增加(12—18)%地圖內所獲取的經驗量"],"en":["(12—18)% increased Experience gain in Map"]},"rng":[12,18],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-5","side":"prefix","modName":{"cn":"多产的","tw":"多產的","en":"Breeding"},"tpl":{"cn":"地图内怪物群规模提高 (5—7)%","tw":"增加(5—7)%地圖內的怪物群大小","en":"(5—7)% increased Pack Size in Map"},"lines":{"cn":["地图内怪物群规模提高 (5—7)%"],"tw":["增加(5—7)%地圖內的怪物群大小"],"en":["(5—7)% increased Pack Size in Map"]},"rng":[5,7],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-6","side":"prefix","modName":{"cn":"阿兹莫里的","tw":"阿茲莫里的","en":"Azmeri's"},"tpl":{"cn":"地图包含 1 个额外的阿兹莫里之灵","tw":"地圖內含有1個額外阿茲莫里魂靈","en":"Map contains 1 additional Azmeri Spirits"},"lines":{"cn":["地图包含 1 个额外的阿兹莫里之灵"],"tw":["地圖內含有1個額外阿茲莫里魂靈"],"en":["Map contains 1 additional Azmeri Spirits"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"azmeri_spirit","stackMax":null,"unit":null},{"id":"wt-7","side":"prefix","modName":{"cn":"流放的","tw":"流亡的","en":"Exiled"},"tpl":{"cn":"地图内会出现 1 个额外的盗贼流放者","tw":"地圖內含有1名額外盜賊流亡者","en":"Map is inhabited by 1 additional Rogue Exiles"},"lines":{"cn":["地图内会出现 1 个额外的盗贼流放者"],"tw":["地圖內含有1名額外盜賊流亡者"],"en":["Map is inhabited by 1 additional Rogue Exiles"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"rogue_exile","stackMax":null,"unit":null},{"id":"wt-8","side":"prefix","modName":{"cn":"收藏家的","tw":"蒐集者的","en":"Collector's"},"tpl":{"cn":"地图内获取物品的稀有度提高 (8—12)%","tw":"增加(8—12)%地圖內找到的物品稀有度","en":"(8—12)% increased Rarity of Items found in Map"},"lines":{"cn":["地图内获取物品的稀有度提高 (8—12)%"],"tw":["增加(8—12)%地圖內找到的物品稀有度"],"en":["(8—12)% increased Rarity of Items found in Map"]},"rng":[8,12],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-9","side":"prefix","modName":{"cn":"浇灌的","tw":"擁擠的","en":"Teeming"},"tpl":{"cn":"地图内魔法怪物数量提高 (30—40)%","tw":"增加(30—40)%地圖含有的魔法怪物","en":"Map has (30—40)% increased Magic Monsters"},"lines":{"cn":["地图内魔法怪物数量提高 (30—40)%"],"tw":["增加(30—40)%地圖含有的魔法怪物"],"en":["Map has (30—40)% increased Magic Monsters"]},"rng":[30,40],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-10","side":"prefix","modName":{"cn":"盈满的","tw":"充滿的","en":"Brimming"},"tpl":{"cn":"地图内稀有怪物数量提高 (25—35)%","tw":"增加(25—35)%地圖含有的稀有怪物數量","en":"Map has (25—35)% increased number of Rare Monsters"},"lines":{"cn":["地图内稀有怪物数量提高 (25—35)%"],"tw":["增加(25—35)%地圖含有的稀有怪物數量"],"en":["Map has (25—35)% increased number of Rare Monsters"]},"rng":[25,35],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-11","side":"prefix","modName":{"cn":"丰厚的","tw":"慷慨的","en":"Bountiful"},"tpl":{"cn":"地图内找到的金币数量提高 (25—35)%","tw":"增加(25—35)%地圖內所獲取的金幣數量","en":"(25—35)% increased Gold found in Map"},"lines":{"cn":["地图内找到的金币数量提高 (25—35)%"],"tw":["增加(25—35)%地圖內所獲取的金幣數量"],"en":["(25—35)% increased Gold found in Map"]},"rng":[25,35],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-12","side":"prefix","modName":{"cn":"充满的","tw":"充盈的","en":"Abounding"},"tpl":{"cn":"地图上的怪物稀有度提高 (15—20)%","tw":"地圖增加(15—20)%怪物稀有度","en":"Map has (15—20)% increased Monster Rarity"},"lines":{"cn":["地图上的怪物稀有度提高 (15—20)%"],"tw":["地圖增加(15—20)%怪物稀有度"],"en":["Map has (15—20)% increased Monster Rarity"]},"rng":[15,20],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-13","side":"prefix","modName":{"cn":"挑战者的","tw":"挑戰者的","en":"Challenger's"},"tpl":{"cn":"怪物的强度提高 (10—15)%","tw":"增加(10—15)%怪物的效用","en":"Monsters have (10—15)% increased Effectiveness"},"lines":{"cn":["怪物的强度提高 (10—15)%"],"tw":["增加(10—15)%怪物的效用"],"en":["Monsters have (10—15)% increased Effectiveness"]},"rng":[10,15],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-14","side":"suffix","modName":{"cn":"争辩之","tw":"挑戰之","en":"of Contest"},"tpl":{"cn":"传奇怪物额外具有 1 个词缀","tw":"傳奇怪物會擁有1個額外的詞綴","en":"Unique Monsters have 1 additional Rare Modifiers"},"lines":{"cn":["传奇怪物额外具有 1 个词缀"],"tw":["傳奇怪物會擁有1個額外的詞綴"],"en":["Unique Monsters have 1 additional Rare Modifiers"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-15","side":"suffix","modName":{"cn":"鬼灵之","tw":"妖精之","en":"of Wisps"},"tpl":{"cn":"地图包含 (1—2) 个额外的阿兹莫里之灵","tw":"地圖內含有額外的(1—2)個阿茲莫里魂靈","en":"Map contains (1—2) additional Azmeri Spirits"},"lines":{"cn":["地图包含 (1—2) 个额外的阿兹莫里之灵"],"tw":["地圖內含有額外的(1—2)個阿茲莫里魂靈"],"en":["Map contains (1—2) additional Azmeri Spirits"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":"azmeri_spirit","stackMax":3,"unit":null},{"id":"wt-16","side":"suffix","modName":{"cn":"暗格之","tw":"隔間之","en":"of Compartments"},"tpl":{"cn":"地图包含 (1—2) 个额外的保险箱","tw":"地圖內含有額外的(1—2)個保險箱","en":"Map contains (1—2) additional Strongboxes"},"lines":{"cn":["地图包含 (1—2) 个额外的保险箱"],"tw":["地圖內含有額外的(1—2)個保險箱"],"en":["Map contains (1—2) additional Strongboxes"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":"strongbox","stackMax":3,"unit":null},{"id":"wt-17","side":"suffix","modName":{"cn":"水晶之","tw":"晶石之","en":"of Crystals"},"tpl":{"cn":"地图包含 (1—2) 个额外的精华","tw":"地圖內含有額外的(1—2)個精髓","en":"Map contains (1—2) additional Essences"},"lines":{"cn":["地图包含 (1—2) 个额外的精华"],"tw":["地圖內含有額外的(1—2)個精髓"],"en":["Map contains (1—2) additional Essences"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":"essence","stackMax":3,"unit":null},{"id":"wt-18","side":"suffix","modName":{"cn":"崇敬之","tw":"崇拜之","en":"of Worship"},"tpl":{"cn":"地图包含 (1—2) 个额外的神龛","tw":"地圖內含有額外的(1—2)個神殿","en":"Map contains (1—2) additional Shrines"},"lines":{"cn":["地图包含 (1—2) 个额外的神龛"],"tw":["地圖內含有額外的(1—2)個神殿"],"en":["Map contains (1—2) additional Shrines"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":"shrine","stackMax":3,"unit":null},{"id":"wt-19","side":"suffix","modName":{"cn":"金石家之","tw":"收藏家之","en":"of the Antiquarian"},"tpl":{"cn":"地图包含 1 个额外的保险箱","tw":"地圖內含有額外的1個保險箱","en":"Map contains 1 additional Strongboxes"},"lines":{"cn":["地图包含 1 个额外的保险箱"],"tw":["地圖內含有額外的1個保險箱"],"en":["Map contains 1 additional Strongboxes"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"strongbox","stackMax":null,"unit":null},{"id":"wt-20","side":"suffix","modName":{"cn":"奉献者之","tw":"奉獻之","en":"of the Devoted"},"tpl":{"cn":"地图包含 1 个额外的神龛","tw":"地圖內含有額外的1個神殿","en":"Map contains 1 additional Shrines"},"lines":{"cn":["地图包含 1 个额外的神龛"],"tw":["地圖內含有額外的1個神殿"],"en":["Map contains 1 additional Shrines"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"shrine","stackMax":null,"unit":null},{"id":"wt-21","side":"suffix","modName":{"cn":"保险箱之","tw":"保險箱之","en":"of Strongboxes"},"tpl":{"cn":"地图包含保险箱的几率提高 (70—100)%","tw":"增加(70—100)%地圖內有含有保險箱的機率","en":"Map has (70—100)% increased chance to contain Strongboxes"},"lines":{"cn":["地图包含保险箱的几率提高 (70—100)%"],"tw":["增加(70—100)%地圖內有含有保險箱的機率"],"en":["Map has (70—100)% increased chance to contain Strongboxes"]},"rng":[70,100],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"strongbox","stackMax":null,"unit":"%"},{"id":"wt-22","side":"suffix","modName":{"cn":"精华之","tw":"精髓之","en":"of the Essence"},"tpl":{"cn":"地图包含精华的几率提高 (70—100)%","tw":"增加(70—100)%地圖內含有精髓的機率","en":"Map has (70—100)% increased chance to contain Essences"},"lines":{"cn":["地图包含精华的几率提高 (70—100)%"],"tw":["增加(70—100)%地圖內含有精髓的機率"],"en":["Map has (70—100)% increased chance to contain Essences"]},"rng":[70,100],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"essence","stackMax":null,"unit":"%"},{"id":"wt-23","side":"suffix","modName":{"cn":"殿堂之","tw":"神殿之","en":"of Shrines"},"tpl":{"cn":"地图包含神龛的几率提高 (70—100)%","tw":"增加(70—100)%地圖內含有神殿的機率","en":"Map has (70—100)% increased chance to contain Shrines"},"lines":{"cn":["地图包含神龛的几率提高 (70—100)%"],"tw":["增加(70—100)%地圖內含有神殿的機率"],"en":["Map has (70—100)% increased chance to contain Shrines"]},"rng":[70,100],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"shrine","stackMax":null,"unit":"%"},{"id":"wt-24","side":"suffix","modName":{"cn":"召唤之","tw":"召喚之","en":"of the Summoning"},"tpl":{"cn":"地图包含召唤法阵的几率提高 (70—100)%","tw":"增加(70—100)%地圖內有含有召喚法陣的機率","en":"Map has (70—100)% increased chance to contain a Summoning Circle"},"lines":{"cn":["地图包含召唤法阵的几率提高 (70—100)%"],"tw":["增加(70—100)%地圖內有含有召喚法陣的機率"],"en":["Map has (70—100)% increased chance to contain a Summoning Circle"]},"rng":[70,100],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"summoning_circle","stackMax":null,"unit":"%"},{"id":"wt-25","side":"suffix","modName":{"cn":"空洞之","tw":"空殼之","en":"of Hollows"},"tpl":{"cn":"地图额外包含 1 个深渊","tw":"地圖內含有額外1道深淵","en":"Map contains 1 additional Abysses"},"lines":{"cn":["地图额外包含 1 个深渊"],"tw":["地圖內含有額外1道深淵"],"en":["Map contains 1 additional Abysses"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-26","side":"suffix","modName":{"cn":"部落之","tw":"部落之","en":"of the Horde"},"tpl":{"cn":"地图内的裂隙怪物密度提高 (5—15)%","tw":"增加(5—15)%地圖內裂痕的怪物群大小","en":"Breaches in Map have (5—15)% increased Pack Size"},"lines":{"cn":["地图内的裂隙怪物密度提高 (5—15)%"],"tw":["增加(5—15)%地圖內裂痕的怪物群大小"],"en":["Breaches in Map have (5—15)% increased Pack Size"]},"rng":[5,15],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-27","side":"suffix","modName":{"cn":"镜面之","tw":"鏡子之","en":"of Mirrors"},"tpl":{"cn":"地图内的惊悸迷雾生成的破溃之镜数量提高 (15—30)%","tw":"增加(15—30)%地圖內的譫妄生成破碎之鏡","en":"Delirium Fog in Map spawns (15—30)% increased Fracturing Mirrors"},"lines":{"cn":["地图内的惊悸迷雾生成的破溃之镜数量提高 (15—30)%"],"tw":["增加(15—30)%地圖內的譫妄生成破碎之鏡"],"en":["Delirium Fog in Map spawns (15—30)% increased Fracturing Mirrors"]},"rng":[15,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-28","side":"suffix","modName":{"cn":"永恒之","tw":"永恆之","en":"of Eternity"},"tpl":{"cn":"地图内的惊悸迷雾在消散前额外持续 (6—12) 秒","tw":"地圖內含有的譫妄迷霧會在消散前額外持續(6—12)秒","en":"Delirium Fog in Map lasts (6—12) additional seconds before dissipating"},"lines":{"cn":["地图内的惊悸迷雾在消散前额外持续 (6—12) 秒"],"tw":["地圖內含有的譫妄迷霧會在消散前額外持續(6—12)秒"],"en":["Delirium Fog in Map lasts (6—12) additional seconds before dissipating"]},"rng":[6,12],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-29","side":"suffix","modName":{"cn":"畏惧之","tw":"恐懼症之","en":"of Phobia"},"tpl":{"cn":"地图内的惊悸迷雾遭遇战生成传奇首领的几率总增 (15—30)%","tw":"地圖內的譫妄有(15—30)%更多機率生成傳奇頭目","en":"Delirium Encounters in Map are (15—30)% more likely to spawn Unique Bosses"},"lines":{"cn":["地图内的惊悸迷雾遭遇战生成传奇首领的几率总增 (15—30)%"],"tw":["地圖內的譫妄有(15—30)%更多機率生成傳奇頭目"],"en":["Delirium Encounters in Map are (15—30)% more likely to spawn Unique Bosses"]},"rng":[15,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-30","side":"suffix","modName":{"cn":"拟像之","tw":"幻像異界之","en":"of the Simulacrum"},"tpl":{"cn":"地图内的梦魇拟像裂片堆叠数量提高 (15—30)%","tw":"增加(15—30)%地圖內掉落的幻像斷片數量","en":"(15—30)% increased Stack size of Simulacrum Splinters found in Map"},"lines":{"cn":["地图内的梦魇拟像裂片堆叠数量提高 (15—30)%"],"tw":["增加(15—30)%地圖內掉落的幻像斷片數量"],"en":["(15—30)% increased Stack size of Simulacrum Splinters found in Map"]},"rng":[15,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-31","side":"suffix","modName":{"cn":"祈祷之","tw":"祈禱之","en":"of Prayers"},"tpl":{"cn":"地图内的驱灵祭坛可以额外重置恩典 (1—3) 次","tw":"地圖內的祭祀神壇可以額外重骰(1—3)次","en":"Ritual Altars in Map allow rerolling Favours (1—3) additional times"},"lines":{"cn":["地图内的驱灵祭坛可以额外重置恩典 (1—3) 次"],"tw":["地圖內的祭祀神壇可以額外重骰(1—3)次"],"en":["Ritual Altars in Map allow rerolling Favours (1—3) additional times"]},"rng":[1,3],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-32","side":"suffix","modName":{"cn":"密会之","tw":"邪教之","en":"of the Cult"},"tpl":{"cn":"地图内的驱灵祭坛再生怪物为稀有怪物的几率提高 (25—40)%","tw":"地圖內的祭祀神壇所復活的怪物增加(25—40)%為稀有怪物的機率","en":"Revived Monsters from Ritual Altars in Map have (25—40)% increased chance to be Rare"},"lines":{"cn":["地图内的驱灵祭坛再生怪物为稀有怪物的几率提高 (25—40)%"],"tw":["地圖內的祭祀神壇所復活的怪物增加(25—40)%為稀有怪物的機率"],"en":["Revived Monsters from Ritual Altars in Map have (25—40)% increased chance to be Rare"]},"rng":[25,40],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-33","side":"suffix","modName":{"cn":"古魔之","tw":"遠古惡魔之","en":"of Ancient Fiends"},"tpl":{"cn":"地图内的维金残片有 +(25—35)% 的几率添加一个额外的符文词缀","tw":"地圖中的維里西姆遺物擁有+(25—35)%機率添加一條額外符文詞綴","en":"Verisium Remnants have +(25—35)% chance to add an additional Runic Modifier in Map"},"lines":{"cn":["地图内的维金残片有 +(25—35)% 的几率添加一个额外的符文词缀"],"tw":["地圖中的維里西姆遺物擁有+(25—35)%機率添加一條額外符文詞綴"],"en":["Verisium Remnants have +(25—35)% chance to add an additional Runic Modifier in Map"]},"rng":[25,35],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-34","side":"suffix","modName":{"cn":"财宝之","tw":"珍寶之","en":"of Treasure"},"tpl":{"cn":"地图内的先祖秘藏包含 (1—2) 个埋藏的保险箱","tw":"地圖中的探險含有(1—2)個埋藏的保險箱","en":"Expeditions contain (1—2) buried Strongboxes in Map"},"lines":{"cn":["地图内的先祖秘藏包含 (1—2) 个埋藏的保险箱"],"tw":["地圖中的探險含有(1—2)個埋藏的保險箱"],"en":["Expeditions contain (1—2) buried Strongboxes in Map"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-35","side":"suffix","modName":{"cn":"过往之","tw":"過去之","en":"of the Past"},"tpl":{"cn":"地图内的先祖秘藏包含 (1—2) 个瓦尔遗物","tw":"地圖中的探險含有(1—2)個瓦爾遺物","en":"Expeditions contain (1—2) Vaal Relics in Map"},"lines":{"cn":["地图内的先祖秘藏包含 (1—2) 个瓦尔遗物"],"tw":["地圖中的探險含有(1—2)個瓦爾遺物"],"en":["Expeditions contain (1—2) Vaal Relics in Map"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-36","side":"suffix","modName":{"cn":"保存之","tw":"護存之","en":"of Preservation"},"tpl":{"cn":"地图内的先祖秘藏额外包含 (1—2) 个被坚冰包裹的首领","tw":"地圖中的探險含有(1—2)個額外封存於冰霜中的頭目","en":"Expeditions contain (1—2) Additional Bosses encased in ice in Map"},"lines":{"cn":["地图内的先祖秘藏额外包含 (1—2) 个被坚冰包裹的首领"],"tw":["地圖中的探險含有(1—2)個額外封存於冰霜中的頭目"],"en":["Expeditions contain (1—2) Additional Bosses encased in ice in Map"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-37","side":"suffix","modName":{"cn":"哨卫之","tw":"守望之","en":"of Sentinels"},"tpl":{"cn":"地图内的先祖秘藏额外包含 (1—2) 个维金哨兵","tw":"地圖中的探險含有(1—2)個額外維里西姆守望","en":"Expeditions contain (1—2) Additional Verisium Sentries in Map"},"lines":{"cn":["地图内的先祖秘藏额外包含 (1—2) 个维金哨兵"],"tw":["地圖中的探險含有(1—2)個額外維里西姆守望"],"en":["Expeditions contain (1—2) Additional Verisium Sentries in Map"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-38","side":"suffix","modName":{"cn":"符文之","tw":"符文之","en":"of Runes"},"tpl":{"cn":"地图内符文怪物标记的数量提高 (15—25)%","tw":"增加(15—25)%地圖內含有的符文怪物印記的數量","en":"Map contains (15—25)% increased number of Runic Monster Markers"},"lines":{"cn":["地图内符文怪物标记的数量提高 (15—25)%"],"tw":["增加(15—25)%地圖內含有的符文怪物印記的數量"],"en":["Map contains (15—25)% increased number of Runic Monster Markers"]},"rng":[15,25],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-39","side":"suffix","modName":{"cn":"知识之","tw":"知識之","en":"of Knowledge"},"tpl":{"cn":"地图内符文怪物掉落的先祖秘藏日志数量提高 (15—25)%","tw":"增加(15—25)%地圖內的探險事件所生成的符文怪物掉落的探險日誌數量","en":"(15—25)% increased Quantity of Expedition Logbooks dropped by Runic Monsters in Map"},"lines":{"cn":["地图内符文怪物掉落的先祖秘藏日志数量提高 (15—25)%"],"tw":["增加(15—25)%地圖內的探險事件所生成的符文怪物掉落的探險日誌數量"],"en":["(15—25)% increased Quantity of Expedition Logbooks dropped by Runic Monsters in Map"]},"rng":[15,25],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-40","side":"suffix","modName":{"cn":"纷扰之","tw":"迫害之","en":"of Persecution"},"tpl":{"cn":"地图内惊悸迷雾怪物的怪物群规模提高 (15—30)%","tw":"增加(15—30)%地圖內的譫妄怪物怪物群大小","en":"Delirium Monsters in Map have (15—30)% increased Pack Size"},"lines":{"cn":["地图内惊悸迷雾怪物的怪物群规模提高 (15—30)%"],"tw":["增加(15—30)%地圖內的譫妄怪物怪物群大小"],"en":["Delirium Monsters in Map have (15—30)% increased Pack Size"]},"rng":[15,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-41","side":"suffix","modName":{"cn":"无尽之","tw":"無休止之","en":"of the Unending"},"tpl":{"cn":"地图内惊悸迷雾消散速度减慢 (20—30)%","tw":"減少(20—30)%地圖內的譫妄迷霧消散速度","en":"Delirium Fog in Map dissipates (20—30)% slower"},"lines":{"cn":["地图内惊悸迷雾消散速度减慢 (20—30)%"],"tw":["減少(20—30)%地圖內的譫妄迷霧消散速度"],"en":["Delirium Fog in Map dissipates (20—30)% slower"]},"rng":[20,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-42","side":"suffix","modName":{"cn":"预兆之","tw":"徵兆之","en":"of Omens"},"tpl":{"cn":"地图内驱灵恩典为预兆的几率提高 (35—70)%","tw":"增加(35—70)%地圖內的祭祀神壇獎勵為預兆的機率","en":"Ritual Favours in Map have (35—70)% increased chance to be Omens"},"lines":{"cn":["地图内驱灵恩典为预兆的几率提高 (35—70)%"],"tw":["增加(35—70)%地圖內的祭祀神壇獎勵為預兆的機率"],"en":["Ritual Favours in Map have (35—70)% increased chance to be Omens"]},"rng":[35,70],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-43","side":"suffix","modName":{"cn":"请愿之","tw":"吸引之","en":"of the Appeal"},"tpl":{"cn":"地图内驱灵祭坛上延时的恩典重现速度加快 (25—40)%","tw":"地圖內的祭祀神壇所延遲的恩惠之物出現速度加快(25—40)%","en":"Favours Deferred at Ritual Altars in Map reappear (25—40)% sooner"},"lines":{"cn":["地图内驱灵祭坛上延时的恩典重现速度加快 (25—40)%"],"tw":["地圖內的祭祀神壇所延遲的恩惠之物出現速度加快(25—40)%"],"en":["Favours Deferred at Ritual Altars in Map reappear (25—40)% sooner"]},"rng":[25,40],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-44","side":"suffix","modName":{"cn":"养子之","tw":"棄兒之","en":"of the Foundling"},"tpl":{"cn":"地图内驱灵祭坛再生怪物为魔法怪物的几率提高 (35—70)%","tw":"地圖內的祭祀神壇所復活的怪物增加(35—70)%為魔法怪物的機率","en":"Revived Monsters from Ritual Altars in Map have (35—70)% increased chance to be Magic"},"lines":{"cn":["地图内驱灵祭坛再生怪物为魔法怪物的几率提高 (35—70)%"],"tw":["地圖內的祭祀神壇所復活的怪物增加(35—70)%為魔法怪物的機率"],"en":["Revived Monsters from Ritual Altars in Map have (35—70)% increased chance to be Magic"]},"rng":[35,70],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-46","side":"suffix","modName":{"cn":"爆破之","tw":"拆除之","en":"of the Demolition"},"tpl":{"cn":"地图内先祖秘藏爆炸范围提高 (5—10)%","tw":"增加(5—10)%地圖中探險炸藥的範圍效果","en":"(5—10)% increased Expedition Explosive Area of Effect in Map"},"lines":{"cn":["地图内先祖秘藏爆炸范围提高 (5—10)%"],"tw":["增加(5—10)%地圖中探險炸藥的範圍效果"],"en":["(5—10)% increased Expedition Explosive Area of Effect in Map"]},"rng":[5,10],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-48","side":"suffix","modName":{"cn":"牺牲之","tw":"犧牲之","en":"of Sacrifice"},"tpl":{"cn":"地图内在驱灵祭坛献祭怪物提供的贡品提高 (18—30)%","tw":"增加(18—30)%在地圖內的祭祀神壇所獻祭的怪物提供的貢禮數量","en":"Monsters Sacrificed at Ritual Altars in Map grant (18—30)% increased Tribute"},"lines":{"cn":["地图内在驱灵祭坛献祭怪物提供的贡品提高 (18—30)%"],"tw":["增加(18—30)%在地圖內的祭祀神壇所獻祭的怪物提供的貢禮數量"],"en":["Monsters Sacrificed at Ritual Altars in Map grant (18—30)% increased Tribute"]},"rng":[18,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-49","side":"suffix","modName":{"cn":"奉献之","tw":"奉獻之","en":"of Devotion"},"tpl":{"cn":"地图内在驱灵祭坛延时恩典消耗的贡品降低 (20—30)%","tw":"減少(20—30)%地圖內的祭祀神壇所需的貢禮數量","en":"Deferring Favours at Ritual Altars in Map costs (20—30)% reduced Tribute"},"lines":{"cn":["地图内在驱灵祭坛延时恩典消耗的贡品降低 (20—30)%"],"tw":["減少(20—30)%地圖內的祭祀神壇所需的貢禮數量"],"en":["Deferring Favours at Ritual Altars in Map costs (20—30)% reduced Tribute"]},"rng":[20,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-50","side":"suffix","modName":{"cn":"教义之","tw":"教條之","en":"of the Dogma"},"tpl":{"cn":"地图内在驱灵祭坛重置恩典消耗的贡品降低 (20—30)%","tw":"減少(20—30)%地圖內的祭祀神壇重骰所需的貢禮數量","en":"Rerolling Favours at Ritual Altars in Map costs (20—30)% reduced Tribute"},"lines":{"cn":["地图内在驱灵祭坛重置恩典消耗的贡品降低 (20—30)%"],"tw":["減少(20—30)%地圖內的祭祀神壇重骰所需的貢禮數量"],"en":["Rerolling Favours at Ritual Altars in Map costs (20—30)% reduced Tribute"]},"rng":[20,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-51","side":"suffix","modName":{"cn":"密教之","tw":"玄秘之","en":"of the Occult"},"tpl":{"cn":"地图内在驱灵祭坛重置恩典有 (3—6)% 几率不消耗贡品","tw":"地圖內的祭祀神壇有(3—6)%機率不消耗貢禮","en":"Favours Rerolled at Ritual Altars in Map have (3—6)% chance to cost no Tribute"},"lines":{"cn":["地图内在驱灵祭坛重置恩典有 (3—6)% 几率不消耗贡品"],"tw":["地圖內的祭祀神壇有(3—6)%機率不消耗貢禮"],"en":["Favours Rerolled at Ritual Altars in Map have (3—6)% chance to cost no Tribute"]},"rng":[3,6],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-52","side":"suffix","modName":{"cn":"制图师之","tw":"製圖師之","en":"of the Cartographer"},"tpl":{"cn":"地图内找到的引路石数量提高 (30—40)%","tw":"增加(30—40)%地圖內找到的換界石數量","en":"(30—40)% increased Quantity of Waystones found in Map"},"lines":{"cn":["地图内找到的引路石数量提高 (30—40)%"],"tw":["增加(30—40)%地圖內找到的換界石數量"],"en":["(30—40)% increased Quantity of Waystones found in Map"]},"rng":[30,40],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-53","side":"suffix","modName":{"cn":"古恶之","tw":"遠古邪惡之","en":"of Ancient Evil"},"tpl":{"cn":"地图内最先被开掘的 (1—2) 个符文怪物将为稀有怪物","tw":"地圖中前(1—2)名出土的符文怪物會是稀有怪物","en":"The first (1—2) unearthed Runic Monsters will be Rare Monsters in Map"},"lines":{"cn":["地图内最先被开掘的 (1—2) 个符文怪物将为稀有怪物"],"tw":["地圖中前(1—2)名出土的符文怪物會是稀有怪物"],"en":["The first (1—2) unearthed Runic Monsters will be Rare Monsters in Map"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-54","side":"suffix","modName":{"cn":"囤积之","tw":"囤物之","en":"of Hoards"},"tpl":{"cn":"地图首领掉落的物品数量提高 (13—20)%","tw":"增加(13—20)%地圖頭目的掉落物品數量","en":"(13—20)% increased Quantity of Items dropped by Map Bosses"},"lines":{"cn":["地图首领掉落的物品数量提高 (13—20)%"],"tw":["增加(13—20)%地圖頭目的掉落物品數量"],"en":["(13—20)% increased Quantity of Items dropped by Map Bosses"]},"rng":[13,20],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-55","side":"suffix","modName":{"cn":"财宝之","tw":"寶藏之","en":"of Treasure"},"tpl":{"cn":"地图首领掉落的物品稀有度提高 (35—60)%","tw":"增加(35—60)%地圖頭目掉落物品的稀有度","en":"(35—60)% increased Rarity of Items dropped by Map Bosses"},"lines":{"cn":["地图首领掉落的物品稀有度提高 (35—60)%"],"tw":["增加(35—60)%地圖頭目掉落物品的稀有度"],"en":["(35—60)% increased Rarity of Items dropped by Map Bosses"]},"rng":[35,60],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-56","side":"suffix","modName":{"cn":"路途之","tw":"路途之","en":"of Pathways"},"tpl":{"cn":"地图首领掉落的引路石数量提高 (18—30)%","tw":"增加(18—30)%地圖頭目掉落的換界石數量","en":"(18—30)% increased Quantity of Waystones dropped by Map Bosses"},"lines":{"cn":["地图首领掉落的引路石数量提高 (18—30)%"],"tw":["增加(18—30)%地圖頭目掉落的換界石數量"],"en":["(18—30)% increased Quantity of Waystones dropped by Map Bosses"]},"rng":[18,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-57","side":"suffix","modName":{"cn":"征服之","tw":"克服之","en":"of Conquering"},"tpl":{"cn":"地图首领提供的经验值提高 (40—80)%","tw":"增加(40—80)%地圖頭目賦予的經驗","en":"Map Bosses grant (40—80)% increased Experience"},"lines":{"cn":["地图首领提供的经验值提高 (40—80)%"],"tw":["增加(40—80)%地圖頭目賦予的經驗"],"en":["Map Bosses grant (40—80)% increased Experience"]},"rng":[40,80],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-58","side":"suffix","modName":{"cn":"重担之","tw":"承諾之","en":"of Undertaking"},"tpl":{"cn":"地图拥有 (1—2) 个额外的随机词缀","tw":"地圖有(1—2)個額外變動詞綴","en":"Map has (1—2) additional random Modifiers"},"lines":{"cn":["地图拥有 (1—2) 个额外的随机词缀"],"tw":["地圖有(1—2)個額外變動詞綴"],"en":["Map has (1—2) additional random Modifiers"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-59","side":"suffix","modName":{"cn":"分立之","tw":"裂變之","en":"of Schisms"},"tpl":{"cn":"地图有 (20—40)% 的几率额外包含四个深渊","tw":"地圖有(20—40)%機率包含4道額外深淵","en":"Map has (20—40)% chance to contain four additional Abysses"},"lines":{"cn":["地图有 (20—40)% 的几率额外包含四个深渊"],"tw":["地圖有(20—40)%機率包含4道額外深淵"],"en":["Map has (20—40)% chance to contain four additional Abysses"]},"rng":[20,40],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-60","side":"suffix","modName":{"cn":"万灵之","tw":"魂靈之","en":"of Spirits"},"tpl":{"cn":"地图有阿兹莫里之灵的几率提高 (70—100)%","tw":"增加(70—100)%地圖內有含有阿茲莫里魂靈的機率","en":"Map has (70—100)% increased chance to contain Azmeri Spirits"},"lines":{"cn":["地图有阿兹莫里之灵的几率提高 (70—100)%"],"tw":["增加(70—100)%地圖內有含有阿茲莫里魂靈的機率"],"en":["Map has (70—100)% increased chance to contain Azmeri Spirits"]},"rng":[70,100],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"azmeri_spirit","stackMax":null,"unit":"%"},{"id":"wt-61","side":"suffix","modName":{"cn":"流放者之","tw":"流亡者之","en":"of the Exile"},"tpl":{"cn":"地图有盗贼流放者的几率提高 (70—100)%","tw":"增加(70—100)%地圖內含有盜賊流亡者的機率","en":"Map has (70—100)% increased chance to contain Rogue Exiles"},"lines":{"cn":["地图有盗贼流放者的几率提高 (70—100)%"],"tw":["增加(70—100)%地圖內含有盜賊流亡者的機率"],"en":["Map has (70—100)% increased chance to contain Rogue Exiles"]},"rng":[70,100],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":[],"statGroup":"rogue_exile","stackMax":null,"unit":"%"},{"id":"wt-62","side":"suffix","modName":{"cn":"涨潮之","tw":"流動之","en":"of the Flow"},"tpl":{"cn":"地图中虫巢之血的掉落数量提高 (30—60)%","tw":"增加(30—60)%地圖內找到的巢裔之血數量","en":"(30—60)% increased Quantity of Hiveblood found in Map"},"lines":{"cn":["地图中虫巢之血的掉落数量提高 (30—60)%"],"tw":["增加(30—60)%地圖內找到的巢裔之血數量"],"en":["(30—60)% increased Quantity of Hiveblood found in Map"]},"rng":[30,60],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-63","side":"suffix","modName":{"cn":"指挥官之","tw":"指揮官之","en":"of the Commander"},"tpl":{"cn":"地图中的不稳定裂隙包含薛斯的元帅弗伦的几率提高 (20—50)%","tw":"增加(20—50)%地圖內的不穩定裂痕含有烈許的統領．弗倫的機率","en":"Unstable Breaches in Map have (20—50)% increased chance to contain Vruun, Marshal of Xesht"},"lines":{"cn":["地图中的不稳定裂隙包含薛斯的元帅弗伦的几率提高 (20—50)%"],"tw":["增加(20—50)%地圖內的不穩定裂痕含有烈許的統領．弗倫的機率"],"en":["Unstable Breaches in Map have (20—50)% increased chance to contain Vruun, Marshal of Xesht"]},"rng":[20,50],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-64","side":"suffix","modName":{"cn":"入侵之","tw":"入侵之","en":"of the Invasion"},"tpl":{"cn":"地图中的不稳定裂隙在稳定时会生成 (1—2) 个额外的稀有怪物","tw":"地圖內的不穩定裂痕會在穩定後生成(1—2)名額外稀有怪物","en":"Unstable Breaches in Map spawn (1—2) additional Rare Monsters when Stabilised"},"lines":{"cn":["地图中的不稳定裂隙在稳定时会生成 (1—2) 个额外的稀有怪物"],"tw":["地圖內的不穩定裂痕會在穩定後生成(1—2)名額外稀有怪物"],"en":["Unstable Breaches in Map spawn (1—2) additional Rare Monsters when Stabilised"]},"rng":[1,2],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-65","side":"suffix","modName":{"cn":"碎离之","tw":"碎裂之","en":"of Shattering"},"tpl":{"cn":"地图中的惊悸迷雾生成的破溃之镜碎片提高 (12—26)%","tw":"地圖中的譫妄迷霧增加(12—26)%裂鏡碎片的生成量","en":"Delirium Fog in Map spawns (12—26)% increased Mirror Shards"},"lines":{"cn":["地图中的惊悸迷雾生成的破溃之镜碎片提高 (12—26)%"],"tw":["地圖中的譫妄迷霧增加(12—26)%裂鏡碎片的生成量"],"en":["Delirium Fog in Map spawns (12—26)% increased Mirror Shards"]},"rng":[12,26],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-66","side":"suffix","modName":{"cn":"疯狂之","tw":"瘋狂之","en":"of Madness"},"tpl":{"cn":"地图中的惊悸迷雾使玩家的亢奋度提高 (15—30)%","tw":"地圖中的譫妄會增加(15—30)%玩家的譫妄程度","en":"Delirium Fog in Map applies (15—30)% increased Deliriousness to Players"},"lines":{"cn":["地图中的惊悸迷雾使玩家的亢奋度提高 (15—30)%"],"tw":["地圖中的譫妄會增加(15—30)%玩家的譫妄程度"],"en":["Delirium Fog in Map applies (15—30)% increased Deliriousness to Players"]},"rng":[15,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-67","side":"suffix","modName":{"cn":"骨化之","tw":"骨化之","en":"of Ossification"},"tpl":{"cn":"地图中的深渊掉落渎灵通货的几率提高 (20—30)%","tw":"增加(20—30)%來自地圖內深淵的褻瀆通貨掉落機率","en":"(20—30)% increased chance for Desecrated Currency from Abysses in Map"},"lines":{"cn":["地图中的深渊掉落渎灵通货的几率提高 (20—30)%"],"tw":["增加(20—30)%來自地圖內深淵的褻瀆通貨掉落機率"],"en":["(20—30)% increased chance for Desecrated Currency from Abysses in Map"]},"rng":[20,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-68","side":"suffix","modName":{"cn":"冠军之","tw":"勇士之","en":"of Champions"},"tpl":{"cn":"地图中的深渊额外生成 (2—3) 个稀有怪物","tw":"地圖內的深淵生成(2—3)隻額外稀有怪物","en":"(2—3) additional Rare Monsters are spawned from Abysses in Map"},"lines":{"cn":["地图中的深渊额外生成 (2—3) 个稀有怪物"],"tw":["地圖內的深淵生成(2—3)隻額外稀有怪物"],"en":["(2—3) additional Rare Monsters are spawned from Abysses in Map"]},"rng":[2,3],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-69","side":"suffix","modName":{"cn":"暗力之","tw":"幽暗之力之","en":"of Dark Power"},"tpl":{"cn":"地图中的深渊怪物带有深渊词缀的几率提高 (20—30)%","tw":"地圖內的深淵怪物增加(20—30)%擁有深淵詞綴的機率","en":"(20—30)% increased chance for Abyssal monsters in Map to have Abyssal Modifiers"},"lines":{"cn":["地图中的深渊怪物带有深渊词缀的几率提高 (20—30)%"],"tw":["地圖內的深淵怪物增加(20—30)%擁有深淵詞綴的機率"],"en":["(20—30)% increased chance for Abyssal monsters in Map to have Abyssal Modifiers"]},"rng":[20,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-70","side":"suffix","modName":{"cn":"珍宝之","tw":"寶藏之","en":"of Treasures"},"tpl":{"cn":"地图中的深渊巨坑有双倍几率有奖励","tw":"地圖內的深淵坑洞有兩倍機率含有獎勵","en":"Abyss Pits in Map are twice as likely to have Rewards"},"lines":{"cn":["地图中的深渊巨坑有双倍几率有奖励"],"tw":["地圖內的深淵坑洞有兩倍機率含有獎勵"],"en":["Abyss Pits in Map are twice as likely to have Rewards"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-71","side":"suffix","modName":{"cn":"部落之","tw":"群突之","en":"of the Horde"},"tpl":{"cn":"地图中的深渊生成的怪物数量提高 (20—30)%","tw":"增加(20—30)%地圖內的深淵生成的怪物數量","en":"Abysses in Map spawn (20—30)% increased Monsters"},"lines":{"cn":["地图中的深渊生成的怪物数量提高 (20—30)%"],"tw":["增加(20—30)%地圖內的深淵生成的怪物數量"],"en":["Abysses in Map spawn (20—30)% increased Monsters"]},"rng":[20,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-72","side":"suffix","modName":{"cn":"深处之","tw":"深淵之","en":"of the Depths"},"tpl":{"cn":"地图中的深渊通往绝望深渊的几率提高 (10—20)%","tw":"地圖內的深淵增加有(10—20)%機率前往無盡深淵","en":"Abysses in Map have (10—20)% increased chance to lead to an Abyssal Depths"},"lines":{"cn":["地图中的深渊通往绝望深渊的几率提高 (10—20)%"],"tw":["地圖內的深淵增加有(10—20)%機率前往無盡深淵"],"en":["Abysses in Map have (10—20)% increased chance to lead to an Abyssal Depths"]},"rng":[10,20],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-73","side":"suffix","modName":null,"tpl":{"cn":"地图中的瓦尔灯塔宝箱为稀有的几率提高 (30—60)%","tw":"增加(30—60)%地圖內瓦爾烽塔的寶箱為稀有的機率","en":"(30—60)% increased chance Vaal Beacon Chests are Rare in Map"},"lines":{"cn":["地图中的瓦尔灯塔宝箱为稀有的几率提高 (30—60)%"],"tw":["增加(30—60)%地圖內瓦爾烽塔的寶箱為稀有的機率"],"en":["(30—60)% increased chance Vaal Beacon Chests are Rare in Map"]},"rng":[30,60],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["temple"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-74","side":"suffix","modName":null,"tpl":{"cn":"地图中的瓦尔灯塔附近出现 1 个额外怪物群落","tw":"地圖內的瓦爾烽塔周遭擁有額外1群怪物","en":"1 extra packs of Monsters around Vaal Beacons in Map"},"lines":{"cn":["地图中的瓦尔灯塔附近出现 1 个额外怪物群落"],"tw":["地圖內的瓦爾烽塔周遭擁有額外1群怪物"],"en":["1 extra packs of Monsters around Vaal Beacons in Map"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":["temple"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-75","side":"suffix","modName":null,"tpl":{"cn":"地图中的瓦尔灯塔附近的怪物群落规模提高 (10—30)%","tw":"增加(10—30)%地圖內瓦爾烽塔周遭的怪物群大小","en":"(10—30)% increased Pack Size for Monsters around Vaal Beacons in Map"},"lines":{"cn":["地图中的瓦尔灯塔附近的怪物群落规模提高 (10—30)%"],"tw":["增加(10—30)%地圖內瓦爾烽塔周遭的怪物群大小"],"en":["(10—30)% increased Pack Size for Monsters around Vaal Beacons in Map"]},"rng":[10,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["temple"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-76","side":"suffix","modName":null,"tpl":{"cn":"地图中的瓦尔灯塔附近有 (30—60)% 的几率出现一个额外怪物群落","tw":"有(30—60)%機率擁有一群額外怪物在地圖內的瓦爾烽塔周遭","en":"(30—60)% chance for an extra packs of Monsters around Vaal Beacons in Map"},"lines":{"cn":["地图中的瓦尔灯塔附近有 (30—60)% 的几率出现一个额外怪物群落"],"tw":["有(30—60)%機率擁有一群額外怪物在地圖內的瓦爾烽塔周遭"],"en":["(30—60)% chance for an extra packs of Monsters around Vaal Beacons in Map"]},"rng":[30,60],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["temple"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-77","side":"suffix","modName":null,"tpl":{"cn":"地图中的瓦尔灯塔召唤额外怪物的几率提高 (25—50)%","tw":"增加(25—50)%地圖內的瓦爾烽塔召喚額外怪物的機率","en":"(25—50)% increased chance Vaal Beacons summon additional Monsters in Map"},"lines":{"cn":["地图中的瓦尔灯塔召唤额外怪物的几率提高 (25—50)%"],"tw":["增加(25—50)%地圖內的瓦爾烽塔召喚額外怪物的機率"],"en":["(25—50)% increased chance Vaal Beacons summon additional Monsters in Map"]},"rng":[25,50],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["temple"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-78","side":"suffix","modName":{"cn":"血肉之","tw":"血肉之","en":"of the Flesh"},"tpl":{"cn":"地图中掉落的孕育赠礼有 (10—30)% 的几率高一级","tw":"地圖內有(10—30)%機率掉落高一等級的胎贈","en":"Wombgifts have (10—30)% chance to drop one Level higher in Map"},"lines":{"cn":["地图中掉落的孕育赠礼有 (10—30)% 的几率高一级"],"tw":["地圖內有(10—30)%機率掉落高一等級的胎贈"],"en":["Wombgifts have (10—30)% chance to drop one Level higher in Map"]},"rng":[10,30],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-79","side":"suffix","modName":{"cn":"手之","tw":"手之","en":"of the Hand"},"tpl":{"cn":"地图中稀有裂隙怪物的效能提高 (5—20)%","tw":"增加(5—20)%地圖內稀有裂痕怪物的效用","en":"(5—20)% increased Effectiveness of Rare Breach Monsters in Map"},"lines":{"cn":["地图中稀有裂隙怪物的效能提高 (5—20)%"],"tw":["增加(5—20)%地圖內稀有裂痕怪物的效用"],"en":["(5—20)% increased Effectiveness of Rare Breach Monsters in Map"]},"rng":[5,20],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-80","side":"suffix","modName":{"cn":"形态之","tw":"形體之","en":"of the Form"},"tpl":{"cn":"地图中孕育赠礼的掉落数量提高 (30—60)%","tw":"增加(30—60)%地圖內找到的胎贈數量","en":"(30—60)% increased Quantity of Wombgifts found in Map"},"lines":{"cn":["地图中孕育赠礼的掉落数量提高 (30—60)%"],"tw":["增加(30—60)%地圖內找到的胎贈數量"],"en":["(30—60)% increased Quantity of Wombgifts found in Map"]},"rng":[30,60],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-81","side":"suffix","modName":{"cn":"凝时之","tw":"冰凍時間之","en":"of Freeze Time"},"tpl":{"cn":"击败地图内的稀有怪物使惊悸迷雾之镜的倒计时暂停 (3—5) 秒","tw":"地圖內的譫妄迷霧在擊殺稀有怪物時會暫停(3—5)秒","en":"Slaying Rare Monsters in Map pauses the Delirium Mirror Timer for (3—5) seconds"},"lines":{"cn":["击败地图内的稀有怪物使惊悸迷雾之镜的倒计时暂停 (3—5) 秒"],"tw":["地圖內的譫妄迷霧在擊殺稀有怪物時會暫停(3—5)秒"],"en":["Slaying Rare Monsters in Map pauses the Delirium Mirror Timer for (3—5) seconds"]},"rng":[3,5],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-83","side":"suffix","modName":{"cn":"疾升之","tw":"升勢之","en":"of Escalation"},"tpl":{"cn":"每关闭一个巨坑，深渊怪物的强度提高 (8—12)%，最高可达 100%","tw":"每有一個已關閉的坑洞，增加(8—12)%深淵怪物效用，最多100%","en":"Abyssal Monsters have (8—12)% increased Effectiveness for each closed Pit, up to 100%"},"lines":{"cn":["每关闭一个巨坑，深渊怪物的强度提高 (8—12)%，最高可达 100%"],"tw":["每有一個已關閉的坑洞，增加(8—12)%深淵怪物效用，最多100%"],"en":["Abyssal Monsters have (8—12)% increased Effectiveness for each closed Pit, up to 100%"]},"rng":[8,12],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-84","side":"suffix","modName":{"cn":"维金之","tw":"維里西姆之","en":"of Verisium"},"tpl":{"cn":"维金残片生成的怪物掉落的维金数量提高 (15—25)%","tw":"增加(15—25)%維里西姆遺物怪物掉落的維里西姆","en":"Monsters from Verisium Remnants drop (15—25)% increased Verisium"},"lines":{"cn":["维金残片生成的怪物掉落的维金数量提高 (15—25)%"],"tw":["增加(15—25)%維里西姆遺物怪物掉落的維里西姆"],"en":["Monsters from Verisium Remnants drop (15—25)% increased Verisium"]},"rng":[15,25],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-85","side":"suffix","modName":null,"tpl":{"cn":"有 (10—25)% 的几率为地图增加一个瓦尔灯塔传奇怪物","tw":"有(10—25)%機率為地圖新增一名瓦爾烽塔傳奇怪物","en":"(10—25)% chance to add a Vaal Beacon Unique Monster to the Map"},"lines":{"cn":["有 (10—25)% 的几率为地图增加一个瓦尔灯塔传奇怪物"],"tw":["有(10—25)%機率為地圖新增一名瓦爾烽塔傳奇怪物"],"en":["(10—25)% chance to add a Vaal Beacon Unique Monster to the Map"]},"rng":[10,25],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["temple"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-86","side":"suffix","modName":null,"tpl":{"cn":"有 (5—10)% 的几率从地图中的瓦尔灯塔获得一个额外的水晶","tw":"有(5—10)%機率從地圖內的瓦爾烽塔獲得額外一個額外水晶","en":"(5—10)% chance to gain an additional Crystal from Vaal Beacons in Map"},"lines":{"cn":["有 (5—10)% 的几率从地图中的瓦尔灯塔获得一个额外的水晶"],"tw":["有(5—10)%機率從地圖內的瓦爾烽塔獲得額外一個額外水晶"],"en":["(5—10)% chance to gain an additional Crystal from Vaal Beacons in Map"]},"rng":[5,10],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["temple"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-87","side":"suffix","modName":{"cn":"暴击之","tw":"力量之","en":"of Power"},"tpl":{"cn":"地图内的先祖秘藏怪物稀有度提高 (15—25)%","tw":"增加(15—25)%地圖中的探險怪物稀有度","en":"(15—25)% increased Expedition Monster Rarity in Map"},"lines":{"cn":["地图内的先祖秘藏怪物稀有度提高 (15—25)%"],"tw":["增加(15—25)%地圖中的探險怪物稀有度"],"en":["(15—25)% increased Expedition Monster Rarity in Map"]},"rng":[15,25],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-88","side":"suffix","modName":{"cn":"残片之","tw":"遺物之","en":"of Remnants"},"tpl":{"cn":"先祖秘藏有 +(30—40)% 的溢出几率包含一个额外的维金残片","tw":"探險擁有+(30—40)%滿溢機率含有額外一個維里西姆遺物","en":"Expeditions have +(30—40)% Surpassing chance to contain an additional Verisium Remnant"},"lines":{"cn":["先祖秘藏有 +(30—40)% 的溢出几率包含一个额外的维金残片"],"tw":["探險擁有+(30—40)%滿溢機率含有額外一個維里西姆遺物"],"en":["Expeditions have +(30—40)% Surpassing chance to contain an additional Verisium Remnant"]},"rng":[30,40],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-89","side":"suffix","modName":{"cn":"双子之","tw":"雙子之","en":"of Twins"},"tpl":{"cn":"地图内的先祖秘藏有 +(30—40)% 的溢出几率复制符文怪物","tw":"探險擁有+(30—40)%滿溢機率複製地圖中的符文怪物","en":"Expeditions have +(30—40)% Surpassing chance to Duplicate Runic Monsters in Map"},"lines":{"cn":["地图内的先祖秘藏有 +(30—40)% 的溢出几率复制符文怪物"],"tw":["探險擁有+(30—40)%滿溢機率複製地圖中的符文怪物"],"en":["Expeditions have +(30—40)% Surpassing chance to Duplicate Runic Monsters in Map"]},"rng":[30,40],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["expedition"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-u1","side":"suffix","unique":true,"modName":{"cn":"狩猎时节","tw":"狩獵季節","en":"Season of the Hunt"},"tpl":{"cn":"地图首领被阿兹莫里之灵追猎","tw":"地圖頭目會遭到阿茲莫里魂靈狩獵","en":"Map Bosses are Hunted by Azmeri Spirits"},"lines":{"cn":["地图首领被阿兹莫里之灵追猎"],"tw":["地圖頭目會遭到阿茲莫里魂靈狩獵"],"en":["Map Bosses are Hunted by Azmeri Spirits"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":["overseer"],"statGroup":"azmeri_spirit","stackMax":null,"unit":null},{"id":"wt-u2","side":"suffix","unique":true,"modName":{"cn":"残酷霸权","tw":"殘暴霸權","en":"Cruel Hegemony"},"tpl":{"cn":"地图首领额外具有 1 个词缀","tw":"地圖頭目會擁有1個額外的詞綴","en":"Map Bosses have 1 additional Modifiers"},"lines":{"cn":["地图首领额外具有 1 个词缀"],"tw":["地圖頭目會擁有1個額外的詞綴"],"en":["Map Bosses have 1 additional Modifiers"]},"rng":[1,1],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":["overseer"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-117","side":"suffix","unique":true,"modName":{"cn":"围困瓦尔克拉斯","tw":"被圍攻的瓦爾克拉斯","en":"Wraeclast Besieged"},"tpl":{"cn":"地图中的裂隙巢穴拥有 (2—5) 个额外的裂隙虫群怪物波次","tw":"地圖內的裂痕巢穴擁有額外(2—5)波巢裔怪物","en":"Breach Hives in Map have (2—5) additional waves of Hiveborn Monsters"},"lines":{"cn":["地图中的裂隙巢穴拥有 (2—5) 个额外的裂隙虫群怪物波次"],"tw":["地圖內的裂痕巢穴擁有額外(2—5)波巢裔怪物"],"en":["Breach Hives in Map have (2—5) additional waves of Hiveborn Monsters"]},"rng":[2,5],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-u3","side":"suffix","unique":true,"modName":{"cn":"围困瓦尔克拉斯","tw":"被圍攻的瓦爾克拉斯","en":"Wraeclast Besieged"},"tpl":{"cn":"地图内的裂隙怪物密度降低 (-10—20)%","tw":"減少(-10—20)%地圖內裂痕的怪物群大小","en":"Breaches in Map have (-10—20)% reduced Pack Size"},"lines":{"cn":["地图内的裂隙怪物密度降低 (-10—20)%"],"tw":["減少(-10—20)%地圖內裂痕的怪物群大小"],"en":["Breaches in Map have (-10—20)% reduced Pack Size"]},"rng":[-10,20],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-u4","side":"suffix","unique":true,"modName":{"cn":"围困瓦尔克拉斯","tw":"被圍攻的瓦爾克拉斯","en":"Wraeclast Besieged"},"tpl":{"cn":"地图中的不稳定裂隙在计时器填满后，会额外延迟 120 秒塌缩","tw":"地圖內的不穩定裂痕會在計時器填滿後再過額外120秒才崩塌","en":"Unstable Breaches in Map take 120 additional seconds to collapse after timer is filled"},"lines":{"cn":["地图中的不稳定裂隙在计时器填满后，会额外延迟 120 秒塌缩"],"tw":["地圖內的不穩定裂痕會在計時器填滿後再過額外120秒才崩塌"],"en":["Unstable Breaches in Map take 120 additional seconds to collapse after timer is filled"]},"rng":[120,120],"hasRange":false,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-118","side":"suffix","unique":true,"modName":{"cn":"围困瓦尔克拉斯","tw":"被圍攻的瓦爾克拉斯","en":"Wraeclast Besieged"},"tpl":{"cn":"地图中的不稳定裂隙在稳定时会生成 (2—5) 个额外的稀有怪物","tw":"地圖內的不穩定裂痕會在穩定後生成(2—5)名額外稀有怪物","en":"Unstable Breaches in Map spawn (2—5) additional Rare Monsters when Stabilised"},"lines":{"cn":["地图中的不稳定裂隙在稳定时会生成 (2—5) 个额外的稀有怪物"],"tw":["地圖內的不穩定裂痕會在穩定後生成(2—5)名額外稀有怪物"],"en":["Unstable Breaches in Map spawn (2—5) additional Rare Monsters when Stabilised"]},"rng":[2,5],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["breach"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-119","side":"suffix","unique":true,"modName":{"cn":"万里晴空","tw":"蒼空","en":"Clear Skies"},"tpl":{"cn":"你地图中的惊悸迷雾永不消散","tw":"你地圖內的譫妄迷霧永不消散","en":"Delirium Fog in your Maps never dissipates"},"lines":{"cn":["你地图中的惊悸迷雾永不消散"],"tw":["你地圖內的譫妄迷霧永不消散"],"en":["Delirium Fog in your Maps never dissipates"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-120","side":"suffix","unique":true,"modName":{"cn":"万里晴空","tw":"蒼空","en":"Clear Skies"},"tpl":{"cn":"地图中的惊悸迷雾使玩家的亢奋度降低 (-10—10)%","tw":"地圖中的譫妄會增加(-10—10)%玩家的譫妄程度","en":"Delirium Fog in Map applies (-10—10)% reduced Deliriousness to Players"},"lines":{"cn":["地图中的惊悸迷雾使玩家的亢奋度降低 (-10—10)%"],"tw":["地圖中的譫妄會增加(-10—10)%玩家的譫妄程度"],"en":["Delirium Fog in Map applies (-10—10)% reduced Deliriousness to Players"]},"rng":[-10,10],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["delirium"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-u5","side":"suffix","unique":true,"modName":{"cn":"信念的自由","tw":"信仰的自由","en":"Freedom of Faith"},"tpl":{"cn":"区域内的驱灵祭坛恩典消耗的贡品提高 (10—15)%","tw":"增加(10—15)%區域中祭祀神壇恩惠的貢禮消耗","en":"Favours at Ritual Altars in Area costs (10—15)% increased Tribute"},"lines":{"cn":["区域内的驱灵祭坛恩典消耗的贡品提高 (10—15)%"],"tw":["增加(10—15)%區域中祭祀神壇恩惠的貢禮消耗"],"en":["Favours at Ritual Altars in Area costs (10—15)% increased Tribute"]},"rng":[10,15],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":"%"},{"id":"wt-121","side":"suffix","unique":true,"modName":{"cn":"信念的自由","tw":"信仰的自由","en":"Freedom of Faith"},"tpl":{"cn":"你地图中的驱灵祭坛可以重置恩典的次数变为两倍","tw":"在你地圖內祭祀神壇的重骰恩賜之物次數變為雙倍","en":"Can Reroll Favours at Ritual Altars in your Maps twice as many times"},"lines":{"cn":["你地图中的驱灵祭坛可以重置恩典的次数变为两倍"],"tw":["在你地圖內祭祀神壇的重骰恩賜之物次數變為雙倍"],"en":["Can Reroll Favours at Ritual Altars in your Maps twice as many times"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":["ritual"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-u6","side":"suffix","unique":true,"modName":{"cn":"宏伟计划","tw":"偉大計劃","en":"The Grand Project"},"tpl":{"cn":"只能应用于先驱高塔地图 完成高塔后解锁所有附近的地图","tw":"只能使用在先行者高塔地圖 完成高塔會使周遭地圖改為可進入狀態","en":"Can only be applied to Precursor Tower Maps Completing the Tower makes all nearby Maps accessible"},"lines":{"cn":["只能应用于先驱高塔地图","完成高塔后解锁所有附近的地图"],"tw":["只能使用在先行者高塔地圖","完成高塔會使周遭地圖改為可進入狀態"],"en":["Can only be applied to Precursor Tower Maps","Completing the Tower makes all nearby Maps accessible"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":true,"types":["irradiated"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-u7","side":"suffix","unique":true,"modName":{"cn":"乐园幻象","tw":"天堂異象","en":"Visions of Paradise"},"tpl":{"cn":"若地图之前未受能量辐照，完成地图时改为增加能量辐照","tw":"如果地圖先前不為照耀狀態，完成地圖會改為使地圖被照耀","en":"If Map was not previously Irradiated, completing Map adds Irradiation instead"},"lines":{"cn":["若地图之前未受能量辐照，完成地图时改为增加能量辐照"],"tw":["如果地圖先前不為照耀狀態，完成地圖會改為使地圖被照耀"],"en":["If Map was not previously Irradiated, completing Map adds Irradiation instead"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":["irradiated"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-u8","side":"suffix","unique":true,"modName":{"cn":"疆域主宰","tw":"主宰領地","en":"Mastered Domain"},"tpl":{"cn":"地图也视为水域地图","tw":"地圖同時被視為水域地圖","en":"Map also counts as a Water Map"},"lines":{"cn":["地图也视为水域地图"],"tw":["地圖同時被視為水域地圖"],"en":["Map also counts as a Water Map"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":["irradiated"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-u9","side":"suffix","unique":true,"modName":{"cn":"无常因果","tw":"始料未及的後果","en":"Unforeseen Consequences"},"tpl":{"cn":"地图被深渊侵占","tw":"區域被深淵佔據","en":"Map is overrun by the Abyssal"},"lines":{"cn":["地图被深渊侵占"],"tw":["區域被深淵佔據"],"en":["Map is overrun by the Abyssal"]},"rng":null,"hasRange":false,"ph":0,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":null},{"id":"wt-122","side":"suffix","unique":true,"modName":{"cn":"无常因果","tw":"始料未及的後果","en":"Unforeseen Consequences"},"tpl":{"cn":"地图额外包含 (14—18) 个深渊","tw":"地圖內含有額外(14—18)道深淵","en":"Map contains (14—18) additional Abysses"},"lines":{"cn":["地图额外包含 (14—18) 个深渊"],"tw":["地圖內含有額外(14—18)道深淵"],"en":["Map contains (14—18) additional Abysses"]},"rng":[14,18],"hasRange":true,"ph":1,"tiers":1,"composite":false,"types":["abyss"],"statGroup":null,"stackMax":null,"unit":null}]};

window.POE2_I18N = {
  "meta": {
    "langs": [
      {
        "id": "cn"
      },
      {
        "id": "tw"
      },
      {
        "id": "en"
      }
    ]
  },
  "t": {
    "brand": {
      "cn": "PoE 2 正则工具",
      "tw": "PoE 2 正則工具",
      "en": "PoE 2 Regex Tool"
    },
    "brandSub": {
      "cn": "流放之路 2 · 词缀正则生成器",
      "tw": "流亡黯道 2 · 詞綴正則產生器",
      "en": "Path of Exile 2 · Affix Regex Builder"
    },
    "tabWaystone": {
      "cn": "引路石",
      "tw": "換界石",
      "en": "Waystones"
    },
    "tabTablet": {
      "cn": "石板",
      "tw": "碑牌",
      "en": "Tablets"
    },
    "language": {
      "cn": "输出语言",
      "tw": "輸出語言",
      "en": "Output language"
    },
    "tiersMerged": {
      "cn": "已合并该词缀的多个阶级，数值区间为全部阶级的并集",
      "tw": "已合併該詞綴的多個階級，數值區間為全部階級的聯集",
      "en": "Multiple tiers merged; range spans all of them"
    },
    "noteLoose": {
      "cn": "已放宽部分数值上限以适配长度限制",
      "tw": "已放寬部分數值上限以符合長度限制",
      "en": "Numbers relaxed to fit the character limit"
    },
    "noteShort": {
      "cn": "已自动压缩为无碰撞短词缀以适配 250 字符限制",
      "tw": "已自動壓縮為無碰撞短詞綴以符合 250 字元限制",
      "en": "Auto-shortened to collision-free fragments within 250 chars"
    },
    "noteMini": {
      "cn": "已精简为最短区别片段",
      "tw": "已精簡為最短區別片段",
      "en": "Reduced to minimal distinguishing fragments"
    },
    "noteOver": {
      "cn": "超出 250 字符上限，请减少条件",
      "tw": "超出 250 字元上限，請減少條件",
      "en": "Over the 250-character limit — remove some conditions"
    },
    "noteUnready": {
      "cn": "区间无效或未就绪",
      "tw": "區間無效或未就緒",
      "en": "Invalid range or unresolved"
    },
    "searchPlaceholder": {
      "cn": "例如：点燃、阿兹莫里、抗性、生命",
      "tw": "例如：點燃、阿茲莫里、抗性、生命",
      "en": "e.g. ignite, Azmeri, resistance, life"
    },
    "prefix": {
      "cn": "前缀",
      "tw": "前綴",
      "en": "Prefix"
    },
    "suffix": {
      "cn": "后缀",
      "tw": "後綴",
      "en": "Suffix"
    },
    "uniqueGroup": {
      "cn": "传奇石板词缀",
      "tw": "傳奇碑牌詞綴",
      "en": "Unique Tablet Modifiers"
    },
    "exclusiveTag": {
      "cn": "专属",
      "tw": "專屬",
      "en": "Exclusive"
    },
    "uniqueTag": {
      "cn": "传奇",
      "tw": "傳奇",
      "en": "Unique"
    },
    "matchAll": {
      "cn": "满足全部",
      "tw": "滿足全部",
      "en": "Match all"
    },
    "matchAny": {
      "cn": "满足任一",
      "tw": "滿足任一",
      "en": "Match any"
    },
    "clearSelected": {
      "cn": "清空选中词缀",
      "tw": "清空選中詞綴",
      "en": "Clear selected"
    },
    "clearAll": {
      "cn": "清空当前条件",
      "tw": "清空目前條件",
      "en": "Clear all"
    },
    "copyRegex": {
      "cn": "复制正则",
      "tw": "複製正則",
      "en": "Copy regex"
    },
    "copied": {
      "cn": "已复制到剪贴板",
      "tw": "已複製到剪貼簿",
      "en": "Copied to clipboard"
    },
    "copyFailed": {
      "cn": "复制失败，请手动选择文本",
      "tw": "複製失敗，請手動選取文字",
      "en": "Copy failed — select the text manually"
    },
    "copyDisabled": {
      "cn": "存在无效条件，暂不可复制",
      "tw": "存在無效條件，暫不可複製",
      "en": "Invalid conditions — copy disabled"
    },
    "affixFilter": {
      "cn": "词缀筛选",
      "tw": "詞綴篩選",
      "en": "Affix filters"
    },
    "selectedConditions": {
      "cn": "已选条件",
      "tw": "已選條件",
      "en": "Selected conditions"
    },
    "tradePreview": {
      "cn": "游戏 / 市集搜索框",
      "tw": "遊戲 / 交易站搜尋框",
      "en": "Stash / Trade search box"
    },
    "noConditions": {
      "cn": "还没有筛选条件。",
      "tw": "尚未設定篩選條件。",
      "en": "No conditions selected yet."
    },
    "resultCount": {
      "cn": "个词缀",
      "tw": "個詞綴",
      "en": "affixes"
    },
    "saved": {
      "cn": "✓ 已自动保存设置（数据来自 PoE2DB）",
      "tw": "✓ 已自動儲存設定（資料來自 PoE2DB）",
      "en": "✓ Saved locally (PoE2DB verbatim)"
    },
    "saveBlocked": {
      "cn": "浏览器未允许保存；本次操作仍有效",
      "tw": "瀏覽器未允許儲存；本次操作仍有效",
      "en": "Local storage unavailable; this session still works"
    },
    "include": {
      "cn": "包含",
      "tw": "包含",
      "en": "Include"
    },
    "exclude": {
      "cn": "排除",
      "tw": "排除",
      "en": "Exclude"
    },
    "atLeast": {
      "cn": "至少",
      "tw": "至少",
      "en": "At least"
    },
    "atMost": {
      "cn": "至多",
      "tw": "至多",
      "en": "At most"
    },
    "unlimited": {
      "cn": "不限",
      "tw": "不限",
      "en": "Any"
    },
    "referenceRange": {
      "cn": "单条范围",
      "tw": "單條範圍",
      "en": "Roll range"
    },
    "stackMaxHint": {
      "cn": "同效可叠至",
      "tw": "同效可疊至",
      "en": "Stacks up to"
    },
    "removedIncompatible": {
      "cn": "已自动移除不适用于当前石板类型的专属词缀",
      "tw": "已自動移除不適用於目前碑牌類型的專屬詞綴",
      "en": "Removed exclusive mods incompatible with selected tablet type"
    },
    "selectTypeFirst": {
      "cn": "请先选择石板类型",
      "tw": "請先選擇碑牌類型",
      "en": "Choose a tablet type first"
    },
    "tabletType": {
      "cn": "石板类型",
      "tw": "碑牌類型",
      "en": "Tablet type"
    },
    "rarity": {
      "cn": "稀有度",
      "tw": "稀有度",
      "en": "Rarity"
    },
    "rarityNormal": {
      "cn": "普通",
      "tw": "普通",
      "en": "Normal"
    },
    "rarityMagic": {
      "cn": "魔法",
      "tw": "魔法",
      "en": "Magic"
    },
    "rarityRare": {
      "cn": "稀有",
      "tw": "稀有",
      "en": "Rare"
    },
    "rarityUnique": {
      "cn": "传奇",
      "tw": "傳奇",
      "en": "Unique"
    },
    "revivesLabel": {
      "cn": "复活次数",
      "tw": "可用的復活數",
      "en": "Revives Available"
    },
    "corrupted": {
      "cn": "腐化状态",
      "tw": "腐化狀態",
      "en": "Corrupted"
    },
    "corruptedYes": {
      "cn": "已腐化",
      "tw": "已汙染",
      "en": "Corrupted"
    },
    "corruptedNo": {
      "cn": "未腐化",
      "tw": "未汙染",
      "en": "Not corrupted"
    },
    "any": {
      "cn": "不限",
      "tw": "不限",
      "en": "Any"
    },
    "tierHeading": {
      "cn": "引路石阶级",
      "tw": "換界石階級",
      "en": "Waystone tier"
    },
    "tierHint": {
      "cn": "筛选引路石的阶级范围（1–16 阶）。",
      "tw": "篩選換界石的階級範圍（階級 1–16）。",
      "en": "Filter by waystone tier (Tier 1–16)."
    },
    "tierMin": {
      "cn": "最低阶级",
      "tw": "最低階級",
      "en": "Min tier"
    },
    "tierMax": {
      "cn": "最高阶级",
      "tw": "最高階級",
      "en": "Max tier"
    },
    "summaryHeading": {
      "cn": "引路石效果筛选",
      "tw": "換界石效果篩選",
      "en": "Waystone effect filters"
    },
    "summaryHint": {
      "cn": "以下数值对应引路石面板上的各项属性（按 PoE2DB 官方译名）。填写最低值后自动生成。",
      "tw": "以下數值對應換界石面板上的各項屬性（依 PoE2DB 官方譯名）。填寫最低值後自動產生。",
      "en": "Matches Waystone header stats (PoE2DB terminology). Enter minimum values."
    },
    "summaryClear": {
      "cn": "清除",
      "tw": "清除",
      "en": "Clear"
    },
    "smEff": {
      "cn": "怪物强度",
      "tw": "怪物效用",
      "en": "Monster Effectiveness"
    },
    "smItemRarity": {
      "cn": "物品稀有度",
      "tw": "物品稀有度",
      "en": "Item Rarity"
    },
    "smMonsterRarity": {
      "cn": "怪物稀有度",
      "tw": "怪物稀有度",
      "en": "Monster Rarity"
    },
    "smPackSize": {
      "cn": "怪物群规模",
      "tw": "怪群大小",
      "en": "Pack Size"
    },
    "smWaystone": {
      "cn": "引路石掉落几率",
      "tw": "換界石掉落機率",
      "en": "Waystone Drop Chance"
    },
    "hotHeading": {
      "cn": "热门词缀",
      "tw": "熱門詞綴",
      "en": "Hot affixes"
    },
    "favHeading": {
      "cn": "最爱",
      "tw": "最愛",
      "en": "Favorites"
    },
    "favPlaceholder": {
      "cn": "给这组条件起个名字",
      "tw": "給這組條件起個名字",
      "en": "Name this preset"
    },
    "favSave": {
      "cn": "保存",
      "tw": "儲存",
      "en": "Save"
    },
    "favEmpty": {
      "cn": "还没有保存的偏好。配置好条件后点「保存」。",
      "tw": "尚未儲存偏好。設定好條件後點「儲存」。",
      "en": "No saved presets yet."
    },
    "favDelete": {
      "cn": "删除",
      "tw": "刪除",
      "en": "Delete"
    },
    "favApplied": {
      "cn": "已应用偏好：",
      "tw": "已套用偏好：",
      "en": "Applied preset: "
    },
    "favNameRequired": {
      "cn": "请先填写名称",
      "tw": "請先填寫名稱",
      "en": "Enter a name first"
    },
    "favSaved": {
      "cn": "已保存到最爱",
      "tw": "已儲存至最愛",
      "en": "Saved to favorites"
    },
    "favCountUnit": {
      "cn": "条条件",
      "tw": "條條件",
      "en": "conditions"
    },
    "hvHeading": {
      "cn": "高价值石板词缀",
      "tw": "高價值碑牌詞綴",
      "en": "High-value tablet affixes"
    },
    "hvHint": {
      "cn": "按价格筛选高价值碑牌组合，每条给出独立正则。价格参考《流放2 备忘录》国际服报价。",
      "tw": "依價格篩選高價值碑牌組合，每條給出獨立正則。價格參考《流放2 備忘錄》國際服報價。",
      "en": "Filter high-value tablet combos by price; each row gives its own regex. Prices reference the \"PoE 2 Memo\" international listing."
    },
    "hvHintSource": {
      "cn": "数据来源于",
      "tw": "資料來源於",
      "en": "Data from"
    },
    "hvPrice": {
      "cn": "最低价格",
      "tw": "最低價格",
      "en": "Min price"
    },
    "hvEmpty": {
      "cn": "没有符合条件的高价值词缀。",
      "tw": "沒有符合條件的高價值詞綴。",
      "en": "No matching high-value affixes."
    },
    "hvTypeAny": {
      "cn": "全部类型",
      "tw": "全部類型",
      "en": "All types"
    },
    "hvCopy": {
      "cn": "复制",
      "tw": "複製",
      "en": "Copy"
    },
    "hvTotal": {
      "cn": "个结果",
      "tw": "個結果",
      "en": "results"
    },
    "selfTestFail": {
      "cn": "自测失败",
      "tw": "自測失敗",
      "en": "Self-test failed"
    }
  },
  "tabletTypes": [
    {
      "id": "irradiated",
      "cn": "能量辐照石板",
      "tw": "輻照碑牌",
      "en": "Irradiated Tablet",
      "stem": {
        "cn": "能量辐照",
        "tw": "輻照",
        "en": "Irradiated"
      }
    },
    {
      "id": "ritual",
      "cn": "驱灵仪式石板",
      "tw": "祭祀碑牌",
      "en": "Ritual Tablet",
      "stem": {
        "cn": "驱灵仪式",
        "tw": "祭祀",
        "en": "Ritual"
      }
    },
    {
      "id": "delirium",
      "cn": "惊悸迷雾石板",
      "tw": "譫妄碑牌",
      "en": "Delirium Tablet",
      "stem": {
        "cn": "惊悸迷雾",
        "tw": "譫妄",
        "en": "Delirium"
      }
    },
    {
      "id": "breach",
      "cn": "裂隙石板",
      "tw": "裂痕碑牌",
      "en": "Breach Tablet",
      "stem": {
        "cn": "裂隙",
        "tw": "裂痕",
        "en": "Breach"
      }
    },
    {
      "id": "abyss",
      "cn": "深渊石板",
      "tw": "深淵碑牌",
      "en": "Abyss Tablet",
      "stem": {
        "cn": "深渊",
        "tw": "深淵",
        "en": "Abyss"
      }
    },
    {
      "id": "temple",
      "cn": "神庙石板",
      "tw": "神廟碑牌",
      "en": "Temple Tablet",
      "stem": {
        "cn": "神庙",
        "tw": "神廟",
        "en": "Temple"
      }
    },
    {
      "id": "overseer",
      "cn": "霸主石板",
      "tw": "總督碑牌",
      "en": "Overseer Tablet",
      "stem": {
        "cn": "霸主",
        "tw": "總督",
        "en": "Overseer"
      }
    },
    {
      "id": "expedition",
      "cn": "先祖秘藏石板",
      "tw": "探險碑牌",
      "en": "Expedition Tablet",
      "stem": {
        "cn": "先祖秘藏",
        "tw": "探險",
        "en": "Expedition"
      }
    }
  ],
  "anchors": {
    "rarityLine": {
      "cn": "稀有度",
      "tw": "稀有度",
      "en": "Rarity"
    },
    "normal": {
      "cn": "普通",
      "tw": "普通",
      "en": "Normal"
    },
    "magic": {
      "cn": "魔法",
      "tw": "魔法",
      "en": "Magic"
    },
    "rare": {
      "cn": "稀有",
      "tw": "稀有",
      "en": "Rare"
    },
    "unique": {
      "cn": "传奇",
      "tw": "傳奇",
      "en": "Unique"
    },
    "corrupted": {
      "cn": "(已|被)腐化",
      "tw": "已[汙污]染",
      "en": "Corrupted"
    }
  }
};
