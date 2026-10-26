import express from 'express';
import { getZones, getZoneDetails, recalculateRisk } from '../controllers/zonesController.js';

const router = express.Router();

router.get('/', getZones);
router.get('/:id', getZoneDetails);
router.post('/recalculate-risk', recalculateRisk);

export default router;
