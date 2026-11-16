// Model Produk (Buku) murni Sequelize ORM
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Produk = sequelize.define('Produk', {
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
  nama: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  penulis: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kategori',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Tersedia'
  },
  lokasi_rak: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Rak Umum'
  },
  tahun: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 2024
  },
  cover_bg: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'bg-slate-100'
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'produk',
  timestamps: true,
  underscored: true
});

export default Produk;
