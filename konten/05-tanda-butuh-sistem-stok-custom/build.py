"""Carousel promosi: 3 tanda bisnismu sudah butuh sistem stok custom (cover sage).

Usage: python3 build.py  -> slide01..09.png (3240x4050) + contact.png
Contoh fiktif: Toko Kurnia, grosir sembako (sama dengan konten 04).
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sc
from sc import *

D = os.path.dirname(os.path.abspath(__file__))
TOTAL = 9
sc.init(D, TOTAL)

# ---------- data (fiktif) ----------
SELISIH = [('Jul', 1_200_000), ('Agu', 1_900_000), ('Sep', 2_600_000), ('Okt', 3_400_000)]
assert all(a[1] < b[1] for a, b in zip(SELISIH, SELISIH[1:]))
assert round(SELISIH[-1][1] / SELISIH[0][1], 1) == 2.8          # "hampir 3x"

# Barang, satuan, stok, stok minimum. Status: <= min -> Pesan, > 4x min -> Numpuk, selain itu Aman
STOK = [('Minyak 2 L', 'pcs', 18, 40), ('Beras 5 kg', 'karung', 52, 30), ('Gula 1 kg', 'pcs', 22, 25),
        ('Telur', 'tray', 35, 20), ('Sarden', 'kaleng', 140, 24)]
def status(s, m): return 'Pesan' if s <= m else ('Numpuk' if s > m * 4 else 'Aman')
STATUS = [status(s, m) for _, _, s, m in STOK]
assert STATUS == ['Pesan', 'Aman', 'Pesan', 'Aman', 'Numpuk']

def jt(n): return f'Rp{n / 1e6:.1f}'.replace('.', ',').replace(',0', '') + ' jt'

# ---------- custom props ----------
HOLD = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q66 -118 70 -150'
HEAD = 'M-36 -140 Q-74 -168 -38 -212 M36 -140 Q74 -168 38 -212'
HANDS_UP = 'M-36 -140 Q-70 -170 -60 -214 M36 -140 Q70 -170 60 -214'
POINT = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q80 -130 104 -150'
PHONE_ARM = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q74 -128 62 -170'

def box(x, y, w, h, t='', size=18):
    out = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="#E9D6B6"/>'
           f'<path d="M{x + w/2 - 10} {y} L{x + w/2 - 10} {y + h * .32} L{x + w/2 + 10} {y + h * .32} L{x + w/2 + 10} {y}" stroke-width="2.6"/>')
    if t:
        out += txt(x + w/2, y + h * .74, t, size, font='Raleway', weight=700)
    return out

def can(x, y, w=34, h=26):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="{SL}" stroke-width="3"/><path d="M{x + 4} {y + 8} L{x + w - 4} {y + 8}" stroke-width="2"/>'

def papers(x, y, n=3, w=70, h=52):
    out = ''
    for i in range(n):
        rot = (-8, 5, -3, 7)[i % 4]
        yy = y - i * 13
        out += (f'<g transform="rotate({rot} {x + w/2} {yy + h/2})"><rect x="{x}" y="{yy}" width="{w}" height="{h}" rx="3" fill="{PAPER}" stroke-width="3"/>'
                f'<path d="M{x + 12} {yy + 18} L{x + w - 14} {yy + 18} M{x + 12} {yy + 32} L{x + w - 24} {yy + 32}" stroke-width="2.2"/></g>')
    return out

def desk(x, y, w):
    return f'<rect x="{x}" y="{y}" width="{w}" height="14" rx="4" fill="#C9A27A"/><path d="M{x + 14} {y + 14} L{x + 14} {y + 60} M{x + w - 14} {y + 14} L{x + w - 14} {y + 60}"/>'

def mini_bars(x, y, w, h, vals, hl=-1):
    """Mini bar chart di layar laptop."""
    bw = w / (len(vals) * 1.6)
    out = ''
    for i, v in enumerate(vals):
        bh = h * v
        out += f'<rect x="{x + i * bw * 1.6 + bw * .3}" y="{y + h - bh}" width="{bw}" height="{bh}" rx="2" fill="{SD if i == hl else SL}" stroke-width="2.4"/>'
    return out

# ---------- 1 COVER (sage) ----------
cover = svg(
    box(40, 250, 104, 80, 'BERAS') + box(150, 262, 90, 68) + box(62, 172, 92, 78, 'GULA')
    + txt(200, 214, '?', 48, 8) + txt(108, 128, 'tadi masih ada...', 30, -5, ACCT)
    + person(390, 330, .95, 'stress', SL, HEAD)
    + phone(540, 168, 62, 112) + bubble(640, 92, 270, 58, 'stok minyak masih?', 27, False, (-1, 1))
    + papers(660, 278, 3, 70, 50) + sticky(820, 236, 'habis??', 6, 28, 112)
    + sparkle(300, 70) + sparkle(870, 120, 10) + motion(470, 120, 3, -20, 18)
    + ground(20, 900, 330), 920, 340, seed=51)
page(1, 'sage', f'''
{eyebrow('Sistem stok')}
{h1(f"3 Tanda Bisnismu Sudah Butuh {pillh('Sistem Stok', CR, SD)} Custom", 86, 1.16)}
{body('Kalau 2 dari 3 tanda ini sering kejadian, catatan manual sudah mulai kewalahan.', 26, 32)}
{art_panel(cover, 34)}
{note('geser, cek bisnismu juga')}''')

# ---------- 2 (cream) tanda 1: selisih makin besar ----------
mx = SELISIH[-1][1]
bars = f'<rect x="300" y="18" width="590" height="226" rx="14" fill="{PAPER}"/>'
for i, (b, v) in enumerate(SELISIH):
    bx, bh = 360 + i * 130, 150 * v / mx
    bars += (f'<rect x="{bx}" y="{214 - bh}" width="72" height="{bh}" rx="5" fill="{RED if i == 3 else SL}" stroke-width="3"/>'
             + txt(bx + 36, 242, b, 30) + txt(bx + 36, 202 - bh, jt(v).replace('Rp', ''), 30, color=ACCT))
bars += f'<path d="M330 214 L870 214" stroke-width="3"/>'
art2 = svg(person(150, 262, .9, 'oh', SL, POINT) + bars + sparkle(70, 70) + ground(20, 290, 262), 920, 272, seed=52)
page(2, 'cream', f'''
{eyebrow('Tanda #1')}
{h1('Selisih Opname Makin Besar Tiap Bulan')}
{panel(f'<div style="margin:-4px 0 18px">{art2}</div>' + kpi_row([('Selisih Juli', jt(SELISIH[0][1]), 'nilai barang'), ('Selisih Oktober', jt(SELISIH[-1][1]), 'hampir 3× lipat')]), '24px 30px 28px', 34)}
{body('Barang di catatan ada, di rak nggak ada. <b>Seringnya bukan hilang, tapi keluar tanpa tercatat.</b>', 28, 32)}
{note('contoh fiktif: Toko Kurnia, grosir sembako')}''')

# ---------- 3 (sage) penyebab: barang keluar lewat chat ----------
page(3, 'sage', f'''
{eyebrow('Kenapa bisa begitu')}
{h1('Barang Keluar Lewat Chat, Bukan Lewat Catatan')}
{chat([('Kak, ambil 2 dus mi buat warung ya. Nanti dicatat', False), ('Oke, tulis di buku ya', True),
       ('Waduh lupa, Kak. Kemarin rame banget', False)], 36)}
{body('Sistem stok bikin <b>setiap barang keluar wajib lewat form</b>, dan stoknya langsung berkurang saat itu juga.', 30, 32)}
{note('yang ngambil juga ketahuan siapa')}''')

# ---------- 4 (cream) tanda 2: laris kosong, lainnya numpuk ----------
shelf4 = (f'<path d="M680 60 L680 280 M880 60 L880 280"/>'
          + ''.join(f'<path d="M674 {y} L886 {y}"/>' for y in (60, 133, 206, 280))
          + sticky(780, 88, 'kosong', -4, 26, 92)
          + ''.join(can(694 + c * 44, 206 - 26 - r * 24) for r in range(2) for c in range(4))
          + ''.join(can(694 + c * 44, 280 - 26 - r * 24) for r in range(3) for c in range(4)))
art4 = svg(
    person(170, 280, .86, 'flat', S) + bubble(190, 50, 250, 58, 'minyak 2 L ada?', 28, False, (-1, 1))
    + person(470, 280, .86, 'sad', SL, flip=True) + f'<rect x="380" y="200" width="190" height="80" rx="6" fill="#C9A27A"/>'
    + txt(470, 54, 'habis lagi, Kak...', 30, -4, ACCT)
    + txt(780, 32, 'sarden: numpuk dari Mei', 26, 0, ACCT)
    + shelf4 + ground(20, 900, 280), 920, 290, seed=54)
page(4, 'cream', f'''
{eyebrow('Tanda #2')}
{h1('Yang Laris Sering Kosong, yang Lain Numpuk')}
{panel(f'<div style="margin:-6px 0 6px">{art4}</div>' + duo_tiles(('Laris', 'Minyak 2 L', 'Kosong 9 hari'), ('Numpuk', 'Sarden kaleng', '5 bulan diam')), '24px 30px 28px', 34)}
{body('Pembeli pulang dengan tangan kosong, sementara <b>uang tertahan di barang yang nggak jalan</b>.', 28, 32)}
{note('dua-duanya sama-sama bikin rugi')}''')

# ---------- 5 (sage) yang dibutuhkan: stok minimum + status ----------
def chip(t):
    st = {'Pesan': f'background:#F8E1DC;color:{RED}', 'Numpuk': f'background:{NOTE};color:{ACCT}', 'Aman': f'background:#EEF4EF;color:{SD}'}[t]
    return f'<span style="{st};border-radius:999px;padding:4px 16px;font-family:Poppins;font-weight:600;font-size:25px">{t}</span>'
rows5 = [[f'{n} <span style="color:{MUTED};font-size:22px">({u})</span>', s, m, chip(st)] for (n, u, s, m), st in zip(STOK, STATUS)]
fx5 = '<span style="color:#fff;background:#2F4A34;border-radius:6px;padding:2px 10px;font-variant-ligatures:none">=IFS(B2&lt;=C2;"Pesan";B2&gt;C2*4;"Numpuk";TRUE;"Aman")</span>'
page(5, 'sage', f'''
{eyebrow('Yang dibutuhkan')}
{h1('Stok Minimum yang Ngingetin Duluan')}
{panel(sheet(rows5, ['BARANG', 'STOK', 'MIN', 'STATUS'], 'D2', fx5, aligns=['left', 'right', 'right', 'center'], cls={(0, 3): 'sel'}, size=30), '22px 22px', 34)}
{body(f'Sistem tahu batas tiap barang. <b>{STATUS.count("Pesan")} barang perlu dipesan, 1 kebanyakan</b>, kelihatan tanpa ngecek rak.', 28, 32)}
{note('batas minimumnya bisa beda tiap barang')}''')

# ---------- 6 (cream) tanda 3: data tersebar ----------
p6 = f'<div style="width:250px">{svg(person(125, 270, 1.0, "stress", SL, HEAD) + ground(10, 240, 270), 250, 280, seed=56)}</div>'
page(6, 'cream', f'''
{eyebrow('Tanda #3')}
{h1('Data Stok Tersebar di Mana-mana')}
{scatter([(filecard('Stok gudang.xlsx', 'XLSX', '#5BAE7A', -6, 240), 8, 20), (filecard('Buku stok toko', 'BUKU', TERRA, 4, 230), 330, 0),
          (filecard('Chat admin gudang', 'WA', '#5BAE7A', 5, 236), 650, 30), (filecard('Foto nota supplier', 'FOTO', SLATE, -4, 240), 20, 250),
          (filecard('Stok cabang 2 final_rev.xlsx', 'XLSX', '#5BAE7A', 6, 240), 640, 260), (p6, 335, 190)], 470)}
{body('Mau tahu stok satu barang harus buka 3 tempat. <b>Satu sistem berarti satu angka yang dipercaya semua orang.</b>', 34, 32)}
{note('yang final_rev2 pasti ada juga')}''')

# ---------- 7 (sage) kenapa custom ----------
left7 = svg(person(110, 250, .8, 'oh', SL, PHONE_ARM) + phone(150, 92, 40, 70)
            + box(240, 190, 80, 60, 'DUS') + txt(300, 150, 'satuan pcs aja?', 26, -4, ACCT) + ground(10, 390, 250), 400, 262, seed=57)
right7 = svg(person(110, 250, .8, 'big', S, PHONE_ARM) + phone(150, 92, 40, 70)
             + desk(220, 196, 170) + laptop(240, 104, 120, sheet_grid(250, 112, 100, 54, 4, 3)) + check_badge(360, 98, 20)
             + sparkle(220, 60) + ground(10, 390, 250), 400, 262, seed=58)
page(7, 'sage', f'''
{eyebrow('Kenapa custom?')}
{h1('Aplikasi Jadi vs Sistem Custom')}
{versus((left7, 'Kamu yang menyesuaikan', 'Satuan dus/pcs, harga grosir, dan alur gudang dipaksa muat.'),
        (right7, 'Sistem yang menyesuaikan', 'Form, satuan, dan laporan dibuat sesuai cara kerja tokomu.'), 'APLIKASI JADI', 'CUSTOM')}
{note('kalau alurmu standar, aplikasi jadi juga cukup kok', 28)}''')

# ---------- 8 (cream) checklist ----------
art8 = svg(person(110, 250, .9, 'happy', SL, HOLD) + f'<rect x="146" y="92" width="64" height="84" rx="8" fill="{PAPER}"/><rect x="160" y="84" width="36" height="16" rx="5" fill="{SD}"/>'
           + ''.join(f'<path d="M156 {116 + i * 20} l5 6 l9 -10" stroke="{SD}" stroke-width="3.2"/><path d="M176 {116 + i * 20} L200 {116 + i * 20}" stroke-width="2.6"/>' for i in range(3))
           + sparkle(220, 50, 10) + ground(10, 230, 250), 240, 262, seed=59)
page(8, 'cream', f'''
{eyebrow('Cek bisnismu')}
<div style="display:flex;align-items:flex-end;gap:20px"><div style="flex:1">{h1('Berapa yang Kamu Centang?')}</div><div style="width:240px;flex-shrink:0">{art8}</div></div>
{checklist(['Selisih opname makin besar tiap bulan', 'Barang laris sering kosong, yang lain numpuk', 'Data stok tersebar di file, buku, dan chat'], 'cream', 30)}
{body('Kalau 2 dari 3 kamu centang, <b>itu saatnya pindah ke sistem.</b>', 30, 32)}
{note('centang dalam hati juga boleh')}''')

# ---------- 9 (sage) CTA ----------
cta = svg(person(230, 262, .92, 'big', SL, HANDS_UP)
          + desk(370, 196, 300) + laptop(400, 74, 200, sheet_grid(416, 88, 100, 96, 4, 2) + mini_bars(526, 92, 60, 88, (.5, .7, .9), 2))
          + check_badge(602, 80, 26)
          + box(720, 196, 110, 66, 'STOK') + box(740, 136, 80, 60)
          + sparkle(120, 60) + sparkle(150, 120, 9) + sparkle(870, 110, 10) + txt(780, 76, 'semua cabang sinkron!', 32, -6, ACCT)
          + ground(60, 880, 262), 916, 272, seed=60)
page(9, 'sage', f'''
{eyebrow('Custom sistem untuk bisnis')}
{h1('Stok Rapi, Kamu Tenang Jualan')}
{art_panel(cta, 32)}
{body('Barang masuk-keluar, stok minimum, dan semua cabang di satu sistem yang <b>dibuat sesuai alur tokomu</b>.', 28, 32)}
{cta_banner('sage')}
{note('simpan &amp; kirim ke partner bisnismu', 24)}''')

if __name__ == '__main__':
    sc.render(); sc.contact(os.path.join(D, 'contact.png'))
