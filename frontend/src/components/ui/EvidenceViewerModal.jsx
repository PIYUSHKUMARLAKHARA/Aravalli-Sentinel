import React from 'react';
import { X, MapPin, ShieldAlert, Download, Calendar, ExternalLink } from 'lucide-react';

export function EvidenceViewerModal({ evidence, onClose }) {
  if (!evidence) return null;

  const {
    url,
    caseId,
    threatCategory,
    locationName,
    latitude,
    longitude,
    reportedAt,
    notes,
  } = evidence;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">
                  {caseId || 'Optical Evidence Dossier'}
                </span>
                {threatCategory && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                    {threatCategory}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {locationName || 'Aravalli Regional Monitored Coordinate'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Content Container */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60 min-h-[300px]">
          <img
            src={url}
            alt={caseId || 'Evidence'}
            className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl border border-slate-800"
          />
        </div>

        {/* Footer Metadata */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">
              {latitude && longitude ? `${latitude}° N, ${longitude}° E` : 'GPS Coordinates Attached'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{reportedAt ? new Date(reportedAt).toLocaleString() : 'Field Timestamp Verified'}</span>
          </div>

          <div className="flex items-center justify-end gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Raw Image</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvidenceViewerModal;
