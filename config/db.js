/**
 * Konfigurasi Koneksi Database MySQL / MariaDB (Pool Connection)
 * Sesuai arsitektur MVC - Folder config/
 */

import mysql from 'mysql2/promise';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

// Inisialisasi pool koneksi MySQL
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_lim_library',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Uji koneksi ke database dan inisialisasi tabel otomatis jika belum ada
 */
export async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 AS status, DATABASE() as db_name');
    connection.release();
    return {
      connected: true,
      message: `Terhubung ke MySQL database '${rows[0].db_name}'`,
      database: rows[0].db_name
    };
  } catch (err) {
    // Jika database belum dibuat, coba buat otomatis
    if (err.code === 'ER_BAD_DB_ERROR') {
      try {
        const rootConn = await mysql.createConnection({
          host: process.env.DB_HOST || '127.0.0.1',
          port: Number(process.env.DB_PORT || 3306),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || ''
        });
        const dbName = process.env.DB_NAME || 'db_lim_library';
        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await rootConn.end();

        // Jalankan schema.sql jika tersedia
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        if (fs.existsSync(schemaPath)) {
          const sql = fs.readFileSync(schemaPath, 'utf8');
          const connWithDb = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            multipleStatements: true
          });
          await connWithDb.query(sql);
          await connWithDb.end();
        }
        return {
          connected: true,
          message: `Database '${dbName}' berhasil diinisialisasi secara otomatis!`,
          database: dbName
        };
      } catch (initErr) {
        return { connected: false, message: initErr.message };
      }
    }
    return {
      connected: false,
      message: err.message
    };
  }
}

export default {
  pool,
  testDbConnection
};
