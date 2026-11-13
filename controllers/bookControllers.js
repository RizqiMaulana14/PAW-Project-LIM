/**
 * Book Controller (kompatibilitas dengan alias)
 * Menggunakan model database terpusat di models/productModel.js
 */

export {
  getProduk as getBooks,
  getProdukById as getBookById,
  createProduk as createBook,
  updateProduk as updateBook,
  deleteProduk as deleteBook,
  getStatus,
  getPeminjaman,
  createPeminjaman,
  cancelPeminjaman
} from './apiControllers.js';
