import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  FileWarning,
  Eye,
  CheckCircle,
  TrendingUp,
  Cpu,
  ArrowRight,
  AlertTriangle,
  Trees,
  Mountain,
  Droplets,
  Layers,
  Sparkles,
} from 'lucide-react';
import { fetchZones } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export function LandingPage() {
  const [zones, setZones] = useState([]);
  const [stats, setStats] = useState({
    monitoredZones: 8,
    criticalHotspots: 2,
    communitySentinels: 1420,
    verifiedEnforcements: 28,
  });

  useEffect(() => {
    fetchZones().then((res) => {
      if (res.success && res.zones) {
        setZones(res.zones);
        const criticalCount = res.zones.filter(z => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH RISK').length;
        setStats(prev => ({
          ...prev,
          monitoredZones: res.zones.length,
          criticalHotspots: criticalCount,
        }));
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ecological Atmospheric Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-600/15 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-mono mb-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-POWERED ECOLOGICAL EARLY-WARNING GRID</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            See the Threat. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Predict the Risk.
            </span>{' '}
            Protect the Aravallis.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Uniting citizen sentinels, satellite telemetry, and Google Gemini AI to defend India’s ancient green wall against illegal mining, deforestation, and desertification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/map"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-aravalli-600 hover:from-emerald-500 hover:to-aravalli-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <MapPin className="w-4 h-4" />
              <span>Explore Live Risk Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
            >
              <FileWarning className="w-4 h-4 text-emerald-400" />
              <span>Report Suspicious Threat</span>
            </Link>

            <Link
              to="/authority"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 text-amber-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Authority Triage Portal</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Monitored Sectors</span>
              <span className="text-2xl font-bold font-mono text-white">{stats.monitoredZones} Zones</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">Gujarat to Delhi NCR</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Active Critical Alerts</span>
              <span className="text-2xl font-bold font-mono text-rose-400">{stats.criticalHotspots} Hotspots</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Under Field Triage</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Community Sentinels</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{stats.communitySentinels}+</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Grassroots Guardians</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Enforcement Actions</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{stats.verifiedEnforcements}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Raids & Show-Cause</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Workflow: DETECT → VERIFY → PRIORITIZE → ACT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            RAPID RESPONSE PIPELINE
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            The 4-Step Ecological Action Protocol
          </h2>
          <p className="text-sm text-slate-400">
            Bridging citizen observations with official enforcement without premature or unverified legal conclusions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1: DETECT */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              DETECT
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens and community rangers capture timestamped GPS photographs of illegal quarrying, tree felling, or encroachment.
            </p>
          </div>

          {/* Step 2: VERIFY */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
              VERIFY (AI + Satellites)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini 2.0 Flash extracts visual excavation cues while Copernicus Sentinel-2 cross-references regional NDVI vegetation decline.
            </p>
          </div>

          {/* Step 3: PRIORITIZE */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              PRIORITIZE
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Explainable Risk Engine scores threat severity from 0 to 100 based on 5 weighted environmental vectors, highlighting primary drivers.
            </p>
          </div>

          {/* Step 4: ACT */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-mono font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
              ACT
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized Forest Officers and Mining Task Forces dispatch ground inspection teams, seize machinery, and log formal audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* The Explainable Aravalli Risk Engine Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>TRANSPARENT MATHEMATICAL MODEL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The Explainable Aravalli Risk Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Zero black-box decisions. Risk scores are computed from 5 normalized vectors calibrated against peer-reviewed ecological indicators and legal frameworks.
            </p>
          </div>

          {/* Formula Callout */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
            <code>
              Overall Score = (Mining × 0.30) + (Vegetation × 0.25) + (Water × 0.20) + (Citizen × 0.15) + (History × 0.10)
            </code>
          </div>

          {/* 5 Factors Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2">
              <div className="flex justify-between items-center text-rose-400">
                <span className="font-bold">30%</span>
                <Mountain className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">Illegal Mining</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Blasting proximity, heavy dumper trails, and rocky hill cut depth.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-orange-500/30 space-y-2">
              <div className="flex justify-between items-center text-orange-400">
                <span className="font-bold">25%</span>
                <Trees className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">Vegetation Loss</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Copernicus Sentinel-2 NDVI anomalies and native Dhau forest felling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex justify-between items-center text-amber-400">
                <span className="font-bold">20%</span>
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">Water Stress</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Drawdown of hill recharge aquifers and seasonal nallah blockages.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center text-emerald-400">
                <span className="font-bold">15%</span>
                <Eye className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">Citizen Evidence</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Corroborating reports submitted by local sentinels within 30 days.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-2">
              <div className="flex justify-between items-center text-blue-400">
                <span className="font-bold">10%</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-xs">Historical Trend</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Decadal land use transformation rate from protected ridge to denuded scrub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Monitored Zones Snapshot */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              REAL-TIME MONITORING GRID
            </span>
            <h2 className="text-2xl font-bold text-white">Active Aravalli Sectors</h2>
          </div>
          <Link to="/map" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <span>View All Sectors on Geospatial Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.slice(0, 4).map((zone) => (
            <div
              key={zone.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <RiskBadge level={zone.riskLevel} score={zone.score} size="sm" />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{zone.state}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{zone.name}</h3>
                <p className="text-[11px] text-slate-400">{zone.stateDistrict}</p>
              </div>
              <div className="text-[11px] text-slate-300 font-mono pt-2 border-t border-slate-800/80 flex justify-between">
                <span>NDVI Anomaly:</span>
                <span className={zone.telemetry.ndviAnomaly < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {zone.telemetry.ndviAnomaly > 0 ? '+' : ''}{zone.telemetry.ndviAnomaly}%
                </span>
              </div>
              <Link
                to={`/map?zone=${zone.id}`}
                className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
              >
                <span>Inspect Telemetry</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Supreme Court & Environmental Law Anchor */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <span>Grounded in Supreme Court Ecological Directives</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In <em>M.C. Mehta vs Union of India</em> (2004/2009), the Supreme Court of India established a complete ban on mining in the notified Aravalli Range. ARAVALLI SENTINEL provides the decentralized intelligence layer to ensure this vital protective wall never falls silent.
            </p>
          </div>
          <Link
            to="/ask?q=Supreme+Court+Aravalli+Ban"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult Legal Assistant</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
