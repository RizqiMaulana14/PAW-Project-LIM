/**
 * Model Data Produk / Buku Perpustakaan LIM (Pustaka)
 * Sesuai arsitektur MVC - Folder models/
 * Mengelola seluruh operasi database MySQL (Query, Insert, Update, Delete)
 */

import { pool } from '../config/db.js';

/**
 * Normalisasi data baris dari database agar kompatibel dengan seluruh frontend & API
 */
function normalizeProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    kode: row.kode || `BOK-${String(row.id).padStart(3, '0')}`,
    nama: row.nama,
    title: row.nama,
    penulis: row.penulis,
    author: row.penulis,
    kategori_id: row.kategori_id,
    kategori: row.kategori || 'Umum',
    category: row.kategori || 'Umum',
    status: row.status || 'Tersedia',
    lokasiRak: row.lokasi_rak || 'Rak Umum',
    lokasi_rak: row.lokasi_rak || 'Rak Umum',
    tahun: Number(row.tahun || 2024),
    coverBg: row.cover_bg || 'bg-slate-100',
    cover_bg: row.cover_bg || 'bg-slate-100',
    deskripsi: row.deskripsi || '',
    description: row.deskripsi || '',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export const ProductModel = {
  /**
   * READ: Mengambil seluruh data produk dari database dengan parameter pencarian & filter
   */
  getAll: async (query = '', category = '', statusFilter = '') => {
    let sql = `
      SELECT p.*, k.nama AS kategori
      FROM produk p
      LEFT JOIN kategori k ON k.id = p.kategori_id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'Semua') {
      sql += ` AND (k.nama = ? OR p.kategori_id = ?)`;
      params.push(category, Number(category) || 0);
    }

    if (statusFilter && statusFilter !== 'Semua') {
      sql += ` AND p.status = ?`;
      params.push(statusFilter);
    }

    if (query && query.trim() !== '') {
      const q = `%${query.trim()}%`;
      sql += ` AND (p.nama LIKE ? OR p.penulis LIKE ? OR p.kode LIKE ? OR p.deskripsi LIKE ? OR k.nama LIKE ?)`;
      params.push(q, q, q, q, q);
    }

    sql += ` ORDER BY p.id ASC`;

    const [rows] = await pool.query(sql, params);
    return rows.map(normalizeProductRow);
  },

  /**
   * READ: Mengambil detail satu produk berdasarkan ID atau Kode
   */
  getById: async (id) => {
    const isNum = !isNaN(Number(id));
    const sql = `
      SELECT p.*, k.nama AS kategori
      FROM produk p
      LEFT JOIN kategori k ON k.id = p.kategori_id
      WHERE ${isNum ? 'p.id = ? OR p.kode = ?' : 'p.kode = ?'}
      LIMIT 1
    `;
    const params = isNum ? [Number(id), String(id)] : [String(id)];
    const [rows] = await pool.query(sql, params);
    if (rows.length === 0) return null;
    return normalizeProductRow(rows[0]);
  },

  /**
   * CREATE: Menambahkan produk/buku baru ke dalam database
   */
  create: async (data) => {
    const nama = (data.nama || data.title || '').trim();
    const penulis = (data.penulis || data.author || '').trim();
    let kategori_id = Number(data.kategori_id);

    // Jika kategori dikirim berupa teks nama kategori
    if ((!kategori_id || isNaN(kategori_id)) && (data.kategori || data.category)) {
      const catName = data.kategori || data.category;
      const [catRows] = await pool.query('SELECT id FROM kategori WHERE nama = ? LIMIT 1', [catName]);
      if (catRows.length > 0) {
        kategori_id = catRows[0].id;
      } else {
        // Buat kategori baru otomatis jika belum ada
        const [newCat] = await pool.query('INSERT INTO kategori (nama) VALUES (?)', [catName]);
        kategori_id = newCat.insertId;
      }
    }

    // Default kategori ke 1 jika belum ditentukan
    if (!kategori_id || isNaN(kategori_id)) {
      kategori_id = 1;
    }

    const status = data.status || 'Tersedia';
    const lokasi_rak = data.lokasi_rak || data.lokasiRak || 'Rak Umum';
    const tahun = Number(data.tahun || 2024);
    const cover_bg = data.cover_bg || data.coverBg || 'bg-slate-100';
    const deskripsi = data.deskripsi || data.description || '';

    // Auto generate kode produk jika kosong (contoh: BOK-012)
    let kode = (data.kode || '').trim();
    if (!kode) {
      const [maxRows] = await pool.query('SELECT MAX(id) as maxId FROM produk');
      const nextId = (maxRows[0]?.maxId || 0) + 1;
      kode = `BOK-${String(nextId).padStart(3, '0')}`;
    }

    const [result] = await pool.query(`
      INSERT INTO produk (kode, nama, penulis, kategori_id, status, lokasi_rak, tahun, cover_bg, deskripsi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [kode, nama, penulis, kategori_id, status, lokasi_rak, tahun, cover_bg, deskripsi]);

    return ProductModel.getById(result.insertId);
  },

  /**
   * UPDATE: Memperbarui data produk berdasarkan ID atau Kode
   */
  update: async (id, data) => {
    const existing = await ProductModel.getById(id);
    if (!existing) return null;

    const nama = (data.nama || data.title || existing.nama).trim();
    const penulis = (data.penulis || data.author || existing.penulis).trim();
    
    let kategori_id = data.kategori_id ? Number(data.kategori_id) : existing.kategori_id;
    if (data.kategori || data.category) {
      const catName = data.kategori || data.category;
      const [catRows] = await pool.query('SELECT id FROM kategori WHERE nama = ? LIMIT 1', [catName]);
      if (catRows.length > 0) kategori_id = catRows[0].id;
    }

    const status = data.status || existing.status || 'Tersedia';
    const lokasi_rak = data.lokasi_rak || data.lokasiRak || existing.lokasi_rak;
    const tahun = data.tahun !== undefined ? Number(data.tahun) : existing.tahun;
    const deskripsi = data.deskripsi !== undefined ? data.deskripsi : (data.description !== undefined ? data.description : existing.deskripsi);
    const cover_bg = data.cover_bg || data.coverBg || existing.cover_bg;
    const kode = (data.kode || existing.kode).trim();

    await pool.query(`
      UPDATE produk
      SET kode = ?, nama = ?, penulis = ?, kategori_id = ?, status = ?, lokasi_rak = ?, tahun = ?, cover_bg = ?, deskripsi = ?
      WHERE id = ?
    `, [kode, nama, penulis, kategori_id, status, lokasi_rak, tahun, cover_bg, deskripsi, existing.id]);

    return ProductModel.getById(existing.id);
  },

  /**
   * DELETE: Menghapus data produk berdasarkan ID atau Kode
   */
  delete: async (id) => {
    const existing = await ProductModel.getById(id);
    if (!existing) return null;

    await pool.query('DELETE FROM produk WHERE id = ?', [existing.id]);
    return existing;
  },

  /**
   * STATS: Ringkasan total koleksi untuk dashboard & counter
   */
  getStats: async () => {
    const [statRows] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Tersedia' THEN 1 ELSE 0 END) AS available,
        SUM(CASE WHEN status = 'Dipinjam' THEN 1 ELSE 0 END) AS borrowed
      FROM produk
    `);
    const [catRows] = await pool.query('SELECT COUNT(*) AS catCount FROM kategori');

    return {
      total: Number(statRows[0]?.total || 0),
      available: Number(statRows[0]?.available || 0),
      borrowed: Number(statRows[0]?.borrowed || 0),
      categoriesCount: Number(catRows[0]?.catCount || 0)
    };
  },

  /**
   * CATEGORIES: Mengambil daftar kategori unik
   */
  getCategories: async () => {
    const [rows] = await pool.query('SELECT id, nama, deskripsi FROM kategori ORDER BY id ASC');
    return ['Semua', ...rows.map(r => r.nama)];
  },

  /**
   * Raw Categories List with ID
   */
  getRawCategories: async () => {
    const [rows] = await pool.query('SELECT id, nama, deskripsi FROM kategori ORDER BY id ASC');
    return rows;
  }
};

export default ProductModel;
