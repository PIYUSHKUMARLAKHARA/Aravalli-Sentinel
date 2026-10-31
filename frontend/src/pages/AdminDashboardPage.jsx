import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  Lock,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Database,
  RefreshCw,
  Cpu,
  ArrowRight,
  Sparkles,
  KeyRound,
  FileText,
  Trash2,
  Edit3,
  Sliders,
  Eye,
  Clock,
  Printer,
  ExternalLink,
  ChevronDown,
  Building2,
} from 'lucide-react';
import {
  fetchReports,
  updateReportStatus,
  fetchIncidentDossier,
  fetchAdminOfficers,
  updateOfficerPermissions,
  adminProvisionOfficer,
  adminDeleteOfficer,
  fetchAdminSystemStats,
} from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { PrintableIncidentDossier } from '../components/PrintableIncidentDossier';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { EvidenceViewerModal } from '../components/ui/EvidenceViewerModal';
import { useAuth } from '../context/AuthContext';

export function AdminDashboardPage({ initialTab = 'triage' }) {
  const location = useLocation();
  const { user, isAuthority, isAdmin } = useAuth();

  // Navigation Tabs: 'triage' (Authority Section) | 'officers' (Permissions Desk) | 'telemetry' (System Overview)
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || initialTab);

  // Common notification feedback
  const [feedback, setFeedback] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

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

  // Printable Dossier & Lightbox
  const [activeDossier, setActiveDossier] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const [viewingEvidence, setViewingEvidence] = useState(null);

  // =========================================================================
  // 2. OFFICER PERMISSIONS & PROVISIONING STATE
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
    permissions: {
      canVerifyIncidents: true,
      canUpdateStatus: true,
      canDispatchPatrols: true,
      canExportDossiers: true,
      isActive: true,
    },
  });
  const [provisioning, setProvisioning] = useState(false);

  // =========================================================================
  // 3. SYSTEM STATS & TELEMETRY
  // =========================================================================
  const [systemStats, setSystemStats] = useState(null);

  // Load All Data
  const loadAllData = async () => {
    setGlobalLoading(true);
    try {
      const reportsPromise = fetchReports();
      const officersPromise = isAdmin
        ? fetchAdminOfficers()
        : Promise.resolve({ success: true, officers: user?.permissions ? [user] : [] });
      const statsPromise = isAdmin
        ? fetchAdminSystemStats()
        : Promise.resolve({ success: false });

      const [reportsRes, officersRes, statsRes] = await Promise.all([
        reportsPromise,
        officersPromise,
        statsPromise,
      ]);

      if (reportsRes.success && Array.isArray(reportsRes.reports)) {
        setReports(reportsRes.reports);
      }
      if (officersRes.success && Array.isArray(officersRes.officers)) {
        setOfficers(officersRes.officers);
      }
      if (statsRes.success) {
        setSystemStats(statsRes);
      }
    } catch (err) {
      console.error('Error loading admin panel data:', err);
    } finally {
      setLoadingReports(false);
      setLoadingOfficers(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user]);

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [location.search]);

  // =========================================================================
  // AUTHORITY TRIAGE ACTIONS
  // =========================================================================
  const handleOpenTriage = (report) => {
    setSelectedCase(report);
    setNewStatus(report.status === 'pending' ? 'under_review' : report.status);
    setActionNotes('');
    setResolutionSummary(report.resolution?.summary || '');
    setActionTaken(report.resolution?.actionTaken || '');
    setOfficerRemarks(report.resolution?.officerRemarks || '');
    setResolutionDate(
      report.resolution?.resolutionDate
        ? new Date(report.resolution.resolutionDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    );
    setFeedback(null);
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (newStatus === 'resolved') {
      if (!resolutionSummary || resolutionSummary.trim().length < 5) {
        setFeedback({
          type: 'error',
          message: 'Resolution Summary is required and must be at least 5 characters long when marking a case as resolved.',
        });
        return;
      }
    } else {
      if (!actionNotes || actionNotes.trim().length < 5) {
        setFeedback({
          type: 'error',
          message: 'Please provide at least 5 characters of official action notes for the forensic audit trail.',
        });
        return;
      }
    }

    setIsUpdatingStatus(true);
    setFeedback(null);

    try {
      const payload = {
        status: newStatus,
        assignedOfficer: user?.name,
        actionNotes: newStatus === 'resolved' ? resolutionSummary.trim() : actionNotes.trim(),
        ...(newStatus === 'resolved'
          ? {
              resolutionSummary: resolutionSummary.trim(),
              actionTaken: actionTaken.trim() || 'Remediation completed by authorized Forest Authority.',
              officerRemarks: officerRemarks.trim() || 'Case verified and resolved in compliance with Aravalli protection mandates.',
              resolutionDate: resolutionDate || new Date().toISOString(),
            }
          : {}),
      };

      const res = await updateReportStatus(selectedCase.id, payload);

      if (res.success && res.report) {
        setReports((prev) => prev.map((r) => (r.id === res.report.id ? res.report : r)));
        setSelectedCase(res.report);
        setActionNotes('');
        setFeedback({
          type: 'success',
          message: `Case ${res.report.id} status successfully updated to '${newStatus}'. Cryptographic audit log updated and citizen notification dispatched.`,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update case status.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Status update error: ' + err.message });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOpenDossier = async (reportId) => {
    setLoadingDossier(true);
    try {
      const res = await fetchIncidentDossier(reportId);
      if (res.success && res.dossier) {
        setActiveDossier(res.dossier);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to load legal incident dossier: ' + err.message });
    } finally {
      setLoadingDossier(false);
    }
  };

  // Filtered reports for Triage tab
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (threatFilter !== 'all' && !r.threatCategory?.toLowerCase().includes(threatFilter.toLowerCase())) return false;
    if (triageSearch.trim() !== '') {
      const q = triageSearch.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.locationName?.toLowerCase().includes(q) ||
        r.zoneName?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Incident Counts
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review').length;
  const verifiedCount = reports.filter((r) => r.status === 'verified').length;
  const criticalCount = reports.filter((r) => r.riskAssessment?.riskLevel === 'CRITICAL').length;

  // =========================================================================
  // OFFICER PERMISSIONS ACTIONS (SUPER ADMIN ONLY)
  // =========================================================================
  const handleTogglePermission = async (officerUid, permKey, currentValue) => {
    if (!isAdmin) {
      setFeedback({ type: 'error', message: 'Action Restricted: Only the Super Administrator can modify officer clearances.' });
      return;
    }

    try {
      const updatedPermissions = { [permKey]: !currentValue };
      const res = await updateOfficerPermissions(officerUid, { permissions: updatedPermissions });

      if (res.success) {
        setOfficers((prev) =>
          prev.map((off) => {
            if (off.uid === officerUid || off.email === officerUid) {
              return {
                ...off,
                permissions: {
                  ...(off.permissions || {}),
                  ...updatedPermissions,
                },
              };
            }
            return off;
          })
        );
        setFeedback({
          type: 'success',
          message: `Permission '${permKey}' updated to ${!currentValue ? 'GRANTED' : 'DENIED'}.`,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update permission.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  const handleToggleOfficerActive = async (officerUid, currentActive) => {
    await handleTogglePermission(officerUid, 'isActive', currentActive);
  };

  const handleDeleteOfficer = async (officerUid, officerName) => {
    if (!isAdmin) {
      setFeedback({ type: 'error', message: 'Action Restricted: Only the Super Administrator can revoke officers.' });
      return;
    }

    if (!window.confirm(`Revoke and delete all enforcement clearance for ${officerName}?`)) {
      return;
    }

    try {
      const res = await adminDeleteOfficer(officerUid);
      if (res.success) {
        setOfficers((prev) => prev.filter((o) => o.uid !== officerUid && o.email !== officerUid));
        setFeedback({ type: 'success', message: `Officer '${officerName}' access successfully revoked.` });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Could not delete officer.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error revoking officer: ' + err.message });
    }
  };

  const handleProvisionSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setFeedback({ type: 'error', message: 'Action Restricted: Only the Super Administrator can provision officers.' });
      return;
    }

    setProvisioning(true);
    setFeedback(null);

    try {
      const res = await adminProvisionOfficer(newOfficer);
      if (res.success && res.officer) {
        setOfficers((prev) => [res.officer, ...prev]);
        setShowProvisionModal(false);
        setFeedback({
          type: 'success',
          message: `Enforcement Officer '${res.officer.name}' successfully provisioned with custom permissions.`,
        });
        setNewOfficer({
          fullName: '',
          email: '',
          department: 'Rajasthan Forest Department & Aravalli Task Force',
          designation: 'Range Forest Officer (RFO)',
          password: '',
          permissions: {
            canVerifyIncidents: true,
            canUpdateStatus: true,
            canDispatchPatrols: true,
            canExportDossiers: true,
            isActive: true,
          },
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

  const filteredOfficers = officers.filter((off) => {
    const q = officerSearch.toLowerCase();
    const matchesSearch =
      (off.name || '').toLowerCase().includes(q) ||
      (off.email || '').toLowerCase().includes(q) ||
      (off.department || '').toLowerCase().includes(q) ||
      (off.designation || '').toLowerCase().includes(q);

    if (filterActiveOfficer === 'active') return matchesSearch && off.permissions?.isActive !== false;
    if (filterActiveOfficer === 'suspended') return matchesSearch && off.permissions?.isActive === false;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ================================================================ */}
      {/* 1. MASTER COMMAND VAULT HEADER                                   */}
      {/* ================================================================ */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-amber-950/40 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Central Administration & Authority Command
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                {isAdmin ? 'SUPER ADMINISTRATOR (1 OF 1)' : 'AUTHORIZED ENFORCEMENT OFFICER'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Aravalli Sentinel — Admin & Authority Operations Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Unified command center containing the full <strong>Authority Incident Triage Desk</strong>, forensic audit logs, and the <strong>Officer Permissions Console</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowProvisionModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Provision Officer</span>
              </button>
            )}
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Refresh all data"
            >
              <RefreshCw className={`w-4 h-4 ${globalLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Security Mandate Pill */}
        <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Centralized Security Architecture:</strong> Exactly 1 Super Administrator operates this platform (<code>{systemStats?.adminPolicy?.superAdmin?.email || 'admin@aravalli.sentinel'}</code>). Incident triage is strictly role-governed.
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-300 hidden sm:inline">
            Active User: <strong>{user?.name}</strong>
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-mono border flex items-center justify-between animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white ml-2">
            ✕
          </button>
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. ADMIN PANEL TAB SWITCHER                                      */}
      {/* ================================================================ */}
      <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 max-w-2xl font-mono text-xs shadow-lg">
        <button
          onClick={() => setActiveTab('triage')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'triage'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Authority Incident Triage ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('officers')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'officers'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Officer Permissions ({officers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'telemetry'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>System Telemetry</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* TAB 1: AUTHORITY INCIDENT TRIAGE SECTION (MOVED HERE)            */}
      {/* ================================================================ */}
      {activeTab === 'triage' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Triage Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-md">
              <span className="text-[11px] uppercase text-slate-400 block">Total Ingested</span>
              <span className="text-2xl font-bold text-white">{totalCount} Cases</span>
            </div>
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 shadow-md">
              <span className="text-[11px] uppercase text-rose-300 block">Critical Risk</span>
              <span className="text-2xl font-bold text-rose-400">{criticalCount} Flagged</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-md">
              <span className="text-[11px] uppercase text-slate-400 block">Pending Triage</span>
              <span className="text-2xl font-bold text-amber-300">{pendingCount}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-md">
              <span className="text-[11px] uppercase text-slate-400 block">Under Review</span>
              <span className="text-2xl font-bold text-cyan-300">{underReviewCount}</span>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 shadow-md">
              <span className="text-[11px] uppercase text-emerald-300 block">Verified / Raided</span>
              <span className="text-2xl font-bold text-emerald-400">{verifiedCount}</span>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search report ID, sector, or keywords..."
                value={triageSearch}
                onChange={(e) => setTriageSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {[
                'all',
                'pending',
                'under_review',
                'investigation_in_progress',
                'action_taken',
                'verified',
                'resolved',
                'rejected',
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg uppercase transition-colors ${
                    statusFilter === status
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-4">EVIDENCE</th>
                    <th className="p-4">CASE ID & TIME</th>
                    <th className="p-4">THREAT CATEGORY</th>
                    <th className="p-4">LOCATION / SECTOR</th>
                    <th className="p-4">RISK SCORE</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="w-14 h-11 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 cursor-pointer">
                          <ImageWithFallback
                            src={report.imageUrl}
                            fallbackSrc={report.fallbackImageUrl}
                            threatCategory={report.threatCategory}
                            alt={report.id}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            showZoomBadge={true}
                            onZoom={() =>
                              setViewingEvidence({
                                url: report.imageUrl,
                                caseId: report.id,
                                threatCategory: report.threatCategory,
                                locationName: report.locationName,
                                latitude: report.latitude,
                                longitude: report.longitude,
                                reportedAt: report.createdAt,
                              })
                            }
                          />
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-white">
                        <span className="block text-emerald-400 font-bold">{report.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(report.createdAt).toLocaleDateString()}{' '}
                          {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-200">{report.threatCategory}</span>
                      </td>

                      <td className="p-4 max-w-xs truncate text-slate-300" title={report.locationName}>
                        {report.locationName}
                        {report.zoneName && (
                          <span className="block text-[10px] text-slate-500 font-mono">
                            {report.zoneName}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <RiskBadge
                          score={report.riskAssessment?.score || report.riskScore || 50}
                          level={report.riskAssessment?.riskLevel || report.riskLevel}
                          size="sm"
                        />
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            report.status === 'verified'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : report.status === 'under_review'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : report.status === 'resolved'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : report.status === 'rejected'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenTriage(report)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Triage</span>
                        </button>
                        <button
                          onClick={() => handleOpenDossier(report.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                          title="Generate printable incident dossier"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: OFFICER PERMISSIONS CONSOLE (ADMIN SECTION)               */}
      {/* ================================================================ */}
      {activeTab === 'officers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Enforcement Clearance & Officer Permissions Desk</span>
              </h2>
              <p className="text-xs text-slate-400">
                Grant or revoke specific action permissions per officer. Inactive officers cannot modify reports.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search officer or department..."
                  value={officerSearch}
                  onChange={(e) => setOfficerSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 w-52 sm:w-64 font-mono"
                />
              </div>

              <select
                value={filterActiveOfficer}
                onChange={(e) => setFilterActiveOfficer(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="all">All Officers ({officers.length})</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {!isAdmin && (
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>View-Only Notice:</strong> You are currently logged in as an Enforcement Officer. Modifying clearances or provisioning officers is restricted to the Super Administrator (<code>admin@aravalli.sentinel</code>).
              </span>
            </div>
          )}

          {/* Officers Table */}
          {loadingOfficers ? (
            <div className="py-16 text-center text-slate-400 text-xs font-mono">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Synchronizing officer credentials...</span>
            </div>
          ) : filteredOfficers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800 space-y-2">
              <p>No enforcement officers found matching your search.</p>
              {isAdmin && (
                <button
                  onClick={() => setShowProvisionModal(true)}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Provision an enforcement officer
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">OFFICER & DEPARTMENT</th>
                    <th className="py-3 px-3">ACCOUNT STATUS</th>
                    <th className="py-3 px-3 text-center">VERIFY INCIDENTS</th>
                    <th className="py-3 px-3 text-center">UPDATE STATUS</th>
                    <th className="py-3 px-3 text-center">DISPATCH PATROLS</th>
                    <th className="py-3 px-3 text-center">EXPORT DOSSIERS</th>
                    <th className="py-3 px-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredOfficers.map((off) => {
                    const perms = off.permissions || {
                      canVerifyIncidents: true,
                      canUpdateStatus: true,
                      canDispatchPatrols: true,
                      canExportDossiers: true,
                      isActive: true,
                    };
                    const isActive = perms.isActive !== false;

                    return (
                      <tr key={off.uid || off.email} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{off.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                              {off.designation}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{off.department}</div>
                          <div className="text-[10px] text-purple-400">{off.email}</div>
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleOfficerActive(off.uid || off.email, isActive)}
                            disabled={!isAdmin}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                              isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                          >
                            {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>{isActive ? 'ACTIVE' : 'SUSPENDED'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() =>
                              handleTogglePermission(off.uid || off.email, 'canVerifyIncidents', perms.canVerifyIncidents)
                            }
                            disabled={!isAdmin}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              perms.canVerifyIncidents
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                          >
                            {perms.canVerifyIncidents ? 'GRANTED' : 'DENIED'}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() =>
                              handleTogglePermission(off.uid || off.email, 'canUpdateStatus', perms.canUpdateStatus)
                            }
                            disabled={!isAdmin}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              perms.canUpdateStatus
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                          >
                            {perms.canUpdateStatus ? 'GRANTED' : 'DENIED'}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() =>
                              handleTogglePermission(off.uid || off.email, 'canDispatchPatrols', perms.canDispatchPatrols)
                            }
                            disabled={!isAdmin}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              perms.canDispatchPatrols
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                          >
                            {perms.canDispatchPatrols ? 'GRANTED' : 'DENIED'}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() =>
                              handleTogglePermission(off.uid || off.email, 'canExportDossiers', perms.canExportDossiers)
                            }
                            disabled={!isAdmin}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              perms.canExportDossiers
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                          >
                            {perms.canExportDossiers ? 'GRANTED' : 'DENIED'}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteOfficer(off.uid || off.email, off.name)}
                            disabled={!isAdmin}
                            className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Revoke and delete officer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: SYSTEM OVERVIEW & TELEMETRY                               */}
      {/* ================================================================ */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Super Admin Authority</span>
              <div className="text-xl font-bold text-white font-mono">1 Authorized</div>
              <p className="text-[11px] text-purple-400">{systemStats?.adminPolicy?.superAdmin?.email || 'admin@aravalli.sentinel'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Monitored Eco-Sectors</span>
              <div className="text-xl font-bold text-white font-mono">{systemStats?.zones?.total || 10} Sectors</div>
              <p className="text-[11px] text-emerald-400">Delhi NCR to Gujarat Ridge</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Persistence Backend</span>
              <div className="text-xl font-bold text-cyan-400 font-mono">{systemStats?.database?.type || 'MongoDB'}</div>
              <p className="text-[11px] text-slate-400">Status: {systemStats?.database?.status || 'CONNECTED'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Total Field Incidents</span>
              <div className="text-xl font-bold text-amber-400 font-mono">{totalCount} Ingested</div>
              <p className="text-[11px] text-slate-400">{verifiedCount} confirmed violations</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Statutory Compliance & Security Assertions</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-sans list-disc list-inside leading-relaxed">
              <li>
                <strong>Single Super Administrator:</strong> All administrative authority is concentrated in <code>admin@aravalli.sentinel</code> to maintain strict security boundaries for public environmental data.
              </li>
              <li>
                <strong>Cryptographic Audit Trails:</strong> Every case status change appends a non-repudiable audit entry recording officer identity, timestamp, and official justification notes.
              </li>
              <li>
                <strong>Citizen Identity Protection Shield:</strong> Public feeds automatically redact citizen phone numbers and private identifiers to protect grassroots sentinels under PLPA directives.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TRIAGE ACTION SLIDE-OVER / MODAL                                 */}
      {/* ================================================================ */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/30 max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  Enforcement Triage & Field Audit
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedCase.id}
                </span>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <ImageWithFallback
                      src={selectedCase.imageUrl}
                      fallbackSrc={selectedCase.fallbackImageUrl}
                      threatCategory={selectedCase.threatCategory}
                      alt={selectedCase.id}
                      className="w-full h-full object-cover"
                      showZoomBadge={true}
                      onZoom={() =>
                        setViewingEvidence({
                          url: selectedCase.imageUrl,
                          caseId: selectedCase.id,
                          threatCategory: selectedCase.threatCategory,
                          locationName: selectedCase.locationName,
                          latitude: selectedCase.latitude,
                          longitude: selectedCase.longitude,
                          reportedAt: selectedCase.createdAt,
                        })
                      }
                    />
                  </div>
                  <div className="p-2 text-[10px] text-slate-400 font-mono text-center border-t border-slate-800 bg-slate-950">
                    GPS: {selectedCase.latitude}° N, {selectedCase.longitude}° E
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-mono text-slate-400 text-[10px] uppercase block">
                    Citizen Submission Observations
                  </span>
                  <p className="text-slate-300 italic leading-relaxed">
                    "{selectedCase.description}"
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    Reported on: {new Date(selectedCase.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Gemini AI Evidence Analysis Card */}
              {selectedCase.evidenceAnalysis && (
                <div>
                  <AIAnalysisCard analysis={selectedCase.evidenceAnalysis} />
                </div>
              )}

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatusSubmit} className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Update Official Case Status & Dispatch Notes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Target Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="pending">PENDING (Initial Citizen Submission)</option>
                      <option value="under_review">UNDER REVIEW (Field Verification Assigned)</option>
                      <option value="investigation_in_progress">INVESTIGATION IN PROGRESS (On-Site Team Deployed)</option>
                      <option value="action_taken">ACTION TAKEN (Seizure / Notice Issued)</option>
                      <option value="verified">VERIFIED (Violation Confirmed)</option>
                      <option value="resolved">RESOLVED (Remediation Completed / Case Closed)</option>
                      <option value="rejected">REJECTED / INVALID (Non-Forest Land / False Report)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Acting Officer</label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || 'Authorized Officer'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400"
                    />
                  </div>
                </div>

                {/* Conditional Resolution Fields when status is RESOLVED */}
                {newStatus === 'resolved' ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Case Resolution Protocol & Citizen Notification</span>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1 font-mono font-semibold">
                        Resolution Summary <span className="text-emerald-400">* (Required, min 5 chars)</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Detail the remedial action taken (e.g. Illegal excavator seized, mining pit backfilled, area returned to forest division custody)."
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-300 uppercase block mb-1 font-mono">
                          Action Taken
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Machinery impounded; FIR lodged under PLPA Sec 4"
                          value={actionTaken}
                          onChange={(e) => setActionTaken(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-300 uppercase block mb-1 font-mono">
                          Resolution Date
                        </label>
                        <input
                          type="date"
                          value={resolutionDate}
                          onChange={(e) => setResolutionDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1 font-mono">
                        Official Officer Remarks (Internal & Dossier Record)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Physical perimeter secured. Routine ranger patrols scheduled every Wednesday to deter reincursion."
                        value={officerRemarks}
                        onChange={(e) => setOfficerRemarks(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <p className="text-[10px] text-emerald-400/90 font-mono">
                      ✓ Saving this resolution will immediately dispatch an in-app resolution notification to the reporting citizen.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">
                      Enforcement Action Notes (Mandatory for Audit Trail)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Range Forest Officer dispatched team with DGPS. Show-cause notice issued under PLPA Section 4."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                )}

                {/* Permission restriction notices */}
                {!isAdmin && user?.permissions?.isActive === false && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Account Suspended: Super Administrator has deactivated your enforcement clearance. Contact the Admin Panel.</span>
                  </div>
                )}

                {!isAdmin && user?.permissions?.canUpdateStatus === false && (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Permission Restricted: Super Administrator has restricted your permission to update incident status.</span>
                  </div>
                )}

                {!isAdmin && newStatus === 'verified' && user?.permissions?.canVerifyIncidents === false && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Verification Restricted: You lack clearance to confirm violations. Only authorized inspectors can certify incidents.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    isUpdatingStatus ||
                    (!isAdmin && (
                      user?.permissions?.isActive === false ||
                      user?.permissions?.canUpdateStatus === false ||
                      (newStatus === 'verified' && user?.permissions?.canVerifyIncidents === false)
                    ))
                  }
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isUpdatingStatus
                      ? 'Recording Status in Audit Trail...'
                      : newStatus === 'resolved'
                      ? 'Mark Case Resolved & Dispatch Notification'
                      : 'Confirm Status Update & Save Audit Log'}
                  </span>
                </button>
              </form>

              {/* Audit Trail List */}
              <div className="space-y-2">
                <span className="font-mono text-slate-400 text-[10px] uppercase block">
                  Chain of Custody & Audit History
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {selectedCase.auditTrail?.map((audit, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-white">{audit.action}</span>
                        <span>{new Date(audit.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-300 font-sans text-xs">{audit.notes}</div>
                      <div className="text-[10px] text-slate-500">By: {audit.by} ({audit.role})</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* PROVISION OFFICER MODAL                                          */}
      {/* ================================================================ */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-slate-900 border border-purple-500/30 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <PlusCircle className="w-4 h-4" />
                <span>Provision New Forest Authority Officer</span>
              </div>
              <button onClick={() => setShowProvisionModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Official Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer Sunita Verma"
                  value={newOfficer.fullName}
                  onChange={(e) => setNewOfficer({ ...newOfficer, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Official Government / Agency Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. s.verma@forest.rajasthan.gov.in"
                  value={newOfficer.email}
                  onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Assigned Department</label>
                <input
                  type="text"
                  required
                  value={newOfficer.department}
                  onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={newOfficer.designation}
                  onChange={(e) => setNewOfficer({ ...newOfficer, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Temporary Initial Password</label>
                <input
                  type="password"
                  placeholder="Officer@Aravalli2026!"
                  value={newOfficer.password}
                  onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-300 font-bold block mb-1">Initial Authority Clearances</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newOfficer.permissions.canVerifyIncidents}
                      onChange={(e) =>
                        setNewOfficer({
                          ...newOfficer,
                          permissions: { ...newOfficer.permissions, canVerifyIncidents: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Verify Incidents</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newOfficer.permissions.canUpdateStatus}
                      onChange={(e) =>
                        setNewOfficer({
                          ...newOfficer,
                          permissions: { ...newOfficer.permissions, canUpdateStatus: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Update Status</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newOfficer.permissions.canDispatchPatrols}
                      onChange={(e) =>
                        setNewOfficer({
                          ...newOfficer,
                          permissions: { ...newOfficer.permissions, canDispatchPatrols: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Dispatch Patrols</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newOfficer.permissions.canExportDossiers}
                      onChange={(e) =>
                        setNewOfficer({
                          ...newOfficer,
                          permissions: { ...newOfficer.permissions, canExportDossiers: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Export Dossiers</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={provisioning}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {provisioning ? 'Provisioning...' : 'Provision Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Incident Dossier Modal */}
      {activeDossier && (
        <PrintableIncidentDossier
          dossier={activeDossier}
          onClose={() => setActiveDossier(null)}
        />
      )}

      {/* Lightbox / Evidence Viewer Modal */}
      {viewingEvidence && (
        <EvidenceViewerModal
          evidence={viewingEvidence}
          onClose={() => setViewingEvidence(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboardPage;
