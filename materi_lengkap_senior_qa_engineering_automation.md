# Master Blueprint: Senior QA Engineering, Web Performance & Test Automation

Dokumen ini merupakan panduan lengkap untuk membangun kompetensi **Senior Quality Assurance (QA) Engineer** dari dasar hingga level produksi. Materi disusun secara berurutan mulai dari pola pikir *Shift-Left*, teknik desain pengujian formal, detail pemeriksaan manual dan database, penguasaan *tools* industri (**Jira, Postman/Newman, Playwright, k6**), rekayasa performa web (**TTFB, LCP, INP, CLS**) beserta studi kasus perbaikan kode frontend, hingga integrasi **CI/CD GitHub Actions**.

---

## Bagian 1: Fondasi Teori, Mindset & Teknik Desain Pengujian

### 1. Perubahan Mindset: Dari "Tukang Klik" Menjadi Quality Engineer
* **Shift-Left Testing:** Pengujian dimulai sejak tahap pembacaan *Product Requirement Document (PRD)* dan perancangan kontrak API. Menemukan cacat logika pada tahap desain memakan biaya $1\times$, sedangkan memperbaikinya di produksi memakan biaya hingga $100\times$.
* **Testing Trophy (Prioritas ROI Pengujian):**
  1. **Static Analysis (Fondasi):** Linter, TypeScript *strict mode*, validasi skema OpenAPI/Swagger.
  2. **Unit Tests:** Pengujian fungsi murni yang terisolasi (ditulis developer, diaudit *edge-case*-nya oleh QA).
  3. **Integration & API Tests (Porsi Terbesar):** Menguji kontrak HTTP, alur logika bisnis, antrean pesan, dan transaksi database. Cepat, murah, dan deterministik.
  4. **End-to-End (E2E) UI Tests (Puncak Ramping):** Dikhususkan untuk alur bisnis paling kritis (*critical user journeys* seperti registrasi, checkout, pembayaran) karena lambat dan membutuhkan biaya perawatan lebih tinggi.

### 2. Teknik Desain Pengujian Formal
Gunakan teknik berikut untuk memadatkan ribuan kombinasi input menjadi skenario uji paling efektif:

* **Equivalence Partitioning (EP):** Membagi domain input menjadi kelas ekuivalensi valid dan tidak valid. Jika rentang input yang diterima adalah $18 \le \text{usia} \le 60$, cukup uji satu perwakilan valid ($30$) dan dua perwakilan tidak valid ($10$ dan $75$).
* **Boundary Value Analysis (BVA):** Mayoritas *bug* logika tersembunyi di batas tepi (kesalahan operator `<` vs `<=`). Untuk rentang $18 \le \text{usia} \le 60$, titik uji wajib adalah:
  $$\{17, 18, 19\} \quad \text{dan} \quad \{59, 60, 61\}$$
* **State Transition Testing:** Wajib diterapkan pada fitur berbasis siklus status (contoh: Order `DRAFT` $\rightarrow$ `PENDING_PAYMENT` $\rightarrow$ `PAID` $\rightarrow$ `SHIPPED` $\rightarrow$ `REFUNDED`). QA wajib menguji **transisi ilegal**, seperti membatalkan pesanan yang sudah `SHIPPED` atau memicu *webhook* `PAID` dua kali.
* **Decision Table Testing:** Memetakan kombinasi aturan bisnis bersyarat ke dalam tabel kebenaran agar tidak ada cabang logika yang terlewat:

| Kondisi / Aturan | Skenario 1 | Skenario 2 | Skenario 3 | Skenario 4 |
| :--- | :---: | :---: | :---: | :---: |
| Member VIP | Ya | Ya | Tidak | Tidak |
| Total Belanja $\ge \text{Rp } 500.000$ | Ya | Tidak | Ya | Tidak |
| **Hasil: Gratis Ongkir** | **Ya** | **Ya** | **Ya** | **Tidak** |
| **Hasil: Diskon Tambahan $10\%$** | **Ya** | **Tidak** | **Tidak** | **Tidak** |

### 3. Matriks Severity vs Priority
* **Severity (Dampak Teknis):** Tingkat kerusakan fungsionalitas sistem (*Blocker, Critical, Major, Minor*).
* **Priority (Urgensi Bisnis):** Urutan kecepatan penanganan (*P0 - Immediate, P1 - High, P2 - Medium, P3 - Low*).
* **Contoh Kasus Nyata:**
  * Kesalahan ejaan nama merek di halaman *landing* memiliki **Low Severity** (sistem berjalan normal), namun **P0 / High Priority** karena merusak citra perusahaan.
  * *Crash* pada fitur ekspor laporan audit tahunan yang hanya dipakai 1 admin memiliki **High Severity**, namun dapat diklasifikasikan **P2 / Medium Priority** jika ada perbaikan keamanan mendesak yang sedang berjalan.

---

## Bagian 2: Praktik Pengujian Manual, API, Database & Keamanan Dasar

### 1. Detail Kecil yang Membedakan Pemula vs Senior QA
Setiap menguji fitur baru, wajib lakukan daftar periksa (*checklist*) berikut:

* **Input Ekstrem & Karakter Khusus:**
  * String sangat panjang ($10.000$ karakter tanpa spasi) untuk menguji *layout overflow* dan batas kolom `VARCHAR` di database.
  * Karakter Unicode kompleks, emoji gabungan (`👨‍👩‍👧‍👦`), serta teks *Right-to-Left (RTL)*.
  * Spasi tersembunyi di awal/akhir input (`" user@domain.com "`) untuk memastikan adanya proses `trim()`.
* **Presisi Angka Finansial & Zona Waktu:**
  * Uji perhitungan desimal/pajak untuk mendeteksi *floating-point precision bug* (di mana $0.1 + 0.2 = 0.30000000000000004$ dalam IEEE 754; sistem finansial wajib memakai tipe data `DECIMAL` atau satuan sen/integer terkecil).
  * Verifikasi penyimpanan waktu dalam format **UTC** di database dan konversinya ke zona waktu lokal klien, termasuk pengujian tanggal tahun kabisat (`29 Februari`).
* **Kondisi Konkurensi & Interaksi Browser:**
  * Lakukan *double-click* cepat pada tombol *Submit* / *Bayar* untuk memverifikasi perlindungan *idempotency*.
  * Tekan tombol *Back* browser tepat setelah transaksi selesai.
  * Simulasikan koneksi terputus (*Offline*) atau latensi tinggi (*Slow 3G*) saat formulir sedang dikirim.

### 2. Verifikasi Integritas Database (SQL untuk QA)
Pengujian tidak berhenti saat UI menampilkan pesan *"Berhasil"*. QA wajib memverifikasi data langsung di database:

```sql
-- 1. Cek apakah terjadi duplikasi transaksi akibat race condition / double submit
SELECT idempotency_key, COUNT(*) AS total_rows
FROM payments
GROUP BY idempotency_key
HAVING COUNT(*) > 1;

-- 2. Cek orphan records (detail pesanan yang kehilangan induk pesanan)
SELECT oi.id, oi.order_id
FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.id IS NULL;

-- 3. Verifikasi konsistensi saldo ledger (total debit harus sama dengan total kredit)
SELECT account_id,
       SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE -amount END) AS calculated_balance
FROM ledger_entries
WHERE account_id = 'acc_9921'
GROUP BY account_id;
```

### 3. Pengujian Keamanan Esensial (OWASP Top Checks)
* **IDOR (*Insecure Direct Object Reference*):** Login sebagai `User A`, tangkap request `GET /api/v1/orders/1055`, lalu ganti token otorisasi dengan milik `User B`. Sistem wajib menolak dengan `HTTP 403 Forbidden` atau `HTTP 404 Not Found` (bukan menampilkan data milik `User A`).
* **Mass Assignment:** Tambahkan field sensitif seperti `"role": "admin"` atau `"is_verified": true` ke dalam payload JSON saat mengirim `PATCH /api/v1/profile`, lalu periksa apakah server mengabaikannya.
* **Kebocoran Informasi Error:** Pastikan respons `HTTP 500` di lingkungan *staging/production* tidak menampilkan *stack trace*, versi database, atau struktur direktori server.

---

## Bagian 3: Panduan Lengkap Tools Industri

### 1. Jira: Traceability, Penulisan Test Case & Bug Forensics

#### A. Struktur Traceability Wajib
* Tautkan setiap *Test Case* dan *Bug* ke **User Story** induknya melalui relasi `tests` atau `is caused by`.
* Buat sub-task terpisah untuk `QA - Test Design & Review` di awal *sprint* agar QA dapat meninjau kriteria penerimaan (*Acceptance Criteria*) sebelum developer menulis kode.

#### B. Standar Penulisan Test Case Atomik (Format Gherkin)
Satu *Test Case* hanya menguji satu perilaku spesifik:

```gherkin
Feature: Validasi Kupon Diskon saat Checkout

Scenario: Menolak kupon yang sudah melewati batas waktu berlaku
  Given pengguna telah login sebagai akun "Regular"
  And keranjang belanja berisi produk dengan total harga Rp 300.000
  When pengguna menerapkan kode kupon "PROMOEXPIRED" yang berakhir kemarin
  Then sistem menampilkan pesan error "Kode promo sudah tidak berlaku"
  And total pembayaran tetap Rp 300.000 tanpa potongan harga
```

#### C. Template Bug Report Standar Produksi

```markdown
### Judul:
[Checkout][Payment API] HTTP 500 Internal Server Error saat tombol Bayar diklik dua kali dalam waktu kurang dari 500 ms

### Informasi Lingkungan:
- **Severity:** Critical | **Priority:** P0 - Immediate Fix
- **Environment:** Staging (`https://staging.app.id`) | Build: `v2.18.0-rc1`
- **Akun Uji:** `qa.tester01@mail.com` (ID: `usr_4412`)
- **Browser/OS:** Chrome 131 / Windows 11 (1920x1080)

### Pre-conditions:
1. Keranjang memiliki 1 produk aktif dengan stok tersisa `1`.
2. Halaman berada di `/checkout` dengan metode pembayaran `Virtual Account`.

### Steps to Reproduce:
1. Klik tombol **"Bayar Sekarang"** dua kali berturut-turut dengan cepat (double-click).

### Actual Result:
Request pertama mengembalikan `HTTP 201 Created`, sedangkan request kedua memicu `HTTP 500 Internal Server Error` (`duplicate key value violates unique constraint`) dan membuat entri transaksi menggantung.

### Expected Result:
Tombol langsung berubah menjadi `disabled` pada klik pertama, dan endpoint backend mengembalikan respons idempoten (`HTTP 200` atau `HTTP 409`) berdasarkan header `Idempotency-Key` tanpa error database.

### Lampiran Bukti Teknis:
- Network trace: `checkout-double-click.har`
- cURL reproduksi & JSON response terlampir.
```

#### D. Filter JQL Harian untuk Quality Gate
* **Antrean siap diuji:**
  `project = CORE AND sprint in openSprints() AND status = "Ready for QA" ORDER BY priority DESC`
* **Release Blocker Check (harus bernilai 0 sebelum rilis):**
  `project = CORE AND issuetype = Bug AND severity in (Blocker, Critical) AND status not in (Done, Closed)`

---

### 2. Postman & Newman: Automated API Test Suite

#### A. Arsitektur Variabel
* **Environment Variables (`Local`, `Staging`):** `base_url`, `qa_email`, `qa_password`.
* **Collection Variables:** `access_token`, `token_expiry`, `idempotency_key`, `created_order_id`.

#### B. Pre-request Script Otomatis (Level Collection)
Menjamin setiap request mutasi memiliki `Idempotency-Key` unik dan memperbarui token JWT secara otomatis sebelum kedaluwarsa:

```javascript
// 1. Buat Idempotency-Key unik untuk setiap eksekusi request
const uniqueKey = pm.variables.replaceIn('{{$guid}}');
pm.collectionVariables.set('idempotency_key', uniqueKey);

// 2. Perbarui token otentikasi secara otomatis jika kosong atau kedaluwarsa
const expiry = Number(pm.collectionVariables.get('token_expiry') || 0);
if (!pm.collectionVariables.get('access_token') || Date.now() > expiry) {
    pm.sendRequest({
        url: pm.environment.get('base_url') + '/api/v1/auth/login',
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: pm.environment.get('qa_email'),
                password: pm.environment.get('qa_password')
            })
        }
    }, (err, res) => {
        if (!err && res.code === 200) {
            const payload = res.json();
            pm.collectionVariables.set('access_token', payload.access_token);
            pm.collectionVariables.set('token_expiry', Date.now() + 14 * 60 * 1000);
        }
    });
}
```

#### C. Penulisan Assertions Lengkap (`pm.test`)
Memvalidasi status HTTP, anggaran latensi server, kontrak tipe data JSON, dan kalkulasi bisnis sekaligus:

```javascript
const body = pm.response.json();

pm.test('HTTP Status Code adalah 201 Created', () => {
    pm.response.to.have.status(201);
});

pm.test('Waktu respons API berada di bawah anggaran 350 ms', () => {
    pm.expect(pm.response.responseTime).to.be.below(350);
});

pm.test('Kontrak struktur dan tipe data JSON valid', () => {
    pm.expect(body).to.have.property('order_id').that.is.a('string');
    pm.expect(body.items).to.be.an('array').that.is.not.empty;
    pm.expect(body.grand_total).to.be.a('number');
});

pm.test('Kalkulasi pajak PPN 11% akurat dan simpan order_id', () => {
    // Subtotal 200.000 + PPN 22.000 = 222.000
    pm.expect(body.grand_total).to.eql(222000);
    pm.collectionVariables.set('created_order_id', body.order_id);
});
```

#### D. Eksekusi CLI dengan Newman
```bash
newman run tests/api/ecommerce.postman_collection.json \
  -e tests/api/staging.postman_environment.json \
  --reporters cli,junit \
  --reporter-junit-export reports/newman-junit.xml
```

---

### 3. Playwright (TypeScript): Framework E2E Modern & Anti-Flaky

#### A. Struktur Proyek Standar Industri
```text
qa-playwright-suite/
├── pages/
│   └── CheckoutPage.ts          # Page Object Model (selektor & aksi halaman)
├── utils/
│   └── webVitalsHelper.ts       # Injeksi PerformanceObserver untuk LCP & CLS
├── tests/
│   └── checkout.spec.ts         # Skenario E2E, API seeding, fault injection & audit
├── playwright.config.ts         # Konfigurasi worker paralel, retry & trace viewer
└── package.json
```

#### B. Hierarki Selektor Wajib
1. `page.getByRole('button', { name: 'Bayar Sekarang' })` *(Prioritas tertinggi — menguji aksesibilitas)*
2. `page.getByLabel('Kode Promo')`
3. `page.getByPlaceholder('Contoh: HEMAT10')`
4. `page.getByTestId('checkout-grand-total')` *(Atribut `data-testid` khusus otomasi)*

*Larangan:* Hindari `page.waitForTimeout(...)` dan selektor XPath absolut (`/html/body/div[2]/...`).

#### C. Implementasi Page Object (`pages/CheckoutPage.ts`)
```typescript
import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly promoInput: Locator;
  readonly applyPromoBtn: Locator;
  readonly payButton: Locator;
  readonly grandTotalLabel: Locator;
  readonly alertBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.promoInput = page.getByLabel('Kode Promo');
    this.applyPromoBtn = page.getByRole('button', { name: 'Terapkan' });
    this.payButton = page.getByRole('button', { name: 'Bayar Sekarang' });
    this.grandTotalLabel = page.getByTestId('checkout-grand-total');
    this.alertBanner = page.getByRole('alert');
  }

  async goto(draftId: string) {
    await this.page.goto(`/checkout/${draftId}`);
  }

  async submitOrder() {
    await expect(this.payButton).toBeEnabled();
    await this.payButton.click();
  }
}
```

#### D. Skenario Uji E2E, Fault Injection & Web Vitals Gate (`tests/checkout.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Flow, Resilience & Core Web Vitals', () => {
  let draftOrderId: string;

  // API Seeding: Siapkan state keranjang lewat API sebelum tes berjalan
  test.beforeEach(async ({ request }) => {
    const response = await request.post('/api/v1/test/seed-checkout', {
      data: { sku: 'MONITOR-4K-27', quantity: 1 }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    draftOrderId = data.draft_id;
  });

  test('Transaksi sukses dan memenuhi anggaran performa LCP serta CLS', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    // Suntikkan PerformanceObserver sebelum navigasi untuk mengukur LCP & CLS nyata
    await page.addInitScript(() => {
      (window as any).__qaVitals = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        (window as any).__qaVitals.lcp = entries[entries.length - 1].startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            (window as any).__qaVitals.cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await checkout.goto(draftOrderId);
    await expect(checkout.grandTotalLabel).toHaveText('Rp 6.500.000');

    // Validasi Core Web Vitals sebagai Quality Gate otomatis
    const vitals = await page.evaluate(() => (window as any).__qaVitals);
    expect(vitals.lcp, `LCP (${vitals.lcp}ms) melebihi batas 2500ms`).toBeLessThan(2500);
    expect(vitals.cls, `CLS (${vitals.cls}) melebihi batas 0.1`).toBeLessThan(0.1);

    await checkout.submitOrder();
    await expect(page).toHaveURL(/\/payment\/waiting/);
  });

  test('Graceful degradation saat Payment API mengalami gangguan HTTP 503', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto(draftOrderId);

    // Fault Injection: Paksa endpoint pembayaran gagal dengan HTTP 503
    await page.route('**/api/v1/payments/charge', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'SERVICE_UNAVAILABLE', message: 'Gateway sibuk' })
      });
    });

    await checkout.submitOrder();

    // Pastikan UI tidak blank/crash dan pengguna dapat mencoba ulang
    await expect(checkout.alertBanner).toContainText('Layanan pembayaran sedang sibuk');
    await expect(checkout.payButton).toBeEnabled();
  });
});
```

#### E. Konfigurasi Playwright (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'reports/e2e-junit.xml' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry', // Merekam rekaman forensik lengkap saat tes gagal pertama kali
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } }
  ]
});
```

---

## Bagian 4: Web Performance Engineering (TTFB, LCP, INP, CLS) & Studi Kasus Perbaikan Kode

### 1. Ambang Batas Standar ($75\text{th}$ Percentile Field Data)

| Metrik | Definisi Singkat | Baik (*Good*) | Perlu Perbaikan | Buruk (*Poor*) |
| :--- | :--- | :---: | :---: | :---: |
| **TTFB** | Waktu hingga byte pertama dokumen HTML diterima | $\le 800\text{ ms}$ | $800\text{ ms} < t \le 1800\text{ ms}$ | $> 1800\text{ ms}$ |
| **LCP** | Waktu render elemen konten terbesar di *viewport* awal | $\le 2.5\text{ s}$ | $2.5\text{ s} < t \le 4.0\text{ s}$ | $> 4.0\text{ s}$ |
| **INP** | Latensi respons visual terburuk atas interaksi pengguna | $\le 200\text{ ms}$ | $200\text{ ms} < t \le 500\text{ ms}$ | $> 500\text{ ms}$ |
| **CLS** | Total skor pergeseran tata letak tak terduga | $\le 0.1$ | $0.1 < s \le 0.25$ | $> 0.25$ |

---

### 2. Bedah Teknis & Studi Kasus Perbaikan Kode Frontend

#### A. TTFB (*Time to First Byte*)
* **Diagnosis DevTools:** Tab **Network** $\rightarrow$ klik request dokumen HTML utama $\rightarrow$ sub-tab **Timing** $\rightarrow$ periksa durasi *Waiting for server response (TTFB)*.
* **Handling Best Practices:**
  1. Hapus rantai pengalihan berlapis (*redirect chains*).
  2. Terapkan *Edge Caching* pada CDN (`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`).
  3. Hilangkan *N+1 query* database dan gunakan *connection pooling*.

---

#### B. Studi Kasus 1: Perbaikan LCP (*Largest Contentful Paint*)
* **Diagnosis DevTools:** Tab **Performance** $\rightarrow$ aktifkan *Network: Slow 4G* & *CPU: 4x slowdown* $\rightarrow$ *Record & Reload* $\rightarrow$ klik penanda **LCP** untuk melihat apakah keterlambatan berasal dari *Resource Load Delay* atau *Element Render Delay*.

**Kode Bermasalah (LCP Lambat - $4.6\text{ s}$):**
```html
<head>
  <!-- Render-blocking script menahan browser menggambar DOM -->
  <script src="/assets/analytics-heavy.js"></script>
  <link rel="stylesheet" href="/assets/all-styles.css" />
</head>
<body>
  <!-- Kesalahan fatal: gambar hero diberi lazy-loading dan tanpa prioritas tinggi -->
  <section class="hero">
    <img src="/images/banner-utama.jpg" loading="lazy" alt="Promo Utama" />
  </section>
</body>
```

**Kode Perbaikan Best Practice (LCP Cepat - $1.4\text{ s}$):**
```html
<head>
  <!-- 1. Preload gambar LCP agar langsung diunduh paralel bersama CSS -->
  <link rel="preload" as="image" href="/images/banner-utama.avif" fetchpriority="high" />

  <!-- 2. Non-blocking script dengan atribut defer -->
  <script src="/assets/analytics-heavy.js" defer></script>
  <link rel="stylesheet" href="/assets/critical.css" />
</head>
<body>
  <section class="hero">
    <!-- 3. Hapus loading="lazy", gunakan format modern AVIF & fetchpriority="high" -->
    <img
      src="/images/banner-utama.avif"
      width="1200"
      height="600"
      fetchpriority="high"
      decoding="async"
      alt="Promo Utama"
    />
  </section>
</body>
```

---

#### C. Studi Kasus 2: Perbaikan INP (*Interaction to Next Paint*)
* **Diagnosis DevTools:** Tab **Performance** $\rightarrow$ rekam saat menekan tombol filter atau mengetik di pencarian $\rightarrow$ cari balok panjang berwarna merah bertanda **Long Task ($> 50\text{ ms}$)** pada trek *Main Thread*.

**Kode Bermasalah (INP Buruk - $620\text{ ms}$ akibat Long Task & Layout Thrashing):**
```javascript
// Memblokir Main Thread selama ratusan milidetik saat tombol filter diklik
filterButton.addEventListener('click', () => {
  const cards = document.querySelectorAll('.product-card');

  // Layout Thrashing: membaca offsetHeight lalu menulis style berulang kali dalam loop
  cards.forEach((card) => {
    const currentHeight = card.offsetHeight; // Memaksa browser menghitung ulang layout (Reflow)
    card.style.height = currentHeight + 10 + 'px';
  });

  // Komputasi berat sinkron menahan browser menggambar frame berikutnya
  processHeavyAnalytics(largeDataset);
});
```

**Kode Perbaikan Best Practice (INP Responsif - $65\text{ ms}$):**
```javascript
// Helper untuk memberi jeda pada Main Thread agar browser sempat menggambar UI
function yieldToMain() {
  if ('scheduler' in window && 'yield' in (window as any).scheduler) {
    return (window as any).scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

filterButton.addEventListener('click', async () => {
  const cards = document.querySelectorAll('.product-card');

  // 1. Pisahkan fase BACA dan fase TULIS untuk mencegah Layout Thrashing
  const heights = Array.from(cards).map((card) => card.offsetHeight);
  cards.forEach((card, index) => {
    card.style.transform = `translateY(0px)`;
    card.style.minHeight = heights[index] + 10 + 'px';
  });

  // 2. Yield ke Main Thread sebelum menjalankan tugas latar belakang
  await yieldToMain();
  processHeavyAnalytics(largeDataset);
});
```

---

#### D. Studi Kasus 3: Perbaikan CLS (*Cumulative Layout Shift*)
* **Diagnosis DevTools:** Buka *Command Palette* (`Ctrl+Shift+P`) $\rightarrow$ ketik **Show Layout Shift Regions** $\rightarrow$ muat ulang halaman dan amati area biru yang berkedip saat komponen bergeser.

**Kode Bermasalah (CLS Tinggi - $0.34$):**
```html
<style>
  /* Pergeseran tata letak terjadi karena gambar dan banner tidak punya dimensi awal */
  .promo-banner { background: #fef08a; }
  .product-img { width: 100%; }
</style>

<div id="top-promo-slot"></div>
<img class="product-img" src="/images/sepatu.jpg" alt="Sepatu Lari" />

<script>
  // Menyisipkan banner di atas konten setelah API selesai mendorong seluruh halaman ke bawah
  fetch('/api/promo-banner').then(r => r.text()).then(html => {
    document.getElementById('top-promo-slot').innerHTML = html;
  });
</script>
```

**Kode Perbaikan Best Practice (CLS Mendekati Nol - $0.00$):**
```html
<style>
  /* 1. Reservasi ruang kosong sejak awal dengan min-height tetap */
  #top-promo-slot {
    min-height: 48px;
    contain: layout;
  }
  /* 2. Kunci rasio aspek gambar sebelum file diunduh */
  .product-img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }
</style>

<div id="top-promo-slot" aria-live="polite">
  <div class="skeleton-bar">Memuat penawaran...</div>
</div>
<img class="product-img" src="/images/sepatu.jpg" width="800" height="600" alt="Sepatu Lari" />
```

---

## Bagian 5: Load & Performance Testing dengan k6 (Mengukur Degradasi TTFB)

Pengujian fungsional saja tidak dapat mendeteksi *connection pool exhaustion* atau degradasi TTFB saat ratusan pengguna mengakses endpoint secara bersamaan. Gunakan **k6** untuk memvalidasi ketahanan backend.

### 1. Jenis Pengujian Beban
* **Load Test:** Menguji performa sistem pada trafik normal hingga puncak harian yang diharapkan.
* **Stress Test:** Menaikkan beban melampaui kapasitas normal untuk menemukan titik patah (*breaking point*) sistem.
* **Spike Test:** Memberikan lonjakan pengguna ekstrem secara tiba-tiba (simulasi *flash sale*).

### 2. Skrip k6 Lengkap (`tests/load/checkout-load.js`)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Metrik khusus untuk memantau TTFB (http_req_waiting)
const ttfbTrend = new Trend('api_ttfb_ms', true);

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp-up ke 50 Virtual Users
    { duration: '1m', target: 200 },   // Beban puncak 200 Virtual Users bersamaan
    { duration: '30s', target: 0 }     // Ramp-down
  ],
  // Quality Gate: Tes otomatis GAGAL jika metrik melewati ambang batas SLA
  thresholds: {
    http_req_failed: ['rate<0.01'],           // Tingkat error wajib di bawah 1%
    http_req_waiting: ['p(95)<400', 'p(99)<800'], // P95 TTFB < 400ms, P99 TTFB < 800ms
    api_ttfb_ms: ['p(99)<800']
  }
};

export default function () {
  const url = `${__ENV.BASE_URL || 'http://localhost:3000'}/api/v1/products/featured`;
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.API_TOKEN}`
    }
  };

  const res = http.get(url, params);

  // Catat metrik TTFB (waktu tunggu byte pertama dari server)
  ttfbTrend.add(res.timings.waiting);

  check(res, {
    'status adalah 200': (r) => r.status === 200,
    'payload tidak kosong': (r) => r.body && r.body.length > 0
  });

  sleep(1); // Think time antar-aksi pengguna
}
```

### 3. Cara Menjalankan & Membaca Hasil k6
```bash
k6 run -e BASE_URL=https://staging.app.id -e API_TOKEN=secret_token tests/load/checkout-load.js
```
* **Fokus Evaluasi:** Jangan terpaku pada nilai rata-rata (`avg`). Perhatikan kolom **`p(95)`** dan **`p(99)`** pada `http_req_waiting`. Jika `avg` berada di $120\text{ ms}$ tetapi `p(99)` melonjak ke $3.200\text{ ms}$, artinya $1\%$ pengguna mengalami kelumpuhan sistem akibat antrean kunci database (*lock contention*) atau *Garbage Collection pause*.

---

## Bagian 6: Integrasi CI/CD Lengkap (GitHub Actions)

Simpan konfigurasi berikut pada `.github/workflows/qa-quality-gate.yml` untuk menjalankan **Newman API Tests** dan **Playwright E2E Sharding** secara paralel pada setiap *Pull Request*:

```yaml
name: QA Automated Quality Gate

on:
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  # Job 1: Pengujian Kontrak & Logika API dengan Newman (Cepat: ~1-2 menit)
  api-tests:
    name: Newman API Regression
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Newman
        run: npm install -g newman

      - name: Run Postman Collection
        run: |
          newman run tests/api/ecommerce.postman_collection.json \
            -e tests/api/staging.postman_environment.json \
            --reporters cli,junit \
            --reporter-junit-export reports/newman-results.xml

      - name: Upload API Test Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: newman-api-report
          path: reports/newman-results.xml

  # Job 2: Pengujian E2E & Core Web Vitals Paralel (2 Shards)
  e2e-tests:
    name: Playwright E2E (Shard ${{ matrix.shardIndex }}/${{ matrix.shardTotal }})
    runs-on: ubuntu-latest
    needs: api-tests # Jalankan UI test hanya jika kontrak API lolos
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2]
        shardTotal: [2]
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies & Playwright Browsers
        run: |
          npm ci
          npx playwright install --with-deps chromium

      - name: Run Playwright Tests (Sharded)
        env:
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}
        run: |
          npx playwright test --project=chromium --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload Playwright Trace & Report on Failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-trace-shard-${{ matrix.shardIndex }}
          path: |
            playwright-report/
            test-results/
          retention-days: 7
```

---

## Bagian 7: Peta Jalan Eksekusi Belajar (8 Minggu Menjadi Senior QA)

1. **Minggu 1–2 (Fondasi Desain Uji, Jira & Bug Forensics):**
   * Pilih satu aplikasi web transaksi lengkap.
   * Buat dokumen *Test Plan* menggunakan *Boundary Value Analysis* dan *State Transition Testing*.
   * Tulis $15$ *Test Case* atomik berformat Gherkin di Jira dan dokumentasikan minimal $8$ bug nyata lengkap dengan lampiran `.har`, cURL, dan hasil verifikasi query SQL.
2. **Minggu 3–4 (Postman Automation & k6 Load Profiling):**
   * Bangun koleksi Postman dengan *Pre-request Script* auto-login dan `Idempotency-Key`, validasi skema JSON, dan jalankan melalui **Newman**.
   * Tulis skrip **k6** untuk menguji endpoint baca dan tulis utama, lalu analisis perbedaan nilai `p(95)` dan `p(99)` TTFB saat jumlah *Virtual Users* dinaikkan.
3. **Minggu 5–6 (Web Performance Engineering: TTFB, LCP, INP, CLS):**
   * Lakukan audit performa pada 3 halaman utama menggunakan Chrome DevTools (*Slow 4G* & *CPU 4x Slowdown*).
   * Reproduksi masalah LCP, INP, dan CLS, terapkan perbaikan kode sesuai panduan di Bagian 4, lalu dokumentasikan perbandingan metrik sebelum dan sesudah perbaikan.
4. **Minggu 7–8 (Playwright Architecture & CI/CD Pipeline):**
   * Bangun *framework* Playwright TypeScript berbasis *Page Object Model* yang menggabungkan *API Seeding*, *Network Fault Injection* (`page.route`), dan *assertion* otomatis Core Web Vitals.
   * Integrasikan seluruh rangkaian pengujian ke dalam **GitHub Actions** dan pelajari cara membedah file `trace.zip` menggunakan **Playwright Trace Viewer**.