/**
 * Web Page Controller - Mengatur rendering halaman frontend EJS berbasis database
 * Sesuai arsitektur MVC - Folder controllers/
 */

import { ProductModel } from '../models/productModel.js';
import { LoanModel } from '../models/loanModel.js';
import { appConfig } from '../config/appConfig.js';

/**
 * Halaman 1: Katalog Buku (Beranda)
 */
export const getKatalog = async (req, res) => {
  try {
    const { search = '', kategori = '', status = '' } = req.query;

    const books = await ProductModel.getAll(search, kategori, status);
    const stats = await ProductModel.getStats();
    const categories = await ProductModel.getCategories();
    const rawCategories = await ProductModel.getRawCategories();
    const loanStats = await LoanModel.getStats();

    res.render('katalog', {
      pageTitle: 'Katalog Buku - Pustaka LIM',
      currentRoute: 'katalog',
      appConfig,
      books,
      stats,
      categories,
      rawCategories,
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

/**
 * Halaman 2: Jadwal & Form Peminjaman
 */
export const getJadwalPinjam = async (req, res) => {
  try {
    const { id } = req.params;
    let book = null;
    if (id) {
      book = await ProductModel.getById(id);
    }
    if (!book) {
      const all = await ProductModel.getAll();
      book = all[0] || null;
    }
    const loanStats = await LoanModel.getStats();

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

/**
 * Halaman 3: Log Peminjaman
 */
export const getLogPeminjaman = async (req, res) => {
  try {
    const activeLoans = await LoanModel.getActiveLoans();
    const loanHistory = await LoanModel.getLoanHistory();
    const loanStats = await LoanModel.getStats();

    res.render('log', {
      pageTitle: 'Log Peminjaman - Pustaka LIM',
      currentRoute: 'log',
      appConfig,
      activeLoans,
      loanHistory,
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

/**
 * Halaman 4: Panel Admin (Manajemen Produk & Sistem CRUD)
 */
export const getAdminPanel = async (req, res) => {
  try {
    const { search = '', kategori = '', status = '' } = req.query;

    const books = await ProductModel.getAll(search, kategori, status);
    const stats = await ProductModel.getStats();
    const categories = await ProductModel.getCategories();
    const rawCategories = await ProductModel.getRawCategories();
    const loanStats = await LoanModel.getStats();

    res.render('admin', {
      pageTitle: 'Panel Admin & Manajemen Produk - Pustaka LIM',
      currentRoute: 'admin',
      appConfig,
      books,
      stats,
      categories,
      rawCategories,
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
