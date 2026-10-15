"""Carousel edukasi: Alur stok opname manual vs pakai sistem (cover cream).

Usage: python3 build.py  -> slide01..09.png (3240x4050) + contact.png
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sc
from sc import *

D = os.path.dirname(os.path.abspath(__file__))
TOTAL = 9
sc.init(D, TOTAL)

# ---------- data (contoh fiktif: Toko Kurnia, grosir sembako) ----------
SKU = 320
MANUAL = [('Cetak daftar barang', 1), ('Hitung fisik, tulis di kertas', 6), ('Ketik ulang ke Excel', 4),
          ('Cocokkan dengan buku stok', 2), ('Cari &amp; koreksi selisih', 3)]
SISTEM = [('Daftar barang sudah di sistem', 0), ('Hitung fisik, input di HP', 5),
          ('Selisih dihitung otomatis', 0), ('Cek &amp; setujui selisih', 1)]
T_MAN, T_SIS = sum(h for _, h in MANUAL), sum(h for _, h in SISTEM)
assert (T_MAN, T_SIS) == (16, 6)

# Barang, stok sistem, hasil hitung fisik
STOK = [('Beras 5 kg', 'karung', 40, 34), ('Minyak 2 L', 'pcs', 120, 120), ('Gula 1 kg', 'pcs', 85, 88),
        ('Telur', 'tray', 30, 27), ('Mi instan', 'dus', 64, 64)]
SELISIH = [f - s for _, _, s, f in STOK]
assert SELISIH == [-6, 0, 3, -3, 0] and sum(1 for x in SELISIH if x) == 3


# ---------- custom props (gaya hand-drawn yang sama) ----------
HOLD = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q66 -118 70 -150'         # pegang clipboard
PHONE_ARM = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q74 -128 62 -170'
HANDS_UP = 'M-36 -140 Q-70 -170 -60 -214 M36 -140 Q70 -170 60 -214'
POINT = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q80 -130 104 -150'

def box(x, y, w, h, t='', size=20):
    out = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="#E9D6B6"/>'
           f'<path d="M{x + w/2 - 10} {y} L{x + w/2 - 10} {y + h * .32} L{x + w/2 + 10} {y + h * .32} L{x + w/2 + 10} {y}" stroke-width="2.6"/>')
    if t:
        out += txt(x + w/2, y + h * .74, t, size, font='Raleway', weight=700)
    return out

def barcode(x, y, w=44, h=24):
    bars = ''.join(f'<path d="M{x + 6 + i * (w - 12) / 7} {y + 5} L{x + 6 + i * (w - 12) / 7} {y + h - 5}" stroke-width="{2.6 if i % 2 else 1.8}"/>' for i in range(8))
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="#fff" stroke-width="2.4"/>' + bars

def shelf(x, y, w, h, levels=3):
    lv = h / levels
    out = f'<path d="M{x} {y} L{x} {y + h} M{x + w} {y} L{x + w} {y + h}"/>'
    for i in range(levels + 1):
        out += f'<path d="M{x - 6} {y + i * lv} L{x + w + 6} {y + i * lv}"/>'
    return out

def shelf_full(x, y, w=170, h=210, seed_boxes=((0, 'BERAS'), (1, ''), (2, 'GULA'))):
    out = shelf(x, y, w, h)
    lv = h / 3
    for i, t in seed_boxes:
        by = y + i * lv
        out += box(x + 10, by + 14, w * .48, lv - 14, t, 16) + box(x + 18 + w * .48, by + 26, w * .38, lv - 26)
    return out

def papers(x, y, n=4, w=78, h=60):
    out = ''
    for i in range(n):
        rot = (-8, 5, -3, 7)[i % 4]
        yy = y - i * 13
        out += (f'<g transform="rotate({rot} {x + w/2} {yy + h/2})"><rect x="{x}" y="{yy}" width="{w}" height="{h}" rx="3" fill="{PAPER}" stroke-width="3"/>'
                f'<path d="M{x + 12} {yy + 18} L{x + w - 14} {yy + 18} M{x + 12} {yy + 32} L{x + w - 24} {yy + 32}" stroke-width="2.2"/></g>')
    return out

def clip(x, y, w=74, h=92):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{PAPER}"/><rect x="{x + w/2 - 18}" y="{y - 8}" width="36" height="16" rx="5" fill="{SD}"/>'
    for i in range(3):
        yy = y + 28 + i * 20
        out += f'<path d="M{x + 12} {yy} L{x + w - 12} {yy}" stroke-width="2.6"/>'
    return out

def magnifier(x, y, r=26):
    return (f'<path d="M{x + r * .7} {y + r * .7} L{x + r * 1.6} {y + r * 1.6}" stroke-width="8"/>'
            f'<circle cx="{x}" cy="{y}" r="{r}" fill="#EEF4EF"/>')

def book(x, y, w=64, h=80):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="{SL}"/><path d="M{x + 12} {y} L{x + 12} {y + h}" stroke-width="3"/>'
            f'<rect x="{x + 22}" y="{y + 16}" width="{w - 32}" height="18" rx="3" fill="{PAPER}" stroke-width="2.4"/>')

def desk(x, y, w):
    return f'<rect x="{x}" y="{y}" width="{w}" height="14" rx="4" fill="#C9A27A"/><path d="M{x + 14} {y + 14} L{x + 14} {y + 60} M{x + w - 14} {y + 14} L{x + w - 14} {y + 60}"/>'

def node(cx, cy, n, icon, label, auto=False):
    """Kotak langkah di diagram alur: ikon + nomor + label Caveat di bawah."""
    fill = '#EEF4EF' if auto else PAPER
    return (f'<rect x="{cx - 66}" y="{cy - 58}" width="132" height="116" rx="20" fill="{fill}"/>' + icon
            + f'<circle cx="{cx - 62}" cy="{cy - 54}" r="20" fill="{SD}"/>' + txt(cx - 62, cy - 45, n, 24, font='Poppins', color=CR)
            + txt(cx, cy + 98, label, 30, color=ACCT if auto else INK))

def flow_arrow(x1, x2, y):
    return arrow(f'M{x1} {y} L{x2} {y}', f'M{x2 - 12} {y - 10} L{x2} {y} L{x2 - 12} {y + 10}')

# ---------- 1 COVER (cream) ----------
cover = svg(
    shelf_full(28, 120, 160, 210)
    + person(280, 330, .9, 'stress', SL, HOLD) + clip(318, 160, 70, 88)
    + papers(392, 280, 3, 64, 48) + clock(392, 74, 28)
    + txt(110, 74, 'hitung ulang lagi...', 30, -4, ACCT)
    + f'<path d="M478 50 L478 316" stroke-width="3" stroke-dasharray="4 14" opacity=".55"/>'
    + f'<circle cx="478" cy="186" r="34" fill="{CR}"/>' + txt(478, 198, 'vs', 40)
    + person(600, 330, .9, 'happy', S, PHONE_ARM) + phone(648, 120, 46, 80)
    + f'<path d="M670 204 L690 262 M684 204 L728 262" stroke="{ACC}" stroke-width="3" stroke-dasharray="6 9"/>'
    + box(660, 262, 92, 68) + barcode(684, 280, 44, 24)
    + desk(762, 286, 140) + laptop(774, 190, 116, sheet_grid(784, 198, 96, 54, 4, 3)) + check_badge(890, 182, 22)
    + txt(812, 120, 'beres siang ini', 30, -5, ACCT) + sparkle(560, 70) + sparkle(890, 70, 10)
    + ground(20, 900, 330), 920, 340, seed=41)
page(1, 'cream', f'''
{eyebrow('Stok opname')}
{h1(f"Alur Stok Opname: Manual vs Pakai {pillh('Sistem', SD, CR)}", 88, 1.16)}
{body('Barangnya sama, cara hitungnya sama. Bedanya di <b>waktu</b> dan <b>kapan selisih ketahuan</b>.', 26, 32)}
{art_panel(cover, 34)}
{note('geser, bandingin alurnya →')}''')

# ---------- 2 (sage) contoh fiktif ----------
art2 = svg(
    person(130, 402, .98, 'flat', SL, HOLD) + clip(172, 228, 78, 96)
    + box(262, 322, 90, 80, 'BERAS', 18) + box(356, 330, 74, 72) + box(282, 242, 82, 80, 'GULA', 18)
    + txt(330, 196, '320 macam!', 34, -6, ACCT) + sparkle(410, 170, 10) + sparkle(40, 120)
    + ground(10, 432, 402), 440, 420, seed=42)
page(2, 'sage', f'''
{eyebrow('Contoh fiktif')}
{h1('Kenalan Dulu dengan Toko Kurnia')}
{facts_side(art2, [('Usaha', 'Grosir sembako'), ('Barang', f'{SKU} SKU'), ('Opname', 'Tiap akhir bulan'), ('Tim hitung', '2 orang')])}
{body('Tiap bulan, stok di catatan harus dicocokkan dengan <b>barang yang benar-benar ada</b> di gudang.', 30, 32)}
{note('angka di sini contoh ya')}''')

# ---------- 3 (cream) alur manual ----------
icons_m = [
    papers(122 - 30, 300 - 210, 2, 60, 46),
    clip(298 - 30, 92, 60, 72),
    laptop(460 - 42, 98, 84, sheet_grid(460 - 34, 104, 68, 38, 3, 3)),
    book(624 - 52, 92, 50, 66) + papers(624 + 4, 112, 1, 46, 40),
    magnifier(796 - 6, 122, 24),
]
xs_m = [92, 276, 460, 644, 828]
flow_m = ''.join(node(x, 130, str(i + 1), icons_m[i], lb) for i, (x, lb) in enumerate(zip(xs_m, ['cetak', 'hitung', 'ketik ulang', 'cocokkan', 'cari selisih'])))
flow_m += ''.join(flow_arrow(xs_m[i] + 72, xs_m[i + 1] - 72, 130) for i in range(4))
art3 = svg(flow_m, 920, 250, seed=43)
page(3, 'cream', f'''
{eyebrow('Alur manual')}
{h1('5 Langkah, Habis 2 Hari Kerja')}
{art_rows(art3, [(f'{i + 1}. {n}', f'{h} jam') for i, (n, h) in enumerate(MANUAL)], ('Total', f'± {T_MAN} jam'))}
{note('langkah 3 itu yang paling makan waktu')}''')

# ---------- 4 (sage) di mana meleset ----------
art4 = svg(
    shelf_full(30, 70, 170, 200)
    + person(320, 270, .82, 'oh', SL, HOLD) + clip(356, 122, 62, 80)
    + sticky(530, 92, 'salah tulis', -6, 30, 136) + sticky(686, 80, 'rak kelewat', 4, 30, 136) + sticky(838, 98, 'dus / pcs?', -3, 30, 136)
    + box(560, 196, 96, 74, 'BERAS', 18) + txt(760, 236, '40? atau 34?', 34, -4, ACCT)
    + ground(20, 900, 270), 920, 282, seed=44)
_, sat, s0, f0 = STOK[0]
page(4, 'sage', f'''
{eyebrow('Masalah alur manual')}
{h1('Selisihnya Baru Ketahuan Belakangan')}
{panel(f'<div style="margin:-6px 0 6px">{art4}</div>' + duo_tiles(('Di buku stok', 'Beras 5 kg', f'{s0} {sat}'), ('Di gudang', 'hasil hitung fisik', f'{f0} {sat}')), '24px 30px 28px', 34)}
{body('Waktu ketik ulang selesai, barang sudah keluar-masuk lagi. <b>Susah dilacak selisih itu dari mana.</b>', 28, 32)}
{note('padahal ngitungnya udah 2 hari')}''')

# ---------- 5 (cream) alur pakai sistem ----------
xs_s = [110, 340, 570, 800]
icons_s = [
    sheet_grid(110 - 40, 102, 80, 56, 4, 3),
    phone(340 - 24, 84, 48, 86),
    gear(570, 130, 26),
    sheet_grid(800 - 40, 106, 74, 50, 3, 3) + check_badge(800 + 30, 98, 18),
]
flow_s = ''.join(node(x, 130, str(i + 1), icons_s[i], lb, auto=(i in (0, 2))) for i, (x, lb) in enumerate(zip(xs_s, ['sudah siap', 'input di HP', 'otomatis', 'setujui'])))
flow_s += ''.join(flow_arrow(xs_s[i] + 72, xs_s[i + 1] - 72, 130) for i in range(3))
art5 = svg(flow_s, 920, 250, seed=45)
page(5, 'cream', f'''
{eyebrow('Alur pakai sistem')}
{h1('Langkahnya Lebih Sedikit, Selesai Setengah Hari')}
{art_rows(art5, [(f'{i + 1}. {n}', 'otomatis' if h == 0 else f'{h} jam') for i, (n, h) in enumerate(SISTEM)], ('Total', f'± {T_SIS} jam'))}
{note('nggak ada lagi ketik ulang dari kertas')}''')

# ---------- 6 (sage) selisih langsung ketemu ----------
def sgn(x): return f'+{x}' if x > 0 else ('0' if x == 0 else f'−{-x}')
rows6 = [[f'{n} <span style="color:{MUTED};font-size:22px">({sat})</span>', s, f, sgn(f - s)] for n, sat, s, f in STOK]
cls6 = {(i, 3): ('neg' if d < 0 else 'pos') for i, d in enumerate(SELISIH) if d}
cls6[(0, 3)] = 'sel'
n_beda = sum(1 for x in SELISIH if x)
page(6, 'sage', f'''
{eyebrow('Yang dikerjakan sistem')}
{h1('Selisih Langsung Muncul Saat Input')}
{panel(sheet(rows6, ['BARANG', 'SISTEM', 'FISIK', 'SELISIH'], 'D2', '<span style="color:#fff;background:#2F4A34;border-radius:6px;padding:2px 10px">=C2-B2</span>', hl=[i for i, d in enumerate(SELISIH) if d], cls=cls6, size=30), '22px 22px', 34)}
{body(f'Begitu angka fisik masuk, selisih langsung kelihatan. <b>Tinggal cek {n_beda} barang, bukan {SKU}.</b>', 28, 32)}
{note('kolom D isinya rumus, bukan diketik')}''')

# ---------- 7 (cream) head to head ----------
left7 = svg(person(110, 250, .8, 'stress', SL, HOLD) + clip(142, 104, 56, 72) + papers(230, 222, 4, 70, 50)
            + clock(300, 64, 26) + ground(10, 390, 250), 400, 262, seed=46)
right7 = svg(person(110, 250, .8, 'big', S, PHONE_ARM) + phone(150, 92, 40, 70)
             + laptop(230, 120, 116, sheet_grid(240, 128, 96, 52, 4, 3)) + check_badge(352, 112, 20)
             + sparkle(300, 60) + ground(10, 390, 250), 400, 262, seed=47)
page(7, 'cream', f'''
{eyebrow('Ringkasnya')}
{h1('Manual vs Sistem, Sebelah-sebelahan')}
{versus((left7, f'± {T_MAN} jam', 'Hitung di kertas, ketik ulang, selisih ketahuan di akhir.'),
        (right7, f'± {T_SIS} jam', 'Input sekali di HP, selisih muncul saat itu juga.'), 'MANUAL', 'PAKAI SISTEM')}
{note('hitungnya tetap manual, catatnya yang beda')}''')

# ---------- 8 (sage) checklist ----------
page(8, 'sage', f'''
{eyebrow('Simpan buat opname berikutnya')}
{h1('Biar Opname Bulan Depan Lebih Rapi')}
{checklist(['Kode barang &amp; satuan seragam (dus / pcs)', 'Bagi area hitung per rak', 'Tahan transaksi selama penghitungan',
            'Barang mahal dihitung 2 orang', 'Catat alasan tiap selisih'], 'sage', 40)}
{note('pakai sistem atau belum, ini tetap berlaku', 34)}''')

# ---------- 9 (cream) CTA ----------
cta = svg(person(250, 262, .92, 'big', SL, HANDS_UP)
          + desk(380, 196, 290) + laptop(410, 74, 200, sheet_grid(426, 88, 168, 96, 4, 4)) + check_badge(612, 80, 26)
          + box(720, 196, 110, 66, 'STOK', 18) + box(740, 136, 80, 60)
          + sparkle(140, 60) + sparkle(170, 120, 9) + sparkle(860, 110, 10) + txt(780, 76, 'cocok semua!', 36, -6, ACCT)
          + ground(60, 880, 262), 916, 272, seed=48)
page(9, 'cream', f'''
{eyebrow('Custom sistem untuk bisnis')}
{h1('Opname Nggak Harus Bikin Lembur')}
{art_panel(cta, 32)}
{body('Stok masuk, keluar, dan hasil opname tercatat di satu tempat. <b>Selisih ketahuan hari itu juga.</b>', 28, 32)}
{cta_banner('cream')}
{note('simpan &amp; kirim ke admin gudangmu', 24)}''')

if __name__ == '__main__':
    sc.render(); sc.contact(os.path.join(D, 'contact.png'))
