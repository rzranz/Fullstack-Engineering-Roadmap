/**
 * UI Rendering Engine for Full-Stack Engineering Academy
 * Aesthetic: Design Playground Layout + iCraft Luminous Color Theme
 * Distinctive Feature: Realistic Folder-Shaped Cards
 */

(function (window) {
  'use strict';

  const { escapeHTML } = window.academySearch;

  const LESSON_STEPS = [
    { id: 'overview', label: 'Ringkasan', short: 'Tujuan Belajar', icon: '01' },
    { id: 'concepts', label: 'Konsep Inti', short: 'Teori & Fondasi', icon: '02' },
    { id: 'architecture', label: 'Komparasi', short: 'Arsitektur & Trade-off', icon: '03' },
    { id: 'code', label: 'Kode & Visual', short: 'Specimen & Alur', icon: '04' },
    { id: 'practices', label: 'Best Practices', short: 'Standar Industri', icon: '05' },
    { id: 'cases', label: 'Kasus Nyata', short: 'Aplikasi di Pekerjaan', icon: '06' },
    { id: 'exercise', label: 'Latihan', short: 'Hands-on Practice', icon: '07' },
    { id: 'quiz', label: 'Cek Pemahaman', short: 'Evaluasi & Kuis', icon: '08' }
  ];

  function getLevelClass(level) {
    const l = (level || '').toLowerCase();
    if (l.includes('beginner') || l.includes('dasar')) return 'beginner';
    if (l.includes('advanced') || l.includes('mahir')) return 'advanced';
    return 'intermediate';
  }

  // --- Folder Card Components ---

  function renderModuleCard(module, index) {
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
        <!-- Top Folder Tab Header -->
        <div class="folder-tab-header">
          <div class="folder-tab">
            <span class="folder-tab-icon">📁</span>
            <span>DIR · M${String(index + 1).padStart(2, '0')}</span>
          </div>
          <div class="folder-tab-filler">
            <span class="level-badge ${levelClass}">${escapeHTML(module.level)}</span>
          </div>
        </div>

        <!-- Folder Main Body / Pocket -->
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
      <article class="folder-card" 
               tabindex="0" 
               role="button" 
               data-open-track="${escapeHTML(track.id)}" 
               aria-label="Buka jalur ${escapeHTML(track.name)}">
        <!-- Top Folder Tab Header -->
        <div class="folder-tab-header">
          <div class="folder-tab">
            <span class="folder-tab-icon">${escapeHTML(track.icon || '❖')}</span>
            <span>TRACK · 0${index + 1}</span>
          </div>
          <div class="folder-tab-filler">
            <span class="level-badge beginner">${counts.total} MODUL</span>
          </div>
        </div>

        <!-- Folder Main Body / Pocket -->
        <div class="folder-body">
          <h4 class="folder-title">${escapeHTML(track.name)}</h4>
          <p class="folder-summary">${escapeHTML(track.desc)}</p>
          <div class="folder-footer">
            <span style="font-size:11px; color:var(--color-muted); font-weight:600;">
              ${counts.completed}/${counts.total} Selesai
            </span>
            <span class="folder-footer-action">Buka Jalur →</span>
          </div>
        </div>
      </article>
    `;
  }

  // --- Views ---

  function renderHome(container) {
    const state = window.academyState;
    const tracks = window.TRACKS || [];
    const modules = window.MODULES || [];
    const stats = state.getProgressStats(modules);

    // Group tracks by category
    const categories = [...new Set(tracks.map(t => t.category))];
    const nextModule = modules.find(m => !state.isCompleted(m.id)) || modules[0];

    const clustersHTML = categories.map(category => {
      const groupTracks = tracks.filter(t => t.category === category);
      const cardsHTML = groupTracks.map(t => {
        const idx = tracks.findIndex(item => item.id === t.id);
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

    container.innerHTML = `
      <!-- Hero Section (Exact Design Playground Layout with iCraft Luminous Glow) -->
      <section class="hero-editorial-section playground-grid-bg">
        <div class="hero-kicker-badge">
          <span class="hero-badge-dot"></span>
          <span>FULL-STACK ENGINEERING ACADEMY / 29 JALUR · 156 MODUL · PRODUCTION GRADE</span>
        </div>

        <h1 class="hero-main-heading">
          FROM WEB FUNDAMENTALS<br>
          TO DISTRIBUTED ARCHITECTURE.
        </h1>

        <span class="hero-quote-accent">
          “From Clean Code to Enterprise Scalability &amp; Edge Security”
        </span>

        <p class="hero-lead-text">
          Kurikulum komprehensif terarah untuk mendalami rekayasa perangkat lunak modern:
          fondasi browser, request lifecycle, framework frontend (Vue/Nuxt/React/Next),
          arsitektur backend multi-bahasa (Go/Java/C#), edge security (Cloudflare/Turnstile),
          hingga reliability engineering tingkat industri.
        </p>

        <!-- 3 Action Buttons -->
        <div class="hero-action-buttons">
          <button class="btn btn-primary" id="startLearningBtn" data-open-module="${nextModule?.id || 'w01'}">
            Mulai Belajar Sekarang →
          </button>
          <button class="btn btn-outline" id="browseTracksBtn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-brand-blue);"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Jelajahi Kurikulum
          </button>
          <button class="btn btn-outline" id="quickSearchBtn" data-action="search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-brand-cyan);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Cari Cepat (⌘K)
          </button>
        </div>

        <!-- 4-Column Metadata Info Strip -->
        <div class="hero-meta-strip">
          <div class="meta-strip-col">
            <span class="meta-strip-label">Fokus Rekayasa</span>
            <span class="meta-strip-value">Web to Enterprise Scale</span>
          </div>
          <div class="meta-strip-col">
            <span class="meta-strip-label">Cakupan Kurikulum</span>
            <span class="meta-strip-value">29 Jalur · 156 Modul</span>
          </div>
          <div class="meta-strip-col">
            <span class="meta-strip-label">Teknologi Utama</span>
            <span class="meta-strip-value">TypeScript · Go · Java · C# · Cloudflare</span>
          </div>
          <div class="meta-strip-col">
            <span class="meta-strip-label">Akses Belajar</span>
            <span class="meta-strip-value">100% Gratis · Offline Ready</span>
          </div>
        </div>
      </section>

      <!-- 4-Stage Methodology Section (Exact Design Playground Pattern) -->
      <section class="methodology-section">
        <div class="methodology-header">
          <div>
            <div class="methodology-kicker">Metodologi Rekayasa</div>
            <h2 class="methodology-title">UNDERSTAND → EXPLORE → BUILD → SHIP</h2>
          </div>
          <p class="methodology-subcopy">
            Bangun intuisi sistem dari siklus request dasar, uji trade-off arsitektur,
            buat implementasi kode riil, lalu amankan di production edge.
          </p>
        </div>

        <div class="stages-grid">
          <div class="stage-card">
            <div class="stage-card-head">
              <span class="stage-card-label">Stage 01</span>
              <span class="stage-card-pill">UNDERSTAND</span>
            </div>
            <h4 class="stage-card-title">Fondasi Web</h4>
            <p class="stage-card-desc">
              Pahami request lifecycle, batas tanggung jawab frontend vs backend, DNS, TLS, dan integritas data persisten.
            </p>
          </div>

          <div class="stage-card">
            <div class="stage-card-head">
              <span class="stage-card-label">Stage 02</span>
              <span class="stage-card-pill">EXPLORE</span>
            </div>
            <h4 class="stage-card-title">Arsitektur &amp; Trade-off</h4>
            <p class="stage-card-desc">
              Bandingkan monolith vs microservices, REST API contract, SQL indexing, ACID transaction, dan caching strategy.
            </p>
          </div>

          <div class="stage-card">
            <div class="stage-card-head">
              <span class="stage-card-label">Stage 03</span>
              <span class="stage-card-pill">BUILD</span>
            </div>
            <h4 class="stage-card-title">Implementasi Riil</h4>
            <p class="stage-card-desc">
              Pelajari contoh kode specimen, tangani skenario kegagalan, terapkan unit testing, dan bangun best practice industri.
            </p>
          </div>

          <div class="stage-card dark-highlight">
            <div class="stage-card-head">
              <span class="stage-card-label">Stage 04</span>
              <span class="stage-card-pill">SHIP &amp; SECURE</span>
            </div>
            <h4 class="stage-card-title">Keamanan &amp; Edge</h4>
            <p class="stage-card-desc">
              Lindungi origin dengan Cloudflare WAF, Turnstile, bot protection, webhook idempotency, dan observabilitas production.
            </p>
          </div>
        </div>
      </section>

      <!-- Learning Path Clusters (Folder-Shaped Cards) -->
      <div id="tracksDirectory">
        ${clustersHTML}
      </div>
    `;

    const browseBtn = container.querySelector('#browseTracksBtn');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        const dir = container.querySelector('#tracksDirectory');
        if (dir) dir.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const quickSearch = container.querySelector('#quickSearchBtn');
    if (quickSearch) {
      quickSearch.addEventListener('click', () => {
        const input = document.getElementById('searchModalInput');
        const modal = document.getElementById('searchModalBackdrop');
        if (modal) modal.classList.add('open');
        if (input) setTimeout(() => input.focus(), 50);
      });
    }
  }

  function renderTrack(container, trackId) {
    const tracks = window.TRACKS || [];
    const modules = window.MODULES || [];
    const track = tracks.find(t => t.id === trackId);
    if (!track) return renderHome(container);

    const state = window.academyState;
    const trackModules = modules.filter(m => m.track === trackId).sort((a, b) => (a.order || 999) - (b.order || 999));
    const counts = state.getTrackStats(trackId, modules);

    const cardsHTML = trackModules.map((m, i) => renderModuleCard(m, i)).join('');

    container.innerHTML = `
      <div class="reader-wrapper">
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="home">← Kembali ke Beranda</span>
          <span style="font-family:var(--font-mono); font-weight:700;">${counts.total} Modul dalam Jalur</span>
        </div>

        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            <span>●</span> JALUR TEKNOLOGI KURIKULUM
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
          `<li style="margin-bottom:6px;"><a href="${escapeHTML(r)}" target="_blank" rel="noopener" style="color:var(--color-brand-blue); text-decoration:underline;">${escapeHTML(r)}</a></li>`
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
            <h4><span class="concept-bullet-dot"></span> 0${i + 1}. ${escapeHTML(title)}</h4>
            <p>${escapeHTML(desc)}</p>
          </div>
        `).join('');

        return `
          <div class="stage-section-head">
            <span class="stage-number">02</span>
            <h3 class="stage-heading">Konsep Inti &amp; Landasan Teori</h3>
          </div>
          <p style="font-size:13px; color:var(--color-muted); margin-bottom:16px;">
            Pahami prinsip-prinsip dasar sebelum masuk ke kode program dan implementasi:
          </p>
          <div class="concept-grid">
            ${conceptCards || '<p>Tidak ada konsep tambahan untuk modul ini.</p>'}
          </div>
        `;
      }

      case 'architecture': {
        return `
          <div class="stage-section-head">
            <span class="stage-number">03</span>
            <h3 class="stage-heading">Arsitektur &amp; Komparasi Pendekatan</h3>
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

        return `
          <div class="stage-section-head">
            <span class="stage-number">04</span>
            <h3 class="stage-heading">Specimen Kode &amp; Visualisasi Alur</h3>
          </div>
          ${visual}
          <div class="code-specimen-box">
            <div class="code-specimen-header">
              <span class="code-lang-tag">● ${escapeHTML(lang)} SPECIMEN</span>
              <button class="copy-code-btn" data-copy="${module.id}">
                Salin Kode
              </button>
            </div>
            <pre class="code-specimen-pre"><code>${escapeHTML(codeContent)}</code></pre>
          </div>
        `;
      }

      case 'practices': {
        const practices = (module.practices || []).map((p, i) => `
          <li style="margin-bottom:10px; display:flex; align-items:flex-start; gap:10px;">
            <span style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:var(--color-brand-blue); background:var(--color-brand-blue-soft); padding:1px 6px; border-radius:3px;">
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
            Kebiasaan dan pola yang membedakan kode amatir dari rekayasa perangkat lunak profesional:
          </p>
          <ul style="list-style:none; padding:0;">
            ${practices || '<li>Terapkan clean code, error handling yang aman, dan penulisan unit test.</li>'}
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
            <div class="callout-head">Skenario Produksi:</div>
            <p class="callout-body">
              ${escapeHTML(module.case || 'Studi kasus ini menggambarkan bagaimana teknologi diterapkan dalam memecahkan masalah skala besar, integritas data, atau proteksi sistem di dunia kerja riil.')}
            </p>
          </div>
        `;
      }

      case 'exercise': {
        const scenario = module.exercise?.scenario || (typeof module.exercise === 'string' ? module.exercise : '');
        const task = module.exercise?.task || '';

        return `
          <div class="stage-section-head">
            <span class="stage-number">07</span>
            <h3 class="stage-heading">Latihan Mandiri &amp; Tantangan Praktik</h3>
          </div>
          <div class="callout-block exercise">
            <div class="callout-head">Tantangan untuk Dikerjakan:</div>
            <p class="callout-body" style="margin-bottom:12px;">
              ${escapeHTML(scenario || 'Buka editor kodemu, implementasikan modul ini secara mandiri, lalu lakukan verifikasi request dan penanganan kasus gagal.')}
            </p>
            ${task ? `<div style="font-weight:700; font-size:13px; color:var(--color-ink); border-top:1px dashed var(--color-border-strong); padding-top:10px;">Tugas: ${escapeHTML(task)}</div>` : ''}
          </div>
        `;
      }

      case 'quiz': {
        const quiz = module.quiz;
        if (!quiz) {
          return `
            <div class="stage-section-head">
              <span class="stage-number">08</span>
              <h3 class="stage-heading">Cek Pemahaman</h3>
            </div>
            <p>Tidak ada kuis khusus untuk modul ini. Silakan tandai materi sebagai selesai jika kamu telah memahaminya.</p>
          `;
        }

        const savedAnswer = state.getAnswer(module.id);
        const hasAnswered = savedAnswer !== null;
        const isCorrect = savedAnswer === quiz.answer;

        const optionsHTML = quiz.options.map((option, idx) => `
          <label class="quiz-option-label ${savedAnswer === idx ? 'selected' : ''}">
            <input type="radio" name="quizChoice" value="${idx}" ${savedAnswer === idx ? 'checked' : ''}>
            <span>${escapeHTML(option)}</span>
          </label>
        `).join('');

        return `
          <div class="stage-section-head">
            <span class="stage-number">08</span>
            <h3 class="stage-heading">Cek Pemahaman (Knowledge Check)</h3>
          </div>
          <div class="quiz-container">
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

      default:
        return '';
    }
  }

  function renderModule(container, moduleId, requestedStep = null) {
    const modules = window.MODULES || [];
    const module = modules.find(m => m.id === moduleId);
    if (!module) return renderHome(container);

    const state = window.academyState;
    const isDone = state.isCompleted(moduleId);
    const isSaved = state.isBookmarked(moduleId);

    // Track modules context
    const trackModules = modules.filter(m => m.track === module.track).sort((a, b) => (a.order || 999) - (b.order || 999));
    const trackIdx = trackModules.findIndex(m => m.id === moduleId);

    // Step Index
    const currentStepIndex = requestedStep !== null 
      ? requestedStep 
      : state.getLessonStep(moduleId);
    const safeStepIndex = Math.min(Math.max(currentStepIndex, 0), LESSON_STEPS.length - 1);
    state.setLessonStep(moduleId, safeStepIndex);

    // Render Stepper Tabs
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
        <!-- Top Breadcrumb -->
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="track" data-track-id="${escapeHTML(module.track)}">
            ← Kembali ke Jalur ${escapeHTML(module.track)}
          </span>
          <span style="font-family:var(--font-mono); font-size:11px; font-weight:700;">
            Modul ${trackIdx + 1} dari ${trackModules.length}
          </span>
        </div>

        <!-- Lesson Hero Box -->
        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            <span>●</span> ${escapeHTML(module.track)} · TINGKAT ${escapeHTML(module.level).toUpperCase()}
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
              <button class="btn btn-outline btn-sm" id="toggleBookmarkBtn">
                ${isSaved ? '★ Tersimpan' : '☆ Simpan Materi'}
              </button>
              <button class="btn ${isDone ? 'btn-outline' : 'btn-primary'} btn-sm" id="toggleDoneBtn">
                ${isDone ? '✓ Tandai Belum Selesai' : 'Tandai Selesai'}
              </button>
            </div>
          </div>
        </div>

        <!-- Sticky Stepper Tab Bar -->
        <div class="lesson-stepper-container">
          <div class="lesson-stepper-track">
            ${stepperTabsHTML}
          </div>
        </div>

        <!-- Lesson Stage Content -->
        <div class="lesson-stage-card">
          ${renderLessonStepContent(module, safeStepIndex)}

          <!-- Stepper Footer Action Bar -->
          <div class="stepper-footer-bar">
            <button class="btn btn-outline" id="prevStepBtn" ${safeStepIndex === 0 ? 'disabled' : ''}>
              ← Langkah Sebelumnya
            </button>
            <div style="display:flex; gap:8px;">
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

    // Event Wire-up
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

    // Quiz Check
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
  }

  function renderBookmarksPage(container) {
    const state = window.academyState;
    const modules = window.MODULES || [];
    const bookmarkedModules = modules.filter(m => state.isBookmarked(m.id));

    const cardsHTML = bookmarkedModules.length
      ? bookmarkedModules.map((m, i) => renderModuleCard(m, i)).join('')
      : `
        <div style="grid-column: 1 / -1; background:var(--color-elevated); border:1px solid var(--color-border-ice); border-radius:var(--radius-md); padding:40px; text-align:center; box-shadow:var(--shadow-sm);">
          <div style="font-size:32px; margin-bottom:12px; color:var(--color-brand-cyan);">☆</div>
          <h4 style="font-family:var(--font-display); font-size:18px; font-weight:800; margin-bottom:8px; color:var(--color-ink);">Belum Ada Berkas Tersimpan</h4>
          <p style="font-size:13px; color:var(--color-muted); max-width:420px; margin:0 auto 20px;">
            Saat membaca modul, klik tombol "Simpan Materi" untuk menyimpan berkas penting agar mudah diakses kembali.
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
            <span>●</span> ARSIP BERKAS PILIHAN
          </div>
          <h1 class="lesson-main-title">Koleksi Belajarmu</h1>
          <p class="lesson-main-summary">
            Daftar modul yang kamu simpan untuk ditinjau ulang, didalami, atau dijadikan acuan kode riil dalam project pribadimu.
          </p>
        </div>

        <div class="section-cluster" style="margin-top:10px;">
          <div class="bento-grid">
            ${cardsHTML}
          </div>
        </div>
      </div>
    `;
  }

  function renderSearchPage(container, query) {
    const { searchModules } = window.academySearch;
    const results = searchModules(query);

    const resultsHTML = results.length
      ? results.map(r => `
          <div class="search-result-item" tabindex="0" role="button" data-open-module="${r.module.id}">
            <div class="search-result-header">
              <span class="search-match-chip">${escapeHTML(r.matchType)}</span>
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
          <p style="font-size:13px; color:var(--color-muted);">Coba gunakan istilah pencarian lain seperti 'REST', 'JWT', 'Vue', 'Spring', atau 'Cloudflare'.</p>
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
            <span>●</span> PENCARIAN GLOBAL
          </div>
          <h1 class="lesson-main-title">Hasil Pencarian: "${escapeHTML(query)}"</h1>
          <p class="lesson-main-summary">
            Pencarian menelusuri judul, konsep inti, komparasi arsitektur, kode, best practices, dan studi kasus dari seluruh 156 modul.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
          ${resultsHTML}
        </div>
      </div>
    `;
  }

  function renderSidebar(sidebarContainer) {
    if (!sidebarContainer) return;
    const tracks = window.TRACKS || [];
    const state = window.academyState;
    const categories = [...new Set(tracks.map(t => t.category))];

    const html = categories.map(category => {
      const groupTracks = tracks.filter(t => t.category === category);
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
    renderSidebar
  };
})(window);
