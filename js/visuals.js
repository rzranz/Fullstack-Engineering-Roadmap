/**
 * Visual Flow Diagrams Generator for Lessons
 * Renders process architectures, data flows, and decision trees.
 */

(function (window) {
  'use strict';

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function getVisualFlowSpec(module) {
    const text = `${module.track} ${module.title} ${module.summary}`.toLowerCase();
    let steps = [];
    let branch = false;

    if (/turnstile|siteverify|bot prevention|captcha/.test(text)) {
      steps = [
        ['Client Widget', 'Pengguna menyelesaikan tantangan di browser dan menerima Turnstile token.'],
        ['Backend API', 'Server menerima token via payload; secret key tetap aman di origin.'],
        ['Cloudflare Siteverify', 'Backend memvalidasi token secara server-to-server ke endpoint Cloudflare.']
      ];
      branch = true;
    } else if (/booking|bioskop|seat|reservation|payment|pembayaran|midtrans|stripe|webhook/.test(text)) {
      steps = [
        ['Pilih Resource & Jadwal', 'Pengguna memilih kursi atau item yang ingin dipesan.'],
        ['Atomik Hold & Invoice', 'Backend mengunci ketersediaan secara transaksional agar mencegah double-booking.'],
        ['Payment Callback & Settlement', 'Webhook payment gateway diverifikasi dengan HMAC signature dan diproses secara idempotent.']
      ];
      branch = true;
    } else if (/rest|http|api|request|web fundamentals|middleware/.test(text)) {
      steps = [
        ['Client Request', 'Browser atau client mengirim HTTP/HTTPS request ke domain.'],
        ['Edge & Middleware Layer', 'TLS termination, CORS, autentikasi header (JWT), dan rate limit diperiksa.'],
        ['Application Controller', 'Handler memvalidasi request body, menjalankan aturan domain, dan mengembalikan response JSON.']
      ];
      branch = false;
    } else if (/microservice|monolith|architecture|system design|arsitektur|cqrs|event/.test(text)) {
      steps = [
        ['API Gateway / Router', 'Mengarahkan traffic client dan mendistribusikan request ke domain yang tepat.'],
        ['Domain Business Boundary', 'Service mengolah logika transaksi independen dengan dependency yang terisolasi.'],
        ['Persistence & Event Bus', 'Menyimpan data persisten lokal dan menerbitkan domain event ke message broker.']
      ];
      branch = false;
    } else if (/cloudflare|waf|rate limit|ddos|proxy|dns|tunnel/.test(text)) {
      steps = [
        ['Anycast Edge DNS', 'Traffic masuk melalui jaringan global Cloudflare Anycast.'],
        ['Edge Security Engine', 'Pemeriksaan WAF managed rules, heuristic bot score, dan limit burst rate.'],
        ['Protected Origin', 'Hanya request yang bersih diteruskan ke origin server via Cloudflare Tunnel.']
      ];
      branch = false;
    } else if (/database|sql|jpa|hibernate|entity framework|ef core|orm|index/.test(text)) {
      steps = [
        ['Application Service', 'Memulai transaction context dan menyiapkan entity model.'],
        ['Repository & Query Builder', 'Membangun SQL query optimal dengan parameterized query untuk mencegah injection.'],
        ['RDBMS Engine', 'Query planner mengeksekusi B-tree index scan dan menjamin ACID properties.']
      ];
      branch = false;
    } else if (/rag|embedding|vector|ai|llm/.test(text)) {
      steps = [
        ['User Query Input', 'Pengguna mengajukan pertanyaan dalam bahasa alami.'],
        ['Embedding Model & Vector Search', 'Query dikonversi ke vektor numerik dan dicari dokumen relevan via cosine similarity.'],
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
            <strong>Valid / Sukses:</strong>
            <span>Transaksi diselesaikan &amp; status di-commit.</span>
          </div>
        </div>
        <div class="branch-card bad">
          <span>✕</span>
          <div>
            <strong>Gagal / Ditolak:</strong>
            <span>Rollback transaksi atau sajikan error jelas ke client.</span>
          </div>
        </div>
      </div>
    ` : '';

    return `
      <div class="flow-diagram-container">
        <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-family:var(--font-mono); font-size:10px; font-weight:800; color:var(--color-brand-magenta); letter-spacing:0.08em; text-transform:uppercase;">
            ● VISUAL ARCHITECTURE SPEC
          </span>
          <span style="font-size:11px; color:var(--color-muted); font-weight:600;">
            ${branch ? 'Alur Keputusan Kondisional' : 'Alur Eksekusi Berurutan'}
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

