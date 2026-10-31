import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    citizenId: { type: String, required: true, index: true },
    citizenEmail: { type: String, index: true },
    reportId: { type: String, required: true, index: true },
    reportTitle: { type: String },
    type: {
      type: String,
      enum: ['status_update', 'case_resolved', 'case_under_review', 'action_taken', 'general'],
      default: 'status_update',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true },
    read: { type: Boolean, default: false },
    resolution: {
      summary: { type: String },
      actionTaken: { type: String },
      officerRemarks: { type: String },
      resolvedBy: { type: String },
      resolvedAt: { type: String },
    },
    officerRemarks: { type: String },
    updatedBy: { type: String, default: 'Authorized Forest Officer' },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
