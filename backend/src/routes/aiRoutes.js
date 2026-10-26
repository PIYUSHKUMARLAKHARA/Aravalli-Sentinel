import express from 'express';
import { analyzeUploadedEvidence, askAssistant } from '../controllers/aiController.js';
import { uploadEvidence } from '../middleware/upload.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze-evidence', uploadEvidence.single('evidenceImage'), analyzeUploadedEvidence);
router.post('/ask-aravalli', optionalAuth, askAssistant);

export default router;
