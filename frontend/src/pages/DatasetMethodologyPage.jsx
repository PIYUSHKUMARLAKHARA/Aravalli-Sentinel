import React, { useState } from 'react';
import {
  Database,
  FileSpreadsheet,
  MapPin,
  CheckCircle2,
  Download,
  Terminal,
  ShieldAlert,
  Layers,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SAMPLE_REPORTS_PREVIEW = [
  { id: 'CR-2026-001', location: 'Bandhwari Forest Corridor, Gurugram', threat: 'Toxic Dumping', score: 84.5, level: 'CRITICAL', status: 'under_review' },
  { id: 'CR-2026-002', location: 'Sariska Northern Buffer, Alwar', threat: 'Illegal Mining', score: 78.2, level: 'CRITICAL', status: 'verified' },
  { id: 'CR-2026-003', location: 'Asola Bhatti Sanctuary Buffer, Delhi', threat: 'Encroachment', score: 58.4, level: 'HIGH RISK', status: 'verified' },
  { id: 'CR-2026-004', location: 'Nahargarh Ridge, Jaipur', threat: 'Deforestation', score: 67.3, level: 'HIGH RISK', status: 'under_review' },
  { id: 'CR-2026-005', location: 'Tosham Hill Range, Bhiwani', threat: 'Illegal Mining', score: 88.7, level: 'CRITICAL', status: 'verified' },
  { id: 'CR-2026-006', location: 'Kumbhalgarh Wildlife Corridor, Rajsamand', threat: 'Water Stress', score: 52.1, level: 'HIGH RISK', status: 'under_review' },
  { id: 'CR-2026-007', location: 'Khetri Copper Belt Foothills, Jhunjhunu', threat: 'Land Degradation', score: 46.8, level: 'WATCH', status: 'pending' },
  { id: 'CR-2026-008', location: 'Sirohi South Ridge, Sirohi', threat: 'Deforestation', score: 48.5, level: 'WATCH', status: 'pending' }
];

const SAMPLE_OBSERVATIONS_CHART = [
  { region: 'Sariska Core', ndvi: 0.58, waterStress: 35.2 },
  { region: 'Kumbhalgarh', ndvi: 0.52, waterStress: 42.3 },
  { region: 'Mangar Bani', ndvi: 0.48, waterStress: 51.2 },
  { region: 'Udaipur Hills', ndvi: 0.44, waterStress: 48.9 },
  { region: 'Asola Bhatti', ndvi: 0.38, waterStress: 55.0 },
  { region: 'Nahargarh', ndvi: 0.29, waterStress: 68.7 },
  { region: 'Gurugram Ridge', ndvi: 0.21, waterStress: 88.4 },
  { region: 'Tosham Granite', ndvi: 0.16, waterStress: 91.2 }
];

export function DatasetMethodologyPage() {
  const [activeTab, setActiveTab] = useState('reports');

  const downloadSampleCSV = () => {
    window.open('/datasets/citizen_reports/sample_citizen_reports.csv', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Open Environmental Data Package
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              WGS 84 / EPSG:4326
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Version 1.0.0 • Verified</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Aravalli Sentinel Dataset & Methodology
        </h1>
        <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
          Comprehensive, machine-readable datasets and geospatial vector layers modeling environmental threats, multispectral Sentinel-2 NDVI anomalies, and citizen vigilance across northwest India's Aravalli Range.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://github.com/PIYUSHKUMARLAKHARA/Aravalli-Sentinel"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white border border-slate-700 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      {/* Dataset Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">Citizen Threat Reports</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            33 structured records of citizen and ranger observations with geotags, timestamps, threat classifications, and risk scores.
          </p>
          <div className="text-xs font-mono text-emerald-400">
            `datasets/citizen_reports/sample_citizen_reports.csv`
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">Environmental Observations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            52 grid cell observations modeling Copernicus Sentinel-2 MSI and Landsat-9 NDVI, water stress, and disturbance factors.
          </p>
          <div className="text-xs font-mono text-cyan-400">
            `datasets/environmental_observations/...csv`
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">Risk Zones GeoJSON</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            10 monitored Aravalli ecological zones and corridors defined in RFC 7946 GeoJSON format for Leaflet and GIS analysis.
          </p>
          <div className="text-xs font-mono text-amber-400">
            `datasets/risk_zones/sample_risk_zones.geojson`
          </div>
        </div>
      </div>

      {/* Interactive Telemetry Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <span>Comparative Canopy Health (NDVI) vs Water Stress</span>
            </h2>
            <p className="text-xs text-slate-400">
              Derived from modeled Sentinel-2 MSI 10-meter surface reflectance across major Aravalli ecological sectors.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> NDVI Canopy
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Water Stress Index
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SAMPLE_OBSERVATIONS_CHART} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="region" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              />
              <Bar dataKey="ndvi" fill="#10b981" radius={[4, 4, 0, 0]} name="Canopy NDVI (0-1)" />
              <Bar dataKey="waterStress" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Water Stress (0-100)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dataset Preview Tabs */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'reports' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Citizen Reports (33 rows)
            </button>
            <button
              onClick={() => setActiveTab('validation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'validation' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Validation Engine Specs
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            CLI: <span className="text-emerald-400">npm run validate:dataset</span>
          </div>
        </div>

        {activeTab === 'reports' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 uppercase font-semibold text-slate-400 border-b border-slate-700/80">
                <tr>
                  <th className="py-2.5 px-3">Report ID</th>
                  <th className="py-2.5 px-3">Location Name</th>
                  <th className="py-2.5 px-3">Threat Type</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {SAMPLE_REPORTS_PREVIEW.map(r => (
                  <tr key={r.id} className="hover:bg-slate-850/60">
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-medium">{r.id}</td>
                    <td className="py-2.5 px-3 text-white">{r.location}</td>
                    <td className="py-2.5 px-3">{r.threat}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{r.score}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 border border-slate-700">
                        {r.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-emerald-400 font-bold">// ARAVALLI SENTINEL VALIDATION CRITERIA</p>
            <p>1. Latitude bounds check: 24.0°N &le; lat &le; 28.9°N (Rajasthan, Haryana, Delhi, Gujarat)</p>
            <p>2. Longitude bounds check: 72.5°E &le; lon &le; 77.5°E (Aravalli Range)</p>
            <p>3. Risk score range check: 0.0 &le; score &le; 100.0</p>
            <p>4. Normalized vegetation index: -1.0 &le; NDVI &le; 1.0</p>
            <p>5. Referential integrity: All referenced evidence images must exist on disk.</p>
            <p>6. Identifier collision check: Zero duplicate IDs across report, observation, and zone tables.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatasetMethodologyPage;
