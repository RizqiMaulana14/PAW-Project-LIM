// Konfigurasi koneksi PostgreSQL dengan Sequelize ORM
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbName = process.env.DB_NAME || 'db_lim_library';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'ahmed';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = Number(process.env.DB_PORT || 5432);

// Inisialisasi instance Sequelize
export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

// Uji koneksi ke database PostgreSQL
export async function testDbConnection() {
  try {
    await sequelize.authenticate();
    return {
      connected: true,
      message: `Terhubung ke PostgreSQL database '${dbName}' melalui Sequelize ORM`,
      database: dbName,
      dialect: 'postgres'
    };
  } catch (err) {
    return {
      connected: false,
      message: `Gagal terhubung ke PostgreSQL: ${err.message}`,
      database: dbName,
      dialect: 'postgres'
    };
  }
}

export default {
  sequelize,
  testDbConnection
};
