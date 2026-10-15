"""Carousel studi kasus: Property Tracker (custom sistem agen properti), cover sage.

Screenshot di shots/ diambil dari web app asli yang dijalankan dengan data dummy (lihat app/README.md).
Usage: python3 build.py  -> slide01..15.png (3240x4050) + contact.png
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
import sc
from sc import *

D = os.path.dirname(os.path.abspath(__file__))
SH, IMG = os.path.join(D, 'shots'), os.path.join(D, 'img')
os.makedirs(IMG, exist_ok=True)
TOTAL = 15
sc.init(D, TOTAL)
S3 = 3                                            # device scale screenshot

# ---------- olah screenshot (crop / sambung kolom) ----------
def crop(name, box_css=None, out=None):
    im = Image.open(os.path.join(SH, name + '.png'))
    if box_css:
        im = im.crop(tuple(int(v * S3) for v in box_css))
    out = out or name
    im.save(os.path.join(IMG, out + '.png'))
    return f'img/{out}.png'

def stitch(parts, out, bottom_cut=0):
    """parts: [(shot, x0, x1)] potongan kolom (px CSS) dari screenshot tabel yang sama tingginya."""
    ims = [Image.open(os.path.join(SH, n + '.png')) for n, _, _ in parts]
    h = min(i.height for i in ims) - bottom_cut * S3
    strips = [im.crop((int(a * S3), 0, int(b * S3), h)) for im, (_, a, b) in zip(ims, parts)]
    W = Image.new('RGB', (sum(s.width for s in strips), h), 'white')
    x = 0
    for s in strips:
        W.paste(s, (x, 0)); x += s.width
    W.save(os.path.join(IMG, out + '.png'))
    return f'img/{out}.png'

def vstitch(name, bands, x1, out):
    """Sambung beberapa pita horizontal (px CSS) dari satu screenshot, misal judul halaman + tabel."""
    im = Image.open(os.path.join(SH, name + '.png'))
    parts = [im.crop((0, int(a * S3), int(x1 * S3), int(b * S3))) for a, b in bands]
    W = Image.new('RGB', (parts[0].width, sum(p.height for p in parts)), 'white')
    y = 0
    for p_ in parts:
        W.paste(p_, (0, y)); y += p_.height
    W.save(os.path.join(IMG, out + '.png'))
    return f'img/{out}.png'

cols = json.load(open(os.path.join(SH, '_leads19_cols.json')))
L = {c[0]: (c[1], c[2]) for c in cols['left']}
R = {c[0]: (c[1], c[2]) for c in cols['right']}
leads_img = stitch([('leads_p19', 0, L['ID Lead'][1]), ('leads_p19', *L['Nama Klien']),
                    ('leads_p19', L['PIC Sales'][0], L['Status Terakhir'][1]),
                    ('leads_p19_right', *R['Hari Stagnan']), ('leads_p19_right', R['Aksi'][0], R['Aksi'][1] + 1)],
                   'leads_stitched', bottom_cut=50)

# ---------- komponen ----------
URL = 'script.google.com/macros/s/AKfy…/exec'
def win(src, w='100%', mt=30, url=URL, extra=''):
    """Jendela browser berisi screenshot asli."""
    dots = ''.join(f'<i style="width:14px;height:14px;border-radius:50%;background:{c};display:inline-block"></i>' for c in ('#E5A89C', '#E8CF95', '#A8C4AB'))
    return (f'<div style="width:{w};margin-top:{mt}px;background:#fff;border:2px solid {GRID};border-radius:22px;overflow:hidden;'
            f'box-shadow:0 18px 40px rgba(45,42,38,.14);{extra}">'
            f'<div style="display:flex;align-items:center;gap:8px;padding:12px 18px;background:#F4EFE6;border-bottom:2px solid {GRID}">{dots}'
            f'<span style="margin-left:12px;flex:1;background:#fff;border-radius:999px;padding:4px 16px;font-family:Raleway;font-weight:700;font-size:18px;color:{MUTED};white-space:nowrap;overflow:hidden">{url}</span></div>'
            f'<img src="{src}" style="width:100%;display:block"></div>')

def phone_frame(src, w=300, rot=0):
    return (f'<div style="width:{w}px;flex-shrink:0;transform:rotate({rot}deg);background:{INK};border-radius:44px;padding:12px;box-shadow:0 18px 40px rgba(45,42,38,.2)">'
            f'<img src="{src}" style="width:100%;display:block;border-radius:32px"></div>')

def tag_row(items, bg='cream', mt=22):
    st = f'background:{PAPER};border:2px solid {GRID};color:{INK}' if bg == 'cream' else f'background:rgba(252,241,227,.14);border:2px solid {LINE_S};color:{CR}'
    return (f'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:{mt}px">'
            + ''.join(f'<span style="{st};border-radius:999px;padding:7px 16px;font-family:Nunito;font-weight:700;font-size:23px">{t}</span>' for t in items) + '</div>')

def label(t, color=None):
    return f'<div style="font-family:Raleway;font-weight:700;font-size:21px;letter-spacing:2px;text-transform:uppercase;color:{color or MUTED};margin-bottom:10px">{t}</div>'

HEAD = 'M-36 -140 Q-74 -168 -38 -212 M36 -140 Q74 -168 38 -212'
PHONE_ARM = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q74 -128 62 -170'
HOLD = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q66 -118 70 -150'
HANDS_UP = 'M-36 -140 Q-70 -170 -60 -214 M36 -140 Q70 -170 60 -214'
POINT = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q80 -130 104 -150'

def house(x, y, w=110, h=86, fill='#E9D6B6'):
    return (f'<path d="M{x} {y + h * .42} L{x + w / 2} {y} L{x + w} {y + h * .42}" fill="{SL}"/>'
            f'<rect x="{x + w * .1}" y="{y + h * .4}" width="{w * .8}" height="{h * .6}" rx="4" fill="{fill}"/>'
            f'<rect x="{x + w * .42}" y="{y + h * .66}" width="{w * .18}" height="{h * .34}" fill="{PAPER}" stroke-width="3"/>')

# ---------- 1 COVER (sage) ----------
page(1, 'sage', f'''
{eyebrow('Studi kasus · Custom sistem')}
{h1(f"Property Tracker: Dari {pillh('Leads', CR, SD)} sampai Akad", 84, 1.16)}
{body('Web app di atas Google Sheets untuk tim marketing, sales, dan admin agen properti.', 24, 31)}
{win(crop('desk_dashboard'), mt=32)}
{note('geser, kita bedah fiturnya satu per satu', 26)}''')

# ---------- 2 (cream) masalah ----------
art2 = svg(person(430, 300, .92, 'stress', SL, HEAD)
           + phone(150, 110, 70, 124) + bubble(190, 52, 270, 56, 'udah di-follow up?', 27, False, (-1, 1))
           + sticky(110, 262, 'leads IG', -6, 24, 104) + sticky(240, 262, 'pameran', 5, 24, 104)
           + laptop(600, 130, 170, sheet_grid(614, 142, 142, 80, 4, 3))
           + sticky(820, 120, 'final_v3', 6, 22, 100) + sticky(820, 240, '??', -4, 30, 90)
           + txt(640, 70, 'siapa pegang klien ini?', 30, -4, ACCT) + sparkle(330, 60)
           + ground(20, 900, 300), 920, 310, seed=71)
page(2, 'cream', f'''
{eyebrow('Masalahnya')}
{h1('Leads Banyak, Catatannya di Mana-mana')}
{art_panel(art2, 34)}
{body('Leads datang dari Instagram, TikTok, sampai pameran. Dicatat di chat dan file masing-masing sales, <b>jadi susah tahu siapa pegang klien yang mana.</b>', 30, 32)}
{note('agen properti fiktif, semua data di sini dummy')}''')

# ---------- 3 (sage) tiga web app ----------
roles = [
    ('Manager', 'Akses penuh semua modul + dashboard', person(110, 230, .78, 'happy', SL, POINT) + laptop(170, 120, 90, sheet_grid(178, 126, 74, 40, 3, 3))),
    ('Sales &amp; Marketing', 'Wajib login email + kredensial', person(120, 230, .78, 'big', S, PHONE_ARM) + phone(162, 70, 36, 64)),
    ('Admin', 'Karyawan, absensi, jadwal piket', person(110, 230, .78, 'happy', SD, HOLD) + clipboard(150, 96, 66, 86, 'HADIR', 2)),
]
cols3 = ''.join(f'''<div style="display:flex;gap:12px;align-items:center;background:{PAPER};border-radius:24px;padding:10px 18px 10px 8px;color:{INK};margin-top:{0 if i == 0 else 14}px">
 <div style="width:150px;flex-shrink:0">{svg(a + ground(10, 270, 230), 280, 240, seed=72 + i)}</div>
 <div><div style="font-family:Poppins;font-weight:700;font-size:30px;line-height:1.15">{t}</div>
 <div style="font-family:Nunito;font-weight:700;font-size:24px;line-height:1.3;color:{INK2};margin-top:4px">{d}</div></div></div>''' for i, (t, d, a) in enumerate(roles))
page(3, 'sage', f'''
{eyebrow('Satu kode, tiga web app')}
{h1('Tiap Tim Punya Pintunya Sendiri')}
<div style="display:flex;gap:22px;align-items:center;margin-top:32px">
 {win(crop('login', (210, 105, 650, 535), 'login_card'), '44%', 0)}
 <div style="flex:1;min-width:0">{cols3}</div></div>
{body('Login khusus untuk tim Sales &amp; Marketing. Datanya tersinkron antar spreadsheet, <b>diinput sekali, ter-update di semua.</b>', 28, 30)}
{note('ini halaman login web app Sales &amp; Marketing', 18)}''')

# ---------- 4 (cream) dashboard scorecards ----------
page(4, 'cream', f'''
{eyebrow('Fitur 1 · Dashboard')}
{h1('8 Tahap Funnel dalam Sekali Lihat')}
{win(crop('dash_score'), '84%', 28, extra='margin-left:auto;margin-right:auto')}
{body('Database sampai Akad, lengkap dengan persen dari total leads. <b>Bisa difilter per tahun, bulan, atau rentang tanggal.</b>', 28, 31)}
{note('angka dihitung otomatis dari sheet Leads')}''')

# ---------- 5 (sage) rekap bulanan ----------
page(5, 'sage', f'''
{eyebrow('Fitur 2 · Insight bulanan')}
{h1('Rekap per Bulan, Lengkap dengan Tren')}
{win(crop('dash_monthly', (0, 0, 818, 444), 'monthly_crop'), mt=30)}
{body('Panah hijau naik, oranye turun dibanding bulan sebelumnya. <b>Tren tiap tahap kelihatan tanpa bikin pivot.</b>', 26, 31)}''')

# ---------- 6 (cream) sumber & proyek ----------
page(6, 'cream', f'''
{eyebrow('Fitur 3 · Sumber &amp; proyek')}
{h1('Iklan Mana yang Paling Banyak Bawa Leads?')}
{win(crop('dash_sumber', (0, 0, 818, 318), 'sumber_crop'), mt=26)}
<div style="display:flex;gap:26px;align-items:center;margin-top:22px">
 {win(crop('dash_properti'), '40%', 0)}
 <div style="flex:1;min-width:0">{body('Instagram Ads paling banyak bawa leads. <b>Green Valley Townhouse paling banyak closing.</b>', 0, 30)}
 {note('budget iklan jadi tepat sasaran', 20)}</div></div>''')

# ---------- 7 (sage) top penjualan ----------
page(7, 'sage', f'''
{eyebrow('Fitur 4 · Ranking tim')}
{h1('Siapa yang Paling Banyak Closing?')}
{win(crop('dash_toppenjualan', (0, 0, 860, 386), 'top_crop'), mt=30)}
{body('Ranking Top Penjualan dan Top Leads, <b>bisa difilter per role Sales atau Marketing.</b>', 26, 31)}
{note('bahan evaluasi mingguan, tanpa rekap manual')}''')

# ---------- 8 (cream) target A|T|U ----------
page(8, 'cream', f'''
{eyebrow('Fitur 5 · Target vs actual')}
{h1('Target Tiap Orang: A | T | U')}
{win(crop('dash_target_global'), mt=30)}
{body('<b>A</b> sudah tercapai, <b>T</b> target, <b>U</b> “utang” yang masih perlu dikejar. Total tim Marketing dan Sales ada di baris bawah.', 26, 30)}''')

# ---------- 9 (sage) leads ----------
page(9, 'sage', f'''
{eyebrow('Fitur 6 · Leads')}
{h1('Lead Baru Tinggal Di-assign ke Sales')}
{win(leads_img, mt=30)}
{body('Tiap lead punya PIC dan <b>Hari Stagnan</b>: berapa hari belum disentuh. Lead yang belum ada sales-nya muncul tombol <b>Assign</b>.', 26, 30)}
{note('filter: PIC, status, tanggal, atau cari nama', 20)}''')

# ---------- 10 (cream) assign + email ----------
overlap = (f'<div style="display:flex;gap:22px;align-items:flex-start;margin-top:30px">'
           f'<div style="width:500px;flex-shrink:0">{label("1 · Pilih sales")}{win(crop("assign_modal"), "100%", 0)}</div>'
           f'<div style="flex:1;min-width:0;margin-top:120px;margin-right:8px;transform:rotate(2deg)">{label("2 · Email masuk", ACCT)}{win(crop("email"), "100%", 0, url="mail.google.com")}</div></div>')
page(10, 'cream', f'''
{eyebrow('Fitur 7 · Assign &amp; notifikasi')}
{h1('Assign Sales, Email Langsung Terkirim')}
{overlap}
{body('Sales yang dipilih langsung dapat email berisi detail klien. <b>Penugasannya juga tercatat di Lead History.</b>', 18, 30)}''')

# ---------- 11 (sage) riwayat ----------
page(11, 'sage', f'''
{eyebrow('Fitur 8 · Lead History')}
{h1('Jejak Lengkap dari Database sampai Akad')}
{win(crop('history_modal', (0, 0, 640, 410), 'history_crop'), mt=30)}
{body('Tiap ganti status tercatat otomatis: <b>kapan, oleh siapa, dari status apa ke status apa.</b>', 26, 31)}
{note('nggak ada lagi “kemarin statusnya apa ya?”')}''')

# ---------- 12 (cream) pemberkasan ----------
DOCS = ['KTP &amp; KK', 'NPWP', 'Booking Fee', 'Bukti DP', 'PPJB', 'Persetujuan KPR', 'Akad Kredit', 'AJB', 'BPHTB', 'PBB',
        'IMB / PBG', 'Sertifikat', 'Kwitansi Lunas', 'BAST']
assert len(DOCS) == 14
page(12, 'cream', f'''
{eyebrow('Fitur 9 · Pemberkasan')}
{h1('14 Dokumen, dari Booking sampai BAST')}
{win(crop('berkas_docs', (0, 0, 986, 312), 'docs_crop'), mt=28)}
{tag_row(DOCS, 'cream', 22)}
{body('Tiap dokumen punya tanggal disiapkan, diserahkan, dan file upload ke Drive. <b>Status Belum / Proses / Lengkap terisi otomatis.</b>', 22, 29)}''')

# ---------- 13 (sage) target mingguan + rekap absensi ----------
page(13, 'sage', f'''
{eyebrow('Fitur 10 · Target &amp; absensi')}
{h1('Target Mingguan dan Rekap Absensi Tim')}
{win(crop('target_module', (0, 0, 1056, 304), 'target_crop'), mt=26)}
{win(vstitch('rekap_module', [(0, 92), (222, 500)], 980, 'rekap_crop'), mt=16)}
{body('Target diisi per pekan untuk tiap orang. <b>Absensi harian langsung jadi rekap bulanan.</b>', 22, 30)}''')

# ---------- 14 (cream) master data + mobile ----------
items14 = ['Property &amp; Developer', 'Clients', 'Karyawan + kredensial login', 'Menu Dropdown', 'Jadwal Piket',
           'Upload berkas ke Drive', 'Salinan template untuk cabang baru']
check = ''.join(f'<div style="display:flex;gap:14px;align-items:center;padding:12px 0;border-top:2px solid {GRID}">{check_svg}<span style="font-family:Poppins;font-weight:600;font-size:27px;line-height:1.2">{t}</span></div>'
                for t in items14 for check_svg in [f'<svg width="34" height="34" viewBox="0 0 34 34" style="flex-shrink:0"><circle cx="17" cy="17" r="17" fill="{SD}"/><path d="M10 17 L15 22 L24 12" stroke="{CR}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'])
page(14, 'cream', f'''
{eyebrow('Plus')}
{h1('Data Master Lengkap, Enak Dibuka di HP')}
<div style="display:flex;gap:26px;align-items:center;margin-top:34px">
 <div style="display:flex;gap:0;flex-shrink:0;padding-left:16px;align-items:flex-start">{phone_frame(crop('m_dashboard', (0, 0, 390, 760), 'm_dash_crop'), 240, -3)}<div style="margin-left:-40px;margin-top:60px">{phone_frame(crop('m_leads', (0, 0, 390, 760), 'm_leads_crop'), 240, 3)}</div></div>
 <div style="flex:1;border-bottom:2px solid {GRID}">{check}</div></div>
{note('tabel otomatis jadi kartu di layar HP', 30)}''')

# ---------- 15 (sage) CTA ----------
cta = svg(person(230, 262, .92, 'big', SL, HANDS_UP)
          + f'<rect x="370" y="196" width="300" height="14" rx="4" fill="#C9A27A"/><path d="M384 210 L384 262 M656 210 L656 262"/>'
          + laptop(410, 74, 200, sheet_grid(426, 88, 168, 96, 4, 4)) + check_badge(612, 80, 26)
          + house(710, 120, 130, 100) + sparkle(120, 60) + sparkle(150, 120, 9) + sparkle(880, 90, 10)
          + txt(780, 76, 'akad lagi!', 34, -6, ACCT) + ground(60, 880, 262), 916, 272, seed=79)
page(15, 'sage', f'''
{eyebrow('Custom sistem untuk bisnis')}
{h1('Sistem yang Ikut Alur Kerja Timmu')}
{art_panel(cta, 32)}
{body('Property Tracker dibuat khusus untuk alur agen properti ini. <b>Alur bisnismu beda? Sistemnya bisa menyesuaikan.</b>', 28, 30)}
{cta_banner('sage')}
{note('simpan &amp; kirim ke tim marketing-mu', 24)}''')

if __name__ == '__main__':
    sc.render(); sc.contact(os.path.join(D, 'contact.png'))
