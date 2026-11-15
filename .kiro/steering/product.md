---
inclusion: always
---

# Produk — Kisah Interaktif

## Apa ini

**Kisah Interaktif** adalah gamebook / text-adventure berbasis web yang menghidupkan kembali
genre cerita bercabang pilihan ganda — genre yang pernah populer di era buku gamebook dan
text adventure, lalu mati tergeser game grafis — dengan cerita rakyat Nusantara.

Pemain membaca satu adegan, lalu memilih salah satu dari 2–3 pilihan. Setiap pilihan
membawa ke adegan berikutnya, mengubah skor, dan pada akhirnya mencapai salah satu dari
beberapa akhir (ending) yang berbeda.

## Tiga cerita (kanon)

| # | Cerita | Asal | Tokoh kunci |
|---|--------|------|-------------|
| 1 | Malin Kundang | Sumatra Barat (Minangkabau, Pantai Air Manis, Padang) | Malin Kundang, Mande Rubayah (ibu) |
| 2 | Timun Mas | Jawa | Timun Mas, Buto Ijo, orang tua petani |
| 3 | Roro Jonggrang | Jawa Tengah / DI Yogyakarta (Prambanan) | Roro Jonggrang, Bandung Bondowoso, Prabu Boko, Patih Gupolo |

Plot tiap cerita mengikuti versi yang dikenal umum dan terverifikasi dari sumber yang
dicantumkan di `data/*.json` dan di `.kiro/specs/kisah-interaktif/requirements.md`.
Cabang interaktif HANYA boleh mengubah nasib tokoh pada titik-titik pilihan yang
ditandai di data cerita — alur kanon (awal, tokoh, benda ajaib, dan akhir kanon)
tidak boleh diubah. Bila ada variasi versi cerita, variasi yang dipakai dicatat di
data cerita; variasi lain tidak dipakai.

## Pengguna

- Pembaca umum Indonesia, usia 10+ (anak, pelajar, keluarga).
- Pengguna hackathon / juri Devpost yang membuka situs tanpa instalasi apa pun.
- Guru / orang tua yang memakai cerita rakyat sebagai bahan bacaan.

## Tujuan produk

1. Pemain menyelesaikan minimal satu cerita sampai akhir dalam satu kunjungan.
2. Pemain terdorong mengulang cerita untuk menemukan akhir lain (akhir ganda).
3. Cerita rakyat Nusantara tersaji akurat, bukan karangan bebas.
4. Situs bisa dibuka siapa saja, di perangkat apa saja, tanpa server.

## Fitur inti (MVP)

1. Pemilihan cerita (beranda, 3 kartu cerita).
2. Membaca adegan + memilih 1 dari 2–3 pilihan.
3. Progres tersimpan otomatis (localStorage): lanjutkan dari adegan terakhir.
4. Akhir ganda per cerita + layar akhir dengan ringkasan perjalanan.
5. Skor: poin kebijaksanaan / keberanian / bakti, ditampilkan di akhir.
6. Ilustrasi suasana per adegan: CSS/SVG buatan sendiri (tanpa aset berhak cipta).
7. Bahasa UI: Bahasa Indonesia. Responsif (ponsel dulu), bisa dipakai offline
   setelah pertama kali dimuat (semua aset lokal, tanpa CDN wajib).

## Bukan tujuan (di luar MVP)

- Akun / login, papan skor online, backend, atau database server.
- Audio, animasi berat, atau aset gambar/foto dari internet.
- Cerita ke-4 dan seterusnya (ekstensi pasca-MVP, format data sudah mendukungnya).
- Terjemahan bahasa lain (struktur data siap, konten belum).

## Prinsip UX

- Satu layar, satu adegan: teks pendek (maks. ~120 kata per adegan), pilihan besar
  dan mudah diketuk.
- Pemain selalu tahu posisinya: judul cerita, nomor adegan, dan progres
  (mis. "Adegan 4 dari 12") selalu terlihat.
- Tidak ada jalan buntu: setiap adegan punya minimal satu pilihan, setiap pilihan
  mengarah ke adegan yang ada, dan setiap jalur berakhir di sebuah akhir.
- Warna dan suasana berubah per cerita dan per suasana adegan (laut, hutan,
  candi) lewat palet CSS, bukan lewat gambar eksternal.
