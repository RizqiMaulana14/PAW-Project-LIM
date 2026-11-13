/**
 * Utility & Helper Functions untuk Aplikasi LIM
 * Sesuai arsitektur MVC - Folder utils/
 */

/**
 * Format timestamp ke format lokal yang mudah dibaca (YYYY-MM-DD HH:mm:ss WIB)
 * @param {Date|string|number} [date=new Date()]
 * @returns {string}
 */
export const formatTimestamp = (date = new Date()) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} WIB`;
};

/**
 * Mengonversi detik uptime server menjadi format yang mudah dipahami
 * @param {number} uptimeSeconds
 * @returns {string}
 */
export const formatUptime = (uptimeSeconds) => {
  const seconds = Math.floor(uptimeSeconds % 60);
  const minutes = Math.floor((uptimeSeconds / 60) % 60);
  const hours = Math.floor(uptimeSeconds / 3600);

  const parts = [];
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  parts.push(`${seconds} detik`);

  return parts.join(' ');
};

/**
 * Format angka mata uang Rupiah
 * @param {number} amount
 * @returns {string}
 */
export const formatRupiah = (amount) => {
  if (typeof amount !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Filter item berdasarkan kata kunci pencarian
 * @param {Array} items
 * @param {string} query
 * @param {Array<string>} fields
 * @returns {Array}
 */
export const filterItems = (items, query, fields = ['title', 'author', 'category', 'nama', 'penulis', 'kategori']) => {
  if (!query || typeof query !== 'string') return items;
  const lowerQuery = query.toLowerCase().trim();

  return items.filter(item => {
    return fields.some(field => {
      const val = item[field];
      return typeof val === 'string' && val.toLowerCase().includes(lowerQuery);
    });
  });
};

/**
 * Mewarnai teks konsol untuk terminal berbasis status HTTP
 * @param {number} statusCode
 * @returns {string} kode warna ANSI
 */
export const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return '\x1b[31m'; // Red
  if (statusCode >= 400) return '\x1b[33m'; // Yellow
  if (statusCode >= 300) return '\x1b[36m'; // Cyan
  if (statusCode >= 200) return '\x1b[32m'; // Green
  return '\x1b[0m'; // Reset
};
