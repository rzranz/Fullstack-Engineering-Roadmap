/**
 * Causal Isometric 3D System Design Simulator (Orthographic Isometric Projection)
 * Covers ALL behind-the-scenes System Design topics (11 Interactive Scenarios):
 *  01. Flash Sale & Inventory Lock (Waiting Room + Redis Lua + Kafka)
 *  02. Cache Stampede / Thundering Herd (Singleflight Coalescing + TTL Jitter)
 *  03. Circuit Breaker & Bulkhead (Cascading Timeout vs Fail-Fast + Fallback)
 *  04. Dual-Write vs Transactional Outbox + CDC (PostgreSQL WAL -> Debezium -> Kafka)
 *  05. DNS, HTTP/1.1 HoL Blocking vs HTTP/3 QUIC + SSL Offload + mTLS
 *  06. Fleet Real-Time: Short Polling vs gRPC + HTTP/2 SSE
 *  07. NAT IP Hash Hotspot vs Stateless Redis + Least Connections
 *  08. B-Tree 6-Index Saturation vs LSM-Tree Sequential Append (85k IoT/s)
 *  09. Hotspot Shard vs Consistent Hash Sharding + Read Replicas
 *  10. GC Pause Double-Debit vs Distributed Lock + Fencing Tokens
 *  11. Blind Local Logs vs OpenTelemetry Trace-ID + Edge WAF + Canary 5%
 */

(function (window) {
  'use strict';

  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = Math.sin(Math.PI / 6);

  function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const SCENARIOS = {
    flash_sale: {
      id: 'flash_sale',
      shortTitle: '01. Flash Sale',
      title: '01. Flash Sale & Inventory Lock',
      subtitle: '20.000 stok tiket diperebutkan lonjakan trafik ekstrem tanpa overselling',
      slaTargetP99Ms: 150,
      defaultRps: 3600,
      maxRps: 12000,
      actionLabel: '⚡ Spike 10.000 RPS',
      unhandledExplain: 'Semua request menembus App Server langsung berebut baris stok di Primary DB (kapasitas 800 RPS). DB mengantre (Row Lock), paket melambat & menumpuk merah.',
      handledExplain: 'Waiting Room/Rate Limiter memantulkan kelebihan RPS (HTTP 429 Fail-Fast). Redis Lua mengunci stok atomik di RAM (15k/s), lalu Kafka meratakan penulisan ke Primary DB.',
      unhandled: {
        desc: 'Tanpa proteksi: seluruh trafik menembus App Servers dan mengantre di Primary DB (Row Lock kapasitas 800 RPS).',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.5, 0, 0], capacity: 25000, role: 'traffic_source' },
          { id: 'app', label: 'App Servers', pos: [-0.5, 0, 0], capacity: 6000, role: 'stateless_compute' },
          { id: 'db', label: 'Primary DB (Row Lock)', pos: [4.8, 0, 0], capacity: 800, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'app' },
          { from: 'app', to: 'db' }
        ]
      },
      handled: {
        desc: 'Best Practice: Waiting Room + Rate Limit (Fail-Fast 429), Redis Lua Atomic (15k/s), & Kafka Load Leveler menjaga Primary DB tetap aman.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-6.8, 0, 0], capacity: 25000, role: 'traffic_source' },
          { id: 'gate', label: 'Waiting Room + Limit', pos: [-2.8, 0, 0], capacity: 4500, role: 'rate_limiter' },
          { id: 'redis', label: 'Redis (Lua Atomic)', pos: [1.2, 0, -2.2], capacity: 15000, role: 'memory_lock' },
          { id: 'kafka', label: 'Kafka Load Leveler', pos: [1.2, 0, 2.2], capacity: 12000, role: 'load_leveler', maxDrainRate: 1250 },
          { id: 'db', label: 'Primary DB (ACID)', pos: [5.5, 0, 0], capacity: 1500, role: 'acid_storage' }
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
      shortTitle: '02. Cache Stampede',
      subtitle: 'Kunci Redis populer kedaluwarsa saat ribuan user meminta produk bersamaan',
      slaTargetP99Ms: 120,
      defaultRps: 4200,
      maxRps: 10000,
      actionLabel: '💥 Expire Hot Cache Key',
      unhandledExplain: 'Saat TTL kunci Redis habis, ribuan request cache-miss langsung menembus ke Primary DB secara serentak (Thundering Herd) hingga DB tumbang.',
      handledExplain: 'Singleflight Coalescing menahan ribuan miss di memori App, mengirim hanya 1 Leader Packet emas ke DB, lalu mengisi ulang Redis dengan TTL Jitter.',
      unhandled: {
        desc: 'Tanpa Singleflight: saat key Redis expired, ribuan request cache-miss menghantam Primary DB serentak.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.6, 0, 0], capacity: 15000, role: 'traffic_source' },
          { id: 'app', label: 'App Cluster', pos: [-1.2, 0, 0], capacity: 8000, role: 'stateless_compute' },
          { id: 'redis', label: 'Redis (TTL Expired)', pos: [2.5, 0, -2.2], capacity: 15000, role: 'memory_lock' },
          { id: 'db', label: 'Primary DB', pos: [4.8, 0, 1.8], capacity: 900, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'app' },
          { from: 'app', to: 'redis', mode: 'miss_check' },
          { from: 'app', to: 'db', mode: 'stampede_bypass' }
        ]
      },
      handled: {
        desc: 'Best Practice: Singleflight Coalescing + TTL Jitter menggabungkan ribuan miss menjadi 1 Leader Packet ke Primary DB.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.6, 0, 0], capacity: 15000, role: 'traffic_source' },
          { id: 'app', label: 'App + Singleflight', pos: [-1.2, 0, 0], capacity: 8000, role: 'coalescer' },
          { id: 'redis', label: 'Redis (TTL Jitter)', pos: [2.5, 0, -2.2], capacity: 15000, role: 'memory_lock' },
          { id: 'db', label: 'Primary DB (1 Leader)', pos: [4.8, 0, 1.8], capacity: 900, role: 'acid_storage' }
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
      shortTitle: '03. Circuit Breaker',
      subtitle: 'Mencegah kegagalan berantai saat API Pajak eksternal melambat ke 28 detik',
      slaTargetP99Ms: 250,
      defaultRps: 3000,
      maxRps: 8000,
      actionLabel: '🔥 Toggle Degradasi Tax API',
      unhandledExplain: 'Timeout 30s tanpa isolasi thread: seluruh thread pool Checkout tersandera menunggu External Tax API yang lambat hingga fitur login ikut lumpuh.',
      handledExplain: 'Bulkhead mengisolasi pool + Timeout 2s + Circuit Breaker terbuka (OPEN <1ms) mengalirkan request ke Fallback Tax Estimator hijau agar Checkout tetap sehat.',
      unhandled: {
        desc: 'Tanpa Bulkhead & Circuit Breaker: perlambatan Tax API menyandera seluruh thread pool Checkout.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.5, 0, 0], capacity: 10000, role: 'traffic_source' },
          { id: 'checkout', label: 'Checkout (Shared Pool)', pos: [-0.4, 0, 0], capacity: 5000, role: 'stateless_compute' },
          { id: 'tax', label: 'External Tax API', pos: [4.8, 0, 0], capacity: 4500, role: 'external_api' }
        ],
        edges: [
          { from: 'client', to: 'checkout' },
          { from: 'checkout', to: 'tax' }
        ]
      },
      handled: {
        desc: 'Best Practice: Bulkhead + Timeout 2s + Circuit Breaker OPEN mengalihkan trafik ke Fallback Estimator hijau.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-6.4, 0, 0], capacity: 10000, role: 'traffic_source' },
          { id: 'checkout', label: 'Checkout + Bulkhead', pos: [-2.0, 0, 0], capacity: 5500, role: 'stateless_compute' },
          { id: 'breaker', label: 'Circuit Breaker (2s)', pos: [1.8, 0, -1.8], capacity: 5000, role: 'circuit_breaker' },
          { id: 'tax', label: 'External Tax API', pos: [5.6, 0, -2.2], capacity: 4500, role: 'external_api' },
          { id: 'fallback', label: 'Fallback Estimator', pos: [3.6, 0, 2.5], capacity: 8000, role: 'fallback_service' }
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
      shortTitle: '04. Outbox CDC',
      subtitle: 'Mengatasi kehilangan event Kafka akibat Dual-Write pada layanan Order',
      slaTargetP99Ms: 180,
      defaultRps: 2400,
      maxRps: 6000,
      actionLabel: '🌐 Toggle Glitch Jaringan',
      unhandledExplain: 'Aplikasi menulis ke PostgreSQL lalu memanggil Kafka secara terpisah. Saat jaringan berkedip, paket ke Kafka rontok merah -> pesanan tersimpan tapi gudang tidak tahu!',
      handledExplain: 'Order + catatan Outbox ditulis dalam 1 transaksi ACID DB yang sama. Debezium CDC membaca WAL log lalu mengirim At-Least-Once ke Kafka (0 hilang).',
      unhandled: {
        desc: 'Naive Dual-Write: glitch jaringan menyebabkan paket event ke Kafka hilang setelah COMMIT database.',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-5.6, 0, 0], capacity: 8000, role: 'traffic_source' },
          { id: 'api', label: 'Order Service', pos: [-1.4, 0, 0], capacity: 4500, role: 'stateless_compute' },
          { id: 'db', label: 'PostgreSQL', pos: [4.2, 0, -2.2], capacity: 3500, role: 'acid_storage' },
          { id: 'kafka', label: 'Kafka (Direct Call)', pos: [4.2, 0, 2.2], capacity: 8000, role: 'load_leveler' }
        ],
        edges: [
          { from: 'client', to: 'api' },
          { from: 'api', to: 'db' },
          { from: 'api', to: 'kafka', mode: 'lossy_dual_write' }
        ]
      },
      handled: {
        desc: 'Best Practice: Transactional Outbox (1 ACID) + Debezium CDC (WAL) + Idempotent Consumer (0 Event Loss).',
        nodes: [
          { id: 'client', label: 'Clients', pos: [-6.4, 0, 0], capacity: 8000, role: 'traffic_source' },
          { id: 'api', label: 'Order Service', pos: [-2.6, 0, 0], capacity: 4500, role: 'stateless_compute' },
          { id: 'db', label: 'PG + Outbox (ACID)', pos: [1.2, 0, -1.8], capacity: 3500, role: 'acid_storage' },
          { id: 'cdc', label: 'Debezium CDC (WAL)', pos: [1.6, 0, 2.0], capacity: 5000, role: 'coalescer' },
          { id: 'kafka', label: 'Kafka + Idempotent', pos: [5.4, 0, 0], capacity: 8000, role: 'load_leveler' }
        ],
        edges: [
          { from: 'client', to: 'api' },
          { from: 'api', to: 'db' },
          { from: 'db', to: 'cdc' },
          { from: 'cdc', to: 'kafka' }
        ]
      }
    },

    network_http3: {
      id: 'network_http3',
      shortTitle: '05. HTTP/3 & TLS',
      subtitle: 'Head-of-Line Blocking & beban dekripsi TLS di App Server vs Edge QUIC & SSL Offload',
      slaTargetP99Ms: 110,
      defaultRps: 3200,
      maxRps: 8000,
      actionLabel: '📶 Simulasi Packet Loss Mobile',
      unhandledExplain: 'HTTP/1.1 + dekripsi TLS dilakukan langsung di CPU App Server: satu paket lambat menahan antrean di belakangnya (HoL Blocking) dan CPU habis mendekripsi SSL.',
      handledExplain: 'Anycast Edge + HTTP/3 QUIC (UDP 0-RTT) membebaskan koneksi dari HoL Blocking, melakukan SSL Offloading di L7 Proxy, lalu memakai mTLS aman di internal.',
      unhandled: {
        desc: 'HTTP/1.1 + TLS di App Server: mengalami Head-of-Line Blocking & kelelahan CPU dekripsi SSL.',
        nodes: [
          { id: 'client', label: 'Mobile Clients', pos: [-5.6, 0, 0], capacity: 12000, role: 'traffic_source' },
          { id: 'dns', label: 'Single Origin DNS', pos: [-1.4, 0, 0], capacity: 8000, role: 'stateless_compute' },
          { id: 'app', label: 'App (CPU TLS + HoL)', pos: [4.2, 0, 0], capacity: 1800, role: 'stateless_compute' }
        ],
        edges: [
          { from: 'client', to: 'dns' },
          { from: 'dns', to: 'app' }
        ]
      },
      handled: {
        desc: 'Best Practice: Anycast DNS + HTTP/3 QUIC (0-RTT) + SSL Offload di Edge Proxy + mTLS Zero-Trust internal.',
        nodes: [
          { id: 'client', label: 'Mobile (QUIC 0-RTT)', pos: [-6.4, 0, 0], capacity: 12000, role: 'traffic_source' },
          { id: 'edge', label: 'Anycast Edge + SSL Offload', pos: [-1.8, 0, 0], capacity: 10000, role: 'rate_limiter' },
          { id: 'app1', label: 'App Node A (mTLS)', pos: [3.8, 0, -2.0], capacity: 3500, role: 'fallback_service' },
          { id: 'app2', label: 'App Node B (mTLS)', pos: [3.8, 0, 2.0], capacity: 3500, role: 'fallback_service' }
        ],
        edges: [
          { from: 'client', to: 'edge' },
          { from: 'edge', to: 'app1' },
          { from: 'edge', to: 'app2' }
        ]
      }
    },

    realtime_fleet: {
      id: 'realtime_fleet',
      shortTitle: '06. Fleet gRPC+SSE',
      subtitle: 'Dashboard 50.000 kurir GPS + 2.000 operator: Short Polling vs gRPC & HTTP/2 SSE',
      slaTargetP99Ms: 140,
      defaultRps: 4500,
      maxRps: 10000,
      actionLabel: '🛰️ Burst GPS 8.000 RPS',
      unhandledExplain: 'Operator memakai Short Polling tiap 1 detik dan kurir mengirim JSON besar berulang: Load Balancer & server penuh oleh ribuan respons kosong dan overhead header.',
      handledExplain: 'Kurir mengirim biner ringan via gRPC (HTTP/2), diproses Location Engine, lalu dialirkan satu arah dengan HTTP/2 Server-Sent Events (SSE) ke browser operator.',
      unhandled: {
        desc: 'HTTP Short Polling 1s + JSON Polling: ribuan request kosong membanjiri API & LB.',
        nodes: [
          { id: 'client', label: '50k Kurir + 2k Op', pos: [-5.6, 0, 0], capacity: 15000, role: 'traffic_source' },
          { id: 'lb', label: 'LB (Poll Overhead)', pos: [-0.8, 0, 0], capacity: 2600, role: 'stateless_compute' },
          { id: 'api', label: 'Monolith Polling DB', pos: [4.5, 0, 0], capacity: 2200, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'lb' },
          { from: 'lb', to: 'api' }
        ]
      },
      handled: {
        desc: 'Best Practice: gRPC Protobuf (Ingesti Kurir) + Redis Geo Engine + HTTP/2 SSE (Stream 1-Arah ke Operator).',
        nodes: [
          { id: 'client', label: '50k Kurir (gRPC)', pos: [-6.4, 0, 0], capacity: 15000, role: 'traffic_source' },
          { id: 'grpc', label: 'gRPC Ingest (Protobuf)', pos: [-2.0, 0, 0], capacity: 9000, role: 'rate_limiter' },
          { id: 'geo', label: 'Redis Geo Engine', pos: [2.0, 0, -1.8], capacity: 12000, role: 'memory_lock' },
          { id: 'sse', label: 'HTTP/2 SSE Stream', pos: [5.4, 0, 1.4], capacity: 8000, role: 'fallback_service' }
        ],
        edges: [
          { from: 'client', to: 'grpc' },
          { from: 'grpc', to: 'geo' },
          { from: 'geo', to: 'sse' }
        ]
      }
    },

    sticky_lb_stateless: {
      id: 'sticky_lb_stateless',
      shortTitle: '07. LB & Stateless',
      subtitle: 'Ketimpangan IP Hash Sticky Session (1 IP NAT) vs Stateless Redis + Least Connections',
      slaTargetP99Ms: 130,
      defaultRps: 3800,
      maxRps: 8000,
      actionLabel: '📱 Gelombang User 1 IP NAT',
      unhandledExplain: 'Sesi tersimpan di RAM lokal sehingga LB memakai IP Hash: ribuan user seluler dari 1 IP NAT publik semuanya dilempar ke App-1 (100% OVERLOAD) sementara App-2 & App-3 menganggur!',
      handledExplain: 'Sesi dipindah ke klaster Redis eksternal sehingga App menjadi Stateless. LB memakai Least Connections dan membagi paket merata ke ketiga server (~45% beban masing-masing).',
      unhandled: {
        desc: 'IP Hash Sticky Session: seluruh trafik NAT menumpuk di App-1 (Overload), App-2 & App-3 nganggur.',
        nodes: [
          { id: 'client', label: 'NAT Public IP Users', pos: [-6.0, 0, 0], capacity: 12000, role: 'traffic_source' },
          { id: 'lb', label: 'L7 LB (IP Hash)', pos: [-1.8, 0, 0], capacity: 10000, role: 'rate_limiter' },
          { id: 'app1', label: 'App-1 (RAM Session)', pos: [3.6, 0, -2.6], capacity: 2000, role: 'stateless_compute' },
          { id: 'app2', label: 'App-2 (Idle)', pos: [3.6, 0, 0], capacity: 2000, role: 'stateless_compute' },
          { id: 'app3', label: 'App-3 (Idle)', pos: [3.6, 0, 2.6], capacity: 2000, role: 'stateless_compute' }
        ],
        edges: [
          { from: 'client', to: 'lb' },
          { from: 'lb', to: 'app1' },
          { from: 'lb', to: 'app2' },
          { from: 'lb', to: 'app3' }
        ]
      },
      handled: {
        desc: 'Best Practice: Stateless App + Least Connections LB membagi beban merata + Shared Redis Session Cluster.',
        nodes: [
          { id: 'client', label: 'NAT Public IP Users', pos: [-6.5, 0, 0], capacity: 12000, role: 'traffic_source' },
          { id: 'lb', label: 'L7 LB (Least Conn)', pos: [-2.4, 0, 0], capacity: 12000, role: 'rate_limiter' },
          { id: 'app1', label: 'App-1 (Stateless)', pos: [1.8, 0, -2.4], capacity: 2500, role: 'fallback_service' },
          { id: 'app2', label: 'App-2 (Stateless)', pos: [1.8, 0, 0], capacity: 2500, role: 'fallback_service' },
          { id: 'app3', label: 'App-3 (Stateless)', pos: [1.8, 0, 2.4], capacity: 2500, role: 'fallback_service' },
          { id: 'redis', label: 'Redis Session Cluster', pos: [5.8, 0, 0], capacity: 15000, role: 'memory_lock' }
        ],
        edges: [
          { from: 'client', to: 'lb' },
          { from: 'lb', to: 'app1' },
          { from: 'lb', to: 'app2' },
          { from: 'lb', to: 'app3' },
          { from: 'app1', to: 'redis' },
          { from: 'app2', to: 'redis' },
          { from: 'app3', to: 'redis' }
        ]
      }
    },

    storage_btree_lsm: {
      id: 'storage_btree_lsm',
      shortTitle: '08. B-Tree vs LSM',
      subtitle: 'Ingesti Sensor IoT Masif: B-Tree Random Disk I/O vs LSM-Tree Sequential Append',
      slaTargetP99Ms: 100,
      defaultRps: 5000,
      maxRps: 10000,
      actionLabel: '📡 Lonjakan Sensor 9.000/s',
      unhandledExplain: 'PostgreSQL tunggal dengan 6 secondary index harus memperbarui 7 struktur pohon B-Tree secara acak di disk di tiap INSERT -> Disk I/O jenuh & antrean meluap!',
      handledExplain: 'Mesin LSM-Tree (Cassandra/TimescaleDB) menulis cepat secara berurutan ke MemTable (RAM) + WAL, lalu menggabungkan SSTables secara periodik di latar belakang.',
      unhandled: {
        desc: 'Single B-Tree + 6 Secondary Indexes: Random Disk I/O jenuh saat menerima ribuan append/detik.',
        nodes: [
          { id: 'client', label: 'IoT Smart Meters', pos: [-5.6, 0, 0], capacity: 20000, role: 'traffic_source' },
          { id: 'ingest', label: 'Ingest Gateway', pos: [-1.0, 0, 0], capacity: 12000, role: 'stateless_compute' },
          { id: 'db', label: 'B-Tree DB (6 Indexes)', pos: [4.4, 0, 0], capacity: 1800, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'ingest' },
          { from: 'ingest', to: 'db' }
        ]
      },
      handled: {
        desc: 'Best Practice: LSM-Tree Engine (Sequential MemTable + WAL) -> Async SSTable Compaction (Kapasitas Write Tinggi).',
        nodes: [
          { id: 'client', label: 'IoT Smart Meters', pos: [-6.4, 0, 0], capacity: 20000, role: 'traffic_source' },
          { id: 'ingest', label: 'Ingest Gateway', pos: [-2.4, 0, 0], capacity: 12000, role: 'stateless_compute' },
          { id: 'mem', label: 'MemTable + WAL (RAM)', pos: [1.6, 0, -1.4], capacity: 14000, role: 'memory_lock' },
          { id: 'sstable', label: 'SSTables (LSM Disk)', pos: [5.4, 0, 1.2], capacity: 12000, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'ingest' },
          { from: 'ingest', to: 'mem' },
          { from: 'mem', to: 'sstable' }
        ]
      }
    },

    sharding_quorum: {
      id: 'sharding_quorum',
      shortTitle: '09. Sharding & Replica',
      subtitle: 'Celebrity Hotspot / Single DB vs Consistent Hash Sharding + Read Replicas (Quorum)',
      slaTargetP99Ms: 140,
      defaultRps: 4500,
      maxRps: 9000,
      actionLabel: '🌟 Simulasi Celebrity Hotspot',
      unhandledExplain: 'Range-based sharding atau 1 Primary DB menyebabkan seluruh trafik baca & tulis terpusat di Shard-1 (OVERLOAD 100%+) sementara Shard-2 hampir kosong.',
      handledExplain: 'Consistent Hashing dengan Virtual Nodes memecah tulis merata ke 3 Shard, sementara Read Replicas menyerap mayoritas kueri baca dengan konsistensi Quorum (R+W>N).',
      unhandled: {
        desc: 'Single Primary / Range Hotspot: Shard-1 kewalahan menanggung baca+tulis, Shard-2 menganggur.',
        nodes: [
          { id: 'client', label: 'Read+Write Traffic', pos: [-6.0, 0, 0], capacity: 15000, role: 'traffic_source' },
          { id: 'router', label: 'Range Router', pos: [-1.8, 0, 0], capacity: 10000, role: 'stateless_compute' },
          { id: 's1', label: 'Shard-1 (Hotspot)', pos: [3.8, 0, -1.8], capacity: 1900, role: 'acid_storage' },
          { id: 's2', label: 'Shard-2 (Idle)', pos: [3.8, 0, 2.0], capacity: 1900, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'router' },
          { from: 'router', to: 's1' },
          { from: 'router', to: 's2' }
        ]
      },
      handled: {
        desc: 'Best Practice: Consistent Hash Router -> Shard 1/2/3 Terdistribusi + Read Replicas.',
        nodes: [
          { id: 'client', label: 'Read+Write Traffic', pos: [-6.4, 0, 0], capacity: 15000, role: 'traffic_source' },
          { id: 'router', label: 'Consistent Hash Router', pos: [-2.2, 0, 0], capacity: 12000, role: 'rate_limiter' },
          { id: 's1', label: 'Shard-1 (Quorum)', pos: [2.4, 0, -2.4], capacity: 3200, role: 'acid_storage' },
          { id: 's2', label: 'Shard-2 (Quorum)', pos: [2.4, 0, 0], capacity: 3200, role: 'acid_storage' },
          { id: 's3', label: 'Shard-3 + Replica', pos: [2.4, 0, 2.4], capacity: 3200, role: 'fallback_service' }
        ],
        edges: [
          { from: 'client', to: 'router' },
          { from: 'router', to: 's1' },
          { from: 'router', to: 's2' },
          { from: 'router', to: 's3' }
        ]
      }
    },

    fencing_locks: {
      id: 'fencing_locks',
      shortTitle: '10. Fencing Tokens',
      subtitle: 'Jeda Garbage Collection (GC Pause) Double-Debit vs Monotonic Fencing Token',
      slaTargetP99Ms: 160,
      defaultRps: 2000,
      maxRps: 5000,
      actionLabel: '⏸️ Simulasikan GC Pause 14s',
      unhandledExplain: 'Worker-1 kena GC Pause 14s melampaui TTL Lock 10s. Worker-2 masuk & transfer dana, lalu Worker-1 bangun dan menulis transfer ke-2 -> DOUBLE DEBIT!',
      handledExplain: 'Lock menerbitkan Fencing Token monotonik (#33, #34). Saat Worker-1 bangun membawa token lama #33, Storage langsung menolak (FAIL-FAST) karena #33 < #34!',
      unhandled: {
        desc: 'Redis Lock tanpa Fencing Token: Worker yang bangun dari GC Pause memicu eksekusi saldo ganda!',
        nodes: [
          { id: 'client', label: 'Transfer Requests', pos: [-6.0, 0, 0], capacity: 8000, role: 'traffic_source' },
          { id: 'w1', label: 'Worker-1 (GC Pause!)', pos: [-1.2, 0, -2.0], capacity: 3000, role: 'stateless_compute' },
          { id: 'w2', label: 'Worker-2 (Active)', pos: [-1.2, 0, 2.0], capacity: 3000, role: 'stateless_compute' },
          { id: 'db', label: 'Ledger DB (Double Hit)', pos: [4.6, 0, 0], capacity: 4000, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'w1' },
          { from: 'client', to: 'w2' },
          { from: 'w1', to: 'db' },
          { from: 'w2', to: 'db' }
        ]
      },
      handled: {
        desc: 'Best Practice: Distributed Lock + Monotonic Fencing Token (#33 vs #34) divalidasi atomik oleh Ledger Storage.',
        nodes: [
          { id: 'client', label: 'Transfer Requests', pos: [-6.6, 0, 0], capacity: 8000, role: 'traffic_source' },
          { id: 'lock', label: 'Lock + Token (#33->#34)', pos: [-2.6, 0, 0], capacity: 6000, role: 'memory_lock' },
          { id: 'w1', label: 'Worker-1 (Stale #33)', pos: [1.2, 0, -2.1], capacity: 3000, role: 'stateless_compute' },
          { id: 'w2', label: 'Worker-2 (Valid #34)', pos: [1.2, 0, 2.1], capacity: 3000, role: 'fallback_service' },
          { id: 'db', label: 'Ledger Guard (Tolak #33)', pos: [5.4, 0, 0], capacity: 5000, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'lock' },
          { from: 'lock', to: 'w1' },
          { from: 'lock', to: 'w2' },
          { from: 'w1', to: 'db', mode: 'stale_token_check' },
          { from: 'w2', to: 'db' }
        ]
      }
    },

    observability_otel: {
      id: 'observability_otel',
      shortTitle: '11. OTel & Canary',
      subtitle: 'Diagnosis Latensi 9s di Microservices, Edge WAF & Strategi Rilis Canary',
      slaTargetP99Ms: 180,
      defaultRps: 3000,
      maxRps: 7000,
      actionLabel: '🕵️ Lacak Trace-ID & Bot WAF',
      unhandledExplain: 'Log teks terpisah di tiap service tanpa Trace-ID membuat bottleneck N+1 di Service B tersembunyi (latensi 9s walau CPU < 30%), serta bot menembus origin.',
      handledExplain: 'Cloudflare WAF memantulkan bot di edge (FAIL-FAST), Canary Router mengirim 5% trafik ke v2 aman, dan OpenTelemetry Trace-ID menyorot span lambat secara instan.',
      unhandled: {
        desc: 'Blind Local Logs + Tanpa WAF: bot menembus origin & bottleneck tersembunyi di Service B->DB.',
        nodes: [
          { id: 'client', label: 'Users + Bot Traffic', pos: [-6.0, 0, 0], capacity: 10000, role: 'traffic_source' },
          { id: 'svcA', label: 'Service A (No Trace)', pos: [-1.8, 0, 0], capacity: 5000, role: 'stateless_compute' },
          { id: 'svcB', label: 'Service B (N+1 Wait)', pos: [2.2, 0, 0], capacity: 1600, role: 'stateless_compute' },
          { id: 'db', label: 'Report DB', pos: [5.6, 0, 0], capacity: 1500, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'svcA' },
          { from: 'svcA', to: 'svcB' },
          { from: 'svcB', to: 'db' }
        ]
      },
      handled: {
        desc: 'Best Practice: Edge WAF (Blok Bot) + OpenTelemetry Trace-ID + Canary 5% + Read Cache.',
        nodes: [
          { id: 'client', label: 'Users + Bot Traffic', pos: [-6.6, 0, 0], capacity: 10000, role: 'traffic_source' },
          { id: 'waf', label: 'Edge WAF + Trace-ID', pos: [-2.8, 0, 0], capacity: 5500, role: 'rate_limiter' },
          { id: 'v1', label: 'Service v1 (95%)', pos: [1.4, 0, -2.0], capacity: 5000, role: 'fallback_service' },
          { id: 'v2', label: 'Canary v2 (5%)', pos: [1.4, 0, 2.2], capacity: 2500, role: 'memory_lock' },
          { id: 'otel', label: 'OTel Collector + DB', pos: [5.4, 0, 0], capacity: 6000, role: 'acid_storage' }
        ],
        edges: [
          { from: 'client', to: 'waf' },
          { from: 'waf', to: 'v1' },
          { from: 'waf', to: 'v2' },
          { from: 'v1', to: 'otel' },
          { from: 'v2', to: 'otel' }
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

      // Dynamic scenario states
      this.cacheExpiredTimer = 0;
      this.taxDegraded = true;
      this.networkGlitch = true;
      this.gcPauseActive = true;
      this.breakerState = 'CLOSED';
      this.breakerTimer = 0;

      // Queues & Live Node Metrics
      this.nodeStates = new Map();
      this.packets = [];
      this.spawnAccumulator = 0;
      this.lostEventsCount = 0;
      this.rejectedCount = 0;
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
        <button class="sim-scenario-btn ${sc.id === this.scenarioId ? 'active' : ''}" data-sim-scenario="${sc.id}" title="${sc.title}">
          ${sc.shortTitle}
        </button>
      `).join('');

      this.mountEl.innerHTML = `
        <div class="sim-studio-card">
          <div class="sim-studio-head">
            <div>
              <div class="sim-eyebrow">
                <span class="sim-live-dot"></span>
                INTERACTIVE CAUSAL 3D SYSTEM TOPOLOGY LAB (11 SKENARIO NYATA)
              </div>
              <h3 class="sim-title" id="simTitle">${scenario.title}</h3>
              <p class="sim-subtitle" id="simSubtitle">${scenario.subtitle}</p>
            </div>
            <div class="sim-arch-toggle" role="group" aria-label="Pilih Arsitektur">
              <button class="sim-arch-btn ${this.archMode === 'unhandled' ? 'active bad' : ''}" data-sim-arch="unhandled">
                ⚠ Masalah (Unhandled)
              </button>
              <button class="sim-arch-btn ${this.archMode === 'handled' ? 'active good' : ''}" data-sim-arch="handled">
                ✓ Best Practice (Handled)
              </button>
            </div>
          </div>

          <div class="sim-scenario-tabs" aria-label="Pilih topik System Design">
            ${scenarioButtons}
          </div>

          <!-- Behind-the-Scenes Explanation Comparison -->
          <div class="sim-explain-grid">
            <div class="sim-explain-box ${this.archMode === 'unhandled' ? 'is-focused-bad' : ''}">
              <div class="sim-explain-head bad">⚠ Apa yang Terjadi Tanpa Handling:</div>
              <p>${scenario.unhandledExplain}</p>
            </div>
            <div class="sim-explain-box ${this.archMode === 'handled' ? 'is-focused-good' : ''}">
              <div class="sim-explain-head good">✓ Visual Best Practice &amp; Handling:</div>
              <p>${scenario.handledExplain}</p>
            </div>
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
              <span class="sim-metric-label" id="simMetricFourthLabel">Dampak / Antrean</span>
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
      this.updateHeaderControls();
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
      this.breakerState = 'CLOSED';
      this.breakerTimer = 0;
      this.cacheExpiredTimer = this.scenarioId === 'cache_stampede' ? 4.5 : 0;
      this.taxDegraded = true;
      this.networkGlitch = true;
      this.gcPauseActive = true;
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
          this.renderShell();
          this.resetSimulationState();
          this.handleResize();
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
      const label4 = this.mountEl.querySelector('#simMetricFourthLabel');
      if (label4) {
        if (this.scenarioId === 'dual_write_outbox') label4.textContent = 'Event Hilang (Drift)';
        else if (this.scenarioId === 'fencing_locks') label4.textContent = 'Double-Debit / Guard';
        else if (this.scenarioId === 'circuit_breaker') label4.textContent = 'Breaker / Antrean';
        else label4.textContent = 'Fail-Fast / Antrean';
      }
      const p99El = this.mountEl.querySelector('#simMetricP99');
      if (p99El && p99El.previousElementSibling) {
        p99El.previousElementSibling.textContent = `Est. Latensi P99 (SLA ≤ ${scenario.slaTargetP99Ms}ms)`;
      }
    }

    triggerScenarioAction() {
      const sc = this.getCurrentScenario();
      if (['flash_sale', 'realtime_fleet', 'sticky_lb_stateless', 'storage_btree_lsm', 'sharding_quorum'].includes(this.scenarioId)) {
        const spikeVal = Math.min(sc.maxRps, Math.round(sc.maxRps * 0.85));
        this.incomingRps = spikeVal;
        const slider = this.mountEl.querySelector('#simRpsSlider');
        const disp = this.mountEl.querySelector('#simRpsDisplay');
        if (slider) slider.value = spikeVal;
        if (disp) disp.textContent = `${spikeVal.toLocaleString('id-ID')} RPS`;
      } else if (this.scenarioId === 'cache_stampede') {
        this.cacheExpiredTimer = 5.0;
      } else if (this.scenarioId === 'circuit_breaker') {
        this.taxDegraded = !this.taxDegraded;
        if (!this.taxDegraded) {
          this.breakerState = 'HALF_OPEN';
          this.breakerTimer = 1.2;
        }
      } else if (this.scenarioId === 'dual_write_outbox') {
        this.networkGlitch = !this.networkGlitch;
      } else if (this.scenarioId === 'fencing_locks') {
        this.gcPauseActive = !this.gcPauseActive;
      } else if (this.scenarioId === 'network_http3' || this.scenarioId === 'observability_otel') {
        this.incomingRps = Math.min(sc.maxRps, Math.round(sc.maxRps * 0.82));
        const slider = this.mountEl.querySelector('#simRpsSlider');
        const disp = this.mountEl.querySelector('#simRpsDisplay');
        if (slider) slider.value = this.incomingRps;
        if (disp) disp.textContent = `${this.incomingRps.toLocaleString('id-ID')} RPS`;
      }
    }

    handleResize() {
      const wrap = this.mountEl.querySelector('#simCanvasWrap');
      if (!wrap || !this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = wrap.clientWidth || 600;
      const height = Math.max(300, Math.min(430, Math.round(width * 0.54)));

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

      if (this.scenarioId === 'cache_stampede') {
        if (this.cacheExpiredTimer > 0) this.cacheExpiredTimer = Math.max(0, this.cacheExpiredTimer - dt);
        else if (Math.random() < dt * 0.14) this.cacheExpiredTimer = 4.0;
      }

      if (this.scenarioId === 'circuit_breaker' && this.archMode === 'handled') {
        if (this.taxDegraded) {
          this.breakerTimer += dt;
          if (this.breakerState === 'CLOSED' && this.breakerTimer > 1.2) { this.breakerState = 'OPEN'; this.breakerTimer = 0; }
          else if (this.breakerState === 'OPEN' && this.breakerTimer > 3.5) { this.breakerState = 'HALF_OPEN'; this.breakerTimer = 0; }
          else if (this.breakerState === 'HALF_OPEN' && this.breakerTimer > 0.9) { this.breakerState = 'OPEN'; this.breakerTimer = 0; }
        } else {
          this.breakerState = 'CLOSED';
          this.breakerTimer = 0;
        }
      }

      let dbQueueTotal = 0;
      let rejectedRps = 0;
      let throughputRps = rps;
      let estP99 = 45;
      let globalStatus = 'NORMAL';

      if (this.scenarioId === 'flash_sale') {
        if (this.archMode === 'unhandled') {
          this.updateNodeLoad('client', rps, dt);
          this.updateNodeLoad('app', rps, dt);
          const dbSt = this.updateNodeLoad('db', rps, dt);
          dbQueueTotal = dbSt.queueDepth;
          throughputRps = Math.min(rps, dbSt.effectiveCap);
          estP99 = 65 + (dbSt.loadRatio > 0.8 ? Math.pow(dbSt.loadRatio, 2.5) * 420 : 20) + dbSt.queueDepth * 35;
          globalStatus = dbSt.loadRatio > 1.0 ? 'SATURATED / OVERLOAD' : (dbSt.loadRatio > 0.8 ? 'HIGH LOAD' : 'NORMAL');
        } else {
          this.updateNodeLoad('client', rps, dt);
          const gateSt = this.updateNodeLoad('gate', rps, dt);
          const admitted = Math.min(rps, gateSt.effectiveCap);
          rejectedRps = Math.max(0, rps - gateSt.effectiveCap);
          this.updateNodeLoad('redis', admitted, dt);
          const kafkaSt = this.updateNodeLoad('kafka', admitted, dt);
          const dbSt = this.updateNodeLoad('db', Math.min(admitted, kafkaSt.node.maxDrainRate || 1250), dt);
          dbQueueTotal = dbSt.queueDepth;
          throughputRps = admitted;
          estP99 = 28 + gateSt.loadRatio * 45 + (rejectedRps > 0 ? 15 : 0);
          globalStatus = rejectedRps > 0 ? 'FAIL-FAST ACTIVE' : 'NORMAL';
        }
      } else if (this.scenarioId === 'cache_stampede') {
        const exp = this.cacheExpiredTimer > 0;
        this.updateNodeLoad('client', rps, dt);
        this.updateNodeLoad('app', rps, dt);
        if (this.archMode === 'unhandled') {
          this.updateNodeLoad('redis', exp ? rps * 0.1 : rps, dt);
          const dbSt = this.updateNodeLoad('db', exp ? rps : rps * 0.03, dt);
          dbQueueTotal = dbSt.queueDepth;
          throughputRps = exp ? Math.min(rps, dbSt.effectiveCap) : rps;
          estP99 = exp ? 140 + Math.pow(Math.max(1, dbSt.loadRatio), 2.5) * 620 + dbSt.queueDepth * 40 : 24;
          if (dbSt.loadRatio > 1.0) globalStatus = 'SATURATED / OVERLOAD';
        } else {
          this.updateNodeLoad('redis', exp ? rps * 0.1 : rps, dt);
          const dbSt = this.updateNodeLoad('db', exp ? 40 : rps * 0.02, dt);
          const appSt = this.nodeStates.get('app');
          if (appSt) appSt.status = exp ? 'COALESCING' : 'NORMAL';
          dbQueueTotal = dbSt.queueDepth;
          throughputRps = rps;
          estP99 = exp ? 52 : 22;
          globalStatus = exp ? 'COALESCING (Singleflight)' : 'NORMAL';
        }
      } else if (this.scenarioId === 'circuit_breaker') {
        this.updateNodeLoad('client', rps, dt);
        const taxCap = this.taxDegraded ? 260 : 4500;
        if (this.archMode === 'unhandled') {
          const taxSt = this.updateNodeLoad('tax', rps, dt, taxCap);
          const coCap = this.taxDegraded ? Math.max(300, 5000 * (taxCap / rps)) : 5000;
          const coSt = this.updateNodeLoad('checkout', rps, dt, coCap);
          dbQueueTotal = coSt.queueDepth + taxSt.queueDepth;
          throughputRps = Math.min(rps, taxCap);
          estP99 = this.taxDegraded ? 4800 + coSt.queueDepth * 90 : 65;
          globalStatus = this.taxDegraded ? 'CASCADING OVERLOAD' : 'NORMAL';
        } else {
          this.updateNodeLoad('checkout', rps, dt);
          const brSt = this.updateNodeLoad('breaker', rps, dt);
          if (brSt) brSt.status = this.breakerState === 'OPEN' ? 'FAIL-FAST' : 'NORMAL';
          const toTax = this.breakerState === 'OPEN' ? 0 : (this.breakerState === 'HALF_OPEN' ? 120 : rps);
          this.updateNodeLoad('tax', toTax, dt, taxCap);
          this.updateNodeLoad('fallback', rps - toTax, dt);
          throughputRps = rps;
          estP99 = this.breakerState === 'OPEN' ? 42 : 75;
          globalStatus = this.breakerState === 'OPEN' ? 'BREAKER OPEN (FALLBACK)' : (this.breakerState === 'HALF_OPEN' ? 'HALF-OPEN PROBE' : 'NORMAL');
        }
      } else if (this.scenarioId === 'dual_write_outbox') {
        this.updateNodeLoad('client', rps, dt);
        this.updateNodeLoad('api', rps, dt);
        this.updateNodeLoad('db', rps, dt);
        if (this.archMode === 'unhandled') {
          const lossRate = this.networkGlitch ? 0.2 : 0;
          this.updateNodeLoad('kafka', rps * (1 - lossRate), dt);
          if (this.networkGlitch) this.lostEventsCount += rps * lossRate * dt;
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
      } else if (this.scenarioId === 'network_http3') {
        this.updateNodeLoad('client', rps, dt);
        if (this.archMode === 'unhandled') {
          this.updateNodeLoad('dns', rps, dt);
          const appSt = this.updateNodeLoad('app', rps, dt);
          dbQueueTotal = appSt.queueDepth;
          throughputRps = Math.min(rps, appSt.effectiveCap);
          estP99 = 85 + (appSt.loadRatio > 0.8 ? Math.pow(appSt.loadRatio, 2.2) * 320 : 20);
          globalStatus = appSt.loadRatio > 1.0 ? 'HoL BLOCKING & CPU TLS' : 'NORMAL';
        } else {
          this.updateNodeLoad('edge', rps, dt);
          const a1 = this.updateNodeLoad('app1', rps * 0.5, dt);
          this.updateNodeLoad('app2', rps * 0.5, dt);
          throughputRps = rps;
          estP99 = 24 + a1.loadRatio * 30;
          globalStatus = 'QUIC 0-RTT & OFFLOADED';
        }
      } else if (this.scenarioId === 'realtime_fleet') {
        this.updateNodeLoad('client', rps, dt);
        if (this.archMode === 'unhandled') {
          const lbSt = this.updateNodeLoad('lb', rps, dt);
          const apiSt = this.updateNodeLoad('api', rps, dt);
          dbQueueTotal = lbSt.queueDepth + apiSt.queueDepth;
          throughputRps = Math.min(rps, apiSt.effectiveCap);
          estP99 = 95 + (apiSt.loadRatio > 0.85 ? Math.pow(apiSt.loadRatio, 2.3) * 350 : 30);
          globalStatus = apiSt.loadRatio > 1.0 ? 'POLLING OVERLOAD' : 'NORMAL';
        } else {
          this.updateNodeLoad('grpc', rps, dt);
          this.updateNodeLoad('geo', rps, dt);
          this.updateNodeLoad('sse', rps * 0.35, dt);
          throughputRps = rps;
          estP99 = 38;
          globalStatus = 'gRPC + HTTP/2 SSE OPTIMAL';
        }
      } else if (this.scenarioId === 'sticky_lb_stateless') {
        this.updateNodeLoad('client', rps, dt);
        this.updateNodeLoad('lb', rps, dt);
        if (this.archMode === 'unhandled') {
          // 92% of NAT users hit App-1, 4% each to App-2 and App-3!
          const a1 = this.updateNodeLoad('app1', rps * 0.92, dt);
          this.updateNodeLoad('app2', rps * 0.04, dt);
          this.updateNodeLoad('app3', rps * 0.04, dt);
          dbQueueTotal = a1.queueDepth;
          throughputRps = Math.min(rps, a1.effectiveCap / 0.92);
          estP99 = 50 + (a1.loadRatio > 1.0 ? Math.pow(a1.loadRatio, 2.4) * 410 : 25);
          globalStatus = a1.loadRatio > 1.0 ? 'HOTSPOT APP-1 OVERLOAD' : 'UNBALANCED';
        } else {
          const a1 = this.updateNodeLoad('app1', rps / 3, dt);
          this.updateNodeLoad('app2', rps / 3, dt);
          this.updateNodeLoad('app3', rps / 3, dt);
          this.updateNodeLoad('redis', rps, dt);
          dbQueueTotal = a1.queueDepth;
          throughputRps = rps;
          estP99 = 34 + a1.loadRatio * 28;
          globalStatus = 'BALANCED (LEAST CONN)';
        }
      } else if (this.scenarioId === 'storage_btree_lsm') {
        this.updateNodeLoad('client', rps, dt);
        this.updateNodeLoad('ingest', rps, dt);
        if (this.archMode === 'unhandled') {
          const dbSt = this.updateNodeLoad('db', rps, dt);
          dbQueueTotal = dbSt.queueDepth;
          throughputRps = Math.min(rps, dbSt.effectiveCap);
          estP99 = 60 + (dbSt.loadRatio > 0.8 ? Math.pow(dbSt.loadRatio, 2.4) * 390 : 25);
          globalStatus = dbSt.loadRatio > 1.0 ? 'DISK I/O SATURATED' : 'NORMAL';
        } else {
          this.updateNodeLoad('mem', rps, dt);
          this.updateNodeLoad('sstable', rps * 0.65, dt);
          throughputRps = rps;
          estP99 = 26;
          globalStatus = 'LSM SEQUENTIAL APPEND';
        }
      } else if (this.scenarioId === 'sharding_quorum') {
        this.updateNodeLoad('client', rps, dt);
        this.updateNodeLoad('router', rps, dt);
        if (this.archMode === 'unhandled') {
          const s1 = this.updateNodeLoad('s1', rps * 0.9, dt);
          this.updateNodeLoad('s2', rps * 0.1, dt);
          dbQueueTotal = s1.queueDepth;
          throughputRps = Math.min(rps, s1.effectiveCap / 0.9);
          estP99 = 55 + (s1.loadRatio > 1.0 ? Math.pow(s1.loadRatio, 2.3) * 370 : 20);
          globalStatus = s1.loadRatio > 1.0 ? 'SHARD-1 HOTSPOT' : 'NORMAL';
        } else {
          const s1 = this.updateNodeLoad('s1', rps / 3, dt);
          this.updateNodeLoad('s2', rps / 3, dt);
          this.updateNodeLoad('s3', rps / 3, dt);
          throughputRps = rps;
          estP99 = 38 + s1.loadRatio * 24;
          globalStatus = 'SHARDED + QUORUM R+W>N';
        }
      } else if (this.scenarioId === 'fencing_locks') {
        this.updateNodeLoad('client', rps, dt);
        if (this.archMode === 'unhandled') {
          this.updateNodeLoad('w1', rps * 0.5, dt);
          this.updateNodeLoad('w2', rps * 0.5, dt);
          this.updateNodeLoad('db', rps, dt);
          if (this.gcPauseActive) this.lostEventsCount += (rps * 0.08) * dt;
          throughputRps = rps;
          estP99 = 90;
          globalStatus = this.gcPauseActive ? 'GC PAUSE DOUBLE-DEBIT' : 'NORMAL';
        } else {
          this.updateNodeLoad('lock', rps, dt);
          this.updateNodeLoad('w1', rps * 0.35, dt);
          this.updateNodeLoad('w2', rps * 0.65, dt);
          const dbSt = this.updateNodeLoad('db', rps * 0.65, dt);
          if (dbSt && this.gcPauseActive) rejectedRps = rps * 0.35;
          throughputRps = rps * 0.65;
          estP99 = 54;
          globalStatus = this.gcPauseActive ? 'TOKEN #33 REJECTED (SAFE)' : 'NORMAL';
        }
      } else if (this.scenarioId === 'observability_otel') {
        this.updateNodeLoad('client', rps, dt);
        if (this.archMode === 'unhandled') {
          this.updateNodeLoad('svcA', rps, dt);
          const bSt = this.updateNodeLoad('svcB', rps, dt);
          const dbSt = this.updateNodeLoad('db', rps, dt);
          dbQueueTotal = bSt.queueDepth + dbSt.queueDepth;
          throughputRps = Math.min(rps, dbSt.effectiveCap);
          estP99 = 110 + (dbSt.loadRatio > 0.85 ? Math.pow(dbSt.loadRatio, 2.2) * 540 : 40);
          globalStatus = dbSt.loadRatio > 1.0 ? 'BLIND N+1 BOTTLENECK' : 'NORMAL';
        } else {
          const wafSt = this.updateNodeLoad('waf', rps, dt);
          const cleanRps = Math.min(rps, wafSt.effectiveCap * 0.85);
          rejectedRps = Math.max(0, rps - cleanRps);
          this.updateNodeLoad('v1', cleanRps * 0.95, dt);
          this.updateNodeLoad('v2', cleanRps * 0.05, dt);
          this.updateNodeLoad('otel', cleanRps, dt);
          throughputRps = cleanRps;
          estP99 = 46;
          globalStatus = 'WAF + OTel TRACE + CANARY 5%';
        }
      }

      // Packet Spawning proportional to RPS
      const visualSpawnRate = Math.min(48, Math.max(4, rps / 220));
      this.spawnAccumulator += visualSpawnRate * dt;
      while (this.spawnAccumulator >= 1) {
        this.spawnAccumulator -= 1;
        this.spawnPacket(topo);
      }

      this.updatePackets(dt, topo);
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
        st.queueDepth = 0;
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

        if (p.lost && p.t >= 0.55) continue;

        if (p.t >= 1.0) {
          if (p.rejected) continue;
          const currentId = p.toId;
          const st = this.nodeStates.get(currentId);

          // 1. Rate Limiter / WAF Fail-Fast Bounce
          if (st && st.node.role === 'rate_limiter' && (st.loadRatio > 1.0 || (this.scenarioId === 'observability_otel' && Math.random() < 0.18))) {
            const rejectChance = st.loadRatio > 1.0 ? (st.incomingRps - st.effectiveCap) / st.incomingRps : 0.18;
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

          // 2. Cache Stampede
          if (this.scenarioId === 'cache_stampede' && currentId === 'app') {
            if (this.cacheExpiredTimer <= 0) {
              nextPackets.push({ fromId: 'app', toId: 'redis', t: 0, color: '#38bdf8', size: 4.5 });
            } else if (this.archMode === 'unhandled') {
              nextPackets.push({ fromId: 'app', toId: 'db', t: 0, color: '#f97316', size: 4.5 });
            } else if (Math.random() < 0.05) {
              nextPackets.push({ fromId: 'app', toId: 'db', t: 0, color: '#facc15', size: 7.5, coalesced: true });
            }
            continue;
          }

          // 3. Circuit Breaker
          if (this.scenarioId === 'circuit_breaker' && currentId === 'breaker') {
            if (this.breakerState === 'OPEN' || (this.breakerState === 'HALF_OPEN' && Math.random() > 0.1)) {
              nextPackets.push({ fromId: 'breaker', toId: 'fallback', t: 0, color: '#10b981', size: 4.5 });
            } else {
              nextPackets.push({ fromId: 'breaker', toId: 'tax', t: 0, color: this.taxDegraded ? '#ef4444' : '#38bdf8', size: 4.5 });
            }
            continue;
          }

          // 4. Dual-Write Split
          if (this.scenarioId === 'dual_write_outbox' && this.archMode === 'unhandled' && currentId === 'api') {
            nextPackets.push({ fromId: 'api', toId: 'db', t: 0, color: '#38bdf8', size: 4.2 });
            const isDropped = this.networkGlitch && Math.random() < 0.25;
            nextPackets.push({ fromId: 'api', toId: 'kafka', t: 0, color: isDropped ? '#ef4444' : '#a855f7', lost: isDropped, size: 4.2 });
            continue;
          }

          // 5. Sticky LB NAT Hotspot vs Least Conn
          if (this.scenarioId === 'sticky_lb_stateless' && currentId === 'lb') {
            let target = 'app1';
            if (this.archMode === 'unhandled') {
              const r = Math.random();
              target = r < 0.92 ? 'app1' : (r < 0.96 ? 'app2' : 'app3');
            } else {
              const targets = ['app1', 'app2', 'app3'];
              target = targets[Math.floor(Math.random() * 3)];
            }
            nextPackets.push({ fromId: 'lb', toId: target, t: 0, color: '#38bdf8', size: 4.5 });
            continue;
          }

          // 6. Sharding Router
          if (this.scenarioId === 'sharding_quorum' && currentId === 'router') {
            const target = this.archMode === 'unhandled'
              ? (Math.random() < 0.9 ? 's1' : 's2')
              : ['s1', 's2', 's3'][Math.floor(Math.random() * 3)];
            nextPackets.push({ fromId: 'router', toId: target, t: 0, color: '#38bdf8', size: 4.5 });
            continue;
          }

          // 7. Fencing Locks (Stale Worker-1 Rejected!)
          if (this.scenarioId === 'fencing_locks') {
            if (this.archMode === 'unhandled' && currentId === 'client') {
              const target = Math.random() < 0.5 ? 'w1' : 'w2';
              nextPackets.push({ fromId: 'client', toId: target, t: 0, color: target === 'w1' && this.gcPauseActive ? '#ef4444' : '#38bdf8', size: 4.5 });
              continue;
            }
            if (this.archMode === 'handled' && currentId === 'lock') {
              const target = Math.random() < 0.35 ? 'w1' : 'w2';
              nextPackets.push({ fromId: 'lock', toId: target, t: 0, color: target === 'w1' ? '#f59e0b' : '#10b981', size: 4.5 });
              continue;
            }
            if (this.archMode === 'handled' && currentId === 'w1' && this.gcPauseActive) {
              // Bounces back rejected by Fencing Guard!
              nextPackets.push({ fromId: 'db', toId: 'w1', t: 0, rejected: true, color: '#ef4444', size: 4.8 });
              continue;
            }
          }

          // 8. HTTP/3 SSL Offload & Canary Routing
          if (this.scenarioId === 'network_http3' && this.archMode === 'handled' && currentId === 'edge') {
            const target = Math.random() < 0.5 ? 'app1' : 'app2';
            nextPackets.push({ fromId: 'edge', toId: target, t: 0, color: '#10b981', size: 4.5 });
            continue;
          }
          if (this.scenarioId === 'observability_otel' && this.archMode === 'handled' && currentId === 'waf') {
            const target = Math.random() < 0.9 ? 'v1' : 'v2';
            nextPackets.push({ fromId: 'waf', toId: target, t: 0, color: target === 'v2' ? '#ec4899' : '#38bdf8', size: 4.5 });
            continue;
          }

          // Default edge forward
          const outEdge = topo.edges.find(e => e.from === currentId);
          if (outEdge) {
            const nextSt = this.nodeStates.get(outEdge.to);
            nextPackets.push({
              fromId: currentId,
              toId: outEdge.to,
              t: 0,
              color: (nextSt && nextSt.loadRatio > 1.0 && nextSt.node.role !== 'rate_limiter') ? '#f97316' : '#38bdf8',
              size: 4.5
            });
          }
        } else {
          nextPackets.push(p);
        }
      }

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
          status.includes('OVERLOAD') || status.includes('DRIFT') || status.includes('HOTSPOT') || status.includes('BLOCKING') || status.includes('DOUBLE') || status.includes('SATURATED') || status.includes('BOTTLENECK') ? 'bad' :
          status.includes('FAIL-FAST') || status.includes('COALESCING') || status.includes('OPEN') || status.includes('REJECTED') ? 'warn' : 'good'
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
          f4El.textContent = this.archMode === 'unhandled' ? `${Math.floor(this.lostEventsCount)} Event Hilang` : '0 Hilang (Synced)';
          f4El.className = 'sim-metric-val ' + (this.archMode === 'unhandled' && this.networkGlitch ? 'bad' : 'good');
        } else if (this.scenarioId === 'fencing_locks') {
          f4El.textContent = this.archMode === 'unhandled' ? `${Math.floor(this.lostEventsCount)} Double-Debit!` : `Tolak Token #33 (${Math.round(rejectedRps)}/s)`;
          f4El.className = 'sim-metric-val ' + (this.archMode === 'unhandled' && this.gcPauseActive ? 'bad' : 'good');
        } else if (this.scenarioId === 'circuit_breaker') {
          f4El.textContent = this.archMode === 'handled' ? `${this.breakerState}` : `Queue: ${Math.round(dbQueue * 120)}`;
        } else {
          f4El.textContent = rejectedRps > 0 ? `Reject: ${Math.round(rejectedRps).toLocaleString('id-ID')}/s` : `Antrean: ${Math.round(dbQueue * 150)}`;
        }
      }
    }

    updateInspector() {
      const box = this.mountEl.querySelector('#simInspector');
      if (!box) return;
      if (!this.hoveredNodeId) { box.hidden = true; return; }
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
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
      for (let z = -5; z <= 5; z += 1.5) {
        const p1 = this.isoProject(-8, 0, z);
        const p2 = this.isoProject(8, 0, z);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
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
          : ((edge.mode === 'lossy_dual_write' && this.networkGlitch) || edge.mode === 'stale_token_check' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(56, 189, 248, 0.25)');
        ctx.lineWidth = 3;
        if (edge.mode === 'fallback_path' || edge.mode === 'lossy_dual_write' || edge.mode === 'stale_token_check') {
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

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.moveTo(pBot[0].x + 4, pBot[0].y + 4);
      ctx.lineTo(pBot[1].x + 4, pBot[1].y + 4);
      ctx.lineTo(pBot[2].x + 4, pBot[2].y + 4);
      ctx.lineTo(pBot[3].x + 4, pBot[3].y + 4);
      ctx.closePath();
      ctx.fill();

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

      ctx.fillStyle = colors.right;
      ctx.beginPath();
      ctx.moveTo(pTop[2].x, pTop[2].y);
      ctx.lineTo(pTop[1].x, pTop[1].y);
      ctx.lineTo(pBot[1].x, pBot[1].y);
      ctx.lineTo(pBot[2].x, pBot[2].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(centerBot.x + 4, centerBot.y + 4, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

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

      for (const frac of [0.35, 0.68]) {
        const ring = this.isoProject(wx, wy + height * frac, wz);
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, rx, ry, 0, 0, Math.PI);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.stroke();
      }

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
      if (st.status === 'OVERLOAD') {
        const pulse = 0.5 + 0.5 * Math.sin(st.pulsePhase);
        return { top: pulse > 0.5 ? '#ef4444' : '#dc2626', left: '#991b1b', right: '#b91c1c', stroke: '#fca5a5' };
      }
      if (st.status === 'FAIL-FAST') return { top: '#f59e0b', left: '#92400e', right: '#b45309', stroke: '#fde68a' };
      if (st.status === 'COALESCING') return { top: '#facc15', left: '#854d0e', right: '#ca8a04', stroke: '#fef08a' };

      switch (role) {
        case 'traffic_source': return { top: '#38bdf8', left: '#0369a1', right: '#0284c7', stroke: '#bae6fd' };
        case 'rate_limiter':
        case 'circuit_breaker': return { top: '#8b5cf6', left: '#4c1d95', right: '#6d28d9', stroke: '#ddd6fe' };
        case 'memory_lock': return { top: '#ec4899', left: '#831843', right: '#be185d', stroke: '#fbcfe8' };
        case 'load_leveler': return { top: '#a855f7', left: '#581c87', right: '#7e22ce', stroke: '#e9d5ff' };
        case 'acid_storage': return { top: '#2563eb', left: '#1e3a8a', right: '#1d4ed8', stroke: '#93c5fd' };
        case 'fallback_service': return { top: '#10b981', left: '#064e3b', right: '#047857', stroke: '#a7f3d0' };
        case 'external_api':
          return this.taxDegraded
            ? { top: '#ef4444', left: '#7f1d1d', right: '#991b1b', stroke: '#fca5a5' }
            : { top: '#06b6d4', left: '#164e63', right: '#0e7490', stroke: '#a5f3fc' };
        default: return { top: '#3b82f6', left: '#1e3a8a', right: '#1d4ed8', stroke: '#bfdbfe' };
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
          top: '#fb7185', left: '#9f1239', right: '#e11d48', stroke: '#fecdd3'
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

      ctx.fillStyle = 'rgba(11, 19, 43, 0.88)';
      ctx.strokeStyle = this.hoveredNodeId === st.node.id ? '#ffffff' : badgeColor;
      ctx.lineWidth = this.hoveredNodeId === st.node.id ? 1.8 : 1;
      drawRoundRect(ctx, boxX, boxY, textW, 34, 6);
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

      ctx.fillStyle = '#091124';
      ctx.fillRect(0, 0, this.viewW, this.viewH);

      this.drawIsoFloorGrid();
      this.drawEdges(topo);

      const sortedNodes = [...topo.nodes].sort((a, b) => (a.pos[0] + a.pos[2]) - (b.pos[0] + b.pos[2]));

      for (const node of sortedNodes) {
        const st = this.nodeStates.get(node.id);
        if (!st) continue;

        const [wx, , wz] = node.pos;
        const colors = this.getNodeColors(st);
        const height = node.role === 'acid_storage' ? 1.65 : (node.role === 'rate_limiter' || node.role === 'circuit_breaker' ? 1.35 : 1.15);

        this.drawPhysicalQueue(st);

        if (node.role === 'acid_storage') {
          this.drawIsoCylinder(wx, 0, wz, 0.72, height, colors);
        } else {
          this.drawIsoBox(wx, 0, wz, 1.35, height, 1.35, colors);
        }

        const topProj = this.isoProject(wx, height + 0.1, wz);
        st.screenPos = topProj;
      }

      this.drawPackets(topo);

      for (const node of sortedNodes) {
        const st = this.nodeStates.get(node.id);
        if (st) this.drawNodeLabel(st, st.screenPos);
      }
    }

    startLoop() {
      const loop = (now) => {
        const dt = Math.min(0.05, (now - this.lastTime) / 1000);
        this.lastTime = now;
        if (this.running) this.stepPhysics(dt);
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
