/**
 * QA Engineering Mode Modules (24 Modules across 4 Clear Phases)
 * Combines panduan_roadmap_belajar_qa_software_engineer.md + materi_lengkap_senior_qa_engineering_automation.md
 */
window.QA_MODULES = [
  {
    "id": "qam01",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 1: Fundamental & Desain Uji",
    "title": "Mindset Quality Engineer: Shift-Left & Testing Trophy",
    "level": "Beginner",
    "summary": "Transformasi dari sekadar pengklik UI menjadi Quality Engineer dengan strategi Shift-Left (biaya 1x di desain vs 100x di produksi) dan piramida ROI Testing Trophy.",
    "concepts": [
      [
        "Shift-Left Testing (1x vs 100x Biaya)",
        "Pengujian dimulai sejak tahap pembacaan Product Requirement Document (PRD) dan perancangan kontrak API. Menemukan cacat logika pada tahap desain memakan biaya 1x, sedangkan memperbaikinya di produksi memakan biaya hingga 100x."
      ],
      [
        "1. Static Analysis (Fondasi Trophy)",
        "Linter, TypeScript strict mode, dan validasi skema OpenAPI/Swagger yang menangkap kesalahan tipe dan kontrak sebelum kode dieksekusi."
      ],
      [
        "2. Unit Tests",
        "Pengujian fungsi murni yang terisolasi (ditulis developer, diaudit edge-case-nya oleh QA) dengan umpan balik milidetik."
      ],
      [
        "3. Integration & API Tests (Porsi Terbesar)",
        "Memegang porsi ROI terbesar: menguji kontrak HTTP, alur logika bisnis, antrean pesan, dan transaksi database secara cepat, murah, dan deterministik."
      ],
      [
        "4. End-to-End (E2E) UI Tests (Puncak Ramping)",
        "Dikhususkan untuk alur bisnis paling kritis (critical user journeys seperti registrasi, checkout, pembayaran) karena lambat dan membutuhkan biaya perawatan lebih tinggi."
      ]
    ],
    "compare": "Piramida pengujian klasik sering menumpuk terlalu banyak Unit Test tanpa menguji integrasi nyata, atau terbalik menjadi Ice Cream Cone (kebanyakan manual/UI E2E yang lambat & flaky). Testing Trophy menempatkan porsi terbesar pada Integration & API Tests.",
    "code": {
      "language": "text",
      "content": "Testing Trophy ROI Distribution:\n\n        [  E2E UI Tests  ]         <- Puncak Ramping (Critical User Journeys)\n      [  Integration / API ]       <- Porsi Terbesar (Kontrak HTTP, DB, Logic)\n        [   Unit Tests   ]         <- Fungsi Murni Terisolasi (Audit Edge-Case)\n   [     Static Analysis     ]     <- Fondasi (ESLint, TS Strict, OpenAPI)"
    },
    "practices": [
      "Ikuti sprint grooming dan tinjau Acceptance Criteria (AC) sebelum developer mulai menulis kode.",
      "Audit ambiguitas requirement (mis. batas angka, status gagal, aturan timeout) sejak fase desain.",
      "Prioritaskan cakupan Integration/API test sebelum memperbanyak E2E browser test."
    ],
    "case": "Sebuah tim menemukan kesalahan aturan kalkulasi diskon PPN di PRD saat fase API contract review (biaya 15 menit diskusi). Jika lolos ke produksi, perbaikan membutuhkan rollback, rekonsiliasi data ribuan transaksi, dan hotfix (biaya 100x).",
    "exercise": {
      "scenario": "Ambil satu dokumen PRD atau fitur checkout aplikasi web yang Anda ketahui.",
      "task": "Petakan fitur tersebut ke dalam 4 lapisan Testing Trophy: tentukan apa yang cukup dicek Static Analysis/Unit, apa yang diuji di API Integration Test, dan maksimal 2 alur kritis untuk E2E UI."
    },
    "quiz": {
      "question": "Mengapa Integration & API Tests menempati porsi terbesar pada Testing Trophy?",
      "options": [
        "Karena E2E UI tidak bisa menguji tampilan tombol sama sekali.",
        "Karena pengujian kontrak HTTP, logika bisnis, dan transaksi database cepat, deterministik, serta memiliki ROI tertinggi dibanding UI E2E yang mahal dirawat.",
        "Karena Static Analysis sudah menggantikan seluruh kebutuhan pengujian keamanan."
      ],
      "answer": 1,
      "explanation": "Integration & API Tests menguji interaksi nyata antar-komponen dan database dengan kecepatan tinggi dan flakiness rendah, sehingga memberi rasio ROI terbaik."
    },
    "refs": [
      "https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications"
    ]
  },
  {
    "id": "qam02",
    "mode": "qa",
    "order": 3,
    "track": "QA Fase 1: Fundamental & Desain Uji",
    "title": "Teknik Desain Uji Formal: EP, BVA, State Transition & Decision Table",
    "level": "Intermediate",
    "summary": "Memadatkan ribuan kombinasi input menjadi skenario uji paling tajam menggunakan Equivalence Partitioning, Boundary Value Analysis, State Transition, dan Decision Table.",
    "concepts": [
      [
        "Equivalence Partitioning (EP)",
        "Membagi domain input menjadi kelas ekuivalensi valid dan tidak valid. Untuk rentang 18 <= usia <= 60, cukup uji satu perwakilan valid (30) dan dua perwakilan tidak valid (10 dan 75)."
      ],
      [
        "Boundary Value Analysis (BVA)",
        "Mayoritas bug logika tersembunyi di batas tepi (kesalahan operator < vs <=). Untuk rentang 18 <= usia <= 60, titik uji wajib adalah {17, 18, 19} dan {59, 60, 61}."
      ],
      [
        "State Transition Testing",
        "Wajib diterapkan pada fitur siklus status (contoh: DRAFT -> PENDING_PAYMENT -> PAID -> SHIPPED -> REFUNDED). QA wajib menguji transisi ilegal seperti membatalkan pesanan yang sudah SHIPPED atau memicu webhook PAID dua kali."
      ],
      [
        "Decision Table Testing",
        "Memetakan kombinasi aturan bisnis bersyarat ke dalam tabel kebenaran agar tidak ada cabang logika yang terlewat."
      ]
    ],
    "tables": [
      {
        "title": "Decision Table Testing: Aturan Promo & Gratis Ongkir",
        "headers": [
          "Kondisi / Aturan",
          "Skenario 1",
          "Skenario 2",
          "Skenario 3",
          "Skenario 4"
        ],
        "rows": [
          [
            "Member VIP",
            "Ya",
            "Ya",
            "Tidak",
            "Tidak"
          ],
          [
            "Total Belanja >= Rp 500.000",
            "Ya",
            "Tidak",
            "Ya",
            "Tidak"
          ],
          [
            "Hasil: Gratis Ongkir",
            "Ya",
            "Ya",
            "Ya",
            "Tidak"
          ],
          [
            "Hasil: Diskon Tambahan 10%",
            "Ya",
            "Tidak",
            "Tidak",
            "Tidak"
          ]
        ]
      }
    ],
    "compare": "Menguji angka 20, 21, 22, 23 hanya mengulang kelas ekuivalensi yang sama tanpa menambah keyakinan baru. Sebaliknya, memfokuskan pengujian di titik batas {17, 18, 19} dan {59, 60, 61} langsung menangkap off-by-one error.",
    "code": {
      "language": "text",
      "content": "BVA Test Points (18 <= usia <= 60):\n  Lower Boundary : 17 (Invalid), 18 (Valid Min), 19 (Valid)\n  Upper Boundary : 59 (Valid),   60 (Valid Max), 61 (Invalid)\n\nState Transition Illegal Paths to Test:\n  - SHIPPED -> CANCELLED (Wajib Ditolak HTTP 409/422)\n  - PAID -> PAID via duplicate webhook (Wajib Idempotent, stok tidak berkurang 2x)"
    },
    "practices": [
      "Selalu sertakan minimal 1 pengujian transisi status ilegal pada fitur order/tiket/approval.",
      "Gunakan Decision Table saat bisnis memiliki >= 2 kondisi boolean yang menentukan diskon, pajak, atau hak akses.",
      "Periksa batas tipe data (0, -1, nilai maksimum integer, null) bersama BVA."
    ],
    "case": "Sebuah halaman pendaftaran menolak pendaftar berusia tepat 18 tahun dan 60 tahun karena developer menulis `if (age > 18 && age < 60)` alih-alih `>=` dan `<=`. BVA langsung menemukan bug ini pada hari pertama.",
    "exercise": {
      "scenario": "Fitur pengajuan cuti mensyaratkan lama cuti minimal 1 hari dan maksimal 12 hari, dengan siklus DRAFT -> SUBMITTED -> APPROVED / REJECTED.",
      "task": "Tuliskan daftar titik uji BVA untuk jumlah hari cuti dan minimal 2 transisi status ilegal yang harus diuji."
    },
    "quiz": {
      "question": "Untuk aturan validasi usia 18 <= usia <= 60, manakah himpunan titik uji Boundary Value Analysis (BVA) yang paling tepat?",
      "options": [
        "{10, 30, 75}",
        "{17, 18, 19} dan {59, 60, 61}",
        "{18, 25, 35, 45, 60}"
      ],
      "answer": 1,
      "explanation": "BVA menguji tepat di bawah batas, tepat pada batas, dan tepat di atas batas ({17, 18, 19} dan {59, 60, 61}) untuk menangkap kesalahan operator < vs <=."
    },
    "refs": [
      "https://www.istqb.org/"
    ]
  },
  {
    "id": "qam03",
    "mode": "qa",
    "order": 4,
    "track": "QA Fase 1: Fundamental & Desain Uji",
    "title": "Matriks Severity vs Priority & Triage Bug Produksi",
    "level": "Beginner",
    "summary": "Membedakan dampak teknis kerusakan sistem (Severity) dengan urgensi penanganan bisnis (Priority) agar tim engineering selalu memperbaiki masalah yang paling tepat.",
    "concepts": [
      [
        "Severity (Dampak Teknis)",
        "Mengukur tingkat kerusakan fungsionalitas sistem secara teknis: Blocker, Critical, Major, Minor."
      ],
      [
        "Priority (Urgensi Bisnis)",
        "Menentukan urutan antrean kecepatan perbaikan: P0 (Immediate), P1 (High), P2 (Medium), P3 (Low)."
      ],
      [
        "Low Severity, High Priority (P0)",
        "Contoh nyata: Kesalahan ejaan nama merek perusahaan di halaman landing. Secara teknis aplikasi berjalan 100% normal (Low Severity), tetapi wajib diperbaiki segera (P0) karena merusak kredibilitas dan citra bisnis."
      ],
      [
        "High Severity, Medium/Low Priority (P2)",
        "Contoh nyata: Crash pada fitur ekspor laporan audit tahunan yang hanya dipakai oleh 1 admin internal sekali setahun. Secara teknis crash (High Severity), namun dapat dijadwalkan P2 bila tim sedang menangani celah keamanan mendesak."
      ]
    ],
    "tables": [
      {
        "title": "Matriks Klasifikasi Severity vs Priority",
        "headers": [
          "Kombinasi",
          "Contoh Kasus Nyata",
          "Tindakan Tim"
        ],
        "rows": [
          [
            "Critical Sev + P0",
            "Endpoint pembayaran HTTP 500 saat checkout promo",
            "Hotfix darurat / tunda rilis"
          ],
          [
            "Minor Sev + P0",
            "Typo nama brand di hero landing page / harga promo salah tulis",
            "Perbaikan segera sebelum kampanye"
          ],
          [
            "Critical Sev + P2",
            "Crash ekspor PDF laporan tahunan admin (1 user/tahun)",
            "Masuk backlog sprint berikutnya"
          ],
          [
            "Minor Sev + P3",
            "Alignment ikon 2px meleset di halaman About us",
            "Diperbaiki saat polish UI"
          ]
        ]
      }
    ],
    "compare": "QA pemula sering melabeli semua bug sebagai Critical/P0 sehingga menimbulkan kelelahan prioritas bagi developer. Senior QA memisahkan dampak kode dengan dampak bisnis secara objektif.",
    "code": {
      "language": "text",
      "content": "Bug Triage Matrix Rule:\n  Severity = \"Seberapa parah sistem rusak?\"  (Teknis)\n  Priority = \"Seberapa cepat harus diperbaiki?\" (Bisnis & Pengguna)"
    },
    "practices": [
      "Sertakan alasan bisnis saat menetapkan Priority P0 pada bug ber-Severity rendah.",
      "Jangan biarkan Blocker atau Critical bug di fitur utama lolos ke produksi tanpa persetujuan formal.",
      "Gunakan label terpisah di Jira untuk Severity dan Priority agar filter JQL akurat."
    ],
    "case": "Menjelang peluncuran iklan TV nasional, ditemukan logo mitra salah terpasang di halaman utama. Karena QA memisahkan Priority P0 dari Severity Minor, tim langsung memprioritaskan patch konten dalam 10 menit sebelum iklan tayang.",
    "exercise": {
      "scenario": "Tim Anda menemukan 2 bug bersamaan: (A) halaman syarat & ketentuan tidak bisa di-scroll di iOS, (B) tombol ubah avatar profil admin internal error 500.",
      "task": "Tentukan Severity dan Priority masing-masing bug disertai justifikasi bisnis dan teknis."
    },
    "quiz": {
      "question": "Kesalahan penulisan nama merek perusahaan di halaman utama landing page diklasifikasikan sebagai:",
      "options": [
        "High Severity, Low Priority (P3)",
        "Low Severity, High Priority (P0)",
        "Blocker Severity, Medium Priority (P2)"
      ],
      "answer": 1,
      "explanation": "Secara teknis fungsi sistem berjalan normal (Low Severity), namun merusak citra dan kepercayaan pengguna sehingga harus segera diperbaiki (P0 / High Priority)."
    },
    "refs": []
  },
  {
    "id": "qam04",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 2B: Manual Edge, SQL & OWASP",
    "title": "Detail Pengujian Manual Tingkat Senior: Edge Input, Finansial & Konkurensi",
    "level": "Intermediate",
    "summary": "Checklist wajib Senior QA untuk menangkap bug halus: string 10.000 karakter, Unicode/RTL, floating-point finansial IEEE 754, zona waktu UTC/kabisat, dan konkurensi browser.",
    "concepts": [
      [
        "Input Ekstrem & Karakter Khusus",
        "Uji string panjang (10.000 karakter tanpa spasi) untuk mendeteksi layout overflow dan batas VARCHAR DB; uji karakter Unicode kompleks, emoji gabungan (👨‍👩‍👧‍👦), teks RTL, serta spasi awal/akhir (\" user@domain.com \") untuk memverifikasi fungsi trim()."
      ],
      [
        "Presisi Angka Finansial (IEEE 754)",
        "Uji kalkulasi desimal/pajak untuk mendeteksi floating-point precision bug (0.1 + 0.2 = 0.30000000000000004). Sistem finansial wajib memakai tipe data DECIMAL atau satuan sen/integer terkecil."
      ],
      [
        "Zona Waktu UTC & Tahun Kabisat",
        "Verifikasi penyimpanan waktu dalam format UTC di database dan konversinya ke zona waktu lokal klien, termasuk pengujian tanggal batas seperti tahun kabisat (29 Februari)."
      ],
      [
        "Konkurensi & Interaksi Browser",
        "Lakukan double-click cepat pada tombol Submit/Bayar untuk menguji idempotency; tekan tombol Back browser tepat setelah transaksi selesai; serta simulasikan kondisi Offline atau Slow 3G saat submit form."
      ]
    ],
    "compare": "Penguji pemula hanya memasukkan data normal (\"Budi\", \"100000\"). Senior QA secara sistematis menekan titik buta browser, encoding UTF-8mb4, floating-point, dan kondisi jaringan tidak stabil.",
    "code": {
      "language": "javascript",
      "content": "// Bahaya IEEE 754 pada JavaScript / Float standar:\nconsole.log(0.1 + 0.2); // 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3); // false!\n\n// Solusi Finansial: Gunakan integer satuan terkecil (sen/rupiah utuh) atau tipe DECIMAL di DB\nconst totalInCents = 10 + 20; // 30 (Akurat 100%)\n\n// Edge Test Strings untuk Input Field:\nconst longNoSpace = 'a'.repeat(10000);\nconst complexEmoji = '👨‍👩‍👧‍👦'; // Multi-codepoint ZWJ emoji\nconst untrimmedEmail = '  qa.user@domain.com  ';"
    },
    "practices": [
      "Selalu tes formulir pendaftaran & pembayaran dengan Slow 3G di Chrome DevTools Network.",
      "Pastikan database menggunakan utf8mb4 agar emoji gabungan tidak memicu HTTP 500.",
      "Verifikasi tombol Submit langsung disabled atau dilindungi Idempotency-Key saat diklik dua kali."
    ],
    "case": "Aplikasi e-commerce gagal memproses transaksi senilai Rp 199.900 karena perbandingan total belanja frontend (float) dengan backend menghasilkan selisih 0.0000000000001. Pengujian presisi desimal mengungkap kebutuhan migrasi ke tipe DECIMAL.",
    "exercise": {
      "scenario": "Anda menguji formulir transfer dana yang juga memiliki kolom catatan dan tanggal jatuh tempo.",
      "task": "Buat minimal 5 test case ekstrem meliputi panjang karakter, emoji, trim spasi, presisi angka desimal, dan double-click submit."
    },
    "quiz": {
      "question": "Mengapa perhitungan uang di sistem finansial dilarang mengandalkan tipe data floating-point biner (float/double)?",
      "options": [
        "Karena tipe float hanya mendukung angka negatif.",
        "Karena representasi IEEE 754 menghasilkan galat pembulatan biner seperti 0.1 + 0.2 = 0.30000000000000004 sehingga wajib memakai DECIMAL atau integer terkecil.",
        "Karena database SQL tidak bisa mengindeks kolom numerik."
      ],
      "answer": 1,
      "explanation": "Standar IEEE 754 tidak dapat merepresentasikan pecahan desimal basis-10 secara eksak, yang berisiko menyebabkan selisih saldo/pajak pada jutaan transaksi."
    },
    "refs": [
      "https://0.30000000000000004.com/"
    ]
  },
  {
    "id": "qam05",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 2B: Manual Edge, SQL & OWASP",
    "title": "Verifikasi Integritas Database: SQL Wajib untuk QA",
    "level": "Intermediate",
    "summary": "Pengujian tidak berhenti saat UI menampilkan \"Berhasil\". Senior QA memvalidasi duplikasi transaksi, orphan records, dan keseimbangan ledger langsung melalui SQL.",
    "concepts": [
      [
        "Perintah SQL Kunci untuk QA",
        "Menguasai SELECT, WHERE, ORDER BY, JOIN, COUNT, dan GROUP BY untuk memverifikasi apakah transaksi UI/API tercatat presisi di PostgreSQL/DBeaver."
      ],
      [
        "Validasi UI Tidak Cukup",
        "Pesan sukses di UI dapat menipu jika terjadi race condition di latar belakang, kegagalan rollback sebagian, atau rusaknya relasi tabel."
      ],
      [
        "Cek Duplikasi Idempotency",
        "Mengelompokkan baris berdasarkan idempotency_key untuk memastikan double-submit tidak menghasilkan dua pembayaran aktif."
      ],
      [
        "Cek Orphan Records",
        "Menggunakan LEFT JOIN dari tabel anak (order_items) ke induk (orders) untuk memastikan tidak ada baris yatim tanpa referensi induk yang valid."
      ],
      [
        "Konsistensi Saldo Ledger",
        "Menjumlahkan entri CREDIT dan mengurangi DEBIT pada tabel ledger untuk memastikan saldo tercatat cocok 100% dengan riwayat mutasi."
      ]
    ],
    "compare": "Black-box testing murni hanya melihat layar; Grey-box testing dengan SQL memungkinkan QA membuktikan integritas ACID dan mendeteksi silent data corruption sebelum berdampak ke keuangan.",
    "code": {
      "language": "sql",
      "content": "-- 0. Query Verifikasi Transaksi Dasar (SELECT, WHERE, ORDER BY, JOIN)\nSELECT o.id, o.status, o.grand_total, u.email\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.status = 'PAID'\nORDER BY o.created_at DESC\nLIMIT 10;\n\n-- 1. Cek apakah terjadi duplikasi transaksi akibat race condition / double submit\nSELECT idempotency_key, COUNT(*) AS total_rows\nFROM payments\nGROUP BY idempotency_key\nHAVING COUNT(*) > 1;\n\n-- 2. Cek orphan records (detail pesanan yang kehilangan induk pesanan)\nSELECT oi.id, oi.order_id\nFROM order_items oi\nLEFT JOIN orders o ON oi.order_id = o.id\nWHERE o.id IS NULL;\n\n-- 3. Verifikasi konsistensi saldo ledger (total debit harus sama dengan total kredit)\nSELECT account_id,\n       SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE -amount END) AS calculated_balance\nFROM ledger_entries\nWHERE account_id = 'acc_9921'\nGROUP BY account_id;"
    },
    "practices": [
      "Jalankan query pengecekan duplikasi tepat setelah melakukan uji konkurensi atau load test.",
      "Pastikan foreign key constraint aktif di lingkungan staging agar orphan record tertolak otomatis.",
      "Selalu bandingkan angka ringkasan dashboard dengan agregasi SUM/COUNT langsung di database."
    ],
    "case": "Setelah stress test tombol bayar, UI hanya menampilkan 1 struk sukses, namun query `HAVING COUNT(*) > 1` menemukan 2 baris payment sukses dengan idempotency_key yang sama karena missing unique constraint.",
    "exercise": {
      "scenario": "Anda baru saja menguji fitur penghapusan (soft/hard delete) kategori produk dan fitur top-up wallet.",
      "task": "Tuliskan query SQL untuk memastikan tidak ada produk yatim (orphan) dan saldo wallet sesuai dengan penjumlahan tabel mutasi."
    },
    "quiz": {
      "question": "Query SQL manakah yang paling tepat untuk mendeteksi detail pesanan yatim (orphan records) yang kehilangan induknya di tabel orders?",
      "options": [
        "INNER JOIN orders o ON oi.order_id = o.id",
        "LEFT JOIN orders o ON oi.order_id = o.id WHERE o.id IS NULL",
        "GROUP BY order_id HAVING COUNT(*) = 0"
      ],
      "answer": 1,
      "explanation": "LEFT JOIN mempertahankan semua baris order_items; memfilter `WHERE o.id IS NULL` akan langsung menampilkan baris yang tidak memiliki pasangan di tabel orders."
    },
    "refs": []
  },
  {
    "id": "qam06",
    "mode": "qa",
    "order": 3,
    "track": "QA Fase 2B: Manual Edge, SQL & OWASP",
    "title": "Pengujian Keamanan Esensial: OWASP Top Checks untuk QA",
    "level": "Intermediate",
    "summary": "Mengintegrasikan pemeriksaan keamanan dasar dalam rutinitas QA: mendeteksi celah IDOR, Mass Assignment, dan kebocoran stack trace pada error HTTP 500.",
    "concepts": [
      [
        "IDOR (Insecure Direct Object Reference)",
        "Login sebagai User A, tangkap request GET /api/v1/orders/1055, lalu ganti token otorisasi dengan milik User B. Sistem wajib menolak dengan HTTP 403 Forbidden atau HTTP 404 Not Found (bukan menampilkan data milik User A)."
      ],
      [
        "Mass Assignment",
        "Menambahkan field sensitif seperti \"role\": \"admin\" atau \"is_verified\": true ke dalam payload JSON saat mengirim PATCH /api/v1/profile, lalu memeriksa apakah server mengabaikannya atau malah memperbarui kolom tersebut."
      ],
      [
        "Kebocoran Informasi Error",
        "Memastikan respons HTTP 500 di lingkungan staging/production tidak menampilkan stack trace, versi database, kueri SQL mentah, atau struktur direktori server."
      ]
    ],
    "compare": "Banyak tim menganggap keamanan hanya tanggung jawab pentester tahunan. Padahal mayoritas insiden kebocoran data terjadi akibat celah otorisasi sederhana (BOLA/IDOR) yang sangat mudah ditangkap QA saat menguji API.",
    "code": {
      "language": "bash",
      "content": "# 1. Uji IDOR: Gunakan token User B untuk mengakses resource milik User A\ncurl -i -X GET \"https://staging.app.id/api/v1/orders/1055\" \\\n  -H \"Authorization: Bearer <TOKEN_USER_B>\"\n# Expected: HTTP/1.1 403 Forbidden (atau 404 Not Found)\n\n# 2. Uji Mass Assignment: Sisipkan field privilege escalation\ncurl -i -X PATCH \"https://staging.app.id/api/v1/profile\" \\\n  -H \"Authorization: Bearer <TOKEN_USER_REGULAR>\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\":\"Tester\",\"role\":\"admin\",\"is_verified\":true}'\n# Expected: Field role & is_verified diabaikan atau ditolak HTTP 400/422"
    },
    "practices": [
      "Uji setiap endpoint detail (GET/PUT/PATCH/DELETE by ID) dengan 2 akun berbeda di role yang sama (horizontal IDOR).",
      "Uji endpoint admin menggunakan token pengguna reguler (vertical privilege escalation).",
      "Kirim payload rusak atau tipe data salah untuk memastikan pesan error 4xx/5xx tetap bersih dari informasi internal."
    ],
    "case": "Pada audit API invoice, mengganti nomor invoice pada URL dengan token pelanggan lain ternyata mengembalikan PDF tagihan lengkap milik perusahaan lain (IDOR). Penambahan pengecekan `where user_id = auth.id()` menutup celah tersebut.",
    "exercise": {
      "scenario": "Endpoint `PUT /api/v1/users/{id}/settings` digunakan untuk mengganti tema aplikasi pengguna.",
      "task": "Buat 2 skenario uji API negatif untuk membuktikan endpoint tersebut aman dari IDOR dan Mass Assignment."
    },
    "quiz": {
      "question": "Saat QA mengganti Authorization token pada GET /api/v1/orders/1055 (milik User A) dengan token milik User B, respons apa yang diharapkan?",
      "options": [
        "HTTP 200 OK dengan sebagian data disamarkan",
        "HTTP 403 Forbidden atau HTTP 404 Not Found",
        "HTTP 500 Internal Server Error beserta stack trace"
      ],
      "answer": 1,
      "explanation": "Server wajib memvalidasi kepemilikan resource (object-level authorization) dan menolak akses tidak sah dengan HTTP 403 atau 404."
    },
    "refs": [
      "https://owasp.org/API-Security/"
    ]
  },
  {
    "id": "qam07",
    "mode": "qa",
    "order": 5,
    "track": "QA Fase 2A: DevTools, Postman API & Jira",
    "title": "Jira Traceability, Gherkin Atomik & Filter JQL Quality Gate",
    "level": "Beginner",
    "summary": "Membangun disiplin manajemen mutu di Jira melalui relasi traceability User Story, penulisan skenario Gherkin atomik, dan filter JQL untuk menjaga gerbang rilis.",
    "concepts": [
      [
        "Struktur Traceability Wajib",
        "Tautkan setiap Test Case dan Bug ke User Story induknya melalui relasi \"tests\" atau \"is caused by\". Buat sub-task \"QA - Test Design & Review\" di awal sprint agar QA meninjau Acceptance Criteria sebelum coding."
      ],
      [
        "Standar Test Case Atomik (Gherkin)",
        "Satu Test Case hanya menguji satu perilaku spesifik menggunakan struktur Given-And-When-Then yang jelas dan tidak ambigu."
      ],
      [
        "Filter JQL Harian (Antrean QA)",
        "Memantau tiket siap uji secara terurut berdasarkan prioritas tertinggi di sprint aktif."
      ],
      [
        "Release Blocker Check via JQL",
        "Filter wajib sebelum deployment: jumlah bug berstatus Blocker/Critical yang belum Done/Closed harus bernilai 0."
      ]
    ],
    "compare": "Test case yang menggabungkan registrasi + login + checkout dalam 1 skenario menyulitkan pelacakan kegagalan. Test case atomik memisahkan setiap perilaku bisnis secara presisi.",
    "code": {
      "language": "gherkin",
      "content": "Feature: Validasi Kupon Diskon saat Checkout\n\nScenario: Menolak kupon yang sudah melewati batas waktu berlaku\n  Given pengguna telah login sebagai akun \"Regular\"\n  And keranjang belanja berisi produk dengan total harga Rp 300.000\n  When pengguna menerapkan kode kupon \"PROMOEXPIRED\" yang berakhir kemarin\n  Then sistem menampilkan pesan error \"Kode promo sudah tidak berlaku\"\n  And total pembayaran tetap Rp 300.000 tanpa potongan harga",
      "extraTitle": "Filter JQL Harian untuk Quality Gate"
    },
    "extraCodes": [
      {
        "title": "Filter JQL Harian & Release Blocker Gate",
        "language": "sql",
        "variant": "neutral",
        "content": "-- Antrean siap diuji:\nproject = CORE AND sprint in openSprints() AND status = \"Ready for QA\" ORDER BY priority DESC\n\n-- Release Blocker Check (harus bernilai 0 sebelum rilis):\nproject = CORE AND issuetype = Bug AND severity in (Blocker, Critical) AND status not in (Done, Closed)"
      }
    ],
    "practices": [
      "Pastikan tidak ada tiket User Story yang selesai tanpa terhubung ke Test Case.",
      "Gunakan Given untuk prasyarat awal, When untuk 1 aksi pemicu, dan Then untuk hasil yang terukur.",
      "Jadikan filter JQL Release Blocker Check sebagai agenda wajib rapat Go/No-Go rilis."
    ],
    "case": "Sebelum rilis mingguan, JQL Release Blocker Check langsung memunculkan 1 tiket bug Critical pada alur refund yang masih berstatus \"In Review\", sehingga tim menunda rilis 2 jam hingga perbaikan terverifikasi.",
    "exercise": {
      "scenario": "Fitur baru memungkinkan member VIP menukar poin reward menjadi voucher gratis ongkir.",
      "task": "Tuliskan 2 skenario Gherkin atomik (1 positif sukses tukar poin, 1 negatif poin tidak mencukupi) beserta filter JQL untuk melacak bug sprint tersebut."
    },
    "quiz": {
      "question": "Mengapa QA disarankan membuat sub-task \"QA - Test Design & Review\" di awal sprint sebelum developer menulis kode?",
      "options": [
        "Agar QA dapat mulai menulis skrip Selenium lebih cepat tanpa aplikasi.",
        "Agar QA dapat meninjau celah Acceptance Criteria sejak dini (Shift-Left) sebelum cacat logika telanjur ditulis menjadi kode.",
        "Agar jumlah story point developer terlihat lebih kecil."
      ],
      "answer": 1,
      "explanation": "Meninjau Acceptance Criteria sebelum coding menemukan ketidakjelasan aturan bisnis dengan biaya terendah (Shift-Left Testing)."
    },
    "refs": []
  },
  {
    "id": "qam08",
    "mode": "qa",
    "order": 6,
    "track": "QA Fase 2A: DevTools, Postman API & Jira",
    "title": "Anatomi Bug Report Standar Produksi & Forensik HAR/cURL",
    "level": "Beginner",
    "summary": "Menulis laporan bug yang langsung dapat ditindaklanjuti developer tanpa tanya-jawab berulang, lengkap dengan bukti teknis .har, cURL reproduksi, dan log JSON.",
    "concepts": [
      [
        "Judul Spesifik Berpola",
        "Format [Modul][Komponen] Gejala Error & Kondisi Pemicu (contoh: [Checkout][Payment API] HTTP 500 saat tombol Bayar diklik dua kali < 500 ms)."
      ],
      [
        "Informasi Lingkungan Presisi",
        "Cantumkan Severity, Priority, URL environment & versi build, ID akun uji (tanpa password produksi), serta Browser/OS & resolusi layar."
      ],
      [
        "Pre-conditions & Steps to Reproduce",
        "Langkah bernomor yang deterministik mulai dari state keranjang/data hingga pemicu aksi agar developer tidak menebak kondisi awal."
      ],
      [
        "Actual vs Expected & Bukti Teknis",
        "Bandingkan respons aktual (kode HTTP/error constraint) dengan ekspektasi (idempoten HTTP 200/409), disertai lampiran .har network trace dan cURL."
      ]
    ],
    "compare": "Bug report amatir (\"Tombol bayar error, tolong cek\") membuang waktu 2 jam investigasi. Bug report forensik (.har + cURL + actual vs expected) membuat developer menemukan akar masalah dalam 5 menit.",
    "code": {
      "language": "markdown",
      "content": "### Judul:\n[Checkout][Payment API] HTTP 500 Internal Server Error saat tombol Bayar diklik dua kali dalam waktu kurang dari 500 ms\n\n### Informasi Lingkungan:\n- **Severity:** Critical | **Priority:** P0 - Immediate Fix\n- **Environment:** Staging (https://staging.app.id) | Build: v2.18.0-rc1\n- **Akun Uji:** qa.tester01@mail.com (ID: usr_4412)\n- **Browser/OS:** Chrome 131 / Windows 11 (1920x1080)\n\n### Pre-conditions:\n1. Keranjang memiliki 1 produk aktif dengan stok tersisa 1.\n2. Halaman berada di /checkout dengan metode pembayaran Virtual Account.\n\n### Steps to Reproduce:\n1. Klik tombol **\"Bayar Sekarang\"** dua kali berturut-turut dengan cepat (double-click).\n\n### Actual Result:\nRequest pertama mengembalikan HTTP 201 Created, sedangkan request kedua memicu HTTP 500 Internal Server Error (duplicate key value violates unique constraint) dan membuat entri transaksi menggantung.\n\n### Expected Result:\nTombol langsung berubah menjadi disabled pada klik pertama, dan endpoint backend mengembalikan respons idempoten (HTTP 200 atau HTTP 409) berdasarkan header Idempotency-Key tanpa error database.\n\n### Lampiran Bukti Teknis:\n- Network trace: checkout-double-click.har\n- cURL reproduksi & JSON response terlampir."
    },
    "practices": [
      "Selalu ekspor file .har dari Chrome DevTools Network (klik kanan -> Save all as HAR with content) untuk bug API/frontend kompleks.",
      "Gunakan \"Copy as cURL\" dari DevTools agar developer bisa langsung memutar ulang request di terminal.",
      "Jangan pernah menyertakan password asli atau token sensitif produksi ke dalam tiket publik."
    ],
    "case": "Developer mengklaim bug tidak dapat direproduksi di lokal (\"Works on my machine\"). Dengan melampirkan cURL dan payload HAR yang menunjukkan header `Idempotency-Key` tidak terkirim pada klik kedua, developer langsung mengakuinya dan memperbaiki dalam 20 menit.",
    "exercise": {
      "scenario": "Saat menguji halaman profil pada koneksi Slow 3G, update nama gagal dengan status 422 karena request payload mengirim string kosong.",
      "task": "Susun laporan bug lengkap mengikuti seluruh komponen template standar produksi di atas."
    },
    "quiz": {
      "question": "Mengapa QA wajib melampirkan file .har atau perintah cURL pada laporan bug API/Checkout?",
      "options": [
        "Agar ukuran tiket Jira terlihat lebih besar.",
        "Agar developer memperoleh salinan lengkap header, payload, cookie, dan timing jaringan untuk mereproduksi bug secara instan tanpa menebak.",
        "Karena browser tidak bisa menyimpan screenshot."
      ],
      "answer": 1,
      "explanation": "HAR dan cURL merekam seluruh konteks request-response HTTP secara persis sehingga menghilangkan miskomunikasi saat investigasi."
    },
    "refs": [],
    "extraCodes": [
      {
        "title": "Template Bug Report Standar Jira (Contoh Kasus Upload Avatar PNG)",
        "language": "markdown",
        "variant": "neutral",
        "content": "Bug Summary: [AUTH] Tombol \"Submit\" Tidak Merespons Saat Mengunggah Foto Profil dalam Format PNG\n\nEnvironment:\n- OS: macOS Sonoma 14.5\n- Browser: Chrome v125.0.6422.142\n- Environment: Staging v2.4.1\n\nSteps to Reproduce (STR):\n1. Buka aplikasi dan login menggunakan akun user standar.\n2. Navigasi ke menu Profile Settings (/settings/profile).\n3. Klik \"Choose File\" dan pilih file gambar berformat PNG (< 2MB).\n4. Klik tombol \"Submit Profile\".\n\nExpected Result:\nFoto profil berhasil diperbarui dan muncul pesan sukses \"Profil berhasil disimpan\".\n\nActual Result:\nTombol \"Submit Profile\" membeku (disabled), indikator loading berputar terus-menerus, dan foto tidak tersimpan.\n\nConsole / Network Log:\n- Status Code: 500 Internal Server Error pada Endpoint POST /api/v1/user/avatar\n- Console Log Error: \"Uncaught TypeError: Cannot read property 'mime' of undefined\"\n\nAttachment: [Screenshot / Screen Recording / Network Payload log]"
      }
    ]
  },
  {
    "id": "qam09",
    "mode": "qa",
    "order": 7,
    "track": "QA Fase 2A: DevTools, Postman API & Jira",
    "title": "Arsitektur Variabel Postman & Pre-request Script Auto-Auth",
    "level": "Intermediate",
    "summary": "Mengelola variabel Environment vs Collection secara rapi dan menulis Pre-request Script otomatis untuk membuat Idempotency-Key GUID serta memperbarui token JWT.",
    "concepts": [
      [
        "Environment Variables",
        "Menyimpan konfigurasi spesifik lingkungan (Local, Staging): base_url, qa_email, qa_password agar satu koleksi dapat dijalankan di berbagai server."
      ],
      [
        "Collection Variables",
        "Menyimpan state dinamis selama eksekusi suite: access_token, token_expiry, idempotency_key, dan created_order_id."
      ],
      [
        "Auto-Generate Idempotency-Key",
        "Memanfaatkan {{$guid}} di level Collection Pre-request Script agar setiap eksekusi mutasi memiliki kunci unik secara otomatis."
      ],
      [
        "Auto-Refresh Token JWT",
        "Mengecek apakah token kosong atau melewati token_expiry, lalu memanggil endpoint /api/v1/auth/login melalui pm.sendRequest sebelum request utama berjalan."
      ]
    ],
    "compare": "Menempelkan token JWT secara manual di header puluhan request menyebabkan suite gagal setiap 15 menit saat token kedaluwarsa. Pre-request script otomatis membuat suite 100% self-healing.",
    "code": {
      "language": "javascript",
      "content": "// 1. Buat Idempotency-Key unik untuk setiap eksekusi request\nconst uniqueKey = pm.variables.replaceIn('{{$guid}}');\npm.collectionVariables.set('idempotency_key', uniqueKey);\n\n// 2. Perbarui token otentikasi secara otomatis jika kosong atau kedaluwarsa\nconst expiry = Number(pm.collectionVariables.get('token_expiry') || 0);\nif (!pm.collectionVariables.get('access_token') || Date.now() > expiry) {\n    pm.sendRequest({\n        url: pm.environment.get('base_url') + '/api/v1/auth/login',\n        method: 'POST',\n        header: { 'Content-Type': 'application/json' },\n        body: {\n            mode: 'raw',\n            raw: JSON.stringify({\n                email: pm.environment.get('qa_email'),\n                password: pm.environment.get('qa_password')\n            })\n        }\n    }, (err, res) => {\n        if (!err && res.code === 200) {\n            const payload = res.json();\n            pm.collectionVariables.set('access_token', payload.access_token);\n            pm.collectionVariables.set('token_expiry', Date.now() + 14 * 60 * 1000);\n        }\n    });\n}"
    },
    "practices": [
      "Jangan pernah meng-hardcode URL staging atau password di dalam URL/body request.",
      "Set waktu kedaluwarsa lokal sedikit lebih pendek dari TTL asli JWT (mis. 14 menit untuk token 15 menit) sebagai margin aman.",
      "Pisahkan file environment JSON dari repositori publik jika mengandung rahasia sensitif."
    ],
    "case": "Suite API berjumlah 120 endpoint sering gagal di tengah eksekusi saat dijalankan di CI karena masa berlaku JWT 15 menit habis. Setelah menambahkan cek `token_expiry` di level collection, suite berjalan stabil 100%.",
    "exercise": {
      "scenario": "API Anda mewajibkan header `X-Request-ID` dan menggunakan refresh token saat access token kedaluwarsa.",
      "task": "Modifikasi Pre-request Script di atas untuk menghasilkan `X-Request-ID` menggunakan `{{$guid}}` dan menyimpan `access_token` baru."
    },
    "quiz": {
      "question": "Di mana lokasi terbaik menempatkan script auto-refresh token JWT di Postman agar berlaku untuk seluruh endpoint terproteksi?",
      "options": [
        "Di tab Tests milik request terakhir.",
        "Di Pre-request Script pada level Collection.",
        "Di deskripsi Environment."
      ],
      "answer": 1,
      "explanation": "Pre-request Script di level Collection berjalan otomatis sebelum setiap request di dalam koleksi dieksekusi."
    },
    "refs": [
      "https://learning.postman.com/docs/writing-scripts/pre-request-scripts/"
    ]
  },
  {
    "id": "qam10",
    "mode": "qa",
    "order": 8,
    "track": "QA Fase 2A: DevTools, Postman API & Jira",
    "title": "Assertions Lengkap (pm.test) & Eksekusi CLI Newman",
    "level": "Intermediate",
    "summary": "Menulis validasi kontrak JSON, anggaran latensi server, serta akurasi kalkulasi bisnis dalam pm.test, lalu menjalankannya lewat Newman CLI dengan laporan JUnit.",
    "concepts": [
      [
        "Validasi Status & Anggaran Latensi",
        "Memastikan status HTTP sesuai (mis. 201 Created) sekaligus mengunci SLA responseTime di bawah ambang batas (mis. < 350 ms)."
      ],
      [
        "Validasi Kontrak Struktur & Tipe Data",
        "Menguji properti JSON dengan pm.expect (order_id harus string, items berupa array tidak kosong, grand_total bertipe number)."
      ],
      [
        "Validasi Kalkulasi Bisnis & Chaining",
        "Memverifikasi hitungan pajak PPN 11% (Subtotal 200.000 + PPN 22.000 = 222.000) dan menyimpan created_order_id untuk request selanjutnya."
      ],
      [
        "Eksekusi Otomatis CLI via Newman",
        "Menjalankan koleksi tanpa GUI menggunakan newman run dan menghasilkan reporter cli serta junit XML untuk CI/CD."
      ]
    ],
    "compare": "Hanya menguji `status === 200` berisiko meloloskan respons dengan total harga Rp 0 atau field yang tiba-tiba berubah dari number menjadi string. Assertion menyeluruh mengunci kebenaran bisnis & skema.",
    "code": {
      "language": "javascript",
      "content": "const body = pm.response.json();\n\npm.test('HTTP Status Code adalah 201 Created', () => {\n    pm.response.to.have.status(201);\n});\n\npm.test('Waktu respons API berada di bawah anggaran 350 ms', () => {\n    pm.expect(pm.response.responseTime).to.be.below(350);\n});\n\npm.test('Kontrak struktur dan tipe data JSON valid', () => {\n    pm.expect(body).to.have.property('order_id').that.is.a('string');\n    pm.expect(body.items).to.be.an('array').that.is.not.empty;\n    pm.expect(body.grand_total).to.be.a('number');\n});\n\npm.test('Kalkulasi pajak PPN 11% akurat dan simpan order_id', () => {\n    // Subtotal 200.000 + PPN 22.000 = 222.000\n    pm.expect(body.grand_total).to.eql(222000);\n    pm.collectionVariables.set('created_order_id', body.order_id);\n});"
    },
    "extraCodes": [
      {
        "title": "Eksekusi CLI Newman & Laporan JUnit XML",
        "language": "bash",
        "variant": "neutral",
        "content": "newman run tests/api/ecommerce.postman_collection.json \\\n  -e tests/api/staging.postman_environment.json \\\n  --reporters cli,junit \\\n  --reporter-junit-export reports/newman-junit.xml"
      }
    ],
    "practices": [
      "Selalu sertakan pengecekan tipe data (is.a(\"number\"), is.an(\"array\")) bukan hanya mengecek keberadaan key.",
      "Ekspor laporan dalam format junit XML agar GitHub Actions / Jenkins dapat merender ringkasan pass/fail otomatis.",
      "Gunakan chaining variabel (created_order_id) untuk membersihkan data uji di akhir suite (teardown)."
    ],
    "case": "Perubahan backend tak sengaja mengubah field `grand_total` dari angka `222000` menjadi string `\"222000\"`, yang merusak aplikasi mobile. Assertion `.to.be.a(\"number\")` pada Newman langsung memblokir Pull Request.",
    "exercise": {
      "scenario": "Endpoint `GET /api/v1/orders/{id}` mengembalikan rincian pesanan termasuk `subtotal`, `tax`, dan `grand_total`.",
      "task": "Tulis blok `pm.test` untuk memeriksa status 200, waktu respons < 300ms, dan memastikan `subtotal + tax === grand_total`."
    },
    "quiz": {
      "question": "Apa kegunaan flag `--reporters cli,junit` saat menjalankan Newman di pipeline CI/CD?",
      "options": [
        "Mempercepat eksekusi query database.",
        "Menampilkan ringkasan tes di terminal sekaligus mengekspor laporan XML standar agar dapat dibaca oleh sistem CI/CD.",
        "Mengonversi koleksi Postman menjadi skrip Playwright."
      ],
      "answer": 1,
      "explanation": "Reporter CLI mencetak output log langsung ke konsol, sementara JUnit menghasilkan file XML terstruktur untuk pelaporan artefak CI/CD."
    },
    "refs": [
      "https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/"
    ]
  },
  {
    "id": "qam11",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 3: Playwright E2E Automation",
    "title": "Playwright: Struktur Proyek, Hierarki Selektor & Page Object Model",
    "level": "Intermediate",
    "summary": "Membangun fondasi arsitektur E2E modern berbasis TypeScript menggunakan Page Object Model (POM) dan hierarki selektor berorientasi aksesibilitas yang anti-flaky.",
    "concepts": [
      [
        "Struktur Proyek Standar Industri",
        "Memisahkan folder pages/ (CheckoutPage.ts), utils/ (webVitalsHelper.ts), tests/ (checkout.spec.ts), dan playwright.config.ts agar kode mudah dirawat."
      ],
      [
        "Hierarki Selektor Wajib",
        "Urutan prioritas: 1) getByRole(\"button\", { name: \"...\" }) (menguji aksesibilitas), 2) getByLabel, 3) getByPlaceholder, 4) getByTestId(\"...\")."
      ],
      [
        "Larangan Keras Anti-Flaky",
        "Dilarang keras menggunakan page.waitForTimeout(...) (sleep statis) dan selektor XPath absolut (/html/body/div[2]/...) yang rapuh terhadap perubahan styling."
      ],
      [
        "Implementasi Page Object Model",
        "Membungkus Locator dan aksi interaksi (goto, submitOrder) dengan built-in auto-waiting assertion seperti expect(this.payButton).toBeEnabled()."
      ]
    ],
    "compare": "Menaruh selektor CSS rapuh (`div.btn > span:nth-child(2)`) di dalam file tes menyebabkan ratusan skrip patah tiap kali UI diubah. POM + ARIA role membuat tes tahan banting dan sekaligus memvalidasi aksesibilitas.",
    "code": {
      "language": "typescript",
      "content": "// pages/CheckoutPage.ts\nimport { Page, Locator, expect } from '@playwright/test';\n\nexport class CheckoutPage {\n  readonly page: Page;\n  readonly promoInput: Locator;\n  readonly applyPromoBtn: Locator;\n  readonly payButton: Locator;\n  readonly grandTotalLabel: Locator;\n  readonly alertBanner: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.promoInput = page.getByLabel('Kode Promo');\n    this.applyPromoBtn = page.getByRole('button', { name: 'Terapkan' });\n    this.payButton = page.getByRole('button', { name: 'Bayar Sekarang' });\n    this.grandTotalLabel = page.getByTestId('checkout-grand-total');\n    this.alertBanner = page.getByRole('alert');\n  }\n\n  async goto(draftId: string) {\n    await this.page.goto(`/checkout/${draftId}`);\n  }\n\n  async submitOrder() {\n    await expect(this.payButton).toBeEnabled();\n    await this.payButton.click();\n  }\n}"
    },
    "extraCodes": [
      {
        "title": "Struktur Direktori Suite Playwright",
        "language": "text",
        "variant": "neutral",
        "content": "qa-playwright-suite/\n├── pages/\n│   └── CheckoutPage.ts          # Page Object Model (selektor & aksi halaman)\n├── utils/\n│   └── webVitalsHelper.ts       # Injeksi PerformanceObserver untuk LCP & CLS\n├── tests/\n│   └── checkout.spec.ts         # Skenario E2E, API seeding, fault injection & audit\n├── playwright.config.ts         # Konfigurasi worker paralel, retry & trace viewer\n└── package.json"
      }
    ],
    "practices": [
      "Selalu prioritaskan getByRole dan getByLabel karena mensimulasikan cara pembaca layar & pengguna nyata melihat halaman.",
      "Andalkan auto-waiting assertions Playwright (toBeVisible, toBeEnabled, toHaveText) dibanding sleep manual.",
      "Simpan logika validasi kompleks di dalam file tes (.spec.ts), dan biarkan Page Object fokus pada elemen serta aksi halaman."
    ],
    "case": "Saat tim frontend bermigrasi dari div biasa ke komponen tombol kustom baru, tes yang memakai `getByRole(\"button\", { name: \"Bayar Sekarang\" })` langsung menemukan bahwa tombol baru lupa diberi atribut aksesibilitas role/button.",
    "exercise": {
      "scenario": "Anda memiliki halaman Login berisi input Email (label \"Alamat Email\"), Password (label \"Kata Sandi\"), tombol \"Masuk\", dan banner pesan error (`role=\"alert\"`).",
      "task": "Buat class `LoginPage` TypeScript lengkap mengikuti hierarki selektor wajib Playwright."
    },
    "quiz": {
      "question": "Manakah selektor yang memiliki prioritas TERTINGGI dalam hierarki praktik terbaik Playwright?",
      "options": [
        "page.locator(\"/html/body/div[2]/button[1]\")",
        "page.getByRole(\"button\", { name: \"Bayar Sekarang\" })",
        "page.locator(\".btn-primary-blue-v2\")"
      ],
      "answer": 1,
      "explanation": "getByRole memverifikasi semantik aksesibilitas elemen dan paling tahan terhadap perubahan struktur DOM maupun CSS."
    },
    "refs": [
      "https://playwright.dev/docs/locators"
    ]
  },
  {
    "id": "qam12",
    "mode": "qa",
    "order": 3,
    "track": "QA Fase 3: Playwright E2E Automation",
    "title": "Playwright: API Seeding, Fault Injection & Web Vitals Gate",
    "level": "Advanced",
    "summary": "Mempercepat E2E dengan API Seeding, menyuntikkan PerformanceObserver untuk mengunci LCP/CLS sebagai Quality Gate, menyimulasikan error HTTP 503 via page.route, dan konfigurasi paralel.",
    "concepts": [
      [
        "API Seeding (beforeEach)",
        "Menyiapkan state keranjang/order langsung lewat endpoint API (/api/v1/test/seed-checkout) sebelum tes berjalan agar E2E tidak membuang waktu klik katalog berulang."
      ],
      [
        "Web Vitals Quality Gate",
        "Menyuntikkan PerformanceObserver via page.addInitScript untuk mengukur LCP (< 2500ms) dan CLS (< 0.1) nyata di setiap rilis E2E."
      ],
      [
        "Network Fault Injection (page.route)",
        "Memaksa endpoint pembayaran mengembalikan HTTP 503 SERVICE_UNAVAILABLE untuk membuktikan UI menampilkan alert yang ramah (graceful degradation) tanpa blank/crash."
      ],
      [
        "Konfigurasi Trace Forensik & Paralel",
        "Mengaktifkan fullyParallel: true, retries di CI, trace: \"on-first-retry\", screenshot/video on failure, serta proyek Desktop Chrome dan Mobile Pixel 7."
      ]
    ],
    "compare": "Menguji kondisi error gateway pembayaran di lingkungan staging asli hampir mustahil direproduksi secara konsisten. Fault injection dengan `page.route` menguji ketahanan UI secara deterministik dalam milidetik.",
    "code": {
      "language": "typescript",
      "content": "// tests/checkout.spec.ts\nimport { test, expect } from '@playwright/test';\nimport { CheckoutPage } from '../pages/CheckoutPage';\n\ntest.describe('Checkout Flow, Resilience & Core Web Vitals', () => {\n  let draftOrderId: string;\n\n  // API Seeding: Siapkan state keranjang lewat API sebelum tes berjalan\n  test.beforeEach(async ({ request }) => {\n    const response = await request.post('/api/v1/test/seed-checkout', {\n      data: { sku: 'MONITOR-4K-27', quantity: 1 }\n    });\n    expect(response.ok()).toBeTruthy();\n    const data = await response.json();\n    draftOrderId = data.draft_id;\n  });\n\n  test('Transaksi sukses dan memenuhi anggaran performa LCP serta CLS', async ({ page }) => {\n    const checkout = new CheckoutPage(page);\n\n    await page.addInitScript(() => {\n      (window as any).__qaVitals = { lcp: 0, cls: 0 };\n      new PerformanceObserver((list) => {\n        const entries = list.getEntries();\n        (window as any).__qaVitals.lcp = entries[entries.length - 1].startTime;\n      }).observe({ type: 'largest-contentful-paint', buffered: true });\n\n      new PerformanceObserver((list) => {\n        for (const entry of list.getEntries() as any[]) {\n          if (!entry.hadRecentInput) {\n            (window as any).__qaVitals.cls += entry.value;\n          }\n        }\n      }).observe({ type: 'layout-shift', buffered: true });\n    });\n\n    await checkout.goto(draftOrderId);\n    await expect(checkout.grandTotalLabel).toHaveText('Rp 6.500.000');\n\n    const vitals = await page.evaluate(() => (window as any).__qaVitals);\n    expect(vitals.lcp, `LCP (${vitals.lcp}ms) melebihi batas 2500ms`).toBeLessThan(2500);\n    expect(vitals.cls, `CLS (${vitals.cls}) melebihi batas 0.1`).toBeLessThan(0.1);\n\n    await checkout.submitOrder();\n    await expect(page).toHaveURL(/\\/payment\\/waiting/);\n  });\n\n  test('Graceful degradation saat Payment API mengalami gangguan HTTP 503', async ({ page }) => {\n    const checkout = new CheckoutPage(page);\n    await checkout.goto(draftOrderId);\n\n    // Fault Injection: Paksa endpoint pembayaran gagal dengan HTTP 503\n    await page.route('**/api/v1/payments/charge', async (route) => {\n      await route.fulfill({\n        status: 503,\n        contentType: 'application/json',\n        body: JSON.stringify({ error: 'SERVICE_UNAVAILABLE', message: 'Gateway sibuk' })\n      });\n    });\n\n    await checkout.submitOrder();\n\n    // Pastikan UI tidak blank/crash dan pengguna dapat mencoba ulang\n    await expect(checkout.alertBanner).toContainText('Layanan pembayaran sedang sibuk');\n    await expect(checkout.payButton).toBeEnabled();\n  });\n});"
    },
    "extraCodes": [
      {
        "title": "playwright.config.ts (Parallel Workers, Retry & Trace Forensics)",
        "language": "typescript",
        "variant": "neutral",
        "content": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 4 : undefined,\n  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'reports/e2e-junit.xml' }]],\n  use: {\n    baseURL: process.env.BASE_URL || 'http://localhost:3000',\n    trace: 'on-first-retry', // Merekam rekaman forensik lengkap saat tes gagal pertama kali\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure'\n  },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } }\n  ]\n});"
      }
    ],
    "practices": [
      "Gunakan API Seeding untuk menyiapkan data uji agar tiap skenario tes independen dan cepat.",
      "Set trace: \"on-first-retry\" agar artefak CI tetap ringan namun memberi rekaman DOM & Network lengkap saat tes gagal.",
      "Sertakan proyek mobile-chrome (Pixel 7) untuk mendeteksi masalah tombol terpotong atau overflow responsif otomatis."
    ],
    "case": "Ketika payment gateway pihak ketiga sempat down 5 menit, halaman checkout tidak menampilkan error putih berkat skenario fault injection HTTP 503 yang sudah diverifikasi sebelum rilis.",
    "exercise": {
      "scenario": "Halaman checkout memiliki fitur terapkan kupon promo `POST /api/v1/promos/apply`.",
      "task": "Tuliskan skenario Playwright menggunakan `page.route` untuk menyimulasikan timeout/HTTP 504 pada endpoint promo dan pastikan tombol Terapkan kembali aktif."
    },
    "quiz": {
      "question": "Apa fungsi utama `page.route` pada pengujian E2E Playwright di skenario Fault Injection?",
      "options": [
        "Mempercepat DNS lookup browser.",
        "Mencegat permintaan jaringan dan memaksa respons tiruan (seperti HTTP 503) untuk menguji ketahanan UI.",
        "Mengubah bahasa antarmuka aplikasi secara otomatis."
      ],
      "answer": 1,
      "explanation": "page.route memungkinkan QA menyimulasikan kegagalan jaringan/backend secara deterministik untuk memverifikasi graceful degradation di UI."
    },
    "refs": [
      "https://playwright.dev/docs/network"
    ]
  },
  {
    "id": "qam13",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 4A: Web Performance (Core Web Vitals)",
    "title": "Ambang Batas Core Web Vitals (75th Percentile) & Diagnosis TTFB",
    "level": "Intermediate",
    "summary": "Memahami standar ambang batas 75th percentile untuk TTFB, LCP, INP, dan CLS serta teknik diagnosis dan penanganan bottleneck Time to First Byte.",
    "concepts": [
      [
        "Standar 75th Percentile Field Data",
        "Google menilai kesehatan performa aplikasi berdasarkan pengalaman nyata 75% pengguna di perangkat seluler maupun desktop."
      ],
      [
        "Diagnosis TTFB di DevTools",
        "Buka tab Network -> klik request dokumen HTML utama -> buka sub-tab Timing -> periksa durasi Waiting for server response (TTFB)."
      ],
      [
        "Handling 1: Hapus Redirect Chains",
        "Setiap pengalihan berlapis (http -> https -> www -> /id) menambah round-trip TCP/TLS berulang sebelum server mulai merender HTML."
      ],
      [
        "Handling 2 & 3: Edge Caching & Query Optimization",
        "Terapkan header Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400 di CDN, hilangkan N+1 query database, dan gunakan connection pooling."
      ]
    ],
    "tables": [
      {
        "title": "Ambang Batas Standar Web Performance (75th Percentile)",
        "headers": [
          "Metrik",
          "Definisi Singkat",
          "Baik (Good)",
          "Perlu Perbaikan",
          "Buruk (Poor)"
        ],
        "rows": [
          [
            "TTFB",
            "Waktu hingga byte pertama dokumen HTML diterima",
            "<= 800 ms",
            "800 ms < t <= 1800 ms",
            "> 1800 ms"
          ],
          [
            "LCP",
            "Waktu render elemen konten terbesar di viewport awal",
            "<= 2.5 s",
            "2.5 s < t <= 4.0 s",
            "> 4.0 s"
          ],
          [
            "INP",
            "Latensi respons visual terburuk atas interaksi pengguna",
            "<= 200 ms",
            "200 ms < t <= 500 ms",
            "> 500 ms"
          ],
          [
            "CLS",
            "Total skor pergeseran tata letak tak terduga",
            "<= 0.1",
            "0.1 < s <= 0.25",
            "> 0.25"
          ]
        ]
      }
    ],
    "compare": "TTFB yang lambat (> 1.8s) otomatis menyeret LCP ikut lambat karena browser tidak bisa mengunduh CSS maupun gambar hero sebelum byte pertama dokumen HTML tiba.",
    "code": {
      "language": "http",
      "content": "HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\nCache-Control: public, s-maxage=3600, stale-while-revalidate=86400"
    },
    "practices": [
      "Selalu cek durasi Waiting (TTFB) di DevTools Network tab pada mode tanpa cache (Disable cache).",
      "Gunakan stale-while-revalidate agar CDN melayani HTML instan sembari memperbarui cache di latar belakang.",
      "Audit query halaman utama untuk membasmi pola N+1 query dan pastikan connection pool database terkonfigurasi."
    ],
    "case": "Halaman katalog publik memiliki TTFB 2.4 detik karena menjalankan 45 query SQL terpisah setiap kali halaman dibuka. Penerapan CDN `s-maxage` + perbaikan eager loading menurunkan TTFB menjadi 110 ms.",
    "exercise": {
      "scenario": "Sebuah halaman artikel memiliki TTFB 1.9 detik dan mengalami 2 kali redirect sebelum mencapai URL final.",
      "task": "Tuliskan 3 langkah investigasi di DevTools serta rekomendasi konfigurasi server/CDN untuk menurunkannya di bawah 800 ms."
    },
    "quiz": {
      "question": "Berapakah ambang batas kategori \"Good\" untuk metrik TTFB, LCP, INP, dan CLS pada 75th percentile?",
      "options": [
        "TTFB <= 1800ms, LCP <= 4.0s, INP <= 500ms, CLS <= 0.25",
        "TTFB <= 800ms, LCP <= 2.5s, INP <= 200ms, CLS <= 0.1",
        "TTFB <= 200ms, LCP <= 1.0s, INP <= 50ms, CLS <= 0.01"
      ],
      "answer": 1,
      "explanation": "Ambang batas Good resmi Core Web Vitals adalah TTFB <= 800 ms, LCP <= 2.5 detik, INP <= 200 ms, dan CLS <= 0.1."
    },
    "refs": [
      "https://web.dev/articles/vitals"
    ]
  },
  {
    "id": "qam14",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 4A: Web Performance (Core Web Vitals)",
    "title": "Studi Kasus Perbaikan LCP: Dari 4.6s ke 1.4s",
    "level": "Intermediate",
    "summary": "Mendiagnosis Largest Contentful Paint di Chrome DevTools Performance (Slow 4G & 4x CPU) dan memperbaiki render-blocking scripts serta prioritas gambar hero.",
    "concepts": [
      [
        "Diagnosis DevTools Performance",
        "Aktifkan Network: Slow 4G & CPU: 4x slowdown -> Record & Reload -> klik penanda LCP untuk memisahkan Resource Load Delay vs Element Render Delay."
      ],
      [
        "Kesalahan Fatal 1: Render-Blocking Script",
        "Script analitik berat di <head> tanpa atribut defer/async menahan browser mengurai dan menggambar DOM."
      ],
      [
        "Kesalahan Fatal 2: loading=\"lazy\" pada Hero Image",
        "Memberikan loading=\"lazy\" pada elemen LCP di atas lipatan (above-the-fold) menunda browser mengunduh gambar hingga layout selesai."
      ],
      [
        "Perbaikan Best Practice",
        "Gunakan <link rel=\"preload\" as=\"image\" fetchpriority=\"high\">, format modern AVIF, tambahkan defer pada script non-kritis, serta dimensi eksplisit width/height dan decoding=\"async\"."
      ]
    ],
    "compare": "Banyak developer menaruh `loading=\"lazy\"` di semua komponen `<img>` secara membabi buta. Untuk gambar LCP utama, `loading=\"lazy\"` justru merusak metrik LCP secara drastis.",
    "code": {
      "language": "html",
      "content": "<!-- KODE PERBAIKAN BEST PRACTICE (LCP Cepat - 1.4s) -->\n<head>\n  <!-- 1. Preload gambar LCP agar langsung diunduh paralel bersama CSS -->\n  <link rel=\"preload\" as=\"image\" href=\"/images/banner-utama.avif\" fetchpriority=\"high\" />\n\n  <!-- 2. Non-blocking script dengan atribut defer -->\n  <script src=\"/assets/analytics-heavy.js\" defer></script>\n  <link rel=\"stylesheet\" href=\"/assets/critical.css\" />\n</head>\n<body>\n  <section class=\"hero\">\n    <!-- 3. Hapus loading=\"lazy\", gunakan format modern AVIF & fetchpriority=\"high\" -->\n    <img\n      src=\"/images/banner-utama.avif\"\n      width=\"1200\"\n      height=\"600\"\n      fetchpriority=\"high\"\n      decoding=\"async\"\n      alt=\"Promo Utama\"\n    />\n  </section>\n</body>"
    },
    "extraCodes": [
      {
        "title": "Kode Bermasalah (LCP Lambat - 4.6s) — Hindari Pola Ini",
        "language": "html",
        "variant": "bad",
        "content": "<head>\n  <!-- Render-blocking script menahan browser menggambar DOM -->\n  <script src=\"/assets/analytics-heavy.js\"></script>\n  <link rel=\"stylesheet\" href=\"/assets/all-styles.css\" />\n</head>\n<body>\n  <!-- Kesalahan fatal: gambar hero diberi lazy-loading dan tanpa prioritas tinggi -->\n  <section class=\"hero\">\n    <img src=\"/images/banner-utama.jpg\" loading=\"lazy\" alt=\"Promo Utama\" />\n  </section>\n</body>"
      }
    ],
    "practices": [
      "Jangan pernah memasang loading=\"lazy\" pada elemen gambar atau banner yang berada di viewport awal (above-the-fold).",
      "Berikan atribut fetchpriority=\"high\" pada gambar LCP agar browser memprioritaskan bandwidth untuknya.",
      "Konversi aset banner besar ke format AVIF atau WebP dan pisahkan CSS kritis dari stylesheet non-kritis."
    ],
    "case": "Halaman utama toko online mencatat LCP 4.6 detik pada koneksi 4G karena `analytics.js` memblokir rendering 1.8s dan banner JPEG 900KB memakai `loading=\"lazy\"`. Setelah optimasi preload + AVIF + defer, LCP turun ke 1.4 detik.",
    "exercise": {
      "scenario": "Audit DevTools menunjukkan gambar hero Anda baru mulai diunduh pada detik ke-3 setelah bundle JavaScript selesai dieksekusi.",
      "task": "Identifikasi jenis delay tersebut dan tuliskan tag HTML `<link rel=\"preload\">` serta atribut `<img>` yang benar."
    },
    "quiz": {
      "question": "Tindakan manakah yang justru MEMPERBURUK skor LCP pada gambar banner utama di bagian paling atas halaman?",
      "options": [
        "Menambahkan fetchpriority=\"high\" dan preload gambar.",
        "Memasang atribut loading=\"lazy\" pada gambar banner utama.",
        "Menambahkan atribut defer pada script analitik di tag <head>."
      ],
      "answer": 1,
      "explanation": "Atribut loading=\"lazy\" menunda pengunduhan gambar sampai browser selesai menghitung layout dan posisi scroll, sehingga memperlambat kemunculan LCP secara signifikan."
    },
    "refs": [
      "https://web.dev/articles/optimize-lcp"
    ]
  },
  {
    "id": "qam15",
    "mode": "qa",
    "order": 3,
    "track": "QA Fase 4A: Web Performance (Core Web Vitals)",
    "title": "Studi Kasus Perbaikan INP: Dari 620ms ke 65ms (Anti Layout Thrashing)",
    "level": "Advanced",
    "summary": "Mengatasi Interaction to Next Paint buruk akibat Long Task (> 50ms) dan Layout Thrashing melalui pemisahan fase baca/tulis DOM serta teknik yieldToMain().",
    "concepts": [
      [
        "Diagnosis DevTools Performance",
        "Rekam saat menekan tombol filter atau mengetik di kolom pencarian, lalu cari balok merah bertanda Long Task (> 50 ms) pada trek Main Thread."
      ],
      [
        "Layout Thrashing (Forced Synchronous Reflow)",
        "Membaca properti layout (card.offsetHeight) lalu langsung menulis gaya (card.style.height) berulang kali di dalam loop memaksa browser menghitung ulang tata letak ratusan kali secara sinkron."
      ],
      [
        "Pemisahan Fase BACA dan Fase TULIS",
        "Baca semua nilai offsetHeight terlebih dahulu ke dalam array, baru kemudian lakukan modifikasi style pada fase terpisah."
      ],
      [
        "Cooperative Yielding (yieldToMain)",
        "Memberi jeda pada Main Thread menggunakan scheduler.yield() (atau fallback setTimeout(0)) agar browser dapat segera menggambar frame UI baru sebelum menjalankan tugas analitik berat."
      ]
    ],
    "compare": "Metrik lama FID hanya mengukur keterlambatan input pertama. INP mengukur seluruh siklus (Input Delay + Processing Time + Presentation Delay) di sepanjang sesi interaksi pengguna.",
    "code": {
      "language": "javascript",
      "content": "// KODE PERBAIKAN BEST PRACTICE (INP Responsif - 65ms)\nfunction yieldToMain() {\n  if ('scheduler' in window && 'yield' in window.scheduler) {\n    return window.scheduler.yield();\n  }\n  return new Promise((resolve) => setTimeout(resolve, 0));\n}\n\nfilterButton.addEventListener('click', async () => {\n  const cards = document.querySelectorAll('.product-card');\n\n  // 1. Pisahkan fase BACA dan fase TULIS untuk mencegah Layout Thrashing\n  const heights = Array.from(cards).map((card) => card.offsetHeight);\n  cards.forEach((card, index) => {\n    card.style.transform = 'translateY(0px)';\n    card.style.minHeight = heights[index] + 10 + 'px';\n  });\n\n  // 2. Yield ke Main Thread sebelum menjalankan tugas latar belakang\n  await yieldToMain();\n  processHeavyAnalytics(largeDataset);\n});"
    },
    "extraCodes": [
      {
        "title": "Kode Bermasalah (INP Buruk - 620ms akibat Layout Thrashing & Long Task)",
        "language": "javascript",
        "variant": "bad",
        "content": "// Memblokir Main Thread selama ratusan milidetik saat tombol filter diklik\nfilterButton.addEventListener('click', () => {\n  const cards = document.querySelectorAll('.product-card');\n\n  // Layout Thrashing: membaca offsetHeight lalu menulis style berulang kali dalam loop\n  cards.forEach((card) => {\n    const currentHeight = card.offsetHeight; // Memaksa browser menghitung ulang layout (Reflow)\n    card.style.height = currentHeight + 10 + 'px';\n  });\n\n  // Komputasi berat sinkron menahan browser menggambar frame berikutnya\n  processHeavyAnalytics(largeDataset);\n});"
      }
    ],
    "practices": [
      "Hindari membaca properti geometri (offsetHeight, getBoundingClientRect) setelah memodifikasi DOM di dalam loop yang sama.",
      "Pecah tugas JavaScript yang memakan waktu > 50 ms menggunakan scheduler.yield() agar frame UI tetap responsif 60fps.",
      "Gunakan transform/opacity untuk animasi alih-alih properti yang memicu layout reflow seperti height/top/left."
    ],
    "case": "Saat pengguna mengklik filter kategori di halaman berisi 200 kartu produk, layar terasa membeku 620 ms. Pemisahan fase read/write dan `yieldToMain()` menurunkan INP ke 65 ms secara instan.",
    "exercise": {
      "scenario": "Sebuah tombol \"Expand All\" di tabel laporan melakukan loop baca `scrollHeight` dan ubah `style.maxHeight` pada 150 baris lalu mengirim log berat.",
      "task": "Refaktor event handler tersebut menggunakan pemisahan read/write dan `yieldToMain()`."
    },
    "quiz": {
      "question": "Apa penyebab utama terjadinya \"Layout Thrashing\" di JavaScript?",
      "options": [
        "Memuat gambar menggunakan format AVIF.",
        "Membaca properti geometri DOM (seperti offsetHeight) dan menulis perubahan gaya (style) secara bergantian di dalam satu loop.",
        "Menambahkan atribut defer pada tag script."
      ],
      "answer": 1,
      "explanation": "Menulis style membuat layout kotor (dirty); membaca offsetHeight tepat setelahnya memaksa browser menghitung ulang layout secara sinkron di setiap iterasi loop."
    },
    "refs": [
      "https://web.dev/articles/optimize-inp"
    ]
  },
  {
    "id": "qam16",
    "mode": "qa",
    "order": 4,
    "track": "QA Fase 4A: Web Performance (Core Web Vitals)",
    "title": "Studi Kasus Perbaikan CLS: Dari 0.34 ke 0.00",
    "level": "Beginner",
    "summary": "Menghilangkan pergeseran tata letak tak terduga (Cumulative Layout Shift) dengan mereservasi ruang dimensi tetap, aspect-ratio CSS, contain: layout, dan skeleton.",
    "concepts": [
      [
        "Diagnosis DevTools Show Layout Shift Regions",
        "Buka Command Palette (Ctrl+Shift+P) -> ketik \"Show Layout Shift Regions\" -> muat ulang halaman dan amati kilatan kotak biru pada elemen yang terdorong ke bawah."
      ],
      [
        "Sumber Masalah CLS 1: Injeksi Banner Dinamis",
        "Menyisipkan banner promo dari API ke slot kosong di atas konten mendorong seluruh artikel/tombol ke bawah tepat saat pengguna hendak mengeklik."
      ],
      [
        "Sumber Masalah CLS 2: Gambar Tanpa Dimensi",
        "Browser tidak mengetahui tinggi gambar sebelum file selesai diunduh jika width/height atau aspect-ratio diabaikan."
      ],
      [
        "Perbaikan Best Practice",
        "Tetapkan min-height dan contain: layout pada slot dinamis (disertai skeleton placeholder), serta kunci rasio gambar memakai atribut width/height dan CSS aspect-ratio + object-fit: cover."
      ]
    ],
    "compare": "Skor CLS > 0.25 sangat merusak UX karena pengguna sering salah klik tombol iklan atau batal akibat konten melompat tiba-tiba.",
    "code": {
      "language": "html",
      "content": "<!-- KODE PERBAIKAN BEST PRACTICE (CLS Mendekati Nol - 0.00) -->\n<style>\n  /* 1. Reservasi ruang kosong sejak awal dengan min-height tetap */\n  #top-promo-slot {\n    min-height: 48px;\n    contain: layout;\n  }\n  /* 2. Kunci rasio aspek gambar sebelum file diunduh */\n  .product-img {\n    width: 100%;\n    aspect-ratio: 4 / 3;\n    object-fit: cover;\n  }\n</style>\n\n<div id=\"top-promo-slot\" aria-live=\"polite\">\n  <div class=\"skeleton-bar\">Memuat penawaran...</div>\n</div>\n<img class=\"product-img\" src=\"/images/sepatu.jpg\" width=\"800\" height=\"600\" alt=\"Sepatu Lari\" />"
    },
    "extraCodes": [
      {
        "title": "Kode Bermasalah (CLS Tinggi - 0.34) — Hindari Pola Ini",
        "language": "html",
        "variant": "bad",
        "content": "<style>\n  /* Pergeseran tata letak terjadi karena gambar dan banner tidak punya dimensi awal */\n  .promo-banner { background: #fef08a; }\n  .product-img { width: 100%; }\n</style>\n\n<div id=\"top-promo-slot\"></div>\n<img class=\"product-img\" src=\"/images/sepatu.jpg\" alt=\"Sepatu Lari\" />\n\n<script>\n  // Menyisipkan banner di atas konten setelah API selesai mendorong seluruh halaman ke bawah\n  fetch('/api/promo-banner').then(r => r.text()).then(html => {\n    document.getElementById('top-promo-slot').innerHTML = html;\n  });\n</script>"
      }
    ],
    "practices": [
      "Selalu berikan atribut eksplisit width dan height (atau CSS aspect-ratio) pada setiap <img>, <video>, dan iframe.",
      "Gunakan skeleton loader dengan dimensi tinggi tetap untuk slot yang diisi secara asinkron dari API.",
      "Aktifkan \"Show Layout Shift Regions\" di DevTools saat menguji halaman pada mode koneksi Slow 3G."
    ],
    "case": "Pengguna mengeluh sering salah menekan tombol \"Hapus\" alih-alih \"Simpan\" karena banner notifikasi muncul terlambat 800ms di bagian atas form. Penambahan `min-height: 48px` dan `contain: layout` menurunkan CLS dari 0.34 ke 0.00.",
    "exercise": {
      "scenario": "Halaman daftar berita menampilkan widget cuaca asinkron setinggi 120px di atas berita utama serta foto thumbnail berdimensi 16:9.",
      "task": "Tuliskan aturan CSS dan markup skeleton untuk menjamin skor CLS 0.00 saat dimuat pada koneksi lambat."
    },
    "quiz": {
      "question": "Kombinasi teknik manakah yang paling efektif mencegah Cumulative Layout Shift (CLS) pada gambar responsif?",
      "options": [
        "Menambahkan loading=\"lazy\" dan z-index tinggi.",
        "Menetapkan atribut width/height serta CSS aspect-ratio agar browser langsung mereservasi ruang sebelum gambar selesai diunduh.",
        "Menghapus tag alt pada gambar."
      ],
      "answer": 1,
      "explanation": "Mengetahui rasio aspek (lewat width/height dan aspect-ratio) memungkinkan browser mengalokasikan ruang kotak kosong secara akurat sejak render awal."
    },
    "refs": [
      "https://web.dev/articles/optimize-cls"
    ]
  },
  {
    "id": "qam17",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 4B: k6 Load Testing, CI/CD & Roadmap",
    "title": "Load, Stress & Spike Testing dengan k6 (Analisis P95/P99 TTFB)",
    "level": "Advanced",
    "summary": "Mengukur degradasi TTFB dan mendeteksi connection pool exhaustion di bawah ratusan Virtual Users menggunakan skrip k6, metrik Trend, dan Quality Gate thresholds.",
    "concepts": [
      [
        "Tiga Jenis Pengujian Beban",
        "Load Test (trafik normal hingga puncak harian), Stress Test (melampaui kapasitas normal untuk mencari breaking point), dan Spike Test (lonjakan ekstrem mendadak simulasi flash sale)."
      ],
      [
        "Custom Metric TTFB (http_req_waiting)",
        "Mencatat res.timings.waiting ke dalam Trend(\"api_ttfb_ms\") untuk memantau latensi murni pemrosesan server tanpa waktu transfer jaringan klien."
      ],
      [
        "Thresholds sebagai Quality Gate Otomatis",
        "Tes k6 otomatis GAGAL (exit code non-zero) jika tingkat error >= 1% (rate<0.01) atau P95 TTFB >= 400ms / P99 >= 800ms."
      ],
      [
        "Membaca Persentil P95 & P99 vs Rata-rata",
        "Jangan tertipu angka avg! Jika avg = 120ms tetapi p(99) melonjak ke 3.200ms, 1% pengguna mengalami kelumpuhan sistem akibat lock contention database atau Garbage Collection pause."
      ]
    ],
    "compare": "Playwright hanya menguji 1–4 browser paralel, sehingga tidak akan pernah mendeteksi kebocoran connection pool pada 200 user bersamaan. k6 mensimulasikan beban konkuren tinggi dengan konsumsi memori minimal.",
    "code": {
      "language": "javascript",
      "content": "// tests/load/checkout-load.js\nimport http from 'k6/http';\nimport { check, sleep } from 'k6';\nimport { Trend } from 'k6/metrics';\n\n// Metrik khusus untuk memantau TTFB (http_req_waiting)\nconst ttfbTrend = new Trend('api_ttfb_ms', true);\n\nexport const options = {\n  stages: [\n    { duration: '30s', target: 50 },   // Ramp-up ke 50 Virtual Users\n    { duration: '1m', target: 200 },   // Beban puncak 200 Virtual Users bersamaan\n    { duration: '30s', target: 0 }     // Ramp-down\n  ],\n  // Quality Gate: Tes otomatis GAGAL jika metrik melewati ambang batas SLA\n  thresholds: {\n    http_req_failed: ['rate<0.01'],               // Tingkat error wajib di bawah 1%\n    http_req_waiting: ['p(95)<400', 'p(99)<800'], // P95 TTFB < 400ms, P99 TTFB < 800ms\n    api_ttfb_ms: ['p(99)<800']\n  }\n};\n\nexport default function () {\n  const url = `${__ENV.BASE_URL || 'http://localhost:3000'}/api/v1/products/featured`;\n  const params = {\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': `Bearer ${__ENV.API_TOKEN}`\n    }\n  };\n\n  const res = http.get(url, params);\n\n  // Catat metrik TTFB (waktu tunggu byte pertama dari server)\n  ttfbTrend.add(res.timings.waiting);\n\n  check(res, {\n    'status adalah 200': (r) => r.status === 200,\n    'payload tidak kosong': (r) => r.body && r.body.length > 0\n  });\n\n  sleep(1); // Think time antar-aksi pengguna\n}"
    },
    "extraCodes": [
      {
        "title": "Cara Menjalankan Skrip k6 dari CLI",
        "language": "bash",
        "variant": "neutral",
        "content": "k6 run -e BASE_URL=https://staging.app.id -e API_TOKEN=secret_token tests/load/checkout-load.js"
      }
    ],
    "practices": [
      "Selalu sertakan sleep() sebagai think time agar simulasi mencerminkan pola perilaku manusia, kecuali saat menguji stress throughput maksimum.",
      "Evaluasi metrik p(95) dan p(99), bukan hanya nilai rata-rata (avg) yang menyembunyikan ekor latensi.",
      "Jalankan skrip k6 hanya ke lingkungan staging/dedicated load env — dilarang menembak produksi tanpa izin."
    ],
    "case": "Pada uji 200 VUs, rata-rata waktu respons terlihat aman di 120 ms, namun `p(99)` melonjak hingga 3.200 ms. Investigasi menemukan ukuran connection pool PostgreSQL hanya diset default 10 koneksi, menyebabkan 190 request menunggu antrean.",
    "exercise": {
      "scenario": "Anda ingin menguji ketahanan endpoint pencarian `GET /api/v1/search?q=sepatu` saat terjadi lonjakan mendadak (Spike Test) hingga 300 user.",
      "task": "Modifikasi `stages` dan `thresholds` pada skrip k6 di atas untuk mensimulasikan Spike Test dan gagal otomatis bila P95 melebihi 500ms."
    },
    "quiz": {
      "question": "Dalam laporan k6, hasil menunjukkan avg = 120ms tetapi p(99) = 3200ms. Apa arti kondisi ini?",
      "options": [
        "Sistem sudah 100% optimal karena rata-rata di bawah 200ms.",
        "Mayoritas request cepat, namun 1% request paling lambat mengalami hambatan parah seperti lock contention database atau habisnya connection pool.",
        "Skrip k6 mengalami error sintaks pada fungsi sleep()."
      ],
      "answer": 1,
      "explanation": "Nilai rata-rata sering menutupi kelumpuhan sebagian kecil pengguna; p(95) dan p(99) mengungkap antrean lock atau GC pause pada beban konkuren."
    },
    "refs": [
      "https://grafana.com/docs/k6/latest/"
    ]
  },
  {
    "id": "qam18",
    "mode": "qa",
    "order": 3,
    "track": "QA Fase 4B: k6 Load Testing, CI/CD & Roadmap",
    "title": "Integrasi CI/CD Lengkap: GitHub Actions Quality Gate",
    "level": "Advanced",
    "summary": "Mengotomatiskan gerbang mutu pada setiap Pull Request dengan menjalankan Newman API Regression terlebih dahulu lalu Playwright E2E Sharding paralel beserta unggahan Trace.",
    "concepts": [
      [
        "Pemicu Pull Request & Workflow Dispatch",
        "Berjalan otomatis setiap kali ada PR ke branch main atau develop, serta bisa dipicu manual lewat workflow_dispatch."
      ],
      [
        "Job 1: Newman API Regression (~1–2 Menit)",
        "Menguji seluruh kontrak API dengan Newman secara cepat sebagai lini pertahanan pertama sebelum menjalankan browser E2E yang lebih berat."
      ],
      [
        "Job 2: Playwright E2E Sharding (needs: api-tests)",
        "Menggunakan strategi matrix shardIndex [1, 2] agar suite E2E terbagi rata ke 2 runner paralel, hanya berjalan jika api-tests lolos."
      ],
      [
        "Artefak Forensik Otomatis",
        "Mengunggah reports/newman-results.xml pada if: always(), dan mengunggah playwright-report serta test-results (trace.zip) pada if: failure() dengan retensi 7 hari."
      ]
    ],
    "compare": "Menjalankan ratusan tes Playwright secara serial di satu mesin bisa memakan waktu 25 menit. Menggabungkan API gate cepat + E2E matrix sharding memangkas waktu umpan balik Pull Request menjadi di bawah 5 menit.",
    "code": {
      "language": "yaml",
      "content": "# .github/workflows/qa-quality-gate.yml\nname: QA Automated Quality Gate\n\non:\n  pull_request:\n    branches: [main, develop]\n  workflow_dispatch:\n\njobs:\n  # Job 1: Pengujian Kontrak & Logika API dengan Newman (Cepat: ~1-2 menit)\n  api-tests:\n    name: Newman API Regression\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout Repository\n        uses: actions/checkout@v4\n\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n\n      - name: Install Newman\n        run: npm install -g newman\n\n      - name: Run Postman Collection\n        run: |\n          newman run tests/api/ecommerce.postman_collection.json \\\n            -e tests/api/staging.postman_environment.json \\\n            --reporters cli,junit \\\n            --reporter-junit-export reports/newman-results.xml\n\n      - name: Upload API Test Report\n        if: always()\n        uses: actions/upload-artifact@v4\n        with:\n          name: newman-api-report\n          path: reports/newman-results.xml\n\n  # Job 2: Pengujian E2E & Core Web Vitals Paralel (2 Shards)\n  e2e-tests:\n    name: Playwright E2E (Shard ${{ matrix.shardIndex }}/${{ matrix.shardTotal }})\n    runs-on: ubuntu-latest\n    needs: api-tests # Jalankan UI test hanya jika kontrak API lolos\n    strategy:\n      fail-fast: false\n      matrix:\n        shardIndex: [1, 2]\n        shardTotal: [2]\n    steps:\n      - name: Checkout Repository\n        uses: actions/checkout@v4\n\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n\n      - name: Install Dependencies & Playwright Browsers\n        run: |\n          npm ci\n          npx playwright install --with-deps chromium\n\n      - name: Run Playwright Tests (Sharded)\n        env:\n          BASE_URL: ${{ secrets.STAGING_BASE_URL }}\n        run: |\n          npx playwright test --project=chromium --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}\n\n      - name: Upload Playwright Trace & Report on Failure\n        if: failure()\n        uses: actions/upload-artifact@v4\n        with:\n          name: playwright-trace-shard-${{ matrix.shardIndex }}\n          path: |\n            playwright-report/\n            test-results/\n          retention-days: 7"
    },
    "practices": [
      "Gunakan `needs: api-tests` agar kegagalan kontrak API langsung menghentikan pipeline tanpa membuang menit runner E2E.",
      "Set `fail-fast: false` pada matrix sharding sehingga jika Shard 1 gagal, Shard 2 tetap selesai memberi laporan lengkap.",
      "Simpan URL staging dan kredensial API pada GitHub Secrets, bukan langsung di dalam YAML."
    ],
    "case": "PR yang merusak endpoint `/api/v1/auth/login` langsung ditolak dalam 75 detik oleh Job `api-tests`, sementara developer dapat mengunduh `trace.zip` dari artefak bila terjadi kegagalan di UI E2E untuk diinspeksi di Playwright Trace Viewer.",
    "exercise": {
      "scenario": "Tim ingin menambah langkah k6 smoke load test berdurasi 30 detik setelah E2E lolos sebelum merge.",
      "task": "Tambahkan Job ke-3 bernama `load-smoke-test` yang memiliki `needs: e2e-tests` pada workflow YAML di atas."
    },
    "quiz": {
      "question": "Mengapa pada workflow CI/CD di atas Job `e2e-tests` dilengkapi opsi `needs: api-tests` dan `fail-fast: false`?",
      "options": [
        "Agar tes UI berjalan sebelum kode di-checkout.",
        "Agar E2E hanya berjalan jika kontrak API lolos, dan semua shard tetap melaporkan kegagalannya masing-masing tanpa saling membatalkan.",
        "Agar laporan JUnit dihapus otomatis saat tes gagal."
      ],
      "answer": 1,
      "explanation": "Menunggu api-tests lolos menghemat biaya runner jika API rusak, dan fail-fast: false memastikan kedua shard selesai memberi visibilitas bug penuh."
    },
    "refs": [
      "https://playwright.dev/docs/ci-intro"
    ]
  },
  {
    "id": "qam19",
    "mode": "qa",
    "order": 4,
    "track": "QA Fase 4B: k6 Load Testing, CI/CD & Roadmap",
    "title": "Peta Jalan Terpadu: Nol hingga Senior QA Engineer (4 Fase · 10 Minggu)",
    "level": "Beginner",
    "summary": "Rencana aksi terukur selama 8 minggu dari penguasaan desain uji formal & Jira forensics hingga arsitektur otomasi Playwright, audit Web Vitals, k6, dan CI/CD.",
    "concepts": [
      [
        "Minggu 1–2: Fondasi Desain Uji, Jira & Bug Forensics",
        "Pilih 1 aplikasi web transaksi lengkap. Buat Test Plan (BVA & State Transition), tulis 15 Test Case Gherkin atomik di Jira, dan dokumentasikan minimal 8 bug nyata lengkap dengan .har, cURL, serta bukti query SQL."
      ],
      [
        "Minggu 3–4: Postman Automation & k6 Load Profiling",
        "Bangun koleksi Postman dengan Pre-request Script auto-login & Idempotency-Key, validasi skema JSON, jalankan via Newman, lalu tulis skrip k6 untuk menganalisis p(95) dan p(99) TTFB saat Virtual Users dinaikkan."
      ],
      [
        "Minggu 5–6: Web Performance Engineering (TTFB, LCP, INP, CLS)",
        "Audit performa 3 halaman utama memakai Chrome DevTools (Slow 4G & CPU 4x Slowdown). Reproduksi masalah LCP, INP, dan CLS, terapkan perbaikan kode frontend, dan catat perbandingan metrik sebelum vs sesudah."
      ],
      [
        "Minggu 7–8: Playwright Architecture & CI/CD Pipeline",
        "Bangun framework Playwright TypeScript berbasis Page Object Model dengan API Seeding, Fault Injection (page.route), dan assertion Core Web Vitals, lalu integrasikan ke GitHub Actions & bedah trace.zip lewat Trace Viewer."
      ]
    ],
    "tables": [
      {
        "title": "Ringkasan Peta Belajar & Matriks Tools (Fase 1 – Fase 4)",
        "headers": [
          "Fase",
          "Fokus Utama",
          "Deliverables / Output",
          "Tools & Tech Stack"
        ],
        "rows": [
          [
            "Fase 1: Fundamental & Mindset QA (Minggu 1–2)",
            "SDLC, STLC, Testing Pyramid, EP/BVA/Decision Table",
            "Test Plan, Test Case, Bug Report",
            "Jira, Google Sheets / TestRail"
          ],
          [
            "Fase 2: Web & API Testing (Minggu 3–4)",
            "DevTools Inspection, Validasi Endpoint & Payload, SQL",
            "Koleksi API Test, Log Defect API, Query SQL",
            "Postman, Chrome DevTools, SQL"
          ],
          [
            "Fase 3: E2E Test Automation (Minggu 5–8)",
            "Scripting Test, Locator Strategy, Page Object Model",
            "Framework Regression Test Otomatis",
            "Playwright (TypeScript/JS), Node.js, Git"
          ],
          [
            "Fase 4: Performance, DB & CI/CD (Minggu 9–10)",
            "Core Web Vitals, k6 Load Test, Continuous Testing",
            "Pipeline CI/CD, HTML Report, Trace Viewer",
            "GitHub Actions, k6, PostgreSQL/DBeaver"
          ]
        ]
      },
      {
        "title": "Checklist Deliverables 8-Week Senior QA Mastery",
        "headers": [
          "Fase Waktu",
          "Fokus Kompetensi",
          "Target Deliverable Konkret"
        ],
        "rows": [
          [
            "Minggu 1–2",
            "Test Design & SQL/Bug Forensics",
            "1 Test Plan (BVA+State), 15 Gherkin Jira, 8 Bug Report (.har/cURL/SQL)"
          ],
          [
            "Minggu 3–4",
            "Postman/Newman & k6 Load Testing",
            "Collection Auto-JWT + Newman JUnit + Skrip k6 P95/P99 TTFB"
          ],
          [
            "Minggu 5–6",
            "Core Web Vitals Engineering",
            "Laporan Audit DevTools + Perbaikan Nyata Kode LCP, INP, CLS"
          ],
          [
            "Minggu 7–8",
            "Playwright POM & GitHub Actions",
            "Framework TS POM + page.route 503 + YAML Sharding + Trace Viewer"
          ]
        ]
      }
    ],
    "compare": "Belajar tanpa target output nyata sering terhenti di hafalan teori. Roadmap 8 minggu ini memastikan setiap fase menghasilkan artefak portofolio yang dapat ditunjukkan langsung kepada hiring manager.",
    "code": {
      "language": "bash",
      "content": "# Membuka trace forensik kegagalan Playwright dari CI/CD menggunakan Trace Viewer:\nnpx playwright show-trace test-results/checkout-test-retry1/trace.zip"
    },
    "practices": [
      "Dokumentasikan setiap temuan sebelum-sesudah (mis. LCP 4.6s -> 1.4s) ke dalam portofolio GitHub Anda.",
      "Biasakan membaca Network waterfall dan trace.zip untuk membuktikan akar masalah kepada developer secara objektif.",
      "Ulangi seluruh siklus pada aplikasi nyata seperti e-commerce, sistem reservasi, atau dompet digital."
    ],
    "case": "Kandidat QA yang membawa portofolio berisi koleksi Postman auto-auth, framework Playwright dengan network fault injection, skrip k6 P99, dan studi kasus perbaikan INP memiliki daya tawar jauh lebih tinggi dibanding kandidat yang hanya menguasai klik manual.",
    "exercise": {
      "scenario": "Anda memulai Minggu 1 hari ini.",
      "task": "Pilih satu proyek web terbuka atau aplikasi lokal Anda, buat repositori portofolio QA baru, dan susun jadwal eksekusi target 4 fase di atas."
    },
    "quiz": {
      "question": "Apa output konkret yang wajib diselesaikan pada fase Minggu 5–6 dalam peta jalan 8 minggu?",
      "options": [
        "Menulis 100 skenario XPath statis.",
        "Melakukan audit DevTools (Slow 4G & 4x CPU), mereproduksi dan memperbaiki kode masalah TTFB, LCP, INP, dan CLS beserta perbandingan metrik.",
        "Membuat akun Jira baru."
      ],
      "answer": 1,
      "explanation": "Minggu 5–6 berfokus penuh pada Web Performance Engineering nyata: mengukur, membedah di DevTools, memperbaiki kode frontend, dan mendokumentasikan peningkatannya."
    },
    "refs": [
      "https://playwright.dev/docs/trace-viewer"
    ]
  },
  {
    "id": "qam20",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 1: Fundamental & Desain Uji",
    "title": "SDLC vs STLC, Testing Pyramid, 5 Tipe Testing & Template Test Case",
    "level": "Beginner",
    "summary": "Fondasi pertama QA Software Engineer: memahami SDLC vs STLC, Testing Pyramid, 5 jenis pengujian inti (Smoke, Sanity, Regression, Exploratory, UAT), papan Scrum/Kanban Jira, dan template Test Case standar.",
    "concepts": [
      [
        "SDLC vs STLC",
        "SDLC (Software Development Life Cycle) mencakup seluruh siklus pembuatan perangkat lunak (Planning, Design, Build, Test, Deploy). STLC (Software Testing Life Cycle) fokus khusus pada siklus mutu: Requirement Analysis -> Test Planning -> Test Case Design -> Environment Setup -> Execution -> Closure."
      ],
      [
        "Testing Pyramid (Unit, Integration, E2E)",
        "Unit Test menguji fungsi terisolasi oleh Developer; Integration Test menguji komunikasi antar-modul/service; E2E (End-to-End) Test menguji alur pengguna menyeluruh oleh QA."
      ],
      [
        "5 Tipe Testing Wajib",
        "Smoke Testing (cek stabilitas build awal), Sanity Testing (cek fokus bugfix/fitur kecil), Regression Testing (pastikan fitur lama tak rusak setelah update), Exploratory Testing (eksplorasi kreatif tanpa skrip kaku), UAT (User Acceptance Testing oleh bisnis/klien)."
      ],
      [
        "Dokumentasi Jira & Standar Test Case",
        "Mengelola papan Scrum/Kanban di Jira dan mendokumentasikan skenario menggunakan template standar berisi ID, Pre-Condition, Severity, Priority, Test Steps, dan Expected Result."
      ]
    ],
    "tables": [
      {
        "title": "Perbandingan 5 Tipe Pengujian Perangkat Lunak",
        "headers": [
          "Tipe Testing",
          "Kapan Dijalankan",
          "Tujuan Utama"
        ],
        "rows": [
          [
            "Smoke Testing",
            "Tepat setelah build baru ter-deploy",
            "Memastikan fitur kritis (login, home) menyala dan layak diuji lebih lanjut"
          ],
          [
            "Sanity Testing",
            "Setelah ada perbaikan bug kecil (patch)",
            "Memverifikasi fungsi spesifik yang diubah benar-benar berjalan"
          ],
          [
            "Regression Testing",
            "Sebelum rilis / setelah merge fitur baru",
            "Menjamin perubahan kode baru tidak merusak fitur lama yang sudah berjalan"
          ],
          [
            "Exploratory Testing",
            "Paralel / setelah skrip utama selesai",
            "Menemukan celah tak terduga dengan insting critical analysis"
          ],
          [
            "UAT (Acceptance)",
            "Menjelang peluncuran ke produksi",
            "Validasi akhir oleh pemilik produk/klien terhadap alur bisnis nyata"
          ]
        ]
      }
    ],
    "compare": "Smoke Testing bersifat luas dan dangkal (\"apakah aplikasi menyala?\"), sedangkan Sanity Testing bersifat sempit dan mendalam pada satu modul yang baru diperbaiki.",
    "code": {
      "language": "text",
      "extraTitle": "Template Dokumen Test Case Standar (TC-AUTH-001)",
      "content": "Test Case ID   : TC-AUTH-001\nTitle          : Login dengan Kredensial Valid\nPre-Condition  : User belum dalam kondisi login dan berada di halaman /login\nSeverity       : High\nPriority       : P1\n\nTest Steps:\n1. Masukkan email valid (\"user@example.com\") pada kolom Email.\n2. Masukkan kata sandi valid (\"P@ssword123\") pada kolom Password.\n3. Klik tombol \"Login\".\n\nExpected Result:\n- User berhasil diarahkan ke halaman Dashboard (/dashboard).\n- Pop-up pemberitahuan \"Selamat Datang\" ditampilkan.\n- Token JWT tersimpan di LocalStorage."
    },
    "practices": [
      "Selalu jalankan Smoke Test terlebih dahulu sebelum menghabiskan waktu menjalankan suite regresi penuh.",
      "Tuliskan Pre-Condition secara jelas di setiap Test Case agar siapa pun di tim dapat menjalankannya secara konsisten.",
      "Kelompokkan papan Kanban/Scrum Jira ke dalam kolom terukur: To Do -> In Progress -> Ready for QA -> In QA -> Done."
    ],
    "case": "Setelah developer menambal bug tombol checkout, QA langsung menjalankan Sanity Test pada fitur promo yang terkait, lalu memicu Regression Test otomatis agar alur pembayaran dan pengiriman dipastikan tetap aman.",
    "exercise": {
      "scenario": "Aplikasi memiliki fitur \"Lupa Kata Sandi\" yang mengirim tautan reset ke email pengguna.",
      "task": "Buat Test Case lengkap mengikuti format TC-AUTH-001 untuk skenario negatif ketika email belum terdaftar."
    },
    "quiz": {
      "question": "Apa perbedaan utama antara Smoke Testing dan Regression Testing?",
      "options": [
        "Smoke Testing dilakukan oleh klien saat UAT, sedangkan Regression dilakukan sebelum coding.",
        "Smoke Testing memeriksa kesehatan fitur kritis build baru secara cepat, sedangkan Regression Testing memastikan perubahan kode baru tidak merusak fitur yang sudah ada.",
        "Keduanya hanya bisa dilakukan memakai Playwright."
      ],
      "answer": 1,
      "explanation": "Smoke Testing adalah cek awal stabilitas build baru; Regression Testing menguji ulang fitur lama untuk mencegah efek samping regresi."
    },
    "refs": [
      "https://www.istqb.org/"
    ]
  },
  {
    "id": "qam21",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 2A: DevTools, Postman API & Jira",
    "title": "Web Inspection (Chrome DevTools) & HTTP Verbs / Status Codes",
    "level": "Beginner",
    "summary": "Menguasai investigasi bug di lapisan browser (Network, Console, Application LocalStorage/Cookies) dan membaca arti status HTTP serta skenario Happy vs Negative Path.",
    "concepts": [
      [
        "Tab Network (Inspeksi Lalu Lintas HTTP)",
        "Menganalisis HTTP Request Method (GET/POST/PUT/PATCH/DELETE), Status Code, Request Payload JSON, Header otorisasi, dan Response Body langsung dari browser."
      ],
      [
        "Tab Console & Application Storage",
        "Tab Console menangkap uncaught JavaScript runtime errors. Tab Application memverifikasi penyimpanan token autentikasi di LocalStorage, SessionStorage, dan HttpOnly Cookies."
      ],
      [
        "HTTP Status Codes Esensial",
        "200 OK, 201 Created, 400 Bad Request (validasi input), 401 Unauthorized (belum login/token invalid), 403 Forbidden (tak punya izin), 404 Not Found, 500 Internal Server Error (crash backend)."
      ],
      [
        "Happy Path vs Negative Path API",
        "Happy Path menguji data & token valid. Negative Path menguji field wajib kosong, tipe data salah, token kedaluwarsa, serta celah IDOR."
      ]
    ],
    "tables": [
      {
        "title": "Panduan Cepat Chrome DevTools & HTTP Status Codes untuk QA",
        "headers": [
          "Kode / Tab",
          "Makna & Indikasi",
          "Yang Wajib Dicek QA"
        ],
        "rows": [
          [
            "200 OK / 201 Created",
            "Request berhasil / resource baru terbuat",
            "Cocokkan JSON body dengan skema dan pastikan data masuk ke DB"
          ],
          [
            "400 Bad Request",
            "Input klien gagal validasi",
            "Pastikan pesan error spesifik (bukan HTTP 500) saat field wajib kosong"
          ],
          [
            "401 Unauthorized",
            "Token hilang / expired / tidak valid",
            "Pastikan user ditolak dan diarahkan ke login tanpa bocor data"
          ],
          [
            "403 Forbidden",
            "Terautentikasi tapi tidak berhak akses",
            "Kunci validasi untuk uji IDOR (User A mengakses milik User B)"
          ],
          [
            "500 Server Error",
            "Unhandled exception di backend",
            "Wajib dicatat sebagai bug! Lampirkan Response + Network HAR"
          ]
        ]
      }
    ],
    "compare": "Tanpa Chrome DevTools, QA hanya bisa berkata \"layarnya muter terus\". Dengan DevTools Network & Console, QA tahu persis apakah masalahnya ada di frontend TypeError atau backend HTTP 500.",
    "code": {
      "language": "bash",
      "extraTitle": "Contoh Uji Happy Path vs Negative Path via cURL",
      "content": "# 1. Happy Path: Request valid dengan Bearer token\ncurl -s -X POST https://reqres.in/api/users \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\":\"Andi\",\"job\":\"QA Engineer\"}'\n# Expected: HTTP 201 Created + JSON { id, createdAt }\n\n# 2. Negative Path: Menguji token tidak valid / kosong pada endpoint terproteksi\ncurl -i -X GET https://staging.app.id/api/v1/profile \\\n  -H \"Authorization: Bearer invalid_token_123\"\n# Expected: HTTP 401 Unauthorized"
    },
    "practices": [
      "Aktifkan \"Preserve log\" di Tab Network dan Console agar log error tidak hilang saat halaman melakukan redirect.",
      "Periksa Tab Application -> Cookies untuk memastikan cookie sesi penting memakai flag HttpOnly dan Secure.",
      "Jika mengirim data bertipe salah (mis. string di field angka) menghasilkan HTTP 500 alih-alih 400/422, laporkan sebagai bug validasi backend."
    ],
    "case": "Saat tombol \"Submit Profile\" terus berputar tanpa pesan error, QA membuka Tab Network dan Console DevTools: ternyata backend membalas `500 Internal Server Error` pada `POST /api/v1/user/avatar` dan Console mencetak `Uncaught TypeError: Cannot read property \"mime\" of undefined`.",
    "exercise": {
      "scenario": "Buka DevTools Network di situs latihan https://reqres.in/ atau aplikasi web Anda sendiri.",
      "task": "Tangkap 1 request POST, catat Request Method, Status Code, Request Payload, dan cek apakah token disimpan di LocalStorage atau Cookies."
    },
    "quiz": {
      "question": "Jika QA mengirim payload dengan field wajib kosong ke endpoint POST dan server membalas HTTP 500 Internal Server Error, apa kesimpulannya?",
      "options": [
        "Sudah benar karena memang ada error.",
        "Bug validasi backend: input tidak valid seharusnya ditangani dengan anggun menggunakan HTTP 400 Bad Request atau 422 Unprocessable Entity, bukan crash 500.",
        "Masalah berasal dari CSS browser."
      ],
      "answer": 1,
      "explanation": "Input salah dari klien harus ditolak secara terstruktur dengan HTTP 400/422 beserta pesan yang jelas; HTTP 500 menandakan unhandled exception di server."
    },
    "refs": [
      "https://developer.chrome.com/docs/devtools/network/"
    ]
  },
  {
    "id": "qam22",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 2A: DevTools, Postman API & Jira",
    "title": "Postman Post-Response Assertions & Praktik API (ReqRes / Restful-Booker)",
    "level": "Beginner",
    "summary": "Menulis skrip pengujian Post-response Postman pertama Anda (status 200, responseTime < 500ms, validasi struktur JSON) dan mempraktikkannya langsung pada mock API publik ReqRes.in & Restful-Booker.",
    "concepts": [
      [
        "Global vs Environment vs Collection Variables",
        "Global berlaku di seluruh workspace; Environment menyimpan base_url/credentials per server (Staging/Prod); Collection menyimpan token/ID sementara selama koleksi berjalan."
      ],
      [
        "Post-response Script (Tests Tab)",
        "Menulis blok pm.test(...) berantai untuk mengecek HTTP status code, latensi < 500ms, dan tipe data tiap properti JSON respons."
      ],
      [
        "Target Latihan 1: ReqRes.in",
        "REST API mock server gratis untuk melatih operasi GET list users, POST create user, PUT/PATCH update, DELETE, serta skenario login & register gagal (400)."
      ],
      [
        "Target Latihan 2: Restful-Booker",
        "API reservasi hotel lengkap dengan endpoint Auth (membuat token cookie), CRUD Booking (GET/POST/PUT/DELETE), dan validasi otorisasi 403."
      ]
    ],
    "compare": "Menguji API di Postman secara manual dengan melihat layar respons hanya menguji 1 kali; menambahkan `pm.test` mengubah request biasa menjadi skrip regresi yang dapat dijalankan otomatis ratusan kali.",
    "code": {
      "language": "javascript",
      "extraTitle": "Postman Post-Response Script (Assertion Lengkap)",
      "content": "// Validasi HTTP Status Code 200\npm.test(\"Status code is 200 OK\", function () {\n    pm.response.to.have.status(200);\n});\n\n// Validasi Response Time di bawah 500ms\npm.test(\"Response time is less than 500ms\", function () {\n    pm.expect(pm.response.responseTime).to.be.below(500);\n});\n\n// Validasi Struktur Data JSON\npm.test(\"Validate User Profile Data Structure\", function () {\n    const jsonData = pm.response.json();\n    pm.expect(jsonData).to.have.property(\"status\", \"success\");\n    pm.expect(jsonData.data).to.have.property(\"id\");\n    pm.expect(jsonData.data.email).to.be.a(\"string\");\n});"
    },
    "practices": [
      "Selalu simpan `base_url` (mis. `https://restful-booker.herokuapp.com`) di Environment Variable agar koleksi mudah berpindah server.",
      "Validasi tipe data properti (`to.be.a(\"string\")`, `to.be.a(\"number\")`), jangan hanya mengecek status 200.",
      "Gunakan Restful-Booker untuk melatih alur autentikasi berantai: `POST /auth` -> simpan `token` -> gunakan pada `PUT /booking/:id`."
    ],
    "case": "Pada latihan di Restful-Booker, QA menemukan bahwa `PUT /booking/1` mengembalikan `403 Forbidden` jika header Cookie `token=...` tidak disertakan, membuktikan mekanisme proteksi otorisasi endpoint bekerja.",
    "exercise": {
      "scenario": "Gunakan API publik https://reqres.in/api/users/2 di Postman.",
      "task": "Buat Environment dengan variabel `base_url`, panggil `GET {{base_url}}/api/users/2`, lalu tulis 3 `pm.test` untuk mengecek status 200, waktu < 500ms, dan memastikan `data.email` bertipe string."
    },
    "quiz": {
      "question": "Dalam skrip Postman `pm.expect(jsonData.data.email).to.be.a(\"string\")`, apa yang sedang diuji?",
      "options": [
        "Kecepatan jaringan internet komputer QA.",
        "Kontrak tipe data properti email di dalam respons JSON wajib berupa string.",
        "Apakah email tersebut sudah pernah dikirimkan lewat SMTP."
      ],
      "answer": 1,
      "explanation": "Assertion tipe data (.to.be.a(\"string\")) menjamin kontrak skema JSON tidak berubah secara tiba-tiba oleh perubahan kode backend."
    },
    "refs": [
      "https://reqres.in/",
      "https://restful-booker.herokuapp.com/"
    ]
  },
  {
    "id": "qam23",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 3: Playwright E2E Automation",
    "title": "Fondasi TypeScript (async/await) & Playwright LoginPage POM (SauceDemo)",
    "level": "Intermediate",
    "summary": "Jembatan dari pengujian manual ke kode E2E Playwright pertama Anda: memahami TypeScript async/await, Locator Strategy tahan-banting, dan Page Object Model pada LoginPage.ts.",
    "concepts": [
      [
        "Fondasi TypeScript & async/await",
        "Browser bekerja secara asinkron. Hampir setiap perintah Playwright mengembalikan Promise, sehingga wajib diawali `await` di dalam fungsi `async` agar langkah berjalan berurutan."
      ],
      [
        "User-Facing Locator Strategy",
        "Prioritaskan locator yang menyerupai cara manusia berinteraksi: page.getByRole(\"button\", { name: \"Sign In\" }), page.getByLabel(\"Email Address\"), dan page.getByTestId(\"...\")."
      ],
      [
        "Web-First Assertions & Auto-Waiting",
        "Playwright otomatis menunggu elemen siap diklik dan me-retry assertion seperti expect(page).toHaveURL(...) serta expect(locator).toBeVisible() tanpa perlu waitForTimeout."
      ],
      [
        "Praktik Langsung UI Target",
        "Terapkan pola LoginPage POM langsung pada situs latihan standar industri: SauceDemo (standard_user / secret_sauce) dan The Internet Herokuapp."
      ]
    ],
    "compare": "Banyak pemula lupa menulis `await` sebelum `loginPage.login()`, sehingga tes langsung selesai sebelum browser sempat mengetik email. Memahami `async/await` mencegah 80% error awal pemula Playwright.",
    "code": {
      "language": "typescript",
      "extraTitle": "pages/LoginPage.ts — Page Object Model Bersih",
      "content": "import { Page, Locator } from '@playwright/test';\n\nexport class LoginPage {\n    readonly page: Page;\n    readonly emailInput: Locator;\n    readonly passwordInput: Locator;\n    readonly loginButton: Locator;\n\n    constructor(page: Page) {\n        this.page = page;\n        this.emailInput = page.getByLabel('Email Address');\n        this.passwordInput = page.getByLabel('Password');\n        this.loginButton = page.getByRole('button', { name: 'Sign In' });\n    }\n\n    async navigate() {\n        await this.page.goto('/login');\n    }\n\n    async login(email: string, pass: string) {\n        await this.emailInput.fill(email);\n        await this.passwordInput.fill(pass);\n        await this.loginButton.click();\n    }\n}"
    },
    "extraCodes": [
      {
        "title": "tests/login.spec.ts — Eksekusi Tes dengan Web-First Assertions",
        "language": "typescript",
        "variant": "neutral",
        "content": "import { test, expect } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntest.describe('Authentication Suite', () => {\n    test('User should successfully login with valid credentials', async ({ page }) => {\n        const loginPage = new LoginPage(page);\n        \n        await loginPage.navigate();\n        await loginPage.login('standard_user', 'secret_sauce');\n\n        // Web-First Assertion\n        await expect(page).toHaveURL('/dashboard');\n        await expect(page.getByText('Welcome Back')).toBeVisible();\n    });\n});"
      }
    ],
    "practices": [
      "Selalu tambahkan `await` pada setiap pemanggilan method async Playwright (goto, fill, click, expect).",
      "Simpan semua locator di dalam constructor class Page Object agar jika label tombol berubah, cukup perbaiki 1 file saja.",
      "Latih skenario nyata pada SauceDemo (login + tambah barang ke keranjang + checkout) dan Herokuapp (upload file, alert modal, dynamic loading)."
    ],
    "case": "Pada situs latihan SauceDemo, menguji akun `problem_user` vs `standard_user` menggunakan skrip Playwright POM yang sama langsung mengungkap bug gambar produk yang tertukar dan tombol Add to Cart yang macet.",
    "exercise": {
      "scenario": "Target latihan: https://www.saucedemo.com/ (username: standard_user, pass: secret_sauce).",
      "task": "Inisialisasi proyek `npm init playwright@latest`, buat `SauceLoginPage.ts` memakai `getByPlaceholder`, dan verifikasi URL berpindah ke `/inventory.html`."
    },
    "quiz": {
      "question": "Mengapa pada Playwright TypeScript kita wajib memakai `await` di depan `expect(page).toHaveURL(...)`?",
      "options": [
        "Hanya untuk mempercantik gaya penulisan kode.",
        "Karena Web-First Assertion bersifat asinkron (mengembalikan Promise) yang terus melakukan auto-retry hingga kondisi terpenuhi atau timeout habis.",
        "Karena TypeScript melarang penggunaan fungsi tanpa return."
      ],
      "answer": 1,
      "explanation": "Tanpa `await`, JavaScript tidak menunggu pengecekan URL selesai dan tes bisa langsung dilaporkan lulus secara palsu."
    },
    "refs": [
      "https://www.saucedemo.com/",
      "https://the-internet.herokuapp.com/"
    ]
  },
  {
    "id": "qam24",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 4B: k6 Load Testing, CI/CD & Roadmap",
    "title": "Workflow GitHub Actions Playwright Dasar & Target Website Latihan",
    "level": "Intermediate",
    "summary": "Menghubungkan suite Playwright ke GitHub Actions agar berjalan otomatis setiap push/PR, menerbitkan HTML Report Artifact 30 hari, plus direktori lengkap target situs latihan UI & API.",
    "concepts": [
      [
        "Pemicu GitHub Actions (push & pull_request)",
        "Menjalankan regresi otomatis setiap kali ada kode baru di-push atau Pull Request dibuka ke branch main/master."
      ],
      [
        "Setup Node.js, npm ci & Browser Playwright",
        "Menggunakan actions/checkout@v4, actions/setup-node@v4 (Node 18/20), npm ci untuk instalasi deterministik, dan npx playwright install --with-deps."
      ],
      [
        "Publikasi HTML Report Artifact (if: always())",
        "Mengunggah folder playwright-report/ memakai actions/upload-artifact@v4 dengan retensi 30 hari baik saat tes lulus maupun gagal agar tim bisa meninjau laporan visualnya."
      ],
      [
        "Direktori Target Praktik Mandiri",
        "UI Practice: SauceDemo (E-commerce flow) & The Internet Herokuapp (Dynamic UI, upload, modal). API Practice: Restful-Booker (CRUD & Auth) & ReqRes.in (REST mock server)."
      ]
    ],
    "tables": [
      {
        "title": "Target Website Resmi untuk Latihan Mandiri QA",
        "headers": [
          "Kategori",
          "Platform & URL",
          "Fokus Skenario Latihan"
        ],
        "rows": [
          [
            "UI Practice",
            "SauceDemo (saucedemo.com)",
            "Login multi-user (standard/locked/problem), Add to Cart, Sorting, Checkout E2E"
          ],
          [
            "UI Practice",
            "The Internet Herokuapp (the-internet.herokuapp.com)",
            "Dynamic Loading, File Upload, Drag & Drop, JS Alerts, Broken Images"
          ],
          [
            "API Practice",
            "Restful-Booker (restful-booker.herokuapp.com)",
            "Auth token chaining, CRUD Booking, Status 403/418/201, Newman CLI"
          ],
          [
            "API Practice",
            "ReqRes.in (reqres.in)",
            "GET pagination, POST/PUT/DELETE, Negative test login missing password (400)"
          ]
        ]
      }
    ],
    "compare": "Workflow sederhana `playwright.yml` cocok sebagai langkah pertama membangun CI/CD di repositori portofolio sebelum nantinya ditingkatkan ke multi-job Newman + Playwright Matrix Sharding.",
    "code": {
      "language": "yaml",
      "extraTitle": ".github/workflows/playwright.yml — Continuous Testing Workflow",
      "content": "name: Playwright Regression Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\n\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - uses: actions/setup-node@v4\n      with:\n        node-version: 20\n    - name: Install dependencies\n      run: npm ci\n    - name: Install Playwright Browsers\n      run: npx playwright install --with-deps\n    - name: Run Playwright tests\n      run: npx playwright test\n    - uses: actions/upload-artifact@v4\n      if: always()\n      with:\n        name: playwright-report\n        path: playwright-report/\n        retention-days: 30"
    },
    "practices": [
      "Gunakan `npm ci` (bukan `npm install`) di CI/CD agar versi dependency terkunci identik sesuai package-lock.json.",
      "Pastikan langkah upload-artifact memakai kondisi `if: always()` sehingga saat tes gagal pun laporan HTML tetap dapat diunduh.",
      "Push seluruh proyek latihan SauceDemo & Restful-Booker Anda ke GitHub agar lencana hijau Actions tampil di profil portofolio."
    ],
    "case": "Ketika rekan tim mendorong perubahan CSS yang tak sengaja menyembunyikan tombol Checkout, workflow `playwright.yml` otomatis berjalan di Pull Request dalam 2 menit dan mengunggah `playwright-report` yang berisi tangkapan layar tepat di langkah yang gagal.",
    "exercise": {
      "scenario": "Anda baru saja membuat repositori GitHub berisi suite tes SauceDemo Playwright.",
      "task": "Buat file `.github/workflows/playwright.yml`, push ke branch `main`, lalu unduh dan buka `playwright-report` dari tab Actions GitHub."
    },
    "quiz": {
      "question": "Mengapa langkah `actions/upload-artifact@v4` di workflow Playwright diberi kondisi `if: always()`?",
      "options": [
        "Agar artifact hanya terupload bila semua tes berhasil 100%.",
        "Agar Playwright HTML Report tetap terunggah meskipun step pengujian sebelumnya gagal (failed), sehingga tim dapat menginvestigasi penyebab kegagalan.",
        "Untuk menginstal ulang Node.js."
      ],
      "answer": 1,
      "explanation": "Secara bawaan GitHub Actions menghentikan langkah berikutnya jika ada langkah yang gagal; `if: always()` memastikan laporan HTML selalu tersedia untuk diinvestigasi."
    },
    "refs": [
      "https://playwright.dev/docs/ci-intro",
      "https://www.saucedemo.com/"
    ]
  }
];
