# Master Blueprint: System Design, Architecture Handling & Best Practices

Dokumen ini merupakan pemetaan lengkap kurikulum **System Design** yang disusun secara hierarkis dari lapisan jaringan tingkat rendah hingga arsitektur sistem terdistribusi skala besar, dilengkapi panduan *handling* insiden produksi, *best practices* implementasi, dan studi kasus berbasis *trade-off*.

## Bagian 1: Peta Kurikulum Lengkap (9 Modul Utama)

### Modul 1: Fondasi Jaringan & Protokol Komunikasi

Semua komunikasi antar-komponen bergantung pada lapisan ini. Optimasi pada level kode tidak akan menyelamatkan latensi jika desain protokol jaringan keliru.

* **Model Jaringan Praktis:**

  * **Layer 4 (Transport - TCP/UDP):** Bekerja pada level alamat IP dan Port. TCP menjamin urutan dan keandalan paket melalui *3-way handshake*, *flow control*, dan *congestion control*. UDP bersifat *connectionless* tanpa jaminan pengiriman, namun unggul dalam latensi rendah.

  * **Layer 7 (Application - HTTP, gRPC, WebSocket):** Memahami isi *payload*, *header*, URL, dan *cookie*, sehingga memungkinkan *routing* cerdas berdasarkan konteks aplikasi.

* **Resolusi Nama (DNS):**

  * **Hierarki Resolusi:** Browser Cache -> OS Cache -> Recursive Resolver (ISP/1.1.1.1) -> Root Nameserver -> TLD Nameserver (`.com`, `.id`) -> Authoritative Nameserver.

  * **Record Penting:** `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias domain), `NS` (delegasi nameserver).

  * **Global Traffic Routing:** **Anycast DNS** (satu alamat IP diumumkan dari banyak lokasi global via BGP, otomatis memilih rute terdekat) dan **GeoDNS** (mengembalikan IP berbeda berdasarkan lokasi geografis pengguna).

* **Evolusi Protokol HTTP:**

  * **HTTP/1.1:** Menggunakan koneksi teks; mendukung *Keep-Alive*, tetapi mengalami **Head-of-Line (HoL) Blocking** di level aplikasi (satu request lambat menahan request berikutnya di koneksi TCP yang sama).

  * **HTTP/2:** Menggunakan *Binary Framing*, *Multiplexing* (banyak stream paralel dalam satu koneksi TCP), dan kompresi header (*HPACK*). Masih rentan terhadap TCP HoL Blocking jika satu paket TCP hilang.

  * **HTTP/3:** Berjalan di atas **QUIC (UDP)**. Menghilangkan TCP HoL Blocking sepenuhnya, mendukung *0-RTT connection resumption*, dan mempertahankan koneksi saat perangkat berpindah jaringan (Wi-Fi ke seluler).

* **Pola Komunikasi API & Real-Time:**

  * **REST:** Berbasis HTTP standar, *stateless*, dan mudah di-*cache* di CDN/proxy.

  * **GraphQL:** Klien menentukan struktur data yang dibutuhkan untuk mencegah *over-fetching* dan *under-fetching*. Risiko utama: serangan *query* bersarang dalam (*deeply nested queries*) dan masalah *N+1 query* di database.

  * **gRPC:** Berbasis HTTP/2 dengan serialisasi biner **Protocol Buffers (Protobuf)**. Ukuran *payload* jauh lebih kecil dan cepat dibanding JSON; standar utama untuk komunikasi internal antar-*microservices*.

  * **Pola Real-Time:**

    * *Short Polling:* Klien bertanya secara berkala (boros *header* dan CPU).

    * *Long Polling:* Server menahan koneksi hingga ada data baru atau *timeout*.

    * *Server-Sent Events (SSE):* Aliran satu arah (*server-to-client*) di atas HTTP standar dengan fitur *auto-reconnect* bawaan browser.

    * *WebSockets:* Koneksi persisten *full-duplex* (dua arah) untuk chat, kolaborasi dokumen, dan game multipemain.

    * *Webhooks:* Mekanisme *callback* HTTP asinkron antar-server berbasis *event*.

* **Keamanan Transport:**

  * **TLS/SSL Handshake** & **SSL Termination / Offloading** di Load Balancer untuk mengurangi beban dekripsi CPU pada server aplikasi.

  * **mTLS (Mutual TLS):** Kedua belah pihak (klien dan server internal) saling memverifikasi sertifikat digital dalam jaringan *Zero-Trust*.

### Modul 2: Skalabilitas Dasar & Manajemen Trafik

Strategi mengelola pertumbuhan trafik dari ratusan pengguna hingga jutaan *concurrent users*.

* **Strategi Scaling:**

  * **Vertical Scaling (*Scale Up*):** Meningkatkan spesifikasi CPU, RAM, atau NVMe pada satu mesin. Mudah diimplementasikan, tetapi terbentur batas fisik perangkat keras dan menyisakan *Single Point of Failure (SPOF)*.

  * **Horizontal Scaling (*Scale Out*):** Menambah jumlah node server paralel. Mewajibkan layanan bersifat **Stateless** (data sesi tidak disimpan di memori lokal server, melainkan dipindahkan ke penyimpanan eksternal seperti Redis).

* **Load Balancing (LB):**

  * **L4 vs L7 Load Balancer:** L4 beroperasi pada paket TCP/UDP (sangat cepat, *throughput* tinggi); L7 menginspeksi HTTP *header*, *cookie*, dan *path* untuk *routing* lanjutan.

  * **Algoritma Distribusi:**

    * *Round Robin* & *Weighted Round Robin* (untuk server dengan spesifikasi berbeda).

    * *Least Connections* & *Least Response Time* (ideal untuk durasi pemrosesan request yang bervariasi).

    * *IP Hash* (rentan timpang jika banyak pengguna berada di balik satu IP publik NAT).

    * *Consistent Hashing* (meminimalkan perpindahan pemetaan saat node ditambah atau dihapus).

  * **High Availability LB:** Konfigurasi *Active-Passive* dengan *Floating IP* (Keepalived) atau *Active-Active* dengan Anycast/DNS.

* **Reverse Proxy & API Gateway:**

  * **Reverse Proxy (Nginx, HAProxy):** Menangani terminasi SSL, kompresi Gzip/Brotli, *caching* statis, dan menyembunyikan topologi server internal.

  * **API Gateway (Kong, Envoy, AWS API Gateway):** Pintu masuk terpusat yang menjalankan fungsi lintas layanan (*cross-cutting concerns*): autentikasi token, *rate limiting*, *request transformation*, dan pola **BFF (Backend for Frontend)** untuk menyesuaikan format respons bagi aplikasi mobile vs web.

* **Content Delivery Network (CDN):**

  * **Push CDN:** Pengembang mengunggah aset secara manual ke CDN (cocok untuk file statis yang jarang berubah).

  * **Pull CDN:** CDN menarik aset dari *Origin Server* saat pertama kali diminta (*cache miss*), lalu menyimpannya di *Edge Server* sesuai nilai header `Cache-Control` dan `TTL`.

  * **Cache Invalidation:** Menghapus konten lama sebelum TTL habis melalui mekanisme *Purge API* atau teknik *Cache Busting* (penamaan file berbasis *hash*, misal `app.8f9a2c.js`).

### Modul 3: Penyimpanan Data & Database

Lapisan paling kritis dalam arsitektur karena sifatnya yang *stateful* dan sulit dipartisi.

* **Relational Database (SQL) & Transaksi:**

  * **Properti ACID:** *Atomicity* (semua berhasil atau batal total), *Consistency* (memenuhi aturan integritas skema), *Isolation* (transaksi paralel tidak saling merusak), *Durability* (data tersimpan permanen di disk non-volatil setelah *commit*).

  * **Isolation Levels & Anomali:**

    * *Read Uncommitted:* Rentan *Dirty Read* (membaca data yang belum di-*commit*).

    * *Read Committed:* Mencegah *Dirty Read*, tetapi rentan *Non-Repeatable Read*.

    * *Repeatable Read:* Menjaga konsistensi baris yang dibaca dalam satu transaksi, tetapi rentan *Phantom Read* (kecuali menggunakan *Snapshot Isolation / MVCC*).

    * *Serializable:* Isolasi tertinggi; mengeksekusi transaksi seolah-olah berurutan secara serial.

* **Mesin Penyimpanan & Indexing Internal:**

  * **B-Tree / B+Tree:** Struktur pohon seimbang dengan kompleksitas pencarian $O(\log N)$. Sangat optimal untuk operasi baca titik (*point lookup*) dan pencarian rentang (*range query*), namun mengalami penalti *random disk I/O* saat operasi tulis tinggi.

  * **LSM-Tree (Log-Structured Merge-Tree) & SSTables:** Menulis data baru secara berurutan (*sequential append*) ke dalam memori (*MemTable*) dan *Write-Ahead Log (WAL)*, lalu menggabungkannya secara berkala ke disk (*Compaction*). Sangat unggul untuk beban kerja tulis masif (*write-heavy*).

  * **Tipe Indeks:** *Clustered Index* (menentukan urutan fisik penyimpanan baris data), *Non-Clustered / Secondary Index*, *Composite Index* (urutan kolom mengikuti aturan *leftmost prefix*), dan *Covering Index* (mengembalikan hasil query langsung dari indeks tanpa menyentuh tabel utama).

  * **Connection Pooling:** Menggunakan *pooler* (seperti PgBouncer) untuk menggunakan ulang koneksi TCP/proses database yang mahal pembuatannya.

* **NoSQL & Database Spesialis:**

  * **Key-Value (Redis, DynamoDB):** Akses berbasis kunci primer dengan latensi sub-milidetik.

  * **Document (MongoDB):** Menyimpan dokumen JSON/BSON bersarang dengan skema dinamis.

  * **Wide-Column (Apache Cassandra, ScyllaDB):** Menyimpan data per keluarga kolom (*column family*) berbasis LSM-Tree; sangat skalabel untuk penulisan terdistribusi lintas *data center*.

  * **Graph (Neo4j):** Menyimpan *node* dan *edge* sebagai warga kelas satu untuk penelusuran relasi mendalam (*social graph*, *fraud ring detection*).

  * **Time-Series (TimescaleDB, InfluxDB):** Dioptimalkan untuk data berurut waktu dengan kompresi kolom tinggi dan kebijakan retensi otomatis.

  * **Search Engine & Vector DB (Elasticsearch, Milvus, pgvector):** Menggunakan *Inverted Index* untuk pencarian teks penuh dan algoritma *HNSW* untuk pencarian kemiripan vektor AI (*Approximate Nearest Neighbor*).

* **Pola Skalabilitas Database:**

  * **Replication:**

    * *Single-Leader (Primary-Replica):* Semua operasi tulis masuk ke *Primary*; operasi baca disebar ke *Read Replicas*. Menimbulkan tantangan **Replication Lag**.

    * *Multi-Leader:* Beberapa node menerima operasi tulis (berguna untuk operasi multi-wilayah), membutuhkan mekanisme resolusi konflik (*Last-Write-Wins* atau *CRDT*).

    * *Leaderless (Dynamo-style):* Klien menulis dan membaca langsung ke beberapa replika sekaligus menggunakan konfigurasi **Quorum**:
      

      $$
      R + W > N
      $$

      
      di mana $N$ adalah faktor replikasi, $W$ adalah jumlah node yang wajib mengonfirmasi penulisan, dan $R$ adalah jumlah node yang dibaca.

  * **Partitioning / Sharding:**

    * *Vertical Partitioning:* Memecah tabel besar berdasarkan kolom ke tabel/database terpisah.

    * *Horizontal Sharding:* Memecah baris data ke banyak node independen berdasarkan *Shard Key*.

    * *Strategi Sharding:* *Range-based* (rentan *hotspot* pada rentang terbaru), *Hash-based* (`hash(key) % N`), dan *Consistent Hashing dengan Virtual Nodes*.

    * *Tantangan Sharding:* *Cross-shard JOIN* yang lambat, *hotspot / celebrity problem*, dan transaksi lintas *shard*.

* **Storage Non-Database:**

  * **Object / Blob Storage (Amazon S3, MinIO):** Menyimpan file tidak terstruktur (gambar, video, backup) melalui HTTP API dengan durabilitas tinggi.

  * **Block Storage (AWS EBS):** Penyimpanan mentah berperforma tinggi yang dipasang sebagai disk sistem operasi atau volume database.

### Modul 4: Caching & Akselerasi Performa

Menyimpan salinan data yang sering diakses di lapisan memori berkecepatan tinggi untuk memangkas latensi dan melindungi database.

* **Hierarki Lapisan Cache:**
  `Browser Cache -> CDN Edge -> Reverse Proxy -> Local In-Memory Cache -> Distributed Cache (Redis) -> Database Buffer Pool`

* **Strategi Baca & Tulis:**

  * **Cache-Aside (*Lazy Loading*):** Aplikasi mengecek cache terlebih dahulu. Jika *miss*, aplikasi membaca dari database, menyimpannya ke cache, lalu mengembalikan data.

  * **Read-Through:** Lapisan cache bertugas secara transparan mengambil data dari database saat terjadi *cache miss*.

  * **Write-Through:** Data ditulis ke cache dan database secara sinkron dalam satu alur. Menjamin konsistensi tinggi dengan penalti latensi tulis.

  * **Write-Behind (*Write-Back*):** Aplikasi hanya menulis ke cache dan langsung membalas klien; cache menyinkronkan data ke database secara asinkron dalam *batch*. Sangat cepat, namun berisiko kehilangan data jika node cache mati sebelum *flush*.

  * **Write-Around:** Data ditulis langsung ke database tanpa melalui cache, mencegah cache tercemar oleh data baru yang jarang dibaca ulang.

* **Kebijakan Eviksi (*Eviction Policies*):**

  * **LRU (*Least Recently Used*):** Menghapus item yang paling lama tidak diakses.

  * **LFU (*Least Frequently Used*):** Menghapus item dengan frekuensi akses paling rendah.

  * **FIFO (*First-In First-Out*):** Menghapus item berdasarkan urutan masuk tertua.

* **Kegagalan Cache & Mitigasinya:**

  * **Cache Stampede (*Thundering Herd*):** Satu kunci sangat populer kedaluwarsa, menyebabkan ribuan request bersamaan menembus cache dan menghantam database serentak. *Mitigasi:* **Singleflight / Request Coalescing** atau *Distributed Mutex Lock*.

  * **Cache Penetration:** Request terus-menerus mencari ID yang tidak pernah ada di cache maupun database, sehingga setiap request selalu menyentuh database. *Mitigasi:* **Bloom Filter** di memori atau menyimpan nilai *null* dengan TTL singkat.

  * **Cache Avalanche:** Ribuan kunci kedaluwarsa pada detik yang sama atau seluruh klaster cache tumbang bersamaan. *Mitigasi:* Menambahkan *random jitter* pada setiap nilai TTL dan menggunakan klaster Redis *High Availability*.

### Modul 5: Sistem Terdistribusi & Teori Konsistensi

Memahami batasan fisika jaringan dan koordinasi antar-mesin yang tidak berbagi memori maupun jam fisik.

* **Teorema Fundamental:**

  * **CAP Theorem:** Dalam sistem penyimpanan terdistribusi, ketika terjadi **Network Partition (**$P$**)**, sistem harus memilih antara **Consistency (**$C$**)** (setiap pembacaan mendapat data terbaru atau error) atau **Availability (**$A$**)** (setiap request mendapat respons non-error, meskipun datanya mungkin versi lama).

  * **PACELC Theorem:** Perluasan dari CAP. Jika terjadi Partition (**P**), pilih **A** atau **C**; *Else* (**E**) ketika jaringan berjalan normal, sistem tetap harus memilih antara **Latency (**$L$**)** yang rendah atau **Consistency (**$C$**)** yang ketat.

* **Spektrum Model Konsistensi:**

  * **Strong Consistency (*Linearizability*):** Setelah operasi tulis selesai, semua pembacaan berikutnya dari node mana pun langsung melihat nilai terbaru tersebut.

  * **Sequential Consistency:** Semua node melihat urutan eksekusi operasi yang sama, meskipun tidak terikat waktu fisik secara absolut.

  * **Causal Consistency:** Operasi yang memiliki hubungan sebab-akibat wajib terlihat dalam urutan yang benar oleh semua node.

  * **Eventual Consistency:** Jika tidak ada pembaruan baru, seluruh replika pada akhirnya akan memiliki nilai yang sama. Dapat diperkuat dengan jaminan *Read-Your-Writes* dan *Monotonic Reads*.

* **Konsensus & Koordinasi Terdistribusi:**

  * **Algoritma Konsensus:** **Raft**, **Paxos**, dan **ZAB** memungkinkan sekumpulan node menyepakati satu nilai atau memilih pemimpin secara aman meskipun sebagian node mati (membutuhkan mayoritas kuorum $\lfloor N/2 \rfloor + 1$). Digunakan pada `etcd`, `Consul`, dan `ZooKeeper`.

  * **Distributed Locks & Fencing Tokens:** Penguncian terdistribusi di Redis harus dilindungi dengan **Fencing Token** (angka monotonik yang terus meningkat setiap kali kunci diterbitkan) agar proses yang tertunda akibat *Garbage Collection* tidak menimpa data milik pemegang kunci yang lebih baru.

* **Waktu, Urutan Event, & ID Unik:**

  * **Jam Logis (*Logical Clocks*):** Jam fisik server mengalami pergeseran (*NTP clock drift*). Gunakan **Lamport Timestamps**, **Vector Clocks**, atau **Hybrid Logical Clocks (HLC)** untuk menentukan urutan kausalitas kejadian.

  * **Idempotency Keys:** Pengenal unik yang dikirim klien pada setiap operasi mutasi agar pengulangan request (*retry*) akibat gangguan jaringan hanya dieksekusi satu kali.

  * **Distributed Unique ID Generator:**

    * *UUIDv4:* Acak 128-bit (menyebabkan fragmentasi indeks B-Tree karena tidak terurut waktu).

    * *UUIDv7 / ULID:* Terurut berdasarkan *timestamp* (ramah terhadap indeks B-Tree).

    * *Twitter Snowflake (64-bit):* Terdiri dari 1 bit tanda + 41 bit *timestamp* + 10 bit *datacenter/worker ID* + 12 bit *sequence number* (mampu menghasilkan hingga $4096$ ID per milidetik per mesin tanpa koordinasi pusat).

### Modul 6: Pemrosesan Asinkron & Event-Driven Architecture

Memisahkan produsen dan konsumen proses (*decoupling*) untuk meredam lonjakan beban dan meningkatkan keandalan.

* **Message Queue vs Event Streaming:**

  * **Message Queue (RabbitMQ, Amazon SQS):** Pola *Point-to-Point / Competing Consumers*. Pesan dihapus dari antrean setelah konsumen mengirim sinyal *acknowledgement* (`ACK`).

  * **Event Streaming (Apache Kafka, Apache Pulsar):** *Distributed Append-Only Commit Log*. Event disimpan secara persisten sesuai kebijakan retensi; banyak *Consumer Group* berbeda dapat membaca aliran data yang sama secara independen dengan melacak posisi *offset* masing-masing.

* **Jaminan Pengiriman (*Delivery Semantics*):**

  * **At-Most-Once:** Pesan dikirim tanpa pengulangan; cepat, namun pesan bisa hilang saat jaringan putus.

  * **At-Least-Once:** Produser mengulang pengiriman hingga menerima `ACK`; pesan dijamin tidak hilang, tetapi konsumen berpotensi menerima pesan duplikat.

  * **Exactly-Once Semantics (EOS):** Dicapai melalui kombinasi *At-Least-Once delivery* dengan **Idempotent Consumer** dan **Transactional Outbox**.

* **Pola Integrasi Data:**

  * **Transactional Outbox Pattern:** Menyimpan perubahan data bisnis dan rekaman *event* ke tabel `outbox` di dalam **satu transaksi lokal ACID** yang sama untuk menghindari masalah *Dual-Write*.

  * **Change Data Capture (CDC):** Membaca log transaksi database (seperti PostgreSQL WAL atau MySQL Binlog menggunakan Debezium) dan mengalirkan setiap perubahan baris menjadi *event* ke Kafka secara *real-time*.

* **Arsitektur Pemrosesan Data Besar:**

  * **Batch Processing (Apache Spark):** Memproses kumpulan data statis dalam jumlah besar secara terjadwal dengan *throughput* tinggi.

  * **Stream Processing (Apache Flink, Kafka Streams):** Memproses aliran *event* secara berkelanjutan dalam hitungan milidetik menggunakan *windowing* (*Tumbling*, *Sliding*, *Session Windows*) dan mekanisme *Watermarks* untuk menangani data yang datang terlambat.

  * **Lambda vs Kappa Architecture:** Lambda memisahkan jalur *batch* (akurasi) dan jalur *speed* (latensi rendah); Kappa menyederhanakan arsitektur dengan memperlakukan seluruh pemrosesan sebagai *stream* yang dapat diputar ulang (*replayable*).

### Modul 7: Arsitektur Microservices & Ketahanan Sistem

Merancang batas layanan yang bersih sekaligus mengisolasi kegagalan agar sistem tidak runtuh secara berantai.

* **Evolusi Arsitektur:**
  `Monolith -> Modular Monolith -> Microservices -> Serverless (FaaS)`
  *(Catatan prinsip rekayasa: Mulailah dengan Modular Monolith yang memiliki batas modul domain tegas; pecah menjadi Microservices hanya ketika skala tim dan kebutuhan penskalaan independen benar-benar menuntutnya).*

* **Infrastruktur Microservices:**

  * **Service Discovery:** Registri dinamis lokasi jaringan tiap layanan (*Client-side discovery* vs *Server-side discovery* melalui Kubernetes DNS / Consul).

  * **Service Mesh (Istio, Linkerd):** Menyuntikkan kontainer pendamping (**Sidecar Proxy / Envoy**) di setiap instance layanan untuk menangani *mTLS*, *observability*, dan *traffic routing* secara seragam di luar kode aplikasi.

* **Manajemen Transaksi Terdistribusi:**

  * **Saga Pattern:** Menggantikan *Two-Phase Commit (2PC)* yang memblokir sumber daya dengan rangkaian transaksi lokal. Jika langkah ke-$k$ gagal, sistem menjalankan **Compensating Transactions** mundur dari langkah $k-1$ hingga $1$.

    * *Choreography:* Setiap layanan bereaksi terhadap *event* tanpa koordinator pusat.

    * *Orchestration:* Satu layanan *Orchestrator* mengendalikan urutan perintah dan kompensasi.

  * **CQRS (*Command Query Responsibility Segregation*):** Memisahkan model penulisan (*Command*) dari model pembacaan (*Query*) agar skema pembacaan dapat dioptimalkan secara terpisah.

  * **Event Sourcing:** Menyimpan seluruh riwayat peristiwa perubahan *state* sebagai sumber kebenaran utama, bukan hanya menimpa baris *state* terakhir.

* **Pola Ketahanan (*Resilience & Fault Tolerance*):**

  * **Circuit Breaker:** Memutus panggilan ke layanan hilir yang bermasalah melalui tiga fase: `Closed` (normal) -> `Open` (gagal cepat tanpa memanggil layanan hilir) -> `Half-Open` (uji coba pemulihan).

  * **Retry dengan Exponential Backoff + Jitter:** Menunda pengulangan secara eksponensial dengan tambahan waktu acak untuk mencegah gelombang tabrakan request (*retry storm*).

  * **Bulkhead Isolation:** Membatasi kuota *thread pool* atau *connection pool* per layanan hilir sehingga perlambatan satu layanan tidak menyandera sumber daya fitur lainnya.

  * **Graceful Degradation & Load Shedding:** Menurunkan kualitas fitur non-kritis atau membuang request berprioritas rendah demi menjaga kelangsungan fungsi inti sistem.

  * **Algoritma Rate Limiting:** *Token Bucket* (mengizinkan lonjakan singkat terukur), *Leaky Bucket* (keluaran konstan), *Fixed Window Counter*, *Sliding Window Log*, dan *Sliding Window Counter*.

### Modul 8: Keamanan, Observabilitas, & Operasional Produksi

Menjamin sistem aman dari penyalahgunaan, mudah didiagnosis saat terjadi gangguan, dan dapat diperbarui tanpa waktu henti.

* **Keamanan Arsitektur:**

  * **Autentikasi & Otorisasi:** Protokol **OAuth 2.0** dan **OpenID Connect (OIDC)**. Perbandingan **JWT (Stateless)** (cepat diverifikasi, sulit dicabut sebelum kedaluwarsa) vs **Opaque Session Token (Stateful)** (dapat dicabut seketika dari Redis).

  * **Kontrol Akses:** RBAC (*Role-Based Access Control*) dan ABAC (*Attribute-Based Access Control*).

  * **Pertahanan Lapisan Luar:** WAF (*Web Application Firewall*), mitigasi DDoS berbasis Anycast, enkripsi *in-transit* (TLS 1.3) dan *at-rest* (AES-256), serta manajemen rahasia terpusat (HashiCorp Vault).

* **Tiga Pilar Observabilitas:**

  * **Structured Logging:** Mencetak log dalam format JSON dengan field standar (`timestamp`, `level`, `service`, `trace_id`, `duration_ms`) dan menyamarkan data sensitif (*PII masking*).

  * **Metrics:** Pemantauan deret waktu (Prometheus + Grafana) menggunakan metode **RED** (*Rate, Errors, Duration* — wajib memantau persentil **P95** dan **P99**) untuk layanan, serta metode **USE** (*Utilization, Saturation, Errors*) untuk infrastruktur.

  * **Distributed Tracing:** Melacak jalur eksekusi satu request melintasi seluruh layanan menggunakan standar **OpenTelemetry** melalui propagasi header `traceparent`.

* **Deployment & Disaster Recovery:**

  * **Strategi Rilis:** *Rolling Update*, **Blue-Green Deployment** (dua lingkungan identik dengan pengalihan trafik instan), **Canary Release** (mengalirkan 1%–5% trafik ke versi baru sebelum rilis penuh), dan **Feature Flags**.

  * **Disaster Recovery:**

    * **RTO (*Recovery Time Objective*):** Batas waktu maksimal sistem boleh mati setelah bencana.

    * **RPO (*Recovery Point Objective*):** Batas maksimal kehilangan data yang dapat ditoleransi (diukur dalam satuan waktu).

    * **Topologi Multi-Region:** *Active-Passive* (Warm Standby / Pilot Light) vs *Active-Active* (kedua wilayah melayani trafik aktif bersamaan).

### Modul 9: Kerangka Kerja Desain, Estimasi, & Peta Studi Kasus

#### Kerangka Kerja Desain 4 Langkah

1. **Klarifikasi Kebutuhan & Estimasi (*Back-of-the-Envelope*):**

   * Tentukan **Functional Requirements** (fitur utama) dan **Non-Functional Requirements** (ketersediaan, batas latensi P99, model konsistensi).

   * Hitung estimasi kapasitas dasar:
     

     $$
     \text{Average QPS} = \frac{\text{DAU} \times \text{Request per User per Hari}}{86.400}
     $$

     $$
     \text{Peak QPS} \approx 2 \times \text{Average QPS} \quad (\text{hingga } 10 \times \text{ untuk event khusus})
     $$

2. **High-Level Design (HLD):** Rancang blok komponen utama, definisi endpoint API, serta pemilihan jenis database dan skema inti.

3. **Deep Dive & Resolusi Bottleneck:** Identifikasi titik jenuh (*SPOF*, *hot partition*, *lock contention*) dan terapkan mekanisme *scaling*, *caching*, atau pemrosesan asinkron.

4. **Evaluasi Trade-off:** Jelaskan secara eksplisit variabel apa yang dikorbankan dari setiap pilihan arsitektur.

#### Peta Studi Kasus Klasik

| Studi Kasus | Tantangan Teknis Dominan | Pola & Teknologi Kunci | 
| ----- | ----- | ----- | 
| **URL Shortener (TinyURL)** | Rasio baca:tulis $100:1$, pembuatan kode pendek unik tanpa tabrakan | Base62 Encoding, Key Generation Service (KGS) / Counter, Redis Cache, DB Sharding | 
| **Social Feed (Twitter/X)** | Distribusi postingan (*fan-out*) dari akun berjuta-juta pengikut | Hybrid Push/Pull Fan-out, Redis Timeline Cache, Kafka Queue | 
| **Chat Real-Time (WhatsApp)** | Jutaan koneksi TCP persisten, status *online/typing*, pengiriman pesan *offline* | WebSockets, Stateful Chat Gateway, Service Discovery, Cassandra, Push Notification | 
| **Ride-Hailing (Uber/Gojek)** | Pembaruan koordinat GPS tiap detik, pencarian pengemudi terdekat berlatensi rendah | Geohash / QuadTree / Google S2 Geometry, In-Memory Geospatial Index, WebSockets | 
| **Video Streaming (YouTube)** | Unggah file berukuran gigabyte, konversi lintas resolusi, distribusi global | Chunked Upload, DAG Transcoding Workers, HLS/DASH Adaptive Bitrate, CDN | 
| **Flash Sale / Ticketing** | Konkurensi ekstrem pada stok terbatas (*overselling* dilarang mutlak) | Virtual Waiting Room, Redis Atomic Lua Script (TTL), Kafka Load Leveling | 
| **Sistem Pembayaran / Wallet** | Akurasi finansial mutlak, perlindungan dari eksekusi ganda | Double-Entry Ledger, Idempotency Key, Saga Orchestration, Audit Log | 
| **Cloud Storage (Google Drive)** | Sinkronisasi file besar secara efisien saat sebagian kecil isi file diubah | File Chunking, Content-Defined Chunking (CDC), Delta Sync, Metadata DB + Object Storage | 

## Bagian 2: Panduan Operasional Handling & Best Practices

Agar arsitektur bertahan saat beban puncak maupun gangguan infrastruktur, terapkan standar implementasi pada **5 pilar operasional** berikut:

### 1. Traffic & Overload Handling

* **Rate Limiting di Lapisan Terdepan:** Pasang pembatas laju di API Gateway menggunakan algoritma *Token Bucket*. Kembalikan kode HTTP `429 Too Many Requests` disertai header `Retry-After` yang ditambahkan **random jitter** agar klien tidak melakukan pengulangan serentak.

* **Priority-Based Load Shedding:** Klasifikasikan seluruh endpoint berdasarkan kekritisan bisnis. Ketika utilisasi CPU atau antrean worker melampaui $85\%$, tolak request prioritas rendah (seperti analitik, rekomendasi, atau pencarian non-esensial) sebelum seluruh server mengalami kehabisan memori (*Out-Of-Memory*).

* **Queue-Based Load Leveling:** Pisahkan lonjakan trafik tulis dari database menggunakan *Message Broker* (Kafka/SQS) dan batasi jumlah *consumer* agar laju penulisan ke database selalu berada di bawah kapasitas IOPS maksimalnya.

### 2. Failure & Resilience Handling

* **Cascading Timeout Budget:** Tetapkan anggaran waktu yang menyusut di setiap lapisan panggilan. Jika batas waktu API Gateway adalah $3000\text{ ms}$, layanan orkestrator maksimal menunggu $1500\text{ ms}$, dan query database maksimal $400\text{ ms}$.

* **Exponential Backoff + Full Jitter:** Gunakan rumus jeda acak sebelum melakukan pengulangan request yang gagal sementara:
  

  $$
  t_{\text{sleep}} = \text{random}\left(0, \min(t_{\text{cap}}, t_{\text{base}} \times 2^{\text{attempt}})\right)
  $$

  
  Jangan pernah melakukan *retry* tanpa jeda atau mengulang operasi non-idempoten tanpa `Idempotency-Key`.

* **Circuit Breaker & Bulkhead:** Isolasi setiap ketergantungan eksternal ke dalam *thread/connection pool* terpisah (*Bulkhead*) dan bungkus dengan *Circuit Breaker* agar kegagalan layanan pihak ketiga langsung diputus dalam waktu $< 1\text{ ms}$ ketika tingkat kesalahannya melewati ambang batas.

### 3. Concurrency & Data Consistency Handling

* **Pemilihan Strategi Locking:** Gunakan *Optimistic Locking* (kolom `version`) untuk konflik rendah. Jika terpaksa menggunakan *Pessimistic Locking* (`SELECT ... FOR UPDATE`), jaga durasi transaksi tetap $< 10\text{ ms}$ dan kunci baris dalam urutan ID yang konsisten untuk mencegah *deadlock*.

* **Atomic In-Memory Reservation:** Untuk perebutan sumber daya berfrekuensi ekstrem (stok promo/tiket), gunakan **Redis Lua Script** untuk memeriksa dan mengurangi stok secara atomik di memori, lalu catat hasil pemenang ke database relasional secara asinkron.

* **Idempotency Enforcement:** Simpan kunci idempotensi di Redis/DB dengan operasi atomik (`SET key response NX EX 86400`) sehingga pengulangan transaksi mengembalikan hasil asli tanpa mengeksekusi ulang mutasi saldo.

### 4. Cache & Storage Bottleneck Handling

* **Request Coalescing (*Singleflight*):** Saat kunci populer di Redis kedaluwarsa, tahan ribuan request bersamaan di memori aplikasi dan izinkan hanya **1 request pemimpin** untuk mengambil data dari database guna mengisi ulang cache.

* **TTL Jitter & Negative Caching:** Tambahkan selisih waktu acak pada setiap TTL kunci cache untuk mencegah *Cache Avalanche*, serta simpan nilai kosong (*null marker*) ber-TTL pendek ($15$–$30$ detik) untuk memblokir serangan *Cache Penetration*.

* **Read-Your-Writes Routing:** Setelah pengguna mengubah data di *Primary DB*, arahkan seluruh permintaan baca pengguna tersebut ke *Primary DB* selama jendela waktu replikasi (misal $3$–$5$ detik) agar pengguna tidak melihat data lama dari *Read Replica*.

### 5. Observability & Incident Handling

* **Propagasi Trace ID:** Wajibkan setiap pintu masuk sistem menghasilkan `Trace-ID` unik dan meneruskannya ke seluruh panggilan HTTP maupun metadata pesan antrean.

* **Alerting Berbasis Gejala (Symptom-Based):** Atur peringatan otomatis berdasarkan pelanggaran **SLO** (misal: lonjakan rasio error HTTP `5xx` atau latensi **P99** melebihi ambang batas), bukan sekadar lonjakan CPU sesaat.

## Bagian 3: Bank Soal Studi Kasus Berbasis Trade-off

### Studi Kasus 1 (Modul 1): Dashboard Pemantauan Armada Logistik

* **Skenario & Constraint:** Backend memantau $50.000$ kurir yang mengirim koordinat GPS tiap $3$ detik, sementara $2.000$ operator memantau peta di browser secara *real-time*. Operator hanya menerima pembaruan posisi (perintah *reroute* memakai endpoint REST terpisah). Tim ingin meminimalkan penggunaan memori koneksi di Load Balancer.

* **Pilihan:**

  * **A.** *HTTP Short Polling* tiap $1$ detik dari browser operator.

  * **B.** *WebSockets* penuh untuk jalur kurir maupun browser operator.

  * **C.** *gRPC* (HTTP/2) untuk ingesti GPS dari aplikasi kurir dan *Server-Sent Events (SSE)* untuk streaming peta ke browser operator.

  * **D.** *HTTP Long Polling* dengan *timeout* $60$ detik pada browser operator.

* **Jawaban Benar:** **C**

* **Analisis Trade-off:** Komunikasi ke browser operator bersifat satu arah (*server-to-client*), sehingga SSE di atas HTTP/2 jauh lebih ringan dibanding WebSocket serta mendukung *auto-reconnect* bawaan browser. gRPC dengan Protobuf memangkas *overhead* ukuran paket GPS dari perangkat seluler. *Trade-off:* Infrastruktur proxy/LB wajib mendukung HTTP/2 agar tidak terkena batas $6$ koneksi paralel per domain milik HTTP/1.1.

* **Mengapa Opsi Lain Salah:** Opsi **A** membuang CPU/bandwidth untuk ribuan respons kosong; Opsi **B** menambah beban *stateful* dua arah yang tidak dibutuhkan browser; Opsi **D** memicu penutupan dan pembuatan ulang koneksi TCP/TLS berulang tiap $3$ detik.

### Studi Kasus 2 (Modul 2): Lonjakan Trafik Promo & Ketimpangan Sticky Session

* **Skenario & Constraint:** Aplikasi berjalan di atas $12$ server di belakang L7 Load Balancer dengan algoritma *IP Hash* karena data sesi login disimpan di memori lokal server. Saat promo dimulai, ribuan pengguna dari jaringan seluler yang sama (berbagi satu IP publik NAT) masuk bersamaan, membuat $2$ server mencapai CPU $100\%$ sementara $10$ server lainnya di bawah $15\%$.

* **Pilihan:**

  * **A.** Mengubah algoritma LB ke *Round Robin* dengan tetap menyimpan sesi di memori lokal server.

  * **B.** Memindahkan penyimpanan sesi ke klaster *Redis* terpusat agar server menjadi *stateless*, lalu mengubah algoritma LB menjadi *Least Connections*.

  * **C.** Melakukan *Vertical Scaling* dengan menggandakan spesifikasi CPU seluruh $12$ server.

  * **D.** Memasang *CDN* di depan endpoint transaksi untuk menahan trafik IP yang sama.

* **Jawaban Benar:** **B**

* **Analisis Trade-off:** Memindahkan state sesi ke Redis membuat seluruh instance aplikasi identik (*stateless*), sehingga *Least Connections* dapat membagi beban secara merata tanpa bergantung pada alamat IP sumber. *Trade-off:* Menambah satu lompatan jaringan (*network hop*) sekitar $1$–$2\text{ ms}$ ke Redis dan membutuhkan ketersediaan tinggi pada klaster Redis.

* **Mengapa Opsi Lain Salah:** Opsi **A** menyebabkan pengguna ter-logout acak saat request pindah server; Opsi **C** tidak memperbaiki ketimpangan distribusi IP NAT; Opsi **D** tidak berlaku karena data transaksi dan sesi pengguna bersifat dinamis dan personal.

### Studi Kasus 3 (Modul 3): Ingesti Sensor IoT Skala Tinggi

* **Skenario & Constraint:** Sistem menerima $85.000$ data pembacaan meter listrik per detik (*append-only write*) dan melayani query rentang waktu $24$ jam terakhir per perangkat. Penggunaan PostgreSQL tunggal dengan $6$ *secondary index* membuat disk I/O jenuh dan latensi tulis menembus $2$ detik.

* **Pilihan:**

  * **A.** Menambah $5$ *Read Replica* PostgreSQL untuk membagi beban penulisan sensor.

  * **B.** Beralih ke database berbasis mesin penyimpanan **LSM-Tree** (seperti Cassandra atau TimescaleDB berpartisi waktu) dan memangkas indeks sekunder yang tidak kritis.

  * **C.** Melakukan *Vertical Partitioning* menjadi $10$ tabel pada instance PostgreSQL yang sama.

  * **D.** Mengubah level isolasi transaksi ke *Serializable*.

* **Jawaban Benar:** **B**

* **Analisis Trade-off:** Mesin **LSM-Tree** mengubah penulisan acak B-Tree menjadi penulisan berurutan (*sequential append* ke MemTable dan SSTable), sehingga sangat unggul untuk beban tulis $85.000\text{ ops/detik}$. *Trade-off:* Query pencarian acak tanpa kunci partisi menjadi lebih lambat dan memicu proses *compaction* di latar belakang.

* **Mengapa Opsi Lain Salah:** Opsi **A** hanya menskalakan operasi baca, bukan tulis; Opsi **C** tetap membebani *Write-Ahead Log* dan disk fisik yang sama; Opsi **D** justru memperparah *lock contention* dan tingkat kegagalan transaksi.

### Studi Kasus 4 (Modul 4): Runtuhnya Database Saat Kunci Promo Kedaluwarsa

* **Skenario & Constraint:** Tepat pukul 12:00, kunci Redis `product:flash_12` yang diakses $150.000$ pengguna bersamaan kedaluwarsa. Puluhan ribu request mengalami *cache miss* secara serentak dan langsung mengeksekusi query berat ke database utama, menghabiskan *connection pool* dalam hitungan milidetik (*Cache Stampede*).

* **Pilihan:**

  * **A.** Menghapus TTL seluruh kunci Redis agar tidak pernah kedaluwarsa.

  * **B.** Menerapkan pola *Write-Around Cache*.

  * **C.** Menerapkan **Singleflight / Distributed Lock** saat terjadi *cache miss* disertai **TTL Jitter**.

  * **D.** Memasang **Bloom Filter** di depan Redis.

* **Jawaban Benar:** **C**

* **Analisis Trade-off:** *Singleflight* membatasi hanya **1 request pemimpin** yang diizinkan mengambil data ulang dari database sementara ribuan request lainnya menunggu di memori hingga cache terisi kembali. *TTL Jitter* mencegah kunci-kunci lain kedaluwarsa pada detik yang sama. *Trade-off:* Menambah sedikit kompleksitas logika penanganan *lock timeout* pada kode aplikasi.

* **Mengapa Opsi Lain Salah:** Opsi **A** menyebabkan data basi permanen dan memenuhi memori; Opsi **B** hanya mengatur alur penulisan data baru; Opsi **D** hanya mencegah query untuk ID yang *tidak ada* di database (*Cache Penetration*).

### Studi Kasus 5 (Modul 5): Pemotongan Saldo Ganda Akibat Jeda Garbage Collection

* **Skenario & Constraint:** Worker-1 memperoleh *Distributed Lock* di Redis berdurasi $10$ detik untuk memproses pencairan dana. Worker-1 mengalami jeda *Garbage Collection (GC)* selama $14$ detik. Pada detik ke-$11$, Redis melepas *lock* sehingga Worker-2 mengambilnya dan memproses transfer. Pada detik ke-$15$, Worker-1 bangun dari jeda GC dan ikut menjalankan transfer kedua.

* **Pilihan:**

  * **A.** Memperpanjang TTL *lock* Redis dari $10$ detik menjadi $60$ detik.

  * **B.** Menggunakan **Fencing Tokens** (nomor urut monotonik yang meningkat tiap kali *lock* diberikan) yang divalidasi oleh database sebelum transaksi ditulis.

  * **C.** Mengubah konfigurasi sistem menjadi *AP (Availability)* agar kedua transaksi diterima.

  * **D.** Menggunakan nilai acak *UUIDv4* sebagai identitas pemilik *lock* di Redis.

* **Jawaban Benar:** **B**

* **Analisis Trade-off:** Dengan **Fencing Token**, database menolak operasi penulisan dari Worker-1 (yang membawa token nomor lebih lama, misal `33`) setelah database menerima penulisan dengan token lebih baru dari Worker-2 (`34`). *Trade-off:* Database tujuan harus menyimpan state nomor token terakhir dan melakukan validasi atomik saat penulisan.

* **Mengapa Opsi Lain Salah:** Opsi **A** tetap gagal jika jeda jaringan/GC melebihi $60$ detik; Opsi **C** melegalkan *double spending*; Opsi **D** hanya mencegah Worker-1 menghapus kunci milik Worker-2 di Redis, tetapi tidak menghentikan Worker-1 menulis ke database.

### Studi Kasus 6 (Modul 6): Masalah Dual-Write pada Layanan Order & Kafka

* **Skenario & Constraint:** Layanan *Order* harus menyimpan pesanan ke PostgreSQL dan menerbitkan *event* `OrderCreated` ke Apache Kafka. Pada $0,2\%$ transaksi, `COMMIT` PostgreSQL berhasil tetapi pengiriman ke Kafka gagal akibat gangguan jaringan sesaat, sehingga pesanan tidak pernah diproses gudang.

* **Pilihan:**

  * **A.** Mengirim *event* ke Kafka sebelum menjalankan perintah `COMMIT` PostgreSQL.

  * **B.** Menerapkan **Transactional Outbox Pattern** dengan **Change Data Capture (CDC)** dan *Idempotent Consumer*.

  * **C.** Menggunakan *Two-Phase Commit (2PC)* antara PostgreSQL dan broker Kafka.

  * **D.** Mengubah pengaturan produser Kafka menjadi `acks=0`.

* **Jawaban Benar:** **B**

* **Analisis Trade-off:** Data pesanan dan catatan *event* disimpan ke tabel `outbox` dalam **satu transaksi lokal ACID** di PostgreSQL. Konektor CDC membaca log transaksi database dan menerbitkannya ke Kafka secara asinkron dengan jaminan *At-Least-Once*, sementara konsumen memakai *Idempotency Key* untuk mengabaikan duplikat. *Trade-off:* Menambah latensi pengiriman beberapa puluh milidetik dan komponen infrastruktur CDC.

* **Mengapa Opsi Lain Salah:** Opsi **A** memicu *phantom order* jika transaksi database gagal setelah event terkirim; Opsi **C** tidak didukung secara native oleh Kafka dan menurunkan *throughput*; Opsi **D** justru memperbesar risiko kehilangan pesan.

### Studi Kasus 7 (Modul 7): Kegagalan Berantai Akibat Layanan Pajak Melambat

* **Skenario & Constraint:** Layanan *Checkout* memanggil API pajak eksternal dengan *timeout* $30$ detik. API pajak mengalami degradasi dengan waktu respons $28$ detik. Dalam $2$ menit, seluruh *thread pool* layanan *Checkout* habis tersandera menunggu respons pajak, sehingga fitur login dan keranjang belanja ikut lumpuh total.

* **Pilihan:**

  * **A.** Menambahkan *Retry* otomatis $5$ kali tanpa jeda saat panggilan gagal.

  * **B.** Memperbesar *thread pool* dari $200$ menjadi $5.000$ *thread*.

  * **C.** Menerapkan **Circuit Breaker**, memangkas *timeout* menjadi $2$ detik, mengisolasi alokasi sumber daya dengan **Bulkhead Pattern**, dan menyediakan *Graceful Degradation* (estimasi pajak sementara).

  * **D.** Memasang *Service Mesh* dengan konfigurasi *timeout* default $30$ detik.

* **Jawaban Benar:** **C**

* **Analisis Trade-off:** *Timeout* pendek mencegah *thread* tersandera; *Bulkhead* membatasi alokasi *thread* khusus layanan pajak sehingga fitur lain tetap hidup; *Circuit Breaker* langsung memutus panggilan saat rasio kegagalan tinggi (*fail-fast*); dan *Graceful Degradation* menjaga transaksi tetap selesai menggunakan tarif estimasi. *Trade-off:* Membutuhkan proses rekonsiliasi selisih pajak di latar belakang saat layanan eksternal pulih.

* **Mengapa Opsi Lain Salah:** Opsi **A** menciptakan *retry storm*; Opsi **B** memicu kehabisan memori (*OOM*) dan *context switching* CPU ekstrem; Opsi **D** tetap menyandera seluruh *thread* selama $30$ detik.

### Studi Kasus 8 (Modul 8): Diagnosis Latensi Tinggi pada 18 Microservices

* **Skenario & Constraint:** Pembuatan laporan memakan waktu $9$ detik (target SLA $< 1,5$ detik) melintasi $18$ *microservices*. Seluruh layanan menulis log teks biasa ke file lokal masing-masing, sementara metrik CPU semua server berada di bawah $30\%$.

* **Pilihan:**

  * **A.** Mengaktifkan log level `DEBUG` di seluruh $18$ layanan dan memeriksa file log satu per satu.

  * **B.** Mengimplementasikan **Distributed Tracing** (OpenTelemetry) dengan propagasi **Trace ID** lintas layanan serta agregasi *Structured Logging*.

  * **C.** Menambahkan *Auto-Scaling* berbasis CPU pada seluruh layanan.

  * **D.** Mengganti token autentikasi menjadi *JWT* berukuran besar berisi profil lengkap pengguna.

* **Jawaban Benar:** **B**

* **Analisis Trade-off:** CPU rendah dengan latensi tinggi menandakan hambatan pada *I/O wait*, antrean *lock*, atau panggilan berantai (*N+1 calls*). *Distributed Tracing* menampilkan diagram *waterfall* durasi tiap *span* lintas $18$ layanan sehingga titik lambat langsung teridentifikasi. *Trade-off:* Menambah biaya penyimpanan data telemetri (diatasi dengan *tail-based sampling*).

* **Mengapa Opsi Lain Salah:** Opsi **A** membebani disk I/O produksi dan tidak memiliki korelasi antar-layanan; Opsi **C** tidak terpicu karena CPU rendah; Opsi **D** hanya memperbesar ukuran *header* HTTP tanpa mengukur waktu eksekusi internal.

### Studi Kasus 9 (Modul 9): Sistem Tiket Konser 1 Juta Pengguna dalam 1 Menit

* **Skenario & Constraint:** Penjualan $20.000$ tiket dibuka pukul 10:00 dengan $1.000.000$ pengguna menekan tombol beli pada detik pertama. Sistem dilarang keras melakukan *overselling*, harus menjaga urutan masuk secara adil, dan memberi batas waktu pembayaran $5$ menit sebelum tiket dikembalikan ke stok.

* **Pilihan:**

  * **A.** Mengarahkan $1.000.000$ request langsung melakukan `SELECT ... FOR UPDATE` pada satu baris stok di PostgreSQL.

  * **B.** Menggunakan database NoSQL *Eventual Consistency* tanpa penguncian dan membatalkan kelebihan tiket secara manual.

  * **C.** Menggunakan **Virtual Waiting Room** di lapis terdepan, mengelola reservasi stok atomik melalui **Redis Lua Script** dengan TTL $5$ menit, dan menyinkronkan pembayaran final ke database ACID secara asinkron.

  * **D.** Meng-cache proses pembayaran di **CDN**.

* **Jawaban Benar:** **C**

* **Analisis Trade-off:** *Virtual Waiting Room* meredam gelombang $1.000.000$ request menjadi aliran bertahap sesuai kapasitas pemrosesan. **Redis Lua Script** mengeksekusi validasi dan pengurangan stok secara atomik *single-threaded* dalam mikrodetik tanpa risiko *overselling*, sekaligus memanfaatkan TTL $5$ menit untuk melepas stok otomatis jika pengguna gagal bayar. *Trade-off:* Arsitektur multi-tahap membutuhkan rekonsiliasi ketat antara masa berlaku kunci Redis dan *webhook* penyelesaian pembayaran.

* **Mengapa Opsi Lain Salah:** Opsi **A** melumpuhkan PostgreSQL akibat antrean *row lock* masif; Opsi **B** melanggar aturan bisnis utama; Opsi **D** tidak mungkin dilakukan karena transaksi pembayaran bersifat unik dan dinamis.

## Bagian 4: Spesifikasi Skenario Simulasi 3D Isometric Kausal

Untuk digunakan pada proyek web pembelajaran pribadi berbasis **HTML, CSS, dan Vanilla JavaScript (Three.js Orthographic Camera)**, setiap simulasi 3D harus terikat pada aturan kausalitas berikut agar visualisasi benar-benar merepresentasikan perilaku sistem:

### 1. Hukum Pemetaan Visual ke Variabel Sistem

* **Kepadatan & Kecepatan Paket:** Proporsional terhadap rasio $\frac{\text{Incoming RPS}}{\text{Node Capacity}}$.

* **Kondisi `NORMAL` (**$\text{Load} \le 80\%$**):** Paket mengalir lancar antar-node; warna node stabil sesuai perannya.

* **Kondisi `SATURATED / OVERLOAD` (**$\text{Load} > 100\%$ **tanpa *handling*):** Kecepatan paket melambat drastis menjelang node tujuan, membentuk tumpukan antrean fisik di depan bangunan node, dan node berdenyut merah.

* **Kondisi `FAIL-FAST / REJECTING` (*Rate Limiter* atau *Circuit Breaker OPEN*):** Paket yang melebihi ambang batas langsung dipantulkan mundur dalam warna merah di titik penjagaan tanpa membebani node di belakangnya.

* **Kondisi `COALESCING` (*Singleflight* aktif):** Ribuan paket yang tiba bersamaan pada node aplikasi ditahan sesaat dan digabungkan menjadi **1 paket pemimpin** menuju database.

### 2. Struktur Konfigurasi Topologi (`cases.js`)

Gunakan kontrak struktur data berikut saat menambahkan skenario studi kasus baru ke mesin simulasi:

```
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
};

```