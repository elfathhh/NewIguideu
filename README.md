# IguideU Travel

**IguideU** adalah platform marketplace pariwisata yang menghubungkan wisatawan dengan pemandu wisata (*tour guide*) lokal terverifikasi di Provinsi **Nusa Tenggara Barat (NTB)** — meliputi Lombok Barat, Lombok Tengah (Mandalika), Lombok Timur (Sembalun/Rinjani), Lombok Utara (Gili Islands), Kota Mataram, Sumbawa, Sumbawa Barat (Pulau Moyo), Dompu, dan Bima.

Tujuan platform ini adalah mempercepat proses penemuan, pemesanan, dan transaksi pemandu wisata lokal tanpa hambatan administratif, sekaligus memberi pemandu akses pasar digital langsung dengan transparansi finansial.

## ✨ Fitur Utama

- **Autentikasi & Keamanan** — login multi-opsi (email/password, Google OAuth 2.0, Passkeys), Two-Factor Authentication (2FA) via Laravel Fortify, dan manajemen sesi berbasis token Sanctum.
- **Modul Traveler** — pencarian & katalog pemandu wisata, sistem checkout transparan, serta integrasi pembayaran (QRIS, E-Wallet, Virtual Account).
- **Modul Tour Guide** — onboarding & verifikasi identitas, pengaturan paket dan jadwal, serta dashboard manajemen kas/finansial.
- **In-App Messaging** — obrolan real-time antara traveler dan guide setelah pembayaran, tanpa perlu bertukar kontak pribadi.
- **Manajemen Sengketa** — alur pengajuan refund/dispute yang ditengahi oleh admin.
- **Modul Admin** — peninjauan dokumen guide serta dashboard analitik transaksi dan performa platform.
- **PWA & Performa** — dukungan service worker untuk caching aset, dioptimalkan untuk skor Lighthouse tinggi.

## 🛠️ Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | React (Vite), TypeScript, Tailwind CSS |
| Backend | Laravel (PHP) |
| Database | PostgreSQL (Supabase) |
| Package Manager | pnpm (workspace) / Composer |
| Testing | PHPUnit |
| Code Quality | PHPStan, Laravel Pint, ESLint, Prettier |

## 📁 Struktur Proyek

```
IguideU-Travel/
├── app/             # Logika aplikasi Laravel (models, controllers, dll.)
├── bootstrap/       # File bootstrap Laravel
├── config/          # File konfigurasi aplikasi
├── database/        # Migrasi, seeder, dan factory
├── public/          # Entry point publik & aset statis
├── resources/       # Frontend (React/TypeScript), views, aset mentah
├── routes/          # Definisi route API & web
├── storage/         # File log, cache, upload, dll.
├── tests/           # Test suite (PHPUnit)
├── artisan          # CLI Laravel
├── composer.json    # Dependensi PHP
├── package.json     # Dependensi JavaScript/TypeScript
└── vite.config.ts   # Konfigurasi build Vite
```

## 🚀 Instalasi & Menjalankan Proyek

### Prasyarat

- PHP >= 8.2
- Composer
- Node.js & pnpm
- PostgreSQL (atau akses ke instance Supabase)

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/elfathhh/IguideU-Travel.git
   cd IguideU-Travel
   ```

2. **Install dependensi PHP**
   ```bash
   composer install
   ```

3. **Install dependensi JavaScript**
   ```bash
   pnpm install
   ```

4. **Konfigurasi environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Sesuaikan variabel koneksi database (Supabase PostgreSQL) dan kredensial lain (Google OAuth, payment gateway, dll.) di file `.env`.

5. **Jalankan migrasi database**
   ```bash
   php artisan migrate
   ```

6. **Jalankan server pengembangan**
   ```bash
   php artisan serve
   pnpm run dev
   ```

## 🧪 Testing & Kualitas Kode

```bash
# Menjalankan test PHP
php artisan test

# Analisis statis (PHPStan)
composer phpstan

# Format kode PHP (Pint)
composer pint

# Lint & format kode frontend
pnpm run lint
```

> Perintah di atas mengikuti konfigurasi standar Laravel/`phpstan.neon`/`pint.json`/`eslint.config.js` pada proyek ini — sesuaikan dengan script yang tersedia di `composer.json` dan `package.json` jika berbeda.

## 🔥 Kontribusi 

Kontribusi sangat terbuka! Silakan buat *fork*, buat *branch* fitur baru, lalu ajukan *pull request*.

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buka Pull Request

## 📄 Lisensi

Belum ada informasi lisensi resmi yang tercantum pada repository ini. Silakan hubungi pemilik repository untuk detail lebih lanjut.

## 📬 Kontak

Dikembangkan oleh [elfathhh](https://github.com/elfathhh) dan [indrawij4y4](https://github.com/indrawij4y4)
