import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import brandLogo from '../assets/images/aravalli-sentinel-logo.png';
import aravalliLandscapeBg from '../assets/images/aravalli-landscape-bg.jpg';
import {
  Shield,
  ShieldAlert,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertTriangle,
  X,
  FileText,
  MapPin,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Aravalli Backdrop Component
 * Utilizes the photorealistic local Aravalli landscape photograph
 * with an atmospheric dark forest-green/slate translucent overlay.
 */
function AravalliBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* High Quality Local Aravalli Landscape Background Image */}
      <img
        src={aravalliLandscapeBg}
        alt="Aravalli Landscape Background"
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
      />

      {/* Dark Forest Green & Slate Translucent Protective Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/92 via-slate-950/88 to-emerald-950/80 backdrop-blur-[1.5px]" />

      {/* Topographic Elevation Contours (Subtle overlay pattern) */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04]" />

      {/* Warm Sunset/Sunrise Atmospheric Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-b from-amber-500/10 via-emerald-600/10 to-transparent rounded-full blur-3xl opacity-60" />
    </div>
  );
}

/**
 * Master Dual-Portal Landing & Login Page
 */
export function LandingLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthority,
    isAdmin,
    loginCitizen,
    registerCitizen,
    loginAuthority,
    provisionAuthority,
    switchPersona,
    forgotPassword,
    logout,
  } = useAuth();

  // Citizen Card Active Mode: 'login' | 'register'
  const [citizenMode, setCitizenMode] = useState('login');

  // Citizen Form Inputs
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [showCitizenPassword, setShowCitizenPassword] = useState(false);

  // Officer Form Inputs
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [showOfficerPassword, setShowOfficerPassword] = useState(false);

  // Aux Modals: 'forgot-password' | 'officer-provision' | null
  const [auxModal, setAuxModal] = useState(null);

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Provisioning inputs
  const [provisionName, setProvisionName] = useState('');
  const [provisionEmail, setProvisionEmail] = useState('');
  const [provisionPassword, setProvisionPassword] = useState('');
  const [provisionDepartment, setProvisionDepartment] = useState(
    'Rajasthan Forest Department & Aravalli Task Force'
  );
  const [provisionDesignation, setProvisionDesignation] = useState(
    'Divisional Forest Officer (DFO)'
  );
  const [provisionSecret, setProvisionSecret] = useState('');

  // Status Feedback States
  const [citizenError, setCitizenError] = useState('');
  const [citizenSuccess, setCitizenSuccess] = useState('');
  const [citizenSubmitting, setCitizenSubmitting] = useState(false);

  const [officerError, setOfficerError] = useState('');
  const [officerSuccess, setOfficerSuccess] = useState('');
  const [officerSubmitting, setOfficerSubmitting] = useState(false);

  const [auxError, setAuxError] = useState('');
  const [auxSuccess, setAuxSuccess] = useState('');
  const [auxSubmitting, setAuxSubmitting] = useState(false);

  // Deep link detection (e.g. /citizen/register, /officer/login)
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('register')) {
      setCitizenMode('register');
    }
  }, [location.pathname]);

  // Citizen Login Handler
  const handleCitizenLogin = async (e) => {
    e.preventDefault();
    setCitizenError('');
    setCitizenSuccess('');

    if (!citizenEmail || !citizenEmail.includes('@')) {
      setCitizenError('Please enter a valid email address.');
      return;
    }
    if (!citizenPassword || citizenPassword.length < 6) {
      setCitizenError('Password must be at least 6 characters long.');
      return;
    }

    setCitizenSubmitting(true);
    try {
      const res = await loginCitizen(citizenEmail, citizenPassword);
      if (res.success) {
        setCitizenSuccess('Welcome back! Opening Citizen Sentinel Workspace...');
        setTimeout(() => {
          navigate('/citizen/dashboard');
        }, 500);
      } else {
        setCitizenError(res.error || 'Invalid email or password.');
      }
    } catch (err) {
      setCitizenError(err.message || 'Citizen login failed. Please check credentials.');
    } finally {
      setCitizenSubmitting(false);
    }
  };

  // Citizen Registration Handler
  const handleCitizenRegister = async (e) => {
    e.preventDefault();
    setCitizenError('');
    setCitizenSuccess('');

    if (!citizenName || citizenName.trim().length < 2) {
      setCitizenError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!citizenEmail || !citizenEmail.includes('@')) {
      setCitizenError('Please enter a valid email address.');
      return;
    }
    if (!citizenPassword || citizenPassword.length < 6) {
      setCitizenError('Password must be at least 6 characters long.');
      return;
    }

    setCitizenSubmitting(true);
    try {
      const res = await registerCitizen(citizenEmail, citizenName, citizenPassword);
      if (res.success) {
        setCitizenSuccess(
          'Citizen Sentinel account created successfully! Opening workspace...'
        );
        setTimeout(() => {
          navigate('/citizen/dashboard');
        }, 600);
      } else {
        setCitizenError(res.error || 'Citizen registration failed.');
      }
    } catch (err) {
      setCitizenError(err.message || 'Registration error. Please try again.');
    } finally {
      setCitizenSubmitting(false);
    }
  };

  // Forest Authority Officer Login Handler
  const handleOfficerLogin = async (e) => {
    e.preventDefault();
    setOfficerError('');
    setOfficerSuccess('');

    if (!officerEmail || !officerEmail.includes('@')) {
      setOfficerError('Please enter your official registered email address.');
      return;
    }
    if (!officerPassword) {
      setOfficerError('Password is required for Forest Authority login.');
      return;
    }

    setOfficerSubmitting(true);
    try {
      const res = await loginAuthority(officerEmail, officerPassword);
      if (res.success) {
        setOfficerSuccess(`Enforcement clearance verified. Welcome, ${res.user.name}.`);
        setTimeout(() => {
          navigate('/officer/dashboard');
        }, 500);
      } else {
        setOfficerError(
          res.error || 'Access Denied: Unrecognized or unauthorized officer credentials.'
        );
      }
    } catch (err) {
      setOfficerError(err.message || 'Authority authorization failed.');
    } finally {
      setOfficerSubmitting(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuxError('');
    setAuxSuccess('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setAuxError('Please enter a valid registered email.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setAuxError('New password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setAuxError('Passwords do not match. Please re-enter.');
      return;
    }

    setAuxSubmitting(true);
    try {
      const res = await forgotPassword(forgotEmail, forgotNewPassword);
      if (res.success) {
        setAuxSuccess('Password reset successfully! You can now log in.');
        setTimeout(() => {
          setAuxModal(null);
          setCitizenEmail(forgotEmail);
          setCitizenMode('login');
        }, 1200);
      } else {
        setAuxError(res.error || 'Password reset failed.');
      }
    } catch (err) {
      setAuxError(err.message || 'Error resetting password.');
    } finally {
      setAuxSubmitting(false);
    }
  };

  // Admin Officer Provisioning Handler
  const handleOfficerProvisionSubmit = async (e) => {
    e.preventDefault();
    setAuxError('');
    setAuxSuccess('');

    if (!provisionEmail || !provisionName || !provisionSecret) {
      setAuxError('Officer Name, Official Email, and Authority Invite Secret are required.');
      return;
    }
    if (!provisionPassword || provisionPassword.length < 6) {
      setAuxError('Please assign a secure password of at least 6 characters.');
      return;
    }

    setAuxSubmitting(true);
    try {
      const res = await provisionAuthority({
        email: provisionEmail,
        fullName: provisionName,
        password: provisionPassword,
        department: provisionDepartment,
        designation: provisionDesignation,
        inviteSecret: provisionSecret,
      });

      if (res.success) {
        setAuxSuccess('Officer successfully provisioned and verified! Opening workspace...');
        setTimeout(() => {
          navigate('/officer/dashboard');
        }, 700);
      } else {
        setAuxError(
          res.error || 'Invalid Authority Invite Secret. Contact Super Administrator.'
        );
      }
    } catch (err) {
      setAuxError(err.message || 'Officer provisioning failed.');
    } finally {
      setAuxSubmitting(false);
    }
  };

  // Quick Persona Switcher for Hackathon Judges & Evaluators
  const handleQuickEvaluator = async (role) => {
    try {
      const res = await switchPersona(role);
      if (res.success) {
        if (role === 'authority') {
          navigate('/officer/dashboard');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/citizen/dashboard');
        }
      }
    } catch (err) {
      console.error('Demo switcher error:', err);
    }
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100">
      {/* Aravalli Mountain Landscape Backdrop */}
      <AravalliBackdrop />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="inline-block relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/30 to-amber-500/30 rounded-3xl blur-lg group-hover:opacity-100 opacity-60 transition duration-500" />
            <img
              src={brandLogo}
              alt="Aravalli Sentinel Official Logo"
              className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs sm:text-sm font-mono tracking-widest text-emerald-400 font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                REPORT. LOCATE. PROTECT.
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              ARAVALLI <span className="text-emerald-400">SENTINEL</span>
            </h1>

            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
              Connecting Citizens and Forest Authorities to Protect the Aravalli Ecosystem.
            </p>
          </div>

          {/* Active Session Notice (If already logged in) */}
          {user && (
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">Current Active Session</p>
                  <p className="text-sm font-bold text-white">
                    {user.name} <span className="text-xs text-emerald-400">({user.badge || user.role})</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to={isAuthority ? '/officer/dashboard' : '/citizen/dashboard'}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dual Portal Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ========================================================================= */}
          {/* OPTION 1 — CITIZEN PORTAL                                                 */}
          {/* ========================================================================= */}
          <div className="relative group rounded-3xl p-6 sm:p-8 bg-slate-900/85 hover:bg-slate-900/95 border border-emerald-500/30 hover:border-emerald-500/50 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4 relative z-10">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OPTION 1 — CITIZEN LOGIN</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
                  Open Public Registration
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  CITIZEN PORTAL
                </h2>
                <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                  Report Environmental Threats. Protect the Aravalli.
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                "Help protect the Aravalli ecosystem by reporting suspected illegal mining, deforestation, vegetation loss, and other environmental issues."
              </p>

              {/* Tab Switcher: Citizen Login vs Registration */}
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCitizenMode('login');
                    setCitizenError('');
                    setCitizenSuccess('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    citizenMode === 'login'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Citizen Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCitizenMode('register');
                    setCitizenError('');
                    setCitizenSuccess('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    citizenMode === 'register'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  New Citizen Registration
                </button>
              </div>

              {/* Citizen Error / Success Alerts */}
              {citizenError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 shadow-inner">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{citizenError}</span>
                </div>
              )}
              {citizenSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-inner">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{citizenSuccess}</span>
                </div>
              )}

              {/* Form 1A: Citizen Login */}
              {citizenMode === 'login' && (
                <form onSubmit={handleCitizenLogin} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs outline-none transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Password</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuxModal('forgot-password')}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showCitizenPassword ? 'text' : 'password'}
                        required
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs outline-none transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        title={showCitizenPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCitizenPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={citizenSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{citizenSubmitting ? 'Verifying Citizen Credentials...' : 'Citizen Login'}</span>
                  </button>
                </form>
              )}

              {/* Form 1B: New Citizen Registration */}
              {citizenMode === 'register' && (
                <form onSubmit={handleCitizenRegister} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Aarav Mehta"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs outline-none transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs outline-none transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Password (Minimum 6 characters)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCitizenPassword ? 'text' : 'password'}
                        required
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs outline-none transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        title={showCitizenPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCitizenPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={citizenSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    <User className="w-4 h-4" />
                    <span>{citizenSubmitting ? 'Registering Citizen Account...' : 'Create Citizen Account'}</span>
                  </button>
                </form>
              )}

              {/* Citizen Permissions / Capabilities */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Citizen Portal Permissions:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300 font-sans">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Submit environmental reports</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Upload report images</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Share report location (GPS)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Receive a unique Case ID</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>View own submitted cases</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Track case status</span>
                  </li>
                  <li className="flex items-center gap-1.5 sm:col-span-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Read officer updates & resolution remarks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* OPTION 2 — FOREST AUTHORITY OFFICER LOGIN                                */}
          {/* ========================================================================= */}
          <div className="relative group rounded-3xl p-6 sm:p-8 bg-slate-900/85 hover:bg-slate-900/95 border border-amber-500/35 hover:border-amber-500/60 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4 relative z-10">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>OPTION 2 — FOREST AUTHORITY OFFICER LOGIN</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                  Pre-Authorized Access Only
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  FOREST AUTHORITY PORTAL
                </h2>
                <p className="text-sm font-semibold text-amber-400 mt-0.5">
                  Monitor Reports. Take Action. Protect Nature.
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                "An authorized workspace for Forest Department and designated authority officers to review environmental reports, investigate cases, and update action status."
              </p>

              {/* Officer Error / Success Alerts */}
              {officerError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 shadow-inner">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{officerError}</span>
                </div>
              )}
              {officerSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-inner">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{officerSuccess}</span>
                </div>
              )}

              {/* Direct Officer Login Form */}
              <form onSubmit={handleOfficerLogin} className="space-y-3.5 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Official Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    placeholder="officer@forest.gov.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-xs outline-none transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Official Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOfficerPassword ? 'text' : 'password'}
                      required
                      value={officerPassword}
                      onChange={(e) => setOfficerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-xs outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOfficerPassword(!showOfficerPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      title={showOfficerPassword ? 'Hide password' : 'Show password'}
                    >
                      {showOfficerPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={officerSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  <span>{officerSubmitting ? 'Verifying Enforcement Credentials...' : 'Secure Officer Login'}</span>
                </button>
              </form>

              {/* Officer Permissions / Capabilities */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Officer Portal Permissions:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300 font-sans">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>View all authorized reports</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>View case details & evidence</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>View reported locations on map</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Review indicative risk scores</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Change case status (6 stages)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Add official remarks</span>
                  </li>
                  <li className="flex items-center gap-1.5 sm:col-span-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Mark cases as resolved & send updates to citizen</span>
                  </li>
                </ul>
              </div>

              {/* Security Policy Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1 text-rose-400">
                  <Lock className="w-3 h-3" /> No Public Officer Registration
                </span>
                <button
                  type="button"
                  onClick={() => setAuxModal('officer-provision')}
                  className="text-amber-400/80 hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                  Admin Provisioning
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation & Quick Demo Access Bar (Preserved for Hackathon Judges & Evaluators) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>HACKATHON EVALUATOR ONE-CLICK DEMO SHORTCUTS</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
              Rapid RBAC Persona Switcher
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <button
              onClick={() => handleQuickEvaluator('citizen')}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Citizen Sentinel</span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans">Aarav Mehta</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleQuickEvaluator('authority')}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Forest Authority Officer</span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans">DFO Rajesh Sharma</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleQuickEvaluator('admin')}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-purple-400 group-hover:text-purple-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Super Administrator (1 of 1)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans">Chief Vigilance Officer</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUXILIARY MODALS: FORGOT PASSWORD & ADMIN PROVISIONING                    */}
      {/* ========================================================================= */}
      {auxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-5">
            {/* Close Button */}
            <button
              onClick={() => {
                setAuxModal(null);
                setAuxError('');
                setAuxSuccess('');
              }}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Error / Success Alerts */}
            {auxError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 shadow-inner">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{auxError}</span>
              </div>
            )}
            {auxSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-inner">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{auxSuccess}</span>
              </div>
            )}

            {/* Modal 1: Forgot Password */}
            {auxModal === 'forgot-password' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <KeyRound className="w-3 h-3" />
                    <span>PASSWORD RECOVERY</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Reset Citizen Password</h3>
                  <p className="text-xs text-slate-400">
                    Enter your registered email address and assign a new secure password.
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Registered Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>New Password (Min 6 chars)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showForgotNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Confirm New Password</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={auxSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>{auxSubmitting ? 'Updating Password...' : 'Reset Password'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Modal 2: Admin Provisioning */}
            {auxModal === 'officer-provision' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <ShieldAlert className="w-3 h-3" />
                    <span>ADMINISTRATIVE ACTION</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Provision Enforcement Officer</h3>
                  <p className="text-xs text-slate-400">
                    Restricted to authorized Super Administrators using the Authority Invitation Secret.
                  </p>
                </div>

                <form onSubmit={handleOfficerProvisionSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 font-mono">
                      Officer Full Name & Title
                    </label>
                    <input
                      type="text"
                      required
                      value={provisionName}
                      onChange={(e) => setProvisionName(e.target.value)}
                      placeholder="e.g. S. K. Verma, IFS"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 font-mono">
                      Official Government Email
                    </label>
                    <input
                      type="email"
                      required
                      value={provisionEmail}
                      onChange={(e) => setProvisionEmail(e.target.value)}
                      placeholder="officer@forest.rajasthan.gov.in"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 font-mono">
                      Initial Password
                    </label>
                    <input
                      type="password"
                      required
                      value={provisionPassword}
                      onChange={(e) => setProvisionPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 font-mono">
                      Department / Forest Circle
                    </label>
                    <input
                      type="text"
                      value={provisionDepartment}
                      onChange={(e) => setProvisionDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 font-mono">
                      Authority Invitation Secret
                    </label>
                    <input
                      type="password"
                      required
                      value={provisionSecret}
                      onChange={(e) => setProvisionSecret(e.target.value)}
                      placeholder="Enter administrative invite secret"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/50 text-white text-xs outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={auxSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>{auxSubmitting ? 'Verifying & Provisioning...' : 'Provision Officer'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingLoginPage;
