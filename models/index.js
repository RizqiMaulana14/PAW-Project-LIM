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

const initialCategories = [
  { id: 1, nama: 'Action & Adventure', tipe: 'Fiksi', deskripsi: 'Fokus utamanya adalah risiko fisik dan perjalanan berbahaya; karakter utama biasanya harus menyelesaikan misi hidup-mati' },
  { id: 2, nama: 'Alternative History', tipe: 'Fiksi', deskripsi: 'Menjawab pertanyaan "Bagaimana jika?" tentang sejarah, misalnya jika Jerman memenangkan Perang Dunia II' },
  { id: 3, nama: 'Anthology', tipe: 'Fiksi', deskripsi: 'Kumpulan karya pendek (cerpen/puisi) dari berbagai penulis dalam satu tema' },
  { id: 4, nama: 'Bildungsroman', tipe: 'Fiksi', deskripsi: 'Kisah coming-of-age yang berfokus pada transisi psikologis dan moral dari remaja menuju dewasa' },
  { id: 5, nama: 'Chick Lit', tipe: 'Fiksi', deskripsi: 'Fiksi modern tentang isu wanita urban, karier, dan percintaan dengan nada humoris dan ringan' },
  { id: 6, nama: 'Children\'s Fiction', tipe: 'Fiksi', deskripsi: 'Buku untuk pembaca anak-anak, seringkali dengan ilustrasi (novel awal, bukan picture book)' },
  { id: 7, nama: 'Classic', tipe: 'Fiksi', deskripsi: 'Karya yang telah melampaui ujian waktu dan dianggap memiliki nilai artistik universal' },
  { id: 8, nama: 'Cli-Fi (Climate Fiction)', tipe: 'Fiksi', deskripsi: 'Fiksi yang berspekulasi tentang dampak perubahan iklim ekstrem terhadap masyarakat' },
  { id: 9, nama: 'Contemporary Fiction', tipe: 'Fiksi', deskripsi: 'Cerita realistis yang terjadi di masa sekarang (pasca Perang Dunia II hingga hari ini)' },
  { id: 10, nama: 'Crime', tipe: 'Fiksi', deskripsi: 'Fokus pada tindakan kriminal, investigasi, dan motif pelaku' },
  { id: 11, nama: 'Cyberpunk', tipe: 'Fiksi', deskripsi: 'Sub-genre sci-fi "High Tech, Low Life": teknologi canggih di tengah masyarakat yang bobrok moralnya' },
  { id: 12, nama: 'Drama', tipe: 'Fiksi', deskripsi: 'Karya yang sangat fokus pada konflik emosional mendalam antar karakter' },
  { id: 13, nama: 'Dystopian', tipe: 'Fiksi', deskripsi: 'Kebalikan utopia: masyarakat masa depan yang menakutkan, biasanya di bawah rezim totaliter' },
  { id: 14, nama: 'Epic Fantasy (High Fantasy)', tipe: 'Fiksi', deskripsi: 'Cerita berskala besar dengan dunia rekaan total dan sistem sihir yang kompleks' },
  { id: 15, nama: 'Fable', tipe: 'Fiksi', deskripsi: 'Cerita pendek dengan hewan yang berperilaku seperti manusia untuk menyampaikan pesan moral' },
  { id: 16, nama: 'Fairy Tale', tipe: 'Fiksi', deskripsi: 'Cerita rakyat yang melibatkan sihir, makhluk ajaib, dan latar waktu yang tidak spesifik' },
  { id: 17, nama: 'Fan Fiction', tipe: 'Fiksi', deskripsi: 'Cerita yang ditulis penggemar menggunakan karakter atau dunia dari karya orang lain' },
  { id: 18, nama: 'Fantasy', tipe: 'Fiksi', deskripsi: 'Genre payung untuk segala cerita yang melibatkan elemen supranatural atau sihir' },
  { id: 19, nama: 'Folklore', tipe: 'Fiksi', deskripsi: 'Legenda atau cerita tradisional yang diturunkan secara lisan dalam suatu budaya' },
  { id: 20, nama: 'Graphic Novel', tipe: 'Fiksi', deskripsi: 'Cerita panjang lewat seni sekuensial (komik) dengan plot kompleks layaknya novel' },
  { id: 21, nama: 'Historical Fiction', tipe: 'Fiksi', deskripsi: 'Fiksi yang berlatar masa lalu yang spesifik, dengan detail periode yang akurat' },
  { id: 22, nama: 'Historical Romance', tipe: 'Fiksi', deskripsi: 'Kisah cinta yang terjadi di masa lalu, misalnya era Regency atau Victorian' },
  { id: 23, nama: 'Horror', tipe: 'Fiksi', deskripsi: 'Dirancang khusus untuk memicu rasa takut, jijik, atau ngeri pada pembaca' },
  { id: 24, nama: 'Literary Fiction', tipe: 'Fiksi', deskripsi: 'Mengutamakan gaya bahasa, simbolisme, dan kedalaman karakter daripada plot yang cepat' },
  { id: 25, nama: 'Magical Realism', tipe: 'Fiksi', deskripsi: 'Dunia nyata yang normal, namun kejadian magis dianggap hal biasa' },
  { id: 26, nama: 'Manga', tipe: 'Fiksi', deskripsi: 'Novel grafis gaya Jepang (sebenarnya format, namun sering dianggap genre)' },
  { id: 27, nama: 'Metafiction', tipe: 'Fiksi', deskripsi: 'Fiksi yang sadar bahwa dirinya fiksi; penulis mungkin memecahkan dinding keempat' },
  { id: 28, nama: 'Mystery', tipe: 'Fiksi', deskripsi: 'Fokus pada teka-teki "Siapa pelakunya?" (whodunnit)' },
  { id: 29, nama: 'Noir', tipe: 'Fiksi', deskripsi: 'Sub-genre kriminal dengan protagonis sinis, latar kota gelap, dan moralitas abu-abu' },
  { id: 30, nama: 'Paranormal Romance', tipe: 'Fiksi', deskripsi: 'Kisah cinta antara manusia dan makhluk supranatural seperti vampir, werewolf, atau hantu' },
  { id: 31, nama: 'Picture Book', tipe: 'Fiksi', deskripsi: 'Buku yang mengandalkan gambar untuk bercerita, biasanya untuk balita' },
  { id: 32, nama: 'Poetry (Puisi)', tipe: 'Fiksi', deskripsi: 'Ekspresi perasaan dan ide melalui gaya bahasa yang khas, rima, dan ritme' },
  { id: 33, nama: 'Political Thriller', tipe: 'Fiksi', deskripsi: 'Ketegangan yang dibangun di atas perebutan kekuasaan politik dan intrik negara' },
  { id: 34, nama: 'Post-Apocalyptic', tipe: 'Fiksi', deskripsi: 'Cerita berlatar setelah hancurnya peradaban dunia, misalnya akibat perang nuklir atau wabah' },
  { id: 35, nama: 'Realistic Fiction', tipe: 'Fiksi', deskripsi: 'Cerita yang sangat mungkin terjadi di dunia nyata, tanpa elemen fantasi' },
  { id: 36, nama: 'Romance', tipe: 'Fiksi', deskripsi: 'Berfokus pada hubungan romantis dan biasanya berakhir bahagia (HEA)' },
  { id: 37, nama: 'Romantasy', tipe: 'Fiksi', deskripsi: 'Gabungan romance dan fantasy dengan porsi kisah cinta yang dominan' },
  { id: 38, nama: 'Satire', tipe: 'Fiksi', deskripsi: 'Menggunakan humor, ironi, atau lelucon untuk mengkritik kebodohan manusia atau kebijakan politik' },
  { id: 39, nama: 'Science Fiction (Sci-Fi)', tipe: 'Fiksi', deskripsi: 'Spekulasi berdasarkan sains dan teknologi: masa depan, luar angkasa, robot' },
  { id: 40, nama: 'Short Story', tipe: 'Fiksi', deskripsi: 'Prosa naratif yang lebih pendek dari novel, biasanya fokus pada satu insiden' },
  { id: 41, nama: 'Space Opera', tipe: 'Fiksi', deskripsi: 'Petualangan epik di luar angkasa, seringkali melodramatis dengan perang antar galaksi' },
  { id: 42, nama: 'Speculative Fiction', tipe: 'Fiksi', deskripsi: 'Istilah payung untuk cerita yang bertanya "Bagaimana jika?" (sci-fi, fantasi, horor)' },
  { id: 43, nama: 'Steampunk', tipe: 'Fiksi', deskripsi: 'Sci-fi retro-futuristik yang memakai teknologi mesin uap era Victoria' },
  { id: 44, nama: 'Thriller', tipe: 'Fiksi', deskripsi: 'Fokus pada ketegangan psikologis, rasa bahaya, dan kegembiraan, sering dengan tenggat waktu' },
  { id: 45, nama: 'Tragedy', tipe: 'Fiksi', deskripsi: 'Protagonis mengalami kejatuhan atau kehancuran karena kekurangan fatal dalam dirinya' },
  { id: 46, nama: 'Urban Fantasy', tipe: 'Fiksi', deskripsi: 'Sihir atau makhluk mitos yang hidup sembunyi-sembunyi di kota modern' },
  { id: 47, nama: 'Western', tipe: 'Fiksi', deskripsi: 'Berlatar perbatasan Amerika (Wild West) abad ke-19, berfokus pada koboi dan penegak hukum' },
  { id: 48, nama: 'Women\'s Fiction', tipe: 'Fiksi', deskripsi: 'Berpusat pada pengalaman hidup dan perkembangan emosional wanita, tidak melulu soal cinta' },
  { id: 49, nama: 'Young Adult', tipe: 'Fiksi', deskripsi: 'Ditujukan untuk pembaca usia 12-18 tahun, namun temanya sering dinikmati orang dewasa' },
  { id: 50, nama: 'Zombie Fiction', tipe: 'Fiksi', deskripsi: 'Fokus pada bertahan hidup dari mayat hidup' },
  { id: 51, nama: 'Autobiography', tipe: 'Non-Fiksi', deskripsi: 'Kisah hidup seseorang yang ditulis oleh dirinya sendiri' },
  { id: 52, nama: 'Biography', tipe: 'Non-Fiksi', deskripsi: 'Kisah hidup seseorang yang ditulis oleh orang lain' },
  { id: 53, nama: 'Creative Non-Fiction', tipe: 'Non-Fiksi', deskripsi: 'Fakta yang ditulis dengan gaya penceritaan novel (narrative non-fiction)' },
  { id: 54, nama: 'Memoir', tipe: 'Non-Fiksi', deskripsi: 'Mirip autobiografi, tetapi berfokus pada satu periode atau tema spesifik dalam hidup penulis' },
  { id: 55, nama: 'Self-Help', tipe: 'Non-Fiksi', deskripsi: 'Buku panduan untuk mengembangkan diri atau memecahkan masalah pribadi' },
  { id: 56, nama: 'True Crime', tipe: 'Non-Fiksi', deskripsi: 'Analisis mendalam tentang kasus kriminal nyata yang pernah terjadi' }
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
