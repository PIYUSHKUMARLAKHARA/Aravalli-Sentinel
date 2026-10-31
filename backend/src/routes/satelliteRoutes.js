import express from 'express';
import { getCaseSatelliteAnalysis, runCaseSatelliteComparison } from '../controllers/satelliteController.js';
import { authenticateUser, requireAuthority } from '../middleware/auth.js';

const router = express.Router();

// Satellite Intelligence is reserved for authorized officers and authenticated users
router.get('/analysis/:caseId', authenticateUser, getCaseSatelliteAnalysis);
router.post('/analyze/:caseId', authenticateUser, requireAuthority, runCaseSatelliteComparison);

export default router;
