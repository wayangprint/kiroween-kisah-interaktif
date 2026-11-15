// validate-story.mjs — validator data cerita (Node murni, tanpa dependensi)
// Memeriksa semua data/*.json terhadap skema dan 7 aturan graf di design.md §3.3:
//   1. mulaiDari menunjuk adegan yang ada.
//   2. Setiap pilihan.ke menunjuk ID adegan atau ID akhir yang ada.
//   3. Setiap adegan punya 2–3 pilihan.
//   4. Setiap adegan dapat dicapai dari mulaiDari (tidak ada adegan yatim).
//   5. Setiap jalur dari mulaiDari berakhir di sebuah akhir (graf asiklik menuju akhir).
//   6. Minimal 3 akhir per cerita, termasuk tepat 1 akhir kanon.
//   7. Teks adegan ≤ 120 kata; suasana dan dimensi skor hanya dari daftar yang diizinkan.
// Keluar kode 0 bila semua lolos, non-nol + pesan jelas bila ada pelanggaran.
// Dijalankan manual:  node scripts/validate-story.mjs
// Dijalankan otomatis oleh hook .kiro/hooks/validate-story-data.json (PostFileSave).

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = join(ROOT, "data");

export const SUASANA_DIIZINKAN = ["pantai", "laut-badai", "desa", "hutan", "istana", "candi", "sumur", "lumpur"];
export const DIMENSI_SKOR = ["bakti", "berani", "bijak"];

/** Hitung jumlah kata dalam string. */
function hitungKata(teks) {
  return teks.trim().split(/\s+/).filter(Boolean).length;
}

/** Validasi satu objek cerita; kembalikan array string kesalahan (kosong = lolos). */
export function validasiCerita(cerita) {
  const err = [];

  // --- Pemeriksaan field wajib tingkat atas ---
  if (!cerita.id || typeof cerita.id !== "string") err.push("Field 'id' wajib ada (string).");
  if (!cerita.judul || typeof cerita.judul !== "string") err.push("Field 'judul' wajib ada.");
  if (!cerita.asal || typeof cerita.asal !== "string") err.push("Field 'asal' wajib ada.");
  if (!cerita.mulaiDari || typeof cerita.mulaiDari !== "string") err.push("Field 'mulaiDari' wajib ada.");
  if (!Array.isArray(cerita.adegan) || cerita.adegan.length === 0) err.push("Field 'adegan' wajib berupa array tidak kosong.");
  if (!Array.isArray(cerita.akhir) || cerita.akhir.length === 0) err.push("Field 'akhir' wajib berupa array tidak kosong.");

  // Hentikan lebih lanjut bila struktur dasar tidak ada.
  if (err.length > 0) return err;

  const adeganById = new Map();
  const akhirById = new Map();

  // Indeks adegan
  for (const a of cerita.adegan) {
    if (!a.id || typeof a.id !== "string") { err.push("Adegan tanpa 'id'."); continue; }
    if (adeganById.has(a.id)) err.push(`ID adegan duplikat: '${a.id}'.`);
    adeganById.set(a.id, a);
  }

  // Indeks akhir
  for (const ak of cerita.akhir) {
    if (!ak.id || typeof ak.id !== "string") { err.push("Akhir tanpa 'id'."); continue; }
    if (!ak.id.startsWith("akhir-")) err.push(`ID akhir '${ak.id}' harus diawali 'akhir-'.`);
    if (akhirById.has(ak.id)) err.push(`ID akhir duplikat: '${ak.id}'.`);
    akhirById.set(ak.id, ak);
  }

  // Hentikan bila indeks rusak.
  if (err.length > 0) return err;

  // --- Aturan 1: mulaiDari menunjuk adegan yang ada ---
  if (!adeganById.has(cerita.mulaiDari)) {
    err.push(`'mulaiDari' (${cerita.mulaiDari}) menunjuk adegan yang tidak ada.`);
  }

  // --- Aturan 6: minimal 3 akhir, tepat 1 kanon ---
  if (cerita.akhir.length < 3) {
    err.push(`Cerita harus punya minimal 3 akhir; ditemukan ${cerita.akhir.length}.`);
  }
  const akhirKanon = cerita.akhir.filter((ak) => ak.jenis === "kanon");
  if (akhirKanon.length !== 1) {
    err.push(`Cerita harus punya tepat 1 akhir 'kanon'; ditemukan ${akhirKanon.length}.`);
  }
  for (const ak of cerita.akhir) {
    if (!["kanon", "alternatif"].includes(ak.jenis)) {
      err.push(`Akhir '${ak.id}': jenis '${ak.jenis}' tidak valid (harus 'kanon' atau 'alternatif').`);
    }
    if (ak.jenis === "alternatif" && !ak.labelAlternatif) {
      err.push(`Akhir alternatif '${ak.id}' harus punya 'labelAlternatif'.`);
    }
    if (ak.jenis === "alternatif" && ak.labelAlternatif && !ak.labelAlternatif.startsWith("Seandainya")) {
      err.push(`Akhir alternatif '${ak.id}': labelAlternatif harus diawali 'Seandainya'.`);
    }
  }

  // --- Periksa tiap adegan ---
  for (const adegan of cerita.adegan) {
    const { id, suasana, teks, pilihan } = adegan;

    // Suasana
    if (!suasana || !SUASANA_DIIZINKAN.includes(suasana)) {
      err.push(`Adegan '${id}': suasana '${suasana}' tidak valid. Nilai diizinkan: ${SUASANA_DIIZINKAN.join(", ")}.`);
    }

    // Teks
    if (!teks || typeof teks !== "string") {
      err.push(`Adegan '${id}': field 'teks' wajib ada.`);
    } else {
      const kata = hitungKata(teks);
      if (kata > 120) {
        err.push(`Adegan '${id}': teks terlalu panjang (${kata} kata; maks. 120).`);
      }
    }

    // Pilihan — Aturan 3: 2–3 pilihan
    if (!Array.isArray(pilihan) || pilihan.length < 2 || pilihan.length > 3) {
      err.push(`Adegan '${id}': harus punya 2–3 pilihan; ditemukan ${Array.isArray(pilihan) ? pilihan.length : 0}.`);
    } else {
      for (const pil of pilihan) {
        if (!pil.teks || typeof pil.teks !== "string") {
          err.push(`Adegan '${id}': pilihan tanpa 'teks'.`);
        }
        // Aturan 2: pilihan.ke menunjuk ID adegan atau akhir yang ada
        if (!pil.ke) {
          err.push(`Adegan '${id}': pilihan tanpa 'ke'.`);
        } else if (!adeganById.has(pil.ke) && !akhirById.has(pil.ke)) {
          err.push(`Adegan '${id}': pilihan.ke '${pil.ke}' tidak ditemukan di adegan maupun akhir.`);
        }
        // Validasi skor
        if (pil.skor !== undefined) {
          if (typeof pil.skor !== "object" || Array.isArray(pil.skor)) {
            err.push(`Adegan '${id}': pilihan.skor harus berupa objek.`);
          } else {
            for (const [dim, val] of Object.entries(pil.skor)) {
              if (!DIMENSI_SKOR.includes(dim)) {
                err.push(`Adegan '${id}': dimensi skor '${dim}' tidak valid. Gunakan: ${DIMENSI_SKOR.join(", ")}.`);
              }
              if (!Number.isInteger(val) || val < 0 || val > 3) {
                err.push(`Adegan '${id}': nilai skor '${dim}=${val}' harus bilangan bulat 0–3.`);
              }
            }
          }
        }
      }
    }
  }

  // Hentikan aturan graf bila ada kesalahan referensi.
  const kesalahanReferensi = err.length;

  // --- Aturan 4: keterjangkauan (BFS dari mulaiDari) ---
  if (adeganById.has(cerita.mulaiDari)) {
    const dikunjungi = new Set();
    const antrean = [cerita.mulaiDari];
    while (antrean.length > 0) {
      const id = antrean.shift();
      if (dikunjungi.has(id)) continue;
      dikunjungi.add(id);
      const adegan = adeganById.get(id);
      if (!adegan) continue; // ID akhir, hentikan cabang ini
      for (const pil of (adegan.pilihan || [])) {
        if (pil.ke && !dikunjungi.has(pil.ke)) antrean.push(pil.ke);
      }
    }
    for (const [id] of adeganById) {
      if (!dikunjungi.has(id)) {
        err.push(`Adegan yatim: '${id}' tidak dapat dicapai dari '${cerita.mulaiDari}'.`);
      }
    }
  }

  // --- Aturan 5: semua jalur berakhir di akhir (DFS, deteksi siklus tanpa keluar) ---
  if (kesalahanReferensi === err.length && adeganById.has(cerita.mulaiDari)) {
    // DFS dengan deteksi siklus; simpan status: "belum"/"sedang"/"selesai"
    const status = new Map(); // "belum" | "sedang" | "selesai"
    function dfs(id) {
      if (akhirById.has(id)) return true; // mencapai akhir
      if (!adeganById.has(id)) return false; // referensi tak ada (sudah dilaporkan)
      const s = status.get(id);
      if (s === "selesai") return true;
      if (s === "sedang") {
        err.push(`Siklus terdeteksi di adegan '${id}' tanpa jalan keluar ke akhir.`);
        return false;
      }
      status.set(id, "sedang");
      const adegan = adeganById.get(id);
      let semuaBerakhir = true;
      for (const pil of (adegan.pilihan || [])) {
        if (!dfs(pil.ke)) semuaBerakhir = false;
      }
      status.set(id, "selesai");
      return semuaBerakhir;
    }
    dfs(cerita.mulaiDari);
  }

  return err;
}

// --- CLI: dijalankan langsung dengan `node scripts/validate-story.mjs` ---
const fileJson = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json")).sort();
if (fileJson.length === 0) {
  console.error("Tidak ada file data/*.json yang ditemukan.");
  process.exit(1);
}
let gagal = false;
for (const file of fileJson) {
  let cerita;
  try {
    cerita = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
  } catch (e) {
    console.error(`${file}: JSON tidak valid — ${e.message}`);
    gagal = true;
    continue;
  }
  const kesalahan = validasiCerita(cerita);
  if (kesalahan.length > 0) {
    gagal = true;
    console.error(`\n${file}: ${kesalahan.length} masalah:`);
    for (const k of kesalahan) console.error(`  - ${k}`);
  } else {
    console.log(`${file}: OK`);
  }
}
if (!gagal) console.log("\nSemua file data cerita lolos validasi.");
process.exit(gagal ? 1 : 0);
