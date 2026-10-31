import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String },
    threatCategory: { type: String, required: true, index: true },
    description: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationName: { type: String, required: true },
    zoneId: { type: String, index: true },
    zoneName: { type: String },
    incidentTime: { type: String },
    status: {
      type: String,
      enum: [
        'submitted',
        'pending',
        'under_review',
        'verified',
        'under_investigation',
        'investigation_in_progress',
        'action_taken',
        'resolved',
        'rejected',
        'invalid',
        'needs_more_information',
      ],
      default: 'submitted',
      index: true,
    },
    resolution: {
      summary: { type: String },
      actionTaken: { type: String },
      officerRemarks: { type: String },
      resolvedBy: { type: String },
      resolvedAt: { type: String },
    },
    lastUpdatedDate: { type: String },
    citizenId: { type: String, index: true },
    citizenEmail: { type: String },
    citizenName: { type: String },
    citizenContactRedacted: { type: Boolean, default: true },
    imageUrl: { type: String },
    videoUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video', 'audio'], default: 'image' },
    voiceTranscript: { type: String },
    fallbackImageUrl: { type: String },
    imagePath: { type: String },
    sourceType: { type: String },
    evidenceMetadata: { type: mongoose.Schema.Types.Mixed },
    evidenceAnalysis: { type: mongoose.Schema.Types.Mixed },
    riskAssessment: { type: mongoose.Schema.Types.Mixed },
    satelliteAnalysis: { type: mongoose.Schema.Types.Mixed },
    weatherSnapshot: { type: mongoose.Schema.Types.Mixed },
    pointsAwarded: { type: Boolean, default: false },
    internalNotes: [
      {
        note: { type: String, required: true },
        officerId: { type: String },
        officerName: { type: String },
        timestamp: { type: String, default: () => new Date().toISOString() },
      },
    ],
    auditTrail: [
      {
        action: { type: String },
        by: { type: String },
        role: { type: String },
        department: { type: String },
        timestamp: { type: String },
        notes: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
