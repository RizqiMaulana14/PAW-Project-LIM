-- ========================================================================
-- SCHEMA DATABASE APLIKASI PUSTAKA LIM (Library Integrated Management)
-- Tugas: PPAW - Integrasi Database dan Implementasi CRUD
-- Kelompok 2 PAW
-- ========================================================================

CREATE DATABASE IF NOT EXISTS db_lim_library
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_lim_library;

-- 1. Hapus tabel jika sudah ada (sesuai urutan foreign key)
DROP TABLE IF EXISTS peminjaman;
DROP TABLE IF EXISTS produk;
DROP TABLE IF EXISTS kategori;

-- 2. Tabel Kategori
CREATE TABLE kategori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL UNIQUE,
  deskripsi TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabel Produk / Koleksi Buku (Main Resource CRUD)
CREATE TABLE produk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(50) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  penulis VARCHAR(255) NOT NULL,
  kategori_id INT NOT NULL,
  status ENUM('Tersedia', 'Dipinjam') NOT NULL DEFAULT 'Tersedia',
  lokasi_rak VARCHAR(100) DEFAULT 'Rak Umum',
  tahun INT DEFAULT 2024,
  cover_bg VARCHAR(255) DEFAULT 'bg-slate-100',
  deskripsi TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_produk_kategori
    FOREIGN KEY (kategori_id) REFERENCES kategori(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. Tabel Log Peminjaman
CREATE TABLE peminjaman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(50) NOT NULL UNIQUE,
  produk_id INT NOT NULL,
  peminjam_nama VARCHAR(150) NOT NULL DEFAULT 'Naya Aulia',
  tanggal_pinjam VARCHAR(100) NOT NULL,
  tanggal_kembali VARCHAR(100) NOT NULL,
  sisa_waktu VARCHAR(100) DEFAULT '14 hari lagi',
  status ENUM('Sedang dipinjam', 'Jatuh tempo', 'Dikembalikan', 'Dibatalkan') NOT NULL DEFAULT 'Sedang dipinjam',
  catatan TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_peminjaman_produk
    FOREIGN KEY (produk_id) REFERENCES produk(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ========================================================================
-- DATA AWAL (SEEDING) UNTUK PENGUJIAN OPERASI READ
-- ========================================================================

-- Seed Kategori
INSERT INTO kategori (id, nama, deskripsi) VALUES
(1, 'Fiksi Historis', 'Karya fiksi yang berlatar peristiwa sejarah nyata'),
(2, 'Pengembangan Diri', 'Buku peningkatan kualitas hidup dan kebiasaan positif'),
(3, 'Sastra Indonesia', 'Karya sastra kanon dan kontemporer sastrawan Indonesia'),
(4, 'Fiksi', 'Novel dan cerita fiksi umum'),
(5, 'Sejarah', 'Catatan evolusi dan peradaban manusia serta bangsa'),
(6, 'Teknologi Informasi', 'Buku arsitektur perangkat lunak, pemrograman, dan sistem'),
(7, 'Kecerdasan Buatan', 'Machine Learning, Deep Learning, dan pemrosesan data'),
(8, 'Ilmu Komunikasi', 'Psikologi komunikasi, organisasi, dan interaksi manusia');

-- Seed Produk / Koleksi Buku
INSERT INTO produk (id, kode, nama, penulis, kategori_id, status, lokasi_rak, tahun, cover_bg, deskripsi) VALUES
(1, 'BOK-001', 'Laut Bercerita', 'Leila S. Chudori', 1, 'Tersedia', 'Rak Fiksi-01', 2017, 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700', 'Mengisahkan perjuangan para aktivis mahasiswa era 1998 yang diculik dan disiksa, serta keluarga korban yang tidak pernah berhenti mencari kepastian nasib anak-anak mereka.'),
(2, 'BOK-002', 'Filosofi Teras', 'Henry Manampiring', 2, 'Dipinjam', 'Rak PD-02', 2019, 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900', 'Penerapan filsafat Yunani-Romawi kuno (Stoisisme) untuk mengatasi emosi negatif dan mental tangguh dalam menghadapi ujian kehidupan modern.'),
(3, 'BOK-003', 'Atomic Habits', 'James Clear', 2, 'Dipinjam', 'Rak PD-01', 2018, 'bg-gradient-to-br from-stone-200 to-stone-300 text-stone-800', 'Perubahan sangat kecil yang memberikan hasil luar biasa. Cara mudah dan terbukti untuk membentuk kebiasaan baik dan menghilangkan kebiasaan buruk.'),
(4, 'BOK-004', 'Bumi Manusia', 'Pramoedya Ananta Toer', 3, 'Tersedia', 'Rak Sastra-01', 1980, 'bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-900', 'Roman sejarah kebangkitan nasional awal abad ke-20 yang menceritakan pemuda pribumi Minke dan perjuangan Nyai Ontosoroh melawan hegemoni hukum kolonial Belanda.'),
(5, 'BOK-005', 'Pulang', 'Tere Liye', 4, 'Tersedia', 'Rak Fiksi-02', 2015, 'bg-gradient-to-br from-sky-100 to-blue-200 text-sky-900', 'Sebuah novel tentang perjalanan pulang melalui pertarungan demi pertarungan, memeluk rasa takut, dan menemukan hakikat pengampunan dan kedamaian sejati.'),
(6, 'BOK-006', 'Sapiens: Riwayat Singkat Umat Manusia', 'Yuval Noah Harari', 5, 'Tersedia', 'Rak Sejarah-01', 2014, 'bg-gradient-to-br from-orange-100 to-amber-200 text-orange-900', 'Penjelajahan komprehensif sejarah umat manusia sejak evolusi kera purba di Afrika Timur hingga era revolusi kognitif, pertanian, dan sains kontemporer.'),
(7, 'BOK-007', 'Negeri 5 Menara', 'Ahmad Fuadi', 4, 'Tersedia', 'Rak Fiksi-03', 2009, 'bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-900', 'Kisah enam santri dari berbagai pelosok nusantara di Pondok Madani yang disatukan oleh impian besar di bawah menara masjid dengan mantra Man Jadda Wajada.'),
(8, 'BOK-008', 'Pemrograman Multiplatform dengan Flutter dan Dart', 'Rizqi Maulana Fitrah', 6, 'Tersedia', 'Rak TI-01', 2024, 'bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-900', 'Buku panduan lengkap membangun aplikasi mobile Android dan iOS dari satu basis kode.'),
(9, 'BOK-009', 'Kecerdasan Buatan & Machine Learning Modern', 'Muhammad Rasyid Ridha', 7, 'Tersedia', 'Rak AI-02', 2023, 'bg-gradient-to-br from-violet-100 to-fuchsia-200 text-violet-900', 'Konsep dasar hingga implementasi algoritma Deep Learning dan NLP menggunakan Python.'),
(10, 'BOK-010', 'Psikologi Komunikasi dalam Organisasi Modern', 'Rizki Fadhil Budiastanto', 8, 'Tersedia', 'Rak IK-01', 2023, 'bg-gradient-to-br from-rose-100 to-pink-200 text-rose-900', 'Memahami dinamika komunikasi antarmanusia, kepemimpinan, dan penyelesaian konflik.'),
(11, 'BOK-011', 'Arsitektur Software Modern & Microservices', 'Akhmad Rezky Utama', 6, 'Tersedia', 'Rak TI-03', 2024, 'bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-900', 'Panduan merancang sistem backend yang scalable, distributed tracing, dan container orchestration.');

-- Seed Peminjaman
INSERT INTO peminjaman (id, kode, produk_id, peminjam_nama, tanggal_pinjam, tanggal_kembali, sisa_waktu, status, catatan) VALUES
(1, 'LOAN-001', 1, 'Naya Aulia', '12 Juni 2025', '19 Juni 2025', '4 hari lagi', 'Sedang dipinjam', 'Peminjaman reguler mahasiswa'),
(2, 'LOAN-002', 3, 'Naya Aulia', '08 Juni 2025', '15 Juni 2025', 'Jatuh tempo hari ini', 'Jatuh tempo', 'Batas akhir pengembalian hari ini'),
(3, 'LOAN-003', 4, 'Naya Aulia', '01 Juni 2025', '08 Juni 2025', 'Selesai', 'Dikembalikan', 'Dikembalikan tepat waktu');
