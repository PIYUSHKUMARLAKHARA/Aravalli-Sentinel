import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Upload,
  MapPin,
  FileWarning,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { submitThreatReport, previewAnalyzeEvidence } from '../services/api';
import { MapView } from '../components/MapView';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { useAuth } from '../context/AuthContext';

const THREAT_CATEGORIES = [
  'Illegal Mining & Quarrying',
  'Deforestation / Tree Felling',
  'Encroachment & Construction',
  'Toxic Waste Dumping',
  'Ground Water Depletion / Deep Boring',
  'Other Ecological Threat',
];

export function ReportThreatPage() {
  const [searchParams] = useSearchParams();
  const preZoneId = searchParams.get('zoneId') || '';
  const preLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null;
  const preLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null;
  const preZoneName = searchParams.get('zoneName') || '';

  const { user } = useAuth();

  // Form states
  const [threatCategory, setThreatCategory] = useState('Illegal Mining & Quarrying');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(preZoneName ? `Near ${preZoneName}` : '');
  const [latitude, setLatitude] = useState(preLat || 28.3892);
  const [longitude, setLongitude] = useState(preLng || 77.1415);
  const [incidentTime, setIncidentTime] = useState(new Date().toISOString().slice(0, 16));

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Status & AI Preview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewAnalysis, setPreviewAnalysis] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds 10MB limit. Please upload a compressed image.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage('');
      setPreviewAnalysis(null); // Reset preview
    }
  };

  // Use Browser Geolocation
  const handleGetGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(5)));
          setLongitude(Number(pos.coords.longitude.toFixed(5)));
          setLocationName((prev) => prev || 'Current GPS Field Coordinates');
        },
        (err) => {
          setErrorMessage('Could not fetch GPS coordinates: ' + err.message);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser.');
    }
  };

  // Run AI Preview before submission
  const handleAIPreview = async () => {
    if (!description || description.trim().length < 10) {
      setErrorMessage('Please provide a brief description (at least 10 characters) before running AI analysis.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('evidenceImage', selectedFile);
      }
      formData.append('threatCategory', threatCategory);
      formData.append('userDescription', description);

      const res = await previewAnalyzeEvidence(formData);
      if (res.success && res.analysis) {
        setPreviewAnalysis(res.analysis);
      } else {
        setErrorMessage(res.error || 'AI analysis could not be completed.');
      }
    } catch (err) {
      setErrorMessage('AI analysis error: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Final Report Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || description.trim().length < 10) {
      setErrorMessage('Description must be at least 10 characters to provide actionable context for forest rangers.');
      return;
    }
    if (!locationName) {
      setErrorMessage('Please provide a location name or landmark.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('evidenceImage', selectedFile);
      }
      formData.append('threatCategory', threatCategory);
      formData.append('description', description);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('locationName', locationName);
      formData.append('incidentTime', incidentTime);
      if (preZoneId) formData.append('zoneId', preZoneId);

      const res = await submitThreatReport(formData);

      if (res.success && res.report) {
        setSubmissionSuccess(res.report);
      } else {
        setErrorMessage(res.error || 'Failed to submit report.');
      }
    } catch (err) {
      setErrorMessage('Submission error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-in zoom-in">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
            REPORT LOGGED & TRANSMITTED
          </span>
          <h1 className="text-3xl font-extrabold text-white">Threat Evidence Submitted</h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Your report has been analyzed by Google Gemini AI, integrated into the Aravalli Risk Engine, and queued for official field verification.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4 text-xs font-mono">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Tracking Reference:</span>
            <span className="text-white font-bold">{submissionSuccess.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Threat Category:</span>
            <span className="text-white">{submissionSuccess.threatCategory}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Evaluated Risk Score:</span>
            <span className="text-rose-400 font-bold">{submissionSuccess.riskAssessment?.score}/100 [{submissionSuccess.riskAssessment?.riskLevel}]</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Citizen Privacy:</span>
            <span className="text-emerald-400 font-semibold">Redacted for Personal Safety</span>
          </div>
        </div>

        {submissionSuccess.evidenceAnalysis && (
          <div className="max-w-xl mx-auto text-left">
            <AIAnalysisCard analysis={submissionSuccess.evidenceAnalysis} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setSubmissionSuccess(null);
              setDescription('');
              setSelectedFile(null);
              setPreviewUrl(null);
              setPreviewAnalysis(null);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Submit Another Report
          </button>
          <Link
            to="/authority"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>View in Authority Triage Queue</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
            CITIZEN SENTINEL INGESTION GATEWAY
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Secure & Privacy-Preserving
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Report Suspected Environmental Threat
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload ground photographs and GPS coordinates of illegal mining, hill blasting, deforestation, or encroachment. Evidence is analyzed by Google Gemini AI and forwarded to Forest Authorities.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Evidence Upload & Coordinates (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Threat Category */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold">
              1. Observed Threat Category
            </label>
            <select
              value={threatCategory}
              onChange={(e) => setThreatCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {THREAT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Photographic Evidence Upload */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center justify-between">
              <span>2. Photographic Evidence</span>
              <span className="text-[10px] text-slate-400 font-normal">JPEG, PNG, WEBP (Max 10MB)</span>
            </label>

            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center bg-slate-900/50 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Uploaded Evidence"
                    className="max-h-60 mx-auto rounded-xl object-contain border border-slate-700 shadow-lg"
                  />
                  <p className="text-xs text-emerald-400 font-mono">
                    ✓ {selectedFile?.name} ({Math.round(selectedFile?.size / 1024)} KB)
                  </p>
                  <p className="text-[10px] text-slate-400">Click or drag a new image to replace</p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    Click to browse or drag & drop evidence photo
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Photos of rock cuts, dumpers, felled trees, or boundary fences
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center justify-between">
              <span>3. Ground Observations & Details</span>
              <span className="text-[10px] text-slate-400 font-normal">{description.length}/2000 chars</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe what you observed (e.g. night-time blasting, presence of heavy earthmovers, registration numbers, tree cutting on ridge slope)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* AI Preview Action Button */}
          <div>
            <button
              type="button"
              onClick={handleAIPreview}
              disabled={isAnalyzing || !description || description.trim().length < 10}
              className="w-full py-2.5 px-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-cyan-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>
                {isAnalyzing ? 'Analyzing Image & Observations with Gemini...' : 'Preview Gemini AI Assessment Before Submitting'}
              </span>
            </button>
          </div>

          {/* AI Preview Display */}
          {previewAnalysis && (
            <div className="animate-in fade-in duration-300">
              <AIAnalysisCard analysis={previewAnalysis} />
            </div>
          )}
        </div>

        {/* Right Column: GPS Location Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center justify-between">
              <span>4. Field Coordinates & Map Pin</span>
              <button
                type="button"
                onClick={handleGetGPS}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
              >
                <MapPin className="w-3 h-3" />
                <span>Use My GPS</span>
              </button>
            </label>

            {/* Interactive Map Picker */}
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-md">
              <MapView
                zones={[]}
                isPickerMode={true}
                pickerLocation={{ lat: latitude, lng: longitude }}
                onLocationPicked={({ lat, lng }) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
                className="h-[280px] w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Latitude</span>
                <span className="font-bold text-white">{latitude}° N</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Longitude</span>
                <span className="font-bold text-white">{longitude}° E</span>
              </div>
            </div>
          </div>

          {/* Landmark Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold">
              5. Landmark / Sector Name
            </label>
            <input
              type="text"
              placeholder="e.g. Bandhwari Ridge Cut, Tehla Pass, Sariska Buffer Sector 2"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Incident Time */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold">
              6. Incident Time (Approximate)
            </label>
            <input
              type="datetime-local"
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Privacy Notice Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Citizen Protection Protocol</span>
            </div>
            <p>
              Your personal identity, phone number, and account credentials are <strong>strictly redacted</strong> from public views. Only verified Divisional Forest Officers and Mining Task Force officials can access evidence logs.
            </p>
          </div>

          {/* Final Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-aravalli-600 hover:from-emerald-500 hover:to-aravalli-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Evidence & Calculating Risk...</span>
              </>
            ) : (
              <>
                <FileWarning className="w-4 h-4" />
                <span>Submit Official Threat Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportThreatPage;
