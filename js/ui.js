/**
 * UI Rendering Engine for Full-Stack Engineering Academy
 * Swiss Editorial & Design Playground Aesthetic
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

  // --- Components ---

  function renderModuleCard(module, index) {
    const state = window.academyState;
    const isDone = state.isCompleted(module.id);
    const levelClass = getLevelClass(module.level);
    const concepts = (module.concepts || []).slice(0, 3).map(([title]) => 
      `<span class="concept-mini-pill">${escapeHTML(title)}</span>`
    ).join('');

    return `
      <article class="module-specimen-card ${isDone ? 'is-completed' : ''}" 
               tabindex="0" 
               role="button" 
               data-open-module="${module.id}" 
               aria-label="Buka materi ${escapeHTML(module.title)}">
        <div class="module-card-head">
          <span class="level-chip ${levelClass}">
            <span style="font-size:7px;">●</span> ${escapeHTML(module.level)}
          </span>
          <span class="track-index-chip">M${String(index + 1).padStart(2, '0')}</span>
        </div>
        <h4 class="module-card-title">${escapeHTML(module.title)}</h4>
        <p class="module-card-summary">${escapeHTML(module.summary)}</p>
        <div class="module-concept-pills">
          ${concepts}
        </div>
        <div class="module-card-bottom">
          <span class="status-indicator ${isDone ? 'done' : 'todo'}">
            ${isDone ? '✓ Selesai dipelajari' : '○ Belum dipelajari'}
          </span>
          <span style="font-family:var(--font-display); font-weight:700; color:var(--color-brand-magenta); font-size:11px;">
            Pelajari →
          </span>
        </div>
      </article>
    `;
  }

  function renderTrackCard(track, index) {
    const state = window.academyState;
    const counts = state.getTrackStats(track.id);

    return `
      <article class="track-specimen-card" 
               tabindex="0" 
               role="button" 
               data-open-track="${escapeHTML(track.id)}" 
               aria-label="Buka jalur ${escapeHTML(track.name)}">
        <div class="track-card-top">
          <span class="track-index-chip">TRACK 0${index + 1}</span>
          <span class="track-icon-badge">${escapeHTML(track.icon || '❖')}</span>
        </div>
        <h4 class="track-card-title">${escapeHTML(track.name)}</h4>
        <p class="track-card-desc">${escapeHTML(track.desc)}</p>
        <div class="track-card-footer">
          <div class="track-footer-left">
            <span>${counts.total} Modul</span>
            <span>·</span>
            <span>${counts.completed} Selesai</span>
          </div>
          <span class="track-footer-action">Buka Jalur →</span>
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

    // Find recommended module
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
              <span style="width:8px; height:8px; border-radius:50%; background:var(--color-brand-magenta);"></span>
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
      <!-- Hero Section (Design Playground Style) -->
      <section class="hero-section playground-grid-bg">
        <div class="hero-layout">
          <div>
            <div class="hero-kicker-row">
              <span class="kicker-tag">
                <span style="width:6px; height:6px; border-radius:50%; background:var(--color-brand-magenta);"></span>
                FULL-STACK ROADMAP · 2026 EDITION
              </span>
              <span class="kicker-tag">TERBUKA &amp; GRATIS</span>
            </div>
            <h1 class="hero-title">
              REKAYASA SISTEM MODERN<br>
              <span class="hero-title-accent">dari Web Dasar hingga Distributed Scale</span>
            </h1>
            <p class="hero-description">
              Platform pembelajaran rekayasa perangkat lunak berbasis kurikulum praktis:
              fondasi web, framework modern, arsitektur backend, edge security, AI/RAG, 
              hingga reliability engineering tingkat enterprise.
            </p>
            <div class="hero-pill-row">
              <span class="feature-pill">✦ 29 Jalur Terstruktur</span>
              <span class="feature-pill">✦ 156 Modul Fokus</span>
              <span class="feature-pill">✦ Visual Arsitektur</span>
              <span class="feature-pill">✦ Evaluasi Mandiri</span>
              <span class="feature-pill">✦ 100% Offline Ready</span>
            </div>
            <div class="hero-cta-group">
              <button class="btn btn-primary" id="startLearningBtn" data-open-module="${nextModule?.id || 'w01'}">
                Mulai Belajar Sekarang →
              </button>
              <button class="btn btn-outline" id="browseTracksBtn">
                Jelajahi Semua Jalur
              </button>
            </div>
          </div>

          <!-- Specimen Bento Box -->
          <div class="hero-specimen-card">
            <div class="specimen-header">
              <span class="specimen-eyebrow">PORTFOLIO PROGRESS SPEC</span>
              <span class="specimen-badge">LIVE TRACKER</span>
            </div>
            <div class="specimen-stats-grid">
              <div class="specimen-stat-box">
                <div class="stat-value" id="heroCompletedStat">${stats.completed}</div>
                <div class="stat-label">Modul Selesai</div>
              </div>
              <div class="specimen-stat-box">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total Kurikulum</div>
              </div>
            </div>
            <div class="specimen-progress-wrap">
              <div class="specimen-progress-label">
                <span>Penguasaan Materi</span>
                <strong id="heroPercentStat">${stats.percent}%</strong>
              </div>
              <div class="progress-track-bar">
                <div class="progress-fill-bar" id="heroProgressBar" style="width: ${stats.percent}%;"></div>
              </div>
            </div>
            <div class="specimen-note">
              <span>●</span>
              <span>Progres disimpan otomatis di browser tanpa registrasi akun.</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Learning Path Clusters -->
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
          <span>${counts.total} Modul dalam Jalur</span>
        </div>

        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            <span>●</span> JALUR TEKNOLOGI KURIKULUM
          </div>
          <h1 class="lesson-main-title">${escapeHTML(track.name)}</h1>
          <p class="lesson-main-summary">${escapeHTML(track.desc)} ${escapeHTML(track.outcome || '')}</p>
          
          <div class="lesson-actions-bar">
            <div class="lesson-meta-chips">
              <span class="feature-pill">${counts.total} Materi</span>
              <span class="feature-pill">${counts.completed} Selesai (${counts.percent}%)</span>
            </div>
            <div class="progress-track-bar" style="width: 140px;">
              <div class="progress-fill-bar" style="width: ${counts.percent}%;"></div>
            </div>
          </div>
        </div>

        <div class="section-cluster" style="margin-top: 10px;">
          <div class="section-cluster-head">
            <h3 class="cluster-title">Daftar Materi Pembelajaran</h3>
            <span class="cluster-meta">Pilih modul untuk membaca secara terstruktur</span>
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
          `<li style="margin-bottom:6px;"><a href="${escapeHTML(r)}" target="_blank" rel="noopener" style="color:var(--color-brand-magenta); text-decoration:underline;">${escapeHTML(r)}</a></li>`
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
          <div class="callout-block" style="background:var(--color-canvas); border-color:var(--color-border-strong);">
            <div class="callout-head">Trade-off &amp; Hubungan Antar Ekosistem:</div>
            <p style="font-size:14px; line-height:1.7; color:var(--color-ink-secondary);">
              ${escapeHTML(module.compare || 'Di arsitektur modern, setiap framework atau pola memiliki perbandingan trade-off antara kesederhanaan, skalabilitas, dan kompleksitas operasional.')}
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
            <span style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:var(--color-brand-magenta); background:var(--color-brand-magenta-soft); padding:1px 6px; border-radius:3px;">
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
              <span class="level-chip ${getLevelClass(module.level)}">${escapeHTML(module.level)}</span>
              <span class="feature-pill">${(module.refs || []).length} Referensi</span>
              <span class="feature-pill" id="lessonStatusBadge">
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
                <button class="btn btn-magenta" id="finishModuleBtn">
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
        <div style="grid-column: 1 / -1; background:var(--color-elevated); border:1px solid var(--color-border-subtle); border-radius:var(--radius-md); padding:40px; text-align:center;">
          <div style="font-size:32px; margin-bottom:12px;">☆</div>
          <h4 style="font-family:var(--font-display); font-size:18px; font-weight:800; margin-bottom:8px;">Belum Ada Materi Tersimpan</h4>
          <p style="font-size:13px; color:var(--color-muted); max-width:420px; margin:0 auto 20px;">
            Saat membaca materi, klik tombol "Simpan Materi" untuk menyimpan modul penting agar mudah diakses kembali.
          </p>
          <button class="btn btn-primary" data-action="home">Kembali ke Beranda</button>
        </div>
      `;

    container.innerHTML = `
      <div class="reader-wrapper">
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="home">← Kembali ke Beranda</span>
          <span>${bookmarkedModules.length} Tersimpan</span>
        </div>

        <div class="lesson-hero-box playground-grid-bg">
          <div class="lesson-eyebrow">
            <span>●</span> MATERI PILIHAN TERSIMPAN
          </div>
          <h1 class="lesson-main-title">Koleksi Belajarmu</h1>
          <p class="lesson-main-summary">
            Daftar modul yang kamu tandai untuk diulang, didalami, atau dipraktikkan kembali dalam project pribadimu.
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
              <span style="font-size:9px; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-brand-magenta); font-weight:700;">Cocok Pada:</span>
              <code>${escapeHTML(r.snippet)}</code>
            </div>
          </div>
        `).join('')
      : `
        <div style="background:var(--color-elevated); border:1px solid var(--color-border-subtle); border-radius:var(--radius-md); padding:40px; text-align:center;">
          <h4 style="font-family:var(--font-display); font-size:16px; font-weight:800; margin-bottom:8px;">Tidak ditemukan hasil untuk "${escapeHTML(query)}"</h4>
          <p style="font-size:13px; color:var(--color-muted);">Coba gunakan istilah pencarian lain seperti 'REST', 'JWT', 'Vue', 'Spring', atau 'Cloudflare'.</p>
        </div>
      `;

    container.innerHTML = `
      <div class="reader-wrapper">
        <div class="reader-breadcrumb">
          <span class="breadcrumb-back-btn" data-action="home">← Kembali ke Beranda</span>
          <span>${results.length} Hasil Ditemukan</span>
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

