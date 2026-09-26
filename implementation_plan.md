# Implementation Plan — TICKET-25: Implementasi endpoint GET /api/deployer/:address/dossiers

## 1. Konteks & Tujuan
Membuat route handler `GET /api/deployer/:address/dossiers` di `app/api/deployer/[address]/dossiers/route.ts`. Endpoint ini menyuplai data untuk komponen "Scout Remembers" dengan mencari seluruh record dossier milik user yang terotentikasi yang memiliki relasi dengan deployer terkait (berdasarkan token yang diluncurkan oleh deployer tersebut di `deployer_launches`).

## 2. Rujukan Dokumen
- `global-docs/prd.md` (Section 4: Scout Remembers, Section 11: API Endpoints)
- `docs/system-design.md` (Connected Dossiers & Scout Remembers Data Flow)
- `lib/db/schema.ts` (`dossiers`, `deployerLaunches`, `dossierQuestions`)
- `lib/auth/session.ts` (`getSession`)
- `types/dossier.ts` & `types/score.ts`
- `nodes/scout/tickets/TICKET-25-api-get-deployer-dossiers.md`

## 3. Spesifikasi Teknis
- **Path Route:** `app/api/deployer/[address]/dossiers/route.ts`
- **Method:** `GET`
- **Validasi Param `:address`:**
  - Regex: `^0x[0-9a-fA-F]{40}$` -> 400 Bad Request jika format tidak valid.
- **Autentikasi Session:**
  - Memerlukan session cookie aktif dengan `wallet_address`. Jika tidak ada -> 401 Unauthorized `{ ok: false, error: "Unauthorized: Wallet session required" }`.
- **Query Scoped & Relasi Deployer:**
  - Cari daftar `token_address` yang diluncurkan oleh `:address` dari tabel `deployer_launches`.
  - Cari dossier milik user (`wallet_address = session.wallet_address`) yang memiliki `contract_address` sesuai dengan daftar token launch deployer.
  - Ambil pertanyaan riset pertama (`dossier_questions` urut `position ASC` limit 1) untuk setiap dossier terkait.
  - Urutkan hasil dossier berdasarkan `createdAt` descending.
- **Keluaran (Response Payload):**
  - 200 OK `{ ok: true, dossiers: [{ id, contractAddress, symbol, name, status, reason, decisionReason, thesis, firstQuestion, createdAt, updatedAt }] }`

## 4. Tahapan Pengerjaan (TDD Lifecycle)

### 4.1 Red Phase (Testing Terlebih Dahulu)
- Membuat test suite `app/api/deployer/[address]/dossiers/__tests__/route.test.ts`.
- Skenario pengujian:
  1. Validasi ekspor fungsi `GET` dan `handleGetDeployerDossiers` di `app/api/deployer/[address]/dossiers/route.ts`.
  2. Mengembalikan 400 Bad Request jika `:address` format invalid.
  3. Mengembalikan 401 Unauthorized jika user tidak memiliki session valid.
  4. Mengembalikan 200 OK dengan array kosong `[]` jika tidak ada dossier user yang terhubung ke deployer.
  5. Mengembalikan 200 OK dengan list ringkasan dossier yang cocok terurut `createdAt` descending beserta first question.
  6. Memverifikasi Red Phase gagal sebelum implementasi kode.

### 4.2 Green Phase (Implementasi Route Handler)
- Menambahkan tipe response `ConnectedDossierSummary` dan `GetDeployerDossiersResponseBody` di `types/dossier.ts` / `types/score.ts`.
- Mengimplementasikan `handleGetDeployerDossiers` dan route handler `GET` di `app/api/deployer/[address]/dossiers/route.ts` tanpa komentar (zero-comment policy).
- Menjalankan `npm test` hingga 100% lulus.

### 4.3 Refactor & Pre-flight Phase
- Memverifikasi kepatuhan:
  - `npm test` (seluruh suite lulus)
  - `npx tsc --noEmit` (0 errors)
  - `npm run lint` (0 errors, 0 warnings)
  - `npm run build` (Clean Next.js Turbopack build)

### 4.4 Penyelesaian Tiket & Dokumentasi
- Mengupdate status `TICKET-25-api-get-deployer-dossiers.md` ke `Done` dan mengisi `AI Execution Log & Output`.
- Memperbarui checklist di `docs/development-planning.md`.
- Menambahkan entri log ke `nodes/scout/CHANGELOG.md`.
- Menyinkronkan Knowledge Graph via `graphify update`.
