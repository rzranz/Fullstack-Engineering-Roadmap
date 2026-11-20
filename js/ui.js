/**
 * UI Rendering Engine for Full-Stack, QA & System Architect Academy
 * Aesthetic: Design Playground Layout + iCraft Luminous Color Theme
 * Separated Modes: Fullstack | QA Engineer | System Architect (SA)
 */

(function (window) {
  'use strict';

  const { escapeHTML } = window.academySearch;

  let activeSimInstance = null;

  function cleanupActiveSim() {
    if (activeSimInstance && typeof activeSimInstance.destroy === 'function') {
      activeSimInstance.destroy();
    }
    activeSimInstance = null;
  }

  const EXACT_SIM_MAP = {
    // All 14 System Architect (SA) Modules — 100% Coverage
    sam01: 'network_http3',
    sam02: 'realtime_fleet',
    sam03: 'sticky_lb_stateless',
    sam04: 'storage_btree_lsm',
    sam05: 'sharding_quorum',
    sam06: 'cache_stampede',
    sam07: 'fencing_locks',
    sam08: 'dual_write_outbox',
    sam09: 'circuit_breaker',
    sam10: 'observability_otel',
    sam11: 'sharding_quorum',
    sam12: 'flash_sale',
    sam13: 'circuit_breaker',
    sam14: 'flash_sale',
    // Fullstack Behind-the-Scenes System Design & Architecture Modules
    w01: 'network_http3',
    s32: 'sticky_lb_stateless',
    s33: 'sticky_lb_stateless',
    s34: 'flash_sale',
    s35: 'sharding_quorum',
    s36: 'circuit_breaker',
    s37: 'circuit_breaker',
    s38: 'observability_otel',
    s39: 'cache_stampede',
    s40: 'dual_write_outbox',
    s41: 'flash_sale',
    arch02: 'sticky_lb_stateless',
    arch03: 'circuit_breaker',
    db03: 'storage_btree_lsm',
    sql63: 'storage_btree_lsm',
    sql64: 'sharding_quorum',
    rt01: 'realtime_fleet',
    rt02: 'realtime_fleet',
    rt03: 'realtime_fleet',
    pay01: 'dual_write_outbox',
    pay02: 'fencing_locks',
    pay03: 'dual_write_outbox',
    lab01: 'fencing_locks',
    lab02: 'dual_write_outbox',
    lab03: 'flash_sale',
    lab04: 'cache_stampede',
    qam17: 'flash_sale'
  };

  function getScenarioForModule(module) {
    if (!module) return null;
    if (EXACT_SIM_MAP[module.id]) return EXACT_SIM_MAP[module.id];
    const track = (module.track || '').toLowerCase();
    if (track.includes('cloudflare')) return 'observability_otel';
    if (track.includes('system design') || track.includes('architecture')) return 'flash_sale';
    if (track.includes('api design') || track.includes('security')) return 'network_http3';
    return null;
  }

  const LESSON_STEPS = [
    { id: 'overview', label: 'Ringkasan', short: 'Tujuan Belajar', icon: '01' },
    { id: 'concepts', label: 'Konsep Inti', short: 'Teori & Tabel', icon: '02' },
    { id: 'architecture', label: 'Komparasi', short: 'Trade-off & Analisa', icon: '03' },
    { id: 'code', label: 'Kode & Visual', short: 'Specimen & Alur', icon: '04' },
    { id: 'practices', label: 'Best Practices', short: 'Standar Industri', icon: '05' },
    { id: 'cases', label: 'Kasus Nyata', short: 'Studi Kasus Produksi', icon: '06' },
    { id: 'exercise', label: 'Langkah Impl.', short: 'Sederhana → Pro', icon: '07' },
    { id: 'quiz', label: 'Uji & Kuis', short: 'Live Test & Evaluasi', icon: '08' }
  ];

  const selectedCategoryByMode = {
    fullstack: 'all',
    qa: 'all',
    sa: 'all'
  };

  const MODE_CONFIG = {
    fullstack: {
      id: 'fullstack',
      label: 'Fullstack',
      directoryLabel: 'FULLSTACK ROADMAP DIRECTORY',
      directoryDesc: 'Pilih salah satu dari 29 jalur kurikulum Full-Stack dari fondasi web hingga edge security.',
      kicker: 'FULL-STACK ENGINEERING ACADEMY / 29 JALUR · 156 MODUL · PRODUCTION GRADE',
      heading: 'FROM WEB FUNDAMENTALS<br>TO DISTRIBUTED ARCHITECTURE.',
      quote: '“From Clean Code to Enterprise Scalability & Edge Security”',
      lead: 'Kurikulum komprehensif terarah untuk mendalami rekayasa perangkat lunak modern: fondasi browser, request lifecycle, framework frontend (Vue/Nuxt/React/Next), arsitektur backend multi-bahasa (Go/Java/C#), edge security (Cloudflare/Turnstile), AI/RAG, hingga payment & reliability engineering.',
      meta: [
        { label: 'Fokus Rekayasa', value: 'Web to Enterprise Scale' },
        { label: 'Cakupan Kurikulum', value: '29 Jalur · 156 Modul' },
        { label: 'Teknologi Utama', value: 'TypeScript · Go · Java · C# · Cloudflare' },
        { label: 'Akses Belajar', value: '100% Gratis · Offline Ready' }
      ],
      methodologyTitle: 'UNDERSTAND → EXPLORE → BUILD → SHIP',
      methodologySub: 'Bangun intuisi sistem dari siklus request dasar, uji trade-off arsitektur, buat implementasi kode riil, lalu amankan di production edge.',
      stages: [
        { num: 'Stage 01', pill: 'UNDERSTAND', title: 'Fondasi Web', desc: 'Pahami request lifecycle, batas tanggung jawab frontend vs backend, DNS, TLS, dan integritas data persisten.' },
        { num: 'Stage 02', pill: 'EXPLORE', title: 'Arsitektur & Stack', desc: 'Bandingkan framework frontend & backend, REST contract, SQL indexing, dan pola modular monolith vs microservices.' },
        { num: 'Stage 03', pill: 'BUILD', title: 'Implementasi Riil', desc: 'Pelajari contoh kode specimen multi-bahasa, tangani skenario kegagalan, dan bangun fitur transaksi andal.' },
        { num: 'Stage 04', pill: 'SHIP & SECURE', title: 'Keamanan & Edge', desc: 'Lindungi origin dengan Cloudflare WAF, Turnstile, bot protection, webhook idempotency, dan observabilitas.', dark: true }
      ]
    },
    qa: {
      id: 'qa',
      label: 'QA Engineer',
      directoryLabel: 'QA ENGINEER BLUEPRINT DIRECTORY',
      directoryDesc: '5 Fase terstruktur (8 Jalur · 30 Modul): SDLC/STLC, DevTools, Postman, Playwright, Web Vitals, k6 & Studi Kasus Nyata OpenMRS/Java/CLI.',
      kicker: 'QA SOFTWARE ENGINEER ROADMAP / 5 FASE · 8 JALUR · 30 MODUL',
      heading: 'FROM FUNDAMENTAL QA<br>TO AUTOMATED QUALITY GATE.',
      quote: '“From SDLC, DevTools & Postman to Playwright, Java Selenium, Web Vitals & k6 Trend”',
      lead: 'Panduan lengkap QA Software Engineer dari nol hingga studi kasus proyek nyata: SDLC/STLC, EP/BVA, DevTools, Postman & Newman, Playwright POM, Java RestAssured + Selenium 4 POM + Apache POI DDT + CDP 9223, Web Vitals (Lighthouse & k6/browser), k6 Custom Trend 1.000 VUs, serta Command Runner lokal.',
      meta: [
        { label: 'Struktur Belajar', value: '5 Fase Terarah + Case Study' },
        { label: 'Cakupan Materi', value: '8 Jalur · 30 Modul Lengkap' },
        { label: 'Tools Industri', value: 'Postman · Playwright · Selenium · k6 · Lighthouse' },
        { label: 'Target Praktik', value: 'SauceDemo · Herokuapp · ReqRes · OpenMRS' }
      ],
      methodologyTitle: 'DESIGN → INSPECT → AUTOMATE → BENCHMARK',
      methodologySub: 'Setiap fase disusun bertahap agar tidak membingungkan: kuasai analisis manual & API dulu sebelum menulis skrip automasi dan CI/CD.',
      stages: [
        { num: 'Fase 01', pill: 'FUNDAMENTAL', title: 'SDLC, STLC & Desain Uji', desc: 'Pahami SDLC vs STLC, 5 tipe testing, EP/BVA, Decision Table, Test Case TC-AUTH-001, dan Severity vs Priority.' },
        { num: 'Fase 02', pill: 'WEB & API', title: 'DevTools, Postman & SQL', desc: 'Inspeksi Network/Console/Storage, Post-response assertions, Auto-JWT, Jira Gherkin/Bug Report, SQL & OWASP.' },
        { num: 'Fase 03', pill: 'AUTOMATION', title: 'Playwright POM E2E', desc: 'TypeScript async/await, Locator user-facing, LoginPage & CheckoutPage POM, API seeding & Fault Injection 503.' },
        { num: 'Fase 04', pill: 'PERF & CI/CD', title: 'Web Vitals, k6 & Actions', desc: 'Audit & perbaikan kode LCP/INP/CLS, Load Test k6 P95/P99, serta pipeline GitHub Actions + Artifact Report.', dark: true }
      ],
      quickActionModuleId: 'qam19',
      quickActionLabel: 'Buka Peta Jalan Terpadu'
    },
    sa: {
      id: 'sa',
      label: 'System Architect',
      directoryLabel: 'SYSTEM DESIGN BLUEPRINT DIRECTORY',
      directoryDesc: '6 jalur menyeluruh: 9 Modul Inti, 5 Pilar Handling, 9 Studi Kasus Trade-Off & Simulasi.',
      kicker: 'SYSTEM DESIGN & ARCHITECTURE / 6 JALUR · 14 MODUL · 9 TRADE-OFF CASES',
      heading: 'FROM NETWORK PROTOCOLS<br>TO DISTRIBUTED RESILIENCE.',
      quote: '“From L4/L7 & Storage Internals to Consensus, Outbox CDC & Chaos Handling”',
      lead: 'Master Blueprint System Design dari lapisan jaringan (TCP/QUIC/Anycast), skalabilitas & Load Balancing, mesin penyimpanan (B-Tree vs LSM-Tree & Quorum), caching, CAP/PACELC & Fencing Tokens, Kafka Outbox CDC, Circuit Breaker & Observability, kerangka 4-langkah + 8 kasus klasik, 5 pilar handling produksi, hingga spesifikasi simulasi kausal.',
      meta: [
        { label: 'Kerangka Kerja', value: '4-Step Design & QPS Estimation' },
        { label: 'Cakupan Kurikulum', value: '9 Modul Inti · 5 Pilar Handling' },
        { label: 'Bank Studi Kasus', value: '9 Trade-Off Cases + 8 Classic Systems' },
        { label: 'Simulasi Kausal', value: 'Unhandled vs Handled Spec' }
      ],
      methodologyTitle: 'CLARIFY → ARCHITECT → HANDLE → TRADE-OFF',
      methodologySub: 'Setiap keputusan arsitektur memiliki harga. Hitung kapasitas QPS, rancang high-level design, mitigasi bottleneck, dan jelaskan trade-off-nya.',
      stages: [
        { num: 'Stage 01', pill: 'NETWORK & SCALE', title: 'Jaringan & Trafik', desc: 'Kuasai L4/L7, DNS Anycast, HTTP/3 QUIC, gRPC/SSE, Stateless Horizontal Scaling, LB, API Gateway & CDN.' },
        { num: 'Stage 02', pill: 'DATA & CACHE', title: 'Storage & Caching', desc: 'ACID isolation, B-Tree vs LSM-Tree, Quorum R+W>N, Sharding, Singleflight, Bloom Filter & TTL Jitter.' },
        { num: 'Stage 03', pill: 'DISTRIBUTED', title: 'Konsensus & Event', desc: 'CAP/PACELC, Raft, Fencing Tokens atasi GC pause, Snowflake ID, Transactional Outbox & Debezium CDC.' },
        { num: 'Stage 04', pill: 'RESILIENCE & OPS', title: 'Ketahanan & Handling', desc: 'Saga, Circuit Breaker, Bulkhead, 5 Pilar Operational Handling, OpenTelemetry & topologi kausal Flash Sale.', dark: true }
      ],
      quickActionModuleId: 'sam14',
      quickActionLabel: 'Topologi Simulasi Kausal'
    }
  };

  function getModeMeta(mode) {
    return MODE_CONFIG[mode] || MODE_CONFIG.fullstack;
  }

  function getLevelClass(level) {
    const l = (level || '').toLowerCase();
    if (l.includes('beginner') || l.includes('dasar')) return 'beginner';
    if (l.includes('advanced') || l.includes('mahir')) return 'advanced';
    return 'intermediate';
  }

  function renderModePillBadge(mode) {
    const m = mode || 'fullstack';
    const label = m === 'qa' ? 'QA' : (m === 'sa' ? 'SA' : 'FULLSTACK');
    return `<span class="mode-pill-badge ${m}">${label}</span>`;
  }

  function renderTablesHTML(tables) {
    if (!Array.isArray(tables) || !tables.length) return '';
    return tables.map(table => `
      <div class="data-table-wrap">
        ${table.title ? `<div class="data-table-caption">● ${escapeHTML(table.title)}</div>` : ''}
        <table class="data-table">
          <thead>
            <tr>
              ${(table.headers || []).map(h => `<th>${escapeHTML(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${(table.rows || []).map(row => `
              <tr>
                ${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
  }

  // --- Folder Card Components ---

  function renderModuleCard(module, index, showModeBadge = false) {
    const state = window.academyState;
    const isDone = state.isCompleted(module.id);
    const levelClass = getLevelClass(module.level);
    const concepts = (module.concepts || []).slice(0, 3).map(([title]) => 
      `<span class="folder-chip-item">${escapeHTML(title)}</span>`
    ).join('');

    return `
      <article class="folder-card ${isDone ? 'is-completed' : ''}" 
               tabindex="0" 
               role="button" 
               data-open-module="${module.id}" 
               aria-label="Buka materi ${escapeHTML(module.title)}">
        <div class="folder-tab-header">
          <div class="folder-tab">
            <span class="folder-tab-icon">📁</span>
            <span>DIR · M${String(index + 1).padStart(2, '0')}</span>
          </div>
          <div class="folder-tab-filler" style="gap:5px;">
            ${showModeBadge ? renderModePillBadge(module.mode) : ''}
            <span class="level-badge ${levelClass}">${escapeHTML(module.level)}</span>
          </div>
        </div>

        <div class="folder-body">
          <h4 class="folder-title">${escapeHTML(module.title)}</h4>
          <p class="folder-summary">${escapeHTML(module.summary)}</p>
          <div class="folder-chips">
            ${concepts}
          </div>
          <div class="folder-footer">
            <span class="folder-status ${isDone ? 'done' : 'todo'}">
              ${isDone ? '✓ Selesai dipelajari' : '○ Belum dipelajari'}
            </span>
            <span class="folder-footer-action">Buka Materi →</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderTrackCard(track, index) {
    const state = window.academyState;
    const counts = state.getTrackStats(track.id);

    return `
      <article class="folder-card ${counts.total > 0 && counts.completed === counts.total ? 'is-completed' : ''}" 
               tabindex="0" 
               role="button" 
               data-open-track="${escapeHTML(track.id)}" 
               aria-label="Buka jalur ${escapeHTML(track.name)}">
        <div class="folder-tab-header">
          <div class="folder-tab">
            <span class="folder-tab-icon">${escapeHTML(track.icon || '❖')}</span>
            <span>TRACK · ${String(index + 1).padStart(2, '0')}</span>
          </div>
          <div class="folder-tab-filler">
            <span class="level-badge beginner">${counts.total} MODUL</span>
          </div>
        </div>

        <div class="folder-body">
          <h4 class="folder-title">${escapeHTML(track.name)}</h4>
          <p class="folder-summary">${escapeHTML(track.desc)}</p>
          <div class="folder-footer">
            <span style="font-size:11px; color:var(--color-muted); font-weight:600;">
              ${counts.completed}/${counts.total} Selesai (${counts.percent}%)
            </span>
            <span class="folder-footer-action">Buka Jalur →</span>
          </div>
        </div>
      </article>
    `;
  }

  // --- Views ---

  function renderHome(container, modeOverride = null) {
    cleanupActiveSim();
    const state = window.academyState;
    const mode = modeOverride || state.getMode();
    const cfg = getModeMeta(mode);

    const allTracks = window.TRACKS || [];
    const allModules = window.MODULES || [];

    const modeTracks = allTracks.filter(t => (t.mode || 'fullstack') === mode);
    const modeModules = allModules.filter(m => (m.mode || 'fullstack') === mode);

    const categories = [...new Set(modeTracks.map(t => t.category))];
    if (selectedCategoryByMode[mode] !== 'all' && !categories.includes(selectedCategoryByMode[mode])) {
      selectedCategoryByMode[mode] = 'all';
    }
    const activeCategory = selectedCategoryByMode[mode];
    const visibleCategories = activeCategory === 'all' ? categories : categories.filter(c => c === activeCategory);
    const nextModule = modeModules.find(m => !state.isCompleted(m.id)) || modeModules[0];

    const phasePillsHTML = [
      `<button class="roadmap-phase-pill ${activeCategory === 'all' ? 'active' : ''}" data-phase-filter="all">
         <span>Semua Fase</span>
         <span class="phase-pill-count">${modeTracks.length}</span>
       </button>`,
      ...categories.map(cat => {
        const groupTracks = modeTracks.filter(t => t.category === cat);
        const groupModIds = new Set(modeModules.filter(m => groupTracks.some(t => t.id === m.track)).map(m => m.id));
        const doneInCat = [...groupModIds].filter(id => state.isCompleted(id)).length;
        return `<button class="roadmap-phase-pill ${activeCategory === cat ? 'active' : ''}" data-phase-filter="${escapeHTML(cat)}">
          <span>${escapeHTML(cat)}</span>
          <span class="phase-pill-count">${doneInCat}/${groupModIds.size}</span>
        </button>`;
      })
    ].join('');

    const qaPracticeTargetsHTML = mode === 'qa' ? `
      <div class="practice-targets-strip">
        <a class="practice-target-card" href="https://www.saucedemo.com/" target="_blank" rel="noopener">
          <span class="practice-target-type">UI Practice Target</span>
          <span class="practice-target-name">SauceDemo ↗</span>
          <span class="practice-target-desc">E-commerce login, cart &amp; checkout E2E (standard_user).</span>
        </a>
        <a class="practice-target-card" href="https://the-internet.herokuapp.com/" target="_blank" rel="noopener">
          <span class="practice-target-type">UI Practice Target</span>
          <span class="practice-target-name">The Internet Herokuapp ↗</span>
          <span class="practice-target-desc">Dynamic UI elements, upload file, shadow DOM &amp; modal.</span>
        </a>
        <a class="practice-target-card" href="https://restful-booker.herokuapp.com/" target="_blank" rel="noopener">
          <span class="practice-target-type">API Practice Target</span>
          <span class="practice-target-name">Restful-Booker &amp; ReqRes ↗</span>
          <span class="practice-target-desc">CRUD booking, auth chaining &amp; RestAssured API (reqres.in).</span>
        </a>
        <a class="practice-target-card" href="https://o3.openmrs.org/openmrs/" target="_blank" rel="noopener">
          <span class="practice-target-type">Real Project Case Study</span>
          <span class="practice-target-name">OpenMRS 3 &amp; Legacy UI ↗</span>
          <span class="practice-target-desc">BVA klinis, XSS double encoding, Selenium 4 POM &amp; CSRFGuard.</span>
        </a>
      </div>
    ` : '';

    const clustersHTML = visibleCategories.map(category => {
      const groupTracks = modeTracks.filter(t => t.category === category);
      const cardsHTML = groupTracks.map(t => {
        const idx = modeTracks.findIndex(item => item.id === t.id);
        return renderTrackCard(t, idx);
      }).join('');

      return `
        <div class="section-cluster">
          <div class="section-cluster-head">
            <h3 class="cluster-title">
              <span style="width:8px; height:8px; border-radius:50%; background:var(--color-brand-blue); box-shadow:0 0 8px var(--color-brand-blue);"></span>
              ${escapeHTML(category)}
            </h3>
            <span class="cluster-meta">${groupTracks.length} Jalur Kurikulum</span>
          </div>
          <div class="bento-grid">
            ${cardsHTML}
          </div>
        </div>
      `;
    }).join('');

    const stagesHTML = cfg.stages.map(s => `
      <div class="stage-card ${s.dark ? 'dark-highlight' : ''}">
        <div class="stage-card-head">
          <span class="stage-card-label">${escapeHTML(s.num)}</span>
          <span class="stage-card-pill">${escapeHTML(s.pill)}</span>
        </div>
        <h4 class="stage-card-title">${escapeHTML(s.title)}</h4>
        <p class="stage-card-desc">${escapeHTML(s.desc)}</p>
      </div>
    `).join('');

    const metaHTML = cfg.meta.map(m => `
      <div class="meta-strip-col">
        <span class="meta-strip-label">${escapeHTML(m.label)}</span>
        <span class="meta-strip-value">${escapeHTML(m.value)}</span>
      </div>
    `).join('');

    const thirdButtonHTML = cfg.quickActionModuleId
      ? `<button class="btn btn-outline" data-open-module="${cfg.quickActionModuleId}">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-brand-purple);"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
           ${escapeHTML(cfg.quickActionLabel)}
         </button>`
      : `<button class="btn btn-outline" id="quickSearchBtn" data-action="search">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-brand-cyan);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
           Cari Cepat (⌘K)
         </button>`;

    container.innerHTML = `
      <!-- Hero Section (Design Playground Layout + iCraft Luminous Glow) -->
      <section class="hero-editorial-section playground-grid-bg">
        <div class="hero-kicker-badge">
          <span class="hero-badge-dot"></span>
          <span>${escapeHTML(cfg.kicker)}</span>
        </div>

        <h1 class="hero-main-heading">${cfg.heading}</h1>

        <span class="hero-quote-accent">${cfg.quote}</span>

        <p class="hero-lead-text">${escapeHTML(cfg.lead)}</p>

        <div class="hero-action-buttons">
          <button class="btn btn-primary" id="startLearningBtn" data-open-module="${nextModule?.id || 'w01'}">
            Mulai Belajar ${escapeHTML(cfg.label)} →
          </button>
          <button class="btn btn-outline" id="browseTracksBtn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-brand-blue);"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Jelajahi Kurikulum
          </button>
          ${thirdButtonHTML}
        </div>

        <div class="hero-meta-strip">
          ${metaHTML}
        </div>
      </section>

      <!-- 4-Stage Methodology Section -->
      <section class="methodology-section">
        <div class="methodology-header">
          <div>
            <div class="methodology-kicker">Metodologi Pembelajaran</div>
            <h2 class="methodology-title">${escapeHTML(cfg.methodologyTitle)}</h2>
          </div>
          <p class="methodology-subcopy">${escapeHTML(cfg.methodologySub)}</p>
        </div>

        <div class="stages-grid">
          ${stagesHTML}
        </div>
      </section>

      <!-- Interactive Isometric 3D Causal System Design Studio (SA Mode) -->
      ${mode === 'sa' ? '<div id="saIso3DSimMount"></div>' : ''}

      <!-- Interactive Phase Roadmap Filter & Practice Targets (Tidak Pusing & Terstruktur) -->
      <section class="roadmap-navigator-card" aria-label="Filter Peta Jalan Kurikulum">
        <div class="roadmap-nav-top">
          <div class="roadmap-nav-title">
            <span style="width:8px; height:8px; border-radius:50%; background:var(--color-brand-blue); box-shadow:0 0 8px var(--color-brand-blue);"></span>
            <span>Peta Pemetaan Fase Kurikulum (${escapeHTML(cfg.label)})</span>
          </div>
          <span class="roadmap-nav-hint">Klik salah satu fase untuk fokus tanpa merasa kewalahan</span>
        </div>
        <div class="roadmap-phase-strip">
          ${phasePillsHTML}
        </div>
        ${qaPracticeTargetsHTML}
      </section>

      <!-- Learning Path Clusters (Folder-Shaped Cards) -->
      <div id="tracksDirectory">
        ${clustersHTML}
      </div>
    `;

    container.querySelectorAll('[data-phase-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategoryByMode[mode] = btn.dataset.phaseFilter;
        renderHome(container, mode);
      });
    });

    const browseBtn = container.querySelector('#browseTracksBtn');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        const nav = container.querySelector('.roadmap-navigator-card') || container.querySelector('#tracksDirectory');
        if (nav) nav.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (mode === 'sa' && typeof window.Iso3DSimulator === 'function') {
      const simMount = container.querySelector('#saIso3DSimMount');
      if (simMount) {
        activeSimInstance = new window.Iso3DSimulator(simMount, 'flash_sale');
      }
    }
  }

  function renderTrack(container, trackId) {
    cleanupActiveSim();
    const tracks = window.TRACKS || [];
    const modules = window.MODULES || [];
    const track = tracks.find(t => t.id === trackId);
    if (!track) return renderHome(container);

    const state = window.academyState;
    const trackMode = track.mode || 'fullstack';
    const trackModules = modules.filter(m => m.track === trackId).sort((a, b) => (a.order || 999) - (b.order || 999));
    const counts = state.getTrackStats(trackId, modules);

    const cardsHTML = trackModules.map((m, i) => renderModuleCard(m, i)).join('');

    container.innerHTML = `
      <div class="reader-wrapper">
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="mode-home" data-mode="${trackMode}">
            ← Kembali ke Beranda ${escapeHTML(getModeMeta(trackMode).label)}
          </span>
          <span style="font-family:var(--font-mono); font-weight:700;">${counts.total} Modul dalam Jalur</span>
        </div>

        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            ${renderModePillBadge(trackMode)}
            <span>● JALUR TEKNOLOGI KURIKULUM</span>
          </div>
          <h1 class="lesson-main-title">${escapeHTML(track.name)}</h1>
          <p class="lesson-main-summary">${escapeHTML(track.desc)} ${escapeHTML(track.outcome || '')}</p>
          
          <div class="lesson-actions-bar">
            <div class="lesson-meta-chips">
              <span class="level-badge beginner">${counts.total} Materi</span>
              <span class="level-badge intermediate">${counts.completed} Selesai (${counts.percent}%)</span>
            </div>
            <div class="progress-track-bar" style="width: 140px;">
              <div class="progress-fill-bar" style="width: ${counts.percent}%;"></div>
            </div>
          </div>
        </div>

        <div class="section-cluster" style="margin-top: 10px;">
          <div class="section-cluster-head">
            <h3 class="cluster-title">Daftar Modul Pembelajaran (Berkas Kurikulum)</h3>
            <span class="cluster-meta">Klik berkas modul untuk membuka materi fokus</span>
          </div>
          <div class="bento-grid">
            ${cardsHTML}
          </div>
        </div>
      </div>
    `;
  }

  function renderLessonStepContent(module, stepIndex) {
    const state = window.academyState;
    const step = LESSON_STEPS[stepIndex] || LESSON_STEPS[0];
    const { renderVisualFlow } = window.academyVisuals;

    switch (step.id) {
      case 'overview': {
        const objectives = (module.concepts || []).map(([title]) => 
          `<li style="margin-bottom:6px;"><strong>${escapeHTML(title)}</strong></li>`
        ).join('');

        const refs = (module.refs || []).map(r => 
          `<li style="margin-bottom:6px;"><a href="${escapeHTML(r)}" target="_blank" rel="noopener" style="color:var(--color-brand-blue); text-decoration:underline; word-break:break-all;">${escapeHTML(r)}</a></li>`
        ).join('');

        return `
          <div class="stage-section-head">
            <span class="stage-number">01</span>
            <h3 class="stage-heading">Tujuan &amp; Gambaran Pembelajaran</h3>
          </div>
          <p style="font-size:14px; line-height:1.65; color:var(--color-ink-secondary); margin-bottom:20px;">
            ${escapeHTML(module.summary)}
          </p>
          
          <div class="callout-block" style="margin-bottom:24px;">
            <div class="callout-head">Target Pemahaman:</div>
            <ul style="padding-left:20px; line-height:1.7; font-size:13px; color:var(--color-ink-secondary);">
              ${objectives || '<li>Memahami implementasi praktis materi ini.</li>'}
            </ul>
          </div>

          ${refs ? `
            <div style="margin-top:20px;">
              <h5 style="font-family:var(--font-display); font-size:12px; font-weight:800; text-transform:uppercase; color:var(--color-muted); margin-bottom:10px;">
                Referensi Dokumentasi &amp; Spesifikasi:
              </h5>
              <ul style="padding-left:20px; font-size:13px;">${refs}</ul>
            </div>
          ` : ''}
        `;
      }

      case 'concepts': {
        const conceptCards = (module.concepts || []).map(([title, desc], i) => `
          <div class="concept-item-card">
            <h4><span class="concept-bullet-dot"></span> ${String(i + 1).padStart(2, '0')}. ${escapeHTML(title)}</h4>
            <p>${escapeHTML(desc)}</p>
          </div>
        `).join('');

        const tablesHTML = renderTablesHTML(module.tables);

        return `
          <div class="stage-section-head">
            <span class="stage-number">02</span>
            <h3 class="stage-heading">Konsep Inti &amp; Matriks Referensi</h3>
          </div>
          <p style="font-size:13px; color:var(--color-muted); margin-bottom:16px;">
            Pahami prinsip-prinsip dasar beserta parameter atau ambang batas standarnya secara menyeluruh:
          </p>
          <div class="concept-grid">
            ${conceptCards || '<p>Tidak ada konsep tambahan untuk modul ini.</p>'}
          </div>
          ${tablesHTML}
        `;
      }

      case 'architecture': {
        return `
          <div class="stage-section-head">
            <span class="stage-number">03</span>
            <h3 class="stage-heading">Arsitektur &amp; Komparasi Trade-Off</h3>
          </div>
          <div class="callout-block" style="background:var(--color-canvas); border-color:var(--color-border-ice);">
            <div class="callout-head">Trade-off &amp; Hubungan Antar Ekosistem:</div>
            <p style="font-size:14px; line-height:1.7; color:var(--color-ink-secondary);">
              ${escapeHTML(module.compare || 'Di arsitektur modern, setiap framework atau pola memiliki perbandingan trade-off antara kesederhanaan, skalabilitas, dan biaya operasional.')}
            </p>
          </div>
        `;
      }

      case 'code': {
        const lang = module.code?.language || 'plaintext';
        const codeContent = module.code?.content || '// Tidak ada contoh kode.';
        const visual = renderVisualFlow(module);

        const extraCodesHTML = (module.extraCodes || []).map((extra, idx) => `
          <div class="code-specimen-box ${extra.variant === 'bad' ? 'variant-bad' : ''}">
            ${extra.title ? `<div class="code-specimen-title-bar">${extra.variant === 'bad' ? '⚠ ' : '✦ '}${escapeHTML(extra.title)}</div>` : ''}
            <div class="code-specimen-header">
              <span class="code-lang-tag">● ${escapeHTML(extra.language || 'code')} SPECIMEN</span>
              <button class="copy-code-btn" data-copy-extra="${module.id}:${idx}">
                Salin Kode
              </button>
            </div>
            <pre class="code-specimen-pre"><code>${escapeHTML(extra.content)}</code></pre>
          </div>
        `).join('');

        const simMountHTML = getScenarioForModule(module)
          ? '<div id="moduleIso3DSimMount" style="margin:20px 0;"></div>'
          : '';

        return `
          <div class="stage-section-head">
            <span class="stage-number">04</span>
            <h3 class="stage-heading">Specimen Kode &amp; Visualisasi Alur</h3>
          </div>
          ${visual}
          ${simMountHTML}
          <div class="code-specimen-box">
            ${module.code?.extraTitle ? `<div class="code-specimen-title-bar">✦ ${escapeHTML(module.code.extraTitle)}</div>` : ''}
            <div class="code-specimen-header">
              <span class="code-lang-tag">● ${escapeHTML(lang)} SPECIMEN</span>
              <button class="copy-code-btn" data-copy="${module.id}">
                Salin Kode
              </button>
            </div>
            <pre class="code-specimen-pre"><code>${escapeHTML(codeContent)}</code></pre>
          </div>
          ${extraCodesHTML}
        `;
      }

      case 'practices': {
        const practices = (module.practices || []).map((p, i) => `
          <li style="margin-bottom:10px; display:flex; align-items:flex-start; gap:10px;">
            <span style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:var(--color-brand-blue); background:var(--color-brand-blue-soft); padding:1px 6px; border-radius:3px; flex-shrink:0;">
              #0${i + 1}
            </span>
            <span style="font-size:13px; line-height:1.6; color:var(--color-ink);">${escapeHTML(p)}</span>
          </li>
        `).join('');

        return `
          <div class="stage-section-head">
            <span class="stage-number">05</span>
            <h3 class="stage-heading">Best Practices &amp; Standar Industri</h3>
          </div>
          <p style="font-size:13px; color:var(--color-muted); margin-bottom:16px;">
            Kebiasaan dan pola yang membedakan implementasi amatir dari rekayasa perangkat lunak tingkat senior:
          </p>
          <ul style="list-style:none; padding:0;">
            ${practices || '<li>Terapkan clean code, error handling yang aman, dan penulisan pengujian otomatis.</li>'}
          </ul>
        `;
      }

      case 'cases': {
        return `
          <div class="stage-section-head">
            <span class="stage-number">06</span>
            <h3 class="stage-heading">Studi Kasus Dunia Nyata</h3>
          </div>
          <div class="callout-block case-study">
            <div class="callout-head">Skenario Produksi &amp; Trade-Off:</div>
            <p class="callout-body">
              ${escapeHTML(module.case || 'Studi kasus ini menggambarkan bagaimana teknologi diterapkan dalam memecahkan masalah skala besar, integritas data, atau proteksi sistem di dunia kerja riil.')}
            </p>
          </div>
        `;
      }

      case 'exercise': {
        const scenario = module.exercise?.scenario || (typeof module.exercise === 'string' ? module.exercise : '');
        const task = module.exercise?.task || '';
        const guide = window.academyLabs ? window.academyLabs.getImplementationGuide(module) : null;
        const checkedSet = state.getImplChecks(module.id);

        let ladderHTML = '';
        if (guide) {
          const tiers = [
            { key: 'simple', cls: 'tier-simple', data: guide.simple },
            { key: 'intermediate', cls: 'tier-mid', data: guide.intermediate },
            { key: 'pro', cls: 'tier-pro', data: guide.pro }
          ];
          const totalSteps = tiers.reduce((sum, t) => sum + (t.data?.steps?.length || 0), 0);
          const doneSteps = checkedSet.size;

          const tiersHTML = tiers.map(t => {
            if (!t.data) return '';
            const stepsHTML = t.data.steps.map((s, idx) => {
              const stepKey = `${t.key}:${idx}`;
              const isChecked = checkedSet.has(stepKey);
              return `
                <label class="impl-step-item ${isChecked ? 'checked' : ''}">
                  <input type="checkbox" class="impl-step-checkbox" data-impl-check="${stepKey}" ${isChecked ? 'checked' : ''}>
                  <div class="impl-step-copy">
                    <strong>Langkah ${idx + 1}. ${escapeHTML(s.title)}</strong>
                    <p>${escapeHTML(s.detail)}</p>
                    ${s.cmd ? `<code class="impl-cmd-chip">${escapeHTML(s.cmd)}</code>` : ''}
                  </div>
                </label>
              `;
            }).join('');

            return `
              <div class="impl-tier-card ${t.cls}">
                <div class="impl-tier-head">
                  <div class="impl-tier-title">${escapeHTML(t.data.title)}</div>
                  <div class="impl-tier-goal">Goal: ${escapeHTML(t.data.goal)}</div>
                </div>
                <div class="impl-steps-list">${stepsHTML}</div>
              </div>
            `;
          }).join('');

          ladderHTML = `
            <div class="impl-ladder-wrap">
              <div class="impl-progress-header">
                <span>✦ Panduan Implementasi Bertahap (Sederhana → Menengah → Profesional)</span>
                <span id="implProgressCount" style="font-family:var(--font-mono); color:var(--color-brand-blue);">${doneSteps}/${totalSteps} Langkah Selesai</span>
              </div>
              ${tiersHTML}
            </div>
          `;
        }

        return `
          <div class="stage-section-head">
            <span class="stage-number">07</span>
            <h3 class="stage-heading">Langkah Implementasi Detail (Sederhana → Profesional)</h3>
          </div>
          ${ladderHTML}
          <div class="callout-block exercise">
            <div class="callout-head">Tantangan Praktik Mandiri:</div>
            <p class="callout-body" style="margin-bottom:12px;">
              ${escapeHTML(scenario || 'Buka editor kodemu, implementasikan modul ini secara mandiri, lalu lakukan verifikasi request dan penanganan kasus gagal.')}
            </p>
            ${task ? `<div style="font-weight:700; font-size:13px; color:var(--color-ink); border-top:1px dashed var(--color-border-strong); padding-top:10px;">Tugas: ${escapeHTML(task)}</div>` : ''}
          </div>
        `;
      }

      case 'quiz': {
        const quiz = module.quiz;
        const tests = window.academyLabs ? window.academyLabs.getImplementationTests(module) : null;
        const labStatus = state.getLabPassed(module.id);

        let labRunnerHTML = '';
        if (tests) {
          const activeLab = tests.simple;
          labRunnerHTML = `
            <div class="lab-runner-card" id="labRunnerCard" data-active-lab="simple">
              <div class="lab-runner-header">
                <div>
                  <div style="font-family:var(--font-mono); font-size:10px; font-weight:800; color:var(--color-brand-blue); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">
                    ● DIRECT IMPLEMENTATION TEST RUNNER
                  </div>
                  <h4 style="font-family:var(--font-display); font-size:15px; font-weight:800; color:var(--color-ink); margin:0;" id="labTitle">
                    ${escapeHTML(activeLab.title)}
                  </h4>
                </div>
                <div class="lab-tier-tabs">
                  <button class="lab-tier-btn active" data-lab-tier="simple">
                    ${labStatus.simple ? '✓ ' : ''}1. Uji Sederhana
                  </button>
                  <button class="lab-tier-btn" data-lab-tier="pro">
                    ${labStatus.pro ? '✓ ' : ''}2. Uji Profesional
                  </button>
                </div>
              </div>
              <p style="font-size:12.5px; color:var(--color-muted); margin-bottom:12px;" id="labDesc">
                ${escapeHTML(activeLab.description)}
              </p>
              <textarea class="lab-editor-textarea" id="labCodeEditor" spellcheck="false" aria-label="Editor kode uji implementasi">${escapeHTML(activeLab.starterCode)}</textarea>
              <div class="lab-toolbar">
                <div class="lab-toolbar-left">
                  <button class="btn btn-primary btn-sm" id="runLabTestBtn">▶ Jalankan Uji Implementasi</button>
                  <button class="btn btn-outline btn-sm" id="toggleLabSolutionBtn">💡 Lihat Solusi Pro</button>
                  <button class="btn btn-outline btn-sm" id="resetLabCodeBtn">↺ Reset Kode</button>
                </div>
                <span style="font-family:var(--font-mono); font-size:10.5px; color:var(--color-muted);" id="labLangTag">
                  LANG: ${escapeHTML((activeLab.language || 'code').toUpperCase())}
                </span>
              </div>
              <div class="lab-console-output" id="labConsoleOutput" hidden></div>
            </div>
          `;
        }

        let quizHTML = '';
        if (quiz) {
          const savedAnswer = state.getAnswer(module.id);
          const hasAnswered = savedAnswer !== null;
          const isCorrect = savedAnswer === quiz.answer;

          const optionsHTML = quiz.options.map((option, idx) => `
            <label class="quiz-option-label ${savedAnswer === idx ? 'selected' : ''}">
              <input type="radio" name="quizChoice" value="${idx}" ${savedAnswer === idx ? 'checked' : ''}>
              <span>${escapeHTML(option)}</span>
            </label>
          `).join('');

          quizHTML = `
            <div class="quiz-container">
              <div style="font-family:var(--font-mono); font-size:10px; font-weight:800; color:var(--color-brand-purple); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">
                ● EVALUASI KONSEP &amp; TRADE-OFF
              </div>
              <div class="quiz-question-text">${escapeHTML(quiz.question)}</div>
              <div class="quiz-options-list">
                ${optionsHTML}
              </div>
              <button class="btn btn-primary" id="submitQuizBtn">
                Periksa Jawaban
              </button>
              <div class="quiz-feedback-box ${hasAnswered ? 'show ' + (isCorrect ? 'correct' : 'wrong') : ''}" id="quizFeedback">
                ${hasAnswered ? `
                  <strong>${isCorrect ? '✓ Tepat Sekali!' : '✕ Belum Tepat.'}</strong>
                  <span>${escapeHTML(quiz.explanation)}</span>
                ` : ''}
              </div>
            </div>
          `;
        }

        return `
          <div class="stage-section-head">
            <span class="stage-number">08</span>
            <h3 class="stage-heading">Uji Langsung Implementasi &amp; Evaluasi</h3>
          </div>
          ${labRunnerHTML}
          ${quizHTML}
        `;
      }

      default:
        return '';
    }
  }

  function renderModule(container, moduleId, requestedStep = null) {
    cleanupActiveSim();
    const modules = window.MODULES || [];
    const module = modules.find(m => m.id === moduleId);
    if (!module) return renderHome(container);

    const state = window.academyState;
    const modMode = module.mode || 'fullstack';
    const isDone = state.isCompleted(moduleId);
    const isSaved = state.isBookmarked(moduleId);

    const trackModules = modules.filter(m => m.track === module.track).sort((a, b) => (a.order || 999) - (b.order || 999));
    const trackIdx = trackModules.findIndex(m => m.id === moduleId);

    const currentStepIndex = requestedStep !== null 
      ? requestedStep 
      : state.getLessonStep(moduleId);
    const safeStepIndex = Math.min(Math.max(currentStepIndex, 0), LESSON_STEPS.length - 1);
    state.setLessonStep(moduleId, safeStepIndex);

    const stepperTabsHTML = LESSON_STEPS.map((step, idx) => {
      const isActive = idx === safeStepIndex;
      const isVisited = idx < safeStepIndex;
      return `
        <button class="step-tab-btn ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}" 
                data-step-tab="${idx}"
                aria-current="${isActive ? 'step' : 'false'}">
          <span class="step-index-badge">${step.icon}</span>
          <span>${escapeHTML(step.label)}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="reader-wrapper">
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="track" data-track-id="${escapeHTML(module.track)}">
            ← Kembali ke Jalur ${escapeHTML(module.track)}
          </span>
          <span style="font-family:var(--font-mono); font-size:11px; font-weight:700;">
            Modul ${trackIdx + 1} dari ${trackModules.length}
          </span>
        </div>

        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            ${renderModePillBadge(modMode)}
            <span>● ${escapeHTML(module.track)} · TINGKAT ${escapeHTML(module.level).toUpperCase()}</span>
          </div>
          <h1 class="lesson-main-title">${escapeHTML(module.title)}</h1>
          <p class="lesson-main-summary">${escapeHTML(module.summary)}</p>

          <div class="lesson-actions-bar">
            <div class="lesson-meta-chips">
              <span class="level-badge ${getLevelClass(module.level)}">${escapeHTML(module.level)}</span>
              <span class="level-badge beginner">${(module.refs || []).length} Referensi</span>
              <span class="level-badge ${isDone ? 'intermediate' : ''}" id="lessonStatusBadge">
                ${isDone ? '✓ Sudah Selesai' : '○ Belum Selesai'}
              </span>
            </div>
            <div class="lesson-tool-buttons">
              ${getScenarioForModule(module) ? `<button class="btn btn-outline btn-sm" id="jumpSim3DBtn" title="Lihat Simulasi 3D Isometric Belakang Layar">🧊 Visual 3D</button>` : ''}
              <button class="btn btn-outline btn-sm" id="toggleBookmarkBtn">
                ${isSaved ? '★ Tersimpan' : '☆ Simpan Materi'}
              </button>
              <button class="btn ${isDone ? 'btn-outline' : 'btn-primary'} btn-sm" id="toggleDoneBtn">
                ${isDone ? '✓ Tandai Belum Selesai' : 'Tandai Selesai'}
              </button>
            </div>
          </div>
        </div>

        <div class="lesson-stepper-container">
          <div class="lesson-stepper-track">
            ${stepperTabsHTML}
          </div>
        </div>

        <div class="lesson-stage-card">
          ${renderLessonStepContent(module, safeStepIndex)}

          <div class="stepper-footer-bar">
            <button class="btn btn-outline" id="prevStepBtn" ${safeStepIndex === 0 ? 'disabled' : ''}>
              ← Langkah Sebelumnya
            </button>
            <div style="display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px;">
              ${safeStepIndex === LESSON_STEPS.length - 1 ? `
                <button class="btn btn-primary" id="finishModuleBtn">
                  ${isDone ? '✓ Materi Sudah Selesai' : 'Selesaikan Materi Ini'}
                </button>
              ` : ''}
              <button class="btn btn-primary" id="nextStepBtn">
                ${safeStepIndex === LESSON_STEPS.length - 1 ? (trackIdx < trackModules.length - 1 ? 'Materi Berikutnya →' : 'Kembali ke Jalur →') : 'Lanjutkan →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const activeTab = container.querySelector('.step-tab-btn.active');
      if (activeTab && typeof activeTab.scrollIntoView === 'function') {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 40);

    container.querySelectorAll('[data-step-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        renderModule(container, moduleId, Number(btn.dataset.stepTab));
      });
    });

    const prevBtn = container.querySelector('#prevStepBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (safeStepIndex > 0) renderModule(container, moduleId, safeStepIndex - 1);
      });
    }

    const nextBtn = container.querySelector('#nextStepBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (safeStepIndex < LESSON_STEPS.length - 1) {
          renderModule(container, moduleId, safeStepIndex + 1);
        } else if (trackIdx < trackModules.length - 1) {
          renderModule(container, trackModules[trackIdx + 1].id, 0);
        } else {
          renderTrack(container, module.track);
        }
      });
    }

    const bookmarkBtn = container.querySelector('#toggleBookmarkBtn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        state.toggleBookmark(moduleId);
        renderModule(container, moduleId, safeStepIndex);
      });
    }

    const doneBtn = container.querySelector('#toggleDoneBtn');
    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        state.toggleCompleted(moduleId);
        renderModule(container, moduleId, safeStepIndex);
      });
    }

    const finishBtn = container.querySelector('#finishModuleBtn');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        state.setCompleted(moduleId, true);
        renderModule(container, moduleId, safeStepIndex);
      });
    }

    const quizSubmitBtn = container.querySelector('#submitQuizBtn');
    if (quizSubmitBtn && module.quiz) {
      quizSubmitBtn.addEventListener('click', () => {
        const checked = container.querySelector('input[name="quizChoice"]:checked');
        const feedback = container.querySelector('#quizFeedback');
        if (!checked) {
          feedback.className = 'quiz-feedback-box show wrong';
          feedback.innerHTML = 'Pilih salah satu jawaban terlebih dahulu.';
          return;
        }

        const chosen = Number(checked.value);
        state.setAnswer(moduleId, chosen);
        const correct = chosen === module.quiz.answer;
        feedback.className = `quiz-feedback-box show ${correct ? 'correct' : 'wrong'}`;
        feedback.innerHTML = `
          <strong>${correct ? '✓ Tepat Sekali!' : '✕ Belum Tepat.'}</strong>
          <span>${escapeHTML(module.quiz.explanation)}</span>
        `;
      });
    }

    const jumpSimBtn = container.querySelector('#jumpSim3DBtn');
    if (jumpSimBtn) {
      jumpSimBtn.addEventListener('click', () => {
        renderModule(container, moduleId, 3);
      });
    }

    // Implementation Step Checkboxes (Step 07)
    const implBoxes = container.querySelectorAll('[data-impl-check]');
    if (implBoxes.length) {
      implBoxes.forEach(cb => {
        cb.addEventListener('change', () => {
          const isChecked = state.toggleImplCheck(moduleId, cb.dataset.implCheck);
          const parentItem = cb.closest('.impl-step-item');
          if (parentItem) parentItem.classList.toggle('checked', isChecked);
          const countEl = container.querySelector('#implProgressCount');
          if (countEl) {
            countEl.textContent = `${state.getImplChecks(moduleId).size}/${implBoxes.length} Langkah Selesai`;
          }
        });
      });
    }

    // Interactive Implementation Code Test Runner (Step 08)
    const labCard = container.querySelector('#labRunnerCard');
    if (labCard && window.academyLabs) {
      const tests = window.academyLabs.getImplementationTests(module);
      let currentTier = 'simple';
      const editor = container.querySelector('#labCodeEditor');
      const consoleOut = container.querySelector('#labConsoleOutput');
      const titleEl = container.querySelector('#labTitle');
      const descEl = container.querySelector('#labDesc');
      const langEl = container.querySelector('#labLangTag');

      const switchTier = (tier) => {
        currentTier = tier;
        const spec = tests[tier] || tests.simple;
        labCard.querySelectorAll('[data-lab-tier]').forEach(b => {
          b.classList.toggle('active', b.dataset.labTier === tier);
        });
        if (titleEl) titleEl.textContent = spec.title;
        if (descEl) descEl.textContent = spec.description;
        if (langEl) langEl.textContent = `LANG: ${(spec.language || 'code').toUpperCase()}`;
        if (editor) editor.value = spec.starterCode;
        if (consoleOut) { consoleOut.hidden = true; consoleOut.innerHTML = ''; }
      };

      labCard.querySelectorAll('[data-lab-tier]').forEach(btn => {
        btn.addEventListener('click', () => switchTier(btn.dataset.labTier));
      });

      if (editor) {
        editor.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 2;
          }
        });
      }

      const runBtn = container.querySelector('#runLabTestBtn');
      if (runBtn && editor && consoleOut) {
        runBtn.addEventListener('click', () => {
          const spec = tests[currentTier] || tests.simple;
          const results = spec.run(editor.value);
          const passedCount = results.filter(r => r.pass).length;
          const allPassed = results.length > 0 && passedCount === results.length;

          if (allPassed) {
            state.setLabPassed(moduleId, currentTier, true);
            const activeTierBtn = labCard.querySelector(`[data-lab-tier="${currentTier}"]`);
            if (activeTierBtn && !activeTierBtn.textContent.trim().startsWith('✓')) {
              activeTierBtn.textContent = `✓ ${activeTierBtn.textContent.trim()}`;
            }
          }

          consoleOut.hidden = false;
          consoleOut.innerHTML = `
            <div class="lab-console-summary ${allPassed ? 'all-pass' : 'has-fail'}">
              <span>${allPassed ? '✓ ALL ASSERTIONS PASSED' : '✕ SOME ASSERTIONS FAILED'}</span>
              <span>${passedCount}/${results.length} Lolos</span>
            </div>
            ${results.map(r => `
              <div class="lab-test-row">
                <span class="lab-test-status ${r.pass ? 'pass' : 'fail'}">${r.pass ? '✓ PASS' : '✕ FAIL'} · ${escapeHTML(r.label)}</span>
                ${!r.pass && r.hint ? `<span class="lab-test-hint">Hint: ${escapeHTML(r.hint)}</span>` : ''}
              </div>
            `).join('')}
          `;
        });
      }

      const solBtn = container.querySelector('#toggleLabSolutionBtn');
      if (solBtn && editor) {
        solBtn.addEventListener('click', () => {
          const spec = tests[currentTier] || tests.simple;
          editor.value = spec.solutionCode;
        });
      }

      const resetBtn = container.querySelector('#resetLabCodeBtn');
      if (resetBtn && editor && consoleOut) {
        resetBtn.addEventListener('click', () => {
          const spec = tests[currentTier] || tests.simple;
          editor.value = spec.starterCode;
          consoleOut.hidden = true;
          consoleOut.innerHTML = '';
        });
      }
    }

    const modSimMount = container.querySelector('#moduleIso3DSimMount');
    const simScenario = getScenarioForModule(module);
    if (modSimMount && simScenario && typeof window.Iso3DSimulator === 'function') {
      activeSimInstance = new window.Iso3DSimulator(modSimMount, simScenario);
    }
  }

  function renderBookmarksPage(container, filterMode = 'all') {
    cleanupActiveSim();
    const state = window.academyState;
    const modules = window.MODULES || [];
    let bookmarkedModules = modules.filter(m => state.isBookmarked(m.id));
    if (filterMode !== 'all') {
      bookmarkedModules = bookmarkedModules.filter(m => (m.mode || 'fullstack') === filterMode);
    }

    const cardsHTML = bookmarkedModules.length
      ? bookmarkedModules.map((m, i) => renderModuleCard(m, i, true)).join('')
      : `
        <div style="grid-column: 1 / -1; background:var(--color-elevated); border:1px solid var(--color-border-ice); border-radius:var(--radius-md); padding:40px; text-align:center; box-shadow:var(--shadow-sm);">
          <div style="font-size:32px; margin-bottom:12px; color:var(--color-brand-cyan);">☆</div>
          <h4 style="font-family:var(--font-display); font-size:18px; font-weight:800; margin-bottom:8px; color:var(--color-ink);">Belum Ada Berkas Tersimpan</h4>
          <p style="font-size:13px; color:var(--color-muted); max-width:420px; margin:0 auto 20px;">
            Saat membaca modul di mode Fullstack, QA, atau SA, klik tombol "Simpan Materi" untuk menyimpan berkas penting agar mudah diakses kembali.
          </p>
          <button class="btn btn-primary" data-action="home">Kembali ke Beranda</button>
        </div>
      `;

    container.innerHTML = `
      <div class="reader-wrapper">
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="home">← Kembali ke Beranda</span>
          <span style="font-family:var(--font-mono); font-weight:700;">${bookmarkedModules.length} Berkas Tersimpan</span>
        </div>

        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            <span>●</span> ARSIP BERKAS PILIHAN LINTAS MODE
          </div>
          <h1 class="lesson-main-title">Koleksi Belajarmu</h1>
          <p class="lesson-main-summary">
            Daftar modul yang kamu simpan dari seluruh jalur Fullstack, QA Engineer, dan System Architect.
          </p>
        </div>

        <div class="mode-filter-row" id="bookmarkFilterRow">
          <button class="mode-filter-btn ${filterMode === 'all' ? 'active' : ''}" data-bm-filter="all">Semua Mode</button>
          <button class="mode-filter-btn ${filterMode === 'fullstack' ? 'active' : ''}" data-bm-filter="fullstack">Fullstack</button>
          <button class="mode-filter-btn ${filterMode === 'qa' ? 'active' : ''}" data-bm-filter="qa">QA Engineer</button>
          <button class="mode-filter-btn ${filterMode === 'sa' ? 'active' : ''}" data-bm-filter="sa">System Architect</button>
        </div>

        <div class="section-cluster" style="margin-top:6px;">
          <div class="bento-grid">
            ${cardsHTML}
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-bm-filter]').forEach(btn => {
      btn.addEventListener('click', () => renderBookmarksPage(container, btn.dataset.bmFilter));
    });
  }

  function renderSearchPage(container, query, filterMode = 'all') {
    cleanupActiveSim();
    const { searchModules } = window.academySearch;
    const modeArg = filterMode === 'all' ? null : filterMode;
    const results = searchModules(query, null, null, modeArg);

    const resultsHTML = results.length
      ? results.map(r => `
          <div class="search-result-item" tabindex="0" role="button" data-open-module="${r.module.id}">
            <div class="search-result-header">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                ${renderModePillBadge(r.module.mode)}
                <span class="search-match-chip">${escapeHTML(r.matchType)}</span>
              </div>
              <span style="font-size:11px; color:var(--color-muted); font-weight:600;">${escapeHTML(r.module.track)} · ${escapeHTML(r.module.level)}</span>
            </div>
            <h4 class="search-item-title">${escapeHTML(r.module.title)}</h4>
            <p style="font-size:12px; color:var(--color-muted); margin:0;">${escapeHTML(r.module.summary)}</p>
            <div class="search-item-snippet">
              <span style="font-size:9px; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-brand-blue); font-weight:700;">Cocok Pada:</span>
              <code>${escapeHTML(r.snippet)}</code>
            </div>
          </div>
        `).join('')
      : `
        <div style="background:var(--color-elevated); border:1px solid var(--color-border-ice); border-radius:var(--radius-md); padding:40px; text-align:center; box-shadow:var(--shadow-sm);">
          <h4 style="font-family:var(--font-display); font-size:16px; font-weight:800; margin-bottom:8px; color:var(--color-ink);">Tidak ditemukan hasil untuk "${escapeHTML(query)}"</h4>
          <p style="font-size:13px; color:var(--color-muted);">Coba gunakan istilah seperti 'Playwright', 'LCP', 'k6', 'Fencing', 'Outbox', 'REST', atau 'JWT'.</p>
        </div>
      `;

    container.innerHTML = `
      <div class="reader-wrapper">
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="home">← Kembali ke Beranda</span>
          <span style="font-family:var(--font-mono); font-weight:700;">${results.length} Hasil Ditemukan</span>
        </div>

        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            <span>●</span> PENCARIAN GLOBAL LINTAS KURIKULUM
          </div>
          <h1 class="lesson-main-title">Hasil Pencarian: "${escapeHTML(query)}"</h1>
          <p class="lesson-main-summary">
            Menelusuri judul, konsep, tabel referensi, contoh kode, best practices, dan studi kasus di seluruh mode Fullstack, QA Engineer, dan System Architect.
          </p>
        </div>

        <div class="mode-filter-row">
          <button class="mode-filter-btn ${filterMode === 'all' ? 'active' : ''}" data-search-filter="all">Semua Mode</button>
          <button class="mode-filter-btn ${filterMode === 'fullstack' ? 'active' : ''}" data-search-filter="fullstack">Fullstack</button>
          <button class="mode-filter-btn ${filterMode === 'qa' ? 'active' : ''}" data-search-filter="qa">QA Engineer</button>
          <button class="mode-filter-btn ${filterMode === 'sa' ? 'active' : ''}" data-search-filter="sa">System Architect</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px; margin-top:6px;">
          ${resultsHTML}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-search-filter]').forEach(btn => {
      btn.addEventListener('click', () => renderSearchPage(container, query, btn.dataset.searchFilter));
    });
  }

  function renderSidebar(sidebarContainer, modeOverride = null) {
    if (!sidebarContainer) return;
    const tracks = window.TRACKS || [];
    const state = window.academyState;
    const mode = modeOverride || state.getMode();
    const cfg = getModeMeta(mode);

    const dirLabelEl = document.getElementById('sidebarDirectoryLabel');
    const dirDescEl = document.getElementById('sidebarDirectoryDesc');
    if (dirLabelEl) dirLabelEl.textContent = `● ${cfg.directoryLabel}`;
    if (dirDescEl) dirDescEl.textContent = cfg.directoryDesc;

    const modeTracks = tracks.filter(t => (t.mode || 'fullstack') === mode);
    const categories = [...new Set(modeTracks.map(t => t.category))];

    const html = categories.map(category => {
      const groupTracks = modeTracks.filter(t => t.category === category);
      const itemsHTML = groupTracks.map(track => {
        const counts = state.getTrackStats(track.id);
        return `
          <button class="sidebar-track-btn" data-action="track" data-track-id="${escapeHTML(track.id)}">
            <div class="sidebar-track-left">
              <span class="sidebar-track-icon">${escapeHTML(track.icon || '❖')}</span>
              <span class="sidebar-track-name">${escapeHTML(track.name)}</span>
            </div>
            <span class="sidebar-track-count">${counts.completed}/${counts.total}</span>
          </button>
        `;
      }).join('');

      return `
        <div class="sidebar-category-group">
          <div class="sidebar-category-label">
            <span>${escapeHTML(category)}</span>
            <span>${groupTracks.length}</span>
          </div>
          <div class="sidebar-nav-list">
            ${itemsHTML}
          </div>
        </div>
      `;
    }).join('');

    sidebarContainer.innerHTML = html;
  }

  window.academyUI = {
    renderHome,
    renderTrack,
    renderModule,
    renderBookmarksPage,
    renderSearchPage,
    renderSidebar,
    renderModePillBadge,
    getModeMeta
  };
})(window);
