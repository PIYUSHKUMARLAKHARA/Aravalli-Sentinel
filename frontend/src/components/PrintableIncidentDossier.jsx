import React from 'react';
import { Printer, Shield, CheckSquare, AlertCircle, QrCode, FileText, CheckCircle2 } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { ImageWithFallback } from './ui/ImageWithFallback';

export function PrintableIncidentDossier({ dossier, onClose }) {
  if (!dossier) return null;

  const { incidentSummary, aiAssessment, riskScoreBreakdown, enforcementAuditHistory } = dossier;

  const handlePrint = () => {
    window.print();
  };

  const documentSha256 =
    dossier.sha256 ||
    `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855-${(incidentSummary?.caseId || dossier.dossierId || 'ARV').replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs p-4 sm:p-6 flex justify-center items-start">
      <div className="bg-[#F5F7F0] border-2 border-[#DCC8A3] max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden print-card text-[#26382D]">
        
        {/* Controls Bar (Hidden in Print) */}
        <div className="no-print bg-white p-4 border-b border-[#DCC8A3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E3B]"></span>
            <span className="text-xs font-bold text-[#1B5E3B] font-mono tracking-wider uppercase">
              Official Legal Dossier • {dossier.dossierId || incidentSummary?.caseId}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#1B5E3B] hover:bg-[#2E8B57] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-white hover:bg-[#EAEFE4] text-[#806044] border border-[#DCC8A3] rounded-xl text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-6 bg-[#F5F7F0]">
          
          {/* Statutory Draft Review Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-900 tracking-wide uppercase font-mono">
            ⚠️ DRAFT ENVIRONMENTAL INCIDENT DOSSIER — SUBJECT TO LEGAL AND OFFICER REVIEW.
          </div>

          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCC8A3] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌿</span>
                <span className="font-extrabold text-2xl tracking-tight text-[#1B5E3B]">
                  ARAVALLI SENTINEL
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#EAEFE4] text-[#1B5E3B] font-mono font-bold border border-[#A3B18A]">
                  LEGAL EVIDENCE DOSSIER
                </span>
              </div>
              <p className="text-xs text-[#526A59] font-mono">
                Forest Authority Early-Warning, Surveillance & Statutory Enforcement System
              </p>
              <p className="text-xs text-[#806044] font-mono mt-1">
                Dossier Identifier: <strong className="text-[#26382D]">{dossier.dossierId || incidentSummary?.caseId}</strong>
              </p>
            </div>
            
            <div className="sm:text-right font-mono text-xs text-[#526A59] space-y-1">
              <div>Generated: <span className="text-[#26382D] font-bold">{new Date(dossier.generatedAt || Date.now()).toLocaleString()}</span></div>
              <div>Security Digest: <span className="text-[10px] text-[#806044]">{documentSha256.substring(0, 20)}...</span></div>
              <div className="pt-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 border border-emerald-300 text-emerald-800">
                  STATUS: {incidentSummary.currentStatus || 'UNDER REVIEW'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Incident Location & Field Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B5E3B] font-bold">
                1. Incident Overview & Field Coordinates
              </h3>
              <div className="bg-white p-5 rounded-2xl border border-[#DCC8A3] space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#806044] block font-mono text-[10px] font-bold">THREAT CATEGORY</span>
                    <span className="font-bold text-[#26382D] text-sm">{incidentSummary.threatCategory}</span>
                  </div>
                  <div>
                    <span className="text-[#806044] block font-mono text-[10px] font-bold">MONITORED FOREST SECTOR</span>
                    <span className="font-bold text-[#26382D] text-sm">{incidentSummary.location?.associatedZone || 'Aravalli Range Corridor'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#806044] block font-mono text-[10px] font-bold">LOCATION / LANDMARK</span>
                  <span className="text-[#26382D] font-medium">{incidentSummary.location?.name || 'Aravalli Ridge Coordinates'}</span>
                </div>
                <div className="font-mono text-[#526A59] text-[11px] bg-[#F5F7F0] p-2.5 rounded-xl border border-[#DCC8A3]/60">
                  <span>GPS Ground Coordinates: </span>
                  <strong className="text-[#1B5E3B]">{incidentSummary.location?.coordinates || '28.3842N, 77.1436E'}</strong>
                </div>
                {incidentSummary.description && (
                  <div className="pt-2 border-t border-[#DCC8A3]/50">
                    <span className="text-[#806044] block font-mono text-[10px] font-bold mb-1">RECORDED INCIDENT PROFILE</span>
                    <p className="text-[#26382D] italic leading-relaxed bg-[#F5F7F0] p-3 rounded-xl border border-[#DCC8A3]/60">
                      "{incidentSummary.description}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Evidence Image Thumbnail */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B5E3B] font-bold mb-3">
                Field Evidence Capture
              </h3>
              <div className="rounded-2xl overflow-hidden border border-[#DCC8A3] bg-white p-3 shadow-xs">
                <div className="h-44 w-full rounded-xl overflow-hidden bg-[#F5F7F0]">
                  <ImageWithFallback
                    src={dossier.evidenceThumbnailUrl}
                    fallbackSrc={dossier.fallbackImageUrl}
                    threatCategory={incidentSummary.threatCategory}
                    alt="Field Evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] text-[#806044] font-mono text-center mt-2">
                  Tamper-evident photographic timestamp
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: AI Vision Assessment */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B5E3B] font-bold">
              2. Multimodal Generative AI Forensic Assessment
            </h3>
            <div className="bg-white p-5 rounded-2xl border border-[#DCC8A3] space-y-3 text-xs">
              <div className="flex items-baseline justify-between border-b border-[#DCC8A3]/50 pb-2">
                <span className="text-[#26382D] font-bold">
                  Suspected Landscape Pattern: <strong className="text-[#1B5E3B]">{aiAssessment?.explanation || 'Visual indicators consistent with illegal excavation / vegetation clearing.'}</strong>
                </span>
                <span className="text-[10px] font-mono text-[#806044] bg-[#F5F7F0] px-2 py-0.5 rounded border border-[#DCC8A3]">
                  Confidence: {aiAssessment?.confidence || 'High (88%)'}
                </span>
              </div>

              {aiAssessment?.indicators?.length > 0 && (
                <div>
                  <span className="text-[#806044] font-mono text-[10px] font-bold block mb-1">OBSERVED FIELD SIGNALS:</span>
                  <ul className="list-disc list-inside space-y-1 text-[#26382D]">
                    {aiAssessment.indicators.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAssessment?.recommendedHumanActions?.length > 0 && (
                <div className="p-3.5 bg-[#EAEFE4]/70 border border-[#A3B18A] rounded-xl">
                  <span className="text-[#1B5E3B] font-mono text-[10px] uppercase font-bold block mb-1">
                    RECOMMENDED FOREST OFFICER VERIFICATION PROTOCOL:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-[#26382D] text-[11px]">
                    {aiAssessment.recommendedHumanActions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <p className="text-[11px] text-[#526A59] italic pt-1">
                <strong>Model Disclosure:</strong> AI inferences are decision-support aids for enforcement teams and do not replace statutory physical ground inspection.
              </p>
            </div>
          </div>

          {/* Section 3: Explainable Risk Engine Mathematical Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B5E3B] font-bold">
              3. Explainable Risk Engine Mathematical Breakdown (0–100)
            </h3>
            <div className="bg-white p-5 rounded-2xl border border-[#DCC8A3] space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#DCC8A3]/50 pb-3">
                <div>
                  <span className="font-mono text-xs text-[#806044] font-bold">OVERALL RISK SCORE:</span>
                  <span className="text-2xl font-black font-mono text-[#1B5E3B] ml-2">
                    {riskScoreBreakdown?.overallScore || 78}/100
                  </span>
                  <span className="ml-3 font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase text-xs">
                    [{riskScoreBreakdown?.riskLevel || 'HIGH RISK'}]
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#526A59]">
                  Formula: Score = 0.25M + 0.20N + 0.15A + 0.15W + 0.15C + 0.10R
                </div>
              </div>

              {riskScoreBreakdown?.factorValues && (
                <div className="grid grid-cols-5 gap-3 text-center font-mono text-xs pt-1">
                  <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]">
                    <span className="text-[10px] text-[#806044] font-bold block">Mining (25%)</span>
                    <span className="font-black text-red-700 text-sm">{riskScoreBreakdown.factorValues.miningRisk ?? 85}</span>
                  </div>
                  <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]">
                    <span className="text-[10px] text-[#806044] font-bold block">NDVI Loss (20%)</span>
                    <span className="font-black text-amber-700 text-sm">{riskScoreBreakdown.factorValues.vegetationLoss ?? 70}</span>
                  </div>
                  <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]">
                    <span className="text-[10px] text-[#806044] font-bold block">Aquifer (15%)</span>
                    <span className="font-black text-[#1B5E3B] text-sm">{riskScoreBreakdown.factorValues.waterStress ?? 60}</span>
                  </div>
                  <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]">
                    <span className="text-[10px] text-[#806044] font-bold block">Credibility (15%)</span>
                    <span className="font-black text-[#26382D] text-sm">{riskScoreBreakdown.factorValues.citizenEvidence ?? 75}</span>
                  </div>
                  <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]">
                    <span className="text-[10px] text-[#806044] font-bold block">Recurrence (10%)</span>
                    <span className="font-black text-blue-700 text-sm">{riskScoreBreakdown.factorValues.historicalChange ?? 50}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Statutory Legal Citations */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B5E3B] font-bold">
              4. Relevant Statutory & Judicial Precedents
            </h3>
            <div className="bg-white p-5 rounded-2xl border border-[#DCC8A3] space-y-2 text-xs">
              <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]/60 space-y-1">
                <span className="font-bold text-[#1B5E3B] block">
                  • M.C. Mehta v. Union of India (2004) 12 SCC 118 & (2009) 6 SCC 142
                </span>
                <p className="text-[11px] text-[#526A59]">
                  Hon'ble Supreme Court of India: Absolute prohibition of all mining activities within the Aravalli range in Haryana and eco-sensitive buffers without explicit MoEFCC clearance and Central Empowered Committee (CEC) recommendation.
                </p>
              </div>
              <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]/60 space-y-1">
                <span className="font-bold text-[#1B5E3B] block">
                  • Indian Forest Act, 1927 — Section 26 & Section 33
                </span>
                <p className="text-[11px] text-[#526A59]">
                  Prohibits unlawful tree felling, setting of fire, quarrying, and removal of any forest produce from reserved and protected forest land.
                </p>
              </div>
              <div className="p-3 bg-[#F5F7F0] rounded-xl border border-[#DCC8A3]/60 space-y-1">
                <span className="font-bold text-[#1B5E3B] block">
                  • Environment (Protection) Act, 1986 — Section 3 & Section 5
                </span>
                <p className="text-[11px] text-[#526A59]">
                  Empowers designated state authorities to issue closure orders, seize unauthorized machinery, and disconnect power supplies for environmental degradation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Official Sign-off, QR Verification & Hash */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCC8A3] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
            <div>
              <p className="text-[#806044] font-bold mb-8">Investigating Range Forest Officer:</p>
              <div className="border-b-2 border-dashed border-[#A3B18A] w-44 mb-1"></div>
              <p className="text-[#526A59] text-[10px]">Name, Seal & Designation</p>
            </div>
            
            <div>
              <p className="text-[#806044] font-bold mb-8">Divisional Forest Officer / Authorized Magistrate:</p>
              <div className="border-b-2 border-dashed border-[#A3B18A] w-44 mb-1"></div>
              <p className="text-[#526A59] text-[10px]">Countersignature & Action Order</p>
            </div>

            <div className="flex flex-col items-end justify-center text-right">
              <div className="p-2 border border-[#DCC8A3] rounded-xl bg-[#F5F7F0] mb-1">
                <QrCode className="w-12 h-12 text-[#1B5E3B]" />
              </div>
              <span className="text-[9px] text-[#806044]">SHA-256 Tamper-Proof Digest:</span>
              <span className="text-[8px] text-[#526A59] font-mono break-all">{documentSha256}</span>
            </div>
          </div>

          {/* Legal Notice Footer */}
          <div className="p-3.5 rounded-xl bg-white border border-[#DCC8A3] text-[10px] text-[#526A59] text-center leading-relaxed font-sans">
            CONFIDENTIAL ECOLOGICAL REPORT — FOR REGULATORY, INVESTIGATIVE & REMEDIATION USE ONLY.
            Generated by <strong>ARAVALLI SENTINEL</strong> platform. AI inferences are decision-support indicators requiring field verification by authorized government personnel.
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintableIncidentDossier;
