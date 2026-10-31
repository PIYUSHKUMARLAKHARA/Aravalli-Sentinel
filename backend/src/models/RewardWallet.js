import mongoose from 'mongoose';

const rewardTransactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    citizenId: { type: String, required: true, index: true },
    reportId: { type: String, index: true },
    type: {
      type: String,
      enum: ['VERIFIED_REPORT', 'EVIDENCE_QUALITY_BONUS', 'ECO_CHALLENGE', 'HEALTH_CONNECT_BONUS'],
      default: 'VERIFIED_REPORT',
    },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    officerId: { type: String },
    officerName: { type: String },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const RewardTransaction =
  mongoose.models.RewardTransaction || mongoose.model('RewardTransaction', rewardTransactionSchema);

const rewardWalletSchema = new mongoose.Schema(
  {
    citizenId: { type: String, required: true, unique: true, index: true },
    citizenEmail: { type: String, index: true },
    citizenName: { type: String },
    balance: { type: Number, default: 0 },
    tier: {
      type: String,
      enum: ['Eco Scout', 'Aravalli Ranger', 'Ridge Sentinel', 'Conservation Champion'],
      default: 'Eco Scout',
    },
    verifiedReportsCount: { type: Number, default: 0 },
    badges: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: String, default: 'award' },
        description: { type: String },
        awardedAt: { type: String, default: () => new Date().toISOString() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const RewardWallet =
  mongoose.models.RewardWallet || mongoose.model('RewardWallet', rewardWalletSchema);

export default { RewardWallet, RewardTransaction };
