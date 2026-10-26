import { v4 as uuidv4 } from 'uuid';
import { getFirestore, getStorageBucket, isRealFirebaseConnected } from '../config/firebase.js';
import { analyzeEvidence } from '../services/geminiService.js';
import { calculateRiskScore } from '../services/riskEngine.js';
import { aravalliZones, getZoneById } from '../data/aravalliZones.js';
import { seedReports } from '../data/seedReports.js';

// Initialize in-memory reports store with seedReports
let inMemoryReports = [...seedReports];

export async function submitReport(req, res) {
  try {
    const { threatCategory, description, latitude, longitude, locationName, zoneId, incidentTime } = req.body;
    const user = req.user || { uid: 'guest-sentinel', name: 'Citizen Sentinel (Anonymous)', role: 'citizen' };

    let imageBuffer = null;
    let mimeType = null;
    let imageUrl = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80';

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;

      // In real Firebase mode, upload to Firebase Storage
      if (isRealFirebaseConnected()) {
        const bucket = getStorageBucket();
        const fileName = `evidence/${Date.now()}-${uuidv4()}-${req.file.originalname}`;
        const file = bucket.file(fileName);
        await file.save(imageBuffer, {
          metadata: { contentType: mimeType },
          public: true,
        });
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      } else {
        // In local mode, represent the uploaded image data as base64 data URI
        imageUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
      }
    }

    // Step 1: Run Gemini Multimodal Evidence Analysis
    const aiAnalysis = await analyzeEvidence({
      imageBuffer,
      mimeType,
      threatCategory,
      userDescription: description,
      location: { latitude: Number(latitude), longitude: Number(longitude), locationName },
    });

    // Step 2: Compute Explainable Risk Score
    // Find closest or assigned zone to combine citizen report with zone environmental telemetry
    const matchedZone = zoneId ? getZoneById(zoneId) : findClosestZone(Number(latitude), Number(longitude));
    
    // Baseline factors blended with citizen report impact
    const baseFactors = matchedZone ? matchedZone.factors : {
      miningRisk: 50,
      vegetationLoss: 40,
      waterStress: 40,
      citizenEvidence: 40,
      historicalChange: 35,
    };

    const calculatedFactors = {
      miningRisk: threatCategory.toLowerCase().includes('mining') 
        ? Math.min(100, Math.max(baseFactors.miningRisk, aiAnalysis.preliminaryRiskScoreImpact || 75))
        : baseFactors.miningRisk,
      vegetationLoss: threatCategory.toLowerCase().includes('forest') || threatCategory.toLowerCase().includes('deforest')
        ? Math.min(100, Math.max(baseFactors.vegetationLoss, aiAnalysis.preliminaryRiskScoreImpact || 70))
        : baseFactors.vegetationLoss,
      waterStress: baseFactors.waterStress,
      citizenEvidence: Math.min(100, baseFactors.citizenEvidence + 15), // Corroboration boost
      historicalChange: baseFactors.historicalChange,
    };

    const riskComputation = calculateRiskScore(calculatedFactors, {
      dataSource: matchedZone ? matchedZone.telemetry.dataSource : 'Ground Citizen Submission & Optical Telemetry',
      observationDate: new Date().toISOString(),
      coverage: matchedZone ? matchedZone.name : 'Unzoned Aravalli Segment',
      isDemo: aiAnalysis.isSimulated,
    });

    const reportId = `rep-aravalli-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const newReport = {
      id: reportId,
      threatCategory,
      description,
      latitude: Number(latitude),
      longitude: Number(longitude),
      locationName,
      zoneId: matchedZone ? matchedZone.id : 'zone-unassigned',
      zoneName: matchedZone ? matchedZone.name : 'Aravalli Regional Sector',
      incidentTime: incidentTime || now,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      citizenId: user.uid,
      citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
      citizenContactRedacted: true,
      imageUrl,
      evidenceAnalysis: aiAnalysis,
      riskAssessment: {
        score: riskComputation.score,
        riskLevel: riskComputation.riskLevel,
        severity: riskComputation.severity,
        primaryDriver: riskComputation.primaryDriver ? `${riskComputation.primaryDriver.displayName} (${riskComputation.primaryDriver.contribution} pts)` : 'Multiple Corroborating Signals',
        contributions: calculatedFactors,
      },
      auditTrail: [
        {
          action: 'Report Submitted',
          by: user.name || 'Citizen Sentinel',
          role: user.role,
          timestamp: now,
          notes: 'Citizen submitted threat report with photographic evidence and coordinates.',
        },
      ],
    };

    // Save to Firestore or in-memory
    const db = getFirestore();
    try {
      await db.collection('reports').doc(reportId).set(newReport);
    } catch (saveErr) {
      console.warn('⚠️ Could not save to Firestore, saving in-memory:', saveErr.message);
    }
    inMemoryReports.unshift(newReport);

    return res.status(201).json({
      success: true,
      message: 'Environmental threat report submitted and processed successfully.',
      report: sanitizeReportForPublic(newReport),
    });
  } catch (err) {
    console.error('Error submitting threat report:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process environmental threat report.',
      details: err.message,
    });
  }
}

export async function getAllReports(req, res) {
  try {
    const { status, threatCategory, zoneId, riskLevel } = req.query;
    const isAuthority = req.user && (req.user.role === 'authority' || req.user.role === 'admin');

    let reports = [...inMemoryReports];

    // Try fetching from Firestore if connected
    const db = getFirestore();
    try {
      const snapshot = await db.collection('reports').get();
      if (!snapshot.empty) {
        const firestoreReports = [];
        snapshot.forEach(doc => firestoreReports.push(doc.data()));
        if (firestoreReports.length > 0) {
          // Merge avoiding duplicates
          const ids = new Set(firestoreReports.map(r => r.id));
          reports = [
            ...firestoreReports,
            ...inMemoryReports.filter(r => !ids.has(r.id)),
          ];
        }
      }
    } catch (err) {
      // Continue with inMemoryReports
    }

    // Apply filters
    if (status && status !== 'all') {
      reports = reports.filter(r => r.status === status);
    }
    if (threatCategory && threatCategory !== 'all') {
      reports = reports.filter(r => r.threatCategory === threatCategory);
    }
    if (zoneId && zoneId !== 'all') {
      reports = reports.filter(r => r.zoneId === zoneId);
    }
    if (riskLevel && riskLevel !== 'all') {
      reports = reports.filter(r => r.riskAssessment?.riskLevel === riskLevel);
    }

    // Sort by createdAt descending
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Redact sensitive personal data if not authority
    const sanitized = reports.map(r => (isAuthority ? r : sanitizeReportForPublic(r)));

    return res.json({
      success: true,
      count: sanitized.length,
      reports: sanitized,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getReportById(req, res) {
  try {
    const { id } = req.params;
    const isAuthority = req.user && (req.user.role === 'authority' || req.user.role === 'admin');

    let report = inMemoryReports.find(r => r.id === id);

    if (!report) {
      const db = getFirestore();
      const doc = await db.collection('reports').doc(id).get();
      if (doc.exists) {
        report = doc.data();
      }
    }

    if (!report) {
      return res.status(404).json({ success: false, error: `Report ${id} not found.` });
    }

    return res.json({
      success: true,
      report: isAuthority ? report : sanitizeReportForPublic(report),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, actionNotes, assignedOfficer } = req.body;
    const authorityUser = req.user;

    let report = inMemoryReports.find(r => r.id === id);
    const db = getFirestore();

    if (!report) {
      const doc = await db.collection('reports').doc(id).get();
      if (doc.exists) {
        report = doc.data();
      }
    }

    if (!report) {
      return res.status(404).json({ success: false, error: `Report ${id} not found.` });
    }

    const previousStatus = report.status;
    const now = new Date().toISOString();

    const auditEntry = {
      action: `Status updated from '${previousStatus}' to '${status}'`,
      by: authorityUser.name || 'Environmental Authority Officer',
      email: authorityUser.email,
      role: authorityUser.role,
      timestamp: now,
      notes: actionNotes,
      assignedOfficer: assignedOfficer || authorityUser.name,
    };

    report.status = status;
    report.updatedAt = now;
    report.auditTrail = report.auditTrail || [];
    report.auditTrail.push(auditEntry);

    // Save to Firestore
    try {
      await db.collection('reports').doc(id).update({
        status,
        updatedAt: now,
        auditTrail: report.auditTrail,
      });
    } catch (saveErr) {
      // In-memory updated
    }

    return res.json({
      success: true,
      message: `Report ${id} status successfully updated to ${status}.`,
      report,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateIncidentDossier(req, res) {
  try {
    const { id } = req.params;
    let report = inMemoryReports.find(r => r.id === id);

    if (!report) {
      const db = getFirestore();
      const doc = await db.collection('reports').doc(id).get();
      if (doc.exists) report = doc.data();
    }

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    const dossier = {
      dossierId: `DOSSIER-${report.id.toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      platform: 'ARAVALLI SENTINEL - Ecological Early-Warning & Action Platform',
      tagline: 'See the Threat. Predict the Risk. Protect the Aravallis.',
      incidentSummary: {
        reportId: report.id,
        threatCategory: report.threatCategory,
        currentStatus: report.status.toUpperCase(),
        incidentTimestamp: report.incidentTime,
        reportedTimestamp: report.createdAt,
        location: {
          name: report.locationName,
          coordinates: `${report.latitude.toFixed(5)}°N, ${report.longitude.toFixed(5)}°E`,
          associatedZone: report.zoneName,
        },
        description: report.description,
      },
      aiAssessment: {
        engine: report.evidenceAnalysis?.model || 'Gemini 2.0 Flash Ecological Vision',
        indicators: report.evidenceAnalysis?.observedVisualIndicators || [],
        explanation: report.evidenceAnalysis?.explanation || 'No AI explanation available.',
        limitations: report.evidenceAnalysis?.uncertaintyAndLimitations || 'Visual observation only.',
        confidence: report.evidenceAnalysis?.confidenceEstimate || 'Medium',
        recommendedHumanActions: report.evidenceAnalysis?.recommendedVerificationSteps || [],
        disclaimer: report.evidenceAnalysis?.legalDisclaimer || 'Assessment only. Not an official legal finding.',
      },
      riskScoreBreakdown: {
        overallScore: report.riskAssessment?.score,
        riskLevel: report.riskAssessment?.riskLevel,
        formula: 'overallScore = miningRisk*0.30 + vegetationLoss*0.25 + waterStress*0.20 + citizenEvidence*0.15 + historicalChange*0.10',
        primaryDriver: report.riskAssessment?.primaryDriver,
        factorValues: report.riskAssessment?.contributions,
      },
      enforcementAuditHistory: report.auditTrail || [],
      evidenceThumbnailUrl: report.imageUrl,
    };

    return res.json({
      success: true,
      dossier,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Helpers
function sanitizeReportForPublic(report) {
  const clone = { ...report };
  delete clone.citizenId;
  delete clone.citizenPhone;
  clone.citizenName = 'Anonymous Citizen Sentinel';
  clone.citizenContactRedacted = true;
  return clone;
}

function findClosestZone(lat, lng) {
  let closest = null;
  let minDistance = Infinity;

  for (const zone of aravalliZones) {
    const dLat = zone.coordinates.lat - lat;
    const dLng = zone.coordinates.lng - lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = zone;
    }
  }

  return closest;
}

export default {
  submitReport,
  getAllReports,
  getReportById,
  updateReportStatus,
  generateIncidentDossier,
};
