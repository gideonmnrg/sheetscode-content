# SheetsCode design kit

Diekstrak dari skill `sheetscode-content-design-system` (`.claude/skills/sheetscode-content-design-system/SKILL.md`).

- `art.py` — helper SVG line-art gaya hand-drawn (person, props, bubble, dll.)
- `sc.py` — page shell, komponen slide, render Playwright + QA fill
- `style.css` — font, palet, layout 1080×1350
- `build_example.py` — contoh build carousel "Weekend"

Folder `fonts/` tidak di-commit (lihat Setup font di bawah).

## Setup font

```sh
cd _kit && mkdir -p fonts && cd fonts
for p in nunito raleway caveat jetbrains-mono poppins; do npm pack -q @fontsource/$p@5; done
for f in *.tgz; do n=$(echo $f | sed -E 's/fontsource-(.*)-5.*/\1/'); [ $n = jetbrains-mono ] && n=jbm
  mkdir -p $n && tar xzf $f -C $n --strip-components=1; done; rm -f *.tgz
```

Logo di folder ini diekstrak dari video promo Finance OS (ganti dengan file asli kalau ada).
Render pakai Chromium bawaan: `executable_path='/opt/pw-browsers/chromium'`.
