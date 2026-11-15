# AGENTS.md — Kisah Interaktif

Aturan kerja agen di repo ini. Steering Kiro yang mengikat ada di
`.kiro/steering/` (product.md, tech.md, structure.md); file ini ringkasannya
untuk agen apa pun.

1. **Spec dulu.** Perubahan kebutuhan → ubah `.kiro/specs/kisah-interaktif/requirements.md`
   dulu, lalu `design.md`, lalu `tasks.md`. Jangan mengubah kode tanpa memperbarui spec.
2. **Jangan ubah kanon.** Plot Malin Kundang, Timun Mas, Roro Jonggrang mengikuti
   `docs/SUMBER-CERITA.md`. Akhir alternatif wajib berlabel "Seandainya…".
3. **Tanpa dependensi.** Dilarang menambah framework, bundler, atau `package.json`
   untuk MVP. Dilarang memuat aset dari internet saat runtime.
4. **Tanpa aset berhak cipta.** Ilustrasi hanya SVG/CSS buatan sendiri di `assets/`.
5. **`.kiro/` selalu ikut commit.** Jangan pernah menambahkan `.kiro` ke `.gitignore`.
6. **Data adalah sumber kebenaran alur.** Engine tidak boleh meng-hardcode alur cerita.
7. **Validasi sebelum commit:** `node scripts/validate-story.mjs` harus lolos.
8. **Bahasa UI: Bahasa Indonesia.** Komentar kode boleh Indonesia/Inggris, konsisten
   dalam satu file.
