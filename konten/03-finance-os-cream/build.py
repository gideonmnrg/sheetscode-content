"""Finance OS promo, versi cream: headline + demo web app + daftar 12 fitur.

Usage: python3 build.py <source_video.mp4>
Layer: tiap state (fitur aktif) dirender jadi PNG dengan lubang transparan berujung
bulat di area demo; rekaman web app (crop dari video sumber) ditaruh di bawahnya.
"""
import os, sys, asyncio, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sc import *

D = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else None

FEATURES = ['Catat uang masuk &amp; keluar', 'Budget per kategori', 'Saldo semua akun &amp; e-wallet',
            'Target tabungan', 'Portofolio investasi', 'Harga saham dari Google Finance',
            'Reminder tagihan via Gmail', 'Cicilan &amp; kartu kredit', 'Laporan tahunan + PDF',
            'Skor Financial Health', 'Login username &amp; password', 'Nyaman dibuka di HP']

# Timing fitur di video sumber (detik), dideteksi dari highlight daftar fitur.
SRC_START = 1.0                     # 0-1 dtk di sumber = animasi masuk kartu, dilewati
SRC_CHANGES = [(1.0, 1), (8.8, 2), (12.5, 3), (16.0, 4), (19.4, 5), (22.3, 6),
               (24.4, 7), (29.5, 8), (32.9, 9), (36.7, 10), (39.0, 'cta')]
SRC_END = 44.33
CROP = (82, 487, 916, 520)          # x, y, w, h area web app di video sumber
assert len(FEATURES) == 12

HOLE_W, HOLE_H, RADIUS = CROP[2], CROP[3], 30
DL = f'<svg width="30" height="30" viewBox="0 0 30 30"><path d="M15 5 v14 m-6 -6 l6 6 l6 -6 M7 25 h16" fill="none" stroke="{CR}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def cta_art():
    lap = laptop(400, 70, 250, sheet_grid(418, 86, 214, 120, 4, 3))
    return svg(person(260, 262, .92, 'big', SL, 'M-36 -140 Q-70 -170 -60 -214 M36 -140 Q70 -170 60 -214')
               + lap + check_badge(646, 76, 26) + heart(790, 100, 1.1) + sparkle(150, 60) + sparkle(180, 120, 9)
               + sparkle(870, 150, 10) + txt(790, 196, 'akhirnya rapi!', 38, -6, ACCT)
               + ground(80, 880, 264), 916, 272, seed=21)


def demo_box(state):
    if state != 'cta':
        return f'<div id="hole" style="width:{HOLE_W}px;height:{HOLE_H}px"></div>'
    banner = cta_banner('cream', 'Download sistemnya sekarang', 'Klik link di bio', icon='dl', mt=6)
    return (f'<div id="hole" style="width:{HOLE_W}px;height:{HOLE_H}px;background:{PAPER};padding:0 44px;display:flex;flex-direction:column;justify-content:center">'
            f'{cta_art()}{banner}</div>')


def feature_list(active):
    def item(i, t):
        on = i + 1 == active
        row = f'background:{SD};color:{CR}' if on else f'color:{INK}'
        circ = f'background:{CR};color:{SD}' if on else f'background:{SL};color:{SXD}'
        return (f'<div style="display:flex;align-items:center;gap:14px;height:44px;padding:0 14px;border-radius:14px;{row}">'
                f'<span style="flex-shrink:0;width:32px;height:32px;border-radius:50%;{circ};font-family:Poppins;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center">{i + 1}</span>'
                f'<span style="font-family:Poppins;font-weight:600;font-size:24px;white-space:nowrap">{t}</span></div>')
    col = lambda r: ''.join(item(i, FEATURES[i]) for i in r)
    return (f'<div style="display:flex;gap:6px;margin:20px -6px 0 -14px">'
            f'<div style="flex:1">{col(range(6))}</div><div style="flex:1.06">{col(range(6, 12))}</div></div>')


def frame_html(state):
    chip = 'Download sistemnya' if state == 'cta' else FEATURES[state - 1]
    head = f'''
<div style="font-family:Poppins;font-weight:700;font-size:50px;line-height:1.2;letter-spacing:-.8px;color:{INK2}">Melakukan Kegiatan Dewasa:</div>
<div style="display:flex;align-items:flex-end;gap:26px">
 <h1 style="font-size:84px;line-height:1.14">Mencatat Setiap<br>{pillh('Pengeluaran', SD, CR)}</h1>
 <div style="flex:1;padding-bottom:6px">
  <svg viewBox="0 0 300 150" width="100%" style="display:block;overflow:visible">
   <text x="150" y="48" transform="rotate(-5 150 48)" font-family="Caveat" font-weight="700" font-size="42" fill="{ACCT}" text-anchor="middle">pakai Google Sheets</text>
   <text x="150" y="90" transform="rotate(-5 150 90)" font-family="Caveat" font-weight="700" font-size="42" fill="{ACCT}" text-anchor="middle">+ Apps Script</text>
   <path d="M60 112 Q34 136 6 128 M6 128 l13 -12 M6 128 l15 7" stroke="{ACCT}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></div>
</div>'''
    card = f'''
<div style="margin-top:22px;background:{PAPER};border:2px solid {GRID};border-radius:{RADIUS + 2}px;overflow:hidden;box-shadow:0 14px 34px rgba(45,42,38,.08)">
 <div style="display:flex;align-items:center;justify-content:space-between;height:60px;padding:0 18px 0 24px;border-bottom:2px solid {GRID}">
  <div style="display:flex;align-items:center;gap:22px">
   <div style="display:flex;gap:9px">{''.join(f'<i style="width:14px;height:14px;border-radius:50%;background:{c}"></i>' for c in (GRID, GRID, GRID))}</div>
   {lab('SheetsCode Finance OS', MUTED, 21)}</div>
  <div style="font-family:Poppins;font-weight:600;font-size:22px;color:{SXD};background:#EEF4EF;border-radius:999px;padding:6px 18px">{chip}</div>
 </div>
 {demo_box(state)}
</div>'''
    active = None if state == 'cta' else state
    return f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="style.css"></head>
<body><div class="slide cream" style="padding-top:64px;padding-bottom:52px">
<div class="top"><div class="lockup"><img src="logo_sheetscode_sage.png"><div class="wm"><b>Sheets</b><span>Code</span></div></div>
 <div style="display:flex;align-items:center;gap:10px;background:{SD};color:{CR};border-radius:999px;padding:10px 24px 10px 18px;font-family:Poppins;font-weight:600;font-size:25px">{DL}Download · link di bio</div></div>
<div class="main" style="justify-content:flex-start;margin-top:30px">{head}{card}{feature_list(active)}</div></div></body></html>'''


STATES = list(range(1, 11)) + ['cta']


async def render_states():
    from playwright.async_api import async_playwright
    holes = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1080, 'height': 1350})
        for s in STATES:
            fn = os.path.join(D, f'state_{s}.html')
            open(fn, 'w').write(frame_html(s))
            await pg.goto(f'file://{fn}')
            await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(200)
            m = await pg.evaluate('''() => { const h=document.getElementById('hole').getBoundingClientRect();
                const s=document.querySelector('.slide'); const M=document.querySelector('.main');
                const bot=Math.max(...[...M.querySelectorAll('*')].map(e=>e.getBoundingClientRect().bottom));
                const wide=[...M.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&(r.right>1001||r.left<65)}).length;
                return {x:h.x, y:h.y, w:h.width, h:h.height, bottom:bot, wide} }''')
            holes[s] = m
            print(f'state {s}: hole {m["x"]:.0f},{m["y"]:.0f} {m["w"]:.0f}x{m["h"]:.0f}  content bottom {m["bottom"]:.0f}  out-of-margin={m["wide"]}')
            await pg.screenshot(path=os.path.join(D, f'state_{s}.png'))
        await b.close()
    return holes


def punch_hole(png, box):
    """Make the demo area transparent (rounded bottom corners) so the video shows through."""
    from PIL import Image, ImageDraw
    im = Image.open(png).convert('RGBA')
    x, y, w, h = [round(v) for v in (box['x'], box['y'], box['w'], box['h'])]
    mask = Image.new('L', im.size, 255)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((x, y, x + w - 1, y + h - 1), RADIUS, fill=0)
    d.rectangle((x, y, x + w - 1, y + RADIUS), fill=0)          # square top corners (under the bar)
    im.putalpha(mask)
    out = png.replace('.png', '_layer.png')
    im.save(out)
    return out, (x, y)


def build_video(holes):
    pos = {holes[s]['x'] for s in STATES[:-1]}, {holes[s]['y'] for s in STATES[:-1]}
    assert all(len(v) == 1 for v in pos), f'hole moves between states: {pos}'
    layers = {s: punch_hole(os.path.join(D, f'state_{s}.png'), holes[s]) for s in STATES[:-1]}
    hx, hy = layers[1][1]
    dur = SRC_END - SRC_START
    times = [(t - SRC_START, s) for t, s in SRC_CHANGES]
    spans = [(t0, times[i + 1][0] if i + 1 < len(times) else dur, s) for i, (t0, s) in enumerate(times)]
    x, y, w, h = CROP
    ff = lambda *a: subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)
    demo, lay = os.path.join(D, '_demo.mkv'), os.path.join(D, '_layers.mkv')
    # Pre-render both tracks at a fixed 30 fps from t=0 so the overlay stays in sync.
    ff('-ss', str(SRC_START), '-i', SRC, '-t', f'{dur:.3f}', '-vf', f'crop={w}:{h}:{x}:{y},fps=30',
       '-an', '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', demo)
    ins, chain = [], ''
    for i, (t0, t1, s) in enumerate(spans):
        img = layers[s][0] if s != 'cta' else os.path.join(D, 'state_cta.png')
        ins += ['-loop', '1', '-framerate', '30', '-t', f'{t1 - t0:.3f}', '-i', img]
        chain += f'[{i}:v]format=rgba,setsar=1[l{i}];'
    chain += ''.join(f'[l{i}]' for i in range(len(spans))) + f'concat=n={len(spans)}:v=1:a=0[out]'
    ff(*ins, '-filter_complex', chain, '-map', '[out]', '-c:v', 'png', lay)
    out = os.path.join(D, 'Finance OS - Cream.mp4')
    args = ['ffmpeg', '-v', 'error', '-y', '-i', demo, '-i', lay, '-filter_complex',
            f'color=c=0xFCF1E3:s=1080x1350:r=30:d={dur:.3f}[base];[base][0:v]overlay={hx}:{hy}[v0];[v0][1:v]overlay=0:0[v]',
            '-map', '[v]', '-t', f'{dur:.3f}', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
            '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]
    subprocess.run(args, check=True)
    os.remove(demo); os.remove(lay)
    print('video:', out)


if __name__ == '__main__':
    holes = asyncio.run(render_states())
    if SRC:
        build_video(holes)
