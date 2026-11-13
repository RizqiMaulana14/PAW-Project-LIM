/**
 * Entry Point Utama Aplikasi LIM (Library Integrated Management)
 * Tugas: PPAW Project Berkelanjutan - Integrasi Database & Implementasi CRUD
 * Kelompok 2 PAW
 */

import express from 'express';
import path from 'path';
import { appConfig } from './config/appConfig.js';
import { testDbConnection } from './config/db.js';
import logger from './middlewares/logger.js';
import apiRoutes from './routes/apiRoutes.js';
import webRoutes from './routes/webRoutes.js';

const __dirname = import.meta.dirname;

// Inisialisasi Express App
const app = express();

// 1. Pasang Middleware Logger untuk mencatat seluruh request HTTP yang masuk (GET, POST, PUT, DELETE)
app.use(logger);

// 2. Parser Request Body (JSON dan URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Konfigurasi View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 4. Serving Static Files (CSS, JS, Assets)
app.use(express.static(path.join(__dirname, 'public')));

// 5. Mount Routes
// Web Interface (Frontend EJS)
app.use('/', webRoutes);

// REST API Endpoints (/api/status, /api/produk, /api/produk/:id, dll.)
app.use(appConfig.apiPrefix || '/api', apiRoutes);

// 6. 404 Handler
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: `Endpoint API '${req.originalUrl}' tidak ditemukan.`
    });
  }

  res.status(404).redirect('/katalog');
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m Terjadi kesalahan pada server:', err.message);
  
  if (req.originalUrl.startsWith('/api')) {
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
      error: appConfig.env === 'development' ? err.message : undefined
    });
  }

  res.status(500).send('Terjadi kesalahan internal pada server.');
});

// 8. Jalankan Server
const PORT = appConfig.port;
app.listen(PORT, async () => {
  const line = '━'.repeat(60);
  const dbStatus = await testDbConnection();

  console.log(`\n\x1b[36m${line}\x1b[0m`);
  console.log(`\x1b[1m\x1b[32m  ✔ ${appConfig.appName} v${appConfig.version} Berhasil Dijalankan\x1b[0m`);
  console.log(`\x1b[36m${line}\x1b[0m`);
  console.log(`  🌐 Frontend URL   : \x1b[1m\x1b[34mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`  🔌 Status API     : \x1b[34mhttp://localhost:${PORT}/api/status\x1b[0m`);
  console.log(`  📦 CRUD Produk    : \x1b[34mhttp://localhost:${PORT}/api/produk\x1b[0m`);
  console.log(`  🗄️ Database MySQL : ${dbStatus.connected ? '\x1b[32m✔ ' + dbStatus.message : '\x1b[31m✖ ' + dbStatus.message}\x1b[0m`);
  console.log(`  📜 Middleware Log : \x1b[32mAktif mencatat request (GET, POST, PUT, DELETE) di terminal\x1b[0m`);
  console.log(`\x1b[36m${line}\x1b[0m\n`);
});

export default app;
