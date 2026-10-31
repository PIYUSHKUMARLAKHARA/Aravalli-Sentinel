import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import brandLogo from '../assets/images/aravalli-sentinel-logo.png';
import aravalliLandscape from '../assets/images/aravalli-landscape.jpg';
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
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    switchPersona,
    loginCitizen,
    registerCitizen,
    loginAuthority,
    forgotPassword,
  } = useAuth();

  // Active Login Portal: 'citizen' | 'authority'
  const [activePortal, setActivePortal] = useState('citizen');

  // Citizen mode: 'signin' | 'signup' | 'forgot'
  const [citizenMode, setCitizenMode] = useState('signin');

  // Citizen Form state
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenFullName, setCitizenFullName] = useState('');
  const [showCitizenPassword, setShowCitizenPassword] = useState(false);

  // Authority Form state
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [showOfficerPassword, setShowOfficerPassword] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Citizen Auth
  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (citizenMode === 'forgot') {
      if (!citizenEmail || !citizenEmail.includes('@')) {
        setErrorMessage('Please provide a valid registered email address.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await forgotPassword(citizenEmail);
        if (res.success) {
          setSuccessMessage(res.message || 'Password reset instructions dispatched to your email.');
        } else {
          setErrorMessage(res.error || 'Failed to dispatch password recovery.');
        }
      } catch (err) {
        setErrorMessage('Error: ' + err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!citizenEmail || !citizenEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!citizenPassword || citizenPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (citizenMode === 'signup') {
        if (!citizenFullName || citizenFullName.trim().length < 2) {
          setErrorMessage('Please enter your full legal name.');
          setSubmitting(false);
          return;
        }
        const res = await registerCitizen(citizenEmail, citizenFullName, citizenPassword);
        if (res.success) {
          navigate('/dashboard');
        } else {
          setErrorMessage(res.error || 'Citizen registration failed.');
        }
      } else {
        const res = await loginCitizen(citizenEmail, citizenPassword);
        if (res.success) {
          navigate('/dashboard');
        } else {
          setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
        }
      }
    } catch (err) {
      setErrorMessage('Authentication error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Forest Authority Officer Auth
  const handleOfficerSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!officerEmail || !officerEmail.includes('@')) {
      setErrorMessage('Please enter your official government or department email address.');
      return;
    }
    if (!officerPassword || officerPassword.length < 6) {
      setErrorMessage('Officer password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await loginAuthority(officerEmail, officerPassword);
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMessage(res.error || 'Officer login failed. Access restricted to authorized accounts only.');
      }
    } catch (err) {
      setErrorMessage('Officer login error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Demo credentials for Hackathon presentation
  const handleQuickDemoCitizen = async () => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      await switchPersona('citizen');
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage('Demo login failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoOfficer = async () => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      await switchPersona('authority');
      navigate('/admin');
    } catch (err) {
      setErrorMessage('Demo officer login failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${aravalliLandscape})`,
      }}
    >
      {/* Light Natural Overlay for high contrast and readability */}
      <div className="absolute inset-0 bg-[#F5F7F0]/90 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto my-6 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 bg-white/95 px-5 py-2.5 rounded-2xl shadow-sm border border-[#DCC8A3]/70">
            <img src={brandLogo} alt="Aravalli Sentinel" className="w-9 h-9 object-contain" />
            <div className="text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-[#1B5E3B] text-lg tracking-tight">ARAVALLI</span>
                <span className="font-extrabold text-[#2E8B57] text-lg tracking-tight">SENTINEL</span>
              </div>
              <span className="text-[10px] text-[#526A59] font-medium">Ecological Early-Warning & Protection System</span>
            </div>
          </div>
          <p className="text-xs text-[#526A59] max-w-md mx-auto">
            Secure entry point for Citizens and Forest Authority Officers protecting India's ancient green wall.
          </p>
        </div>

        {/* Portal Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto bg-white/95 p-1.5 rounded-2xl border border-[#DCC8A3]/80 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setActivePortal('citizen');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activePortal === 'citizen'
                ? 'bg-[#1B5E3B] text-white shadow-sm'
                : 'text-[#26382D] hover:bg-[#F5F7F0]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>CITIZEN PORTAL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePortal('authority');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activePortal === 'authority'
                ? 'bg-[#806044] text-white shadow-sm'
                : 'text-[#26382D] hover:bg-[#F5F7F0]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>FOREST AUTHORITY</span>
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {/* Main Portal Container */}
        <div className="bg-white rounded-3xl border border-[#DCC8A3] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Form Area */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            {activePortal === 'citizen' ? (
              /* ================= CITIZEN PORTAL ================= */
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAEFE4] text-[#1B5E3B] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                    <User className="w-3 h-3" /> Citizen Sentinel Gateway
                  </div>
                  <h2 className="text-2xl font-black text-[#26382D] tracking-tight">CITIZEN PORTAL</h2>
                  <p className="text-xs font-semibold text-[#1B5E3B] mt-0.5">
                    Report Environmental Threats. Protect the Aravalli.
                  </p>
                  <p className="text-xs text-[#526A59] mt-2 leading-relaxed">
                    Help protect the Aravalli ecosystem by reporting suspected illegal mining, deforestation, vegetation loss, and other environmental issues.
                  </p>
                </div>

                {/* Sub-modes: Sign In vs Sign Up vs Forgot */}
                <div className="flex border-b border-[#DCC8A3]/60 pb-2 gap-4 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setCitizenMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`pb-1 transition-colors ${citizenMode === 'signin' ? 'text-[#1B5E3B] border-b-2 border-[#1B5E3B]' : 'text-[#526A59] hover:text-[#26382D]'}`}
                  >
                    Citizen Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCitizenMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`pb-1 transition-colors ${citizenMode === 'signup' ? 'text-[#1B5E3B] border-b-2 border-[#1B5E3B]' : 'text-[#526A59] hover:text-[#26382D]'}`}
                  >
                    New Citizen Registration
                  </button>
                  {citizenMode === 'forgot' && (
                    <span className="pb-1 text-[#806044] border-b-2 border-[#806044]">
                      Recover Account
                    </span>
                  )}
                </div>

                <form onSubmit={handleCitizenSubmit} className="space-y-4">
                  {citizenMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-[#26382D] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={citizenFullName}
                          onChange={(e) => setCitizenFullName(e.target.value)}
                          placeholder="e.g. Aarav Mehta"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCC8A3] bg-[#F5F7F0]/40 text-[#26382D] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E3B] focus:border-transparent"
                        />
                        <User className="absolute right-3.5 top-2.5 w-4 h-4 text-[#526A59]" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#26382D] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        placeholder="citizen@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCC8A3] bg-[#F5F7F0]/40 text-[#26382D] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E3B] focus:border-transparent"
                      />
                      <Mail className="absolute right-3.5 top-2.5 w-4 h-4 text-[#526A59]" />
                    </div>
                  </div>

                  {citizenMode !== 'forgot' && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-[#26382D]">
                          Password
                        </label>
                        {citizenMode === 'signin' && (
                          <button
                            type="button"
                            onClick={() => { setCitizenMode('forgot'); setErrorMessage(''); }}
                            className="text-[11px] text-[#1B5E3B] hover:underline font-medium"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showCitizenPassword ? 'text' : 'password'}
                          required
                          value={citizenPassword}
                          onChange={(e) => setCitizenPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCC8A3] bg-[#F5F7F0]/40 text-[#26382D] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E3B] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                          className="absolute right-3.5 top-2.5 text-[#526A59] hover:text-[#26382D]"
                        >
                          {showCitizenPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : citizenMode === 'signup' ? (
                      <>
                        <span>Create Citizen Sentinel Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : citizenMode === 'forgot' ? (
                      <>
                        <span>Send Password Reset Link</span>
                        <Mail className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Sign In to Citizen Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Presentation Demo Auto-Fill */}
                <div className="pt-2 border-t border-[#DCC8A3]/50 flex items-center justify-between text-[11px]">
                  <span className="text-[#526A59]">Hackathon Evaluator?</span>
                  <button
                    type="button"
                    onClick={handleQuickDemoCitizen}
                    className="text-[#1B5E3B] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Instant Citizen Demo Login</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ================= FOREST AUTHORITY PORTAL ================= */
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-[#806044] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                    <ShieldAlert className="w-3 h-3" /> Official Forest Department Gateway
                  </div>
                  <h2 className="text-2xl font-black text-[#26382D] tracking-tight">FOREST AUTHORITY PORTAL</h2>
                  <p className="text-xs font-semibold text-[#806044] mt-0.5">
                    Monitor Reports. Take Action. Protect Nature.
                  </p>
                  <p className="text-xs text-[#526A59] mt-2 leading-relaxed">
                    Dedicated statutory console for Divisional Forest Officers, Mining Task Force leaders, and Conservation Directors.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-[#806044] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Strict Access Control:</strong> Public registration is disabled. Only pre-authorized government email credentials can log in.
                  </span>
                </div>

                <form onSubmit={handleOfficerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#26382D] mb-1.5">
                      Official Department Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={officerEmail}
                        onChange={(e) => setOfficerEmail(e.target.value)}
                        placeholder="officer.sharma@forest.haryana.gov.in"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCC8A3] bg-[#F5F7F0]/40 text-[#26382D] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#806044] focus:border-transparent font-mono"
                      />
                      <Building2 className="absolute right-3.5 top-2.5 w-4 h-4 text-[#526A59]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#26382D] mb-1.5">
                      Security Password
                    </label>
                    <div className="relative">
                      <input
                        type={showOfficerPassword ? 'text' : 'password'}
                        required
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCC8A3] bg-[#F5F7F0]/40 text-[#26382D] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#806044] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOfficerPassword(!showOfficerPassword)}
                        className="absolute right-3.5 top-2.5 text-[#526A59] hover:text-[#26382D]"
                      >
                        {showOfficerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#806044] hover:bg-[#6a4f38] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Officer Clearance...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Authenticate Forest Officer</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Presentation Demo Auto-Fill */}
                <div className="pt-2 border-t border-[#DCC8A3]/50 flex items-center justify-between text-[11px]">
                  <span className="text-[#526A59]">Live Presentation Evaluation?</span>
                  <button
                    type="button"
                    onClick={handleQuickDemoOfficer}
                    className="text-[#806044] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Instant Officer Demo Login (DFO Sharma)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Role Permissions & Guidelines */}
          <div className="md:col-span-5 bg-[#F5F7F0] p-6 sm:p-8 border-t md:border-t-0 md:border-l border-[#DCC8A3] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-[#1B5E3B]">
                {activePortal === 'citizen' ? 'Citizen Sentinel Scope' : 'Forest Authority Powers'}
              </h3>

              {activePortal === 'citizen' ? (
                <ul className="space-y-3 text-xs text-[#26382D]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1B5E3B] shrink-0 mt-0.5" />
                    <span>Submit environmental reports with field photo or video.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1B5E3B] shrink-0 mt-0.5" />
                    <span>Automatic GPS ground location detection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1B5E3B] shrink-0 mt-0.5" />
                    <span>Instant collision-safe Case ID (e.g. ARV-2026-000123).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1B5E3B] shrink-0 mt-0.5" />
                    <span>Track progress & read official resolution remarks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1B5E3B] shrink-0 mt-0.5" />
                    <span>Earn verified Environmental Contribution Points.</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-3 text-xs text-[#26382D]">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-[#806044] shrink-0 mt-0.5" />
                    <span>Inspect all authorized jurisdiction reports with evidence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-[#806044] shrink-0 mt-0.5" />
                    <span>Review Copernicus Sentinel-2 NDVI spectral telemetry.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-[#806044] shrink-0 mt-0.5" />
                    <span>Update case status across 8 statutory stages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-[#806044] shrink-0 mt-0.5" />
                    <span>Record internal confidential officer notes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-[#806044] shrink-0 mt-0.5" />
                    <span>Issue binding resolution remarks & dispatch citizen updates.</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Case Tracking Quick Action */}
            <div className="p-4 bg-white rounded-2xl border border-[#DCC8A3] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E3B]">
                <Search className="w-4 h-4" />
                <span>Already have a Case ID?</span>
              </div>
              <p className="text-[11px] text-[#526A59]">
                Citizens can track investigation milestones directly without signing in.
              </p>
              <Link
                to="/track"
                className="w-full py-2 px-3 rounded-xl bg-[#EAEFE4] hover:bg-[#D5E2CC] text-[#1B5E3B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Case Tracking Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;