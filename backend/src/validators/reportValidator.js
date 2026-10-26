import { z } from 'zod';

export const ThreatCategoryEnum = z.enum([
  'Illegal Mining & Quarrying',
  'Deforestation / Tree Felling',
  'Encroachment & Construction',
  'Toxic Waste Dumping',
  'Ground Water Depletion / Deep Boring',
  'Other Ecological Threat',
]);

export const createReportSchema = z.object({
  threatCategory: ThreatCategoryEnum,
  description: z.string()
    .min(10, 'Description must be at least 10 characters long to provide actionable context.')
    .max(2000, 'Description cannot exceed 2000 characters.'),
  latitude: z.coerce.number().min(-90).max(90, 'Latitude must be between -90 and 90.'),
  longitude: z.coerce.number().min(-180).max(180, 'Longitude must be between -180 and 180.'),
  locationName: z.string().min(2, 'Location name or landmark is required.').max(200),
  zoneId: z.string().optional(),
  incidentTime: z.string().optional(),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(['pending', 'under_review', 'verified', 'resolved', 'rejected']),
  actionNotes: z.string().min(5, 'Action notes must provide at least 5 characters of context for the audit trail.').max(1000),
  assignedOfficer: z.string().optional(),
});

export const authorityInviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  department: z.string().min(2),
  designation: z.string().min(2),
  inviteSecret: z.string().min(1, 'Authority invite secret is required.'),
});

export function validateCreateReport(req, res, next) {
  try {
    const validated = createReportSchema.parse(req.body);
    req.validatedBody = validated;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for submitted threat report',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
}

export function validateUpdateStatus(req, res, next) {
  try {
    const validated = updateReportStatusSchema.parse(req.body);
    req.validatedBody = validated;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for status update',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
}

export default {
  createReportSchema,
  updateReportStatusSchema,
  authorityInviteSchema,
  validateCreateReport,
  validateUpdateStatus,
};
