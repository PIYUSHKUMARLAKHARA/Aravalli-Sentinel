import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { fetchZones } from '../services/api';
import { MapView } from '../components/MapView';
import { ZoneDetailDrawer } from '../components/ZoneDetailDrawer';
import { RiskBadge } from '../components/RiskBadge';

export function RiskMapPage() {
  const [searchParams] = useSearchParams();
  const initialZoneId = searchParams.get('zone');

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  // Filters
  const [riskFilter, setRiskFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadZones = async () => {
    setLoading(true);
    try {
      const res = await fetchZones();
      if (res.success && res.zones) {
        setZones(res.zones);
        if (initialZoneId) {
          const match = res.zones.find(z => z.id === initialZoneId);
          if (match) setSelectedZone(match);
        }
      }
    } catch (err) {
      console.error('Failed to load zones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, [initialZoneId]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              GEOSPATIAL OPERATIONS CENTER
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Copernicus Sentinel-2 & Citizen Ground Grid
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Aravalli Ecological Risk Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multi-spectral vegetation loss, mining blast anomalies, and citizen alerts across Gujarat, Rajasthan, Haryana, and Delhi NCR.
          </p>
        </div>

        {/* Legend / Status indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadZones}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
            title="Refresh satellite telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sector, district, or threat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Risk Level:</span>
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="all">All Risk Levels ({zones.length})</option>
            <option value="CRITICAL">Critical (76–100)</option>
            <option value="HIGH RISK">High Risk (51–75)</option>
            <option value="WATCH">Watch (31–50)</option>
            <option value="SAFE">Safe (0–30)</option>
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="all">All States</option>
            <option value="Haryana">Haryana</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Delhi NCR">Delhi NCR</option>
          </select>
        </div>
      </div>

      {/* Main Map View */}
      <MapView
        zones={filteredZones}
        selectedZone={selectedZone}
        onSelectZone={(zone) => setSelectedZone(zone)}
        className="h-[550px] w-full"
      />

      {/* Sector Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
            Filtered Aravalli Sectors ({filteredZones.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Click any sector card to view remote sensing telemetry
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
                <span>Citizen Reports: <strong>{zone.recentCitizenReportsCount}</strong></span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
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
    </div>
  );
}

export default RiskMapPage;
