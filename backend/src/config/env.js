import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || 5050,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'aravalli-sentinel-demo',
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '',
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '',
  AUTHORITY_INVITE_SECRET: process.env.AUTHORITY_INVITE_SECRET || 'AravalliEnforce2025SecureToken',
  ENVIRONMENTAL_DATA_MODE: process.env.ENVIRONMENTAL_DATA_MODE || 'demo',
  GEOSPATIAL_PROVIDER: process.env.GEOSPATIAL_PROVIDER || 'sentinel-hub-simulator',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export default env;
