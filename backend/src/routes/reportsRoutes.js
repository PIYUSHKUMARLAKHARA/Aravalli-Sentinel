import express from 'express';
import {
  submitReport,
  getAllReports,
  getReportById,
  updateReportStatus,
  generateIncidentDossier,
} from '../controllers/reportsController.js';
import { uploadEvidence } from '../middleware/upload.js';
import { optionalAuth, authenticateUser, requireAuthority } from '../middleware/auth.js';
import { validateCreateReport, validateUpdateStatus } from '../validators/reportValidator.js';

const router = express.Router();

// GET all reports (with optional status/category/zone filters)
router.get('/', optionalAuth, getAllReports);

// GET single report by ID
router.get('/:id', optionalAuth, getReportById);

// GET printable incident dossier
router.get('/:id/incident-dossier', optionalAuth, generateIncidentDossier);

// POST submit a new threat report with photo and location
router.post(
  '/',
  optionalAuth,
  uploadEvidence.single('evidenceImage'),
  validateCreateReport,
  submitReport
);

// PATCH update status & action notes (Authority only)
router.patch(
  '/:id/status',
  authenticateUser,
  requireAuthority,
  validateUpdateStatus,
  updateReportStatus
);

export default router;
