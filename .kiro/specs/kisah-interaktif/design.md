# Design — Kisah Interaktif

> Spec: `kisah-interaktif` · Berdasarkan `requirements.md` (Requirements-First).
> Stack: HTML5 + CSS3 + vanilla JavaScript (ES2020), data JSON statis,
> `localStorage`, GitHub Pages. Tanpa framework, tanpa build step, tanpa
> dependensi runtime. Lihat `.kiro/steering/tech.md`.

## 1. Gambaran arsitektur

Static site murni, tiga lapis:

```text
┌──────────────┐      fetch / import      ┌──────────────────┐
│  index.html  │ ───────────────────────▶ │  data/*.json     │
│  + render.js │   (teks, pilihan,       │  (1 file/cerita) │
│  (tampilan)  │    transisi, skor)       └──────────────────┘
└──────┬───────┘
       │ panggil
┌──────▼───────┐      simpan/muat        ┌──────────────────┐
│  engine.js   │ ───────────────────────▶ │  storage.js      │
│  (state,      │   localStorage          │  kunci            │
│   transisi,   │   kisah-interaktif:v1:* │  kisah-interaktif │
│   skor, akhir)│                         │  :v1:*            │
└──────────────┘                         └──────────────────┘
```

Tidak ada server, tidak ada jaringan saat runtime (di luar pemuatan file
statis itu sendiri). Alur data satu arah: JSON → engine → render → DOM.

## 2. Komponen

| File | Tanggung jawab | Tidak boleh |
|------|---------------|-------------|
| `index.html` | Shell: header, `<main id="adegan">`, area pilihan, footer. Memuat `src/main.js` sebagai modul. | Mengandung teks cerita atau logika. |
| `src/main.js` | Bootstrap: memuat daftar cerita, memulihkan progres via `storage.js`, mendelegasikan render pertama. | Mengandung alur cerita. |
| `src/engine.js` | State permainan (`ceritaId`, `adeganId`, `skor`, `riwayat`), fungsi `pilih(index)`, `akhir()`, `skorAkhir()`. Murni logika, tanpa DOM. | Menyentuh DOM atau `localStorage` langsung. |
| `src/storage.js` | `simpanProgres()`, `muatProgres()`, `hapusProgres()`, `tandaiAkhirDitemukan()`; bungkus `try/catch` untuk `localStorage` yang tidak tersedia (Req 8.3). | Mengetahui isi cerita. |
| `src/render.js` | Render beranda, adegan, pilihan, layar akhir, skor; mengganti palet/`suasana` dan ilustrasi SVG per adegan. | Mengubah state permainan. |
| `assets/style.css` | Layout responsif (ponsel dulu), palet per cerita dan per `suasana`. | — |
| `assets/illustrations.svg` | Simbol `<symbol>` SVG suasana (laut, hutan, candi, dll.), dipakai via `<use>`. | Aset berhak cipta / raster. |
| `data/*.json` | Sumber kebenaran alur cerita (lihat §3). | Logika. |
| `scripts/validate-story.mjs` | Validator node (tanpa dependensi) untuk data cerita; dijalankan hook dan manual. | — |

### Diagram urutan: satu langkah permainan

```text
Pemain        render.js        engine.js        storage.js        data JSON
  │  klik pilihan │                │                │                │
  │──────────────▶│ pilih(i)       │                │                │
  │               │───────────────▶│ hitung skor,   │                │
  │               │                │ tentukan node   │                │
  │               │                │ berikutnya      │                │
  │               │                │────── simpan ──▶│                │
  │               │◀── node baru ──│                │                │
  │◀── render ────│                │                │                │
```

## 3. Model data cerita

Satu file per cerita di `data/`. Skema (JSON):

```jsonc
{
  "id": "malin-kundang",          // kebab-case, unik
  "judul": "Malin Kundang",
  "asal": "Sumatra Barat",
  "pengantar": "Satu kalimat di kartu beranda.",
  "pesanMoral": "…",
  "sumber": [
    { "nama": "Wikipedia — Malin Kundang", "url": "https://en.wikipedia.org/wiki/Malin_Kundang" }
  ],
  "variasiDipakai": "Versi yang dipakai bila ada beberapa versi (lihat requirements §1.2).",
  "mulaiDari": "malin:01",
  "adegan": [
    {
      "id": "malin:01",           // pola <ceritaId>:<nomor 2 digit>
      "suasana": "pantai",        // salah satu dari daftar §3.1
      "teks": "… (maks. ~120 kata)",
      "pilihan": [
        { "teks": "…", "ke": "malin:02", "skor": { "bakti": 1 } }
      ]
    }
  ],
  "akhir": [
    {
      "id": "akhir-batu",         // pola akhir-<slug>
      "jenis": "kanon",           // "kanon" | "alternatif"
      "judul": "…",
      "teks": "…",
      "labelAlternatif": "Seandainya…" // wajib bila jenis = "alternatif"
    }
  ]
}
```

### 3.1 Nilai `suasana` yang diizinkan

`pantai`, `laut-badai`, `desa`, `hutan`, `istana`, `candi`, `sumur`, `lumpur`.
Setiap nilai wajib punya palet CSS dan simbol SVG di `assets/`. Nilai di luar
daftar ditolak validator.

### 3.2 Dimensi skor

Hanya `bakti`, `berani`, `bijak`. Nilai per pilihan: bilangan bulat 0–3.
Skor total tidak boleh negatif (validator + engine menjamin).

### 3.3 Aturan graf cerita (ditegakkan validator)

1. `mulaiDari` menunjuk adegan yang ada.
2. Setiap `pilihan.ke` menunjuk ID adegan yang ada atau ID akhir yang ada.
3. Setiap adegan punya 2–3 pilihan (adegan pembuka boleh 2).
4. Setiap adegan dapat dicapai dari `mulaiDari` (tidak ada adegan yatim).
5. Setiap jalur dari `mulaiDari` berakhir di sebuah akhir (graf asiklik
   menuju akhir; tidak ada siklus tanpa jalan keluar).
6. Minimal 3 akhir per cerita, termasuk tepat 1 akhir `kanon` sebagai akhir
   utama (akhir kanon tambahan hanya bila ceritanya memang punya dua akhir
   kanon yang dikenal — tidak untuk ketiga cerita ini).
7. Setiap adegan teksnya ≤ 120 kata; setiap cerita 10–16 adegan (target
   durasi main 5–10 menit).

## 4. State dan penyimpanan

### 4.1 Bentuk state (di memori)

```js
{
  ceritaId: "malin-kundang",
  adeganId: "malin:04",
  skor: { bakti: 2, berani: 1, bijak: 0 },
  riwayat: ["malin:01", "malin:02", "malin:04"], // ID adegan yang dilalui
  pilihanDiambil: ["…teks pilihan…"],            // untuk ringkasan akhir
  akhirDitemukan: { "malin-kundang": ["akhir-batu"] }
}
```

### 4.2 Kunci `localStorage`

- `kisah-interaktif:v1:progres:<ceritaId>` → state permainan berjalan.
- `kisah-interaktif:v1:akhir:<ceritaId>` → array ID akhir yang ditemukan.
- Semua tulis dibungkus `try/catch`; bila gagal (mode privat), permainan
  tetap jalan dalam sesi (Req 8.3).
- Progres rusak (JSON tidak valid / adegan tidak ada) → diabaikan, beranda
  ditampilkan (Req 3.3).

## 5. Tampilan (UI)

- **Beranda:** judul situs, pengantar satu paragraf, 3 kartu cerita
  (judul, asal, pengantar, "x dari y akhir ditemukan", tombol "Mulai" /
  "Lanjutkan" bila ada progres).
- **Layar adegan:** ilustrasi suasana (SVG), teks adegan (`aria-live="polite"`),
  indikator "Adegan n dari total" + judul cerita, tombol pilihan vertikal
  (lebar penuh di ponsel), tombol "Beranda" dan "Mulai dari awal".
- **Layar akhir:** judul akhir, label jenis (kanon / "Seandainya…"),
  teks penutup, skor per dimensi + penjelasan, ringkasan pilihan yang diambil,
  tombol "Main lagi", "Coba akhir lain" (ke beranda), dan "Bagikan" (salin teks
  ringkasan ke clipboard — tanpa server).
- **Palet:** tiap cerita punya warna dasar; tiap `suasana` menggeser aksen.
  Semua di CSS, tanpa gambar.

## 6. Penanganan error

| Situasi | Perilaku |
|---|---|
| File `data/*.json` gagal dimuat / JSON rusak | Beranda menampilkan pesan ramah "Cerita belum bisa dimuat, coba segarkan halaman." dan cerita lain tetap bisa dimainkan. |
| Progres tersimpan rusak | Diabaikan; beranda ditampilkan (Req 3.3). |
| `localStorage` tidak tersedia | Permainan jalan dalam sesi; progres tidak tersimpan (Req 8.3). |
| Pilihan menunjuk node yang tidak ada | Tidak boleh terjadi di produksi — dicegah validator + hook. Bila tetap terjadi, tampilkan pesan ramah dan kembalikan ke beranda. |

## 7. Strategi pengujian

Tanpa framework test (tanpa dependensi). Tiga lapis:

1. **Validator otomatis** — `node scripts/validate-story.mjs` memeriksa
   skema + 7 aturan graf §3.3 untuk semua `data/*.json`. Dijalankan otomatis
   oleh hook `.kiro/hooks/validate-story-data.json` setiap file data disimpan,
   dan manual sebelum commit.
2. **Uji jalan manual (checklist, lihat tasks.md)** — mainkan tiap cerita
   sampai tiap akhir; segarkan halaman di tengah jalan (progres pulih);
   hapus progres; buka di ponsel 360px dan desktop 1280px; uji keyboard saja.
3. **Uji kesetiaan cerita** — bandingkan teks tiap adegan dan akhir dengan
   `docs/SUMBER-CERITA.md` dan sumber URL-nya; hook `cek-kesetiaan-cerita`
   (PostTaskExec) mengingatkan pemeriksaan ini setelah tiap tugas selesai.

## 8. Keputusan desain

| Keputusan | Alternatif yang ditolak | Alasan |
|---|---|---|
| Vanilla JS, tanpa framework | React/Vue/Svelte | Tanpa build step; risiko gagal build nol; mudah diaudit juri. |
| JSON statis per cerita | Satu file besar / JS inline | Satu cerita mudah ditinjau dan divalidasi; engine generik. |
| `localStorage` | Backend / cookie | Tanpa server; cukup untuk progres per perangkat. |
| SVG/CSS buatan sendiri | Gambar AI / foto internet | Nol risiko hak cipta; nol dependensi jaringan. |
| Tanpa `package.json` di MVP | npm + tooling | Tidak ada yang perlu di-build; validator memakai Node murni. |

## 9. Rencana hooks Kiro

Format hooks v1 (Kiro IDE 1.0 / CLI V3): file JSON di `.kiro/hooks/*.json`,
satu file dapat berisi beberapa hook; tiap hook punya `trigger` (PascalCase),
opsional `matcher` (regex), dan `action` (`command` atau `agent`).
Referensi: https://kiro.dev/docs/ide/whats-new-v1/hooks/ (diakses 15 Nov 2026).

| Hook | Trigger | Matcher | Action |
|---|---|---|---|
| `validasi-data-cerita` | `PostFileSave` | `data/.*\.json` | `command`: `node scripts/validate-story.mjs` — gagalkan penyimpanan yang melanggar skema/graf cerita. |
| `cek-kesetiaan-cerita` | `PostTaskExec` | — | `agent`: periksa perubahan `data/*.json` terhadap `docs/SUMBER-CERITA.md`; laporkan penyimpangan kanon, jangan diam-diam memperbaikinya. |

Catatan: trigger file (`PostFileSave`) bersifat IDE-only; di CLI, pemeriksaan
yang sama dilakukan validator manual (`node scripts/validate-story.mjs`)
sebelum commit. Hook sudah ditulis di `.kiro/hooks/validate-story-data.json`.
