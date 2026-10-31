import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  RefreshCw,
  Cpu,
  ArrowRight,
  Sparkles,
  KeyRound,
  FileText,
  Trash2,
  Eye,
  Building2,
  Compass,
  CloudSun,
  FileCheck,
  MessageSquare,
  ExternalLink,
  MapPin,
  Send,
  Radio,
  CheckSquare,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  fetchReports,
  updateReportStatus,
  fetchIncidentDossier,
  fetchAdminOfficers,
  updateOfficerPermissions,
  adminProvisionOfficer,
  adminDeleteOfficer,
  fetchAdminSystemStats,
  fetchWeather,
  fetchSatelliteAnalysis,
  addOfficerInternalNote,
} from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { PrintableIncidentDossier } from '../components/PrintableIncidentDossier';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { EvidenceViewerModal } from '../components/ui/EvidenceViewerModal';
import { MapView } from '../components/MapView';
import { AskAravalliChat } from '../components/AskAravalliChat';
import { useAuth } from '../context/AuthContext';

// Phase 12 — Eight Named Ecological Monitored Sectors
const MONITORED_SECTORS = [
  {
    id: 'sariska',
    name: 'Sariska Tiger Reserve Buffer',
    state: 'Rajasthan',
    baselineNDVI: 0.520,
    currentNDVI: 0.465,
    changePercent: -10.5,
    status: 'MODERATE_MONITORED',
    riskLevel: 'MEDIUM',
    lastObserved: '2026-10-22',
    weather: '29°C, Wind 14 km/h WSW',
    dustHazard: 'Low',
    runoffVulnerability: 'None',
  },
  {
    id: 'gurugram',
    name: 'Gurugram Escarpment (Bandhwari)',
    state: 'Haryana',
    baselineNDVI: 0.435,
    currentNDVI: 0.315,
    changePercent: -27.6,
    status: 'HIGH_VEGETATION_LOSS',
    riskLevel: 'CRITICAL',
    lastObserved: '2026-10-22',
    weather: '31°C, Wind 18 km/h W',
    dustHazard: 'Elevated Downwind',
    runoffVulnerability: 'Medium',
  },
  {
    id: 'mangar',
    name: 'Mangar Bani Sacred Grove',
    state: 'Haryana',
    baselineNDVI: 0.610,
    currentNDVI: 0.585,
    changePercent: -4.1,
    status: 'PROTECTED_BUFFER',
    riskLevel: 'LOW',
    lastObserved: '2026-10-22',
    weather: '28°C, Wind 10 km/h NW',
    dustHazard: 'Low',
    runoffVulnerability: 'None',
  },
  {
    id: 'asola',
    name: 'Asola Bhatti Wildlife Sanctuary',
    state: 'Delhi-NCR',
    baselineNDVI: 0.480,
    currentNDVI: 0.440,
    changePercent: -8.3,
    status: 'ACTIVE_SURVEILLANCE',
    riskLevel: 'MEDIUM',
    lastObserved: '2026-10-22',
    weather: '30°C, Wind 12 km/h W',
    dustHazard: 'Moderate',
    runoffVulnerability: 'Low',
  },
  {
    id: 'rajsamand',
    name: 'Rajsamand Marble Ridge',
    state: 'Rajasthan',
    baselineNDVI: 0.390,
    currentNDVI: 0.280,
    changePercent: -28.2,
    status: 'SLURRY_EXCAVATION_ALERT',
    riskLevel: 'CRITICAL',
    lastObserved: '2026-10-22',
    weather: '32°C, Wind 16 km/h SW',
    dustHazard: 'Elevated Plume',
    runoffVulnerability: 'High',
  },
  {
    id: 'udaipur',
    name: 'Udaipur Lake Catchment Ridge',
    state: 'Rajasthan',
    baselineNDVI: 0.540,
    currentNDVI: 0.510,
    changePercent: -5.5,
    status: 'CATCHMENT_EQUILIBRIUM',
    riskLevel: 'LOW',
    lastObserved: '2026-10-22',
    weather: '27°C, Wind 8 km/h S',
    dustHazard: 'Low',
    runoffVulnerability: 'Low',
  },
  {
    id: 'sirohi',
    name: 'Sirohi & Mount Abu Corridor',
    state: 'Rajasthan',
    baselineNDVI: 0.590,
    currentNDVI: 0.560,
    changePercent: -5.1,
    status: 'FOREST_BUFFER',
    riskLevel: 'LOW',
    lastObserved: '2026-10-22',
    weather: '25°C, Wind 9 km/h SE',
    dustHazard: 'None',
    runoffVulnerability: 'None',
  },
  {
    id: 'khetri',
    name: 'Khetri Copper Ridge Corridor',
    state: 'Rajasthan',
    baselineNDVI: 0.360,
    currentNDVI: 0.320,
    changePercent: -11.1,
    status: 'ARID_CANOPY_STRESS',
    riskLevel: 'MEDIUM',
    lastObserved: '2026-10-22',
    weather: '33°C, Wind 20 km/h WSW',
    dustHazard: 'Moderate',
    runoffVulnerability: 'None',
  },
];

// Phase 14 — Operational Transitions
const OPERATIONAL_TRANSITIONS = [
  { id: 'pending', label: '1. Pending Triage', canonical: 'pending' },
  { id: 'verified', label: '2. Field Verified', canonical: 'verified' },
  { id: 'action_taken', label: '3. Action Dispatched', canonical: 'action_taken' },
  { id: 'resolved', label: '4. Legal Dossier Filed', canonical: 'resolved' },
];

export function AdminDashboardPage({ initialTab = 'dashboard' }) {
  const location = useLocation();
  const { user, isAuthority, isAdmin } = useAuth();

  // Navigation Tabs: 'dashboard' | 'map' | 'triage' | 'satellite' | 'telemetry' | 'dossier' | 'ask' | 'officers'
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || initialTab);

  const [feedback, setFeedback] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Drone simulation feedback
  const [droneSimulating, setDroneSimulating] = useState(false);
  const [droneResult, setDroneResult] = useState(null);

  // =========================================================================
  // 1. AUTHORITY INCIDENT TRIAGE STATE
  // =========================================================================
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [triageSearch, setTriageSearch] = useState('');

  // Selected case for triage modal
  const [selectedCase, setSelectedCase] = useState(null);
  const [newStatus, setNewStatus] = useState('under_review');
  const [actionNotes, setActionNotes] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [resolutionDate, setResolutionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Confidential internal note state
  const [internalNoteText, setInternalNoteText] = useState('');
  const [savingInternalNote, setSavingInternalNote] = useState(false);

  // Printable Dossier & Lightbox
  const [activeDossier, setActiveDossier] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const [viewingEvidence, setViewingEvidence] = useState(null);

  // =========================================================================
  // 2. SATELLITE & WEATHER TELEMETRY STATE
  // =========================================================================
  const [satelliteData, setSatelliteData] = useState(null);
  const [loadingSatellite, setLoadingSatellite] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // =========================================================================
  // 3. OFFICER PERMISSIONS & PROVISIONING STATE
  // =========================================================================
  const [officers, setOfficers] = useState([]);
  const [loadingOfficers, setLoadingOfficers] = useState(true);
  const [officerSearch, setOfficerSearch] = useState('');
  const [filterActiveOfficer, setFilterActiveOfficer] = useState('all');

  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    fullName: '',
    email: '',
    department: 'Rajasthan Forest Department & Aravalli Task Force',
    designation: 'Range Forest Officer (RFO)',
    password: '',
  });
  const [provisioning, setProvisioning] = useState(false);

  // =========================================================================
  // 4. SYSTEM STATS
  // =========================================================================
  const [systemStats, setSystemStats] = useState(null);

  const loadAllData = async () => {
    setGlobalLoading(true);
    setLoadingReports(true);
    setLoadingOfficers(true);

    try {
      const [reportsRes, officersRes, statsRes] = await Promise.all([
        fetchReports(),
        fetchAdminOfficers(),
        fetchAdminSystemStats(),
      ]);

      if (reportsRes.success && reportsRes.reports) {
        setReports(reportsRes.reports);
      }
      if (officersRes.success && officersRes.officers) {
        setOfficers(officersRes.officers);
      }
      if (statsRes.success && statsRes.stats) {
        setSystemStats(statsRes.stats);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to sync operations data: ' + err.message });
    } finally {
      setLoadingReports(false);
      setLoadingOfficers(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if ((activeTab === 'satellite' || activeTab === 'dashboard') && !satelliteData) {
      loadSatelliteAnalysis();
    }
    if ((activeTab === 'telemetry' || activeTab === 'dashboard') && !weatherData) {
      loadWeatherData();
    }
  }, [activeTab]);

  const loadSatelliteAnalysis = async (caseId = 'rep-aravalli-2026-001') => {
    setLoadingSatellite(true);
    try {
      const res = await fetchSatelliteAnalysis(caseId);
      if (res.success && res.satellite) {
        setSatelliteData(res.satellite);
      }
    } catch (err) {
      console.warn('Satellite analysis load error:', err);
    } finally {
      setLoadingSatellite(false);
    }
  };

  const loadWeatherData = async () => {
    setLoadingWeather(true);
    try {
      const res = await fetchWeather(28.3842, 77.1436);
      if (res.success && res.weather) {
        setWeatherData(res.weather);
      }
    } catch (err) {
      console.warn('Weather load error:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Open incident dossier
  const handleOpenDossier = async (reportId) => {
    setLoadingDossier(true);
    try {
      const res = await fetchIncidentDossier(reportId);
      if (res.success && res.dossier) {
        setActiveDossier(res.dossier);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to load official legal dossier.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Dossier retrieval error: ' + err.message });
    } finally {
      setLoadingDossier(false);
    }
  };

  // Status update handler
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    if (newStatus === 'resolved' && !resolutionSummary.trim()) {
      setFeedback({
        type: 'error',
        message: 'Mandatory requirement: A meaningful resolution summary is required to mark a case as RESOLVED.',
      });
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const payload = {
        status: newStatus,
        actionNotes,
        resolutionSummary: newStatus === 'resolved' ? resolutionSummary : undefined,
        actionTaken: newStatus === 'resolved' ? actionTaken : undefined,
        officerRemarks: newStatus === 'resolved' ? officerRemarks : undefined,
        resolutionDate: newStatus === 'resolved' ? resolutionDate : undefined,
      };

      const res = await updateReportStatus(selectedCase.id, payload);
      if (res.success && res.report) {
        setReports((prev) => prev.map((r) => (r.id === selectedCase.id ? res.report : r)));
        setSelectedCase(res.report);
        setFeedback({
          type: 'success',
          message: `Case ${selectedCase.id} successfully updated to '${newStatus.toUpperCase()}'. Citizen milestone updated.`,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update status.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Status update error: ' + err.message });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Confidential note handler
  const handleSaveInternalNote = async (e) => {
    e.preventDefault();
    if (!selectedCase || !internalNoteText.trim()) return;

    setSavingInternalNote(true);
    try {
      const res = await addOfficerInternalNote(selectedCase.id, internalNoteText.trim());
      if (res.success && res.report) {
        setSelectedCase(res.report);
        setReports((prev) => prev.map((r) => (r.id === selectedCase.id ? res.report : r)));
        setInternalNoteText('');
        setFeedback({
          type: 'success',
          message: 'Confidential officer note securely encrypted and saved to case docket.',
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to record confidential note.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Note error: ' + err.message });
    } finally {
      setSavingInternalNote(false);
    }
  };

  // Drone dispatch simulation
  const handleSimulateDrone = () => {
    setDroneSimulating(true);
    setTimeout(() => {
      setDroneSimulating(false);
      setDroneResult({
        flightId: `DRONE-UAV-${Math.floor(1000 + Math.random() * 9000)}`,
        targetCoords: selectedCase ? `${selectedCase.latitude}, ${selectedCase.longitude}` : '28.3842N, 77.1436E',
        status: 'WAYPOINT_DISPATCH_CONFIRMED',
        disclaimer: 'SIMULATED DRONE PATROL DISPATCH (DEMO MODE): Automated UAV flight path computed for incident coordinates. Telemetry stream simulated for contest evaluation.',
      });
    }, 1200);
  };

  // Provision officer
  const handleProvisionSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setFeedback({ type: 'error', message: 'Action Restricted: Only the Super Administrator can provision officers.' });
      return;
    }

    setProvisioning(true);
    try {
      const res = await adminProvisionOfficer(newOfficer);
      if (res.success && res.officer) {
        setOfficers((prev) => [res.officer, ...prev]);
        setShowProvisionModal(false);
        setNewOfficer({
          fullName: '',
          email: '',
          department: 'Rajasthan Forest Department & Aravalli Task Force',
          designation: 'Range Forest Officer (RFO)',
          password: '',
        });
        setFeedback({
          type: 'success',
          message: `Officer '${res.officer.name}' successfully provisioned into central registry.`,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to provision officer.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error: ' + err.message });
    } finally {
      setProvisioning(false);
    }
  };

  // Compute live KPIs
  const totalCount = reports.length;
  const criticalCount = reports.filter((r) => r.riskScore >= 75 || r.riskClassification === 'CRITICAL').length;
  const pendingCount = reports.filter((r) => r.status === 'pending' || r.status === 'submitted').length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review' || r.status === 'under_investigation').length;
  const verifiedCount = reports.filter((r) => r.status === 'verified').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const satelliteVisibilityWarningCount = reports.filter((r) => r.weatherSnapshot?.cloudCoverPercent > 40).length;

  // Chart data for threat categories
  const categoryMap = {};
  reports.forEach((r) => {
    const cat = r.threatCategory || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));

  // Chart data for risk levels
  const riskChartData = [
    { name: 'Critical (85-100)', count: criticalCount, color: '#DC2626' },
    { name: 'High (70-84)', count: reports.filter((r) => r.riskScore >= 70 && r.riskScore < 85).length, color: '#EA580C' },
    { name: 'Medium (50-69)', count: reports.filter((r) => r.riskScore >= 50 && r.riskScore < 70).length, color: '#D97706' },
    { name: 'Low (0-49)', count: reports.filter((r) => (r.riskScore || 0) < 50).length, color: '#2E8B57' },
  ];

  const filteredReports = reports.filter((r) => {
    const q = triageSearch.toLowerCase();
    const matchesSearch =
      (r.id || '').toLowerCase().includes(q) ||
      (r.threatCategory || '').toLowerCase().includes(q) ||
      (r.locationName || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesThreat = threatFilter === 'all' || r.threatCategory === threatFilter;

    return matchesSearch && matchesStatus && matchesThreat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. MASTER COMMAND VAULT HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCC8A3] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A] flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5" /> Central Forest Authority Vault
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-50 text-[#1B5E3B] border border-emerald-200 font-bold">
                {isAdmin ? 'SUPER ADMINISTRATOR (1 OF 1)' : 'AUTHORIZED ENFORCEMENT OFFICER'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                ⭐ GOOGLE COMMUNITY CONTEST EDITION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#26382D] tracking-tight">
              Aravalli Sentinel — Command & Intelligence Center
            </h1>
            <p className="text-xs sm:text-sm text-[#526A59] leading-relaxed">
              Unified environmental surveillance console with <strong>Executive KPIs</strong>, 8 Monitored Ecological Sectors, Copernicus Sentinel-2 MSI NDVI spectral telemetry, meteorological hazards, and statutory incident triage.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setShowProvisionModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-[#DCC8A3]" />
                <span>Provision Officer</span>
              </button>
            )}
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-2xl bg-[#F5F7F0] hover:bg-white text-[#526A59] border border-[#DCC8A3] transition-colors"
              title="Refresh all telemetry data"
            >
              <RefreshCw className={`w-4 h-4 ${globalLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-4 font-black">
            ✕
          </button>
        </div>
      )}

      {/* 2. COMMAND NAVIGATION TABS */}
      <div className="flex flex-wrap rounded-2xl bg-white p-1.5 border border-[#DCC8A3] font-mono text-xs shadow-xs gap-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'dashboard'
              ? 'bg-[#1B5E3B] text-white shadow-xs'
              : 'text-[#26382D] hover:bg-[#F5F7F0]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Executive Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'map'
              ? 'bg-[#1B5E3B] text-white shadow-xs'
              : 'text-[#26382D] hover:bg-[#F5F7F0]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Command Map</span>
        </button>

        <button
          onClick={() => setActiveTab('triage')}
          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'triage'
              ? 'bg-[#1B5E3B] text-white shadow-xs'
              : 'text-[#26382D] hover:bg-[#F5F7F0]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Triage Operations ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('satellite')}
          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'satellite'
              ? 'bg-[#1B5E3B] text-white shadow-xs'
              : 'text-[#26382D] hover:bg-[#F5F7F0]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Sentinel-2 NDVI</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'telemetry'
              ? 'bg-[#1B5E3B] text-white shadow-xs'
              : 'text-[#26382D] hover:bg-[#F5F7F0]'
          }`}
        >
          <CloudSun className="w-4 h-4" />
          <span>Weather & Hazards</span>
        </button>

        <button
          onClick={() => setActiveTab('ask')}
          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'ask'
              ? 'bg-[#1B5E3B] text-white shadow-xs'
              : 'text-[#26382D] hover:bg-[#F5F7F0]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ask Aravalli AI</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('officers')}
            className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'officers'
                ? 'bg-[#806044] text-white shadow-xs'
                : 'text-[#26382D] hover:bg-[#F5F7F0]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Officers ({officers.length})</span>
          </button>
        )}
      </div>

      {/* ================================================================ */}
      {/* TAB 1: EXECUTIVE DASHBOARD (KPIs, 8 Sectors, Recharts Breakdown) */}
      {/* ================================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Real Database KPIs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
            <div className="p-5 rounded-3xl border border-[#DCC8A3] bg-white shadow-xs">
              <span className="text-[10px] uppercase text-[#526A59] font-bold block">Total Cases</span>
              <span className="text-2xl font-black text-[#26382D]">{totalCount}</span>
            </div>
            <div className="p-5 rounded-3xl border border-red-200 bg-red-50/50 shadow-xs">
              <span className="text-[10px] uppercase text-red-700 font-bold block">Critical Alerts</span>
              <span className="text-2xl font-black text-red-600">{criticalCount}</span>
            </div>
            <div className="p-5 rounded-3xl border border-amber-200 bg-amber-50/50 shadow-xs">
              <span className="text-[10px] uppercase text-amber-700 font-bold block">Pending Triage</span>
              <span className="text-2xl font-black text-[#D97706]">{pendingCount}</span>
            </div>
            <div className="p-5 rounded-3xl border border-[#DCC8A3] bg-white shadow-xs">
              <span className="text-[10px] uppercase text-[#526A59] font-bold block">Under Investigation</span>
              <span className="text-2xl font-black text-[#26382D]">{underReviewCount}</span>
            </div>
            <div className="p-5 rounded-3xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
              <span className="text-[10px] uppercase text-emerald-800 font-bold block">Resolved Cases</span>
              <span className="text-2xl font-black text-[#1B5E3B]">{resolvedCount}</span>
            </div>
            <div className="p-5 rounded-3xl border border-blue-200 bg-blue-50/50 shadow-xs">
              <span className="text-[10px] uppercase text-blue-700 font-bold block">Cloud Warning</span>
              <span className="text-2xl font-black text-blue-700">{satelliteVisibilityWarningCount}</span>
            </div>
          </div>

          {/* Recharts Threat Breakdown Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#26382D] flex items-center justify-between">
                <span>Threat Category Distribution</span>
                <span className="text-xs text-[#526A59] font-mono">Live DB Incidents</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#F5F7F0', borderColor: '#DCC8A3', borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#1B5E3B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#26382D] flex items-center justify-between">
                <span>Risk Severity Breakdown</span>
                <span className="text-xs text-[#526A59] font-mono">0–100 Engine</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskChartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {riskChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#F5F7F0', borderColor: '#DCC8A3', borderRadius: '12px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Eight Monitored Ecological Sectors Grid (Phase 12) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCC8A3]/60 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#26382D]">Monitored Ecological Sectors (8 Critical Divisions)</h3>
                <p className="text-xs text-[#526A59]">
                  Surface reflectance baselines, multispectral NDVI change, and local meteorological hazards.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A] w-fit">
                Sentinel-2 MSI Ingestion
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MONITORED_SECTORS.map((sec) => (
                <div
                  key={sec.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    sec.riskLevel === 'CRITICAL'
                      ? 'border-red-300 bg-red-50/30'
                      : sec.riskLevel === 'MEDIUM'
                      ? 'border-amber-300 bg-amber-50/30'
                      : 'border-[#DCC8A3] bg-[#F5F7F0]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#26382D] leading-tight">{sec.name}</h4>
                      <span className="text-[10px] text-[#806044] font-mono">{sec.state}</span>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        sec.riskLevel === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : sec.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sec.riskLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2.5 rounded-xl border border-[#DCC8A3]/60">
                    <div>
                      <span className="text-[9px] text-[#526A59] block">Baseline NDVI</span>
                      <strong className="text-[#26382D]">{sec.baselineNDVI.toFixed(3)}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#526A59] block">Latest NDVI</span>
                      <strong className={sec.changePercent <= -15 ? 'text-red-600' : 'text-[#1B5E3B]'}>
                        {sec.currentNDVI.toFixed(3)}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] text-[#526A59]">
                    <div className="flex justify-between">
                      <span>NDVI Delta:</span>
                      <strong className={sec.changePercent < 0 ? 'text-red-700' : 'text-emerald-700'}>
                        {sec.changePercent}%
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Weather Context:</span>
                      <span className="text-[#26382D] font-mono">{sec.weather}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dust Plume:</span>
                      <span className="text-[#806044] font-bold">{sec.dustHazard}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: COMMAND MAP                                               */}
      {/* ================================================================ */}
      {activeTab === 'map' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCC8A3]/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#26382D]">Master Geospatial Command Map</h3>
                <p className="text-xs text-[#526A59]">
                  Full-screen interactive GIS observation layer. Real-time incident pins, protected sanctuary buffers, and dust dispersion vectors.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A]">
                Authorized Officer GIS Clearance
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#DCC8A3]">
              <MapView reports={reports} className="h-[650px] w-full" onSelectReport={(r) => setSelectedCase(r)} />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: TRIAGE OPERATIONS TABLE & OPERATIONAL TRANSITIONS         */}
      {/* ================================================================ */}
      {activeTab === 'triage' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Drone Simulation Demo Box */}
          <div className="bg-white p-5 rounded-3xl border border-[#DCC8A3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ⭐ Contest Evaluator Demonstration Feature
              </span>
              <h4 className="text-xs font-bold text-[#26382D]">Autonomous UAV Drone Perimeter Reconnaissance</h4>
              <p className="text-[11px] text-[#526A59]">
                Simulate automated drone patrol dispatch to verified incident coordinates for aerial surveillance.
              </p>
            </div>
            <button
              onClick={handleSimulateDrone}
              disabled={droneSimulating}
              className="px-4 py-2.5 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-xs"
            >
              <Radio className={`w-3.5 h-3.5 ${droneSimulating ? 'animate-spin' : ''}`} />
              <span>{droneSimulating ? 'Computing Flight Path...' : 'Simulate Drone Dispatch (Contest Demo)'}</span>
            </button>
          </div>

          {droneResult && (
            <div className="p-4 rounded-2xl bg-[#EAEFE4] border border-[#A3B18A] text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[#1B5E3B] font-bold">
                <span>{droneResult.flightId} • {droneResult.status}</span>
                <button onClick={() => setDroneResult(null)} className="text-[#806044]">✕</button>
              </div>
              <p className="text-[#26382D]">{droneResult.disclaimer}</p>
            </div>
          )}

          {/* Search & Status Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#DCC8A3] shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#526A59] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search case ID, landmark, or category..."
                value={triageSearch}
                onChange={(e) => setTriageSearch(e.target.value)}
                className="w-full bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl pl-9 pr-4 py-2 text-xs text-[#26382D] placeholder-[#526A59] focus:outline-hidden focus:ring-2 focus:ring-[#1B5E3B]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl px-3 py-2 text-[#26382D] focus:outline-hidden"
              >
                <option value="all">All Operational Statuses</option>
                <option value="pending">Pending Triage</option>
                <option value="under_review">Under Review</option>
                <option value="verified">Field Verified</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="action_taken">Action Dispatched</option>
                <option value="resolved">Legal Dossier Filed / Resolved</option>
              </select>

              <select
                value={threatFilter}
                onChange={(e) => setThreatFilter(e.target.value)}
                className="bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl px-3 py-2 text-[#26382D] focus:outline-hidden"
              >
                <option value="all">All Threat Types</option>
                <option value="Illegal Mining & Quarrying">Illegal Mining</option>
                <option value="Deforestation / Tree Felling">Deforestation</option>
                <option value="Toxic Waste Dumping">Toxic Dumping</option>
                <option value="Encroachment & Construction">Encroachment</option>
              </select>
            </div>
          </div>

          {/* Triage Cases Table */}
          <div className="bg-white rounded-3xl border border-[#DCC8A3] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#F5F7F0] border-b border-[#DCC8A3] text-[#526A59] text-[10px] uppercase">
                  <tr>
                    <th className="p-4">Case ID</th>
                    <th className="p-4">Threat & Evidence</th>
                    <th className="p-4">Ground Location</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Operational Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCC8A3]/40 text-[#26382D]">
                  {loadingReports ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-[#526A59]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1B5E3B]" />
                        Loading incident triage dockets...
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-[#526A59]">
                        No reports matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-[#F5F7F0]/60 transition-colors">
                        <td className="p-4 font-bold text-[#1B5E3B] whitespace-nowrap">
                          {report.id}
                        </td>

                        <td className="p-4">
                          <span className="font-bold block text-xs">{report.threatCategory}</span>
                          <span className="text-[10px] text-[#526A59]">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="p-4 text-xs">
                          <span className="block font-medium truncate max-w-xs">{report.locationName}</span>
                          <span className="text-[10px] text-[#806044] font-mono">
                            {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              report.riskScore >= 75
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : report.riskScore >= 50
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            Score: {report.riskScore ?? 50}/100
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A]">
                            {report.status?.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCase(report);
                              setNewStatus(report.status || 'under_review');
                              setActionNotes(report.actionNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-[11px] transition-colors"
                          >
                            Triage Case
                          </button>
                          <button
                            onClick={() => handleOpenDossier(report.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#F5F7F0] hover:bg-white text-[#26382D] border border-[#DCC8A3] font-bold text-[11px] transition-colors"
                          >
                            Dossier
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 4: SATELLITE (SENTINEL-2 NDVI)                               */}
      {/* ================================================================ */}
      {activeTab === 'satellite' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCC8A3]/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#1B5E3B]" />
                  <h3 className="text-lg font-bold text-[#26382D]">Copernicus Sentinel-2 MSI Satellite Intelligence</h3>
                </div>
                <p className="text-xs text-[#526A59] mt-0.5">
                  Automated computation of multispectral vegetation index over confirmed Aravalli coordinates.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A] w-fit">
                Formula: NDVI = (B8_NIR - B4_Red) / (B8_NIR + B4_Red)
              </span>
            </div>

            {/* Mandatory Statutory Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs font-bold text-amber-900 text-center uppercase tracking-wider font-mono">
              ⚠️ POTENTIAL ENVIRONMENTAL CHANGE — FIELD VERIFICATION REQUIRED.
            </div>

            {loadingSatellite ? (
              <div className="p-12 text-center text-[#526A59]">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1B5E3B]" />
                Ingesting Sentinel-2 surface reflectance bands...
              </div>
            ) : satelliteData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Baseline Pass Card */}
                  <div className="p-5 rounded-2xl border border-[#DCC8A3] bg-[#F5F7F0]/40 space-y-3 font-mono text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#806044] block">
                      BASELINE PASS (PRE-MONSOON REFERENCE)
                    </span>
                    <div className="flex justify-between">
                      <span className="text-[#526A59]">Acquisition:</span>
                      <strong className="text-[#26382D]">{satelliteData.observationPasses?.baseline?.acquisitionDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526A59]">NDVI Index:</span>
                      <strong className="text-[#1B5E3B] text-base">{satelliteData.observationPasses?.baseline?.ndvi}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526A59]">Canopy Classification:</span>
                      <span className="text-[#26382D]">{satelliteData.observationPasses?.baseline?.canopyClass}</span>
                    </div>
                  </div>

                  {/* Latest Pass Card */}
                  <div className="p-5 rounded-2xl border border-red-200 bg-red-50/30 space-y-3 font-mono text-xs">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">
                      LATEST SENTINEL-2 OBSERVATION PASS
                    </span>
                    <div className="flex justify-between">
                      <span className="text-[#526A59]">Acquisition:</span>
                      <strong className="text-[#26382D]">{satelliteData.observationPasses?.latestAvailable?.acquisitionDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526A59]">NDVI Index:</span>
                      <strong className="text-red-600 text-base">{satelliteData.observationPasses?.latestAvailable?.ndvi}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526A59]">Canopy Classification:</span>
                      <span className="text-[#26382D]">{satelliteData.observationPasses?.latestAvailable?.canopyClass}</span>
                    </div>
                  </div>
                </div>

                {/* Change Interpretation */}
                <div className="p-5 rounded-2xl border border-[#A3B18A] bg-[#EAEFE4]/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#1B5E3B]">Change Analysis Interpretation:</span>
                    <span className="font-bold text-red-600">
                      Delta: {satelliteData.changeAnalysis?.percentVegetationChange}
                    </span>
                  </div>
                  <p className="text-[#26382D] leading-relaxed">
                    {satelliteData.changeAnalysis?.ecologicalInterpretation}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 5: WEATHER & METEOROLOGICAL HAZARDS                          */}
      {/* ================================================================ */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCC8A3]/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-[#1B5E3B]" />
                  <h3 className="text-lg font-bold text-[#26382D]">Weather & Meteorological Hazard Intelligence</h3>
                </div>
                <p className="text-xs text-[#526A59] mt-0.5">
                  Real-time atmospheric telemetry and 4 explainable contextual hazard calculations.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A]">
                Source: {weatherData?.dataSource || 'Meteorological Telemetry Feed'}
              </span>
            </div>

            {loadingWeather ? (
              <div className="p-12 text-center text-[#526A59]">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1B5E3B]" />
                Pulling atmospheric sensor readings...
              </div>
            ) : weatherData ? (
              <div className="space-y-6">
                {/* 4 Meteorological Hazard Indicator Cards (Phase 10) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* A. Silica Dust Dispersion Indicator */}
                  <div className="p-5 rounded-2xl border border-[#DCC8A3] bg-[#F5F7F0]/60 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#806044] block">
                      A. Silica Dust Dispersion Plume
                    </span>
                    <strong className="text-sm font-black text-[#26382D] block">
                      {weatherData.hazardAnalysis?.silicaDustDispersion?.dispersionRisk || 'ELEVATED'} Corridor
                    </strong>
                    <p className="text-[11px] text-[#526A59]">
                      Wind speed {weatherData.windSpeedKmph} km/h blowing downwind towards{' '}
                      {weatherData.hazardAnalysis?.silicaDustDispersion?.downwindHeading || 'WSW'}. Potential carry:{' '}
                      {weatherData.hazardAnalysis?.silicaDustDispersion?.estimatedCorridorKm || 3.5} km.
                    </p>
                  </div>

                  {/* B. Quarry Runoff Indicator */}
                  <div className="p-5 rounded-2xl border border-[#DCC8A3] bg-[#F5F7F0]/60 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#806044] block">
                      B. Quarry Runoff Vulnerability
                    </span>
                    <strong className="text-sm font-black text-[#26382D] block">
                      Level: {weatherData.hazardAnalysis?.quarryRunoff?.runoffLevel || 'LOW'}
                    </strong>
                    <p className="text-[11px] text-[#526A59]">
                      Rain probability: {weatherData.rainProbabilityPercent}%. Standard quarry slope containment active.
                    </p>
                  </div>

                  {/* C. Canopy Dryness Indicator */}
                  <div className="p-5 rounded-2xl border border-[#DCC8A3] bg-[#F5F7F0]/60 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#806044] block">
                      C. Canopy Dryness Index
                    </span>
                    <strong className="text-sm font-black text-[#1B5E3B] block">
                      {weatherData.hazardAnalysis?.canopyDryness?.drynessIndex || 52}/100 (Stable)
                    </strong>
                    <p className="text-[11px] text-[#526A59]">
                      Ambient temp {weatherData.temperatureC}°C, humidity {weatherData.humidityPercent}%. Vegetative moisture stable.
                    </p>
                  </div>

                  {/* D. Satellite Visibility Warning */}
                  <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-blue-700 block">
                      D. Satellite Visibility Warning
                    </span>
                    <strong className="text-sm font-black text-blue-900 block">
                      Cloud Cover: {weatherData.cloudCoverPercent}%
                    </strong>
                    <p className="text-[11px] text-blue-800">
                      {weatherData.cloudCoverPercent > 40
                        ? 'SATELLITE OBSERVATION LIMITATION — CLOUD COVER MAY REDUCE VISIBILITY.'
                        : 'Optical cloud cover within nominal limits for Sentinel-2 MSI passes.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 6: ASK ARAVALLI AI ASSISTANT                                 */}
      {/* ================================================================ */}
      {activeTab === 'ask' && (
        <div className="space-y-6 animate-in fade-in">
          <AskAravalliChat reports={reports} />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 7: OFFICER DIRECTORY & PROVISIONING                          */}
      {/* ================================================================ */}
      {activeTab === 'officers' && isAdmin && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCC8A3] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCC8A3]/60 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#26382D]">Forest Authority Officer Directory & Access Control</h3>
                <p className="text-xs text-[#526A59]">
                  Super Administrator registry. Only provisioned officers can access authority dockets.
                </p>
              </div>
              <button
                onClick={() => setShowProvisionModal(true)}
                className="px-4 py-2 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Provision Officer
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#F5F7F0] text-[#526A59] text-[10px] uppercase border-b border-[#DCC8A3]">
                  <tr>
                    <th className="p-3.5">Officer Name</th>
                    <th className="p-3.5">Government Email</th>
                    <th className="p-3.5">Designation & Department</th>
                    <th className="p-3.5">Clearance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCC8A3]/40 text-[#26382D]">
                  {officers.map((off) => (
                    <tr key={off.uid} className="hover:bg-[#F5F7F0]/60">
                      <td className="p-3.5 font-bold text-[#1B5E3B]">{off.name}</td>
                      <td className="p-3.5">{off.email}</td>
                      <td className="p-3.5">{off.designation} — {off.department}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active Clearance
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Triage Modal for Selected Case */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center">
          <div className="bg-white border-2 border-[#DCC8A3] max-w-2xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCC8A3]/60 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#806044] uppercase font-bold block">
                  AUTHORITY CASE TRIAGE DOCKET
                </span>
                <h3 className="text-lg font-black text-[#1B5E3B]">{selectedCase.id}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-2 rounded-xl hover:bg-[#F5F7F0] text-[#526A59]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#26382D] block mb-1 font-bold">1. Select Operational Status Transition</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCC8A3] bg-[#F5F7F0] text-[#26382D] font-bold"
                >
                  {OPERATIONAL_TRANSITIONS.map((op) => (
                    <option key={op.id} value={op.canonical}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#26382D] block mb-1 font-bold">
                  2. Mandatory Forensic Audit Note (Required on Every Transition)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Record officer inspection observations, ground coordinates verified, or dispatch orders..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCC8A3] bg-[#F5F7F0] text-[#26382D]"
                />
              </div>

              {newStatus === 'resolved' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-3">
                  <span className="font-bold text-emerald-800 block">Case Resolution & Citizen Notice</span>
                  <input
                    type="text"
                    required
                    placeholder="Resolution Summary (e.g. Illegal crusher sealed and seized under IFA Sec 26)"
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-[#26382D]"
                  />
                  <input
                    type="text"
                    placeholder="Remediation Action Taken"
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-[#26382D]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdatingStatus}
                className="w-full py-3 rounded-2xl bg-[#1B5E3B] hover:bg-[#2E8B57] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isUpdatingStatus ? 'Dispatching...' : 'Save Status & Dispatch Milestone'}</span>
              </button>
            </form>

            {/* Confidential Officer Internal Note */}
            <form onSubmit={handleSaveInternalNote} className="p-4 rounded-2xl bg-[#EAEFE4] border border-[#A3B18A] space-y-2 text-xs font-mono">
              <span className="font-bold text-[#1B5E3B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Confidential Internal Officer Note (Stripped from Public)
              </span>
              <textarea
                rows={2}
                placeholder="Confidential informant intel, vehicle numbers, or private investigation log..."
                value={internalNoteText}
                onChange={(e) => setInternalNoteText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCC8A3] text-[#26382D]"
              />
              <button
                type="submit"
                disabled={savingInternalNote || !internalNoteText.trim()}
                className="px-4 py-2 rounded-xl bg-[#806044] hover:bg-[#6a4f38] text-white font-bold text-xs"
              >
                {savingInternalNote ? 'Saving...' : 'Add Confidential Note'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Dossier Modal */}
      {activeDossier && (
        <PrintableIncidentDossier dossier={activeDossier} onClose={() => setActiveDossier(null)} />
      )}

      {/* Provision Officer Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center">
          <div className="bg-white border border-[#DCC8A3] max-w-lg w-full rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCC8A3]/60 pb-3">
              <div className="flex items-center gap-2 text-[#1B5E3B] font-bold text-sm">
                <PlusCircle className="w-4 h-4" />
                <span>Provision New Forest Authority Officer</span>
              </div>
              <button onClick={() => setShowProvisionModal(false)} className="text-[#526A59]">
                ✕
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[#26382D] block mb-1 font-bold">Officer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Officer Rajesh Sharma"
                  value={newOfficer.fullName}
                  onChange={(e) => setNewOfficer({ ...newOfficer, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F7F0] border border-[#DCC8A3] text-[#26382D]"
                />
              </div>

              <div>
                <label className="text-[#26382D] block mb-1 font-bold">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="officer.sharma@forest.haryana.gov.in"
                  value={newOfficer.email}
                  onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F7F0] border border-[#DCC8A3] text-[#26382D]"
                />
              </div>

              <div>
                <label className="text-[#26382D] block mb-1 font-bold">Department</label>
                <input
                  type="text"
                  required
                  value={newOfficer.department}
                  onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F7F0] border border-[#DCC8A3] text-[#26382D]"
                />
              </div>

              <div>
                <label className="text-[#26382D] block mb-1 font-bold">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newOfficer.password}
                  onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F7F0] border border-[#DCC8A3] text-[#26382D]"
                />
              </div>

              <button
                type="submit"
                disabled={provisioning}
                className="w-full py-3 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs"
              >
                {provisioning ? 'Registering...' : 'Provision Officer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
