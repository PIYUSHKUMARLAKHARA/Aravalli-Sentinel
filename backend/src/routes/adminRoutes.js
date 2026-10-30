import express from 'express';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import {
  getOfficers,
  updateOfficerPermissions,
  provisionOfficer,
  deleteOfficer,
  getSystemStats,
} from '../controllers/adminController.js';

const router = express.Router();

// Guard all admin routes: only accessible by the single Super Administrator
router.use(authenticateUser, requireAdmin);

router.get('/officers', getOfficers);
router.patch('/officers/:uid/permissions', updateOfficerPermissions);
router.post('/officers/provision', provisionOfficer);
router.delete('/officers/:uid', deleteOfficer);
router.get('/system-stats', getSystemStats);

export default router;
