import { z } from 'zod';

export const VALID_CATEGORIES = [
  'Illegal Mining & Quarrying',
  'Illegal Mining',
  'Suspected illegal mining or excavation',
  'Deforestation / Tree Felling',
  'Deforestation',
  'Vegetation loss',
  'Forest damage',
  'Encroachment & Construction',
  'Encroachment',
  'Toxic Waste Dumping',
  'Toxic Dumping',
  'Ground Water Depletion / Deep Boring',
  'Water Stress',
  'Land Degradation',
  'Other Ecological Threat',
  'Other environmental concern',
  'Other',
];

export const ThreatCategoryEnum = z.string().refine(
  (val) => VALID_CATEGORIES.some(cat => cat.toLowerCase() === val.toLowerCase().trim()),
  { message: `Invalid threat category. Expected one of: ${VALID_CATEGORIES.slice(0, 6).join(', ')}...` }
);

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
  status: z.string().transform(v => v.toLowerCase().trim()).pipe(
    z.enum(['pending', 'under_review', 'verified', 'resolved', 'rejected'])
  ),
  actionNotes: z.string().min(5, 'Action notes must provide at least 5 characters of context for the audit trail.').max(1000),
  assignedOfficer: z.string().optional(),
});

export const authorityInviteSchema = z.object({
  email: z.string().email('Please provide a valid official government or agency email address.'),
  fullName: z.string().min(2, 'Officer full name must be at least 2 characters.'),
  department: z.string().min(2, 'Department or agency name is required.'),
  designation: z.string().min(2, 'Officer designation is required.'),
  inviteSecret: z.string().min(1, 'Authority invite secret is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.').optional(),
});

export const authorityLoginSchema = z.object({
  email: z.string().email('Please provide a valid official email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
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
  authorityLoginSchema,
  validateCreateReport,
  validateUpdateStatus,
};
