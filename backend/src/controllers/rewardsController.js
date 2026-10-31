import { v4 as uuidv4 } from 'uuid';
import { RewardWallet, RewardTransaction } from '../models/RewardWallet.js';
import { isMongoDBConnected } from '../config/db.js';

// In-memory fallback for local demo and test resilience
const inMemoryWallets = new Map();
const inMemoryTransactions = [];

function getOrCreateInMemoryWallet(citizenId, citizenEmail, citizenName) {
  if (!inMemoryWallets.has(citizenId)) {
    inMemoryWallets.set(citizenId, {
      citizenId,
      citizenEmail: citizenEmail || 'citizen@example.com',
      citizenName: citizenName || 'Aarav Mehta',
      balance: 125,
      tier: 'Eco Scout',
      verifiedReportsCount: 1,
      badges: [
        {
          id: 'badge-welcome',
          name: 'Registered Sentinel',
          icon: 'shield',
          description: 'Joined the Aravalli Ecological Early-Warning Network.',
          awardedAt: '2026-10-15T10:00:00Z',
        },
        {
          id: 'badge-first-verified',
          name: 'Verified Informant',
          icon: 'check-circle',
          description: 'First environmental threat report verified by Forest Department.',
          awardedAt: '2026-10-20T14:30:00Z',
        },
      ],
    });

    inMemoryTransactions.push({
      id: 'tx-init-001',
      citizenId,
      reportId: 'rep-aravalli-2026-001',
      type: 'VERIFIED_REPORT',
      points: 100,
      description: 'Report verified by DFO Rajesh Sharma (Gurugram Forest Division).',
      officerId: 'officer-01',
      officerName: 'DFO Rajesh Sharma',
      timestamp: '2026-10-20T14:30:00Z',
    });

    inMemoryTransactions.push({
      id: 'tx-init-002',
      citizenId,
      reportId: 'rep-aravalli-2026-001',
      type: 'EVIDENCE_QUALITY_BONUS',
      points: 25,
      description: 'High-resolution photographic evidence with accurate GPS coordinates.',
      officerId: 'officer-01',
      officerName: 'DFO Rajesh Sharma',
      timestamp: '2026-10-20T14:30:00Z',
    });
  }

  return inMemoryWallets.get(citizenId);
}

/**
 * Get authenticated citizen's Environmental Contribution Points wallet
 */
export async function getCitizenWallet(req, res) {
  try {
    const citizenId = req.user?.uid || 'demo-citizen-01';
    const citizenEmail = req.user?.email || 'citizen@example.com';
    const citizenName = req.user?.name || 'Aarav Mehta';

    if (isMongoDBConnected()) {
      let wallet = await RewardWallet.findOne({ citizenId });
      if (!wallet) {
        wallet = await RewardWallet.create({
          citizenId,
          citizenEmail,
          citizenName,
          balance: 0,
          tier: 'Eco Scout',
          verifiedReportsCount: 0,
          badges: [
            {
              id: 'badge-welcome',
              name: 'Registered Sentinel',
              icon: 'shield',
              description: 'Joined the Aravalli Ecological Protection Network.',
              awardedAt: new Date().toISOString(),
            },
          ],
        });
      }

      const transactions = await RewardTransaction.find({ citizenId }).sort({ createdAt: -1 });

      return res.json({
        success: true,
        wallet,
        transactions,
        notice: 'Points are official non-monetary recognition for verified grassroots ecological protection.',
      });
    }

    // In-Memory Fallback
    const wallet = getOrCreateInMemoryWallet(citizenId, citizenEmail, citizenName);
    const transactions = inMemoryTransactions.filter((tx) => tx.citizenId === citizenId);

    return res.json({
      success: true,
      wallet,
      transactions,
      notice: 'Points are official non-monetary recognition for verified grassroots ecological protection.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Award points when an authorized Forest Authority officer verifies a report
 */
export async function awardPointsForVerification(report, officerUser) {
  if (!report || report.pointsAwarded) {
    return { awarded: false, reason: 'Already awarded or invalid report' };
  }

  const citizenId = report.citizenId || 'demo-citizen-01';
  const officerName = officerUser?.name || 'Authorized Forest Officer';
  const officerId = officerUser?.uid || 'officer-01';

  const basePoints = 100;
  const hasMedia = Boolean(report.imageUrl || report.videoUrl);
  const evidenceBonus = hasMedia ? 25 : 0;
  const totalPoints = basePoints + evidenceBonus;

  if (isMongoDBConnected()) {
    try {
      let wallet = await RewardWallet.findOne({ citizenId });
      if (!wallet) {
        wallet = await RewardWallet.create({
          citizenId,
          citizenEmail: report.citizenEmail || 'citizen@example.com',
          citizenName: report.citizenName || 'Citizen Sentinel',
          balance: 0,
          tier: 'Eco Scout',
          verifiedReportsCount: 0,
          badges: [],
        });
      }

      wallet.balance += totalPoints;
      wallet.verifiedReportsCount = (wallet.verifiedReportsCount || 0) + 1;

      // Update Tier
      if (wallet.balance >= 1000) wallet.tier = 'Conservation Champion';
      else if (wallet.balance >= 500) wallet.tier = 'Ridge Sentinel';
      else if (wallet.balance >= 250) wallet.tier = 'Aravalli Ranger';
      else wallet.tier = 'Eco Scout';

      // Check badges
      const hasVerifiedBadge = wallet.badges.some((b) => b.id === 'badge-first-verified');
      if (!hasVerifiedBadge) {
        wallet.badges.push({
          id: 'badge-first-verified',
          name: 'Verified Informant',
          icon: 'check-circle',
          description: 'First environmental threat report verified by Forest Department.',
          awardedAt: new Date().toISOString(),
        });
      }

      await wallet.save();

      // Create transaction
      await RewardTransaction.create({
        id: `tx-${uuidv4().slice(0, 8)}`,
        citizenId,
        reportId: report.id,
        type: 'VERIFIED_REPORT',
        points: totalPoints,
        description: `Case ${report.id} verified by ${officerName}. Points credited for actionable evidence.`,
        officerId,
        officerName,
      });

      return { awarded: true, points: totalPoints, newBalance: wallet.balance };
    } catch (err) {
      console.error('Failed to credit rewards in DB:', err);
    }
  }

  // Fallback in-memory
  const wallet = getOrCreateInMemoryWallet(citizenId, report.citizenEmail, report.citizenName);
  wallet.balance += totalPoints;
  wallet.verifiedReportsCount = (wallet.verifiedReportsCount || 0) + 1;

  inMemoryTransactions.unshift({
    id: `tx-${uuidv4().slice(0, 8)}`,
    citizenId,
    reportId: report.id,
    type: 'VERIFIED_REPORT',
    points: totalPoints,
    description: `Case ${report.id} verified by ${officerName}. Points credited for actionable evidence.`,
    officerId,
    officerName,
    timestamp: new Date().toISOString(),
  });

  return { awarded: true, points: totalPoints, newBalance: wallet.balance };
}

/**
 * Claim Community Eco Challenge or Optional Health Connect walk
 */
export async function claimChallengeReward(req, res) {
  try {
    const { challengeId, stepsCount } = req.body;
    const citizenId = req.user?.uid || 'demo-citizen-01';

    const points = stepsCount && stepsCount >= 5000 ? 50 : 25;
    const description = stepsCount
      ? `Aravalli Eco Walk Completed (${stepsCount} steps recorded via Health Connect Bridge).`
      : 'Weekly Community Ridge Vigilance challenge completed.';

    if (isMongoDBConnected()) {
      let wallet = await RewardWallet.findOne({ citizenId });
      if (wallet) {
        wallet.balance += points;
        await wallet.save();
        await RewardTransaction.create({
          id: `tx-${uuidv4().slice(0, 8)}`,
          citizenId,
          type: stepsCount ? 'HEALTH_CONNECT_BONUS' : 'ECO_CHALLENGE',
          points,
          description,
          officerName: 'Automated Sentinel Challenge Engine',
        });
      }
    } else {
      const wallet = getOrCreateInMemoryWallet(citizenId);
      wallet.balance += points;
      inMemoryTransactions.unshift({
        id: `tx-${uuidv4().slice(0, 8)}`,
        citizenId,
        type: stepsCount ? 'HEALTH_CONNECT_BONUS' : 'ECO_CHALLENGE',
        points,
        description,
        officerName: 'Automated Sentinel Challenge Engine',
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      pointsClaimed: points,
      message: `${points} Environmental Contribution Points added to your wallet!`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  getCitizenWallet,
  awardPointsForVerification,
  claimChallengeReward,
};
