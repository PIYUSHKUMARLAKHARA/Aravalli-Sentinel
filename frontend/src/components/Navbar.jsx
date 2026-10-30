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
  LayoutDashboard,
  Info,
  LogIn,
  LogOut,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const { user, isAuthority, isAdmin, switchPersona, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-aravalli-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">ARAVALLI</span>
              <span className="font-extrabold tracking-tight text-emerald-400 text-base">SENTINEL</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hidden sm:inline-block">
                AI MVP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-mono">Ecological Early-Warning & Action</p>
          </div>
        </Link>

        {/* Center Navigation Links - Role-Tailored & Unified */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              isActive('/') || isActive('/dashboard') ? 'text-white bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard</span>
          </Link>

          {isAuthority ? (
            /* Forest Authority Navigation: Dashboard, All Reports, Risk Map, Area Summary */
            <>
              <Link
                to="/admin?tab=triage"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  location.search.includes('triage') || isActive('/authority') ? 'text-amber-300 bg-amber-950/40 border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>All Reports</span>
              </Link>
              <Link
                to="/map"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive('/map') ? 'text-white bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Risk Map</span>
              </Link>
              <Link
                to="/admin?tab=telemetry"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  location.search.includes('telemetry') ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Area Summary</span>
              </Link>
            </>
          ) : (
            /* Citizen Navigation: Dashboard, Report an Issue, My Reports, Risk Map */
            <>
              <Link
                to="/report"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive('/report') ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <FileWarning className="w-3.5 h-3.5 text-emerald-400" />
                <span>Report an Issue</span>
              </Link>
              <a
                href="/#recent-reports"
                className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>My Reports</span>
              </a>
              <Link
                to="/map"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive('/map') ? 'text-white bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Risk Map</span>
              </Link>
            </>
          )}

          <Link
            to="/about"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/about') ? 'text-white bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right Section: Persona Switcher & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona / Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-850 text-xs text-slate-200 transition-colors shadow-sm"
            >
              <div className={`w-2 h-2 rounded-full ${isAuthority ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div className="text-left font-mono">
                <span className="font-semibold block truncate max-w-[110px] sm:max-w-[130px]">{user?.name || 'User'}</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                  {isAuthority ? 'Forest Authority' : 'Citizen Sentinel'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-800 mb-1">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Active Evaluation Persona</p>
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400">{user?.email}</p>
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
                      isAuthority && !isAdmin ? 'bg-amber-950/50 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Forest Authority (Officer)</span>
                    </div>
                    {isAuthority && !isAdmin && <span className="text-[10px]">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('admin');
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      isAdmin ? 'bg-purple-950/50 text-purple-300 font-semibold border border-purple-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>Super Administrator (1 of 1)</span>
                    </div>
                    {isAdmin && <span className="text-[10px]">Active</span>}
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                  {(isAuthority || isAdmin) && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-purple-300 hover:text-white hover:bg-purple-950/40 flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Admin Command Panel</span>
                    </Link>
                  )}
                  <Link
                    to="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auth & Registration Page</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out (Clear Session)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sub-bar - Role-Tailored */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/60 bg-slate-950/95 py-2 px-1 text-[11px] overflow-x-auto gap-1">
        <Link
          to="/"
          className={`px-2 py-1 rounded shrink-0 flex items-center gap-1 ${
            isActive('/') || isActive('/dashboard') ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-3 h-3" />
          <span>Dashboard</span>
        </Link>

        {isAuthority ? (
          <>
            <Link
              to="/admin?tab=triage"
              className={`px-2 py-1 rounded shrink-0 flex items-center gap-1 ${
                location.search.includes('triage') ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <span>All Reports</span>
            </Link>
            <Link
              to="/map"
              className={`px-2 py-1 rounded shrink-0 ${
                isActive('/map') ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              Map
            </Link>
            <Link
              to="/admin?tab=telemetry"
              className={`px-2 py-1 rounded shrink-0 ${
                location.search.includes('telemetry') ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              Summary
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/report"
              className={`px-2 py-1 rounded shrink-0 ${
                isActive('/report') ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              Report
            </Link>
            <a
              href="/#recent-reports"
              className="px-2 py-1 rounded shrink-0 text-slate-400 hover:text-white"
            >
              My Reports
            </a>
            <Link
              to="/map"
              className={`px-2 py-1 rounded shrink-0 ${
                isActive('/map') ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              Map
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
