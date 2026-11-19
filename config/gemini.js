// Konfigurasi integrasi Google Gemini API
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('\x1b[33m[WARN]\x1b[0m GEMINI_API_KEY belum disetel di file .env');
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export default {
  genAI,
  GEMINI_MODEL,
  apiKey
};
