# Kisah Interaktif

Gamebook / text-adventure berbahasa Indonesia yang menghidupkan kembali genre
cerita bercabang pilihan ganda — genre yang pernah populer lalu mati — dengan
tiga cerita rakyat Nusantara: **Malin Kundang**, **Timun Mas**, dan **Roro Jonggrang**.

> Proyek hackathon **Kiroween 2026** (Kiro/AWS di Devpost), kategori **Resurrection**.
> Deadline submit: **4 Desember 2026, 14:00 PT**.
> Dibangun spec-driven dengan Kiro: spec lengkap ada di
> `.kiro/specs/kisah-interaktif/` (requirements, design, tasks) dan steering di
> `.kiro/steering/`.

## Cara main

1. Buka beranda, pilih satu dari tiga cerita.
2. Baca satu adegan, lalu pilih satu dari 2–3 pilihan — pilihanmu menentukan
   jalannya cerita.
3. Setiap cerita punya **akhir ganda** (minimal 3, termasuk akhir kanon) dan
   **skor** (bakti, keberanian, kebijaksanaan) dari pilihan-pilihanmu.
4. Progres tersimpan otomatis di browser — tutup halaman dan lanjutkan nanti
   dari adegan terakhir.
5. Temukan semua akhir di tiap cerita!

## Cara jalan (lokal)

Tidak ada build step, tidak ada dependensi, tidak ada `package.json`.

```bash
# Paling sederhana: buka langsung
open index.html            # macOS
xdg-open index.html        # Linux
# atau lewat server statis mana pun, misal:
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Untuk memeriksa data cerita:

```bash
node scripts/validate-story.mjs
```

(Butuh Node.js — hanya untuk validator; aplikasi sendiri jalan tanpa Node.)

## Cara deploy (GitHub Pages)

1. Buat repo GitHub baru (mis. `kisah-interaktif`), lalu dari folder ini:
   ```bash
   git init
   git add .
   git commit -m "Kisah Interaktif: spec Kiro + scaffold"
   git branch -M main
   git remote add origin https://github.com/<username>/kisah-interaktif.git
   git push -u origin main
   ```
2. Di repo GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**,
   pilih branch `main` dan folder `/ (root)`, lalu Save.
3. Tunggu 1–2 menit; situs live di `https://<username>.github.io/kisah-interaktif/`.
4. Uji dari URL publik: ketiga cerita bisa dimainkan sampai akhir.

> **Penting:** folder `.kiro/` (spec, steering, hooks) WAJIB ikut ter-push.
> `.gitignore` di repo ini sengaja tidak mengecualikannya — mengecualikan
> `.kiro/` adalah syarat diskualifikasi Kiroween.

## Stack

| Keputusan | Alasan |
|---|---|
| HTML5 + CSS3 + vanilla JavaScript (ES2020) | Tanpa build step — nol risiko build gagal menjelang deadline; mudah diaudit juri. |
| Data cerita JSON statis (`data/*.json`, satu file per cerita) | Alur terbaca langsung dari data; engine generik, bukan hardcode. |
| `localStorage` | Progres tersimpan tanpa server. |
| Ilustrasi SVG/CSS buatan sendiri (`assets/`) | Nol risiko hak cipta; nol muatan dari internet. |
| GitHub Pages | Hosting statis gratis, deploy deterministik. |
| Kiro CLI (spec-driven) | Requirements → design → tasks, lalu `/spec run kisah-interaktif`. |

## Struktur

```text
index.html                  # Entry point
assets/                     # style.css + illustrations.svg (SVG buatan sendiri)
src/                        # main.js, engine.js, storage.js, render.js
data/                       # malin-kundang.json, timun-mas.json, roro-jonggrang.json
scripts/                    # validate-story.mjs (validator data cerita)
docs/                       # SUMBER-CERITA.md (sumber plot + variasi versi)
.kiro/
  specs/kisah-interaktif/   # requirements.md, design.md, tasks.md
  steering/                 # product.md, tech.md, structure.md
  hooks/                    # validate-story-data.json
```

## Kesetiaan cerita

Plot ketiga cerita mengikuti versi yang dikenal umum, **bukan karangan bebas**.
Sumber dan variasi yang dipakai didokumentasikan di `docs/SUMBER-CERITA.md`:

- **Malin Kundang** — Wikipedia (EN): https://en.wikipedia.org/wiki/Malin_Kundang
- **Timun Mas** — Wikipedia (ID): https://id.wikipedia.org/wiki/Timun_Mas
- **Roro Jonggrang** — Wikipedia (EN/ID): https://en.wikipedia.org/wiki/Roro_Jonggrang,
  https://id.wikipedia.org/wiki/Rara_Jonggrang

Cabang interaktif hanya mengubah nasib tokoh pada titik pilihan yang ditandai;
alur kanon, tokoh, benda ajaib, dan akhir kanon tidak diubah. Akhir alternatif
diberi label jelas "Seandainya…".

## Daftar periksa pra-submit Devpost

Sebelum submit, verifikasi:

- [ ] URL publik GitHub Pages dapat dibuka tanpa login.
- [ ] Ketiga cerita (Malin Kundang, Timun Mas, Roro Jonggrang) bisa dimainkan sampai akhir.
- [ ] Setiap cerita menampilkan minimal 3 akhir yang bisa ditemukan.
- [ ] Progres tersimpan saat halaman ditutup dan pulih saat dibuka kembali.
- [ ] Situs bisa dibuka di ponsel (360px) dan desktop (1280px) tanpa scroll horizontal.
- [ ] Folder `.kiro/` (spec + steering + hooks) terlihat di repo GitHub.
- [ ] `node scripts/validate-story.mjs` lolos dengan kode keluar 0.
- [ ] Tidak ada aset dari CDN / internet di-load saat runtime.

## Status

**Implementasi lengkap.** Semua tugas Gelombang 1–4 selesai. Data ketiga cerita
tervalidasi (`node scripts/validate-story.mjs` exit 0). Bootstrap `src/main.js`
terhubung penuh ke engine, storage, dan render. Ilustrasi SVG suasana lengkap
di `assets/illustrations.svg`. Situs siap di-deploy ke GitHub Pages.

## Lisensi

MIT — lihat `LICENSE`.
