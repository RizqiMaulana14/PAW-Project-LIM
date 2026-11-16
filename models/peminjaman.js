// Model Peminjaman murni Sequelize ORM
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Peminjaman = sequelize.define('Peminjaman', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  produk_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produk',
      key: 'id'
    }
  },
  peminjam_nama: {
    type: DataTypes.STRING(150),
    allowNull: false,
    defaultValue: 'Naya Aulia'
  },
  tanggal_pinjam: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tanggal_kembali: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sisa_waktu: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: '14 hari lagi'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Sedang dipinjam'
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'peminjaman',
  timestamps: true,
  underscored: true
});

export default Peminjaman;
