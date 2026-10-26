import React from 'react';
import { X, AlertTriangle, ShieldCheck, Satellite, Activity, FileWarning, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { Link } from 'react-router-dom';

export function ZoneDetailDrawer({ zone, onClose }) {
  if (!zone) return null;

  const factors = zone.factors || {};
  const telemetry = zone.telemetry || {};
  const contributions = zone.contributions || {};

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-5 border-b border-slate-800 flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RiskBadge level={zone.riskLevel} score={zone.score} size="md" />
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{zone.state}</span>
          </div>
          <h2 className="text-lg font-bold text-white">{zone.name}</h2>
          <p className="text-xs text-slate-400">{zone.stateDistrict}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Risk Score Summary Banner */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Composite Risk Score</span>
            <span className="text-2xl font-black font-mono" style={{ color: zone.color }}>
              {zone.score?.toFixed(1) || zone.score}/100
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Classification:</strong> {zone.label}.
          </p>
          {zone.primaryDriver && (
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Primary Threat Driver</span>
              <span className="font-semibold text-rose-300">{zone.primaryDriver.displayName}</span>
              <span className="text-slate-400 ml-1">({zone.primaryDriver.contribution} pts contribution)</span>
            </div>
          )}
        </div>

        {/* 5-Factor Risk Engine Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Explainable Signals (100% Normalized)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Formula Weights</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Mining Risk 30% */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>1. Illegal Mining (30% wt)</span>
                <span className="font-bold">{factors.miningRisk}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${factors.miningRisk}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                {contributions.miningRisk?.explanation || 'Excavation proximity and blast signatures.'}
              </p>
            </div>

            {/* Vegetation Loss 25% */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>2. Vegetation Loss (25% wt)</span>
                <span className="font-bold">{factors.vegetationLoss}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${factors.vegetationLoss}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                {contributions.vegetationLoss?.explanation || 'NDVI decline and native scrub tree felling.'}
              </p>
            </div>

            {/* Water Stress 20% */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>3. Water Stress (20% wt)</span>
                <span className="font-bold">{factors.waterStress}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${factors.waterStress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                {contributions.waterStress?.explanation || 'Aquifer drawdown and seasonal stream interruption.'}
              </p>
            </div>

            {/* Citizen Evidence 15% */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>4. Citizen Reports (15% wt)</span>
                <span className="font-bold">{factors.citizenEvidence}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${factors.citizenEvidence}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                {contributions.citizenEvidence?.explanation || 'Field alerts submitted within last 30 days.'}
              </p>
            </div>

            {/* Historical Change 10% */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>5. Historical Change (10% wt)</span>
                <span className="font-bold">{factors.historicalChange}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${factors.historicalChange}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                {contributions.historicalChange?.explanation || 'Decadal transformation trend from forest to scrub.'}
              </p>
            </div>
          </div>
        </div>

        {/* Remote Sensing Telemetry */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
            <Satellite className="w-4 h-4" />
            <span>Satellite Telemetry (Copernicus / Sentinel-2)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Mean NDVI</span>
              <span className="text-white font-bold">{telemetry.ndviMean || '0.34'}</span>
              <span className={`text-[10px] ml-1.5 ${telemetry.ndviAnomaly < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                ({telemetry.ndviAnomaly > 0 ? '+' : ''}{telemetry.ndviAnomaly}%)
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Observation Date</span>
              <span className="text-white font-semibold text-[11px]">
                {telemetry.observationDate ? new Date(telemetry.observationDate).toLocaleDateString() : 'Recent Pass'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            <strong>Source:</strong> {telemetry.dataSource || 'Sentinel-2 L2A Multispectral Instrument'}. Coverage: {telemetry.coverage}.
          </p>
        </div>

        {/* Recommended Enforcement Action */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Mandatory Action Protocol</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {zone.recommendedAction}
          </p>
          <div className="text-[11px] text-slate-400 pt-1">
            <strong>Legal Reference:</strong> {zone.legalStatus}
          </div>
        </div>

        {/* Call to action: Report Threat in this Zone */}
        <Link
          to={`/report?zoneId=${zone.id}&lat=${zone.coordinates.lat}&lng=${zone.coordinates.lng}&zoneName=${encodeURIComponent(zone.name)}`}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-aravalli-600 hover:from-emerald-500 hover:to-aravalli-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <FileWarning className="w-4 h-4" />
          <span>Submit Citizen Report in this Sector</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default ZoneDetailDrawer;
