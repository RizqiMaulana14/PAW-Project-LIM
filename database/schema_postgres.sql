-- ========================================================================
-- SCHEMA DATABASE POSTGRESQL - APLIKASI PUSTAKA LIM
-- Dikelola secara otomatis melalui Sequelize ORM
-- ========================================================================

-- 1. Tabel Kategori
CREATE TABLE IF NOT EXISTS kategori (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL UNIQUE,
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Tabel Produk / Koleksi Buku
CREATE TABLE IF NOT EXISTS produk (
  id SERIAL PRIMARY KEY,
  kode VARCHAR(50) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  penulis VARCHAR(255) NOT NULL,
  kategori_id INTEGER NOT NULL REFERENCES kategori(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'Tersedia',
  lokasi_rak VARCHAR(100) DEFAULT 'Rak Umum',
  tahun INTEGER DEFAULT 2024,
  cover_bg VARCHAR(255) DEFAULT 'bg-slate-100',
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Tabel Log Peminjaman
CREATE TABLE IF NOT EXISTS peminjaman (
  id SERIAL PRIMARY KEY,
  kode VARCHAR(50) NOT NULL UNIQUE,
  produk_id INTEGER NOT NULL REFERENCES produk(id) ON UPDATE CASCADE ON DELETE CASCADE,
  peminjam_nama VARCHAR(150) NOT NULL DEFAULT 'Naya Aulia',
  tanggal_pinjam VARCHAR(100) NOT NULL,
  tanggal_kembali VARCHAR(100) NOT NULL,
  sisa_waktu VARCHAR(100) DEFAULT '14 hari lagi',
  status VARCHAR(50) NOT NULL DEFAULT 'Sedang dipinjam',
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
