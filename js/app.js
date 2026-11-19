/**
 * Application Bootstrap & Router for Full-Stack, QA & System Architect Academy
 * Separated Mode Pages: #/ (Fullstack), #/qa (QA Engineer), #/sa (System Architect)
 */

(function (window, document) {
  'use strict';

  const state = window.academyState;
  const ui = window.academyUI;
  const { searchModules, escapeHTML } = window.academySearch;

  const mainStage = document.getElementById('mainStage');
  const catalogSidebar = document.getElementById('catalogSidebar');
  const mobileCatalogSidebar = document.getElementById('mobileCatalogSidebar');
  const headerProgressText = document.getElementById('headerProgressText');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  // Search Modal Elements
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');
  const searchModalBackdrop = document.getElementById('searchModalBackdrop');
  const searchModalInput = document.getElementById('searchModalInput');
  const searchModalResults = document.getElementById('searchModalResults');
  const searchModalClose = document.getElementById('searchModalClose');

  // --- Router ---

  function parseHash() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryStr] = hash.split('?');
    const parts = path.split('/').filter(Boolean);
    const query = new URLSearchParams(queryStr || '');
    return { parts, query, path };
  }

  function navigate(hash) {
    if (window.location.hash === hash) {
      handleRoute();
    } else {
      window.location.hash = hash;
    }
  }

  function syncModeUI(mode) {
    state.setMode(mode, true);
    document.querySelectorAll('.mode-tab[data-mode]').forEach(btn => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const subtitleEl = document.getElementById('brandSubtitleText');
    if (subtitleEl) {
      if (mode === 'qa') subtitleEl.textContent = 'Senior QA & Automation';
      else if (mode === 'sa') subtitleEl.textContent = 'System Design & Architecture';
      else subtitleEl.textContent = 'From Fundamentals to Architecture';
    }

    const mobileCountEl = document.getElementById('mobileDrawerCount');
    if (mobileCountEl) {
      const modeTracks = (window.TRACKS || []).filter(t => (t.mode || 'fullstack') === mode);
      mobileCountEl.textContent = `${modeTracks.length} Jalur (${ui.getModeMeta(mode).label})`;
    }

    ui.renderSidebar(catalogSidebar, mode);
    ui.renderSidebar(mobileCatalogSidebar, mode);
  }

  function handleRoute() {
    const { parts, query } = parseHash();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeDrawer();

    if (parts.length === 0 || parts[0] === 'home' || parts[0] === 'fullstack') {
      syncModeUI('fullstack');
      updateNavHighlight('home');
      ui.renderHome(mainStage, 'fullstack');
    } else if (parts[0] === 'qa') {
      syncModeUI('qa');
      updateNavHighlight('home');
      ui.renderHome(mainStage, 'qa');
    } else if (parts[0] === 'sa') {
      syncModeUI('sa');
      updateNavHighlight('home');
      ui.renderHome(mainStage, 'sa');
    } else if (parts[0] === 'track' && parts[1]) {
      const trackId = decodeURIComponent(parts[1]);
      const track = (window.TRACKS || []).find(t => t.id === trackId);
      const mode = track?.mode || 'fullstack';
      syncModeUI(mode);
      updateNavHighlight('track', trackId);
      ui.renderTrack(mainStage, trackId);
    } else if (parts[0] === 'module' && parts[1]) {
      const moduleId = parts[1];
      const mod = (window.MODULES || []).find(m => m.id === moduleId);
      const mode = mod?.mode || 'fullstack';
      const stepIndex = parts[2] !== undefined ? Number(parts[2]) : null;
      syncModeUI(mode);
      updateNavHighlight('module', mod?.track || '');
      ui.renderModule(mainStage, moduleId, stepIndex);
    } else if (parts[0] === 'bookmarks') {
      syncModeUI(state.getMode());
      updateNavHighlight('bookmarks');
      ui.renderBookmarksPage(mainStage);
    } else if (parts[0] === 'search') {
      const q = query.get('q') || '';
      syncModeUI(state.getMode());
      updateNavHighlight('search');
      ui.renderSearchPage(mainStage, q);
    } else {
      syncModeUI('fullstack');
      updateNavHighlight('home');
      ui.renderHome(mainStage, 'fullstack');
    }

    updateProgressUI();
  }

  function updateNavHighlight(route, value = '') {
    document.querySelectorAll('.header-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.action === route);
    });

    document.querySelectorAll('.sidebar-track-btn').forEach(btn => {
      const isMatch = (route === 'track' || route === 'module') && btn.dataset.trackId === value;
      btn.classList.toggle('active', isMatch);
    });
  }

  // --- Progress Updates ---

  function updateProgressUI() {
    const mode = state.getMode();
    const stats = state.getProgressStats(null, mode);
    const shortMode = mode === 'qa' ? 'QA' : (mode === 'sa' ? 'SA' : 'FS');
    if (headerProgressText) {
      headerProgressText.textContent = `${shortMode}: ${stats.completed}/${stats.total}`;
    }
  }

  // --- Mobile Drawer ---

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Theme Toggle ---

  function applyTheme(themeName) {
    document.body.classList.toggle('dark', themeName === 'dark');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = themeName === 'dark' 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      themeToggleBtn.setAttribute('title', themeName === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap');
    }
  }

  // --- Clipboard Copy ---

  function copyTextToClipboard(text, triggerBtn) {
    const onSuccess = () => {
      const orig = triggerBtn.innerHTML;
      triggerBtn.innerHTML = '✓ Tersalin!';
      setTimeout(() => { triggerBtn.innerHTML = orig; }, 1800);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
    } else {
      fallbackCopy(text, onSuccess);
    }
  }

  function fallbackCopy(text, cb) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      if (cb) cb();
    } catch (e) {
      alert('Pilih teks secara manual untuk menyalin.');
    }
    document.body.removeChild(el);
  }

  // --- Search Spotlight Modal ---

  function openSearchModal() {
    if (searchModalBackdrop) {
      searchModalBackdrop.classList.add('open');
      searchModalInput.value = '';
      const totalModules = (window.MODULES || []).length;
      const modalCountEl = document.getElementById('searchModalTotalCount');
      if (modalCountEl) modalCountEl.textContent = `${totalModules} Modul Terindeks (FS + QA + SA)`;
      searchModalResults.innerHTML = '<div style="padding:24px; text-align:center; color:var(--color-muted); font-size:12px;">Ketik kata kunci untuk mencari materi di Fullstack, QA, maupun System Design (mis: Playwright, LCP, k6, Fencing, Outbox, REST)...</div>';
      setTimeout(() => searchModalInput.focus(), 50);
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSearchModal() {
    if (searchModalBackdrop) {
      searchModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function runModalSearch(query) {
    const term = query.trim();
    if (!term) {
      searchModalResults.innerHTML = '<div style="padding:24px; text-align:center; color:var(--color-muted); font-size:12px;">Ketik kata kunci untuk mencari materi atau sintaks kode...</div>';
      return;
    }

    const results = searchModules(term).slice(0, 8);
    if (!results.length) {
      searchModalResults.innerHTML = `<div style="padding:24px; text-align:center; color:var(--color-muted); font-size:12px;">Tidak ada hasil untuk "${escapeHTML(term)}". Coba kata kunci lain.</div>`;
      return;
    }

    searchModalResults.innerHTML = results.map(r => `
      <div class="search-result-item" tabindex="0" role="button" data-open-module="${r.module.id}">
        <div class="search-result-header">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            ${ui.renderModePillBadge(r.module.mode)}
            <span class="search-match-chip">${escapeHTML(r.matchType)}</span>
          </div>
          <span style="font-size:10px; color:var(--color-muted); font-weight:600;">${escapeHTML(r.module.track)}</span>
        </div>
        <div class="search-item-title">${escapeHTML(r.module.title)}</div>
        <div class="search-item-snippet">${escapeHTML(r.snippet)}</div>
      </div>
    `).join('') + `
      <button class="btn btn-outline" style="width:100%; margin-top:8px;" id="viewAllSearchBtn">
        Lihat Semua Hasil di Halaman Pencarian →
      </button>
    `;

    const viewAllBtn = searchModalResults.querySelector('#viewAllSearchBtn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        closeSearchModal();
        navigate(`#/search?q=${encodeURIComponent(term)}`);
      });
    }
  }

  // --- Global Event Listeners ---

  function setupEvents() {
    window.addEventListener('hashchange', handleRoute);

    state.subscribe(() => {
      updateProgressUI();
      const mode = state.getMode();
      ui.renderSidebar(catalogSidebar, mode);
      ui.renderSidebar(mobileCatalogSidebar, mode);
    });

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = state.toggleTheme();
        applyTheme(nextTheme);
      });
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    if (searchTriggerBtn) searchTriggerBtn.addEventListener('click', openSearchModal);
    if (searchModalClose) searchModalClose.addEventListener('click', closeSearchModal);
    if (searchModalBackdrop) {
      searchModalBackdrop.addEventListener('click', (e) => {
        if (e.target === searchModalBackdrop) closeSearchModal();
      });
    }

    if (searchModalInput) {
      searchModalInput.addEventListener('input', (e) => {
        runModalSearch(e.target.value);
      });
      searchModalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = searchModalInput.value.trim();
          if (val) {
            closeSearchModal();
            navigate(`#/search?q=${encodeURIComponent(val)}`);
          }
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      } else if (e.key === 'Escape') {
        closeSearchModal();
        closeDrawer();
      }
    });

    document.addEventListener('click', (e) => {
      // Mode switching tabs (Fullstack | QA | SA)
      const modeTab = e.target.closest('.mode-tab[data-mode]');
      if (modeTab) {
        e.preventDefault();
        const targetMode = modeTab.dataset.mode;
        const targetHash = targetMode === 'fullstack' ? '#/' : `#/${targetMode}`;
        navigate(targetHash);
        return;
      }

      // Open module
      const moduleEl = e.target.closest('[data-open-module]');
      if (moduleEl) {
        e.preventDefault();
        const id = moduleEl.dataset.openModule;
        closeSearchModal();
        navigate(`#/module/${id}`);
        return;
      }

      // Open track
      const trackEl = e.target.closest('[data-open-track], [data-track-id]');
      if (trackEl) {
        e.preventDefault();
        const trackId = trackEl.dataset.openTrack || trackEl.dataset.trackId;
        navigate(`#/track/${encodeURIComponent(trackId)}`);
        return;
      }

      // Navigation actions
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        e.preventDefault();
        const action = actionEl.dataset.action;
        const currentMode = state.getMode();
        const modeHomeHash = currentMode === 'fullstack' ? '#/' : `#/${currentMode}`;

        if (action === 'home') navigate(modeHomeHash);
        if (action === 'mode-home') {
          const m = actionEl.dataset.mode || 'fullstack';
          navigate(m === 'fullstack' ? '#/' : `#/${m}`);
        }
        if (action === 'bookmarks') navigate('#/bookmarks');
        if (action === 'search') openSearchModal();
        if (action === 'tracks') {
          navigate(modeHomeHash);
          setTimeout(() => {
            const dir = document.getElementById('tracksDirectory');
            if (dir) dir.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        return;
      }

      // Copy primary code
      const copyBtn = e.target.closest('[data-copy]');
      if (copyBtn) {
        e.preventDefault();
        const id = copyBtn.dataset.copy;
        const mod = (window.MODULES || []).find(m => m.id === id);
        if (mod?.code?.content) {
          copyTextToClipboard(mod.code.content, copyBtn);
        }
        return;
      }

      // Copy extra code
      const copyExtraBtn = e.target.closest('[data-copy-extra]');
      if (copyExtraBtn) {
        e.preventDefault();
        const [modId, idxStr] = copyExtraBtn.dataset.copyExtra.split(':');
        const mod = (window.MODULES || []).find(m => m.id === modId);
        const extra = mod?.extraCodes?.[Number(idxStr)];
        if (extra?.content) {
          copyTextToClipboard(extra.content, copyExtraBtn);
        }
        return;
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute('role') === 'button') {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  // --- Initializer ---

  function init() {
    applyTheme(state.theme);
    setupEvents();
    handleRoute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window, document);
