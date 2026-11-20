# Roadmap & Panduan Belajar QA Software Engineer (Nol hingga Automasi)

Panduan ini dirancang khusus untuk membangun fondasi berpikir seorang *Quality Assurance (QA) Software Engineer*—dari pemahaman fundamental, strategi analisis celah perangkat lunak, hingga otomatisasi pengujian serta integrasi CI/CD.

---

## 📊 Ringkasan Peta Belajar & Matriks Tools

| Fase | Fokus Utama | Deliverables / Output | Tools & Tech Stack |
| :--- | :--- | :--- | :--- |
| **Fase 1: Fundamental & Mindset QA** | SDLC, STLC, Testing Pyramid, Teknik Test Design | Test Plan, Test Case, Bug Report | **Jira**, Google Sheets / TestRail |
| **Fase 2: Web & API Testing** | DevTools Inspection, Validasi Endpoint & Payload | Koleksi API Test, Log Defect API | **Postman**, Chrome DevTools |
| **Fase 3: E2E Test Automation** | Scripting Test, Locator Strategy, Page Object Model | Framework Regression Test Otomatis | **Playwright** (TypeScript/JS), Node.js, Git |
| **Fase 4: Database & CI/CD Pipeline** | Validasi Persistensi Data, Eksekusi Continuous Testing | Pipeline CI/CD, Automated HTML Report | **GitHub Actions**, SQL (DBeaver/PostgreSQL) |

---

## 🎯 Detail Fase Pembelajaran

### Fase 1: Fundamental QA & Bug Management (Minggu 1–2)

> **Goal:** Menguasai cara berpikir *critical analysis* & *break the system* tanpa bergantung pada tools otomatisasi terlebih dahulu.

#### 1. Konsep Dasar & Framework
* **SDLC vs STLC:** Memahami perbedaan *Software Development Life Cycle* dan *Software Testing Life Cycle*.
* **Testing Pyramid:** 
  * **Unit Test:** Pengujian fungsi terisolasi oleh Developer.
  * **Integration Test:** Pengujian komunikasi antar modul/service.
  * **E2E (End-to-End) Test:** Pengujian alur pengguna secara menyeluruh oleh QA.
* **Tipe-Tipe Testing:** *Smoke Testing*, *Sanity Testing*, *Regression Testing*, *Exploratory Testing*, dan *User Acceptance Testing (UAT)*.

#### 2. Teknik Desain Skenario (Test Design Techniques)
* **Equivalence Partitioning (EP):** Membagi input ke dalam kelas-kelas data valid dan tidak valid.
* **Boundary Value Analysis (BVA):** Fokus pengujian pada nilai batas terkecil, tepat di batas, dan melebihi batas.
* **Decision Table Testing:** Pemetaan logika bisnis berulang berdasarkan kombinasi kondisi input.

#### 3. Implementasi Tools & Dokumentasi (Jira)
* Membuat papan **Scrum/Kanban** di Jira.
* Menulis **Bug Report** yang akurat dengan standar industri.

---

### Fase 2: Web Inspection & API Testing (Minggu 3–4)

> **Goal:** Mampu melakukan investigasi bug pada layer jaringan dan menguji keandalan API backend.

#### 1. Browser Inspection (Chrome DevTools)
* **Tab Network:** Analisis *HTTP Request Method*, *Status Code*, *Request Payload*, dan *Response Body*.
* **Tab Console:** Menangkap error koding JavaScript runtime.
* **Tab Application:** Verifikasi token autentikasi (*LocalStorage*, *SessionStorage*, *Cookies*).

#### 2. Pengujian API (Postman)
* **HTTP Verbs:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
* **HTTP Status Codes:** `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.
* **Skenario Pengujian API:**
  * **Happy Path:** Data valid, token valid.
  * **Negative Path:** Field wajib kosong, tipe data tidak sesuai, token kadaluarsa, celah otorisasi (IDOR).
* **Automasi Postman (Scripts & Environment):**
  * Menggunakan *Variables* (Global, Environment, Collection).
  * Menulis *Post-response Script* (Assertions) untuk validasi response status dan skema JSON.

---

### Fase 3: E2E Test Automation (Playwright) (Minggu 5–8)

> **Goal:** Membangun skrip pengujian otomatis yang stabil, cepat, dan mudah dipelihara.

#### 1. Fondasi Pemrograman
* **TypeScript / JavaScript:** Pemahaman variabel, tipe data, fungsi, serta penanganan asynchronous (`async/await`, `Promises`).

#### 2. Implementasi Playwright Framework
* **Locator Strategy:** Prioritaskan *user-facing locators*:
  * `page.getByRole()`
  * `page.getByLabel()`
  * `page.getByTestId()`
* **Auto-Waiting & Web-First Assertions:** Menghindari penggunaan `waitForTimeout` untuk mencegah *flaky test*.
* **Design Pattern (Page Object Model - POM):** Memisahkan elemen selector UI dan fungsi aksi dari file eksekusi skenario tes.
* **API Testing Integration:** Menggunakan `request` context bawaan Playwright untuk pembuatan data uji (*test setup*) via API sebelum menguji UI.

---

### Fase 4: Validasi Database & CI/CD Pipeline (Minggu 9–10)

> **Goal:** Mengintegrasikan pengujian otomatis ke dalam pipeline pengembang dan melakukan pengujian integritas data.

#### 1. Validasi Database (SQL)
* Melakukan verifikasi apakah transaksi pada UI/API tercatat secara presisi pada database.
* Perintah SQL kunci: `SELECT`, `WHERE`, `ORDER BY`, `JOIN`, `COUNT`, `GROUP BY`.

#### 2. Continuous Integration (GitHub Actions)
* Menyimpan kode pengujian pada repository **Git/GitHub**.
* Menyusun workflow YAML pada GitHub Actions agar skrip pengujian berjalan secara otomatis setiap terjadi *Pull Request* atau *Commit* baru.
* Mengatur penerbitan *Artifacts* berupa **Playwright HTML Report** dan **Trace Viewer**.

---

## 📋 Template Dokumen Standard QA

### 1. Template Test Case

```text
Test Case ID   : TC-AUTH-001
Title          : Login dengan Kredensial Valid
Pre-Condition  : User belum dalam kondisi login dan berada di halaman /login
Severity       : High
Priority       : P1

Test Steps:
1. Masukkan email valid ("user@example.com") pada kolom Email.
2. Masukkan kata sandi valid ("P@ssword123") pada kolom Password.
3. Klik tombol "Login".

Expected Result:
- User berhasil diarahakan ke halaman Dashboard (/dashboard).
- Pop-up pemberitahuan "Selamat Datang" ditampilkan.
- Token JWT tersimpan di LocalStorage.
```

### 2. Template Bug Report (Jira Standard)

```text
Bug Summary: [AUTH] Tombol "Submit" Tidak Merespons Saat Mengunggah Foto Profil dalam Format PNG

Environment:
- OS: macOS Sonoma 14.5
- Browser: Chrome v125.0.6422.142
- Environment: Staging v2.4.1

Steps to Reproduce (STR):
1. Buka aplikasi dan login menggunakan akun user standar.
2. Navigasi ke menu Profile Settings (/settings/profile).
3. Klik "Choose File" dan pilih file gambar berformat PNG (< 2MB).
4. Klik tombol "Submit Profile".

Expected Result:
Foto profil berhasil diperbarui dan muncul pesan sukses "Profil berhasil disimpan".

Actual Result:
Tombol "Submit Profile" membeku (disabled), indikator loading berputar terus-menerus, dan foto tidak tersimpan.

Console / Network Log:
- Status Code: 500 Internal Server Error pada Endpoint POST /api/v1/user/avatar
- Console Log Error: "Uncaught TypeError: Cannot read property 'mime' of undefined"

Attachment:
[Screenshot / Screen Recording / Network Payload log]
```

---

## 💻 Code Snippets untuk Praktik

### 1. Postman Post-Response Script (Assertion)

```javascript
// Validasi HTTP Status Code 200
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// Validasi Response Time di bawah 500ms
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Validasi Struktur Data JSON
pm.test("Validate User Profile Data Structure", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status", "success");
    pm.expect(jsonData.data).to.have.property("id");
    pm.expect(jsonData.data.email).to.be.a("string");
});
```

### 2. Skrip Automation Playwright (TypeScript + POM)

#### `pages/LoginPage.ts`
```typescript
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByLabel('Email Address');
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Sign In' });
    }

    async navigate() {
        await this.page.goto('/login');
    }

    async login(email: string, pass: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }
}
```

#### `tests/login.spec.ts`
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication Suite', () => {
    test('User should successfully login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');

        // Web-First Assertion
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByText('Welcome Back')).toBeVisible();
    });
});
```

### 3. Workflow Configuration GitHub Actions (`.github/workflows/playwright.yml`)

```yaml
name: Playwright Regression Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-on-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## 🛠 Target Website untuk Latihan Mandiri

1. **Website UI Practice:**
   * [SauceDemo](https://www.saucedemo.com/) *(E-commerce flow testing)*
   * [The Internet Herokuapp](https://the-internet.herokuapp.com/) *(Dynamic UI elements, upload, modal)*
2. **API Practice:**
   * [Restful-Booker](https://restful-booker.herokuapp.com/) *(CRUD Operations, Auth)*
   * [ReqRes.in](https://reqres.in/) *(REST API mock server)*