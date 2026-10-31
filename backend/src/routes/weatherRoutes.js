import express from 'express';
import { getCurrentWeather } from '../controllers/weatherController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/current', optionalAuth, getCurrentWeather);

export default router;
