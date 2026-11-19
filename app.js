// Entry point utama aplikasi LIM (Express, EJS, PostgreSQL Sequelize ORM, dan JOI)
import express from 'express';
import path from 'path';
import { appConfig } from './config/appConfig.js';
import { testDbConnection } from './config/db.js';
import { syncDatabase } from './models/index.js';
import logger from './middlewares/logger.js';
import apiRoutes from './routes/apiRoutes.js';
import webRoutes from './routes/webRoutes.js';
import chatRoutes from './routes/chat.routes.js';

const __dirname = import.meta.dirname;

// Inisialisasi Express App
const app = express();

// Pasang middleware logger untuk mencatat request HTTP
app.use(logger);

// Parser request body JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi template engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serving static files (CSS, JS, Assets)
app.use(express.static(path.join(__dirname, 'public')));

// Mounting rute web dan REST API
app.use('/', webRoutes);
app.use(appConfig.apiPrefix || '/api', apiRoutes);
app.use(appConfig.apiPrefix || '/api', chatRoutes);

// Handler 404 Not Found
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Resource tidak ditemukan.'
    });
  }

  res.status(404).redirect('/katalog');
});

// Global error handler
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

// Jalankan server Express
const PORT = appConfig.port;
app.listen(PORT, async () => {
  const line = '━'.repeat(60);
  const dbStatus = await testDbConnection();
  if (dbStatus.connected) {
    await syncDatabase();
  }

  console.log(`\n\x1b[36m${line}\x1b[0m`);
  console.log(`\x1b[1m\x1b[32m  ✔ ${appConfig.appName} v${appConfig.version} Berhasil Dijalankan\x1b[0m`);
  console.log(`\x1b[36m${line}\x1b[0m`);
  console.log(`  🌐 Server URL     : \x1b[1m\x1b[34mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`  🗄️ Database       : ${dbStatus.connected ? '\x1b[32m✔ ' + dbStatus.message : '\x1b[31m✖ ' + dbStatus.message}\x1b[0m`);
  console.log(`  📜 Middleware Log : \x1b[32mAktif mencatat request (GET, POST, PUT, DELETE) di terminal\x1b[0m`);
  console.log(`\x1b[36m${line}\x1b[0m\n`);
});

export default app;
