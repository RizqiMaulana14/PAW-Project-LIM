// Inisialisasi relasi asosiasi antar-model dan fungsi sinkronisasi database
import { sequelize } from '../config/db.js';
import { Kategori } from './kategori.js';
import { Produk } from './produk.js';
import { Peminjaman } from './peminjaman.js';

// Relasi Kategori <-> Produk
Kategori.hasMany(Produk, {
  foreignKey: 'kategori_id',
  as: 'produkList',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Produk.belongsTo(Kategori, {
  foreignKey: 'kategori_id',
  as: 'kategoriRel',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Relasi Produk <-> Peminjaman
Produk.hasMany(Peminjaman, {
  foreignKey: 'produk_id',
  as: 'peminjamanList',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Peminjaman.belongsTo(Produk, {
  foreignKey: 'produk_id',
  as: 'produkRel',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Data awal (Seed Data) untuk PostgreSQL
const initialCategories = [
  { id: 1, nama: 'Fiksi Historis', deskripsi: 'Karya fiksi yang berlatar peristiwa sejarah nyata' },
  { id: 2, nama: 'Pengembangan Diri', deskripsi: 'Buku peningkatan kualitas hidup dan kebiasaan positif' },
  { id: 3, nama: 'Sastra Indonesia', deskripsi: 'Karya sastra kanon dan kontemporer sastrawan Indonesia' },
  { id: 4, nama: 'Fiksi', deskripsi: 'Novel dan cerita fiksi umum' },
  { id: 5, nama: 'Sejarah', deskripsi: 'Catatan evolusi dan peradaban manusia serta bangsa' },
  { id: 6, nama: 'Teknologi Informasi', deskripsi: 'Buku arsitektur perangkat lunak, pemrograman, dan sistem' },
  { id: 7, nama: 'Kecerdasan Buatan', deskripsi: 'Machine Learning, Deep Learning, dan pemrosesan data' },
  { id: 8, nama: 'Ilmu Komunikasi', deskripsi: 'Psikologi komunikasi, organisasi, dan interaksi manusia' }
];

const initialProducts = [
  {
    id: 1,
    kode: 'BOK-001',
    nama: 'Laut Bercerita',
    penulis: 'Leila S. Chudori',
    kategori_id: 1,
    status: 'Tersedia',
    lokasi_rak: 'Rak Fiksi-01',
    tahun: 2017,
    cover_bg: 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700',
    deskripsi: 'Mengisahkan perjuangan para aktivis mahasiswa era 1998 yang diculik dan disiksa, serta keluarga korban yang tidak pernah berhenti mencari kepastian nasib anak-anak mereka.'
  },
  {
    id: 2,
    kode: 'BOK-002',
    nama: 'Filosofi Teras',
    penulis: 'Henry Manampiring',
    kategori_id: 2,
    status: 'Tersedia',
    lokasi_rak: 'Rak PD-02',
    tahun: 2019,
    cover_bg: 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900',
    deskripsi: 'Penerapan filsafat Yunani-Romawi kuno (Stoisisme) untuk mengatasi emosi negatif dan mental tangguh dalam menghadapi ujian kehidupan modern.'
  },
  {
    id: 3,
    kode: 'BOK-003',
    nama: 'Atomic Habits',
    penulis: 'James Clear',
    kategori_id: 2,
    status: 'Dipinjam',
    lokasi_rak: 'Rak PD-01',
    tahun: 2018,
    cover_bg: 'bg-gradient-to-br from-stone-200 to-stone-300 text-stone-800',
    deskripsi: 'Perubahan sangat kecil yang memberikan hasil luar biasa. Cara mudah dan terbukti untuk membentuk kebiasaan baik dan menghilangkan kebiasaan buruk.'
  },
  {
    id: 4,
    kode: 'BOK-004',
    nama: 'Bumi Manusia',
    penulis: 'Pramoedya Ananta Toer',
    kategori_id: 3,
    status: 'Tersedia',
    lokasi_rak: 'Rak Sastra-01',
    tahun: 1980,
    cover_bg: 'bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-900',
    deskripsi: 'Roman sejarah kebangkitan nasional awal abad ke-20 yang menceritakan pemuda pribumi Minke dan perjuangan Nyai Ontosoroh melawan hegemoni hukum kolonial Belanda.'
  },
  {
    id: 5,
    kode: 'BOK-005',
    nama: 'Pulang',
    penulis: 'Tere Liye',
    kategori_id: 4,
    status: 'Tersedia',
    lokasi_rak: 'Rak Fiksi-02',
    tahun: 2015,
    cover_bg: 'bg-gradient-to-br from-sky-100 to-blue-200 text-sky-900',
    deskripsi: 'Sebuah novel tentang perjalanan pulang melalui pertarungan demi pertarungan, memeluk rasa takut, dan menemukan hakikat pengampunan dan kedamaian sejati.'
  },
  {
    id: 6,
    kode: 'BOK-006',
    nama: 'Sapiens: Riwayat Singkat Umat Manusia',
    penulis: 'Yuval Noah Harari',
    kategori_id: 5,
    status: 'Tersedia',
    lokasi_rak: 'Rak Sejarah-01',
    tahun: 2014,
    cover_bg: 'bg-gradient-to-br from-orange-100 to-amber-200 text-orange-900',
    deskripsi: 'Penjelajahan komprehensif sejarah umat manusia sejak evolusi kera purba di Afrika Timur hingga era revolusi kognitif, pertanian, dan sains kontemporer.'
  },
  {
    id: 7,
    kode: 'BOK-007',
    nama: 'Negeri 5 Menara',
    penulis: 'Ahmad Fuadi',
    kategori_id: 4,
    status: 'Tersedia',
    lokasi_rak: 'Rak Fiksi-03',
    tahun: 2009,
    cover_bg: 'bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-900',
    deskripsi: 'Kisah enam santri dari berbagai pelosok nusantara di Pondok Madani yang disatukan oleh impian besar di bawah menara masjid dengan mantra Man Jadda Wajada.'
  },
  {
    id: 8,
    kode: 'BOK-008',
    nama: 'Pemrograman Multiplatform dengan Flutter dan Dart',
    penulis: 'Rizqi Maulana Fitrah',
    kategori_id: 6,
    status: 'Tersedia',
    lokasi_rak: 'Rak TI-01',
    tahun: 2024,
    cover_bg: 'bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-900',
    deskripsi: 'Buku panduan lengkap membangun aplikasi mobile Android dan iOS dari satu basis kode.'
  },
  {
    id: 9,
    kode: 'BOK-009',
    nama: 'Kecerdasan Buatan & Machine Learning Modern',
    penulis: 'Muhammad Rasyid Ridha',
    kategori_id: 7,
    status: 'Tersedia',
    lokasi_rak: 'Rak AI-02',
    tahun: 2023,
    cover_bg: 'bg-gradient-to-br from-violet-100 to-fuchsia-200 text-violet-900',
    deskripsi: 'Konsep dasar hingga implementasi algoritma Deep Learning dan NLP menggunakan Python.'
  },
  {
    id: 10,
    kode: 'BOK-010',
    nama: 'Psikologi Komunikasi dalam Organisasi Modern',
    penulis: 'Rizki Fadhil Budiastanto',
    kategori_id: 8,
    status: 'Tersedia',
    lokasi_rak: 'Rak IK-01',
    tahun: 2023,
    cover_bg: 'bg-gradient-to-br from-rose-100 to-pink-200 text-rose-900',
    deskripsi: 'Memahami dinamika komunikasi antarmanusia, kepemimpinan, dan penyelesaian konflik.'
  },
  {
    id: 11,
    kode: 'BOK-011',
    nama: 'Arsitektur Software Modern & Microservices',
    penulis: 'Akhmad Rezky Utama',
    kategori_id: 6,
    status: 'Tersedia',
    lokasi_rak: 'Rak TI-03',
    tahun: 2024,
    cover_bg: 'bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-900',
    deskripsi: 'Panduan merancang sistem backend yang scalable, distributed tracing, dan container orchestration.'
  }
];

const initialLoans = [
  {
    id: 1,
    kode: 'LOAN-001',
    produk_id: 1,
    peminjam_nama: 'Naya Aulia',
    tanggal_pinjam: '12 Juni 2025',
    tanggal_kembali: '19 Juni 2025',
    sisa_waktu: '4 hari lagi',
    status: 'Sedang dipinjam',
    catatan: 'Peminjaman reguler mahasiswa'
  },
  {
    id: 2,
    kode: 'LOAN-002',
    produk_id: 3,
    peminjam_nama: 'Naya Aulia',
    tanggal_pinjam: '08 Juni 2025',
    tanggal_kembali: '15 Juni 2025',
    sisa_waktu: 'Jatuh tempo hari ini',
    status: 'Jatuh tempo',
    catatan: 'Batas akhir pengembalian hari ini'
  },
  {
    id: 3,
    kode: 'LOAN-003',
    produk_id: 4,
    peminjam_nama: 'Naya Aulia',
    tanggal_pinjam: '01 Juni 2025',
    tanggal_kembali: '08 Juni 2025',
    sisa_waktu: 'Selesai',
    status: 'Dikembalikan',
    catatan: 'Dikembalikan tepat waktu'
  }
];

// Sinkronisasi skema database dan seeding otomatis
export async function syncDatabase() {
  try {
    // Sinkronisasi skema tabel ke PostgreSQL
    await sequelize.sync();

    // Auto-seed Kategori jika tabel masih kosong
    const countCategories = await Kategori.count();
    if (countCategories === 0) {
      await Kategori.bulkCreate(initialCategories);
      // Reset sequence id untuk PostgreSQL
      await sequelize.query(`SELECT setval(pg_get_serial_sequence('kategori', 'id'), COALESCE(MAX(id), 1)) FROM kategori;`);
    }

    // Auto-seed Produk jika tabel masih kosong
    const countProducts = await Produk.count();
    if (countProducts === 0) {
      await Produk.bulkCreate(initialProducts);
      // Reset sequence id untuk PostgreSQL
      await sequelize.query(`SELECT setval(pg_get_serial_sequence('produk', 'id'), COALESCE(MAX(id), 1)) FROM produk;`);
    }

    // Auto-seed Peminjaman jika tabel masih kosong
    const countLoans = await Peminjaman.count();
    if (countLoans === 0) {
      await Peminjaman.bulkCreate(initialLoans);
      // Reset sequence id untuk PostgreSQL
      await sequelize.query(`SELECT setval(pg_get_serial_sequence('peminjaman', 'id'), COALESCE(MAX(id), 1)) FROM peminjaman;`);
    }

    return { success: true, message: 'Database PostgreSQL tersinkronisasi dan di-seed dengan sukses.' };
  } catch (err) {
    console.error('Peringatan saat sinkronisasi database:', err.message);
    return { success: false, error: err.message };
  }
}

export {
  sequelize,
  Kategori,
  Produk,
  Peminjaman
};

export default {
  sequelize,
  Kategori,
  Produk,
  Peminjaman,
  syncDatabase
};
