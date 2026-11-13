# Pustaka LIM (Library Integrated Management) — PPAW Project Berkelanjutan

> **Integrasi Database MySQL dan Implementasi CRUD Lengkap (Frontend & Backend)**  
> Praktikum Pengembangan Aplikasi Web (PPAW) — Semester Ganjil 2026/2027  
> **Kelompok 2 — Kelas A/B/C/E**

---

## 👥 Identitas Anggota Kelompok 2

| No | Nama Mahasiswa | NIM |
|:--:|:----------------------------------|:-----------:|
| 1 | **Rizqi Maulana Fitrah** | `20240140113` |
| 2 | **Muhammad Rasyid Ridha Aqimuddin** | `20240140151` |
| 3 | **Rizki Fadhil Budiastanto** | `20240140112` |
| 4 | **Akhmad Rezky Utama** | `20240140161` |

---

## 📌 Ringkasan Pengerjaan Project

Project ini melanjutkan milestone sebelumnya dengan **mengintegrasikan database relasional MySQL**, membangun **endpoint REST API CRUD lengkap (Create, Read, Update, Delete)**, dan menghubungkan **frontend EJS dengan antarmuka manajemen data interaktif** yang tersimpan permanen di database.

### 🌟 Poin-Poin Utama yang Diimplementasikan:
1. **Integrasi Database MySQL**:
   - Terhubung menggunakan `mysql2/promise` dengan sistem *connection pool*.
   - Konfigurasi terpusat pada [`config/db.js`](config/db.js).
   - Skrip DDL tabel dan data awal (*seeding*) tersimpan rapi di [`database/schema.sql`](database/schema.sql).
   - Informasi sensitif database diamankan di [`.env`](.env) dan diabaikan dari git melalui [`.gitignore`](.gitignore).
2. **Endpoint REST API CRUD Lengkap**:
   - `GET /api/produk`: Mengambil seluruh koleksi data dari database (Array JSON).
   - `GET /api/produk/:id`: Mengambil detail satu buku berdasarkan ID dari database.
   - `POST /api/produk`: Menambahkan data buku baru ke database (HTTP 201 Created).
   - `PUT /api/produk/:id`: Memperbarui data buku berdasarkan ID di database (HTTP 200 OK).
   - `DELETE /api/produk/:id`: Menghapus data buku berdasarkan ID dari database (HTTP 200 OK).
   - `GET /api/status`: Menampilkan status server, uptime, dan status koneksi database.
3. **Pengembangan Frontend CRUD Interaktif**:
   - **Tampil (Read)**: Menampilkan seluruh koleksi buku dari database secara dinamis menggunakan EJS & Tailwind CSS.
   - **Tambah (Create)**: Modal interaktif `+ Tambah Buku Baru` dengan validasi form.
   - **Ubah (Update)**: Tombol `Ubah` pada setiap kartu buku membuka modal edit terisi data awal.
   - **Hapus (Delete)**: Tombol `Hapus` pada setiap kartu buku membuka dialog konfirmasi dan menghapus data secara permanen dari database.
4. **Middleware Logger Tetap Berjalan**:
   - Mencatat seluruh request masuk (`GET`, `POST`, `PUT`, `DELETE`), endpoint, status HTTP, durasi (ms), dan timestamp lokal ke terminal.

---

## 📁 Struktur Folder Project (Arsitektur MVC)

```text
LIM/
├── config/
│   ├── appConfig.js        # Konfigurasi aplikasi, env, port, dan identitas Kelompok 2
│   └── db.js               # Pool koneksi MySQL & helper uji koneksi / auto-init
├── database/
│   └── schema.sql          # DDL tabel (kategori, produk, peminjaman) & seed data awal
├── models/
│   ├── data.js             # Re-export model data
│   ├── productModel.js     # Query database untuk operasi CRUD produk (getAll, getById, create, update, delete)
│   └── loanModel.js        # Query database untuk peminjaman buku
├── middlewares/
│   └── logger.js           # Middleware logger HTTP (Method, URL, Status, Timestamp, Durasi)
├── controllers/
│   ├── apiControllers.js   # Handler pemrosesan request & response REST API CRUD
│   ├── bookControllers.js  # Controller kompatibilitas alias
│   └── homeController.js   # Controller rendering halaman EJS dengan data dari database
├── routes/
│   ├── apiRoutes.js        # Definisi rute REST API CRUD (/api/produk, /api/status, dll.)
│   └── webRoutes.js        # Definisi rute antarmuka Web EJS
├── views/
│   ├── partials/
│   │   ├── head.ejs        # Google Fonts & Tailwind CSS CDN
│   │   ├── sidebar.ejs     # Persistent Sidebar Pustaka LIM
│   │   ├── aiChatbot.ejs   # Floating Pustaka AI Assistant
│   │   └── apiModal.ejs    # Modal interaktif pengujian REST API CRUD
│   ├── katalog.ejs         # Halaman utama: Katalog Buku & Antarmuka CRUD (Tambah, Ubah, Hapus)
│   ├── jadwal.ejs          # Halaman 2: Jadwal & Form Peminjaman Kalender
│   ├── log.ejs             # Halaman 3: Log Peminjaman Aktif & Riwayat
│   └── index.ejs           # Entry view
├── utils/
│   └── helpers.js          # Helper fungsi (formatTimestamp, formatUptime, formatRupiah)
├── public/
│   ├── index.js            # JavaScript frontend (fetch CRUD, modal form, filter, kalender)
│   └── style.css           # Styling tambahan untuk custom scrollbar & transisi
├── .env                    # Variabel environment lokal (DB_HOST, DB_USER, DB_NAME, PORT)
├── .env.example            # Template konfigurasi environment
├── .gitignore              # Mengabaikan node_modules dan file .env
├── app.js                  # Entry point Express.js, mounting middleware, routes, & database
├── package.json            # Informasi dependensi (Express, EJS, Dotenv, MySQL2) & scripts npm
└── README.md               # Dokumentasi lengkap pengerjaan project
```

---

## 🗄️ Struktur Tabel Database (`database/schema.sql`)

### 1. Tabel `kategori`
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Primary Key |
| `nama` | `VARCHAR(100)` | Nama kategori (UNIQUE) |
| `deskripsi` | `TEXT` | Penjelasan kategori |
| `created_at` | `TIMESTAMP` | Waktu dibuat |

### 2. Tabel `produk` (Koleksi Buku Utama)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Primary Key |
| `kode` | `VARCHAR(50)` | Kode unik buku (contoh: `BOK-001`) |
| `nama` | `VARCHAR(255)` | Judul buku / nama produk |
| `penulis` | `VARCHAR(255)` | Nama penulis |
| `kategori_id` | `INT` | Foreign Key ke `kategori(id)` |
| `status` | `ENUM('Tersedia', 'Dipinjam')` | Status ketersediaan buku |
| `lokasi_rak` | `VARCHAR(100)` | Posisi rak buku |
| `tahun` | `INT` | Tahun terbit |
| `cover_bg` | `VARCHAR(255)` | Tema warna cover |
| `deskripsi` | `TEXT` | Sinopsis / ringkasan buku |
| `created_at` | `TIMESTAMP` | Waktu dibuat |
| `updated_at` | `TIMESTAMP` | Waktu diperbarui |

---

## 📡 Dokumentasi Endpoint REST API CRUD

### 1. `GET /api/status`
* **Deskripsi**: Menampilkan status server dan koneksi database MySQL.
* **Method**: `GET`
* **Response Contoh (200 OK)**:
```json
{
  "status": "success",
  "code": 200,
  "app": "Library Integrated Management (LIM)",
  "version": "2.0.0",
  "uptime": "1 jam 20 menit",
  "timestamp": "2026-11-13 20:00:00 WIB",
  "database": {
    "status": "connected",
    "message": "Terhubung ke MySQL database 'db_lim_library'",
    "name": "db_lim_library",
    "host": "127.0.0.1"
  }
}
```

---

### 2. `GET /api/produk` (READ ALL)
* **Deskripsi**: Mengambil seluruh daftar buku dari database MySQL dalam bentuk **Array JSON**.
* **Method**: `GET`
* **Query Params (Opsional)**: `?search=flutter`, `?kategori=Teknologi Informasi`, `?status=Tersedia`
* **Response Contoh (200 OK)**:
```json
[
  {
    "id": 1,
    "kode": "BOK-001",
    "nama": "Laut Bercerita",
    "penulis": "Leila S. Chudori",
    "kategori_id": 1,
    "kategori": "Fiksi Historis",
    "status": "Tersedia",
    "lokasi_rak": "Rak Fiksi-01",
    "tahun": 2017,
    "deskripsi": "Mengisahkan perjuangan para aktivis mahasiswa era 1998..."
  }
]
```

---

### 3. `GET /api/produk/:id` (READ ONE)
* **Deskripsi**: Mengambil detail satu buku berdasarkan ID (angka) atau Kode buku (misal: `BOK-001`).
* **Method**: `GET`
* **Response Contoh (200 OK)**:
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "id": 1,
    "kode": "BOK-001",
    "nama": "Laut Bercerita",
    "penulis": "Leila S. Chudori",
    "kategori": "Fiksi Historis",
    "status": "Tersedia",
    "lokasi_rak": "Rak Fiksi-01",
    "tahun": 2017
  }
}
```

---

### 4. `POST /api/produk` (CREATE)
* **Deskripsi**: Menambahkan data buku baru ke dalam database MySQL.
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "nama": "Pemrograman Backend Modern dengan Node.js",
  "penulis": "Rizqi Maulana Fitrah",
  "kategori_id": 6,
  "tahun": 2024,
  "lokasi_rak": "Rak TI-04",
  "deskripsi": "Panduan komprehensif membangun REST API dengan Express dan MySQL."
}
```
* **Response Contoh (201 Created)**:
```json
{
  "status": "success",
  "code": 201,
  "message": "Produk berhasil ditambahkan ke database.",
  "data": {
    "id": 12,
    "kode": "BOK-012",
    "nama": "Pemrograman Backend Modern dengan Node.js",
    "penulis": "Rizqi Maulana Fitrah",
    "status": "Tersedia"
  }
}
```

---

### 5. `PUT /api/produk/:id` (UPDATE)
* **Deskripsi**: Memperbarui informasi buku berdasarkan ID di database MySQL.
* **Method**: `PUT`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "nama": "Pemrograman Backend Modern dengan Node.js (Edisi Revisi)",
  "lokasi_rak": "Rak TI-05",
  "status": "Tersedia"
}
```
* **Response Contoh (200 OK)**:
```json
{
  "status": "success",
  "code": 200,
  "message": "Data produk berhasil diperbarui di database.",
  "data": {
    "id": 12,
    "nama": "Pemrograman Backend Modern dengan Node.js (Edisi Revisi)",
    "status": "Tersedia"
  }
}
```
{
  "status": "success",
  "code": 200,
  "app": "Library Integrated Management (LIM)",
  "version": "2.0.0",
  "environment": "development",
  "uptime": "15 detik",
  "timestamp": "2026-11-10 10:41:11 WIB",
  "database": {
    "status": "connected",
    "message": "Terhubung ke MySQL database 'db_lim_library'",
    "name": "db_lim_library",
    "host": "127.0.0.1"
  },
  "group": {
    "kelas": "PAW - Kelompok 2",
    "tugas": "PPAW Project Berkelanjutan - Integrasi Database & Implementasi CRUD"
  }
}
```

---

### 6. `DELETE /api/produk/:id` (DELETE)
* **Deskripsi**: Menghapus data buku dari database MySQL secara permanen.
* **Method**: `DELETE`
* **Response Contoh (200 OK)**:
```json
{
  "status": "success",
  "code": 200,
  "message": "Produk berhasil dihapus dari database.",
  "data": {
    "id": 12,
    "kode": "BOK-012",
    "nama": "Pemrograman Backend Modern dengan Node.js (Edisi Revisi)"
  }
}
```

---

## 📜 Bukti Log Middleware Logger (`middlewares/logger.js`)

Seluruh operasi CRUD dicatat secara otomatis di terminal backend:
```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✔ Library Integrated Management (LIM) v2.0.0 Berhasil Dijalankan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🌐 Frontend URL   : http://localhost:3000
  🔌 Status API     : http://localhost:3000/api/status
  📦 CRUD Produk    : http://localhost:3000/api/produk
  🗄️ Database MySQL : ✔ Terhubung ke MySQL database 'db_lim_library'
  📜 Middleware Log : Aktif mencatat request (GET, POST, PUT, DELETE) di terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[2026-11-10 10:40:33 WIB] GET /api/status -> 200 (13ms)
[2026-11-10 10:40:33 WIB] GET /api/produk -> 200 (15ms)
[2026-11-10 10:40:33 WIB] POST /api/produk -> 201 (18ms)
[2026-11-10 10:40:33 WIB] GET /api/produk/12 -> 200 (4ms)
[2026-11-10 10:40:33 WIB] PUT /api/produk/12 -> 200 (12ms)
[2026-11-10 10:40:33 WIB] DELETE /api/produk/12 -> 200 (5ms)
[2026-11-10 10:40:33 WIB] GET /api/produk/12 -> 404 (3ms)
[2026-11-10 10:41:11 WIB] GET /katalog -> 200 (64ms)
```

---

## 🚀 Panduan Menjalankan Project

### 1. Prasyarat
- **Node.js** (v18 ke atas)
- **MySQL / MariaDB** (tersedia via XAMPP Control Panel)

### 2. Konfigurasi Database
1. Pastikan MySQL berjalan (port 3306).
2. Konfigurasi kredensial pada file `.env`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=db_lim_library
   ```
3. Impor tabel dan data awal dari file `database/schema.sql` (bisa melalui phpMyAdmin atau MySQL CLI):
   ```bash
   mysql -u root < database/schema.sql
   ```

### 3. Menjalankan Server
```bash
npm install
npm run dev
# atau
npm start
```

Aplikasi dapat langsung diakses di browser:
- **Katalog & Antarmuka CRUD**: [http://localhost:3000](http://localhost:3000)
- **API Status**: [http://localhost:3000/api/status](http://localhost:3000/api/status)
- **API Produk (JSON)**: [http://localhost:3000/api/produk](http://localhost:3000/api/produk)

---

## ✅ Checklist Kelengkapan Pengumpulan

- [x] **Database berhasil terhubung dengan backend** (`mysql2/promise` pool connection).
- [x] **Database sudah memiliki tabel dan data yang dapat diuji** (`kategori`, `produk`, `peminjaman` terisi 11 buku seed).
- [x] **Endpoint Create berhasil menambahkan data ke database** (`POST /api/produk` menghasilkan HTTP 201).
- [x] **Endpoint Read berhasil mengambil data dari database** (`GET /api/produk` dan `GET /api/produk/:id`).
- [x] **Endpoint Update berhasil memperbarui data pada database** (`PUT /api/produk/:id` menghasilkan HTTP 200).
- [x] **Endpoint Delete berhasil menghapus data dari database** (`DELETE /api/produk/:id` menghasilkan HTTP 200).
- [x] **Seluruh endpoint CRUD telah diuji melalui backend** (terverifikasi melalui script automated tester & REST API console).
- [x] **Seluruh operasi CRUD dapat dilakukan melalui frontend** (Modal Tambah, Tampil Kartu, Modal Ubah, Modal Hapus).
- [x] **Frontend menampilkan data yang berasal dari database melalui backend** (tidak lagi menggunakan array statis).
- [x] **Middleware logger tetap berjalan dan mencatat request** (GET, POST, PUT, DELETE di terminal).
- [x] **Konfigurasi koneksi database terpisah** pada `config/db.js` dan model terpisah pada `models/productModel.js`.
- [x] **Informasi sensitif database terlindungi** di `.env` dan diabaikan pada `.gitignore`.
