import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, CheckSquare, Info } from 'lucide-react';

export function AIAnalysisCard({ analysis, compact = false }) {
  if (!analysis) return null;

  const isSimulated = analysis.isSimulated;
  const indicators = analysis.observedVisualIndicators || [];
  const verificationSteps = analysis.recommendedVerificationSteps || [];

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-900/90 p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-wider text-cyan-300 uppercase">
                GEMINI ECOLOGICAL EVIDENCE ASSESSMENT
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isSimulated
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}>
                {isSimulated ? 'Heuristic Simulator' : 'Gemini 2.0 Flash'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Automated visual pattern and environmental risk classification</p>
          </div>
        </div>

        {analysis.confidenceEstimate && (
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            Confidence: <strong className="text-cyan-300">{analysis.confidenceEstimate}</strong>
          </span>
        )}
      </div>

      {/* Primary Category & Explanation */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Suspected Threat:</span>
          <span className="text-sm font-bold text-white bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            {analysis.possibleThreatCategory || 'Unclassified Disturbance'}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          {analysis.explanation}
        </p>
      </div>

      {/* Visual Indicators Observed */}
      {indicators.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-mono text-cyan-300 uppercase font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Observed Visual Indicators</span>
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {indicators.map((ind, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-2 rounded-md border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Ground Verification Checklist */}
      {verificationSteps.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-mono text-amber-300 uppercase font-semibold flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Recommended Ranger Verification Protocol</span>
          </span>
          <div className="space-y-1.5">
            {verificationSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-amber-950/20 p-2 rounded-md border border-amber-500/20">
                <span className="font-mono text-amber-400 font-bold flex-shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uncertainty & Limitations Callout */}
      {analysis.uncertaintyAndLimitations && (
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] font-semibold">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technical Limitations & Ambiguity Note</span>
          </div>
          <p className="leading-relaxed">
            {analysis.uncertaintyAndLimitations}
          </p>
        </div>
      )}

      {/* Non-defamation Legal Disclaimer */}
      <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-300/90 leading-relaxed flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Legal Disclaimer:</strong> {analysis.legalDisclaimer || 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.'}
        </span>
      </div>
    </div>
  );
}

export default AIAnalysisCard;
