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
