import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import env from './env.js';

let isFirebaseConfigured = false;
let db = null;
let storageBucket = null;

// Attempt to initialize Firebase Admin SDK
try {
  let credential = null;

  if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
  } else if (env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
    const serviceAccount = JSON.parse(fs.readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  }

  if (credential) {
    admin.initializeApp({
      credential,
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
    db = admin.firestore();
    storageBucket = admin.storage().bucket();
    isFirebaseConfigured = true;
    console.log('✅ [Firebase] Firebase Admin SDK connected to project:', env.FIREBASE_PROJECT_ID);
  } else {
    console.warn('⚠️ [Firebase] No valid service account credential provided. Initializing High-Fidelity Local Fallback Store.');
  }
} catch (err) {
  console.warn('⚠️ [Firebase] Initialization failed:', err.message, '-> Using Local Fallback Store.');
}

/**
 * Local Fallback In-Memory / File-backed Store
 * Ensures that if a user has not yet configured Firebase service accounts,
 * all CRUD, querying, audit logging, and file simulation work seamlessly.
 */
class LocalFirestoreStore {
  constructor() {
    this.collections = new Map();
  }

  _getCollection(colName) {
    if (!this.collections.has(colName)) {
      this.collections.set(colName, new Map());
    }
    return this.collections.get(colName);
  }

  collection(colName) {
    const store = this;
    const colMap = this._getCollection(colName);

    return {
      doc(docId) {
        const id = docId || uuidv4();
        return {
          id,
          async get() {
            const data = colMap.get(id);
            return {
              id,
              exists: Boolean(data),
              data: () => (data ? JSON.parse(JSON.stringify(data)) : undefined),
            };
          },
          async set(data, options = {}) {
            const current = colMap.get(id) || {};
            const next = options.merge ? { ...current, ...data } : { ...data };
            colMap.set(id, next);
            return { id };
          },
          async update(data) {
            if (!colMap.has(id)) {
              throw new Error(`Document ${id} does not exist in ${colName}`);
            }
            const current = colMap.get(id);
            const next = { ...current, ...data };
            colMap.set(id, next);
            return { id };
          },
          async delete() {
            colMap.delete(id);
            return { success: true };
          }
        };
      },
      async add(data) {
        const id = uuidv4();
        const docRef = this.doc(id);
        await docRef.set({ ...data, id });
        return { id };
      },
      async get() {
        const docs = Array.from(colMap.entries()).map(([id, data]) => ({
          id,
          exists: true,
          data: () => JSON.parse(JSON.stringify(data)),
        }));
        return {
          docs,
          empty: docs.length === 0,
          size: docs.length,
          forEach(fn) {
            docs.forEach(fn);
          }
        };
      },
      where(field, op, val) {
        // Simple chainable filter
        return {
          async get() {
            const all = Array.from(colMap.entries())
              .filter(([_, data]) => {
                if (op === '==') return data[field] === val;
                if (op === '!=') return data[field] !== val;
                if (op === 'in') return Array.isArray(val) && val.includes(data[field]);
                return true;
              })
              .map(([id, data]) => ({
                id,
                exists: true,
                data: () => JSON.parse(JSON.stringify(data)),
              }));
            return {
              docs: all,
              empty: all.length === 0,
              size: all.length,
              forEach(fn) {
                all.forEach(fn);
              }
            };
          }
        };
      }
    };
  }
}

const localDb = new LocalFirestoreStore();

export const getFirestore = () => {
  return isFirebaseConfigured ? db : localDb;
};

// In-memory token session registry for local development fallback
export const localTokenSessionStore = new Map();

export const getAuth = () => {
  if (isFirebaseConfigured) {
    return admin.auth();
  }
  return {
    async verifyIdToken(token) {
      if (!token) throw new Error('Missing token');
      if (localTokenSessionStore.has(token)) {
        return localTokenSessionStore.get(token);
      }
      // For local demo fallback, inspect mock token or demo bearer
      if (token.startsWith('demo-token-')) {
        let role = 'citizen';
        let name = 'Aarav Mehta (Citizen Sentinel)';
        if (token.includes('admin')) {
          role = 'admin';
          name = 'Chief Environmental Administrator';
        } else if (token.includes('authority')) {
          role = 'authority';
          name = 'Officer Rajesh Sharma (Forest Task Force)';
        }
        return {
          uid: 'demo-user-' + role,
          email: `${role}@aravalli.sentinel`,
          name,
          role,
        };
      }
      return {
        uid: 'demo-user-id',
        email: 'user@aravalli.sentinel',
        role: 'citizen',
      };
    },
    async setCustomUserClaims(uid, claims) {
      return true;
    },
  };
};

export const getStorageBucket = () => {
  return isFirebaseConfigured ? storageBucket : null;
};

export const isRealFirebaseConnected = () => isFirebaseConfigured;

export default {
  getFirestore,
  getAuth,
  getStorageBucket,
  isRealFirebaseConnected,
};
