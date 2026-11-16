// Middleware logger untuk mencatat request HTTP (method, path, status, latency)
import { formatTimestamp, getStatusColor } from '../utils/helpers.js';

const logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const startTime = Date.now();
  const timestamp = formatTimestamp();

  // Catat respon saat event finish dipicu
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
