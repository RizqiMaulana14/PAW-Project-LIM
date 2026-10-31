const searchInput = document.getElementById('searchInput');
const searchForm = document.querySelector('.search-box');
const bookGrid = document.getElementById('bookGrid');

let allBooks = [];

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

  if (books.length === 0) {
    bookGrid.innerHTML = '<div class="no-data"><p>Buku tidak ditemukan.</p></div>';
    return;
  }

  bookGrid.innerHTML = books.map(book => `
    <div class="card">
      <div class="book-cover-wrapper">
        <div class="book-cover">
          <span class="book-cover-category">${book.category}</span>
          <h4 class="book-cover-title">${book.title}</h4>
          <span class="book-cover-author">${book.author}</span>
        </div>
      </div>

      <div class="card-body">
        <div class="card-content">
          <h3>${book.title}</h3>
          <p class="card-meta"><strong>Penulis:</strong> ${book.author}</p>
          <p class="card-meta"><strong>Kategori:</strong> ${book.category}</p>
          <p class="card-desc">${book.description}</p>
        </div>

        <div class="card-footer">
          ${book.status == "Tersedia" 
            ? `<span class="badge badge-available"><span class="badge-dot"></span> Tersedia</span>` 
            : `<span class="badge badge-borrowed"><span class="badge-dot"></span> Dipinjam</span>`
          }
        </div>
      </div>
    </div>
  `).join('');
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
