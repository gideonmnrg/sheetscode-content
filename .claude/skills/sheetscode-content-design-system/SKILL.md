---
name: "sheetscode-content-design-system"
description: "Use when creating educational or promotional social media content (carousels, posts, tutorials, product/case-study decks) for SheetsCode about Google Sheets, Excel, formulas, automation, Apps Script, productivity, or custom systems."
---

# SheetsCode Content Design System

The visual and content system for SheetsCode's social content: Instagram/TikTok/Threads carousels, single posts, tutorial graphics, and product/case-study decks about Google Sheets, Excel, formulas, Apps Script, automation, productivity, and custom systems.

Use it whenever Gideon asks to create, design, or fix SheetsCode content, even without the word "carousel" (for example "buatkan konten tentang VLOOKUP", "konten tentang Timnas", "promosikan sistem client ini").

**North star: illustrated editorial.** A SheetsCode slide combines three things on a sage/cream canvas:
1. A big, confident Poppins headline.
2. One rich visual panel: a hand-drawn line-art scene (stick figures with expressions, props, speech bubbles, Caveat labels) and/or a realistic mini UI (spreadsheet mock, dashboard KPIs, file cards, charts, before/after panels).
3. A short body line plus a handwritten Caveat note.

The gold standard is Gideon's pieces "18. Kenapa Usaha Ramai Tapi Untung Tipis", "19. 7 Kesalahan Saat Bikin Dashboard", "21. Ganti Keluhan Jadi Syukur", "23. Budget 50-30-20", and "24. Q4 Dimulai". Slides built only from text cards, list rows, and plain boxes fail this system, even when the copy is good. That is the most common failure, and it happened when a different model built pieces 28–33 without the illustration kit.

**Always build with the kit in the appendices (art.py + sc.py + style.css).** Don't improvise a simpler HTML template. The kit produces the hand-drawn look (the SVG turbulence filter, the stroke weight, the people and props) that defines the brand.

## 1. Determine before designing

- **Content type:** educational (istilah, formula, tutorial, tips, news explainer) or promotional (product, case study, custom system)? This decides the cover color.
- **Goal and takeaway:** the one sentence a viewer should screenshot.
- **Story arc:** hook → context/example → mechanism (one idea per slide) → result → takeaway/CTA.
- **Visual metaphor per slide:** for every interior slide, decide which visual carries it (Section 5). If a slide has no visual idea yet, it isn't ready.
- **Fictional cast** (for money/business examples): give the example a name and setting ("Dapur Nara, brownies", "Toko Kak Sarah"). Keep every number in Python constants with `assert` checks so totals always add up. Mark it "contoh fiktif" in a note.
- **Facts:** news, prices, rules, and app menus must be checked against current sources before use. When sources conflict, leave the detail out.

## 2. Brand identity

- **Logo:** line-art hummingbird with `{ }` / `<>` brackets, plus the "**Sheets**Code" wordmark. It always sits small top-left in the page header (`page()` does this). Never redraw the logo; use the PNG files `logo_sheetscode_cream.png` (for sage slides) and `logo_sheetscode_sage.png` (for cream slides).
- **Palette:**
  - Sage `#789A7C`, cream `#FCF1E3`.
  - Supporting: sage-dark `#4F6B53`, sage-xdark `#2F4A34`, sage-light `#BFD0BC`, paper `#FFFAF2`, ink `#2D2A26`, ink2 `#4A453E`, muted `#8A8175`, grid line `#E6D9C6`.
  - Accents: ochre `#C9963F`, ochre text `#9A722A`, red `#C0503F` (only for negative numbers or "salah"), note yellow `#F3DFB2`.
  - No other bright colors. For file-type tags only, a few muted tones are allowed (green `#5BAE7A`, terra `#C98B6B`, slate `#7C8FA6`).

### Cover rule
- **Educational:** cream cover.
- **Promotional:** full sage cover.
- **Gideon names a color** ("cover cream", "cover hijau"): his choice wins.

### Slide alternation
Interior slides strictly alternate background, starting with the color the cover is not (cream cover → 2 sage → 3 cream …; sage cover → 2 cream → 3 sage …). The visual panel stays a paper card on both backgrounds. Text on sage is cream; Caveat notes are cream on sage and ochre on cream.

### Grid alternation between posts
Consecutive posts on the IG/TikTok profile must alternate cover color: never two sage covers or two cream covers in a row. When scheduling several posts, sort by time and check each neighbouring pair.

## 3. The quality bar (wajib, check before delivering)

**Visual quota**
- **Cover:** must have a hero visual. Use a hand-drawn scene (`art_panel`) or a mini-UI composition (scattered `filecard`s, `date_tiles`, a budget `stackbar`, a scoreboard).
- **Interior slides:** at least **70%** must contain an illustration or a data/UI visual. A plain text list does not count.
- **Illustrations:** at least **3 hand-drawn scenes** per carousel (cover + 2 more), drawn with art.py people and props that fit the topic.
- **Text-only slides:** at most 2 per carousel, and they must use `numbered()` (title + description) or `checklist()`, not bare cards.
- **Variety:** no two consecutive slides use the same component.

**Slide anatomy** (top to bottom):
1. `eyebrow` (Raleway caps): a step or category such as "Langkah 2", "Kesalahan #3", "Contoh fiktif".
2. `h1` (Poppins): ≤ 8 words. On the cover, highlight 1–2 key words with `pillh()`.
3. **One main visual panel.** It can combine an illustration on top with data rows below inside the same card (`art_rows`). Small paired tiles (`duo_tiles`, `kpi_row`) count as part of that panel.
4. `body`: 1–2 short sentences, with the fix or punchline in `<b>`.
5. `note` (Caveat): a short human aside such as "geser, siapa tahu ini kamu" or "baru kerasa waktu dijumlahkan".

**Fill:** content should take **55–80%** of the slide height. The render prints the fill per slide.
- Under 50% looks empty: add or enlarge a visual.
- Over 82%, or an overflow flag: shorten the art height or cut rows. Never shrink fonts below Section 4.

**The cover must have:** an eyebrow, a headline with a pill highlight, a one-line hook body, the hero visual, and a "geser…" Caveat note.

**The CTA slide must have:**
- An illustration of a happy person beside a laptop showing a sheet, with a check badge.
- A short benefit body.
- `cta_banner` (the generic CTA, or the CTA Gideon specifies).
- A note such as "simpan & kirim ke …".

**Fails, so redo the slide when you see:**
- Slides that are only white cards with text.
- Two text boxes side by side as a "comparison".
- 40% or more of the slide empty.
- Every slide using the same layout.
- Figures without facial expression.
- Icons copied from generic sets.
- A formula shown without a sheet mock or a result.

## 4. Typography (1080×1350, readable on phone)

| Role | Font | Size |
|---|---|---|
| Cover headline | Poppins 700 | 86–96px, line-height ~1.15 |
| Slide headline | Poppins 700 | 72–80px |
| Body | Nunito 600 | 30–34px |
| Data rows / list descriptions | Nunito 700 / Poppins 600 numbers | 29–33px |
| Big numbers in tiles | Poppins 700 | 40–92px; the key number is the largest thing after the headline |
| Eyebrow | Raleway 700 caps, letter-spacing 3px | 28px |
| Small labels inside panels | Raleway 700 caps | 20–24px (never smaller than 20) |
| Notes and labels inside art | Caveat 700 | 40px note; 26–36px inside SVG |
| Formulas and code | JetBrains Mono (JBM) | 33–40px formula box; code blocks ≥ 25px |

- If the copy doesn't fit, cut copy or split the slide. Don't shrink type.
- Indonesian formulas use `;` separators.

## 5. Component library: choose the visual per slide

All of these live in `sc.py` (Appendix B). Pick by what the slide says:

| Slide says… | Use | Notes |
|---|---|---|
| A relatable situation or feeling (capek, bingung, checkout impulsif) | `art_panel(svg(...))` | person + mood + 2–4 props + bubble or Caveat text |
| A list of costs or items plus a total | `art_rows(art, items, total)` | the signature HPP layout: scene on top, rows below |
| Introducing a character or business | `facts_side(art, facts)` | art left, LABEL/value facts right |
| What people think vs reality | `duo_tiles(a, b)` (2nd tile dark) | often under a small scene in the same panel |
| Composition or proportions (budget, HPP breakdown, perlu vs pengen) | `stackbar(parts, label)` | stripes for "sisa" (color=None) |
| Wrong vs right (charts, tables, habits) | `split(bad, good)` with mini SVG charts or sheet mocks | chips SALAH / LEBIH BAIK |
| Two types of people or approaches | `versus((art,h,d),(art,h,d), lt, rt)` | dashed divider, art on both sides |
| Messy files, scattered data | `scatter([filecard(...)...])` | rotated cards with XLSX/PDF/WA/FOTO tags |
| Dates, deadlines, months | `date_tiles`, `stage_rows` | highlight the key one dark |
| Dashboard, KPIs | `kpi_row` inside `panel`, plus a hand-drawn chart in `svg` | |
| A formula | `formula()`, then a `sheet()` mock with `fx` bar and highlighted result cells | |
| Steps or tips | `numbered(items, bg)` (title + desc), ideally with a small art beside the headline | |
| A checklist to save | `checklist(items, bg)` | |
| Conversation or complaints | `chat([(text, mine)])`, or speech bubbles in art | |
| CTA | art (person + laptop + `check_badge`) + `cta_banner(bg, ...)` | |

## 6. Illustration system (art.py, Appendix A)

- **Canvas:**
  - Wide scenes: `svg(inner, 920, 300–342)`.
  - Shorter scenes above data rows: `920 × 230–260`.
  - Side scenes: the default `440 × 420`.
  - Give every scene a different `seed`, so the hand-drawn wobble varies between slides.
- **People:** `person(x, ground_y, scale, mood, shirt, arms, flip, extra)`.
  - Moods: `happy`, `big` (open smile), `sad`, `stress` (sweat drop and brows), `flat`, `oh` (surprised).
  - Shirts: `SL`, `S`, or `SD`.
  - Scale 0.7–1.05.
  - Mood must match the slide: problem slides get stress/sad/oh, solution and CTA slides get happy/big.
- **Arm presets:**
  - Down: `ARMS_DOWN`.
  - Hands on head (stress): `'M-36 -140 Q-74 -168 -38 -212 M36 -140 Q74 -168 38 -212'`.
  - Pointing right: `'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q80 -130 104 -150'`.
  - Holding a phone: `'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q74 -128 62 -170'`, with `phone()` near the hand.
  - Role props go in `extra`, for example a baker hat and apron.
- **Built-in props:**
  - Devices and sheets: `laptop` (with `sheet_grid` content), `phone`, `clipboard`, `calculator`-style rects.
  - Money and badges: `coin`, `jar`, `bill`, `tag` (price tag), `check_badge`, `x_badge`.
  - Notes and time: `sticky`, `clock`.
  - Other: `gear`, `megaphone`, `heart`, `die`.
  - Speech and decoration: `bubble` (think or speech, Caveat text), `sparkle` (ochre plus), `motion` lines, `arrow`, `ground`.
- **Custom props:** write small functions in the same style. Use plain `rect`/`path`/`circle` with palette fills and inherited ink stroke, inside the same `svg()` so the wobble filter applies. Examples already drawn: shopping cart, wallet, oven, truck, cardboard box with logo, sack, traffic light, car, bed, lamp.
- **Composition:**
  - One focal person (two for comparisons) plus 2–4 props.
  - A Caveat aside in ochre (`txt(..., color=ACCT)`).
  - 1–3 sparkles.
  - Always a `ground()` line.
  - Leave breathing room; don't fill every corner.
- **Allowed fills:** palette colors only (`PAPER`, `SL`, `S`, `SD`, `GREY`, `NOTE`, `ACC`, `#E9D6B6` cardboard, `#C9A27A` leather, `#E9A8A0` heart).

## 7. Spreadsheet and formula rules

- Show a formula together with its data: a `sheet()` mock with formula bar, column letters, row numbers, and the result cells highlighted (`cls={(r,c):'sel'}`), plus the result value.
- Use accurate Google Sheets syntax with `;` separators. Mention the Excel difference in a note when relevant.
- Use realistic Indonesian data (product names, Rupiah amounts with thousand dots), not "Item A".

## 8. Carousel structure

Use 7–10 slides. A typical arc:
1. Cover (hook + hero visual).
2. Context or example (character intro, or the dataset).
3–7. One idea per slide: mistake #n, step n, or comparison n, each with its own visual.
8. Result or recap (`duo_tiles`, `stackbar`, `checklist`).
9. CTA.

## 9. Build pipeline

1. **Project folder:** `/home/claude/carousel/SC<Name>/` with `style.css`, `fonts/`, both logos, `art.py`, and `sc.py`.
   - If an earlier `_kit` or `SC*` folder exists, symlink or copy from it.
   - Otherwise, write the three files from the appendices.
2. **Fonts:**
   - Run `cd fonts && npm pack @fontsource/nunito@5 @fontsource/raleway@5 @fontsource/caveat@5 @fontsource/jetbrains-mono@5`.
   - Extract each archive (`tar xzf <tgz>`) and rename `package/` to `nunito`, `raleway`, `caveat`, and `jbm`.
   - Poppins is usually a system font (`fc-list | grep -i poppins`). If it's missing, `npm pack @fontsource/poppins@5`, extract to `fonts/poppins`, and add `@font-face` rules for weights 400/600/700.
3. **Logos:** copy them from an earlier project folder, or stage them from Gideon's computer (SheetsCode content folders). Otherwise ask him to attach them. Never redraw the logo.
4. **build.py:** call `sc.init(D, total)`, define the data with asserts, write one `page(n, bg, inner)` per slide using components, then call `sc.render()` and `sc.contact(path)`.
   - Rendering uses Playwright with the preinstalled Chromium at device scale 3, so the output is 3240×4050 PNG.
5. **QA:** read the fill/overflow printout and fix every slide flagged `<-- FIX`. Then view the contact sheet, and view any slide with art or tables at full size.
   - Check: cover pill highlight, alternation, mood fits the message, numbers match the asserts, nothing touches the margins, notes are readable.
6. **Save:** to `C:\Users\PC\Documents\SheetsCode\0. Konten\N. Judul Konten\`, continuing the numbering, with files `01 - Judul.png` … and `Caption.txt`. Send the slides to Gideon as well.

## 10. Caption and CTA rules

- **Hashtags:** at most 5 per caption (IG, TikTok, Threads). Threads gets 1 hashtag.
- **Caption shape:** hook line, short body with emoji bullets, a question to drive comments, the CTA, "(Data di contoh ini fiktif.)" when relevant, then the hashtags. Also write a shorter Threads version.
- **Generic CTA:** don't lock the CTA to Google Sheets. Use "Butuh custom sistem untuk bisnis kamu?" + "Konsultasi via link di bio". Eyebrow on the CTA slide: "Custom sistem untuk bisnis". Avoid "Custom Sistem Google Sheets" in any CTA.
- **Gideon's CTA wins:** when he names a CTA (for example "Download Tracker Pencatatan Keuangan, link di bio", or "Butuh custom sistem iuran?"), use exactly that. Use `icon='dl'` for downloads.
- **Tone:** keep it low-pressure and follow the sheetscode-indonesian-copywriting skill.


## Appendix A: art.py (hand-drawn SVG kit, copy verbatim)

```python
"""Hand-drawn style line-art helpers (SVG strings). Panel coords: 440 x 420."""
INK = '#2D2A26'
SD, S, SL = '#4F6B53', '#789A7C', '#BFD0BC'
CR, PAPER, ACC, ACCT = '#FCF1E3', '#FFFAF2', '#C9963F', '#9A722A'
GREY = '#E6D9C6'
NOTE = '#F3DFB2'
SW = 4.2

_uid = [0]

def svg(inner, w=440, h=420, seed=3):
    _uid[0] += 1
    fid = f'sk{_uid[0]}'
    return f'''<svg viewBox="0 0 {w} {h}" width="100%" style="display:block;overflow:visible">
<defs><filter id="{fid}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="{seed}"/><feDisplacementMap in="SourceGraphic" scale="3.4"/></filter></defs>
<g filter="url(#{fid})" stroke="{INK}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round" fill="none">{inner}</g></svg>'''

def txt(x, y, t, size=30, rot=0, color=INK, anchor='middle', font='Caveat', weight=700):
    return f'<text x="{x}" y="{y}" transform="rotate({rot} {x} {y})" font-family="{font}" font-weight="{weight}" font-size="{size}" fill="{color}" stroke="none" text-anchor="{anchor}">{t}</text>'

ARMS_DOWN = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q52 -110 50 -78'

def person(x, y, s=1.0, mood='happy', shirt=SL, arms=ARMS_DOWN, flip=False, extra=''):
    fx = -1 if flip else 1
    mouth = {
        'happy': 'M-12 -177 Q0 -164 12 -177',
        'big': 'M-13 -178 Q0 -160 13 -178 Z',
        'sad': 'M-11 -168 Q0 -178 11 -168',
        'stress': 'M-12 -171 q4 -5 8 0 q4 5 8 0 q4 -5 8 0',
        'flat': 'M-10 -172 L10 -172',
        'oh': '',
    }[mood]
    face = f'<circle cx="-11" cy="-190" r="3.6" fill="{INK}" stroke="none"/><circle cx="11" cy="-190" r="3.6" fill="{INK}" stroke="none"/>'
    if mood == 'oh':
        face += '<ellipse cx="0" cy="-172" rx="6" ry="8"/>'
    else:
        mf = f'fill="{INK}"' if mood == 'big' else ''
        face += f'<path d="{mouth}" {mf}/>'
    if mood in ('stress', 'sad'):
        face += '<path d="M-19 -204 l11 4 M19 -204 l-11 4" stroke-width="3.4"/>'
        face += f'<path d="M40 -214 q-8 12 0 16 q8 -4 0 -16 Z" fill="#DCEAF0" stroke-width="3"/>'
    if mood in ('happy', 'big'):
        face += '<path d="M-19 -202 q6 -5 11 -1 M19 -202 q-6 -5 -11 -1" stroke-width="3.2"/>'
    return f'''<g transform="translate({x} {y}) scale({fx * s} {s})">
 <path d="M-16 -64 L-20 0 l-15 0 M16 -64 L20 0 l15 0"/>
 <path d="M-34 -150 Q-42 -150 -44 -130 L-47 -68 Q-47 -60 -40 -60 L40 -60 Q47 -60 47 -68 L44 -130 Q42 -150 34 -150 Z" fill="{shirt}"/>
 <path d="{arms}"/>
 <circle cx="0" cy="-189" r="33" fill="{PAPER}"/>
 <path d="M-31 -197 Q-28 -228 2 -225 Q29 -224 32 -198 Q16 -211 -2 -208 Q-20 -206 -31 -197 Z" fill="{INK}"/>
 {face}{extra}
</g>'''

def ground(x1=20, x2=420, y=402):
    return f'<path d="M{x1} {y} L{x2} {y}" stroke-width="3" opacity=".5"/>'

def bubble(x, y, w, h, t, size=30, think=True, tail=(-1, 1)):
    tx, ty = tail
    out = f'<rect x="{x - w/2}" y="{y - h/2}" width="{w}" height="{h}" rx="{h/2}" fill="{PAPER}"/>'
    if think:
        out += f'<circle cx="{x + tx * w * .28}" cy="{y + ty * (h/2 + 16)}" r="8" fill="{PAPER}"/><circle cx="{x + tx * w * .36}" cy="{y + ty * (h/2 + 34)}" r="5" fill="{PAPER}"/>'
    else:
        out += f'<path d="M{x + tx*w*.15} {y + h/2 - 2} L{x + tx*w*.32} {y + h/2 + 26} L{x + tx*w*.30} {y + h/2 - 2}" fill="{PAPER}"/>'
    return out + txt(x, y + size * .33, t, size)

def jar(x, y, w, h, label, coins=3, lsize=20):
    c = ''.join(f'<ellipse cx="{x - w/2 + 22 + (i % 3) * (w - 44) / 2}" cy="{y + h - 20 - (i // 3) * 18}" rx="15" ry="8" fill="{ACC}" stroke-width="3"/>' for i in range(coins))
    return (f'<path d="M{x - w/2 + 8} {y} L{x - w/2} {y + 14} L{x - w/2} {y + h - 8} Q{x - w/2} {y + h} {x - w/2 + 10} {y + h} L{x + w/2 - 10} {y + h} Q{x + w/2} {y + h} {x + w/2} {y + h - 8} L{x + w/2} {y + 14} L{x + w/2 - 8} {y} Z" fill="{PAPER}"/>'
            f'<rect x="{x - w/2 + 4}" y="{y - 18}" width="{w - 8}" height="18" rx="5" fill="{SD}"/>{c}'
            f'<rect x="{x - w/2 + 10}" y="{y + 30}" width="{w - 20}" height="34" rx="6" fill="{CR}" stroke-width="3"/>'
            + txt(x, y + 54, label, lsize, font='Raleway', weight=700))

def coin(x, y, r=13):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{ACC}" stroke-width="3"/>' + txt(x, y + 7, '$', 19, font='Poppins')

def arrow(d, head):
    return f'<path d="{d}" stroke-width="3.6"/><path d="{head}" stroke-width="3.6"/>'

def laptop(x, y, w=170, content=''):
    h = w * .62
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{PAPER}"/>'
            f'<path d="M{x - 18} {y + h + 22} L{x + w + 18} {y + h + 22} L{x + w} {y + h} L{x} {y + h} Z" fill="{GREY}"/>' + content)

def sheet_grid(x, y, w, h, rows=4, cols=3, fill=CR):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{fill}" stroke-width="3"/>'
    out += f'<rect x="{x}" y="{y}" width="{w}" height="{h / rows}" fill="{SL}" stroke-width="3"/>'
    for r in range(1, rows):
        out += f'<path d="M{x} {y + r * h / rows} L{x + w} {y + r * h / rows}" stroke-width="2.4"/>'
    for c in range(1, cols):
        out += f'<path d="M{x + c * w / cols} {y} L{x + c * w / cols} {y + h}" stroke-width="2.4"/>'
    return out

def check_badge(x, y, r=22):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SD}"/><path d="M{x - 9} {y} L{x - 2} {y + 8} L{x + 10} {y - 8}" stroke="{CR}" stroke-width="4.4"/>'

def x_badge(x, y, r=22):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{GREY}"/><path d="M{x - 8} {y - 8} L{x + 8} {y + 8} M{x + 8} {y - 8} L{x - 8} {y + 8}" stroke-width="4"/>'

def sticky(x, y, t, rot=0, size=24, w=96):
    return (f'<g transform="rotate({rot} {x} {y})"><rect x="{x - w/2}" y="{y - w/2 + 8}" width="{w}" height="{w - 16}" fill="{NOTE}" stroke-width="3"/>'
            + txt(x, y + 6, t, size) + '</g>')

def phone(x, y, w=74, h=130):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{PAPER}"/>'
    for i, (dx, ww) in enumerate([(8, 44), (22, 44), (8, 38), (22, 40)]):
        out += f'<rect x="{x + dx}" y="{y + 16 + i * 26}" width="{ww}" height="17" rx="8" fill="{SL if i % 2 else GREY}" stroke-width="2.6"/>'
    return out

def tag(x, y, t, rot=0, size=28, w=120, fill=CR):
    return (f'<g transform="rotate({rot} {x} {y})"><path d="M{x - w/2 + 22} {y - 26} L{x + w/2} {y - 26} L{x + w/2} {y + 26} L{x - w/2 + 22} {y + 26} L{x - w/2} {y} Z" fill="{fill}"/>'
            f'<circle cx="{x - w/2 + 20}" cy="{y}" r="5"/>' + txt(x + 10, y + 9, t, size, font='Poppins', weight=700) + '</g>')

def clock(x, y, r=34):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{PAPER}"/><path d="M{x} {y} L{x} {y - r + 10} M{x} {y} L{x + r - 14} {y + 6}"/><path d="M{x - r - 12} {y - 18} l-10 -6 M{x + r + 12} {y - 18} l10 -6" stroke-width="3"/>'

def die(x, y, s=46, rot=0, dots=((0.3, 0.3), (0.7, 0.7), (0.5, 0.5))):
    d = ''.join(f'<circle cx="{x + a * s}" cy="{y + b * s}" r="4.5" fill="{INK}" stroke="none"/>' for a, b in dots)
    return f'<g transform="rotate({rot} {x + s/2} {y + s/2})"><rect x="{x}" y="{y}" width="{s}" height="{s}" rx="9" fill="{PAPER}"/>{d}</g>'

def motion(x, y, n=3, ang=0, length=22):
    return ''.join(f'<path d="M{x} {y + i * 12} l{length} 0" transform="rotate({ang} {x} {y})" stroke-width="3"/>' for i in range(n))

def sparkle(x, y, s=12, color=ACC):
    return f'<path d="M{x} {y - s} L{x} {y + s} M{x - s} {y} L{x + s} {y}" stroke="{color}" stroke-width="3.6"/>'

def heart(x, y, s=1.0, fill='#E9A8A0'):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 10 C-26 -8 -14 -30 0 -16 C14 -30 26 -8 0 10 Z" fill="{fill}" stroke-width="3.4"/>'

def bill(x, y, rot=0):
    return (f'<g transform="rotate({rot} {x} {y})"><rect x="{x - 30}" y="{y - 16}" width="60" height="32" rx="4" fill="#D7E4D3" stroke-width="3"/>'
            f'<circle cx="{x}" cy="{y}" r="8" stroke-width="2.6"/><path d="M{x - 30} {y - 4} q-16 -18 -26 -4 M{x + 30} {y - 4} q16 -18 26 -4" stroke-width="3"/></g>')

def gear(x, y, r=30):
    teeth = ''.join(f'<rect x="{x - 7}" y="{y - r - 10}" width="14" height="16" rx="3" fill="{SL}" transform="rotate({a} {x} {y})" stroke-width="3"/>' for a in range(0, 360, 45))
    return teeth + f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SL}"/><circle cx="{x}" cy="{y}" r="{r * .38}" fill="{PAPER}"/>'

def clipboard(x, y, w=110, h=140, title='SOP', ticks=3):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{PAPER}"/><rect x="{x + w/2 - 24}" y="{y - 10}" width="48" height="20" rx="6" fill="{SD}"/>'
    out += txt(x + w/2, y + 40, title, 24, font='Raleway', weight=700)
    for i in range(ticks):
        yy = y + 64 + i * 24
        out += f'<path d="M{x + 16} {yy} l6 7 l10 -12" stroke="{SD}" stroke-width="3.6"/><path d="M{x + 40} {yy} L{x + w - 16} {yy}" stroke-width="3"/>'
    return out

def megaphone(x, y):
    return (f'<path d="M{x} {y - 14} L{x + 60} {y - 40} L{x + 60} {y + 40} L{x} {y + 14} Z" fill="{ACC}"/>'
            f'<rect x="{x - 14}" y="{y - 16}" width="16" height="32" rx="4" fill="{PAPER}"/>'
            f'<path d="M{x + 76} {y - 30} q14 30 0 60 M{x + 92} {y - 44} q22 44 0 88" stroke-width="3.4"/>')
```

## Appendix B: sc.py (page shell, components, render, QA)

```python
"""SheetsCode carousel kit: page shell + HTML components. Pair with art.py (hand-drawn SVG)."""
import os, glob, asyncio
from art import *   # svg, txt, person, ground, bubble, laptop, sheet_grid, ... + colors

INK2, MUTED, GRID = '#4A453E', '#8A8175', '#E6D9C6'
SXD, RED, TERRA, SLATE = '#2F4A34', '#C0503F', '#C98B6B', '#7C8FA6'
LINE_S = 'rgba(252,241,227,.28)'          # divider colour on sage slides
CARD = f'background:{PAPER};border:2px solid {GRID};border-radius:30px;color:{INK}'
D, TOTAL = None, 8

def init(d, total):
    """d = project folder (contains style.css, fonts/, logos). Clears old slides."""
    global D, TOTAL
    D, TOTAL = d, total
    for f in glob.glob(os.path.join(d, 'slide*.html')) + glob.glob(os.path.join(d, 'slide*.png')):
        os.remove(f)

def rp(n): return 'Rp' + f'{n:,.0f}'.replace(',', '.')

def page(n, bg, inner):
    logo = 'logo_sheetscode_sage.png' if bg == 'cream' else 'logo_sheetscode_cream.png'
    doc = f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="style.css"></head>
<body><div class="slide {bg}">
<div class="top"><div class="lockup"><img src="{logo}"><div class="wm"><b>Sheets</b><span>Code</span></div></div><div class="pg">{n}/{TOTAL}</div></div>
<div class="main">{inner}</div></div></body></html>'''
    open(os.path.join(D, f'slide{n:02d}.html'), 'w').write(doc)

# ---------- text atoms ----------
def eyebrow(t): return f'<div class="eyebrow">{t}</div>'
def h1(t, size=76, lh=1.12): return f'<h1 style="font-size:{size}px;line-height:{lh}">{t}</h1>'
def body(t, mt=28, size=34): return f'<div class="body" style="margin-top:{mt}px;font-size:{size}px">{t}</div>'
def note(t, mt=22, right=False):
    return f'<div style="margin-top:{mt}px;{"text-align:right" if right else ""}"><span class="note">{t}</span></div>'
def pillh(t, bg, fg):
    """Highlight 1-2 key words inside a headline: cream slide -> pillh(t, SD, CR); sage slide -> pillh(t, CR, SD)."""
    return f'<span style="display:inline-block;line-height:1;padding:6px 20px 12px;border-radius:18px;background:{bg};color:{fg}">{t}</span>'
def lab(t, color=MUTED, size=22):
    return f'<div style="font-family:Raleway;font-weight:700;font-size:{size}px;letter-spacing:2px;color:{color};text-transform:uppercase">{t}</div>'

# ---------- panels ----------
def panel(inner, pad='28px 32px', mt=36, extra=''):
    """The ONE main visual container of a slide (works on cream and sage)."""
    return f'<div style="{CARD};margin-top:{mt}px;padding:{pad};{extra}">{inner}</div>'

def art_panel(art, mt=36, pad='26px 30px 16px'):
    """Hand-drawn scene on a paper card. art = svg(...) from art.py."""
    return panel(art, pad, mt)

def rows(items, total=None, size=31):
    """Price/value rows with optional bold total line. items: [(label, value_str)], total: (label, value_str)."""
    r = ''.join(f'''<div style="display:flex;justify-content:space-between;align-items:baseline;padding:13px 0;border-top:2px solid {GRID}">
 <span style="font-family:Nunito;font-weight:700;font-size:{size}px;color:{INK2}">{a}</span>
 <span style="font-family:Poppins;font-weight:600;font-size:{size}px">{b}</span></div>''' for a, b in items)
    if total:
        r += f'''<div style="display:flex;justify-content:space-between;align-items:baseline;padding:16px 0 0;border-top:3px solid {INK}">
 <span style="font-family:Poppins;font-weight:700;font-size:32px">{total[0]}</span>
 <span style="font-family:Poppins;font-weight:700;font-size:40px;color:{SD}">{total[1]}</span></div>'''
    return r

def art_rows(art, items, total=None):
    """Signature HPP layout: illustration on top, data rows under it, inside one card."""
    return panel(f'<div style="margin:-6px 0 10px">{art}</div>' + rows(items, total), '24px 32px 28px')

def facts_side(art, facts):
    """Illustration left, label/value facts right. facts: [(LABEL, value)]."""
    f = ''.join(f'<div style="padding:16px 0;border-top:2px solid {GRID}">{lab(k)}<div style="font-family:Poppins;font-weight:700;font-size:36px;line-height:1.2;margin-top:4px">{v}</div></div>' for k, v in facts)
    return panel(f'<div style="display:flex;gap:30px;align-items:center"><div style="width:44%">{art}</div><div style="flex:1;border-bottom:2px solid {GRID}">{f}</div></div>', '30px 34px')

def duo_tiles(a, b, dark_second=True, mt=22):
    """'Dikira vs Nyatanya' tiles. a, b: (LABEL, small line, BIG value). Second tile dark sage = the truth."""
    def t(x, dark):
        st = f'background:{SD};color:{CR}' if dark else f'background:#fff;border:2px solid {GRID};color:{INK}'
        return f'<div style="flex:1;{st};border-radius:24px;padding:22px 26px">{lab(x[0], CR if dark else MUTED)}<div style="font-family:Nunito;font-weight:700;font-size:26px;opacity:.85;margin-top:4px">{x[1]}</div><div style="font-family:Poppins;font-weight:700;font-size:46px;line-height:1.15;margin-top:4px">{x[2]}</div></div>'
    return f'<div style="display:flex;gap:18px;margin-top:{mt}px">{t(a, False)}{t(b, dark_second)}</div>'

def stackbar(parts, total_label, mt=0):
    """Proportion bar + legend. parts: [(label, value, color)]; last part may be 'sisa' with stripes (color=None)."""
    tot = sum(v for _, v, _ in parts)
    segs = ''.join(f'<div style="width:{v / tot * 100:.2f}%;background:{c if c else "repeating-linear-gradient(45deg,#fff 0 10px,#EFE4D3 10px 20px)"}"></div>' for _, v, c in parts)
    leg = ''.join(f'<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:2px solid {GRID}"><span style="display:flex;align-items:center;gap:14px;font-family:Nunito;font-weight:700;font-size:30px;color:{INK2}"><i style="width:22px;height:22px;border-radius:5px;background:{c or "#EFE4D3"};border:2px solid {INK}22"></i>{l}</span><span style="font-family:Poppins;font-weight:600;font-size:30px">{rp(v)}</span></div>' for l, v, c in parts)
    return f'<div style="margin-top:{mt}px">{lab(total_label)}<div style="display:flex;height:56px;border-radius:14px;overflow:hidden;border:3px solid {INK};margin:12px 0 18px">{segs}</div>{leg}</div>'

XI = f'<svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 5 L17 17 M17 5 L5 17" stroke="{INK2}" stroke-width="3.4" stroke-linecap="round"/></svg>'
VI = f'<svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 11 L9 16 L18 6" stroke="{CR}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def chip_bad(t='SALAH'):
    return f'<div style="display:inline-flex;align-items:center;gap:8px;background:{GRID};color:{INK2};font-family:Raleway;font-weight:700;font-size:23px;letter-spacing:3px;padding:9px 18px;border-radius:999px">{XI}{t}</div>'
def chip_good(t='LEBIH BAIK'):
    return f'<div style="display:inline-flex;align-items:center;gap:8px;background:{SD};color:{CR};font-family:Raleway;font-weight:700;font-size:23px;letter-spacing:3px;padding:9px 18px;border-radius:999px">{VI}{t}</div>'

def split(bad_html, good_html, bad_t='SALAH', good_t='LEBIH BAIK'):
    """Before/after panel: two mini-visuals (svg charts, sheet mocks) side by side with chips."""
    return panel(f'''<div style="display:flex;gap:22px">
 <div style="flex:1;min-width:0">{chip_bad(bad_t)}<div style="margin-top:16px">{bad_html}</div></div>
 <div style="flex:1;min-width:0">{chip_good(good_t)}<div style="margin-top:16px">{good_html}</div></div></div>''', '26px 26px 28px', 34)

def versus(left, right, lt='STUCK', rt='GROWING'):
    """Two columns, each (art, heading, desc), dashed divider. Use for X vs Y / habit comparisons."""
    def col(chip, a):
        art, h, d = a
        return f'''<div style="flex:1;min-width:0">{chip}<div style="margin-top:18px">{art}</div>
 <div style="font-family:Poppins;font-weight:700;font-size:40px;line-height:1.14;color:{INK};margin-top:14px;text-wrap:balance">{h}</div>
 <div style="font-family:Nunito;font-weight:600;font-size:30px;line-height:1.35;color:{INK2};margin-top:8px">{d}</div></div>'''
    return panel(f'<div style="display:flex;gap:28px">{col(chip_bad(lt), left)}<div style="border-left:3px dashed {GRID};margin:10px 0"></div>{col(chip_good(rt), right)}</div>', '32px 30px 40px', 42)

def filecard(label, ext, color, rot=0, w=210):
    """Mini document card with coloured type tag (XLSX, PDF, WA, FOTO...)."""
    return f'''<div style="width:{w}px;transform:rotate({rot}deg);background:#fff;border:2px solid {GRID};border-radius:16px;padding:14px 16px;box-shadow:0 8px 18px rgba(45,42,38,.08)">
 <span style="font-family:Raleway;font-weight:700;font-size:18px;letter-spacing:1px;color:#fff;background:{color};border-radius:6px;padding:4px 8px">{ext}</span>
 <div style="font-family:Nunito;font-weight:800;font-size:23px;line-height:1.2;color:{INK};margin-top:10px">{label}</div>
 <div style="height:8px;border-radius:4px;background:#EFE4D3;width:80%;margin-top:10px"></div><div style="height:8px;border-radius:4px;background:#EFE4D3;width:55%;margin-top:8px"></div></div>'''

def scatter(cards, height=330):
    """cards: [(html, x, y)] absolutely positioned (cover hero of messy files, receipts, notes)."""
    return f'<div style="position:relative;height:{height}px;margin-top:34px">' + ''.join(f'<div style="position:absolute;left:{x}px;top:{y}px">{h}</div>' for h, x, y in cards) + '</div>'

def date_tiles(items, hl=-1, mt=34):
    """Calendar tiles. items: [(SMALL, BIG)], hl = index highlighted dark."""
    return f'<div style="display:flex;gap:16px;margin-top:{mt}px">' + ''.join(f'''<div style="flex:1;border-radius:20px;padding:18px 0;text-align:center;{"background:" + SD + ";color:" + CR if i == hl else "background:#fff;border:2px solid " + GRID + ";color:" + INK}">
 <div style="font-family:Raleway;font-weight:700;font-size:22px;letter-spacing:3px;opacity:.75">{a}</div><div style="font-family:Poppins;font-weight:700;font-size:44px;line-height:1.1">{b}</div></div>''' for i, (a, b) in enumerate(items)) + '</div>'

def stage_rows(items, mt=34):
    """Timeline: coloured stage block left + description card right. items: [(SMALL, Stage, desc)]."""
    tones = [(SL, INK), (S, CR), (SD, CR), (SXD, CR)]
    out = ''
    for i, (a, b, d) in enumerate(items):
        bg, fg = tones[i % 4]
        out += f'''<div style="display:flex;gap:16px;margin-top:{0 if i == 0 else 16}px"><div style="width:250px;flex-shrink:0;background:{bg};color:{fg};border-radius:20px;padding:22px 22px">
 <div style="font-family:Raleway;font-weight:700;font-size:20px;letter-spacing:2px;opacity:.8">{a}</div><div style="font-family:Poppins;font-weight:700;font-size:34px;line-height:1.15">{b}</div></div>
 <div style="flex:1;background:#fff;border:2px solid {GRID};border-radius:20px;padding:20px 24px;font-family:Nunito;font-weight:600;font-size:28px;line-height:1.35;color:{INK2}">{d}</div></div>'''
    return f'<div style="margin-top:{mt}px">{out}</div>'

def kpi_row(items):
    """Mini dashboard KPI cards. items: [(LABEL, value, delta_or_empty)]."""
    return '<div style="display:flex;gap:16px">' + ''.join(f'<div style="flex:1;background:#fff;border:2px solid {GRID};border-radius:18px;padding:16px 18px;color:{INK}">{lab(a, MUTED, 20)}<div style="font-family:Poppins;font-weight:700;font-size:40px;line-height:1.15;margin-top:4px">{b}</div><div style="font-family:Nunito;font-weight:800;font-size:22px;color:{SD}">{c}</div></div>' for a, b, c in items) + '</div>'

def numbered(items, bg='cream', mt=34):
    """Numbered steps, each (title, desc). Circle colour flips per background."""
    circ = f'background:{SD};color:{CR}' if bg == 'cream' else f'background:{CR};color:{SD}'
    line = GRID if bg == 'cream' else LINE_S
    out = ''.join(f'''<div style="display:flex;gap:22px;padding:22px 0;border-top:2px solid {line}">
 <div style="flex-shrink:0;width:58px;height:58px;border-radius:50%;{circ};font-family:Poppins;font-weight:700;font-size:30px;display:flex;align-items:center;justify-content:center">{i + 1}</div>
 <div><div style="font-family:Poppins;font-weight:700;font-size:36px;line-height:1.2">{t}</div><div class="body" style="font-size:29px;margin-top:4px;{"" if bg == "cream" else "opacity:.9"}">{d}</div></div></div>''' for i, (t, d) in enumerate(items))
    return f'<div style="margin-top:{mt}px;border-bottom:2px solid {line}">{out}</div>'

def checklist(items, bg='sage', mt=34):
    line = GRID if bg == 'cream' else LINE_S
    box = INK if bg == 'cream' else CR
    return f'<div style="margin-top:{mt}px;border-bottom:2px solid {line}">' + ''.join(f'<div style="display:flex;align-items:center;gap:20px;padding:20px 0;border-top:2px solid {line}"><i style="flex-shrink:0;width:34px;height:34px;border:3px solid {box};border-radius:8px"></i><span style="font-family:Poppins;font-weight:600;font-size:33px;line-height:1.25">{t}</span></div>' for t in items) + '</div>'

def sheet(rows_, header, fx_cell=None, fx='', hl=(), aligns=None, cls=None, size=28):
    """Google Sheets mock. rows_: [[...]], header: [..], hl: data-row indexes to tint, cls: {(r,c): 'neg'|'pos'|'sel'}."""
    n = len(header); aligns = aligns or ['left'] + ['right'] * (n - 1); cls = cls or {}
    css = {'neg': f'color:{RED}', 'pos': f'color:{SD}', 'sel': f'outline:4px solid {SD};outline-offset:-4px;background:#EEF4EF', 'warn': f'background:#F8E1DC;color:{RED}'}
    td = f'padding:13px 14px;border-top:2px solid {GRID};border-right:2px solid {GRID};font-weight:700;white-space:nowrap'
    rn = f'width:46px;text-align:center;background:#F1E8DA;font-family:Raleway;font-size:20px;color:{MUTED};border-top:2px solid {GRID};border-right:2px solid {GRID}'
    head = '<tr><th style="width:46px;background:#F1E8DA"></th>' + ''.join(f'<th style="background:#F1E8DA;font-family:Raleway;font-size:20px;color:{MUTED};padding:8px 0;border-right:2px solid {GRID}">{"ABCDEFGH"[i]}</th>' for i in range(n)) + '</tr>'
    r1 = f'<tr><td style="{rn}">1</td>' + ''.join(f'<td style="{td};text-align:{aligns[i]};font-family:Raleway;font-size:20px;color:{MUTED};letter-spacing:1px">{h}</td>' for i, h in enumerate(header)) + '</tr>'
    body_ = ''.join(f'<tr><td style="{rn}">{ri + 2}</td>' + ''.join(f'<td style="{td};text-align:{aligns[ci]};{"background:#EEF4EF;" if ri in hl else ""}{css.get(cls.get((ri, ci), ""), "")};{"font-family:Poppins;font-weight:600" if ci else ""}">{v}</td>' for ci, v in enumerate(r)) + '</tr>' for ri, r in enumerate(rows_))
    fxbar = f'<div style="display:flex;gap:14px;align-items:center;padding:14px 20px;border-bottom:2px solid {GRID};font-family:JBM;font-size:24px;color:{INK2};background:{PAPER};white-space:nowrap"><b style="font-family:Raleway;font-size:22px;color:{MUTED}">{fx_cell}</b><span style="opacity:.4">fx</span>{fx}</div>' if fx_cell else ''
    return f'<div style="background:#fff;border:2px solid {GRID};border-radius:22px;overflow:hidden;color:{INK};font-size:{size}px;font-family:Nunito">{fxbar}<table style="width:100%;border-collapse:collapse">{head}{r1}{body_}</table></div>'

def formula(code_html, size=38, mt=34):
    """Formula bar box. Mark function with <span class=f>, ranges/args with <span class=r>."""
    return f'<div class="code" style="margin-top:{mt}px;font-size:{size}px;padding:28px 32px">{code_html}</div>'

def chat(lines, mt=34):
    """Speech bubbles. lines: [(text, mine_bool)]."""
    b = ''.join(f'<div style="display:flex;justify-content:{"flex-end" if me else "flex-start"};margin:10px 0"><div style="{"background:" + SD + ";color:" + CR if me else "background:#F1E8DA;color:" + INK};font-family:Nunito;font-weight:700;font-size:32px;line-height:1.3;padding:16px 24px;border-radius:24px;max-width:80%">{t}</div></div>' for t, me in lines)
    return panel(b, '16px 26px', mt)

CHAT_IC = lambda bg, fg: f'<svg width="60" height="60" viewBox="0 0 64 64" style="flex-shrink:0"><circle cx="32" cy="32" r="32" fill="{bg}"/><path d="M20 22 h24 a5 5 0 0 1 5 5 v12 a5 5 0 0 1 -5 5 h-13 l-8 7 v-7 h-3 a5 5 0 0 1 -5 -5 v-12 a5 5 0 0 1 5 -5 z" fill="{fg}"/></svg>'
DL_IC = lambda bg, fg: f'<svg width="60" height="60" viewBox="0 0 64 64" style="flex-shrink:0"><circle cx="32" cy="32" r="32" fill="{bg}"/><path d="M32 16 v22 m-10 -9 l10 10 l10 -10 M20 48 h24" fill="none" stroke="{fg}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def cta_banner(bg, q='Butuh custom sistem untuk bisnis kamu?', sub='Konsultasi via link di bio', icon='chat', mt=30):
    """bg = slide background. Cream slide -> dark sage banner; sage slide -> cream banner."""
    if bg == 'cream':
        st, qc, sc, ic = f'background:{SD};color:{CR}', CR, CR, (CHAT_IC if icon == 'chat' else DL_IC)(CR, SD)
    else:
        st, qc, sc, ic = f'background:{CR};color:{INK}', SD, INK2, (CHAT_IC if icon == 'chat' else DL_IC)(S, CR)
    return f'<div style="display:flex;align-items:center;gap:24px;margin-top:{mt}px;{st};border-radius:24px;padding:26px 32px">{ic}<div><div style="font-family:Poppins;font-weight:700;font-size:38px;line-height:1.2;color:{qc}">{q}</div><div style="font-family:Nunito;font-weight:700;font-size:30px;margin-top:6px;color:{sc}">{sub}</div></div></div>'

# ---------- render + QA ----------
def render(scale=3):
    from playwright.async_api import async_playwright
    async def main():
        async with async_playwright() as p:
            b = await p.chromium.launch()
            pg = await b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=scale)
            for n in range(1, TOTAL + 1):
                await pg.goto(f'file://{D}/slide{n:02d}.html')
                await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(250)
                m = await pg.evaluate('''() => { const M=document.querySelector('.main'); const r=[...M.children].map(e=>e.getBoundingClientRect());
                  const top=Math.min(...r.map(x=>x.top)), bot=Math.max(...r.map(x=>x.bottom));
                  return {fill:Math.round((bot-top)/1350*100), overflow:M.scrollHeight>M.clientHeight+1,
                    wide:[...M.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect(); return b.width>0&&(b.right>1001||b.left<79)}).length} }''')
                flag = '  <-- FIX' if m['overflow'] or m['wide'] or m['fill'] < 45 or m['fill'] > 82 else ''
                print(f"slide {n}: fill {m['fill']}% overflow={m['overflow']} out-of-margin={m['wide']}{flag}")
                await pg.screenshot(path=f'{D}/slide{n:02d}.png')
            await b.close()
    asyncio.run(main())

def contact(path, cols=4):
    from PIL import Image
    ims = [Image.open(f'{D}/slide{i:02d}.png').resize((540, 675)) for i in range(1, TOTAL + 1)]
    W = Image.new('RGB', (540 * cols, 675 * ((len(ims) + cols - 1) // cols)), 'white')
    for i, m in enumerate(ims): W.paste(m, ((i % cols) * 540, (i // cols) * 675))
    W.save(path)
```

## Appendix C: style.css

```css
@font-face{font-family:'Nunito';font-weight:600;src:url(fonts/nunito/files/nunito-latin-600-normal.woff2)}
@font-face{font-family:'Nunito';font-weight:700;src:url(fonts/nunito/files/nunito-latin-700-normal.woff2)}
@font-face{font-family:'Nunito';font-weight:800;src:url(fonts/nunito/files/nunito-latin-800-normal.woff2)}
@font-face{font-family:'Raleway';font-weight:700;src:url(fonts/raleway/files/raleway-latin-700-normal.woff2)}
@font-face{font-family:'Caveat';font-weight:700;src:url(fonts/caveat/files/caveat-latin-700-normal.woff2)}
@font-face{font-family:'JBM';font-weight:500;src:url(fonts/jbm/files/jetbrains-mono-latin-500-normal.woff2)}
@font-face{font-family:'JBM';font-weight:700;src:url(fonts/jbm/files/jetbrains-mono-latin-700-normal.woff2)}
:root{--sage:#789A7C;--sage-dk:#4F6B53;--sage-xdk:#2F4A34;--sage-lt:#BFD0BC;--cream:#FCF1E3;--paper:#FFFAF2;
--ink:#2D2A26;--ink2:#4A453E;--muted:#8A8175;--acc:#C9963F;--acct:#9A722A;--grid:#E6D9C6}
*{margin:0;padding:0;box-sizing:border-box;font-variant-numeric:lining-nums}
html,body{width:1080px;height:1350px}
body{font-family:'Nunito',sans-serif;overflow:hidden}
.slide{width:1080px;height:1350px;position:relative;padding:72px 80px 80px;display:flex;flex-direction:column}
.cream{background:var(--cream);color:var(--ink)} .sage{background:var(--sage);color:var(--cream)}
.slide::before{content:"";position:absolute;inset:0;pointer-events:none;background-size:120px 60px;
background-image:linear-gradient(to right,rgba(120,154,124,.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(120,154,124,.07) 1px,transparent 1px)}
.sage::before{background-image:linear-gradient(to right,rgba(252,241,227,.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(252,241,227,.07) 1px,transparent 1px)}
.top{display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2;flex-shrink:0}
.lockup{display:flex;align-items:center;gap:16px} .lockup img{height:54px;width:auto}
.lockup .wm{font-family:'Poppins';font-size:34px;letter-spacing:-.3px;line-height:1} .lockup .wm b{font-weight:700} .lockup .wm span{font-weight:400}
.pg{font-family:'Raleway';font-weight:700;font-size:26px;opacity:.55;letter-spacing:1px}
.main{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2}
.eyebrow{font-family:'Raleway';font-weight:700;font-size:28px;letter-spacing:3px;text-transform:uppercase;margin-bottom:18px}
.cream .eyebrow{color:var(--sage-dk)} .sage .eyebrow{color:var(--cream);opacity:.85}
h1{font-family:'Poppins';font-weight:700;font-size:76px;line-height:1.1;letter-spacing:-1.5px;text-wrap:balance}
.body{font-family:'Nunito';font-weight:600;font-size:34px;line-height:1.4} .cream .body{color:var(--ink2)} .body b{font-weight:800}
.note{font-family:'Caveat';font-weight:700;font-size:40px;line-height:1;display:inline-block;transform:rotate(-2deg);margin-left:6px}
.cream .note{color:var(--acct)} .sage .note{color:var(--cream)}
.item{padding:20px 0;border-top:2px solid var(--grid)} .sage .item{border-top-color:rgba(252,241,227,.28)}
.item .t{font-family:'Poppins';font-weight:700;font-size:36px;line-height:1.2;letter-spacing:-.3px}
.item .d{font-family:'Nunito';font-weight:600;font-size:30px;line-height:1.35;margin-top:4px} .cream .item .d{color:var(--ink2)} .sage .item .d{opacity:.9}
.list{margin-top:36px;border-bottom:2px solid var(--grid)} .sage .list{border-bottom-color:rgba(252,241,227,.28)}
.code{font-variant-ligatures:none;background:var(--sage-xdk);color:var(--cream);border-radius:24px;font-family:'JBM';font-weight:500;white-space:pre}
.code .f{color:#fff;font-weight:700} .code .r{color:#E2B96A} .code .c{opacity:.5}
```

## Appendix D: example build.py (slides from the tested Weekend carousel)

```python
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))   # folder with sc.py + art.py
import sc
from sc import *
D = os.path.dirname(os.path.abspath(__file__))
sc.init(D, 7)

ITEMS = [('Sabun &amp; detergen', 76000, 'Perlu'), ('Sayur &amp; lauk', 134000, 'Perlu'),
         ('Serum baru', 189000, 'Pengen'), ('Kaos 3 pcs', 149000, 'Pengen'), ('Kopi kekinian 4x', 120000, 'Pengen')]
JATAH = 500000
TOT = sum(v for _, v, _ in ITEMS); PERLU = sum(v for _, v, t in ITEMS if t == 'Perlu')
assert (TOT, PERLU) == (668000, 210000)
PHONE_ARM = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q74 -128 62 -170'
POINT = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q80 -130 104 -150'

def cart(x, y):   # custom prop in the same hand-drawn style
    return (f'<rect x="{x + 22}" y="{y - 46}" width="54" height="58" rx="6" fill="#E9D6B6"/>'
            f'<path d="M{x + 82} {y + 8} L{x + 90} {y - 54} L{x + 126} {y - 54} L{x + 132} {y + 8} Z" fill="{SL}"/>'
            f'<path d="M{x - 30} {y - 20} L{x} {y - 20} L{x + 14} {y + 80} L{x + 140} {y + 80} L{x + 156} {y} L{x + 6} {y}" fill="{PAPER}"/>'
            f'<path d="M{x + 40} {y} L{x + 46} {y + 80} M{x + 80} {y} L{x + 80} {y + 80} M{x + 120} {y} L{x + 114} {y + 80}" stroke-width="2.6"/>'
            f'<circle cx="{x + 34}" cy="{y + 104}" r="13" fill="{PAPER}"/><circle cx="{x + 124}" cy="{y + 104}" r="13" fill="{PAPER}"/>')

# 1 COVER (sage): pill highlight + hand-drawn hero scene + Caveat note
cover = svg(person(210, 330, .95, 'stress', SL, PHONE_ARM) + phone(262, 92, 52, 92) + cart(470, 200)
            + bubble(250, 40, 250, 56, 'cuma lihat-lihat...', 28, True, (1, 1))
            + txt(700, 120, 'checkout!', 32, -8, ACCT) + sparkle(660, 70) + tag(780, 260, '500k', -6, 26, 120)
            + ground(40, 880, 332), 920, 342, seed=11)
page(1, 'sage', f'''
{eyebrow('Weekend')}
{h1(f"Niat Hemat, Keranjang {pillh('Penuh', CR, SD)} Lagi?", 90, 1.16)}
{body('Jatahnya Rp500.000. Isi keranjangnya Rp668.000.', 26)}
{art_panel(cover, 36)}
{note('geser, siapa tahu ini kamu juga')}''')

# 2 (cream): scene on top + data rows below in one card
art2 = svg(person(110, 236, .68, 'oh', S, PHONE_ARM) + phone(144, 60, 40, 70) + cart(250, 120)
           + txt(520, 90, 'murah kok...', 34, -6, ACCT) + ground(20, 900, 238), 920, 246, seed=12)
page(2, 'cream', f'''
{eyebrow('Isi keranjang')}
{h1('Satu per Satu Terlihat Murah')}
{art_rows(art2, [(n, rp(v)) for n, v, _ in ITEMS], ('Total keranjang', rp(TOT)))}
{note('baru kerasa waktu dijumlahkan')}''')

# 3 (sage): formula + proportion bar + punchline
page(3, 'sage', f'''
{eyebrow('Satu rumus')}
{h1('Jumlahkan yang Perlu Saja')}
{formula('<span class="f">=SUMIF</span>(<span class="r">C2:C6</span>; "Perlu"; <span class="r">B2:B6</span>)', 33, 30)}
{panel(stackbar([('Perlu', PERLU, SD), ('Pengen', TOT - PERLU, ACC)], 'ISI KERANJANG ' + rp(TOT)), '24px 30px 18px', 22)}
{body(f'Yang benar-benar perlu cuma {rp(PERLU)}. <b>Sisa jatah {rp(JATAH - PERLU)}.</b>', 26, 32)}''')

# ... CTA slide: art (person 'big' + laptop(sheet_grid) + check_badge) + cta_banner('sage', ..., icon='dl')
sc.render(); sc.contact(os.path.join(D, 'contact.png'))
```