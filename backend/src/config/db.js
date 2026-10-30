import mongoose from 'mongoose';
import env from './env.js';

let isConnected = false;

/**
 * Connects to MongoDB database using Mongoose
 * If MONGODB_URI is provided, connects to MongoDB.
 * If omitted or connection fails, falls back gracefully to local in-memory store.
 */
export async function connectDB() {
  if (!env.MONGODB_URI) {
    console.log('ℹ️ [MongoDB] No MONGODB_URI configured in .env. Running with High-Fidelity Local Development Store.');
    console.log('   (To connect MongoDB, add MONGODB_URI=mongodb://localhost:27017/aravalli_sentinel or MongoDB Atlas URI to backend/.env)');
    return false;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Timeout after 3 seconds if local Mongo not reachable
    });

    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ [MongoDB] Connection failed (${err.message}). Defaulting to High-Fidelity Local Development Store.`);
    return false;
  }
}

export function isMongoDBConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getDatabaseStatus() {
  if (isMongoDBConnected()) {
    return {
      type: 'MongoDB',
      status: 'CONNECTED',
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
    };
  }

  return {
    type: 'Local Fallback Store',
    status: 'ONLINE',
    mode: env.MONGODB_URI ? 'MongoDB Disconnected (Fallback Active)' : 'In-Memory / File-Backed Dev Store',
    hint: 'Configure MONGODB_URI in backend/.env to activate live MongoDB Atlas / local database',
  };
}

export default {
  connectDB,
  isMongoDBConnected,
  getDatabaseStatus,
};
