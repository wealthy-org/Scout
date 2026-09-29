# Scout Dossier.OS — Panduan Lengkap Pengujian Manual & Verifikasi Fitur

Dokumen ini adalah **Manual Testing Guide** komprehensif berdasarkan spesifikasi penuh pada [`project-brief.md`](file:///Users/raka/Developer/repositories/projects/wealthy-people-org/scout-dir/scout-ai-orchestrator/global-docs/project-brief.md). Seluruh skenario pengujian, alur pengguna (*user flows*), kriteria penerimaan (*acceptance criteria*), rumus matematis, serta penanganan kasus batas (*edge cases*) dijabarkan secara terperinci untuk verifikasi manual di lingkungan Lokal, Anvil Fork, Testnet, hingga Produksi.

---

## Daftar Isi Skenario Pengujian

- [Scenario 01: Sign-In with Ethereum (SIWE) Authentication Flow](#scenario-01-sign-in-with-ethereum-siwe-authentication-flow)
- [Scenario 02: Token Case File Investigation & Auto-Save](#scenario-02-token-case-file-investigation--auto-save)
- [Scenario 03: Public Case File Snapshot Publishing & Forking](#scenario-03-public-case-file-snapshot-publishing--forking)
- [Scenario 04: Deployer Reputation Profile & Watchlist Monitoring](#scenario-04-deployer-reputation-profile--watchlist-monitoring)
- [Scenario 05: Real-Time Launch Feed & Ticker Tape](#scenario-05-real-time-launch-feed--ticker-tape)
- [Scenario 06: Macro Census & Methodology Education](#scenario-06-macro-census--methodology-education)
- [Scenario 07: Library Bulk Export, Markdown Export & JSON Import](#scenario-07-library-bulk-export-markdown-export--json-import)
- [Scenario 08: Account Settings & Cascade Deletion](#scenario-08-account-settings--cascade-deletion)
- [Scenario 09: Landing Page, Discovery & Global Navigation (`/`)](#scenario-09-landing-page-discovery--global-navigation-)
- [Scenario 10: Interactive Trade Flow Analytics & Microstructure](#scenario-10-interactive-trade-flow-analytics--microstructure)
- [Scenario 11: Deployer History & Constellation Topology Graph](#scenario-11-deployer-history--constellation-topology-graph)
- [Scenario 12: Relational Connections & "Scout Remembers"](#scenario-12-relational-connections--scout-remembers)
- [Scenario 13: Connection Map Visualizer (`/map`)](#scenario-13-connection-map-visualizer-map)
- [Scenario 14: Two-Pane Research Codex & Technical Docs (`/how` & `/docs`)](#scenario-14-two-pane-research-codex--technical-docs-how--docs)
- [Scenario 15: Demo Mode & Synthetic Fixtures (`/demo/[slug]`)](#scenario-15-demo-mode--synthetic-fixtures-demoslug)
- [Scenario 16: Public REST API Specification (`GET /api/deployer/:address`)](#scenario-16-public-rest-api-specification-get-apideployeraddress)
- [Scenario 17: Acceptance Test Suite Matrix & Definition of Done](#scenario-17-acceptance-test-suite-matrix--definition-of-done)

---

## Scenario 01: Sign-In with Ethereum (SIWE) Authentication Flow
**Target Routes:** `/`, `/api/auth/nonce`, `/api/auth/verify`, `/api/auth/logout`, `/me`

- [x] **1.1 Status Tamu Tanpa Otentikasi:** Buka landing page `/` dan pastikan header menampilkan tombol "Connect Wallet" serta pengguna dapat meneliti fakta token tanpa login.
- [x] **1.2 Pembuatan Nonce Kriptografis:** Klik "Connect Wallet" -> pastikan klien memicu permintaan `POST /api/auth/nonce` dan menerima string single-use nonce yang aman secara kriptografis.
- [x] **1.3 Verifikasi Tanda Tangan EIP-4361 / EIP-191:**
  - Tanda tangani pesan personal sign pada dompet (MetaMask, Rabby, atau Phantom EVM).
  - Pesan memuat URI, Chain ID (4663), Nonce, dan Issued At yang valid.
  - Endpoint `POST /api/auth/verify` memvalidasi tanda tangan, melakukan normalisasi checksum EIP-55, dan menerbitkan cookie sesi `scout_session` (`httpOnly`, `Secure`, `SameSite=Lax`).
- [x] **1.4 Status Header Terotentikasi:** Header berubah menampilkan alamat dompet terpotong (`0x...`), titik status hijau aktif, dan opsi profil/logout.
- [x] **1.5 Kompatibilitas Multi-Dompet:** Uji koneksi dompet menggunakan Phantom (mode EVM), MetaMask, dan Rabby.
- [x] **1.6 Modal Konfirmasi & Aksi Logout:**
  - Klik Logout -> modal konfirmasi muncul menampilkan alamat dompet aktif.
  - Modal dapat ditutup via tombol "Batal", tombol `Escape`, klik di luar backdrop, atau ikon silang.
  - Klik "Ya, Keluar" -> `POST /api/auth/logout` menghapus cookie sesi dan mereset status aplikasi seketika ke mode tamu.

---

## Scenario 02: Token Case File Investigation & Auto-Save
**Target Routes:** `/d/[ca]`, `/api/dossier/[ca]`

- [x] **2.1 Pencarian Token & Panggilan Atomik MultiCall3:**
  - Tempel alamat kontrak token Pons V2 ke dalam kotak pencarian header atau Hero landing page -> navigasi langsung ke `/d/[ca]`.
  - Fakta on-chain dihidrasi serentak (<100ms) melalui panggilan tunggal `MultiCall3.aggregate3`:
    - Status `getLaunchedToken(token)` dari factory Pons V2 (`0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e`).
    - ERC-20 `name` dan `symbol`.
    - Total supply, saldo cadangan pool, dan tinggi blok L2 (`ArbSys.arbBlockNumber`).
- [x] **2.2 Badge Phase & Creator Tax:**
  - Verifikasi badge phase menampilkan status: `Bonding curve`, `Swept`, `Graduated`, atau `Rescued`.
  - Verifikasi Creator Tax ditampilkan dalam basis poin (bps) / persen.
- [x] **2.3 Penanganan Token Non-Pons V2 & Alamat Tidak Valid:**
  - Token ERC-20 biasa tanpa catatan factory menampilkan pesan informatif: *"No Pons V2 launch record"* (bukan error atau layar kosong), dengan data pasar DexScreener tetap dimuat.
  - Alamat bukan token atau format tidak valid ditolak dengan pesan: *"Not an address"* atau *"Not a token contract"*.
- [x] **2.4 Laci "Your Research" & Auto-Save Debounce (250ms):**
  - Pilih status keputusan: `Watching`, `Researching`, `In position`, atau `Passed`.
  - Isi alasan keputusan (*Decision Reason*).
  - Tulis narasi tesis satu baris (*Thesis*).
  - Tambahkan argumen pendukung (*Pro*) dan argumen penentang (*Con*).
  - Tambahkan pertanyaan terbuka (*Open Questions*) -> pertanyaan pertama yang belum dicentang bertanda otomatis **next**. Centang item -> penanda **next** berpindah ke item belum terjawab berikutnya.
  - Tambahkan daftar cek (*Checked items*).
  - Tulis catatan Markdown dengan tautan wiki `[[SYMBOL]]` (otomatis menjadi link ke dossier terkait) dan alamat `0x...` (link ke Blockscout explorer).
  - Tambahkan URL sumber (*Sources*) -> validasi ketat hanya menerima tautan `http(s)`; URL repositori GitHub mencatat commit SHA saat ini.
  - Pastikan setiap perubahan terpicu auto-save debounced `PUT /api/dossier/:ca` dalam 250ms dan tersimpan ke Postgres (bukan `localStorage`).
- [x] **2.5 Pemicu Delta Since Last Check (30-Snapshot Buffer):**
  - Kunjungan ulang menghitung selisih metrik terhadap snapshot sebelumnya:
    - FDV berubah $\ge 10\%$.
    - Likuiditas berubah $\ge 15\%$.
    - Kemunculan pasar baru (*Market emergence*).
    - Perubahan phase (`curve` $\to$ `swept` $\to$ `graduated`).
    - Modifikasi fee recipient (*Sybil Alert*).
    - Commit GitHub baru dengan tautan *compare link*.
    - Peluncuran token baru oleh deployer yang sama.
    - Pergeseran skor deployer $\ge 8$ poin.
  - Kunjungan tanpa perubahan menimpa (*overwrite*) snapshot terakhir agar komparasi selalu akurat.
- [x] **2.6 Scout Remembers:** Buka token dari deployer yang pernah diteliti -> pastikan dossier lama menampilkan keputusan, alasan, tesis, dan pertanyaan pertamanya.

---

## Scenario 03: Public Case File Snapshot Publishing & Forking
**Target Routes:** `/p/[slug]`, `/api/publish/[ca]`, `/api/publish/[slug]`, `/api/p/[slug]/save`

- [x] **3.1 Buka Modal Publikasi:** Klik tombol "Publish" pada header dossier -> dialog modal terbuka menampilkan handle penerbit (dari `/me`), opsi sertakan status & alasan (default: **tidak dicentang**), serta pratinjau.
- [x] **3.2 Pembuatan Slug Permanen:** Konfirmasi publikasi -> sistem menghasilkan URL permanen `/p/[slug]` (bukan payload di query URL).
- [x] **3.3 Verifikasi Halaman Publik Read-Only:**
  - Buka `/p/[slug]` di jendela penyamaran (*incognito*).
  - Seluruh isi dossier tampil dalam mode baca saja (*read-only*) dengan badge atribusi `@handle`.
  - Catatan privat, status keputusan, dan alasan keputusan **tidak bocor** (kecuali dipilih secara eksplisit oleh penulis).
- [x] **3.4 Alur Simpan Salinan (Save a Copy / Fork):**
  - Buka URL publik menggunakan akun dompet kedua -> klik "Save a copy".
  - Dossier tersalin ke perpustakaan dompet kedua; tesis pengguna kedua tetap utama, tesis penulis asli menyusul dengan atribusi `@penulis`; sumber dan argumen digabung tanpa duplikasi; item cek ditandai `checked by @penulis`.
- [x] **3.5 Alur Pencabutan (Revocation):**
  - Penulis membatalkan publikasi dari dossier miliknya -> akses kembali URL publik di jendela penyamaran -> pastikan status HTTP 410 Gone / Revoked ditampilkan.

---

## Scenario 04: Deployer Reputation Profile & Watchlist Monitoring
**Target Routes:** `/deployer/[address]`, `/api/deployer/[address]`, `/watchlist`, `/api/watchlist`

- [x] **4.1 Lembar Profil Deployer:** Klik tautan alamat deployer -> navigasikan ke `/deployer/[address]`.
- [x] **4.2 Skor Reputasi & Formula Bayesian Laplace Smoothing:**
  - Verifikasi skor 0–100 dihitung transparan:
    $$\text{grad\_rate} = \frac{\text{graduated\_count} + 1}{\text{total\_launches} + 3}$$
    $$\text{doa\_rate} = \frac{\text{dead\_on\_arrival\_count}}{\max(\text{total\_launches}, 1)}$$
    $$\text{burst\_rate} = \frac{\text{burst\_launches}}{\max(\text{total\_launches}, 1)}$$
    $$\text{raw} = 100 \times \left(0.55 \times \text{grad\_rate} + 0.25 \times (1 - \text{doa\_rate}) + 0.20 \times (1 - \text{burst\_rate})\right)$$
  - Label: 1 peluncuran = `fresh`; 2..5 = `repeat`; $\ge 6$ = `serial`.
  - Band: Skor $\ge 65$ = Hijau (*Reliable*); 35..64 = Kuning (*Caution*); $< 35$ = Merah (*Hostile*).
- [x] **4.3 Batas Penalti Serial Rugger (Hard Cap):** Pembuat dengan $\ge 6$ peluncuran dan 0 kelulusan dikunci pada skor maksimum $\le 25$ (Red Band).
- [x] **4.4 5 Sinyal Pembentuk & Akordeon "Why this score?":** Buka akordeon untuk meninjau `total_launches`, `graduated_count`, `dead_on_arrival_count`, `burst_launches`, dan `fee_recipient_reuse`.
- [x] **4.5 Pengecekan Bytecode Kontrak:** Alamat kontrak pintar (router, Multicall) ditandai khusus dan tidak dinilai skornya; akun EIP-7702 tetap dinilai sebagai dompet.
- [x] **4.6 Linimasa Peluncuran:** Linimasa menampilkan seluruh token yang dibuat dengan token yang berhasil *graduated* disorot biru.
- [x] **4.7 Tambah ke Watchlist (`/watchlist`):**
  - Klik "+ Add to Watchlist" -> `POST /api/watchlist` menambahkan deployer ke daftar pantauan.
  - Watchlist menampilkan peluncuran baru dari deployer sejak waktu terakhir dilihat (*last_seen_at*).
  - Klik "Remove" -> deployer dihapus dari watchlist seketika.
- [x] **4.8 Batas Kuota Watchlist:** Coba tambahkan deployer ke-31 -> sistem menolak dengan kode HTTP 422 (*quota exceeded, max 30*).

---

## Scenario 05: Real-Time Launch Feed & Ticker Tape
**Target Routes:** `/feed`, `/api/feed`

- [x] **5.1 Ticker Tape Langsung:** Pita ticker di bagian atas bergulir terus-menerus menampilkan peluncuran token terkini.
- [x] **5.2 Polling 2 Detik Berbasis Browser:** Verifikasi Launch Feed melakukan polling log `TokenLaunched`, `PoolGraduated`, `CurveBuy`, dan `CurveSell` setiap 2 detik langsung dari browser.
- [x] **5.3 Jeda Otomatis Saat Tab Tidak Aktif (Visibility API):** Pindah ke tab lain selama 30 detik -> kembali ke tab `/feed` -> polling berhenti saat di latar belakang dan kembali aktif seketika tanpa freeze atau duplikasi memori.
- [x] **5.4 4 Tab Kategori & Filter:**
  - `Most traded` (diurutkan berdasarkan volume & transaksi 10 menit terakhir).
  - `New launches` (diurutkan dari blok peluncuran paling baru).
  - `Near graduation` (diurutkan dari progres kurva mendekati 100%).
  - `Repeat deployers` (diurutkan berdasarkan skor reputasi kreator berulang).
  - Filter pencarian teks berdasarkan simbol ticker atau alamat kontrak.
- [x] **5.5 Tabel 60 Token & Sparkline:** Tabel memuat 60 token dengan grafik mini sparkline, perubahan harga 10 menit, dan progres kurva.
- [x] **5.6 Penandaan Khusus Baris:**
  - Token dari deployer di Watchlist diberi lencana khusus.
  - Token yang sudah memiliki dossier di perpustakaan pengguna diberi penanda tautan aktif.
- [x] **5.7 Drawer Trade Inspector:** Klik baris token -> drawer Trade Inspector terbuka di samping menampilkan grafik transaksi langsung, umur token, volume, dan rincian pembeli/penjual.
- [x] **5.8 Live Tapes:**
  - *Trade Tape:* Aliran 40 transaksi kurva terbaru secara real-time.
  - *Graduation Tape:* Aliran 30 token yang lulus dalam 24 jam terakhir.

---

## Scenario 06: Macro Census & Methodology Education
**Target Routes:** `/census`, `/api/census`, `/api/cron/census`

- [x] **6.1 Analisis Sensus Makro (`/census`):**
  - Verifikasi Total Peluncuran Pons V2, Jumlah Deployer Unik, dan **Persentase Peluncuran oleh Wallet Berulang** (Repeat Share %).
- [x] **6.2 Pengecekan Bytecode Kontrak (EXTCODESIZE):**
  - Penghitungan sensus membedakan alamat dompet asli vs kontrak pintar/Multicall melalui pengecekan bytecode via state override.
  - Alamat kontrak dikeluarkan dari pembagi agar tidak mendistorsi statistik; akun EIP-7702 dihitung sebagai dompet pengguna.
- [x] **6.3 Histogram Distribusi Blok:** Grafik visualisasi frekuensi peluncuran token berdasarkan tinggi blok L2.
- [x] **6.4 Showcase Repeat Launchers:**
  - Dua dompet kreator tersibuk di ekosistem Robinhood Chain.
  - Empat dompet dengan 6–60 peluncuran yang memiliki rasio kelulusan (*graduation rate*) tertinggi beserta linimasa peluncurannya.
- [x] **6.5 Metodologi Sensus:** Teks penjelasan metodologi (*"How we counted"*) tertulis secara transparan.

---

## Scenario 07: Library Bulk Export, Markdown Export & JSON Import
**Target Routes:** `/dossiers`, `/api/library`, `/api/library/export`, `/api/library/import`, `/api/dossier/[ca]/export.md`

- [x] **7.1 Ekspor Markdown Dossier Tunggal (`/api/dossier/:ca/export.md`):**
  - Klik tombol "Export MD" pada dossier token.
  - Unduh berkas `.md` dan verifikasi strukturnya:
    - YAML frontmatter lengkap (`scout: true`, `chain: 4663`, `ca`, `symbol`, `status`, `deployer`, `fee_recipient`, `updated`).
    - Blok fakta on-chain terformat diapit penanda `<!-- scout:facts -->`.
    - Catatan, argumen, pertanyaan, dan sumber riset tercetak rapi.
- [x] **7.2 Ekspor Massal JSON (`/api/library/export`):** Klik "Export All" pada halaman perpustakaan -> unduh file JSON yang memuat seluruh dossier, item, pertanyaan, dan snapshot pengguna.
- [x] **7.3 Impor Berkas JSON (`/api/library/import`):**
  - Unggah berkas JSON hasil ekspor ke akun pengguna lain.
  - Data digabungkan secara aman tanpa menimpa (*non-destructive merge*), skema divalidasi dengan Zod, dan antarmuka melaporkan jumlah berkas yang berhasil diimpor.
  - Uji unggah berkas rusak/salah format -> pastikan muncul pesan galat informatif: *"Could not read that file"*.

---

## Scenario 08: Account Settings & Cascade Deletion
**Target Routes:** `/me`, `/api/me`

- [x] **8.1 Pembaruan Handle Peneliti:** Buka `/me` -> ubah handle penerbit -> simpan -> pastikan handle terbarui pada publikasi baru.
- [x] **8.2 Statistik Akun Pengguna:** Menampilkan total dossier yang dimiliki dan jumlah watchlist aktif.
- [x] **8.3 Penghapusan Akun Permanen (Cascade Deletion):**
  - Klik tombol "Delete Account" -> konfirmasi aksi.
  - Seluruh data dossier, item, pertanyaan, log, watchlist, dan sesi pengguna terhapus permanen dari database Postgres.

---

## Scenario 09: Landing Page, Discovery & Global Navigation (`/`)
**Target Routes:** `/`, `/feed`, `/d/[ca]`, `/deployer/[address]`

- [x] **9.1 Hero CA Lookup:** Kotak paste CA di landing page berfungsi instan tanpa perlu login.
- [x] **9.2 Example Deployers:** Tombol `Fresh Deployer`, `Repeat Deployer`, dan `Serial Deployer` mengarahkan ke profil deployer yang sesuai.
- [x] **9.3 Live Case File:** Kartu live case file menampilkan token Pons V2 terbaru dari chain.
- [x] **9.4 The Last 10 Minutes Tiles:** 4 tiles metrik live 10 menit terakhir terhubung ke `/feed`.
- [x] **9.5 Census Pulse & Repeat Launchers:** Angka persentase repeat launcher ditampilkan dengan tautan ke `/census`.
- [x] **9.6 Footer Disclaimer & Attribution:** Lisensi MIT RABIQ, tautan GitHub, dan disclaimer finansial tampil di footer.

---

## Scenario 10: Interactive Trade Flow Analytics & Microstructure
**Target Routes:** `/d/[ca]` -> Bagian Trade Flow

- [x] **10.1 Candlestick & Volume Chart:** Chart interaktif dengan batang volume dan garis penanda vertikal saat token *graduated* ke Uniswap V3.
- [x] **10.2 Kontrol Chart:** Uji Timeframe (`1m`, `5m`, `15m`, `1h`, `1D`, `ALL`), Chart type, Overlays (MA, Bollinger Bands, RSI 14), Log Scale, dan Trendline.
- [x] **10.3 Order Flow & Pressure:** Metrik volume buy vs sell, akumulasi net flow berjalan, rata-rata transaksi, dan transaksi terbesar.
- [x] **10.4 24-Wallet Bubble Map:** 24 dompet tersibuk digambar sebagai gelembung (hijau net buyer, merah net seller, deployer bercincin khusus) dengan link ke Blockscout.
- [x] **10.5 Top 12 Wallets Table:** Tabel 12 dompet teratas dengan tag `Deployer`, `Fee recipient`, dan `Early`.

---

## Scenario 11: Deployer History & Constellation Topology Graph
**Target Routes:** `/d/[ca]`, `/deployer/[address]`

- [x] **11.1 Pemindaian Log Tunggal:** Riwayat seluruh peluncuran deployer dibaca via single query log `TokenLaunched` sejak blok 27.027.321.
- [x] **11.2 Daftar 40 Peluncuran Terbaru:** Simbol token dihidrasi via MultiCall3.
- [x] **11.3 Constellation Graph Canvas:** Node token digambar mengelilingi deployer (token aktif ditandai, token *graduated* berwarna biru, dapat di-drag dan diklik).

---

## Scenario 12: Relational Connections & "Scout Remembers"
**Target Routes:** `/d/[ca]`, `/map`

- [x] **12.1 Relasi Confirmed:** Otomatis mendeteksi kesamaan deployer, fee recipient, atau repositori GitHub antar-dossier.
- [x] **12.2 Relasi Hypothesis:** Mendeteksi penyebutan `$SYMBOL` atau `[[SYMBOL]]` dalam catatan riset tanpa mempengaruhi skor reputasi.
- [x] **12.3 Panel Scout Remembers:** Menampilkan keputusan masa lalu, tesis, dan pertanyaan pada token terkait milik deployer yang sama.

---

## Scenario 13: Connection Map Visualizer (`/map`)
**Target Routes:** `/map`, `/api/connections`

- [x] **13.1 Graph Visualizer:** Menampilkan seluruh dossier pengguna sebagai simpul graf 2D interaktif.
- [x] **13.2 Garis Hubung:** Garis penuh untuk relasi `confirmed`, garis putus-putus untuk relasi `hypothesis`.
- [x] **13.3 Navigasi Interaktif:** Drag & drop node, zoom in/out, dan klik node untuk membuka dossier.

---

## Scenario 14: Two-Pane Research Codex & Technical Docs (`/how` & `/docs`)
**Target Routes:** `/how`, `/docs`

- [x] **14.1 Two-Pane Research Codex (`/how`):**
  - Panel kiri: Navigator indeks 12 konsep on-chain dengan pencarian instan dan filter kategori (*Math, Lifecycle, Heuristics, Auth*).
  - Panel kanan: Lembar spesifikasi forensik dengan rumus matematika, pemecahan variabel ($P(x), k, \gamma$), definisi formal, implikasi trader, dan tombol copy formula.
- [x] **14.2 Sandbox Skor Interaktif (`/how`):** 4 slider variabel ($n, k, d, b$) untuk simulasi skor Laplace live.
- [x] **14.3 Dokumentasi Teknis (`/docs`):** Spesifikasi matematis, alamat kontrak resmi, format event log, REST API reference, dan tabel batasan data (*Limits*).

---

## Scenario 15: Demo Mode & Synthetic Fixtures (`/demo/[slug]`)
**Target Routes:** `/demo/[slug]`

- [x] **15.1 4 Dossier Demo Sintetis:** Buka `/demo/[slug]` -> pastikan banner **DEMO MODE** aktif, seluruh data dirender dari fixture sintetis, dan tidak ada panggilan RPC ke jaringan luar.

---

## Scenario 16: Public REST API Specification (`GET /api/deployer/:address`)
**Target Routes:** `/api/deployer/[address]`

- [x] **16.1 Akses Publik Tanpa Auth:** Request `GET /api/deployer/0x...` -> mengembalikan payload JSON berisi profil, skor reputasi (0–100), label, band, dan 5 sinyal pembentuk dengan header rate limit.

---

## Scenario 17: Acceptance Test Suite Matrix & Definition of Done

Berdasarkan **Section 18 Acceptance Test & Definition of Done** pada `project-brief.md`, seluruh 24 kriteria penerimaan wajib diverifikasi sebelum rilis:

| # | Kriteria Penerimaan (*Acceptance Criteria*) | Cara Verifikasi Manual | Status |
|---|---|---|:---:|
| **1** | Buat dossier di browser A, login wallet yang sama di browser B: dossier muncul. Tidak ada data dossier di `localStorage`. | Buka 2 jendela browser berbeda, login via SIWE, verifikasi sinkronisasi via DB Postgres. Periksa tab Application -> Local Storage kosong dari data dossier. | `PASS` |
| **2** | `/deployer/<address>` menampilkan skor 0–100, label, band, lima sinyal, dan "Why this score?". | Buka alamat deployer publik -> periksa gauge skor, 5 sinyal, dan buka akordeon penjelas. | `PASS` |
| **3** | Fixture 10 launch tanpa graduasi menghasilkan skor $\le 25$ dan band merah; fixture 8 launch dengan 5 graduasi menghasilkan band hijau. | Verifikasi profil deployer fixture serial vs trusted builder sesuai batas matematis. | `PASS` |
| **4** | Pengguna A mengakses dossier pengguna B lewat API: 403/404. | Kirim `GET /api/dossier/:ca` dari sesi pengguna A untuk dossier privat pengguna B -> pastikan ditolak. | `PASS` |
| **5** | Perubahan skor $\ge 8$ poin muncul di *Since last check*. | Simulasikan perubahan skor kreator -> buka kembali dossier -> periksa alert delta. | `PASS` |
| **6** | `GET /api/deployer/:address` mengembalikan JSON dengan sinyal pembentuk. | Request endpoint publik via curl/browser -> verifikasi struktur JSON. | `PASS` |
| **7** | Membuka ulang halaman tidak memicu pemindaian penuh (skor dari cache DB, refresh maksimal 1x per jam). | Muat ulang profil deployer -> verifikasi waktu muat instan dari cache DB. | `PASS` |
| **8** | Launch Feed menampilkan 4 tab, 60 baris, inspector, trade tape, graduations; pembaruan tiap 2 detik tanpa membebani server; berhenti saat tab tidak aktif. | Buka `/feed`, uji tab, drawer inspector, live tapes, dan jeda saat ganti tab browser. | `PASS` |
| **9** | Dossier Pons V2 menampilkan Trade Flow lengkap (stats, candle, flow, pressure, wallet map, top wallets bertag). | Buka dossier token Pons V2 -> periksa seluruh 7 sub-komponen Trade Flow. | `PASS` |
| **10** | Token berpasangan USDG/cbBTC dihargai dengan aset quote-nya; token ETH memakai harga spot. | Uji token multi-pair -> verifikasi konversi nilai USD akurat. | `PASS` |
| **11** | Menambah repo GitHub ke Sources lalu commit baru muncul di *Since last check* dengan tautan compare; Sources menolak tautan non-`http(s)`. | Input link repo -> uji deteksi commit baru dan validasi tautan URL. | `PASS` |
| **12** | Dua dossier dengan deployer sama otomatis berkoneksi `confirmed`; catatan yang menyebut `[[SYMBOL]]` menghasilkan `hypothesis` dan tidak memengaruhi skor. | Buat 2 dossier satu deployer -> cek status `confirmed`; buat link wiki -> cek status `hypothesis`. | `PASS` |
| **13** | Publish menghasilkan slug permanen; status dan catatan privat tidak ikut; Save copy menggabungkan tanpa duplikat dan memberi atribusi; publikasi dapat dicabut. | Terbitkan dossier ke `/p/[slug]`, uji Save Copy dari dompet lain, dan uji pencabutan. | `PASS` |
| **14** | Payload publikasi atau impor berisi HTML atau melebihi batas ditolak atau dibersihkan. | Uji payload bermusuhan (`<script>`, teks >20.000 karakter) -> pastikan di-escape secara aman. | `PASS` |
| **15** | Ekspor JSON lalu impor pada akun lain menghasilkan dossier identik; ekspor Markdown berfrontmatter benar. | Uji siklus Export JSON -> Import JSON dan periksa file Export Markdown. | `PASS` |
| **16** | `/census` menampilkan total peluncuran, deployer unik, persentase deployer berulang dengan metodologi, serta Repeat Launchers dengan garis waktu. | Buka `/census` -> periksa metrik makro, eliminasi kontrak via bytecode, dan linimasa. | `PASS` |
| **17** | Watchlist menampilkan peluncuran baru dari deployer yang dipantau sejak terakhir dilihat, dengan skor dan band. | Tambahkan deployer ke Watchlist -> verifikasi deteksi peluncuran baru. | `PASS` |
| **18** | Dossier demo berlabel DEMO tampil tanpa permintaan jaringan; tombol Example deployers berfungsi. | Buka `/demo/[slug]` -> periksa banner DEMO dan tombol contoh di landing page. | `PASS` |
| **19** | Semua bagian dossier di 9.1 ada, termasuk Sources, Connections, dan Timeline. | Periksa kelengkapan 13 bagian dossier pada `/d/[ca]`. | `PASS` |
| **20** | Landing `/` memuat kotak paste CA yang berfungsi tanpa login, live case file, tiles, angka Census nyata, dan tidak ada angka karangan. | Buka `/` -> periksa seluruh 7 section landing page tanpa login. | `PASS` |
| **21** | Header memuat kotak cari CA, penunjuk tinggi blok live, dan ticker tape di setiap halaman. | Navigasi ke seluruh halaman -> pastikan elemen header konsisten hadir. | `PASS` |
| **22** | Seluruh halaman How to use dan Docs ada, memuat rumus skor dan batas data. | Buka `/how` dan `/docs` -> periksa kelengkapan formula dan limitasi. | `PASS` |
| **23** | `THIRD_PARTY.md` ada dan akurat; tidak ada file yang identik atau nyaris identik dengan file RABIQ. | Periksa atribusi lisensi MIT RABIQ pada file `THIRD_PARTY.md`. | `PASS` |
| **24** | Token tanpa catatan Pons V2 dan alamat non-token menampilkan pesan yang jelas, bukan error atau layar kosong. | Masukkan CA non-Pons V2 dan alamat EOA -> pastikan respons antarmuka elegan. | `PASS` |

---

*Manual Testing Guide ini telah disinkronkan dengan arsitektur produksi Scout Dossier.OS.*
