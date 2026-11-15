---
inclusion: always
---

# Teknologi — Kisah Interaktif

## Stack (dipilih karena static site murni)

- **HTML5 + CSS3 + JavaScript murni (vanilla JS, ES2020)** — tanpa framework,
  tanpa build step, tanpa dependensi runtime.
- **Data cerita: JSON statis** di `data/*.json` (satu file per cerita).
- **Penyimpanan progres: `localStorage`** (kunci `kisah-interaktif:v1:*`).
- **Ilustrasi: SVG inline + CSS** buatan sendiri di `assets/`. Tidak ada gambar
  raster eksternal, tidak ada font eksternal wajib.
- **Hosting: GitHub Pages** (static hosting, branch `main`, folder root).
- **Pengembangan: Kiro CLI** (`/spec run kisah-interaktif`) mengikuti
  `.kiro/specs/kisah-interaktif/tasks.md`.

## Alasan

- Static site murni = nol biaya hosting, nol server yang bisa mati, dan deploy
  GitHub Pages yang deterministik — cocok untuk demo hackathon yang dinilai
  juri dari URL publik.
- Tanpa build step = tidak ada risiko "build gagal di menit terakhir" menjelang
  deadline submit (4 Des 2026 14:00 PT).
- Vanilla JS + JSON membuat engine cerita mudah diaudit juri: alur cerita
  terbaca langsung dari file data, bukan tersembunyi di kode.

## Batasan keras

- **Dilarang** menambah framework, bundler, atau dependensi npm untuk MVP.
  Bila satu dependensi benar-benar dibutuhkan, ajukan dulu sebagai perubahan
  desain di `design.md` — jangan diam-diam menambahkannya.
- **Dilarang** memuat aset apa pun dari CDN/internet saat runtime
  (font, gambar, pustaka). Semua yang dibutuhkan harus ada di repo.
- **Dilarang** memakai gambar/foto/ilustrasi berhak cipta. Ilustrasi hanya
  SVG/CSS yang digambar sendiri untuk proyek ini.
- **Dilarang** mengirim data pemain ke mana pun. Progres hanya di
  `localStorage` perangkat pemain.
- Kode harus jalan dengan membuka `index.html` langsung (file://) maupun
  lewat server statis mana pun; tidak boleh ada asumsi server-side.

## Konvensi kode

- JavaScript: modul ES (`type="module"`), `const`/`let`, tanpa `var`.
- Satu tanggung jawab per file di `src/` (lihat `structure.md`).
- Semua string yang tampil ke pemain berbahasa Indonesia; komentar kode boleh
  Indonesia/Inggris, konsisten dalam satu file.
- Penamaan: file dan kunci JSON memakai `kebab-case`; fungsi JS `camelCase`;
  ID adegan `ceritaId:nomor` (mis. `malin:04`).
- Aksesibilitas: pilihan adalah `<button>` asli, bisa dioperasikan keyboard,
  kontras teks memenuhi WCAG AA, dan ada `aria-live` untuk teks adegan.

## Pengujian

- Tanpa framework test. Verifikasi memakai:
  1. `node scripts/validate-story.mjs` — validasi skema dan keterhubungan
     semua file `data/*.json` (semua pilihan mengarah ke adegan yang ada,
     semua jalur berakhir di ending, tidak ada adegan yatim).
  2. Uji jalan manual (checklist di `tasks.md`): mainkan tiap cerita sampai
     tiap ending, segarkan halaman di tengah jalan (progres pulih),
     buka di ponsel + desktop.
- Hook `.kiro/hooks/validate-story-data.json` menjalankan validator otomatis
  setiap file `data/*.json` disimpan.
