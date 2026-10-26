import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  FileWarning,
  FileText,
  MessageSquare,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const { user, isAuthority, switchPersona } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-aravalli-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg">ARAVALLI</span>
              <span className="font-extrabold tracking-tight text-emerald-400 text-lg">SENTINEL</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                AI MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-mono">Ecological Early-Warning & Action</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg transition-colors ${
              isActive('/') ? 'text-white bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/map"
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              isActive('/map') ? 'text-white bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Risk Map</span>
          </Link>
          <Link
            to="/report"
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              isActive('/report') ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30' : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-950/30'
            }`}
          >
            <FileWarning className="w-4 h-4" />
            <span>Report Threat</span>
          </Link>
          <Link
            to="/authority"
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              isActive('/authority') ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30' : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/30'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Authority Triage</span>
            {isAuthority && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </Link>
          <Link
            to="/ask"
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              isActive('/ask') ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-cyan-400/90 hover:text-cyan-300 hover:bg-cyan-950/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Ask Aravalli</span>
          </Link>
        </nav>

        {/* Right Section: Persona Switcher & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          {/* Persona / Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-850 text-xs text-slate-200 transition-colors shadow-sm"
            >
              <div className={`w-2 h-2 rounded-full ${isAuthority ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div className="text-left font-mono">
                <span className="font-semibold block truncate max-w-[130px]">{user?.name || 'User'}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {isAuthority ? 'Forest Authority' : 'Citizen Sentinel'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-800 mb-1">
                  <p className="text-[11px] text-slate-400 uppercase font-mono">Active Evaluation Persona</p>
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      switchPersona('citizen');
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      !isAuthority ? 'bg-emerald-950/50 text-emerald-300 font-semibold border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Citizen Sentinel (Public)</span>
                    </div>
                    {!isAuthority && <span className="text-[10px]">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('authority');
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      isAuthority ? 'bg-amber-950/50 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Forest Authority (Officer)</span>
                    </div>
                    {isAuthority && <span className="text-[10px]">Active</span>}
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 px-2 leading-relaxed">
                  Toggle personas instantly to test both citizen report submission and official case triage.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 bg-slate-950/95 py-2 px-2 text-xs">
        <Link to="/" className={`px-2 py-1 rounded ${isActive('/') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>Overview</Link>
        <Link to="/map" className={`px-2 py-1 rounded ${isActive('/map') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>Map</Link>
        <Link to="/report" className={`px-2 py-1 rounded ${isActive('/report') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>Report</Link>
        <Link to="/authority" className={`px-2 py-1 rounded ${isActive('/authority') ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>Authority</Link>
        <Link to="/ask" className={`px-2 py-1 rounded ${isActive('/ask') ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>Ask AI</Link>
      </div>
    </header>
  );
}

export default Navbar;
