/**
 * Model Data Log Peminjaman Buku (Pustaka LIM)
 * Sesuai arsitektur MVC - Folder models/
 * Mengelola data peminjaman buku berbasis database MySQL (Tabel peminjaman)
 */

import { pool } from '../config/db.js';
import { ProductModel } from './productModel.js';

export const LoanModel = {
  /**
   * Mengambil daftar buku yang sedang aktif dipinjam
   */
  getActiveLoans: async () => {
    const [rows] = await pool.query(`
      SELECT 
        pl.id,
        pl.kode,
        pl.produk_id,
        pl.peminjam_nama,
        pl.tanggal_pinjam AS startDate,
        pl.tanggal_kembali AS endDate,
        pl.sisa_waktu AS remainingDays,
        pl.status,
        pl.catatan,
        p.id AS bookId,
        p.kode AS bookKode,
        p.nama AS title,
        p.penulis AS author,
        p.cover_bg AS coverBg,
        k.nama AS category,
        (pl.status = 'Jatuh tempo') AS isOverdue
      FROM peminjaman pl
      JOIN produk p ON p.id = pl.produk_id
      LEFT JOIN kategori k ON k.id = p.kategori_id
      WHERE pl.status IN ('Sedang dipinjam', 'Jatuh tempo')
      ORDER BY pl.id DESC
    `);
    return rows;
  },

  /**
   * Mengambil riwayat peminjaman buku (Dikembalikan / Dibatalkan)
   */
  getLoanHistory: async () => {
    const [rows] = await pool.query(`
      SELECT 
        pl.id,
        pl.kode,
        pl.produk_id,
        pl.peminjam_nama,
        pl.tanggal_pinjam AS startDate,
        pl.tanggal_kembali AS endDate,
        pl.sisa_waktu AS remainingDays,
        pl.status,
        pl.catatan AS note,
        p.id AS bookId,
        p.nama AS title,
        p.penulis AS author,
        p.cover_bg AS coverBg,
        k.nama AS category
      FROM peminjaman pl
      JOIN produk p ON p.id = pl.produk_id
      LEFT JOIN kategori k ON k.id = p.kategori_id
      WHERE pl.status IN ('Dikembalikan', 'Dibatalkan')
      ORDER BY pl.id DESC
    `);
    return rows;
  },

  /**
   * Statistik jumlah pinjaman aktif & riwayat
   */
  getStats: async () => {
    const [activeRows] = await pool.query(`
      SELECT COUNT(*) as count FROM peminjaman WHERE status IN ('Sedang dipinjam', 'Jatuh tempo')
    `);
    const [histRows] = await pool.query(`
      SELECT COUNT(*) as count FROM peminjaman WHERE status IN ('Dikembalikan', 'Dibatalkan')
    `);

    return {
      activeCount: Number(activeRows[0]?.count || 0),
      historyCount: Number(histRows[0]?.count || 0)
    };
  },

  /**
   * CREATE: Tambah data peminjaman baru ke database
   */
  createLoan: async ({ bookId, startDate, endDate, peminjamNama = 'Naya Aulia' }) => {
    const book = await ProductModel.getById(bookId);
    if (!book) throw new Error('Buku tidak ditemukan.');
    if (book.status === 'Dipinjam') {
      throw new Error('Buku sedang tidak tersedia untuk dipinjam (sedang dipinjam pengguna lain).');
    }

    const [maxRows] = await pool.query('SELECT MAX(id) as maxId FROM peminjaman');
    const nextId = (maxRows[0]?.maxId || 0) + 1;
    const kode = `LOAN-${String(nextId).padStart(3, '0')}`;

    const [res] = await pool.query(`
      INSERT INTO peminjaman (kode, produk_id, peminjam_nama, tanggal_pinjam, tanggal_kembali, sisa_waktu, status, catatan)
      VALUES (?, ?, ?, ?, ?, '14 hari lagi', 'Sedang dipinjam', 'Peminjaman reguler')
    `, [kode, book.id, peminjamNama, startDate || 'Hari ini', endDate || '14 hari ke depan']);

    // Ubah status buku menjadi 'Dipinjam' di database
    await pool.query('UPDATE produk SET status = ? WHERE id = ?', ['Dipinjam', book.id]);

    return {
      id: res.insertId,
      kode,
      bookId: book.id,
      title: book.nama,
      author: book.penulis,
      status: 'Sedang dipinjam',
      startDate: startDate || 'Hari ini',
      endDate: endDate || '14 hari ke depan'
    };
  },

  /**
   * CANCEL / DELETE: Batalkan peminjaman dan kembalikan status ketersediaan buku
   */
  cancelLoan: async (loanId) => {
    const isNum = !isNaN(Number(loanId));
    const [rows] = await pool.query(
      `SELECT * FROM peminjaman WHERE ${isNum ? 'id = ? OR kode = ?' : 'kode = ?'} LIMIT 1`,
      isNum ? [Number(loanId), String(loanId)] : [String(loanId)]
    );

    if (rows.length === 0) return false;
    const loan = rows[0];

    // Update status peminjaman menjadi 'Dibatalkan'
    await pool.query(
      `UPDATE peminjaman SET status = 'Dibatalkan', catatan = 'Dibatalkan oleh pengguna' WHERE id = ?`,
      [loan.id]
    );

    // Kembalikan status buku di database menjadi 'Tersedia'
    await pool.query(
      `UPDATE produk SET status = 'Tersedia' WHERE id = ?`,
      [loan.produk_id]
    );

    return true;
  }
};

export default LoanModel;
