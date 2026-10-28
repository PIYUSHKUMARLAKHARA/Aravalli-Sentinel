import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  Satellite,
  Layers,
  MapPin,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  FileText,
  ShieldAlert,
  Radio,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { fetchZones, fetchReports, generateAreaProblemStatement } from '../services/api';
import { MapView } from '../components/MapView';
import { ZoneDetailDrawer } from '../components/ZoneDetailDrawer';
import { AreaProblemStatementModal } from '../components/maps/AreaProblemStatementModal';
import { RiskBadge } from '../components/RiskBadge';

export function RiskMapPage() {
  const [searchParams] = useSearchParams();
  const initialZoneId = searchParams.get('zone');

  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  // Filters
  const [riskFilter, setRiskFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Sync State
  const [liveSyncEnabled, setLiveSyncEnabled] = useState(true);
  const [secondsUntilSync, setSecondsUntilSync] = useState(15);
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date().toLocaleTimeString());

  // Problem Statement Generator State
  const [problemStatement, setProblemStatement] = useState(null);
  const [generatingStatement, setGeneratingStatement] = useState(false);
  const [statementError, setStatementError] = useState('');

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [zonesRes, reportsRes] = await Promise.all([
        fetchZones(),
        fetchReports(),
      ]);

      if (zonesRes.success && zonesRes.zones) {
        setZones(zonesRes.zones);
        if (initialZoneId) {
          const match = zonesRes.zones.find(z => z.id === initialZoneId);
          if (match) setSelectedZone(match);
        }
      }

      if (reportsRes.success && reportsRes.reports) {
        setReports(reportsRes.reports);
      }

      setLastSyncedTime(new Date().toLocaleTimeString());
      setSecondsUntilSync(15);
    } catch (err) {
      console.error('Failed to sync map telemetry:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialZoneId]);

  // Live telemetry polling ticker
  useEffect(() => {
    if (!liveSyncEnabled) return;

    const timer = setInterval(() => {
      setSecondsUntilSync((prev) => {
        if (prev <= 1) {
          loadData(true);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [liveSyncEnabled]);

  // Generate Area Problem Statement
  const handleGenerateProblemStatement = async (targetZoneId = null) => {
    setGeneratingStatement(true);
    setStatementError('');
    try {
      const payload = {
        zoneId: targetZoneId || selectedZone?.id || 'all',
        state: stateFilter !== 'all' ? stateFilter : undefined,
      };
      const res = await generateAreaProblemStatement(payload);
      if (res.success && res.problemStatement) {
        setProblemStatement(res.problemStatement);
      } else {
        setStatementError(res.error || 'Could not generate problem statement.');
      }
    } catch (err) {
      setStatementError('Error: ' + err.message);
    } finally {
      setGeneratingStatement(false);
    }
  };

  // Filtered zones
  const filteredZones = zones.filter((zone) => {
    if (riskFilter !== 'all' && zone.riskLevel.toLowerCase() !== riskFilter.toLowerCase()) {
      return false;
    }
    if (stateFilter !== 'all' && zone.state.toLowerCase() !== stateFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        zone.name.toLowerCase().includes(q) ||
        zone.stateDistrict.toLowerCase().includes(q) ||
        zone.threats?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (riskFilter !== 'all') {
      const score = r.riskAssessment?.score || r.riskScore || 50;
      if (riskFilter === 'CRITICAL' && score < 76) return false;
      if (riskFilter === 'HIGH RISK' && (score < 51 || score >= 76)) return false;
      if (riskFilter === 'WATCH' && (score < 31 || score >= 51)) return false;
      if (riskFilter === 'SAFE' && score >= 31) return false;
    }
    if (threatFilter !== 'all' && !r.threatCategory.toLowerCase().includes(threatFilter.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && r.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.locationName?.toLowerCase().includes(q) ||
        r.threatCategory?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              GEOSPATIAL OPERATIONS CENTER
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Sentinel-2 & Live Citizen Feed
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY: SYNCED {lastSyncedTime}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Aravalli Ecological Risk Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multi-spectral vegetation loss, mining blast anomalies, and citizen field reports across Gujarat, Rajasthan, Haryana, and Delhi NCR.
          </p>
        </div>

        {/* Live Controls & Problem Statement Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleGenerateProblemStatement()}
            disabled={generatingStatement}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{generatingStatement ? 'Generating...' : 'Area Problem Statement'}</span>
          </button>

          <button
            type="button"
            onClick={() => loadData(false)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
            title="Force refresh telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-mono text-[11px]">{secondsUntilSync}s</span>
          </button>

          <button
            type="button"
            onClick={() => setLiveSyncEnabled(!liveSyncEnabled)}
            className={`px-2.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              liveSyncEnabled
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle live telemetry auto-refresh"
          >
            <Radio className={`w-3 h-3 ${liveSyncEnabled ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{liveSyncEnabled ? 'Live On' : 'Live Paused'}</span>
          </button>
        </div>
      </div>

      {statementError && (
        <div className="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{statementError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row items-center gap-4 justify-between backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sector, district, or report ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto font-mono text-xs">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Risk Bands</option>
            <option value="CRITICAL">Critical (76–100)</option>
            <option value="HIGH RISK">High Risk (51–75)</option>
            <option value="WATCH">Watch (31–50)</option>
            <option value="SAFE">Safe (0–30)</option>
          </select>

          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Threat Types</option>
            <option value="mining">Mining & Blasting</option>
            <option value="deforest">Deforestation</option>
            <option value="water">Water Stress</option>
            <option value="dumping">Toxic Dumping</option>
            <option value="encroach">Encroachment</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Case Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All States</option>
            <option value="Haryana">Haryana</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>
      </div>

      {/* Main Map View with Both Macro Zones and Individual Incidents */}
      <MapView
        zones={filteredZones}
        reports={filteredReports}
        selectedZone={selectedZone}
        onSelectZone={(zone) => setSelectedZone(zone)}
        className="h-[580px] w-full"
      />

      {/* Sector Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
            Filtered Aravalli Sectors ({filteredZones.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Click any sector to view NDVI comparison & generate problem statement
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedZone?.id === zone.id
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <RiskBadge level={zone.riskLevel} score={zone.score} size="sm" />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{zone.state}</span>
              </div>
              <h3 className="text-xs font-bold text-white truncate">{zone.name}</h3>
              <p className="text-[11px] text-slate-400 truncate mb-2">{zone.stateDistrict}</p>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Reports: <strong>{zone.recentCitizenReportsCount}</strong></span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateProblemStatement(zone.id);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                >
                  <span>Problem Statement</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Detail Slide-Out Drawer */}
      <ZoneDetailDrawer
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
      />

      {/* Area Environmental Problem Statement Modal */}
      {problemStatement && (
        <AreaProblemStatementModal
          statement={problemStatement}
          onClose={() => setProblemStatement(null)}
        />
      )}
    </div>
  );
}

export default RiskMapPage;
