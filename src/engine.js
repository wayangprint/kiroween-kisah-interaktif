// engine.js — mesin cerita (murni logika, tanpa DOM, tanpa localStorage langsung)
// Tanggung jawab (design.md §2, §4):
//   - State: { ceritaId, adeganId, skor: { bakti, berani, bijak }, riwayat, pilihanDiambil }
//   - pilih(state, cerita, index): kembalikan state baru setelah pilihan ke-index.
//   - adeganSaatIni(state, cerita): kembalikan objek adegan atau akhir.
//   - apakahAkhir(state, cerita): true bila adeganId adalah ID akhir.
//   - skorAkhir(state): kembalikan skor final.
//   - Alur SELALU dibaca dari data JSON; tidak ada hardcode alur cerita.
//   - Skor tidak boleh negatif (Req 4.5).

export const DIMENSI_SKOR = ["bakti", "berani", "bijak"];

/** Buat state awal untuk cerita tertentu. */
export function buatStateAwal(ceritaId, adeganAwal) {
  return {
    ceritaId,
    adeganId: adeganAwal,
    skor: { bakti: 0, berani: 0, bijak: 0 },
    riwayat: [adeganAwal],
    pilihanDiambil: [],
  };
}

/**
 * Kembalikan objek adegan atau akhir yang sesuai dengan state.adeganId.
 * Kembalikan null bila tidak ditemukan (tidak seharusnya terjadi di produksi).
 */
export function adeganSaatIni(state, cerita) {
  const adegan = cerita.adegan.find((a) => a.id === state.adeganId);
  if (adegan) return adegan;
  const akhir = cerita.akhir.find((ak) => ak.id === state.adeganId);
  return akhir ?? null;
}

/**
 * Kembalikan true bila state.adeganId adalah ID akhir cerita.
 */
export function apakahAkhir(state, cerita) {
  return cerita.akhir.some((ak) => ak.id === state.adeganId);
}

/**
 * Terapkan pilihan ke-index dari adegan saat ini.
 * Kembalikan state baru (tidak memutasi state lama).
 * Throw bila index tidak valid atau adegan tidak punya pilihan.
 */
export function pilih(state, cerita, index) {
  const adegan = cerita.adegan.find((a) => a.id === state.adeganId);
  if (!adegan) throw new Error(`Adegan '${state.adeganId}' tidak ditemukan dalam cerita '${state.ceritaId}'.`);
  if (!Array.isArray(adegan.pilihan) || index < 0 || index >= adegan.pilihan.length) {
    throw new Error(`Pilihan ke-${index} tidak ada di adegan '${state.adeganId}'.`);
  }

  const pil = adegan.pilihan[index];
  const skorBaru = terapkanSkor(state.skor, pil.skor ?? {});

  return {
    ...state,
    adeganId: pil.ke,
    skor: skorBaru,
    riwayat: [...state.riwayat, pil.ke],
    pilihanDiambil: [...state.pilihanDiambil, pil.teks],
  };
}

/**
 * Kembalikan skor akhir permainan (sama dengan state.skor).
 * Disediakan sebagai fungsi eksplisit sesuai desain.
 */
export function skorAkhir(state) {
  return { ...state.skor };
}

/**
 * Hitung skor baru dari skor sebelumnya dan delta dari satu pilihan.
 * Skor tidak boleh negatif.
 */
function terapkanSkor(skorLama, delta) {
  const baru = { ...skorLama };
  for (const dim of DIMENSI_SKOR) {
    if (typeof delta[dim] === "number") {
      baru[dim] = Math.max(0, (baru[dim] ?? 0) + delta[dim]);
    }
  }
  return baru;
}

/**
 * Hitung total adegan yang dapat dicapai dari adegan awal (untuk indikator progres).
 * Hanya menghitung adegan (bukan akhir), BFS.
 */
export function hitungTotalAdegan(cerita) {
  const akhirId = new Set(cerita.akhir.map((ak) => ak.id));
  const adeganById = new Map(cerita.adegan.map((a) => [a.id, a]));
  const dikunjungi = new Set();
  const antrean = [cerita.mulaiDari];
  while (antrean.length > 0) {
    const id = antrean.shift();
    if (dikunjungi.has(id) || akhirId.has(id)) continue;
    dikunjungi.add(id);
    const a = adeganById.get(id);
    if (!a) continue;
    for (const pil of (a.pilihan ?? [])) {
      if (!dikunjungi.has(pil.ke)) antrean.push(pil.ke);
    }
  }
  return dikunjungi.size;
}
