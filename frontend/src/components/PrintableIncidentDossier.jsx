import React from 'react';
import { Printer, Shield, CheckSquare, AlertCircle } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { ImageWithFallback } from './ui/ImageWithFallback';

export function PrintableIncidentDossier({ dossier, onClose }) {
  if (!dossier) return null;

  const { incidentSummary, aiAssessment, riskScoreBreakdown, enforcementAuditHistory } = dossier;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start">
      <div className="bg-slate-900 border border-slate-700 max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden print-card">
        {/* Controls Bar (Hidden in Print) */}
        <div className="no-print bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white font-mono">{dossier.dossierId}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-200 bg-slate-900">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-700 pb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-xl tracking-tight text-white">ARAVALLI SENTINEL</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                  DECISION-SUPPORT DOSSIER
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Ecological Early-Warning & Rapid Enforcement Grid
              </p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Dossier Identifier: <strong className="text-slate-300">{dossier.dossierId}</strong>
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-400 space-y-1">
              <div>Date Generated: <span className="text-slate-200">{new Date(dossier.generatedAt).toLocaleString()}</span></div>
              <div>Platform Version: <span className="text-slate-200">1.0.0</span></div>
              <div className="pt-1">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-800 border border-slate-700 text-amber-400">
                  STATUS: {incidentSummary.currentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Incident Location & Threat Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                1. Incident Overview & Field Coordinates
              </h3>
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px]">THREAT CATEGORY</span>
                    <span className="font-semibold text-white">{incidentSummary.threatCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px]">MONITORED ZONE</span>
                    <span className="font-semibold text-white">{incidentSummary.location?.associatedZone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px]">LOCATION / LANDMARK</span>
                  <span className="text-slate-300">{incidentSummary.location?.name}</span>
                </div>
                <div className="font-mono text-slate-400 text-[11px]">
                  <span>GPS Coordinates: </span>
                  <strong className="text-emerald-400">{incidentSummary.location?.coordinates}</strong>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block font-mono text-[10px] mb-1">CITIZEN EVIDENCE DESCRIPTION</span>
                  <p className="text-slate-300 italic leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
                    "{incidentSummary.description}"
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence Image Thumbnail */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-3">
                Evidence Photograph
              </h3>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                <div className="h-44 w-full rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={dossier.evidenceThumbnailUrl}
                    fallbackSrc={dossier.fallbackImageUrl}
                    threatCategory={incidentSummary.threatCategory}
                    alt="Field Evidence"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono text-center mt-2">
                  Hash verified timestamped optical capture
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: AI Evidence Analysis */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              2. Gemini Ecological Vision Assessment
            </h3>
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-300 font-semibold">
                  Suspected Landscape Pattern: <strong className="text-cyan-300">{aiAssessment.explanation}</strong>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Confidence: {aiAssessment.confidence}
                </span>
              </div>

              {aiAssessment.indicators?.length > 0 && (
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block mb-1">OBSERVED VISUAL SIGNALS:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {aiAssessment.indicators.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAssessment.recommendedHumanActions?.length > 0 && (
                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg">
                  <span className="text-amber-300 font-mono text-[10px] uppercase font-bold block mb-1">
                    RECOMMENDED FIELD RANGER VERIFICATION PROTOCOL:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                    {aiAssessment.recommendedHumanActions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                <strong>Technical Limitations:</strong> {aiAssessment.limitations}
              </p>
            </div>
          </div>

          {/* Section 3: Risk Engine Mathematical Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
              3. Explainable Risk Engine Score (0–100)
            </h3>
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-mono text-xs text-slate-400">OVERALL SCORE:</span>
                  <span className="text-xl font-bold font-mono text-white ml-2">
                    {riskScoreBreakdown.overallScore}/100
                  </span>
                  <span className="ml-3 font-semibold text-rose-400 uppercase text-xs">
                    [{riskScoreBreakdown.riskLevel}]
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Formula: Mining(30%) + Veg(25%) + Water(20%) + Citizen(15%) + Hist(10%)
                </div>
              </div>

              {riskScoreBreakdown.factorValues && (
                <div className="grid grid-cols-5 gap-2 text-center font-mono text-xs pt-1">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Mining (30%)</span>
                    <span className="font-bold text-rose-400">{riskScoreBreakdown.factorValues.miningRisk}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Veg Loss (25%)</span>
                    <span className="font-bold text-orange-400">{riskScoreBreakdown.factorValues.vegetationLoss}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Water (20%)</span>
                    <span className="font-bold text-amber-400">{riskScoreBreakdown.factorValues.waterStress}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Citizen (15%)</span>
                    <span className="font-bold text-emerald-400">{riskScoreBreakdown.factorValues.citizenEvidence}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">History (10%)</span>
                    <span className="font-bold text-blue-400">{riskScoreBreakdown.factorValues.historicalChange}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Enforcement Audit Trail */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              4. Chain of Custody & Enforcement Audit Log
            </h3>
            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">TIMESTAMP</th>
                    <th className="p-2.5">ACTION</th>
                    <th className="p-2.5">OFFICER / SENDER</th>
                    <th className="p-2.5">NOTES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-slate-300">
                  {enforcementAuditHistory?.map((audit, i) => (
                    <tr key={i}>
                      <td className="p-2.5 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(audit.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2.5 font-semibold text-white">{audit.action}</td>
                      <td className="p-2.5 text-slate-300">{audit.by} ({audit.role})</td>
                      <td className="p-2.5 text-slate-300 font-sans">{audit.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Sign-off & Verification Block */}
          <div className="pt-6 border-t border-slate-700 grid grid-cols-2 gap-8 text-xs font-mono">
            <div>
              <p className="text-slate-400 mb-6">Investigating Forest Officer / Mining Inspector:</p>
              <div className="border-b border-dashed border-slate-600 w-48 mb-1"></div>
              <p className="text-slate-400 text-[10px]">Name, Seal & Designation</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 mb-6">Divisional Forest Officer / District Magistrate:</p>
              <div className="border-b border-dashed border-slate-600 w-48 ml-auto mb-1"></div>
              <p className="text-slate-400 text-[10px]">Countersignature & Action Order</p>
            </div>
          </div>

          {/* Legal Notice Footer */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-500 text-center leading-relaxed font-sans">
            CONFIDENTIAL ECOLOGICAL REPORT — FOR OFFICIAL REGULATORY & REMEDIATION USE ONLY.
            Generated by ARAVALLI SENTINEL platform. AI inferences are decision-support indicators requiring field verification by authorized government personnel.
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintableIncidentDossier;
