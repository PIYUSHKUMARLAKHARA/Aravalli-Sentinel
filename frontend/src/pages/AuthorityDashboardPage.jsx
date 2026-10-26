import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  FileText,
  Printer,
  Sparkles,
  ArrowRight,
  UserCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { fetchReports, updateReportStatus, fetchIncidentDossier } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { PrintableIncidentDossier } from '../components/PrintableIncidentDossier';
import { useAuth } from '../context/AuthContext';

export function AuthorityDashboardPage() {
  const { user, isAuthority, switchPersona } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected case for triage modal
  const [selectedCase, setSelectedCase] = useState(null);
  const [newStatus, setNewStatus] = useState('under_review');
  const [actionNotes, setActionNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Printable Dossier state
  const [activeDossier, setActiveDossier] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchReports();
      if (res.success && res.reports) {
        setReports(res.reports);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  // Handle status update
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!actionNotes || actionNotes.trim().length < 5) {
      setUpdateMessage('Please provide at least 5 characters of action notes for the official audit trail.');
      return;
    }

    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const res = await updateReportStatus(selectedCase.id, {
        status: newStatus,
        actionNotes,
        assignedOfficer: user?.name,
      });

      if (res.success && res.report) {
        setReports(prev => prev.map(r => r.id === res.report.id ? res.report : r));
        setSelectedCase(res.report);
        setActionNotes('');
        setUpdateMessage(`Case status successfully updated to ${newStatus}. Audit log updated.`);
      } else {
        setUpdateMessage(res.error || 'Failed to update case status.');
      }
    } catch (err) {
      setUpdateMessage('Error: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Open printable incident dossier
  const handleOpenDossier = async (reportId) => {
    setLoadingDossier(true);
    try {
      const res = await fetchIncidentDossier(reportId);
      if (res.success && res.dossier) {
        setActiveDossier(res.dossier);
      }
    } catch (err) {
      console.error('Failed to load dossier:', err);
    } finally {
      setLoadingDossier(false);
    }
  };

  // Filtered cases
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (threatFilter !== 'all' && r.threatCategory !== threatFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.locationName?.toLowerCase().includes(q) ||
        r.zoneName?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate metrics
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const underReviewCount = reports.filter(r => r.status === 'under_review').length;
  const verifiedCount = reports.filter(r => r.status === 'verified').length;
  const criticalCount = reports.filter(r => r.riskAssessment?.riskLevel === 'CRITICAL').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Authority Verification Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
              OFFICIAL ENFORCEMENT & TRIAGE DESK
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Forest Dept & Task Force Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Incident Triage & Verification Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review incoming citizen intelligence, inspect Gemini AI vision indicators, verify field coordinates, and dispatch enforcement raids.
          </p>
        </div>

        {/* Officer Profile Badge & Quick Persona Switcher */}
        <div className="flex items-center gap-3">
          {!isAuthority && (
            <div className="bg-amber-950/60 border border-amber-500/40 p-2.5 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>You are viewing as Citizen. To test status changes:</span>
              <button
                onClick={() => switchPersona('authority')}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Switch to Authority
              </button>
            </div>
          )}

          {isAuthority && (
            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Acting as: <strong>{user?.name}</strong> (DFO)</span>
            </div>
          )}

          <button
            onClick={loadReports}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
            title="Refresh triage reports"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80">
          <span className="text-[11px] uppercase text-slate-400 block">Total Ingested</span>
          <span className="text-2xl font-bold text-white">{totalCount} Cases</span>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20">
          <span className="text-[11px] uppercase text-rose-300 block">Critical Risk</span>
          <span className="text-2xl font-bold text-rose-400">{criticalCount} Flagged</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80">
          <span className="text-[11px] uppercase text-slate-400 block">Pending Triage</span>
          <span className="text-2xl font-bold text-amber-300">{pendingCount}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80">
          <span className="text-[11px] uppercase text-slate-400 block">Under Review</span>
          <span className="text-2xl font-bold text-cyan-300">{underReviewCount}</span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[11px] uppercase text-emerald-300 block">Verified / Raided</span>
          <span className="text-2xl font-bold text-emerald-400">{verifiedCount}</span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search report ID, sector, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {['all', 'pending', 'under_review', 'verified', 'resolved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-colors ${
                statusFilter === status
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Table / Cards */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/70 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-4">CASE ID & TIME</th>
                <th className="p-4">THREAT CATEGORY</th>
                <th className="p-4">LOCATION / SECTOR</th>
                <th className="p-4">RISK ENGINE SCORE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white block">{report.id}</span>
                    <span className="text-[10px] text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">
                    {report.threatCategory}
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-white block truncate max-w-xs">{report.locationName}</span>
                    <span className="text-[10px] text-slate-400">{report.zoneName}</span>
                  </td>
                  <td className="p-4">
                    <RiskBadge
                      level={report.riskAssessment?.riskLevel}
                      score={report.riskAssessment?.score}
                      size="sm"
                    />
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      report.status === 'verified'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : report.status === 'under_review'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : report.status === 'resolved'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : report.status === 'rejected'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCase(report);
                        setNewStatus(report.status);
                        setUpdateMessage('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => handleOpenDossier(report.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      title="Generate Incident Dossier"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Dossier</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Review & Triage Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="bg-slate-900 border border-slate-700 max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white font-mono text-sm">{selectedCase.id}</span>
                  <RiskBadge
                    level={selectedCase.riskAssessment?.riskLevel}
                    score={selectedCase.riskAssessment?.score}
                    size="sm"
                  />
                </div>
                <h2 className="text-base font-bold text-slate-200">{selectedCase.threatCategory}</h2>
                <p className="text-xs text-slate-400">{selectedCase.locationName} ({selectedCase.zoneName})</p>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {updateMessage && (
                <div className={`p-3 rounded-lg border text-xs ${
                  updateMessage.includes('successfully')
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  {updateMessage}
                </div>
              )}

              {/* Evidence Photo & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={selectedCase.imageUrl}
                    alt="Evidence photograph"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2 text-[10px] text-slate-400 font-mono text-center">
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

              {/* Enforcement Action Form */}
              <form onSubmit={handleUpdateStatus} className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-4">
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
                      <option value="under_review">Under Review (Patrol Dispatched)</option>
                      <option value="verified">Verified (Violation Confirmed)</option>
                      <option value="resolved">Resolved (Machinery Seized / Cleared)</option>
                      <option value="rejected">Rejected (False Alarm / Non-Forest Land)</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Acting Officer</label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || 'Authorized Officer'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400"
                    >
                    </input>
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUpdating ? 'Recording Status in Audit Trail...' : 'Confirm Status Update & Save Audit Log'}</span>
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

      {/* Printable Incident Dossier Component */}
      {activeDossier && (
        <PrintableIncidentDossier
          dossier={activeDossier}
          onClose={() => setActiveDossier(null)}
        />
      )}
    </div>
  );
}

export default AuthorityDashboardPage;
