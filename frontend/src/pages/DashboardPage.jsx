import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  FileWarning,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  PlusCircle,
  ArrowRight,
  Search,
  Filter,
  Layers,
  FileText,
  RefreshCw,
  Eye,
  Compass,
  User,
  Bell,
  BellRing,
  Check,
  CheckSquare,
  X,
  ExternalLink,
  Calendar,
  MessageSquare,
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
                (user.email && r.citizenEmail === user.email) ||
                (user.name && r.citizenName?.includes(user.name))
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
      console.error('Failed to load dashboard data:', err);
      setError("We couldn't load the dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadNotifications();
  }, [user, isAuthority]);

  // Mark single notification read
  const handleMarkNotifRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  // Mark all notifications read
  const handleMarkAllNotifsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotifCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  // Handle URL search query or filter anchor
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      if (
        [
          'pending',
          'under_review',
          'investigation_in_progress',
          'action_taken',
          'verified',
          'resolved',
          'rejected',
        ].includes(filterParam)
      ) {
        setStatusFilter(filterParam);
      }
    }
  }, [searchParams]);

  // Statistics Calculation (strictly from real backend data)
  const totalReportsCount = reports.length;

  const pendingReviewCount = reports.filter(
    (r) =>
      r.status === 'pending' ||
      r.status === 'under_review' ||
      r.status === 'investigation_in_progress'
  ).length;

  const resolvedCasesCount = reports.filter(
    (r) => r.status === 'resolved' || r.status === 'verified'
  ).length;

  const highRiskCount = reports.filter((r) => {
    const level = (r.riskAssessment?.riskLevel || r.riskLevel || '').toUpperCase();
    const score = r.riskAssessment?.score ?? r.riskScore ?? 0;
    return level.includes('CRITICAL') || level.includes('HIGH') || score >= 70;
  }).length;

  // Filtered reports for the Recent Reports table
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      (r.locationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.threatCategory || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'ALL' ||
      (r.threatCategory || '').toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ================================================================ */}
      {/* A. WELCOME SECTION                                               */}
      {/* ================================================================ */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {isAdmin
                  ? 'Super Administrator'
                  : isAuthority
                  ? 'Forest Authority Officer'
                  : 'Citizen Sentinel'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to Aravalli Sentinel
            </h1>

            <p className="text-sm text-slate-300">
              Report environmental problems. Track cases. Protect the Aravalli.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAuthority ? (
              <Link
                to="/admin?tab=triage"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>View Reports</span>
              </Link>
            ) : (
              <Link
                to="/report"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
              </Link>
            )}

            {/* Notification Indicator Bell */}
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              className={`relative p-3 rounded-xl border transition-all ${
                unreadNotifCount > 0
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="View In-App Case Notifications"
              aria-label="View In-App Case Notifications"
            >
              {unreadNotifCount > 0 ? (
                <>
                  <BellRing className="w-4 h-4 text-amber-400" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rose-500 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                    {unreadNotifCount}
                  </span>
                </>
              ) : (
                <Bell className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={() => {
                loadDashboardData();
                loadNotifications();
              }}
              disabled={loading}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Refresh dashboard data"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* IN-APP CITIZEN NOTIFICATIONS DRAWER / SECTION                   */}
      {/* ================================================================ */}
      {(showNotifPanel || unreadNotifCount > 0) && (
        <section className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
                  <span>In-App Notifications & Case Updates</span>
                  {unreadNotifCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {unreadNotifCount} unread
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-slate-400">
                  Real-time investigation progress and resolution updates from Forest Authority officers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadNotifCount > 0 && (
                <button
                  onClick={handleMarkAllNotifsRead}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                onClick={() => setShowNotifPanel(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Collapse Notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-mono space-y-1">
              <p>No notifications yet.</p>
              <p className="text-[11px] text-slate-500">
                You will receive immediate alerts here when an officer investigates or marks your reported cases as resolved.
              </p>
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
                    className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                      isResolved
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : notif.read
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                        : 'bg-slate-950 border-amber-500/30 text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {isResolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Case Ref: <strong className="text-emerald-400">{notif.reportId}</strong> •{' '}
                            {new Date(notif.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {!notif.read && (
                        <button
                          onClick={() => handleMarkNotifRead(notif.id)}
                          className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 shrink-0"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {notif.message}
                    </p>

                    {/* Prominent Resolution Card inside Notification if Resolved */}
                    {isResolved && (
                      <div className="p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs space-y-1.5 font-sans">
                        <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            Your environmental report has been reviewed and marked as resolved by the authorized officer.
                          </span>
                        </div>
                        {notif.resolution?.summary && (
                          <p className="text-slate-200">
                            <strong className="text-emerald-400 font-mono">Resolution Summary:</strong>{' '}
                            {notif.resolution.summary}
                          </p>
                        )}
                        {notif.resolution?.actionTaken && (
                          <p className="text-slate-300">
                            <strong className="text-slate-400 font-mono">Action Taken:</strong>{' '}
                            {notif.resolution.actionTaken}
                          </p>
                        )}
                        {notif.resolution?.officerRemarks && (
                          <p className="text-slate-300">
                            <strong className="text-slate-400 font-mono">Officer Remarks:</strong>{' '}
                            {notif.resolution.officerRemarks}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 font-mono pt-0.5">
                          <strong>Updated On:</strong>{' '}
                          {new Date(
                            notif.resolution?.resolutionDate || notif.timestamp
                          ).toLocaleString()}
                        </p>
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
      {/* LOADING & ERROR STATES                                           */}
      {/* ================================================================ */}
      {loading && !reports.length && (
        <div className="py-16 text-center space-y-3">
          <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading dashboard...</p>
        </div>
      )}

      {error && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 text-center max-w-lg mx-auto space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="text-sm font-bold text-white">Dashboard Notice</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={() => {
              loadDashboardData();
              loadNotifications();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
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
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400">Total Reports</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {totalReportsCount}
                </div>
                <p className="text-[11px] text-slate-500">All received incidents</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400">Pending Review</span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {pendingReviewCount}
                </div>
                <p className="text-[11px] text-slate-500">Awaiting field inspection</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400">High-Risk Cases</span>
                <div className="text-2xl font-extrabold text-rose-400 font-mono">
                  {highRiskCount}
                </div>
                <p className="text-[11px] text-slate-500">Critical environmental threats</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400">Resolved Cases</span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {resolvedCasesCount}
                </div>
                <p className="text-[11px] text-slate-500">Remediated or verified</p>
              </div>
            </div>
          ) : (
            /* Citizen Statistics: My Reports, Under Review, Resolved Cases */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400">My Reports</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {totalReportsCount}
                </div>
                <p className="text-[11px] text-slate-500">Reports you have submitted</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400">Under Review</span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {pendingReviewCount}
                </div>
                <p className="text-[11px] text-slate-500">Currently being checked</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400">Resolved Cases</span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {resolvedCasesCount}
                </div>
                <p className="text-[11px] text-slate-500">Action taken & closed</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================================================================ */}
      {/* C. MY REPORTS / CASE TRACKING TABLE                             */}
      {/* ================================================================ */}
      {!loading && !error && (
        <section id="recent-reports" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{isAuthority ? 'Recent Reports' : 'MY REPORTS / CASE TRACKING'}</span>
                <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {filteredReports.length} cases
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isAuthority
                  ? 'Review recently reported threats across the Aravalli range.'
                  : 'Track the environmental issues you have submitted with real-time officer updates.'}
              </p>
            </div>

            {isAuthority && (
              <Link
                to="/admin?tab=triage"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View All Reports in Triage Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Case ID, location, or problem type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="investigation_in_progress">Investigation in Progress</option>
                <option value="action_taken">Action Taken</option>
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
                  className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Reports Table / Empty State */}
          {filteredReports.length === 0 ? (
            <div className="py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No reports yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Environmental reports will appear here after they are submitted.
              </p>
              {!isAuthority && (
                <div className="pt-2">
                  <Link
                    to="/report"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report an Issue</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">CASE ID</th>
                    <th className="py-3 px-3">PROBLEM TYPE</th>
                    <th className="py-3 px-3">DATE / UPDATED</th>
                    <th className="py-3 px-3">RISK LEVEL</th>
                    <th className="py-3 px-3">STATUS</th>
                    <th className="py-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-300">
                  {filteredReports.slice(0, 15).map((report) => {
                    const status = report.status || 'pending';
                    const riskLevel =
                      report.riskAssessment?.riskLevel || report.riskLevel || 'SAFE';
                    const riskScore =
                      report.riskAssessment?.score ?? report.riskScore ?? 45;

                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                        onClick={() => setSelectedTrackingReport(report)}
                      >
                        {/* Case ID */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-emerald-400 block">{report.id}</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[150px] block">
                            {report.locationName || 'Aravalli Range'}
                          </span>
                        </td>

                        {/* Problem Type */}
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          <div>{report.threatCategory}</div>
                          {report.title && report.title !== report.threatCategory && (
                            <div className="text-[10px] text-slate-400 font-normal truncate max-w-[180px]">
                              {report.title}
                            </div>
                          )}
                        </td>

                        {/* Date & Last Updated */}
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          <div>
                            {new Date(report.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          {(report.lastUpdatedDate || report.resolution?.resolutionDate) && (
                            <div className="text-[10px] text-slate-500">
                              Upd:{' '}
                              {new Date(
                                report.lastUpdatedDate || report.resolution?.resolutionDate
                              ).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </div>
                          )}
                        </td>

                        {/* Risk Level */}
                        <td className="py-3 px-3">
                          <RiskBadge level={riskLevel} score={riskScore} size="sm" />
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              status === 'resolved'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono shadow-sm'
                                : status === 'verified'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : status === 'action_taken'
                                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                                : status === 'investigation_in_progress'
                                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                                : status === 'under_review'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : status === 'rejected'
                                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTrackingReport(report);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-semibold transition-colors"
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

              {filteredReports.length > 15 && (
                <div className="p-3 text-center border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                  Showing 15 of {filteredReports.length} reports.{' '}
                  {isAuthority ? (
                    <Link to="/admin?tab=triage" className="text-emerald-400 hover:underline">
                      Open full Triage Desk to review all.
                    </Link>
                  ) : (
                    'Use search above to find specific cases.'
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ================================================================ */}
      {/* D. QUICK ACTIONS                                                 */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions</h2>
          <p className="text-xs text-slate-400">Common tasks you can perform right now.</p>
        </div>

        {isAuthority ? (
          /* Forest Authority: Review Reports, Open Risk Map, Generate Area Summary */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin?tab=triage"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Review Reports</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="text-xs text-slate-400">
                Inspect incoming cases, review evidence, and update verification status.
              </p>
            </Link>

            <Link
              to="/map"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Open Risk Map</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="text-xs text-slate-400">
                Examine geographic risk scores and satellite vegetation alerts across zones.
              </p>
            </Link>

            <Link
              to="/admin?tab=telemetry"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Generate Area Summary</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="text-xs text-slate-400">
                Check system telemetry, monitored eco-sectors, and database health.
              </p>
            </Link>
          </div>
        ) : (
          /* Citizen: Report an Issue, My Reports, View Risk Map */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/report"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Report an Issue</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="text-xs text-slate-400">
                Submit an environmental problem with photos and GPS location.
              </p>
            </Link>

            <a
              href="#recent-reports"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>My Reports</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="text-xs text-slate-400">
                Check the status and investigation notes of cases you reported.
              </p>
            </a>

            <Link
              to="/map"
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>View Risk Map</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="text-xs text-slate-400">
                Explore monitored eco-sectors and high-risk environmental areas.
              </p>
            </Link>
          </div>
        )}
      </section>

      {/* ================================================================ */}
      {/* INTERACTIVE CASE TRACKING & RESOLUTION MODAL                     */}
      {/* ================================================================ */}
      {selectedTrackingReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                  Case Tracking Dossier
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedTrackingReport.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTrackingReport(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs font-sans">
              {/* Mandatory Resolution Card for Resolved Cases */}
              {selectedTrackingReport.status === 'resolved' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border-2 border-emerald-500/50 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      Your environmental report has been reviewed and marked as resolved by the authorized officer.
                    </span>
                  </div>

                  <div className="space-y-2 text-xs pt-2 border-t border-emerald-500/20">
                    <div className="text-slate-100">
                      <strong className="text-emerald-300 font-mono">Resolution Summary: </strong>
                      <span>
                        {selectedTrackingReport.resolution?.summary ||
                          selectedTrackingReport.actionNotes ||
                          'Enforcement completed; area secured.'}
                      </span>
                    </div>

                    {selectedTrackingReport.resolution?.actionTaken && (
                      <div className="text-slate-200">
                        <strong className="text-slate-400 font-mono">Action Taken: </strong>
                        <span>{selectedTrackingReport.resolution.actionTaken}</span>
                      </div>
                    )}

                    {selectedTrackingReport.resolution?.officerRemarks && (
                      <div className="text-slate-300">
                        <strong className="text-slate-400 font-mono">Officer Remarks: </strong>
                        <span>{selectedTrackingReport.resolution.officerRemarks}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 font-mono">
                      <strong>Updated On: </strong>
                      <span>
                        {new Date(
                          selectedTrackingReport.resolution?.resolutionDate ||
                            selectedTrackingReport.lastUpdatedDate ||
                            selectedTrackingReport.updatedAt ||
                            selectedTrackingReport.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Case Overview Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">
                    Problem Type
                  </span>
                  <span className="text-sm font-bold text-white block">
                    {selectedTrackingReport.threatCategory}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedTrackingReport.locationName || 'Aravalli Range'}
                  </span>
                </div>

                <div className="space-y-1 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">
                    Current Status
                  </span>
                  <div className="pt-0.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono ${
                        selectedTrackingReport.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : selectedTrackingReport.status === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : selectedTrackingReport.status === 'under_review'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : selectedTrackingReport.status === 'action_taken'
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {selectedTrackingReport.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Submitted: {new Date(selectedTrackingReport.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Evidence Photograph */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">
                  Report Evidence & GPS Coordinates
                </span>
                <div className="h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
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
                <div className="text-[10px] font-mono text-slate-400 text-center">
                  Location: {selectedTrackingReport.latitude}° N, {selectedTrackingReport.longitude}° E
                </div>
              </div>

              {/* Citizen Original Observations */}
              <div className="space-y-1 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">
                  Citizen Submission Description
                </span>
                <p className="text-slate-300 italic leading-relaxed">
                  "{selectedTrackingReport.description}"
                </p>
              </div>

              {/* Officer Audit History / Chain of Custody */}
              {selectedTrackingReport.auditTrail?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">
                    Forest Authority Inspection History
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {selectedTrackingReport.auditTrail.map((audit, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5"
                      >
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-emerald-400">{audit.action}</span>
                          <span>{new Date(audit.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-300 font-sans">{audit.notes}</p>
                        <div className="text-[10px] text-slate-500">By: {audit.by}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Legal Incident Dossier Button */}
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/incident/${selectedTrackingReport.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Full Decision-Support Dossier</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
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
