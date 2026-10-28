import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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
  X,
  Copy,
  Check,
  Compass,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import { submitThreatReport, previewAnalyzeEvidence } from '../services/api';
import { MapView } from '../components/MapView';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useAuth } from '../context/AuthContext';

const THREAT_CATEGORIES = [
  'Illegal Mining & Quarrying',
  'Deforestation / Tree Felling',
  'Encroachment & Construction',
  'Toxic Waste Dumping',
  'Ground Water Depletion / Deep Boring',
  'Land Degradation',
  'Other Ecological Threat',
];

export function ReportThreatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preZoneId = searchParams.get('zoneId') || '';
  const preLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null;
  const preLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null;
  const preZoneName = searchParams.get('zoneName') || '';

  const { user } = useAuth();
  const formRef = useRef(null);

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

  // Field-level inline errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Status & Progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewAnalysis, setPreviewAnalysis] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [submissionError, setSubmissionError] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Clean up preview object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      setFieldErrors(prev => ({
        ...prev,
        file: 'Invalid file format. Only JPEG, PNG, WEBP, and HEIC images are accepted.',
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFieldErrors(prev => ({
        ...prev,
        file: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit.`,
      }));
      return;
    }

    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy.file;
      return copy;
    });

    setSelectedFile(file);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewAnalysis(null);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPreviewAnalysis(null);
  };

  // Browser Geolocation
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setFieldErrors(prev => ({ ...prev, gps: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setGpsLoading(true);
    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy.gps;
      return copy;
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        setLatitude(lat);
        setLongitude(lng);
        setLocationName((prev) => prev || `GPS Field Coordinates (${lat}° N, ${lng}° E)`);
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setFieldErrors(prev => ({
          ...prev,
          gps: `GPS permission denied or unavailable: ${err.message}. You can still click directly on the map to set location.`,
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Run AI Preview before submission
  const handleAIPreview = async () => {
    if (!description || description.trim().length < 10) {
      setFieldErrors(prev => ({
        ...prev,
        description: 'Provide at least 10 characters of description before requesting AI analysis.',
      }));
      return;
    }

    setIsAnalyzing(true);
    setSubmissionError('');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('evidenceImage', selectedFile);
      }
      formData.append('threatCategory', threatCategory);
      formData.append('userDescription', description);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('locationName', locationName || 'Aravalli Range');

      const res = await previewAnalyzeEvidence(formData);
      if (res.success && res.analysis) {
        setPreviewAnalysis(res.analysis);
      } else {
        setSubmissionError(res.error || 'AI analysis could not be completed.');
      }
    } catch (err) {
      setSubmissionError('AI analysis error: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Validate form client-side before sending
  const validateForm = () => {
    const errors = {};

    if (!description || description.trim().length < 10) {
      errors.description = 'Ground description must be at least 10 characters long.';
    }

    if (!locationName || locationName.trim().length < 2) {
      errors.locationName = 'Please provide a location name, landmark, or village sector.';
    }

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      errors.coordinates = 'Latitude must be a valid number between -90 and 90.';
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      errors.coordinates = 'Longitude must be a valid number between -180 and 180.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmissionError('Please resolve the highlighted validation requirements above before submitting the report: ' + Object.values(errors).join(' '));
      return false;
    }
    return true;
  };

  // Final Report Submission with Progress States
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError('');

    if (!validateForm()) {
      // Scroll to the first error
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep('1/4: Packaging evidence payload & coordinates...');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('evidenceImage', selectedFile);
      }
      formData.append('threatCategory', threatCategory);
      formData.append('description', description.trim());
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('locationName', locationName.trim());
      formData.append('incidentTime', incidentTime);
      if (preZoneId) formData.append('zoneId', preZoneId);

      setSubmissionStep('2/4: Transmitting encrypted evidence to sentinel server...');

      // Small async tick for visual feedback
      await new Promise(r => setTimeout(r, 200));
      setSubmissionStep('3/4: Processing Gemini 2.0 Flash Ecological Analysis & Risk Weights...');

      const res = await submitThreatReport(formData);

      if (res.success && res.report) {
        setSubmissionStep('4/4: Report verified & persisted in immutable store.');
        setSubmissionSuccess(res.report);
      } else {
        setSubmissionError(res.error || 'The server rejected the report submission. Please verify fields and retry.');
      }
    } catch (err) {
      setSubmissionError(`Submission failed: ${err.message}. Please check your connection and retry.`);
    } finally {
      setIsSubmitting(false);
      setSubmissionStep('');
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // --------------------------------------------------------------------------
  // Confirmation Screen (Post-Submission Success)
  // --------------------------------------------------------------------------
  if (submissionSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 border border-emerald-300/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">
              OFFICIAL CASE LOGGED IN SENTINEL DATABASE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              STATUS: PENDING VERIFICATION
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Threat Report Recorded
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Your evidence has been integrated into the Aravalli Risk Engine and queued for Divisional Forest Officer field verification.
          </p>
        </div>

        {/* Case ID Card */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block">OFFICIAL CASE IDENTIFIER</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400 tracking-wider">
                {submissionSuccess.id}
              </span>
            </div>
            <button
              onClick={() => handleCopyId(submissionSuccess.id)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Copy Case ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block">THREAT CATEGORY</span>
              <span className="text-white font-semibold">{submissionSuccess.threatCategory}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">LOCATION</span>
              <span className="text-white truncate block">{submissionSuccess.locationName}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">PRELIMINARY RISK SCORE</span>
              <span className="text-amber-400 font-bold">
                {submissionSuccess.riskAssessment?.score}/100 [{submissionSuccess.riskAssessment?.riskLevel}]
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">CITIZEN PRIVACY</span>
              <span className="text-emerald-400 font-bold">Redacted for Safety</span>
            </div>
          </div>
        </div>

        {/* AI Analysis Snippet */}
        {submissionSuccess.evidenceAnalysis && (
          <div className="max-w-xl mx-auto text-left">
            <AIAnalysisCard analysis={submissionSuccess.evidenceAnalysis} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Track in My Citizen Dashboard</span>
          </Link>
          <Link
            to="/map"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>View on Live Risk Map</span>
          </Link>
          <button
            onClick={() => {
              setSubmissionSuccess(null);
              setDescription('');
              setSelectedFile(null);
              setPreviewUrl(null);
              setPreviewAnalysis(null);
              setFieldErrors({});
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Main Report Ingestion Form
  // --------------------------------------------------------------------------
  return (
    <div ref={formRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
            CITIZEN SENTINEL INGESTION GATEWAY
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Case ID Protocol: ARV-2026-XXXXXX
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Logged as: {user?.name || 'Citizen Sentinel'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Report Suspected Environmental Threat
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload ground photographs and GPS coordinates of illegal mining, hill blasting, deforestation, or encroachment. Evidence is analyzed by Google Gemini AI and forwarded to Forest Authorities.
        </p>
      </div>

      {/* Global Error Banner */}
      {submissionError && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Submission Error</span>
            <span>{submissionError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Evidence Upload & Ground Description (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Threat Category */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center justify-between">
              <span>1. Observed Threat Category</span>
              <span className="text-[10px] text-slate-400 font-normal">Select primary ecological threat</span>
            </label>
            <select
              value={threatCategory}
              onChange={(e) => setThreatCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              {THREAT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Photographic Evidence Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Photographic Evidence</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Max 10MB (JPEG, PNG, WEBP, HEIC)</span>
            </div>

            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
              fieldErrors.file
                ? 'border-rose-500/60 bg-rose-950/20'
                : previewUrl
                ? 'border-emerald-500/50 bg-slate-900'
                : 'border-slate-700 hover:border-emerald-500/60 bg-slate-900/50'
            }`}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {previewUrl ? (
                <div className="space-y-3 relative z-20">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Uploaded Evidence"
                      className="max-h-60 mx-auto rounded-xl object-contain border border-slate-700 shadow-xl"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-110"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono font-semibold">
                    ✓ {selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(0)} KB)
                  </p>
                  <p className="text-[10px] text-slate-400">Click or drag a new image to replace</p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6 text-emerald-400" />
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

            {fieldErrors.file && (
              <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                <span>{fieldErrors.file}</span>
              </p>
            )}
          </div>

          {/* 3. Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-300 font-bold">
                3. Ground Observations & Details <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] font-mono ${description.length < 10 ? 'text-amber-400' : 'text-slate-400'}`}>
                {description.length}/2000 chars (min 10)
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Describe what you observed (e.g. nighttime blasting, presence of heavy earthmovers, registration numbers, tree cutting on ridge slope)..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description && e.target.value.trim().length >= 10) {
                  setFieldErrors(prev => {
                    const c = { ...prev };
                    delete c.description;
                    return c;
                  });
                }
              }}
              className={`w-full bg-slate-900 border rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none leading-relaxed ${
                fieldErrors.description ? 'border-rose-500/80 focus:border-rose-400' : 'border-slate-800 focus:border-emerald-500'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                <span>{fieldErrors.description}</span>
              </p>
            )}
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>4. Field Coordinates & Map Pin</span>
              </label>
              <button
                type="button"
                onClick={handleGetGPS}
                disabled={gpsLoading}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/30 transition-colors disabled:opacity-50"
              >
                <Compass className={`w-3 h-3 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Locating...' : 'Use My GPS'}</span>
              </button>
            </div>

            {/* Interactive Map Picker */}
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-md">
              <MapView
                zones={[]}
                isPickerMode={true}
                pickerLocation={{ lat: latitude, lng: longitude }}
                onLocationPicked={({ lat, lng }) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  setFieldErrors(prev => {
                    const c = { ...prev };
                    delete c.coordinates;
                    return c;
                  });
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

            {fieldErrors.gps && (
              <p className="text-[10px] text-amber-400 font-mono mt-1">
                ℹ️ {fieldErrors.gps}
              </p>
            )}
            {fieldErrors.coordinates && (
              <p className="text-[11px] text-rose-400 font-mono mt-1">
                ⚠️ {fieldErrors.coordinates}
              </p>
            )}
          </div>

          {/* 5. Landmark / Sector Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-300 font-bold">
              5. Landmark / Sector Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Bandhwari Ridge Cut, Tehla Pass, Sariska Buffer Sector 2"
              value={locationName}
              onChange={(e) => {
                setLocationName(e.target.value);
                if (fieldErrors.locationName && e.target.value.trim().length >= 2) {
                  setFieldErrors(prev => {
                    const c = { ...prev };
                    delete c.locationName;
                    return c;
                  });
                }
              }}
              className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none font-medium ${
                fieldErrors.locationName ? 'border-rose-500/80 focus:border-rose-400' : 'border-slate-800 focus:border-emerald-500'
              }`}
            />
            {fieldErrors.locationName && (
              <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                <span>{fieldErrors.locationName}</span>
              </p>
            )}
          </div>

          {/* 6. Incident Time */}
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

          {/* Privacy Protocol Notice */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Citizen Protection Protocol</span>
            </div>
            <p>
              Your personal identity, phone number, and account credentials are <strong>strictly redacted</strong> from public views. Only verified Divisional Forest Officers and Mining Task Force officials can access evidence logs.
            </p>
          </div>

          {/* Inline Error Notice immediately above Submit Button */}
          {submissionError && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-3 shadow-lg animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-300">Action Required Before Submission</p>
                <p className="leading-relaxed">{submissionError}</p>
              </div>
            </div>
          )}

          {/* Submission Progress Bar if Submitting */}
          {isSubmitting && (
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-mono text-emerald-300 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px]">
                <span>Transmitting report...</span>
                <span className="text-slate-400 font-bold">Please wait</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-[10px] text-slate-400">{submissionStep}</p>
            </div>
          )}

          {/* Final Submit Button */}
          <button
            type="submit"
            id="submit-threat-report-btn"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-aravalli-600 hover:from-emerald-500 hover:to-aravalli-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 cursor-pointer"
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
