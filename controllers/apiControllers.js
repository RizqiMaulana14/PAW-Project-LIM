import { books } from '../models/data.js';

const getStatus = (req, res) => {
  res.json({
    status: 'success',
    message: 'Server LIM running smoothly',
    timestamp: new Date().toISOString()
  });
};

const getHome = (req, res) => {
  const { search } = req.query;
  let filteredBooks = books;

  if (search) {
    const query = search.toLowerCase();
    filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query)
    );
  }

  res.render('index', {
    books: filteredBooks,
    query: search || ''
  });
};

export {
  getStatus,
  getHome
};
