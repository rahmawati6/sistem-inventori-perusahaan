# Panduan Deployment: Inventory Cloud

Aplikasi Sistem Informasi Inventori Perusahaan Berbasis Cloud ini menggunakan arsitektur **Infrastructure as a Service (IaaS)**. 
Dengan menggunakan Oracle Cloud Free Tier, Anda mendapatkan instance server virtual Linux (VPS) secara gratis di mana Anda mengelola sepenuhnya sistem operasi (Ubuntu), web server (Nginx/Apache), runtime (PHP, Node.js), dan database (MySQL). 

---

## 1. Persiapan Server Oracle Cloud (Free Tier)
1. Buat akun di [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/).
2. Buat instance Compute (VM) baru:
   - Image: **Ubuntu 22.04 LTS**
   - Shape: VM.Standard.E2.1.Micro (Always Free)
   - Assign Public IP: Yes
   - Download SSH Key (Private Key) untuk login ke server.
3. Login ke server via SSH:
   ```bash
   ssh -i /path/to/private_key.key ubuntu@<IP_PUBLIC_SERVER>
   ```

## 2. Instalasi Dependensi di Server
Setelah login ke server Ubuntu, jalankan perintah berikut untuk menginstal Nginx, PHP, MySQL, Composer, dan Node.js.

```bash
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PHP 8.2 dan ekstensi
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip unzip -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js dan npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3. Konfigurasi Database
Buat database dan user MySQL untuk aplikasi.
```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE db_inventory_laravel;
CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'PasswordKuat123!';
GRANT ALL PRIVILEGES ON db_inventory_laravel.* TO 'inventory_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Setup Backend (Laravel)
1. Clone repositori aplikasi ke direktori `/var/www/inventory-backend`.
2. Salin `.env.example` ke `.env` dan atur konfigurasi database:
   ```env
   DB_DATABASE=db_inventory_laravel
   DB_USERNAME=inventory_user
   DB_PASSWORD=PasswordKuat123!
   ```
3. Install dependensi dan jalankan migrasi:
   ```bash
   cd /var/www/inventory-backend
   composer install --optimize-autoloader --no-dev
   php artisan key:generate
   php artisan migrate --seed --force
   ```
4. Ubah kepemilikan folder agar Nginx dapat mengakses file:
   ```bash
   sudo chown -R www-data:www-data /var/www/inventory-backend/storage /var/www/inventory-backend/bootstrap/cache
   ```

## 5. Setup Frontend (React)
1. Clone/copy kode frontend ke folder `frontend-react` (bisa di lokal atau langsung di server).
2. Atur file `.env` di frontend:
   ```env
   VITE_API_URL=https://api.domainanda.com/api
   ```
3. Build frontend:
   ```bash
   npm install
   npm run build
   ```
4. Salin hasil build (folder `dist`) ke direktori web server, misalnya `/var/www/inventory-frontend/dist`.

## 6. Konfigurasi Web Server (Nginx)
Buat virtual host untuk backend dan frontend.

**Backend (API):**
```nginx
server {
    listen 80;
    server_name api.domainanda.com;
    root /var/www/inventory-backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }
}
```

**Frontend:**
```nginx
server {
    listen 80;
    server_name app.domainanda.com;
    root /var/www/inventory-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/api.domainanda.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/app.domainanda.com /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 7. Keamanan dan SSL (Opsional)
Gunakan Let's Encrypt (Certbot) untuk mengamankan koneksi (HTTPS).
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.domainanda.com -d app.domainanda.com
```

---

## 🛠 Menggunakan Ngrok (Untuk Testing Online)
Jika Anda belum siap untuk deploy ke server cloud dan ingin menunjukkan aplikasi Anda kepada orang lain atau mengujinya secara online dari localhost Anda, Anda bisa menggunakan **ngrok**.

### Langkah-langkah:
1. Pastikan backend Laravel dan frontend React berjalan di terminal terpisah.
   - Backend: `php artisan serve` (berjalan di http://localhost:8000)
   - Frontend: `npm run dev` (berjalan di http://localhost:5173)
2. Buka terminal baru, dan jalankan ngrok untuk **backend**:
   ```bash
   ngrok http 8000
   ```
3. Salin URL HTTPS yang diberikan oleh ngrok (misal: `https://abcd-1234.ngrok-free.app`).
4. Ubah variabel `.env` di **frontend** (React) agar menggunakan URL ngrok ini:
   ```env
   VITE_API_URL=https://abcd-1234.ngrok-free.app/api
   ```
5. Restart server frontend jika perlu.
6. (Opsional) Jalankan ngrok untuk **frontend** jika Anda ingin orang lain bisa membuka UI-nya:
   ```bash
   ngrok http 5173
   ```
7. Bagikan link ngrok frontend kepada orang lain. Mereka dapat mengakses aplikasi Anda secara online!

*Catatan: Konfigurasi `config/cors.php` di Laravel telah disesuaikan dengan memberikan `allowed_methods => ['*']` dan origin bebas, sehingga API tetap dapat diakses via ngrok dari React.*
