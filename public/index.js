/**
 * Frontend JavaScript - Pustaka LIM (Library Integrated Management)
 * Mendukung Operasi CRUD Penuh (Create, Read, Update, Delete) ke Database MySQL,
 * Pencarian Real-time, Kalender Interaktif, Log Peminjaman, dan REST API Console.
 */

let allBooks = [];
let pendingDeleteId = null;
let pendingCancelLoanId = null;

// Mengambil seluruh data produk dari endpoint GET /api/produk (Database MySQL)
async function loadBooksData() {
  try {
    const res = await fetch('/api/produk');
    allBooks = await res.json();
  } catch (err) {
    console.error('Gagal memuat produk dari API database:', err);
  }
}

// ========================================================================
// 1. PENCARIAN REAL-TIME & FILTER KATALOG
// ========================================================================
function setupLiveSearch() {
  const searchInput = document.getElementById('searchInput');
  const bookGrid = document.getElementById('bookGrid');
  const countPill = document.getElementById('bookCountPill');
  if (!searchInput || !bookGrid) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      renderKatalogCards(allBooks);
      if (countPill) countPill.textContent = `${allBooks.length} buku`;
      return;
    }

    const filtered = allBooks.filter(book => {
      const title = (book.nama || book.title || '').toLowerCase();
      const author = (book.penulis || book.author || '').toLowerCase();
      const cat = (book.kategori || book.category || '').toLowerCase();
      const kode = (book.kode || '').toLowerCase();
      return title.includes(query) || author.includes(query) || cat.includes(query) || kode.includes(query);
    });

    renderKatalogCards(filtered);
    if (countPill) countPill.textContent = `${filtered.length} buku`;
  });
}

function renderKatalogCards(booksList) {
  const bookGrid = document.getElementById('bookGrid');
  if (!bookGrid) return;

  if (booksList.length === 0) {
    bookGrid.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
        <p class="text-sm text-slate-500 mb-3">Tidak ada buku yang cocok dengan pencarian.</p>
        <button onclick="document.getElementById('searchInput').value=''; renderKatalogCards(allBooks);" class="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl">
          Reset Pencarian
        </button>
      </div>
    `;
    return;
  }

  bookGrid.innerHTML = booksList.map(book => {
    const isAvailable = book.status === 'Tersedia';
    const safeTitle = (book.nama || book.title || '').replace(/'/g, "\\'");

    return `
      <div class="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group book-card" id="card-${book.id}" data-id="${book.id}">
        
        <div class="h-44 rounded-xl ${book.coverBg || book.cover_bg || 'bg-slate-100'} p-3.5 flex flex-col justify-between relative overflow-hidden mb-3 border border-slate-100">
          <div class="flex items-start justify-between relative z-10">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 backdrop-blur-sm text-slate-700">
              ${book.kategori || book.category || 'Umum'}
            </span>

            ${isAvailable 
              ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                   <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                   Tersedia
                 </span>`
              : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
                   <span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                   Dipinjam
                 </span>`
            }
          </div>

          <div class="text-center my-auto py-1">
            <span class="text-xs text-slate-400 font-mono tracking-widest uppercase">Cover Buku</span>
          </div>

          <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>${book.lokasiRak || book.lokasi_rak || 'Rak Umum'}</span>
            <span>${book.kode || ''}</span>
          </div>
        </div>

        <div class="space-y-1 mb-3">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span>Tahun: <strong class="text-slate-700">${book.tahun || 2024}</strong></span>
            <span>Rak: <strong class="text-slate-700">${book.lokasiRak || book.lokasi_rak || 'Rak Umum'}</strong></span>
          </div>
          <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug cursor-pointer" onclick="openDetailModal('${book.id}')" title="${book.nama || book.title}">
            ${book.nama || book.title}
          </h3>
          <p class="text-xs text-slate-400 truncate">${book.penulis || book.author}</p>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 mb-2">
          <a href="/jadwal/${book.id}" class="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors">
            Jadwal
          </a>
          ${isAvailable 
            ? `<a href="/jadwal/${book.id}?action=pinjam" class="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center shadow-sm transition-all">
                 Pinjam
               </a>`
            : `<button disabled class="py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold text-center cursor-not-allowed border border-slate-200">
                 Pinjam
               </button>`
          }
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button 
            onclick="openEditModal('${book.id}')" 
            class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200/80 transition-colors flex items-center space-x-1"
          >
            <i class="fa-regular fa-pen-to-square text-[11px]"></i>
            <span class="text-[11px] font-medium">Ubah</span>
          </button>

          <button 
            onclick="openDeleteModal('${book.id}', '${safeTitle}')" 
            class="px-2.5 py-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors flex items-center space-x-1"
          >
            <i class="fa-regular fa-trash-can text-[11px]"></i>
            <span class="text-[11px] font-medium">Hapus</span>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

// ========================================================================
// 2. OPERASI CRUD: CREATE (TAMBAH BUKU BARU KE DATABASE)
// ========================================================================
function openAddModal() {
  const modal = document.getElementById('modalAddProduct');
  if (modal) modal.classList.remove('hidden');
}

function closeAddModal() {
  const modal = document.getElementById('modalAddProduct');
  if (modal) modal.classList.add('hidden');
  document.getElementById('formAddProduct')?.reset();
}

async function handleCreateProduct(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('btnSubmitAdd');

  const payload = {
    nama: form.nama.value.trim(),
    penulis: form.penulis.value.trim(),
    kategori_id: Number(form.kategori_id.value),
    tahun: Number(form.tahun.value || 2024),
    lokasi_rak: form.lokasi_rak.value.trim(),
    deskripsi: form.deskripsi.value.trim()
  };

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...`;
    }

    const res = await fetch('/api/produk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      showToast('Berhasil Ditambahkan!', 'Buku baru berhasil tersimpan ke database MySQL.');
      closeAddModal();
      // Muat ulang data terbaru dari backend database
      await loadBooksData();
      renderKatalogCards(allBooks);
      updateTotalHeader();
    } else {
      alert(`Gagal: ${data.message || 'Terjadi kesalahan saat menambahkan buku'}`);
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i><span>Simpan ke Database</span>`;
    }
  }
}

// ========================================================================
// 3. OPERASI CRUD: UPDATE (UBAH DATA BUKU DI DATABASE)
// ========================================================================
async function openEditModal(bookId) {
  try {
    const res = await fetch(`/api/produk/${bookId}`);
    const result = await res.json();
    const book = result.data || result;

    if (!book) {
      alert('Data buku tidak ditemukan di database.');
      return;
    }

    document.getElementById('editBookId').value = book.id;
    document.getElementById('editNama').value = book.nama || book.title || '';
    document.getElementById('editPenulis').value = book.penulis || book.author || '';
    document.getElementById('editKategoriId').value = book.kategori_id || '1';
    document.getElementById('editStatus').value = book.status || 'Tersedia';
    document.getElementById('editLokasiRak').value = book.lokasi_rak || book.lokasiRak || 'Rak Umum';
    document.getElementById('editTahun').value = book.tahun || 2024;
    document.getElementById('editDeskripsi').value = book.deskripsi || book.description || '';

    const modal = document.getElementById('modalEditProduct');
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    alert(`Gagal memuat data buku: ${err.message}`);
  }
}

function closeEditModal() {
  const modal = document.getElementById('modalEditProduct');
  if (modal) modal.classList.add('hidden');
}

async function handleUpdateProduct(e) {
  e.preventDefault();
  const form = e.target;
  const bookId = document.getElementById('editBookId').value;
  const btn = document.getElementById('btnSubmitEdit');

  const payload = {
    nama: form.nama.value.trim(),
    penulis: form.penulis.value.trim(),
    kategori_id: Number(form.kategori_id.value),
    status: form.status.value,
    lokasi_rak: form.lokasi_rak.value.trim(),
    tahun: Number(form.tahun.value || 2024),
    deskripsi: form.deskripsi.value.trim()
  };

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...`;
    }

    const res = await fetch(`/api/produk/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      showToast('Perubahan Disimpan!', 'Data buku telah berhasil diperbarui di database MySQL.');
      closeEditModal();
      await loadBooksData();
      renderKatalogCards(allBooks);
    } else {
      alert(`Gagal memperbarui: ${data.message || 'Terjadi kesalahan'}`);
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-check"></i><span>Simpan Perubahan</span>`;
    }
  }
}

// ========================================================================
// 4. OPERASI CRUD: DELETE (HAPUS DATA BUKU DARI DATABASE)
// ========================================================================
function openDeleteModal(bookId, bookTitle) {
  pendingDeleteId = bookId;
  const modal = document.getElementById('modalDeleteProduct');
  const titleEl = document.getElementById('deleteBookTitle');
  if (titleEl) titleEl.textContent = `"${bookTitle}"`;
  if (modal) modal.classList.remove('hidden');

  const btnConfirm = document.getElementById('btnConfirmDelete');
  if (btnConfirm) {
    btnConfirm.onclick = executeDeleteProduct;
  }
}

function closeDeleteModal() {
  const modal = document.getElementById('modalDeleteProduct');
  if (modal) modal.classList.add('hidden');
  pendingDeleteId = null;
}

async function executeDeleteProduct() {
  if (!pendingDeleteId) return;

  const btn = document.getElementById('btnConfirmDelete');
  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Menghapus...`;
    }

    const res = await fetch(`/api/produk/${pendingDeleteId}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok) {
      // Hapus kartu buku dari DOM
      const card = document.getElementById(`card-${pendingDeleteId}`);
      if (card) card.remove();

      showToast('Buku Dihapus!', 'Data buku telah dihapus secara permanen dari database MySQL.');
      closeDeleteModal();
      await loadBooksData();
      updateTotalHeader();
    } else {
      alert(`Gagal menghapus: ${data.message || 'Terjadi kesalahan'}`);
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `Ya, Hapus Data`;
    }
  }
}

function updateTotalHeader() {
  const headerCount = document.getElementById('totalBooksHeader');
  const pillCount = document.getElementById('bookCountPill');
  if (headerCount) headerCount.textContent = allBooks.length;
  if (pillCount) pillCount.textContent = `${allBooks.length} buku`;
}

// ========================================================================
// 5. DETAIL MODAL (READ DETAIL)
// ========================================================================
async function openDetailModal(bookId) {
  try {
    const res = await fetch(`/api/produk/${bookId}`);
    const result = await res.json();
    const book = result.data || result;

    if (!book) return;

    document.getElementById('detailKode').textContent = `${book.kode || ''} • ID: ${book.id}`;
    document.getElementById('detailTitle').textContent = book.nama || book.title;
    document.getElementById('detailAuthor').textContent = book.penulis || book.author;
    document.getElementById('detailCategory').textContent = book.kategori || book.category || 'Umum';
    const statusEl = document.getElementById('detailStatusText');
    if (statusEl) statusEl.textContent = book.status || 'Tersedia';
    document.getElementById('detailRak').textContent = book.lokasi_rak || book.lokasiRak || 'Rak Umum';
    document.getElementById('detailDesc').textContent = book.deskripsi || book.description || 'Tidak ada deskripsi.';
    
    const link = document.getElementById('detailJadwalLink');
    if (link) link.href = `/jadwal/${book.id}`;

    const modal = document.getElementById('modalDetailProduct');
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    console.error('Error openDetailModal:', err);
  }
}

function closeDetailModal() {
  const modal = document.getElementById('modalDetailProduct');
  if (modal) modal.classList.add('hidden');
}

// Toast Notifikasi Helper
function showToast(title, desc) {
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastDesc) toastDesc.textContent = desc;

  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ========================================================================
// 6. REST API TESTER MODAL (PENGUJIAN ENDPOINT CRUD WEEK 7 / BERKELANJUTAN)
// ========================================================================
function openApiTesterModal() {
  const modal = document.getElementById('apiTesterModal');
  if (modal) modal.classList.remove('hidden');
}

function closeApiTesterModal() {
  const modal = document.getElementById('apiTesterModal');
  if (modal) modal.classList.add('hidden');
}

async function testApiEndpoint(endpoint, method = 'GET', body = null) {
  const statusEl = document.getElementById('apiModalStatus');
  const latencyEl = document.getElementById('apiModalLatency');
  const jsonEl = document.getElementById('apiModalJson');
  if (!statusEl || !jsonEl) return;

  statusEl.textContent = `Memanggil ${method} ${endpoint}...`;
  jsonEl.textContent = 'Menunggu data dari backend database...';

  const t0 = performance.now();
  try {
    const options = { method, headers: {} };
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    const res = await fetch(endpoint, options);
    const ms = Math.round(performance.now() - t0);
    const data = await res.json();

    statusEl.innerHTML = `<span class="text-emerald-400 font-bold">HTTP ${res.status} ${res.statusText || 'OK'}</span>`;
    if (latencyEl) latencyEl.textContent = `${ms} ms`;
    jsonEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    statusEl.innerHTML = `<span class="text-rose-400 font-bold">Gagal Request</span>`;
    jsonEl.textContent = `Error: ${err.message}`;
  }
}

let lastCreatedTestId = null;

// Test POST /api/produk
async function testApiCreateProduct() {
  const sample = {
    nama: `Buku Uji CRUD Database ${Math.floor(100 + Math.random() * 900)}`,
    penulis: 'Rizqi Maulana Fitrah',
    kategori_id: 6,
    tahun: 2024,
    lokasi_rak: 'Rak Test-01',
    deskripsi: 'Data buku uji untuk memverifikasi endpoint POST /api/produk ke database MySQL.'
  };

  const statusEl = document.getElementById('apiModalStatus');
  const latencyEl = document.getElementById('apiModalLatency');
  const jsonEl = document.getElementById('apiModalJson');

  statusEl.textContent = 'Memanggil POST /api/produk...';
  jsonEl.textContent = 'Menyimpan data uji ke MySQL...';

  const t0 = performance.now();
  try {
    const res = await fetch('/api/produk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sample)
    });
    const ms = Math.round(performance.now() - t0);
    const data = await res.json();

    if (data.data?.id) lastCreatedTestId = data.data.id;

    statusEl.innerHTML = `<span class="text-emerald-400 font-bold">HTTP ${res.status} Created</span>`;
    if (latencyEl) latencyEl.textContent = `${ms} ms`;
    jsonEl.textContent = JSON.stringify(data, null, 2);

    await loadBooksData();
    renderKatalogCards(allBooks);
    updateTotalHeader();
  } catch (err) {
    statusEl.innerHTML = `<span class="text-rose-400 font-bold">Error</span>`;
    jsonEl.textContent = `Error: ${err.message}`;
  }
}

// Test PUT /api/produk/1
async function testApiUpdateProduct() {
  const updatePayload = {
    lokasi_rak: 'Rak TI-Updated',
    deskripsi: `Diperbarui melalui REST API Console pada ${new Date().toLocaleTimeString()} WIB`
  };
  await testApiEndpoint('/api/produk/1', 'PUT', updatePayload);
  await loadBooksData();
  renderKatalogCards(allBooks);
}

// Test DELETE /api/produk/:id
async function testApiDeleteLatest() {
  const idToDelete = lastCreatedTestId || (allBooks.length > 0 ? allBooks[allBooks.length - 1].id : 1);
  await testApiEndpoint(`/api/produk/${idToDelete}`, 'DELETE');
  lastCreatedTestId = null;
  await loadBooksData();
  renderKatalogCards(allBooks);
  updateTotalHeader();
}

// ========================================================================
// 7. INTERAKSI KALENDER & LOG PEMINJAMAN
// ========================================================================
function setupCalendarInteraction() {
  const daysGrid = document.getElementById('calendarDaysGrid');
  const startDateInput = document.getElementById('borrowStartDate');
  const endDateInput = document.getElementById('borrowEndDate');
  const conflictAlert = document.getElementById('conflictAlert');
  if (!daysGrid) return;

  daysGrid.addEventListener('click', (e) => {
    const dayEl = e.target.closest('span');
    if (!dayEl || dayEl.classList.contains('text-slate-400') || dayEl.classList.contains('text-slate-300')) return;

    const dayNumber = parseInt(dayEl.textContent.trim(), 10);
    if (!dayNumber || isNaN(dayNumber)) return;

    const startDay = dayNumber;
    const endDay = Math.min(30, startDay + 7);

    if (startDateInput) startDateInput.value = `${startDay} Juni 2025`;
    if (endDateInput) endDateInput.value = `${endDay} Juni 2025`;

    if (conflictAlert) {
      if ((startDay >= 18 && startDay <= 22) || (endDay >= 18 && endDay <= 22)) {
        conflictAlert.classList.remove('hidden');
      } else {
        conflictAlert.classList.add('hidden');
      }
    }
  });
}

async function handleConfirmBorrow(e) {
  e.preventDefault();
  const bookId = document.getElementById('borrowBookId')?.value;
  const startDate = document.getElementById('borrowStartDate')?.value;
  const endDate = document.getElementById('borrowEndDate')?.value;
  const conflictAlert = document.getElementById('conflictAlert');
  const btn = document.getElementById('btnConfirmBorrow');

  if (conflictAlert && !conflictAlert.classList.contains('hidden')) {
    alert('❌ Peminjaman ditolak karena jadwal bentrok dengan peminjam lain!');
    return;
  }

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-1"></i> Memproses...`;
    }

    const res = await fetch('/api/peminjaman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, startDate, endDate })
    });

    const data = await res.json();

    if (res.ok) {
      const toast = document.getElementById('toastNotification');
      if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => {
          window.location.href = '/log-peminjaman';
        }, 1200);
      } else {
        alert('✅ Buku berhasil dipinjam! Data dicatat ke database.');
        window.location.href = '/log-peminjaman';
      }
    } else {
      alert(`Gagal: ${data.message || 'Terjadi kesalahan'}`);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Konfirmasi peminjaman</span><i class="fa-solid fa-arrow-right text-[11px] ml-1"></i>`;
      }
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>Konfirmasi peminjaman</span><i class="fa-solid fa-arrow-right text-[11px] ml-1"></i>`;
    }
  }
}

function switchLogTab(tabName) {
  const btnAktif = document.getElementById('tabBtnAktif');
  const btnRiwayat = document.getElementById('tabBtnRiwayat');
  const contentAktif = document.getElementById('tabContentAktif');
  const contentRiwayat = document.getElementById('tabContentRiwayat');

  if (tabName === 'aktif') {
    btnAktif.className = 'pb-3 border-b-2 border-slate-900 text-slate-900 transition-colors';
    btnRiwayat.className = 'pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-700 transition-colors';
    contentAktif?.classList.remove('hidden');
    contentRiwayat?.classList.add('hidden');
  } else {
    btnRiwayat.className = 'pb-3 border-b-2 border-slate-900 text-slate-900 transition-colors';
    btnAktif.className = 'pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-700 transition-colors';
    contentRiwayat?.classList.remove('hidden');
    contentAktif?.classList.add('hidden');
  }
}

function confirmCancelLoan(loanId, title) {
  pendingCancelLoanId = loanId;
  const modal = document.getElementById('cancelConfirmModal');
  const titleEl = document.getElementById('cancelBookTitle');
  if (titleEl) titleEl.textContent = `"${title}"`;
  if (modal) modal.classList.remove('hidden');

  const btnConfirm = document.getElementById('btnConfirmCancel');
  if (btnConfirm) {
    btnConfirm.onclick = executeCancelLoan;
  }
}

function closeCancelModal() {
  const modal = document.getElementById('cancelConfirmModal');
  if (modal) modal.classList.add('hidden');
  pendingCancelLoanId = null;
}

async function executeCancelLoan() {
  if (!pendingCancelLoanId) return;

  try {
    const res = await fetch(`/api/peminjaman/${pendingCancelLoanId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      const itemEl = document.getElementById(`item-${pendingCancelLoanId}`);
      if (itemEl) itemEl.remove();

      const counter = document.getElementById('activeLoanCounter');
      const tabCount = document.getElementById('tabCountAktif');
      const badge = document.getElementById('sidebarActiveLoanBadge');

      const remaining = document.querySelectorAll('.loan-item').length;
      if (counter) counter.textContent = remaining;
      if (tabCount) tabCount.textContent = remaining;
      if (badge) badge.textContent = remaining;

      showToast('Peminjaman Dibatalkan', 'Buku kembali tersedia di database.');
      closeCancelModal();
    }
  } catch (err) {
    alert(`Gagal membatalkan: ${err.message}`);
  }
}

// Inisialisasi DOM
document.addEventListener('DOMContentLoaded', () => {
  loadBooksData();
  setupLiveSearch();
  setupCalendarInteraction();
});
