# 📦 Inventory Cloud System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react)
![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20.svg?logo=laravel)

Sistem Informasi Manajemen Inventori Perusahaan berbasis Cloud yang modern, efisien, dan open-source. Dibangun dengan memadukan kekuatan **React.js** di sisi *frontend* dan **Laravel** di sisi *backend* untuk menjamin kecepatan, keamanan, dan skalabilitas pendataan secara *real-time*.

---

## ✨ Fitur Utama

- 📊 **Dashboard Real-time**: Pantau total stok, pergerakan barang masuk/keluar, dan ringkasan performa secara instan dengan metrik interaktif.
- 📦 **Manajemen Data Barang**: Sistem CRUD terintegrasi, mendukung ribuan data dengan pencarian pintar (*smart search*).
- 📥 **Pencatatan Barang Masuk & Keluar**: *Tracking* komprehensif dilengkapi sistem penanggung jawab dan asal/tujuan logistik.
- 📑 **Laporan Terpadu**: Hasil rekapitulasi data pergerakan inventori.
- 🔐 **Keamanan & Autentikasi**: Sistem login aman menggunakan standar *Bcrypt hashing* dan autentikasi token modern. Antarmuka menggunakan *split-screen* kelas Enterprise.

---

## 🚀 Screenshot Aplikasi

Sistem ini mengusung desain *Modern Light Theme* dengan *Glassmorphism* dan micro-interactions yang mulus.

<div align="center">
  <img src="docs/login.png" alt="Halaman Login" width="48%" />
  <img src="docs/dashboard.png" alt="Halaman Dashboard" width="48%" />
</div>

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React.js** + Vite (Cepat & Ringan)
- **React Router DOM** (Navigasi SPA)
- **Recharts** (Visualisasi Data Interaktif)
- **Lucide React** (Ikon Vektor Premium)
- **CSS Vanilla Modular** (Performa rendering tinggi tanpa *bloatware*)

### Backend
- **Laravel 11** (PHP Framework kelas Enterprise)
- **MySQL / MariaDB** (Database Relasional)
- **Laravel Sanctum** (Autentikasi API yang kokoh)

---

## ⚙️ Cara Instalasi (Local Development)

Ikuti panduan berikut untuk menjalankan proyek ini di mesin lokal Anda.

### 1. Persiapan Backend (Laravel)

```bash
# Masuk ke folder backend
cd backend-laravel

# Install dependensi PHP
composer install

# Salin file environment dan atur konfigurasi database (DB_DATABASE, DB_USERNAME, dll)
cp .env.example .env
php artisan key:generate

# Jalankan migrasi dan seeder untuk data awal (Data Dummy lengkap)
php artisan migrate:fresh --seed

# Jalankan server lokal backend (di port 8000)
php artisan serve
```

### 2. Persiapan Frontend (React)

```bash
# Buka tab terminal baru, masuk ke folder frontend
cd frontend-react

# Install dependensi Node.js
npm install

# Jalankan server Vite lokal
npm run dev
```

Buka browser Anda dan akses `http://localhost:5173`. 

> **Akses Default:**
> Username: `admin`
> Password: `admin123`

---

## 🤝 Berkontribusi (Contributing)

Kami sangat terbuka untuk kontribusi! Jika Anda menemukan kutu (*bug*), ingin menambah fitur baru, atau meningkatkan kualitas kode:
1. *Fork* repositori ini.
2. Buat *branch* fitur Anda (`git checkout -b fitur/FiturBaru`).
3. Lakukan *commit* atas perubahan Anda (`git commit -m 'Menambahkan FiturBaru'`).
4. *Push* ke *branch* tersebut (`git push origin fitur/FiturBaru`).
5. Buka *Pull Request* baru.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

---
**Dibuat dengan ❤️ untuk merevolusi manajemen gudang digital.**
