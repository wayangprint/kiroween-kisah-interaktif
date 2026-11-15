# Tasks — Kisah Interaktif

> Spec: `kisah-interaktif` · Jalankan dengan Kiro CLI: `/spec run kisah-interaktif`
> atau jalankan tugas satu per satu sesuai urutan. Setiap tugas mencantumkan
> requirements yang dipenuhinya. Jangan menulis implementasi di luar tugas ini
> tanpa memperbarui `requirements.md` / `design.md` terlebih dahulu.
>
> Status awal: semua tugas `- [ ]` (belum dikerjakan). Scaffold (kerangka file,
> data cerita kerangka, spec, steering, hooks) sudah dibuat sebelum tugas 1;
> tugas-tugas di bawah ini adalah implementasi substansial oleh Kiro CLI.

## Gelombang 1 — Fondasi (tanpa dependensi antar-tugas, kecuali 1.1)

- [ ] 1.1 Siapkan kerangka HTML + CSS dasar
  - Lengkapi `index.html` dari kerangka: shell aplikasi (header, `<main id="adegan">`
    dengan `aria-live="polite"`, area pilihan, footer) dan muat `src/main.js`
    sebagai modul ES.
  - Lengkapi `assets/style.css` dari kerangka: layout responsif ponsel-dulu,
    tanpa scroll horizontal di 360px dan 1280px, kontras teks WCAG AA.
  - _Requirements: 7.2, 7.4, 8.1, 8.2_

- [ ] 1.2 Implementasikan validator data cerita
  - Lengkapi `scripts/validate-story.mjs` dari kerangka: validasi skema JSON
    dan 7 aturan graf di `design.md` §3.3 untuk semua `data/*.json`
    (rujukan ada, adegan tercapai, semua jalur berakhir di akhir, minimal
    3 akhir termasuk 1 kanon, teks ≤ 120 kata, `suasana` dan skor valid).
  - Validator harus keluar dengan kode non-nol dan pesan jelas bila ada
    pelanggaran; kode nol bila semua lolos.
  - _Requirements: 2.3, 2.4_

- [ ] 1.3 Implementasikan modul penyimpanan progres
  - Lengkapi `src/storage.js` dari kerangka: `simpanProgres()`,
    `muatProgres()`, `hapusProgres()`, `tandaiAkhirDitemukan()` dengan kunci
    `kisah-interaktif:v1:*`; semua akses `localStorage` dibungkus `try/catch`
    (mode privat tetap bisa main, Req 8.3); progres rusak diabaikan (Req 3.3).
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.3_

## Gelombang 2 — Engine dan render (tergantung Gelombang 1)

- [ ] 2.1 Implementasikan engine cerita
  - Lengkapi `src/engine.js` dari kerangka: state (`ceritaId`, `adeganId`,
    `skor`, `riwayat`), `pilih(index)`, `adeganSaatIni()`, `apakahAkhir()`,
    dan penghitungan skor (tidak negatif). Engine murni logika: tanpa DOM,
    tanpa `localStorage` langsung; alur dibaca dari JSON, bukan hardcode.
  - _Requirements: 2.1, 2.2, 2.5, 4.5_

- [ ] 2.2 Implementasikan render beranda dan adegan
  - Lengkapi `src/render.js` dari kerangka: render beranda (3 kartu cerita
    + status akhir ditemukan + tombol Lanjutkan bila ada progres), render
    adegan (teks, indikator "Adegan n dari total", 2–3 tombol `<button>`),
    tombol "Beranda" dan "Mulai dari awal".
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 8.1_

- [ ] 2.3 Implementasikan layar akhir dan skor
  - Lengkapi layar akhir di `src/render.js` + `src/engine.js`: judul akhir,
    label jenis (kanon / "Seandainya…"), teks penutup, skor per dimensi
    (bakti, berani, bijak) + penjelasan, ringkasan pilihan yang diambil,
    tombol "Main lagi" dan "Coba akhir lain", penanda akhir ditemukan.
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

## Gelombang 3 — Konten cerita (tergantung 1.2, 2.1; tiga cerita bisa paralel)

- [ ] 3.1 Lengkapi data Malin Kundang
  - Lengkapi `data/malin-kundang.json` dari kerangka (10–16 adegan, minimal
    3 akhir termasuk akhir kanon "menjadi batu di Pantai Air Manis").
    Ikuti plot kanon di `requirements.md` §1.2 dan `docs/SUMBER-CERITA.md`;
    titik pilihan hanya pada momen yang ditandai di data (mis. keputusan
    merantau, sikap saat ibu datang, penyesalan di tengah badai).
  - Jalankan validator setelah selesai; semua jalur harus berakhir di akhir.
  - _Requirements: 2.3, 2.4, 4.3, 5.1, 5.2, 5.3_

- [ ] 3.2 Lengkapi data Timun Mas
  - Lengkapi `data/timun-mas.json` dari kerangka (10–16 adegan, minimal
    3 akhir termasuk akhir kanon). Empat bekal harus muncul berurutan:
    biji mentimun → ladang, jarum → hutan bambu, garam → lautan,
    terasi → lumpur panas mendidih; Buto Ijo tenggelam di akhir kanon.
    Pakai variasi Wikipedia ID (pasangan petani, usia 17, Buto Ijo).
  - Jalankan validator setelah selesai.
  - _Requirements: 2.3, 2.4, 4.3, 5.1, 5.2, 5.3_

- [ ] 3.3 Lengkapi data Roro Jonggrang
  - Lengkapi `data/roro-jonggrang.json` dari kerangka (10–16 adegan,
    minimal 3 akhir termasuk akhir kanon). Dua syarat harus muncul:
    sumur Jalatunda lalu seribu candi semalam; tipu daya fajar palsu;
    999 candi; akhir kanon: dikutuk jadi arca batu (candi ke-1000).
  - Jalankan validator setelah selesai.
  - _Requirements: 2.3, 2.4, 4.3, 5.1, 5.2, 5.3_

## Gelombang 4 — Visual dan penyelesaian (tergantung Gelombang 2–3)

- [ ] 4.1 Lengkapi ilustrasi suasana SVG + palet per cerita
  - Lengkapi `assets/illustrations.svg` dari kerangka (simbol untuk semua
    nilai `suasana`: pantai, laut-badai, desa, hutan, istana, candi, sumur,
    lumpur) dan palet per cerita di `assets/style.css`. Semua SVG buatan
    sendiri; tanpa aset berhak cipta, tanpa muatan dari internet.
  - _Requirements: 6.1, 6.2, 6.4_

- [ ] 4.2 Sambungkan bootstrap dan uji jalan menyeluruh
  - Lengkapi `src/main.js` dari kerangka: memuat daftar cerita, memulihkan
    progres, mendelegasikan render pertama; tangani JSON gagal dimuat
    dengan pesan ramah (cerita lain tetap bisa dimainkan).
  - Uji jalan manual (checklist): tiap cerita sampai tiap akhir; segarkan
    halaman di tengah jalan (progres pulih); "Mulai dari awal" menghapus
    progres; ponsel 360px + desktop 1280px; keyboard saja (Tab + Enter);
    buka lewat `file://` dan lewat server statis.
  - _Requirements: 3.2, 7.1, 7.2, 8.1, 8.3_

- [ ] 4.3 Uji kesetiaan cerita dan finalisasi
  - Bandingkan teks tiap adegan dan akhir dengan `docs/SUMBER-CERITA.md`
    dan sumber URL-nya; perbaiki penyimpangan kanon (ubah data, bukan
    mengubah kanon agar cocok dengan data).
  - Jalankan validator akhir (`node scripts/validate-story.mjs`) hingga lolos.
  - Verifikasi: `.kiro/` ikut terlihat di repo (tidak terabaikan
    `.gitignore`); README cara jalan + deploy akurat; tidak ada aset
    berhak cipta dan tidak ada muatan eksternal.
  - _Requirements: 5.1, 5.2, 5.3, 6.2, 6.3, 6.4, 7.3_

- [ ] 4.4 Siapkan deploy GitHub Pages (tanpa men-deploy dari tugas ini)
  - Tulis langkah deploy di README (buat repo, push branch `main`,
    Settings → Pages → Deploy from branch `main` / root) dan verifikasi
    daftar periksa pra-submit Devpost: URL publik, 3 cerita bisa dimainkan
    sampai akhir, spec Kiro terlihat di repo.
  - Deploy dan submit Devpost dilakukan Wahyu (butuh akun GitHub + Devpost
    miliknya); tugas ini hanya menyiapkan dan memverifikasi kesiapannya.
  - _Requirements: 7.1, 7.3_

## Catatan eksekusi

- Kiro membangun dependency graph dari daftar ini: Gelombang 1 → 2 → 3 → 4;
  tugas dalam satu gelombang yang tidak saling tergantung dapat berjalan paralel.
- Bila satu tugas menemukan kebutuhan yang mengubah requirements, hentikan
  tugas itu, perbarui `requirements.md` → `design.md` → `tasks.md`, lalu lanjut.
