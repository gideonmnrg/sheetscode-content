"""Carousel edukasi: 7 rumus wajib admin kantor (cover cream). Contoh fiktif: kantor PT Maju Bersama."""
import os, sys
from datetime import date
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sc
from sc import *

D = os.path.dirname(os.path.abspath(__file__))
TOTAL = 9
sc.init(D, TOTAL)

# ---------- data fiktif + asserts ----------
KEL = [('ATK', 'Kertas A4', 85_000), ('Listrik', 'Token bulanan', 450_000), ('ATK', 'Tinta printer', 210_000),
       ('Konsumsi', 'Rapat divisi', 320_000), ('ATK', 'Map &amp; pulpen', 64_000)]
ATK = sum(n for k, _, n in KEL if k == 'ATK'); assert ATK == 359_000
ABS = [('Rina', 'Hadir'), ('Doni', 'Izin'), ('Maya', 'Hadir'), ('Hadi', 'Sakit'), ('Sari', 'Hadir'), ('Eko', 'Hadir')]
HADIR = sum(1 for _, s in ABS if s == 'Hadir'); assert HADIR == 4
KAR = [('K-001', 'Rina Wulandari', 'Keuangan'), ('K-002', 'Doni Saputra', 'Umum'), ('K-003', 'Maya Putri', 'HRD'), ('K-004', 'Eko Prasetyo', 'Umum')]
assert dict((i, n) for i, n, _ in KAR)['K-003'] == 'Maya Putri'
INV = [('INV-01', 500_000, 500_000), ('INV-02', 750_000, 300_000), ('INV-03', 1_200_000, 1_200_000), ('INV-04', 400_000, 0)]
stat = lambda t, b: 'Lunas' if b >= t else 'Belum'
assert [stat(t, b) for _, t, b in INV] == ['Lunas', 'Belum', 'Lunas', 'Belum']
RAW = ['  rina   wulandari ', 'DONI  saputra', ' maya putri  ']
CLEAN = [' '.join(r.split()).title() for r in RAW]; assert CLEAN == ['Rina Wulandari', 'Doni Saputra', 'Maya Putri']
HARI_INI = date(2026, 10, 15)
DOK = [('Pajak PBB', date(2026, 10, 20)), ('Kontrak sewa', date(2026, 10, 31)), ('Izin usaha', date(2026, 11, 30)), ('Asuransi kantor', date(2026, 10, 10))]
SISA = [(d - HARI_INI).days for _, d in DOK]; assert SISA == [5, 16, 46, -5]

_sheet = sheet
def sheet(rows_, header, fx_cell=None, fx='', **k):   # rumus sudah ada di kotak hijau, bar fx dihapus agar tidak dobel
    return _sheet(rows_, header, None, '', **k)

rp_ = lambda n: rp(n)
fd = lambda d: d.strftime('%d/%m/%Y')
dots = lambda s: s.replace(' ', '·')
F = lambda t: f'<span class="f">{t}</span>'
R = lambda t: f'<span class="r">{t}</span>'

HOLD = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q66 -118 70 -150'
POINT = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q80 -130 104 -150'
HEAD = 'M-36 -140 Q-74 -168 -38 -212 M36 -140 Q74 -168 38 -212'
UP = 'M-36 -140 Q-70 -170 -60 -214 M36 -140 Q70 -170 60 -214'

def desk(x, y, w): return f'<rect x="{x}" y="{y}" width="{w}" height="14" rx="4" fill="#C9A27A"/><path d="M{x+14} {y+14} L{x+14} {y+60} M{x+w-14} {y+14} L{x+w-14} {y+60}"/>'
def mono(x, y, t, s=22, c=INK, a='start'): return txt(x, y, t, s, font='JBM', weight=700, color=c, anchor=a)
def papers(x, y, n=3, w=70, h=52):
    o = ''
    for i in range(n):
        yy = y - i * 13
        o += f'<g transform="rotate({(-8,5,-3)[i%3]} {x+w/2} {yy+h/2})"><rect x="{x}" y="{yy}" width="{w}" height="{h}" rx="3" fill="{PAPER}" stroke-width="3"/><path d="M{x+12} {yy+18} L{x+w-14} {yy+18} M{x+12} {yy+32} L{x+w-24} {yy+32}" stroke-width="2.2"/></g>'
    return o
def calc(x, y, w=74, h=96):
    o = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{PAPER}"/><rect x="{x+8}" y="{y+8}" width="{w-16}" height="22" rx="4" fill="#D7E4D3" stroke-width="2.6"/>'
    for r in range(3):
        for c in range(3): o += f'<circle cx="{x+16+c*(w-32)/2}" cy="{y+46+r*18}" r="5" fill="{SL}" stroke-width="2.4"/>'
    return o
def magnifier(x, y, r=26): return f'<path d="M{x+r*.7} {y+r*.7} L{x+r*1.6} {y+r*1.6}" stroke-width="8"/><circle cx="{x}" cy="{y}" r="{r}" fill="#EEF4EF"/>'

def slide(n, bg, tag, title, code, body_html, body_t, note_t, art=None, cs=33):
    inner = f'''{eyebrow(tag)}{h1(title, 72, 1.12)}
{art_panel(art, 26) if art else ''}
{formula(code, cs, 24 if art else 30)}
<div style="margin-top:20px">{body_html}</div>
{body(body_t, 24, 31)}{note(note_t, 18)}'''
    page(n, bg, inner)

# ---------- 1 COVER (cream) ----------
def fxtag(x, y, t, rot): return f'<g transform="rotate({rot} {x} {y})"><rect x="{x-62}" y="{y-20}" width="124" height="40" rx="8" fill="{PAPER}" stroke-width="3"/>' + mono(x, y+8, t, 20, SD, 'middle') + '</g>'
cover = svg(person(190, 330, .95, 'big', SL, UP) + desk(330, 268, 300) + laptop(370, 130, 210, sheet_grid(386, 144, 178, 90, 4, 3)) + check_badge(588, 130, 24)
            + calc(660, 200, 70, 96) + papers(760, 300, 3, 64, 48)
            + fxtag(130, 92, '=SUMIF', -8) + fxtag(470, 78, '=VLOOKUP', 5) + fxtag(790, 100, '=COUNTIF', -5) + fxtag(790, 150, '=FILTER', 4)
            + sparkle(290, 60) + sparkle(640, 80, 10) + ground(20, 900, 330), 920, 340, seed=81)
page(1, 'cream', f'''
{eyebrow('Cheat sheet admin')}
{h1(f"7 Rumus Wajib {pillh('Admin', SD, CR)} Kantor", 92, 1.16)}
{body('Dari rekap pengeluaran sampai cek jatuh tempo, ini rumus yang paling sering kepakai tiap hari.', 26, 32)}
{art_panel(cover, 34)}
{note('geser &amp; simpan buat nanti')}''')

# ---------- 2 SUMIF (sage) ----------
t = sheet([[k, ket, rp_(n)] for k, ket, n in KEL] + [['<b>Total ATK</b>', '', rp_(ATK)]], ['KATEGORI', 'KETERANGAN', 'NOMINAL'],
          'D2', f'=SUMIF(A2:A6; "ATK"; C2:C6)', hl=[0, 2, 4], aligns=['left', 'left', 'right'], cls={(5, 2): 'sel'}, size=28)
slide(2, 'sage', 'Rumus #1 · Rekap', 'SUMIF: Total per Kategori', f'={F("SUMIF")}({R("A2:A6")}; "ATK"; {R("C2:C6")})', t,
      f'Jumlahkan hanya baris yang cocok. <b>Total ATK bulan ini {rp_(ATK)}</b>.', 'cocok buat rekap pengeluaran kantor')

# ---------- 3 COUNTIF (cream) ----------
t = sheet([[n, s] for n, s in ABS] + [['<b>Total Hadir</b>', str(HADIR)]], ['NAMA', 'STATUS'], 'D2', '=COUNTIF(B2:B7; "Hadir")',
          hl=[i for i, (_, s) in enumerate(ABS) if s == 'Hadir'], aligns=['left', 'center'], cls={(6, 1): 'sel'}, size=25)
slide(3, 'cream', 'Rumus #2 · Hitung', 'COUNTIF: Hitung yang Cocok', f'={F("COUNTIF")}({R("B2:B7")}; "Hadir")', t,
      f'Hitung jumlah sel yang sesuai syarat. <b>{HADIR} dari {len(ABS)} orang hadir</b>.', 'bisa juga buat hitung surat masuk per status')

# ---------- 4 VLOOKUP (sage) ----------
art4 = svg(person(130, 205, .72, 'happy', SL, POINT) + magnifier(300, 100, 30) + sticky(430, 100, 'K-003', -5, 28, 110)
           + txt(640, 100, 'cari nama dari ID', 32, -4, ACCT) + sparkle(560, 50) + ground(20, 900, 205), 920, 215, seed=82)
t = sheet([[i, n, dv] for i, n, dv in KAR], ['ID', 'NAMA', 'DIVISI'], 'F2', '=VLOOKUP("K-003"; A2:C5; 2; 0)', hl=[2], aligns=['left', 'left', 'left'], cls={(2, 1): 'sel'}, size=25)
slide(4, 'sage', 'Rumus #3 · Cari data', 'VLOOKUP: Cari dari ID', f'={F("VLOOKUP")}("K-003"; {R("A2:C5")}; 2; 0)', t,
      'Kolom ke-2 dari tabel = <b>Maya Putri</b>. Angka 0 artinya cocok persis.', 'versi barunya: XLOOKUP', art4, 33)

# ---------- 5 IF (cream) ----------
rows = [[i, rp_(t_), rp_(b), stat(t_, b)] for i, t_, b in INV]
cls = {(i, 3): ('pos' if r[3] == 'Lunas' else 'neg') for i, r in enumerate(rows)}
t = sheet(rows, ['INVOICE', 'TAGIHAN', 'DIBAYAR', 'STATUS'], 'D2', '=IF(C2>=B2; "Lunas"; "Belum")', aligns=['left', 'right', 'right', 'center'], cls=cls, size=28)
slide(5, 'cream', 'Rumus #4 · Status otomatis', 'IF: Status Terisi Sendiri', f'={F("IF")}({R("C2")}&gt;={R("B2")}; "Lunas"; "Belum")', t,
      'Kalau dibayar sudah sama atau lebih, <b>Lunas</b>. Kalau belum, <b>Belum</b>.', 'tinggal tarik ke bawah, nggak perlu ketik satu-satu')

# ---------- 6 TRIM + PROPER (sage) ----------
art6 = svg(person(130, 205, .72, 'oh', SL, HEAD) + txt(470, 90, 'spasi ngumpet di mana-mana!', 32, -4, ACCT)
           + sticky(700, 110, 'nama berantakan', 5, 24, 150) + sparkle(560, 50) + ground(20, 900, 205), 920, 215, seed=83)
t = sheet([[dots(r), c] for r, c in zip(RAW, CLEAN)], ['NAMA KOTOR (· = SPASI)', 'HASIL'], 'B2', '=PROPER(TRIM(A2))', hl=[0, 1, 2], aligns=['left', 'left'], cls={(i, 1): 'pos' for i in range(3)}, size=25)
slide(6, 'sage', 'Rumus #5 · Rapikan', 'TRIM + PROPER: Nama Rapi', f'={F("PROPER")}({F("TRIM")}({R("A2")}))', t,
      'TRIM buang spasi berlebih, PROPER bikin huruf depan kapital.', 'wajib sebelum VLOOKUP, biar nggak gagal cocok', art6, 36)

# ---------- 7 TODAY (cream) ----------
rows = [[n, fd(d), str(s)] for (n, d), s in zip(DOK, SISA)]
cls = {(i, 2): ('neg' if s < 0 else 'warn' if s <= 7 else 'pos') for i, s in enumerate(SISA)}
t = sheet(rows, ['DOKUMEN', 'JATUH TEMPO', 'SISA HARI'], 'C2', '=B2-TODAY()', aligns=['left', 'center', 'right'], cls=cls, size=28)
slide(7, 'cream', 'Rumus #6 · Deadline', 'TODAY: Sisa Hari Jatuh Tempo', f'={R("B2")}-{F("TODAY")}()', t,
      '<b>Merah = sudah lewat</b>, kuning = kurang dari seminggu. Contoh: hari ini 15/10/2026.', 'pasang bareng format warna otomatis')

# ---------- 8 FILTER (sage) ----------
src = sheet([[i, rp_(t_), stat(t_, b)] for i, t_, b in INV], ['INVOICE', 'TAGIHAN', 'STATUS'], aligns=['left', 'right', 'center'], size=21)
res = sheet([[i, rp_(t_), 'Belum'] for i, t_, b in INV if stat(t_, b) == 'Belum'], ['INVOICE', 'TAGIHAN', 'STATUS'], 'E1', '=FILTER(A2:C5; C2:C5="Belum")',
            hl=[0, 1], aligns=['left', 'right', 'center'], cls={(i, 2): 'neg' for i in range(2)}, size=21)
t = f'<div>{lab("Semua tagihan", CR)}<div style="margin-top:8px">{src}</div></div><div style="text-align:center;margin:2px 0;font-family:Poppins;font-weight:700;font-size:32px;color:{CR}">↓</div><div>{lab("Hasil filter", CR)}<div style="margin-top:8px">{res}</div></div>'
slide(8, 'sage', 'Rumus #7 · Saring', 'FILTER: Saring Data', f'={F("FILTER")}({R("A2:C5")}; {R("C2:C5")}="Belum")', t,
      '<b>2 invoice belum lunas</b>, langsung muncul tanpa filter manual.', 'berubah otomatis kalau data di atas berubah', None, 33)

# ---------- 9 CTA (cream) ----------
cta = svg(person(250, 262, .92, 'big', SL, UP) + desk(380, 196, 290) + laptop(410, 74, 200, sheet_grid(426, 88, 168, 96, 4, 4)) + check_badge(612, 80, 26)
          + papers(730, 262, 3, 80, 58) + sparkle(140, 60) + sparkle(170, 120, 9) + sparkle(880, 100, 10) + txt(780, 70, 'beres lebih cepat!', 34, -6, ACCT)
          + ground(60, 880, 262), 916, 272, seed=84)
page(9, 'cream', f'''
{eyebrow('Custom sistem untuk bisnis')}
{h1('Kerjaan Admin Bisa Lebih Otomatis')}
{art_panel(cta, 32)}
{body('Rumus sudah membantu. Kalau alur kantormu sudah rumit, <b>sistemnya bisa dibuatkan sesuai kebutuhan</b>.', 28, 32)}
{cta_banner('cream')}
{note('simpan &amp; kirim ke teman satu kantor', 24)}''')

if __name__ == '__main__':
    sc.render(); sc.contact(os.path.join(D, 'contact.png'))
