// storage.js — penyimpanan progres di localStorage
// Tanggung jawab (design.md §4):
//   - Kunci: kisah-interaktif:v1:progres:<ceritaId> dan kisah-interaktif:v1:akhir:<ceritaId>
//   - simpanProgres(state), muatProgres(ceritaId), hapusProgres(ceritaId),
//     tandaiAkhirDitemukan(ceritaId, akhirId), muatAkhirDitemukan(ceritaId).
//   - Semua akses localStorage dibungkus try/catch: bila tidak tersedia
//     (mis. mode privat), fungsi gagal diam-diam dan permainan tetap jalan
//     dalam sesi (Req 8.3).
//   - Progres rusak (JSON tidak valid / adegan tidak ada) → kembalikan null
//     agar pemanggil menampilkan beranda (Req 3.3).

const PREFIX = "kisah-interaktif:v1:";

/** Simpan state permainan berjalan ke localStorage. */
export function simpanProgres(state) {
  try {
    localStorage.setItem(
      `${PREFIX}progres:${state.ceritaId}`,
      JSON.stringify(state)
    );
  } catch {
    // localStorage tidak tersedia — permainan tetap jalan dalam sesi (Req 8.3).
  }
}

/**
 * Muat progres tersimpan untuk cerita tertentu.
 * Kembalikan state atau null bila tidak ada / rusak (Req 3.3).
 */
export function muatProgres(ceritaId) {
  try {
    const raw = localStorage.getItem(`${PREFIX}progres:${ceritaId}`);
    if (!raw) return null;
    const state = JSON.parse(raw);
    // Pemeriksaan minimal: field wajib ada agar progres rusak diabaikan (Req 3.3).
    if (
      typeof state !== "object" ||
      state === null ||
      state.ceritaId !== ceritaId ||
      typeof state.adeganId !== "string" ||
      typeof state.skor !== "object" ||
      !Array.isArray(state.riwayat)
    ) {
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

/** Hapus progres tersimpan untuk cerita tertentu (Req 3.4). */
export function hapusProgres(ceritaId) {
  try {
    localStorage.removeItem(`${PREFIX}progres:${ceritaId}`);
  } catch {
    // Diam-diam.
  }
}

/** Tandai satu akhir sebagai ditemukan; simpan ke localStorage (Req 4.4). */
export function tandaiAkhirDitemukan(ceritaId, akhirId) {
  try {
    const daftar = muatAkhirDitemukan(ceritaId);
    if (!daftar.includes(akhirId)) {
      daftar.push(akhirId);
      localStorage.setItem(
        `${PREFIX}akhir:${ceritaId}`,
        JSON.stringify(daftar)
      );
    }
  } catch {
    // Diam-diam.
  }
}

/**
 * Muat daftar ID akhir yang sudah ditemukan untuk cerita tertentu.
 * Kembalikan array string; [] bila belum ada atau rusak.
 */
export function muatAkhirDitemukan(ceritaId) {
  try {
    const raw = localStorage.getItem(`${PREFIX}akhir:${ceritaId}`);
    if (!raw) return [];
    const daftar = JSON.parse(raw);
    if (!Array.isArray(daftar)) return [];
    return daftar.filter((item) => typeof item === "string");
  } catch {
    return [];
  }
}
