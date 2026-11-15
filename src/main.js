// main.js — bootstrap aplikasi Kisah Interaktif
// Tanggung jawab (design.md §2):
//   1. Memuat daftar cerita dari data/*.json.
//   2. Memulihkan progres via storage.js; bila ada, tawarkan "Lanjutkan" di beranda.
//   3. Mendelegasikan render pertama ke render.js.
//   4. Menangani JSON gagal dimuat dengan pesan ramah — cerita lain tetap bisa dimainkan.
// Alur data satu arah: JSON → engine → render → DOM. Tanpa hardcode alur cerita.

import {
  buatStateAwal,
  pilih,
  adeganSaatIni,
  apakahAkhir,
  skorAkhir,
  hitungTotalAdegan,
} from "./engine.js";

import {
  simpanProgres,
  muatProgres,
  hapusProgres,
  tandaiAkhirDitemukan,
  muatAkhirDitemukan,
} from "./storage.js";

import {
  renderBeranda,
  renderAdegan,
  renderAkhir,
  renderPesanError,
} from "./render.js";

// ============================================================
// Daftar file cerita (urutan beranda)
// ============================================================
const DAFTAR_FILE_CERITA = [
  "data/malin-kundang.json",
  "data/timun-mas.json",
  "data/roro-jonggrang.json",
];

// ============================================================
// State global sesi (satu cerita aktif sekaligus)
// ============================================================
let ceritaAktif = null;   // objek cerita dari JSON
let stateAktif  = null;   // state permainan dari engine.js
let daftarCerita = [];    // array objek cerita yang berhasil dimuat

// ============================================================
// Muat semua cerita
// ============================================================
async function muatSemuaCerita() {
  const hasil = await Promise.allSettled(
    DAFTAR_FILE_CERITA.map((url) =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
    )
  );

  return hasil.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    // Cerita gagal dimuat — tandai agar beranda menampilkan pesan ramah.
    const namaFile = DAFTAR_FILE_CERITA[i];
    const judulFallback = namaFile
      .replace("data/", "")
      .replace(".json", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    console.error(`Gagal memuat ${namaFile}:`, r.reason);
    return { _gagalMuat: true, _judulGagal: judulFallback };
  });
}

// ============================================================
// Navigasi: tampilkan beranda
// ============================================================
function tampilkanBeranda() {
  ceritaAktif = null;
  stateAktif  = null;

  // Pasang class cerita ke body setelah render
  document.body.classList.remove("dalam-permainan");
  for (const cls of [...document.body.classList]) {
    if (cls.startsWith("cerita-") || cls.startsWith("suasana-")) {
      document.body.classList.remove(cls);
    }
  }

  const progresMap = new Map();
  const akhirMap   = new Map();

  for (const cerita of daftarCerita) {
    if (cerita._gagalMuat) continue;
    const p = muatProgres(cerita.id);
    // Validasi: adegan yang tersimpan harus masih ada di cerita
    if (p && !cerita.adegan.some((a) => a.id === p.adeganId)) {
      hapusProgres(cerita.id);
      progresMap.set(cerita.id, null);
    } else {
      progresMap.set(cerita.id, p);
    }
    akhirMap.set(cerita.id, muatAkhirDitemukan(cerita.id));
  }

  renderBeranda(
    daftarCerita,
    progresMap,
    akhirMap,
    mulaiCerita,
    lanjutkanCerita,
  );
}

// ============================================================
// Navigasi: mulai cerita dari awal
// ============================================================
function mulaiCerita(ceritaId) {
  const cerita = daftarCerita.find((c) => c.id === ceritaId);
  if (!cerita || cerita._gagalMuat) return;

  hapusProgres(ceritaId);
  ceritaAktif = cerita;
  stateAktif  = buatStateAwal(ceritaId, cerita.mulaiDari);
  simpanProgres(stateAktif);
  terapkanCeritaBody(ceritaId);
  renderAdeganSaatIni();
}

// ============================================================
// Navigasi: lanjutkan dari progres tersimpan
// ============================================================
function lanjutkanCerita(ceritaId) {
  const cerita = daftarCerita.find((c) => c.id === ceritaId);
  if (!cerita || cerita._gagalMuat) return;

  const progres = muatProgres(ceritaId);
  if (!progres) {
    mulaiCerita(ceritaId);
    return;
  }

  ceritaAktif = cerita;
  stateAktif  = progres;
  terapkanCeritaBody(ceritaId);
  renderAdeganSaatIni();
}

// ============================================================
// Ulang cerita (dari tombol nav "Mulai dari awal")
// ============================================================
function ulangCerita() {
  if (!ceritaAktif) return;
  mulaiCerita(ceritaAktif.id);
}

// ============================================================
// Terapkan class cerita pada <body>
// ============================================================
function terapkanCeritaBody(ceritaId) {
  for (const cls of [...document.body.classList]) {
    if (cls.startsWith("cerita-")) document.body.classList.remove(cls);
  }
  document.body.classList.add(`cerita-${ceritaId}`);
}

// ============================================================
// Render adegan atau layar akhir sesuai state
// ============================================================
function renderAdeganSaatIni() {
  if (!ceritaAktif || !stateAktif) return;

  if (apakahAkhir(stateAktif, ceritaAktif)) {
    // Layar akhir
    const akhir = adeganSaatIni(stateAktif, ceritaAktif);
    if (!akhir) {
      renderPesanError("Akhir cerita tidak ditemukan. Silakan kembali ke beranda.");
      return;
    }

    tandaiAkhirDitemukan(ceritaAktif.id, akhir.id);
    hapusProgres(ceritaAktif.id);

    const semuaDitemukan = muatAkhirDitemukan(ceritaAktif.id);

    renderAkhir(
      akhir,
      stateAktif,
      ceritaAktif,
      semuaDitemukan,
      () => mulaiCerita(ceritaAktif.id),   // Main lagi
      tampilkanBeranda,                      // Coba akhir lain
      () => bagikanRingkasan(akhir),         // Bagikan
    );
  } else {
    // Layar adegan
    const adegan = adeganSaatIni(stateAktif, ceritaAktif);
    if (!adegan) {
      renderPesanError("Adegan tidak ditemukan. Silakan kembali ke beranda.");
      return;
    }

    const nomorAdegan = stateAktif.riwayat.length;
    const totalAdegan = hitungTotalAdegan(ceritaAktif);

    renderAdegan(
      adegan,
      nomorAdegan,
      totalAdegan,
      ceritaAktif.judul,
      (index) => handlePilih(index),
    );

    // Terapkan class cerita (render.js hanya menangani suasana)
    terapkanCeritaBody(ceritaAktif.id);
  }

  // Tombol nav sudah dipasang sekali di init(); tidak perlu dipasang ulang.
}

// ============================================================
// Handle pemain memilih pilihan
// ============================================================
function handlePilih(index) {
  if (!ceritaAktif || !stateAktif) return;
  try {
    stateAktif = pilih(stateAktif, ceritaAktif, index);
    simpanProgres(stateAktif);
    renderAdeganSaatIni();
    // Gulir ke atas agar teks adegan baru langsung terlihat
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    console.error("Engine error:", e);
    renderPesanError("Terjadi kesalahan. Silakan kembali ke beranda.");
  }
}

// ============================================================
// Salin ringkasan perjalanan ke clipboard (tanpa server)
// ============================================================
function bagikanRingkasan(akhir) {
  if (!stateAktif || !ceritaAktif) return;
  const skor = skorAkhir(stateAktif);
  const baris = [
    `Kisah Interaktif — ${ceritaAktif.judul}`,
    `Akhir: ${akhir.judul}`,
    `Bakti: ${skor.bakti} | Keberanian: ${skor.berani} | Kebijaksanaan: ${skor.bijak}`,
    "",
    "Pilihanku:",
    ...(stateAktif.pilihanDiambil ?? []).map((p, i) => `${i + 1}. ${p}`),
  ];
  const teks = baris.join("\n");

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(teks).then(() => {
      tampilkanToast("Ringkasan disalin ke clipboard!");
    }).catch(() => {
      tampilkanToast("Gagal menyalin — coba salin manual.");
    });
  } else {
    // Fallback untuk browser lama / file://
    const area = document.createElement("textarea");
    area.value = teks;
    area.style.position = "fixed";
    area.style.opacity  = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
    tampilkanToast("Ringkasan disalin ke clipboard!");
  }
}

// ============================================================
// Toast sederhana (tanpa library)
// ============================================================
function tampilkanToast(pesan) {
  let toast = document.getElementById("ki-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "ki-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    Object.assign(toast.style, {
      position:     "fixed",
      bottom:       "1.5rem",
      left:         "50%",
      transform:    "translateX(-50%)",
      background:   "#2b2118",
      color:        "#fff",
      padding:      "0.6rem 1.2rem",
      borderRadius: "6px",
      fontSize:     "0.9rem",
      fontFamily:   "system-ui, sans-serif",
      zIndex:       "999",
      opacity:      "0",
      transition:   "opacity 0.3s",
    });
    document.body.appendChild(toast);
  }
  toast.textContent = pesan;
  toast.style.opacity = "1";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

// ============================================================
// Bootstrap
// ============================================================
(async () => {
  // Pasang tombol nav satu kali (elemen sudah ada di HTML dari awal)
  document.getElementById("btn-beranda")?.addEventListener("click", tampilkanBeranda);
  document.getElementById("btn-ulang")?.addEventListener("click", ulangCerita);

  daftarCerita = await muatSemuaCerita();
  tampilkanBeranda();
})();
