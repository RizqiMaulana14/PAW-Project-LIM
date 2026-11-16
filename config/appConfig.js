// Konfigurasi utama aplikasi dan informasi kelompok
import 'dotenv/config';

export const appConfig = {
  appName: process.env.APP_NAME || 'Library Integrated Management (LIM)',
  appShortName: 'LIM',
  version: '2.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  apiPrefix: '/api',
  db: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    name: process.env.DB_NAME || 'db_lim_library'
  },
  groupInfo: {
    kelas: 'PAW - Kelompok 2',
    tugas: 'PPAW Project Berkelanjutan - Integrasi Database & Implementasi CRUD',
    members: [
      { name: 'Rizqi Maulana Fitrah', nim: '20240140113' },
      { name: 'Muhammad Rasyid Ridha Aqimuddin', nim: '20240140151' },
      { name: 'Rizki Fadhil Budiastanto', nim: '20240140112' },
      { name: 'Akhmad Rezky Utama', nim: '20240140161' }
    ]
  }
};

export default appConfig;
