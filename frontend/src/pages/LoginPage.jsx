import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  User,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  BadgeCheck,
  AlertTriangle,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    user,
    isAuthority,
    switchPersona,
    loginCitizen,
    registerCitizen,
    loginAuthority,
    provisionAuthority,
    forgotPassword,
  } = useAuth();

  // Active Login Experience: 'citizen' | 'authority' | 'evaluator'
  const [activePortal, setActivePortal] = useState('citizen');
  // Citizen mode: 'signin' | 'signup' | 'forgot'
  const [citizenMode, setCitizenMode] = useState('signin');
  // Authority mode: 'signin' | 'provision'
  const [authorityMode, setAuthorityMode] = useState('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Authority Form states
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officerDepartment, setOfficerDepartment] = useState('Haryana Forest Department & Aravalli Task Force');
  const [officerDesignation, setOfficerDesignation] = useState('Divisional Forest Officer (DFO)');
  const [inviteSecret, setInviteSecret] = useState('');
  const [showOfficerPassword, setShowOfficerPassword] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Citizen Sign In / Sign Up
  const handleCitizenAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (citizenMode === 'forgot') {
      if (!email || !email.includes('@')) {
        setErrorMessage('Please provide a valid registered email address.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await forgotPassword(email);
        if (res.success) {
          setSuccessMessage(res.message || 'Password reset link sent to your email.');
        } else {
          setErrorMessage(res.error || 'Failed to dispatch password reset.');
        }
      } catch (err) {
        setErrorMessage('Error: ' + err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      if (citizenMode === 'signup') {
        if (!fullName || fullName.trim().length < 2) {
          setErrorMessage('Full name is required for citizen account registration.');
          setSubmitting(false);
          return;
        }
        const res = await registerCitizen(email, fullName, password);
        if (res.success) {
          setSuccessMessage('Citizen account registered successfully! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 600);
        } else {
          setErrorMessage(res.error || 'Registration failed.');
        }
      } else {
        const res = await loginCitizen(email, password);
        if (res.success) {
          setSuccessMessage('Welcome back! Loading Citizen Sentinel workspace...');
          setTimeout(() => navigate(from === '/authority' ? '/dashboard' : from), 600);
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Forest Authority Sign In vs Provisioning
  const handleAuthorityAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authorityMode === 'signin') {
      if (!officerEmail || !officerEmail.includes('@')) {
        setErrorMessage('Please enter your official registered email address.');
        return;
      }
      if (!officerPassword) {
        setErrorMessage('Password is required for Forest Authority sign in.');
        return;
      }

      setSubmitting(true);
      try {
        const res = await loginAuthority(officerEmail, officerPassword);
        if (res.success) {
          setSuccessMessage('Officer credentials verified! Opening Enforcement Triage Console...');
          setTimeout(() => navigate('/authority'), 600);
        } else {
          setErrorMessage(res.error || 'Failed to authenticate officer account.');
        }
      } catch (err) {
        setErrorMessage(err.message || 'Authority authorization failed.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Provisioning Mode (with administrative invite secret validation)
    if (!officerEmail || !officerName || !inviteSecret) {
      setErrorMessage('Officer Name, Official Email, and Authority Invite Secret are required to provision an officer account.');
      return;
    }
    if (!officerPassword || officerPassword.length < 6) {
      setErrorMessage('Please choose a secure password of at least 6 characters for the officer account.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await provisionAuthority({
        email: officerEmail,
        fullName: officerName,
        password: officerPassword,
        department: officerDepartment,
        designation: officerDesignation,
        inviteSecret: inviteSecret,
      });

      if (res.success) {
        setSuccessMessage('Authority account successfully provisioned! Opening Enforcement Triage Console...');
        setTimeout(() => navigate('/authority'), 600);
      } else {
        setErrorMessage(res.error || 'Invalid Authority Invite Secret. Contact Forest Department IT administrator.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authority provisioning failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Persona Quick-Select for Judges & Evaluators
  const handleQuickPersona = async (role) => {
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);
    try {
      const res = await switchPersona(role);
      if (res.success) {
        setSuccessMessage(`Switched session to ${res.user.name} (${res.user.badge})`);
        setTimeout(() => {
          if (role === 'authority') {
            navigate('/authority');
          } else {
            navigate('/dashboard');
          }
        }, 500);
      }
    } catch (err) {
      setErrorMessage('Failed to switch demo persona.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-aravalli-800 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 border border-emerald-400/30">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
            ARAVALLI SENTINEL ACCESS GATEWAY
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            RBAC v1.0
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Secure Authentication Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Sign in to submit ground environmental threat evidence or access authorized Forest Department enforcement triage.
        </p>
      </div>

      {/* Portal Selection Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => {
            setActivePortal('citizen');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activePortal === 'citizen'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Citizen Sentinel</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActivePortal('authority');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activePortal === 'authority'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Forest Authority</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActivePortal('evaluator');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activePortal === 'evaluator'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Evaluator / Demo</span>
        </button>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-3 shadow-lg animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-xl mx-auto">
        {/* ============================================================== */}
        {/* PORTAL A: CITIZEN SENTINEL                                     */}
        {/* ============================================================== */}
        {activePortal === 'citizen' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>
                    {citizenMode === 'signup'
                      ? 'Register Citizen Sentinel'
                      : citizenMode === 'forgot'
                      ? 'Recover Account Password'
                      : 'Citizen Sentinel Sign In'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Report illegal mining, deforestation, and water stress with full identity privacy.
                </p>
              </div>

              {citizenMode !== 'forgot' && (
                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setCitizenMode('signin');
                      setErrorMessage('');
                    }}
                    className={`px-3 py-1 rounded-md transition-all ${
                      citizenMode === 'signin' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCitizenMode('signup');
                      setErrorMessage('');
                    }}
                    className={`px-3 py-1 rounded-md transition-all ${
                      citizenMode === 'signup' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleCitizenAuth} className="space-y-4">
              {citizenMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Aarav Mehta"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="citizen@aravalli.sentinel"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {citizenMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-slate-300 font-bold">
                      Password
                    </label>
                    {citizenMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCitizenMode('forgot');
                          setErrorMessage('');
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {citizenMode === 'forgot' && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                  Enter your registered citizen email. We will generate an authenticated password reset link.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Authentication...</span>
                  </>
                ) : citizenMode === 'signup' ? (
                  <>
                    <User className="w-4 h-4" />
                    <span>Create Citizen Sentinel Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : citizenMode === 'forgot' ? (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Password Reset Instructions</span>
                  </>
                ) : (
                  <>
                    <BadgeCheck className="w-4 h-4" />
                    <span>Sign In to Citizen Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {citizenMode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setCitizenMode('signin');
                    setErrorMessage('');
                  }}
                  className="w-full text-center text-xs text-slate-400 hover:text-white font-mono pt-1"
                >
                  Back to Sign In
                </button>
              )}
            </form>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Identity Protection Protocol: Citizen names & contact numbers are redacted in public feeds.</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PORTAL B: FOREST AUTHORITY & ENFORCEMENT OFFICER              */}
        {/* ============================================================== */}
        {activePortal === 'authority' && (
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-bold text-[9px] uppercase px-3 py-1 rounded-bl-lg font-mono">
              OFFICIAL PERSONNEL ONLY
            </div>

            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Forest Authority Enforcement Portal</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Restricted portal for Divisional Forest Officers, Mining Task Force, and Wildlife Wardens.
              </p>

              {/* Sub-Tabs: Officer Sign In vs Officer Provisioning */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAuthorityMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    authorityMode === 'signin'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Officer Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthorityMode('provision');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    authorityMode === 'provision'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Officer Provisioning</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAuthorityAuth} className="space-y-4">
              {/* MODE 1: OFFICER SIGN IN (Existing Provisioned Officer) */}
              {authorityMode === 'signin' && (
                <>
                  {/* Demo Pre-fill helper */}
                  <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center justify-between gap-2">
                    <div className="text-[11px] text-amber-300">
                      <span className="font-bold">Evaluation Bootstrap:</span> Seeded DFO Officer Account
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOfficerEmail('officer.sharma@forest.haryana.gov.in');
                        setOfficerPassword('Officer@Aravalli2026!');
                      }}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono transition-colors"
                    >
                      Pre-fill DFO Sharma
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                      Official Gov / Departmental Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="officer.sharma@forest.haryana.gov.in"
                        value={officerEmail}
                        onChange={(e) => setOfficerEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showOfficerPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOfficerPassword(!showOfficerPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showOfficerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* MODE 2: OFFICER PROVISIONING (New Registration via Invite Secret) */}
              {authorityMode === 'provision' && (
                <>
                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                    <span className="font-bold text-amber-300">Administrative Provisioning:</span> New officer accounts require a verified Authority Invitation Secret issued by a Forest Department or State Environmental Agency administrator.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                        Officer Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Officer Sunita Verma"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                        Department / Agency
                      </label>
                      <select
                        value={officerDepartment}
                        onChange={(e) => setOfficerDepartment(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Haryana Forest Department & Aravalli Task Force">Haryana Forest Department</option>
                        <option value="Rajasthan Department of Environment & Forest">Rajasthan Forest Department</option>
                        <option value="Delhi Forest & Wildlife Department">Delhi Forest Department</option>
                        <option value="Gujarat Forest Department (Sabarkantha Division)">Gujarat Forest Department</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Divisional Forest Officer (DFO) / Range Officer"
                      value={officerDesignation}
                      onChange={(e) => setOfficerDesignation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                      Official Gov / Departmental Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="officer.verma@forest.rajasthan.gov.in"
                        value={officerEmail}
                        onChange={(e) => setOfficerEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-bold block">
                      Create Officer Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showOfficerPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOfficerPassword(!showOfficerPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showOfficerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-xl border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Authority Invitation Secret Token</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setInviteSecret('AravalliEnforce2025SecureToken')}
                        className="text-[10px] text-amber-400 hover:underline font-mono"
                      >
                        Fill Demo Secret
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="Paste government administrative invite token..."
                      value={inviteSecret}
                      onChange={(e) => setInviteSecret(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Authority Credentials with Department Server...</span>
                  </>
                ) : authorityMode === 'signin' ? (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Sign In to Enforcement Triage Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <BadgeCheck className="w-4 h-4" />
                    <span>Verify Secret & Provision Officer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>Notice: Officer triage actions are cryptographically logged in an audit trail.</span>
              {authorityMode === 'signin' ? (
                <button
                  type="button"
                  onClick={() => setAuthorityMode('provision')}
                  className="text-amber-400 hover:underline"
                >
                  Need Provisioning?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthorityMode('signin')}
                  className="text-amber-400 hover:underline"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PORTAL C: 1-CLICK HACKATHON EVALUATOR SWITCHER                 */}
        {/* ============================================================== */}
        {activePortal === 'evaluator' && (
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  HACKATHON JURY SPEED ACCESS
                </span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Instant Demo Persona Switcher</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluate both sides of the platform without typing mock credentials. Switches your browser session instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Persona 1: Citizen */}
              <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Role: Citizen</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">Public</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Aarav Mehta</h3>
                  <p className="text-xs text-slate-400">citizen@aravalli.sentinel</p>
                  <p className="text-[11px] text-slate-300 pt-1">
                    Can submit photo evidence, view personal reports, and preview Gemini AI risk engine scoring.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('citizen')}
                  disabled={submitting}
                  className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Launch Citizen Workspace</span>
                </button>
              </div>

              {/* Persona 2: Authority */}
              <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Role: Authority</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono">Gov Official</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Officer Rajesh Sharma</h3>
                  <p className="text-xs text-slate-400">officer.sharma@forest.haryana.gov.in</p>
                  <p className="text-[11px] text-slate-300 pt-1">
                    Divisional Forest Officer (DFO). Full triage privileges, audit trail logger, and problem statement generator.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('authority')}
                  disabled={submitting}
                  className="w-full py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Launch Authority Console</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statutory Non-Government Notice */}
      <div className="text-center p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] text-slate-500 max-w-2xl mx-auto space-y-1">
        <p className="font-semibold text-slate-400">
          Statutory Notice & Academic / Hackathon Disclaimer
        </p>
        <p>
          Aravalli Sentinel is an independent academic, civic, and hackathon demonstration platform created for ecological threat monitoring. It is not an official portal of the Ministry of Environment, Forest and Climate Change (MoEFCC), Rajasthan Forest Department, or Haryana Forest Department. Official statutory environmental enforcement actions must be routed through respective government bodies.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
