import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { trackCaseById, fetchReports } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  pending: { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  under_review: { label: 'Under Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  verified: { label: 'Verified by Officer', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  under_investigation: { label: 'Under Investigation', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  investigation_in_progress: { label: 'Under Investigation', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  action_taken: { label: 'Action Taken', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  resolved: { label: 'Resolved', bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-300' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  invalid: { label: 'Invalid Submission', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  needs_more_information: { label: 'Needs More Info', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export function CaseTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const caseIdParam = searchParams.get('id') || '';

  const { user } = useAuth();

  const [inputCaseId, setInputCaseId] = useState(caseIdParam);
  const [loading, setLoading] = useState(false);
  const [trackedCase, setTrackedCase] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Citizen's personal reports list for quick switching
  const [myReports, setMyReports] = useState([]);
  const [loadingMyReports, setLoadingMyReports] = useState(false);

  useEffect(() => {
    if (caseIdParam) {
      handleSearchCase(caseIdParam);
    }
  }, [caseIdParam]);

  useEffect(() => {
    if (user && user.role === 'citizen') {
      loadCitizenReports();
    }
  }, [user]);

  const loadCitizenReports = async () => {
    setLoadingMyReports(true);
    try {
      const res = await fetchReports({ myReports: 'true' });
      if (res.success && res.reports) {
        setMyReports(res.reports);
      }
    } catch (err) {
      console.warn('Could not load citizen reports:', err);
    } finally {
      setLoadingMyReports(false);
    }
  };

  const handleSearchCase = async (idToSearch) => {
    const id = (idToSearch || inputCaseId).trim();
    if (!id) {
      setSearchError('Please enter a valid Case ID.');
      return;
    }

    setLoading(true);
    setSearchError('');
    try {
      const res = await trackCaseById(id);
      if (res.success && res.case) {
        setTrackedCase(res.case);
        setSearchParams({ id });
      } else {
        setTrackedCase(null);
        setSearchError(res.error || `No case found matching ID '${id}'.`);
      }
    } catch (err) {
      setTrackedCase(null);
      setSearchError('Failed to query case: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = trackedCase
    ? STATUS_CONFIG[trackedCase.status] || {
        label: trackedCase.status?.replace('_', ' ')?.toUpperCase() || 'UNKNOWN',
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        border: 'border-slate-300',
      }
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#DCC8A3] p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFE4] text-[#1B5E3B] text-xs font-mono font-bold">
            <Search className="w-3.5 h-3.5" />
            <span>Official Citizen Case Tracking Service</span>
          </div>
          <h1 className="text-3xl font-black text-[#26382D] tracking-tight">
            Track Environmental Incident Case
          </h1>
          <p className="text-sm text-[#526A59] leading-relaxed">
            Follow the verification, investigation, and enforcement progress of reported ecological threats across the Aravalli belt.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchCase();
            }}
            className="flex flex-col sm:flex-row gap-2 pt-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCaseId}
                onChange={(e) => setInputCaseId(e.target.value)}
                placeholder="Enter Case ID (e.g. rep-aravalli-2026-001 or ARV-2026-000001)"
                className="w-full px-4 py-3 rounded-2xl border border-[#DCC8A3] bg-[#F5F7F0]/40 text-[#26382D] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1B5E3B] focus:border-transparent font-mono placeholder:font-sans"
              />
              <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-[#526A59]" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-2xl bg-[#1B5E3B] hover:bg-[#2E8B57] disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Searching...' : 'Track Case'}
            </button>
          </form>

          {searchError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{searchError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Case Details & Citizen's Case History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tracked Case Details */}
        <div className="lg:col-span-8 space-y-6">
          {trackedCase ? (
            <div className="bg-white rounded-3xl border border-[#DCC8A3] shadow-sm overflow-hidden divide-y divide-[#DCC8A3]/50">
              {/* Case Overview Header */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-[#526A59]">
                      CASE RECORD
                    </span>
                    <h2 className="text-2xl font-black text-[#26382D] font-mono tracking-tight">
                      {trackedCase.id}
                    </h2>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className="text-base font-bold text-[#1B5E3B]">
                  {trackedCase.threatCategory}
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-[#526A59] pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2E8B57]" />
                    <span>{trackedCase.locationName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>GPS: {trackedCase.latitude?.toFixed(4)}, {trackedCase.longitude?.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#806044]" />
                    <span>Submitted: {new Date(trackedCase.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Resolution Card if Case is Resolved */}
              {trackedCase.resolution && (
                <div className="p-6 sm:p-8 bg-green-50/70 border-l-4 border-green-600 space-y-4">
                  <div className="flex items-center gap-2 text-green-900 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                    <span>Official Forest Authority Case Resolution</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-green-200 text-xs space-y-3 shadow-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-green-800 uppercase block">
                        Resolution Summary
                      </span>
                      <p className="text-[#26382D] font-medium mt-0.5">
                        {trackedCase.resolution.summary}
                      </p>
                    </div>

                    {trackedCase.resolution.actionTaken && (
                      <div>
                        <span className="text-[10px] font-mono font-bold text-green-800 uppercase block">
                          Enforcement Action Executed
                        </span>
                        <p className="text-[#26382D] mt-0.5">
                          {trackedCase.resolution.actionTaken}
                        </p>
                      </div>
                    )}

                    {trackedCase.resolution.officerRemarks && (
                      <div>
                        <span className="text-[10px] font-mono font-bold text-green-800 uppercase block">
                          Official Officer Remarks
                        </span>
                        <p className="text-[#526A59] italic mt-0.5">
                          "{trackedCase.resolution.officerRemarks}"
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-green-100 flex flex-wrap justify-between text-[11px] text-green-900 font-mono">
                      <span>Resolved By: {trackedCase.resolution.resolvedBy}</span>
                      <span>
                        Date: {new Date(trackedCase.resolution.resolvedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Evidence Preview & AI Observations */}
              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-sm font-bold text-[#26382D] uppercase tracking-wider font-mono">
                  Submitted Evidence & AI Observations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Photo / Video Preview */}
                  {trackedCase.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-[#DCC8A3] bg-[#F5F7F0] relative aspect-video flex items-center justify-center">
                      <img
                        src={trackedCase.imageUrl}
                        alt="Submitted evidence"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                        Photographic Evidence
                      </span>
                    </div>
                  )}

                  {/* AI Finding */}
                  <div className="bg-[#F5F7F0] p-4 rounded-2xl border border-[#DCC8A3] space-y-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#1B5E3B] font-bold">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Gemini AI Ecological Assessment</span>
                    </div>
                    <p className="text-[#26382D] leading-relaxed">
                      {trackedCase.evidenceAnalysis?.summary || 'Ecological threat report under active analysis.'}
                    </p>
                    <div className="pt-2 border-t border-[#DCC8A3]/60 text-[10px] text-[#526A59]">
                      <strong>Legal Notice:</strong> AI assessments are decision-support estimates. Field verification by authorized government officers is mandatory.
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone Timeline */}
              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-sm font-bold text-[#26382D] uppercase tracking-wider font-mono">
                  Enforcement Timeline
                </h3>

                <div className="relative pl-6 border-l-2 border-[#1B5E3B]/30 space-y-6">
                  {trackedCase.timeline?.map((milestone, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#1B5E3B] border-2 border-white" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#26382D]">{milestone.action}</span>
                        <span className="text-[10px] font-mono text-[#526A59]">
                          {new Date(milestone.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#526A59]">{milestone.notes}</p>
                      <span className="text-[10px] font-mono text-[#1B5E3B] block">
                        Logged by: {milestone.by}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#DCC8A3] p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#EAEFE4] text-[#1B5E3B] flex items-center justify-center mx-auto shadow-xs">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#26382D]">Enter a Case ID to Track Progress</h3>
              <p className="text-xs text-[#526A59] max-w-md mx-auto">
                Every citizen report receives a unique Case ID. Enter your ID above or select one from your submitted cases on the right.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Citizen's Recent Cases */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#DCC8A3] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#26382D] uppercase tracking-wider font-mono">
                My Submitted Cases
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#EAEFE4] text-[#1B5E3B] font-bold">
                {myReports.length}
              </span>
            </div>

            {user ? (
              myReports.length > 0 ? (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {myReports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => handleSearchCase(report.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        trackedCase?.id === report.id
                          ? 'border-[#1B5E3B] bg-[#EAEFE4]/70 shadow-xs'
                          : 'border-[#DCC8A3]/70 hover:border-[#1B5E3B] hover:bg-[#F5F7F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                        <span className="text-[#26382D]">{report.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] ${
                            STATUS_CONFIG[report.status]?.bg || 'bg-slate-100'
                          } ${STATUS_CONFIG[report.status]?.text || 'text-slate-800'}`}
                        >
                          {STATUS_CONFIG[report.status]?.label || report.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#526A59] line-clamp-1">{report.threatCategory}</p>
                      <p className="text-[10px] text-[#806044] mt-1">{report.locationName}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#526A59] bg-[#F5F7F0] rounded-2xl border border-[#DCC8A3]/60 space-y-2">
                  <p>You haven't submitted any incident reports yet.</p>
                  <Link
                    to="/report"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E3B] hover:underline"
                  >
                    <span>Report a threat now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            ) : (
              <div className="p-6 text-center text-xs text-[#526A59] bg-[#F5F7F0] rounded-2xl border border-[#DCC8A3]/60 space-y-3">
                <p>Sign in to automatically see all your submitted environmental reports here.</p>
                <Link
                  to="/login"
                  className="w-full py-2 px-3 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Citizen Portal Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Environmental Points Link Card */}
          <div className="bg-[#EAEFE4] p-6 rounded-3xl border border-[#A3B18A] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1B5E3B]">
              <ShieldCheck className="w-5 h-5 text-[#2E8B57]" />
              <span>Environmental Points</span>
            </div>
            <p className="text-xs text-[#526A59] leading-relaxed">
              When a Forest Authority officer verifies your reported case, you earn official Contribution Points and badges.
            </p>
            <Link
              to="/rewards"
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F7F0] text-[#1B5E3B] border border-[#A3B18A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>View Points Wallet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseTrackingPage;