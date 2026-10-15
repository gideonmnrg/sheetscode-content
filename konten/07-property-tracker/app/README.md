# Property Tracker — harness screenshot

Menjalankan web app Property Tracker yang asli (Index.html, Styles.html, JavaScript.html, Code.gs)
di Chromium dengan backend tiruan, supaya screenshot di carousel sama persis dengan tampilan web-nya.

- `src/` — file asli dari Apps Script (**tidak di-commit**, taruh manual sebelum build).
- `gen_data.py` — data dummy (agen properti fiktif, Jan–Okt 2026) → `data.js`, layout sheet sama dengan aslinya (data mulai baris 17, kolom B).
- `gas_stub.js` — tiruan SpreadsheetApp, Utilities, CacheService, MailApp, dll. + `google.script.run` yang memanggil fungsi `Code.gs` asli.
- `build_app.py` — rakit `index_manager.html` / `index_sales.html` (`APP_ROLE=SALES python3 build_app.py`).
- `capture.py` — screenshot tiap fitur ke `../shots/` (locale id-ID, skala 3x).

Urutan: `python3 gen_data.py && python3 build_app.py && APP_ROLE=SALES python3 build_app.py && python3 capture.py`,
lalu `python3 ../build.py` untuk merender slide.
