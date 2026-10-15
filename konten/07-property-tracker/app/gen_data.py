"""Data dummy Property Tracker (fiktif) -> data.js.

Setiap sheet ditulis persis seperti layout spreadsheet asli: data mulai baris 17, kolom B.
Tanggal ditulis sebagai "D:yyyy-mm-dd" / "D:yyyy-mm-ddTHH:MM" lalu diubah jadi Date di gas_stub.js.
"""
import json, os, random
from datetime import date, datetime, timedelta

random.seed(26)
TODAY = date(2026, 10, 15)
D = os.path.dirname(os.path.abspath(__file__))

def d(x): return 'D:' + (x.strftime('%Y-%m-%dT%H:%M') if isinstance(x, datetime) else x.isoformat())

# ---------- karyawan ----------
KARYAWAN = [  # id, nama, role, wa, sosmed, status
    ('USR-001', 'Nadia Putri', 'Marketing', '0812-3301-4471', '@nadia.properti', 'Active'),
    ('USR-002', 'Rizky Aditya', 'Marketing', '0813-8820-1934', '@rizky.rumah', 'Active'),
    ('USR-003', 'Bima Saputra', 'Sales', '0811-2093-5568', '@bima.home', 'Active'),
    ('USR-004', 'Citra Lestari', 'Sales', '0857-4410-2287', '@citra.hunian', 'Active'),
    ('USR-005', 'Dimas Pratama', 'Sales', '0878-1150-6632', '@dimas.cluster', 'Active'),
    ('USR-006', 'Sari Wulandari', 'Admin', '0812-7745-0910', '@sari.admin', 'Active'),
    ('USR-007', 'Fajar Nugroho', 'Sales', '0896-3321-7781', '@fajar.prop', 'Inactive'),
]
MKT = [k[1] for k in KARYAWAN if k[2] == 'Marketing']
SALES = [k[1] for k in KARYAWAN if k[2] == 'Sales' and k[5] == 'Active']
CRED = ['N4P7KX2Q', 'R8A3DT6M', 'B2S9QW5L', 'C6L1VE8R', 'D3P8MZ4T', 'S7W2HA9K', 'F5N6GJ1Y']

# ---------- developer & property ----------
DEVS = [('DEV-001', 'PT Griya Asri Land', 'Hendra Wijaya', '0812-9001-2231', 'Aktif', 'Fokus rumah subsidi & komersial Bekasi'),
        ('DEV-002', 'PT Bumi Hijau Properti', 'Lina Marlina', '0813-7702-4415', 'Aktif', 'Cluster townhouse Tangerang & Cibubur'),
        ('DEV-003', 'PT Cahaya Residence', 'Arief Santoso', '0811-6603-9920', 'Aktif', 'Perumahan premium Bogor'),
        ('DEV-004', 'PT Melati Karya', 'Yuni Astuti', '0857-2204-1188', 'Non Aktif', 'Kerja sama selesai Juni 2026')]
PROPS = [  # id, proyek, dev, tipe, harga, jumlah, lokasi, status, ket
    ('PROP-001', 'Griya Asri Residence', 'PT Griya Asri Land', 'Tipe 36/72', 485_000_000, 40, 'Bekasi', 'Available', 'Dekat stasiun, 2 KT 1 KM'),
    ('PROP-002', 'Green Valley Townhouse', 'PT Bumi Hijau Properti', 'Tipe 45/90', 780_000_000, 24, 'Tangerang', 'Available', 'Townhouse 2 lantai, carport'),
    ('PROP-003', 'Cahaya Hills', 'PT Cahaya Residence', 'Tipe 54/105', 1_150_000_000, 18, 'Bogor', 'Booked', 'View gunung, one gate system'),
    ('PROP-004', 'Bumi Hijau Park', 'PT Bumi Hijau Properti', 'Tipe 60/120', 1_350_000_000, 12, 'Cibubur', 'Available', 'Dekat tol, clubhouse'),
    ('PROP-005', 'Taman Melati Cluster', 'PT Melati Karya', 'Tipe 36/60', 420_000_000, 30, 'Depok', 'Sold', 'Habis terjual'),
]
PROYEK = [f'{p[1]} ({p[3]})' for p in PROPS]
PROP_W = [30, 24, 16, 12, 8]

SUMBER = ['Instagram Ads', 'Facebook Ads', 'TikTok', 'Website', 'Walk-in', 'Referral', 'Pameran']
SUMBER_W = [26, 18, 16, 12, 9, 11, 8]
STATUS = ['Database', 'Follow Up', 'Prospect', 'Rencana Survey', 'Survey', 'Closing', 'Akad', 'Gagal/Blacklist']
STAGE_W = [11, 21, 15, 10, 13, 9, 11, 10]
KEHADIRAN = ['Hadir', 'Izin', 'Sakit', 'Alpha']
PENGALIHAN = ['Cuti', 'Resign', 'Beban kerja penuh', 'Permintaan klien']

DEPAN = ['Andi', 'Budi', 'Rina', 'Dewi', 'Agus', 'Siti', 'Hendra', 'Maya', 'Yoga', 'Lestari', 'Teguh', 'Indah', 'Wahyu', 'Fitri',
         'Eko', 'Ratna', 'Bayu', 'Novi', 'Arif', 'Putri', 'Rudi', 'Ayu', 'Hadi', 'Wulan', 'Irfan', 'Sinta', 'Joko', 'Mega',
         'Gilang', 'Tika', 'Reza', 'Laras', 'Fikri', 'Anisa', 'Doni', 'Yanti', 'Galih', 'Vina', 'Ilham', 'Rosa']
BELAKANG = ['Santoso', 'Wibowo', 'Kusuma', 'Hidayat', 'Permana', 'Rahayu', 'Setiawan', 'Nugraha', 'Halim', 'Susanto',
            'Gunawan', 'Saputri', 'Firmansyah', 'Utami', 'Prasetyo', 'Maharani', 'Siregar', 'Hutapea', 'Lubis', 'Tanjung']
CATATAN = {
    'Database': ['Baru isi form iklan', 'Belum bisa dihubungi', 'Minta info harga dulu'],
    'Follow Up': ['Sudah kirim pricelist via WA', 'Minta simulasi KPR', 'Tanya promo DP 0', 'Follow up lagi minggu depan'],
    'Prospect': ['Tertarik, diskusi dengan pasangan', 'Minta brosur & siteplan', 'Cocok dengan budget'],
    'Rencana Survey': ['Jadwal survey Sabtu 10.00', 'Survey bareng keluarga', 'Minta dijemput di stasiun'],
    'Survey': ['Sudah survey, suka unit hook', 'Bandingkan dengan proyek lain', 'Tunggu approval bank'],
    'Closing': ['Booking fee sudah masuk', 'Proses berkas KPR', 'Pilih unit blok C-12'],
    'Akad': ['Akad di notaris, serah terima Nov', 'Akad selesai', 'Akad KPR bank BTN'],
    'Gagal/Blacklist': ['Budget tidak masuk', 'Nomor tidak aktif', 'Sudah beli di tempat lain'],
}

def rnd_date(a, b):
    return a + timedelta(days=random.randint(0, (b - a).days))

def cap(x): return min(x, TODAY)

# ---------- leads ----------
used = set()
def nama_baru():
    while True:
        n = f'{random.choice(DEPAN)} {random.choice(BELAKANG)}'
        if n not in used:
            used.add(n); return n

leads, history, clients, berkas = [], [], [], []
per_month = [14, 15, 18, 17, 19, 21, 20, 22, 24, 16]          # Jan..Okt
n = 0
for m, cnt in enumerate(per_month, start=1):
    for _ in range(cnt):
        n += 1
        last_day = (date(2026, m + 1, 1) - timedelta(days=1)) if m < 12 else date(2026, 12, 31)
        tgl = rnd_date(date(2026, m, 1), min(last_day, TODAY))
        age = (TODAY - tgl).days
        stage = random.choices(range(8), STAGE_W)[0]
        # lead yang baru masuk belum sempat jauh
        if age < 5: stage = min(stage, random.choice([0, 0, 1]))
        elif age < 12: stage = min(stage, random.choice([1, 2, 3, 3])) if stage != 7 else 1
        elif age < 25: stage = min(stage, 4) if stage != 7 else 7
        elif age < 45 and stage == 6: stage = 5
        status = STATUS[stage]
        prog = stage if stage != 7 else random.choice([1, 2, 3, 4])   # gagal di tahap mana
        t_ren = t_sur = t_clo = t_akd = None
        t = tgl
        if prog >= 3: t_ren = cap(t + timedelta(days=random.randint(3, 9))); t = t_ren
        if prog >= 4: t_sur = cap(t + timedelta(days=random.randint(1, 6))); t = t_sur
        if prog >= 5: t_clo = cap(t + timedelta(days=random.randint(4, 16))); t = t_clo
        if prog >= 6: t_akd = cap(t + timedelta(days=random.randint(14, 35))); t = t_akd
        upd = cap(t + timedelta(days=random.randint(0, 6 if stage < 5 else 3)))
        prop = random.choices(PROYEK[:4] if m > 6 else PROYEK, PROP_W[:4] if m > 6 else PROP_W)[0]
        sumber = random.choices(SUMBER, SUMBER_W)[0]
        picm = random.choice(MKT)
        if stage == 0 and age < 8: pics = []                         # belum di-assign
        else: pics = [random.choice(SALES)] + ([random.choice(SALES)] if random.random() < .12 else [])
        pics = list(dict.fromkeys(pics))
        nama = nama_baru()
        hp = f'08{random.choice(["12","13","21","52","57","77","78","96"])}-{random.randint(1000,9999)}-{random.randint(1000,9999)}'
        lid = f'LD-{n:04d}'
        row = [n, lid, d(tgl), sumber, nama, hp, prop, picm, ', '.join(pics), status, d(upd), (TODAY - upd).days,
               random.choice(CATATAN[status]), d(t_ren) if t_ren else '', d(t_sur) if t_sur else '',
               d(t_clo) if t_clo else '', d(t_akd) if t_akd else '']
        leads.append(row)
        # riwayat status
        steps = [(tgl, '', 'Database', picm)]
        seq = STATUS[1:prog + 1] if stage != 7 else STATUS[1:prog + 1] + ['Gagal/Blacklist']
        when = {'Rencana Survey': t_ren, 'Survey': t_sur, 'Closing': t_clo, 'Akad': t_akd}
        prev, tt = 'Database', tgl
        for s in seq:
            tt = when.get(s) or cap(tt + timedelta(days=random.randint(1, 4)))
            steps.append((tt, prev, s, (pics or [picm])[0]))
            prev = s
        if pics and len(steps) == 1:
            steps.append((cap(tgl + timedelta(days=1)), 'Database', 'Database', 'Manager'))
        for i, (tt, a, b, who) in enumerate(steps):
            ts = datetime(tt.year, tt.month, tt.day, random.randint(8, 19), random.choice([5, 12, 20, 34, 41, 55]))
            note = 'Lead baru masuk' if i == 0 else (f'Assign ke {", ".join(pics)}' if a == b else random.choice(CATATAN[b]))
            history.append([lid, d(ts), who, a, b, picm, ', '.join(pics), note])
        if stage >= 2 and stage != 7 or (stage == 7 and prog >= 3):
            clients.append([nama, hp, f'Minat {prop.split(" (")[0]}', status, lid])
        if stage in (5, 6):
            berkas.append(dict(nama=nama, hp=hp, prop=prop, stage=stage, tclo=t_clo, sales=(pics or [SALES[0]])[0]))

# ---------- clients ----------
clients_rows = []
cid = {}
for i, (nama, hp, ket, st, lid) in enumerate(clients, 1):
    k = f'KLN-{i:04d}'; cid[nama] = k
    clients_rows.append([i, k, nama, hp, ket, st])

# ---------- pemberkasan (14 dokumen x [disiapkan, diserahkan, link]) ----------
prop_by_label = {f'{p[1]} ({p[3]})': p for p in PROPS}
berkas_rows = []
for i, b in enumerate(berkas, 1):
    p = prop_by_label[b['prop']]
    base = b['tclo'] or TODAY
    done = 14 if b['stage'] == 6 and random.random() < .7 else random.randint(3, 12) if b['stage'] == 6 else random.randint(0, 7)
    belum = b['stage'] == 5 and random.random() < .25
    docs = []
    for k in range(14):
        if belum:
            docs += ['', '', '']
        elif k < done:
            a = cap(base + timedelta(days=k * 2)); s = cap(a + timedelta(days=random.randint(1, 3)))
            docs += [d(a), d(s), f'https://drive.google.com/file/d/berkas-{i}-{k}/view']
        elif k < done + 2 and b['stage'] == 5:
            docs += [d(cap(base + timedelta(days=k * 2))), '', '']
        else:
            docs += ['', '', '']
        # status berkas sesuai rumus: jumlah "Diserahkan" terisi
    diserahkan = sum(1 for k in range(14) if docs[k * 3 + 1])
    status = 'Belum' if not any(docs) else ('Lengkap' if diserahkan >= 14 else 'Proses')
    metode = random.choices(['KPR', 'Cash', 'Bertahap'], [6, 2, 2])[0]
    berkas_rows.append([i, f'CLS-2026-{i:03d}', d(base), cid.get(b['nama'], ''), b['nama'], b['hp'], p[0], p[1], p[3], p[4],
                        b['sales'], metode, status] + docs)

# ---------- target mingguan (2026) ----------
def weeks_of(y, m):
    import calendar
    dim = calendar.monthrange(y, m)[1]
    dow1 = (date(y, m, 1).weekday() + 1) % 7          # 0 = Minggu (seperti JS getDay)
    end1 = min(8, dim) if dow1 == 6 else min(1 + (6 - dow1), dim)
    w = [(1, end1)]; cur = end1 + 1
    while cur <= dim:
        w.append((cur, min(cur + 6, dim))); cur = w[-1][1] + 1
    return w

target_rows = []
no = 0
for m in range(1, 13):
    for wi, _ in enumerate(weeks_of(2026, m), 1):
        for kid, nama, role, *_rest in KARYAWAN:
            if role not in ('Marketing', 'Sales') or _rest[-1] != 'Active': continue
            no += 1
            t = [5, 2, 1, 1, 0] if role == 'Marketing' else [3, 2, 2, 1, 1]
            target_rows.append([no, kid, nama, role, 2026, m, wi] + t)

# ---------- absensi Oktober (1-15) + piket ----------
abs_rows, piket_rows = [], []
an = pn = 0
aktif = [k for k in KARYAWAN if k[5] == 'Active']
for day in range(1, 16):
    dt = date(2026, 10, day)
    if dt.weekday() == 6: continue                        # Minggu libur
    for kid, nama, *_ in aktif:
        an += 1
        st = random.choices(KEHADIRAN, [90, 4, 4, 2])[0]
        ket = {'Izin': 'Urusan keluarga', 'Sakit': 'Demam, ada surat dokter', 'Alpha': 'Tanpa kabar'}.get(st, '')
        abs_rows.append([an, f'ATT-2026-{an:04d}', d(dt), kid, nama, st, ket])
for day in range(1, 32):
    dt = date(2026, 10, day)
    if dt.weekday() == 6: continue
    pn += 1
    kid, nama, *_ = aktif[(pn - 1) % len(aktif)]
    hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'][dt.weekday()]
    piket_rows.append([pn, f'PKT-2026-{pn:03d}', d(dt), hari, f'{kid} - {nama}', nama])

# ---------- susun sheets ----------
def tbl(rows): return {'start': 17, 'rows': rows}
sheets = {
    'Karyawan': tbl([[i + 1, k[0], k[1], k[2], k[1].split()[0].lower() + '@example.com', k[3], k[4], CRED[i], k[5]] for i, k in enumerate(KARYAWAN)]),
    'Developer': tbl([[i + 1, *x] for i, x in enumerate(DEVS)]),
    'Property': tbl([[i + 1, *p, (f'https://drive.google.com/file/d/foto-{p[0]}/view' if i < 4 else ''), d(date(2026, 1, 5 + i * 3))] for i, p in enumerate(PROPS)]),
    'Leads': tbl(leads),
    'Lead History': tbl([[i + 1, *h] for i, h in enumerate(history)]),
    'Clients': tbl(clients_rows),
    'Pemberkasan': tbl(berkas_rows),
    'Target': tbl(target_rows),
    'Absensi': tbl(abs_rows),
    'Jadwal Piket': tbl(piket_rows),
    'Rekap Absensi': tbl([]),
}
md = {}
for col, items in [(2, SUMBER), (5, STATUS), (7, KEHADIRAN), (9, PENGALIHAN), (11, SALES), (13, MKT)]:
    for r, v in enumerate(items):
        md.setdefault(9 + r, {})[col] = v
sheets['Menu Dropdown'] = {'cells': md}

open(os.path.join(D, 'data.js'), 'w').write('window.DUMMY_SHEETS = ' + json.dumps(sheets, ensure_ascii=False) + ';\n')
st = {s: sum(1 for l in leads if l[9] == s) for s in STATUS}
print('leads', len(leads), st, '| history', len(history), '| clients', len(clients_rows), '| berkas', len(berkas_rows),
      [r[12] for r in berkas_rows], '| unassigned', sum(1 for l in leads if not l[8]))
