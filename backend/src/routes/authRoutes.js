import express from 'express';
import { loginDemo, registerCitizen, registerAuthority, getProfile } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/login-demo', loginDemo);
router.post('/register-citizen', registerCitizen);
router.post('/register-authority', registerAuthority);
router.get('/profile', authenticateUser, getProfile);

export default router;
