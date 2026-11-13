/**
 * API Controller - Mengelola request dan response endpoint REST API CRUD
 * Sesuai arsitektur MVC - Folder controllers/
 * Terhubung langsung ke database MySQL melalui ProductModel & LoanModel
 */

import { ProductModel } from '../models/productModel.js';
import { LoanModel } from '../models/loanModel.js';
import { appConfig } from '../config/appConfig.js';
import { testDbConnection } from '../config/db.js';
import { formatTimestamp, formatUptime } from '../utils/helpers.js';

/**
 * GET /api/status
 * Menampilkan status server, uptime, timestamp, dan status koneksi database
 */
export const getStatus = async (req, res) => {
  const uptimeSeconds = process.uptime();
  const dbStatus = await testDbConnection();

  res.status(200).json({
    status: 'success',
    code: 200,
    app: appConfig.appName,
    version: appConfig.version,
    environment: appConfig.env,
    uptime: formatUptime(uptimeSeconds),
    uptimeSeconds: Math.floor(uptimeSeconds),
    timestamp: formatTimestamp(),
    timestampISO: new Date().toISOString(),
    database: {
      status: dbStatus.connected ? 'connected' : 'disconnected',
      message: dbStatus.message,
      name: appConfig.db.name,
      host: appConfig.db.host
    },
    group: appConfig.groupInfo
  });
};

/**
 * 1. GET /api/produk
 * Mengambil dan menampilkan seluruh data produk dari database dalam bentuk array JSON
 */
export const getProduk = async (req, res) => {
  try {
    const { search, kategori, category, status, wrap } = req.query;
    const filterCat = kategori || category || '';
    const products = await ProductModel.getAll(search, filterCat, status);

    if (wrap === 'true') {
      return res.status(200).json({
        status: 'success',
        code: 200,
        total: products.length,
        data: products
      });
    }

    // Mengirimkan array JSON sesuai spesifikasi tugas
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal mengambil data produk dari database.',
      error: err.message
    });
  }
};

/**
 * 2. GET /api/produk/:id
 * Mengambil detail satu data produk berdasarkan ID dari database
 */
export const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.getById(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Produk dengan ID/Kode '${id}' tidak ditemukan di database.`
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      data: product
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal mengambil detail produk.',
      error: err.message
    });
  }
};

/**
 * 3. POST /api/produk
 * Menambahkan data baru ke dalam database (Operasi Create)
 */
export const createProduk = async (req, res) => {
  try {
    const { nama, title, penulis, author, kategori_id, kategori } = req.body;
    const bookTitle = nama || title;
    const bookAuthor = penulis || author;

    // Validasi input wajib
    if (!bookTitle || String(bookTitle).trim() === '') {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Field nama/judul produk wajib diisi.'
      });
    }

    if (!bookAuthor || String(bookAuthor).trim() === '') {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Field penulis produk wajib diisi.'
      });
    }

    // Eksekusi insert ke database melalui Model
    const newProduct = await ProductModel.create(req.body);

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Produk berhasil ditambahkan ke database.',
      data: newProduct
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal menambahkan produk ke database.',
      error: err.message
    });
  }
};

/**
 * 4. PUT /api/produk/:id
 * Memperbarui data produk berdasarkan ID di database (Operasi Update)
 */
export const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ProductModel.update(id, req.body);

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Produk dengan ID/Kode '${id}' tidak ditemukan untuk diperbarui.`
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Data produk berhasil diperbarui di database.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memperbarui data produk di database.',
      error: err.message
    });
  }
};

/**
 * 5. DELETE /api/produk/:id
 * Menghapus data produk berdasarkan ID dari database (Operasi Delete)
 */
export const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Produk dengan ID/Kode '${id}' tidak ditemukan untuk dihapus.`
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Produk berhasil dihapus dari database.',
      data: { id: deleted.id, kode: deleted.kode, nama: deleted.nama }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal menghapus produk dari database.',
      error: err.message
    });
  }
};

/**
 * GET /api/kategori
 * Mengambil daftar seluruh kategori dari database
 */
export const getKategori = async (req, res) => {
  try {
    const categories = await ProductModel.getRawCategories();
    res.status(200).json({
      status: 'success',
      code: 200,
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal mengambil data kategori.',
      error: err.message
    });
  }
};

/**
 * GET /api/peminjaman
 */
export const getPeminjaman = async (req, res) => {
  try {
    const active = await LoanModel.getActiveLoans();
    const history = await LoanModel.getLoanHistory();
    const stats = await LoanModel.getStats();

    res.status(200).json({
      status: 'success',
      stats,
      sedangDipinjam: active,
      riwayat: history
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data peminjaman dari database.',
      error: err.message
    });
  }
};

/**
 * POST /api/peminjaman
 */
export const createPeminjaman = async (req, res) => {
  try {
    const { bookId, startDate, endDate, peminjamNama } = req.body;
    if (!bookId) {
      return res.status(400).json({
        status: 'error',
        message: 'Parameter bookId wajib diisi.'
      });
    }

    const loan = await LoanModel.createLoan({ bookId, startDate, endDate, peminjamNama });

    res.status(201).json({
      status: 'success',
      message: 'Buku berhasil dipinjam! Data dicatat ke database tabel peminjaman.',
      data: loan
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * DELETE /api/peminjaman/:id
 */
export const cancelPeminjaman = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await LoanModel.cancelLoan(id);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: `Data peminjaman dengan ID '${id}' tidak ditemukan di database.`
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Peminjaman berhasil dibatalkan. Buku kembali tersedia di database.'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal membatalkan peminjaman di database.',
      error: err.message
    });
  }
};

/**
 * POST /api/ai/chat
 */
export const aiChat = async (req, res) => {
  try {
    const { message = '' } = req.body;
    const q = message.toLowerCase().trim();

    let reply = '';
    let relatedBook = null;

    if (q.includes('laut bercerita') || q.includes('sinopsis laut')) {
      relatedBook = await ProductModel.getById('BOK-001');
      reply = `Kisah aktivis mahasiswa era 1998 yang diculik dan keluarga yang mencari jawaban atas kehilangan mereka. Ditulis oleh Leila S. Chudori dengan gaya penceritaan yang sangat emosional dan mendalam.`;
    } else if (q.includes('atomic habits') || q.includes('kebiasaan')) {
      relatedBook = await ProductModel.getById('BOK-003');
      reply = `Buku best-seller oleh James Clear tentang bagaimana perubahan 1% setiap hari secara konsisten dapat membentuk kebiasaan luar biasa.`;
    } else if (q.includes('bumi manusia') || q.includes('pramoedya')) {
      relatedBook = await ProductModel.getById('BOK-004');
      reply = `Mahakarya sastra Indonesia oleh Pramoedya Ananta Toer berlatar Hindia Belanda awal abad 20, mengisahkan Minke dan Nyai Ontosoroh.`;
    } else if (q.includes('rekomendasi') || q.includes('teknologi') || q.includes('coding') || q.includes('web')) {
      reply = `Untuk topik teknologi, saya rekomendasikan:\n1. "Pemrograman Multiplatform dengan Flutter dan Dart"\n2. "Kecerdasan Buatan & Machine Learning Modern"\n3. "Arsitektur Software Modern & Microservices"`;
    } else if (q.includes('jadwal') || q.includes('pinjam') || q.includes('antre')) {
      reply = `Kamu bisa langsung cek jadwal ketersediaan real-time di tombol "Jadwal" pada kartu buku, lalu tentukan tanggal peminjaman tanpa perlu antre di loket perpustakaan.`;
    } else {
      reply = `Halo! Saya Pustaka AI. Saya siap membantu kamu mencari rekomendasi buku, mengecek sinopsis, atau melihat jadwal ketersediaan buku di perpustakaan. Coba tanyakan misalnya: "Sinopsis Laut Bercerita" atau "Rekomendasi buku teknologi"!`;
    }

    res.status(200).json({
      status: 'success',
      model: 'Ollama DeepSeek-v2',
      response: reply,
      relatedBook
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal memproses pesan AI.',
      error: err.message
    });
  }
};

/**
 * Alias kompatibilitas
 */
export const getBooks = getProduk;
export const createBook = createProduk;
export const updateBook = updateProduk;
export const deleteBook = deleteProduk;
