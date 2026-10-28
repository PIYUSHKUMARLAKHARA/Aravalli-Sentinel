import express from 'express';
import {
  getZones,
  getZoneDetails,
  recalculateRisk,
  querySatellite,
  compareSatellite,
  exportZoneObservations
} from '../controllers/zonesController.js';

const router = express.Router();

router.get('/', getZones);
router.post('/recalculate-risk', recalculateRisk);
router.post('/satellite-query', querySatellite);
router.get('/:id/satellite-comparison', compareSatellite);
router.get('/:id/export-observations', exportZoneObservations);
router.get('/:id', getZoneDetails);

export default router;
