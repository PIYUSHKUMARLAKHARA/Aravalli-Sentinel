import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    state: { type: String, required: true, index: true },
    stateDistrict: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    radiusKm: { type: Number, default: 25 },
    score: { type: Number, required: true },
    riskLevel: { type: String, required: true, index: true },
    severity: { type: String },
    primaryThreat: { type: String },
    primaryDriver: { type: String },
    factors: { type: mongoose.Schema.Types.Mixed },
    telemetry: { type: mongoose.Schema.Types.Mixed },
    legalStatus: { type: String },
    threats: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Zone = mongoose.models.Zone || mongoose.model('Zone', zoneSchema);
export default Zone;
