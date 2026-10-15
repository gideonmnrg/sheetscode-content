"""Carousel edukasi (kontra): makin banyak rumus belum tentu makin canggih (cover cream).

Usage: python3 build.py  -> slide01..09.png (3240x4050) + contact.png
Contoh fiktif: Toko Kurnia, hitung harga netto per tipe pelanggan.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sc
from sc import *

D = os.path.dirname(os.path.abspath(__file__))
TOTAL = 9
sc.init(D, TOTAL)

# ---------- data (fiktif) ----------
DISKON = [('Grosir', 10), ('Reseller', 8), ('Member', 5), ('Umum', 0)]
ORDER = [('Warung Bu Sri', 'Grosir', 1_200_000), ('Toko Jaya', 'Member', 850_000),
         ('Kios Rina', 'Reseller', 640_000), ('Pak Andi', 'Umum', 300_000)]

def netto_nested_if(tipe, harga):        # cara lama: aturan di dalam rumus
    return harga * 0.9 if tipe == 'Grosir' else harga * 0.95 if tipe == 'Member' else harga * 0.92 if tipe == 'Reseller' else harga

def netto_tabel(tipe, harga):            # cara rapi: aturan di tabel, rumus cuma lookup
    return harga * (1 - dict(DISKON).get(tipe, 0) / 100)

assert all(round(netto_nested_if(t, h)) == round(netto_tabel(t, h)) for _, t, h in ORDER)
assert round(netto_tabel('Grosir', 1_200_000)) == 1_080_000

# ---------- props ----------
HEAD = 'M-36 -140 Q-74 -168 -38 -212 M36 -140 Q74 -168 38 -212'
HANDS_UP = 'M-36 -140 Q-70 -170 -60 -214 M36 -140 Q70 -170 60 -214'
POINT = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q80 -130 104 -150'
PHONE_ARM = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q74 -128 62 -170'
CHIN = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q60 -110 14 -160'          # tangan di dagu (nunggu)

def desk(x, y, w):
    return f'<rect x="{x}" y="{y}" width="{w}" height="14" rx="4" fill="#C9A27A"/><path d="M{x + 14} {y + 14} L{x + 14} {y + 60} M{x + w - 14} {y + 14} L{x + w - 14} {y + 60}"/>'

def mono(x, y, t, size=22, color=INK, anchor='start'):
    return txt(x, y, t, size, font='JBM', weight=700, color=color, anchor=anchor)

def spinner(x, y, r=26):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" stroke="{GREY}" stroke-width="7"/>'
            f'<path d="M{x} {y - r} A{r} {r} 0 0 1 {x + r} {y}" stroke="{SD}" stroke-width="7"/>')

def code_lines(lines, size=30):
    """Rumus multi-baris (indentasi dipertahankan)."""
    return f'<div class="code" style="font-size:{size}px;padding:24px 28px;line-height:1.45">' + '\n'.join(lines) + '</div>'

F = lambda t: f'<span class="f">{t}</span>'
R = lambda t: f'<span class="r">{t}</span>'

# ---------- 1 COVER (cream) ----------
strip = (f'<g transform="rotate(14 470 150)"><rect x="470" y="134" width="250" height="40" rx="6" fill="{PAPER}" stroke-width="3"/>'
         + mono(482, 161, '=IF(AND(IF(VLOOKUP(', 20) + '</g>'
         + f'<g transform="rotate(-4 700 300)"><rect x="560" y="284" width="150" height="36" rx="6" fill="{PAPER}" stroke-width="3"/>'
         + mono(572, 308, '...))))))', 20) + '</g>')
cover = svg(
    person(150, 330, .92, 'oh', SL, POINT)
    + desk(250, 258, 280) + laptop(290, 120, 190, sheet_grid(306, 134, 158, 84, 4, 3)) + strip
    + person(820, 330, .9, 'stress', S, HEAD, flip=True) + bubble(740, 52, 230, 58, 'ini rumus apa?', 30, False, (1, 1))
    + txt(140, 70, 'canggih kan?', 32, -6, ACCT) + sparkle(260, 56) + sparkle(560, 70, 10)
    + ground(20, 900, 330), 920, 340, seed=61)
page(1, 'cream', f'''
{eyebrow('Kontra')}
{h1(f"Makin Banyak Rumus, Belum Tentu Makin {pillh('Canggih', SD, CR)}", 88, 1.16)}
{body('Sheet yang canggih itu yang <b>gampang dipakai semua orang</b>, bukan yang paling ruwet.', 26, 32)}
{art_panel(cover, 34)}
{note('geser, mungkin sheet-mu juga begini')}''')

# ---------- 2 (sage) kelihatannya pintar ----------
nested = code_lines([
    f'={F("IF")}({R("C2")}="Grosir"; {R("B2")}*0,9;',
    f'  {F("IF")}({R("C2")}="Member"; {R("B2")}*0,95;',
    f'    {F("IF")}({R("C2")}="Reseller"; {R("B2")}*0,92;',
    f'      {R("B2")})))'], 31)
art2 = svg(person(120, 230, .8, 'flat', SL, POINT) + sticky(326, 100, 'JANGAN DIUBAH!', -5, 26, 224)
           + person(560, 230, .8, 'stress', S, HEAD, flip=True) + txt(740, 96, 'takut nyentuh...', 32, -4, ACCT)
           + sparkle(486, 46, 10) + ground(20, 900, 230), 920, 240, seed=62)
page(2, 'sage', f'''
{eyebrow('Kelihatannya pintar')}
{h1('Satu Sel, Tiga IF Bersarang')}
{panel(f'<div style="margin:-4px 0 14px">{art2}</div>' + nested, '24px 28px 28px', 34)}
{body('Yang bikin paham. Yang lain takut mengubah, <b>padahal aturan diskon pasti berubah</b>.', 28, 32)}
{note('contoh fiktif: harga netto di Toko Kurnia')}''')

# ---------- 3 (cream) masalah 1: cuma pembuatnya yang paham ----------
art3 = svg(person(150, 300, .92, 'oh', SL, PHONE_ARM) + phone(196, 94, 46, 80)
           + desk(300, 228, 300) + laptop(350, 100, 200, f'<rect x="364" y="112" width="172" height="100" rx="6" fill="#F8E1DC" stroke-width="3"/>'
                                                     + mono(450, 172, '#REF!', 34, RED, 'middle'))
           + bubble(170, 34, 260, 54, 'Kak, ini kenapa?', 28, False, (1, 1))
           + txt(760, 120, 'yang bikin', 34, -4, ACCT) + txt(760, 160, 'lagi cuti...', 34, -4, ACCT)
           + sticky(780, 236, 'ERR', 6, 26, 84) + sparkle(640, 60)
           + ground(20, 900, 300), 920, 310, seed=63)
page(3, 'cream', f'''
{eyebrow('Masalah #1')}
{h1('Cuma Pembuatnya yang Paham')}
{art_panel(art3, 36)}
{body('Rumus yang ruwet bikin tim <b>tergantung satu orang</b>. Begitu dia sibuk, kerjaan berhenti.', 30, 32)}
{note('si paling paham rumus, nggak bisa libur')}''')

# ---------- 4 (sage) masalah 2: error berantai ----------
rows4 = [[n, t, rp(h), '#REF!'] for n, t, h in ORDER] + [['<b>Total</b>', '', '', '#REF!']]
cls4 = {(i, 3): 'warn' for i in range(len(rows4))}
page(4, 'sage', f'''
{eyebrow('Masalah #2')}
{h1('Satu Kolom Dihapus, Semua Ikut Error')}
{panel(sheet(rows4, ['PELANGGAN', 'TIPE', 'HARGA', 'NETTO'], 'D2', '=IF(C2="Grosir";#REF!*0,9;IF(...', aligns=['left', 'left', 'right', 'right'], cls=cls4, size=28), '22px 22px', 34)}
{body('Rumus berantai saling bergantung. <b>Nyari sumber error-nya bisa sejam sendiri.</b>', 28, 32)}
{note('dan biasanya ketahuan pas mau kirim laporan')}''')

# ---------- 5 (cream) masalah 3: lemot ----------
art5 = svg(person(160, 262, .9, 'flat', SL, CHIN) + txt(236, 70, 'z', 34, 0, MUTED) + txt(258, 46, 'z', 28, 0, MUTED)
           + desk(320, 196, 300) + laptop(370, 74, 200, spinner(470, 130, 30)) + txt(470, 52, 'loading...', 30, -3, ACCT)
           + clock(740, 110, 36) + txt(740, 196, 'tiap kali edit', 30, -4, ACCT)
           + ground(20, 900, 262), 920, 272, seed=64)
page(5, 'cream', f'''
{eyebrow('Masalah #3')}
{h1('Tiap Edit, Nunggu Loading')}
{panel(f'<div style="margin:-6px 0 6px">{art5}</div>' + duo_tiles(('Dikira', 'rumus makin banyak', 'Makin otomatis'), ('Nyatanya', 'ribuan rumus dihitung ulang', 'Makin berat')), '24px 30px 28px', 34)}
{body('Rumus di ribuan baris, range satu kolom penuh, <b>NOW() dan INDIRECT() di mana-mana</b>. Semua dihitung ulang.', 28, 32)}''')

# ---------- 6 (sage) solusi: aturan ke tabel ----------
tab = sheet([[t, f'{d}%'] for t, d in DISKON], ['TIPE', 'DISKON'], aligns=['left', 'right'], cls={(0, 1): 'sel'}, size=28)
xl = f'={R("B2")}*(1-{F("XLOOKUP")}({R("C2")}; {R("Diskon!A2:A5")}; {R("Diskon!B2:B5")}; 0))'
page(6, 'sage', f'''
{eyebrow('Yang lebih canggih')}
{h1('Pindahkan Aturannya ke Tabel')}
{panel(f'<div style="display:flex;gap:22px;align-items:center"><div style="width:52%">{lab("Tab Diskon")}<div style="margin-top:10px">{tab}</div></div>'
       f'<div style="flex:1">{svg(person(110, 250, .82, "happy", SL, POINT) + sparkle(200, 40) + ground(10, 230, 250), 240, 262, seed=65)}</div></div>'
       + formula(xl, 25, 20), '24px 26px 26px', 34)}
{body('Diskon berubah? <b>Ubah angka di tabel</b>, rumusnya nggak perlu disentuh.', 28, 32)}
{note('satu rumus, semua tipe pelanggan')}''')

# ---------- 7 (cream) ciri sheet canggih ----------
art7 = svg(person(110, 250, .9, 'happy', SL, HANDS_UP) + sparkle(30, 70) + sparkle(200, 40, 10) + ground(10, 230, 250), 240, 262, seed=66)
page(7, 'cream', f'''
{eyebrow('Ukuran yang lebih jujur')}
<div style="display:flex;align-items:flex-end;gap:20px"><div style="flex:1">{h1('Ciri Sheet yang Benar-benar Canggih')}</div><div style="width:220px;flex-shrink:0">{art7}</div></div>
{numbered([('Orang lain bisa pakai tanpa nanya', 'Kolom input dan kolom hasil jelas bedanya.'),
           ('Aturan ada di tabel', 'Diskon, tarif, target, bukan diketik di dalam rumus.'),
           ('Rumusnya bisa dibaca', 'Pendek, satu tugas per kolom.'),
           ('Error cepat ketahuan', 'Ada pengecekan, bukan baru sadar di akhir bulan.')], 'cream', 26)}''')

# ---------- 8 (sage) versus ----------
left8 = svg(person(110, 250, .8, 'stress', SL, HEAD) + laptop(220, 120, 150, f'<rect x="232" y="130" width="126" height="70" rx="5" fill="#F8E1DC" stroke-width="2.6"/>' + mono(295, 174, '#N/A', 26, RED, 'middle'))
            + ground(10, 390, 250), 400, 262, seed=67)
right8 = svg(person(100, 250, .8, 'big', SL, POINT) + person(300, 250, .8, 'happy', S, flip=True)
             + bubble(300, 40, 170, 50, 'oh, gampang!', 26, False, (-1, 1)) + ground(10, 390, 250), 400, 262, seed=68)
page(8, 'sage', f'''
{eyebrow('Jadi, canggih buat siapa?')}
{h1('Ruwet vs Rapi')}
{versus((left8, 'Canggih buat pembuatnya', 'Rumus panjang, cuma satu orang yang berani ngubah.'),
        (right8, 'Canggih buat semua', 'Rumus pendek, aturan di tabel, tim bisa lanjut sendiri.'), 'RUWET', 'RAPI')}
{note('rumus pendek bukan berarti nggak jago', 28)}''')

# ---------- 9 (cream) CTA ----------
cta = svg(person(250, 262, .92, 'big', SL, HANDS_UP)
          + desk(380, 196, 290) + laptop(410, 74, 200, sheet_grid(426, 88, 168, 96, 4, 4)) + check_badge(612, 80, 26)
          + person(780, 262, .86, 'happy', S, flip=True)
          + sparkle(140, 60) + sparkle(170, 120, 9) + sparkle(880, 70, 10) + txt(700, 52, 'tinggal pakai!', 34, -6, ACCT)
          + ground(60, 880, 262), 916, 272, seed=69)
page(9, 'cream', f'''
{eyebrow('Custom sistem untuk bisnis')}
{h1('Sistem yang Rapi Dipakai Semua Orang')}
{art_panel(cta, 32)}
{body('Rumus boleh rumit di belakang layar. <b>Yang dilihat tim tetap sederhana.</b>', 28, 32)}
{cta_banner('cream')}
{note('kirim ke teman yang rumusnya sepanjang paragraf', 24)}''')

if __name__ == '__main__':
    sc.render(); sc.contact(os.path.join(D, 'contact.png'))
