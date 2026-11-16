// Controller REST API CRUD murni Sequelize ORM
import { Op } from 'sequelize';
import { Produk, Kategori, Peminjaman } from '../models/index.js';
import { appConfig } from '../config/appConfig.js';
import { testDbConnection } from '../config/db.js';
import { formatTimestamp, formatUptime } from '../utils/helpers.js';

// Normalisasi data produk dari ORM ke format JSON yang konsisten
function formatProduct(item) {
  if (!item) return null;
  const raw = item.toJSON ? item.toJSON() : item;
  const kategoriNama = raw.kategoriRel?.nama || 'Umum';

  return {
    id: raw.id,
    kode: raw.kode || `BOK-${String(raw.id).padStart(3, '0')}`,
    nama: raw.nama,
    title: raw.nama,
    penulis: raw.penulis,
    author: raw.penulis,
    kategori_id: raw.kategori_id,
    kategori: kategoriNama,
    category: kategoriNama,
    status: raw.status || 'Tersedia',
    lokasi_rak: raw.lokasi_rak || 'Rak Umum',
    lokasiRak: raw.lokasi_rak || 'Rak Umum',
    tahun: Number(raw.tahun || 2024),
    cover_bg: raw.cover_bg || 'bg-slate-100',
    coverBg: raw.cover_bg || 'bg-slate-100',
    deskripsi: raw.deskripsi || '',
    description: raw.deskripsi || '',
    created_at: raw.createdAt || raw.created_at,
    updated_at: raw.updatedAt || raw.updated_at
  };
}

// GET /api/status - Status server, uptime, timestamp, dan koneksi database
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
      host: appConfig.db.host,
      dialect: 'postgres'
    },
    group: appConfig.groupInfo
  });
};

// 1. GET /api/produk - Mengambil daftar seluruh produk dengan filter
export const getProduk = async (req, res) => {
  try {
    const { search, kategori, category, status, wrap } = req.query;
    const filterCat = kategori || category;
    const whereConditions = [];

    // Filter berdasarkan kategori
    if (filterCat && filterCat !== 'Semua') {
      const isNum = !isNaN(Number(filterCat)) && Number(filterCat) > 0;
      if (isNum) {
        whereConditions.push({ kategori_id: Number(filterCat) });
      } else {
        whereConditions.push({ '$kategoriRel.nama$': filterCat });
      }
    }

    // Filter berdasarkan status ketersediaan
    if (status && status !== 'Semua') {
      whereConditions.push({ status });
    }

    // Filter pencarian teks
    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      whereConditions.push({
        [Op.or]: [
          { nama: { [Op.iLike]: q } },
          { penulis: { [Op.iLike]: q } },
          { kode: { [Op.iLike]: q } },
          { deskripsi: { [Op.iLike]: q } },
          { '$kategoriRel.nama$': { [Op.iLike]: q } }
        ]
      });
    }

    const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const items = await Produk.findAll({
      where: whereClause,
      include: [
        {
          model: Kategori,
          as: 'kategoriRel',
          attributes: ['id', 'nama', 'deskripsi']
        }
      ],
      order: [['id', 'ASC']]
    });

    const products = items.map(formatProduct);

    if (wrap === 'true') {
      return res.status(200).json({
        status: 'success',
        code: 200,
        total: products.length,
        data: products
      });
    }

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

// 2. GET /api/produk/:id - Mengambil detail satu data produk berdasarkan ID / Kode
export const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    const item = await Produk.findOne({
      where: isNum
        ? { [Op.or]: [{ id: Number(id) }, { kode: String(id) }] }
        : { kode: String(id) },
      include: [
        {
          model: Kategori,
          as: 'kategoriRel',
          attributes: ['id', 'nama', 'deskripsi']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Produk dengan ID/Kode '${id}' tidak ditemukan di database.`
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      data: formatProduct(item)
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

// 3. POST /api/produk - Menambahkan data produk baru ke database
export const createProduk = async (req, res) => {
  try {
    const data = req.body;
    const nama = (data.nama || data.title || '').trim();
    const penulis = (data.penulis || data.author || '').trim();
    let kategori_id = Number(data.kategori_id);

    // Cari atau buat kategori baru jika dikirim berupa nama
    if ((!kategori_id || isNaN(kategori_id)) && (data.kategori || data.category)) {
      const catName = (data.kategori || data.category).trim();
      const [catRecord] = await Kategori.findOrCreate({
        where: { nama: catName },
        defaults: { nama: catName, deskripsi: `Kategori ${catName}` }
      });
      kategori_id = catRecord.id;
    }

    if (!kategori_id || isNaN(kategori_id)) {
      kategori_id = 1;
    }

    const status = data.status || 'Tersedia';
    const lokasi_rak = data.lokasi_rak || data.lokasiRak || 'Rak Umum';
    const tahun = Number(data.tahun || 2024);
    const cover_bg = data.cover_bg || data.coverBg || 'bg-slate-100';
    const deskripsi = data.deskripsi || data.description || '';

    // Generate kode otomatis jika tidak disediakan
    let kode = (data.kode || '').trim();
    if (!kode) {
      const maxId = await Produk.max('id');
      const nextId = (Number(maxId) || 0) + 1;
      kode = `BOK-${String(nextId).padStart(3, '0')}`;
    }

    const created = await Produk.create({
      kode,
      nama,
      penulis,
      kategori_id,
      status,
      lokasi_rak,
      tahun,
      cover_bg,
      deskripsi
    });

    const fullProduct = await Produk.findByPk(created.id, {
      include: [
        {
          model: Kategori,
          as: 'kategoriRel',
          attributes: ['id', 'nama', 'deskripsi']
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Produk berhasil ditambahkan ke database.',
      data: formatProduct(fullProduct)
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

// 4. PUT /api/produk/:id - Memperbarui data produk berdasarkan ID / Kode
export const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    const item = await Produk.findOne({
      where: isNum
        ? { [Op.or]: [{ id: Number(id) }, { kode: String(id) }] }
        : { kode: String(id) }
    });

    if (!item) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Produk dengan ID/Kode '${id}' tidak ditemukan untuk diperbarui.`
      });
    }

    const data = req.body;
    const nama = data.nama !== undefined ? String(data.nama).trim() : (data.title !== undefined ? String(data.title).trim() : item.nama);
    const penulis = data.penulis !== undefined ? String(data.penulis).trim() : (data.author !== undefined ? String(data.author).trim() : item.penulis);

    let kategori_id = data.kategori_id !== undefined && !isNaN(Number(data.kategori_id))
      ? Number(data.kategori_id)
      : item.kategori_id;

    if (data.kategori || data.category) {
      const catName = (data.kategori || data.category).trim();
      const [catRecord] = await Kategori.findOrCreate({
        where: { nama: catName },
        defaults: { nama: catName, deskripsi: `Kategori ${catName}` }
      });
      kategori_id = catRecord.id;
    }

    const status = data.status !== undefined ? data.status : item.status;
    const lokasi_rak = data.lokasi_rak !== undefined ? data.lokasi_rak : (data.lokasiRak !== undefined ? data.lokasiRak : item.lokasi_rak);
    const tahun = data.tahun !== undefined && !isNaN(Number(data.tahun)) ? Number(data.tahun) : item.tahun;
    const deskripsi = data.deskripsi !== undefined ? data.deskripsi : (data.description !== undefined ? data.description : item.deskripsi);
    const cover_bg = data.cover_bg !== undefined ? data.cover_bg : (data.coverBg !== undefined ? data.coverBg : item.cover_bg);
    const kode = data.kode !== undefined && String(data.kode).trim() !== '' ? String(data.kode).trim() : item.kode;

    await item.update({
      kode,
      nama,
      penulis,
      kategori_id,
      status,
      lokasi_rak,
      tahun,
      cover_bg,
      deskripsi
    });

    const updated = await Produk.findByPk(item.id, {
      include: [
        {
          model: Kategori,
          as: 'kategoriRel',
          attributes: ['id', 'nama', 'deskripsi']
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Data produk berhasil diperbarui di database.',
      data: formatProduct(updated)
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

// 5. DELETE /api/produk/:id - Menghapus data produk berdasarkan ID / Kode
export const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    const item = await Produk.findOne({
      where: isNum
        ? { [Op.or]: [{ id: Number(id) }, { kode: String(id) }] }
        : { kode: String(id) }
    });

    if (!item) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Produk dengan ID/Kode '${id}' tidak ditemukan untuk dihapus.`
      });
    }

    const deletedData = { id: item.id, kode: item.kode, nama: item.nama };
    await item.destroy();

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Produk berhasil dihapus dari database.',
      data: deletedData
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

// GET /api/kategori - Mengambil daftar seluruh kategori
export const getKategori = async (req, res) => {
  try {
    const categories = await Kategori.findAll({
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      status: 'success',
      code: 200,
      data: categories.map(c => ({ id: c.id, nama: c.nama, deskripsi: c.deskripsi }))
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

// GET /api/peminjaman - Mengambil daftar log peminjaman aktif & riwayat
export const getPeminjaman = async (req, res) => {
  try {
    const activeRows = await Peminjaman.findAll({
      where: {
        status: {
          [Op.in]: ['Sedang dipinjam', 'Jatuh tempo']
        }
      },
      include: [
        {
          model: Produk,
          as: 'produkRel',
          include: [{ model: Kategori, as: 'kategoriRel', attributes: ['nama'] }]
        }
      ],
      order: [['id', 'DESC']]
    });

    const historyRows = await Peminjaman.findAll({
      where: {
        status: {
          [Op.in]: ['Dikembalikan', 'Dibatalkan']
        }
      },
      include: [
        {
          model: Produk,
          as: 'produkRel',
          include: [{ model: Kategori, as: 'kategoriRel', attributes: ['nama'] }]
        }
      ],
      order: [['id', 'DESC']]
    });

    const activeCount = await Peminjaman.count({
      where: { status: { [Op.in]: ['Sedang dipinjam', 'Jatuh tempo'] } }
    });
    const historyCount = await Peminjaman.count({
      where: { status: { [Op.in]: ['Dikembalikan', 'Dibatalkan'] } }
    });

    const mapLoan = (r) => {
      const p = r.produkRel || {};
      const cat = p.kategoriRel?.nama || 'Umum';
      return {
        id: r.id,
        kode: r.kode,
        produk_id: r.produk_id,
        peminjam_nama: r.peminjam_nama,
        startDate: r.tanggal_pinjam,
        endDate: r.tanggal_kembali,
        remainingDays: r.sisa_waktu,
        status: r.status,
        catatan: r.catatan,
        bookId: p.id,
        bookKode: p.kode,
        title: p.nama,
        author: p.penulis,
        coverBg: p.cover_bg,
        category: cat,
        isOverdue: r.status === 'Jatuh tempo'
      };
    };

    res.status(200).json({
      status: 'success',
      stats: { activeCount, historyCount },
      sedangDipinjam: activeRows.map(mapLoan),
      riwayat: historyRows.map(mapLoan)
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data peminjaman dari database.',
      error: err.message
    });
  }
};

// POST /api/peminjaman - Mencatat transaksi peminjaman baru
export const createPeminjaman = async (req, res) => {
  try {
    const { bookId, startDate, endDate, peminjamNama } = req.body;
    const isNum = !isNaN(Number(bookId));

    const book = await Produk.findOne({
      where: isNum
        ? { [Op.or]: [{ id: Number(bookId) }, { kode: String(bookId) }] }
        : { kode: String(bookId) }
    });

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Buku tidak ditemukan.'
      });
    }

    if (book.status === 'Dipinjam') {
      return res.status(400).json({
        status: 'error',
        message: 'Buku sedang tidak tersedia untuk dipinjam (sedang dipinjam pengguna lain).'
      });
    }

    const maxId = await Peminjaman.max('id');
    const nextId = (Number(maxId) || 0) + 1;
    const kode = `LOAN-${String(nextId).padStart(3, '0')}`;

    const newLoan = await Peminjaman.create({
      kode,
      produk_id: book.id,
      peminjam_nama: peminjamNama || 'Naya Aulia',
      tanggal_pinjam: startDate || 'Hari ini',
      tanggal_kembali: endDate || '14 hari ke depan',
      sisa_waktu: '14 hari lagi',
      status: 'Sedang dipinjam',
      catatan: 'Peminjaman reguler'
    });

    await book.update({ status: 'Dipinjam' });

    res.status(201).json({
      status: 'success',
      message: 'Buku berhasil dipinjam! Data dicatat ke database tabel peminjaman.',
      data: {
        id: newLoan.id,
        kode: newLoan.kode,
        bookId: book.id,
        title: book.nama,
        author: book.penulis,
        status: 'Sedang dipinjam',
        startDate: newLoan.tanggal_pinjam,
        endDate: newLoan.tanggal_kembali
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

// DELETE /api/peminjaman/:id - Membatalkan peminjaman dan mengembalikan ketersediaan buku
export const cancelPeminjaman = async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    const loan = await Peminjaman.findOne({
      where: isNum
        ? { [Op.or]: [{ id: Number(id) }, { kode: String(id) }] }
        : { kode: String(id) }
    });

    if (!loan) {
      return res.status(404).json({
        status: 'error',
        message: `Data peminjaman dengan ID '${id}' tidak ditemukan di database.`
      });
    }

    await loan.update({
      status: 'Dibatalkan',
      catatan: 'Dibatalkan oleh pengguna'
    });

    await Produk.update(
      { status: 'Tersedia' },
      { where: { id: loan.produk_id } }
    );

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

// Alias kompatibilitas
export const getBooks = getProduk;
export const createBook = createProduk;
export const updateBook = updateProduk;
export const deleteBook = deleteProduk;

export default {
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
  getBooks,
  createBook,
  updateBook,
  deleteBook
};
