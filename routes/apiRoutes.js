/**
 * API Routes - Endpoint REST API Operasi CRUD
 * Sesuai arsitektur MVC - Folder routes/
 */

import express from 'express';
import {
  getStatus,
  getProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,
  getKategori,
  getPeminjaman,
  createPeminjaman,
  cancelPeminjaman,
  aiChat
} from '../controllers/apiControllers.js';

const router = express.Router();

/**
 * Status Server & Database
 */
router.get('/status', getStatus);

/**
 * ENDPOINTS CRUD UTAMA PROJECT (Resource: produk / buku)
 */
// 1. READ ALL: Mengambil seluruh data produk dari database
router.get('/produk', getProduk);

// 2. READ ONE: Mengambil detail satu data berdasarkan ID
router.get('/produk/:id', getProdukById);

// 3. CREATE: Menambahkan data baru ke dalam database
router.post('/produk', createProduk);

// 4. UPDATE: Memperbarui data berdasarkan ID di database
router.put('/produk/:id', updateProduk);

// 5. DELETE: Menghapus data berdasarkan ID dari database
router.delete('/produk/:id', deleteProduk);

/**
 * Kategori Endpoint
 */
router.get('/kategori', getKategori);

/**
 * Log Peminjaman Endpoints
 */
router.get('/peminjaman', getPeminjaman);
router.post('/peminjaman', createPeminjaman);
router.delete('/peminjaman/:id', cancelPeminjaman);

/**
 * Pustaka AI Assistant Endpoint
 */
router.post('/ai/chat', aiChat);

/**
 * Rute Kompatibilitas Alias (/api/books)
 */
router.get('/books', getProduk);
router.get('/books/:id', getProdukById);
router.post('/books', createProduk);
router.put('/books/:id', updateProduk);
router.delete('/books/:id', deleteProduk);

export default router;
