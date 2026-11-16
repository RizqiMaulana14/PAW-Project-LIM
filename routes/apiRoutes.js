// Rute REST API CRUD dengan validasi JOI dan Sequelize ORM
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
  cancelPeminjaman
} from '../controllers/apiControllers.js';
import {
  validate,
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  createLoanSchema,
  loanIdParamSchema
} from '../middlewares/validate.js';

const router = express.Router();

// GET /api/status - Status server dan koneksi database
router.get('/status', getStatus);

// 1. GET /api/produk - Mengambil seluruh data produk
router.get('/produk', getProduk);

// 2. GET /api/produk/:id - Mengambil detail satu data berdasarkan ID dengan validasi param
router.get('/produk/:id', validate(productIdParamSchema, 'params'), getProdukById);

// 3. POST /api/produk - Menambahkan data baru dengan validasi body JOI
router.post('/produk', validate(createProductSchema, 'body'), createProduk);

// 4. PUT /api/produk/:id - Memperbarui data dengan validasi param dan body JOI
router.put(
  '/produk/:id',
  validate(productIdParamSchema, 'params'),
  validate(updateProductSchema, 'body'),
  updateProduk
);

// 5. DELETE /api/produk/:id - Menghapus data berdasarkan ID dengan validasi param JOI
router.delete('/produk/:id', validate(productIdParamSchema, 'params'), deleteProduk);

// GET /api/kategori - Mengambil daftar seluruh kategori
router.get('/kategori', getKategori);

// GET & POST /api/peminjaman - Transaksi dan riwayat peminjaman
router.get('/peminjaman', getPeminjaman);
router.post('/peminjaman', validate(createLoanSchema, 'body'), createPeminjaman);
router.delete('/peminjaman/:id', validate(loanIdParamSchema, 'params'), cancelPeminjaman);

// Rute alias (/api/books) untuk kompatibilitas
router.get('/books', getProduk);
router.get('/books/:id', validate(productIdParamSchema, 'params'), getProdukById);
router.post('/books', validate(createProductSchema, 'body'), createProduk);
router.put(
  '/books/:id',
  validate(productIdParamSchema, 'params'),
  validate(updateProductSchema, 'body'),
  updateProduk
);
router.delete('/books/:id', validate(productIdParamSchema, 'params'), deleteProduk);

export default router;
