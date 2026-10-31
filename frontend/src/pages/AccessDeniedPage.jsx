import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';
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
      <div className="bg-white border-2 border-red-200 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-red-600 font-bold tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
            RESTRICTED GOVERNMENT PORTAL — 403 FORBIDDEN
          </span>
          <h1 className="text-2xl font-black text-[#26382D]">Access Denied — Authorized Forest Authority Officers Only.</h1>
          <p className="text-sm text-[#526A59] max-w-md mx-auto leading-relaxed">
            The Forest Authority Triage Console and Legal Incident Dossiers are strictly restricted to verified Divisional Forest Officers and Mining Task Force officials under the Forest Conservation Act and Aravalli Protection Directives.
          </p>
        </div>

        <div className="bg-[#F5F7F0] p-4 rounded-2xl border border-[#DCC8A3] text-left text-xs font-mono space-y-2">
          <div className="flex justify-between text-[#526A59]">
            <span>Current Active User:</span>
            <span className="text-[#26382D] font-bold">{user?.name || 'Unauthenticated'}</span>
          </div>
          <div className="flex justify-between text-[#526A59]">
            <span>Assigned Role:</span>
            <span className="text-[#806044] uppercase font-semibold">{user?.role || 'Guest'}</span>
          </div>
          <div className="flex justify-between text-[#526A59]">
            <span>Required Clearance:</span>
            <span className="text-red-600 font-bold">AUTHORITY / ADMIN</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleQuickSwitchToOfficer}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Switch to Authorized Officer Persona (DFO Rajesh Sharma)</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-[#F5F7F0] text-[#26382D] border border-[#DCC8A3] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Citizen Portal</span>
            </Link>

            <Link
              to="/login"
              className="flex-1 py-3 px-4 rounded-xl bg-[#EAEFE4] hover:bg-[#D5E2CC] text-[#1B5E3B] border border-[#A3B18A] font-bold text-xs flex items-center justify-center transition-colors"
            >
              <span>Officer Login Screen</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPage;