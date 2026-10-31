import crypto from 'crypto';
import env from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET || 'aravalli-sentinel-jwt-secret-key-2026-production';

/**
 * Hash a plain password using salt + scrypt
 * @param {string} password
 * @returns {string} salt:hexHash
 */
export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plain password against a stored hash or legacy plaintext
 * @param {string} password - User provided plain password
 * @param {string} storedHash - Stored string (salt:hash or plaintext)
 * @returns {boolean}
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  // Handle standard salt:hash format
  if (storedHash.includes(':')) {
    const [salt, expectedHash] = storedHash.split(':');
    if (!salt || !expectedHash) return false;
    try {
      const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(
        Buffer.from(computedHash, 'hex'),
        Buffer.from(expectedHash, 'hex')
      );
    } catch {
      return false;
    }
  }

  // Fallback constant-time check for legacy seed plaintext passwords
  const a = Buffer.from(password);
  const b = Buffer.from(storedHash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Helper to encode URL-safe Base64
 */
function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64url');
}

/**
 * Helper to decode URL-safe Base64
 */
function base64UrlDecode(str) {
  return Buffer.from(str, 'base64url').toString('utf8');
}

/**
 * Sign a standard JSON Web Token (JWT) with HMAC-SHA256
 * @param {object} payload
 * @param {number} expiresInSeconds (default: 86400 = 24h)
 * @returns {string}
 */
export function signJWT(payload, expiresInSeconds = 86400) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed JWT
 * @param {string} token
 * @returns {object} decoded payload
 */
export function verifyJWT(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Missing token');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed JWT token structure');
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    throw new Error('Invalid JWT signature');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error('JWT token has expired');
  }

  return payload;
}

export default {
  hashPassword,
  verifyPassword,
  signJWT,
  verifyJWT,
};
