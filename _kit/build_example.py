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
