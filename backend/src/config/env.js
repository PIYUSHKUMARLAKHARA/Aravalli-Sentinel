import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multi-path environment configuration resolver (supports root .env and backend/.env)
const possibleEnvPaths = [
  path.resolve(__dirname, '../../.env'), // backend/.env
  path.resolve(__dirname, '../../../.env'), // root .env
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

export const env = {
  PORT: process.env.PORT || 5050,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'aravalli-sentinel-demo',
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '',
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '',
  // Forest Authority Invitation Secret Token (used strictly by trusted admins to provision official officer accounts)
  AUTHORITY_INVITE_SECRET: process.env.AUTHORITY_INVITE_SECRET || 'AravalliEnforce2025SecureToken',
  // Demo Bootstrap Administrator toggle (allows restricted pre-seeded evaluation officer in non-production environments)
  DEMO_BOOTSTRAP_ENABLED: process.env.DEMO_BOOTSTRAP_ENABLED !== 'false',
  ENVIRONMENTAL_DATA_MODE: process.env.ENVIRONMENTAL_DATA_MODE || 'demo',
  GEOSPATIAL_PROVIDER: process.env.GEOSPATIAL_PROVIDER || 'sentinel-hub-simulator',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export default env;
