/**
 * Interactive Implementation Ladder (Sederhana -> Menengah -> Profesional)
 * & Live In-Browser Implementation Code Test Runner
 */

(function (window) {
  'use strict';

  // --- Helpers for Sandboxed Code Evaluation ---

  function runSandboxedJS(userCode, harnessSetup) {
    try {
      const fn = new Function('ctx', `'use strict';\n${harnessSetup}\n${userCode}\nreturn typeof __verify === 'function' ? __verify() : null;`);
      return { ok: true, result: fn({}) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function checkPatterns(code, checks) {
    const source = String(code || '');
    return checks.map(c => {
      const pass = typeof c.fn === 'function' ? c.fn(source) : c.regex.test(source);
      return { pass, label: c.label, hint: pass ? '' : c.hint };
    });
  }

  // --- Bespoke Detailed 3-Tier Implementation Guides ---

  const BESPOKE_GUIDES = {
    qam20: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Fondasi & Test Case Pertama)',
        goal: 'Menulis 1 Test Case login valid mengikuti standar TC-AUTH-001 tanpa tools berbayar.',
        steps: [
          { title: 'Siapkan Spreadsheet / Jira Board', detail: 'Buat 4 kolom dasar: To Do, In Progress, Ready for QA, Done.' },
          { title: 'Tulis Test Case ID & Pre-Condition', detail: 'Gunakan penamaan terstruktur seperti TC-AUTH-001 dan tuliskan kondisi awal (/login, belum login).' },
          { title: 'Rinci Test Steps & Expected Result', detail: 'Catat langkah bernomor (isi email, password, klik Login) serta ekspektasi konkret (redirect /dashboard & token tersimpan).' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Smoke vs Sanity & Negative Cases)',
        goal: 'Memisahkan skenario Smoke, Sanity, dan Regression serta melengkapi jalur negatif.',
        steps: [
          { title: 'Tandai Smoke Suite', detail: 'Pilih 5 alur terpenting (Login, Search, Add to Cart, Checkout, Logout) sebagai Smoke Test pasca-deploy.' },
          { title: 'Tambahkan Negative Test Cases', detail: 'Buat TC-AUTH-002 (password salah), TC-AUTH-003 (email kosong), dan TC-AUTH-004 (format email invalid).' },
          { title: 'Petakan ke Siklus STLC', detail: 'Lakukan Requirement Review sebelum developer coding (Shift-Left) dan siapkan Test Data sebelum eksekusi.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Traceability Matrix & UAT Sign-Off)',
        goal: 'Menghubungkan Test Case ke User Story Jira dan membangun gerbang Regression otomatis.',
        steps: [
          { title: 'Bangun Requirement Traceability Matrix (RTM)', detail: 'Tautkan setiap Test Case (relasi "tests") ke tiket User Story di Jira agar 100% Acceptance Criteria teruji.' },
          { title: 'Jadwalkan Regression & Exploratory Session', detail: 'Alokasikan timebox 45 menit Exploratory Testing pasca-regression untuk mencari bug UI/edge-case.' },
          { title: 'Dokumen UAT Sign-Off', detail: 'Sajikan ringkasan Pass/Fail Rate dan daftar Known Issues ber-Severity minor sebelum persetujuan rilis produksi.' }
        ]
      }
    },

    qam21: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Inspeksi Chrome DevTools)',
        goal: 'Membuka Chrome DevTools untuk membaca Status Code & Payload pada 1 request login.',
        steps: [
          { title: 'Buka DevTools (F12 / Ctrl+Shift+I)', detail: 'Pindah ke Tab Network lalu centang "Preserve log" dan "Disable cache".' },
          { title: 'Filter Fetch/XHR', detail: 'Klik tombol filter "Fetch/XHR" agar hanya request API yang tampil (bebas noise gambar/CSS).' },
          { title: 'Periksa Headers, Payload & Response', detail: 'Lakukan aksi login di halaman; klik request /login untuk mengecek Status (200/401) dan isi JSON.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Console Error & Storage Audit)',
        goal: 'Mengorelasikan error HTTP 500 di Network dengan stack trace di Console dan token di Application.',
        steps: [
          { title: 'Audit Tab Console', detail: 'Pastikan nol error merah (Uncaught TypeError / ReferenceError) saat berpindah halaman dan mengirim form.' },
          { title: 'Verifikasi Tab Application', detail: 'Periksa LocalStorage, SessionStorage, dan Cookies: pastikan JWT token tersimpan pasca-login dan hilang saat Logout.' },
          { title: 'Reproduksi via Copy as cURL', detail: 'Klik kanan request gagal di Network -> Copy -> Copy as cURL untuk dikirim ke developer.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Throttling & HAR Forensics)',
        goal: 'Menemukan race condition pada Slow 3G dan mengekspor bukti jaringan .har.',
        steps: [
          { title: 'Simulasikan Slow 3G / Offline', detail: 'Ubah preset Network dari "No throttling" menjadi "Slow 3G", lalu klik Submit form 2x untuk menguji double-submit.' },
          { title: 'Uji Negative Status Codes', detail: 'Modifikasi payload via DevTools Replay/cURL untuk memastikan input cacat menghasilkan 400/422, bukan crash 500.' },
          { title: 'Ekspor HAR Trace', detail: 'Klik kanan daftar Network -> Save all as HAR with content dan lampirkan ke Jira Bug Report.' }
        ]
      }
    },

    qam22: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Request GET Pertama di Postman)',
        goal: 'Memanggil API publik ReqRes.in dan menulis assertion status 200.',
        steps: [
          { title: 'Buat Collection & Request Baru', detail: 'Buat request GET ke https://reqres.in/api/users/2 di Postman.' },
          { title: 'Kirim Request (Send)', detail: 'Verifikasi status 200 OK dan amati struktur JSON { data: { id, email, first_name } }.' },
          { title: 'Tulis 1 Post-Response Assertion', detail: 'Buka tab Scripts -> Post-response lalu tulis pm.test("Status 200", () => pm.response.to.have.status(200));' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Environment Variables & Schema Check)',
        goal: 'Memakai variabel {{base_url}} serta memvalidasi responseTime dan tipe data JSON.',
        steps: [
          { title: 'Buat Environment "Practice ReqRes"', detail: 'Tambahkan variabel base_url = https://reqres.in dan gunakan sebagai {{base_url}}/api/users/2.' },
          { title: 'Tambahkan Latency & Type Assertions', detail: 'Validasi pm.expect(pm.response.responseTime).to.be.below(500) serta tipe properti data.email bertipe string.' },
          { title: 'Uji Negative Login (HTTP 400)', detail: 'Kirim POST {{base_url}}/api/login hanya dengan email tanpa password, pastikan status === 400 dan ada key "error".' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Auth Chaining di Restful-Booker & Newman)',
        goal: 'Merangkai POST /auth -> simpan token -> PUT /booking/:id -> jalankan lewat Newman CLI.',
        steps: [
          { title: 'Chaining Auth Token', detail: 'Panggil POST https://restful-booker.herokuapp.com/auth, simpan pm.response.json().token ke collectionVariables.' },
          { title: 'Uji CRUD & Proteksi 403', detail: 'Kirim PUT /booking/1 tanpa Cookie token (wajib 403 Forbidden), lalu ulangi dengan Cookie token={{token}} (wajib 200 OK).' },
          { title: 'Jalankan via Newman CLI', detail: 'Ekspor collection & environment JSON, lalu eksekusi `newman run ... --reporters cli,junit` di terminal/CI.' }
        ]
      }
    },

    qam23: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Setup Playwright & Tes Login Pertama)',
        goal: 'Menginisialisasi proyek Playwright dan menjalankan 1 skrip login ke SauceDemo.',
        steps: [
          { title: 'Inisialisasi Proyek Node + Playwright', detail: 'Jalankan perintah setup di folder kosong proyek baru.', cmd: 'npm init playwright@latest' },
          { title: 'Jalankan Contoh Tes Bawaan', detail: 'Verifikasi instalasi browser Chromium berhasil berjalan.', cmd: 'npx playwright test' },
          { title: 'Buat Tes Login SauceDemo Dasar', detail: 'Gunakan page.goto("https://www.saucedemo.com/"), fill standard_user & secret_sauce, lalu klik Login.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Page Object Model LoginPage.ts)',
        goal: 'Memisahkan selector UI ke dalam class pages/LoginPage.ts dengan user-facing locators.',
        steps: [
          { title: 'Buat Folder pages/ & File LoginPage.ts', detail: 'Definisikan property readonly Locator memakai getByLabel / getByPlaceholder / getByRole.' },
          { title: 'Buat Method navigate() & login(email, pass)', detail: 'Bungkus aksi goto, fill, dan click dengan kata kunci async/await.' },
          { title: 'Gunakan Web-First Assertions di tests/login.spec.ts', detail: 'Gunakan await expect(page).toHaveURL(/inventory/) dan await expect(locator).toBeVisible() tanpa waitForTimeout.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Data-Driven Negative Matrix & Trace Debug)',
        goal: 'Menguji user valid, locked_out_user, dan problem_user serta membedah hasil lewat Trace Viewer.',
        steps: [
          { title: 'Tambahkan Skenario Negative & Locked User', detail: 'Verifikasi banner error muncul saat login memakai locked_out_user atau password salah.' },
          { title: 'Jalankan Multi-Browser (Desktop + Mobile)', detail: 'Aktifkan project chromium dan Pixel 7 di playwright.config.ts untuk mendeteksi layout terpotong.' },
          { title: 'Inspeksi Kegagalan via Trace Viewer', detail: 'Aktifkan trace: "on-first-retry" dan jalankan `npx playwright show-trace trace.zip` untuk melihat snapshot DOM tiap langkah.' }
        ]
      }
    },

    qam24: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Push Suite ke GitHub & Workflow Dasar)',
        goal: 'Membuat file .github/workflows/playwright.yml agar tes berjalan otomatis saat push.',
        steps: [
          { title: 'Buat Direktori Workflow', detail: 'Buat folder .github/workflows/ di root repositori proyek Playwright Anda.' },
          { title: 'Tambahkan playwright.yml', detail: 'Gunakan actions/checkout@v4, setup-node@v4 (Node 20), npm ci, npx playwright install --with-deps, dan npx playwright test.' },
          { title: 'Push ke GitHub & Cek Tab Actions', detail: 'Jalankan `git push origin main` lalu pantau log eksekusi headless di tab Actions GitHub.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Publish HTML Report Artifact)',
        goal: 'Memastikan laporan visual Playwright selalu dapat diunduh meski ada tes yang gagal.',
        steps: [
          { title: 'Tambahkan Upload Artifact dengan if: always()', detail: 'Konfigurasikan actions/upload-artifact@v4 mengarah ke path playwright-report/ dengan retention-days: 30.' },
          { title: 'Simulasikan 1 Tes Gagal', detail: 'Ubah 1 ekspektasi URL agar gagal, push ke branch PR, dan unduh artifact playwright-report.zip.' },
          { title: 'Uji pada Target Latihan Resmi', detail: 'Arahkan suite ke https://www.saucedemo.com/ dan https://the-internet.herokuapp.com/.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (API Gate + E2E Sharding + Secrets)',
        goal: 'Meningkatkan pipeline menjadi multi-job paralel dengan Newman & Playwright Sharding.',
        steps: [
          { title: 'Pisahkan Job api-tests (Newman) & e2e-tests', detail: 'Set `needs: api-tests` pada job E2E agar browser test tidak membuang waktu bila API rusak.' },
          { title: 'Aktifkan Matrix Sharding', detail: 'Gunakan `shardIndex: [1, 2]` dan `--shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}` untuk memotong waktu CI hingga 50%.' },
          { title: 'Gunakan GitHub Secrets', detail: 'Simpan BASE_URL dan API_TOKEN staging di Repository Secrets agar tidak pernah terekspos di file YAML.' }
        ]
      }
    }
  };

  function generateDynamicGuide(module) {
    const mode = module.mode || 'fullstack';
    const lang = module.code?.language || 'code';
    const firstConcept = module.concepts?.[0]?.[0] || 'Konsep Inti';
    const secondConcept = module.concepts?.[1]?.[0] || 'Validasi & Edge Cases';
    const firstPractice = module.practices?.[0] || 'Terapkan validasi input & error handling aman.';
    const secondPractice = module.practices?.[1] || 'Uji skenario gagal dan batas kapasitas.';
    const exTask = module.exercise?.task || module.exercise?.scenario || (typeof module.exercise === 'string' ? module.exercise : `Implementasikan ${module.title} secara mandiri.`);

    if (mode === 'sa') {
      return {
        simple: {
          title: 'Level 1 — Implementasi Sederhana (Baseline Arsitektur)',
          goal: `Membangun prototipe fungsional ${firstConcept} pada skala trafik normal.`,
          steps: [
            { title: 'Definisikan Kontrak & Komponen Awal', detail: `Petakan komponen utama untuk "${module.title}" dan siapkan alur request dasar tanpa optimasi kompleks terlebih dahulu.` },
            { title: 'Terapkan Spesimen Dasar', detail: `Implementasikan contoh inti (${lang}) di lingkungan lokal/staging dan verifikasi skenario sukses (happy path).` },
            { title: 'Amati Perilaku di Simulator 3D (Mode Unhandled)', detail: 'Buka tab "04. Kode & Visual" -> aktifkan mode Unhandled dan naikkan slider RPS untuk melihat di titik mana bottleneck mulai muncul.' }
          ]
        },
        intermediate: {
          title: 'Level 2 — Implementasi Menengah (Handling Bottleneck & Trade-Off)',
          goal: `Mengatasi keterbatasan baseline dengan menerapkan ${secondConcept}.`,
          steps: [
            { title: 'Identifikasi Bottleneck & SPOF', detail: `Ukur titik jenuh kapasitas (IOPS, thread pool, atau network hop) dan terapkan: ${firstPractice}` },
            { title: 'Terapkan Mekanisme Perlindungan', detail: `Aktifkan mode "Best Practice (Handled)" pada Simulator 3D untuk membandingkan perbedaan antrean fisik dan latensi P99.` },
            { title: 'Verifikasi Trade-Off', detail: module.compare ? module.compare.slice(0, 180) + (module.compare.length > 180 ? '…' : '') : 'Catat konsekuensi operasional dari pola baru yang diterapkan.' }
          ]
        },
        pro: {
          title: 'Level 3 — Implementasi Profesional (Production Resilience & SLA)',
          goal: 'Memvalidasi ketahanan sistem terhadap kegagalan parsial, lonjakan ekstrem, dan observabilitas.',
          steps: [
            { title: 'Terapkan Standar Produksi', detail: `${secondPractice} Pastikan batas timeout menyusut (cascading timeout) dan idempotency terjaga.` },
            { title: 'Siapkan Observabilitas & Alerting SLO', detail: 'Tambahkan propagasi Trace-ID, metrik P95/P99 (RED Method), dan alarm pelanggaran SLA.' },
            { title: 'Uji Skenario Tantangan Nyata', detail: exTask }
          ]
        }
      };
    }

    if (mode === 'qa') {
      return {
        simple: {
          title: 'Level 1 — Implementasi Sederhana (Manual & Verifikasi Dasar)',
          goal: `Mempraktikkan dasar ${firstConcept} secara langsung pada aplikasi target.`,
          steps: [
            { title: 'Siapkan Skenario Happy & Negative Path', detail: `Susun minimal 2 test case (1 positif, 1 negatif batas tepi) untuk topik "${module.title}".` },
            { title: 'Jalankan Eksekusi Awal', detail: `Gunakan spesimen (${lang}) sebagai kerangka dasar dan jalankan pengujian untuk memverifikasi hasil awal.` },
            { title: 'Catat Bukti Eksekusi', detail: 'Simpan tangkapan layar, status HTTP, atau output terminal sebagai dokumentasi.' }
          ]
        },
        intermediate: {
          title: 'Level 2 — Implementasi Menengah (Otomasi & Validasi Menyeluruh)',
          goal: `Meningkatkan cakupan dengan ${secondConcept} serta assertions deterministik.`,
          steps: [
            { title: 'Tambahkan Assertions & Edge Cases', detail: firstPractice },
            { title: 'Hilangkan Ketergantungan Rapuh', detail: secondPractice },
            { title: 'Integrasikan Data / Query Audit', detail: 'Pastikan hasil tes UI/API terkonfirmasi di layer data atau network trace.' }
          ]
        },
        pro: {
          title: 'Level 3 — Implementasi Profesional (Quality Gate & CI/CD Ready)',
          goal: 'Mengemas skrip menjadi bagian Quality Gate otomatis yang stabil dan siap portofolio.',
          steps: [
            { title: 'Jalankan dalam Mode Headless / CI', detail: 'Pastikan skrip berjalan deterministik secara paralel tanpa sleep statis dan menghasilkan laporan JUnit/HTML.' },
            { title: 'Terapkan Fault / Load Profiling', detail: 'Verifikasi perilaku saat terjadi error 503, Slow 3G, atau beban tinggi.' },
            { title: 'Selesaikan Tantangan Praktik', detail: exTask }
          ]
        }
      };
    }

    // Fullstack Mode 3-Tier Guide
    return {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Setup & Happy Path)',
        goal: `Membuat implementasi dasar ${firstConcept} yang berjalan bersih di lokal.`,
        steps: [
          { title: 'Siapkan Struktur File & Dependensi', detail: `Buat file latihan di proyek lokalmu sesuai bahasa (${lang}) untuk topik "${module.title}".` },
          { title: 'Tulis Implementasi Inti', detail: `Ketik ulang (jangan hanya copy-paste) contoh spesimen pada Langkah 04 dan jalankan di terminal/browser.` },
          { title: 'Uji Kasus Normal (Happy Path)', detail: 'Pastikan input valid memberikan output dan status respons sesuai spesifikasi.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Validasi, Error Handling & Clean Code)',
        goal: `Memisahkan tanggung jawab kode dan menangani input tidak valid (${secondConcept}).`,
        steps: [
          { title: 'Tambahkan Validasi & Batas Tanggung Jawab', detail: firstPractice },
          { title: 'Tangani Error & Edge Cases', detail: `${secondPractice} Pastikan sistem mengembalikan pesan error terstruktur tanpa crash.` },
          { title: 'Refaktor Menjadi Modular', detail: 'Pisahkan konfigurasi, logika bisnis/service, dan handler agar mudah diuji secara terisolasi.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Keamanan, Konkurensi & Production Test)',
        goal: 'Mengamankan fitur dari race condition, celah otorisasi, dan memverifikasinya dengan automated test.',
        steps: [
          { title: 'Audit Keamanan & Performansi', detail: 'Periksa celah otorisasi, timeout jaringan, idempotency, dan query database agar siap melayani trafik nyata.' },
          { title: 'Tulis Automated Test (Unit / Integration)', detail: 'Buat minimal 1 tes otomatis untuk kasus sukses dan 1 tes untuk kasus gagal/konkuren.' },
          { title: 'Selesaikan Tantangan Implementasi', detail: exTask }
        ]
      }
    };
  }

  function getImplementationGuide(module) {
    if (!module) return null;
    return BESPOKE_GUIDES[module.id] || generateDynamicGuide(module);
  }

  // --- Interactive Code Implementation Challenges (Direct Test Runner!) ---

  const BESPOKE_TESTS = {
    qam22: {
      simple: {
        title: 'Uji Sederhana: Tulis Postman Assertion Status 200 & Response Time < 500ms',
        description: 'Lengkapi fungsi pengujian Postman di bawah ini. Kode Anda akan DIEKSEKUSI NYATA terhadap mock respons HTTP 200 (180ms)!',
        language: 'javascript',
        starterCode: `// Mock response: status = 200, responseTime = 180ms
pm.test("Status code is 200 OK", function () {
  // TODO: Validasi status code harus 200
  pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
  // TODO: Validasi pm.response.responseTime di bawah 500
  
});`,
        solutionCode: `pm.test("Status code is 200 OK", function () {
  pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(500);
});`,
        run(code) {
          const harness = `
            const __tests = [];
            const pm = {
              response: {
                code: 200,
                responseTime: 180,
                json: () => ({ status: "success", data: { id: 2, email: "janet@reqres.in" } }),
                to: { have: { status: (expected) => { if (200 !== expected) throw new Error("Expected status " + expected); } } }
              },
              expect: (val) => ({
                to: {
                  be: {
                    below: (limit) => { if (!(val < limit)) throw new Error(val + " is not below " + limit); },
                    a: (t) => { if (typeof val !== t) throw new Error("Expected type " + t); }
                  },
                  have: {
                    property: (k, v) => {
                      if (!(k in val)) throw new Error("Missing property " + k);
                      if (v !== undefined && val[k] !== v) throw new Error("Expected " + k + "=" + v);
                    }
                  }
                }
              }),
              test: (name, cb) => {
                try { cb(); __tests.push({ name, ok: true }); }
                catch (e) { __tests.push({ name, ok: false, err: e.message }); }
              }
            };
            function __verify() { return __tests; }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks JavaScript Valid', hint: `Error: ${exec.error}` }];
          const ran = exec.result || [];
          return [
            { pass: ran.length >= 2, label: `Minimal 2 blok pm.test() dijalankan (terdeteksi: ${ran.length})`, hint: 'Pastikan ada 2 panggilan pm.test(...).' },
            { pass: ran.some(t => t.ok && /200/i.test(t.name)), label: 'Test Status 200 OK lolos eksekusi nyata', hint: 'Panggil pm.response.to.have.status(200).' },
            { pass: /responseTime/.test(code) && /below\s*\(\s*500\s*\)/.test(code) && ran.every(t => t.ok), label: 'Test Response Time < 500ms lolos eksekusi nyata', hint: 'Gunakan pm.expect(pm.response.responseTime).to.be.below(500);' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Validasi Kontrak JSON (status, id, email string)',
        description: 'Uji struktur & tipe data JSON respons ReqRes (`{ status: "success", data: { id: 2, email: "janet@reqres.in" } }`).',
        language: 'javascript',
        starterCode: `pm.test("Validate User Profile Data Structure", function () {
  const jsonData = pm.response.json();
  // TODO 1: Pastikan jsonData memiliki properti "status" bernilai "success"
  // TODO 2: Pastikan jsonData.data memiliki properti "id"
  // TODO 3: Pastikan jsonData.data.email bertipe "string"
  
});`,
        solutionCode: `pm.test("Validate User Profile Data Structure", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("status", "success");
  pm.expect(jsonData.data).to.have.property("id");
  pm.expect(jsonData.data.email).to.be.a("string");
});`,
        run(code) {
          return checkPatterns(code, [
            { regex: /pm\.response\.json\(\)/, label: 'Mengurai JSON body dengan pm.response.json()', hint: 'Panggil pm.response.json()' },
            { regex: /have\.property\(\s*['"]status['"]\s*,\s*['"]success['"]\s*\)/, label: 'Validasi status === "success"', hint: 'pm.expect(jsonData).to.have.property("status", "success")' },
            { regex: /have\.property\(\s*['"]id['"]\s*\)/, label: 'Validasi properti data.id tersedia', hint: 'pm.expect(jsonData.data).to.have.property("id")' },
            { regex: /to\.be\.a\(\s*['"]string['"]\s*\)/, label: 'Validasi tipe data email adalah string', hint: 'pm.expect(jsonData.data.email).to.be.a("string")' }
          ]);
        }
      }
    },

    qam23: {
      simple: {
        title: 'Uji Sederhana: Buat Locator User-Facing di LoginPage.ts',
        description: 'Lengkapi constructor Page Object Model menggunakan hierarki selektor resmi Playwright (`getByLabel` & `getByRole`), tanpa XPath/waitForTimeout.',
        language: 'typescript',
        starterCode: `export class LoginPage {
  constructor(page: Page) {
    this.page = page;
    // TODO: Isi dengan getByLabel dan getByRole
    this.emailInput = page.getByLabel('Email Address');
    this.passwordInput = /* lengkapi getByLabel('Password') */;
    this.loginButton = /* lengkapi getByRole('button', { name: 'Sign In' }) */;
  }
}`,
        solutionCode: `export class LoginPage {
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email Address');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
  }
}`,
        run(code) {
          return checkPatterns(code, [
            { regex: /getByLabel\(\s*['"]Email Address['"]\s*\)/, label: 'Email input memakai getByLabel("Email Address")', hint: 'Gunakan page.getByLabel("Email Address")' },
            { regex: /getByLabel\(\s*['"]Password['"]\s*\)/, label: 'Password input memakai getByLabel("Password")', hint: 'Gunakan page.getByLabel("Password")' },
            { regex: /getByRole\(\s*['"]button['"]\s*,\s*\{\s*name:\s*['"]Sign In['"]\s*\}\s*\)/, label: 'Tombol memakai getByRole("button", { name: "Sign In" })', hint: 'Gunakan page.getByRole("button", { name: "Sign In" })' },
            { fn: s => !/waitForTimeout|\/html\/body/.test(s), label: 'Bebas anti-pattern waitForTimeout & XPath absolut', hint: 'Hapus waitForTimeout atau XPath absolut.' }
          ]);
        }
      },
      pro: {
        title: 'Uji Profesional: Async Login Method & Web-First Assertions',
        description: 'Tulis method `async login(email, pass)` lengkap dengan `await` dan Web-First Assertion `toHaveURL` + `toBeVisible`.',
        language: 'typescript',
        starterCode: `async login(email: string, pass: string) {
  // TODO: fill email & password, lalu click tombol login dengan await
}

// Di tests/login.spec.ts:
await loginPage.login('standard_user', 'secret_sauce');
// TODO: Web-First Assertions ke /dashboard dan teks 'Welcome Back'`,
        solutionCode: `async login(email: string, pass: string) {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(pass);
  await this.loginButton.click();
}

await loginPage.login('standard_user', 'secret_sauce');
await expect(page).toHaveURL('/dashboard');
await expect(page.getByText('Welcome Back')).toBeVisible();`,
        run(code) {
          return checkPatterns(code, [
            { regex: /await\s+this\.emailInput\.fill\(/, label: 'Mengisi email memakai await fill()', hint: 'Tambahkan await this.emailInput.fill(email);' },
            { regex: /await\s+this\.passwordInput\.fill\(/, label: 'Mengisi password memakai await fill()', hint: 'Tambahkan await this.passwordInput.fill(pass);' },
            { regex: /await\s+this\.loginButton\.click\(/, label: 'Menekan tombol memakai await click()', hint: 'Tambahkan await this.loginButton.click();' },
            { regex: /await\s+expect\(page\)\.toHaveURL\(/, label: 'Web-First Assertion toHaveURL memakai await', hint: 'Tambahkan await expect(page).toHaveURL("/dashboard");' },
            { regex: /toBeVisible\(\)/, label: 'Memverifikasi elemen dashboard terlihat (toBeVisible)', hint: 'Tambahkan await expect(page.getByText("Welcome Back")).toBeVisible();' }
          ]);
        }
      }
    },

    qam05: {
      simple: {
        title: 'Uji Sederhana: Query SQL Cek Pesanan Paid & Join Users',
        description: 'Tulis query SQL untuk mengambil transaksi berstatus `PAID` yang digabung dengan tabel `users` dan diurutkan terbaru.',
        language: 'sql',
        starterCode: `SELECT o.id, o.grand_total, u.email
FROM orders o
-- TODO: JOIN tabel users, filter status = 'PAID', dan urutkan created_at DESC`,
        solutionCode: `SELECT o.id, o.grand_total, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'PAID'
ORDER BY o.created_at DESC;`,
        run(code) {
          return checkPatterns(code, [
            { regex: /JOIN\s+users/i, label: 'Melakukan JOIN ke tabel users', hint: 'Tambahkan JOIN users u ON o.user_id = u.id' },
            { regex: /WHERE\s+.*status\s*=\s*['"]PAID['"]/i, label: 'Memfilter status PAID dengan WHERE', hint: "Tambahkan WHERE o.status = 'PAID'" },
            { regex: /ORDER\s+BY\s+.*created_at\s+DESC/i, label: 'Mengurutkan terbaru (ORDER BY created_at DESC)', hint: 'Tambahkan ORDER BY o.created_at DESC' }
          ]);
        }
      },
      pro: {
        title: 'Uji Profesional: Deteksi Duplikasi Idempotency & Orphan Records',
        description: 'Tulis query SQL forensik untuk mendeteksi double-payment (`COUNT(*) > 1`) dan `order_items` tanpa induk `orders`.',
        language: 'sql',
        starterCode: `-- 1. Cek duplikasi idempotency_key di tabel payments
SELECT idempotency_key, COUNT(*) AS total_rows
FROM payments
-- TODO: GROUP BY dan HAVING COUNT(*) > 1

-- 2. Cek orphan order_items
SELECT oi.id FROM order_items oi
-- TODO: LEFT JOIN orders lalu WHERE o.id IS NULL`,
        solutionCode: `SELECT idempotency_key, COUNT(*) AS total_rows
FROM payments
GROUP BY idempotency_key
HAVING COUNT(*) > 1;

SELECT oi.id FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.id IS NULL;`,
        run(code) {
          return checkPatterns(code, [
            { regex: /GROUP\s+BY\s+idempotency_key/i, label: 'Mengelompokkan berdasarkan idempotency_key', hint: 'Tambahkan GROUP BY idempotency_key' },
            { regex: /HAVING\s+COUNT\(\*\)\s*>\s*1/i, label: 'Menyaring duplikasi dengan HAVING COUNT(*) > 1', hint: 'Tambahkan HAVING COUNT(*) > 1' },
            { regex: /LEFT\s+JOIN\s+orders/i, label: 'Memakai LEFT JOIN orders untuk mendeteksi orphan', hint: 'Gunakan LEFT JOIN orders o ON oi.order_id = o.id' },
            { regex: /WHERE\s+o\.id\s+IS\s+NULL/i, label: 'Memfilter baris yatim dengan WHERE o.id IS NULL', hint: 'Tambahkan WHERE o.id IS NULL' }
          ]);
        }
      }
    },

    qam15: {
      simple: {
        title: 'Uji Sederhana: Pisahkan Fase Read & Write (Hentikan Layout Thrashing)',
        description: 'Ubah loop di bawah agar membaca semua `offsetHeight` terlebih dahulu sebelum menulis `style.minHeight`.',
        language: 'javascript',
        starterCode: `function fixLayoutThrashing(cards) {
  // TODO 1: Baca seluruh card.offsetHeight ke dalam array 'heights'
  // TODO 2: Tulis card.style.minHeight = heights[i] + 10 + 'px' di loop terpisah
  
}`,
        solutionCode: `function fixLayoutThrashing(cards) {
  const heights = Array.from(cards).map((card) => card.offsetHeight);
  cards.forEach((card, i) => {
    card.style.minHeight = heights[i] + 10 + 'px';
  });
}`,
        run(code) {
          const harness = `
            let reads = 0, writes = 0, interleaved = false, wrote = false;
            const fakeCards = [100, 120].map(h => ({
              get offsetHeight() { if (wrote) interleaved = true; reads++; return h; },
              style: { set minHeight(v) { wrote = true; writes++; this._h = v; } }
            }));
            function __verify() {
              if (typeof fixLayoutThrashing !== 'function') throw new Error('Fungsi fixLayoutThrashing tidak ditemukan');
              fixLayoutThrashing(fakeCards);
              return { reads, writes, interleaved, out0: fakeCards[0].style._h };
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks JavaScript Valid', hint: exec.error }];
          const r = exec.result;
          return [
            { pass: r.reads === 2 && r.writes === 2, label: 'Membaca & menulis seluruh kartu (2 read, 2 write)', hint: 'Pastikan semua card diproses.' },
            { pass: !r.interleaved, label: 'Fase BACA & TULIS terpisah (0 Layout Thrashing saat runtime!)', hint: 'Baca semua offsetHeight dulu sebelum menulis card.style.minHeight.' },
            { pass: r.out0 === '110px', label: 'Hasil tinggi benar: 100 -> "110px"', hint: 'Set minHeight menjadi heights[i] + 10 + "px".' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Tulis Cooperative Yield Helper `yieldToMain()`',
        description: 'Implementasikan fungsi `yieldToMain()` yang memakai `scheduler.yield()` bila tersedia dan fallback ke `setTimeout(..., 0)` dalam Promise.',
        language: 'javascript',
        starterCode: `function yieldToMain() {
  // TODO: Cek 'scheduler' in window && 'yield' in window.scheduler
  // Jika tidak ada, kembalikan Promise dengan setTimeout(resolve, 0)
}`,
        solutionCode: `function yieldToMain() {
  if ('scheduler' in window && 'yield' in window.scheduler) {
    return window.scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}`,
        run(code) {
          return checkPatterns(code, [
            { regex: /scheduler\.yield\(/, label: 'Mengutamakan API modern scheduler.yield()', hint: 'Cek dan panggil window.scheduler.yield().' },
            { regex: /new\s+Promise\(/, label: 'Mengembalikan Promise sebagai fallback universal', hint: 'Kembalikan new Promise((resolve) => setTimeout(resolve, 0)).' },
            { regex: /setTimeout\(\s*resolve\s*,\s*0\s*\)/, label: 'Memberi jeda ke Main Thread via setTimeout(resolve, 0)', hint: 'Gunakan setTimeout(resolve, 0).' }
          ]);
        }
      }
    },

    sam13: {
      simple: {
        title: 'Uji Sederhana: Cascading Timeout Budget & Load Shedding Guard',
        description: 'Implementasikan fungsi `shouldShedLoad(cpuPercent, isCriticalEndpoint)` yang menolak endpoint non-kritis saat CPU > 85%.',
        language: 'javascript',
        starterCode: `function shouldShedLoad(cpuPercent, isCriticalEndpoint) {
  // TODO: Kembalikan true jika cpuPercent > 85 dan BUKAN isCriticalEndpoint
  
}`,
        solutionCode: `function shouldShedLoad(cpuPercent, isCriticalEndpoint) {
  return cpuPercent > 85 && !isCriticalEndpoint;
}`,
        run(code) {
          const harness = `
            function __verify() {
              if (typeof shouldShedLoad !== 'function') throw new Error('Fungsi tidak ditemukan');
              return {
                shedNonCrit: shouldShedLoad(90, false),
                keepCrit: shouldShedLoad(90, true),
                keepNormal: shouldShedLoad(60, false)
              };
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks Valid', hint: exec.error }];
          const r = exec.result;
          return [
            { pass: r.shedNonCrit === true, label: 'Menolak request non-kritis (analitik) saat CPU 90%', hint: 'Harus return true saat cpuPercent > 85 && !isCriticalEndpoint' },
            { pass: r.keepCrit === false, label: 'Melindungi request kritis (checkout) meski CPU 90%', hint: 'Jangan tolak jika isCriticalEndpoint === true' },
            { pass: r.keepNormal === false, label: 'Melayani semua request saat CPU normal (60%)', hint: 'Return false saat cpuPercent <= 85' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Rumus Exponential Backoff + Full Jitter',
        description: 'Implementasikan `computeBackoffDelay(attempt, baseMs, capMs)` sesuai rumus: `random(0, min(capMs, baseMs * 2^attempt))`.',
        language: 'javascript',
        starterCode: `function computeBackoffDelay(attempt, baseMs = 100, capMs = 5000) {
  // TODO: Hitung batas atas exp = Math.min(capMs, baseMs * Math.pow(2, attempt))
  // Kembalikan bilangan acak antara 0 hingga exp
  
}`,
        solutionCode: `function computeBackoffDelay(attempt, baseMs = 100, capMs = 5000) {
  const exp = Math.min(capMs, baseMs * Math.pow(2, attempt));
  return Math.floor(Math.random() * exp);
}`,
        run(code) {
          const harness = `
            function __verify() {
              if (typeof computeBackoffDelay !== 'function') throw new Error('Fungsi tidak ditemukan');
              const samples = Array.from({ length: 15 }, () => computeBackoffDelay(3, 100, 5000));
              const capped = Array.from({ length: 10 }, () => computeBackoffDelay(10, 100, 2000));
              return {
                allValidBounds: samples.every(v => typeof v === 'number' && v >= 0 && v <= 800),
                respectsCap: capped.every(v => v >= 0 && v <= 2000),
                hasJitter: new Set(samples).size > 1
              };
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks Valid', hint: exec.error }];
          const r = exec.result;
          return [
            { pass: r.allValidBounds, label: 'Attempt 3 (100*2^3=800ms) berada di rentang 0..800ms', hint: 'Gunakan Math.min(capMs, baseMs * Math.pow(2, attempt)).' },
            { pass: r.respectsCap, label: 'Mematuhi batas atas capMs (2000ms) pada attempt tinggi', hint: 'Pastikan Math.min membatasi nilai dengan capMs.' },
            { pass: r.hasJitter, label: 'Menghasilkan variasi acak (Full Jitter) mencegah Retry Storm', hint: 'Kalikan dengan Math.random().' }
          ];
        }
      }
    },

    sam12: {
      simple: {
        title: 'Uji Sederhana: Hitung Estimasi Peak QPS Kapasitas Sistem',
        description: 'Tulis fungsi `estimateQPS(dau, reqPerUserPerDay, peakMultiplier)` sesuai rumus Back-of-the-Envelope `(DAU * req) / 86400`.',
        language: 'javascript',
        starterCode: `function estimateQPS(dau, reqPerUserPerDay, peakMultiplier = 3) {
  // TODO: Hitung avgQps dan peakQps = avgQps * peakMultiplier
  // Kembalikan object { avgQps, peakQps } (dibulatkan Math.round)
  
}`,
        solutionCode: `function estimateQPS(dau, reqPerUserPerDay, peakMultiplier = 3) {
  const avgQps = Math.round((dau * reqPerUserPerDay) / 86400);
  const peakQps = Math.round(avgQps * peakMultiplier);
  return { avgQps, peakQps };
}`,
        run(code) {
          const harness = `
            function __verify() {
              if (typeof estimateQPS !== 'function') throw new Error('Fungsi tidak ditemukan');
              return estimateQPS(864000, 10, 4);
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks Valid', hint: exec.error }];
          const r = exec.result || {};
          return [
            { pass: r.avgQps === 100, label: 'Average QPS untuk 864k DAU x 10 req/hari = 100 QPS', hint: 'Bagi dengan 86400 detik.' },
            { pass: r.peakQps === 400, label: 'Peak QPS (4x) = 400 QPS', hint: 'Kalikan avgQps dengan peakMultiplier.' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Redis Atomic Lua Script Anti-Overselling',
        description: 'Lengkapi Lua script agar menolak jika `current_stock < qty` dan mengurangi stok secara atomik dengan `DECRBY` + `EX` 300s.',
        language: 'lua',
        starterCode: `local current_stock = tonumber(redis.call("GET", KEYS[1]) or "0")
local qty = tonumber(ARGV[1])

-- TODO 1: Jika current_stock < qty maka return 0
-- TODO 2: Kurangi stok dengan redis.call("DECRBY", KEYS[1], qty)
-- TODO 3: Simpan hold di KEYS[2] dengan EX 300 detik`,
        solutionCode: `local current_stock = tonumber(redis.call("GET", KEYS[1]) or "0")
local qty = tonumber(ARGV[1])

if current_stock < qty then
  return 0
end

redis.call("DECRBY", KEYS[1], qty)
redis.call("SET", KEYS[2], qty, "EX", tonumber(ARGV[2] or 300))
return 1`,
        run(code) {
          return checkPatterns(code, [
            { regex: /if\s+current_stock\s*<\s*qty\s+then/i, label: 'Validasi atomik current_stock < qty', hint: 'Tambahkan if current_stock < qty then return 0 end' },
            { regex: /redis\.call\(\s*["']DECRBY["']/i, label: 'Mengurangi stok secara atomik via DECRBY', hint: 'Panggil redis.call("DECRBY", KEYS[1], qty)' },
            { regex: /redis\.call\(\s*["']SET["'][\s\S]*["']EX["']/i, label: 'Mengunci hold sementara dengan TTL (EX)', hint: 'Panggil redis.call("SET", KEYS[2], qty, "EX", 300)' }
          ]);
        }
      }
    }
  };

  function generateFallbackTests(module) {
    const lang = (module.code?.language || 'javascript').toLowerCase();
    const rawCode = String(module.code?.content || '');
    const title = module.title || 'Modul Ini';

    // Pick 2-3 meaningful structural tokens from the module's own code specimen!
    const tokens = [...new Set(
      (rawCode.match(/\b[A-Za-z_][A-Za-z0-9_]{3,}\b/g) || [])
        .filter(t => !['const', 'return', 'function', 'import', 'export', 'from', 'true', 'false', 'null', 'this', 'await', 'async'].includes(t))
    )].slice(0, 4);

    const snippetLines = rawCode.split('\n').filter(Boolean);
    const partialStarter = snippetLines.slice(0, Math.max(2, Math.floor(snippetLines.length / 2))).join('\n')
      + `\n// TODO: Lengkapi implementasi "${title}" sesuai spesimen & best practice`;

    return {
      simple: {
        title: `Uji Sederhana: Praktik Struktur Dasar (${lang.toUpperCase()})`,
        description: `Lengkapi potongan kode dasar di bawah untuk mempraktikkan inti dari "${title}".`,
        language: lang,
        starterCode: partialStarter,
        solutionCode: rawCode,
        run(code) {
          const baseChecks = [
            { fn: s => s.trim().length > 20 && !/^\/\/\s*TODO.*$/m.test(s.trim()), label: 'Implementasi kode sudah diisi lengkap', hint: 'Tulis kode implementasi di bawah komentar TODO.' }
          ];
          if (tokens[0]) {
            baseChecks.push({ fn: s => s.includes(tokens[0]), label: `Menggunakan elemen/simbol kunci "${tokens[0]}"`, hint: `Lihat Langkah 04 Kode & Visual: sertakan "${tokens[0]}".` });
          }
          if (tokens[1]) {
            baseChecks.push({ fn: s => s.includes(tokens[1]), label: `Menyertakan konfigurasi/logika "${tokens[1]}"`, hint: `Pastikan "${tokens[1]}" diterapkan dengan benar.` });
          }
          return checkPatterns(code, baseChecks);
        }
      },
      pro: {
        title: `Uji Profesional: Penanganan Error, Keamanan & Standar Produksi`,
        description: `Terapkan minimal 1 guard best practice (${module.practices?.[0] || 'validasi/error handling'}) ke dalam implementasi Anda.`,
        language: lang,
        starterCode: rawCode + `\n\n// TODO Profesional: Tambahkan guard / assertion / komentar verifikasi edge-case sesuai standar produksi`,
        solutionCode: rawCode + `\n// Verified: ${(module.practices || ['Error handling, boundary validation, and clean architecture applied']).join(' | ')}`,
        run(code) {
          return checkPatterns(code, [
            { fn: s => s.trim().length >= Math.min(40, rawCode.length), label: 'Kode lengkap memenuhi struktur dasar spesimen', hint: 'Pertahankan seluruh bagian inti kode spesimen.' },
            { fn: s => !/TODO Profesional/i.test(s) || s.length > rawCode.length + 110, label: 'Telah menambahkan guard / pengujian / penanganan edge-case', hint: 'Hapus TODO dan tambahkan validasi/penanganan kasus gagal nyata.' },
            { fn: s => tokens.slice(0, 2).every(t => s.includes(t)), label: `Konsisten mempertahankan kontrak (${tokens.slice(0, 2).join(', ') || 'inti'})`, hint: 'Jangan menghapus simbol kunci dari implementasi utama.' }
          ]);
        }
      }
    };
  }

  function getImplementationTests(module) {
    if (!module) return null;
    return BESPOKE_TESTS[module.id] || generateFallbackTests(module);
  }

  window.academyLabs = {
    getImplementationGuide,
    getImplementationTests
  };
})(window);
