/**
 * 全站公共布局注入与导航组件（统一渲染 Topbar、语言切换、悬浮反馈条、Footer 免费声明）
 */
(function (global) {
  "use strict";

  const I18N = global.PoE2I18n;
  const Storage = global.PoE2Storage;
  const SeasonMgr = global.PoE2SeasonManager;

  const langListeners = [];
  let currentLang = Storage ? Storage.getLang() : "us";
  let feedbackTimer = null;

  const escapeHtml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const tr = (k) => (I18N ? I18N.t(currentLang, k) : k);

  function showFeedback(msg, type) {
    const banner = document.getElementById("feedbackBanner");
    if (!banner) return;
    if (feedbackTimer) { clearTimeout(feedbackTimer); feedbackTimer = null; }
    if (!msg) {
      banner.innerHTML = "";
      banner.classList.add("hidden");
      return;
    }
    banner.className = "status-feedback " + (type || "success");
    banner.innerHTML = `
      <span class="feedback-text">${escapeHtml(msg)}</span>
      <button type="button" class="feedback-close" id="btnDismissFeedback" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    const btn = document.getElementById("btnDismissFeedback");
    if (btn) btn.addEventListener("click", () => showFeedback("", ""));
    feedbackTimer = setTimeout(() => showFeedback("", ""), 5500);
  }
  global.PoE2ShowFeedback = showFeedback;

  function pageHref(relPath, extraQuery) {
    const base = SeasonMgr ? SeasonMgr.resolvePath(relPath) : relPath;
    const sep = base.includes("?") ? "&" : "?";
    const extra = extraQuery ? "&" + extraQuery : "";
    return `${base}${sep}lang=${encodeURIComponent(currentLang)}${extra}`;
  }

  function renderChrome() {
    const pageId = global.POE2_PAGE || "home";
    const topbar = document.getElementById("sharedTopbar");
    if (topbar) {
      const craftBtns = pageId === "tool2_crafting"
        ? `
          <div class="topbar-craft-actions" id="craftingTopActions">
            <button type="button" class="btn btn-ghost" id="btnUndo" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              <span data-i18n="undo">Undo</span>
            </button>
            <button type="button" class="btn btn-ghost" id="btnRedo" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
              <span data-i18n="redo">Redo</span>
            </button>
            <button type="button" class="btn btn-ghost" id="btnResetItem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 3 21 9 15 9"/></svg>
              <span data-i18n="resetItem">Reset Base</span>
            </button>
            <button type="button" class="btn btn-primary" id="btnCopyItem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span data-i18n="copyItem">Copy Item</span>
            </button>
          </div>`
        : "";

      const craftSubToggle = pageId === "tool2_crafting"
        ? `
          <div class="segmented" role="group" aria-label="做装视图">
            <button type="button" class="seg-btn active" id="btnModeWorkbench" data-mode="workbench" data-i18n="modeWorkbench">Workbench</button>
            <button type="button" class="seg-btn" id="btnModeStash" data-mode="stash" data-i18n="modeStash">Currency Stash Sim</button>
          </div>`
        : "";

      topbar.innerHTML = `
        <div class="topbar-left">
          <div class="segmented" role="group" aria-label="Tools Navigation">
            <a class="seg-btn ${pageId === "home" ? "active" : ""}" data-nav="index.html" href="${escapeHtml(pageHref("index.html"))}" data-i18n="navHome">Tools Hub</a>
            <a class="seg-btn ${pageId === "tool1_regex" ? "active" : ""}" data-nav="pages/tool1_regex/index.html" href="${escapeHtml(pageHref("pages/tool1_regex/index.html"))}" data-i18n="navRegex">Tool 1 · Regex Builder</a>
            <a class="seg-btn ${pageId === "tool2_crafting" ? "active" : ""}" data-nav="pages/tool2_crafting/index.html" href="${escapeHtml(pageHref("pages/tool2_crafting/index.html"))}" data-i18n="navCraftingWorkbench">Tool 2 · Workbench</a>
          </div>
          ${craftSubToggle}
        </div>
        <div class="topbar-actions">
          <div class="segmented" role="group" aria-label="Language">
            <button type="button" class="seg-btn" data-lang="cn">简中</button>
            <button type="button" class="seg-btn" data-lang="tw">繁體</button>
            <button type="button" class="seg-btn" data-lang="us">EN</button>
          </div>
          <a class="btn btn-ghost" id="btnPoe2dbRef" href="https://poe2db.tw/${currentLang}/Modifiers" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span data-i18n="poe2dbRef">PoE2DB Reference</span>
          </a>
          ${craftBtns}
        </div>
      `;
    }

    const footer = document.getElementById("sharedFooter");
    if (footer) {
      footer.innerHTML = `
        <div class="footer-inner">
          <div class="footer-head">
            <div class="footer-title-group">
              <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <h2 class="footer-title" data-i18n="footerTitle">100% Free &amp; Open Tool</h2>
              <span class="footer-badge" data-i18n="footerBadge">Free to Use · No Resale</span>
            </div>
            <a class="btn btn-primary btn-sm footer-bili-btn" href="https://space.bilibili.com/7132721" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="2" y="6" width="20" height="14" rx="3"/>
                <path d="m7 2 4 4"/><path d="m17 2-4 4"/>
                <path d="M9 11v4"/><path d="M15 11v4"/>
              </svg>
              <span data-i18n="footerBiliBtn">Bilibili: LMemory氿忆</span>
            </a>
          </div>
          <div class="footer-grid">
            <div class="footer-col">
              <p class="footer-lead" data-i18n="footerFreeLead"></p>
              <div class="footer-alert" data-i18n="footerScamAlert"></div>
              <p class="footer-note" data-i18n="footerDisclaimer"></p>
            </div>
            <div class="footer-col footer-col-sponsor">
              <p class="footer-lead">
                <span data-i18n="footerSponsorPre"></span><a class="footer-link" href="https://space.bilibili.com/7132721" target="_blank" rel="noopener noreferrer">LMemory氿忆</a><span data-i18n="footerSponsorPost"></span>
              </p>
              <p class="footer-desc" data-i18n="footerSponsorDesc"></p>
              <p class="footer-note" data-i18n="footerSponsorNote"></p>
            </div>
          </div>
        </div>
      `;
    }
  }

  function applyI18n(lang) {
    currentLang = Storage ? Storage.setLang(lang || currentLang) : (lang || currentLang);
    const pageId = global.POE2_PAGE || "home";
    document.documentElement.lang = currentLang === "us" ? "en" : currentLang === "tw" ? "zh-TW" : "zh-CN";
    document.title = pageId === "tool1_regex" ? tr("siteTitleRegex") : pageId === "tool2_crafting" ? (tr("appTitle") + " — PoE2DB") : tr("siteTitleHub");

    document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = tr(n.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach((n) => { n.setAttribute("placeholder", tr(n.getAttribute("data-i18n-ph"))); });
    document.querySelectorAll("[data-lang]").forEach((b) => { b.classList.toggle("active", b.getAttribute("data-lang") === currentLang); });
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const target = a.getAttribute("data-nav");
      const extra = a.getAttribute("data-nav-extra") || "";
      a.href = pageHref(target, extra);
    });
    const refBtn = document.getElementById("btnPoe2dbRef");
    if (refBtn && pageId !== "tool2_crafting") {
      refBtn.href = `https://poe2db.tw/${currentLang}/${pageId === "tool1_regex" ? "Waystones" : "Modifiers"}`;
    }
  }

  function setLanguage(lang) {
    applyI18n(lang);
    for (const cb of langListeners) cb(currentLang);
  }

  function init() {
    renderChrome();
    applyI18n(currentLang);
    const topbar = document.getElementById("sharedTopbar");
    if (topbar) {
      topbar.addEventListener("click", (ev) => {
        const btn = ev.target.closest("[data-lang]");
        if (!btn) return;
        setLanguage(btn.getAttribute("data-lang"));
      });
    }
  }

  if (document.getElementById("sharedTopbar")) init();
  else document.addEventListener("DOMContentLoaded", init);

  global.PoE2Layout = {
    getLanguage: () => currentLang,
    setLanguage,
    applyI18n,
    onLanguageChange: (fn) => { if (typeof fn === "function") langListeners.push(fn); }
  };
})(window);
