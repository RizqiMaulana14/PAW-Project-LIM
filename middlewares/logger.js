/**
 * Middleware Logger untuk mencatat setiap request HTTP yang masuk ke backend
 * Sesuai arsitektur MVC - Folder middlewares/
 *
 * Mencatat:
 * 1. Metode HTTP (GET, POST, dll.)
 * 2. Path atau endpoint yang diakses
 * 3. Status response HTTP (200, 404, 500, dll.)
 * 4. Waktu request (Timestamp) dan durasi pemrosesan (ms)
 */

import { formatTimestamp, getStatusColor } from '../utils/helpers.js';

const logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const startTime = Date.now();
  const timestamp = formatTimestamp();

  // Menggunakan event 'finish' agar mendapatkan status code HTTP yang sebenarnya
  res.on('finish', () => {
    const statusCode = res.statusCode;
    const duration = Date.now() - startTime;
    const color = getStatusColor(statusCode);
    const reset = '\x1b[0m';
    const bold = '\x1b[1m';

    console.log(
      `[${timestamp}] ${bold}${method}${reset} ${url} -> ${color}${statusCode}${reset} (${duration}ms)`
    );
  });

  next();
};

export default logger;
