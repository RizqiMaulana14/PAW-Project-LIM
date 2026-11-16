// Re-ekspor fungsi controller produk untuk alias rute buku
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
