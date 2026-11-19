// Controller untuk menangani endpoint AI Assistant Chat
import { generateChatResponse } from '../services/gemini.service.js';

export async function postChatMessage(req, res) {
  try {
    const { message } = req.body;

    // Memproses pesan melalui Gemini service dengan context perpustakaan
    const reply = await generateChatResponse(message);

    return res.status(200).json({
      success: true,
      data: {
        reply
      }
    });
  } catch (err) {
    console.error('\x1b[31m[CHAT ERROR]\x1b[0m', err.message);

    const isApiKeyError = err.message.includes('GEMINI_API_KEY') || err.message.includes('API key');
    const statusCode = isApiKeyError ? 503 : 500;
    const userMessage = isApiKeyError
      ? 'Layanan asisten AI sedang dinonaktifkan sementara (API Key belum terpasang).'
      : (err.message || 'Terjadi kesalahan saat memproses pertanyaan Anda.');

    return res.status(statusCode).json({
      success: false,
      message: userMessage
    });
  }
}

export default {
  postChatMessage
};
