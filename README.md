# API E-Commerce

## Daftar Kontributor

| Nama | NIM | Peran / Topik Kontribusi | GitHub |
| :--- | :--- | :--- | :--- |
| Rizky Saputra Pakpahan | 241111536 | - Setup Project<br>- Membuat struktur database<br>- Validasi input & error handling | [@RYP-w](https://github.com/RYP-w) | 
Christian de Midro Nainggolan | 241112767 | - Handle Route dan Controller | [@altairviel](https://github.com/altairviel) |
 Jhody Parsaoran Sitorus | 241112767 | -Pembuatan ResponseFormat dan Penerapannya | [@Linksoul101](https://github.com/Linksoul101)


## Getting Started
### Require
**[`NodeJS`](https://nodejs.org/en/download)**: JavaScript runtime environment (untuk menjalankan server backend)<br>
**[`XAMPP`](https://www.apachefriends.org/)**: local web server environment (digunakan untuk menjalankan server database MySQL)<br>
**[`Postman`](https://www.postman.com/downloads/)**: aplikasi pengujian API
### Setup
#### Step 1. Clone Repositori
``` cmd
git clone https://github.com/RYP-w/pra-UTS-Back-End.git
cd pra-UTS-Back-End
```
#### Step 2. Inisialisasi Projek
``` cmd
npm install express mysql2
```
#### Step 3. Konfigurasi Database MySQL ke Client
- Pada XAMPP Control Panel, nyalakan modul **Apache** dan **MySQL** dengan menekan `start`
- Pada [phpMyAdmin](http://localhost/phpmyadmin/) buat Database dengn nama `e_commerce_pra_uts_db`
- Import Database pada file [database_version_4.sql](https://github.com/RYP-w/pra-UTS-Back-End/blob/main/src/database/database_version_4.sql) yang terdapat pada repositori ini kedalam Database yang sudah di buat
#### Step 4. Nyalakan Server API
``` cmd
node server.js
```
