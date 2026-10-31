import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import brandLogo from '../assets/images/aravalli-sentinel-logo.png';
import {
  ShieldAlert,
  MapPin,
  FileWarning,
  Award,
  Search,
  ChevronDown,
  Layers,
  LayoutDashboard,
  LogIn,
  LogOut,
  Lock,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const { user, isAuthority, isAdmin, switchPersona, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DCC8A3]/70 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to={user ? (isAuthority ? '/admin' : '/dashboard') : '/login'} className="flex items-center gap-3 group shrink-0">
          <img
            src={brandLogo}
            alt="Aravalli Sentinel Logo"
            className="w-10 h-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-[#1B5E3B] text-base">ARAVALLI</span>
              <span className="font-extrabold tracking-tight text-[#2E8B57] text-base">SENTINEL</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A]/50 font-bold hidden sm:inline-block">
                2.0 AI
              </span>
            </div>
            <p className="text-[10px] text-[#526A59] hidden sm:block font-medium">Ecological Early-Warning & Action</p>
          </div>
        </Link>

        {/* Center Navigation Links - Role-Tailored */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          {!user ? (
            /* Unauthenticated Visitor: Strict minimal navigation */
            <>
              <Link
                to="/login"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/login') || isActive('/')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-[#1B5E3B]" />
                <span>Portal Login</span>
              </Link>
              <Link
                to="/track"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/track')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-[#2E8B57]" />
                <span>Track Case</span>
              </Link>
              <Link
                to="/about"
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  isActive('/about')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                About Platform
              </Link>
            </>
          ) : isAuthority ? (
            /* Forest Authority Navigation */
            <>
              <Link
                to="/admin?tab=triage"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  location.search.includes('triage') || isActive('/admin')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#1B5E3B]" />
                <span>Triage Console</span>
              </Link>
              <Link
                to="/map"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/map')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#2E8B57]" />
                <span>Risk Map</span>
              </Link>
              <Link
                to="/admin?tab=satellite"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  location.search.includes('satellite')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#2E8B57]" />
                <span>Sentinel-2 NDVI</span>
              </Link>
              <Link
                to="/admin?tab=telemetry"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  location.search.includes('telemetry')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#806044]" />
                <span>Weather & Telemetry</span>
              </Link>
              <Link
                to="/about"
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  isActive('/about')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                About
              </Link>
            </>
          ) : (
            /* Citizen Navigation */
            <>
              <Link
                to="/dashboard"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/dashboard') || isActive('/')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#1B5E3B]" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/report"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/report')
                    ? 'text-white bg-[#1B5E3B] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <FileWarning className="w-3.5 h-3.5 text-[#DCC8A3]" />
                <span>Report Threat</span>
              </Link>
              <Link
                to="/track"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/track')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-[#2E8B57]" />
                <span>Track Case</span>
              </Link>
              <Link
                to="/rewards"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/rewards')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#806044]" />
                <span>Eco-Points</span>
              </Link>
              <Link
                to="/map"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive('/map')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#2E8B57]" />
                <span>Risk Map</span>
              </Link>
              <Link
                to="/about"
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  isActive('/about')
                    ? 'text-[#1B5E3B] bg-[#EAEFE4] font-bold shadow-xs'
                    : 'text-[#26382D] hover:text-[#1B5E3B] hover:bg-[#F5F7F0]'
                }`}
              >
                About
              </Link>
            </>
          )}
        </nav>

        {/* Right Section: Persona Switcher or Login Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            /* Persona / User Profile Pill */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#DCC8A3] bg-white hover:bg-[#F5F7F0] text-xs text-[#26382D] transition-colors shadow-xs"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${isAuthority ? 'bg-[#D97706]' : 'bg-[#1B5E3B]'}`} />
                <div className="text-left font-mono">
                  <span className="font-bold block truncate max-w-[110px] sm:max-w-[140px] text-[#26382D]">{user?.name || 'User'}</span>
                  <span className="text-[9px] text-[#526A59] uppercase tracking-wider block font-semibold">
                    {isAdmin ? 'Super Admin' : isAuthority ? 'Forest Officer' : 'Citizen Sentinel'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#526A59] ml-0.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#DCC8A3] bg-white p-2.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-[#DCC8A3]/50 mb-1.5">
                    <p className="text-[10px] text-[#526A59] uppercase font-mono font-bold">Active Account</p>
                    <p className="text-xs font-bold text-[#26382D] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#526A59]">{user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-mono text-[#526A59] uppercase font-semibold">
                      Evaluator Persona Switch
                    </div>
                    <button
                      onClick={() => {
                        switchPersona('citizen');
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        !isAuthority ? 'bg-[#EAEFE4] text-[#1B5E3B] font-bold border border-[#A3B18A]/60' : 'text-[#26382D] hover:bg-[#F5F7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1B5E3B]" />
                        <span>Citizen Sentinel</span>
                      </div>
                      {!isAuthority && <span className="text-[10px]">Active</span>}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('authority');
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        isAuthority && !isAdmin ? 'bg-amber-50 text-[#806044] font-bold border border-amber-200' : 'text-[#26382D] hover:bg-[#F5F7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Forest Officer (DFO)</span>
                      </div>
                      {isAuthority && !isAdmin && <span className="text-[10px]">Active</span>}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('admin');
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        isAdmin ? 'bg-emerald-50 text-[#1B5E3B] font-bold border border-[#1B5E3B]/30' : 'text-[#26382D] hover:bg-[#F5F7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1B5E3B]" />
                        <span>Super Administrator</span>
                      </div>
                      {isAdmin && <span className="text-[10px]">Active</span>}
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#DCC8A3]/50 space-y-1">
                    {isAuthority && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-[#1B5E3B] hover:bg-[#EAEFE4] flex items-center gap-2 font-medium"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Officer Console</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile sub-bar - Role-Tailored */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#DCC8A3]/50 bg-white/95 py-2 px-1 text-[11px] overflow-x-auto gap-1">
        {!user ? (
          <>
            <Link to="/login" className="px-3 py-1 rounded-lg text-[#1B5E3B] font-bold">
              Login
            </Link>
            <Link to="/track" className="px-3 py-1 rounded-lg text-[#26382D]">
              Track Case
            </Link>
            <Link to="/about" className="px-3 py-1 rounded-lg text-[#26382D]">
              About
            </Link>
          </>
        ) : isAuthority ? (
          <>
            <Link
              to="/admin?tab=triage"
              className={`px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                location.search.includes('triage') ? 'text-[#1B5E3B] font-bold bg-[#EAEFE4]' : 'text-[#26382D]'
              }`}
            >
              <span>Console</span>
            </Link>
            <Link
              to="/map"
              className={`px-2 py-1 rounded-lg shrink-0 ${
                isActive('/map') ? 'text-[#1B5E3B] font-bold bg-[#EAEFE4]' : 'text-[#26382D]'
              }`}
            >
              Map
            </Link>
            <Link
              to="/admin?tab=satellite"
              className={`px-2 py-1 rounded-lg shrink-0 ${
                location.search.includes('satellite') ? 'text-[#1B5E3B] font-bold bg-[#EAEFE4]' : 'text-[#26382D]'
              }`}
            >
              NDVI
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={`px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                isActive('/dashboard') ? 'text-[#1B5E3B] font-bold bg-[#EAEFE4]' : 'text-[#26382D]'
              }`}
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/report"
              className={`px-2 py-1 rounded-lg shrink-0 ${
                isActive('/report') ? 'text-[#1B5E3B] font-bold bg-[#EAEFE4]' : 'text-[#26382D]'
              }`}
            >
              Report
            </Link>
            <Link
              to="/track"
              className={`px-2 py-1 rounded-lg shrink-0 ${
                isActive('/track') ? 'text-[#1B5E3B] font-bold bg-[#EAEFE4]' : 'text-[#26382D]'
              }`}
            >
              Track
            </Link>
            <Link
              to="/rewards"
              className={`px-2 py-1 rounded-lg shrink-0 ${
                isActive('/rewards') ? 'text-[#1B5E3B] font-bold bg-[#EAEFE4]' : 'text-[#26382D]'
              }`}
            >
              Points
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;