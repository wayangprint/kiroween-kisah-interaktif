// render.js — render DOM (tidak mengubah state permainan)
// Tanggung jawab (design.md §2, §5):
//   - renderBeranda(daftarCerita, progresMap, akhirDitemukanMap, onMulai, onLanjutkan)
//   - renderAdegan(adegan, nomorAdegan, totalAdegan, judulCerita, onPilih)
//   - renderAkhir(akhir, state, cerita, onMainLagi, onBerandaCerita, onBagikan)
//   - Pilihan HARUS berupa <button> asli (keyboard: Tab + Enter, Req 8.1).
//   - Teks adegan memakai aria-live (sudah di <main id="adegan">, Req 8.2).
//   - Ilustrasi suasana: <svg><use href="assets/illustrations.svg#suasana-…"/></svg>.
//   - File ini TIDAK mengubah state permainan; semua perubahan lewat engine.js.

const elAdegan = () => document.getElementById("adegan");
const elPilihan = () => document.getElementById("pilihan");
const elNavCerita = () => document.getElementById("nav-cerita");

/** Deskripsi singkat tiap dimensi skor (ditampilkan di layar akhir). */
const LABEL_SKOR = {
  bakti: "Bakti",
  berani: "Keberanian",
  bijak: "Kebijaksanaan",
};

const DESKRIPSI_SKOR = {
  bakti:  "Seberapa berbakti kepada orang tua dan keluarga.",
  berani: "Seberapa berani menghadapi bahaya dan tantangan.",
  bijak:  "Seberapa cerdik dan bijak dalam mengambil keputusan.",
};

/** Skor maksimum yang bisa dicapai (untuk bar progres; estimasi). */
const SKOR_MAKS_ESTIMASI = 9;

// ============================================================
// Utilitas DOM
// ============================================================

function bersihkanPilihan() {
  const el = elPilihan();
  if (el) el.innerHTML = "";
}

function sembunyikanNav() {
  const el = elNavCerita();
  if (el) el.hidden = true;
}

function tampilkanNav() {
  const el = elNavCerita();
  if (el) el.hidden = false;
}

/** Buat markup ilustrasi suasana sebagai string HTML. */
function buatIlustrasi(suasana) {
  return `<span class="ilustrasi-suasana" aria-hidden="true">
    <svg viewBox="0 0 100 60" role="img">
      <use href="assets/illustrations.svg#suasana-${suasana}"/>
    </svg>
  </span>`;
}

/** Terapkan class suasana dan cerita pada <body>. */
function terapkanPaletBody(suasana, ceritaId) {
  const body = document.body;
  // Hapus class suasana lama
  for (const cls of [...body.classList]) {
    if (cls.startsWith("suasana-") || cls.startsWith("cerita-")) body.classList.remove(cls);
  }
  if (suasana) body.classList.add(`suasana-${suasana}`);
  if (ceritaId) body.classList.add(`cerita-${ceritaId}`);
}

// ============================================================
// Beranda
// ============================================================

/**
 * Render beranda dengan daftar kartu cerita.
 * @param {object[]} daftarCerita  - array objek cerita dari JSON
 * @param {Map}      progresMap    - ceritaId → state progres (atau null)
 * @param {Map}      akhirMap      - ceritaId → array ID akhir yang ditemukan
 * @param {Function} onMulai      - (ceritaId) → void, mulai dari awal
 * @param {Function} onLanjutkan  - (ceritaId) → void, lanjutkan dari progres
 */
export function renderBeranda(daftarCerita, progresMap, akhirMap, onMulai, onLanjutkan) {
  terapkanPaletBody(null, null);
  document.body.classList.remove("dalam-permainan");
  sembunyikanNav();
  bersihkanPilihan();

  const el = elAdegan();
  if (!el) return;

  const kartuHtml = daftarCerita.map((cerita) => {
    const progres = progresMap.get(cerita.id);
    const ditemukan = akhirMap.get(cerita.id) ?? [];
    const totalAkhir = cerita.akhir ? cerita.akhir.length : 0;
    const infoAkhir = totalAkhir > 0
      ? `${ditemukan.length} dari ${totalAkhir} akhir ditemukan`
      : "";
    const adaCeritaGagal = cerita._gagalMuat;

    if (adaCeritaGagal) {
      return `<div class="kartu-cerita" aria-label="Cerita: ${cerita._judulGagal ?? 'tidak diketahui'}">
        <h2>${cerita._judulGagal ?? "Cerita"}</h2>
        <p class="pesan-error">Cerita ini belum bisa dimuat. Coba segarkan halaman.</p>
      </div>`;
    }

    const idSafe = cerita.id.replace(/[^a-z0-9-]/g, "");
    const tombol = progres
      ? `<button class="tombol-cerita" data-aksi="lanjutkan" data-id="${idSafe}" type="button" aria-label="Lanjutkan ${cerita.judul}">▶ Lanjutkan</button>
         <button class="tombol-cerita btn-aksi-sekunder" data-aksi="mulai" data-id="${idSafe}" type="button" style="margin-left:0.5rem" aria-label="Mulai ulang ${cerita.judul}">↺ Mulai ulang</button>`
      : `<button class="tombol-cerita" data-aksi="mulai" data-id="${idSafe}" type="button" aria-label="Mulai ${cerita.judul}">▶ Mulai</button>`;

    return `<div class="kartu-cerita">
      <h2>${cerita.judul}</h2>
      <p class="kartu-asal">${cerita.asal ?? ""}</p>
      <p class="kartu-pengantar">${cerita.pengantar ?? ""}</p>
      ${infoAkhir ? `<p class="kartu-akhir">${infoAkhir}</p>` : ""}
      <div>${tombol}</div>
    </div>`;
  }).join("");

  el.innerHTML = `
    <h2 class="beranda-judul">Pilih Cerita</h2>
    <p class="beranda-pengantar">Setiap cerita punya beberapa akhir — temukan semuanya.</p>
    <div class="daftar-kartu">
      ${kartuHtml}
    </div>`;

  // Pasang event listener setelah render
  el.querySelectorAll("[data-aksi]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (btn.dataset.aksi === "lanjutkan") onLanjutkan(id);
      else onMulai(id);
    });
  });
}

// ============================================================
// Layar adegan
// ============================================================

/**
 * Render satu adegan.
 * @param {object}   adegan        - objek adegan dari JSON
 * @param {number}   nomorAdegan   - nomor adegan dalam riwayat (1-based)
 * @param {number}   totalAdegan   - estimasi total adegan
 * @param {string}   judulCerita   - judul cerita untuk header
 * @param {Function} onPilih       - (index) → void
 */
export function renderAdegan(adegan, nomorAdegan, totalAdegan, judulCerita, onPilih) {
  terapkanPaletBody(adegan.suasana, null); // ceritaId diset di main.js
  document.body.classList.add("dalam-permainan");
  tampilkanNav();

  const el = elAdegan();
  if (!el) return;

  el.innerHTML = `
    <div class="adegan-header">
      <span class="adegan-judul-cerita">${judulCerita}</span>
      <span class="adegan-progres" aria-label="Adegan ${nomorAdegan} dari sekitar ${totalAdegan}">
        Adegan ${nomorAdegan}/${totalAdegan}
      </span>
    </div>
    ${buatIlustrasi(adegan.suasana)}
    <p class="adegan-teks">${adegan.teks}</p>`;

  // Render tombol pilihan
  const elPil = elPilihan();
  if (!elPil) return;
  elPil.innerHTML = "";
  (adegan.pilihan ?? []).forEach((pil, i) => {
    const btn = document.createElement("button");
    btn.className = "btn-pilihan";
    btn.type = "button";
    btn.textContent = pil.teks;
    btn.addEventListener("click", () => onPilih(i));
    elPil.appendChild(btn);
  });

  // Fokus ke konten adegan untuk aksesibilitas
  el.focus?.();
}

// ============================================================
// Layar akhir
// ============================================================

/**
 * Render layar akhir.
 * @param {object}   akhir          - objek akhir dari JSON
 * @param {object}   state          - state permainan (skor, pilihanDiambil)
 * @param {object}   cerita         - objek cerita dari JSON
 * @param {string[]} semuaDitemukan - array ID akhir yang sudah pernah ditemukan
 * @param {Function} onMainLagi     - () → void
 * @param {Function} onBerandaCerita - () → void (kembali ke beranda)
 * @param {Function} onBagikan      - () → void
 */
export function renderAkhir(akhir, state, cerita, semuaDitemukan, onMainLagi, onBerandaCerita, onBagikan) {
  terapkanPaletBody(null, state.ceritaId);
  document.body.classList.add("dalam-permainan");
  tampilkanNav();

  const el = elAdegan();
  if (!el) return;
  bersihkanPilihan();

  const isKanon = akhir.jenis === "kanon";
  const labelJenis = isKanon
    ? `<span class="akhir-label-jenis kanon">Akhir Kanon</span>`
    : `<span class="akhir-label-jenis alternatif">Akhir Alternatif</span>`;

  const labelAlternatif = !isKanon && akhir.labelAlternatif
    ? `<p class="akhir-label-alternatif">${akhir.labelAlternatif}</p>`
    : "";

  // Skor
  const skor = state.skor;
  const maksSkor = SKOR_MAKS_ESTIMASI;
  const skorHtml = ["bakti", "berani", "bijak"].map((dim) => {
    const nilai = skor[dim] ?? 0;
    const persen = Math.min(100, Math.round((nilai / maksSkor) * 100));
    return `<li class="skor-item">
      <span class="skor-nama">${LABEL_SKOR[dim]}</span>
      <span class="skor-bar-luar" role="presentation">
        <span class="skor-bar-dalam" style="width:${persen}%"></span>
      </span>
      <span class="skor-angka">${nilai}</span>
    </li>
    <li class="skor-deskripsi" style="font-size:0.8rem;color:var(--teks-redup);padding-left:7rem;padding-bottom:0.3rem;font-family:var(--font-sans)">
      ${DESKRIPSI_SKOR[dim]}
    </li>`;
  }).join("");

  // Riwayat pilihan
  const riwayatHtml = (state.pilihanDiambil ?? []).length > 0
    ? `<div class="riwayat-blok">
        <h3>Pilihanmu</h3>
        <ol class="riwayat-daftar">
          ${state.pilihanDiambil.map((p) => `<li class="riwayat-item">${p}</li>`).join("")}
        </ol>
      </div>`
    : "";

  // Akhir ditemukan
  const totalAkhir = cerita.akhir.length;
  const totalDitemukan = semuaDitemukan.length;
  const infoAkhir = `<p class="akhir-ditemukan-info">${totalDitemukan} dari ${totalAkhir} akhir ditemukan dalam cerita ini.</p>`;

  el.innerHTML = `<div class="layar-akhir">
    ${labelJenis}
    ${labelAlternatif}
    <h2 class="akhir-judul">${akhir.judul}</h2>
    <p class="akhir-teks">${akhir.teks}</p>
    <div class="skor-blok">
      <h3>Skor Akhir</h3>
      <ul class="skor-daftar">${skorHtml}</ul>
    </div>
    ${riwayatHtml}
    ${infoAkhir}
    <div class="tombol-akhir">
      <button class="btn-aksi-utama" id="btn-main-lagi" type="button">↺ Main lagi</button>
      <button class="btn-aksi-sekunder" id="btn-coba-akhir-lain" type="button">← Coba akhir lain</button>
      <button class="btn-aksi-sekunder" id="btn-bagikan" type="button">📋 Salin ringkasan</button>
    </div>
  </div>`;

  document.getElementById("btn-main-lagi")?.addEventListener("click", onMainLagi);
  document.getElementById("btn-coba-akhir-lain")?.addEventListener("click", onBerandaCerita);
  document.getElementById("btn-bagikan")?.addEventListener("click", onBagikan);
}

/** Tampilkan pesan error ramah (cerita gagal dimuat). */
export function renderPesanError(pesan) {
  const el = elAdegan();
  if (!el) return;
  el.innerHTML = `<div class="pesan-error" role="alert">${pesan}</div>`;
}
