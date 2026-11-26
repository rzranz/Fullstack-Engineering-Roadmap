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
    qam13: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Audit Urutan Kausal & Network TTFB)',
        goal: 'Mengecek Waiting for server response (TTFB) di DevTools Network sebelum mengoprek aset frontend.',
        steps: [
          { title: 'Buka DevTools Network (Disable Cache)', detail: 'Filter ke "Doc" lalu klik request dokumen HTML pertama yang dimuat.' },
          { title: 'Periksa Sub-Tab Timing: Waiting for server response', detail: 'Bandingkan dengan standar Good (<= 800 ms), Needs Improvement (800 ms – 1.8 s), dan Poor (> 1.8 s).' },
          { title: 'Deteksi Redirect Chain', detail: 'Pastikan tidak ada pengalihan berlapis (http -> https -> www) yang membuang round-trip TCP/TLS.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (CDN Edge Caching & Redis/Query)',
        goal: 'Menekan TTFB merah melalui layer infrastruktur, database, dan caching—bukan CSS/JS.',
        steps: [
          { title: 'Aktifkan Full-Page / Edge Caching CDN', detail: 'Konfigurasikan header `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` di Cloudflare untuk halaman publik.' },
          { title: 'Basmi N+1 Query & Cold Start Serverless', detail: 'Tambahkan indexing DB, ubah lazy loop query menjadi eager loading, dan cache hasil query berat di Redis/Memcached.' },
          { title: 'Aktifkan HTTP/2 atau HTTP/3 QUIC', detail: 'Pastikan lokasi PoP CDN atau region server berada dekat dengan mayoritas user target.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (CrUX 28-Day Triage: TTFB → CLS → LCP → INP)',
        goal: 'Menyusun rencana aksi berbasis CrUX Field Data dan urutan prioritas eksekusi yang tepat.',
        steps: [
          { title: 'Gunakan CrUX Field Data 28 Hari (Bukan Obsesi Skor 100 Lighthouse)', detail: 'Audit metrik p75 dari device & koneksi asli user di PageSpeed Insights bagian Field Data.' },
          { title: 'Urutkan Perbaikan Secara Kausal', detail: 'Eksekusi berurutan: 1. Perbaiki TTFB -> 2. Bereskan CLS (low effort, high impact) -> 3. Optimasi LCP -> 4. Bedah INP.' },
          { title: 'Validasi Penurunan LCP Otomatis Pasca-TTFB', detail: 'Ukur ulang LCP setelah TTFB < 800 ms untuk membuktikan perbaikan backend langsung membuka jalan bagi render LCP.' }
        ]
      }
    },

    qam14: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Hapus Lazy-Load Hero & Tambah fetchpriority)',
        goal: 'Memastikan gambar LCP above-the-fold langsung diprioritaskan oleh browser.',
        steps: [
          { title: 'Audit Tag <img> Hero Image', detail: 'Pastikan tidak ada atribut `loading="lazy"` pada gambar banner/hero di viewport pertama.' },
          { title: 'Tambahkan `fetchpriority="high"`', detail: 'Berikan sinyal prioritas bandwidth tertinggi ke parser HTML.' },
          { title: 'Beri Atribut `defer` pada Script Non-Kritis', detail: 'Tambahkan `defer` atau `async` pada script analytics/widget di `<head>` agar tidak memblokir render DOM.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (WebP/AVIF + Responsive srcset + Preload)',
        goal: 'Mengirim ukuran gambar tepat untuk mobile/desktop dan menyingkat Resource Load Delay.',
        steps: [
          { title: 'Konversi Hero Image ke WebP atau AVIF', detail: 'Pangkas bobot aset banner secara drastis tanpa mengorbankan ketajaman visual.' },
          { title: 'Terapkan Responsive Images (`srcset` & `sizes`)', detail: 'Sediakan varian `640w` dan `1200w` agar perangkat mobile tidak mengunduh gambar desktop besar.' },
          { title: 'Tambahkan `<link rel="preload" as="image" fetchpriority="high">` + Critical CSS', detail: 'Inline CSS kritis dan preload gambar hero bila direferensikan lewat CSS/JS.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Verifikasi Performance Insights DevTools)',
        goal: 'Memastikan fase LCP discovery terjadi seawal mungkin tanpa menunggu JavaScript selesai.',
        steps: [
          { title: 'Jalankan Performance Insights (Slow 4G & 4x CPU)', detail: 'Rekam initial load lalu buka panel Insights -> LCP by phase.' },
          { title: 'Verifikasi LCP Discovery Time', detail: 'Pastikan request gambar hero sudah muncul tepat di awal waterfall HTML tanpa menunggu bundle JS.' },
          { title: 'Validasi Target p75 <= 2.5 Detik', detail: 'Konfirmasi penurunan durasi dari 4.6s ke <= 2.5s (ideal ~1.4s).' }
        ]
      }
    },

    qam16: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Kunci Dimensi Media & Skeleton)',
        goal: 'Menghentikan loncatan visual akibat gambar/iframe dan konten dinamis (low effort, high impact).',
        steps: [
          { title: 'Tambahkan `width` & `height` pada Semua Media', detail: 'Isi dimensi eksplisit atau CSS `aspect-ratio` pada seluruh `<img>`, `<video>`, dan `<iframe>`.' },
          { title: 'Berikan `min-height` & `contain: layout` pada Slot Dinamis', detail: 'Siapkan skeleton placeholder dengan tinggi tetap untuk banner/iklan/API embed.' },
          { title: 'Cek Layout Shift Regions di DevTools', detail: 'Aktifkan menu Rendering -> Layout Shift Regions dan muat ulang halaman; pastikan nol kotak biru berkedip.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Anti FOUT/FOIT & Animasi Compositor)',
        goal: 'Menghilangkan pergeseran teks dari web font dan reflow akibat animasi CSS.',
        steps: [
          { title: 'Tambahkan `font-display: swap;` pada `@font-face`', detail: 'Tampilkan teks segera memakai fallback font sistem yang proporsinya mirip.' },
          { title: 'Ganti Animasi `top/left/width/height` ke `transform` & `opacity`', detail: 'Pastikan seluruh animasi toast, modal, dan banner berjalan di compositor thread tanpa reflow.' },
          { title: 'Uji pada Throttling Slow 3G', detail: 'Verifikasi tidak ada pergeseran tombol "Simpan/Hapus" saat respons API banner datang terlambat.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Quality Gate CLS <= 0.1 di Pipeline)',
        goal: 'Menjaga skor CLS produksi tetap <= 0.10 pada seluruh resolusi desktop dan mobile.',
        steps: [
          { title: 'Pasang Assertion CLS <= 0.1 di Playwright/k6/browser', detail: 'Tambahkan threshold otomatis `browser_web_vital_cls: ["p(95)<0.1"]` di suite performa.' },
          { title: 'Audit Komponen Iklan & Widget Pihak Ketiga', detail: 'Bungkus setiap slot widget eksternal dalam container berdimensi tetap.' },
          { title: 'Monitor CrUX CLS 28 Hari Pasca-Rilis', detail: 'Pastikan p75 CLS bertahan di zona hijau (<= 0.1).' }
        ]
      }
    },

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
    },

    qam25: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Audit BVA & Viewport 375px)',
        goal: 'Memeriksa batas nilai klinis Vitals (50/120, -5 kg) dan tata letak mobile 375x812 di OpenMRS.',
        steps: [
          { title: 'Buat Pasien Uji Terdedikasi', detail: 'Gunakan identitas uji seperti Randi QA_Test GITS_Patient (10001X1) agar data pengujian mudah dilacak.' },
          { title: 'Uji BVA & Cross-Field Vitals', detail: 'Masukkan BP 50 / 120 (Systolic < Diastolic) dan berat -5 kg; catat jika backend gagal mengembalikan HTTP 400 per-field.' },
          { title: 'Cek Responsiveness 1440x900 vs 375x812', detail: 'Resize DevTools ke 375x812 untuk memastikan sidebar Registration tidak memotong form dan floating button `?` tidak menutupi `Check In`/`Options`.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (XSS Double Encoding & Rumus COUNTIF)',
        goal: 'Mengaudit siklus Create → Read → Update XSS serta menyusun tab Summary Google Sheets.',
        steps: [
          { title: 'Uji Siklus Penuh Double HTML Encoding', detail: 'Simpan `<b>Test</b>`, buka kembali form Edit, lalu Save ulang untuk mendeteksi `&lt;b&gt;` berubah menjadi `&amp;lt;`.' },
          { title: 'Tambahkan Rumus COUNTIF di Google Sheets', detail: 'Hitung otomatis Total TC (`COUNTA`), `Pass`, `Fail`, `[PENDING_MANUAL_VERIFICATION]`, serta `High`/`Medium`/`Low` Severity.' },
          { title: 'Lindungi Pass Rate dengan IFERROR', detail: 'Pakai `=IFERROR(COUNTIF(...,"Pass")/(Pass+Fail), 0)` agar dashboard tetap bersih meski Fail + Pass masih nol.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Audit CSV Python + Paket Manual Evidence)',
        goal: 'Mengaudit 65 Test Cases & 11 Bug Reports secara otomatis memakai Python 3.12 sebelum build ZIP.',
        steps: [
          { title: 'Verifikasi Jumlah Baris CSV via Python csv.DictReader', detail: 'Jalankan inline script Python untuk memeriksa distribusi Status dan Severity sebelum impor ke Google Sheets.', cmd: 'python -c "import csv,collections; ..."' },
          { title: 'Kaitkan 15 Screenshot Bukti Bernomor', detail: 'Simpan seluruh screenshot PNG di folder `evidence/` dan pastikan ID bug merujuk tepat ke nama file buktinya.' },
          { title: 'Kemas Deliverable Manual Bersih', detail: 'Gabungkan `OpenMRS_Test_Cases.csv`, `OpenMRS_Bug_Reports.csv`, `README_Manual.md`, dan `evidence/` ke `GITS-QA-Manual.zip`.' }
        ]
      }
    },

    qam26: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (RestAssured GET Single User)',
        goal: 'Mengirim `GET /api/users/2` ke `reqres.in` dengan header `x-api-key` dan memverifikasi status 200.',
        steps: [
          { title: 'Set Base URI & API Key di @BeforeClass', detail: 'Konfigurasikan `RestAssured.baseURI = "https://reqres.in"` dan baca key lewat `System.getProperty`.' },
          { title: 'Panggil `.given().header("x-api-key", API_KEY).get("/api/users/2")`', detail: 'Tambahkan `.log().all().extract().response()` agar payload tampil di log TestNG.' },
          { title: 'Verifikasi `statusCode() == 200` & `data.id == "2"`', detail: 'Gunakan `Assert.assertEquals(response.jsonPath().getString("data.id"), "2")`.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Negative Login 400 & Maven Jackson)',
        goal: 'Mengirim JSON Map body untuk kasus negatif `POST /api/login` tanpa error serializer.',
        steps: [
          { title: 'Pastikan `jackson-databind` Terpasang di `pom.xml`', detail: 'Mencegah `IllegalStateException (no JSON serializer)` saat meneruskan `Collections.singletonMap` ke `.body(...)`.' },
          { title: 'Kirim `POST /api/login` Hanya dengan Email', detail: 'Set `.contentType(ContentType.JSON)` dengan body `Collections.singletonMap("email", "peter@klaven")`.' },
          { title: 'Validasi HTTP 400 & Error Message', detail: 'Pastikan `statusCode() == 400` dan JSON `error` bernilai `"Missing password"`.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Dependency Hygiene & Eksekusi Terisolasi)',
        goal: 'Menjaga stabilitas classpath POI + Log4j2 dan menjalankan suite API secara independen.',
        steps: [
          { title: 'Selaraskan `log4j-api` & `log4j-core` ke `2.24.1`', detail: 'Menghindari konflik `NoSuchMethodError` ketika Apache POI `5.3.0` dan RestAssured hidup berdampingan dalam satu `pom.xml`.' },
          { title: 'Catat Status & Body di TestNG Reporter', detail: 'Panggil `Reporter.log(..., true)` agar muncul di CLI sekaligus di `emailable-report.html`.' },
          { title: 'Eksekusi Cepat Suite API Saja', detail: 'Jalankan Maven test filter `-Dtest=ReqResApiTest` sebelum masuk ke suite UI Selenium.', cmd: 'mvn test -Dtest=ReqResApiTest' }
        ]
      }
    },

    qam27: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Page Object OpenMrsLoginPage)',
        goal: 'Memisahkan locator Legacy UI `/openmrs/` ke dalam class Page Object dengan explicit wait.',
        steps: [
          { title: 'Konfirmasi Target DOM (`/openmrs/` vs `/`)', detail: 'Pastikan `BASE_URL = "https://o3.openmrs.org/openmrs/"` (Legacy 1-step form) sesuai locator `#username`, `#password`, `#sessionLocation`.' },
          { title: 'Tunggu Input Username & `OWASP-CSRFTOKEN`', detail: 'Di `open()`, wajib jalankan `wait.until(presenceOfElementLocated(By.name("OWASP-CSRFTOKEN")))` agar tidak terkena race condition CSRFGuard.' },
          { title: 'Implementasikan `login(...)` & `getErrorMessageText()`', detail: 'Gunakan `#openmrs_error` untuk skenario gagal dan `LOGOUT_LINK` + `ul.navList` untuk validasi dashboard.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Excel DDT via Apache POI & Screenshot)',
        goal: 'Menggabungkan hardcoded test, invalid login, dan TestNG `@DataProvider` dari `testdata.xlsx`.',
        steps: [
          { title: 'Buat `@DataProvider(name = "loginData")`', detail: 'Hubungkan ke `ExcelUtils.readSheetData("testdata.xlsx", "LoginData")` untuk memasok `username`, `password`, dan `location`.' },
          { title: 'Tangkap Screenshot PNG Sukses', detail: 'Buat helper `captureScreenshot` memakai `((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES)` ke folder `screenshots/`.' },
          { title: 'Jalankan 3 Skenario Berurutan (`priority = 1..3`)', detail: 'Verifikasi invalid login error case-insensitive, login hardcoded valid (`Scenario2`), dan Excel DDT (`Scenario3`).' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Chrome Port 9223 + CDP Window Recovery)',
        goal: 'Menstabilkan eksekusi di balik Cloudflare tanpa bypass CAPTCHA serta mencegah kegagalan window ter-minimize.',
        steps: [
          { title: 'Luncurkan Chrome Debug Port 9223 (Bebas Konflik `[::1]`)', detail: 'Gunakan user-data-dir khusus dan biarkan user menyelesaikan Cloudflare sekali secara sah, login, lalu log out.', cmd: 'chrome.exe --remote-debugging-port=9223 --user-data-dir="%TEMP%\\chrome-qa-debug" "https://o3.openmrs.org/openmrs/"' },
          { title: 'Pulihkan Jendela Ter-Minimize lewat CDP', detail: 'Di `@BeforeMethod`, panggil `Page.bringToFront`, `Browser.getWindowForTarget`, dan `Browser.setWindowBounds` (`normal`, `1440x900`).' },
          { title: 'Pertahankan Cookie `cf_clearance` dengan `logoutIfLoggedIn()`', detail: 'Jangan panggil `driver.quit()` saat menempel ke debug port 9223; reset sesi via logout lalu jalankan full Maven suite 5/5.', cmd: 'mvn clean test "-Dchrome.debuggerAddress=127.0.0.1:9223"' }
        ]
      }
    },

    qam28: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Audit Cepat via Lighthouse CLI)',
        goal: 'Menghasilkan laporan HTML Core Web Vitals lengkap menggunakan Node/npx tanpa instalasi global tambahan.',
        steps: [
          { title: 'Set `$env:CHROME_PATH` & Node Path', detail: 'Arahkan ke binary Chrome lokal (`C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`).' },
          { title: 'Jalankan `npx --yes lighthouse`', detail: 'Gunakan flag `--only-categories=performance --output=html --chrome-flags="--headless=new"`.', cmd: 'npx.cmd --yes lighthouse "https://o3.openmrs.org/openmrs/spa/login" --only-categories=performance --output=html' },
          { title: 'Inspeksi TTFB, LCP, FCP, TBT & CLS', detail: 'Buka HTML report dengan `Start-Process` lalu identifikasi apakah TBT (>200 ms) menandakan risiko INP lambat.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Script `k6/browser` Web Vitals)',
        goal: 'Mengukur metrik browser riil (`LCP`, `INP`, `CLS`, `TTFB`) terautomasi dengan `k6 v2.4.0`.',
        steps: [
          { title: 'Set `$env:K6_BROWSER_EXECUTABLE_PATH` di PowerShell', detail: 'Wajib menunjuk ke `chrome.exe` lokal agar `k6/browser` dapat meluncurkan Chromium.' },
          { title: 'Konfigurasikan Skenario `browser: { type: "chromium" }`', detail: 'Gunakan `shared-iterations` (1–10 VUs, bukan 1.000 VUs!) agar RAM laptop tetap aman.' },
          { title: 'Pasang Thresholds Google Good (p95)', detail: 'Tetapkan batas `lcp<2500`, `inp<200`, `cls<0.1`, dan `ttfb<800`, serta lakukan aksi `.click()` supaya INP terekam.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Korelasi Backend TTFB vs Frontend INP/TBT)',
        goal: 'Menggabungkan bukti protokol `k6` (`http_req_waiting`) dengan audit browser DevTools/Lighthouse.',
        steps: [
          { title: 'Bandingkan `http_req_waiting` API vs TTFB Browser', detail: 'Verifikasi bahwa backend CDN cepat (`avg 229 ms`) tidak otomatis menjamin UI bebas lag bila JS main thread terblokir.' },
          { title: 'Korelasikan Bug Vitals OpenMRS ke Long Task (INP)', detail: 'Tangkap Long Tasks >50 ms pada form input berat (seperti gejala hilangnya digit awal saat ketik cepat) memakai Performance panel.' },
          { title: 'Kelola Limitasi Headless terhadap Anti-Bot Cloudflare', detail: 'Pisahkan benchmark frontend untuk origin staging bebas WAF vs origin publik ber-Cloudflare agar hasil lab tetap reprodusibel.' }
        ]
      }
    },

    qam29: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Smoke Run 10 VU Selama 5 Detik)',
        goal: 'Memverifikasi kebenaran skrip `performance-test.js` tanpa menimpa laporan resmi.',
        steps: [
          { title: 'Pindah ke Root Workspace Proyek QA', detail: 'Arahkan direktori kerja ke `Test-GITS-QA-Randi Zakaria Putra`.' },
          { title: 'Jalankan Flag CLI Override (`--vus 10 --duration 5s`)', detail: 'Uji cepat koneksi dan `check()` GET/POST tanpa menyentuh file `summary-result.json`.', cmd: 'k6 run --vus 10 --duration 5s "3. Performance Testing/src/performance-test.js"' },
          { title: 'Periksa Lulusnya `check()` Awal', detail: 'Pastikan GET /posts/1 mengembalikan status 200 & POST /posts mengembalikan status 201.' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Custom `Trend` GET vs POST & Aman JSON)',
        goal: 'Mengisolasi waktu eksekusi endpoint baca (cached) vs tulis (uncached) dan menjaga parser tetap aman.',
        steps: [
          { title: 'Deklarasikan `new Trend(..., true)` & `new Rate(...)`', detail: 'Pisahkan `get_req_duration` / `get_req_failed` dan `post_req_duration` / `post_req_failed` di level global modul.' },
          { title: 'Bungkus `r.json()` dalam `try/catch`', detail: 'Cegah crash skrip k6 bila server membalas HTML error 502/504 saat lonjakan trafik ekstrem.' },
          { title: 'Verifikasi Payload Echo POST', detail: 'Cek tidak hanya status 201, tapi juga kesamaan `title`, `body`, `userId`, dan eksistensi `id` baru.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Isolasi 500 vs 1.000 VU & Ekspor JSON)',
        goal: 'Mengeksekusi ramp 4m 30s (134,896 reqs) serta mengekspor JSON summary + log terminal resmi.',
        steps: [
          { title: 'Gunakan `exec.scenario.startTime` pada `recordPhaseMetrics`', detail: 'Kelompokkan metrik <= 120.000 ms ke `phase_500vu_duration` dan <= 240.000 ms ke `phase_1000vu_duration` untuk melihat kenaikan +20.77% p95.' },
          { title: 'Eksekusi Penuh dengan `--summary-export` + `Tee-Object`', detail: 'Simpan `summary-result.json` dan `execution-log.txt` sekaligus untuk pelaporan akurat.', cmd: 'k6 run --summary-export="3. Performance Testing/src/summary-result.json" "3. Performance Testing/src/performance-test.js" 2>&1 | Tee-Object -FilePath "3. Performance Testing/src/execution-log.txt"' },
          { title: 'Analisis Bottleneck (`http_req_waiting` 99.81%)', detail: 'Audit perbandingan GET (`137.90 ms` Cloudflare HIT) vs POST (`321.08 ms`) guna menyusun rekomendasi caching & scaling backend.' }
        ]
      }
    },

    qam30: {
      simple: {
        title: 'Level 1 — Implementasi Sederhana (Aktivasi ENV Terminal Sekali Copy)',
        goal: 'Menyiapkan JDK 17, Maven 3.9.16, k6, Node, dan Python pada terminal PowerShell mana pun.',
        steps: [
          { title: 'Set `$env:JAVA_HOME` ke Temurin JDK 17', detail: 'Tunjuk eksak `C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.21.9-hotspot`.' },
          { title: 'Prepend Maven, Java, k6 & Node ke `$env:Path`', detail: 'Agar perintah berjalan langsung di terminal lama yang belum di-restart.' },
          { title: 'Jalankan Cek Versi 4 Binary', detail: 'Verifikasi output tidak error sebelum mengeksekusi suite.', cmd: 'java -version; mvn -version; k6 version; python --version' }
        ]
      },
      intermediate: {
        title: 'Level 2 — Implementasi Menengah (Kumpulkan Artefak & Verifikasi Visual)',
        goal: 'Menyalin laporan HTML & kedua screenshot login keluar folder proyek serta mengeceknya langsung.',
        steps: [
          { title: 'Salin `emailable-report.html` & Kedua Screenshot PNG', detail: 'Gunakan `Copy-Item ... -Force` dari `target/surefire-reports` dan `screenshots/` menuju root `2. Automation Testing`.' },
          { title: 'Buka Report HTML & PNG Lewat `Start-Process`', detail: 'Validasi visual `emailable-report.html`, `surefire-reports/index.html`, dan kedua PNG login tampak jelas.' },
          { title: 'Verifikasi Log k6 & CSV Audit', detail: 'Baca 45 baris akhir `execution-log.txt` (`Get-Content ... -Tail 45`) untuk memastikan SLA lulus 100%.' }
        ]
      },
      pro: {
        title: 'Level 3 — Implementasi Profesional (Rebuild 3 Clean ZIPs & Upload Drive)',
        goal: 'Mengemas arsip pengumpulan bebas sampah `target/` dan menempatkan file tepat pada 3 folder Drive.',
        steps: [
          { title: 'Jalankan Skrip Python `zipfile.ZIP_DEFLATED`', detail: 'Bangun `GITS-QA-Manual.zip`, `GITS-QA-Automation.zip` (hanya `pom.xml`, `README.md`, `src/`), dan `GITS-QA-Performance.zip`.' },
          { title: 'Upload ke 3 Subfolder Google Drive Terpisah', detail: 'Isi folder `Manual Testing`, `Automation Testing`, dan `Performance Testing` sesuai checklist artefak masing-masing.' },
          { title: 'Pisahkan Dokumentasi Pribadi di Root', detail: 'Simpan `qa-test-runner-cheatsheet.html` dan `QA_Prompt_Engineering_Playbook.md` hanya di workspace pribadi.' }
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

    qam13: {
      simple: {
        title: 'Uji Sederhana: Penentu Urutan Prioritas Core Web Vitals (Causal Order)',
        description: 'Tulis fungsi JS `prioritizeCwvAudit({ ttfb, lcp, inp, cls })` yang mengembalikan array urutan perbaikan berdasarkan metrik yang melampaui batas Good (`ttfb>800`, `cls>0.1`, `lcp>2500`, `inp>200`) sesuai aturan kausal: `["TTFB", "CLS", "LCP", "INP"]`.',
        language: 'javascript',
        starterCode: `function prioritizeCwvAudit({ ttfb, lcp, inp, cls }) {
  // TODO: Kembalikan daftar metrik bermasalah dalam urutan prioritas: TTFB -> CLS -> LCP -> INP
  
}`,
        solutionCode: `function prioritizeCwvAudit({ ttfb, lcp, inp, cls }) {
  const plan = [];
  if (ttfb > 800) plan.push('TTFB');
  if (cls > 0.1) plan.push('CLS');
  if (lcp > 2500) plan.push('LCP');
  if (inp > 200) plan.push('INP');
  return plan;
}`,
        run(code) {
          const harness = `
            function __verify() {
              if (typeof prioritizeCwvAudit !== 'function') throw new Error('Fungsi prioritizeCwvAudit tidak ditemukan');
              return {
                allBad: prioritizeCwvAudit({ ttfb: 2100, cls: 0.28, lcp: 4300, inp: 420 }),
                onlyInp: prioritizeCwvAudit({ ttfb: 320, cls: 0.02, lcp: 1600, inp: 380 })
              };
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks Valid', hint: exec.error }];
          const r = exec.result || {};
          return [
            { pass: JSON.stringify(r.allBad) === '["TTFB","CLS","LCP","INP"]', label: 'Urutan kausal tepat: TTFB -> CLS -> LCP -> INP saat semua metrik merah', hint: 'Cek urutan kondisi: ttfb > 800, cls > 0.1, lcp > 2500, inp > 200.' },
            { pass: JSON.stringify(r.onlyInp) === '["INP"]', label: 'Hanya membedah INP jika TTFB/CLS/LCP sudah Good', hint: 'Jangan masukkan metrik yang sudah memenuhi ambang Good.' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Konfigurasi Header Edge Caching CDN Anti-TTFB Merah',
        description: 'Tulis respons HTTP header untuk HTML publik agar CDN Cloudflare melakukan edge caching dengan `s-maxage` + `stale-while-revalidate` pada HTTP/2 atau HTTP/3.',
        language: 'http',
        starterCode: `HTTP/2 200 OK
Content-Type: text/html; charset=utf-8
# TODO: Tambahkan Cache-Control s-maxage & stale-while-revalidate`,
        solutionCode: `HTTP/2 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
Alt-Svc: h3=":443"; ma=86400`,
        run(code) {
          return checkPatterns(code, [
            { regex: /Cache-Control:\s*public/i, label: 'Mengizinkan public CDN edge caching', hint: 'Tambahkan Cache-Control: public, ...' },
            { regex: /s-maxage=\d+/i, label: 'Mengatur TTL cache CDN via s-maxage', hint: 'Sertakan s-maxage=3600.' },
            { regex: /stale-while-revalidate=\d+/i, label: 'Menambahkan stale-while-revalidate agar respons tetap instan', hint: 'Tambahkan stale-while-revalidate=86400.' }
          ]);
        }
      }
    },

    qam14: {
      simple: {
        title: 'Uji Sederhana: Perbaiki Tag `<img>` Hero Banner LCP',
        description: 'Ubah markup hero image di bawah agar bebas `loading="lazy"`, memakai format `.avif`/`.webp`, `fetchpriority="high"`, dan `srcset` responsif.',
        language: 'html',
        starterCode: `<img src="/images/banner-utama.jpg" loading="lazy" alt="Promo Utama" />`,
        solutionCode: `<img src="/images/banner-utama.webp" srcset="/images/banner-640.avif 640w, /images/banner-1200.avif 1200w" sizes="(max-width: 768px) 100vw, 1200px" width="1200" height="600" fetchpriority="high" decoding="async" alt="Promo Utama" />`,
        run(code) {
          return checkPatterns(code, [
            { fn: s => !/loading\s*=\s*["']lazy["']/i.test(s), label: 'Tidak memakai loading="lazy" pada elemen LCP', hint: 'Hapus atribut loading="lazy" dari hero image.' },
            { regex: /fetchpriority\s*=\s*["']high["']/i, label: 'Menambahkan fetchpriority="high"', hint: 'Tambahkan fetchpriority="high".' },
            { regex: /srcset\s*=/i, label: 'Menyediakan responsive images via srcset', hint: 'Tambahkan atribut srcset="..." untuk varian lebar layar.' },
            { regex: /\.(avif|webp)/i, label: 'Memakai format gambar modern AVIF/WebP', hint: 'Gunakan ekstensi .avif atau .webp.' }
          ]);
        }
      },
      pro: {
        title: 'Uji Profesional: `<head>` Anti Render-Blocking + Preload LCP',
        description: 'Susun `<link rel="preload" as="image" fetchpriority="high">` dan muat script analitik non-kritis memakai `defer` atau `async`.',
        language: 'html',
        starterCode: `<head>
  <!-- TODO: Preload banner AVIF dan tambah defer pada analytics.js -->
  <script src="/assets/analytics-heavy.js"></script>
</head>`,
        solutionCode: `<head>
  <link rel="preload" as="image" href="/images/banner-utama.avif" fetchpriority="high" />
  <script src="/assets/analytics-heavy.js" defer></script>
</head>`,
        run(code) {
          return checkPatterns(code, [
            { regex: /<link[^>]+rel=["']preload["'][^>]+as=["']image["']/i, label: 'Preload gambar LCP seawal mungkin di <head>', hint: 'Tambahkan <link rel="preload" as="image" href="...">.' },
            { regex: /fetchpriority=["']high["']/i, label: 'Prioritas tinggi pada tag preload', hint: 'Sertakan fetchpriority="high".' },
            { regex: /<script[^>]+(defer|async)/i, label: 'Menghapus render-blocking script dengan defer/async', hint: 'Tambahkan defer atau async pada tag <script>.' }
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

    qam16: {
      simple: {
        title: 'Uji Sederhana: Kunci Slot Dinamis & Dimensi Gambar Anti-CLS',
        description: 'Tulis CSS untuk `#top-promo-slot` (`min-height`) dan `.product-img` (`aspect-ratio`) agar elemen halaman tidak melompat saat konten API/gambar dimuat.',
        language: 'css',
        starterCode: `#top-promo-slot {
  /* TODO: Reservasi tinggi tetap dengan min-height */
}
.product-img {
  width: 100%;
  /* TODO: Kunci aspect-ratio 4 / 3 */
}`,
        solutionCode: `#top-promo-slot {
  min-height: 48px;
  contain: layout;
}
.product-img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}`,
        run(code) {
          return checkPatterns(code, [
            { regex: /min-height\s*:\s*\d+px/i, label: 'Mereservasi tinggi slot dinamis dengan min-height', hint: 'Tambahkan min-height: 48px; pada #top-promo-slot.' },
            { regex: /aspect-ratio\s*:\s*4\s*\/\s*3/i, label: 'Mengunci proporsi media dengan aspect-ratio', hint: 'Tambahkan aspect-ratio: 4 / 3; pada .product-img.' }
          ]);
        }
      },
      pro: {
        title: 'Uji Profesional: `@font-face` (`font-display: swap`) & Animasi Tanpa Reflow',
        description: 'Lengkapi CSS anti-FOUT/FOIT (`font-display: swap`) dan perbaiki animasi `.toast-enter` agar hanya memakai `transform` dan `opacity` (bukan `top`/`left`/`width`/`height`).',
        language: 'css',
        starterCode: `@font-face {
  font-family: 'BrandSans';
  src: url('/fonts/brand.woff2') format('woff2');
  /* TODO 1: Tambahkan font-display: swap; */
}
.toast-enter {
  /* TODO 2: Animasikan hanya transform dan opacity */
}`,
        solutionCode: `@font-face {
  font-family: 'BrandSans';
  src: url('/fonts/brand.woff2') format('woff2');
  font-display: swap;
}
.toast-enter {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.2s ease, opacity 0.2s ease;
}`,
        run(code) {
          return checkPatterns(code, [
            { regex: /font-display\s*:\s*swap/i, label: 'Menggunakan font-display: swap mencegah FOIT/FOUT berat', hint: 'Tambahkan font-display: swap; di dalam @font-face.' },
            { regex: /transform\s*:/i, label: 'Menggunakan transform untuk pergerakan visual', hint: 'Gunakan transform alih-alih top/left.' },
            { regex: /opacity\s*:/i, label: 'Menggunakan opacity untuk efek kemunculan', hint: 'Sertakan opacity: 1; dan transisi opacity.' },
            { fn: s => !/(^|[\s{;])(top|left)\s*:/im.test(s), label: 'Tidak memakai properti pemicu layout shift (top/left)', hint: 'Hapus top/left dan ganti dengan transform.' }
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
    },

    qam25: {
      simple: {
        title: 'Uji Sederhana: Validator Cross-Field Tekanan Darah (BVA Klinis)',
        description: 'Tulis fungsi JS `validateVitals(systolic, diastolic, weightKg)` yang menolak berat <= 0 atau Systolic <= Diastolic.',
        language: 'javascript',
        starterCode: `function validateVitals(systolic, diastolic, weightKg) {
  // TODO: Kembalikan true jika weightKg > 0 dan systolic > diastolic, selain itu false
  
}`,
        solutionCode: `function validateVitals(systolic, diastolic, weightKg) {
  return typeof systolic === 'number' && typeof diastolic === 'number' && typeof weightKg === 'number'
    && weightKg > 0 && systolic > diastolic;
}`,
        run(code) {
          const harness = `
            function __verify() {
              if (typeof validateVitals !== 'function') throw new Error('Fungsi validateVitals tidak ditemukan');
              return {
                validCase: validateVitals(120, 80, 65),
                badBpCase: validateVitals(50, 120, 65),
                negWeightCase: validateVitals(120, 80, -5)
              };
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks Valid', hint: exec.error }];
          const r = exec.result || {};
          return [
            { pass: r.validCase === true, label: 'Menerima nilai normal (120/80, 65 kg)', hint: 'Kembalikan true saat weightKg > 0 && systolic > diastolic.' },
            { pass: r.badBpCase === false, label: 'Menolak BP 50 / 120 (Systolic <= Diastolic)', hint: 'Periksa syarat systolic > diastolic.' },
            { pass: r.negWeightCase === false, label: 'Menolak berat badan negatif (-5 kg)', hint: 'Periksa syarat weightKg > 0.' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Rumus Google Sheets Pass Rate Anti #DIV/0!',
        description: 'Tulis rumus Google Sheets tab Summary memakai `IFERROR` + `COUNTIF` untuk kolom `OpenMRS_Test_Cases!J2:J` dengan status `"Pass"` dan `"Fail"`.',
        language: 'excel',
        starterCode: `=/* TODO: Tulis rumus Pass Rate aman IFERROR berbasis COUNTIF(OpenMRS_Test_Cases!J2:J, ...) */`,
        solutionCode: `=IFERROR(COUNTIF(OpenMRS_Test_Cases!J2:J,"Pass")/(COUNTIF(OpenMRS_Test_Cases!J2:J,"Pass")+COUNTIF(OpenMRS_Test_Cases!J2:J,"Fail")),0)`,
        run(code) {
          return checkPatterns(code, [
            { regex: /=\s*IFERROR\s*\(/i, label: 'Membungkus rumus dengan IFERROR(..., 0)', hint: 'Awali rumus dengan =IFERROR(... ,0).' },
            { regex: /COUNTIF\(\s*OpenMRS_Test_Cases!J2:J\s*,\s*["']Pass["']\s*\)/i, label: 'Menghitung status "Pass" di OpenMRS_Test_Cases!J2:J', hint: 'Sertakan COUNTIF(OpenMRS_Test_Cases!J2:J,"Pass").' },
            { regex: /COUNTIF\(\s*OpenMRS_Test_Cases!J2:J\s*,\s*["']Fail["']\s*\)/i, label: 'Membagi total eksekusi selesai (Pass + Fail)', hint: 'Jumlahkan Pass + Fail sebagai penyebut (abaikan Pending).' }
          ]);
        }
      }
    },

    qam26: {
      simple: {
        title: 'Uji Sederhana: RestAssured Negative Login Request & Assertion',
        description: 'Lengkapi blok Java RestAssured agar mengirim `POST /api/login` tanpa password dengan header `x-api-key` dan memverifikasi status 400.',
        language: 'java',
        starterCode: `Response response = given()
        .header("x-api-key", API_KEY)
        // TODO 1: Set contentType JSON & body Map email "peter@klaven"
        .when()
        .post("/api/login")
        .then()
        .extract().response();
// TODO 2: Assert statusCode 400 & error "Missing password"`,
        solutionCode: `Response response = given()
        .header("x-api-key", API_KEY)
        .contentType(ContentType.JSON)
        .accept(ContentType.JSON)
        .body(Collections.singletonMap("email", "peter@klaven"))
        .when()
        .post("/api/login")
        .then()
        .extract().response();
Assert.assertEquals(response.statusCode(), 400);
Assert.assertEquals(response.jsonPath().getString("error"), "Missing password");`,
        run(code) {
          return checkPatterns(code, [
            { regex: /contentType\(\s*ContentType\.JSON\s*\)/, label: 'Menyetel ContentType.JSON sebelum kirim body', hint: 'Tambahkan .contentType(ContentType.JSON).' },
            { regex: /Collections\.singletonMap\(\s*"email"/, label: 'Mengirim payload email tanpa field password', hint: 'Gunakan .body(Collections.singletonMap("email", "peter@klaven")).' },
            { regex: /Assert\.assertEquals\([\s\S]*400/, label: 'Memverifikasi status HTTP 400', hint: 'Tambahkan Assert.assertEquals(response.statusCode(), 400).' },
            { regex: /getString\(\s*"error"\s*\)[\s\S]*"Missing password"/, label: 'Memverifikasi pesan error "Missing password"', hint: 'Cek response.jsonPath().getString("error") == "Missing password".' }
          ]);
        }
      },
      pro: {
        title: 'Uji Profesional: Perintah Maven Terisolasi & Dependency Hygiene `pom.xml`',
        description: 'Tulis potongan `pom.xml` / command PowerShell yang memuat `jackson-databind` + keselarasan `log4j-api`/`log4j-core` `2.24.1` dan menjalankan `-Dtest=ReqResApiTest`.',
        language: 'xml',
        starterCode: `<!-- TODO: Deklarasikan artifactId jackson-databind serta log4j-api & log4j-core 2.24.1 -->
<!-- Command run: mvn test -Dtest=... -->`,
        solutionCode: `<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
</dependency>
<dependency>
  <groupId>org.apache.logging.log4j</groupId>
  <artifactId>log4j-api</artifactId>
  <version>2.24.1</version>
</dependency>
<dependency>
  <groupId>org.apache.logging.log4j</groupId>
  <artifactId>log4j-core</artifactId>
  <version>2.24.1</version>
</dependency>
<!-- mvn test -Dtest=ReqResApiTest -->`,
        run(code) {
          return checkPatterns(code, [
            { regex: /jackson-databind/, label: 'Menyertakan jackson-databind agar RestAssured bisa serialize Map/POJO', hint: 'Tambahkan artifactId jackson-databind.' },
            { regex: /log4j-api[\s\S]*2\.24\.1/, label: 'Menyelaraskan versi log4j-api ke 2.24.1', hint: 'Set versi log4j-api ke 2.24.1 untuk POI 5.3.0.' },
            { regex: /log4j-core[\s\S]*2\.24\.1/, label: 'Menyelaraskan versi log4j-core ke 2.24.1', hint: 'Set versi log4j-core ke 2.24.1.' },
            { regex: /-Dtest=ReqResApiTest/, label: 'Menjalankan class ReqResApiTest secara terisolasi', hint: 'Sertakan flag -Dtest=ReqResApiTest.' }
          ]);
        }
      }
    },

    qam27: {
      simple: {
        title: 'Uji Sederhana: Tunggu OWASP-CSRFTOKEN di `OpenMrsLoginPage.open()`',
        description: 'Lengkapi method `open()` Java Selenium 4 agar menavigasi ke `BASE_URL` dan menunggu input username serta token asinkron `OWASP-CSRFTOKEN`.',
        language: 'java',
        starterCode: `public void open() {
    driver.get(BASE_URL);
    // TODO 1: Tunggu visibility USERNAME_INPUT
    // TODO 2: Tunggu presenceOfElementLocated By.name("OWASP-CSRFTOKEN")
}`,
        solutionCode: `public void open() {
    driver.get(BASE_URL);
    wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));
    wait.until(ExpectedConditions.presenceOfElementLocated(By.name("OWASP-CSRFTOKEN")));
}`,
        run(code) {
          return checkPatterns(code, [
            { regex: /driver\.get\(\s*BASE_URL\s*\)/, label: 'Navigasi ke BASE_URL Legacy UI (/openmrs/)', hint: 'Pertahankan driver.get(BASE_URL).' },
            { regex: /visibilityOfElementLocated\(\s*USERNAME_INPUT\s*\)/, label: 'Menunggu visibilityOfElementLocated(USERNAME_INPUT)', hint: 'Gunakan ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT).' },
            { regex: /presenceOfElementLocated\(\s*By\.name\(\s*"OWASP-CSRFTOKEN"\s*\)\s*\)/, label: 'Mengatasi race condition /openmrs/csrfguard lewat explicit wait token', hint: 'Tambahkan wait.until(ExpectedConditions.presenceOfElementLocated(By.name("OWASP-CSRFTOKEN"))).' }
          ]);
        }
      },
      pro: {
        title: 'Uji Profesional: CDP Minimized Window Recovery + Debug Port 9223',
        description: 'Lengkapi pemulihan jendela Chrome ter-minimize memakai `executeCdpCommand` (`Page.bringToFront` & `Browser.setWindowBounds`) serta perlindungan sesi Cloudflare `logoutIfLoggedIn()`.',
        language: 'java',
        starterCode: `ChromeOptions options = new ChromeOptions();
options.setExperimentalOption("debuggerAddress", "127.0.0.1:9223");
ChromeDriver cd = (ChromeDriver) driver;
// TODO 1: Panggil cd.executeCdpCommand("Page.bringToFront", ...)
// TODO 2: Ambil windowId via Browser.getWindowForTarget lalu panggil Browser.setWindowBounds
// TODO 3: Panggil loginPage.logoutIfLoggedIn() alih-alih driver.quit()`,
        solutionCode: `ChromeOptions options = new ChromeOptions();
options.setExperimentalOption("debuggerAddress", "127.0.0.1:9223");
ChromeDriver cd = (ChromeDriver) driver;
cd.executeCdpCommand("Page.bringToFront", java.util.Collections.emptyMap());
java.util.Map<String, Object> winInfo = cd.executeCdpCommand("Browser.getWindowForTarget", java.util.Collections.emptyMap());
cd.executeCdpCommand("Browser.setWindowBounds", java.util.Map.of(
        "windowId", winInfo.get("windowId"),
        "bounds", java.util.Map.of("windowState", "normal", "width", 1440, "height", 900)
));
loginPage.logoutIfLoggedIn();`,
        run(code) {
          return checkPatterns(code, [
            { regex: /127\.0\.0\.1:9223/, label: 'Menempel ke debuggerAddress IPv4 port bebas 9223', hint: 'Gunakan port 9223 untuk menghindari bentrok IPv6 [::1]:9222.' },
            { regex: /Page\.bringToFront/, label: 'Mengaktifkan tab browser ke depan via CDP Page.bringToFront', hint: 'Panggil cd.executeCdpCommand("Page.bringToFront", ...).' },
            { regex: /Browser\.getWindowForTarget[\s\S]*Browser\.setWindowBounds/, label: 'Mengembalikan bounds jendela dari minimize ke 1440x900 normal', hint: 'Gunakan Browser.getWindowForTarget diikuti Browser.setWindowBounds.' },
            { regex: /logoutIfLoggedIn\(\)/, label: 'Mereset sesi tanpa menghapus cookie cf_clearance', hint: 'Panggil loginPage.logoutIfLoggedIn().' }
          ]);
        }
      }
    },

    qam28: {
      simple: {
        title: 'Uji Sederhana: Evaluator Ambang Batas Core Web Vitals',
        description: 'Tulis fungsi JS `classifyVitals({ ttfb, lcp, inp, cls })` yang mengembalikan `"GOOD"` jika `ttfb<=800`, `lcp<=2500`, `inp<=200`, `cls<=0.1`, atau `"NEEDS_WORK"` jika ada yang melampaui.',
        language: 'javascript',
        starterCode: `function classifyVitals({ ttfb, lcp, inp, cls }) {
  // TODO: Kembalikan 'GOOD' bila seluruh metrik memenuhi ambang Google, else 'NEEDS_WORK'
  
}`,
        solutionCode: `function classifyVitals({ ttfb, lcp, inp, cls }) {
  return ttfb <= 800 && lcp <= 2500 && inp <= 200 && cls <= 0.1 ? 'GOOD' : 'NEEDS_WORK';
}`,
        run(code) {
          const harness = `
            function __verify() {
              if (typeof classifyVitals !== 'function') throw new Error('Fungsi classifyVitals tidak ditemukan');
              return {
                okCase: classifyVitals({ ttfb: 415, lcp: 2100, inp: 140, cls: 0.05 }),
                slowInpCase: classifyVitals({ ttfb: 229, lcp: 1800, inp: 350, cls: 0.02 })
              };
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks Valid', hint: exec.error }];
          const r = exec.result || {};
          return [
            { pass: r.okCase === 'GOOD', label: 'Metrik TTFB 415ms / LCP 2100ms / INP 140ms / CLS 0.05 -> GOOD', hint: 'Periksa syarat <= 800, <= 2500, <= 200, <= 0.1.' },
            { pass: r.slowInpCase === 'NEEDS_WORK', label: 'Mendeteksi INP 350ms (> 200ms) -> NEEDS_WORK', hint: 'Meskipun TTFB 229ms Good, INP 350ms wajib flagged.' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Script `k6/browser` + Env Chromium & 4 Thresholds',
        description: 'Tulis konfigurasi `options` untuk `k6/browser` (`chromium`, `browser_web_vital_lcp`, `inp`, `cls`, `ttfb`) beserta env PowerShell `$env:K6_BROWSER_EXECUTABLE_PATH`.',
        language: 'javascript',
        starterCode: `// $env:K6_BROWSER_EXECUTABLE_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
import { browser } from 'k6/browser';
export const options = {
  scenarios: {
    ui_vitals: { executor: 'shared-iterations', vus: 1, iterations: 1, options: { browser: { type: 'chromium' } } }
  },
  thresholds: {
    // TODO: Isi p(95) threshold untuk lcp, inp, cls, dan ttfb
  }
};`,
        solutionCode: `// $env:K6_BROWSER_EXECUTABLE_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
import { browser } from 'k6/browser';
export const options = {
  scenarios: {
    ui_vitals: { executor: 'shared-iterations', vus: 1, iterations: 1, options: { browser: { type: 'chromium' } } }
  },
  thresholds: {
    browser_web_vital_lcp: ['p(95)<2500'],
    browser_web_vital_inp: ['p(95)<200'],
    browser_web_vital_cls: ['p(95)<0.1'],
    browser_web_vital_ttfb: ['p(95)<800']
  }
};`,
        run(code) {
          return checkPatterns(code, [
            { regex: /K6_BROWSER_EXECUTABLE_PATH/, label: 'Menyertakan konfigurasi K6_BROWSER_EXECUTABLE_PATH Windows', hint: 'Dokumentasikan $env:K6_BROWSER_EXECUTABLE_PATH menuju chrome.exe.' },
            { regex: /browser_web_vital_lcp[\s\S]*2500/, label: 'Threshold browser_web_vital_lcp < 2500ms', hint: 'Tambahkan browser_web_vital_lcp: ["p(95)<2500"].' },
            { regex: /browser_web_vital_inp[\s\S]*200/, label: 'Threshold browser_web_vital_inp < 200ms', hint: 'Tambahkan browser_web_vital_inp: ["p(95)<200"].' },
            { regex: /browser_web_vital_cls[\s\S]*0\.1/, label: 'Threshold browser_web_vital_cls < 0.1', hint: 'Tambahkan browser_web_vital_cls: ["p(95)<0.1"].' },
            { regex: /browser_web_vital_ttfb[\s\S]*800/, label: 'Threshold browser_web_vital_ttfb < 800ms', hint: 'Tambahkan browser_web_vital_ttfb: ["p(95)<800"].' }
          ]);
        }
      }
    },

    qam29: {
      simple: {
        title: 'Uji Sederhana: Isolasi Fase 500 VU vs 1.000 VU Berdasarkan `elapsedMs`',
        description: 'Tulis fungsi JS `classifyVuPhase(elapsedMs)` yang mengembalikan `"phase_500vu"` untuk `<= 120000`, `"phase_1000vu"` untuk `<= 240000`, dan `"ramp_down"` selebihnya.',
        language: 'javascript',
        starterCode: `function classifyVuPhase(elapsedMs) {
  // TODO: Kembalikan nama fase yang tepat sesuai timeline k6 (0..120s, 120..240s, >240s)
  
}`,
        solutionCode: `function classifyVuPhase(elapsedMs) {
  if (elapsedMs <= 120000) return 'phase_500vu';
  if (elapsedMs <= 240000) return 'phase_1000vu';
  return 'ramp_down';
}`,
        run(code) {
          const harness = `
            function __verify() {
              if (typeof classifyVuPhase !== 'function') throw new Error('Fungsi classifyVuPhase tidak ditemukan');
              return {
                p500: classifyVuPhase(95000),
                p1000: classifyVuPhase(185000),
                down: classifyVuPhase(255000)
              };
            }
          `;
          const exec = runSandboxedJS(code, harness);
          if (!exec.ok) return [{ pass: false, label: 'Sintaks Valid', hint: exec.error }];
          const r = exec.result || {};
          return [
            { pass: r.p500 === 'phase_500vu', label: '95.000 ms (<= 2m) masuk phase_500vu', hint: 'Gunakan kondisi elapsedMs <= 120000.' },
            { pass: r.p1000 === 'phase_1000vu', label: '185.000 ms (<= 4m) masuk phase_1000vu', hint: 'Gunakan kondisi elapsedMs <= 240000.' },
            { pass: r.down === 'ramp_down', label: '255.000 ms (> 4m) masuk ramp_down', hint: 'Kembalikan "ramp_down" di akhir.' }
          ];
        }
      },
      pro: {
        title: 'Uji Profesional: Custom `Trend`, `exec.scenario.startTime` & Safe JSON Check',
        description: 'Lengkapi deklarasi metrik terpisah GET/POST (`new Trend(..., true)`), `recordPhaseMetrics`, dan pengecekan POST 201 aman `try/catch`.',
        language: 'javascript',
        starterCode: `import { Trend, Rate } from 'k6/metrics';
import exec from 'k6/execution';
// TODO 1: Buat getReqDuration & postReqDuration memakai new Trend(..., true)
// TODO 2: Gunakan Date.now() - exec.scenario.startTime di recordPhaseMetrics
// TODO 3: Bungkus r.json() di dalam try { ... } catch (e) { return false; }`,
        solutionCode: `import { Trend, Rate } from 'k6/metrics';
import exec from 'k6/execution';

const getReqDuration = new Trend('get_req_duration', true);
const postReqDuration = new Trend('post_req_duration', true);

function recordPhaseMetrics(durationMs) {
  const elapsedMs = Date.now() - exec.scenario.startTime;
  return elapsedMs <= 120000 ? '500' : '1000';
}

function safeCheckPost(r) {
  if (r.status !== 201) return false;
  try {
    return r.json().id !== undefined;
  } catch (e) {
    return false;
  }
}`,
        run(code) {
          return checkPatterns(code, [
            { regex: /new\s+Trend\(\s*['"]get_req_duration['"]\s*,\s*true\s*\)/, label: 'Custom Trend get_req_duration bertipe waktu (true)', hint: 'Deklarasikan new Trend("get_req_duration", true).' },
            { regex: /new\s+Trend\(\s*['"]post_req_duration['"]\s*,\s*true\s*\)/, label: 'Custom Trend post_req_duration terpisah dari GET', hint: 'Deklarasikan new Trend("post_req_duration", true).' },
            { regex: /exec\.scenario\.startTime/, label: 'Mengukur elapsed time via exec.scenario.startTime', hint: 'Hitung Date.now() - exec.scenario.startTime.' },
            { regex: /try\s*\{[\s\S]*r\.json\([\s\S]*\}\s*catch/, label: 'Melindungi parsing r.json() dengan blok try/catch', hint: 'Tambahkan try/catch saat parsing respons JSON.' }
          ]);
        }
      }
    },

    qam30: {
      simple: {
        title: 'Uji Sederhana: Aktivasi `$env:JAVA_HOME` & `$env:Path` PowerShell',
        description: 'Susun perintah PowerShell self-contained untuk mengaktifkan JDK 17 Temurin, Maven 3.9.16, k6, dan Node.js tanpa me-restart terminal.',
        language: 'powershell',
        starterCode: `$env:JAVA_HOME = ""
$env:Path = ""
# TODO: Isi path Temurin 17.0.21.9, Maven 3.9.16\\bin, k6, nodejs lalu cek versi`,
        solutionCode: `$env:JAVA_HOME = "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.21.9-hotspot"
$env:Path = "C:\\Users\\HPrannn\\tools\\apache-maven-3.9.16\\bin;$env:JAVA_HOME\\bin;C:\\Program Files\\k6;C:\\Program Files\\nodejs;$env:Path"
java -version
mvn -version
k6 version`,
        run(code) {
          return checkPatterns(code, [
            { regex: /jdk-17\.0\.21\.9-hotspot/, label: 'Menunjuk OpenJDK 17 Temurin (17.0.21.9)', hint: 'Set $env:JAVA_HOME ke folder jdk-17.0.21.9-hotspot.' },
            { regex: /apache-maven-3\.9\.16\\bin/, label: 'Menyertakan Apache Maven 3.9.16\\bin ke Path', hint: 'Tambahkan path apache-maven-3.9.16\\bin ke $env:Path.' },
            { regex: /C:\\Program Files\\k6[\s\S]*\$env:Path/, label: 'Menyertakan k6 & mempertahankan $env:Path eksisting', hint: 'Tambahkan C:\\Program Files\\k6 danakhiri dengan ;$env:Path.' }
          ]);
        }
      },
      pro: {
        title: 'Uji Profesional: Filter `target/` saat Membuat Clean ZIP Python',
        description: 'Tulis logika Python `zipfile.ZipFile` yang mengemas `pom.xml`, `README.md`, dan folder `src/` tanpa memasukkan `target/`, dengan separator slash `/` yang portabel.',
        language: 'python',
        starterCode: `import os, zipfile
# TODO: Buat GITS-QA-Automation.zip dengan ZIP_DEFLATED berisi pom.xml, README.md, dan os.walk('src')`,
        solutionCode: `import os, zipfile
with zipfile.ZipFile('GITS-QA-Automation.zip', 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in ['pom.xml', 'README.md']:
        zf.write(os.path.join(proj, f), f)
    for r, _, files in os.walk(os.path.join(proj, 'src')):
        for fn in files:
            full = os.path.join(r, fn)
            zf.write(full, os.path.relpath(full, proj).replace(os.sep, '/'))`,
        run(code) {
          return checkPatterns(code, [
            { regex: /zipfile\.ZIP_DEFLATED/, label: 'Memakai kompresi ZIP_DEFLATED standar', hint: 'Gunakan zipfile.ZipFile(..., "w", zipfile.ZIP_DEFLATED).' },
            { regex: /pom\.xml[\s\S]*README\.md/, label: 'Menyertakan pom.xml & README.md di root ZIP', hint: 'Masukkan pom.xml dan README.md.' },
            { regex: /os\.walk\([\s\S]*['"]src['"]/, label: 'Hanya menelusuri src/ (mengecualikan target/)', hint: 'Walk ke subfolder src, bukan root proyek.' },
            { regex: /\.replace\(\s*os\.sep\s*,\s*['"]\/['"]\s*\)/, label: 'Normalisasi path slash portabel lintas-OS', hint: 'Tambahkan .replace(os.sep, "/").' }
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
