import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Smartphone,
  Info,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Footprints,
  Clock,
  User,
  ShieldAlert,
} from 'lucide-react';
import { fetchRewardWallet, claimChallengeReward } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function RewardWalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const res = await fetchRewardWallet();
      if (res.success && res.wallet) {
        setWallet(res.wallet);
        setTransactions(res.transactions || []);
      }
    } catch (err) {
      console.warn('Could not load wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateChallengeClaim = async () => {
    setClaiming(true);
    setClaimStatus(null);
    try {
      const res = await claimChallengeReward('ridge-walk-01', 6240);
      if (res.success) {
        setClaimStatus({
          type: 'success',
          message: `Successfully verified 6,240 steps! +${res.pointsAwarded} Environmental Points credited to your wallet.`,
        });
        await loadWallet();
      } else {
        setClaimStatus({ type: 'error', message: res.error || 'Failed to claim challenge reward.' });
      }
    } catch (err) {
      setClaimStatus({ type: 'error', message: err.message });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#DCC8A3] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFE4] text-[#1B5E3B] text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Environmental Contribution & Stewardship System</span>
            </div>
            <h1 className="text-3xl font-black text-[#26382D] tracking-tight">
              Environmental Points Wallet
            </h1>
            <p className="text-sm text-[#526A59] leading-relaxed">
              Points are awarded strictly when Forest Authority officers verify your submitted reports or when you participate in authorized eco-walk surveillance.
            </p>
          </div>

          {/* Balance Display Pill */}
          <div className="bg-gradient-to-br from-[#1B5E3B] to-[#2E8B57] p-6 rounded-3xl text-white shadow-md text-right min-w-[200px] shrink-0">
            <span className="text-xs uppercase font-mono tracking-wider text-[#DCC8A3] font-bold block">
              Verified Balance
            </span>
            <div className="text-4xl font-black font-mono mt-1">
              {loading ? '...' : (wallet?.balance ?? 0)}
              <span className="text-sm font-sans font-normal ml-1">pts</span>
            </div>
            <span className="text-[11px] text-white/80 block mt-1">
              Tier: <strong className="text-white">{wallet?.tier || 'Eco Scout'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Current Tier</span>
          <div className="text-xl font-bold text-[#1B5E3B]">{wallet?.tier || 'Eco Scout'}</div>
          <p className="text-[11px] text-[#526A59]">Higher tiers unlock community recognition & certs</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Verified Reports</span>
          <div className="text-xl font-bold text-[#26382D]">
            {wallet?.verifiedReportsCount ?? 0}
          </div>
          <p className="text-[11px] text-[#526A59]">Official cases verified by DFO / Forest Authority</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Stewardship Badges</span>
          <div className="text-xl font-bold text-[#806044]">
            {wallet?.badges?.length ?? 0} Earned
          </div>
          <p className="text-[11px] text-[#526A59]">Milestone badges for Aravalli conservation</p>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-3xl border border-[#DCC8A3] p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#26382D] uppercase tracking-wider font-mono">
          Earned Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wallet?.badges && wallet.badges.length > 0 ? (
            wallet.badges.map((badge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-[#A3B18A]/60 bg-[#F5F7F0] space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#DCC8A3] text-[#1B5E3B] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5 text-[#2E8B57]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#26382D]">{badge.name}</h4>
                    <span className="text-[10px] font-mono text-[#526A59]">
                      {new Date(badge.awardedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#526A59]">{badge.description}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#526A59] col-span-3">No badges awarded yet.</p>
          )}
        </div>
      </div>

      {/* Transaction History & Points Ledger */}
      <div className="bg-white rounded-3xl border border-[#DCC8A3] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#26382D] uppercase tracking-wider font-mono">
            Points Ledger & Audit Trail
          </h2>
          <span className="text-xs text-[#526A59] font-mono">
            Enforced by Forest Authority Backend
          </span>
        </div>

        {transactions.length > 0 ? (
          <div className="divide-y divide-[#DCC8A3]/50">
            {transactions.map((tx, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#26382D]">
                    <span className="font-mono text-[#1B5E3B]">{tx.reportId || 'Challenge'}</span>
                    <span>•</span>
                    <span>{tx.description}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#526A59]">
                    <span>Verified By: {tx.officerName || 'Forest Authority'}</span>
                    <span>•</span>
                    <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A]">
                    +{tx.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#526A59] py-4">No point transactions recorded yet.</p>
        )}
      </div>

      {/* Android Health Connect Section */}
      <div className="bg-gradient-to-br from-[#EAEFE4] to-[#F5F7F0] rounded-3xl border-2 border-[#A3B18A] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#A3B18A] text-[#1B5E3B] flex items-center justify-center shadow-xs">
              <Smartphone className="w-6 h-6 text-[#1B5E3B]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#26382D]">
                Android Health Connect Integration Architecture
              </h3>
              <p className="text-xs text-[#526A59]">
                Eco-Walk Patrols & Citizen Ground-Truthing Challenges
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white text-[#1B5E3B] border border-[#A3B18A] font-mono text-xs font-bold self-start sm:self-auto">
            Android 14+ Ready
          </span>
        </div>

        {/* Technical Architecture Disclosure */}
        <div className="bg-white/80 p-4 rounded-2xl border border-[#DCC8A3] text-xs text-[#526A59] space-y-2 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#26382D] font-bold">
            <Info className="w-4 h-4 text-[#1B5E3B]" />
            <span>Browser Sandbox Disclosure</span>
          </div>
          <p>
            Web applications running in modern mobile and desktop browsers cannot directly bind to Google Android's native <code className="bg-[#EAEFE4] px-1 py-0.5 rounded font-mono text-[#1B5E3B]">androidx.health.connect.client</code> APIs due to OS sandbox constraints. In production, our native Android companion app requests the granular <code className="bg-[#EAEFE4] px-1 py-0.5 rounded font-mono text-[#1B5E3B]">READ_STEPS</code> permission to sync walking activity during designated Aravalli Ridge cleanups.
          </p>
        </div>

        {/* Eco-Challenge Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#A3B18A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Footprints className="w-5 h-5 text-[#2E8B57]" />
              <h4 className="text-sm font-bold text-[#26382D]">
                Aravalli Ridge Patrol: Bandhwari Escarpment Walk
              </h4>
            </div>
            <p className="text-xs text-[#526A59]">
              Patrol at least 5,000 steps along the ridge periphery to deter illegal night dumping.
            </p>
            <div className="text-[11px] font-mono text-[#1B5E3B] font-bold">
              Target: 5,000 Steps • Reward: +50 Stewardship Points
            </div>
          </div>

          <button
            onClick={handleSimulateChallengeClaim}
            disabled={claiming}
            className="py-2.5 px-5 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#DCC8A3]" />
            <span>{claiming ? 'Verifying Steps...' : 'Simulate Health Connect Sync'}</span>
          </button>
        </div>

        {claimStatus && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              claimStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {claimStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{claimStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RewardWalletPage;