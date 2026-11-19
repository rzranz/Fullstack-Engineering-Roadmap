/**
 * Causal Isometric 3D System Design Simulator (Orthographic Isometric Projection)
 * Strictly enforces real-world queuing physics & causal architecture rules:
 *  - Packet density & velocity proportional to Incoming RPS / Node Capacity
 *  - NORMAL (Load <= 80%): Smooth packet flow, stable colors
 *  - SATURATED / OVERLOAD (Load > 100%): Packets decelerate, stack physical 3D queues, node pulses red
 *  - FAIL-FAST / REJECTING (Rate Limiter / Circuit Breaker OPEN): Excess packets bounce back red at guard node
 *  - COALESCING (Singleflight): Concurrent cache misses coalesce into 1 leader packet to DB
 */

(function (window) {
  'use strict';

  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = Math.sin(Math.PI / 6);

  const SCENARIOS = {
    flash_sale: {
      id: 'flash_sale',
      title: '01. Flash Sale & Inventory Lock',
      subtitle: '20.000 stok tiket diperebutkan lonjakan trafik ekstrem tanpa overselling',
      slaTargetP99Ms: 150,
      defaultRps: 3600,
      maxRps: 12000,
      actionLabel: '⚡ Spike 10.000 RPS',
      unhandled: {
        desc: 'Tanpa proteksi: seluruh trafik menembus App Servers dan mengantre di Primary DB (Row Lock kapasitas 800 RPS).',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.5, 0, 0], capacity: 25000, role: 'traffic_source', baseLatency: 5 },
          { id: 'app', label: 'App Servers', pos: [-0.5, 0, 0], capacity: 6000, role: 'stateless_compute', baseLatency: 18 },
          { id: 'db', label: 'Primary DB (Row Lock)', pos: [4.8, 0, 0], capacity: 800, role: 'acid_storage', baseLatency: 45 }
        ],
        edges: [
          { from: 'client', to: 'app' },
          { from: 'app', to: 'db' }
        ]
      },
      handled: {
        desc: 'Dengan arsitektur terukur: Waiting Room/Rate Limit memantulkan kelebihan beban (429), Redis Lua mengunci stok atomik (15k RPS), dan Kafka meratakan tulis ke DB.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-6.8, 0, 0], capacity: 25000, role: 'traffic_source', baseLatency: 5 },
          { id: 'gate', label: 'Waiting Room + Rate Limit', pos: [-2.8, 0, 0], capacity: 4500, role: 'rate_limiter', baseLatency: 8 },
          { id: 'redis', label: 'Redis (Lua Atomic)', pos: [1.2, 0, -2.2], capacity: 15000, role: 'memory_lock', baseLatency: 3 },
          { id: 'kafka', label: 'Kafka Load Leveler', pos: [1.2, 0, 2.2], capacity: 12000, role: 'load_leveler', baseLatency: 12, maxDrainRate: 1250 },
          { id: 'db', label: 'Primary DB (ACID)', pos: [5.5, 0, 0], capacity: 1500, role: 'acid_storage', baseLatency: 25 }
        ],
        edges: [
          { from: 'client', to: 'gate' },
          { from: 'gate', to: 'redis' },
          { from: 'redis', to: 'kafka' },
          { from: 'kafka', to: 'db' }
        ]
      }
    },

    cache_stampede: {
      id: 'cache_stampede',
      title: '02. Cache Stampede (Thundering Herd)',
      subtitle: 'Kunci Redis populer kedaluwarsa saat 10.000+ user meminta data bersamaan',
      slaTargetP99Ms: 120,
      defaultRps: 4200,
      maxRps: 10000,
      actionLabel: '💥 Expire Hot Cache Key',
      unhandled: {
        desc: 'Tanpa Singleflight: saat key Redis expired, ribuan request cache-miss menghantam Primary DB serentak dan melumpuhkan connection pool.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.6, 0, 0], capacity: 15000, role: 'traffic_source', baseLatency: 5 },
          { id: 'app', label: 'App Cluster', pos: [-1.2, 0, 0], capacity: 8000, role: 'stateless_compute', baseLatency: 12 },
          { id: 'redis', label: 'Redis (TTL Expired)', pos: [2.5, 0, -2.2], capacity: 15000, role: 'memory_lock', baseLatency: 2 },
          { id: 'db', label: 'Primary DB', pos: [4.8, 0, 1.8], capacity: 900, role: 'acid_storage', baseLatency: 55 }
        ],
        edges: [
          { from: 'client', to: 'app' },
          { from: 'app', to: 'redis', mode: 'miss_check' },
          { from: 'app', to: 'db', mode: 'stampede_bypass' }
        ]
      },
      handled: {
        desc: 'Singleflight Coalescing + TTL Jitter: ribuan cache-miss ditahan di memori App dan digabung menjadi hanya 1 Leader Packet menuju Primary DB.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.6, 0, 0], capacity: 15000, role: 'traffic_source', baseLatency: 5 },
          { id: 'app', label: 'App + Singleflight', pos: [-1.2, 0, 0], capacity: 8000, role: 'coalescer', baseLatency: 14 },
          { id: 'redis', label: 'Redis (TTL Jitter)', pos: [2.5, 0, -2.2], capacity: 15000, role: 'memory_lock', baseLatency: 2 },
          { id: 'db', label: 'Primary DB (1 Leader)', pos: [4.8, 0, 1.8], capacity: 900, role: 'acid_storage', baseLatency: 40 }
        ],
        edges: [
          { from: 'client', to: 'app' },
          { from: 'app', to: 'redis', mode: 'miss_check' },
          { from: 'app', to: 'db', mode: 'coalesced_leader' }
        ]
      }
    },

    circuit_breaker: {
      id: 'circuit_breaker',
      title: '03. Circuit Breaker & Bulkhead',
      subtitle: 'Mencegah kegagalan berantai saat API Pajak eksternal melambat menjadi 28 detik',
      slaTargetP99Ms: 250,
      defaultRps: 3000,
      maxRps: 8000,
      actionLabel: '🔥 Toggle Degradasi Tax API',
      unhandled: {
        desc: 'Tanpa Bulkhead & Circuit Breaker (Timeout 30s): perlambatan Tax API menyandera seluruh thread Checkout hingga fitur inti ikut lumpuh.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.5, 0, 0], capacity: 10000, role: 'traffic_source', baseLatency: 5 },
          { id: 'checkout', label: 'Checkout (Shared Pool)', pos: [-0.4, 0, 0], capacity: 5000, role: 'stateless_compute', baseLatency: 20, sharedDependency: 'tax' },
          { id: 'tax', label: 'External Tax API', pos: [4.8, 0, 0], capacity: 4500, degradedCapacity: 260, role: 'external_api', baseLatency: 35 }
        ],
        edges: [
          { from: 'client', to: 'checkout' },
          { from: 'checkout', to: 'tax' }
        ]
      },
      handled: {
        desc: 'Bulkhead + Timeout 2s + Circuit Breaker: saat Tax API rusak, Breaker terbuka (<1ms fail-fast) dan mengalirkan trafik ke Fallback Tax Estimator agar Checkout tetap hidup.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-6.4, 0, 0], capacity: 10000, role: 'traffic_source', baseLatency: 5 },
          { id: 'checkout', label: 'Checkout + Bulkhead', pos: [-2.0, 0, 0], capacity: 5500, role: 'stateless_compute', baseLatency: 16 },
          { id: 'breaker', label: 'Circuit Breaker (2s)', pos: [1.8, 0, -1.8], capacity: 5000, role: 'circuit_breaker', baseLatency: 4 },
          { id: 'tax', label: 'External Tax API', pos: [5.6, 0, -2.2], capacity: 4500, degradedCapacity: 260, role: 'external_api', baseLatency: 35 },
          { id: 'fallback', label: 'Fallback Estimator', pos: [3.6, 0, 2.5], capacity: 8000, role: 'fallback_service', baseLatency: 12 }
        ],
        edges: [
          { from: 'client', to: 'checkout' },
          { from: 'checkout', to: 'breaker' },
          { from: 'breaker', to: 'tax', mode: 'primary_dep' },
          { from: 'breaker', to: 'fallback', mode: 'fallback_path' }
        ]
      }
    },

    dual_write_outbox: {
      id: 'dual_write_outbox',
      title: '04. Dual-Write vs Transactional Outbox CDC',
      subtitle: 'Menjamin order PostgreSQL & event Kafka 100% sinkron meski jaringan terganggu',
      slaTargetP99Ms: 180,
      defaultRps: 2400,
      maxRps: 6000,
      actionLabel: '🌐 Simulasi Glitch Jaringan',
      unhandled: {
        desc: 'Naive Dual-Write: COMMIT DB lalu panggil Kafka terpisah. Glitch jaringan membuat pesanan tersimpan di DB tetapi event Kafka hilang (Phantom Loss).',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.6, 0, 0], capacity: 8000, role: 'traffic_source', baseLatency: 5 },
          { id: 'api', label: 'Order Service', pos: [-1.4, 0, 0], capacity: 4500, role: 'stateless_compute', baseLatency: 16 },
          { id: 'db', label: 'PostgreSQL', pos: [4.2, 0, -2.2], capacity: 3500, role: 'acid_storage', baseLatency: 25 },
          { id: 'kafka', label: 'Kafka (Direct Call)', pos: [4.2, 0, 2.2], capacity: 8000, role: 'load_leveler', baseLatency: 14, networkLossy: true }
        ],
        edges: [
          { from: 'client', to: 'api' },
          { from: 'api', to: 'db' },
          { from: 'api', to: 'kafka', mode: 'lossy_dual_write' }
        ]
      },
      handled: {
        desc: 'Transactional Outbox + Debezium CDC: Order & Outbox ditulis dalam 1 ACID DB, lalu CDC membaca WAL & menjamin pengiriman At-Least-Once ke Kafka tanpa hilang.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-6.4, 0, 0], capacity: 8000, role: 'traffic_source', baseLatency: 5 },
          { id: 'api', label: 'Order Service', pos: [-2.6, 0, 0], capacity: 4500, role: 'stateless_compute', baseLatency: 14 },
          { id: 'db', label: 'PG + Outbox (1 ACID)', pos: [1.2, 0, -1.8], capacity: 3500, role: 'acid_storage', baseLatency: 26 },
          { id: 'cdc', label: 'Debezium CDC (WAL)', pos: [1.6, 0, 2.0], capacity: 5000, role: 'coalescer', baseLatency: 15 },
          { id: 'kafka', label: 'Kafka + Idempotent', pos: [5.4, 0, 0], capacity: 8000, role: 'load_leveler', baseLatency: 12 }
        ],
        edges: [
          { from: 'client', to: 'api' },
          { from: 'api', to: 'db' },
          { from: 'db', to: 'cdc' },
          { from: 'cdc', to: 'kafka' }
        ]
      }
    }
  };

  class Iso3DSimulator {
    constructor(mountEl, initialScenario = 'flash_sale') {
      this.mountEl = mountEl;
      this.scenarioId = SCENARIOS[initialScenario] ? initialScenario : 'flash_sale';
      this.archMode = 'unhandled'; // 'unhandled' | 'handled'
      this.incomingRps = SCENARIOS[this.scenarioId].defaultRps;
      this.running = true;

      // Dynamic fault states
      this.cacheExpiredTimer = 0; // >0 means cache miss storm active
      this.taxDegraded = true;    // starts degraded in circuit breaker demo or toggleable
      this.networkGlitch = true;  // transient packet loss active in dual-write demo
      this.breakerState = 'CLOSED'; // CLOSED | OPEN | HALF_OPEN
      this.breakerTimer = 0;
      this.coalesceHoldTimer = 0;
      this.leaderSent = false;

      // Queues & Live Node Metrics
      this.nodeStates = new Map();
      this.packets = [];
      this.spawnAccumulator = 0;
      this.lostEventsCount = 0;
      this.rejectedCount = 0;
      this.processedCount = 0;
      this.hoveredNodeId = null;

      this.rafId = null;
      this.lastTime = performance.now();

      this.renderShell();
      this.resetSimulationState();
      this.bindEvents();
      this.handleResize();
      this.startLoop();
    }

    getCurrentScenario() {
      return SCENARIOS[this.scenarioId];
    }

    getCurrentTopology() {
      return this.getCurrentScenario()[this.archMode];
    }

    renderShell() {
      const scenario = this.getCurrentScenario();

      const scenarioButtons = Object.values(SCENARIOS).map(sc => `
        <button class="sim-scenario-btn ${sc.id === this.scenarioId ? 'active' : ''}" data-sim-scenario="${sc.id}">
          ${sc.title}
        </button>
      `).join('');

      this.mountEl.innerHTML = `
        <div class="sim-studio-card">
          <div class="sim-studio-head">
            <div>
              <div class="sim-eyebrow">
                <span class="sim-live-dot"></span>
                INTERACTIVE CAUSAL 3D SYSTEM TOPOLOGY LAB
              </div>
              <h3 class="sim-title" id="simTitle">${scenario.title}</h3>
              <p class="sim-subtitle" id="simSubtitle">${scenario.subtitle}</p>
            </div>
            <div class="sim-arch-toggle" role="group" aria-label="Pilih Arsitektur">
              <button class="sim-arch-btn ${this.archMode === 'unhandled' ? 'active bad' : ''}" data-sim-arch="unhandled">
                ⚠ Unhandled (Naive)
              </button>
              <button class="sim-arch-btn ${this.archMode === 'handled' ? 'active good' : ''}" data-sim-arch="handled">
                ✓ Handled (Production)
              </button>
            </div>
          </div>

          <div class="sim-scenario-tabs">
            ${scenarioButtons}
          </div>

          <div class="sim-desc-banner" id="simDescBanner">
            ${this.getCurrentTopology().desc}
          </div>

          <!-- Controls & Causal Parameters -->
          <div class="sim-controls-row">
            <div class="sim-slider-group">
              <div class="sim-slider-label">
                <span>Incoming Traffic Load:</span>
                <strong id="simRpsDisplay">${this.incomingRps.toLocaleString('id-ID')} RPS</strong>
              </div>
              <input type="range" id="simRpsSlider" min="400" max="${scenario.maxRps}" step="200" value="${this.incomingRps}">
            </div>
            <div class="sim-action-btns">
              <button class="btn btn-primary btn-sm" id="simTriggerActionBtn">${scenario.actionLabel}</button>
              <button class="btn btn-outline btn-sm" id="simPlayPauseBtn">⏸ Pause</button>
            </div>
          </div>

          <!-- Isometric 3D Canvas Viewport -->
          <div class="sim-canvas-wrap" id="simCanvasWrap">
            <canvas id="simIsoCanvas"></canvas>
            <div class="sim-node-inspector" id="simInspector" hidden></div>
          </div>

          <!-- Live Queuing Telemetry HUD -->
          <div class="sim-telemetry-grid">
            <div class="sim-metric-box">
              <span class="sim-metric-label">Status Kausal</span>
              <strong class="sim-metric-val" id="simMetricStatus">NORMAL</strong>
            </div>
            <div class="sim-metric-box">
              <span class="sim-metric-label">Throughput Efektif</span>
              <strong class="sim-metric-val" id="simMetricThroughput">0 RPS</strong>
            </div>
            <div class="sim-metric-box">
              <span class="sim-metric-label">Est. Latensi P99 (SLA &le; ${scenario.slaTargetP99Ms}ms)</span>
              <strong class="sim-metric-val" id="simMetricP99">0 ms</strong>
            </div>
            <div class="sim-metric-box">
              <span class="sim-metric-label" id="simMetricFourthLabel">Ditolak / Antrean</span>
              <strong class="sim-metric-val" id="simMetricFourthVal">0</strong>
            </div>
          </div>

          <!-- Visual Causality Legend -->
          <div class="sim-legend-bar">
            <span class="sim-legend-item"><i style="background:#38bdf8;"></i> Normal (Load &le; 80%)</span>
            <span class="sim-legend-item"><i style="background:#f59e0b;"></i> Warning / Coalescing</span>
            <span class="sim-legend-item"><i style="background:#ef4444;"></i> Fail-Fast Reject / Overload &gt; 100%</span>
            <span class="sim-legend-item"><i style="background:#10b981;"></i> Fallback / Terlindungi</span>
          </div>
        </div>
      `;

      this.canvas = this.mountEl.querySelector('#simIsoCanvas');
      this.ctx = this.canvas.getContext('2d');
    }

    resetSimulationState() {
      const topology = this.getCurrentTopology();
      this.nodeStates.clear();
      topology.nodes.forEach(node => {
        this.nodeStates.set(node.id, {
          node,
          incomingRps: 0,
          effectiveCap: node.capacity,
          loadRatio: 0,
          queueDepth: 0,
          status: 'NORMAL',
          pulsePhase: 0,
          screenPos: { x: 0, y: 0 }
        });
      });

      this.packets = [];
      this.lostEventsCount = 0;
      this.rejectedCount = 0;
      this.processedCount = 0;
      this.breakerState = 'CLOSED';
      this.breakerTimer = 0;

      // Default scenario fault triggers so user immediately sees real distinction!
      this.cacheExpiredTimer = this.scenarioId === 'cache_stampede' ? 4.5 : 0;
      this.taxDegraded = true;
      this.networkGlitch = true;
      this.coalesceHoldTimer = 0;
      this.leaderSent = false;
    }

    bindEvents() {
      this.mountEl.addEventListener('click', e => {
        const scBtn = e.target.closest('[data-sim-scenario]');
        if (scBtn) {
          this.scenarioId = scBtn.dataset.simScenario;
          const sc = this.getCurrentScenario();
          this.incomingRps = sc.defaultRps;
          this.renderShell();
          this.resetSimulationState();
          this.handleResize();
          return;
        }

        const archBtn = e.target.closest('[data-sim-arch]');
        if (archBtn) {
          this.archMode = archBtn.dataset.simArch;
          this.updateHeaderControls();
          this.resetSimulationState();
          return;
        }

        if (e.target.id === 'simPlayPauseBtn') {
          this.running = !this.running;
          e.target.textContent = this.running ? '⏸ Pause' : '▶ Resume';
          return;
        }

        if (e.target.id === 'simTriggerActionBtn') {
          this.triggerScenarioAction();
        }
      });

      this.mountEl.addEventListener('input', e => {
        if (e.target.id === 'simRpsSlider') {
          this.incomingRps = Number(e.target.value);
          const disp = this.mountEl.querySelector('#simRpsDisplay');
          if (disp) disp.textContent = `${this.incomingRps.toLocaleString('id-ID')} RPS`;
        }
      });

      this.mountEl.addEventListener('mousemove', e => {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        let closest = null;
        let minDist = 42;
        for (const [id, st] of this.nodeStates.entries()) {
          const dx = mx - st.screenPos.x;
          const dy = my - (st.screenPos.y - 16);
          const d = Math.hypot(dx, dy);
          if (d < minDist) {
            minDist = d;
            closest = id;
          }
        }
        this.hoveredNodeId = closest;
        this.updateInspector();
      });

      this.mountEl.addEventListener('mouseleave', () => {
        this.hoveredNodeId = null;
        this.updateInspector();
      });

      this._resizeHandler = () => this.handleResize();
      window.addEventListener('resize', this._resizeHandler);
    }

    updateHeaderControls() {
      const scenario = this.getCurrentScenario();
      const topo = this.getCurrentTopology();

      this.mountEl.querySelectorAll('.sim-arch-btn').forEach(btn => {
        const isAct = btn.dataset.simArch === this.archMode;
        btn.className = `sim-arch-btn ${isAct ? (this.archMode === 'unhandled' ? 'active bad' : 'active good') : ''}`;
      });

      const banner = this.mountEl.querySelector('#simDescBanner');
      if (banner) banner.textContent = topo.desc;

      const label4 = this.mountEl.querySelector('#simMetricFourthLabel');
      if (label4) {
        label4.textContent = this.scenarioId === 'dual_write_outbox'
          ? 'Event Hilang (Drift)'
          : (this.scenarioId === 'circuit_breaker' ? 'Breaker State / Fallback' : 'Fail-Fast / Antrean DB');
      }
      const p99El = this.mountEl.querySelector('#simMetricP99');
      if (p99El && p99El.previousElementSibling) {
        p99El.previousElementSibling.textContent = `Est. Latensi P99 (SLA ≤ ${scenario.slaTargetP99Ms}ms)`;
      }
    }

    triggerScenarioAction() {
      if (this.scenarioId === 'flash_sale') {
        this.incomingRps = 10000;
        const slider = this.mountEl.querySelector('#simRpsSlider');
        const disp = this.mountEl.querySelector('#simRpsDisplay');
        if (slider) slider.value = 10000;
        if (disp) disp.textContent = '10.000 RPS';
      } else if (this.scenarioId === 'cache_stampede') {
        this.cacheExpiredTimer = 5.0; // trigger 5s miss storm
        this.coalesceHoldTimer = 0.65;
        this.leaderSent = false;
      } else if (this.scenarioId === 'circuit_breaker') {
        this.taxDegraded = !this.taxDegraded;
        if (!this.taxDegraded) {
          this.breakerState = 'HALF_OPEN';
          this.breakerTimer = 1.5;
        }
      } else if (this.scenarioId === 'dual_write_outbox') {
        this.networkGlitch = !this.networkGlitch;
      }
    }

    handleResize() {
      const wrap = this.mountEl.querySelector('#simCanvasWrap');
      if (!wrap || !this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = wrap.clientWidth || 600;
      const height = Math.max(300, Math.min(440, Math.round(width * 0.56)));

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.viewW = width;
      this.viewH = height;
    }

    // --- Real Causal Queuing Physics Update ---
    stepPhysics(dt) {
      const topo = this.getCurrentTopology();
      const rps = this.incomingRps;

      // Update scenario timers
      if (this.scenarioId === 'cache_stampede') {
        if (this.cacheExpiredTimer > 0) {
          this.cacheExpiredTimer = Math.max(0, this.cacheExpiredTimer - dt);
        } else if (Math.random() < dt * 0.14) {
          // Periodic natural TTL expiry so animation demonstrates real stampede/coalescing continuously
          this.cacheExpiredTimer = 4.0;
          this.coalesceHoldTimer = 0.65;
          this.leaderSent = false;
        }
      }

      if (this.scenarioId === 'circuit_breaker') {
        if (this.archMode === 'handled') {
          if (this.taxDegraded) {
            this.breakerTimer += dt;
            if (this.breakerState === 'CLOSED' && this.breakerTimer > 1.2) {
              this.breakerState = 'OPEN';
              this.breakerTimer = 0;
            } else if (this.breakerState === 'OPEN' && this.breakerTimer > 3.5) {
              this.breakerState = 'HALF_OPEN';
              this.breakerTimer = 0;
            } else if (this.breakerState === 'HALF_OPEN' && this.breakerTimer > 0.9) {
              this.breakerState = 'OPEN';
              this.breakerTimer = 0;
            }
          } else {
            this.breakerState = 'CLOSED';
            this.breakerTimer = 0;
          }
        }
      }

      // Compute causal incoming RPS & capacity per node
      let dbQueueTotal = 0;
      let rejectedRps = 0;
      let throughputRps = rps;
      let estP99 = 0;
      let globalStatus = 'NORMAL';

      // Node-by-node causal flow
      if (this.scenarioId === 'flash_sale') {
        if (this.archMode === 'unhandled') {
          this.updateNodeLoad('client', rps, dt);
          this.updateNodeLoad('app', rps, dt);
          const dbState = this.updateNodeLoad('db', rps, dt);
          dbQueueTotal = dbState.queueDepth;
          throughputRps = Math.min(rps, dbState.effectiveCap);
          estP99 = 65 + (dbState.loadRatio > 0.8 ? Math.pow(dbState.loadRatio, 2.6) * 420 : 20) + dbState.queueDepth * 35;
          if (dbState.loadRatio > 1.0) globalStatus = 'SATURATED / OVERLOAD';
          else if (dbState.loadRatio > 0.8) globalStatus = 'HIGH LOAD';
        } else {
          this.updateNodeLoad('client', rps, dt);
          const gateState = this.updateNodeLoad('gate', rps, dt);
          const admittedRps = Math.min(rps, gateState.effectiveCap);
          rejectedRps = Math.max(0, rps - gateState.effectiveCap);

          this.updateNodeLoad('redis', admittedRps, dt);
          const kafkaState = this.updateNodeLoad('kafka', admittedRps, dt);
          // Kafka levels writes down below DB IOPS capacity (1,250 <= 1,500)
          const leveledToDb = Math.min(admittedRps, kafkaState.node.maxDrainRate || 1250);
          const dbState = this.updateNodeLoad('db', leveledToDb, dt);

          dbQueueTotal = dbState.queueDepth;
          throughputRps = admittedRps;
          estP99 = 28 + gateState.loadRatio * 45 + (rejectedRps > 0 ? 18 : 0);
          globalStatus = rejectedRps > 0 ? 'FAIL-FAST ACTIVE' : 'NORMAL';
        }
      } else if (this.scenarioId === 'cache_stampede') {
        const isExpired = this.cacheExpiredTimer > 0;
        this.updateNodeLoad('client', rps, dt);
        this.updateNodeLoad('app', rps, dt);

        if (this.archMode === 'unhandled') {
          this.updateNodeLoad('redis', isExpired ? rps * 0.1 : rps, dt);
          const dbIncoming = isExpired ? rps : rps * 0.03;
          const dbState = this.updateNodeLoad('db', dbIncoming, dt);
          dbQueueTotal = dbState.queueDepth;
          throughputRps = isExpired ? Math.min(rps, dbState.effectiveCap) : rps;
          estP99 = isExpired ? 120 + Math.pow(Math.max(1, dbState.loadRatio), 2.5) * 650 + dbState.queueDepth * 40 : 24;
          if (dbState.loadRatio > 1.0) globalStatus = 'SATURATED / OVERLOAD';
        } else {
          this.updateNodeLoad('redis', isExpired ? rps * 0.1 : rps, dt);
          // Singleflight coalesces all misses into 1 leader packet!
          const dbIncoming = isExpired ? 40 : rps * 0.02;
          const dbState = this.updateNodeLoad('db', dbIncoming, dt);
          const appState = this.nodeStates.get('app');
          if (appState) appState.status = isExpired ? 'COALESCING' : 'NORMAL';
          dbQueueTotal = dbState.queueDepth;
          throughputRps = rps;
          estP99 = isExpired ? 52 : 22;
          globalStatus = isExpired ? 'COALESCING (Singleflight)' : 'NORMAL';
        }
      } else if (this.scenarioId === 'circuit_breaker') {
        this.updateNodeLoad('client', rps, dt);
        const taxCap = this.taxDegraded ? 260 : 4500;

        if (this.archMode === 'unhandled') {
          const taxState = this.updateNodeLoad('tax', rps, dt, taxCap);
          // Cascading thread exhaustion! Checkout effective capacity drops proportionally to Tax degradation
          const checkoutCap = this.taxDegraded ? Math.max(300, 5000 * (taxCap / rps)) : 5000;
          const coState = this.updateNodeLoad('checkout', rps, dt, checkoutCap);
          dbQueueTotal = coState.queueDepth + taxState.queueDepth;
          throughputRps = Math.min(rps, taxCap);
          estP99 = this.taxDegraded ? 4800 + coState.queueDepth * 90 : 65;
          globalStatus = this.taxDegraded ? 'CASCADING OVERLOAD' : 'NORMAL';
        } else {
          const coState = this.updateNodeLoad('checkout', rps, dt);
          const brState = this.updateNodeLoad('breaker', rps, dt);
          if (brState) brState.status = this.breakerState === 'OPEN' ? 'FAIL-FAST' : 'NORMAL';

          const toTax = this.breakerState === 'OPEN' ? 0 : (this.breakerState === 'HALF_OPEN' ? 120 : rps);
          const toFallback = this.breakerState === 'OPEN' ? rps : (this.breakerState === 'HALF_OPEN' ? rps - 120 : 0);
          this.updateNodeLoad('tax', toTax, dt, taxCap);
          this.updateNodeLoad('fallback', toFallback, dt);

          throughputRps = rps;
          estP99 = this.breakerState === 'OPEN' ? 42 : 75;
          globalStatus = this.breakerState === 'OPEN' ? 'BREAKER OPEN (FALLBACK)' : (this.breakerState === 'HALF_OPEN' ? 'HALF-OPEN PROBE' : 'NORMAL');
        }
      } else if (this.scenarioId === 'dual_write_outbox') {
        this.updateNodeLoad('client', rps, dt);
        this.updateNodeLoad('api', rps, dt);
        this.updateNodeLoad('db', rps, dt);

        if (this.archMode === 'unhandled') {
          const lossRate = this.networkGlitch ? 0.18 : 0.0;
          this.updateNodeLoad('kafka', rps * (1 - lossRate), dt);
          if (this.networkGlitch) {
            this.lostEventsCount += rps * lossRate * dt;
          }
          throughputRps = rps * (1 - lossRate);
          estP99 = 68;
          globalStatus = this.networkGlitch ? 'DATA DRIFT (LOSSY)' : 'NORMAL';
        } else {
          this.updateNodeLoad('cdc', rps, dt);
          this.updateNodeLoad('kafka', rps, dt);
          throughputRps = rps;
          estP99 = 84;
          globalStatus = 'ACID SYNCED (0 LOSS)';
        }
      }

      // Packet Spawning proportional to RPS
      const visualSpawnRate = Math.min(48, Math.max(4, (rps / 220)));
      this.spawnAccumulator += visualSpawnRate * dt;
      while (this.spawnAccumulator >= 1) {
        this.spawnAccumulator -= 1;
        this.spawnPacket(topo);
      }

      // Update moving packets
      this.updatePackets(dt, topo);

      // Update Telemetry HUD
      this.updateTelemetryHUD(globalStatus, throughputRps, estP99, dbQueueTotal, rejectedRps);
    }

    updateNodeLoad(nodeId, incomingRps, dt, overrideCapacity = null) {
      const st = this.nodeStates.get(nodeId);
      if (!st) return { loadRatio: 0, queueDepth: 0, effectiveCap: 1000 };
      const cap = overrideCapacity !== null ? overrideCapacity : st.node.capacity;
      st.effectiveCap = cap;
      st.incomingRps = incomingRps;
      st.loadRatio = cap > 0 ? incomingRps / cap : 0;

      if (st.loadRatio > 1.0) {
        const excess = Math.min(30, (st.loadRatio - 1.0) * 6);
        st.queueDepth = Math.min(18, st.queueDepth + excess * dt);
        st.status = 'OVERLOAD';
        st.pulsePhase += dt * 7;
      } else {
        st.queueDepth = Math.max(0, st.queueDepth - 4.5 * dt);
        st.status = st.loadRatio > 0.8 ? 'WARNING' : 'NORMAL';
        st.pulsePhase = 0;
      }

      if (st.node.role === 'rate_limiter' && st.loadRatio > 1.0) {
        st.status = 'FAIL-FAST';
        st.queueDepth = 0; // Rate limiter rejects immediately, does not build internal queue!
      }
      return st;
    }

    spawnPacket(topo) {
      const startNode = topo.nodes[0];
      if (!startNode) return;
      this.packets.push({
        fromId: startNode.id,
        toId: topo.edges[0]?.to,
        t: 0,
        color: '#38bdf8',
        rejected: false,
        coalesced: false,
        lost: false,
        size: 4.5
      });
    }

    updatePackets(dt, topo) {
      const nextPackets = [];

      for (const p of this.packets) {
        const targetState = this.nodeStates.get(p.toId);
        // Causal velocity: slows down dramatically if target node is overloaded!
        let speed = 1.35;
        if (targetState && !p.rejected) {
          if (targetState.loadRatio > 1.0 && targetState.node.role !== 'rate_limiter') {
            speed = Math.max(0.28, 1.2 / targetState.loadRatio);
          } else if (targetState.loadRatio > 0.75) {
            speed = 1.05;
          }
        }
        if (p.rejected) speed = 1.9;

        p.t += speed * dt;

        // Mid-flight loss for Dual-Write glitch
        if (p.lost && p.t >= 0.55) {
          continue; // drops mid-flight!
        }

        if (p.t >= 1.0) {
          if (p.rejected) {
            continue; // bounced back off screen
          }

          // Determine next hop based on topology & causal rules
          const currentId = p.toId;
          const st = this.nodeStates.get(currentId);

          // 1. Rate Limiter Fail-Fast Bounce
          if (st && st.node.role === 'rate_limiter' && st.loadRatio > 1.0) {
            const rejectChance = (st.incomingRps - st.effectiveCap) / st.incomingRps;
            if (Math.random() < rejectChance) {
              p.rejected = true;
              p.color = '#ef4444';
              const prev = p.fromId;
              p.fromId = currentId;
              p.toId = prev;
              p.t = 0;
              nextPackets.push(p);
              continue;
            }
          }

          // 2. Cache Stampede Logic
          if (this.scenarioId === 'cache_stampede' && currentId === 'app') {
            const isExpired = this.cacheExpiredTimer > 0;
            if (!isExpired) {
              // Normal cache hit goes to Redis and finishes
              p.fromId = 'app';
              p.toId = 'redis';
              p.t = 0;
              p.color = '#38bdf8';
              nextPackets.push(p);
              continue;
            } else {
              if (this.archMode === 'unhandled') {
                // Stampede straight to DB!
                p.fromId = 'app';
                p.toId = 'db';
                p.t = 0;
                p.color = '#f97316';
                nextPackets.push(p);
                continue;
              } else {
                // Coalescing (Singleflight): absorb 95% of packets at App, emit 1 glowing Leader Packet
                if (Math.random() < 0.05) {
                  p.fromId = 'app';
                  p.toId = 'db';
                  p.t = 0;
                  p.color = '#facc15';
                  p.size = 7.5;
                  p.coalesced = true;
                  nextPackets.push(p);
                }
                continue;
              }
            }
          }

          // 3. Circuit Breaker Routing
          if (this.scenarioId === 'circuit_breaker' && currentId === 'breaker') {
            if (this.breakerState === 'OPEN') {
              p.fromId = 'breaker';
              p.toId = 'fallback';
              p.t = 0;
              p.color = '#10b981';
              nextPackets.push(p);
              continue;
            } else if (this.breakerState === 'HALF_OPEN' && Math.random() > 0.1) {
              p.fromId = 'breaker';
              p.toId = 'fallback';
              p.t = 0;
              p.color = '#10b981';
              nextPackets.push(p);
              continue;
            } else {
              p.fromId = 'breaker';
              p.toId = 'tax';
              p.t = 0;
              p.color = this.taxDegraded ? '#ef4444' : '#38bdf8';
              nextPackets.push(p);
              continue;
            }
          }

          // 4. Dual-Write Split
          if (this.scenarioId === 'dual_write_outbox' && this.archMode === 'unhandled' && currentId === 'api') {
            // Send to DB
            nextPackets.push({ fromId: 'api', toId: 'db', t: 0, color: '#38bdf8', size: 4.2 });
            // Send to Kafka (may drop!)
            const isDropped = this.networkGlitch && Math.random() < 0.25;
            nextPackets.push({
              fromId: 'api',
              toId: 'kafka',
              t: 0,
              color: isDropped ? '#ef4444' : '#a855f7',
              lost: isDropped,
              size: 4.2
            });
            continue;
          }

          // Default sequential forward edge
          const outEdge = topo.edges.find(e => e.from === currentId);
          if (outEdge) {
            p.fromId = currentId;
            p.toId = outEdge.to;
            p.t = 0;
            // Color hint if heading into overloaded node
            const nextSt = this.nodeStates.get(outEdge.to);
            if (nextSt && nextSt.loadRatio > 1.0 && nextSt.node.role !== 'rate_limiter') {
              p.color = '#f97316';
            }
            nextPackets.push(p);
          }
        } else {
          nextPackets.push(p);
        }
      }

      // Cap max visual particles for 60fps mobile smoothness
      this.packets = nextPackets.slice(-140);
    }

    updateTelemetryHUD(status, throughput, p99, dbQueue, rejectedRps) {
      const stEl = this.mountEl.querySelector('#simMetricStatus');
      const tpEl = this.mountEl.querySelector('#simMetricThroughput');
      const p99El = this.mountEl.querySelector('#simMetricP99');
      const f4El = this.mountEl.querySelector('#simMetricFourthVal');

      if (stEl) {
        stEl.textContent = status;
        stEl.className = 'sim-metric-val ' + (
          status.includes('OVERLOAD') || status.includes('DRIFT') ? 'bad' :
          status.includes('FAIL-FAST') || status.includes('COALESCING') || status.includes('OPEN') ? 'warn' : 'good'
        );
      }
      if (tpEl) tpEl.textContent = `${Math.round(throughput).toLocaleString('id-ID')} RPS`;
      if (p99El) {
        const sla = this.getCurrentScenario().slaTargetP99Ms;
        p99El.textContent = `${Math.round(p99).toLocaleString('id-ID')} ms`;
        p99El.className = 'sim-metric-val ' + (p99 > sla ? 'bad' : 'good');
      }
      if (f4El) {
        if (this.scenarioId === 'dual_write_outbox') {
          f4El.textContent = this.archMode === 'unhandled'
            ? `${Math.floor(this.lostEventsCount)} Event Hilang`
            : '0 Hilang (Synced)';
          f4El.className = 'sim-metric-val ' + (this.archMode === 'unhandled' && this.networkGlitch ? 'bad' : 'good');
        } else if (this.scenarioId === 'circuit_breaker') {
          f4El.textContent = this.archMode === 'handled'
            ? `${this.breakerState}`
            : `Queue: ${Math.round(dbQueue * 120)}`;
        } else {
          f4El.textContent = rejectedRps > 0
            ? `Reject: ${Math.round(rejectedRps).toLocaleString('id-ID')}/s`
            : `Antrean: ${Math.round(dbQueue * 150)}`;
        }
      }
    }

    updateInspector() {
      const box = this.mountEl.querySelector('#simInspector');
      if (!box) return;
      if (!this.hoveredNodeId) {
        box.hidden = true;
        return;
      }
      const st = this.nodeStates.get(this.hoveredNodeId);
      if (!st) return;
      box.hidden = false;
      const loadPct = Math.round(st.loadRatio * 100);
      box.innerHTML = `
        <strong>${st.node.label}</strong>
        <span>Role: ${st.node.role}</span>
        <span>Kapasitas: ${st.effectiveCap.toLocaleString('id-ID')} RPS</span>
        <span>Beban: <b style="color:${loadPct > 100 ? '#fb7185' : '#38bdf8'}">${loadPct}%</b></span>
      `;
    }

    // --- Orthographic Isometric 3D Rendering ---

    isoProject(wx, wy, wz) {
      const scale = Math.min(this.viewW / 18.5, this.viewH / 9.2);
      const cx = this.viewW * 0.5;
      const cy = this.viewH * 0.56;
      return {
        x: cx + (wx - wz) * COS30 * scale,
        y: cy + (wx + wz) * SIN30 * scale - wy * scale,
        scale
      };
    }

    drawIsoFloorGrid() {
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;

      for (let x = -8; x <= 8; x += 1.5) {
        const p1 = this.isoProject(x, 0, -5);
        const p2 = this.isoProject(x, 0, 5);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      for (let z = -5; z <= 5; z += 1.5) {
        const p1 = this.isoProject(-8, 0, z);
        const p2 = this.isoProject(8, 0, z);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawEdges(topo) {
      const ctx = this.ctx;
      for (const edge of topo.edges) {
        const nFrom = topo.nodes.find(n => n.id === edge.from);
        const nTo = topo.nodes.find(n => n.id === edge.to);
        if (!nFrom || !nTo) continue;

        const p1 = this.isoProject(nFrom.pos[0], 0.15, nFrom.pos[2]);
        const p2 = this.isoProject(nTo.pos[0], 0.15, nTo.pos[2]);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = edge.mode === 'fallback_path'
          ? 'rgba(16, 185, 129, 0.4)'
          : (edge.mode === 'lossy_dual_write' && this.networkGlitch ? 'rgba(239, 68, 68, 0.45)' : 'rgba(56, 189, 248, 0.25)');
        ctx.lineWidth = 3;
        if (edge.mode === 'fallback_path' || edge.mode === 'lossy_dual_write') {
          ctx.setLineDash([6, 5]);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    drawIsoBox(wx, wy, wz, w, h, d, colors) {
      const ctx = this.ctx;
      const hw = w / 2;
      const hd = d / 2;

      const pTop = [
        this.isoProject(wx - hw, wy + h, wz - hd),
        this.isoProject(wx + hw, wy + h, wz - hd),
        this.isoProject(wx + hw, wy + h, wz + hd),
        this.isoProject(wx - hw, wy + h, wz + hd)
      ];
      const pBot = [
        this.isoProject(wx - hw, wy, wz - hd),
        this.isoProject(wx + hw, wy, wz - hd),
        this.isoProject(wx + hw, wy, wz + hd),
        this.isoProject(wx - hw, wy, wz + hd)
      ];

      // Shadow
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.moveTo(pBot[0].x + 4, pBot[0].y + 4);
      ctx.lineTo(pBot[1].x + 4, pBot[1].y + 4);
      ctx.lineTo(pBot[2].x + 4, pBot[2].y + 4);
      ctx.lineTo(pBot[3].x + 4, pBot[3].y + 4);
      ctx.closePath();
      ctx.fill();

      // Left-front face (z + hd)
      ctx.fillStyle = colors.left;
      ctx.beginPath();
      ctx.moveTo(pTop[3].x, pTop[3].y);
      ctx.lineTo(pTop[2].x, pTop[2].y);
      ctx.lineTo(pBot[2].x, pBot[2].y);
      ctx.lineTo(pBot[3].x, pBot[3].y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Right-front face (x + hw)
      ctx.fillStyle = colors.right;
      ctx.beginPath();
      ctx.moveTo(pTop[2].x, pTop[2].y);
      ctx.lineTo(pTop[1].x, pTop[1].y);
      ctx.lineTo(pBot[1].x, pBot[1].y);
      ctx.lineTo(pBot[2].x, pBot[2].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top face
      ctx.fillStyle = colors.top;
      ctx.beginPath();
      ctx.moveTo(pTop[0].x, pTop[0].y);
      ctx.lineTo(pTop[1].x, pTop[1].y);
      ctx.lineTo(pTop[2].x, pTop[2].y);
      ctx.lineTo(pTop[3].x, pTop[3].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      return pTop[0];
    }

    drawIsoCylinder(wx, wy, wz, radius, height, colors) {
      const ctx = this.ctx;
      const centerBot = this.isoProject(wx, wy, wz);
      const centerTop = this.isoProject(wx, wy + height, wz);
      const rx = radius * centerBot.scale * 1.15;
      const ry = rx * 0.52;

      ctx.save();
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(centerBot.x + 4, centerBot.y + 4, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Side body
      const grad = ctx.createLinearGradient(centerBot.x - rx, 0, centerBot.x + rx, 0);
      grad.addColorStop(0, colors.left);
      grad.addColorStop(0.65, colors.right);
      grad.addColorStop(1, colors.left);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(centerBot.x, centerBot.y, rx, ry, 0, 0, Math.PI);
      ctx.lineTo(centerTop.x - rx, centerTop.y);
      ctx.lineTo(centerTop.x + rx, centerTop.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Platter disc ring lines
      for (const frac of [0.35, 0.68]) {
        const ring = this.isoProject(wx, wy + height * frac, wz);
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, rx, ry, 0, 0, Math.PI);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.stroke();
      }

      // Top cap ellipse
      ctx.fillStyle = colors.top;
      ctx.beginPath();
      ctx.ellipse(centerTop.x, centerTop.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.stroke();

      ctx.restore();
    }

    getNodeColors(st) {
      const role = st.node.role;
      const isOverload = st.status === 'OVERLOAD';
      const isFailFast = st.status === 'FAIL-FAST';
      const isCoalesce = st.status === 'COALESCING';

      if (isOverload) {
        const pulse = 0.5 + 0.5 * Math.sin(st.pulsePhase);
        return {
          top: pulse > 0.5 ? '#ef4444' : '#dc2626',
          left: '#991b1b',
          right: '#b91c1c',
          stroke: '#fca5a5'
        };
      }
      if (isFailFast) {
        return { top: '#f59e0b', left: '#92400e', right: '#b45309', stroke: '#fde68a' };
      }
      if (isCoalesce) {
        return { top: '#facc15', left: '#854d0e', right: '#ca8a04', stroke: '#fef08a' };
      }

      switch (role) {
        case 'traffic_source':
          return { top: '#38bdf8', left: '#0369a1', right: '#0284c7', stroke: '#bae6fd' };
        case 'rate_limiter':
        case 'circuit_breaker':
          return { top: '#8b5cf6', left: '#4c1d95', right: '#6d28d9', stroke: '#ddd6fe' };
        case 'memory_lock':
          return { top: '#ec4899', left: '#831843', right: '#be185d', stroke: '#fbcfe8' };
        case 'load_leveler':
          return { top: '#a855f7', left: '#581c87', right: '#7e22ce', stroke: '#e9d5ff' };
        case 'acid_storage':
          return { top: '#2563eb', left: '#1e3a8a', right: '#1d4ed8', stroke: '#93c5fd' };
        case 'fallback_service':
          return { top: '#10b981', left: '#064e3b', right: '#047857', stroke: '#a7f3d0' };
        case 'external_api':
          return this.taxDegraded
            ? { top: '#ef4444', left: '#7f1d1d', right: '#991b1b', stroke: '#fca5a5' }
            : { top: '#06b6d4', left: '#164e63', right: '#0e7490', stroke: '#a5f3fc' };
        default:
          return { top: '#3b82f6', left: '#1e3a8a', right: '#1d4ed8', stroke: '#bfdbfe' };
      }
    }

    drawPhysicalQueue(st) {
      const qCount = Math.floor(st.queueDepth);
      if (qCount <= 0) return;
      const [wx, , wz] = st.node.pos;
      const maxCols = 3;
      for (let i = 0; i < Math.min(qCount, 12); i++) {
        const col = i % maxCols;
        const layer = Math.floor(i / maxCols);
        const qx = wx - 1.35 - (col * 0.34);
        const qz = wz + 0.55 - (col * 0.15);
        const qy = layer * 0.32;
        this.drawIsoBox(qx, qy, qz, 0.25, 0.26, 0.25, {
          top: '#fb7185',
          left: '#9f1239',
          right: '#e11d48',
          stroke: '#fecdd3'
        });
      }
    }

    drawPackets(topo) {
      const ctx = this.ctx;
      for (const p of this.packets) {
        const nFrom = topo.nodes.find(n => n.id === p.fromId);
        const nTo = topo.nodes.find(n => n.id === p.toId);
        if (!nFrom || !nTo) continue;

        const wx = nFrom.pos[0] + (nTo.pos[0] - nFrom.pos[0]) * p.t;
        const wz = nFrom.pos[2] + (nTo.pos[2] - nFrom.pos[2]) * p.t;
        const wy = 0.45 + Math.sin(p.t * Math.PI) * 0.45;
        const sp = this.isoProject(wx, wy, wz);

        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.coalesced ? 14 : 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    drawNodeLabel(st, topProj) {
      const ctx = this.ctx;
      const loadPct = Math.round(st.loadRatio * 100);
      const badgeColor = st.status === 'OVERLOAD' ? '#ef4444' : (st.status === 'FAIL-FAST' || st.status === 'COALESCING' ? '#f59e0b' : '#0ea5e9');

      ctx.save();
      ctx.font = '700 10.5px Montserrat, sans-serif';
      const labelText = st.node.label;
      const metricsText = `${loadPct}% (${st.effectiveCap >= 1000 ? (st.effectiveCap / 1000).toFixed(1) + 'k' : st.effectiveCap})`;

      const textW = Math.max(ctx.measureText(labelText).width, ctx.measureText(metricsText).width) + 18;
      const boxX = topProj.x - textW / 2;
      const boxY = topProj.y - 44;

      // Pill container
      ctx.fillStyle = 'rgba(11, 19, 43, 0.88)';
      ctx.strokeStyle = this.hoveredNodeId === st.node.id ? '#ffffff' : badgeColor;
      ctx.lineWidth = this.hoveredNodeId === st.node.id ? 1.8 : 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, textW, 34, 6);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(labelText, topProj.x, boxY + 13);

      ctx.font = '700 9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = badgeColor;
      ctx.fillText(metricsText, topProj.x, boxY + 26);

      ctx.restore();
    }

    renderFrame() {
      const ctx = this.ctx;
      if (!ctx || !this.viewW) return;

      const topo = this.getCurrentTopology();

      // Background dark tactical isometric grid
      ctx.fillStyle = '#091124';
      ctx.fillRect(0, 0, this.viewW, this.viewH);

      this.drawIsoFloorGrid();
      this.drawEdges(topo);

      // Painter's depth sorting by (wx + wz)
      const sortedNodes = [...topo.nodes].sort((a, b) => (a.pos[0] + a.pos[2]) - (b.pos[0] + b.pos[2]));

      for (const node of sortedNodes) {
        const st = this.nodeStates.get(node.id);
        if (!st) continue;

        const [wx, , wz] = node.pos;
        const colors = this.getNodeColors(st);
        const height = node.role === 'acid_storage' ? 1.65 : (node.role === 'rate_limiter' || node.role === 'circuit_breaker' ? 1.35 : 1.15);

        // Draw physical stacked queues before/in front of node
        this.drawPhysicalQueue(st);

        if (node.role === 'acid_storage') {
          this.drawIsoCylinder(wx, 0, wz, 0.72, height, colors);
        } else {
          this.drawIsoBox(wx, 0, wz, 1.35, height, 1.35, colors);
        }

        const topProj = this.isoProject(wx, height + 0.1, wz);
        st.screenPos = topProj;
      }

      // Draw packets flying through 3D space
      this.drawPackets(topo);

      // Draw crisp floating node labels on top so text is always readable
      for (const node of sortedNodes) {
        const st = this.nodeStates.get(node.id);
        if (st) this.drawNodeLabel(st, st.screenPos);
      }
    }

    startLoop() {
      const loop = (now) => {
        const dt = Math.min(0.05, (now - this.lastTime) / 1000);
        this.lastTime = now;

        if (this.running) {
          this.stepPhysics(dt);
        }
        this.renderFrame();
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    }
  }

  window.Iso3DSimulator = Iso3DSimulator;
})(window);
