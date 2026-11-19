/**
 * Visual Flow Diagrams Generator for Lessons
 * Supports Fullstack, QA Engineering, and System Architect (SA) modules.
 */

(function (window) {
  'use strict';

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function getVisualFlowSpec(module) {
    const text = `${module.id} ${module.track} ${module.title} ${module.summary}`.toLowerCase();
    let steps = [];
    let branch = false;

    // QA-specific flows
    if (/shift-left|testing trophy/.test(text)) {
      steps = [
        ['1. Static & Unit', 'ESLint, TypeScript strict, OpenAPI schema & fungsi murni terisolasi.'],
        ['2. Integration & API (ROI Tertinggi)', 'Newman/API tests menguji kontrak HTTP, logika bisnis, & DB.'],
        ['3. E2E UI Kritis', 'Playwright POM menguji alur bisnis kritis seperti registrasi & checkout.']
      ];
      branch = false;
    } else if (/playwright|fault injection|e2e/.test(text)) {
      steps = [
        ['API Seeding (beforeEach)', 'Siapkan state keranjang cepat via REST tanpa klik UI katalog.'],
        ['Playwright POM + Web Vitals', 'Jalankan aksi & ukur LCP (<2.5s) serta CLS (<0.1) otomatis.'],
        ['Fault Injection (page.route)', 'Simulasikan HTTP 503 untuk memastikan UI degrade secara aman.']
      ];
      branch = true;
    } else if (/k6|load testing|ci\/cd|github actions/.test(text)) {
      steps = [
        ['Pull Request Trigger', 'Pipeline menyala otomatis saat kode didorong ke main/develop.'],
        ['Job 1: Newman API Gate', 'Validasi kontrak JSON & response time (~1-2 menit).'],
        ['Job 2: Playwright 2-Shards', 'Eksekusi E2E paralel & unggah trace.zip forensik jika gagal.']
      ];
      branch = true;
    } else if (/lcp|inp|cls|ttfb|web performance/.test(text)) {
      steps = [
        ['Audit Chrome DevTools', 'Aktifkan Slow 4G + 4x CPU slowdown untuk menangkap Long Task & Layout Shift.'],
        ['Isolasi Bottleneck', 'Identifikasi render-blocking script, layout thrashing, atau gambar tanpa rasio.'],
        ['Verifikasi Threshold (P75)', 'Kunci perbaikan: TTFB <= 800ms, LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.']
      ];
      branch = false;
    } else if (/flash_sale|simulasi kausal|tiket konser/.test(text)) {
      steps = [
        ['Waiting Room + Rate Limit', 'Meredam lonjakan 1M/25k RPS di gerbang agar antrean adil & fail-fast.'],
        ['Redis Lua Atomic (TTL 5m)', 'Validasi & kurangi stok secara atomik mikrodetik tanpa overselling.'],
        ['Kafka Load Leveler -> Primary DB', 'Ratakan penulisan asinkron di bawah kapasitas IOPS database ACID.']
      ];
      branch = true;
    } else if (/outbox|cdc|dual-write|kafka/.test(text)) {
      steps = [
        ['Single ACID Transaction', 'Simpan order + baris outbox_events dalam satu COMMIT PostgreSQL.'],
        ['CDC Connector (Debezium)', 'Baca WAL / Binlog secara asinkron dan terbitkan event ke Kafka.'],
        ['Idempotent Consumer', 'Saring event duplikat menggunakan event_id sebelum memproses aksi.']
      ];
      branch = false;
    } else if (/fencing token|cap\/pacelc|konsensus|snowflake/.test(text)) {
      steps = [
        ['Acquire Lock + Fencing Token', 'Worker memperoleh distributed lock disertai nomor urut monotonik (#33).'],
        ['GC Pause & Lease Expiry', 'Lock habis -> Worker lain mendapat Token baru (#34) dan menulis ke DB.'],
        ['Storage Token Validation', 'Database menolak penulisan dari Token kadaluarsa (#33 < #34).']
      ];
      branch = true;
    } else if (/circuit breaker|bulkhead|5 pilar operasional/.test(text)) {
      steps = [
        ['Gateway Rate Limit + Jitter', 'Saring burst via Token Bucket & cegah retry storm dengan Full Jitter.'],
        ['Bulkhead & Cascading Timeout', 'Isolasi thread pool layanan eksternal dengan timeout menyusut (< 2s).'],
        ['Circuit Breaker & Degradation', 'Putus panggilan gagal (OPEN < 1ms) & sajikan fallback estimasi aman.']
      ];
      branch = true;
    } else if (/singleflight|stampede|caching/.test(text)) {
      steps = [
        ['Hot Key Cache Miss', 'Ribuan request bersamaan menemukan kunci Redis telah kedaluwarsa.'],
        ['Singleflight Coalescing', 'Tahan seluruh request di memori; izinkan hanya 1 pemimpin query ke DB.'],
        ['Populate with TTL Jitter', 'Isi ulang Redis dengan variasi TTL acak agar terhindar dari Cache Avalanche.']
      ];
      branch = false;
    } else if (/turnstile|siteverify|bot prevention|captcha/.test(text)) {
      steps = [
        ['Frontend', 'Widget menampilkan verifikasi dan menerima token.'],
        ['Backend', 'Token diterima bersama request; secret tetap di server.'],
        ['Siteverify', 'Backend memverifikasi token ke Cloudflare.']
      ];
      branch = true;
    } else if (/booking|bioskop|seat|reservation|payment|pembayaran|midtrans|stripe|webhook/.test(text)) {
      steps = [
        ['Pilih Resource & Jadwal', 'Pengguna memilih kursi atau item yang ingin dipesan.'],
        ['Atomik Hold & Invoice', 'Backend mengunci ketersediaan secara transaksional agar mencegah double-booking.'],
        ['Payment Callback & Settlement', 'Webhook payment gateway diverifikasi dengan HMAC signature dan diproses secara idempotent.']
      ];
      branch = true;
    } else if (/rest|http|api|request|web fundamentals|middleware|dns|jaringan/.test(text)) {
      steps = [
        ['Client & DNS/QUIC', 'Browser menyelesaikan DNS Anycast dan membuka koneksi HTTP/2 atau HTTP/3.'],
        ['Edge / L7 Load Balancer', 'SSL Offloading, WAF, rate limiting, dan routing Least Connections berjalan.'],
        ['Application Controller', 'Layanan stateless memvalidasi payload dan mengakses storage/cache.']
      ];
      branch = false;
    } else if (/microservice|monolith|architecture|system design|arsitektur|cqrs|event/.test(text)) {
      steps = [
        ['API Gateway / BFF', 'Mengarahkan trafik client dan mendistribusikan request ke domain yang tepat.'],
        ['Domain Business Boundary', 'Service mengolah logika transaksi independen dengan isolasi bulkhead.'],
        ['Persistence & Observability', 'Data disimpan ACID/LSM-Tree dan seluruh span dilacak via Trace-ID.']
      ];
      branch = false;
    } else if (/cloudflare|waf|rate limit|ddos|proxy|tunnel/.test(text)) {
      steps = [
        ['Anycast Edge DNS', 'Traffic masuk melalui jaringan global Cloudflare Anycast.'],
        ['Edge Security Engine', 'Pemeriksaan WAF managed rules, heuristic bot score, dan limit burst rate.'],
        ['Protected Origin', 'Hanya request yang bersih diteruskan ke origin server via Cloudflare Tunnel.']
      ];
      branch = false;
    } else if (/database|sql|jpa|hibernate|entity framework|ef core|orm|index|b-tree|lsm/.test(text)) {
      steps = [
        ['Application & Connection Pool', 'Layanan meminjam koneksi efisien via PgBouncer.'],
        ['Query & Index Scan', 'Mesin memilih B+Tree Covering Index atau LSM-Tree sequential append.'],
        ['Replication & ACID', 'Primary meng-commit transaksi dan menyinkronkan replika secara konsisten.']
      ];
      branch = false;
    } else if (/rag|embedding|vector|ai|llm/.test(text)) {
      steps = [
        ['User Query Input', 'Pengguna mengajukan pertanyaan dalam bahasa alami.'],
        ['Embedding Model & Vector Search', 'Query dikonversi ke vektor numerik dan dicari dokumen relevan via HNSW.'],
        ['Augmented Prompt Generation', 'LLM merangkum jawaban akurat bersumber dari referensi konteks yang ditemukan.']
      ];
      branch = false;
    } else {
      steps = (module.concepts || []).slice(0, 3).map(([title, desc]) => [title, desc]);
    }

    return { steps, branch };
  }

  function renderVisualFlow(module) {
    const { steps, branch } = getVisualFlowSpec(module);
    if (!steps || !steps.length) return '';

    const nodesHTML = steps.map(([title, desc], index) => `
      <div class="flow-step-node">
        <span class="flow-node-index">STEP 0${index + 1}</span>
        <h5 class="flow-node-title">${escapeHTML(title)}</h5>
        <p class="flow-node-desc">${escapeHTML(desc)}</p>
      </div>
      ${index < steps.length - 1 ? '<div class="flow-arrow-separator" aria-hidden="true">→</div>' : ''}
    `).join('');

    const branchesHTML = branch ? `
      <div class="flow-branches-box">
        <div class="branch-card good">
          <span>✓</span>
          <div>
            <strong>Valid / Terkendali:</strong>
            <span>Transaksi diproses aman &amp; lolos Quality/SLA Gate.</span>
          </div>
        </div>
        <div class="branch-card bad">
          <span>✕</span>
          <div>
            <strong>Gagal / Terbatas:</strong>
            <span>Fail-fast, rollback aman, atau hentikan rilis sebelum berdampak.</span>
          </div>
        </div>
      </div>
    ` : '';

    return `
      <div class="flow-diagram-container">
        <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span style="font-family:var(--font-mono); font-size:10px; font-weight:800; color:var(--color-brand-blue); letter-spacing:0.08em; text-transform:uppercase;">
            ● VISUAL ARCHITECTURE SPEC
          </span>
          <span style="font-size:11px; color:var(--color-muted); font-weight:600;">
            ${branch ? 'Alur Keputusan & Proteksi' : 'Alur Eksekusi Berurutan'}
          </span>
        </div>
        <div class="flow-steps-row">
          ${nodesHTML}
        </div>
        ${branchesHTML}
      </div>
    `;
  }

  window.academyVisuals = {
    renderVisualFlow
  };
})(window);
