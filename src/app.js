/**
 * 流放之路 2 做装模拟器 — 前端交互控制器
 * 支持三语切换、工作台三栏模式、仿真通货仓库页、奥杜尔秘符、神庙通货、深渊渎灵与精华分类筛选
 */
(function () {
  "use strict";

  const E = window.PoE2CraftingEngine;
  const I18N = window.PoE2I18n;
  const CATALOG = window.POE2_CATALOG || [];
  const TAG_I18N = window.POE2_TAG_I18N || { cn: window.POE2_TAG_NAMES || {}, tw: {}, us: {} };

  const state = {
    lang: "us",
    mode: "workbench",
    slug: "Bows",
    catData: null,
    item: null,
    history: [],
    redoStack: [],
    activeOmens: new Set(),
    keepOmens: false,
    viewMode: "merged",
    altHeld: false,
    craftTab: "currency",
    stashTab: "abyss",
    essenceFilter: "all",
    essenceSearch: "",
    stashEssenceFilter: "all",
    stashEssenceSearch: "",
    poolTab: "normal",
    extraPoolKeys: [],
    genFilter: "all",
    filterIlvl: true,
    activeTag: "",
    modSearch: "",
    expandedFamilies: new Set(),
    revealState: null,
    cursorTool: null,
    season10Enabled: (() => {
      try {
        const v = localStorage.getItem("poe2_season10_open");
        return v === null ? true : v === "1";
      } catch (_) {
        return true;
      }
    })(),
    activeMarkId: null,
    costs: {},
    logs: []
  };

  const EL_IDS = [
    "btnModeWorkbench", "btnModeStash", "btnModeRegex", "btnPoe2dbRef", "craftingTopActions",
    "baseToolbar", "season10Box", "btnToggleSeason10", "s10ToggleLabel", "s10CollapsedHint",
    "s10Body", "s10DemoActions", "btnS10Demo64", "btnS10Demo84", "s10ForgeGrid", "s10BloodGrid", "s10ActionBar",
    "workbenchView", "stashView", "regexView",
    "categorySelect", "baseSelect", "ilvlInput", "qualityInput", "socketStatusBadge",
    "btnPunchSocket", "btnClearSockets", "aldurBar", "currencyGrid", "omenGrid",
    "desecrateOmenGrid", "keepOmensToggle", "essenceSearch", "essenceList", "desecrateBones",
    "revealBox", "revealChoices", "btnRerollReveal", "templeList", "feedbackBanner",
    "itemCardMount", "affixCounter", "prefixCountBadge", "suffixCountBadge", "prefixSlots",
    "suffixSlots", "mergeCountBadge", "mergeBreakdown", "costPills", "craftLog",
    "poolStatsBadge", "poolTabs", "btnExtraPool", "btnExtraPool2", "modSearchInput",
    "filterIlvlToggle", "tagFilterBar", "modPoolList", "btnViewMerged", "btnViewSplit",
    "altHintPill", "btnUndo", "btnRedo", "btnResetItem", "btnCopyItem", "btnClearLog",
    "stashActiveToolLabel", "btnDropCursorTool", "stashLeftOrbs", "stashTopOrbs",
    "stashItemPedestal", "pedestalGlow", "pedestalIcon", "pedestalSockets", "stashRightTools",
    "stashAbyssGrid", "stashOmenGrid", "stashKeepOmensToggle", "stashEssenceSearch",
    "stashEssenceGrid", "stashTempleGrid", "stashAldurGrid", "stashRevealBox",
    "stashRevealChoices", "btnStashRerollReveal", "stashItemCardMount", "stashMergeBadge",
    "stashMergeBreakdown", "stashCostPills", "stashCraftLog", "btnStashClearLog"
  ];
  const el = Object.fromEntries(EL_IDS.map((id) => [id, document.getElementById(id)]));

  const tr = (key) => I18N.t(state.lang, key);
  const loc = (obj, field) => I18N.pickLoc(state.lang, obj, field);
  const locTag = (code) => (TAG_I18N[state.lang] && TAG_I18N[state.lang][code]) || (TAG_I18N.cn && TAG_I18N.cn[code]) || "";
  const escapeHtml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const DICT_BY_KIND = {
    currency: E.CURRENCY_MAP,
    quality: E.QUALITY_MAP,
    temple: E.TEMPLE_MAP,
    aldur: E.ALDUR_MAP,
    bone: E.BONE_MAP,
    omen: E.OMEN_MAP,
    season10: E.SEASON10_MAP
  };

  const STASH_LEFT_IDS = [
    "transmute", "greater_transmute", "perfect_transmute",
    "aug", "greater_aug", "perfect_aug",
    "regal", "greater_regal", "perfect_regal",
    "chaos", "greater_chaos", "perfect_chaos",
    "exalt", "greater_exalt", "perfect_exalt"
  ];
  const STASH_TOP_IDS = ["alc", "vaal", "annul", "divine", "fracture"];

  let feedbackTimer = null;

  function showFeedback(msg, type) {
    if (feedbackTimer) { clearTimeout(feedbackTimer); feedbackTimer = null; }
    if (!msg) {
      el.feedbackBanner.innerHTML = "";
      el.feedbackBanner.classList.add("hidden");
      return;
    }
    el.feedbackBanner.className = "status-feedback " + (type || "success");
    el.feedbackBanner.innerHTML = `
      <span class="feedback-text">${escapeHtml(msg)}</span>
      <button type="button" class="feedback-close" id="btnDismissFeedback" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    const dismissBtn = document.getElementById("btnDismissFeedback");
    if (dismissBtn) dismissBtn.addEventListener("click", () => showFeedback("", ""));
    feedbackTimer = setTimeout(() => showFeedback("", ""), 5500);
  }
  window.PoE2ShowFeedback = showFeedback;

  function showRareUpgradePrompt(msg, modDef, poolName) {
    if (feedbackTimer) { clearTimeout(feedbackTimer); feedbackTimer = null; }
    el.feedbackBanner.className = "status-feedback confirm";
    el.feedbackBanner.innerHTML = `
      <span>${escapeHtml(msg)}</span>
      <span class="feedback-actions">
        <button type="button" class="btn btn-sm btn-primary" id="btnConfirmRareUpgrade">${escapeHtml(tr("btnConfirmUpgradeRare"))}</button>
        <button type="button" class="btn btn-sm btn-ghost" id="btnCancelRareUpgrade">${escapeHtml(tr("btnCancelAction"))}</button>
      </span>
    `;
    const confirmBtn = document.getElementById("btnConfirmRareUpgrade");
    const cancelBtn = document.getElementById("btnCancelRareUpgrade");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const nextRes = E.addModDirectly(state.catData, state.item, modDef, poolName, state.lang, { allowRareUpgrade: true });
        commitCraftingResult(state.item, nextRes, null);
      });
    }
    if (cancelBtn) cancelBtn.addEventListener("click", () => showFeedback("", ""));
  }

  function pushHistory(prevItem) {
    state.history.push(E.cloneItem(prevItem));
    if (state.history.length > 60) state.history.shift();
    state.redoStack = [];
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    el.btnUndo.disabled = state.history.length === 0;
    el.btnRedo.disabled = state.redoStack.length === 0;
  }

  function makeCostSpec(kind, idOrObj) {
    if (!idOrObj) return null;
    if (kind === "essence") {
      return { key: "essence:" + idOrObj.id, getLabel: (l) => E.pickModName(idOrObj, l) };
    }
    const id = String(idOrObj);
    const def = DICT_BY_KIND[kind] && DICT_BY_KIND[kind][id];
    return { key: `${kind}:${id}`, getLabel: (l) => (def ? E.pickObjField(def, "name", l) : id) };
  }

  function recordCost(costSpec, usedOmens) {
    const bump = (spec) => {
      if (!state.costs[spec.key]) state.costs[spec.key] = { count: 0, getLabel: spec.getLabel };
      state.costs[spec.key].count += 1;
    };
    if (costSpec) bump(typeof costSpec === "string" ? { key: "raw:" + costSpec, getLabel: () => costSpec } : costSpec);
    for (const oid of (usedOmens || [])) bump(makeCostSpec("omen", oid));
  }

  function consumeUsedOmens(usedOmens) {
    if (state.keepOmens || !usedOmens || usedOmens.length === 0) return;
    for (const oid of usedOmens) state.activeOmens.delete(oid);
  }

  function addLog(textOrFn) {
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    state.logs.unshift({ time, render: typeof textOrFn === "function" ? textOrFn : () => String(textOrFn || "") });
    if (state.logs.length > 60) state.logs.pop();
  }

  function clearCostAndLogs() {
    state.costs = {};
    state.logs = [];
    renderCostAndLogs();
  }

  function formatModRanges(mod, wrapParen) {
    return (mod.lines || []).map((l) =>
      E.formatLineText(E.pickLineTpl(l, state.lang), (l.ranges || []).map((r) =>
        wrapParen ? (r[0] === r[1] ? r[0] : `(${r[0]}–${r[1]})`) : `${r[0]}–${r[1]}`
      ))
    );
  }

  function applyStaticI18n() {
    document.documentElement.lang = state.lang === "us" ? "en" : state.lang === "tw" ? "zh-TW" : "zh-CN";
    document.title = tr("appTitle") + " — PoE2DB";
    document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = tr(n.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach((n) => { n.setAttribute("placeholder", tr(n.getAttribute("data-i18n-ph"))); });
    document.querySelectorAll("[data-lang]").forEach((b) => { b.classList.toggle("active", b.getAttribute("data-lang") === state.lang); });
    el.btnPoe2dbRef.href = `https://poe2db.tw/${state.lang}/${state.slug}#ModifiersCalc`;
  }

  function initCategorySelect() {
    const groups = new Map();
    for (const c of CATALOG) {
      const catName = loc(c, "category");
      if (!groups.has(catName)) groups.set(catName, []);
      groups.get(catName).push(c);
    }
    el.categorySelect.innerHTML = "";
    for (const [catName, list] of groups.entries()) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = catName;
      for (const entry of list) {
        const opt = document.createElement("option");
        opt.value = entry.slug;
        opt.textContent = loc(entry, "label");
        optgroup.appendChild(opt);
      }
      el.categorySelect.appendChild(optgroup);
    }
    el.categorySelect.value = state.slug;
  }

  function renderBaseSelectOptions() {
    if (!state.catData) return;
    const currentIdx = el.baseSelect.value || "0";
    el.baseSelect.innerHTML = "";
    state.catData.bases.forEach((b, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = loc(b, "name");
      el.baseSelect.appendChild(opt);
    });
    el.baseSelect.value = currentIdx;
  }

  async function selectCategory(slug) {
    state.slug = slug;
    el.btnPoe2dbRef.href = `https://poe2db.tw/${state.lang}/${slug}#ModifiersCalc`;
    try {
      const catData = await E.loadCategory(slug);
      state.catData = catData;
      renderBaseSelectOptions();

      let defaultBaseIdx = 0;
      if (slug === "Bows") {
        const ds = catData.bases.findIndex((b) => b.id === "Dualstring_Bow");
        if (ds >= 0) defaultBaseIdx = ds;
      } else if (catData.bases.length > 5) {
        defaultBaseIdx = Math.min(catData.bases.length - 1, Math.floor(catData.bases.length * 0.7));
      }
      el.baseSelect.value = String(defaultBaseIdx);

      const canQual = E.canSupportsQuality(catData);
      el.qualityInput.disabled = !canQual;
      if (!canQual) el.qualityInput.value = "0";
      else if (el.qualityInput.value === "0") el.qualityInput.value = "20";

      const extraKeys = Object.keys(E.EXTRA_POOL_LABELS).filter((k) => catData.pools && catData.pools[k] && catData.pools[k].length > 0);
      state.extraPoolKeys = extraKeys;
      [el.btnExtraPool, el.btnExtraPool2].forEach((btn, i) => {
        if (extraKeys[i]) {
          btn.textContent = E.EXTRA_POOL_LABELS[extraKeys[i]][state.lang];
          btn.classList.remove("hidden");
        } else {
          btn.classList.add("hidden");
        }
      });
      if ((state.poolTab === "extra" && extraKeys.length < 1) || (state.poolTab === "extra2" && extraKeys.length < 2)) {
        state.poolTab = "normal";
      }

      state.history = [];
      state.redoStack = [];
      state.revealState = null;
      state.activeMarkId = null;
      state.activeTag = "";
      state.expandedFamilies.clear();
      if (state.cursorTool && state.cursorTool.kind === "essence") state.cursorTool = null;

      resetItemToBase();
      renderPoolTabs();
      renderAll();
    } catch (err) {
      showFeedback(tr("errLoadCat") + err.message, "error");
    }
  }

  function resetItemToBase() {
    if (!state.catData) return;
    const baseIdx = parseInt(el.baseSelect.value, 10) || 0;
    const ilvl = Math.max(1, Math.min(100, parseInt(el.ilvlInput.value, 10) || 84));
    const canQual = E.canSupportsQuality(state.catData);
    const qual = canQual ? Math.max(0, Math.min(20, parseInt(el.qualityInput.value, 10) || 0)) : 0;
    if (canQual) el.qualityInput.value = String(qual);
    state.item = E.createInitialItem(state.catData, baseIdx, ilvl, qual, state.lang);
    state.revealState = null;
    state.activeMarkId = null;
    updateHistoryButtons();
  }

  function renderSocketsAndAldurBar() {
    const { catData: cat, item } = state;
    if (!cat || !item) return;

    const qualLocked = !E.canSupportsQuality(cat) || item.corrupted;
    el.qualityInput.value = String(item.quality || 0);
    el.qualityInput.disabled = qualLocked;
    document.querySelectorAll("[data-qual]").forEach((btn) => { btn.disabled = qualLocked; });

    const { normalMax, corruptMax } = E.getSocketLimits(cat);
    const hasSockets = normalMax > 0;
    const socketed = item.socketedRunes || [];
    el.btnPunchSocket.disabled = !hasSockets || item.corrupted || item.sockets >= normalMax;
    el.btnClearSockets.disabled = !hasSockets || socketed.length === 0;
    el.socketStatusBadge.textContent = hasSockets
      ? `${item.sockets} / ${corruptMax} (${socketed.length} ${tr("socketedWord")})`
      : tr("noSockets");

    const eligibleRunes = E.getEligibleAldurRunes(cat);
    if (eligibleRunes.length === 0) {
      el.aldurBar.innerHTML = `<span class="hint-text">${escapeHtml(tr("aldurHint"))} (${escapeHtml(tr("aldurNotEligible"))})</span>`;
      return;
    }

    const btns = eligibleRunes.map((r) => `
      <button type="button" class="aldur-switch ${socketed.includes(r.id) ? "active" : ""}" data-toggle-aldur="${r.id}" title="${escapeHtml(loc(r, "desc"))}">
        <img src="${r.icon}" alt="" />
        <span>${escapeHtml(loc(r, "name"))}</span>
      </button>
    `).join("");
    el.aldurBar.innerHTML = `<span class="aldur-bar-title">${escapeHtml(tr("socketsLabel"))}:</span>${btns}<span class="hint-text">${escapeHtml(tr("aldurHint"))}</span>`;
  }

  function renderOmenBtn(o) {
    const active = state.activeOmens.has(o.id);
    return `
      <button type="button" class="omen-btn ${active ? "active" : ""}" data-omen="${o.id}" title="${escapeHtml(loc(o, "name") + ": " + loc(o, "short"))}">
        <img src="${o.icon}" alt="" loading="lazy" />
        <div class="omen-info">
          <div class="omen-title">${escapeHtml(loc(o, "name"))}</div>
          <div class="omen-desc">${escapeHtml(loc(o, "short"))}</div>
        </div>
      </button>
    `;
  }

  function renderCurrenciesAndOmens() {
    const { item, catData: cat } = state;
    if (!item || !cat) return;
    const counts = E.countAffixes(item);
    const maxSlots = E.getMaxSlots(cat, item);
    const maxTotal = maxSlots.maxP + maxSlots.maxS;
    const { normalMax } = E.getSocketLimits(cat);

    el.currencyGrid.innerHTML = E.CURRENCIES.map((cur) => {
      let disabled = item.corrupted;
      if (cur.id === "artificer") {
        disabled = item.corrupted || normalMax === 0 || (item.sockets || 0) >= normalMax;
      } else if (!disabled) {
        if (cur.id.includes("transmute")) disabled = item.rarity !== "normal";
        else if (cur.id.includes("aug")) disabled = item.rarity !== "magic" || (counts.p >= 1 && counts.s >= 1);
        else if (cur.id.includes("regal")) disabled = item.rarity !== "magic" || cat.maxRarity === "magic";
        else if (cur.id === "alc") disabled = item.rarity === "rare" || cat.maxRarity === "magic";
        else if (cur.id.includes("exalt")) disabled = item.rarity !== "rare" || counts.total >= maxTotal;
        else if (cur.id.includes("chaos")) disabled = item.rarity !== "rare" || item.mods.every((m) => m.fractured || m.markType);
        else if (cur.id === "annul") disabled = (item.rarity !== "magic" && item.rarity !== "rare") || item.mods.every((m) => m.fractured || m.markType);
        else if (cur.id === "divine") disabled = item.mods.every((m) => m.fractured || m.markType) && !(state.activeOmens.has("omen_blessing") && item.implicits.length > 0);
        else if (cur.id === "fracture") disabled = item.rarity !== "rare" || item.mods.filter((m) => !m.markType).length < 4 || item.mods.some((m) => m.fractured);
      }
      return `
        <button type="button" class="orb-btn" data-currency="${cur.id}" ${disabled ? "disabled" : ""} title="${escapeHtml(loc(cur, "desc"))}">
          ${cur.tier ? `<span class="orb-tier-tag">${cur.tier}</span>` : ""}
          <img src="${cur.icon}" alt="" loading="lazy" />
          <span class="orb-name">${escapeHtml(loc(cur, "name"))}</span>
          <span class="orb-sub">${cur.minModLvl > 1 ? "Lv" + cur.minModLvl + "+" : ""}</span>
        </button>
      `;
    }).join("");

    el.omenGrid.innerHTML = E.OMENS.filter((o) => o.group === "main").map(renderOmenBtn).join("");
    el.desecrateOmenGrid.innerHTML = E.OMENS.filter((o) => o.group === "desecrate").map(renderOmenBtn).join("");
  }

  function getFilteredEssences(cat, filterVal, searchQuery) {
    const list = [
      ...(cat.pools.essence || []).map((mod) => ({ pool: "essence", mod })),
      ...(cat.pools.perfect_essence || []).map((mod) => ({ pool: "perfect_essence", mod }))
    ];
    return list.filter(({ pool, mod }) =>
      (!filterVal || filterVal === "all" || E.classifyEssence(pool, mod) === filterVal) &&
      E.matchesEssenceSearch(mod, searchQuery, state.lang)
    );
  }

  function renderEssences() {
    const { catData: cat, item } = state;
    if (!cat || !item) return;
    if (!cat.canEssence) {
      el.essenceList.innerHTML = `<div class="empty-mini">${escapeHtml(tr("noEssenceSupport"))}</div>`;
      return;
    }
    const filtered = getFilteredEssences(cat, state.essenceFilter, state.essenceSearch);
    if (filtered.length === 0) {
      el.essenceList.innerHTML = `<div class="empty-mini">—</div>`;
      return;
    }
    el.essenceList.innerHTML = filtered.map(({ pool, mod }) => {
      const statTxt = formatModRanges(mod, false).join(" / ");
      const genTag = mod.gen === 1 ? tr("prefixShort") : tr("suffixShort");
      const disabled = item.corrupted || (pool === "perfect_essence" ? item.rarity !== "rare" : item.rarity !== "magic");
      return `
        <button type="button" class="essence-row" data-ess-pool="${pool}" data-ess-id="${mod.id}" ${disabled ? "disabled" : ""}>
          ${mod.icon ? `<img src="${mod.icon}" alt="" loading="lazy" />` : ""}
          <div class="essence-meta">
            <div class="essence-name">
              <span>${escapeHtml(loc(mod, "name"))}</span>
              <span class="gen-badge ${mod.gen === 1 ? "p" : "s"}">${escapeHtml(genTag)}</span>
            </div>
            <div class="essence-stat">${escapeHtml(statTxt)}</div>
          </div>
        </button>
      `;
    }).join("");
  }

  function renderTempleTab() {
    el.templeList.innerHTML = E.TEMPLE_CURRENCIES.map((tc) => `
      <button type="button" class="essence-row" data-temple="${tc.id}">
        <img src="${tc.icon}" alt="" loading="lazy" />
        <div class="essence-meta">
          <div class="essence-name" style="color:var(--rarity-corrupted)">${escapeHtml(loc(tc, "name"))}</div>
          <div class="essence-stat">${escapeHtml(loc(tc, "desc"))}</div>
        </div>
      </button>
    `).join("");
  }

  function renderDesecratePanel() {
    const { catData: cat, item } = state;
    if (!cat || !item) return;

    if (!cat.canDesecrate) {
      el.desecrateBones.innerHTML = `<div class="empty-mini" style="grid-column:1/-1">${escapeHtml(tr("noDesecrateSupport"))}</div>`;
      el.revealBox.classList.add("hidden");
      el.stashRevealBox.classList.add("hidden");
      return;
    }

    const counts = E.countAffixes(item);
    const maxSlots = E.getMaxSlots(cat, item);
    const disabled = item.corrupted || item.rarity !== "rare" || counts.total >= (maxSlots.maxP + maxSlots.maxS);
    el.desecrateBones.innerHTML = E.ABYSS_BONES.map((b) => `
      <button type="button" class="orb-btn" data-bone="${b.id}" ${disabled ? "disabled" : ""}>
        <img src="${b.icon}" alt="" loading="lazy" />
        <span class="orb-name">${escapeHtml(loc(b, "name"))}</span>
        <span class="orb-sub">${escapeHtml(loc(b, "sub"))}</span>
      </button>
    `).join("");

    const hasReveal = !!(state.revealState && state.revealState.choices.length > 0);
    el.revealBox.classList.toggle("hidden", !hasReveal);
    el.stashRevealBox.classList.toggle("hidden", !hasReveal);

    if (hasReveal) {
      const canReroll = state.revealState.canReroll && !state.revealState.rerolled;
      el.btnRerollReveal.classList.toggle("hidden", !canReroll);
      el.btnStashRerollReveal.classList.toggle("hidden", !canReroll);

      const choicesHtml = state.revealState.choices.map((ch, idx) => {
        const linesHtml = ch.lines.map((ln) => escapeHtml(E.formatLineText(E.pickLineTpl(ln, state.lang), ln.values))).join("<br/>");
        return `
          <button type="button" class="reveal-choice" data-reveal-idx="${idx}">
            <div class="family-gen-row">
              <span class="gen-badge ${ch.gen === 1 ? "p" : "s"}">${escapeHtml(ch.gen === 1 ? tr("prefixShort") : tr("suffixShort"))}</span>
              <span class="tier-badge ${ch.tier === 1 ? "t1" : ""}">T${ch.tier}</span>
              <span>${escapeHtml(E.pickModName(ch, state.lang))}</span>
              ${ch.lines.length > 1 ? `<span class="composite-badge">${escapeHtml(tr("compositeTag"))}</span>` : ""}
            </div>
            <div class="slot-lines">${linesHtml}</div>
          </button>
        `;
      }).join("");
      el.revealChoices.innerHTML = choicesHtml;
      el.stashRevealChoices.innerHTML = choicesHtml;
    }
  }

  function buildItemCardHtml(cat, item) {
    const base = cat.bases[item.baseIdx] || cat.bases[0];
    const counts = E.countAffixes(item);
    const maxSlots = E.getMaxSlots(cat, { ...item, rarity: item.rarity === "normal" ? "rare" : item.rarity });
    const showSplit = state.altHeld || state.viewMode === "split";
    const { mergedList, prefixes, suffixes, others } = E.aggregateItemStats(cat, item, state.lang);
    const { computedLines, summaryStrip } = E.computeItemProperties(cat, item, mergedList, state.lang);

    let titleText = loc(base, "name");
    let subtitleHtml = "";
    if (item.rarity === "rare") {
      titleText = item.rareName;
      subtitleHtml = `<div class="poe-item-base">${escapeHtml(loc(base, "name"))}</div>`;
    } else if (item.rarity === "magic") {
      const pMod = item.mods.find((m) => m.gen === 1);
      const sMod = item.mods.find((m) => m.gen === 2);
      titleText = `${pMod ? E.pickModName(pMod, state.lang) + " " : ""}${loc(base, "name")}${sMod ? " " + E.pickModName(sMod, state.lang) : ""}`.trim();
    }

    const sections = [];
    const topProps = [];
    if (E.canSupportsQuality(cat) && item.quality > 0) {
      topProps.push(`<div class="item-prop-line">${escapeHtml(tr("itemQuality"))}: <span class="item-prop-val augmented">+${item.quality}%</span></div>`);
    }
    for (const cl of computedLines) {
      topProps.push(`<div class="item-prop-line">${cl.label ? escapeHtml(cl.label) + ": " : ""}<span class="item-prop-val ${cl.augmented ? "augmented" : ""}">${escapeHtml(cl.val)}</span></div>`);
    }
    if (summaryStrip) {
      topProps.push(`<div class="item-dps-strip"><span>${escapeHtml(tr("physDps"))} <b>${summaryStrip.pdps}</b></span><span>${escapeHtml(tr("elemDps"))} <b>${summaryStrip.edps}</b></span><span>${escapeHtml(tr("totalDps"))} <b>${summaryStrip.tdps}</b></span></div>`);
    }
    if (item.sockets > 0 || item.jewelSockets > 0) {
      const socketed = item.socketedRunes || [];
      const pips = Array.from({ length: item.sockets }, (_, i) => {
        const rDef = socketed[i] ? E.ALDUR_MAP[socketed[i]] : null;
        return `<span class="socket-pip ${rDef ? "filled" : ""}" title="${rDef ? escapeHtml(loc(rDef, "name")) : escapeHtml(tr("emptySocketWord"))}">${rDef ? `<img src="${rDef.icon}" alt="" />` : ""}</span>`;
      });
      for (let j = 0; j < (item.jewelSockets || 0); j++) pips.push(`<span class="socket-pip jewel" title="${escapeHtml(tr("jewelSocketWord"))}"></span>`);
      topProps.push(`<div class="item-sockets-row">${pips.join("")}</div>`);
    }
    if (topProps.length > 0) sections.push(topProps.join(""));

    const reqParts = [
      base.reqLevel > 1 ? `${tr("reqLevel")} ${base.reqLevel}` : "",
      base.reqStr > 0 ? `${base.reqStr} ${tr("reqStr")}` : "",
      base.reqDex > 0 ? `${base.reqDex} ${tr("reqDex")}` : "",
      base.reqInt > 0 ? `${base.reqInt} ${tr("reqInt")}` : ""
    ].filter(Boolean);
    sections.push(
      (reqParts.length > 0 ? `<div class="item-prop-line">${escapeHtml(tr("itemReq"))}: <span class="item-prop-val">${escapeHtml(reqParts.join(", "))}</span></div>` : "") +
      `<div class="item-prop-line">${escapeHtml(tr("itemLevel"))}: <span class="item-prop-val">${item.ilvl}</span></div>`
    );

    if (item.corruptedEnchants.length > 0) {
      sections.push(item.corruptedEnchants.map((ce) =>
        ce.lines.map((ln) => `<div class="item-mod-line corrupted-enchant">${escapeHtml(E.formatLineText(E.pickLineTpl(ln, state.lang), ln.values))}</div>`).join("")
      ).join(""));
    }
    if (item.implicits.length > 0) {
      sections.push(item.implicits.map((imp) =>
        `<div class="item-mod-line implicit">${escapeHtml(E.formatLineText(E.pickLineTpl(imp, state.lang), imp.values))}</div>`
      ).join(""));
    }

    const socketedRunes = (item.socketedRunes || []).map((id) => E.ALDUR_MAP[id]).filter(Boolean);
    if (socketedRunes.length > 0) {
      sections.push(socketedRunes.map((r) =>
        `<div class="item-mod-line aldur">[${escapeHtml(loc(r, "name"))}] ${escapeHtml(loc(r, "bondStat") || loc(r, "desc"))}</div>`
      ).join(""));
    }

    if (item.mods.length > 0) {
      if (!showSplit) {
        sections.push(mergedList.map((m) => {
          const markCls = m.markType === "bloodmark" ? " bloodmark" : m.markType === "forgemark" ? " forgemark" : "";
          const cls = "item-mod-line" + (markCls || (m.hasFractured ? " fractured" : m.hasDesecrated ? " desecrated" : m.hasAldur ? " aldur" : item.sanctified ? " sanctified" : ""));
          const mergeBadge = m.isMerged
            ? `<span class="merge-note" title="${escapeHtml(m.contributors.map((c) => `${c.slotLabel}(${c.text})`).join(" + "))}">${escapeHtml(tr("mergedBadge"))} (${m.contributors.length})</span>`
            : "";
          return `<div class="${cls}">${escapeHtml(m.text)}${mergeBadge}</div>`;
        }).join(""));
      } else {
        sections.push([...prefixes, ...suffixes, ...others].map((m) => {
          const genLabel = m.gen === 1 ? tr("prefixShort") : m.gen === 2 ? tr("suffixShort") : tr("enchantShort");
          const tierTxt = m.markType ? (m.markType === "bloodmark" ? "[Bloodmark]" : "[Forgemark]") : `T${m.tier}`;
          const linesTxt = m.lines.map((ln) =>
            `<div class="item-mod-line" style="text-align:left;margin:2px 0;">${escapeHtml(E.formatLineText(E.pickLineTpl(ln, state.lang), ln.values))}</div>`
          ).join("");
          return `
            <div class="split-mod-block">
              <div class="split-mod-meta">
                <span><b>${escapeHtml(genLabel)}</b> · ${escapeHtml(tierTxt)} · ${escapeHtml(E.pickModName(m, state.lang))} (Lv.${m.lvl})</span>
                <span>${m.lines.length > 1 ? `<span class="composite-badge">${escapeHtml(tr("compositeTag"))}·${m.lines.length}${escapeHtml(tr("compositeBadge"))}</span>` : ""}</span>
              </div>
              ${linesTxt}
            </div>
          `;
        }).join(""));
      }
    }

    if (item.corrupted || item.sanctified || item.markReforged) {
      const tags = [];
      if (item.markReforged) tags.push(`<span class="status-tag-mark-reforged">${escapeHtml(tr("markReforgedLabel"))}</span>`);
      if (item.corrupted) {
        tags.push(item.doubleCorrupted
          ? `<span class="status-tag-corrupted status-tag-double-corrupted">${escapeHtml(tr("doubleCorruptedLabel"))}</span>`
          : `<span class="status-tag-corrupted">${escapeHtml(tr("corruptedLabel"))}</span>`
        );
      }
      if (item.sanctified) tags.push(`<span class="status-tag-sanctified">${escapeHtml(tr("sanctifiedLabel"))} (×${item.sanctifyFactor})</span>`);
      sections.push(`<div class="item-status-tags">${tags.join("")}</div>`);
    }

    return {
      cardHtml: `
        <article class="poe-item-card rarity-${item.rarity}">
          <div class="poe-item-header">
            <img class="poe-item-icon" src="${base.icon || ""}" alt="${escapeHtml(loc(base, "name"))}" />
            <div>
              <div class="poe-item-name">${escapeHtml(titleText)}</div>
              ${subtitleHtml}
            </div>
          </div>
          <div class="poe-item-body">${sections.join('<div class="item-sep"></div>')}</div>
        </article>
      `,
      counts, maxSlots, mergedList, prefixes, suffixes
    };
  }

  function renderItemCard() {
    const { catData: cat, item } = state;
    if (!cat || !item) return;

    const showSplit = state.altHeld || state.viewMode === "split";
    el.btnViewMerged.classList.toggle("active", !showSplit);
    el.btnViewSplit.classList.toggle("active", showSplit);
    el.altHintPill.classList.toggle("active", state.altHeld);

    const { cardHtml, counts, maxSlots, mergedList, prefixes, suffixes } = buildItemCardHtml(cat, item);
    el.itemCardMount.innerHTML = cardHtml;
    el.stashItemCardMount.innerHTML = cardHtml;
    el.affixCounter.textContent = `${tr("prefixShort")} ${counts.p}/${maxSlots.maxP} · ${tr("suffixShort")} ${counts.s}/${maxSlots.maxS}`;
    el.prefixCountBadge.textContent = `${counts.p} / ${maxSlots.maxP}`;
    el.suffixCountBadge.textContent = `${counts.s} / ${maxSlots.maxS}`;

    renderAffixSlots(prefixes, suffixes, maxSlots.maxP, maxSlots.maxS);
    renderMergeBreakdown(mergedList);
  }

  function renderAffixSlots(prefixes, suffixes, maxP, maxS) {
    const renderGroup = (list, maxCount, tag) => {
      const cards = list.map((m, idx) => {
        const isComp = m.lines.length > 1;
        const linesHtml = m.lines.map((ln) => `<div>${escapeHtml(E.formatLineText(E.pickLineTpl(ln, state.lang), ln.values))}</div>`).join("");
        const tagsTxt = (m.tags || []).map(locTag).filter(Boolean).slice(0, 4).join(" · ");
        const markCls = m.markType === "bloodmark" ? "is-bloodmark" : m.markType === "forgemark" ? "is-forgemark" : "";
        const badgeTxt = m.markType
          ? `${tag}${idx + 1} · ${m.markType === "bloodmark" ? "[Bloodmark]" : "[Forgemark]"}`
          : `${tag}${idx + 1} · T${m.tier}`;
        const actionsHtml = m.markType
          ? `<button type="button" class="slot-action-btn danger" data-slot-act="remove" data-uid="${m.uid}">${escapeHtml(tr("btnRemove"))}</button>`
          : `
            <button type="button" class="slot-action-btn" data-slot-act="fracture" data-uid="${m.uid}">${escapeHtml(m.fractured ? tr("btnUnfracture") : tr("btnFracture"))}</button>
            <button type="button" class="slot-action-btn" data-slot-act="reroll" data-uid="${m.uid}">${escapeHtml(tr("btnReroll"))}</button>
            <button type="button" class="slot-action-btn danger" data-slot-act="remove" data-uid="${m.uid}">${escapeHtml(tr("btnRemove"))}</button>
          `;
        return `
          <div class="slot-card ${isComp ? "is-composite" : ""} ${m.fractured ? "is-fractured" : ""} ${m.source === "desecrated" ? "is-desecrated" : ""} ${markCls}">
            <div class="slot-top">
              <div class="slot-badges">
                <span class="tier-badge ${m.tier === 1 ? "t1" : ""}">${badgeTxt}</span>
                ${isComp ? `<span class="composite-badge">${escapeHtml(tr("compositeTag"))} ${m.lines.length}${escapeHtml(tr("compositeBadge"))}</span>` : ""}
              </div>
              <div class="slot-actions">${actionsHtml}</div>
            </div>
            <div class="slot-lines">${linesHtml}</div>
            <div class="slot-meta-row">
              <span>${escapeHtml(E.pickModName(m, state.lang))} (Lv.${m.lvl})</span>
              <span>${escapeHtml(tagsTxt)}</span>
            </div>
          </div>
        `;
      });
      const emptyLbl = tag === "P" ? tr("emptyPrefix") : tr("emptySuffix");
      for (let i = list.length; i < maxCount; i++) cards.push(`<div class="slot-card empty">${escapeHtml(emptyLbl)} (${tag}${i + 1})</div>`);
      return cards.join("");
    };
    el.prefixSlots.innerHTML = renderGroup(prefixes, maxP, "P");
    el.suffixSlots.innerHTML = renderGroup(suffixes, maxS, "S");
  }

  function renderMergeBreakdown(mergedList) {
    const mergedOnly = mergedList.filter((m) => m.isMerged || m.isCompositePart);
    const countTxt = String(mergedList.filter((m) => m.isMerged).length);
    el.mergeCountBadge.textContent = countTxt;
    el.stashMergeBadge.textContent = countTxt;

    const html = mergedOnly.length === 0
      ? `<div class="empty-mini">${escapeHtml(tr("mergeEmpty"))}</div>`
      : mergedOnly.map((m) => {
          const partsHtml = m.contributors.map((c) => `${c.slotLabel}(T${c.tier}${c.isComposite ? "·" + tr("compositeTag") : ""}): ${c.text}`).join("  +  ");
          return `<div class="merge-item"><div class="merge-item-total">${escapeHtml(m.text)}</div><div class="merge-item-parts">${escapeHtml(partsHtml)}</div></div>`;
        }).join("");
    el.mergeBreakdown.innerHTML = html;
    el.stashMergeBreakdown.innerHTML = html;
  }

  function renderCostAndLogs() {
    const entries = Object.values(state.costs);
    const pillsHtml = entries.length === 0
      ? `<span class="hint-text">${escapeHtml(tr("noCost"))}</span>`
      : entries.map((entry) => `<span class="cost-pill">${escapeHtml(entry.getLabel(state.lang))} <b>×${entry.count}</b></span>`).join("");
    const logsHtml = state.logs.length > 0
      ? state.logs.map((entry) => `<li>${escapeHtml(`[${entry.time}] ${entry.render(state.lang)}`)}</li>`).join("")
      : `<li>${escapeHtml(tr("noLog"))}</li>`;

    el.costPills.innerHTML = pillsHtml;
    el.stashCostPills.innerHTML = pillsHtml;
    el.craftLog.innerHTML = logsHtml;
    el.stashCraftLog.innerHTML = logsHtml;
  }

  function renderPoolTabs() {
    el.poolTabs.querySelectorAll("[data-pool]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-pool") === state.poolTab);
    });
    if (state.extraPoolKeys[0]) el.btnExtraPool.textContent = E.EXTRA_POOL_LABELS[state.extraPoolKeys[0]][state.lang];
    if (state.extraPoolKeys[1]) el.btnExtraPool2.textContent = E.EXTRA_POOL_LABELS[state.extraPoolKeys[1]][state.lang];
  }

  function renderModPool() {
    const { catData: cat, item } = state;
    if (!cat || !item) return;

    const actualPoolName = state.poolTab === "extra"
      ? (state.extraPoolKeys[0] || "normal")
      : state.poolTab === "extra2"
        ? (state.extraPoolKeys[1] || "normal")
        : state.poolTab;
    const rawPool = (cat.pools && cat.pools[actualPoolName]) || [];

    const activeAldurPools = E.getActiveAldurPools(cat, item);
    const aldurStatusBanner = E.ALDUR_POOL_KEYS.has(actualPoolName)
      ? `<div class="info-banner" style="margin-bottom:6px;">${escapeHtml(activeAldurPools.includes(actualPoolName) ? tr("aldurUnlocked") : tr("aldurLocked"))}</div>`
      : "";

    const availableTags = new Set();
    for (const m of rawPool) for (const t of (m.tags || [])) if (locTag(t)) availableTags.add(t);
    el.tagFilterBar.innerHTML = [
      `<button type="button" class="tag-chip ${state.activeTag === "" ? "active" : ""}" data-tag="">${escapeHtml(tr("allTags"))}</button>`,
      ...Array.from(availableTags, (t) => `<button type="button" class="tag-chip ${state.activeTag === t ? "active" : ""}" data-tag="${t}">${escapeHtml(locTag(t))}</button>`)
    ].join("");

    const odds = E.computePoolOdds(cat, item, actualPoolName, state.activeOmens);
    const blockedFamilies = E.getBlockedFamilies(item);
    const q = state.modSearch.trim().toLowerCase();

    const filtered = rawPool.filter((mod) => {
      if (state.genFilter !== "all" && String(mod.gen) !== state.genFilter) return false;
      if (state.filterIlvl && mod.lvl > item.ilvl) return false;
      if (state.activeTag && !(mod.tags || []).includes(state.activeTag)) return false;
      if (q) {
        const linesTxt = (mod.lines || []).map((l) => E.pickLineTpl(l, state.lang)).join(" ").toLowerCase();
        const famTxt = (mod.fam || []).join(" ").toLowerCase();
        if (!linesTxt.includes(q) && !loc(mod, "name").toLowerCase().includes(q) && !famTxt.includes(q)) return false;
      }
      return true;
    });

    const groupMap = new Map();
    for (const mod of filtered) {
      const fam0 = (mod.fam && mod.fam[0]) || mod.id;
      const gKey = `${mod.gen}|${fam0}`;
      let grp = groupMap.get(gKey);
      if (!grp) {
        grp = { key: gKey, gen: mod.gen, fams: mod.fam || [], mods: [], maxW: 0, eligibleWeight: 0 };
        groupMap.set(gKey, grp);
      }
      grp.mods.push(mod);
      if ((mod.w || 0) > grp.maxW) grp.maxW = mod.w || 0;
      if (odds.eligibleIds.has(mod.id)) grp.eligibleWeight += Math.max(0, mod.w || 0);
    }

    const groups = Array.from(groupMap.values()).sort((a, b) =>
      (a.gen !== b.gen ? (a.gen || 9) - (b.gen || 9) : b.eligibleWeight - a.eligibleWeight || b.maxW - a.maxW)
    );
    el.poolStatsBadge.textContent = `${groups.length} / ${filtered.length}`;

    if (groups.length === 0) {
      el.modPoolList.innerHTML = aldurStatusBanner + `<div class="empty-mini">—</div>`;
      return;
    }

    el.modPoolList.innerHTML = aldurStatusBanner + groups.map((grp) => {
      grp.mods.sort((a, b) => a.tier - b.tier);
      const topMod = grp.mods[0];
      const isBlocked = grp.fams.some((f) => blockedFamilies.has(f));
      const isComposite = (topMod.lines || []).length > 1;
      const genCls = grp.gen === 1 ? "p" : grp.gen === 2 ? "s" : "other";
      const genLabel = grp.gen === 1 ? tr("prefixShort") : grp.gen === 2 ? tr("suffixShort") : tr("enchantShort");
      const pct = odds.totalWeight > 0 && grp.eligibleWeight > 0
        ? ((grp.eligibleWeight / odds.totalWeight) * 100).toFixed(2) + "%"
        : (actualPoolName === "normal" ? "0%" : "--");

      const tiersHtml = !state.expandedFamilies.has(grp.key) ? "" : `<div class="family-tiers">` + grp.mods.map((m) => {
        const tierPct = odds.totalWeight > 0 && odds.eligibleIds.has(m.id) ? ((m.w / odds.totalWeight) * 100).toFixed(2) + "%" : "";
        return `
          <div class="tier-row ${m.lvl <= item.ilvl ? "" : "unavailable"}">
            <div>
              <div>
                <span class="tier-badge ${m.tier === 1 ? "t1" : ""}">T${m.tier}</span>
                <b>${escapeHtml(loc(m, "name"))}</b>
                <span class="hint-text">Lv.${m.lvl}</span>
                ${(m.lines || []).length > 1 ? `<span class="composite-badge">${escapeHtml(tr("compositeTag"))}</span>` : ""}
              </div>
              <div class="tier-sub">${formatModRanges(m, true).map(escapeHtml).join("<br/>")}</div>
            </div>
            <div class="tier-actions">
              ${m.w > 0 ? `<span class="odds-weight">${m.w}${tierPct ? " (" + tierPct + ")" : ""}</span>` : ""}
              <button type="button" class="mini-chip" data-add-mod="${actualPoolName}|${m.id}">${escapeHtml(tr("addBtn"))}</button>
            </div>
          </div>
        `;
      }).join("") + `</div>`;

      return `
        <div class="family-card ${isBlocked ? "blocked" : ""}">
          <button type="button" class="family-head" data-toggle-fam="${escapeHtml(grp.key)}">
            <div class="family-title-col">
              <div class="family-gen-row">
                <span class="gen-badge ${genCls}">${escapeHtml(genLabel)}</span>
                ${isComposite ? `<span class="composite-badge">${escapeHtml(tr("compositeTag"))}·${(topMod.lines || []).length}${escapeHtml(tr("compositeBadge"))}</span>` : ""}
                <span class="hint-text">${grp.mods.length} ${escapeHtml(tr("tiersCount"))}</span>
                ${isBlocked ? `<span class="hint-text">${escapeHtml(tr("blockedFam"))}</span>` : ""}
              </div>
              <div class="family-preview">${escapeHtml(formatModRanges(topMod, true).join(" / "))}</div>
            </div>
            <div class="family-odds-col">
              <span class="odds-pct">${pct}</span>
              ${grp.eligibleWeight > 0 ? `<span class="odds-weight">${escapeHtml(tr("weightLabel"))} ${grp.eligibleWeight}</span>` : ""}
            </div>
          </button>
          ${tiersHtml}
        </div>
      `;
    }).join("");
  }

  function getCursorToolLabel(tool) {
    if (!tool) return tr("stashNone");
    if (tool.kind === "essence") {
      const mod = ((state.catData && state.catData.pools && state.catData.pools[tool.pool]) || []).find((m) => m.id === tool.id);
      return mod ? loc(mod, "name") : tool.id;
    }
    const def = DICT_BY_KIND[tool.kind] && DICT_BY_KIND[tool.kind][tool.id];
    return def ? loc(def, "name") : (tool.label || tool.id);
  }

  function renderStashSimulation() {
    const { catData: cat, item } = state;
    if (!cat || !item) return;

    const base = cat.bases[item.baseIdx] || cat.bases[0];
    el.pedestalIcon.src = base.icon || "";
    el.pedestalGlow.className = "pedestal-rarity-glow " + (item.corrupted ? "corrupted" : item.rarity);

    const socketed = item.socketedRunes || [];
    el.pedestalSockets.innerHTML = Array.from({ length: item.sockets }, (_, i) => {
      const rDef = socketed[i] ? E.ALDUR_MAP[socketed[i]] : null;
      return `<span class="socket-pip ${rDef ? "filled" : ""}">${rDef ? `<img src="${rDef.icon}" alt="" />` : ""}</span>`;
    }).join("");

    el.stashActiveToolLabel.textContent = getCursorToolLabel(state.cursorTool);
    if (el.stashKeepOmensToggle) el.stashKeepOmensToggle.checked = state.keepOmens;
    if (el.keepOmensToggle) el.keepOmensToggle.checked = state.keepOmens;

    const isSelected = (kind, id, pool) =>
      !!(state.cursorTool && state.cursorTool.kind === kind && state.cursorTool.id === id && (!pool || state.cursorTool.pool === pool));

    const slotBtn = (kind, id, icon, name, desc, tier) => `
      <button type="button" class="stash-slot ${isSelected(kind, id) ? "selected" : ""}" data-stash-pick="${kind}|${id}" title="${escapeHtml(name + " - " + desc)}">
        <img src="${icon}" alt="" />
        ${tier ? `<span class="stash-slot-tier">${tier}</span>` : ""}
        <span class="stash-slot-label">${escapeHtml(name)}</span>
      </button>
    `;

    const cardBtn = (attrs, cls, icon, name, sub, title, disabled) => `
      <button type="button" class="stash-card-slot ${cls}" ${attrs} ${disabled ? "disabled" : ""} title="${escapeHtml(title)}">
        ${icon ? `<img src="${icon}" alt="" loading="lazy" />` : ""}
        <div class="stash-card-text">
          <span class="stash-card-name">${escapeHtml(name)}</span>
          ${sub ? `<span class="stash-card-sub">${escapeHtml(sub)}</span>` : ""}
        </div>
      </button>
    `;

    const omenCard = (o) => {
      const name = loc(o, "name"), shortTxt = loc(o, "short");
      return cardBtn(`data-omen="${o.id}"`, state.activeOmens.has(o.id) ? "active-omen" : "", o.icon, name, shortTxt, `${name}: ${shortTxt}`, false);
    };

    el.stashLeftOrbs.innerHTML = STASH_LEFT_IDS.map((id) => {
      const c = E.CURRENCY_MAP[id];
      return slotBtn("currency", id, c.icon, loc(c, "name"), loc(c, "desc"), c.tier);
    }).join("");

    el.stashTopOrbs.innerHTML = STASH_TOP_IDS.map((id) => {
      const c = E.CURRENCY_MAP[id];
      return slotBtn("currency", id, c.icon, loc(c, "name"), loc(c, "desc"), "");
    }).join("");

    const artificer = E.CURRENCY_MAP.artificer;
    const rightTools = [
      ...E.QUALITY_CURRENCIES.map((q) => ["quality", q.id, q.icon, loc(q, "name"), loc(q, "desc")]),
      ["currency", "artificer", artificer.icon, loc(artificer, "name"), loc(artificer, "desc")],
      ...E.ABYSS_BONES.map((b) => ["bone", b.id, b.icon, loc(b, "name"), loc(b, "sub")])
    ];
    el.stashRightTools.innerHTML = rightTools.map(([k, id, ic, nm, ds]) => slotBtn(k, id, ic, nm, ds, "")).join("");

    el.stashAbyssGrid.innerHTML =
      E.ABYSS_BONES.map((b) => {
        const name = loc(b, "name"), sub = loc(b, "sub");
        return cardBtn(`data-stash-pick="bone|${b.id}"`, isSelected("bone", b.id) ? "selected" : "", b.icon, name, sub, `${name} - ${sub}`, false);
      }).join("") +
      E.OMENS.filter((o) => o.group === "desecrate").map(omenCard).join("");

    el.stashOmenGrid.innerHTML = E.OMENS.filter((o) => o.group === "main").map(omenCard).join("");

    if (el.stashEssenceGrid) {
      if (!cat.canEssence) {
        el.stashEssenceGrid.innerHTML = `<div class="stash-empty-note">${escapeHtml(tr("noEssenceSupport"))}</div>`;
      } else {
        const filteredEss = getFilteredEssences(cat, state.stashEssenceFilter, state.stashEssenceSearch);
        el.stashEssenceGrid.innerHTML = filteredEss.length === 0
          ? `<div class="stash-empty-note">—</div>`
          : filteredEss.map(({ pool, mod }) => {
              const name = loc(mod, "name");
              const statTxt = formatModRanges(mod, false).join(" / ");
              const genTag = mod.gen === 1 ? tr("prefixShort") : tr("suffixShort");
              return cardBtn(`data-stash-pick="essence|${pool}|${mod.id}"`, isSelected("essence", mod.id, pool) ? "selected" : "", mod.icon, name, `[${genTag}] ${statTxt}`, `${name} — ${statTxt}`, false);
            }).join("");
      }
    }

    el.stashTempleGrid.innerHTML = E.TEMPLE_CURRENCIES.map((tc) => {
      const name = loc(tc, "name");
      return cardBtn(`data-stash-pick="temple|${tc.id}"`, isSelected("temple", tc.id) ? "selected" : "", tc.icon, name, "", `${name} - ${loc(tc, "desc")}`, false);
    }).join("");

    const socketedSet = new Set(socketed);
    el.stashAldurGrid.innerHTML = E.ALDUR_RUNES.map((ar) => {
      const name = loc(ar, "name");
      const cls = `${isSelected("aldur", ar.id) ? "selected" : ""} ${socketedSet.has(ar.id) ? "active-omen" : ""}`.trim();
      return cardBtn(`data-stash-pick="aldur|${ar.id}"`, cls, ar.icon, name, "", `${name} - ${loc(ar, "desc")}`, !ar.allowedCategories.includes(cat.category));
    }).join("");

    document.querySelectorAll("[data-stash-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-stash-tab") === state.stashTab);
    });
    document.querySelectorAll("[data-stash-section]").forEach((sec) => {
      const visible = state.stashTab === "all" || sec.getAttribute("data-stash-section") === state.stashTab;
      sec.classList.toggle("hidden", !visible);
    });
  }

  function renderSeason10Box() {
    if (!el.season10Box) return;
    const isOpen = !!state.season10Enabled;
    el.season10Box.classList.toggle("is-collapsed", !isOpen);
    el.s10Body.classList.toggle("hidden", !isOpen);
    el.s10CollapsedHint.classList.toggle("hidden", isOpen);
    if (el.s10DemoActions) el.s10DemoActions.classList.toggle("hidden", !isOpen);
    el.btnToggleSeason10.classList.toggle("active", isOpen);
    el.btnToggleSeason10.setAttribute("aria-expanded", isOpen ? "true" : "false");
    el.s10ToggleLabel.textContent = tr(isOpen ? "s10ToggleOn" : "s10ToggleOff");

    const { catData: cat, item } = state;
    if (!isOpen || !cat || !item) return;

    const equipGroup = E.getMarkEquipGroup(cat);
    const isEquip = equipGroup !== "none";
    if (el.btnS10Demo64) el.btnS10Demo64.disabled = !isEquip;
    if (el.btnS10Demo84) el.btnS10Demo84.disabled = !isEquip;

    const renderMarkBtn = (c) => {
      const wrongEquip = equipGroup !== c.equipGroup;
      const disabled = wrongEquip || item.corrupted || item.markReforged;
      const selected = state.activeMarkId === c.id;
      const isBlood = c.markKind === "bloodmark";
      const subMeta = `${loc(c, "equipLabel")} · ${isBlood ? `Lv${c.minModLvl}+ (${tr("suffixShort")})` : `≤Lv${c.maxItemLvl}`}`;
      return `
        <button type="button" class="s10-orb ${isBlood ? "is-blood" : ""} ${selected ? "selected" : ""}" data-s10-orb="${c.id}" ${disabled ? "disabled" : ""} title="${escapeHtml(loc(c, "desc"))}">
          <span class="s10-stack-badge">${c.stackSize}</span>
          <img src="${c.icon}" alt="" />
          <div class="s10-orb-info">
            <div class="s10-orb-name">${escapeHtml(loc(c, "name"))}</div>
            <div class="s10-orb-meta">${escapeHtml(subMeta)}</div>
          </div>
        </button>
      `;
    };

    el.s10ForgeGrid.innerHTML = E.SEASON10_CURRENCIES.filter((c) => c.markKind === "forgemark").map(renderMarkBtn).join("");
    el.s10BloodGrid.innerHTML = E.SEASON10_CURRENCIES.filter((c) => c.markKind === "bloodmark").map(renderMarkBtn).join("");

    const markedMods = item.mods.filter((m) => m.markType);
    let actionHtml = "";
    let actionDone = false;

    if (!isEquip) {
      actionHtml = `<div class="hint-text">${escapeHtml(tr("s10NotEquipNote").replace("{cat}", loc(cat, "label")))}</div>`;
    } else if (item.markReforged) {
      actionDone = true;
      actionHtml = `<div class="s10-picker-head"><span>${escapeHtml(tr("s10ReforgedBadge"))}</span></div>`;
    } else {
      const parts = [];
      if (state.activeMarkId) {
        const check = E.checkSeason10MarkEligibility(cat, item, state.activeMarkId, state.lang);
        if (!check.ok) {
          state.activeMarkId = null;
        } else {
          const curDef = check.def;
          const targetBtns = check.targets.map((m) => {
            const genCls = m.gen === 1 ? "p" : "s";
            const genLbl = m.gen === 1 ? tr("prefixShort") : tr("suffixShort");
            const txt = m.lines.map((ln) => E.formatLineText(E.pickLineTpl(ln, state.lang), ln.values)).join(" / ");
            return `
              <button type="button" class="s10-target-btn" data-s10-target="${m.uid}">
                <span><span class="gen-badge ${genCls}">${escapeHtml(genLbl)} T${m.tier}</span> ${escapeHtml(txt)}</span>
              </button>
            `;
          }).join("");
          parts.push(`
            <div class="s10-picker-head">
              <span>${escapeHtml(tr("s10PickerTitle").replace("{currency}", loc(curDef, "name")))}</span>
              <button type="button" class="mini-chip" id="btnS10CancelPick">${escapeHtml(tr("btnCancelAction"))}</button>
            </div>
            <div class="s10-target-list">${targetBtns}</div>
          `);
        }
      }
      if (markedMods.length > 0) {
        parts.push(`
          <div class="s10-reforge-row">
            <span class="hint-text">${escapeHtml(tr("s10ReforgeDesc").replace("{count}", String(markedMods.length)))}</span>
            <button type="button" class="s10-reforge-btn" id="btnS10Reforge">${escapeHtml(tr("s10ReforgeBtn"))}</button>
          </div>
        `);
      }
      actionHtml = parts.join("");
    }

    el.s10ActionBar.className = "s10-action-bar" + (actionDone ? " is-done" : "") + (actionHtml ? "" : " hidden");
    el.s10ActionBar.innerHTML = actionHtml;
  }

  function renderAll() {
    applyStaticI18n();
    renderSocketsAndAldurBar();
    renderSeason10Box();
    renderCurrenciesAndOmens();
    renderEssences();
    renderDesecratePanel();
    renderTempleTab();
    renderItemCard();
    renderCostAndLogs();
    renderModPool();
    renderStashSimulation();
  }

  function commitCraftingResult(prev, res, costSpec) {
    const getMsg = () => (res.renderMessage ? res.renderMessage(state.lang) : res.message);
    if (!res.ok) { showFeedback(getMsg(), "error"); return; }
    pushHistory(prev);
    state.item = res.item;
    state.revealState = null;
    state.activeMarkId = null;
    if (costSpec) recordCost(costSpec, res.usedOmens);
    consumeUsedOmens(res.usedOmens);
    addLog(res.renderMessage || res.message);
    showFeedback(getMsg(), "success");
    renderAll();
  }

  // ========= 事件绑定 =========
  function switchMode(mode) {
    state.mode = mode;
    el.btnModeWorkbench.classList.toggle("active", mode === "workbench");
    el.btnModeStash.classList.toggle("active", mode === "stash");
    if (el.btnModeRegex) el.btnModeRegex.classList.toggle("active", mode === "regex");
    el.workbenchView.classList.toggle("hidden", mode !== "workbench");
    el.stashView.classList.toggle("hidden", mode !== "stash");
    if (el.regexView) el.regexView.classList.toggle("hidden", mode !== "regex");
    if (el.baseToolbar) el.baseToolbar.classList.toggle("hidden", mode === "regex");
    if (el.season10Box) el.season10Box.classList.toggle("hidden", mode === "regex");
    if (el.craftingTopActions) el.craftingTopActions.classList.toggle("hidden", mode === "regex");
    if (mode === "stash") renderStashSimulation();
    if (mode === "regex" && window.PoE2RegexTool) window.PoE2RegexTool.renderAll();
  }
  el.btnModeWorkbench.addEventListener("click", () => switchMode("workbench"));
  el.btnModeStash.addEventListener("click", () => switchMode("stash"));
  if (el.btnModeRegex) el.btnModeRegex.addEventListener("click", () => switchMode("regex"));

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.lang = btn.getAttribute("data-lang");
      initCategorySelect();
      renderBaseSelectOptions();
      renderPoolTabs();
      renderAll();
      if (window.PoE2RegexTool) window.PoE2RegexTool.setLanguage(state.lang);
    });
  });

  el.categorySelect.addEventListener("change", () => selectCategory(el.categorySelect.value));
  el.baseSelect.addEventListener("change", () => { resetItemToBase(); renderAll(); });
  el.ilvlInput.addEventListener("change", () => {
    if (!state.item) return;
    state.item.ilvl = Math.max(1, Math.min(100, parseInt(el.ilvlInput.value, 10) || 84));
    el.ilvlInput.value = String(state.item.ilvl);
    renderAll();
  });
  el.qualityInput.addEventListener("change", () => {
    if (!state.item || !state.catData || !E.canSupportsQuality(state.catData)) return;
    if (state.item.corrupted) {
      el.qualityInput.value = String(state.item.quality || 0);
      showFeedback(tr("errCorruptQuality"), "error");
      return;
    }
    state.item.quality = Math.max(0, Math.min(30, parseInt(el.qualityInput.value, 10) || 0));
    el.qualityInput.value = String(state.item.quality);
    renderItemCard();
  });

  document.querySelectorAll("[data-ilvl]").forEach((b) => b.addEventListener("click", () => {
    el.ilvlInput.value = b.getAttribute("data-ilvl");
    el.ilvlInput.dispatchEvent(new Event("change"));
  }));
  document.querySelectorAll("[data-qual]").forEach((b) => b.addEventListener("click", () => {
    if (!state.item || !state.catData || !E.canSupportsQuality(state.catData) || state.item.corrupted) return;
    el.qualityInput.value = b.getAttribute("data-qual");
    el.qualityInput.dispatchEvent(new Event("change"));
  }));

  el.btnPunchSocket.addEventListener("click", () => commitCraftingResult(state.item, E.punchSocket(state.catData, state.item, state.lang), makeCostSpec("currency", "artificer")));
  el.btnClearSockets.addEventListener("click", () => commitCraftingResult(state.item, E.clearSockets(state.item, state.lang), null));
  el.aldurBar.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-toggle-aldur]");
    if (btn) commitCraftingResult(state.item, E.applyAldurRune(state.catData, state.item, btn.getAttribute("data-toggle-aldur"), true, state.lang), null);
  });

  document.querySelectorAll("[data-craft-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.craftTab = btn.getAttribute("data-craft-tab");
      document.querySelectorAll("[data-craft-tab]").forEach((b) => {
        const active = b.getAttribute("data-craft-tab") === state.craftTab;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + state.craftTab));
    });
  });

  el.currencyGrid.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-currency]");
    if (!btn || btn.disabled) return;
    const cid = btn.getAttribute("data-currency");
    commitCraftingResult(state.item, E.applyCurrency(state.catData, state.item, cid, state.activeOmens, state.lang), makeCostSpec("currency", cid));
  });

  function handleOmenClick(ev) {
    const btn = ev.target.closest("[data-omen]");
    if (!btn) return;
    const oid = btn.getAttribute("data-omen");
    if (state.activeOmens.has(oid)) state.activeOmens.delete(oid);
    else {
      const oDef = E.OMEN_MAP[oid];
      if (oDef && oDef.excludes) oDef.excludes.forEach((ex) => state.activeOmens.delete(ex));
      state.activeOmens.add(oid);
    }
    renderAll();
  }
  [el.omenGrid, el.desecrateOmenGrid, el.stashAbyssGrid, el.stashOmenGrid].forEach((n) => n.addEventListener("click", handleOmenClick));

  const syncKeepOmens = (checked) => {
    state.keepOmens = checked;
    el.keepOmensToggle.checked = checked;
    if (el.stashKeepOmensToggle) el.stashKeepOmensToggle.checked = checked;
  };
  el.keepOmensToggle.addEventListener("change", () => syncKeepOmens(el.keepOmensToggle.checked));
  if (el.stashKeepOmensToggle) el.stashKeepOmensToggle.addEventListener("change", () => syncKeepOmens(el.stashKeepOmensToggle.checked));

  el.essenceSearch.addEventListener("input", () => { state.essenceSearch = el.essenceSearch.value; renderEssences(); });
  document.querySelectorAll("[data-ess-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.essenceFilter = btn.getAttribute("data-ess-filter");
      document.querySelectorAll("[data-ess-filter]").forEach((b) => b.classList.toggle("active", b.getAttribute("data-ess-filter") === state.essenceFilter));
      renderEssences();
    });
  });

  el.essenceList.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-ess-id]");
    if (!btn || btn.disabled) return;
    const poolName = btn.getAttribute("data-ess-pool");
    const modDef = (state.catData.pools[poolName] || []).find((m) => m.id === btn.getAttribute("data-ess-id"));
    if (modDef) commitCraftingResult(state.item, E.applyEssence(state.catData, state.item, poolName, modDef, state.activeOmens, state.lang), makeCostSpec("essence", modDef));
  });

  el.templeList.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-temple]");
    if (!btn) return;
    const tid = btn.getAttribute("data-temple");
    commitCraftingResult(state.item, E.applyTempleCurrency(state.catData, state.item, tid, state.lang), makeCostSpec("temple", tid));
  });

  function startDesecrateReveal(boneId) {
    const boneDef = E.BONE_MAP[boneId];
    if (!boneDef) return;
    const res = E.rollDesecratedChoices(state.catData, state.item, boneDef, state.activeOmens, state.lang);
    if (!res.ok) { showFeedback(res.renderMessage ? res.renderMessage(state.lang) : res.message, "error"); return; }
    state.revealState = { boneDef, choices: res.choices, canReroll: res.canReroll, rerolled: false };
    recordCost(makeCostSpec("bone", boneDef.id), res.usedOmens);
    consumeUsedOmens(res.usedOmens);
    renderAll();
    showFeedback(tr("msgInjectedBone").replace("{name}", loc(boneDef, "name")), "success");
    const activeRevealEl = state.mode === "stash" ? el.stashRevealBox : el.revealBox;
    if (activeRevealEl && !activeRevealEl.classList.contains("hidden")) {
      activeRevealEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  el.desecrateBones.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-bone]");
    if (btn && !btn.disabled) startDesecrateReveal(btn.getAttribute("data-bone"));
  });

  function rerollReveal() {
    if (!state.revealState || !state.revealState.canReroll || state.revealState.rerolled) return;
    const res = E.rollDesecratedChoices(state.catData, state.item, state.revealState.boneDef, state.activeOmens, state.lang);
    if (!res.ok) { showFeedback(res.renderMessage ? res.renderMessage(state.lang) : res.message, "error"); return; }
    state.revealState.choices = res.choices;
    state.revealState.rerolled = true;
    recordCost(makeCostSpec("omen", "omen_abyssal_echoes"), []);
    if (!state.keepOmens) state.activeOmens.delete("omen_abyssal_echoes");
    renderAll();
  }
  el.btnRerollReveal.addEventListener("click", rerollReveal);
  el.btnStashRerollReveal.addEventListener("click", rerollReveal);

  function pickRevealChoice(ev) {
    const btn = ev.target.closest("[data-reveal-idx]");
    if (!btn || !state.revealState) return;
    const chosen = state.revealState.choices[parseInt(btn.getAttribute("data-reveal-idx"), 10)];
    if (!chosen) return;
    pushHistory(state.item);
    state.item = E.cloneItem(state.item);
    state.item.mods.push(chosen);
    state.revealState = null;
    addLog((l) => I18N.t(l, "msgRevealLog") + E.formatModTagName(chosen, l));
    renderAll();
  }
  el.revealChoices.addEventListener("click", pickRevealChoice);
  el.stashRevealChoices.addEventListener("click", pickRevealChoice);

  if (el.stashEssenceSearch) {
    el.stashEssenceSearch.addEventListener("input", () => { state.stashEssenceSearch = el.stashEssenceSearch.value; renderStashSimulation(); });
  }
  document.querySelectorAll("[data-stash-tab]").forEach((btn) => {
    btn.addEventListener("click", () => { state.stashTab = btn.getAttribute("data-stash-tab") || "abyss"; renderStashSimulation(); });
  });
  document.querySelectorAll("[data-stash-ess-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.stashEssenceFilter = btn.getAttribute("data-stash-ess-filter");
      document.querySelectorAll("[data-stash-ess-filter]").forEach((b) => b.classList.toggle("active", b.getAttribute("data-stash-ess-filter") === state.stashEssenceFilter));
      renderStashSimulation();
    });
  });

  el.stashView.addEventListener("click", (ev) => {
    const pickBtn = ev.target.closest("[data-stash-pick]");
    if (!pickBtn || pickBtn.disabled) return;
    const parts = pickBtn.getAttribute("data-stash-pick").split("|");
    state.cursorTool = parts[0] === "essence" ? { kind: parts[0], pool: parts[1], id: parts[2] } : { kind: parts[0], id: parts[1] };
    state.cursorTool.label = getCursorToolLabel(state.cursorTool);
    renderStashSimulation();
  });

  el.btnDropCursorTool.addEventListener("click", () => { state.cursorTool = null; renderStashSimulation(); });

  el.stashItemPedestal.addEventListener("click", () => {
    if (!state.cursorTool) { showFeedback(tr("errSelectStashTool"), "error"); return; }
    const { kind, id, pool } = state.cursorTool;
    if (kind === "currency") commitCraftingResult(state.item, E.applyCurrency(state.catData, state.item, id, state.activeOmens, state.lang), makeCostSpec("currency", id));
    else if (kind === "temple") commitCraftingResult(state.item, E.applyTempleCurrency(state.catData, state.item, id, state.lang), makeCostSpec("temple", id));
    else if (kind === "aldur") commitCraftingResult(state.item, E.applyAldurRune(state.catData, state.item, id, false, state.lang), makeCostSpec("aldur", id));
    else if (kind === "bone") startDesecrateReveal(id);
    else if (kind === "quality") commitCraftingResult(state.item, E.applyQualityCurrency(state.catData, state.item, id, state.lang), makeCostSpec("quality", id));
    else if (kind === "essence") {
      const modDef = ((state.catData && state.catData.pools && state.catData.pools[pool]) || []).find((m) => m.id === id);
      if (modDef) commitCraftingResult(state.item, E.applyEssence(state.catData, state.item, pool, modDef, state.activeOmens, state.lang), makeCostSpec("essence", modDef));
    }
  });

  function handleSlotAction(ev) {
    const btn = ev.target.closest("[data-slot-act]");
    if (!btn) return;
    const act = btn.getAttribute("data-slot-act");
    const uid = btn.getAttribute("data-uid");
    const next = E.cloneItem(state.item);
    const target = next.mods.find((m) => m.uid === uid);
    if (!target) return;
    if (act === "remove") next.mods = next.mods.filter((m) => m.uid !== uid);
    else if (act === "fracture") target.fractured = !target.fractured;
    else if (act === "reroll") {
      for (const ln of target.lines) ln.values = (ln.ranges || []).map((r) => E.rollValue(r[0], r[1], 1));
    }
    pushHistory(state.item);
    state.item = next;
    renderAll();
  }
  el.prefixSlots.addEventListener("click", handleSlotAction);
  el.suffixSlots.addEventListener("click", handleSlotAction);

  el.btnViewMerged.addEventListener("click", () => { state.viewMode = "merged"; renderItemCard(); });
  el.btnViewSplit.addEventListener("click", () => { state.viewMode = "split"; renderItemCard(); });

  window.addEventListener("keydown", (ev) => {
    if (ev.key === "Alt" && !state.altHeld) { state.altHeld = true; renderItemCard(); }
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "z" && !el.btnUndo.disabled) el.btnUndo.click();
    else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "y" && !el.btnRedo.disabled) el.btnRedo.click();
  });
  window.addEventListener("keyup", (ev) => { if (ev.key === "Alt" && state.altHeld) { state.altHeld = false; renderItemCard(); } });
  window.addEventListener("blur", () => { if (state.altHeld) { state.altHeld = false; renderItemCard(); } });

  el.btnUndo.addEventListener("click", () => {
    if (state.history.length === 0) return;
    state.redoStack.push(E.cloneItem(state.item));
    state.item = state.history.pop();
    state.activeMarkId = null;
    el.ilvlInput.value = String(state.item.ilvl || 84);
    updateHistoryButtons();
    renderAll();
  });
  el.btnRedo.addEventListener("click", () => {
    if (state.redoStack.length === 0) return;
    state.history.push(E.cloneItem(state.item));
    state.item = state.redoStack.pop();
    state.activeMarkId = null;
    el.ilvlInput.value = String(state.item.ilvl || 84);
    updateHistoryButtons();
    renderAll();
  });

  if (el.btnToggleSeason10) {
    el.btnToggleSeason10.addEventListener("click", () => {
      state.season10Enabled = !state.season10Enabled;
      if (!state.season10Enabled) state.activeMarkId = null;
      try { localStorage.setItem("poe2_season10_open", state.season10Enabled ? "1" : "0"); } catch (_) {}
      renderSeason10Box();
    });
  }
  const runDemoRare = (lvl) => {
    const res = E.prepareSeason10DemoRare(state.catData, state.item, lvl, state.lang);
    if (res.ok) el.ilvlInput.value = String(res.item.ilvl);
    commitCraftingResult(state.item, res, null);
  };
  if (el.btnS10Demo64) el.btnS10Demo64.addEventListener("click", () => runDemoRare(64));
  if (el.btnS10Demo84) el.btnS10Demo84.addEventListener("click", () => runDemoRare(84));

  const handleS10OrbClick = (ev) => {
    const btn = ev.target.closest("[data-s10-orb]");
    if (!btn || btn.disabled) return;
    const cid = btn.getAttribute("data-s10-orb");
    if (state.activeMarkId === cid) {
      state.activeMarkId = null;
      renderSeason10Box();
      return;
    }
    const check = E.checkSeason10MarkEligibility(state.catData, state.item, cid, state.lang);
    if (!check.ok) {
      state.activeMarkId = null;
      renderSeason10Box();
      showFeedback(check.message, "error");
      return;
    }
    state.activeMarkId = cid;
    renderSeason10Box();
  };
  if (el.s10ForgeGrid) el.s10ForgeGrid.addEventListener("click", handleS10OrbClick);
  if (el.s10BloodGrid) el.s10BloodGrid.addEventListener("click", handleS10OrbClick);
  if (el.s10ActionBar) {
    el.s10ActionBar.addEventListener("click", (ev) => {
      const targetBtn = ev.target.closest("[data-s10-target]");
      if (targetBtn && state.activeMarkId) {
        const cid = state.activeMarkId;
        const uid = targetBtn.getAttribute("data-s10-target");
        commitCraftingResult(state.item, E.applySeason10Mark(state.catData, state.item, cid, uid, state.lang), makeCostSpec("season10", cid));
        return;
      }
      if (ev.target.closest("#btnS10CancelPick")) {
        state.activeMarkId = null;
        renderSeason10Box();
        return;
      }
      if (ev.target.closest("#btnS10Reforge")) {
        commitCraftingResult(state.item, E.reforgeSeason10Marks(state.catData, state.item, state.lang), null);
      }
    });
  }
  el.btnResetItem.addEventListener("click", () => {
    pushHistory(state.item);
    resetItemToBase();
    addLog((l) => I18N.t(l, "msgResetItemLog"));
    renderAll();
    showFeedback(tr("msgResetItemBanner"), "success");
  });
  el.btnCopyItem.addEventListener("click", async () => {
    if (!state.catData || !state.item) return;
    try {
      await navigator.clipboard.writeText(E.exportItemText(state.catData, state.item, state.lang));
      showFeedback(tr("msgCopiedItem"), "success");
    } catch (_) {
      showFeedback(tr("errClipboard"), "error");
    }
  });

  el.btnClearLog.addEventListener("click", clearCostAndLogs);
  if (el.btnStashClearLog) el.btnStashClearLog.addEventListener("click", clearCostAndLogs);

  el.poolTabs.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-pool]");
    if (!btn) return;
    state.poolTab = btn.getAttribute("data-pool");
    state.activeTag = "";
    renderPoolTabs();
    renderModPool();
  });
  document.querySelectorAll("[data-gen-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.genFilter = btn.getAttribute("data-gen-filter");
      document.querySelectorAll("[data-gen-filter]").forEach((b) => b.classList.toggle("active", b.getAttribute("data-gen-filter") === state.genFilter));
      renderModPool();
    });
  });
  el.filterIlvlToggle.addEventListener("change", () => { state.filterIlvl = el.filterIlvlToggle.checked; renderModPool(); });
  el.modSearchInput.addEventListener("input", () => { state.modSearch = el.modSearchInput.value; renderModPool(); });
  el.tagFilterBar.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-tag]");
    if (!btn) return;
    state.activeTag = btn.getAttribute("data-tag");
    renderModPool();
  });

  el.modPoolList.addEventListener("click", (ev) => {
    const addModBtn = ev.target.closest("[data-add-mod]");
    if (addModBtn) {
      ev.stopPropagation();
      const [poolName, modId] = addModBtn.getAttribute("data-add-mod").split("|");
      const modDef = (state.catData.pools[poolName] || []).find((m) => m.id === modId);
      if (!modDef) return;
      const res = E.addModDirectly(state.catData, state.item, modDef, poolName, state.lang);
      if (!res.ok && res.needsRareUpgrade) {
        showRareUpgradePrompt(res.renderMessage ? res.renderMessage(state.lang) : res.message, res.modDef, res.poolName);
        return;
      }
      commitCraftingResult(state.item, res, null);
      return;
    }
    const headBtn = ev.target.closest("[data-toggle-fam]");
    if (headBtn) {
      const key = headBtn.getAttribute("data-toggle-fam");
      if (state.expandedFamilies.has(key)) state.expandedFamilies.delete(key);
      else state.expandedFamilies.add(key);
      renderModPool();
    }
  });

  // 初始化
  applyStaticI18n();
  initCategorySelect();
  selectCategory(state.slug);
  if (window.PoE2RegexTool) window.PoE2RegexTool.setLanguage(state.lang);
  if (window.location.hash === "#regex") switchMode("regex");
})();
