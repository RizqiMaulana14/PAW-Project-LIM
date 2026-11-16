// Controller halaman frontend EJS murni Sequelize ORM
import { Op } from 'sequelize';
import { Produk, Kategori, Peminjaman } from '../models/index.js';
import { appConfig } from '../config/appConfig.js';

// Normalisasi data produk dari ORM ke format objek view
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
    lokasiRak: raw.lokasi_rak || 'Rak Umum',
    lokasi_rak: raw.lokasi_rak || 'Rak Umum',
    tahun: Number(raw.tahun || 2024),
    coverBg: raw.cover_bg || 'bg-slate-100',
    cover_bg: raw.cover_bg || 'bg-slate-100',
    deskripsi: raw.deskripsi || '',
    description: raw.deskripsi || '',
    created_at: raw.createdAt || raw.created_at,
    updated_at: raw.updatedAt || raw.updated_at
  };
}

// Query daftar produk dengan filter pencarian, kategori, dan status
async function fetchProducts(search = '', kategori = '', status = '') {
  const whereConditions = [];

  if (kategori && kategori !== 'Semua') {
    const isNum = !isNaN(Number(kategori)) && Number(kategori) > 0;
    if (isNum) {
      whereConditions.push({ kategori_id: Number(kategori) });
    } else {
      whereConditions.push({ '$kategoriRel.nama$': kategori });
    }
  }

  if (status && status !== 'Semua') {
    whereConditions.push({ status });
  }

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

  return items.map(formatProduct);
}

// Ringkasan statistik koleksi produk
async function fetchProductStats() {
  const total = await Produk.count();
  const available = await Produk.count({ where: { status: 'Tersedia' } });
  const borrowed = await Produk.count({ where: { status: 'Dipinjam' } });
  const categoriesCount = await Kategori.count();

  return {
    total: Number(total || 0),
    available: Number(available || 0),
    borrowed: Number(borrowed || 0),
    categoriesCount: Number(categoriesCount || 0)
  };
}

// Ringkasan statistik transaksi peminjaman
async function fetchLoanStats() {
  const activeCount = await Peminjaman.count({
    where: { status: { [Op.in]: ['Sedang dipinjam', 'Jatuh tempo'] } }
  });
  const historyCount = await Peminjaman.count({
    where: { status: { [Op.in]: ['Dikembalikan', 'Dibatalkan'] } }
  });

  return {
    activeCount: Number(activeCount || 0),
    historyCount: Number(historyCount || 0)
  };
}

// Halaman 1: Katalog Buku (Beranda)
export const getKatalog = async (req, res) => {
  try {
    const { search = '', kategori = '', status = '' } = req.query;

    const books = await fetchProducts(search, kategori, status);
    const stats = await fetchProductStats();
    const rawCategories = await Kategori.findAll({ order: [['id', 'ASC']] });
    const categories = ['Semua', ...rawCategories.map(c => c.nama)];
    const loanStats = await fetchLoanStats();

    res.render('katalog', {
      pageTitle: 'Katalog Buku - Pustaka LIM',
      currentRoute: 'katalog',
      appConfig,
      books,
      stats,
      categories,
      rawCategories: rawCategories.map(c => ({ id: c.id, nama: c.nama, deskripsi: c.deskripsi })),
      selectedCategory: kategori || 'Semua',
      query: search,
      loanStats
    });
  } catch (err) {
    console.error('Error saat merender halaman katalog:', err);
    res.status(500).render('katalog', {
      pageTitle: 'Katalog Buku - Pustaka LIM',
      currentRoute: 'katalog',
      appConfig,
      books: [],
      stats: { total: 0, available: 0, borrowed: 0, categoriesCount: 0 },
      categories: ['Semua'],
      rawCategories: [],
      selectedCategory: 'Semua',
      query: '',
      loanStats: { activeCount: 0, historyCount: 0 }
    });
  }
};

// Halaman 2: Jadwal & Form Peminjaman
export const getJadwalPinjam = async (req, res) => {
  try {
    const { id } = req.params;
    let book = null;

    if (id) {
      const isNum = !isNaN(Number(id));
      const record = await Produk.findOne({
        where: isNum
          ? { [Op.or]: [{ id: Number(id) }, { kode: String(id) }] }
          : { kode: String(id) },
        include: [{ model: Kategori, as: 'kategoriRel' }]
      });
      if (record) book = formatProduct(record);
    }

    if (!book) {
      const first = await Produk.findOne({
        include: [{ model: Kategori, as: 'kategoriRel' }],
        order: [['id', 'ASC']]
      });
      if (first) book = formatProduct(first);
    }

    const loanStats = await fetchLoanStats();

    res.render('jadwal', {
      pageTitle: book ? `Jadwal & Peminjaman - ${book.nama}` : 'Jadwal & Peminjaman',
      currentRoute: 'jadwal',
      appConfig,
      book,
      loanStats
    });
  } catch (err) {
    console.error('Error saat merender jadwal pinjam:', err);
    res.redirect('/katalog');
  }
};

// Halaman 3: Log Peminjaman
export const getLogPeminjaman = async (req, res) => {
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

    const loanStats = await fetchLoanStats();

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
        note: r.catatan,
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

    res.render('log', {
      pageTitle: 'Log Peminjaman - Pustaka LIM',
      currentRoute: 'log',
      appConfig,
      activeLoans: activeRows.map(mapLoan),
      loanHistory: historyRows.map(mapLoan),
      loanStats
    });
  } catch (err) {
    console.error('Error saat merender log peminjaman:', err);
    res.render('log', {
      pageTitle: 'Log Peminjaman - Pustaka LIM',
      currentRoute: 'log',
      appConfig,
      activeLoans: [],
      loanHistory: [],
      loanStats: { activeCount: 0, historyCount: 0 }
    });
  }
};

// Halaman 4: Panel Admin (Manajemen Produk & Sistem CRUD)
export const getAdminPanel = async (req, res) => {
  try {
    const { search = '', kategori = '', status = '' } = req.query;

    const books = await fetchProducts(search, kategori, status);
    const stats = await fetchProductStats();
    const rawCategories = await Kategori.findAll({ order: [['id', 'ASC']] });
    const categories = ['Semua', ...rawCategories.map(c => c.nama)];
    const loanStats = await fetchLoanStats();

    res.render('admin', {
      pageTitle: 'Panel Admin & Manajemen Produk - Pustaka LIM',
      currentRoute: 'admin',
      appConfig,
      books,
      stats,
      categories,
      rawCategories: rawCategories.map(c => ({ id: c.id, nama: c.nama, deskripsi: c.deskripsi })),
      selectedCategory: kategori || 'Semua',
      query: search,
      loanStats
    });
  } catch (err) {
    console.error('Error saat merender panel admin:', err);
    res.status(500).render('admin', {
      pageTitle: 'Panel Admin & Manajemen Produk - Pustaka LIM',
      currentRoute: 'admin',
      appConfig,
      books: [],
      stats: { total: 0, available: 0, borrowed: 0, categoriesCount: 0 },
      categories: ['Semua'],
      rawCategories: [],
      selectedCategory: 'Semua',
      query: '',
      loanStats: { activeCount: 0, historyCount: 0 }
    });
  }
};

export const getHome = getKatalog;

export default {
  getKatalog,
  getJadwalPinjam,
  getLogPeminjaman,
  getAdminPanel,
  getHome
};
