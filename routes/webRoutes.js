/**
 * Web Routes - Rute antarmuka Web EJS
 * Sesuai arsitektur MVC - Folder routes/
 */

import express from 'express';
import {
  getKatalog,
  getJadwalPinjam,
  getLogPeminjaman,
  getAdminPanel
} from '../controllers/homeController.js';

const router = express.Router();

// Halaman 1: Katalog Buku (Beranda Mahasiswa)
router.get('/', getKatalog);
router.get('/katalog', getKatalog);

// Halaman 2: Jadwal & Form Peminjaman
router.get('/jadwal', getJadwalPinjam);
router.get('/jadwal/:id', getJadwalPinjam);

// Halaman 3: Log Peminjaman
router.get('/log-peminjaman', getLogPeminjaman);

// Halaman 4: Panel Admin (Manajemen CRUD Produk & Status Sistem)
router.get('/admin', getAdminPanel);

export default router;
