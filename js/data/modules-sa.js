/**
 * System Design & Architecture Mode Modules (14 Modules across 6 Tracks)
 * Sourced completely from materi_lengkap_system_design_best_practices.md
 */
window.SA_MODULES = [
  {
    id: 'sam01',
    mode: 'sa',
    order: 1,
    track: 'Fondasi Jaringan, Protokol & Trafik',
    title: 'Modul 1A: Model Jaringan L4/L7, DNS Global Routing & Evolusi HTTP/1.1 → HTTP/3',
    level: 'Beginner',
    summary: 'Semua komunikasi bergantung pada lapisan jaringan. Kuasai perbedaan L4 TCP/UDP vs L7, hierarki resolusi DNS, Anycast vs GeoDNS, HTTP/1.1 -> HTTP/3 QUIC, serta TLS/mTLS.',
    concepts: [
      ['Model Jaringan Praktis (L4 vs L7)', 'Layer 4 (Transport - TCP/UDP) bekerja di level IP & Port; TCP menjamin urutan via 3-way handshake, flow & congestion control, sedangkan UDP connectionless berlatensi rendah. Layer 7 (Application - HTTP, gRPC, WebSocket) membaca payload, header, URL, dan cookie untuk routing cerdas.'],
      ['Hierarki Resolusi & Record DNS', 'Alur: Browser Cache -> OS Cache -> Recursive Resolver (ISP/1.1.1.1) -> Root Nameserver -> TLD (.com, .id) -> Authoritative Nameserver. Record penting: A (IPv4), AAAA (IPv6), CNAME (alias domain), NS (delegasi nameserver).'],
      ['Global Routing: Anycast DNS vs GeoDNS', 'Anycast DNS mengumumkan satu alamat IP dari banyak lokasi global via BGP agar paket otomatis menuju rute terdekat; GeoDNS mengembalikan IP berbeda berdasarkan lokasi geografis pengguna.'],
      ['Evolusi HTTP/1.1 -> HTTP/2 -> HTTP/3 (QUIC)', 'HTTP/1.1 terkena Head-of-Line (HoL) Blocking di level aplikasi. HTTP/2 memakai Binary Framing, Multiplexing dalam 1 TCP, & HPACK, namun masih rentan TCP HoL Blocking saat paket hilang. HTTP/3 di atas QUIC (UDP) menghapus TCP HoL Blocking, mendukung 0-RTT resumption, dan tahan perpindahan Wi-Fi ke seluler.'],
      ['Keamanan Transport (TLS & mTLS)', 'TLS/SSL Offloading (Termination) di Load Balancer meringankan beban dekripsi CPU server aplikasi. mTLS (Mutual TLS) mewajibkan klien & server internal saling memverifikasi sertifikat digital dalam jaringan Zero-Trust.']
    ],
    compare: 'Optimasi di level kode aplikasi tidak akan menyelamatkan latensi bila memilih protokol yang memicu TCP HoL Blocking di jaringan seluler tidak stabil atau mengabaikan SSL termination di edge.',
    code: {
      language: 'text',
      content: `Hierarki Resolusi DNS:
Browser Cache -> OS Cache -> Recursive Resolver (1.1.1.1) -> Root -> TLD (.id) -> Authoritative NS

Evolusi Transport HTTP:
  HTTP/1.1 : Teks + Keep-Alive              -> App HoL Blocking
  HTTP/2   : Binary Framing + Multiplexing  -> Bebas App HoL, tapi kena TCP HoL Blocking
  HTTP/3   : QUIC di atas UDP + 0-RTT       -> Bebas TCP HoL + Connection Migration`
    },
    practices: [
      'Aktifkan HTTP/2 dan HTTP/3 (QUIC) di CDN/Load Balancer untuk mempercepat loading pengguna mobile.',
      'Lakukan SSL Termination di Load Balancer / Reverse Proxy, lalu gunakan mTLS untuk komunikasi sensitif antar-service internal.',
      'Set TTL DNS secara seimbang: terlalu rendah membebani resolver, terlalu tinggi memperlambat failover IP saat bencana.'
    ],
    case: 'Aplikasi mobile mengalami kelambatan ekstrim saat pengguna berpindah dari Wi-Fi kantor ke jaringan 4G di jalan karena handshake TCP+TLS HTTP/2 harus diulang dari nol. Mengaktifkan HTTP/3 QUIC menjaga sesi koneksi tetap hidup via Connection ID.',
    exercise: {
      scenario: 'Sebuah platform fintech melayani pengguna di Jakarta, Singapura, dan Tokyo.',
      task: 'Jelaskan kapan Anda memilih Anycast DNS dibanding GeoDNS, dan di mana Anda menempatkan TLS Termination vs mTLS.'
    },
    quiz: {
      question: 'Apa keunggulan utama HTTP/3 (QUIC di atas UDP) dibandingkan HTTP/2 di atas TCP?',
      options: [
        'Menghilangkan kebutuhan DNS lookup sepenuhnya.',
        'Menghilangkan TCP Head-of-Line Blocking dan mempertahankan koneksi saat pengguna berpindah jaringan (mis. Wi-Fi ke seluler).',
        'Mengubah seluruh komunikasi API menjadi tanpa enkripsi.'
      ],
      answer: 1,
      explanation: 'Karena QUIC berjalan di atas UDP dengan stream independen, hilangnya satu paket hanya memengaruhi satu stream tersebut, tidak membekukan seluruh koneksi TCP.'
    },
    refs: ['https://cloudflare.com/learning/ddos/glossary/hypertext-transfer-protocol-http/']
  },
  {
    id: 'sam02',
    mode: 'sa',
    order: 2,
    track: 'Fondasi Jaringan, Protokol & Trafik',
    title: 'Modul 1B: Pola Komunikasi API, Real-Time & Studi Kasus Armada Logistik',
    level: 'Intermediate',
    summary: 'Memilih kontrak komunikasi yang tepat: REST vs GraphQL vs gRPC, serta pola real-time (Short/Long Polling, SSE, WebSockets, Webhooks) lengkap dengan Studi Kasus 1.',
    concepts: [
      ['REST vs GraphQL vs gRPC', 'REST stateless berbasis HTTP & mudah di-cache CDN. GraphQL mencegah over/under-fetching tetapi berisiko serangan deeply nested queries dan N+1 query DB. gRPC memakai HTTP/2 + Protobuf biner (payload jauh lebih kecil & cepat untuk komunikasi internal microservices).'],
      ['Short Polling vs Long Polling', 'Short Polling: klien bertanya berkala (boros header & CPU). Long Polling: server menahan koneksi hingga ada data baru atau timeout (memicu pembuatan ulang koneksi berulang).'],
      ['Server-Sent Events (SSE)', 'Aliran satu arah (server-to-client) di atas HTTP standar yang sangat ringan dan memiliki fitur auto-reconnect bawaan browser.'],
      ['WebSockets & Webhooks', 'WebSockets: koneksi persisten full-duplex (dua arah) untuk chat, kolaborasi, dan game. Webhooks: mekanisme callback HTTP asinkron antar-server berbasis event.']
    ],
    compare: 'Menggunakan WebSocket dua arah untuk kebutuhan dashboard yang hanya menerima streaming satu arah membuang memori stateful di Load Balancer. Sebaliknya, memakai Short Polling tiap 1 detik membakar CPU dengan ribuan respons kosong.',
    code: {
      language: 'protobuf',
      content: `// Contoh skema gRPC Protobuf untuk ingesti koordinat GPS armada kurir (Ukuran biner sangat ringkas)
syntax = "proto3";

service FleetTracking {
  rpc StreamCourierLocation (stream LocationUpdate) returns (AckResponse);
}

message LocationUpdate {
  string courier_id = 1;
  double latitude = 2;
  double longitude = 3;
  int64 timestamp_ms = 4;
}`
    },
    practices: [
      'Gunakan SSE di atas HTTP/2 untuk dashboard real-time satu arah agar tidak terkena batas 6 koneksi paralel per domain milik HTTP/1.1.',
      'Pasang query depth/complexity limit dan DataLoader jika memakai GraphQL untuk mencegah DoS & N+1 query.',
      'Gunakan gRPC + Protobuf untuk lalu lintas internal antar-microservices berfrekuensi tinggi.'
    ],
    case: 'STUDI KASUS 1 (Modul 1 — Armada Logistik): Backend memantau 50.000 kurir yang mengirim koordinat GPS tiap 3 detik, sementara 2.000 operator memantau peta di browser secara real-time (hanya menerima pembaruan posisi; perintah reroute memakai REST terpisah). Solusi terbaik: gRPC (HTTP/2) untuk ingesti GPS kurir + Server-Sent Events (SSE) untuk streaming ke browser operator. Analisis Trade-off: Komunikasi operator hanya 1 arah (server-to-client) sehingga SSE jauh lebih ringan daripada WebSocket; gRPC memangkas overhead paket seluler. Syarat: Proxy/LB wajib mendukung HTTP/2 agar tidak terkena limit 6 koneksi HTTP/1.1.',
    exercise: {
      scenario: 'Sebuah aplikasi kolaborasi papan tulis (whiteboard) memungkinkan 50 user menggambar dan melihat posisi kursor masing-masing secara simultan.',
      task: 'Tentukan apakah protokol yang tepat adalah SSE, Long Polling, atau WebSockets, dan jelaskan mengapa opsi lainnya kurang tepat.'
    },
    quiz: {
      question: '[Studi Kasus 1] Backend memantau 50.000 kurir GPS tiap 3s dan 2.000 operator hanya menerima peta real-time satu arah di browser (reroute via REST terpisah), dengan target hemat memori LB. Pilihan paling tepat adalah:',
      options: [
        'HTTP Short Polling tiap 1 detik dari browser operator.',
        'WebSockets penuh untuk jalur kurir maupun browser operator.',
        'gRPC (HTTP/2) untuk ingesti GPS kurir dan Server-Sent Events (SSE) untuk streaming peta ke browser operator.',
        'HTTP Long Polling dengan timeout 60 detik pada browser operator.'
      ],
      answer: 2,
      explanation: 'Tepat (Opsi C)! Operator hanya menerima pembaruan satu arah sehingga SSE di atas HTTP/2 lebih ringan daripada WebSocket stateful dan mendukung auto-reconnect bawaan. gRPC + Protobuf menghemat ukuran paket GPS kurir. Opsi A membuang CPU, Opsi B menambah beban stateful 2 arah yang tidak perlu, Opsi D memicu handshake TCP/TLS berulang tiap 3 detik.'
    },
    refs: ['https://grpc.io/docs/what-is-grpc/introduction/']
  },
  {
    id: 'sam03',
    mode: 'sa',
    order: 3,
    track: 'Fondasi Jaringan, Protokol & Trafik',
    title: 'Modul 2: Skalabilitas Dasar, Load Balancing, API Gateway & CDN',
    level: 'Intermediate',
    summary: 'Strategi mengelola pertumbuhan trafik hingga jutaan concurrent users melalui Stateless Horizontal Scaling, L4/L7 Load Balancer, Reverse Proxy/API Gateway (BFF), CDN, dan Studi Kasus 2.',
    concepts: [
      ['Vertical vs Horizontal Scaling', 'Vertical (Scale Up) menaikkan CPU/RAM/NVMe 1 mesin (mentok batas hardware & SPOF). Horizontal (Scale Out) menambah node paralel, yang MEWAJIBKAN layanan bersifat Stateless (state sesi dipindah ke Redis eksternal).'],
      ['Load Balancing L4 vs L7 & Algoritma', 'L4 beroperasi pada paket TCP/UDP (sangat cepat); L7 menginspeksi header/cookie/path HTTP. Algoritma: Round Robin, Weighted RR, Least Connections & Least Response Time (ideal untuk durasi request bervariasi), IP Hash (rentan timpang karena NAT publik), Consistent Hashing (minim perpindahan saat tambah/hapus node).'],
      ['High Availability LB, Reverse Proxy & API Gateway', 'HA LB memakai Active-Passive (Keepalived Floating IP) atau Active-Active (Anycast/DNS). Reverse Proxy (Nginx/HAProxy) menangani SSL, Gzip/Brotli, & sembunyikan topologi. API Gateway (Kong/Envoy/AWS) menangani auth token, rate limit, & pola BFF (Backend for Frontend) untuk mobile vs web.'],
      ['Push vs Pull CDN & Cache Invalidation', 'Push CDN: unggah manual aset jarang berubah. Pull CDN: tarik dari Origin saat cache miss lalu simpan sesuai Cache-Control & TTL. Invalidation: Purge API atau Cache Busting berbasis hash (app.8f9a2c.js).']
    ],
    compare: 'Menggunakan IP Hash Load Balancing untuk mempertahankan sticky session di memori lokal server terlihat mudah, namun hancur ketika ribuan pengguna seluler berbagi satu IP publik NAT.',
    code: {
      language: 'nginx',
      content: `# Konfigurasi Reverse Proxy & Upstream Least Connections + Stateless Architecture
upstream app_cluster {
    least_conn; # Arahkan ke server dengan koneksi aktif paling sedikit
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

server {
    listen 443 ssl http2;
    # Cache Busting untuk aset statis ber-hash
    location ~* \\.[a-f0-9]{6,}\\.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location / {
        proxy_pass http://app_cluster;
    }
}`
    },
    practices: [
      'Selalu simpan data sesi login di klaster eksternal (Redis), jangan pernah di memori RAM proses aplikasi agar autoscaling aman.',
      'Pilih Least Connections ketimbang Round Robin jika waktu eksekusi tiap endpoint sangat bervariasi.',
      'Terapkan Cache Busting (hash nama file) pada build frontend agar CDN bisa menyimpan aset selama 1 tahun penuh tanpa takut file usang.'
    ],
    case: 'STUDI KASUS 2 (Modul 2 — Ketimpangan Sticky Session NAT): 12 server memakai LB L7 IP Hash karena sesi disimpan di RAM lokal. Saat promo, ribuan user seluler dari 1 IP publik NAT masuk bersamaan -> 2 server CPU 100% sementara 10 server lain < 15%. Solusi: Pindahkan state sesi ke klaster Redis terpusat agar server menjadi stateless, lalu ubah algoritma LB ke Least Connections. Trade-off: Menambah 1 network hop (~1-2ms) ke Redis dan butuh HA Redis.',
    exercise: {
      scenario: 'Tim Anda memiliki aplikasi web desktop dan aplikasi mobile iOS/Android yang memanggil microservice backend yang sama, namun mobile butuh payload jauh lebih ringkas.',
      task: 'Jelaskan bagaimana pola BFF (Backend for Frontend) di API Gateway menyelesaikan masalah ini, dan strategi invalidasi cache CDN apa yang dipakai untuk file gambar profil.'
    },
    quiz: {
      question: '[Studi Kasus 2] 12 server mengalami ketimpangan beban (2 server CPU 100%, 10 server <15%) akibat ribuan user seluler berbagi IP publik NAT pada LB IP Hash dengan sticky session di memori lokal. Solusi paling tepat:',
      options: [
        'Mengubah LB ke Round Robin dengan tetap menyimpan sesi di memori lokal server.',
        'Memindahkan penyimpanan sesi ke klaster Redis terpusat agar server stateless, lalu mengubah algoritma LB menjadi Least Connections.',
        'Melakukan Vertical Scaling menggandakan CPU seluruh 12 server.',
        'Memasang CDN di depan endpoint transaksi untuk menahan trafik IP yang sama.'
      ],
      answer: 1,
      explanation: 'Tepat (Opsi B)! Sesi di Redis membuat seluruh node identik (stateless) sehingga Least Connections membagi trafik secara merata tanpa tergantung IP NAT. Opsi A menyebabkan user ter-logout acak, Opsi C tidak memperbaiki ketimpangan distribusi IP NAT, Opsi D keliru karena transaksi & sesi bersifat dinamis personal.'
    },
    refs: ['https://nginx.org/en/docs/http/load_balancing.html']
  },
  {
    id: 'sam04',
    mode: 'sa',
    order: 1,
    track: 'Penyimpanan Data, DB Internals & Caching',
    title: 'Modul 3A: SQL ACID, Isolation Levels & Storage Engine (B-Tree vs LSM-Tree)',
    level: 'Intermediate',
    summary: 'Membedah mesin penyimpanan database: properti ACID, anomali isolation levels (Dirty/Non-Repeatable/Phantom Read), B+Tree vs LSM-Tree SSTables, tipe indeks, PgBouncer, dan Studi Kasus 3.',
    concepts: [
      ['Properti ACID & 4 Isolation Levels', 'ACID: Atomicity, Consistency, Isolation, Durability. Isolation: Read Uncommitted (kena Dirty Read), Read Committed (cegah Dirty Read, kena Non-Repeatable Read), Repeatable Read (cegah Non-Repeatable, kena Phantom Read kecuali MVCC/Snapshot Isolation), Serializable (isolasi serial tertinggi).'],
      ['B-Tree/B+Tree vs LSM-Tree & SSTables', 'B-Tree: pohon seimbang O(log N), optimal untuk point lookup & range query, namun penalti random disk I/O saat write tinggi. LSM-Tree: sequential append ke MemTable + WAL lalu merge/compaction berkala ke SSTables di disk — sangat unggul untuk beban write-heavy.'],
      ['Tipe Indeks & Connection Pooling', 'Clustered Index (urutan fisik baris), Secondary Index, Composite Index (aturan leftmost prefix), dan Covering Index (hasil langsung dari index tanpa menyentuh tabel utama). Connection Pooler (PgBouncer) menggunakan ulang koneksi TCP/proses database yang mahal.']
    ],
    tables: [
      {
        title: 'Anomali Isolation Levels pada RDBMS',
        headers: ['Isolation Level', 'Dirty Read', 'Non-Repeatable Read', 'Phantom Read'],
        rows: [
          ['Read Uncommitted', 'Mungkin Terjadi', 'Mungkin Terjadi', 'Mungkin Terjadi'],
          ['Read Committed', 'Dicegah', 'Mungkin Terjadi', 'Mungkin Terjadi'],
          ['Repeatable Read', 'Dicegah', 'Dicegah', 'Mungkin (Dicegah di MVCC)'],
          ['Serializable', 'Dicegah', 'Dicegah', 'Dicegah']
        ]
      }
    ],
    compare: 'Menambah indeks sekunder secara berlebihan pada B-Tree memang mempercepat SELECT, tetapi membuat setiap operasi INSERT/UPDATE menjadi sangat lambat karena harus mengupdate banyak struktur pohon B-Tree secara acak di disk.',
    code: {
      language: 'sql',
      content: `-- Composite Index mengikuti aturan Leftmost Prefix:
CREATE INDEX idx_orders_user_status_created ON orders (user_id, status, created_at);

-- Query ini BISA memakai index:
SELECT id, total FROM orders WHERE user_id = 42 AND status = 'PAID';

-- Covering Index (Index-Only Scan tanpa membaca heap table):
CREATE INDEX idx_orders_covering ON orders (user_id, status) INCLUDE (total);`
    },
    practices: [
      'Gunakan PgBouncer (transaction pooling mode) di depan PostgreSQL saat menjalankan ratusan microservice/serverless function.',
      'Untuk beban tulis append-only masif (log, sensor IoT, chat history), pilih engine berbasis LSM-Tree.',
      'Susun kolom Composite Index dari kolom kesetaraan (=) paling selektif ke kolom rentang (>, <, BETWEEN).'
    ],
    case: 'STUDI KASUS 3 (Modul 3 — Ingesti Sensor IoT Skala Tinggi): Sistem menerima 85.000 pembacaan meter listrik/detik (append-only write) + query rentang 24 jam terakhir per perangkat. PostgreSQL tunggal dengan 6 secondary index jenuh di disk I/O (latensi tulis > 2 detik). Solusi: Beralih ke database berbasis LSM-Tree (Cassandra atau TimescaleDB berpartisi waktu) & memangkas indeks sekunder yang tidak kritis. Trade-off: Query acak tanpa kunci partisi menjadi lambat dan ada beban background compaction.',
    exercise: {
      scenario: 'Tabel `transactions` punya query utama `WHERE merchant_id = ? AND created_at >= ?` dengan jumlah tulis 30.000 baris/detik.',
      task: 'Rancang indeks komposit yang tepat dan jelaskan mengapa B-Tree tunggal bisa menjadi bottleneck bila ada 8 indeks tambahan.'
    },
    quiz: {
      question: '[Studi Kasus 3] Sistem menerima 85.000 append-only writes/detik dari sensor IoT dan PostgreSQL dengan 6 secondary index mengalami saturasi disk I/O (latensi > 2s). Langkah paling tepat:',
      options: [
        'Menambah 5 Read Replica PostgreSQL untuk membagi beban penulisan sensor.',
        'Beralih ke database bermesin LSM-Tree (seperti Cassandra atau TimescaleDB berpartisi waktu) dan memangkas indeks sekunder tidak kritis.',
        'Melakukan Vertical Partitioning menjadi 10 tabel pada instance PostgreSQL yang sama.',
        'Mengubah level isolasi transaksi ke Serializable.'
      ],
      answer: 1,
      explanation: 'Tepat (Opsi B)! LSM-Tree mengubah penulisan disk acak menjadi sequential append (MemTable + WAL -> SSTable) yang unggul untuk write-heavy 85k ops/s. Opsi A hanya menskalakan baca, Opsi C tetap membebani disk & WAL fisik yang sama, Opsi D memperparah lock contention.'
    },
    refs: ['https://www.postgresql.org/docs/current/transaction-iso.html']
  },
  {
    id: 'sam05',
    mode: 'sa',
    order: 2,
    track: 'Penyimpanan Data, DB Internals & Caching',
    title: 'Modul 3B: NoSQL Spesialis, Replication Quorum (R+W>N), Sharding & Storage',
    level: 'Intermediate',
    summary: 'Memilih database spesialis (Key-Value, Document, Wide-Column, Graph, Time-Series, Vector DB HNSW), mekanisme Replication Quorum R+W>N, Sharding, serta Object vs Block Storage.',
    concepts: [
      ['6 Keluarga NoSQL & Database Spesialis', 'Key-Value (Redis, DynamoDB: sub-ms), Document (MongoDB: JSON/BSON), Wide-Column (Cassandra, ScyllaDB: LSM-Tree lintas DC), Graph (Neo4j: relasi/fraud ring), Time-Series (TimescaleDB, InfluxDB: kompresi kolom + retensi), Search & Vector DB (Elasticsearch, Milvus, pgvector: Inverted Index & HNSW ANN).'],
      ['Strategi Replication & Quorum (R + W > N)', 'Single-Leader: tulis ke Primary, baca ke Read Replicas (hati-hati Replication Lag). Multi-Leader: beberapa penulis lintas wilayah (resolusi konflik LWW/CRDT). Leaderless (Dynamo-style): baca & tulis langsung ke replika dengan syarat konsistensi Quorum: R + W > N.'],
      ['Partitioning / Sharding & Tantangannya', 'Vertical Partitioning (pecah kolom). Horizontal Sharding (pecah baris via Shard Key): Range-based (rentan hotspot), Hash-based (hash(key) % N), Consistent Hashing dengan Virtual Nodes. Tantangan: Cross-shard JOIN lambat, Celebrity Hotspot, & transaksi lintas shard.'],
      ['Object/Blob Storage vs Block Storage', 'Object Storage (Amazon S3, MinIO) untuk file tak terstruktur via HTTP API dengan durabilitas tinggi; Block Storage (AWS EBS) adalah disk mentah berkinerja tinggi untuk OS dan volume DB.']
    ],
    compare: 'Sharding adalah langkah terakhir setelah optimasi query, indexing, caching, dan read replica tidak lagi cukup, karena sharding menghancurkan kemudahan JOIN dan transaksi ACID sederhana.',
    code: {
      language: 'text',
      content: `Rumus Quorum Leaderless (Dynamo-style):
  N = Jumlah total replika (mis. N = 3)
  W = Jumlah node wajib ACK penulisan (mis. W = 2)
  R = Jumlah node yang dibaca (mis. R = 2)

  Syarat Strong Read Consistency: R + W > N  (2 + 2 = 4 > 3)
  -> Minimal 1 node di kelompok R pasti memiliki data versi W terbaru!`
    },
    practices: [
      'Gunakan Shard Key dengan kardinalitas tinggi dan distribusi merata (mis. user_id atau tenant_id dengan hash) untuk mencegah hotspot.',
      'Simpan gambar, video, dan backup dokumen di Object Storage (S3/MinIO) beserta CDN, bukan sebagai BLOB di dalam database SQL.',
      'Untuk AI/RAG semantic search, gunakan Vector DB (pgvector/Milvus) dengan indeks HNSW agar pencarian tetangga terdekat tetap cepat.'
    ],
    case: 'Platform e-commerce mempartisi tabel pesanan berdasarkan tanggal (`Range-based Sharding`). Akibatnya seluruh pesanan hari promo menumpuk di 1 shard bulan berjalan sementara 11 shard bulan sebelumnya menganggur total.',
    exercise: {
      scenario: 'Anda memiliki klaster Dynamo-style dengan N = 5 replika untuk sistem yang memprioritaskan kecepatan penulisan tinggi namun tetap menjamin pembacaan selalu melihat data terbaru.',
      task: 'Tentukan nilai W dan R yang memenuhi aturan Quorum (R + W > N) dan jelaskan trade-off jika Anda memilih W = 1, R = 5.'
    },
    quiz: {
      question: 'Jika sebuah database terdistribusi menggunakan N = 3 replika dengan W = 2 untuk konfirmasi tulis, berapakah minimal R agar pembacaan dijamin menyentuh setidaknya satu replika terbaru?',
      options: [
        'R = 1',
        'R = 2',
        'R = 3 wajib'
      ],
      answer: 1,
      explanation: 'Sesuai rumus Quorum R + W > N: jika N = 3 dan W = 2, maka R = 2 menghasilkan 2 + 2 = 4 > 3, menjamin irisan minimal 1 node terbaru.'
    },
    refs: ['https://cassandra.apache.org/doc/latest/']
  },
  {
    id: 'sam06',
    mode: 'sa',
    order: 3,
    track: 'Penyimpanan Data, DB Internals & Caching',
    title: 'Modul 4: Strategi Caching Berlapis, Eviction & Mitigasi Kegagalan Cache',
    level: 'Intermediate',
    summary: 'Menguasai hierarki cache, 5 strategi baca/tulis (Cache-Aside hingga Write-Behind), Eviction (LRU/LFU/FIFO), serta mitigasi Cache Stampede, Penetration, Avalanche & Studi Kasus 4.',
    concepts: [
      ['Hierarki Lapisan Cache', 'Browser Cache -> CDN Edge -> Reverse Proxy -> Local In-Memory Cache -> Distributed Cache (Redis) -> Database Buffer Pool.'],
      ['5 Strategi Baca & Tulis Cache', 'Cache-Aside (Lazy Loading: app cek cache, miss ambil DB lalu simpan cache). Read-Through (cache layer ambil dari DB secara transparan). Write-Through (tulis cache & DB sinkron). Write-Behind/Write-Back (balas klien cepat dari cache, flush async batch ke DB — berisiko hilang jika node mati). Write-Around (tulis langsung ke DB agar cache tidak tercemar data jarang dibaca).'],
      ['Eviction Policies', 'LRU (Least Recently Used: buang yang paling lama tak diakses), LFU (Least Frequently Used: buang frekuensi akses terendah), FIFO (First-In First-Out: urutan masuk tertua).'],
      ['3 Kegagalan Cache & Mitigasinya', '1) Cache Stampede (Thundering Herd): 1 kunci populer expired diserbu ribuan request -> Mitigasi: Singleflight / Request Coalescing / Distributed Mutex. 2) Cache Penetration: request mencari ID tak pernah ada -> Mitigasi: Bloom Filter atau negative caching (null TTL singkat). 3) Cache Avalanche: ribuan kunci expired serentak -> Mitigasi: TTL Jitter acak + HA Redis Cluster.']
    ],
    compare: 'Memilih Write-Behind memang memberi latensi tulis super rendah, namun tidak cocok untuk saldo finansial karena crash node Redis sebelum flush mengakibatkan kehilangan transaksi yang sudah dibalas sukses ke user.',
    code: {
      language: 'go',
      content: `// Contoh pola Singleflight (Request Coalescing) di Go mencegah Cache Stampede
var g singleflight.Group

func GetFlashProduct(ctx context.Context, key string) (*Product, error) {
    if cached, ok := redisGet(ctx, key); ok {
        return cached, nil
    }
    // Jika ribuan goroutine miss bersamaan pada 'key' yang sama,
    // hanya 1 pemanggil yang mengeksekusi query DB; sisanya menunggu & berbagi hasil!
    val, err, _ := g.Do(key, func() (interface{}, error) {
        prod, err := dbQueryProduct(ctx, key)
        if err == nil {
            // Tambahkan Random Jitter pada TTL untuk mencegah Cache Avalanche
            ttl := 300*time.Second + time.Duration(rand.Intn(60))*time.Second
            redisSet(ctx, key, prod, ttl)
        }
        return prod, err
    })
    if err != nil {
        return nil, err
    }
    return val.(*Product), nil
}`
    },
    practices: [
      'Gunakan Singleflight atau mutex terdistribusi untuk kunci panas (hot keys) agar database tidak tumbang saat cache expired.',
      'Tambahkan random TTL jitter (misal 300s + random(0..60s)) saat mengisi cache massal.',
      'Pasang Bloom Filter atau simpan marker null ber-TTL 15–30 detik untuk menangkis serangan Cache Penetration pada ID acak.'
    ],
    case: 'STUDI KASUS 4 (Modul 4 — Runtuhnya DB Saat Kunci Promo Kedaluwarsa): Tepat pukul 12:00, kunci Redis `product:flash_12` yang diakses 150.000 user expired -> puluhan ribu request miss menghantam DB serentak dan menghabiskan connection pool (Cache Stampede). Solusi: Terapkan Singleflight / Distributed Lock saat miss disertai TTL Jitter. Trade-off: Menambah sedikit kompleksitas penanganan lock timeout pada kode aplikasi.',
    exercise: {
      scenario: 'Bot penyerang mengirim 10.000 request/detik mencari `/api/products/-99999` (ID negatif yang tidak pernah ada di DB), melewati Redis dan melumpuhkan PostgreSQL.',
      task: 'Jelaskan nama fenomena kegagalan cache ini dan dua cara mitigasinya secara berlapis.'
    },
    quiz: {
      question: '[Studi Kasus 4] Saat kunci Redis `product:flash_12` yang diakses 150.000 user kedaluwarsa pukul 12:00, ribuan request bersamaan menghantam DB utama (Cache Stampede). Solusi terbaik:',
      options: [
        'Menghapus TTL seluruh kunci Redis agar tidak pernah kedaluwarsa.',
        'Menerapkan pola Write-Around Cache.',
        'Menerapkan Singleflight / Distributed Lock saat cache miss disertai TTL Jitter.',
        'Memasang Bloom Filter di depan Redis.'
      ],
      answer: 2,
      explanation: 'Tepat (Opsi C)! Singleflight memastikan hanya 1 request pemimpin yang mengambil ulang data dari DB sementara sisanya menunggu hasil di memori; TTL Jitter mencegah kunci lain kedaluwarsa di detik yang sama. Opsi A memenuhi RAM & data basi, Opsi B hanya mengatur write, Opsi D khusus mencegah Cache Penetration (ID yang tidak pernah ada).'
    },
    refs: ['https://redis.io/docs/latest/develop/use/patterns/']
  },
  {
    id: 'sam07',
    mode: 'sa',
    order: 1,
    track: 'Sistem Terdistribusi, Konsensus & Event-Driven',
    title: 'Modul 5: CAP/PACELC, Konsistensi, Konsensus, Fencing Tokens & Snowflake ID',
    level: 'Advanced',
    summary: 'Memahami batasan fisika jaringan: CAP & PACELC Theorem, spektrum konsistensi, Raft/Paxos/ZAB, Distributed Locks + Fencing Tokens, Logical Clocks, Idempotency, Snowflake ID & Studi Kasus 5.',
    concepts: [
      ['CAP & PACELC Theorem', 'CAP: Saat terjadi Network Partition (P), sistem memilih Consistency (C) atau Availability (A). PACELC: Jika Partition (P) pilih A atau C; Else (E) saat normal tetap memilih Latency (L) rendah atau Consistency (C) ketat.'],
      ['Spektrum Model Konsistensi', 'Strong Consistency (Linearizability: baca langsung lihat nilai tulis terbaru), Sequential (urutan operasi seragam), Causal (hubungan sebab-akibat terjaga), Eventual (akhirnya sama; perkuat dengan Read-Your-Writes & Monotonic Reads).'],
      ['Algoritma Konsensus & Distributed Locks + Fencing Tokens', 'Raft, Paxos, ZAB memakai mayoritas kuorum floor(N/2)+1 untuk memilih leader (etcd, Consul, ZooKeeper). Distributed Lock Redis wajib memakai Fencing Token (angka monotonik naik tiap lock terbit) agar proses yang tertunda GC pause tidak menimpa data pemegang lock terbaru.'],
      ['Logical Clocks, Idempotency & Unique ID Generator', 'NTP clock drift membuat jam fisik tak andal -> pakai Lamport Timestamps, Vector Clocks, atau Hybrid Logical Clocks (HLC). Idempotency Key mencegah eksekusi ganda saat retry. ID Unik: UUIDv4 (acak -> fragmentasi B-Tree), UUIDv7/ULID (terurut waktu), Twitter Snowflake 64-bit (1 sign + 41 timestamp + 10 datacenter/worker + 12 sequence = 4096 ID/ms/mesin).']
    ],
    compare: 'Mengandalkan `SET key uuid NX PX 10000` di Redis tanpa Fencing Token tidak melindungi database dari klien yang mengalami jeda Garbage Collection selama 14 detik lalu terbangun dan menulis transaksi ganda.',
    code: {
      language: 'text',
      content: `Twitter Snowflake 64-bit ID Layout:
[ 1 bit sign (0) ] [ 41 bits timestamp ms ] [ 10 bits datacenter+worker ID ] [ 12 bits sequence (0..4095) ]

Mekanisme Fencing Token mencegah GC Pause Double-Spend:
1. Worker-1 dapat Lock + Token #33 -> Worker-1 mengalami GC Pause 14 detik!
2. TTL Lock habis di detik 10 -> Worker-2 dapat Lock + Token #34 -> Tulis ke DB (DB catat last_token = 34).
3. Worker-1 bangun di detik 15, kirim tulis dengan Token #33 -> DB TOLAK karena 33 < 34!`
    },
    practices: [
      'Gunakan UUIDv7 atau ULID alih-alih UUIDv4 jika PK tabel SQL menggunakan B-Tree untuk mencegah fragmentasi page.',
      'Jangan pernah berasumsi dua server memiliki jam dinding yang sama persis; gunakan sequence/logical clock untuk menentukan urutan transaksi.',
      'Jika memakai Distributed Lock untuk mutasi finansial, wajib validasi Fencing Token atau Optimistic Locking di lapisan storage.'
    ],
    case: 'STUDI KASUS 5 (Modul 5 — Double Debit akibat GC Pause): Worker-1 mendapat lock Redis 10s lalu mengalami jeda GC 14s. Pada detik 11, Worker-2 mengambil lock dan memproses transfer. Detik 15, Worker-1 bangun dan memproses transfer kedua! Solusi: Gunakan Fencing Tokens (nomor urut monotonik) yang divalidasi oleh database sebelum transaksi ditulis. Trade-off: Storage tujuan harus menyimpan nomor token terakhir dan melakukan validasi atomik.',
    exercise: {
      scenario: 'Sebuah tabel PostgreSQL menggunakan UUIDv4 sebagai Primary Key dan mulai mengalami penurunan drastis kecepatan INSERT di ukuran 50 juta baris.',
      task: 'Jelaskan mengapa UUIDv4 memperlambat B-Tree dan bagaimana transisi ke UUIDv7/ULID atau Snowflake 64-bit memperbaikinya.'
    },
    quiz: {
      question: '[Studi Kasus 5] Worker-1 mengalami jeda GC 14 detik melampaui TTL lock Redis 10 detik, sehingga ia bangun dan mengeksekusi transfer ganda setelah Worker-2 selesai. Solusi paling aman:',
      options: [
        'Memperpanjang TTL lock Redis dari 10 detik menjadi 60 detik.',
        'Menggunakan Fencing Tokens (nomor urut monotonik) yang divalidasi oleh database sebelum transaksi ditulis.',
        'Mengubah sistem menjadi AP (Availability) agar kedua transaksi diterima.',
        'Menggunakan nilai acak UUIDv4 sebagai identitas pemilik lock di Redis.'
      ],
      answer: 1,
      explanation: 'Tepat (Opsi B)! Fencing Token membuat storage/database menolak penulisan dari Worker-1 yang membawa token lama (#33) setelah menerima token lebih baru (#34). Opsi A tetap gagal jika GC > 60s, Opsi C melegalkan double spending, Opsi D hanya mencegah Worker-1 menghapus kunci Redis milik Worker-2.'
    },
    refs: ['https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html']
  },
  {
    id: 'sam08',
    mode: 'sa',
    order: 2,
    track: 'Sistem Terdistribusi, Konsensus & Event-Driven',
    title: 'Modul 6: Event-Driven, Kafka vs Queue, Transactional Outbox & CDC',
    level: 'Intermediate',
    summary: 'Memisahkan produsen & konsumen proses: Message Queue vs Event Streaming, Delivery Semantics (EOS), Transactional Outbox Pattern, CDC Debezium, Flink vs Spark, Lambda vs Kappa & Studi Kasus 6.',
    concepts: [
      ['Message Queue vs Event Streaming', 'Message Queue (RabbitMQ, Amazon SQS): pola Point-to-Point / Competing Consumers; pesan dihapus setelah ACK. Event Streaming (Apache Kafka, Pulsar): Distributed Append-Only Commit Log persisten berdasarkan retensi; banyak Consumer Group membaca aliran sama dengan melacak offset masing-masing.'],
      ['Delivery Semantics (At-Most, At-Least, Exactly-Once)', 'At-Most-Once: kirim tanpa retry (cepat, bisa hilang). At-Least-Once: retry sampai ACK (tidak hilang, berpotensi duplikat). Exactly-Once Semantics (EOS): dicapai dengan kombinasi At-Least-Once + Idempotent Consumer + Transactional Outbox.'],
      ['Transactional Outbox & Change Data Capture (CDC)', 'Transactional Outbox: simpan data bisnis & rekaman event ke tabel `outbox` dalam 1 transaksi ACID lokal untuk menghindari Dual-Write. CDC (Debezium): membaca PostgreSQL WAL / MySQL Binlog dan mengalirkan perubahan baris menjadi event Kafka secara real-time.'],
      ['Batch vs Stream & Lambda vs Kappa', 'Batch (Spark) untuk data statis throughput tinggi; Stream (Flink, Kafka Streams) memproses aliran dalam ms dengan Tumbling/Sliding/Session Windows & Watermarks (data terlambat). Lambda pisah jalur batch + speed; Kappa menyatukan semuanya sebagai replayable stream.']
    ],
    compare: 'Melakukan `COMMIT` database lalu langsung memanggil `kafka.produce()` di kode aplikasi (Dual-Write) pasti akan mengalami inkonsistensi saat jaringan putus di antara dua pemanggilan tersebut.',
    code: {
      language: 'sql',
      content: `-- Transactional Outbox Pattern dalam 1 transaksi ACID lokal:
BEGIN;
  INSERT INTO orders (id, user_id, total, status)
  VALUES ('ord_101', 'usr_55', 250000, 'CREATED');

  INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload)
  VALUES ('evt_901', 'Order', 'ord_101', 'OrderCreated', '{"orderId":"ord_101","total":250000}');
COMMIT;
-- Debezium (CDC) membaca WAL PostgreSQL dari tabel outbox_events -> kirim ke Kafka secara asinkron!`
    },
    practices: [
      'Jangan pernah memakai Two-Phase Commit (2PC) melintasi Database SQL dan Kafka; gunakan Transactional Outbox + CDC.',
      'Pastikan setiap Consumer Kafka bersifat Idempotent dengan mencatat `event_id` yang sudah diproses.',
      'Gunakan Watermarks saat melakukan window aggregation di Flink agar event yang datang terlambat dari jaringan mobile tetap terhitung akurat.'
    ],
    case: 'STUDI KASUS 6 (Modul 6 — Masalah Dual-Write Order & Kafka): Pada 0,2% transaksi, COMMIT PostgreSQL berhasil tetapi kirim ke Kafka gagal akibat glitch jaringan, sehingga gudang tidak pernah mengirim barang. Solusi: Terapkan Transactional Outbox Pattern + CDC (Debezium) + Idempotent Consumer. Trade-off: Menambah latensi pengiriman beberapa puluh ms dan komponen konektor CDC.',
    exercise: {
      scenario: 'Sebuah layanan pembayaran harus memperbarui status invoice menjadi PAID di MySQL dan memicu email struk + poin loyalty di service lain.',
      task: 'Gambarkan alur tabel `outbox`, CDC Binlog, dan bagaimana service loyalty menangani potensi event duplikat.'
    },
    quiz: {
      question: '[Studi Kasus 6] Layanan Order kadang sukses COMMIT ke PostgreSQL namun gagal menerbitkan event OrderCreated ke Kafka akibat gangguan jaringan sesaat (masalah Dual-Write). Solusi paling andal:',
      options: [
        'Mengirim event ke Kafka sebelum menjalankan perintah COMMIT PostgreSQL.',
        'Menerapkan Transactional Outbox Pattern dengan Change Data Capture (CDC) dan Idempotent Consumer.',
        'Menggunakan Two-Phase Commit (2PC) antara PostgreSQL dan broker Kafka.',
        'Mengubah pengaturan produser Kafka menjadi acks=0.'
      ],
      answer: 1,
      explanation: 'Tepat (Opsi B)! Menyimpan order dan outbox event dalam 1 transaksi ACID menjamin keduanya tersimpan atomik, lalu CDC menerbitkannya ke Kafka (At-Least-Once) dan konsumen menyaring duplikat. Opsi A memicu phantom order jika DB rollback, Opsi C tidak didukung native Kafka, Opsi D memperparah kehilangan pesan.'
    },
    refs: ['https://microservices.io/patterns/data/transactional-outbox.html']
  },
  {
    id: 'sam09',
    mode: 'sa',
    order: 1,
    track: 'Microservices, Ketahanan, Keamanan & Observabilitas',
    title: 'Modul 7: Microservices, Saga/CQRS, Circuit Breaker, Bulkhead & Rate Limiting',
    level: 'Advanced',
    summary: 'Merancang batas layanan bersih dan isolasi kegagalan: Evolusi arsitektur, Service Mesh, Saga Pattern, CQRS/Event Sourcing, Circuit Breaker, Bulkhead, Rate Limiting & Studi Kasus 7.',
    concepts: [
      ['Evolusi Arsitektur & Service Mesh', 'Monolith -> Modular Monolith (mulailah dari sini!) -> Microservices -> Serverless (FaaS). Service Discovery (Kubernetes DNS/Consul) & Service Mesh (Istio/Linkerd menyuntikkan Envoy Sidecar Proxy untuk mTLS, observability, dan traffic routing di luar kode app).'],
      ['Transaksi Terdistribusi: Saga, CQRS & Event Sourcing', 'Saga mengganti 2PC dengan transaksi lokal berurutan + Compensating Transactions mundur jika gagal (Choreography via event vs Orchestration via koordinator). CQRS memisahkan model Command (tulis) vs Query (baca). Event Sourcing menyimpan seluruh riwayat perubahan state.'],
      ['Pola Ketahanan (Resilience & Fault Tolerance)', 'Circuit Breaker (Closed -> Open fail-fast -> Half-Open uji pemulihan). Retry Exponential Backoff + Jitter (mencegah retry storm). Bulkhead Isolation (pisahkan thread/connection pool per layanan hilir). Graceful Degradation & Load Shedding.'],
      ['5 Algoritma Rate Limiting', 'Token Bucket (izinkan burst terukur), Leaky Bucket (laju keluar konstan), Fixed Window Counter, Sliding Window Log, dan Sliding Window Counter.']
    ],
    compare: 'Memperbesar thread pool dari 200 menjadi 5.000 untuk mengatasi layanan pihak ketiga yang melambat justru melumpuhkan server akibat Out-of-Memory dan CPU context switching. Bulkhead + Timeout pendek + Circuit Breaker adalah solusi sejati.',
    code: {
      language: 'text',
      content: `Siklus Circuit Breaker:
  [ CLOSED ] --(Error rate > ambang batas)--> [ OPEN (Fail-Fast < 1ms) ]
       ^                                                |
       |                                        (Setelah cooldown timer)
       +--(Uji request sukses)-- [ HALF-OPEN ] <--------+

Bulkhead Isolation:
  Checkout Service Pool (Total 200 threads):
    ├── Core Cart/Order Pool : 140 threads (Terlindungi!)
    └── External Tax API Pool:  30 threads (Terisolasi, timeout 2s)
    └── Promo/Recommend Pool :  30 threads (Bisa degrade gracefully)`
    },
    practices: [
      'Mulai proyek baru sebagai Modular Monolith dengan batas domain tegas; pecah ke Microservices hanya bila skala tim dan deployment independen memaksa.',
      'Jangan pernah memanggil layanan eksternal tanpa timeout yang ketat (mis. 1.5s–2s) dan mekanisme fallback/degradation.',
      'Gunakan Token Bucket di API Gateway bila perlu menoleransi lonjakan singkat trafik sah, atau Sliding Window Counter untuk akurasi hemat memori.'
    ],
    case: 'STUDI KASUS 7 (Modul 7 — Kegagalan Berantai Layanan Pajak): Layanan Checkout memanggil API pajak eksternal dengan timeout 30s; saat API pajak melambat menjadi 28s, seluruh thread pool Checkout habis dalam 2 menit dan melumpuhkan fitur login & keranjang! Solusi: Terapkan Circuit Breaker, pangkas timeout ke 2 detik, isolasi pool dengan Bulkhead Pattern, dan sediakan Graceful Degradation (tarif pajak estimasi sementara + rekonsiliasi background).',
    exercise: {
      scenario: 'Sebuah alur reservasi travel memesan Pesawat -> Hotel -> Mobil sewaan lintas 3 microservice berbeda; pemesanan Mobil gagal pada langkah ke-3.',
      task: 'Rancang alur kompensasi Saga (Orchestration) yang membatalkan pemesanan Hotel dan Pesawat secara berurutan, dan jelaskan mengapa 2PC tidak disarankan.'
    },
    quiz: {
      question: '[Studi Kasus 7] Layanan Checkout lumpuh total (termasuk login & keranjang) karena menunggu API pajak eksternal yang melambat ke 28 detik (timeout 30s). Solusi paling tepat:',
      options: [
        'Menambahkan Retry otomatis 5 kali tanpa jeda saat panggilan gagal.',
        'Memperbesar thread pool dari 200 menjadi 5.000 thread.',
        'Menerapkan Circuit Breaker, memangkas timeout menjadi 2 detik, mengisolasi sumber daya dengan Bulkhead Pattern, dan memakai Graceful Degradation.',
        'Memasang Service Mesh dengan konfigurasi timeout default 30 detik.'
      ],
      answer: 2,
      explanation: 'Tepat (Opsi C)! Timeout 2s membebaskan thread cepat, Bulkhead melindungi thread login/keranjang, Circuit Breaker memutus panggilan saat rusak (fail-fast), dan Graceful Degradation menjaga transaksi tetap selesai. Opsi A memicu retry storm, Opsi B memicu OOM, Opsi D tetap menyandera thread selama 30 detik.'
    },
    refs: ['https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker']
  },
  {
    id: 'sam10',
    mode: 'sa',
    order: 2,
    track: 'Microservices, Ketahanan, Keamanan & Observabilitas',
    title: 'Modul 8: Keamanan, 3 Pilar Observabilitas, Strategi Rilis & Disaster Recovery',
    level: 'Intermediate',
    summary: 'Menjamin sistem aman, mudah didiagnosis di 18+ microservices, dan tahan bencana: OAuth2/OIDC, JWT vs Opaque, Structured Logging, RED/USE Metrics, OpenTelemetry Tracing, Canary, RTO/RPO & Studi Kasus 8.',
    concepts: [
      ['Keamanan Arsitektur & Kontrol Akses', 'OAuth 2.0 & OIDC. JWT Stateless (verifikasi cepat tanpa DB, sulit di-revoke sebelum expired) vs Opaque Session Token Stateful (bisa dicabut instan dari Redis). Kontrol akses RBAC vs ABAC. Pertahanan luar: WAF, DDoS Anycast, TLS 1.3 (in-transit), AES-256 (at-rest), HashiCorp Vault.'],
      ['3 Pilar Observabilitas (Logs, Metrics, Tracing)', '1) Structured Logging: format JSON berfield standar (timestamp, level, service, trace_id, duration_ms) + PII masking. 2) Metrics (Prometheus/Grafana): metode RED (Rate, Errors, Duration P95/P99) untuk layanan & USE (Utilization, Saturation, Errors) untuk infrastruktur. 3) Distributed Tracing: OpenTelemetry propagasi header traceparent.'],
      ['Strategi Rilis Zero-Downtime', 'Rolling Update, Blue-Green Deployment (2 env identik dengan switch instan), Canary Release (alirkan 1%-5% trafik dulu), dan Feature Flags (pisahkan deployment kode dari rilis fitur).'],
      ['Disaster Recovery (RTO, RPO & Multi-Region)', 'RTO (Recovery Time Objective: batas lama sistem boleh mati). RPO (Recovery Point Objective: batas maksimal kehilangan data dalam waktu). Topologi: Active-Passive (Warm Standby / Pilot Light) vs Active-Active (kedua region melayani aktif bersamaan).']
    ],
    compare: 'Menaikkan level log ke DEBUG pada file teks lokal di 18 microservices ketika CPU rendah (<30%) namun latensi 9 detik hanya memenuhi disk tanpa pernah menunjukkan titik keterlambatan lintas layanan.',
    code: {
      language: 'json',
      content: `// Contoh Structured Logging JSON + Propagasi OpenTelemetry traceparent
{
  "timestamp": "2026-11-19T12:04:11.452Z",
  "level": "INFO",
  "service": "report-aggregator",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "user_id_masked": "usr_***92",
  "duration_ms": 1420,
  "downstream_call": "inventory-service",
  "status_code": 200
}`
    },
    practices: [
      'Wajibkan propagasi header `traceparent` (OpenTelemetry) di seluruh HTTP client, gRPC interceptor, dan Kafka message headers.',
      'Pantau persentil P95 dan P99 pada metrik RED untuk mendeteksi degradasi sebelum pelanggan komplain.',
      'Definisikan target RTO dan RPO tertulis bersama tim bisnis sebelum memilih strategi replikasi Multi-Region.'
    ],
    case: 'STUDI KASUS 8 (Modul 8 — Diagnosis Latensi 9 Detik di 18 Microservices): Pembuatan laporan memakan 9s (target SLA < 1,5s), semua CPU < 30%, dan log masih berupa teks lokal biasa. Solusi: Terapkan Distributed Tracing (OpenTelemetry) dengan propagasi Trace ID serta agregasi Structured Logging. Analisis: CPU rendah dengan latensi tinggi menandakan I/O wait, antrean lock, atau N+1 calls; diagram waterfall Tracing langsung mengungkap span mana yang paling lambat. Trade-off: Biaya penyimpanan telemetri (diatasi dengan tail-based sampling).',
    exercise: {
      scenario: 'Sebuah aplikasi perbankan mensyaratkan sesi login bisa langsung dicabut seketika saat nasabah melapor ponselnya hilang, dengan target RPO maksimal 0 detik dan RTO < 5 menit.',
      task: 'Tentukan jenis token (JWT vs Opaque Session), topologi DR yang sesuai, dan jelaskan alasannya.'
    },
    quiz: {
      question: '[Studi Kasus 8] Pembuatan laporan memakan waktu 9 detik melintasi 18 microservices padahal CPU seluruh server < 30%. Langkah diagnosis paling tepat:',
      options: [
        'Mengaktifkan log level DEBUG di seluruh 18 layanan dan memeriksa file log lokal satu per satu.',
        'Mengimplementasikan Distributed Tracing (OpenTelemetry) dengan propagasi Trace ID lintas layanan serta agregasi Structured Logging.',
        'Menambahkan Auto-Scaling berbasis CPU pada seluruh layanan.',
        'Mengganti token autentikasi menjadi JWT berukuran besar berisi profil lengkap pengguna.'
      ],
      answer: 1,
      explanation: 'Tepat (Opsi B)! CPU rendah dengan latensi tinggi menandakan I/O wait, lock wait, atau panggilan N+1 berantai. Waterfall Distributed Tracing langsung menunjuk service/query penyebab 9 detik. Opsi A membebani disk I/O tanpa korelasi, Opsi C tidak terpicu karena CPU < 30%, Opsi D memperbesar header HTTP tanpa mengukur latensi.'
    },
    refs: ['https://opentelemetry.io/docs/']
  },
  {
    id: 'sam11',
    mode: 'sa',
    order: 1,
    track: 'Kerangka Desain 4-Langkah & Studi Kasus Klasik',
    title: 'Modul 9A: Kerangka Desain 4 Langkah, Estimasi QPS & 8 Studi Kasus Klasik',
    level: 'Advanced',
    summary: 'Menguasai kerangka wawancara/perancangan System Design 4 langkah, rumus estimasi Back-of-the-Envelope (Average & Peak QPS), dan peta lengkap 8 arsitektur sistem klasik dunia.',
    concepts: [
      ['1. Klarifikasi & Estimasi (Back-of-the-Envelope)', 'Tetapkan Functional & Non-Functional Requirements (availability, target latensi P99, model konsistensi), lalu hitung: Average QPS = (DAU * Request per User per Hari) / 86.400, dan Peak QPS ~= 2x hingga 10x Average QPS untuk event khusus.'],
      ['2. High-Level Design (HLD)', 'Rancang blok komponen utama, definisi kontrak endpoint API, pemilihan jenis database (SQL vs NoSQL/Vector/Time-series), dan skema inti.'],
      ['3. Deep Dive & Resolusi Bottleneck', 'Identifikasi titik jenuh (SPOF, hot partition, lock contention) lalu terapkan strategi scaling, caching, sharding, atau pemrosesan asinkron.'],
      ['4. Evaluasi Trade-Off Eksplisit', 'Jelaskan secara terbuka variabel apa yang dikorbankan (latensi vs konsistensi, kompleksitas operasional vs throughput) dari setiap keputusan desain.']
    ],
    tables: [
      {
        title: 'Peta 8 Studi Kasus Klasik Arsitektur Sistem',
        headers: ['Studi Kasus', 'Tantangan Teknis Dominan', 'Pola & Teknologi Kunci'],
        rows: [
          ['URL Shortener (TinyURL)', 'Rasio baca:tulis 100:1, kode pendek unik bebas tabrakan', 'Base62 Encoding, KGS / Counter, Redis Cache, DB Sharding'],
          ['Social Feed (Twitter/X)', 'Distribusi fan-out dari akun berjuta-juta pengikut', 'Hybrid Push/Pull Fan-out, Redis Timeline Cache, Kafka Queue'],
          ['Chat Real-Time (WhatsApp)', 'Jutaan koneksi TCP persisten, status online/typing, pesan offline', 'WebSockets, Stateful Chat Gateway, Service Discovery, Cassandra, Push Notification'],
          ['Ride-Hailing (Uber/Gojek)', 'Update koordinat GPS tiap detik, pencarian terdekat latensi rendah', 'Geohash / QuadTree / Google S2 Geometry, In-Memory Geospatial Index, WebSockets'],
          ['Video Streaming (YouTube)', 'Unggah file GB, konversi lintas resolusi, distribusi global', 'Chunked Upload, DAG Transcoding Workers, HLS/DASH Adaptive Bitrate, CDN'],
          ['Flash Sale / Ticketing', 'Konkurensi ekstrem stok terbatas (overselling haram mutlak)', 'Virtual Waiting Room, Redis Atomic Lua Script (TTL), Kafka Load Leveling'],
          ['Sistem Pembayaran / Wallet', 'Akurasi finansial mutlak, perlindungan eksekusi ganda', 'Double-Entry Ledger, Idempotency Key, Saga Orchestration, Audit Log'],
          ['Cloud Storage (Google Drive)', 'Sinkronisasi efisien file besar saat sebagian kecil isi berubah', 'File Chunking, Content-Defined Chunking (CDC), Delta Sync, Metadata DB + Object Storage']
        ]
      }
    ],
    compare: 'Pemula langsung menggambar kotak arsitektur tanpa mengklarifikasi QPS, rasio baca:tulis, atau target P99. Arsitek senior selalu memulai dari perhitungan kapasitas untuk menjustifikasi apakah sistem butuh single PostgreSQL atau sharding + Redis.',
    code: {
      language: 'text',
      content: `Rumus Estimasi Kapasitas (Back-of-the-Envelope):
  Average QPS = (DAU x Request per User per Hari) / 86.400 detik
  Peak QPS   ~= 2 x Average QPS  (hingga 10 x Average QPS saat Flash Sale / Event)

Contoh Hitungan Cepat (TinyURL):
  100 Juta URL baru/bulan -> ~38 Write/detik -> Peak ~100 Write/s
  Rasio Baca:Tulis 100:1  -> 3.800 Read/detik -> Peak ~10.000 Read/s
  Kesimpulan: Sangat berat di Baca -> Cache Redis (80-20 rule) + Read Replicas sangat efektif!`
    },
    practices: [
      'Gunakan angka pembulatan 86.400 detik/hari (~100.000 untuk hitungan lisan cepat) saat melakukan estimasi QPS.',
      'Untuk Social Feed, terapkan Hybrid Fan-out: Fan-out-on-Write (Push) untuk user normal dan Fan-out-on-Read (Pull) khusus akun selebriti berjuta follower.',
      'Untuk Google Drive/Dropbox, pecah file besar dengan Content-Defined Chunking (CDC) agar perubahan 1 halaman hanya mengunggah 1 chunk delta.'
    ],
    case: 'Pada perancangan sistem Ride-Hailing seperti Gojek/Uber, melakukan query SQL `WHERE distance(lat, lng) < 3km` di seluruh baris tabel pengemudi setiap detik akan melumpuhkan database. Memetakan lokasi ke sel **Geohash / Google S2** di memori memangkas pencarian pengemudi terdekat menjadi sub-10ms.',
    exercise: {
      scenario: 'Anda diminta merancang sistem URL Shortener untuk 50 juta DAU, dengan rata-rata tiap user membuka 5 link/hari dan membuat 1 link baru per 10 hari.',
      task: 'Hitung Average Read QPS, Average Write QPS, Peak QPS, serta jelaskan bagaimana Key Generation Service (KGS) dan Base62 mencegah tabrakan kode.'
    },
    quiz: {
      question: 'Mengapa pada desain Social Feed (Twitter/X) digunakan strategi Hybrid Push/Pull Fan-out alih-alih Push murni untuk semua akun?',
      options: [
        'Karena Kafka tidak mendukung lebih dari 1.000 pesan per detik.',
        'Karena Push murni pada akun selebriti dengan 50 juta pengikut memicu badai penulisan jutaan entri cache (Celebrity Problem) sekaligus.',
        'Karena database SQL tidak bisa menyimpan teks postingan.'
      ],
      answer: 1,
      explanation: 'Akun selebriti akan memaksa sistem menulis ke 50 juta timeline Redis sekaligus setiap kali ia memposting satu kalimat; Pull saat dibaca khusus akun selebriti mengatasi bottleneck ini.'
    },
    refs: []
  },
  {
    id: 'sam12',
    mode: 'sa',
    order: 2,
    track: 'Kerangka Desain 4-Langkah & Studi Kasus Klasik',
    title: 'Modul 9B: Studi Kasus Ekstrem — Tiket Konser 1 Juta Pengguna dalam 1 Menit',
    level: 'Advanced',
    summary: 'Bedah mendalam Studi Kasus 9: Merancang penjualan 20.000 tiket konser saat 1.000.000 pengguna menekan beli pada detik yang sama tanpa overselling dan adil.',
    concepts: [
      ['Skenario & Constraint Ketat', '20.000 tiket dibuka pukul 10:00; 1.000.000 pengguna menekan beli di detik pertama. Dilarang keras overselling, wajib menjaga urutan antrean masuk adil, dan memberi batas waktu pembayaran 5 menit sebelum tiket kembali ke stok.'],
      ['Lapisan 1: Virtual Waiting Room di Edge', 'Meredam gelombang 1.000.000 request di lapisan terdepan menjadi aliran bertahap (misal 4.000 user/detik) sesuai kapasitas pemrosesan internal sambil menjaga urutan antrean tiket.'],
      ['Lapisan 2: Redis Atomic Lua Script (TTL 5 Menit)', 'Mengeksekusi pengecekan dan pengurangan stok secara atomik single-threaded di memori dalam mikrodetik tanpa overselling, serta memanfaatkan TTL 5 menit untuk melepas stok otomatis jika user gagal bayar.'],
      ['Lapisan 3: Async DB ACID Settlement & Rekonsiliasi', 'Mengalirkan pemenang reservasi ke Kafka untuk pencatatan persisten ACID di Primary DB serta rekonsiliasi ketat dengan webhook gateway pembayaran.']
    ],
    compare: 'Mengarahkan 1.000.000 request langsung melakukan `SELECT ... FOR UPDATE` pada 1 baris stok di PostgreSQL langsung melumpuhkan database akibat antrean row lock masif. NoSQL Eventual Consistency juga haram karena melegalkan overselling.',
    code: {
      language: 'lua',
      content: `-- Redis Atomic Lua Script untuk Reservasi Tiket Anti-Overselling (Dieksekusi single-threaded atomik)
-- KEYS[1] = "ticket:stock:vip", KEYS[2] = "ticket:hold:usr_123"
-- ARGV[1] = jumlah_tiket (1), ARGV[2] = hold_ttl_detik (300)

local current_stock = tonumber(redis.call("GET", KEYS[1]) or "0")
local qty = tonumber(ARGV[1])

if current_stock < qty then
  return 0 -- Stok habis, tolak seketika tanpa menyentuh PostgreSQL!
end

redis.call("DECRBY", KEYS[1], qty)
redis.call("SET", KEYS[2], qty, "EX", tonumber(ARGV[2]))
return 1 -- Berhasil hold selama 5 menit (300 detik)`
    },
    practices: [
      'Gunakan Virtual Waiting Room + Rate Limiter sebelum aplikasi agar lonjakan 1 juta klik tidak membanjiri API server.',
      'Eksekusi cek-dan-kurangi stok dalam satu Redis Lua Script agar atomik tanpa race condition.',
      'Sinkronkan kedaluwarsa hold Redis (5 menit) dengan timer invoice payment gateway dan jalankan rekonsiliasi jika webhook tiba terlambat.'
    ],
    case: 'STUDI KASUS 9 (Modul 9 — Tiket Konser 1 Juta User): Menggabungkan Virtual Waiting Room + Redis Lua Script (TTL 5 menit) + Async DB ACID settlement memungkinkan sistem menangani 1.000.000 peminat dengan 0 kasus overselling. Trade-off: Arsitektur multi-tahap menuntut rekonsiliasi ketat antara masa berlaku hold Redis dan webhook settlement pembayaran.',
    exercise: {
      scenario: 'Seorang pengguna berhasil mendapatkan hold tiket 5 menit di Redis, melakukan pembayaran QRIS di detik ke-298, dan webhook callback baru tiba di server pada detik ke-305 (setelah key hold Redis expired).',
      task: 'Jelaskan mekanisme rekonsiliasi atau pengaman apa yang harus dilakukan backend agar pengguna tidak kehilangan tiketnya maupun memicu overselling.'
    },
    quiz: {
      question: '[Studi Kasus 9] 20.000 tiket konser diperebutkan 1.000.000 user di detik pertama; wajib adil, nol overselling, dan hold bayar 5 menit. Arsitektur paling tepat:',
      options: [
        'Mengarahkan 1.000.000 request langsung melakukan SELECT ... FOR UPDATE pada satu baris stok di PostgreSQL.',
        'Menggunakan database NoSQL Eventual Consistency tanpa penguncian dan membatalkan kelebihan tiket secara manual.',
        'Menggunakan Virtual Waiting Room di lapis terdepan, mengelola reservasi stok atomik melalui Redis Lua Script dengan TTL 5 menit, dan menyinkronkan ke DB ACID secara asinkron.',
        'Meng-cache proses pembayaran di CDN.'
      ],
      answer: 2,
      explanation: 'Tepat (Opsi C)! Waiting Room meredam gelombang 1 juta request, Redis Lua Script menjamin pengurangan stok atomik bebas overselling dengan auto-release TTL 5 menit, dan Kafka+DB ACID mencatat transaksi final. Opsi A melumpuhkan PostgreSQL, Opsi B melanggar aturan nol overselling, Opsi D tidak valid untuk transaksi personal.'
    },
    refs: ['https://redis.io/docs/latest/develop/interact/programmability/eval-intro/']
  },
  {
    id: 'sam13',
    mode: 'sa',
    order: 1,
    track: 'Operasional Handling & Simulasi Kausal',
    title: '5 Pilar Operasional Handling: Traffic, Failure, Concurrency, Cache & Incident',
    level: 'Advanced',
    summary: 'Standar implementasi operasional agar arsitektur bertahan saat beban puncak maupun gangguan infrastruktur pada 5 pilar kritis: Traffic, Failure, Concurrency, Cache, dan Observability.',
    concepts: [
      ['Pilar 1: Traffic & Overload Handling', 'Rate Limiting Token Bucket di API Gateway (HTTP 429 + header Retry-After dengan random jitter). Priority-Based Load Shedding (saat CPU/worker > 85%, tolak request prioritas rendah seperti analitik/rekomendasi demi menyelamatkan checkout agar bebas OOM). Queue-Based Load Leveling (Kafka/SQS membatasi laju tulis di bawah batas IOPS DB).'],
      ['Pilar 2: Failure & Resilience Handling', 'Cascading Timeout Budget menyusut di tiap lapis (API Gateway 3000ms -> Orkestrator 1500ms -> Query DB 400ms). Exponential Backoff + Full Jitter: t_sleep = random(0, min(t_cap, t_base * 2^attempt)). Dilarang retry operasi non-idempoten tanpa Idempotency-Key. Bungkus eksternal dengan Bulkhead + Circuit Breaker (< 1ms fail-fast).'],
      ['Pilar 3: Concurrency & Data Consistency Handling', 'Optimistic Locking (kolom version) untuk konflik rendah vs Pessimistic Locking (SELECT ... FOR UPDATE < 10ms, kunci urutan ID konsisten cegah deadlock). Atomic In-Memory Reservation (Redis Lua Script). Idempotency Enforcement atomik: SET key response NX EX 86400.'],
      ['Pilar 4: Cache & Storage Bottleneck Handling', 'Request Coalescing (Singleflight): 1 request pemimpin ambil data ke DB, ribuan sisanya tunggu di memori. TTL Jitter & Negative Caching (null marker TTL 15-30s). Read-Your-Writes Routing (arahkan baca ke Primary DB selama 3-5 detik setelah user mengubah data).'],
      ['Pilar 5: Observability & Incident Handling', 'Wajibkan setiap pintu masuk membuat Trace-ID unik dan meneruskannya ke semua HTTP & queue headers. Atur Alerting Berbasis Gejala (Symptom-Based) atas pelanggaran SLO (lonjakan error 5xx atau latensi P99), bukan sekadar lonjakan CPU sesaat.']
    ],
    compare: 'Banyak sistem memiliki diagram HLD yang rapi namun tumbang di produksi karena tidak menerapkan Cascading Timeout Budget, memicu retry tanpa jitter (retry storm), atau menyalakan alarm berdasarkan lonjakan CPU tanpa melihat SLO P99.',
    code: {
      language: 'javascript',
      content: `// Pilar 2: Rumus Exponential Backoff + Full Jitter
function computeBackoffDelay(attempt, baseMs = 100, capMs = 5000) {
  const exp = Math.min(capMs, baseMs * Math.pow(2, attempt));
  return Math.floor(Math.random() * exp); // random(0, min(t_cap, t_base * 2^attempt))
}

// Pilar 3: Redis Atomic Idempotency Lock
// SET idem:pay:req_991 '{"status":"PROCESSING"}' NX EX 86400
// Pilar 2: Cascading Timeout Budget:
// [Gateway: 3000ms] -> [Order Orchestrator: 1500ms] -> [PostgreSQL Query: 400ms]`
    },
    practices: [
      'Selalu pastikan timeout lapisan pemanggil > timeout lapisan di bawahnya (Cascading Timeout Budget).',
      'Gunakan urutan penguncian ID menaik (`ORDER BY id ASC`) saat mengunci banyak baris `FOR UPDATE` untuk mencegah deadlock.',
      'Arahkan user yang baru selesai mengedit profil/data langsung ke Primary DB selama 3–5 detik (Read-Your-Writes) agar ia tidak bingung melihat data lama dari Read Replica.'
    ],
    case: 'Saat layanan notifikasi eksternal mati, aplikasi tanpa Full Jitter melakukan retry tepat setiap 2, 4, 8 detik secara serentak dari 50.000 klien, menciptakan tsunami DDoS internal terhadap server sendiri begitu layanan pulih. Penambahan Full Jitter meratakan gelombang pemulihan.',
    exercise: {
      scenario: 'Sebuah API Gateway memberi batas timeout 2.500 ms, memanggil Service A (memanggil DB lalu memanggil Service B eksternal).',
      task: 'Susun anggaran Cascading Timeout Budget untuk Service A, Query DB, dan Service B, serta tentukan kebijakan Load Shedding jika CPU Service A mencapai 90%.'
    },
    quiz: {
      question: 'Mengapa pada Pilar 1 (Traffic Handling) header `Retry-After` maupun Exponential Backoff WAJIB ditambahkan "Random Jitter"?',
      options: [
        'Agar format JSON lebih mudah dibaca manusia.',
        'Agar ribuan klien yang gagal bersamaan tidak melakukan pengulangan serentak pada detik yang sama (mencegah Retry Storm / Thundering Herd).',
        'Untuk menonaktifkan protokol TLS sementara.'
      ],
      answer: 1,
      explanation: 'Tanpa jitter acak, semua klien yang gagal pukul 12:00:00 akan melakukan retry tepat pukul 12:00:02 dan 12:00:06 secara serentak, terus melumpuhkan server.'
    },
    refs: ['https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/']
  },
  {
    id: 'sam14',
    mode: 'sa',
    order: 2,
    track: 'Operasional Handling & Simulasi Kausal',
    title: 'Spesifikasi Simulasi Kausal Sistem Terdistribusi (Flash Sale: Unhandled vs Handled)',
    level: 'Advanced',
    summary: 'Memetakan variabel arsitektur menjadi hukum simulasi kausal visual (NORMAL, SATURATED, FAIL-FAST, COALESCING) serta kontrak topologi Flash Sale (Unhandled vs Handled) untuk mesin simulasi.',
    concepts: [
      ['Hukum 1: Kepadatan & Kecepatan Paket', 'Proporsional langsung terhadap rasio Incoming RPS / Node Capacity. Semakin tinggi rasio beban mendekati kapasitas, kepadatan aliran paket meningkat.'],
      ['Hukum 2: NORMAL vs SATURATED / OVERLOAD', 'Kondisi NORMAL (Load <= 80%): paket mengalir lancar antar-node, warna node stabil. Kondisi SATURATED / OVERLOAD (Load > 100% tanpa handling): kecepatan paket melambat drastis menjelang node tujuan, membentuk tumpukan antrean fisik di depan node, dan node berdenyut merah.'],
      ['Hukum 3: FAIL-FAST / REJECTING & COALESCING', 'FAIL-FAST (Rate Limiter / Circuit Breaker OPEN): paket melebihi ambang batas langsung dipantulkan mundur berwarna merah di titik penjagaan tanpa membebani node belakang. COALESCING (Singleflight aktif): ribuan paket bersamaan ditahan sesaat dan digabung menjadi 1 paket pemimpin menuju database.'],
      ['Kontrak Topologi Flash Sale (Unhandled vs Handled)', 'Unhandled: Clients (25k) -> App Servers (6k) -> Primary DB Row Lock (800 -> Overload fatal!). Handled: Clients (25k) -> Waiting Room + Rate Limit (4.5k) -> Redis Lua Atomic (15k) -> Kafka Load Leveler (12k) -> Primary DB (1.5k aman di bawah kapasitas!).']
    ],
    compare: 'Diagram arsitektur statis tidak menunjukkan bagaimana antrean menumpuk saat kapasitas DB terlampaui. Pemodelan kausal memetakan kapasitas tiap node (mis. 800 vs 15.000 RPS) sehingga bottleneck dan dampak handling langsung terlihat.',
    code: {
      language: 'javascript',
      content: `// cases.js — Kontrak Struktur Konfigurasi Topologi Simulasi 3D Isometric Kausal
export const SIMULATION_SCENARIOS = {
  flash_sale: {
    title: "Flash Sale & Inventory Lock",
    slaTargetP99Ms: 150,
    unhandled: {
      nodes: [
        { id: "client", label: "Clients", pos: [-6, 0, 0], capacity: 25000, role: "traffic_source" },
        { id: "app", label: "App Servers", pos: [-1.5, 0, 0], capacity: 6000, role: "stateless_compute" },
        { id: "db", label: "Primary DB (Row Lock)", pos: [3.5, 0, 0], capacity: 800, role: "acid_storage" }
      ],
      edges: [
        { from: "client", to: "app" },
        { from: "app", to: "db" }
      ]
    },
    handled: {
      nodes: [
        { id: "client", label: "Clients", pos: [-7.5, 0, 0], capacity: 25000, role: "traffic_source" },
        { id: "gate", label: "Waiting Room + Rate Limit", pos: [-3.5, 0, 0], capacity: 4500, role: "rate_limiter" },
        { id: "redis", label: "Redis (Lua Atomic)", pos: [0.5, 0, -2.5], capacity: 15000, role: "memory_lock" },
        { id: "kafka", label: "Kafka Queue", pos: [0.5, 0, 2.5], capacity: 12000, role: "load_leveler" },
        { id: "db", label: "Primary DB", pos: [5, 0, 0], capacity: 1500, role: "acid_storage" }
      ],
      edges: [
        { from: "client", to: "gate" },
        { from: "gate", to: "redis" },
        { from: "redis", to: "kafka" },
        { from: "kafka", to: "db" }
      ]
    }
  }
};`
    },
    practices: [
      'Pastikan setiap node dalam skenario simulasi memiliki nilai `capacity` dan `role` yang realistis agar hukum kausalitas (`Incoming RPS / Capacity`) berjalan akurat.',
      'Visualisasikan antrean fisik sebelum node yang mengalami Load > 100% tanpa handling, alih-alih sekadar mengubah teks angka.',
      'Gunakan pola perbandingan Side-by-Side (Unhandled vs Handled) agar pembelajar langsung melihat efek Rate Limiter, Redis Lua, dan Kafka Queue Leveling.'
    ],
    case: 'Pada skenario `flash_sale` Unhandled dengan beban masuk 10.000 RPS: App Servers (kapasitas 6.000) dan Primary DB Row Lock (kapasitas 800) langsung memasuki status SATURATED/OVERLOAD. Pada mode Handled, Gate memantulkan kelebihan request (FAIL-FAST), Redis Lua (kapasitas 15.000) memproses reservasi dalam mikrodetik, dan Kafka meratakan laju tulis di bawah kapasitas Primary DB (1.500).',
    exercise: {
      scenario: 'Anda ingin menambahkan skenario simulasi baru `cache_stampede` ke dalam `SIMULATION_SCENARIOS` di `cases.js` menggunakan hukum COALESCING (Singleflight).',
      task: 'Tuliskan struktur objek `unhandled` (Clients -> App -> DB overload) dan `handled` (Clients -> App + Singleflight Coalescer -> Redis + DB aman) sesuai kontrak `cases.js`.'
    },
    quiz: {
      question: 'Dalam hukum pemetaan simulasi kausal, perilaku visual apa yang terjadi ketika node memiliki kondisi `COALESCING` (Singleflight aktif)?',
      options: [
        'Seluruh paket dipantulkan mundur berwarna merah di gerbang.',
        'Ribuan paket yang tiba bersamaan pada node aplikasi ditahan sesaat dan digabungkan menjadi 1 paket pemimpin menuju database.',
        'Node berdenyut merah dan membentuk tumpukan antrean fisik tanpa henti.'
      ],
      answer: 1,
      explanation: 'Singleflight (Request Coalescing) menggabungkan ribuan permintaan kunci cache yang kedaluwarsa secara bersamaan menjadi hanya 1 kueri pemimpin ke database.'
    },
    refs: []
  }
];
