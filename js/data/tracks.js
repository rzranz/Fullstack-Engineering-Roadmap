// Tracks Data (Fullstack, 4-Phase QA, and System Architect Modes)
window.TRACKS = [
  {
    "id": "Web Fundamentals",
    "name": "Web Fundamentals",
    "category": "Fondasi Web",
    "desc": "Pahami internet, browser, request lifecycle, terminal, dan cara kerja aplikasi web.",
    "icon": "◎",
    "outcome": "Mampu menelusuri request dari browser ke server dan bekerja dengan tool developer.",
    "mode": "fullstack"
  },
  {
    "id": "HTML",
    "name": "HTML",
    "category": "Fondasi Web",
    "desc": "Bangun struktur dokumen web yang semantik, valid, dan aksesibel.",
    "icon": "H",
    "outcome": "Mampu membuat halaman, form, navigasi, dan struktur konten yang benar.",
    "mode": "fullstack"
  },
  {
    "id": "CSS",
    "name": "CSS",
    "category": "Fondasi Web",
    "desc": "Kuasai cascade, box model, layout, responsive design, dan design system.",
    "icon": "▤",
    "outcome": "Mampu membuat UI konsisten, responsif, dan mudah dirawat.",
    "mode": "fullstack"
  },
  {
    "id": "JavaScript",
    "name": "JavaScript",
    "category": "Fondasi Web",
    "desc": "Pelajari bahasa browser: data, function, DOM, event, asynchronous flow, dan module.",
    "icon": "JS",
    "outcome": "Mampu membangun interaksi web dan memahami runtime JavaScript.",
    "mode": "fullstack"
  },
  {
    "id": "TypeScript & Frontend Tooling",
    "name": "TypeScript & Tooling",
    "category": "Fondasi Web",
    "desc": "Tambahkan type safety, tooling, bundling, linting, dan runtime schema validation.",
    "icon": "TS",
    "outcome": "Mampu membangun frontend JavaScript yang typed dan konsisten.",
    "mode": "fullstack"
  },
  {
    "id": "Vue 3",
    "name": "Vue 3",
    "category": "Frontend Framework",
    "desc": "Pelajari component, Composition API, reactivity, router, state, forms, dan testing.",
    "icon": "V",
    "outcome": "Mampu membangun aplikasi Vue yang modular dan teruji.",
    "mode": "fullstack"
  },
  {
    "id": "Nuxt",
    "name": "Nuxt",
    "category": "Frontend Framework",
    "desc": "Gunakan Vue melalui Nuxt: file routing, rendering, data fetching, server routes, dan deployment.",
    "icon": "N",
    "outcome": "Mampu membangun aplikasi Nuxt yang aman dan production-minded.",
    "mode": "fullstack"
  },
  {
    "id": "React",
    "name": "React",
    "category": "Frontend Framework",
    "desc": "Pahami JSX, components, props, state, hooks, effects, forms, dan architecture.",
    "icon": "R",
    "outcome": "Mampu membangun UI React yang terstruktur dan efisien.",
    "mode": "fullstack"
  },
  {
    "id": "Next.js",
    "name": "Next.js",
    "category": "Frontend Framework",
    "desc": "Pelajari App Router, server/client components, data fetching, caching, mutations, dan deployment.",
    "icon": "NX",
    "outcome": "Mampu membangun aplikasi Next.js dengan trust boundary yang jelas.",
    "mode": "fullstack"
  },
  {
    "id": "API Design & REST",
    "name": "API Design & REST",
    "category": "Backend Foundations",
    "desc": "Rancang HTTP API yang konsisten, RESTful, terdokumentasi, dan aman.",
    "icon": "API",
    "outcome": "Mampu merancang API contract yang digunakan web, mobile, dan integrasi partner.",
    "mode": "fullstack"
  },
  {
    "id": "Web Security & Authentication",
    "name": "Web Security & Auth",
    "category": "Security & Platform",
    "desc": "Pahami authentication, authorization, sessions, CORS, CSRF, OWASP, dan secure coding.",
    "icon": "SEC",
    "outcome": "Mampu mengamankan browser-to-backend flow dan data pengguna.",
    "mode": "fullstack"
  },
  {
    "id": "SQL & Database",
    "name": "SQL & Database",
    "category": "Backend Foundations",
    "desc": "Pelajari relational modeling, SQL, query plan, indexing, transaction, dan locking.",
    "icon": "DB",
    "outcome": "Mampu merancang schema dan menjaga data consistency.",
    "mode": "fullstack"
  },
  {
    "id": "Go",
    "name": "Go",
    "category": "Backend Languages",
    "desc": "Dalami Go: type system, pointers, interfaces, errors, context, HTTP, database, concurrency, dan testing.",
    "icon": "GO",
    "outcome": "Mampu membuat backend Go idiomatis dan dapat dioperasikan.",
    "mode": "fullstack"
  },
  {
    "id": "Java",
    "name": "Java",
    "category": "Backend Languages",
    "desc": "Kuasai Java modern: OOP, types, generics, collections, exceptions, JVM, dan memory.",
    "icon": "J",
    "outcome": "Mampu membaca dan menulis Java sebelum menggunakan Spring.",
    "mode": "fullstack"
  },
  {
    "id": "Spring Boot",
    "name": "Spring Boot",
    "category": "Backend Frameworks",
    "desc": "Bangun backend Java dengan Spring Core, MVC, JPA, transactions, security, dan testing.",
    "icon": "SB",
    "outcome": "Mampu membangun modular monolith Spring Boot yang siap dikembangkan.",
    "mode": "fullstack"
  },
  {
    "id": "C#",
    "name": "C#",
    "category": "Backend Languages",
    "desc": "Pelajari C#: types, OOP, records, generics, LINQ, async/await, dan CLR.",
    "icon": "C#",
    "outcome": "Mampu memahami bahasa C# dan runtime .NET.",
    "mode": "fullstack"
  },
  {
    "id": "ASP.NET Core",
    "name": "ASP.NET Core",
    "category": "Backend Frameworks",
    "desc": "Bangun API .NET dengan middleware, DI, controllers, EF Core, security, dan observability.",
    "icon": ".NET",
    "outcome": "Mampu membangun backend ASP.NET Core yang maintainable.",
    "mode": "fullstack"
  },
  {
    "id": "Software Architecture & System Design",
    "name": "System Design & Architecture",
    "category": "Architecture & Professional Engineering",
    "desc": "Rancang sistem dengan clean code, SOLID, architecture styles, patterns, reliability, dan trade-off.",
    "icon": "SYS",
    "outcome": "Mampu menjelaskan keputusan arsitektur berdasarkan kebutuhan, risiko, tim, dan skala.",
    "mode": "fullstack"
  },
  {
    "id": "Git & Team Collaboration",
    "name": "Git & Team Collaboration",
    "category": "Professional Engineering",
    "icon": "GIT",
    "desc": "Workflow version control, branching, pull request, code review, dan release untuk kerja tim.",
    "outcome": "Mampu mengirim perubahan yang kecil, dapat direview, dan aman untuk digabungkan.",
    "mode": "fullstack"
  },
  {
    "id": "Testing & Quality Engineering",
    "name": "Testing & Quality Engineering",
    "category": "Professional Engineering",
    "icon": "QA",
    "desc": "Strategi unit, integration, contract, E2E, performance, dan quality gates lintas stack.",
    "outcome": "Mampu membuktikan behavior sistem melalui test yang stabil dan relevan.",
    "mode": "fullstack"
  },
  {
    "id": "DevOps & Delivery",
    "name": "DevOps & Delivery",
    "category": "Professional Engineering",
    "icon": "OPS",
    "desc": "Linux, Docker, CI/CD, deployment, configuration, monitoring, backup, dan incident response.",
    "outcome": "Mampu membawa aplikasi dari laptop ke staging/production dan mengoperasikannya.",
    "mode": "fullstack"
  },
  {
    "id": "Cloudflare & Edge Security",
    "name": "Cloudflare & Edge Security",
    "category": "Security & Platform",
    "icon": "CF",
    "desc": "Pahami DNS proxy, CDN, WAF, bot prevention, Turnstile, rate limiting, dan origin protection.",
    "outcome": "Mampu menerapkan perlindungan edge secara bertahap tanpa merusak traffic valid.",
    "mode": "fullstack"
  },
  {
    "id": "Professional Full-stack Workflow",
    "name": "Professional Full-stack Workflow",
    "category": "Professional Engineering",
    "icon": "PRO",
    "desc": "Cara bekerja end-to-end: requirement, design, estimasi, coding, review, release, dan maintenance.",
    "outcome": "Mampu memiliki feature secara end-to-end dan berkomunikasi efektif di tim.",
    "mode": "fullstack"
  },
  {
    "id": "Cloudflare Bot Prevention",
    "name": "Cloudflare Bot Prevention",
    "category": "Security & Platform",
    "desc": "Threat modeling bot, bot signals, Bot Fight Mode, WAF, Turnstile, rate limiting, origin protection, dan incident response.",
    "icon": "BOT",
    "outcome": "Mampu merancang mitigasi bot berdasarkan risiko tanpa memblokir traffic sah.",
    "mode": "fullstack"
  },
  {
    "id": "AI & RAG Engineering",
    "name": "AI & RAG Engineering",
    "category": "AI & Data Engineering",
    "desc": "AI/ML fundamentals, embeddings, document ingestion, vector search, RAG pipeline, evaluation, dan local-first AI.",
    "icon": "AI",
    "outcome": "Mampu membangun dan mengevaluasi semantic search/RAG dengan kontrol biaya dan data.",
    "mode": "fullstack"
  },
  {
    "id": "Android & Mobile Reengineering",
    "name": "Android & Mobile Reengineering",
    "category": "Application & Reengineering",
    "desc": "Android Java/Kotlin, lifecycle, API integration, secure storage, dan strategi migrasi aplikasi lama.",
    "icon": "AND",
    "outcome": "Mampu memahami dan memodernisasi mobile client yang terhubung ke backend.",
    "mode": "fullstack"
  },
  {
    "id": "Realtime Web & Game Systems",
    "name": "Realtime Web & Game Systems",
    "category": "Application & Reengineering",
    "desc": "Polling, SSE, WebSocket, Phaser, multiplayer state, authoritative server, dan reconnect.",
    "icon": "RT",
    "outcome": "Mampu memilih dan membangun komunikasi realtime sesuai kebutuhan produk.",
    "mode": "fullstack"
  },
  {
    "id": "Payment Integration & Webhooks",
    "name": "Payment Integration & Webhooks",
    "category": "Backend & Integration",
    "desc": "Payment lifecycle, provider adapter, webhook signature, idempotency, refund, dan reconciliation.",
    "icon": "PAY",
    "outcome": "Mampu mengintegrasikan payment provider dengan aman dan dapat diaudit.",
    "mode": "fullstack"
  },
  {
    "id": "Project Labs & Reengineering",
    "name": "Project Labs & Reengineering",
    "category": "Project Implementation",
    "desc": "Studi kasus implementasi FlowLedger, ClaimFlow, cinema booking, dan SmartFind yang menggabungkan stack dan best practices.",
    "icon": "LAB",
    "outcome": "Mampu menerapkan ilmu lintas jalur ke proyek nyata dan menjelaskan trade-off-nya.",
    "mode": "fullstack"
  },
  {
    "id": "QA Fase 1: Fundamental & Desain Uji",
    "name": "Fase 1: Fundamental QA, SDLC/STLC & Test Design",
    "mode": "qa",
    "category": "Fase 1: Fundamental QA (Minggu 1–2)",
    "desc": "SDLC vs STLC, Testing Pyramid vs Trophy, Shift-Left (1x vs 100x), Tipe Testing (Smoke/Sanity/Regression/UAT), EP, BVA, State Transition, Decision Table & Severity/Priority.",
    "icon": "F1",
    "outcome": "Mampu berpikir critical analysis, menulis Test Plan & Test Case TC-AUTH-001, dan merancang skenario uji formal tanpa bergantung pada tools automasi."
  },
  {
    "id": "QA Fase 2A: DevTools, Postman API & Jira",
    "name": "Fase 2A: Chrome DevTools, Postman API & Jira Forensics",
    "mode": "qa",
    "category": "Fase 2: Web, API & Database (Minggu 3–4)",
    "desc": "Inspeksi Network/Console/Application DevTools, HTTP Verbs & Status Codes, Happy/Negative Path, Post-response Assertions, Auto-JWT, Newman CLI, Jira Gherkin & Bug Report.",
    "icon": "F2A",
    "outcome": "Mampu menginvestigasi bug layer jaringan, membangun koleksi Postman otomatis via Newman, dan menulis bug report forensik (.har/cURL)."
  },
  {
    "id": "QA Fase 2B: Manual Edge, SQL & OWASP",
    "name": "Fase 2B: Manual Edge, SQL Integrity & OWASP Security",
    "mode": "qa",
    "category": "Fase 2: Web, API & Database (Minggu 3–4)",
    "desc": "Edge input (10k char, emoji, RTL), IEEE 754 finansial, UTC/kabisat, validasi SQL (SELECT/JOIN/GROUP BY, orphan & ledger balance), serta uji OWASP IDOR & Mass Assignment.",
    "icon": "F2B",
    "outcome": "Mampu memvalidasi persistensi data langsung di database SQL dan menutup celah otorisasi API sebelum rilis."
  },
  {
    "id": "QA Fase 3: Playwright E2E Automation",
    "name": "Fase 3: TypeScript & Playwright E2E Framework",
    "mode": "qa",
    "category": "Fase 3: E2E Automation (Minggu 5–8)",
    "desc": "Fondasi TypeScript async/await, Locator Strategy (getByRole/getByLabel/getByTestId), LoginPage & CheckoutPage POM, API Seeding, Fault Injection (page.route) & Trace Config.",
    "icon": "F3",
    "outcome": "Mampu membangun framework regresi E2E anti-flaky berbasis Page Object Model dan menguji situs praktik (SauceDemo & Herokuapp)."
  },
  {
    "id": "QA Fase 4A: Web Performance (Core Web Vitals)",
    "name": "Fase 4A: Web Performance Engineering (TTFB, LCP, INP, CLS)",
    "mode": "qa",
    "category": "Fase 4: Performance & CI/CD (Minggu 9–10)",
    "desc": "Ambang batas 75th percentile Core Web Vitals, diagnosis Chrome DevTools (Slow 4G & 4x CPU), dan studi kasus perbaikan kode frontend nyata untuk LCP, INP (yieldToMain), & CLS.",
    "icon": "F4A",
    "outcome": "Mampu mengaudit bottleneck rendering/Main Thread dan memvalidasi perbaikan performa frontend secara terukur."
  },
  {
    "id": "QA Fase 4B: k6 Load Testing, CI/CD & Roadmap",
    "name": "Fase 4B: k6 Load Testing, GitHub Actions CI/CD & Roadmap",
    "mode": "qa",
    "category": "Fase 4: Performance & CI/CD (Minggu 9–10)",
    "desc": "Load/Stress/Spike test k6 (P95/P99 TTFB), pipeline GitHub Actions (Playwright dasar hingga Newman + E2E Sharding), situs latihan mandiri & Peta Jalan terpadu.",
    "icon": "F4B",
    "outcome": "Mampu menguji kapasitas backend, mengotomatiskan Quality Gate di setiap Pull Request, dan mengeksekusi proyek portofolio."
  },
  {
    "id": "Fondasi Jaringan, Protokol & Trafik",
    "name": "Fondasi Jaringan, Protokol & Trafik",
    "mode": "sa",
    "category": "1. Jaringan, Protokol & Traffic Scale",
    "desc": "Modul 1–2: Model L4/L7, hierarki DNS & Anycast/GeoDNS, evolusi HTTP/1.1 → HTTP/3 QUIC, REST/GraphQL/gRPC/SSE/WebSocket, TLS/mTLS, Scaling, LB, API Gateway, CDN & Studi Kasus 1–2.",
    "icon": "NET",
    "outcome": "Mampu memilih protokol jaringan, strategi load balancing, dan lapisan edge proxy secara presisi sesuai trade-off."
  },
  {
    "id": "Penyimpanan Data, DB Internals & Caching",
    "name": "Penyimpanan Data, DB Internals & Caching",
    "mode": "sa",
    "category": "2. Penyimpanan Data & Akselerasi",
    "desc": "Modul 3–4: ACID & Isolation Levels, B-Tree vs LSM-Tree, Indexing, NoSQL Spesialis, Replication Quorum (R+W>N), Sharding, Cache Patterns & Stampede/Penetration/Avalanche + Studi Kasus 3–4.",
    "icon": "DB",
    "outcome": "Mampu merancang skema penyimpanan berkinerja tinggi, memilih storage engine tepat, dan mencegah kegagalan cache."
  },
  {
    "id": "Sistem Terdistribusi, Konsensus & Event-Driven",
    "name": "Sistem Terdistribusi, Konsensus & Event-Driven",
    "mode": "sa",
    "category": "3. Sistem Terdistribusi & Event Streaming",
    "desc": "Modul 5–6: CAP & PACELC, Spektrum Konsistensi, Raft/Paxos, Fencing Tokens, Logical Clocks, Snowflake ID, Kafka vs Queue, Transactional Outbox & CDC, Flink/Kappa + Studi Kasus 5–6.",
    "icon": "DST",
    "outcome": "Mampu mengatasi race condition lintas-mesin, masalah dual-write, dan merancang pipeline event-driven andal."
  },
  {
    "id": "Microservices, Ketahanan, Keamanan & Observabilitas",
    "name": "Microservices, Ketahanan, Keamanan & Observabilitas",
    "mode": "sa",
    "category": "4. Arsitektur Layanan, Security & Ops",
    "desc": "Modul 7–8: Modular Monolith vs Microservices, Service Mesh, Saga/CQRS/Event Sourcing, Circuit Breaker/Bulkhead/Rate Limit, OAuth2/OIDC, OpenTelemetry RED/USE, Canary & DR + Studi Kasus 7–8.",
    "icon": "RES",
    "outcome": "Mampu mengisolasi kegagalan berantai, mengaudit latensi lintas-layanan, dan merancang rilis zero-downtime."
  },
  {
    "id": "Kerangka Desain 4-Langkah & Studi Kasus Klasik",
    "name": "Kerangka Desain 4-Langkah & Studi Kasus Klasik",
    "mode": "sa",
    "category": "5. Design Framework & Case Blueprints",
    "desc": "Modul 9: Kerangka desain 4-langkah, estimasi Back-of-the-Envelope (Average & Peak QPS), Peta 8 Studi Kasus Klasik (TinyURL, Twitter, WhatsApp, Uber, YouTube, Flash Sale, Wallet, GDrive) + Studi Kasus 9.",
    "icon": "ARC",
    "outcome": "Mampu membedah desain sistem skala jutaan pengguna secara sistematis dengan perhitungan kapasitas terukur."
  },
  {
    "id": "Operasional Handling & Simulasi Kausal",
    "name": "Operasional Handling & Simulasi Kausal",
    "mode": "sa",
    "category": "6. Pilar Operasional & Simulasi Topologi",
    "desc": "5 Pilar Operasional Handling (Overload, Failure, Concurrency, Cache/Storage, Incident) serta Spesifikasi Simulasi Kausalitas Visual & Topologi Flash Sale (Unhandled vs Handled).",
    "icon": "OPS",
    "outcome": "Mampu menerapkan standar handling insiden produksi dan memvisualisasikan perilaku kausal arsitektur."
  }
];
