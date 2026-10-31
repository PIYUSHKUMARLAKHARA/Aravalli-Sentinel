import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  loginDemo,
  loginCitizen,
  loginAuthority,
  loginAdmin,
  registerCitizen,
  registerAuthority,
  resetPassword,
  getProfile,
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Strict rate limiter for authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 auth requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

router.post('/login-demo', loginDemo);
router.post('/login-citizen', authLimiter, loginCitizen);
router.post('/login-authority', authLimiter, loginAuthority);
router.post('/login-admin', authLimiter, loginAdmin);
router.post('/register-citizen', authLimiter, registerCitizen);
router.post('/register-authority', registerAuthority);
router.post('/provision-officer', registerAuthority); // Administrative alias
router.post('/reset-password', authLimiter, resetPassword);
router.get('/profile', authenticateUser, getProfile);

export default router;
