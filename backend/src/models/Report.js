import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
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
      enum: ['pending', 'under_review', 'verified', 'resolved', 'rejected'],
      default: 'pending',
      index: true,
    },
    citizenId: { type: String, index: true },
    citizenEmail: { type: String },
    citizenName: { type: String },
    citizenContactRedacted: { type: Boolean, default: true },
    imageUrl: { type: String },
    fallbackImageUrl: { type: String },
    imagePath: { type: String },
    sourceType: { type: String },
    evidenceMetadata: { type: mongoose.Schema.Types.Mixed },
    evidenceAnalysis: { type: mongoose.Schema.Types.Mixed },
    riskAssessment: { type: mongoose.Schema.Types.Mixed },
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
