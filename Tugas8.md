## 1. Penambahan Tampilan Baru: Panel Admin (`views/admin.ejs`)

Halaman pengelola/admin pada rute `/admin` telah selesai dibuat dan menampung seluruh endpoint REST API tugas, dengan desain yang selaras 100% dengan antarmuka mahasiswa.

### Integrasi `GET /api/status`
- Widget pemantau kesehatan server 4-kartu secara *real-time*: status koneksi MySQL (*Connected*), *uptime* server, *timestamp* lokal WIB, dan penghitung total koleksi.
- Tombol interaktif **"Cek Status Server"** untuk me-*refresh* data server.
- Tombol akordeon **"Lihat Raw JSON Response"** untuk inspeksi payload asli.

### Integrasi `GET /api/produk`
- Tabel koleksi buku responsif yang membaca data langsung dari database MySQL.
- Kolom **"Kode Buku"** diperlebar (`w-44 min-w-[150px]`) dan ditata dengan *badge* pill *monospace* beserta ikon barcode yang rapi.
- Pencarian instan (*live search*) berdasarkan judul, penulis, kode, dan rak, serta filter kategori dan status ketersediaan.
- Tombol pintasan **"API JSON"** untuk membuka data mentah di tab baru.

### Integrasi `GET /api/produk/:id`
- Tombol aksi ikon mata (👁️) di setiap baris tabel.
- Modal detail buku yang menampilkan metadata lengkap beserta pratinjau respons *Raw JSON* dengan status `200 OK`.

### Integrasi `POST /api/produk`
- Tombol **"+ Tambah Produk Baru"** di bagian header.
- Modal formulir input buku baru (Judul, Penulis, Kategori, Tahun, Lokasi Rak, Deskripsi) yang menyimpan langsung ke MySQL dengan respons status `201 Created`.

### Integrasi `PUT /api/produk/:id`
- Tombol aksi ikon pensil (✏️) di setiap baris tabel.
- Modal formulir edit yang otomatis terisi (*pre-filled*) dengan data buku dari database untuk diperbarui, dengan respons status `200 OK`.

### Integrasi `DELETE /api/produk/:id`
- Tombol aksi ikon tempat sampah (🗑️) di setiap baris tabel.
- Modal dialog konfirmasi bahaya untuk menghapus data buku secara permanen dari database, dengan respons status `200 OK`.

---

## 2. Koneksi Database dan `CREATE TABLE` (`config/db.js` & `database/schema.sql`)

Infrastruktur basis data telah dikelola secara terpisah dan memenuhi seluruh standar tugas.

### Koneksi Database Terisolasi (`config/db.js`)
- Menggunakan `mysql2/promise` dengan sistem *Connection Pool* (`pool.query`) agar hemat memori dan tahan beban *concurrent request*.
- Dilengkapi fungsi `testDbConnection()` untuk memverifikasi kesiapan koneksi database saat server pertama kali dijalankan.
- Informasi sensitif (host, user, password, port, nama database) dikelola melalui file environment `.env` dan telah dilindungi dari publikasi via `.gitignore`.

### Struktur Tabel dan Data Awal (`database/schema.sql`)
- Perintah `CREATE DATABASE IF NOT EXISTS db_lim_library`.
- Perintah `CREATE TABLE` untuk 3 tabel berelasi:
  - **`kategori`** — `id`, `nama`, `deskripsi`, `created_at`
  - **`produk`** — `id`, `kode`, `nama`, `penulis`, `kategori_id`, `status`, `lokasi_rak`, `tahun`, `cover_bg`, `deskripsi`, `created_at`, `updated_at` (dengan *Foreign Key* ke tabel `kategori`)
  - **`peminjaman`** — `id`, `kode`, `produk_id`, `peminjam_nama`, `tanggal_pinjam`, `tanggal_kembali`, `sisa_waktu`, `status`, `catatan`, `created_at` (dengan relasi ke tabel `produk`)
- Berisi perintah `INSERT INTO` (data *seeding*) untuk 8 kategori dan 11 buku awal yang siap digunakan untuk menguji operasi *Read*.