import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  PlusCircle,
  ArrowRight,
  Search,
  FileText,
  RefreshCw,
  Eye,
  Bell,
  BellRing,
  Check,
  CheckSquare,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Layers,
  Award,
} from 'lucide-react';
import {
  fetchReports,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RiskBadge } from '../components/RiskBadge';
import { EvidenceViewerModal } from '../components/ui/EvidenceViewerModal';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export function DashboardPage() {
  const { user, isAuthority, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // In-App Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // Interactive Case Tracking State
  const [selectedTrackingReport, setSelectedTrackingReport] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Lightbox
  const [viewingEvidence, setViewingEvidence] = useState(null);

  // Fetch Notifications for current user
  const loadNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetchNotifications();
      if (res.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadNotifCount(
          res.unreadCount ?? res.notifications.filter((n) => !n.read).length
        );
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  };

  // Fetch Reports from backend (MongoDB backed)
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = isAuthority
        ? await fetchReports()
        : await fetchReports({ myReports: 'true' });

      if (res.success && Array.isArray(res.reports)) {
        setReports(res.reports);
      } else if (res.reports && Array.isArray(res.reports)) {
        setReports(res.reports);
      } else {
        if (!isAuthority && user) {
          const fallbackRes = await fetchReports();
          if (fallbackRes.success && Array.isArray(fallbackRes.reports)) {
            const userOwned = fallbackRes.reports.filter(
              (r) =>
                r.citizenId === user.uid ||
                r.citizenEmail === user.email ||
                r.citizenName === user.name
            );
            setReports(userOwned);
          } else {
            setReports([]);
          }
        } else {
          setReports([]);
        }
      }
    } catch (err) {
      setError('Unable to reach server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadNotifications();
  }, [user, isAuthority]);

  const handleMarkNotifRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark read:', err);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotifCount(0);
    } catch (err) {
      console.warn('Failed to mark all read:', err);
    }
  };

  // Real Database Statistics
  const totalReportsCount = reports.length;
  const pendingReviewCount = reports.filter(
    (r) =>
      r.status === 'pending' ||
      r.status === 'under_review' ||
      r.status === 'investigation_in_progress'
  ).length;
  const highRiskCount = reports.filter(
    (r) =>
      (r.riskAssessment?.riskLevel || r.riskLevel || '').toUpperCase() === 'CRITICAL' ||
      (r.riskAssessment?.riskLevel || r.riskLevel || '').toUpperCase() === 'HIGH' ||
      (r.riskAssessment?.score ?? r.riskScore ?? 0) >= 60
  ).length;
  const resolvedCasesCount = reports.filter(
    (r) => r.status === 'resolved' || r.status === 'verified'
  ).length;

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      searchQuery === '' ||
      (r.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.threatCategory || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.locationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (r.status || '').toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === 'ALL' ||
      (r.threatCategory || '').toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ================================================================ */}
      {/* A. WELCOME SECTION                                               */}
      {/* ================================================================ */}
      <section className="bg-white border border-[#DCC8A3] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A]">
              <span className="w-2 h-2 rounded-full bg-[#1B5E3B]" />
              <span>
                {isAdmin
                  ? 'Super Administrator'
                  : isAuthority
                  ? 'Forest Authority Officer'
                  : 'Citizen Sentinel'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#26382D] tracking-tight">
              Welcome to Aravalli Sentinel
            </h1>

            <p className="text-sm text-[#526A59]">
              Report environmental problems. Track cases. Protect the Aravalli.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAuthority ? (
              <Link
                to="/admin?tab=triage"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-[#DCC8A3]" />
                <span>View Reports</span>
              </Link>
            ) : (
              <Link
                to="/report"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <PlusCircle className="w-4 h-4 text-[#DCC8A3]" />
                <span>Report an Issue</span>
              </Link>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              className={`relative p-3 rounded-2xl border transition-all ${
                unreadNotifCount > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                  : 'bg-[#F5F7F0] hover:bg-white text-[#526A59] border-[#DCC8A3]'
              }`}
              title="View In-App Notifications"
            >
              {unreadNotifCount > 0 ? (
                <>
                  <BellRing className="w-4 h-4 text-amber-600" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadNotifCount}
                  </span>
                </>
              ) : (
                <Bell className="w-4 h-4 text-[#526A59]" />
              )}
            </button>

            <button
              onClick={() => {
                loadDashboardData();
                loadNotifications();
              }}
              disabled={loading}
              className="p-3 rounded-2xl bg-[#F5F7F0] hover:bg-white text-[#526A59] border border-[#DCC8A3] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* IN-APP CITIZEN NOTIFICATIONS DRAWER                              */}
      {/* ================================================================ */}
      {(showNotifPanel || unreadNotifCount > 0) && (
        <section className="bg-white border-2 border-[#A3B18A] rounded-3xl p-6 space-y-4 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#DCC8A3]/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EAEFE4] text-[#1B5E3B] flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#26382D] uppercase font-mono">
                  Case Notifications & Resolution Updates
                  {unreadNotifCount > 0 && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {unreadNotifCount} unread
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[#526A59]">
                  Real-time investigation notes and statutory resolution updates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadNotifCount > 0 && (
                <button
                  onClick={handleMarkAllNotifsRead}
                  className="px-3 py-1 rounded-xl bg-[#EAEFE4] hover:bg-[#D5E2CC] text-[#1B5E3B] text-xs font-mono font-bold transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                onClick={() => setShowNotifPanel(false)}
                className="p-1 rounded-lg hover:bg-[#F5F7F0] text-[#526A59]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-[#526A59] text-xs font-mono">
              No notifications yet. You will receive updates here when an officer inspects your reports.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {notifications.map((notif) => {
                const isResolved =
                  notif.status === 'resolved' ||
                  notif.type === 'case_resolved' ||
                  Boolean(notif.resolution);

                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                      isResolved
                        ? 'bg-green-50/70 border-green-200'
                        : notif.read
                        ? 'bg-[#F5F7F0] border-[#DCC8A3]/70'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {isResolved ? (
                          <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-bold text-[#26382D] block">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-[#526A59] font-mono">
                            Case Ref: <strong className="text-[#1B5E3B]">{notif.reportId}</strong> •{' '}
                            {new Date(notif.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {!notif.read && (
                        <button
                          onClick={() => handleMarkNotifRead(notif.id)}
                          className="text-[10px] font-mono text-[#1B5E3B] hover:underline px-2 py-0.5 rounded bg-white border border-[#A3B18A] shrink-0"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#26382D] leading-relaxed">{notif.message}</p>

                    {isResolved && notif.resolution && (
                      <div className="p-3.5 rounded-xl bg-white border border-green-200 text-xs space-y-1">
                        <strong className="text-green-800 font-mono block">Resolution Summary:</strong>
                        <p className="text-[#26382D]">{notif.resolution.summary}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ================================================================ */}
      {/* B. QUICK STATISTICS                                              */}
      {/* ================================================================ */}
      {!loading && !error && (
        <section aria-labelledby="stats-heading">
          <div className="sr-only" id="stats-heading">
            Quick Statistics
          </div>
          {isAuthority ? (
            /* Forest Authority Statistics: Total, Pending, High-Risk, Resolved */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#DCC8A3] shadow-xs space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Total Reports</span>
                <div className="text-2xl font-black text-[#26382D] font-mono">
                  {totalReportsCount}
                </div>
                <p className="text-[11px] text-[#526A59]">All received incidents</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#DCC8A3] shadow-xs space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Pending Review</span>
                <div className="text-2xl font-black text-[#D97706] font-mono">
                  {pendingReviewCount}
                </div>
                <p className="text-[11px] text-[#526A59]">Awaiting field inspection</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#DCC8A3] shadow-xs space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-[#526A59]">High-Risk Cases</span>
                <div className="text-2xl font-black text-[#EA580C] font-mono">
                  {highRiskCount}
                </div>
                <p className="text-[11px] text-[#526A59]">Critical threats</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#DCC8A3] shadow-xs space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Resolved Cases</span>
                <div className="text-2xl font-black text-[#1B5E3B] font-mono">
                  {resolvedCasesCount}
                </div>
                <p className="text-[11px] text-[#526A59]">Remediated & verified</p>
              </div>
            </div>
          ) : (
            /* Citizen Statistics: My Reports, Under Review, Resolved Cases */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#DCC8A3] shadow-xs space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-[#526A59]">My Reports</span>
                <div className="text-2xl font-black text-[#26382D] font-mono">
                  {totalReportsCount}
                </div>
                <p className="text-[11px] text-[#526A59]">Reports you have submitted</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#DCC8A3] shadow-xs space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Under Review</span>
                <div className="text-2xl font-black text-[#D97706] font-mono">
                  {pendingReviewCount}
                </div>
                <p className="text-[11px] text-[#526A59]">Currently being investigated</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#DCC8A3] shadow-xs space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-[#526A59]">Resolved Cases</span>
                <div className="text-2xl font-black text-[#1B5E3B] font-mono">
                  {resolvedCasesCount}
                </div>
                <p className="text-[11px] text-[#526A59]">Action taken & completed</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================================================================ */}
      {/* C. RECENT REPORTS / CASE TABLE                                   */}
      {/* ================================================================ */}
      {!loading && !error && (
        <section id="recent-reports" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#26382D] tracking-tight flex items-center gap-2">
                <span>{isAuthority ? 'Recent Reports' : 'My Reports & Case Progress'}</span>
                <span className="text-xs font-mono text-[#1B5E3B] px-2.5 py-0.5 rounded-full bg-[#EAEFE4] border border-[#A3B18A] font-bold">
                  {filteredReports.length} cases
                </span>
              </h2>
              <p className="text-xs text-[#526A59]">
                {isAuthority
                  ? 'Review recently reported threats across the Aravalli range.'
                  : 'Track the environmental issues you have submitted with real-time officer updates.'}
              </p>
            </div>

            {isAuthority && (
              <Link
                to="/admin?tab=triage"
                className="text-xs font-bold text-[#1B5E3B] hover:underline flex items-center gap-1"
              >
                <span>View All Reports in Officer Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-[#DCC8A3] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#526A59] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Case ID, location, or problem type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F5F7F0]/60 border border-[#DCC8A3] text-[#26382D] placeholder-[#526A59] focus:outline-hidden focus:ring-2 focus:ring-[#1B5E3B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-xl bg-[#F5F7F0]/60 border border-[#DCC8A3] text-[#26382D] font-mono focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="verified">Verified</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected / Invalid</option>
              </select>

              {(searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setCategoryFilter('ALL');
                  }}
                  className="text-xs text-[#526A59] hover:text-[#26382D] px-2.5 py-1.5 rounded-xl bg-[#F5F7F0] border border-[#DCC8A3]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Reports Table / Empty State */}
          {filteredReports.length === 0 ? (
            <div className="py-12 px-4 rounded-3xl border border-dashed border-[#A3B18A] bg-white text-center space-y-2">
              <FileText className="w-8 h-8 text-[#526A59] mx-auto" />
              <h3 className="text-sm font-bold text-[#26382D]">No reports yet</h3>
              <p className="text-xs text-[#526A59] max-w-sm mx-auto">
                Environmental reports will appear here after they are submitted.
              </p>
              {!isAuthority && (
                <div className="pt-2">
                  <Link
                    to="/report"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report an Issue</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-[#DCC8A3] bg-white shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#EAEFE4] text-[#1B5E3B] border-b border-[#DCC8A3] text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">CASE ID</th>
                    <th className="py-3 px-4">PROBLEM TYPE</th>
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">RISK LEVEL</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCC8A3]/50 text-[#26382D]">
                  {filteredReports.slice(0, 15).map((report) => {
                    const status = report.status || 'pending';
                    const riskLevel =
                      report.riskAssessment?.riskLevel || report.riskLevel || 'SAFE';
                    const riskScore =
                      report.riskAssessment?.score ?? report.riskScore ?? 45;

                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-[#F5F7F0] transition-colors cursor-pointer"
                        onClick={() => setSelectedTrackingReport(report)}
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#1B5E3B] block">{report.id}</span>
                          <span className="text-[10px] text-[#526A59] truncate max-w-[150px] block font-sans">
                            {report.locationName || 'Aravalli Range'}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#26382D] font-sans">
                          <div>{report.threatCategory}</div>
                        </td>

                        <td className="py-3 px-4 text-[#526A59] text-[11px]">
                          {new Date(report.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3 px-4">
                          <RiskBadge level={riskLevel} score={riskScore} size="sm" />
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              status === 'resolved'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : status === 'action_taken'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : status === 'under_review'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : status === 'rejected'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}
                          >
                            {status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTrackingReport(report);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#EAEFE4] hover:bg-[#1B5E3B] hover:text-white text-[#1B5E3B] font-bold text-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Track Case</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ================================================================ */}
      {/* D. QUICK ACTIONS                                                 */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#26382D] tracking-tight">Quick Actions</h2>
          <p className="text-xs text-[#526A59]">Common tasks you can perform right now.</p>
        </div>

        {isAuthority ? (
          /* Forest Authority: Review Reports, Open Risk Map, Generate Area Summary */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin?tab=triage"
              className="p-5 rounded-3xl bg-white border border-[#DCC8A3] hover:border-[#1B5E3B] hover:shadow-sm transition-all group space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#26382D] text-sm group-hover:text-[#1B5E3B] transition-colors flex items-center justify-between">
                <span>Review Reports</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#526A59] group-hover:text-[#1B5E3B]" />
              </h3>
              <p className="text-xs text-[#526A59]">
                Inspect incoming cases, review evidence, and update verification status.
              </p>
            </Link>

            <Link
              to="/map"
              className="p-5 rounded-3xl bg-white border border-[#DCC8A3] hover:border-[#1B5E3B] hover:shadow-sm transition-all group space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#EAEFE4] text-[#1B5E3B] flex items-center justify-center border border-[#A3B18A]">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#26382D] text-sm group-hover:text-[#1B5E3B] transition-colors flex items-center justify-between">
                <span>Open Risk Map</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#526A59] group-hover:text-[#1B5E3B]" />
              </h3>
              <p className="text-xs text-[#526A59]">
                Examine geographic risk scores and satellite vegetation alerts across zones.
              </p>
            </Link>

            <Link
              to="/admin?tab=telemetry"
              className="p-5 rounded-3xl bg-white border border-[#DCC8A3] hover:border-[#1B5E3B] hover:shadow-sm transition-all group space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F5F7F0] text-[#806044] flex items-center justify-center border border-[#DCC8A3]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#26382D] text-sm group-hover:text-[#1B5E3B] transition-colors flex items-center justify-between">
                <span>Generate Area Summary</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#526A59] group-hover:text-[#1B5E3B]" />
              </h3>
              <p className="text-xs text-[#526A59]">
                Check Sentinel-2 telemetry, weather context, and monitored eco-sectors.
              </p>
            </Link>
          </div>
        ) : (
          /* Citizen: Report an Issue, Track Cases, Eco-Points */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/report"
              className="p-5 rounded-3xl bg-white border border-[#DCC8A3] hover:border-[#1B5E3B] hover:shadow-sm transition-all group space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#EAEFE4] text-[#1B5E3B] flex items-center justify-center border border-[#A3B18A]">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#26382D] text-sm group-hover:text-[#1B5E3B] transition-colors flex items-center justify-between">
                <span>Report an Issue</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#526A59] group-hover:text-[#1B5E3B]" />
              </h3>
              <p className="text-xs text-[#526A59]">
                Submit photo or video evidence with automatic ground location detection.
              </p>
            </Link>

            <Link
              to="/track"
              className="p-5 rounded-3xl bg-white border border-[#DCC8A3] hover:border-[#1B5E3B] hover:shadow-sm transition-all group space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#26382D] text-sm group-hover:text-[#1B5E3B] transition-colors flex items-center justify-between">
                <span>Case Tracking</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#526A59] group-hover:text-[#1B5E3B]" />
              </h3>
              <p className="text-xs text-[#526A59]">
                Track case resolution progress and read official officer remarks.
              </p>
            </Link>

            <Link
              to="/rewards"
              className="p-5 rounded-3xl bg-white border border-[#DCC8A3] hover:border-[#1B5E3B] hover:shadow-sm transition-all group space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#EAEFE4] text-[#806044] flex items-center justify-center border border-[#A3B18A]">
                <Award className="w-5 h-5 text-[#806044]" />
              </div>
              <h3 className="font-bold text-[#26382D] text-sm group-hover:text-[#1B5E3B] transition-colors flex items-center justify-between">
                <span>Eco-Points Wallet</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#526A59] group-hover:text-[#1B5E3B]" />
              </h3>
              <p className="text-xs text-[#526A59]">
                Earn verified points for legitimate threat reports and eco-walks.
              </p>
            </Link>
          </div>
        )}
      </section>

      {/* ================================================================ */}
      {/* INTERACTIVE CASE TRACKING MODAL (LIGHT THEME)                    */}
      {/* ================================================================ */}
      {selectedTrackingReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center animate-in fade-in">
          <div className="bg-white border border-[#DCC8A3] max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#EAEFE4] border-b border-[#DCC8A3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#1B5E3B] font-bold">
                  Case Tracking Dossier
                </span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white text-[#26382D] border border-[#A3B18A] font-bold">
                  {selectedTrackingReport.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTrackingReport(null)}
                className="text-[#526A59] hover:text-[#26382D] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs font-sans">
              {/* Resolution Card if Case is Resolved */}
              {selectedTrackingReport.status === 'resolved' && (
                <div className="p-5 rounded-2xl bg-green-50 border-2 border-green-300 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-green-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                    <span>
                      Your environmental report has been reviewed and marked as resolved by the authorized officer.
                    </span>
                  </div>

                  <div className="space-y-2 text-xs pt-2 border-t border-green-200">
                    <div>
                      <strong className="text-green-800 font-mono">Resolution Summary: </strong>
                      <span className="text-[#26382D]">
                        {selectedTrackingReport.resolution?.summary ||
                          selectedTrackingReport.actionNotes ||
                          'Enforcement completed; area secured.'}
                      </span>
                    </div>

                    {selectedTrackingReport.resolution?.actionTaken && (
                      <div>
                        <strong className="text-green-800 font-mono">Action Taken: </strong>
                        <span className="text-[#26382D]">{selectedTrackingReport.resolution.actionTaken}</span>
                      </div>
                    )}

                    {selectedTrackingReport.resolution?.officerRemarks && (
                      <div>
                        <strong className="text-green-800 font-mono">Officer Remarks: </strong>
                        <span className="text-[#526A59] italic">
                          "{selectedTrackingReport.resolution.officerRemarks}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Case Overview Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 p-3.5 bg-[#F5F7F0] rounded-2xl border border-[#DCC8A3]">
                  <span className="text-[10px] text-[#526A59] font-mono uppercase block font-bold">
                    Problem Type
                  </span>
                  <span className="text-sm font-bold text-[#26382D] block">
                    {selectedTrackingReport.threatCategory}
                  </span>
                  <span className="text-xs text-[#526A59]">
                    {selectedTrackingReport.locationName || 'Aravalli Range'}
                  </span>
                </div>

                <div className="space-y-1 p-3.5 bg-[#F5F7F0] rounded-2xl border border-[#DCC8A3]">
                  <span className="text-[10px] text-[#526A59] font-mono uppercase block font-bold">
                    Current Status
                  </span>
                  <div className="pt-0.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono ${
                        selectedTrackingReport.status === 'resolved'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : selectedTrackingReport.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : selectedTrackingReport.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {selectedTrackingReport.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#526A59] font-mono block">
                    Submitted: {new Date(selectedTrackingReport.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Evidence Photograph */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#526A59] font-mono uppercase block font-bold">
                  Report Evidence & Coordinates
                </span>
                <div className="h-48 rounded-2xl overflow-hidden border border-[#DCC8A3] bg-[#F5F7F0]">
                  <ImageWithFallback
                    src={selectedTrackingReport.imageUrl}
                    fallbackSrc={selectedTrackingReport.fallbackImageUrl}
                    threatCategory={selectedTrackingReport.threatCategory}
                    alt={selectedTrackingReport.id}
                    className="w-full h-full object-cover"
                    showZoomBadge={true}
                    onZoom={() =>
                      setViewingEvidence({
                        url: selectedTrackingReport.imageUrl,
                        caseId: selectedTrackingReport.id,
                        threatCategory: selectedTrackingReport.threatCategory,
                        locationName: selectedTrackingReport.locationName,
                        latitude: selectedTrackingReport.latitude,
                        longitude: selectedTrackingReport.longitude,
                        reportedAt: selectedTrackingReport.createdAt,
                      })
                    }
                  />
                </div>
                <div className="text-[10px] font-mono text-[#526A59] text-center">
                  Location: {selectedTrackingReport.latitude}° N, {selectedTrackingReport.longitude}° E
                </div>
              </div>

              {/* Citizen Original Observations */}
              <div className="space-y-1 p-3.5 bg-[#F5F7F0] rounded-2xl border border-[#DCC8A3]">
                <span className="text-[10px] text-[#526A59] font-mono uppercase block font-bold">
                  Observation Summary
                </span>
                <p className="text-[#26382D] leading-relaxed">
                  "{selectedTrackingReport.description}"
                </p>
              </div>

              {/* Officer Audit History / Chain of Custody */}
              {selectedTrackingReport.auditTrail?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] text-[#526A59] font-mono uppercase block font-bold">
                    Inspection Milestones
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {selectedTrackingReport.auditTrail.map((audit, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3] space-y-0.5"
                      >
                        <div className="flex justify-between text-[10px] text-[#526A59]">
                          <span className="font-bold text-[#1B5E3B]">{audit.action}</span>
                          <span>{new Date(audit.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-[#26382D] font-sans">{audit.notes}</p>
                        <div className="text-[10px] text-[#526A59]">By: {audit.by}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Link to Dedicated Case Tracking Page */}
              <div className="pt-2 flex justify-between items-center">
                <Link
                  to={`/track?id=${selectedTrackingReport.id}`}
                  className="px-4 py-2 rounded-xl bg-[#EAEFE4] hover:bg-[#D5E2CC] text-[#1B5E3B] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Dedicated Tracking Page</span>
                </Link>

                <Link
                  to={`/incident/${selectedTrackingReport.id}`}
                  className="px-4 py-2 rounded-xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Legal Dossier</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </Link>
              </div>
            </div>
          </div>
        </div>
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

export default DashboardPage;