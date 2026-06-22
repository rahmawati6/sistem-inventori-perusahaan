# Panduan Kontribusi

Terima kasih telah tertarik berkontribusi pada Inventory Cloud. Kontribusi berupa laporan bug, usulan fitur, perbaikan dokumentasi, dan perubahan kode sangat diterima.

## Sebelum Memulai

- Cari issue yang sudah ada agar tidak membuat laporan duplikat.
- Gunakan template issue yang sesuai dan berikan konteks yang cukup.
- Untuk perubahan besar, buat issue terlebih dahulu agar pendekatan dapat didiskusikan.
- Patuhi [Kode Etik](CODE_OF_CONDUCT.md) selama berinteraksi di proyek ini.

## Menyiapkan Lingkungan Pengembangan

1. Fork repository ini dan clone fork Anda.
2. Ikuti bagian instalasi pada [README.md](README.md).
3. Pastikan backend dan frontend dapat dijalankan sebelum membuat perubahan.
4. Buat branch dari `main` dengan nama yang deskriptif:

   ```bash
   git checkout -b feature/nama-fitur
   ```

## Standar Perubahan

- Buat perubahan yang fokus pada satu tujuan.
- Pertahankan gaya kode yang sudah digunakan proyek.
- Jangan commit `.env`, kredensial, token, atau data sensitif.
- Perbarui dokumentasi jika perilaku aplikasi berubah.
- Tambahkan atau sesuaikan test bila perubahan memengaruhi logika aplikasi.

Gunakan pesan commit yang jelas. Format [Conventional Commits](https://www.conventionalcommits.org/) direkomendasikan:

```text
feat: menambahkan filter laporan
fix: memperbaiki validasi stok keluar
docs: memperbarui panduan instalasi
```

## Pemeriksaan Sebelum Pull Request

Jalankan pemeriksaan berikut:

```bash
cd frontend-react
npm ci
npm run build
```

```bash
cd backend-laravel
composer install
php artisan test
```

## Pull Request

- Isi seluruh bagian pada template pull request.
- Hubungkan pull request dengan issue terkait jika tersedia.
- Jelaskan alasan dan dampak perubahan, bukan hanya daftar file yang diubah.
- Sertakan screenshot untuk perubahan antarmuka.
- Pastikan seluruh pemeriksaan CI berhasil.

Maintainer dapat meminta perubahan sebelum pull request digabungkan. Diskusi yang sopan dan teknis akan membantu proses review berjalan lebih cepat.
