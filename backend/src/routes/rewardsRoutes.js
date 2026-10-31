import express from 'express';
import { getCitizenWallet, claimChallengeReward } from '../controllers/rewardsController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/wallet', authenticateUser, getCitizenWallet);
router.post('/claim', authenticateUser, claimChallengeReward);

export default router;
