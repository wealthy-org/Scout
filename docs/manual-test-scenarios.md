# Scout Dossier.OS — Panduan Komprehensif Skenario Pengujian Manual & Protokol QA

Dokumen ini menyajikan prosedur pengujian manual terstruktur dan daftar periksa (*checklist*) penerimaan untuk memverifikasi seluruh fitur pada Scout Dossier.OS di lingkungan Lokal, Anvil Fork, Testnet, hingga Produksi.

---

## Scenario 01: Sign-In with Ethereum (SIWE) Authentication Flow
**Target Routes:** `/`, `/api/auth/nonce`, `/api/auth/verify`, `/api/auth/logout`

- [ ] **1.1 Status Landing Tanpa Otentikasi:** Akses `/` dan pastikan header menampilkan tombol "Connect Wallet" tanpa galat pada konsol browser.
- [ ] **1.2 Pembuatan Nonce:** Klik "Connect Wallet" -> pastikan klien mengirim permintaan `POST /api/auth/nonce` dan menerima string acak nonce yang aman secara kriptografis.
- [ ] **1.3 Verifikasi Tanda Tangan EIP-4361:** Tanda tangani pesan di MetaMask / Rabby / Phantom -> pastikan `POST /api/auth/verify` memvalidasi tanda tangan, menerbitkan cookie HTTP-only `scout_session`, dan menangani normalisasi checksum EIP-55.
- [ ] **1.4 Status Header Terotentikasi:** Pastikan header berubah menampilkan alamat dompet terpotong (`0x...`), titik status aktif, dan tombol Logout.
- [ ] **1.5 Dukungan Phantom & EVM Wallet Connect:** Uji otentikasi menggunakan Phantom (mode EVM) dan ekstensi Rabby untuk memverifikasi kompatibilitas multi-dompet.
- [ ] **1.6 Modal Konfirmasi & Aksi Logout:** Klik Logout -> pastikan modal konfirmasi "Konfirmasi Keluar" muncul dengan alamat dompet aktif, tombol "Batal", dan tombol "Ya, Keluar" (serta dapat ditutup via tombol Batal, ikon Close, klik di luar modal, atau tombol `Escape`). Klik "Ya, Keluar" -> pastikan `POST /api/auth/logout` menghapus cookie sesi dan mereset status klien kembali ke mode tamu seketika.

---

## Scenario 02: Token Case File Investigation & Auto-Save
**Target Routes:** `/d/[ca]`, `/api/dossier/[ca]`

- [ ] **2.1 Pencarian Token & Routing:** Ketik alamat kontrak yang valid (`0x...`) di kolom pencarian header atau input landing -> arahkan langsung ke halaman `/d/[ca]`.
- [ ] **2.2 Konsol Split-View Master-Detail (Model 3):**
  - Pastikan panel kiri master (`w-full lg:w-[360px] xl:w-[390px]`) menampilkan DossierHeader, matriks 3x2 Market Flow, dan ResearchPanel tanpa tabrakan vertikal.
  - Pastikan panel kanan detail menampilkan Trade Flow Chart, Order Flow Panel, Wallet Map, Top Wallets Table, dan Deployer History.
- [ ] **2.3 Matriks Terstruktur 3x2 Market Flow:** Pastikan Market Cap, ATH, Progress Bonding Curve %, Volume 24 Jam, Jumlah Transaksi, dan Dompet Unik terisi tanpa nilai NaN atau teks yang meluap.
- [ ] **2.4 Panel Riset Interaktif & Auto-Save:**
  - Ubah dropdown Status (`Watching`, `Researching`, `In position`, `Passed`).
  - Ketik narasi tesis ke dalam textarea riset.
  - Pilih / ketik Alasan Keputusan (Decision Reason).
  - Pastikan auto-save debounced `PUT /api/dossier/:ca` terpicu dalam 250ms dan menyimpan data ke database tanpa memuat ulang halaman.
- [ ] **2.5 Pemicu Delta Since Last Check:** Muat ulang atau buka kembali dossier -> pastikan panel Since Last Check menghitung delta metrik (FDV, Likuiditas, Skor) terhadap snapshot sebelumnya.
- [ ] **2.6 Persistensi Lokal Scout Remembers:** Tambahkan catatan cepat analis -> pastikan catatan tersimpan dan bertahan di seluruh sesi browser.

---

## Scenario 03: Public Case File Snapshot Publishing & Forking
**Target Routes:** `/p/[slug]`, `/api/dossier/public/[slug]/publish`, `/api/dossier/public/[slug]/save-copy`, `/api/dossier/public/[slug]/revoke`

- [ ] **3.1 Buka Modal Publikasi:** Klik tombol "Publish" pada header dossier -> pastikan dialog modal PublishDialog terbuka dengan latar belakang bersih.
- [ ] **3.2 Pembuatan Snapshot & Slug:** Isi handle analis, atur visibilitas catatan, lalu klik "Confirm & Publish" -> dapatkan URL unik `/p/[slug]`.
- [ ] **3.3 Verifikasi Halaman Publik Read-Only:** Buka `/p/[slug]` di jendela penyamaran (*incognito*) / mode tamu:
  - Pastikan seluruh dossier tampil dalam mode baca saja (*read-only*).
  - Pastikan lencana atribusi pembuat menampilkan handle yang dikonfigurasi.
  - Pastikan kontrol pengeditan (input auto-save) tersembunyi secara ketat.
- [ ] **3.4 Alur Simpan Salinan (Save a Copy / Fork):** Masuk menggunakan dompet kedua di jendela penyamaran -> klik "Save a Copy" -> pastikan salinan digabungkan ke pustaka `/dossiers` pengguna kedua dengan atribusi pembuat asli tetap utuh.
- [ ] **3.5 Alur Pencabutan (Revocation):** Dari dompet pembuat asli, jalankan pencabutan -> muat ulang URL publik di jendela penyamaran -> pastikan status HTTP 410 Gone / Revoked ditampilkan.

---

## Scenario 04: Deployer Reputation Profile & Watchlist Monitoring
**Target Routes:** `/deployer/[address]`, `/api/deployer/[address]`, `/watchlist`, `/api/watchlist`

- [ ] **4.1 Lembar Profil Deployer:** Klik tautan alamat deployer -> navigasikan ke `/deployer/[address]`.
- [ ] **4.2 Kesesuaian Satu Layar Penuh (Single-Viewport Fit):** Pastikan halaman pas 100% dengan tinggi layar tanpa bilah gulir luar (*outer scrollbar*).
- [ ] **4.3 Skor Reputasi & Pengukur 10-Bar:** Pastikan skor 0–100, pengukur kecepatan 10-bar berwarna, lencana pita status (Green/Yellow/Red Band), dan label (`fresh`/`repeat`/`serial`) ditampilkan akurat.
- [ ] **4.4 5 Sinyal Algoritma Laplace:** Pastikan `Graduation Rate`, `DOA Rate`, `Burst Rate`, `Total Launches`, dan `Graduated Count` terisi dengan benar.
- [ ] **4.5 Batas Penalti Serial Rugger:** Pastikan pembuat dengan ≥6 peluncuran dan 0 kelulusan dikunci pada skor maksimum 25 (Red Band).
- [ ] **4.6 Akordeon Penjelasan "Why this score?":** Buka akordeon untuk meninjau penjelasan matematis Bayesian Laplace smoothing.
- [ ] **4.7 Aksi Tambah ke Watchlist:** Klik "+ Add to Watchlist" -> pastikan `POST /api/watchlist` berhasil dan tombol beralih menjadi "✓ In Watchlist".
- [ ] **4.8 Tampilan Manajemen Watchlist (`/watchlist`):**
  - Pastikan kartu deployer yang dilacak menampilkan pita reputasi, total peluncuran, dan indikator peluncuran baru.
  - Klik "Remove" -> pastikan deployer dihapus dari watchlist seketika.
- [ ] **4.9 Pengecekan Batas Kuota:** Coba tambahkan deployer ke-31 -> pastikan muncul pesan galat batas kuota HTTP 422 Unprocessable Entity.

---

## Scenario 05: Real-Time Launch Feed & Ticker Tape
**Target Routes:** `/feed`, `/api/feed/stream`

- [ ] **5.1 Ticker Tape Langsung:** Buka `/feed` -> pastikan pita ticker di bagian atas bergulir terus-menerus menampilkan peluncuran token terkini.
- [ ] **5.2 Polling Blok Real-Time:** Pastikan event blok baru dan peluncuran token genesis dialirkan ke tabel feed secara otomatis setiap 2 detik.
- [ ] **5.3 Tab Filter Kategori:** Beralih antara tab "Most Traded", "New Launches", "Near Graduation", dan "Repeat Deployers" -> pastikan tabel memfilter data dengan presisi.
- [ ] **5.4 Jeda Otomatis Saat Tab Tidak Aktif (Visibility Pausing):** Pindah ke tab browser lain selama 20 detik -> kembali ke tab -> pastikan polling berlanjut tanpa duplikasi data atau kebocoran memori.
- [ ] **5.5 Drawer Trade Inspector:** Klik baris token pada tabel feed -> pastikan drawer samping Trade Inspector terbuka menampilkan buku besar transaksi langsung.

---

## Scenario 06: Macro Census & Methodology Education
**Target Routes:** `/census`, `/api/census`, `/how`, `/docs`

- [ ] **6.1 Analisis Sensus Makro (`/census`):** Pastikan KPI makro ekosistem (Total Deployers, Graduated Rate, Serial Ruggers, Total Tokens), grafik distribusi SVG, dan tabel Top 20 Repeat Creators terisi dengan benar.
- [ ] **6.2 Panduan Metodologi Riset (`/how`):** Pastikan alur kerja 4-langkah, definisi ambang batas delta Since Last Check, dan diagram panduan investigasi forensik tampil jelas.
- [ ] **6.3 Dokumentasi Teknis & API (`/docs`):** Pastikan spesifikasi formula matematis, contoh endpoint REST API, dan tabel batas laju panggilan (*rate limits*) terdokumentasi lengkap.

---

## Scenario 07: Library Bulk Export, Markdown Export & JSON Import
**Target Routes:** `/dossiers`, `/api/library/export`, `/api/library/import`, `/api/dossier/[ca]/export-md`

- [ ] **7.1 Ekspor Markdown Dossier Tunggal:** Pada header berkas kasus, klik "Export MD" -> pastikan berkas `.md` terunduh lengkap beserta metadata YAML frontmatter.
- [ ] **7.2 Ekspor Massal Pustaka (Bulk JSON Export):** Pada halaman `/dossiers`, klik "Export All" -> pastikan berkas JSON yang memuat seluruh berkas kasus pengguna terunduh.
- [ ] **7.3 Pemulihan & Impor Berkas JSON:** Klik "+ Import" -> unggah berkas JSON -> pastikan `POST /api/library/import` mengurai, memvalidasi skema dengan Zod, dan menggabungkan berkas kasus tanpa kerusakan data atau duplikasi.

---

## Scenario 08: Account Settings & Cascade Deletion
**Target Routes:** `/me`, `/api/me`

- [ ] **8.1 Pembaruan Handle Peneliti:** Buka `/me` -> ubah handle menjadi string alfanumerik -> klik "Save Handle" -> pastikan pembaruan tersimpan.
- [ ] **8.2 Penghapusan Akun Menyeluruh (Cascade Purge):** Klik "Delete Account" -> ketik alamat dompet secara persis -> konfirmasi penghapusan -> pastikan sesi dihancurkan dan seluruh dossier, snapshot, serta watchlist milik pengguna terhapus bersih dari database.

---

## Scenario 09: Constellation Network Topology & Wallet Interactive Map
**Target Routes:** `/map`, `/map/[address]`, `/d/[ca]`

- [ ] **9.1 Graf Konstelasi Multi-Token:** Buka `/map` -> pastikan graf konstelasi force-directed SVG merender simpul deployer dan token beserta garis penghubungnya.
- [ ] **9.2 Interaktivitas Node & Tooltip:** Arahkan kursor ke simpul dompet -> pastikan tooltip menampilkan alamat dan arus bersih (*net flow*) tanpa kedipan (*anti-flicker*).
- [ ] **9.3 Drawer Token Terhubung:** Klik simpul deployer -> pastikan daftar berkas kasus token yang terhubung dimuat dengan tautan langsung.

---

## Scenario 10: Trade Flow Candlestick Chart & Order Flow Dynamics
**Target Routes:** `/d/[ca]`

- [ ] **10.1 Rendering Candlestick SVG:** Pastikan bilah candlestick (1m/5m/15m) merender batas open, high, low, close secara akurat.
- [ ] **10.2 Garis Tonggak Kelulusan:** Untuk token yang telah lulus, pastikan garis horizontal menandai harga dan blok kelulusan kurva.
- [ ] **10.3 Panel Tekanan Order:** Pastikan bilah distribusi volume beli vs volume jual menghitung keseimbangan arus bersih secara presisi.

---

## Scenario 11: Since Last Check Delta Tracking & Scout Remembers Persistence
**Target Routes:** `/d/[ca]`

- [ ] **11.1 Evaluasi Delta:** Modifikasi kapitalisasi pasar token atau skor pada fixture pengujian -> muat ulang halaman -> pastikan Since Last Check menampilkan pil delta visual (misal: `+14.2% FDV`, `+5 Score`).
- [ ] **11.2 Penyimpanan Catatan Scout Remembers:** Tambahkan catatan pada Panel Riset -> muat ulang tanpa menyimpan sesi -> pastikan klien memulihkan status coretan yang belum tersimpan.

---

## Scenario 12: Search & Fast Omnisearch Navigation
**Target Routes:** `/`, `/feed`, `/dossiers`, `/d/[ca]`

- [ ] **12.1 Input Pencarian Global:** Masukkan alamat kontrak pada omnisearch header -> tekan Enter -> diarahkan ke `/d/[ca]`.
- [ ] **12.2 Pencarian Alamat Deployer:** Masukkan alamat deployer -> diarahkan ke `/deployer/[address]`.
- [ ] **12.3 Penanganan Token Tidak Valid:** Masukkan alamat non-Pons V2 -> pastikan muncul halaman fallback yang ramah ("Not a Pons V2 Token") dengan tautan kembali ke beranda.

---

## Scenario 13: Responsive Breakpoints & Mobile/Tablet Ergonomics
**Target Viewports:** 1920x1080 (Desktop), 1024x768 (Tablet), 375x812 (Mobile)

- [ ] **13.1 Tampilan Desktop (1440p / 1080p):** Pastikan tampilan split 2-kolom dan tata letak `max-w-[1600px]` tampil sempurna tanpa pemotongan horizontal.
- [ ] **13.2 Tampilan Tablet (768px–1024px):** Pastikan bilah samping tersusun vertikal dengan target sentuh yang nyaman.
- [ ] **13.3 Tampilan Mobile (<640px):** Pastikan header menciut ke menu drawer, tabel mengaktifkan pengguliran horizontal, dan tombol memiliki ukuran sentuh minimal 44px.

---

## Scenario 14: Tosca Canvas Theme & WCAG AA Accessibility Compliance
**Target Standards:** WCAG AA Contrast, Reduced Motion, Keyboard Navigation

- [ ] **14.1 Verifikasi Rasio Kontras:** Pastikan seluruh teks di atas latar Tosca Utama (`#0D746E`) dan Dark Slate (`#042F2E`) memenuhi rasio kontras >4.5:1.
- [ ] **14.2 Navigasi Keyboard:** Gunakan tombol Tab untuk menelusuri seluruh elemen interaktif -> pastikan cincin fokus terlihat jelas (`focus-visible:ring-2`).
- [ ] **14.3 Aksesibilitas Gerak (Reduced Motion):** Aktifkan `prefers-reduced-motion` di browser -> pastikan transisi dan animasi mereda secara halus.

---

## Scenario 15: Security Guardrails, Rate Limiting & Input Sanitization
**Target Protection:** XSS, SQLi, Rate Limits, Schema Validation

- [ ] **15.1 Sanitasi XSS:** Coba kirim tag HTML / skrip berbahaya pada teks tesis atau catatan -> pastikan seluruh tag disanitasi secara aman.
- [ ] **15.2 Pembatasan Laju API Publik (Rate Limiting):** Kirim 65 permintaan cepat ke endpoint publik -> pastikan server merespons dengan status HTTP 429 Too Many Requests.
- [ ] **15.3 Validasi Skema Ketat:** Coba kirim properti yang tidak terdaftar pada body POST -> pastikan skema Zod menolak muatan tersebut secara ketat.
