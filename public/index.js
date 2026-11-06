const searchInput = document.getElementById('searchInput');
const searchForm = document.querySelector('.search-box');
const bookGrid = document.getElementById('bookGrid');
const bookCountPill = document.getElementById('bookCountPill');

let allBooks = [];

// ─── REST API Console Modal ───────────────────────────────────────────────────

function openApiTesterModal() {
  const modal = document.getElementById('apiTesterModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeApiTesterModal() {
  const modal = document.getElementById('apiTesterModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Tutup modal ketika klik overlay (luar card)
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('apiTesterModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeApiTesterModal();
    });
  }
});

// Tutup modal dengan Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeApiTesterModal();
});

async function testApiEndpoint(endpoint) {
  const statusEl  = document.getElementById('apiModalStatus');
  const latencyEl = document.getElementById('apiModalLatency');
  const jsonEl    = document.getElementById('apiModalJson');

  statusEl.textContent  = 'Status: Memuat...';
  latencyEl.textContent = '— ms';
  jsonEl.textContent    = 'Mengirim request...';

  const start = Date.now();
  try {
    const res  = await fetch(endpoint);
    const ms   = Date.now() - start;
    const data = await res.json();

    statusEl.textContent  = `Status: ${res.status} ${res.statusText}`;
    latencyEl.textContent = `${ms} ms`;
    jsonEl.textContent    = JSON.stringify(data, null, 2);
  } catch (err) {
    const ms = Date.now() - start;
    statusEl.textContent  = 'Status: Error';
    latencyEl.textContent = `${ms} ms`;
    jsonEl.textContent    = `Gagal mengambil data:\n${err.message}`;
  }
}

const coverColors = [
  'from-slate-200 to-slate-300 text-slate-700',
  'from-amber-100 to-amber-200 text-amber-900',
  'from-stone-200 to-stone-300 text-stone-800',
  'from-emerald-100 to-teal-200 text-emerald-900',
  'from-sky-100 to-blue-200 text-sky-900',
  'from-orange-100 to-amber-200 text-orange-900',
  'from-indigo-100 to-purple-200 text-indigo-900',
  'from-blue-100 to-indigo-200 text-blue-900',
  'from-violet-100 to-fuchsia-200 text-violet-900',
  'from-rose-100 to-pink-200 text-rose-900',
  'from-teal-100 to-cyan-200 text-teal-900',
];

async function fetchBooks() {
  try {
    const response = await fetch('/api/books');
    const result = await response.json();
    if (result.status === 'success') {
      allBooks = result.data;
    }
  } catch (error) {
    console.error(error);
  }
}

function renderBooks(books) {
  if (!bookGrid) return;

  if (bookCountPill) {
    bookCountPill.textContent = `${books.length} buku`;
  }

  if (books.length === 0) {
    bookGrid.innerHTML = `
      <div class="col-span-full text-center py-16 px-5 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm">
        <p>Buku tidak ditemukan.</p>
      </div>`;
    return;
  }

  bookGrid.innerHTML = books.map((book, index) => {
    const colorClass = coverColors[index % coverColors.length];
    const statusBadge = book.status === 'Tersedia'
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
           <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>Tersedia
         </span>`
      : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
           <span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>Dipinjam
         </span>`;

    const pinjamBtn = book.status === 'Tersedia'
      ? `<span class="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center shadow-sm transition-all cursor-default">Pinjam</span>`
      : `<span class="py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold text-center cursor-not-allowed border border-slate-200">Pinjam</span>`;

    return `
      <div class="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        <div class="h-44 rounded-xl bg-gradient-to-br ${colorClass} p-3.5 flex flex-col justify-between relative overflow-hidden mb-4 border border-slate-100">
          <div class="flex items-start justify-between relative z-10">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 backdrop-blur-sm text-slate-700">
              ${book.category}
            </span>
            ${statusBadge}
          </div>
          <div class="text-center my-auto py-2">
            <span class="text-xs text-slate-400 font-mono tracking-widest uppercase">Cover Buku</span>
          </div>
          <div class="text-[10px] text-slate-500 font-mono text-right">${book.id}</div>
        </div>

        <div class="space-y-1 mb-5">
          <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug" title="${book.title}">
            ${book.title}
          </h3>
          <p class="text-xs text-slate-400 truncate">${book.author}</p>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <span class="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors cursor-default">Jadwal</span>
          ${pinjamBtn}
        </div>
      </div>`;
  }).join('');
}

function handleSearch(e) {
  if (e) e.preventDefault();
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase();
  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.category.toLowerCase().includes(query)
  );
  renderBooks(filtered);
}

if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}

if (searchForm) {
  searchForm.addEventListener('submit', handleSearch);
}

document.addEventListener('DOMContentLoaded', fetchBooks);
