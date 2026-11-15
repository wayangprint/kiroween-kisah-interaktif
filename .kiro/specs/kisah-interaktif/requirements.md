# Requirements — Kisah Interaktif

> Spec: `kisah-interaktif` · Kategori: **Resurrection** (Kiroween 2026, Devpost)
> Proyek: menghidupkan kembali genre gamebook / text-adventure yang sudah mati,
> dengan cerita rakyat Nusantara.
> Alur kerja: Requirements-First (dokumen ini) → design.md → tasks.md → implementasi
> oleh Kiro CLI (`/spec run kisah-interaktif`).
> Format mengikuti dokumentasi resmi Kiro: spec terdiri dari `requirements.md`,
> `design.md`, dan `tasks.md` di `.kiro/specs/<nama>/`, dengan acceptance criteria
> memakai notasi EARS (`WHEN … THE SYSTEM SHALL …`).
> Referensi format: https://kiro.dev/docs/specs/ dan https://kiro.dev/docs/steering/
> (diakses 15 Nov 2026).

## 1. Pendahuluan

### 1.1 Latar belakang

Gamebook dan text adventure — cerita yang dibaca dan dipilih jalannya oleh pembaca —
pernah populer, lalu mati tergeser game grafis. Genre ini dihidupkan kembali sebagai
situs web statis berbahasa Indonesia dengan tiga cerita rakyat Nusantara yang plotnya
sudah dikenal umum: Malin Kundang, Timun Mas, dan Roro Jonggrang.

### 1.2 Kesetiaan cerita (aturan paling penting)

Plot ketiga cerita **harus sesuai versi yang dikenal umum, bukan karangan bebas**.
Sumber dan variasi yang dipakai:

| Cerita | Sumber utama (terverifikasi 15 Nov 2026) | Variasi yang dipakai |
|--------|------------------------------------------|----------------------|
| Malin Kundang | Wikipedia (EN), "Malin Kundang" — https://en.wikipedia.org/wiki/Malin_Kundang | Ibu bernama Mande Rubayah; Malin merantau naik kapal, sukses jadi saudagar, menikah, pulang dengan kapal mewah, menolak dan mendorong ibu hingga jatuh, ibu berdoa (bila benar anaknya, kutuk jadi batu), badai + petir, kapal karam, Malin jadi batu bersujud di Pantai Air Manis. |
| Timun Mas | Wikipedia (ID), "Timun Mas" — https://id.wikipedia.org/wiki/Timun_Mas | Sepasang petani tua; raksasa Buto Ijo memberi biji mentimun ajaib dengan syarat anak diserahkan saat berusia **17 tahun**; mentimun emas berisi bayi perempuan; empat bekal dari orang tua: **biji mentimun → ladang mentimun, jarum → hutan bambu, garam → lautan, terasi → lautan lumpur panas mendidih**; raksasa tenggelam, Timun Mas pulang selamat. |
| Roro Jonggrang | Wikipedia (EN/ID), "Roro Jonggrang" / "Rara Jonggrang" — https://en.wikipedia.org/wiki/Roro_Jonggrang dan https://id.wikipedia.org/wiki/Rara_Jonggrang | Kerajaan Pengging (Prabu Damar Maya, putra Bandung Bondowoso) vs Kerajaan Boko (Prabu Boko, Patih Gupolo); Boko menyerang Pengging, Prabu Boko tewas di tangan Bandung Bondowoso; lamaran ditolak karena ia pembunuh ayah sang putri; **dua syarat**: (1) sumur Jalatunda, (2) seribu candi dalam semalam; tipu daya sumur (Gupolo menimbun batu, Bandung lolos); tipu daya fajar palsu (api jerami + menumbuk padi, ayam berkokok) hingga hanya **999 candi**; Roro Jonggrang dikutuk jadi arca batu — candi ke-1000, arca Durga di Prambanan; 999 candi = Candi Sewu. |

**Variasi yang sengaja TIDAK dipakai** (dicatat agar tidak tercampur):

- Timun Mas: versi janda Mbok Sarni, versi usia serah 6 tahun (lalu ditunda) atau
  16 tahun, dan versi raksasa bernama Ki Butakala — ketiganya beredar luas, tetapi
  spec ini memakai versi Wikipedia ID (pasangan petani, 17 tahun, Buto Ijo).
- Roro Jonggrang: versi ringkas yang menghilangkan syarat sumur Jalatunda dan
  hanya menyebut seribu candi — spec ini memakai versi lengkap dua syarat.
- Malin Kundang: perbedaan kecil antarsumber (mis. kapal karam saat merantau
  vs. langsung sukses; istri dari keluarga bangsawan) tidak memengaruhi alur
  kanon yang dipakai di atas.

Cabang interaktif hanya boleh mengubah **nasib tokoh pada titik pilihan yang
ditandai di data cerita**. Alur kanon, tokoh, benda ajaib, dan akhir kanon tidak
boleh diubah. Setiap cerita wajib memiliki akhir kanon sebagai salah satu
akhirnya; akhir alternatif harus diberi label jelas sebagai akhir alternatif
("Seandainya…") dan tidak boleh disajikan sebagai versi asli cerita.

## 2. User stories

### US-1 — Memilih cerita
Sebagai pembaca, saya ingin melihat tiga cerita di beranda dan memilih satu,
agar saya bisa langsung mulai membaca cerita yang saya suka.

### US-2 — Membaca dan memilih
Sebagai pemain, saya ingin membaca satu adegan lalu memilih satu dari 2–3 pilihan,
agar saya merasa menentukan jalannya cerita.

### US-3 — Melanjutkan progres
Sebagai pemain, saya ingin progres saya tersimpan otomatis dan bisa dilanjutkan
setelah menutup atau menyegarkan halaman, agar saya tidak mengulang dari awal.

### US-4 — Mencapai akhir
Sebagai pemain, saya ingin setiap jalur yang saya pilih berakhir di sebuah akhir
dengan judul dan ringkasan perjalanan saya, agar permainan terasa tuntas.

### US-5 — Menemukan akhir lain
Sebagai pemain, saya ingin tahu ada akhir lain yang belum saya temukan dan bisa
mengulang cerita untuk mencarinya, agar saya terdorong bermain lagi.

### US-6 — Melihat skor
Sebagai pemain, saya ingin melihat skor (bakti, keberanian, kebijaksanaan) yang
saya kumpulkan dari pilihan-pilihan saya, agar pilihan saya terasa bermakna.

### US-7 — Suasana visual
Sebagai pemain, saya ingin setiap adegan punya suasana visual (warna dan
ilustrasi SVG) yang cocok dengan latar adegannya, agar saya lebih tenggelam
dalam cerita.

### US-8 — Membuka tanpa instalasi
Sebagai pengunjung, saya ingin situs langsung terbuka dari URL GitHub Pages di
ponsel maupun desktop tanpa instalasi, agar saya bisa mencoba dalam hitungan detik.

## 3. Acceptance criteria (EARS)

### 3.1 Beranda dan pemilihan cerita (Req 1)

- **1.1** WHEN pemain membuka `index.html` THE SYSTEM SHALL menampilkan beranda
  dengan tiga kartu cerita (judul, asal daerah, satu kalimat pengantar) dan tombol
  "Mulai" per cerita.
- **1.2** WHEN pemain memilih satu cerita THE SYSTEM SHALL menampilkan adegan
  pembuka cerita itu.
- **1.3** WHEN pemain berada di tengah cerita THE SYSTEM SHALL menyediakan tombol
  "Beranda" dan "Mulai dari awal" yang selalu terlihat.

### 3.2 Engine cerita bercabang (Req 2)

- **2.1** WHEN sebuah adegan ditampilkan THE SYSTEM SHALL menampilkan teks adegan
  (maks. ~120 kata) dan 2–3 tombol pilihan.
- **2.2** WHEN pemain mengklik satu pilihan THE SYSTEM SHALL menampilkan adegan
  atau akhir yang ditunjuk pilihan itu, dan tidak menampilkan adegan lain.
- **2.3** WHEN data cerita dimuat THE SYSTEM SHALL menolak (dan validator
  `scripts/validate-story.mjs` SHALL gagal) bila ada pilihan yang menunjuk ke
  ID adegan/akhir yang tidak ada, adegan tanpa pilihan, atau adegan yang tidak
  dapat dicapai dari adegan awal.
- **2.4** WHEN semua jalur sebuah cerita ditelusuri THE SYSTEM SHALL menjamin
  setiap jalur berakhir di sebuah akhir (tidak ada jalan buntu dan tidak ada
  perulangan tanpa jalan keluar).
- **2.5** WHEN cerita dimainkan THE SYSTEM SHALL memuat seluruh teks, pilihan,
  transisi, dan skor dari file `data/<cerita>.json`; engine tidak boleh
  meng-hardcode alur cerita di JavaScript.

### 3.3 Progres tersimpan (Req 3)

- **3.1** WHEN pemain berpindah adegan THE SYSTEM SHALL menyimpan progres
  (cerita, ID adegan, skor, riwayat pilihan) ke `localStorage`
  (kunci `kisah-interaktif:v1:*`) sebelum menampilkan adegan berikutnya.
- **3.2** WHEN pemain membuka kembali situs dan ada progres tersimpan THE SYSTEM
  SHALL menampilkan tombol "Lanjutkan" yang mengembalikan pemain ke adegan
  terakhir beserta skornya.
- **3.3** WHEN progres tersimpan rusak atau menunjuk adegan yang tidak ada
  THE SYSTEM SHALL mengabaikannya dan menampilkan beranda, tanpa error yang
  terlihat oleh pemain.
- **3.4** WHEN pemain menekan "Mulai dari awal" THE SYSTEM SHALL menghapus
  progres cerita itu dan memulai dari adegan pembuka dengan skor nol.

### 3.4 Akhir ganda dan skor (Req 4)

- **4.1** WHEN pemain mencapai sebuah akhir THE SYSTEM SHALL menampilkan judul
  akhir, teks penutup, label jenis akhir (kanon / alternatif), dan ringkasan
  perjalanan (daftar pilihan yang diambil).
- **4.2** WHEN sebuah cerita selesai THE SYSTEM SHALL menampilkan skor akhir
  per dimensi (bakti, keberanian, kebijaksanaan) beserta penjelasan singkat
  apa yang dinilai.
- **4.3** WHEN satu cerita dimainkan sampai tuntas THE SYSTEM SHALL memiliki
  minimal 3 akhir yang berbeda, termasuk akhir kanon.
- **4.4** WHEN pemain menyelesaikan satu akhir THE SYSTEM SHALL menandai akhir
  itu sebagai "ditemukan" dan menampilkan jumlah akhir yang sudah ditemukan
  (mis. "2 dari 4 akhir ditemukan") di beranda cerita itu.
- **4.5** WHEN pemain memilih pilihan yang membawa skor THE SYSTEM SHALL
  menambahkan skor sesuai nilai di data cerita, dan skor tidak boleh negatif.

### 3.5 Kesetiaan cerita (Req 5)

- **5.1** WHEN teks adegan atau akhir ditulis THE SYSTEM SHALL memakai tokoh,
  tempat, benda, dan urutan peristiwa sesuai §1.2 dan sumber di
  `docs/SUMBER-CERITA.md`; perubahan apa pun pada kanon harus didokumentasikan
  sebagai perubahan spec, bukan diam-diam.
- **5.2** WHEN sebuah akhir alternatif dibuat THE SYSTEM SHALL menandainya
  sebagai akhir alternatif ("Seandainya…") dan tidak boleh menyajikannya
  sebagai akhir asli cerita.
- **5.3** WHEN ada pertentangan antarversi cerita THE SYSTEM SHALL memakai
  variasi yang dicatat di §1.2 dan `data/*.json` (kolom `variasiDipakai`).

### 3.6 Ilustrasi dan bahasa (Req 6)

- **6.1** WHEN sebuah adegan ditampilkan THE SYSTEM SHALL menampilkan ilustrasi
  suasana (SVG/CSS buatan sendiri) yang cocok dengan nilai `suasana` adegan itu.
- **6.2** WHEN aset dimuat THE SYSTEM SHALL tidak memuat gambar, font, atau
  pustaka apa pun dari internet; semua aset berasal dari repo ini.
- **6.3** WHEN seluruh UI ditampilkan THE SYSTEM SHALL memakai Bahasa Indonesia.
- **6.4** WHEN ilustrasi dibuat THE SYSTEM SHALL hanya memakai SVG/CSS buatan
  sendiri; dilarang memakai gambar berhak cipta.

### 3.7 Static site dan deploy (Req 7)

- **7.1** WHEN situs dibuka dari GitHub Pages THE SYSTEM SHALL berfungsi penuh
  tanpa server, backend, atau build step.
- **7.2** WHEN `index.html` dibuka langsung dari file lokal (file://) THE SYSTEM
  SHALL tetap berfungsi (tidak boleh gagal karena asumsi server).
- **7.3** WHEN repo di-commit THE SYSTEM SHALL menyertakan folder `.kiro/`
  (spec, steering, hooks); `.gitignore` tidak boleh mengecualikannya.
- **7.4** WHEN situs dibuka di ponsel (lebar 360px) dan desktop (lebar 1280px)
  THE SYSTEM SHALL menampilkan layout yang rapi tanpa scroll horizontal.

### 3.8 Aksesibilitas dan ketahanan (Req 8)

- **8.1** WHEN pemain memakai keyboard THE SYSTEM SHALL memungkinkan semua
  pilihan dipilih dengan Tab + Enter, karena pilihan adalah `<button>` asli.
- **8.2** WHEN teks adegan berubah THE SYSTEM SHALL mengumumkannya lewat
  `aria-live` agar pembaca layar mengetahuinya.
- **8.3** WHEN `localStorage` tidak tersedia (mis. mode privat yang memblokir)
  THE SYSTEM SHALL tetap bisa memainkan cerita dalam sesi itu, tanpa error
  yang terlihat, dan progres tidak tersimpan.

## 4. Di luar lingkup (non-goals)

- Akun/login, skor online, backend, database server.
- Audio, animasi berat, aset gambar/foto dari internet.
- Cerita ke-4+ (format data sudah mendukung penambahan, konten belum).
- Terjemahan bahasa lain.

## 5. Glossary

- **Adegan (node):** satu layar teks + 2–3 pilihan.
- **Akhir (ending):** simpul penutup; jenisnya `kanon` atau `alternatif`.
- **Kanon:** alur/akhir sesuai versi cerita yang dikenal umum (§1.2).
- **Skor:** tiga dimensi — `bakti` (berbakti pada orang tua),
  `berani` (keberanian), `bijak` (kebijaksanaan/kecerdikan).
- **Suasana:** tema visual adegan (`pantai`, `laut-badai`, `hutan`,
  `candi`, `desa`, `istana`, `sumur`, `lumpur`).
