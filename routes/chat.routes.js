// Rute endpoint untuk AI Assistant
import express from 'express';
import { postChatMessage } from '../controllers/chat.controller.js';
import { validateChatInput } from '../middlewares/validateChatInput.js';

const router = express.Router();

// POST /api/chat - Mengirim pesan ke AI Assistant dengan validasi input
router.post('/chat', validateChatInput, postChatMessage);

export default router;
