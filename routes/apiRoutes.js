import express from 'express';
import { getStatus } from '../controllers/apiControllers.js';
import { getBooks } from '../controllers/bookControllers.js';

const router = express.Router();

router.get('/status', getStatus);
router.get('/books', getBooks);

export default router;
