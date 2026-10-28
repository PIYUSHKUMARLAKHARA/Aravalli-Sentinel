import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  User,
  KeyRound,
  Mail,
  Lock,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthority, switchPersona, loginCitizen, loginAuthority } = useAuth();

  const [activeTab, setActiveTab] = useState('persona'); // 'persona' | 'citizen_reg' | 'authority_reg'
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Citizen Form state
  const [citizenName, setCitizenName] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');

  // Authority Form state
  const [officerName, setOfficerName] = useState('');
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [officerDept, setOfficerDept] = useState('Haryana Forest Department');
  const [inviteSecret, setInviteSecret] = useState('');

  const handlePersonaSelect = async (role) => {
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const res = await switchPersona(role);
      if (res.success) {
        setSuccessMsg(`Switched active session to ${res.user.name} (${res.user.badge})`);
        setTimeout(() => {
          if (role === 'authority') {
            navigate('/authority');
          } else {
            navigate('/dashboard');
          }
        }, 600);
      }
    } catch (err) {
      setError('Failed to switch persona.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!citizenEmail || !citizenName || !citizenPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await loginCitizen(citizenEmail, citizenName, citizenPassword);
      if (res.success) {
        setSuccessMsg('Account registered successfully as Citizen Sentinel!');
        setTimeout(() => navigate('/dashboard'), 700);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Error creating citizen account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAuthoritySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!officerEmail || !officerName || !inviteSecret) {
      setError('Email, Officer Name, and Authority Invite Secret are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await loginAuthority({
        email: officerEmail,
        fullName: officerName,
        password: officerPassword || 'Secret2026!',
        department: officerDept,
        inviteSecret: inviteSecret
      });
      if (res.success) {
        setSuccessMsg('Authority verified! Session active with enforcement triage privileges.');
        setTimeout(() => navigate('/authority'), 700);
      } else {
        setError(res.error || 'Invalid authority invite secret or credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authority authorization failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand & Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-aravalli-700 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Access Aravalli Sentinel</h1>
        <p className="text-xs text-slate-400">
          Role-governed ecological intelligence and incident reporting platform.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => { setActiveTab('persona'); setError(null); }}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'persona' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Quick Demo Persona
        </button>
        <button
          onClick={() => { setActiveTab('citizen_reg'); setError(null); }}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'citizen_reg' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Citizen Register
        </button>
        <button
          onClick={() => { setActiveTab('authority_reg'); setError(null); }}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'authority_reg' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Official Auth
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab 1: Quick Demo Personas */}
      {activeTab === 'persona' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Select Demonstration Persona</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Instantly evaluate the application without registering an external account.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handlePersonaSelect('citizen')}
              disabled={submitting}
              className={`w-full p-4 rounded-xl text-left border transition-all ${
                user?.role === 'citizen'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-850/60 border-slate-750 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Citizen Sentinel</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Role: citizen
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Aarav Mehta</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Access to report threat portal, interactive risk map, and AI legal assistant.
              </p>
            </button>

            <button
              onClick={() => handlePersonaSelect('authority')}
              disabled={submitting}
              className={`w-full p-4 rounded-xl text-left border transition-all ${
                isAuthority
                  ? 'bg-amber-950/40 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-850/60 border-slate-750 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300">Forest Officer / DFO</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Role: authority
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Officer R. S. Shekhawat</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Access to enforcement desk, status updates, audit notes, and official dossiers.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Citizen Register Form */}
      {activeTab === 'citizen_reg' && (
        <form onSubmit={handleCitizenSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white">Register Citizen Account</h2>
            <p className="text-[11px] text-slate-400">
              Role is strictly assigned as <code className="text-emerald-400 font-mono">citizen</code>.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={citizenName}
                  onChange={e => setCitizenName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={citizenEmail}
                  onChange={e => setCitizenEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={citizenPassword}
                  onChange={e => setCitizenPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {submitting ? 'Registering...' : 'Create Citizen Account'}
          </button>
        </form>
      )}

      {/* Tab 3: Official Authority Authentication */}
      {activeTab === 'authority_reg' && (
        <form onSubmit={handleAuthoritySubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-amber-300">Forest Authority Verification</h2>
            <p className="text-[11px] text-slate-400">
              Requires a verified government invite secret to unlock enforcement privileges.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Officer Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. DFO R. S. Shekhawat"
                  value={officerName}
                  onChange={e => setOfficerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="dfo.gurugram@forest.gov.in"
                  value={officerEmail}
                  onChange={e => setOfficerEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department / Division</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={officerDept}
                  onChange={e => setOfficerDept(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-amber-300">Authority Invite Secret</label>
                <button
                  type="button"
                  onClick={() => setInviteSecret('ARAVALLI_OFFICER_2026_SECRET')}
                  className="text-[10px] text-amber-400/80 hover:text-amber-300 underline font-mono"
                >
                  Quick Fill Demo Secret
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter secret from .env"
                  value={inviteSecret}
                  onChange={e => setInviteSecret(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {submitting ? 'Verifying Credentials...' : 'Authenticate as Authority'}
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginPage;
