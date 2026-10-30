import mongoose from 'mongoose';

const officerSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'authority' },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    badge: { type: String, default: 'Authorized Enforcement Officer' },
    token: { type: String },
    isDemoBootstrap: { type: Boolean, default: false },
    verifiedAt: { type: String },
    permissions: {
      canVerifyIncidents: { type: Boolean, default: true },
      canUpdateStatus: { type: Boolean, default: true },
      canDispatchPatrols: { type: Boolean, default: true },
      canExportDossiers: { type: Boolean, default: true },
      isActive: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Officer = mongoose.models.Officer || mongoose.model('Officer', officerSchema);
export default Officer;
