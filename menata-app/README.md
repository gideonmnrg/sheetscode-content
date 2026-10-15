# Menata — aplikasi mobile (versi uji coba)

Kode aplikasi Menata untuk Android & iOS, dibangun dari desain di canvas **"Menata — App Design"**.

- **Framework:** [Expo](https://expo.dev) SDK 57 (React Native) + Expo Router
- **Database:** SQLite lokal di HP (`expo-sqlite`) — gratis, tanpa server, tanpa akun
- **Bahasa:** TypeScript

Semua data tersimpan di HP Anda sendiri. Kalau aplikasinya dihapus, datanya ikut terhapus.

## Yang sudah jadi di versi ini

| Bagian | Isi |
| --- | --- |
| Pembuka | Splash, isi nama, atau **"Try it with demo data"** untuk langsung melihat aplikasi terisi |
| **Today** | Sapaan, progres hari ini, habit (tap untuk centang), air minum, mood, planner hari ini, ringkasan uang bulan ini |
| **Spaces** | 6 space; Wellness & Finance sudah aktif, 4 lainnya bertanda *Soon* |
| **Quick add (+)** | Rencana, pengeluaran, pemasukan, check-in, habit baru, jurnal, +1 gelas air |
| **Calendar** | Kalender bulanan dengan titik penanda + daftar agenda per hari |
| **Inbox** | Pengingat otomatis: tugas terlambat, agenda hari ini & 3 hari ke depan, habit tersisa, target air, budget hampir habis |
| **Wellness** | Habit (buat, ubah, jeda, arsip, hapus, streak, riwayat 7 hari yang bisa dikoreksi), air minum + grafik mingguan, check-in mood/stres/energi + riwayat, jurnal |
| **Finance** | Akun & saldo, transaksi (tambah/ubah/hapus, cari, filter, per bulan), budget per kategori |
| **Planner** | Tugas & pengingat lintas space, prioritas, jam, tandai selesai |
| **Profil** | Ubah nama, target air, isi ulang data demo, hapus semua data |

Belum ada: Travel, Event Planner, Education, Home & Assets, langganan/pembayaran, login online, sinkronisasi antar-HP, dan notifikasi push.

## Cara mencoba langsung di HP (paling cepat — pakai Expo Go)

Butuh: laptop/PC dengan [Node.js 20+](https://nodejs.org) dan HP di **jaringan Wi-Fi yang sama**.

1. **Di HP:** pasang aplikasi **Expo Go** dari Play Store / App Store.
2. **Di laptop**, buka terminal:

   ```bash
   git clone https://github.com/gideonmnrg/sheetscode-content.git
   cd sheetscode-content
   git checkout claude/sleepy-hypatia-0uhyof
   cd menata-app
   npm install
   npx expo start
   ```

3. Muncul **QR code** di terminal.
   - **Android:** buka Expo Go → *Scan QR code*.
   - **iPhone:** buka aplikasi **Kamera** → arahkan ke QR → ketuk notifikasinya.
4. Aplikasi terbuka di HP. Pilih **"Try it with demo data"** untuk melihat semua layar terisi.

Setiap kali Anda menyimpan perubahan kode di laptop, aplikasi di HP ikut ter-update otomatis.

**Kalau HP tidak bisa terhubung** (Wi-Fi kantor/kampus sering memblokir), jalankan:

```bash
npx expo start --tunnel
```

## Cara membuat file APK (Android, bisa dipasang tanpa laptop menyala)

Gratis dengan akun Expo (paket free).

```bash
npm install -g eas-cli
eas login          # buat akun gratis di expo.dev kalau belum punya
eas build -p android --profile preview
```

Setelah selesai (±10–20 menit di server Expo), Anda dapat link untuk mengunduh `.apk`. Buka link itu di HP Android lalu pasang. Untuk iPhone, pemasangan di luar Expo Go butuh akun Apple Developer (berbayar).

## Struktur kode

```
menata-app/
├── app.json              Nama, ikon, splash, paket Android/iOS
├── eas.json              Profil build APK
├── assets/               Logo Menata, ikon aplikasi, splash
└── src/
    ├── theme.ts          Warna, font, radius — dari "Design system · Foundations"
    ├── db/
    │   ├── schema.ts     Tabel SQLite + migrasi bertahap (PRAGMA user_version)
    │   ├── queries.ts    Semua query baca/tulis
    │   └── seed.ts       Data demo (Gidy, akun BCA/Mandiri/Jago, habit, planner)
    ├── lib/              Format Rupiah & tanggal, hook useQuery, navigasi
    ├── components/       Komponen UI bersama (kartu, tombol, ikon, wajah mood…)
    └── app/              Setiap file = satu layar (Expo Router)
        ├── (tabs)/       Today · Spaces · (+) · Calendar · Inbox
        ├── wellness/     Hub, habit, check-in, mind, jurnal
        ├── finance/      Ringkasan, transaksi, akun, budget
        ├── planner/      Daftar & form
        ├── quick-add.tsx
        ├── profile.tsx
        └── welcome.tsx
```

### Menambah tabel atau kolom baru

Buka `src/db/schema.ts`, lalu **tambahkan** satu string SQL baru di akhir array `MIGRATIONS`. Jangan mengubah migrasi yang sudah ada, supaya HP yang sudah berisi data tetap bisa ter-upgrade tanpa kehilangan data.

### Pindah ke database online nanti

Semua akses data ada di `src/db/queries.ts`. Kalau nanti ingin sinkron antar-HP atau berbagi dengan keluarga (misalnya pakai Supabase, yang juga punya paket gratis), cukup fungsi-fungsi di file itu yang diganti. Layar-layarnya tidak perlu diubah.

## Perintah berguna

```bash
npx expo start          # jalankan server pengembangan
npm run typecheck       # cek TypeScript
npx expo-doctor         # cek versi paket cocok dengan SDK
```
