import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  FileText,
  Radio,
} from 'lucide-react';
import { fetchZones, fetchReports, generateAreaProblemStatement } from '../services/api';
import { MapView } from '../components/MapView';
import { ZoneDetailDrawer } from '../components/ZoneDetailDrawer';
import { AreaProblemStatementModal } from '../components/AreaProblemStatementModal';
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
          const match = zonesRes.zones.find((z) => z.id === initialZoneId);
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
        zone.threats?.some((t) => t.toLowerCase().includes(q))
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-[#DCC8A3] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#1B5E3B] font-bold tracking-wider bg-[#EAEFE4] px-3 py-1 rounded-full border border-[#A3B18A]">
                Geospatial Surveillance Center
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#F5F7F0] text-[#526A59] border border-[#DCC8A3]">
                Copernicus Sentinel-2 & Ground Citizen Reports
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A] flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#1B5E3B] animate-pulse" />
                <span>SYNCED {lastSyncedTime}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#26382D] tracking-tight">
              Aravalli Ecological Risk Map
            </h1>
            <p className="text-xs sm:text-sm text-[#526A59] leading-relaxed">
              Multi-spectral vegetation loss, mining excavation anomalies, and citizen reports across Gujarat, Rajasthan, Haryana, and Delhi NCR.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleGenerateProblemStatement()}
              disabled={generatingStatement}
              className="px-4 py-2.5 rounded-2xl bg-[#1B5E3B] hover:bg-[#2E8B57] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-[#DCC8A3]" />
              <span>{generatingStatement ? 'Generating...' : 'Area Problem Statement'}</span>
            </button>

            <button
              type="button"
              onClick={() => loadData(false)}
              className="p-2.5 rounded-2xl bg-[#F5F7F0] hover:bg-white border border-[#DCC8A3] text-[#526A59] text-xs flex items-center gap-1.5 transition-colors"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-mono text-[11px] font-bold">{secondsUntilSync}s</span>
            </button>

            <button
              type="button"
              onClick={() => setLiveSyncEnabled(!liveSyncEnabled)}
              className={`px-3 py-2 rounded-2xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                liveSyncEnabled
                  ? 'bg-[#EAEFE4] border-[#A3B18A] text-[#1B5E3B]'
                  : 'bg-[#F5F7F0] border-[#DCC8A3] text-[#526A59]'
              }`}
            >
              <Radio className={`w-3 h-3 ${liveSyncEnabled ? 'animate-pulse text-[#1B5E3B]' : ''}`} />
              <span>{liveSyncEnabled ? 'Live Auto' : 'Paused'}</span>
            </button>
          </div>
        </div>
      </div>

      {statementError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{statementError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DCC8A3] rounded-3xl p-4 flex flex-col lg:flex-row items-center gap-4 justify-between shadow-xs">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#526A59] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sector, district, or Case ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl pl-9 pr-4 py-2 text-xs text-[#26382D] placeholder-[#526A59] focus:outline-hidden focus:ring-2 focus:ring-[#1B5E3B]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto font-mono text-xs">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl px-3 py-2 text-[#26382D] focus:outline-hidden"
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
            className="bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl px-3 py-2 text-[#26382D] focus:outline-hidden"
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
            className="bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl px-3 py-2 text-[#26382D] focus:outline-hidden"
          >
            <option value="all">All Case Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-[#F5F7F0]/60 border border-[#DCC8A3] rounded-2xl px-3 py-2 text-[#26382D] focus:outline-hidden"
          >
            <option value="all">All States</option>
            <option value="Haryana">Haryana</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>
      </div>

      {/* Main Map View */}
      <div className="rounded-3xl overflow-hidden border border-[#DCC8A3] shadow-sm">
        <MapView
          zones={filteredZones}
          reports={filteredReports}
          selectedZone={selectedZone}
          onSelectZone={(zone) => setSelectedZone(zone)}
          className="h-[580px] w-full"
        />
      </div>

      {/* Sector Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-[#26382D] uppercase tracking-wider">
            Filtered Aravalli Sectors ({filteredZones.length})
          </h2>
          <span className="text-xs text-[#526A59] font-mono">
            Click any sector to view NDVI comparison & generate problem statement
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                selectedZone?.id === zone.id
                  ? 'border-[#1B5E3B] bg-[#EAEFE4] shadow-sm'
                  : 'border-[#DCC8A3] bg-white hover:bg-[#F5F7F0]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <RiskBadge level={zone.riskLevel} score={zone.score} size="sm" />
                <span className="text-[10px] font-mono text-[#526A59] uppercase font-bold">{zone.state}</span>
              </div>
              <h3 className="text-xs font-bold text-[#26382D] truncate">{zone.name}</h3>
              <p className="text-[11px] text-[#526A59] truncate mb-2">{zone.stateDistrict}</p>

              <div className="pt-2 border-t border-[#DCC8A3]/60 text-[10px] font-mono text-[#526A59] flex items-center justify-between">
                <span>Reports: <strong className="text-[#1B5E3B]">{zone.recentCitizenReportsCount}</strong></span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateProblemStatement(zone.id);
                  }}
                  className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-0.5"
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