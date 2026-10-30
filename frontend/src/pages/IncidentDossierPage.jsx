import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { fetchIncidentDossier } from '../services/api';
import { PrintableIncidentDossier } from '../components/PrintableIncidentDossier';

export function IncidentDossierPage() {
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchIncidentDossier(id);
        if (res.success && res.dossier) {
          setDossier(res.dossier);
        } else {
          setError(res.error || 'Dossier not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xs font-mono text-slate-400 gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
        <span>Generating official incident dossier...</span>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Dossier Unavailable</h2>
        <p className="text-xs text-slate-400">{error || 'Could not locate case file.'}</p>
        <Link
          to="/admin?tab=triage"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Authority Incident Triage</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <PrintableIncidentDossier
        dossier={dossier}
        onClose={() => window.history.back()}
      />
    </div>
  );
}

export default IncidentDossierPage;
