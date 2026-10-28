import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileWarning,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Search,
  Filter,
  Eye,
  PlusCircle,
  BarChart3,
  Sparkles,
  Info,
  Calendar,
  Compass,
  User,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { fetchReports } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { EvidenceViewerModal } from '../components/ui/EvidenceViewerModal';

const THREAT_COLORS = {
  'Illegal Mining': '#ef4444',
  'Illegal Mining & Quarrying': '#ef4444',
  'Deforestation': '#f97316',
  'Deforestation / Tree Felling': '#f97316',
  'Water Stress': '#06b6d4',
  'Ground Water Depletion / Deep Boring': '#06b6d4',
  'Toxic Dumping': '#8b5cf6',
  'Toxic Waste Dumping': '#8b5cf6',
  'Encroachment': '#f59e0b',
  'Encroachment & Construction': '#f59e0b',
  'Land Degradation': '#64748b',
  'Other Ecological Threat': '#10b981',
};

export function CitizenDashboardPage() {
  const { user } = useAuth();
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab: 'my_reports' | 'regional_feed'
  const [activeTab, setActiveTab] = useState('my_reports');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Evidence Lightbox State
  const [viewingEvidence, setViewingEvidence] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchReports();
      if (res.success && Array.isArray(res.reports)) {
        setAllReports(res.reports);
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

  // Separate user's own reports vs public feed
  const userReports = allReports.filter((r) => {
    if (!user) return false;
    return (
      r.citizenId === user.uid ||
      (user.email && r.citizenEmail === user.email) ||
      (user.name && r.citizenName?.includes(user.name))
    );
  });

  const displayList = activeTab === 'my_reports' ? userReports : allReports;

  const filteredReports = displayList.filter((r) => {
    const matchesSearch =
      (r.locationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || r.threatCategory?.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Threat Counts for Chart
  const threatCounts = {};
  allReports.forEach((r) => {
    const cat = r.threatCategory || 'Other';
    threatCounts[cat] = (threatCounts[cat] || 0) + 1;
  });

  const chartData = Object.entries(threatCounts).map(([name, count]) => ({
    name: name.split(' ')[0],
    fullName: name,
    count,
    color: THREAT_COLORS[name] || '#10b981',
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Citizen Sentinel Workspace
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
              Verified Session: {user?.name || 'Citizen'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Citizen Sentinel'}
          </h1>
          <p className="text-sm text-slate-400">
            Submit photographic ground evidence, track your case verification status, and explore regional ecological alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/report"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Threat</span>
          </Link>
          <Link
            to="/map"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Interactive Risk Map</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">My Submissions</span>
            <User className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{userReports.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Personal reports in custody</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Verified Incidents</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {allReports.filter((r) => r.status === 'verified').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Confirmed by Forest Rangers</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Under Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {allReports.filter((r) => r.status === 'under_review').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Patrols dispatched</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Regional Total</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{allReports.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Corroborated field alerts</p>
        </div>
      </div>

      {/* Main Workspace with Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Navigation Tabs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('my_reports')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'my_reports'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Submitted Reports ({userReports.length})
            </button>
            <button
              onClick={() => setActiveTab('regional_feed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'regional_feed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Regional Environmental Feed ({allReports.length})
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sector or case ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="ALL">All Categories</option>
              <option value="Mining">Mining</option>
              <option value="Deforestation">Deforestation</option>
              <option value="Water">Water Stress</option>
              <option value="Dumping">Toxic Dumping</option>
              <option value="Encroachment">Encroachment</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Reports Table with Evidence Thumbnails */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-mono">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Synchronizing incident ledger...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800 space-y-2">
            <p>
              {activeTab === 'my_reports'
                ? "You haven't submitted any threat reports under this account yet."
                : 'No incidents match your filter criteria.'}
            </p>
            {activeTab === 'my_reports' && (
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Submit your first environmental observation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-3">EVIDENCE</th>
                  <th className="py-3 px-3">CASE ID & DATE</th>
                  <th className="py-3 px-3">THREAT CATEGORY</th>
                  <th className="py-3 px-3">LOCATION</th>
                  <th className="py-3 px-3">RISK SCORE</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3 text-right">DOSSIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-3">
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

                    {/* Case ID */}
                    <td className="py-3 px-3 font-semibold text-white">
                      <span className="block text-emerald-400 font-bold">{report.id}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Threat */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-200">{report.threatCategory}</span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3 max-w-xs truncate text-slate-400" title={report.locationName}>
                      {report.locationName || 'Aravalli Range'}
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-3">
                      <RiskBadge
                        score={report.riskAssessment?.score || report.riskScore || 50}
                        level={report.riskAssessment?.riskLevel || report.riskLevel}
                        size="sm"
                      />
                    </td>

                    {/* Status Lifecycle Pill */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
                        {report.status?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/incident/${report.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Briefing</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Corroborated Regional Threat Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-500">All Sectors</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                  formatter={(val, name, item) => [val, item.payload.fullName]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                Legal Protection Safeguards
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Citizen reports submitted through Aravalli Sentinel are protected under Section 4 and 5 of the Punjab Land Preservation Act (PLPA 1900) and Supreme Court environmental protection orders.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Identity Protection</span>
              <span>Your phone number and private contact records are encrypted and never shown on public maps.</span>
            </div>
          </div>

          <Link
            to="/about"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Read Legal Framework & Methodology</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

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

export default CitizenDashboardPage;
