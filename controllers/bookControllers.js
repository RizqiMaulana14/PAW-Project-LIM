import { books } from '../models/data.js';

const getBooks = (req, res) => {
  res.json({
    status: 'success',
    total: books.length,
    data: books
  });
};

export {
  getBooks
};
