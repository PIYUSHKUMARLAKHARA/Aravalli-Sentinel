import { getAuth } from '../config/firebase.js';

/**
 * Authentication Middleware:
 * Inspects Authorization: Bearer <token>
 * Verifies with Firebase Auth or fallback demo token evaluator.
 */
export async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Missing or malformed Authorization header.',
    });
  }

  const token = authHeader.split('Bearer ')[1].trim();

  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);

    // Attach verified user profile to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0],
      role: decodedToken.role || 'citizen',
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token.',
      details: err.message,
    });
  }
}

/**
 * Authority Guard Middleware:
 * Verifies user has authority / enforcement officer credentials.
 * Rejects regular citizen tokens with 403 Forbidden.
 */
export function requireAuthority(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
  }

  if (req.user.role !== 'authority' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: This operation requires verified Environmental Authority or Forest Department credentials.',
    });
  }

  next();
}

/**
 * Optional Authentication: Attaches user if token present, but doesn't block guests
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split('Bearer ')[1].trim();
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0],
      role: decodedToken.role || 'citizen',
    };
  } catch (err) {
    req.user = null;
  }

  next();
}

export default {
  authenticateUser,
  requireAuthority,
  optionalAuth,
};
