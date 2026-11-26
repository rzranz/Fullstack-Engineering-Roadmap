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
    "title": "Core Web Vitals: Urutan Kausal, CrUX vs Lighthouse & Diagnosis TTFB",
    "level": "Intermediate",
    "summary": "Memahami kesalahan paling umum saat CWV poor (langsung mengoprek frontend tanpa melihat sebab-akibat), perbedaan CrUX Field Data 28 hari vs Lighthouse Lab Data, standar ambang batas (TTFB, LCP, INP, CLS), urutan prioritas eksekusi (TTFB → CLS → LCP → INP), serta akar masalah & perbaikan TTFB di sisi backend/infrastruktur.",
    "concepts": [
      [
        "Jebakan Umum: Urutan Sebab-Akibat (TTFB → LCP)",
        "Kesalahan paling umum saat menangani CWV poor adalah langsung mengoprek frontend (kompres gambar, hapus CSS) tanpa melihat urutan kausal. Jika TTFB hancur (> 1.8 s), LCP mustahil bagus karena browser bahkan belum menerima dokumen HTML-nya."
      ],
      [
        "CrUX (Field Data 28 Hari) vs Lighthouse (Lab Data)",
        "Berhenti terobsesi mengejar skor 100 di Lighthouse (Lab Data). Google menentukan peringkat dan status CWV dari CrUX (Field Data)—data asli dari device & koneksi user selama 28 hari terakhir (75th percentile). Fokus pada bottleneck nyata yang dirasakan user, bukan kosmetik skor."
      ],
      [
        "Akar Masalah TTFB (Time to First Byte)",
        "Jika TTFB merah, masalahnya hampir pasti di backend, database, atau infrastruktur hosting—bukan di CSS/JS. Penyebab umum: query database berat (seperti N+1 query), tidak ada server-side caching, cold start serverless, atau redirect berantai (HTTP → HTTPS → www)."
      ],
      [
        "Perbaikan Konkret & Verifikasi TTFB",
        "Aktifkan full-page caching / edge caching via CDN (mis. Cloudflare), optimasi query DB (indexing, eager loading, simpan hasil query berat di Redis/Memcached), pakai HTTP/2 atau HTTP/3, serta tempatkan server/CDN dekat mayoritas user. Verifikasi di Chrome DevTools → Network → dokumen HTML utama → Waiting for server response < 800 ms."
      ]
    ],
    "tables": [
      {
        "title": "Standar Ambang Batas Core Web Vitals (75th Percentile Field Data)",
        "headers": [
          "Metrik",
          "Good (Hijau)",
          "Needs Improvement",
          "Poor (Merah)",
          "Fokus Utama"
        ],
        "rows": [
          [
            "TTFB",
            "<= 800 ms",
            "800 ms – 1.8 s",
            "> 1.8 s",
            "Kecepatan respons server & jaringan"
          ],
          [
            "LCP",
            "<= 2.5 s",
            "2.5 s – 4.0 s",
            "> 4.0 s",
            "Waktu render elemen terbesar di viewport"
          ],
          [
            "INP",
            "<= 200 ms",
            "200 ms – 500 ms",
            "> 500 ms",
            "Responsivitas UI saat diklik/diketik"
          ],
          [
            "CLS",
            "<= 0.1",
            "0.1 – 0.25",
            "> 0.25",
            "Stabilitas visual (tidak ada elemen loncat)"
          ]
        ]
      },
      {
        "title": "Urutan Prioritas Eksekusi QA Performance Engineering",
        "headers": [
          "Prioritas",
          "Metrik Target",
          "Alasan Kausal & Dampak"
        ],
        "rows": [
          [
            "1. Pertama",
            "TTFB (Server & CDN)",
            "Tanpa respons server cepat, optimasi frontend hanya menambal gejala karena HTML awal belum diterima browser."
          ],
          [
            "2. Kedua",
            "CLS (Visual Stability)",
            "Low effort, high impact: paling cepat dibereskan karena cukup mengunci dimensi elemen, skeleton min-height & font-display."
          ],
          [
            "3. Ketiga",
            "LCP (Hero Render)",
            "Setelah TTFB & dimensi stabil, fokus pada preload aset utama, srcset WebP/AVIF, dan membuang render-blocking."
          ],
          [
            "4. Keempat",
            "INP (Main Thread JS)",
            "Paling kompleks karena menyentuh arsitektur JS, DOM <1.500 node & state management—kerjakan terakhir setelah pondasi loading beres."
          ]
        ]
      }
    ],
    "compare": "Skor Lighthouse 100 di laptop developer belum menjamin lulus Core Web Vitals jika CrUX Field Data 28 hari menunjukkan TTFB > 1.8s atau INP > 500ms di HP kelas menengah pengguna asli. Urutan diagnosis yang benar selalu: 1. TTFB -> 2. CLS -> 3. LCP -> 4. INP.",
    "code": {
      "language": "http",
      "extraTitle": "Header Edge Caching CDN + Nginx/Cloudflare untuk Menekan TTFB < 800 ms",
      "content": "HTTP/2 200 OK\nContent-Type: text/html; charset=utf-8\nCache-Control: public, s-maxage=3600, stale-while-revalidate=86400\nAlt-Svc: h3=\":443\"; ma=86400"
    },
    "practices": [
      "Selalu periksa tab Network → dokumen HTML utama → Waiting for server response (< 800 ms) sebelum menyentuh optimasi CSS/gambar.",
      "Hilangkan redirect berantai (http → https → www) agar tidak membuang round-trip TCP/TLS berulang sebelum HTML dikirim.",
      "Gunakan full-page caching / edge caching (Cloudflare), indexing + eager loading (bebas N+1 query), serta Redis/Memcached untuk query berat, dan evaluasi via CrUX 28-day Field Data bukan sekadar skor Lighthouse."
    ],
    "case": "Tim produk menghabiskan 2 minggu mengompres gambar untuk mengejar skor Lighthouse, namun LCP di CrUX tetap 4.2s. Audit DevTools Network membuktikan TTFB dokumen HTML mencapai 2.4s akibat N+1 query (45 SQL terpisah) + cold start serverless + 2x redirect. Setelah mengaktifkan edge caching `s-maxage`, Redis cache, dan memperbaiki redirect chain, TTFB turun ke 110 ms dan LCP otomatis anjlok ke 1.6s.",
    "exercise": {
      "scenario": "Sebuah situs e-commerce memiliki CrUX 28 hari: TTFB = 2.1s, CLS = 0.28, LCP = 4.3s, INP = 420ms, dan tim ingin langsung melakukan code-splitting React terlebih dahulu.",
      "task": "Susun ulang urutan prioritas perbaikan (1 s.d. 4) sebagai dosen/lead QA beserta alasan kausal dan cara verifikasi DevTools untuk TTFB."
    },
    "quiz": {
      "question": "Mengapa dalam rencana aksi Core Web Vitals kita wajib membereskan TTFB terlebih dahulu sebelum mengoptimasi LCP atau membedah INP?",
      "options": [
        "Karena TTFB hanya memengaruhi ukuran file CSS di browser.",
        "Karena jika TTFB lambat (server/DB/jaringan belum mengirim byte HTML awal), browser tidak bisa memulai pengunduhan maupun rendering elemen LCP, sehingga optimasi frontend hanya menambal gejala.",
        "Karena skor Lighthouse Lab Data selalu mengabaikan TTFB."
      ],
      "answer": 1,
      "explanation": "LCP bergantung secara kausal pada TTFB: browser baru bisa menemukan dan merender elemen hero setelah dokumen HTML diterima dari server."
    },
    "refs": [
      "https://web.dev/articles/vitals",
      "https://web.dev/articles/ttfb"
    ]
  },
  {
    "id": "qam14",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 4A: Web Performance (Core Web Vitals)",
    "title": "Studi Kasus Perbaikan LCP: Dari 4.6s ke 1.4s (Preload, srcset & Critical CSS)",
    "level": "Intermediate",
    "summary": "Mendiagnosis Largest Contentful Paint lewat Performance Insights di Chrome DevTools (Slow 4G & 4x CPU) untuk memastikan LCP discovery terjadi seawal mungkin tanpa menunggu JS selesai, serta menerapkan fetchpriority=\"high\", preload, WebP/AVIF + srcset, critical CSS inline, dan defer/async.",
    "concepts": [
      [
        "Verifikasi Performance Insights Chrome DevTools",
        "Jalankan Performance Insights (atau Performance panel dengan Slow 4G & CPU 4x slowdown) dan pastikan fase LCP discovery terjadi seawal mungkin di dokumen HTML—tanpa menunggu bundle JS selesai dieksekusi."
      ],
      [
        "Kesalahan Fatal: lazy-load pada Gambar Above-the-Fold",
        "Jangan pernah memasang loading=\"lazy\" pada elemen LCP di viewport awal! Tambahkan fetchpriority=\"high\" pada gambar hero dan gunakan <link rel=\"preload\" as=\"image\"> bila gambar dipicu dari CSS/background."
      ],
      [
        "Format Modern (WebP / AVIF) & Responsive Images (srcset)",
        "Konversi gambar hero ke WebP atau AVIF lalu sesuaikan dimensi resolusinya dengan layar user memakai atribut srcset dan sizes agar ponsel tidak mengunduh gambar 4K desktop."
      ],
      [
        "Hapus Render-Blocking CSS & JS",
        "Pakai atribut defer atau async pada script non-kritis (seperti analytics) dan inline CSS kritis (critical CSS) langsung di <head> agar browser segera menggambar hero."
      ]
    ],
    "compare": "Banyak developer menaruh `loading=\"lazy\"` di semua komponen `<img>` secara membabi buta dan mengirim satu file JPEG 2000px untuk semua ukuran layar. Untuk gambar LCP utama, `loading=\"lazy\"` + gambar oversizing + script tanpa `defer` menghancurkan LCP.",
    "code": {
      "language": "html",
      "extraTitle": "Kode Perbaikan Best Practice — Preload + AVIF/WebP srcset + Critical CSS + defer",
      "content": "<!-- KODE PERBAIKAN BEST PRACTICE (LCP Cepat - 1.4s) -->\n<head>\n  <!-- 1. Inline Critical CSS agar above-the-fold langsung tergambar -->\n  <style>.hero{min-height:420px;display:grid;place-items:center}</style>\n\n  <!-- 2. Preload gambar LCP agar langsung diunduh paralel bersama stylesheet -->\n  <link rel=\"preload\" as=\"image\" href=\"/images/banner-utama.avif\" fetchpriority=\"high\" />\n\n  <!-- 3. Non-blocking script dengan defer / async -->\n  <script src=\"/assets/analytics-heavy.js\" defer></script>\n</head>\n<body>\n  <section class=\"hero\">\n    <!-- 4. Tanpa loading=\"lazy\": gunakan AVIF/WebP + responsive srcset + fetchpriority=\"high\" -->\n    <img\n      src=\"/images/banner-utama.webp\"\n      srcset=\"/images/banner-640.avif 640w, /images/banner-1200.avif 1200w\"\n      sizes=\"(max-width: 768px) 100vw, 1200px\"\n      width=\"1200\"\n      height=\"600\"\n      fetchpriority=\"high\"\n      decoding=\"async\"\n      alt=\"Promo Utama\"\n    />\n  </section>\n</body>"
    },
    "extraCodes": [
      {
        "title": "Kode Bermasalah (LCP Lambat - 4.6s) — Hindari Pola Ini",
        "language": "html",
        "variant": "bad",
        "content": "<head>\n  <!-- Render-blocking script menahan browser menggambar DOM -->\n  <script src=\"/assets/analytics-heavy.js\"></script>\n  <link rel=\"stylesheet\" href=\"/assets/all-styles.css\" />\n</head>\n<body>\n  <!-- Kesalahan fatal: gambar hero diberi lazy-loading, format JPEG besar, tanpa srcset/priority -->\n  <section class=\"hero\">\n    <img src=\"/images/banner-utama.jpg\" loading=\"lazy\" alt=\"Promo Utama\" />\n  </section>\n</body>"
      }
    ],
    "practices": [
      "Jangan pernah memasang loading=\"lazy\" pada elemen LCP (above-the-fold); wajib gunakan fetchpriority=\"high\" dan <link rel=\"preload\"> jika perlu.",
      "Gunakan format gambar modern WebP/AVIF dan atribut responsive `srcset` + `sizes` sesuai resolusi viewport target.",
      "Eliminasi render-blocking dengan `defer`/`async` pada JS non-kritis dan inline Critical CSS, lalu verifikasi LCP discovery di Performance Insights DevTools."
    ],
    "case": "Halaman utama toko online mencatat LCP 4.6 detik pada koneksi 4G karena `analytics.js` memblokir rendering 1.8s dan banner JPEG 900KB memakai `loading=\"lazy\"` tanpa `srcset`. Setelah optimasi preload + AVIF `srcset` + inline critical CSS + `defer`, LCP turun ke 1.4 detik.",
    "exercise": {
      "scenario": "Audit Performance Insights DevTools menunjukkan gambar hero Anda baru mulai diunduh pada detik ke-3 setelah bundle JavaScript selesai dieksekusi, serta pengguna mobile mengunduh gambar selebar 1920px.",
      "task": "Tuliskan perbaikan HTML menggunakan `<link rel=\"preload\">`, `fetchpriority=\"high\"`, `srcset` WebP/AVIF, dan atribut `defer`."
    },
    "quiz": {
      "question": "Tindakan manakah yang justru MEMPERBURUK skor LCP pada gambar banner utama di bagian paling atas halaman?",
      "options": [
        "Menambahkan fetchpriority=\"high\", preload, dan responsive srcset AVIF/WebP.",
        "Memasang atribut loading=\"lazy\" pada gambar banner utama.",
        "Menambahkan atribut defer pada script analitik di tag <head>."
      ],
      "answer": 1,
      "explanation": "Atribut loading=\"lazy\" menunda pengunduhan gambar sampai browser selesai menghitung layout dan posisi scroll, sehingga memperlambat LCP discovery secara drastis."
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
    "title": "Studi Kasus Perbaikan INP: Dari 620ms ke 65ms (Long Tasks, Code Splitting & DOM <1500)",
    "level": "Advanced",
    "summary": "Mengatasi Interaction to Next Paint buruk pada SPA/JS berat akibat Long Tasks (> 50ms), ukuran DOM masif (> 1.500 node), third-party scripts, dan Layout Thrashing—dengan memecah tugas (scheduler.yield / setTimeout / rAF), code splitting, Web Worker, dan verifikasi bebas blok kuning panjang berbenderamerah di Performance DevTools.",
    "concepts": [
      [
        "Verifikasi Performance DevTools: Hindari Scripting Kuning + Long Task Merah",
        "Rekam interaksi klik/ketik di tab Performance DevTools; pastikan tidak ada blok kuning (scripting) panjang dengan bendera merah (Long Task > 50 ms) pada Main Thread saat interaksi berlangsung."
      ],
      [
        "Pecah Long Tasks & Layout Thrashing (yieldToMain)",
        "Pisahkan fase BACA (offsetHeight) dan TULIS (style) agar tidak memicu reflow berulang, lalu beri jeda pada Main Thread menggunakan scheduler.yield(), requestAnimationFrame, atau setTimeout(0) agar frame visual segera tergambar."
      ],
      [
        "Code Splitting, Lazy Load & Offload Third-Party ke Web Worker",
        "Lakukan code splitting & lazy load komponen/library berat yang belum dipakai saat initial load, serta kurangi third-party scripts (tracking, chat widget, analytics berlebihan) atau pindahkan eksekusinya ke Web Worker."
      ],
      [
        "Sederhanakan Struktur DOM (< 1.500 Node)",
        "Ukuran DOM yang masif memperlambat kalkulasi style, layout, dan paint setiap kali komponen re-render. Jaga jumlah DOM node idealnya di bawah 1.500 node dan cegah re-render komponen yang tidak perlu."
      ]
    ],
    "compare": "INP adalah metrik yang paling sering gagal pada aplikasi berbasis JS berat (SPA) dan paling kompleks memperbaikinya karena menyentuh arsitektur JS & state management—itulah sebabnya INP dikerjakan pada urutan ke-4 setelah TTFB, CLS, dan LCP beres.",
    "code": {
      "language": "javascript",
      "extraTitle": "Perbaikan INP Responsif (65ms) — Anti Layout Thrashing + Yield ke Main Thread + Lazy Split",
      "content": "// KODE PERBAIKAN BEST PRACTICE (INP Responsif - 65ms)\nfunction yieldToMain() {\n  if ('scheduler' in window && 'yield' in window.scheduler) {\n    return window.scheduler.yield();\n  }\n  return new Promise((resolve) => setTimeout(resolve, 0));\n}\n\nfilterButton.addEventListener('click', async () => {\n  const cards = document.querySelectorAll('.product-card');\n\n  // 1. Pisahkan fase BACA dan fase TULIS untuk mencegah Layout Thrashing\n  const heights = Array.from(cards).map((card) => card.offsetHeight);\n  cards.forEach((card, index) => {\n    card.style.transform = 'translateY(0px)';\n    card.style.minHeight = heights[index] + 10 + 'px';\n  });\n\n  // 2. Pecah Long Task: yield ke Main Thread agar frame UI tergambar dulu\n  await yieldToMain();\n\n  // 3. Code splitting: muat modul analitik/ekspor hanya saat benar-benar dibutuhkan\n  const { processHeavyAnalytics } = await import('./heavy-analytics.js');\n  processHeavyAnalytics(largeDataset);\n});"
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
      "Pecah Long Tasks (> 50 ms) memakai `scheduler.yield()`, `requestAnimationFrame`, atau `setTimeout`, serta pisahkan baca/tulis DOM.",
      "Terapkan code splitting (`import()`) dan lazy load komponen berat, serta pindahkan third-party tracking/analytics ke Web Worker.",
      "Jaga struktur DOM idealnya < 1.500 node, hindari re-render React/SPA tak perlu, dan verifikasi di tab Performance DevTools bebas Long Task merah."
    ],
    "case": "Saat pengguna mengklik filter kategori di halaman SPA dengan 2.800 DOM node dan analytics sinkron, layar membeku 620 ms (INP Poor). Setelah DOM dipangkas ke 980 node via virtualisasi list, analytics dipindah lewat dynamic `import()` + Web Worker, serta fase read/write dipisah dengan `yieldToMain()`, INP turun menjadi 65 ms.",
    "exercise": {
      "scenario": "Tab Performance DevTools menunjukkan blok kuning panjang berbendera merah (420 ms) setiap kali tombol filter ditekan pada SPA ber-3.200 DOM node yang langsung memanggil library export PDF dan tracking script.",
      "task": "Refaktor handler dengan pemisahan read/write, `yieldToMain()`, dynamic `import()`, dan sebutkan batas target jumlah DOM node."
    },
    "quiz": {
      "question": "Selain memecah Long Tasks (> 50 ms) dengan scheduler.yield(), dua langkah arsitektural manakah yang paling efektif menekan INP di aplikasi SPA?",
      "options": [
        "Menambah ukuran gambar hero dan menyalakan loading=\"lazy\" di banner utama.",
        "Melakukan code splitting, memindahkan third-party scripts ke Web Worker, serta menyederhanakan struktur DOM di bawah 1.500 node.",
        "Mengubah animasi transform menjadi animasi properti width dan top."
      ],
      "answer": 1,
      "explanation": "Code splitting mengurangi beban parse/eksekusi JS awal, Web Worker membebaskan Main Thread dari third-party script, dan DOM < 1.500 node mempercepat layout & paint."
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
    "title": "Studi Kasus Perbaikan CLS: Dari 0.34 ke 0.00 (Dimensi, font-display & transform)",
    "level": "Beginner",
    "summary": "Menghilangkan Cumulative Layout Shift secara tuntas (prioritas ke-2: low effort, high impact) dengan mengunci width/height atau aspect-ratio pada media, skeleton min-height untuk konten dinamis, @font-face font-display: swap + fallback font proporsional (anti FOUT/FOIT), serta animasi khusus transform dan opacity.",
    "concepts": [
      [
        "Dimensi Eksplisit pada Semua Media (<img>, <video>, <iframe>)",
        "Selalu definisikan atribut width dan height (atau CSS aspect-ratio) pada seluruh <img>, <video>, dan <iframe> agar browser langsung mengalokasikan ruang kotak kosong sebelum file selesai diunduh."
      ],
      [
        "Placeholder / Skeleton Tetap untuk Konten Dinamis",
        "Iklan, embed, atau data dari API yang disuntikkan ke atas konten wajib memiliki placeholder atau skeleton dengan tinggi tetap (min-height & contain: layout) supaya elemen di bawahnya tidak terdorong mendadak."
      ],
      [
        "Web Font Anti-FOUT/FOIT (@font-face font-display: swap)",
        "Web font yang dimuat lambat dapat mengubah ukuran metrik teks saat bertukar (FOUT/FOIT). Gunakan `font-display: swap;` pada `@font-face` dan pilih fallback font sistem yang proporsi lebar karakternya mirip."
      ],
      [
        "Animasi Khusus transform/opacity & Verifikasi Rendering DevTools",
        "Untuk animasi UI, hanya gunakan CSS `transform` dan `opacity`—jangan pernah menganimasikan `top`, `left`, `width`, atau `height`. Verifikasi dengan mengaktifkan Layout Shift Regions di menu Rendering DevTools dan pastikan tidak ada area berkedip biru."
      ]
    ],
    "compare": "CLS adalah metrik yang paling cepat memberikan hasil (low effort, high impact) pada urutan ke-2 perbaikan CWV. Cukup dengan mengunci dimensi media, skeleton `min-height`, `font-display: swap`, dan animasi `transform/opacity`, skor CLS > 0.25 langsung turun ke ~0.00.",
    "code": {
      "language": "html",
      "extraTitle": "Kode Perbaikan CLS 0.00 — Skeleton min-height, aspect-ratio, font-display: swap & transform",
      "content": "<!-- KODE PERBAIKAN BEST PRACTICE (CLS Mendekati Nol - 0.00) -->\n<style>\n  /* 1. Webfont stabil mencegah FOUT/FOIT lonjakan ukuran teks */\n  @font-face {\n    font-family: 'BrandSans';\n    src: url('/fonts/brand.woff2') format('woff2');\n    font-display: swap;\n  }\n  body { font-family: 'BrandSans', system-ui, -apple-system, sans-serif; }\n\n  /* 2. Reservasi ruang slot dinamis dengan min-height tetap */\n  #top-promo-slot { min-height: 48px; contain: layout; }\n\n  /* 3. Kunci rasio aspek gambar/video/iframe */\n  .product-img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }\n\n  /* 4. Animasi hanya gunakan transform & opacity (bukan top/left/width/height) */\n  .toast-enter { transform: translateY(0); opacity: 1; transition: transform .2s, opacity .2s; }\n</style>\n\n<div id=\"top-promo-slot\" aria-live=\"polite\">\n  <div class=\"skeleton-bar\">Memuat penawaran...</div>\n</div>\n<img class=\"product-img\" src=\"/images/sepatu.jpg\" width=\"800\" height=\"600\" alt=\"Sepatu Lari\" />"
    },
    "extraCodes": [
      {
        "title": "Kode Bermasalah (CLS Tinggi - 0.34) — Hindari Pola Ini",
        "language": "html",
        "variant": "bad",
        "content": "<style>\n  /* Pergeseran tata letak terjadi karena gambar, banner, dan animasi top memicu reflow */\n  .promo-banner { background: #fef08a; }\n  .product-img { width: 100%; }\n  .toast-bad { position: relative; top: 0; transition: top 0.3s, height 0.3s; }\n</style>\n\n<div id=\"top-promo-slot\"></div>\n<img class=\"product-img\" src=\"/images/sepatu.jpg\" alt=\"Sepatu Lari\" />\n\n<script>\n  fetch('/api/promo-banner').then(r => r.text()).then(html => {\n    document.getElementById('top-promo-slot').innerHTML = html;\n  });\n</script>"
      }
    ],
    "practices": [
      "Selalu pasang atribut `width` & `height` (atau CSS `aspect-ratio`) pada semua `<img>`, `<video>`, dan `<iframe>`, plus `min-height` skeleton untuk konten API/iklan.",
      "Gunakan `font-display: swap` dengan fallback font proporsional pada `@font-face`, dan hanya animasikan `transform` serta `opacity`.",
      "Verifikasi dengan mengaktifkan **Layout Shift Regions** pada tab *Rendering* Chrome DevTools dan pastikan tidak ada area yang berkedip biru saat halaman dimuat."
    ],
    "case": "Pengguna mengeluh sering salah menekan tombol \"Hapus\" alih-alih \"Simpan\" karena banner API muncul terlambat 800ms di atas form dan webfont berubah tinggi saat load. Penambahan `min-height: 48px`, `font-display: swap`, serta dimensi gambar `width/height` menurunkan CLS dari 0.34 ke 0.00 tanpa kedipan biru di Layout Shift Regions.",
    "exercise": {
      "scenario": "Halaman daftar berita menampilkan widget cuaca asinkron setinggi 120px, thumbnail 16:9, custom webfont `.woff2`, serta animasi toast yang sebelumnya menganimasikan properti `height` dan `top`.",
      "task": "Tuliskan aturan CSS (`min-height`, `aspect-ratio`, `font-display: swap`, serta transisi `transform` & `opacity`) agar skor CLS menjadi 0.00."
    },
    "quiz": {
      "question": "Properti CSS manakah yang AMAN digunakan untuk animasi UI tanpa menyebabkan pergeseran tata letak (CLS)?",
      "options": [
        "top dan left",
        "width dan height",
        "transform dan opacity"
      ],
      "answer": 2,
      "explanation": "Animasi `transform` dan `opacity` diproses di compositor thread tanpa memicu perhitungan ulang layout (reflow) terhadap elemen di sekitarnya."
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
  },
  {
    "id": "qam25",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 5A: Studi Kasus OpenMRS, GSheets & Java Automation",
    "title": "Exploratory Manual OpenMRS: BVA Klinis, Double Encoding, Viewport 375px & GSheets COUNTIF",
    "level": "Intermediate",
    "summary": "Pembelajaran nyata Pilar 1 (Manual & Exploratory QA) pada OpenMRS 3 SPA & Legacy UI dengan pasien uji Randi QA_Test GITS_Patient (10001X1): 65 Test Cases (46 Pass, 16 Fail, 3 Pending), 11 Bug, 15 screenshot bukti, root cause BVA klinis, double HTML encoding, layout overlap 375x812, serta rumus rekap COUNTIF Google Sheets & audit CSV Python.",
    "concepts": [
      [
        "Rekap Eksekusi Pilar 1: 65 TC & 11 Bug Nyata",
        "Menguji OpenMRS 3 SPA & Legacy UI menggunakan pasien uji `Randi QA_Test GITS_Patient` (`10001X1`) menghasilkan 65 Test Case (46 Pass, 16 Fail, 3 Pending) serta 11 Bug terdokumentasi lengkap dengan 15 screenshot bukti."
      ],
      [
        "BVA Klinis & Cross-Field Validation (Vitals)",
        "Kasus nyata: tekanan darah `50 / 120` bisa tersimpan, berat `-5 kg` lolos ke API, dan digit awal hilang saat mengetik cepat. Validasi klinis wajib mengecek antar-kolom (`Systolic > Diastolic`) serta menyinkronkan error HTTP 400 server langsung ke field UI spesifik."
      ],
      [
        "Double / Repeated HTML Encoding (XSS Integrity)",
        "Input `<b>Test</b>` & `<script>` tampil sebagai `&lt;b&gt;` lalu berubah menjadi `&amp;lt;` ketika diedit ulang. Backend melakukan escaping saat simpan, lalu React UI meng-encode ulang saat render/edit. Uji XSS wajib memverifikasi integritas data pada siklus utuh Create → Read → Update."
      ],
      [
        "Responsiveness & UI Overlap (1440x900 vs 375x812)",
        "Tombol floating `?` menutupi tombol aksi `Check In` / `Options` pada tabel, sedangkan di viewport mobile `375x812` sidebar Registration memotong form input. Wajib menguji horizontal overflow, `position: fixed`, dan CSS grid/flex breakpoint."
      ]
    ],
    "tables": [
      {
        "title": "Ringkasan 3 Pilar GITS QA & Root Cause Manual/UI",
        "headers": [
          "Area / Tahap",
          "Temuan / Angka Nyata",
          "Root Cause & Konsep QA yang Dipelajari"
        ],
        "rows": [
          [
            "Pilar 1 — Manual & Exploratory",
            "65 TC (46 Pass, 16 Fail, 3 Pending) • 11 Bug • 15 Screenshot",
            "Pasien uji `Randi QA_Test GITS_Patient` (`10001X1`) di OpenMRS 3 SPA & Legacy UI + rumus `COUNTA`/`COUNTIF` Google Sheets."
          ],
          [
            "1. Manual & BVA Klinis",
            "BP `50 / 120` tersimpan, berat `-5 kg` lolos API, digit awal hilang saat ketik cepat",
            "Boundary Value Analysis (BVA) & cross-field validation (`Systolic > Diastolic`) + pemetaan pesan HTTP `400` ke field UI."
          ],
          [
            "2. Input Security & Encoding",
            "Input `<b>Test</b>` & `<script>` → `&lt;b&gt;` → `&amp;lt;` saat edit ulang",
            "Double / Repeated HTML Encoding antara escaping backend & UI React. Selalu uji siklus Create → Read → Update."
          ],
          [
            "3. Responsiveness & UI Overlap",
            "Floating `?` tutupi `Check In`/`Options`; `375x812` sidebar memotong form",
            "Viewport testing desktop (`1440x900`) vs mobile (`375x812`): cek overflow horizontal, z-index `position: fixed`, dan breakpoint."
          ]
        ]
      }
    ],
    "compare": "Checklist test case statis hanya memeriksa fungsi normal, sedangkan exploratory testing berbasis BVA klinis + siklus Create→Read→Update + resize viewport `375x812` berhasil membongkar bug integritas data, double encoding, dan komponen tertutup overlay.",
    "code": {
      "language": "excel",
      "extraTitle": "Google Sheets Tab Summary — Rumus Otomatis Hitung Pass/Fail/Severity",
      "content": "=COUNTA(OpenMRS_Test_Cases!A2:A)\n=COUNTIF(OpenMRS_Test_Cases!J2:J,\"Pass\")\n=COUNTIF(OpenMRS_Test_Cases!J2:J,\"Fail\")\n=COUNTIF(OpenMRS_Test_Cases!J2:J,\"[PENDING_MANUAL_VERIFICATION]\")\n=IFERROR(COUNTIF(OpenMRS_Test_Cases!J2:J,\"Pass\")/(COUNTIF(OpenMRS_Test_Cases!J2:J,\"Pass\")+COUNTIF(OpenMRS_Test_Cases!J2:J,\"Fail\")),0)\n=COUNTA(OpenMRS_Bug_Reports!A2:A)\n=COUNTIF(OpenMRS_Bug_Reports!D2:D,\"High\")\n=COUNTIF(OpenMRS_Bug_Reports!D2:D,\"Medium\")\n=COUNTIF(OpenMRS_Bug_Reports!D2:D,\"Low\")"
    },
    "extraCodes": [
      {
        "title": "PowerShell + Python 3.12 — Audit Cepat File CSV Test Cases & Bug Reports",
        "language": "powershell",
        "variant": "neutral",
        "content": "& \"C:\\Users\\HPrannn\\AppData\\Local\\Programs\\Python\\Python312\\python.exe\" -c \"\nimport csv, collections\nbase = r'd:\\Portofolio\\QA Testing\\Test-GITS-QA-Randi Zakaria Putra\\1. Manual Testing'\nwith open(base + r'\\OpenMRS_Test_Cases.csv', encoding='utf-8') as f:\n    tcs = list(csv.DictReader(f))\nwith open(base + r'\\OpenMRS_Bug_Reports.csv', encoding='utf-8') as f:\n    bugs = list(csv.DictReader(f))\nprint('Test Cases:', len(tcs), dict(collections.Counter(r['Status'] for r in tcs)))\nprint('Bug Reports:', len(bugs), dict(collections.Counter(r['Severity'] for r in bugs)))\n\""
      }
    ],
    "practices": [
      "Selalu uji validasi antar-kolom (cross-field validation) seperti Systolic > Diastolic dan pastikan backend ikut menolak payload ilegal dengan HTTP 400 meski validasi UI dilewati.",
      "Saat menguji XSS (`<b>Test</b>`, `<script>`), jangan berhenti setelah Save—buka kembali halaman Edit lalu Save ulang untuk mendeteksi bug Double HTML Encoding (`&amp;lt;`).",
      "Uji viewport desktop (`1440x900`) dan mobile (`375x812`), lalu pakai rumus `IFERROR(Pass/(Pass+Fail), 0)` agar persentase Pass Rate di Google Sheets tidak `#DIV/0!` ketika semua test masih pending."
    ],
    "case": "Dalam assessment GITS QA di OpenMRS (`10001X1`), input tekanan darah `50/120` tetap bisa disimpan karena tidak ada pengecekan silang `Systolic > Diastolic`, sedangkan input `<b>Test</b>` mengalami double encoding saat form dibuka ulang untuk diedit.",
    "exercise": {
      "scenario": "Spreadsheet QA Anda memiliki sheet `OpenMRS_Test_Cases` (kolom J = Status: Pass / Fail / [PENDING_MANUAL_VERIFICATION]) dan `OpenMRS_Bug_Reports` (kolom D = Severity: High / Medium / Low).",
      "task": "Buat rumus Pass Rate di Google Sheets yang kebal pembagian nol (`IFERROR`) dan hitung jumlah Bug berseverity `High` secara otomatis."
    },
    "quiz": {
      "question": "Mengapa menguji XSS dengan payload `<b>Test</b>` di OpenMRS mewajibkan QA memeriksa ulang hasil setelah siklus Create -> Read -> Update?",
      "options": [
        "Untuk memverifikasi warna font tombol Edit berubah otomatis.",
        "Untuk mendeteksi bug Double/Repeated HTML Encoding (`&lt;b&gt;` berubah menjadi `&amp;lt;b&amp;gt;`) akibat backend dan React UI sama-sama melakukan escaping berulang.",
        "Karena HTML tag harus dieksekusi browser agar CSS terlihat rapi."
      ],
      "answer": 1,
      "explanation": "Double HTML Encoding merusak integritas teks asli user tiap kali data dibaca dan disimpan ulang, sehingga merusak keakuratan catatan medis."
    },
    "refs": [
      "https://o3.openmrs.org/openmrs/",
      "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
    ]
  },
  {
    "id": "qam26",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 5A: Studi Kasus OpenMRS, GSheets & Java Automation",
    "title": "Java RestAssured API Automation (`ReqResApiTest.java`) & Maven Dependency Hygiene",
    "level": "Intermediate",
    "summary": "Implementasi API Automation berbasis Java 17 + RestAssured + TestNG terhadap ReqRes.in (2/2 Passed: GET /api/users/2 HTTP 200 & POST /api/login missing password HTTP 400), lengkap dengan solusi Maven Dependency Hygiene untuk error Jackson serializer dan konflik Log4j2 pada Apache POI 5.3.0.",
    "concepts": [
      [
        "RestAssured Fluent BDD Syntax (given-when-then)",
        "Mengirim header `x-api-key`, `ContentType.JSON`, body `Collections.singletonMap`, lalu mengekstrak `Response` untuk assertion TestNG `Assert.assertEquals` dan logging `Reporter.log(..., true)`."
      ],
      [
        "Maven Dependency Hygiene: RestAssured + Jackson",
        "Kegagalan `IllegalStateException (no JSON serializer)` muncul ketika RestAssured menerima objek Java `Map` untuk diserialisasi ke JSON body tanpa library serializer di `pom.xml`. Solusinya: tambahkan `jackson-databind` agar konversi Map -> JSON berjalan otomatis."
      ],
      [
        "Maven Dependency Hygiene: Apache POI 5.3.0 + Log4j2",
        "Apache POI 5.3.0 kerap melempar `NoSuchMethodError` saat runtime bila versi transitif `log4j-api` dan `log4j-core` tidak cocok. Solusi produksi: selaraskan versi kedua artefak Log4j2 secara eksplisit di `pom.xml` pada versi `2.24.1`."
      ],
      [
        "Negative API Assertion Terukur",
        "Bukan hanya menguji happy path `GET /api/users/2` (`statusCode == 200`, `data.id == \"2\"`), tetapi juga memastikan negative login `POST /api/login` tanpa password mengembalikan HTTP `400` dan pesan JSON `error == \"Missing password\"`."
      ]
    ],
    "tables": [
      {
        "title": "Diagnosa Error Dependency Maven & Verifikasi Skenario ReqRes",
        "headers": [
          "Komponen / Skenario",
          "Gejala Error / Ekspektasi",
          "Solusi / Implementasi Lulus"
        ],
        "rows": [
          [
            "RestAssured Serializer",
            "`IllegalStateException (no JSON serializer)` saat POST Map body",
            "Tambahkan `com.fasterxml.jackson.core:jackson-databind` pada `pom.xml`."
          ],
          [
            "Apache POI 5.3.0 Runtime",
            "`NoSuchMethodError` di kelas Log4j2 saat membaca `testdata.xlsx`",
            "Samakan versi eksplisit `org.apache.logging.log4j:log4j-api` & `log4j-core` ke `2.24.1`."
          ],
          [
            "Scenario 1 — `GET /api/users/2`",
            "Header `x-api-key`, Accept JSON",
            "HTTP `200 OK` & `response.jsonPath().getString(\"data.id\")` equals `\"2\"`."
          ],
          [
            "Scenario 2 — `POST /api/login`",
            "Body `{ \"email\": \"peter@klaven\" }` tanpa password",
            "HTTP `400 Bad Request` & `response.jsonPath().getString(\"error\")` equals `\"Missing password\"`."
          ]
        ]
      }
    ],
    "compare": "Postman sangat cepat untuk eksplorasi ad-hoc dan koleksi tim, sedangkan Java RestAssured + TestNG menyatu dalam satu build Maven (`mvn test -Dtest=ReqResApiTest`) bersama Selenium POM & Apache POI untuk pelaporan TestNG `emailable-report.html` terpadu.",
    "code": {
      "language": "java",
      "extraTitle": "src/test/java/com/gits/qa/api/ReqResApiTest.java — 100% Passing Implementation",
      "content": "package com.gits.qa.api;\n\nimport io.restassured.RestAssured;\nimport io.restassured.http.ContentType;\nimport io.restassured.response.Response;\nimport org.testng.Assert;\nimport org.testng.Reporter;\nimport org.testng.annotations.BeforeClass;\nimport org.testng.annotations.Test;\n\nimport java.util.Collections;\n\nimport static io.restassured.RestAssured.given;\n\n/**\n * RestAssured API automation tests against ReqRes (https://reqres.in/).\n */\npublic class ReqResApiTest {\n\n    private static final String BASE_URI = \"https://reqres.in\";\n    private static final String API_KEY = System.getProperty(\"reqres.api.key\", \"free_user_3MMnHzsnIN28CqZwivUmSkD0fi9\");\n\n    @BeforeClass\n    public void setup() {\n        RestAssured.baseURI = BASE_URI;\n    }\n\n    @Test(priority = 1, description = \"Scenario 1: GET /api/users/2 returns HTTP 200 and data.id equals '2'\")\n    public void testGetSingleUserById() {\n        Response response = given()\n                .header(\"x-api-key\", API_KEY)\n                .accept(ContentType.JSON)\n                .when()\n                .get(\"/api/users/2\")\n                .then()\n                .log().all()\n                .extract().response();\n\n        Reporter.log(\"GET /api/users/2 Status: \" + response.statusCode(), true);\n        Reporter.log(\"GET /api/users/2 Body: \" + response.asString(), true);\n\n        Assert.assertEquals(response.statusCode(), 200, \"Expected HTTP 200 OK\");\n        Assert.assertEquals(response.jsonPath().getString(\"data.id\"), \"2\",\n                \"Expected data.id to equal '2'\");\n    }\n\n    @Test(priority = 2, description = \"Scenario 2: POST /api/login without password returns HTTP 400 and error 'Missing password'\")\n    public void testUnsuccessfulLoginMissingPassword() {\n        Response response = given()\n                .header(\"x-api-key\", API_KEY)\n                .contentType(ContentType.JSON)\n                .accept(ContentType.JSON)\n                .body(Collections.singletonMap(\"email\", \"peter@klaven\"))\n                .when()\n                .post(\"/api/login\")\n                .then()\n                .log().all()\n                .extract().response();\n\n        Reporter.log(\"POST /api/login Status: \" + response.statusCode(), true);\n        Reporter.log(\"POST /api/login Body: \" + response.asString(), true);\n\n        Assert.assertEquals(response.statusCode(), 400, \"Expected HTTP 400 Bad Request\");\n        Assert.assertEquals(response.jsonPath().getString(\"error\"), \"Missing password\",\n                \"Expected error message to equal 'Missing password'\");\n    }\n}"
    },
    "extraCodes": [
      {
        "title": "PowerShell — Jalankan Hanya ReqResApiTest (2/2 API Test) di Terminal Mana Pun",
        "language": "powershell",
        "variant": "neutral",
        "content": "$env:JAVA_HOME = \"C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.21.9-hotspot\"\n$env:Path = \"C:\\Users\\HPrannn\\tools\\apache-maven-3.9.16\\bin;$env:JAVA_HOME\\bin;$env:Path\"\nSet-Location \"d:\\Portofolio\\QA Testing\\Test-GITS-QA-Randi Zakaria Putra\\2. Automation Testing\\GITS-QA-Automation\"\n& \"C:\\Users\\HPrannn\\tools\\apache-maven-3.9.16\\bin\\mvn.cmd\" test -Dtest=ReqResApiTest"
      }
    ],
    "practices": [
      "Eksternalisasi API key lewat `System.getProperty(\"reqres.api.key\", ...)` agar mudah diganti di CI/CD tanpa mengubah kode Java.",
      "Selalu selaraskan versi `log4j-api` dan `log4j-core` (`2.24.1`) saat memakai Apache POI 5.3.0, dan pastikan `jackson-databind` hadir sebelum mengirim `Map` body di RestAssured.",
      "Gunakan `Reporter.log(..., true)` di TestNG supaya status code dan JSON response tercatat sekaligus di console Maven maupun `emailable-report.html`."
    ],
    "case": "Saat pertama kali mengeksekusi POST Map body di RestAssured, suite melempar `IllegalStateException (no JSON serializer)` sementara suite Excel melempar `NoSuchMethodError`. Menambahkan `jackson-databind` serta menyamakan `log4j-api` & `log4j-core` ke `2.24.1` membuat API suite lulus 2/2 seketika.",
    "exercise": {
      "scenario": "Endpoint `https://reqres.in/api/login` wajib menolak request yang tidak membawa field `password` dengan status `400` dan pesan `Missing password`.",
      "task": "Tulis method `@Test` RestAssured dengan header `x-api-key`, kirim `Collections.singletonMap(\"email\", \"peter@klaven\")`, lalu verifikasi status code dan key `error`."
    },
    "quiz": {
      "question": "Apa penyebab utama error `IllegalStateException (no JSON serializer)` ketika RestAssured mengirim objek Java `Map` di method `.body(...)`?",
      "options": [
        "Method GET salah ketik menjadi POST.",
        "Tidak adanya library JSON serializer seperti `jackson-databind` di classpath Maven `pom.xml`.",
        "Server ReqRes sedang offline."
      ],
      "answer": 1,
      "explanation": "RestAssured membutuhkan library pihak ketiga seperti Jackson (`jackson-databind`) atau Gson untuk mengubah objek Java (`Map`/POJO) menjadi payload JSON."
    },
    "refs": [
      "https://rest-assured.io/",
      "https://reqres.in/"
    ]
  },
  {
    "id": "qam27",
    "mode": "qa",
    "order": 3,
    "track": "QA Fase 5A: Studi Kasus OpenMRS, GSheets & Java Automation",
    "title": "Selenium 4 POM & POI DDT (`OpenMrsLoginPage` & `Test`): Dual UI, CSRFGuard & CDP Port 9223",
    "level": "Advanced",
    "summary": "Bedah lengkap suite UI Automation Java Selenium 4 + Apache POI Excel DDT + TestNG yang meraih 5/5 Passed (3/3 UI + 2/2 API dalam 18.025 s) pada OpenMRS: arsitektur Dual UI, race condition asinkron OWASP-CSRFTOKEN, penanganan Cloudflare & konflik port 9222 IPv4/IPv6 via port 9223 + CDP window state recovery.",
    "concepts": [
      [
        "Inspect Live DOM: Dual UI Architecture OpenMRS",
        "`https://o3.openmrs.org/openmrs/` menampilkan Legacy UI 2.8.10 (form 1-langkah, `#sessionLocation`, error `#openmrs_error`: `\"Invalid username/password. Please try again.\"`), sedangkan `https://o3.openmrs.org/` adalah O3 React SPA (form 2-langkah, LocationPicker, Carbon notification)."
      ],
      [
        "Asynchronous OWASP CSRFGuard Race Condition",
        "Mengklik `Log In` langsung kembali ke halaman awal tanpa error? Script `/openmrs/csrfguard` menyuntikkan `<input name=\"OWASP-CSRFTOKEN\">` secara asinkron setelah HTML selesai di-parse. Wajib menunggu `wait.until(ExpectedConditions.presenceOfElementLocated(By.name(\"OWASP-CSRFTOKEN\")))` di `open()`."
      ],
      [
        "Ethical Anti-Bot, Konflik Port 9222 & Port Bebas 9223",
        "Browser headless/baru memicu Cloudflare `Just a moment...`, sementara port `9222` sering bentrok IPv4 vs IPv6 `[::1]`. Gunakan profil Chrome terverifikasi user di port `9223` (`127.0.0.1:9223`), jangan bypass CAPTCHA, dan jaga cookie `cf_clearance` dengan `logoutIfLoggedIn()` bukan `driver.quit()`."
      ],
      [
        "Pemulihan Minimized Chrome via CDP & Apache POI DDT",
        "Jendela Chrome yang ter-minimize gagal menerima `sendKeys`. Pulihkan ke `normal (1440x900)` memakai CDP `Page.bringToFront`, `Browser.getWindowForTarget`, dan `Browser.setWindowBounds`, lalu jalankan Scenario 1 (invalid), Scenario 2 (hardcoded + PNG), dan Scenario 3 (`ExcelUtils.readSheetData(\"testdata.xlsx\", \"LoginData\")` + PNG)."
      ]
    ],
    "tables": [
      {
        "title": "Perbandingan Arsitektur Dual UI OpenMRS & Solusi Flakiness Selenium 4",
        "headers": [
          "Aspek / Kendala",
          "Detail Teknis / Masalah Nyata",
          "Solusi Terverifikasi (18.025 s — 5/5 Pass)"
        ],
        "rows": [
          [
            "URL `/openmrs/` (Legacy 2.8.10)",
            "1-step login (`#username`, `#password`, `#sessionLocation`, `#openmrs_error`)",
            "Gunakan `OpenMrsLoginPage.BASE_URL = \"https://o3.openmrs.org/openmrs/\"`."
          ],
          [
            "URL `/` (O3 React SPA)",
            "2-step login + LocationPicker + Carbon Design System toast notification",
            "Pisahkan Page Object bila menargetkan O3 SPA; jangan campur selector."
          ],
          [
            "CSRFGuard Race Condition",
            "Form tersubmit sebelum input hidden `OWASP-CSRFTOKEN` disuntik JS",
            "`wait.until(ExpectedConditions.presenceOfElementLocated(By.name(\"OWASP-CSRFTOKEN\")))`."
          ],
          [
            "Minimized Chrome + `cf_clearance`",
            "Port `9222` bentrok `[::1]`; window minimize gagal `sendKeys`; quit menghapus cookie CF",
            "Gunakan `127.0.0.1:9223`, CDP `Page.bringToFront` + `Browser.setWindowBounds`, dan `logoutIfLoggedIn()`."
          ]
        ]
      }
    ],
    "compare": "Menutup browser antar test (`driver.quit()`) memang mengisolasi sesi, tetapi pada target ber-Cloudflare cookie `cf_clearance` milik user ikut terhapus. Menempel ke profil debug terverifikasi `127.0.0.1:9223` plus `logoutIfLoggedIn()` menjaga sesi tetap valid sambil mereset state login.",
    "code": {
      "language": "java",
      "extraTitle": "src/test/java/com/gits/qa/pages/OpenMrsLoginPage.java — Page Object Model + OWASP CSRFGuard Wait",
      "content": "package com.gits.qa.pages;\n\nimport org.openqa.selenium.By;\nimport org.openqa.selenium.WebDriver;\nimport org.openqa.selenium.WebElement;\nimport org.openqa.selenium.support.ui.ExpectedConditions;\nimport org.openqa.selenium.support.ui.WebDriverWait;\n\nimport java.time.Duration;\nimport java.util.List;\n\npublic class OpenMrsLoginPage {\n\n    public static final String BASE_URL = \"https://o3.openmrs.org/openmrs/\";\n\n    private static final By USERNAME_INPUT = By.id(\"username\");\n    private static final By PASSWORD_INPUT = By.id(\"password\");\n    private static final By LOGIN_SUBMIT_BUTTON = By.cssSelector(\"input[type='submit'][value='Log In'], form button[type='submit']\");\n    private static final By SESSION_LOCATION_LIST = By.id(\"sessionLocation\");\n    private static final By ERROR_MESSAGE_CONTAINER = By.id(\"openmrs_error\");\n\n    private static final By LOGOUT_LINK = By.linkText(\"Log out\");\n    private static final By LOGGED_IN_USER_BAR = By.id(\"userLoggedInAs\");\n    private static final By NAV_LIST = By.cssSelector(\"ul.navList\");\n\n    private final WebDriver driver;\n    private final WebDriverWait wait;\n\n    public OpenMrsLoginPage(WebDriver driver) {\n        this.driver = driver;\n        this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));\n    }\n\n    public void open() {\n        driver.get(BASE_URL);\n        wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));\n        wait.until(ExpectedConditions.presenceOfElementLocated(By.name(\"OWASP-CSRFTOKEN\")));\n    }\n\n    public void enterUsername(String username) {\n        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));\n        el.clear();\n        el.sendKeys(username);\n    }\n\n    public void enterPassword(String password) {\n        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(PASSWORD_INPUT));\n        el.clear();\n        el.sendKeys(password);\n    }\n\n    public boolean selectLocationIfRequired(String locationName) {\n        if (locationName == null || locationName.isBlank()) {\n            return false;\n        }\n        List<WebElement> locationLists = driver.findElements(SESSION_LOCATION_LIST);\n        if (!locationLists.isEmpty() && locationLists.get(0).isDisplayed()) {\n            WebElement option = locationLists.get(0).findElement(\n                    By.xpath(\".//li[normalize-space()='\" + locationName + \"']\"));\n            option.click();\n            return true;\n        }\n        return false;\n    }\n\n    public void clickLogin() {\n        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(LOGIN_SUBMIT_BUTTON));\n        submitBtn.click();\n    }\n\n    public boolean login(String username, String password, String locationName) {\n        enterUsername(username);\n        enterPassword(password);\n        boolean locationSelected = selectLocationIfRequired(locationName);\n        clickLogin();\n        return locationSelected;\n    }\n\n    public String getErrorMessageText() {\n        WebElement err = wait.until(ExpectedConditions.visibilityOfElementLocated(ERROR_MESSAGE_CONTAINER));\n        return err.getText().trim();\n    }\n\n    public boolean isDashboardDisplayed() {\n        wait.until(ExpectedConditions.and(\n                ExpectedConditions.visibilityOfElementLocated(LOGOUT_LINK),\n                ExpectedConditions.visibilityOfElementLocated(NAV_LIST)\n        ));\n        List<WebElement> userBar = driver.findElements(LOGGED_IN_USER_BAR);\n        boolean hasUserBar = !userBar.isEmpty() && userBar.get(0).isDisplayed();\n        return driver.findElement(LOGOUT_LINK).isDisplayed()\n                && driver.findElement(NAV_LIST).isDisplayed()\n                && (hasUserBar || driver.getPageSource().contains(\"Welcome to OpenMRS\"));\n    }\n\n    public String getLoggedInUserText() {\n        List<WebElement> userBar = driver.findElements(LOGGED_IN_USER_BAR);\n        return userBar.isEmpty() ? \"\" : userBar.get(0).getText().trim();\n    }\n\n    public void logoutIfLoggedIn() {\n        List<WebElement> logoutLinks = driver.findElements(LOGOUT_LINK);\n        if (!logoutLinks.isEmpty() && logoutLinks.get(0).isDisplayed()) {\n            logoutLinks.get(0).click();\n            wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));\n        }\n    }\n}"
    },
    "extraCodes": [
      {
        "title": "src/test/java/com/gits/qa/ui/OpenMrsLoginTest.java — Selenium 4 + Apache POI DDT + CDP Recovery",
        "language": "java",
        "variant": "neutral",
        "content": "package com.gits.qa.ui;\n\nimport com.gits.qa.pages.OpenMrsLoginPage;\nimport com.gits.qa.utils.ExcelUtils;\nimport org.openqa.selenium.Dimension;\nimport org.openqa.selenium.OutputType;\nimport org.openqa.selenium.TakesScreenshot;\nimport org.openqa.selenium.WebDriver;\nimport org.openqa.selenium.chrome.ChromeDriver;\nimport org.openqa.selenium.chrome.ChromeOptions;\nimport org.testng.Assert;\nimport org.testng.ITestResult;\nimport org.testng.Reporter;\nimport org.testng.annotations.AfterMethod;\nimport org.testng.annotations.BeforeMethod;\nimport org.testng.annotations.DataProvider;\nimport org.testng.annotations.Test;\n\nimport java.io.IOException;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.nio.file.Paths;\nimport java.time.Duration;\n\npublic class OpenMrsLoginTest {\n\n    private static final String SCREENSHOT_DIR = \"screenshots\";\n    private WebDriver driver;\n    private OpenMrsLoginPage loginPage;\n    private boolean attachedToExistingBrowser;\n\n    @BeforeMethod\n    public void setUp() {\n        String debuggerAddress = System.getProperty(\"chrome.debuggerAddress\", \"\").trim();\n        attachedToExistingBrowser = !debuggerAddress.isEmpty();\n\n        if (!attachedToExistingBrowser || driver == null) {\n            ChromeOptions options = new ChromeOptions();\n            if (attachedToExistingBrowser) {\n                options.setExperimentalOption(\"debuggerAddress\", debuggerAddress);\n            } else {\n                options.addArguments(\"--window-size=1440,900\");\n            }\n            driver = new ChromeDriver(options);\n            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));\n            if (attachedToExistingBrowser) {\n                try {\n                    ChromeDriver cd = (ChromeDriver) driver;\n                    cd.executeCdpCommand(\"Page.bringToFront\", java.util.Collections.emptyMap());\n                    java.util.Map<String, Object> winInfo = cd.executeCdpCommand(\"Browser.getWindowForTarget\", java.util.Collections.emptyMap());\n                    cd.executeCdpCommand(\"Browser.setWindowBounds\", java.util.Map.of(\n                            \"windowId\", winInfo.get(\"windowId\"),\n                            \"bounds\", java.util.Map.of(\"windowState\", \"normal\", \"width\", 1440, \"height\", 900)\n                    ));\n                } catch (Exception e) {\n                    System.out.println(\"DEBUG CDP WINDOW ERROR: \" + e.getMessage());\n                }\n            }\n            loginPage = new OpenMrsLoginPage(driver);\n        }\n\n        if (attachedToExistingBrowser) {\n            loginPage.logoutIfLoggedIn();\n        }\n    }\n\n    @AfterMethod(alwaysRun = true)\n    public void tearDown(ITestResult result) {\n        if (driver != null) {\n            if (!result.isSuccess()) {\n                try {\n                    Reporter.log(\"Failure URL: \" + driver.getCurrentUrl() + \" | Title: \" + driver.getTitle(), true);\n                } catch (Exception ignored) {\n                }\n            }\n            if (attachedToExistingBrowser) {\n                try {\n                    loginPage.logoutIfLoggedIn();\n                } catch (Exception ignored) {\n                }\n            } else {\n                driver.quit();\n                driver = null;\n            }\n        }\n    }\n\n    @DataProvider(name = \"loginData\")\n    public Object[][] getLoginDataFromExcel() {\n        return ExcelUtils.readSheetData(\"testdata.xlsx\", \"LoginData\");\n    }\n\n    @Test(priority = 1, description = \"Scenario 1: Failed Login with Invalid Credentials\")\n    public void scenario1_FailedLoginWithInvalidCredentials() {\n        loginPage.open();\n        boolean locationSelected = loginPage.login(\"randi_invalid\", \"invalid_qa_pass\", \"Outpatient Clinic\");\n        Reporter.log(\"Scenario 1 location selector present: \" + locationSelected, true);\n\n        String actualError = loginPage.getErrorMessageText();\n        Reporter.log(\"Scenario 1 observed error message: \" + actualError, true);\n\n        Assert.assertTrue(\n                actualError.equalsIgnoreCase(\"Invalid Username/Password. Please Try Again.\"),\n                \"Expected error message 'Invalid Username/Password. Please Try Again.' (case-insensitive), but got: \" + actualError\n        );\n    }\n\n    @Test(priority = 2, description = \"Scenario 2: Successful Login with Hardcoded Valid Credentials\")\n    public void scenario2_SuccessfulLoginHardcoded() {\n        loginPage.open();\n        boolean locationSelected = loginPage.login(\"admin\", \"Admin123\", \"Outpatient Clinic\");\n        Reporter.log(\"Scenario 2 location selector present: \" + locationSelected, true);\n\n        Assert.assertTrue(loginPage.isDashboardDisplayed(),\n                \"Expected OpenMRS Home Dashboard to be visible after valid hardcoded login\");\n        Reporter.log(\"Scenario 2 logged in user: \" + loginPage.getLoggedInUserText(), true);\n\n        captureScreenshot(\"Scenario2_Hardcoded_Login.png\");\n    }\n\n    @Test(priority = 3, dataProvider = \"loginData\",\n            description = \"Scenario 3: Successful Login Using Dynamic Credentials from Excel\")\n    public void scenario3_SuccessfulLoginExcelDdt(String username, String password, String location) {\n        loginPage.open();\n        boolean locationSelected = loginPage.login(username, password, location);\n        Reporter.log(\"Scenario 3 loaded from Excel -> user=\" + username + \", location=\" + location\n                + \", locationSelectorPresent=\" + locationSelected, true);\n\n        Assert.assertTrue(loginPage.isDashboardDisplayed(),\n                \"Expected OpenMRS Home Dashboard to be visible after valid Excel DDT login\");\n        Reporter.log(\"Scenario 3 logged in user: \" + loginPage.getLoggedInUserText(), true);\n\n        captureScreenshot(\"Scenario3_Excel_Login.png\");\n    }\n\n    private void captureScreenshot(String filename) {\n        try {\n            Path outputDir = Paths.get(SCREENSHOT_DIR);\n            Files.createDirectories(outputDir);\n            byte[] pngBytes = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);\n            Path target = outputDir.resolve(filename);\n            Files.write(target, pngBytes);\n            Reporter.log(\"Saved screenshot: \" + target.toAbsolutePath(), true);\n        } catch (IOException e) {\n            throw new RuntimeException(\"Unable to save screenshot \" + filename, e);\n        }\n    }\n}"
      },
      {
        "title": "PowerShell #1 & #2 — Launch Chrome Debug Port 9223 & Run Full Maven Suite (5/5 Passed)",
        "language": "powershell",
        "variant": "neutral",
        "content": "# PowerShell #1 — Buka Chrome Debug Port 9223 (Selesaikan Cloudflare sekali -> Login -> Log out -> Jangan minimize)\n& \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --remote-debugging-port=9223 --user-data-dir=\"$env:TEMP\\chrome-qa-debug\" \"https://o3.openmrs.org/openmrs/\"\n\n# PowerShell #2 — Jalankan Full Suite Maven 5/5 (API + UI + Screenshots)\n$env:JAVA_HOME = \"C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.21.9-hotspot\"\n$env:Path = \"C:\\Users\\HPrannn\\tools\\apache-maven-3.9.16\\bin;$env:JAVA_HOME\\bin;$env:Path\"\nSet-Location \"d:\\Portofolio\\QA Testing\\Test-GITS-QA-Randi Zakaria Putra\\2. Automation Testing\\GITS-QA-Automation\"\n& \"C:\\Users\\HPrannn\\tools\\apache-maven-3.9.16\\bin\\mvn.cmd\" clean test \"-Dchrome.debuggerAddress=127.0.0.1:9223\""
      }
    ],
    "practices": [
      "Inspeksi DOM halaman target secara langsung sebelum memilih selector — bedakan URL `/openmrs/` (Legacy 1-step) dari root `/` (O3 React SPA 2-step).",
      "Tunggu `<input name=\"OWASP-CSRFTOKEN\">` hadir di DOM sebelum submit form pada aplikasi yang memakai proteksi asynchronous CSRFGuard.",
      "Gunakan port bebas `9223` + `127.0.0.1` untuk menghindari tabrakan IPv4/IPv6 `[::1]` di port `9222`, serta kembalikan ukuran jendela dengan CDP `Browser.setWindowBounds` agar `sendKeys` selalu andal."
    ],
    "case": "Saat menjalankan skenario login OpenMRS, Selenium terlalu cepat menekan `Log In` sebelum `/openmrs/csrfguard` menyuntikkan token hidden sehingga form terus kembali ke halaman awal. Menunggu `By.name(\"OWASP-CSRFTOKEN\")` serta memulihkan window via CDP menghasilkan 5/5 Passed (2 API + 3 UI + 2 PNG) dalam 18.025 detik.",
    "exercise": {
      "scenario": "Test UI Java Anda menempel ke Chrome Debug Port `9223` milik user, namun jendela browser sempat ter-minimize sebelum tes dijalankan.",
      "task": "Tambahkan blok CDP `Page.bringToFront` dan `Browser.setWindowBounds` (`windowState: \"normal\"`, `1440x900`) serta verifikasi `By.name(\"OWASP-CSRFTOKEN\")` di `OpenMrsLoginPage.open()`."
    },
    "quiz": {
      "question": "Mengapa pada kasus OpenMRS kita memanggil `loginPage.logoutIfLoggedIn()` pada mode `attachedToExistingBrowser` daripada memanggil `driver.quit()` di `@AfterMethod`?",
      "options": [
        "Agar Chrome tidak bisa ditutup selamanya.",
        "Untuk menjaga cookie `cf_clearance` milik profil debug agar tetap valid antar-skenario tanpa menghapus sesi verifikasi browser.",
        "Karena Apache POI melarang pemakaian driver.quit()."
      ],
      "answer": 1,
      "explanation": "Memanggil `driver.quit()` pada debug session menutup proses Chrome beserta konteks cookie, sedangkan `logoutIfLoggedIn()` mengembalikan UI ke form login sambil mempertahankan status verifikasi sesi."
    },
    "refs": [
      "https://o3.openmrs.org/openmrs/",
      "https://www.selenium.dev/documentation/"
    ]
  },
  {
    "id": "qam28",
    "mode": "qa",
    "order": 1,
    "track": "QA Fase 5B: Web Vitals Nyata, k6 Trend & Command Center",
    "title": "Audit Core Web Vitals Praktis: Lighthouse CLI, `k6/browser` & Pembuktian `TTFB / INP / TBT`",
    "level": "Intermediate",
    "summary": "Pemetaan dua lapisan QA Performance Engineering: k6 API Protocol Testing (backend RPS & TTFB `http_req_waiting`) vs Frontend User-Centric Core Web Vitals (`LCP`, `INP` pengganti FID sejak Maret 2024, `CLS`, `FCP`, `TBT`), disertai perintah Lighthouse CLI siap jalan dan template `k6/browser` untuk `k6 v2.4.0`.",
    "concepts": [
      [
        "TTFB Sudah Terukur Langsung di k6 Protocol Test",
        "TTFB (Time to First Byte) diukur oleh metrik `http_req_waiting` pada k6. Hasil real dari Modul 3: `avg 229.05 ms`, `p95 415.14 ms` — masuk kategori Good (`<= 800 ms`; Warn 800–1800 ms; Poor > 1800 ms)."
      ],
      [
        "INP (Pengganti FID Maret 2024) & Kasus OpenMRS Vitals",
        "INP (Good `<= 200 ms`; Warn 200–500 ms; Poor > 500 ms) mengukur latensi p98 interaksi user (klik/ketik) ke frame berikutnya. Dipicu Long Tasks (> 50 ms) / state React berat — relevan langsung dengan bug hilangnya ketikan awal di input Vitals OpenMRS!"
      ],
      [
        "LCP, CLS, FCP & TBT (Proksi Lab INP di Lighthouse)",
        "LCP (Good `<= 2.5 s`, Poor `> 4.0 s`), CLS (Good `<= 0.10`, Poor `> 0.25`), FCP (Good `<= 1.8 s`), dan TBT (Good `<= 200 ms`). Karena audit lab Lighthouse tidak menekan semua tombol interaktif, TBT dipakai sebagai proksi kuat memprediksi buruknya INP."
      ],
      [
        "Kapan Memakai k6 Protocol vs Lighthouse / k6/browser?",
        "k6 Protocol test (ringan, mampu 1.000+ VUs dari 1 laptop) menguji daya tahan backend/DB/CDN, error rate, connection pool & TTFB. Lighthouse/`k6/browser` (1–10 instances Chromium karena boros RAM/CPU) membedah `LCP`, `INP`, `CLS`, dan JS main-thread blocking."
      ]
    ],
    "tables": [
      {
        "title": "Matriks Ambang Batas Core Web Vitals & Cara Mengukurnya di Proyek QA",
        "headers": [
          "Metrik",
          "Definisi Ringkas",
          "Ambang Batas Google (Good / Warn / Poor)",
          "Posisi Proyek Ini & Instrumen Ukur"
        ],
        "rows": [
          [
            "TTFB (Time to First Byte)",
            "Waktu sejak HTTP request dikirim hingga byte pertama respons server/CDN diterima.",
            "Good <= 800 ms · Warn 800–1800 ms · Poor > 1800 ms",
            "Terukur di k6 (`http_req_waiting`): avg 229.05 ms, p95 415.14 ms (Good)."
          ],
          [
            "LCP (Largest Contentful Paint)",
            "Waktu elemen konten terbesar di viewport selesai ter-render.",
            "Good <= 2.5 s · Warn 2.5–4.0 s · Poor > 4.0 s",
            "Diukur via Lighthouse CLI, Chrome DevTools Performance, atau `k6/browser`."
          ],
          [
            "INP (Interaction to Next Paint)",
            "Pengganti FID sejak Maret 2024: latensi klik/ketik ke frame visual berikutnya.",
            "Good <= 200 ms · Warn 200–500 ms · Poor > 500 ms",
            "Dipicu Long Task > 50 ms / React re-render berat (kasus ketikan hilang di OpenMRS Vitals)."
          ],
          [
            "CLS (Cumulative Layout Shift)",
            "Total pergeseran elemen visual tiba-tiba saat load/interaksi.",
            "Good <= 0.10 · Warn 0.10–0.25 · Poor > 0.25",
            "Dipicu image tanpa width/height, webfont late-swap, atau toast banner dinamis."
          ],
          [
            "FCP & TBT",
            "First Contentful Paint & Total Blocking Time (>50 ms main thread terkunci).",
            "FCP Good <= 1.8 s · TBT Good <= 200 ms",
            "Proksi lab Lighthouse untuk mendeteksi potensi buruknya INP di produksi."
          ]
        ]
      }
    ],
    "compare": "Jangan memaksa 1.000 VUs memakai `k6/browser` karena tiap instance Chromium menghabiskan ratusan MB RAM dan CPU. Jalankan 500–1.000 VUs di layer k6 Protocol untuk TTFB & DB, lalu jalankan 1–10 instances di Lighthouse / `k6/browser` untuk `LCP`, `INP`, `TBT`, dan `CLS`.",
    "code": {
      "language": "javascript",
      "extraTitle": "k6/browser Template — Mengukur Core Web Vitals (LCP, INP, CLS, TTFB) dengan k6 v2.4.0",
      "content": "import { browser } from 'k6/browser';\nimport { check } from 'k6';\n\nexport const options = {\n  scenarios: {\n    ui_vitals: {\n      executor: 'shared-iterations',\n      vus: 1,\n      iterations: 1,\n      options: { browser: { type: 'chromium' } },\n    },\n  },\n  thresholds: {\n    browser_web_vital_lcp: ['p(95)<2500'],\n    browser_web_vital_inp: ['p(95)<200'],\n    browser_web_vital_cls: ['p(95)<0.1'],\n    browser_web_vital_ttfb: ['p(95)<800'],\n  },\n};\n\nexport default async function () {\n  const page = await browser.newPage();\n  try {\n    await page.goto('https://example.com', { waitUntil: 'networkidle' });\n    await page.locator('a').first().click();\n    check(page, { 'page loaded': () => page.url().length > 0 });\n  } finally {\n    await page.close();\n  }\n}"
    },
    "extraCodes": [
      {
        "title": "PowerShell — Audit Core Web Vitals (LCP, CLS, TTFB, TBT, FCP) via Lighthouse CLI + Catatan k6/browser",
        "language": "powershell",
        "variant": "neutral",
        "content": "$env:CHROME_PATH = \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\"\n$env:Path = \"C:\\Program Files\\nodejs;$env:Path\"\n$outReport = \"d:\\Portofolio\\QA Testing\\lighthouse-openmrs-report.html\"\n\n& \"C:\\Program Files\\nodejs\\npx.cmd\" --yes lighthouse \"https://o3.openmrs.org/openmrs/spa/login\" `\n  --only-categories=performance `\n  --output=html `\n  --output-path=\"$outReport\" `\n  --chrome-flags=\"--headless=new\"\n\nStart-Process \"$outReport\"\n\n# Catatan penting untuk menjalankan k6/browser di Windows lokal:\n# $env:K6_BROWSER_EXECUTABLE_PATH = \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\"\n# Target publik ber-Cloudflare (o3.openmrs.org) dapat memicu anti-bot pada headless browser baru."
      }
    ],
    "practices": [
      "Selalu set `$env:K6_BROWSER_EXECUTABLE_PATH = \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\"` di PowerShell sebelum mengeksekusi skrip `k6/browser` di Windows.",
      "Gunakan TBT (`<= 200 ms`) di laporan Lighthouse lab sebagai sinyal peringatan dini terhadap masalah INP (`<= 200 ms`) di lapangan.",
      "Ingat bahwa situs publik yang diproteksi Cloudflare seperti `o3.openmrs.org` dapat memunculkan tantangan anti-bot saat diaudit dengan browser headless baru."
    ],
    "case": "Gejala ketikan angka pertama hilang saat user mengisi form Vitals di OpenMRS 3 sering kali merupakan indikasi Long Task React pada main thread (INP > 200 ms), sesuatu yang tidak terlihat dari test API `k6` (`http_req_waiting` 229 ms) dan hanya terbongkar dengan audit DevTools/Lighthouse/`k6/browser`.",
    "exercise": {
      "scenario": "Anda ingin menambahkan Quality Gate frontend Web Vitals di skrip `k6/browser` (`k6 v2.4.0`) sesuai ambang batas Google Good.",
      "task": "Tuliskan objek `thresholds` untuk `browser_web_vital_lcp`, `browser_web_vital_inp`, `browser_web_vital_cls`, dan `browser_web_vital_ttfb` pada p(95)."
    },
    "quiz": {
      "question": "Mengapa Lighthouse lab menggunakan Total Blocking Time (TBT) untuk memprediksi INP di dunia nyata?",
      "options": [
        "Karena TBT menghitung ukuran gambar PNG.",
        "Karena Lighthouse lab tidak mengetik/mengklik seluruh elemen interaktif, sementara main thread yang terkunci >50 ms (TBT tinggi) secara langsung membuat input user tertunda (INP buruk).",
        "Karena TTFB selalu sama dengan CLS."
      ],
      "answer": 1,
      "explanation": "TBT menjumlahkan waktu blokir main thread lebih dari 50 ms selama loading sehingga akurat menjadi proksi lab untuk risiko degradasi INP."
    },
    "refs": [
      "https://web.dev/articles/inp",
      "https://grafana.com/docs/k6/latest/using-k6-browser/"
    ]
  },
  {
    "id": "qam29",
    "mode": "qa",
    "order": 2,
    "track": "QA Fase 5B: Web Vitals Nyata, k6 Trend & Command Center",
    "title": "k6 Custom `Trend` & `Rate` Instrumentation (`500 → 1.000 VUs` GET vs POST)",
    "level": "Advanced",
    "summary": "Implementasi penuh `performance-test.js` Pilar 3 yang mengeksekusi 134,896 requests dengan 0% error rate selama 4m 30s (495.49 req/s, p95 = 416.27 ms < 2000 ms), membedah latensi GET vs POST serta fase 500 vs 1.000 VUs via custom `Trend`, `Rate`, dan `k6/execution`.",
    "concepts": [
      [
        "KPI Eksekusi Pilar 3 (500 → 1.000 VUs, 4m 30s)",
        "Tahapan beban: 1m ramp ke 500 VU -> 1m hold 500 VU -> 1m ramp ke 1.000 VU -> 1m hold 1.000 VU -> 30s ramp-down ke 0. Hasil total: 134,896 Reqs, 0% Error, 495.49 req/s, SLA `p(95) = 416.27 ms < 2000 ms`."
      ],
      [
        "Membedah Angka: Custom `Trend` GET vs POST",
        "Rata-rata global sering menipu. Memisahkan metrik via `get_req_duration` (`137.90 ms`) dan `post_req_duration` (`321.08 ms`) membuktikan operasi baca (`GET /posts/1`) 2.33x lebih cepat berkat edge cache Cloudflare (`cf-cache-status: HIT`)."
      ],
      [
        "Isolasi Fase 500 vs 1.000 VU via `exec.scenario.startTime`",
        "Helper `recordPhaseMetrics(durationMs, isFailed)` membaca `Date.now() - exec.scenario.startTime`: 0–120 detik masuk ke `phase_500vu_duration`, sedangkan 120–240 detik ke `phase_1000vu_duration`. Hasilnya memperlihatkan kenaikan p95 +20.77% dan `http_req_waiting` mendominasi 99.81% durasi."
      ],
      [
        "Validasi Payload Integritas + Demo Cepat vs Penuh",
        "Setiap `POST /posts` memvalidasi status 201 sekaligus kesesuaian echo `title`, `body`, `userId`, dan `id !== undefined`. Tersedia command demo cepat 10 VUs / 5s agar eksperimen tidak menimpa `summary-result.json` resmi."
      ]
    ],
    "tables": [
      {
        "title": "Hasil Pengukuran & Isolasi Custom Metrics k6 (`performance-test.js`)",
        "headers": [
          "Metrik / Dimensi",
          "Nilai Terukur",
          "Temuan Teknis & SLA"
        ],
        "rows": [
          [
            "Total Requests & Error Rate",
            "134,896 Reqs · 0% Error · 495.49 req/s",
            "Threshold `http_req_failed: ['rate<0.05']` lulus sempurna 0%."
          ],
          [
            "SLA Global Duration (`p95`) & TTFB",
            "`p(95) = 416.27 ms` (`http_req_waiting` = 99.81%)",
            "Lulus SLA `< 2000 ms`. Hampir seluruh waktu tunggu berasal dari TTFB jaringan/server."
          ],
          [
            "`GET /posts/1` vs `POST /posts`",
            "`137.90 ms` vs `321.08 ms`",
            "Read 2.33x lebih cepat daripada write karena edge caching Cloudflare (`cf-cache-status: HIT`)."
          ],
          [
            "Fase `500 VU` vs `1.000 VU`",
            "`p95` fase 1000 VU naik `+20.77%`",
            "Terisolasi presisi melalui `exec.scenario.startTime` (window <= 120s vs <= 240s)."
          ]
        ]
      }
    ],
    "compare": "Skrip k6 standar hanya mencetak rata-rata gabungan seluruh request sehingga masalah endpoint write lambat tertutup oleh GET yang ter-cache di CDN. Memakai custom `Trend` dan `Rate` per group serta per window waktu mengungkap perilaku GET vs POST dan dampak kenaikan VU secara objektif.",
    "code": {
      "language": "javascript",
      "extraTitle": "3. Performance Testing/src/performance-test.js — Full Custom Trend & Phase Instrumentation",
      "content": "import http from 'k6/http';\nimport { check, sleep, group } from 'k6';\nimport { Trend, Rate } from 'k6/metrics';\nimport exec from 'k6/execution';\n\nconst getReqDuration = new Trend('get_req_duration', true);\nconst postReqDuration = new Trend('post_req_duration', true);\nconst getReqFailed = new Rate('get_req_failed');\nconst postReqFailed = new Rate('post_req_failed');\n\nconst phase500Duration = new Trend('phase_500vu_duration', true);\nconst phase1000Duration = new Trend('phase_1000vu_duration', true);\nconst phase500Failed = new Rate('phase_500vu_failed');\nconst phase1000Failed = new Rate('phase_1000vu_failed');\n\nconst BASE_URL = 'https://jsonplaceholder.typicode.com';\n\nexport const options = {\n  stages: [\n    { duration: '1m', target: 500 },\n    { duration: '1m', target: 500 },\n    { duration: '1m', target: 1000 },\n    { duration: '1m', target: 1000 },\n    { duration: '30s', target: 0 },\n  ],\n  thresholds: {\n    http_req_duration: ['p(95)<2000'],\n    http_req_failed: ['rate<0.05'],\n  },\n};\n\nfunction recordPhaseMetrics(durationMs, isFailed) {\n  const elapsedMs = Date.now() - exec.scenario.startTime;\n  if (elapsedMs <= 120000) {\n    phase500Duration.add(durationMs);\n    phase500Failed.add(isFailed);\n  } else if (elapsedMs <= 240000) {\n    phase1000Duration.add(durationMs);\n    phase1000Failed.add(isFailed);\n  }\n}\n\nexport default function () {\n  group('GET /posts/1', function () {\n    const getRes = http.get(`${BASE_URL}/posts/1`, {\n      tags: { endpoint: 'GET_posts_1' },\n    });\n\n    const getOk = check(getRes, {\n      'GET /posts/1 status is 200': (r) => r.status === 200,\n      'GET /posts/1 body id === 1': (r) => {\n        if (r.status !== 200) return false;\n        try {\n          return r.json('id') === 1;\n        } catch (e) {\n          return false;\n        }\n      },\n    });\n\n    getReqDuration.add(getRes.timings.duration);\n    getReqFailed.add(!getOk);\n    recordPhaseMetrics(getRes.timings.duration, !getOk);\n  });\n\n  sleep(1);\n\n  group('POST /posts', function () {\n    const payloadObj = {\n      title: `GITS QA Load Test VU-${__VU}`,\n      body: `Performance iteration ${__ITER}`,\n      userId: (__VU % 10) + 1,\n    };\n    const params = {\n      headers: { 'Content-Type': 'application/json; charset=UTF-8' },\n      tags: { endpoint: 'POST_posts' },\n    };\n\n    const postRes = http.post(`${BASE_URL}/posts`, JSON.stringify(payloadObj), params);\n\n    const postOk = check(postRes, {\n      'POST /posts status is 201': (r) => r.status === 201,\n      'POST /posts payload matches': (r) => {\n        if (r.status !== 201) return false;\n        try {\n          const data = r.json();\n          return (\n            data.title === payloadObj.title &&\n            data.body === payloadObj.body &&\n            Number(data.userId) === payloadObj.userId &&\n            data.id !== undefined\n          );\n        } catch (e) {\n          return false;\n        }\n      },\n    });\n\n    postReqDuration.add(postRes.timings.duration);\n    postReqFailed.add(!postOk);\n    recordPhaseMetrics(postRes.timings.duration, !postOk);\n  });\n\n  sleep(1);\n}"
    },
    "extraCodes": [
      {
        "title": "PowerShell — Demo Cepat k6 (10 VUs, 5s) vs Eksekusi Penuh (500->1.000 VUs + Export JSON & Log)",
        "language": "powershell",
        "variant": "neutral",
        "content": "# 1. Demo Cepat k6 (10 VUs, 5 Detik — Tidak menimpa laporan resmi)\nSet-Location \"d:\\Portofolio\\QA Testing\\Test-GITS-QA-Randi Zakaria Putra\"\n& \"C:\\Program Files\\k6\\k6.exe\" run --vus 10 --duration 5s \"3. Performance Testing/src/performance-test.js\"\n\n# 2. Eksekusi Penuh k6 (500 -> 1,000 VUs, 4m 30s) + Ekspor summary-result.json & execution-log.txt\n& \"C:\\Program Files\\k6\\k6.exe\" run --summary-export=\"3. Performance Testing/src/summary-result.json\" \"3. Performance Testing/src/performance-test.js\" 2>&1 | Tee-Object -FilePath \"3. Performance Testing/src/execution-log.txt\"\n\n# 3. Cek 45 Baris Terakhir Log Resmi\nGet-Content \"d:\\Portofolio\\QA Testing\\Test-GITS-QA-Randi Zakaria Putra\\3. Performance Testing\\src\\execution-log.txt\" -Tail 45"
      }
    ],
    "practices": [
      "Berikan parameter kedua `true` (`new Trend('get_req_duration', true)`) agar k6 memformat unit durasi dalam milidetik secara rapi di summary report.",
      "Selalu bungkus `r.json()` di dalam blok `try/catch` saat melakukan `check()` sehingga HTML error page 502/504 di bawah beban ekstrem tidak menyebabkan exception skrip.",
      "Gunakan flag CLI `--vus 10 --duration 5s` saat smoke-testing skrip baru agar tidak menimpa artefak laporan resmi `summary-result.json`."
    ],
    "case": "Saat menganalisis laporan 134,896 request, custom `Trend` membuktikan `GET /posts/1` hanya `137.90 ms` sementara `POST /posts` membutuhkan `321.08 ms` (2.33x lebih lama), dan `http_req_waiting` menyumbang `99.81%` dari durasi total—artinya optimasi ada pada server/edge caching bukan client CPU.",
    "exercise": {
      "scenario": "Skrip k6 memiliki stage 2 menit pertama pada target 500 VU (`0–120000 ms`) dan 2 menit berikutnya menuju 1.000 VU (`120001–240000 ms`).",
      "task": "Tulis helper `recordPhaseMetrics(durationMs, isFailed)` memakai `exec.scenario.startTime` dan custom `Trend` terpisah untuk fase 500 vs 1.000 VU."
    },
    "quiz": {
      "question": "Apa tujuan menambahkan argumen `true` pada konstruktor `new Trend('get_req_duration', true)` di k6?",
      "options": [
        "Mengaktifkan enkripsi TLS 1.3.",
        "Memberi tahu k6 bahwa nilai metrik tersebut adalah satuan waktu (isTime) sehingga statistik p90/p95 tampil sebagai milidetik/detik di output summary.",
        "Mengubah jenis metrik menjadi Counter."
      ],
      "answer": 1,
      "explanation": "Argumen kedua `isTime: true` pada `Trend` di k6 membuat formatter summary menampilkan satuan waktu (ms/s) selaras dengan `http_req_duration`."
    },
    "refs": [
      "https://grafana.com/docs/k6/latest/using-k6/metrics/create-custom-metrics/",
      "https://grafana.com/docs/k6/latest/javascript-api/k6-execution/"
    ]
  },
  {
    "id": "qam30",
    "mode": "qa",
    "order": 3,
    "track": "QA Fase 5B: Web Vitals Nyata, k6 Trend & Command Center",
    "title": "Profil Perangkat Lokal, Command Runner PowerShell & Clean ZIP/Drive Packaging",
    "level": "Beginner",
    "summary": "Referensi lengkap environment lokal Windows yang terverifikasi (`OpenJDK 17.0.21+9`, `Maven 3.9.16`, `Grafana k6 v2.4.0`, `Chrome 158.0.8127.36`, `Python 3.12.1`, `Node/npx`), perintah membuka report HTML & PNG, skrip Python build 3 file ZIP bersih (tanpa `target/`), serta checklist upload Google Drive.",
    "concepts": [
      [
        "Profil Binary Terverifikasi di Perangkat Lokal",
        "Seluruh binary di `Test-GITS-QA-Randi Zakaria Putra` telah terverifikasi ada (`Exists = True`): JDK 17 Temurin (`17.0.21+9`), Maven `3.9.16`, k6 `v2.4.0`, Chrome `158.0.8127.36`, Python `3.12.1`, dan Node.js/npx."
      ],
      [
        "Self-Contained PowerShell ENV Snippet",
        "Dengan mendefinisikan `$env:JAVA_HOME` dan prepending path Maven, Java, k6, dan Node ke `$env:Path`, seluruh command runner langsung berjalan mulus bahkan di terminal VS Code/PowerShell lama yang belum di-restart."
      ],
      [
        "Clean ZIP Packaging Tanpa Folder `target/`",
        "Sebelum diunggah, artefak hasil (`emailable-report.html`, `Scenario2_Hardcoded_Login.png`, `Scenario3_Excel_Login.png`, `README.md`) disalin keluar proyek lalu Python `zipfile.ZIP_DEFLATED` mengemas ulang `GITS-QA-Manual.zip`, `GITS-QA-Automation.zip` (hanya `pom.xml`, `README.md`, `src/` — tanpa `target/`), dan `GITS-QA-Performance.zip`."
      ],
      [
        "Checklist Struktur Upload Google Drive (3 Subfolder)",
        "Drive `Manual Testing`: import CSV ke Sheets + `evidence/` + `README_Manual.md` + `GITS-QA-Manual.zip`. `Automation Testing`: ZIP + `emailable-report.html` + 2 PNG + `README.md`. `Performance Testing`: `Performance_Test_Report.md` + ZIP + `README.md`. File pribadi (`qa-test-runner-cheatsheet.html`, `QA_Prompt_Engineering_Playbook.md`) tetap di root pribadi."
      ]
    ],
    "tables": [
      {
        "title": "Profil Binary Perangkat Lokal Terverifikasi (`Exists = True`)",
        "headers": [
          "Tool",
          "Versi Terverifikasi",
          "Lokasi Eksak Binary di Perangkat Windows"
        ],
        "rows": [
          [
            "OpenJDK 17",
            "Temurin `17.0.21+9`",
            "`C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.21.9-hotspot\\bin\\java.exe`"
          ],
          [
            "Apache Maven",
            "`3.9.16`",
            "`C:\\Users\\HPrannn\\tools\\apache-maven-3.9.16\\bin\\mvn.cmd`"
          ],
          [
            "Grafana k6",
            "`v2.4.0`",
            "`C:\\Program Files\\k6\\k6.exe`"
          ],
          [
            "Google Chrome",
            "`158.0.8127.36`",
            "`C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`"
          ],
          [
            "Python",
            "`3.12.1`",
            "`C:\\Users\\HPrannn\\AppData\\Local\\Programs\\Python\\Python312\\python.exe`"
          ],
          [
            "Node.js / npx",
            "Installed",
            "`C:\\Program Files\\nodejs\\node.exe` & `npx.cmd`"
          ]
        ]
      }
    ],
    "compare": "Meng-zip seluruh folder proyek Maven secara mentah akan menyertakan folder `target/` berisi ratusan file class hasil kompilasi yang membengkakkan ukuran file dan memicu curiga reviewer. Mengemas ulang dengan skrip Python hanya menyertakan `pom.xml`, `README.md`, `src/`, dan menyalin report keluar folder proyek.",
    "code": {
      "language": "powershell",
      "extraTitle": "PowerShell — Rebuild 3 Clean ZIPs (Tanpa target/) + Copy Report & Screenshots",
      "content": "$py = \"C:\\Users\\HPrannn\\AppData\\Local\\Programs\\Python\\Python312\\python.exe\"\n$root = \"d:\\Portofolio\\QA Testing\\Test-GITS-QA-Randi Zakaria Putra\"\n$autoRoot = \"$root\\2. Automation Testing\"\n$autoProj = \"$autoRoot\\GITS-QA-Automation\"\n\nCopy-Item \"$autoProj\\target\\surefire-reports\\emailable-report.html\" \"$autoRoot\\emailable-report.html\" -Force\nCopy-Item \"$autoProj\\screenshots\\Scenario2_Hardcoded_Login.png\" \"$autoRoot\\Scenario2_Hardcoded_Login.png\" -Force\nCopy-Item \"$autoProj\\screenshots\\Scenario3_Excel_Login.png\" \"$autoRoot\\Scenario3_Excel_Login.png\" -Force\nCopy-Item \"$autoProj\\README.md\" \"$autoRoot\\README.md\" -Force\n\n& $py -c \"\nimport os, zipfile\nroot = r'$root'\n\n# 1. Manual ZIP\nm = os.path.join(root, '1. Manual Testing')\nwith zipfile.ZipFile(os.path.join(m, 'GITS-QA-Manual.zip'), 'w', zipfile.ZIP_DEFLATED) as zf:\n    for f in ['OpenMRS_Test_Cases.csv', 'OpenMRS_Bug_Reports.csv', 'README_Manual.md']:\n        zf.write(os.path.join(m, f), f)\n    ev = os.path.join(m, 'evidence')\n    for fn in sorted(os.listdir(ev)):\n        zf.write(os.path.join(ev, fn), f'evidence/{fn}')\n\n# 2. Automation ZIP (tanpa target/)\na = os.path.join(root, '2. Automation Testing')\nproj = os.path.join(a, 'GITS-QA-Automation')\nwith zipfile.ZipFile(os.path.join(a, 'GITS-QA-Automation.zip'), 'w', zipfile.ZIP_DEFLATED) as zf:\n    for f in ['pom.xml', 'README.md']:\n        zf.write(os.path.join(proj, f), f)\n    for r, _, files in os.walk(os.path.join(proj, 'src')):\n        for fn in files:\n            full = os.path.join(r, fn)\n            zf.write(full, os.path.relpath(full, proj).replace(os.sep, '/'))\n\n# 3. Performance ZIP\np = os.path.join(root, '3. Performance Testing')\nwith zipfile.ZipFile(os.path.join(p, 'GITS-QA-Performance.zip'), 'w', zipfile.ZIP_DEFLATED) as zf:\n    zf.write(os.path.join(p, 'README.md'), 'README.md')\n    for fn in ['performance-test.js', 'summary-result.json', 'execution-log.txt']:\n        zf.write(os.path.join(p, 'src', fn), f'src/{fn}')\nprint('All 3 ZIPs rebuilt cleanly.')\n\""
    },
    "extraCodes": [
      {
        "title": "PowerShell — Aktivasi Environment Session & Buka Report HTML/PNG Langsung",
        "language": "powershell",
        "variant": "neutral",
        "content": "# 1. Aktifkan semua tool di terminal mana pun & verifikasi versi\n$env:JAVA_HOME = \"C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.21.9-hotspot\"\n$env:Path = \"C:\\Users\\HPrannn\\tools\\apache-maven-3.9.16\\bin;$env:JAVA_HOME\\bin;C:\\Program Files\\k6;C:\\Program Files\\nodejs;$env:Path\"\n\njava -version\nmvn -version\nk6 version\npython --version\n\n# 2. Buka emailable-report.html, surefire index.html & kedua screenshot login\n$autoRoot = \"d:\\Portofolio\\QA Testing\\Test-GITS-QA-Randi Zakaria Putra\\2. Automation Testing\"\nStart-Process \"$autoRoot\\emailable-report.html\"\nStart-Process \"$autoRoot\\GITS-QA-Automation\\target\\surefire-reports\\index.html\"\nStart-Process \"$autoRoot\\Scenario2_Hardcoded_Login.png\"\nStart-Process \"$autoRoot\\Scenario3_Excel_Login.png\""
      }
    ],
    "practices": [
      "Selalu ekspor `emailable-report.html` dan file screenshot PNG keluar folder `target/` sebelum membangun `GITS-QA-Automation.zip` tanpa `target/`.",
      "Jaga agar file belajar & prompt pribadi (`qa-test-runner-cheatsheet.html`, `QA_Prompt_Engineering_Playbook.md`) tetap berada di root pribadi dan tidak ikut ter-upload ke subfolder Drive assessment.",
      "Pastikan slash path ZIP dibuat portabel memakai `.replace(os.sep, '/')` di Python agar arsip ZIP tetap rapi saat diekstrak reviewer di macOS/Linux maupun Windows."
    ],
    "case": "Menggunakan skrip packaging Python berulang memastikan reviewer di Google Drive menerima tepat 3 ZIP bersih, laporan HTML, screenshot bukti, serta dataset CSV terstruktur tanpa sampah hasil kompilasi Java atau file catatan pribadi.",
    "exercise": {
      "scenario": "Proyek Maven berada di terminal VS Code lama yang belum memuat variabel sistem `JAVA_HOME` dan Maven terbaru.",
      "task": "Jalankan aktivasi session PowerShell (`$env:JAVA_HOME`, `$env:Path`), verifikasi `java -version` / `mvn -version` / `k6 version`, lalu bangun ulang 3 file ZIP deliverable tanpa menyertakan folder `target/`."
    },
    "quiz": {
      "question": "Mengapa folder `target/` harus dikecualikan ketika mengemas `GITS-QA-Automation.zip` untuk pengumpulan deliverable?",
      "options": [
        "Karena folder target menyimpan password admin OpenMRS.",
        "Karena `target/` hanya berisi artefak kompilasi sementara berukuran besar yang dapat dibuat ulang oleh `mvn test`, sementara bukti `emailable-report.html` dan PNG sudah disalin keluar.",
        "Karena format ZIP tidak mendukung huruf kapital."
      ],
      "answer": 1,
      "explanation": "Mengecualikan `target/` menjaga arsip bersih, ringan, dan siap diekstrak ulang oleh reviewer dengan `mvn test`."
    },
    "refs": [
      "https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html",
      "https://docs.python.org/3/library/zipfile.html"
    ]
  }
];
