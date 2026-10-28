import express from 'express';
import {
  loginDemo,
  loginCitizen,
  registerCitizen,
  registerAuthority,
  resetPassword,
  getProfile,
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/login-demo', loginDemo);
router.post('/login-citizen', loginCitizen);
router.post('/register-citizen', registerCitizen);
router.post('/register-authority', registerAuthority);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateUser, getProfile);

export default router;
