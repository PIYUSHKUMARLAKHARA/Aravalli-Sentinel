import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AccessDeniedPage() {
  const { user, switchPersona } = useAuth();
  const navigate = useNavigate();

  const handleQuickSwitchToOfficer = async () => {
    await switchPersona('authority');
    navigate('/admin?tab=triage');
  };

  return (
    <div className="max-w-xl mx-auto my-16 px-4">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />

        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-rose-400 font-bold tracking-wider">
            RESTRICTED GOVERNMENT SECTOR — 403 FORBIDDEN
          </span>
          <h1 className="text-2xl font-extrabold text-white">Forest Authority Access Required</h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            The Forest Authority Triage Console and Legal Incident Dossiers are restricted to verified Divisional Forest Officers and Mining Task Force officials under the Forest Conservation Act and Aravalli Protection Directives.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs font-mono space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Current Active User:</span>
            <span className="text-white font-bold">{user?.name || 'Unauthenticated'}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Assigned Role:</span>
            <span className="text-amber-400 uppercase font-semibold">{user?.role || 'Guest'}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Required Clearance:</span>
            <span className="text-rose-400 font-bold">AUTHORITY / ADMIN</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleQuickSwitchToOfficer}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            <span>Switch to Demo Officer Rajesh Sharma (Evaluator Access)</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Citizen Dashboard</span>
            </Link>
            <Link
              to="/login"
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center transition-colors"
            >
              <span>Officer Login Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
