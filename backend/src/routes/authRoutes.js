import express from 'express';
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

router.post('/login-demo', loginDemo);
router.post('/login-citizen', loginCitizen);
router.post('/login-authority', loginAuthority);
router.post('/login-admin', loginAdmin);
router.post('/register-citizen', registerCitizen);
router.post('/register-authority', registerAuthority);
router.post('/provision-officer', registerAuthority); // Administrative alias
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateUser, getProfile);

export default router;
