import { GoogleGenerativeAI } from '@google/generative-ai';
import env from './env.js';

let genAI = null;
let isGeminiConfigured = false;

if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '' && !env.GEMINI_API_KEY.includes('your_gemini_api_key_here')) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    isGeminiConfigured = true;
    console.log('✅ [Gemini AI] Google Generative AI initialized with model:', env.GEMINI_MODEL);
  } catch (err) {
    console.warn('⚠️ [Gemini AI] Initialization error:', err.message);
  }
} else {
  console.warn('ℹ️ [Gemini AI] No valid GEMINI_API_KEY detected in .env. Running in Guided Ecological Assessment Demo Mode.');
}

export const getGeminiClient = () => genAI;
export const isGeminiLive = () => isGeminiConfigured;
export const getActiveModelName = () => env.GEMINI_MODEL || 'gemini-2.0-flash';

export default {
  getGeminiClient,
  isGeminiLive,
  getActiveModelName,
};
