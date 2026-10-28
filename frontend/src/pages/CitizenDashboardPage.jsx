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
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { fetchReports } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

const THREAT_COLORS = {
  'Illegal Mining': '#ef4444',
  'Deforestation': '#f97316',
  'Water Stress': '#06b6d4',
  'Toxic Dumping': '#8b5cf6',
  'Encroachment': '#f59e0b',
  'Land Degradation': '#64748b'
};

export function CitizenDashboardPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetchReports();
        if (res.success && Array.isArray(res.reports)) {
          setReports(res.reports);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      (r.locationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || r.threatCategory === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalReports = reports.length;
  const verifiedReports = reports.filter(r => r.status === 'verified').length;
  const underReviewReports = reports.filter(r => r.status === 'under_review').length;
  const criticalReports = reports.filter(r => (r.riskScore || 0) >= 76).length;

  // Chart data: count by threat category
  const threatCounts = {};
  reports.forEach(r => {
    const cat = r.threatCategory || 'Other';
    threatCounts[cat] = (threatCounts[cat] || 0) + 1;
  });
  const chartData = Object.entries(threatCounts).map(([name, count]) => ({
    name,
    count,
    color: THREAT_COLORS[name] || '#10b981'
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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
              SYNTHETIC DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Citizen Sentinel'}
          </h1>
          <p className="text-sm text-slate-400">
            Track your environmental sightings, review community alerts, and monitor Forest Department enforcement actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-aravalli-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Threat</span>
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700 hover:bg-slate-750 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Explore Map</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Total Reports</span>
            <FileWarning className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalReports}</div>
          <p className="text-[11px] text-slate-400">Logged across Aravalli belt</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Verified Violations</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{verifiedReports}</div>
          <p className="text-[11px] text-slate-400">Confirmed by Forest Dept</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Under Investigation</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{underReviewReports}</div>
          <p className="text-[11px] text-slate-400">Ranger teams deployed</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Critical Threat Hotspots</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{criticalReports}</div>
          <p className="text-[11px] text-slate-400">Risk score ≥ 76 / 100</p>
        </div>
      </div>

      {/* Analytics Chart & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Threat Category Distribution</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Live Aggregate</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legal & Citizen Tip Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Info className="w-5 h-5" />
              <h3 className="font-bold text-white">Citizen Reporting Protocol</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under Supreme Court directives in <span className="text-emerald-300 font-semibold">M.C. Mehta vs Union of India</span> and Section 4/5 of the Punjab Land Preservation Act (PLPA), all mechanical quarrying and commercial felling in Aravalli deemed forests are prohibited.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-emerald-400">🔒 Privacy Guarantee:</p>
              <p>Your name, email, and IP address are automatically redacted from all public maps and REST API feeds.</p>
            </div>
          </div>

          <Link
            to="/ask"
            className="text-center py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-emerald-400 border border-emerald-500/20 transition-colors"
          >
            Ask Aravalli Legal AI &rarr;
          </Link>
        </div>
      </div>

      {/* Filterable Incident List */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Incident Reports Feed</h2>
            <span className="text-xs text-slate-400">({filteredReports.length} results)</span>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sector or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Illegal Mining">Illegal Mining</option>
              <option value="Deforestation">Deforestation</option>
              <option value="Water Stress">Water Stress</option>
              <option value="Toxic Dumping">Toxic Dumping</option>
              <option value="Encroachment">Encroachment</option>
              <option value="Land Degradation">Land Degradation</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
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

        {/* Table or Cards */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <div className="inline-block w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading incident records...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <p>No matching reports found for your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 uppercase font-semibold text-slate-400 border-b border-slate-700/80">
                <tr>
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Threat Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-white">{report.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">{report.threatCategory}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-400" title={report.locationName}>
                      {report.locationName || 'Aravalli Range'}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge score={report.riskScore || 50} level={report.riskLevel} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          report.status === 'verified'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : report.status === 'under_review'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : report.status === 'resolved'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : report.status === 'rejected'
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/incident/${report.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CitizenDashboardPage;
