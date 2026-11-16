// Fungsi pembantu (helpers) untuk timestamp, uptime, dan styling terminal
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

// Mengonversi detik uptime server menjadi format yang mudah dipahami
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


// Filter item berdasarkan kata kunci pencarian
export const filterItems = (items, query, fields = ['title', 'author', 'category', 'nama', 'penulis', 'kategori']) => {
  if (!query || typeof query !== 'string') return items;
  const lowerQuery = query.toLowerCase().trim();

  return items.filter(item => {
    return fields.some(field => {
      const val = item[field];
      if (!val) return false;
      return String(val).toLowerCase().includes(lowerQuery);
    });
  });
};

// Memberikan kode warna ANSI terminal berdasarkan status code HTTP
export const getStatusColor = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) return '\x1b[32m'; // Hijau
  if (statusCode >= 300 && statusCode < 400) return '\x1b[33m'; // Kuning
  if (statusCode >= 400 && statusCode < 500) return '\x1b[35m'; // Ungu/Magenta
  if (statusCode >= 500) return '\x1b[31m';                     // Merah
  return '\x1b[37m';
};

export default {
  formatTimestamp,
  formatUptime,
  filterItems,
  getStatusColor
};
