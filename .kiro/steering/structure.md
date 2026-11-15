---
inclusion: always
---

# Struktur — Kisah Interaktif

## Tata letak repo

```text
resurrection-kisah-interaktif/
├── index.html                  # Entry point; shell aplikasi (header, area adegan, pilihan)
├── assets/
│   ├── style.css               # Semua gaya: palet per cerita, layout responsif
│   └── illustrations.svg       # Simbol SVG suasana (laut, hutan, candi, dll.)
├── src/
│   ├── main.js                 # Bootstrap: muat data, pulihkan progres, render adegan
│   ├── engine.js               # Mesin cerita: state, transisi pilihan, skor, ending
│   ├── storage.js              # localStorage: simpan / muat / hapus progres
│   └── render.js               # Render DOM: adegan, pilihan, layar akhir, beranda
├── data/
│   ├── malin-kundang.json      # Cerita 1: metadata + simpul adegan + akhir
│   ├── timun-mas.json          # Cerita 2
│   └── roro-jonggrang.json     # Cerita 3
├── scripts/
│   └── validate-story.mjs      # Validator skema + keterhubungan data cerita (node, tanpa dep)
├── docs/
│   └── SUMBER-CERITA.md        # Daftar sumber plot + variasi versi yang dipakai
├── .kiro/
│   ├── specs/kisah-interaktif/ # requirements.md, design.md, tasks.md
│   ├── steering/               # product.md, tech.md, structure.md (file ini)
│   └── hooks/                  # validate-story-data.json
├── README.md
├── LICENSE                     # MIT
└── .gitignore                  # TIDAK BOLEH mengecualikan .kiro/
```

## Aturan struktur

- **`.kiro/` selalu ikut commit.** `.gitignore` dilarang berisi `.kiro`,
  `.kiro/`, atau pola apa pun yang mengecualikan folder itu. Ini syarat
  hackathon: spec Kiro harus terlihat di repo.
- **Tidak ada `package.json`** di MVP: tanpa build step, tanpa dependensi.
  Bila kelak dibutuhkan (mis. tool dev), tambahkan dengan perubahan desain.
- **Satu cerita = satu file JSON** di `data/`. Jangan menggabungkan cerita
  ke satu file besar; validator dan engine mengasumsikan satu file per cerita.
- **Data cerita adalah sumber kebenaran alur.** Engine tidak boleh
  meng-hardcode alur cerita di JS; semua teks, pilihan, transisi, skor, dan
  ending dibaca dari JSON.
- **Aset hanya di `assets/`.** Jangan menaruh gambar di folder lain.

## Skema data cerita (ringkas; lengkap di `design.md`)

```jsonc
{
  "id": "malin-kundang",
  "judul": "Malin Kundang",
  "asal": "Sumatra Barat",
  "sumber": [{ "nama": "…", "url": "…" }],
  "variasiDipakai": "…",
  "pesanMoral": "…",
  "mulaiDari": "malin:01",
  "adegan": [
    {
      "id": "malin:01",
      "suasana": "pantai",
      "teks": "…",
      "pilihan": [
        { "teks": "…", "ke": "malin:02", "skor": { "bakti": 1 } }
      ]
    }
  ],
  "akhir": [
    { "id": "akhir-batu", "judul": "…", "teks": "…", "jenis": "kanon" }
  ]
}
```

- `suasana` hanya boleh memakai nilai dari daftar di `design.md`
  (mis. `pantai`, `laut-badai`, `hutan`, `candi`, `desa`, `istana`).
- `skor` hanya memakai dimensi yang didefinisikan di `design.md`
  (`bakti`, `berani`, `bijak`).
- Setiap `pilihan.ke` harus menunjuk ke ID adegan yang ada, atau ke ID akhir
  yang diawali `akhir-`. Validator menolak rujukan yang hilang.

## Alur kerja Kiro (spec-driven)

1. Spec ini sudah ditulis dan disetujui (requirements → design → tasks).
2. Implementasi dikerjakan Kiro CLI: `/spec run kisah-interaktif`
   (atau jalankan tugas satu per satu dari `tasks.md`).
3. Perubahan kebutuhan → ubah `requirements.md` dulu, lalu perbarui
   `design.md` dan `tasks.md`. Jangan mengubah kode tanpa memperbarui spec.
