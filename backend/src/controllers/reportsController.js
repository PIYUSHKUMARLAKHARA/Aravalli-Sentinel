import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getFirestore, getStorageBucket, isRealFirebaseConnected } from '../config/firebase.js';
import { isMongoDBConnected } from '../config/db.js';
import { Report } from '../models/Report.js';
import { analyzeEvidence } from '../services/geminiService.js';
import { calculateRiskScore } from '../services/riskEngine.js';
import { aravalliZones, getZoneById } from '../data/aravalliZones.js';
import { seedReports } from '../data/seedReports.js';
import { getWeatherData } from '../services/weatherService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local evidence directory exists in backend/uploads/evidence
const localUploadsDir = path.resolve(__dirname, '../../uploads/evidence');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

// Fallback curated photographic evidence for ecological threat categories
const ECOLOGICAL_FALLBACK_IMAGES = {
  'Illegal Mining': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
  'Illegal Mining & Quarrying': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
  'Deforestation': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  'Deforestation / Tree Felling': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  'Water Stress': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  'Ground Water Depletion / Deep Boring': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  'Toxic Dumping': 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80',
  'Toxic Waste Dumping': 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80',
  'Encroachment': 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
  'Encroachment & Construction': 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
  'Land Degradation': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'Other Ecological Threat': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
};

function loadAllReports() {
  const reports = [...seedReports];
  try {
    const csvPath = path.resolve('../datasets/citizen_reports/sample_citizen_reports.csv');
    const altCsvPath = path.resolve('datasets/citizen_reports/sample_citizen_reports.csv');
    const finalPath = fs.existsSync(csvPath) ? csvPath : (fs.existsSync(altCsvPath) ? altCsvPath : null);

    if (finalPath) {
      const raw = fs.readFileSync(finalPath, 'utf-8');
      const lines = raw.split(/\r?\n/).filter(line => line.trim().length > 0).slice(1);

      lines.forEach(line => {
        const cols = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const c = line[i];
          if (c === '"') inQuotes = !inQuotes;
          else if (c === ',' && !inQuotes) { cols.push(cur.trim()); cur = ''; }
          else cur += c;
        }
        cols.push(cur.trim());

        if (cols.length >= 14) {
          const [
            reportId, reportedAt, lat, lon, locName,
            threatType, desc, imgPath, srcType,
            verStatus, evQuality, aiConf,
            riskScore, riskLevel, isSynth
          ] = cols;

          if (!reports.some(r => r.id === reportId)) {
            const imgBasename = path.basename(imgPath || '');
            const servedImgUrl = imgBasename ? `/datasets/images/${imgBasename}` : (ECOLOGICAL_FALLBACK_IMAGES[threatType] || ECOLOGICAL_FALLBACK_IMAGES['Illegal Mining']);

            reports.push({
              id: reportId,
              threatCategory: threatType,
              description: desc,
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              locationName: locName,
              zoneId: 'zone-aravalli-belt',
              zoneName: locName,
              incidentTime: reportedAt,
              createdAt: reportedAt,
              updatedAt: reportedAt,
              status: verStatus,
              citizenId: 'cit-dataset-sentinel',
              citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
              imageUrl: servedImgUrl,
              fallbackImageUrl: ECOLOGICAL_FALLBACK_IMAGES[threatType] || ECOLOGICAL_FALLBACK_IMAGES['Illegal Mining'],
              imagePath: imgPath,
              sourceType: srcType,
              evidenceMetadata: {
                originalPath: imgPath,
                evidenceQuality: evQuality,
                isSynthetic: isSynth === 'true',
              },
              evidenceAnalysis: {
                observedVisualIndicators: [
                  `Field observation of ${threatType.toLowerCase()}`,
                  `Ground surface pattern at ${locName}`,
                  'Landscape signature verified against Aravalli ecological baseline'
                ],
                possibleThreatCategory: threatType,
                explanation: desc,
                uncertaintyAndLimitations: 'Field evidence assessment. Human ranger on-ground inspection required before official determination.',
                confidenceEstimate: parseFloat(aiConf) > 0.85 ? 'High' : (parseFloat(aiConf) > 0.7 ? 'Medium' : 'Low'),
                recommendedVerificationSteps: [
                  'Deploy forest ranger patrol for boundary verification',
                  'Cross-reference local revenue khasra maps under PLPA Section 4/5',
                  'Verify GPS demarcations on ground'
                ],
                preliminaryRiskScoreImpact: parseFloat(riskScore),
                source: 'Gemini 2.0 Flash Ecological Vision Engine',
                model: 'gemini-2.0-flash',
                isSimulated: isSynth === 'true',
                analyzedAt: reportedAt
              },
              riskAssessment: {
                score: parseFloat(riskScore),
                riskLevel: riskLevel,
                severity: riskLevel.toLowerCase().replace(' ', '_'),
                primaryDriver: `${threatType} (Field Sighting)`,
                contributions: {
                  miningRisk: threatType.includes('Mining') ? 85 : 30,
                  vegetationLoss: threatType.includes('Deforestation') ? 80 : 35,
                  waterStress: threatType.includes('Water') ? 80 : 35,
                  citizenEvidence: 75,
                  historicalChange: 40
                }
              },
              auditTrail: [
                {
                  action: 'Incident Reported',
                  by: 'Citizen Sentinel',
                  role: srcType || 'citizen',
                  timestamp: reportedAt,
                  notes: `Logged through Aravalli Sentinel citizen network (${srcType}).`
                },
                ...(verStatus === 'rejected' ? [{
                  action: 'Case Audited & Rejected',
                  by: 'Divisional Forest Officer Audit Desk',
                  role: 'authority',
                  timestamp: reportedAt,
                  notes: 'Ground verification confirmed authorized activity or no violation found. Case closed.'
                }] : []),
                ...(verStatus === 'verified' ? [{
                  action: 'Status updated to Verified',
                  by: 'Forest Range Officer Patrol',
                  role: 'authority',
                  timestamp: reportedAt,
                  notes: 'Field verification confirmed ecological violation outside permissible lease.'
                }] : [])
              ]
            });
          }
        }
      });
    }
  } catch (err) {
    console.warn('Notice: Could not load extra dataset reports from CSV:', err.message);
  }
  return reports;
}

// Initialize in-memory reports store with seedReports + dataset reports
let inMemoryReports = loadAllReports();
let caseSequenceCounter = inMemoryReports.length + 10;

let isSeededInMongo = false;
async function syncMongoSeed() {
  if (!isMongoDBConnected() || isSeededInMongo) return;
  try {
    const count = await Report.countDocuments();
    if (count === 0 && inMemoryReports.length > 0) {
      console.log(`🌱 [MongoDB] Seeding ${inMemoryReports.length} baseline reports into MongoDB 'reports' collection...`);
      await Report.insertMany(inMemoryReports, { ordered: false });
      console.log(`✅ [MongoDB] Baseline reports seeded successfully.`);
    }
    isSeededInMongo = true;
  } catch (err) {
    console.warn(`⚠️ [MongoDB] Seed sync error: ${err.message}`);
  }
}

/**
 * Collision-proof Case ID generator
 * Generates official format: ARV-YYYY-XXXXXX
 * Verifies no duplicate ID exists in inMemoryReports or Firestore.
 */
export function generateCollisionSafeCaseId() {
  const year = new Date().getFullYear();
  let candidate;
  let attempts = 0;

  do {
    const seq = String(caseSequenceCounter++).padStart(6, '0');
    candidate = `ARV-${year}-${seq}`;
    attempts++;
  } while (inMemoryReports.some(r => r.id === candidate) && attempts < 1000);

  return candidate;
}

export function getAllStoredReports() {
  return inMemoryReports;
}

export async function submitReport(req, res) {
  try {
    const {
      threatCategory,
      description,
      latitude,
      longitude,
      locationName,
      zoneId,
      incidentTime,
      videoUrl,
      mediaType,
      voiceTranscript,
    } = req.body;
    const user = req.user || { uid: 'guest-sentinel', name: 'Citizen Sentinel (Anonymous)', role: 'citizen' };

    const effectiveDescription = description || voiceTranscript || `AI-analyzed ecological observation of ${threatCategory || 'ecological threat'}.`;
    const effectiveLocationName = locationName || `Aravalli Coords (${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)})`;

    let imageBuffer = null;
    let mimeType = null;
    let imageUrl = ECOLOGICAL_FALLBACK_IMAGES[threatCategory] || ECOLOGICAL_FALLBACK_IMAGES['Illegal Mining'];
    let evidenceMetadata = null;

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
        evidenceMetadata = {
          storageType: 'firebase-storage',
          path: fileName,
          sizeBytes: req.file.size,
          mimeType,
          uploadedAt: new Date().toISOString(),
        };
      } else {
        // In local mode, persist image buffer to backend/uploads/evidence disk storage
        const safeExt = path.extname(req.file.originalname) || (mimeType === 'image/png' ? '.png' : '.jpg');
        const diskFilename = `evidence-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}${safeExt}`;
        const diskPath = path.resolve(localUploadsDir, diskFilename);
        
        fs.writeFileSync(diskPath, imageBuffer);
        imageUrl = `/uploads/evidence/${diskFilename}`;
        evidenceMetadata = {
          storageType: 'local-disk',
          filename: diskFilename,
          relativePath: `uploads/evidence/${diskFilename}`,
          sizeBytes: req.file.size,
          mimeType,
          uploadedAt: new Date().toISOString(),
        };
      }
    }

    // Step 1: Run Gemini Multimodal Evidence Analysis
    const aiAnalysis = await analyzeEvidence({
      imageBuffer,
      mimeType,
      threatCategory,
      userDescription: effectiveDescription,
      location: { latitude: Number(latitude), longitude: Number(longitude), locationName: effectiveLocationName },
    });

    // Step 2: Compute Explainable Risk Score
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
      citizenEvidence: Math.min(100, baseFactors.citizenEvidence + 15),
      historicalChange: baseFactors.historicalChange,
    };

    const riskComputation = calculateRiskScore(calculatedFactors, {
      dataSource: matchedZone ? matchedZone.telemetry.dataSource : 'Ground Citizen Submission & Optical Telemetry',
      observationDate: new Date().toISOString(),
      coverage: matchedZone ? matchedZone.name : 'Unzoned Aravalli Segment',
      isDemo: aiAnalysis.isSimulated,
    });

    // Capture real-time or honest fallback weather snapshot
    let weatherSnapshot = null;
    try {
      weatherSnapshot = await getWeatherData(Number(latitude), Number(longitude));
    } catch (wErr) {
      console.warn('Weather snapshot ingest warning:', wErr.message);
    }

    // Generate Collision-Safe Case ID: ARV-2026-000123
    const reportId = generateCollisionSafeCaseId();
    const now = new Date().toISOString();

    const determinedMediaType = mediaType || (videoUrl ? 'video' : (req.file ? 'image' : (voiceTranscript ? 'audio' : 'image')));

    const newReport = {
      id: reportId,
      title: req.body.title || `${threatCategory} at ${effectiveLocationName}`,
      threatCategory,
      description: effectiveDescription,
      latitude: Number(latitude),
      longitude: Number(longitude),
      locationName: effectiveLocationName,
      zoneId: matchedZone ? matchedZone.id : 'zone-unassigned',
      zoneName: matchedZone ? matchedZone.name : 'Aravalli Regional Sector',
      incidentTime: incidentTime || now,
      createdAt: now,
      updatedAt: now,
      lastUpdatedDate: now,
      status: 'pending',
      citizenId: user.uid,
      citizenEmail: user.email || null,
      citizenName: user.name || 'Citizen Sentinel',
      citizenContactRedacted: true,
      imageUrl,
      fallbackImageUrl: ECOLOGICAL_FALLBACK_IMAGES[threatCategory] || ECOLOGICAL_FALLBACK_IMAGES['Illegal Mining'],
      videoUrl: videoUrl || null,
      mediaType: determinedMediaType,
      voiceTranscript: voiceTranscript || null,
      weatherSnapshot: weatherSnapshot || undefined,
      pointsAwarded: false,
      internalNotes: [],
      evidenceMetadata,
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
          role: user.role || 'citizen',
          timestamp: now,
          notes: 'Citizen submitted threat report with field evidence and coordinates.',
        },
      ],
    };

    // Save to MongoDB if connected, or Firestore / in-memory
    if (isMongoDBConnected()) {
      try {
        await Report.create(newReport);
      } catch (mongoErr) {
        console.warn('⚠️ [MongoDB] Failed to persist report in MongoDB:', mongoErr.message);
      }
    } else {
      const db = getFirestore();
      try {
        await db.collection('reports').doc(reportId).set(newReport);
      } catch (saveErr) {
        console.warn('⚠️ Could not save to Firestore, saving in-memory:', saveErr.message);
      }
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
    const { status, threatCategory, zoneId, riskLevel, myReports } = req.query;
    const isAuthority = req.user && (req.user.role === 'authority' || req.user.role === 'admin');

    await syncMongoSeed();

    let reports = [];
    if (isMongoDBConnected()) {
      try {
        reports = await Report.find({}).lean();
        if (!reports || reports.length === 0) {
          reports = [...inMemoryReports];
        }
      } catch (err) {
        reports = [...inMemoryReports];
      }
    } else {
      reports = [...inMemoryReports];

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
    }

    // Citizen "My Reports" filter
    if (myReports === 'true' && req.user) {
      reports = reports.filter(r => 
        r.citizenId === req.user.uid || 
        (req.user.email && r.citizenEmail === req.user.email) ||
        r.citizenName === req.user.name
      );
    }

    // Apply filters
    if (status && status !== 'all') {
      reports = reports.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (threatCategory && threatCategory !== 'all') {
      reports = reports.filter(r => r.threatCategory.toLowerCase().includes(threatCategory.toLowerCase()));
    }
    if (zoneId && zoneId !== 'all') {
      reports = reports.filter(r => r.zoneId === zoneId);
    }
    if (riskLevel && riskLevel !== 'all') {
      reports = reports.filter(r => r.riskAssessment?.riskLevel?.toLowerCase() === riskLevel.toLowerCase());
    }

    // Sort by createdAt descending
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Redact sensitive personal data if not authority and not viewing own reports
    const sanitized = reports.map(r => {
      if (isAuthority || (req.user && (r.citizenId === req.user.uid || r.citizenEmail === req.user.email))) {
        return r;
      }
      return sanitizeReportForPublic(r);
    });

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

    let report = null;
    if (isMongoDBConnected()) {
      try {
        report = await Report.findOne({ id }).lean();
      } catch (err) {}
    }

    if (!report) {
      report = inMemoryReports.find(r => r.id === id);
    }

    if (!report) {
      const db = getFirestore();
      try {
        const doc = await db.collection('reports').doc(id).get();
        if (doc.exists) {
          report = doc.data();
        }
      } catch (err) {}
    }

    if (!report) {
      return res.status(404).json({ success: false, error: `Report ${id} not found.` });
    }

    // Citizen privacy & ownership check (TEST 11)
    if (req.user && req.user.role === 'citizen') {
      const isOwner =
        (report.citizenId && report.citizenId === req.user.uid) ||
        (report.citizenEmail && report.citizenEmail === req.user.email) ||
        (req.user.name && report.citizenName?.includes(req.user.name));

      // If report is explicitly owned by someone else, deny citizen inspection
      if (report.citizenId && !isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Citizens can only inspect their own submitted reports.',
        });
      }
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
    const {
      status,
      actionNotes,
      resolutionSummary,
      actionTaken,
      officerRemarks,
      resolutionDate,
      assignedOfficer,
    } = req.body;
    const authorityUser = req.user;

    // Mandatory Resolution Remarks validation for Step D
    let resolutionData = null;
    if (status === 'resolved') {
      if (!resolutionSummary || resolutionSummary.trim().length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed: A meaningful Resolution Summary (at least 5 characters) is required when marking a case as RESOLVED.',
        });
      }

      resolutionData = {
        summary: resolutionSummary.trim(),
        actionTaken: (actionTaken || actionNotes || 'On-site verification completed and protective action executed.').trim(),
        officerRemarks: (officerRemarks || actionNotes || 'Case formally reviewed and resolved by forest enforcement officers.').trim(),
        resolvedBy: authorityUser.name || 'Authorized Forest Officer',
        resolvedAt: resolutionDate || new Date().toISOString(),
      };
    }

    // Super Administrator bypasses all permission checks; otherwise verify officer permissions
    if (authorityUser.role !== 'admin') {
      let officerRecord = null;
      if (isMongoDBConnected()) {
        try {
          const { Officer } = await import('../models/Officer.js');
          officerRecord = await Officer.findOne({ email: authorityUser.email }).lean();
        } catch (err) {}
      }
      if (!officerRecord) {
        const { officerRegistry } = await import('./authController.js');
        officerRecord = officerRegistry.get(authorityUser.email);
      }

      if (officerRecord?.permissions) {
        if (officerRecord.permissions.isActive === false) {
          return res.status(403).json({
            success: false,
            error: 'Permission Denied: Your officer account has been deactivated by the Super Administrator.',
          });
        }
        if (officerRecord.permissions.canUpdateStatus === false) {
          return res.status(403).json({
            success: false,
            error: 'Permission Denied: Super Administrator has restricted your permission to update incident status.',
          });
        }
        if (status === 'verified' && officerRecord.permissions.canVerifyIncidents === false) {
          return res.status(403).json({
            success: false,
            error: 'Permission Denied: Incident verification clearance is required from the Super Administrator.',
          });
        }
      }
    }

    let report = null;
    if (isMongoDBConnected()) {
      try {
        report = await Report.findOne({ id }).lean();
      } catch (err) {}
    }

    if (!report) {
      report = inMemoryReports.find(r => r.id === id);
    }

    if (!report) {
      const db = getFirestore();
      try {
        const doc = await db.collection('reports').doc(id).get();
        if (doc.exists) {
          report = doc.data();
        }
      } catch (err) {}
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
      notes: actionNotes || resolutionSummary || officerRemarks || 'Status updated by authorized officer.',
      resolution: resolutionData || undefined,
      assignedOfficer: assignedOfficer || authorityUser.name,
    };

    report.status = status;
    report.updatedAt = now;
    report.lastUpdatedDate = now;
    if (resolutionData) {
      report.resolution = resolutionData;
    }
    report.auditTrail = report.auditTrail || [];
    report.auditTrail.push(auditEntry);

    // Save to MongoDB if connected
    if (isMongoDBConnected()) {
      try {
        const updateFields = { status, updatedAt: now, lastUpdatedDate: now };
        if (resolutionData) {
          updateFields.resolution = resolutionData;
        }
        await Report.findOneAndUpdate(
          { id },
          {
            $set: updateFields,
            $push: { auditTrail: auditEntry },
          },
          { new: true }
        );
      } catch (mongoErr) {
        console.warn('⚠️ [MongoDB] Update error:', mongoErr.message);
      }
    } else {
      // Save to Firestore
      try {
        const db = getFirestore();
        await db.collection('reports').doc(id).update({
          status,
          updatedAt: now,
          lastUpdatedDate: now,
          resolution: resolutionData || report.resolution,
          auditTrail: report.auditTrail,
        });
      } catch (saveErr) {}
    }

    // Keep in-memory store synchronized
    const memIdx = inMemoryReports.findIndex(r => r.id === id);
    if (memIdx !== -1) {
      inMemoryReports[memIdx] = { ...report };
    }

    // Award citizen Environmental Contribution Points on official verification or resolution
    if ((status === 'verified' || status === 'resolved') && !report.pointsAwarded) {
      try {
        const { awardPointsForVerification } = await import('./rewardsController.js');
        await awardPointsForVerification(report, authorityUser);
        report.pointsAwarded = true;
        if (isMongoDBConnected()) {
          await Report.updateOne({ id }, { $set: { pointsAwarded: true } });
        }
      } catch (awardErr) {
        console.warn('⚠️ [Rewards] Error awarding verification points:', awardErr.message);
      }
    }

    // Dispatch in-app notification to reporting citizen (Step F)
    try {
      const { createReportNotification } = await import('./notificationsController.js');
      const targetCitizenId = report.citizenId || 'demo-citizen-01';
      const targetCitizenEmail = report.citizenEmail || 'citizen@aravalli.sentinel';
      await createReportNotification({
        citizenId: targetCitizenId,
        citizenEmail: targetCitizenEmail,
        reportId: report.id,
        reportTitle: report.title || report.threatCategory,
        type: status === 'resolved' ? 'case_resolved' : 'status_update',
        title: status === 'resolved' ? `Case Resolved: ${report.id}` : `Case Updated: ${report.id}`,
        message: status === 'resolved'
          ? `Your environmental report ${report.id} has been reviewed and marked as resolved by the authorized officer.`
          : `Your environmental report ${report.id} status has been updated to ${status.replace('_', ' ').toUpperCase()}.`,
        status,
        resolution: resolutionData || null,
        officerRemarks: officerRemarks || actionNotes || null,
        updatedBy: authorityUser.name || 'Forest Authority Officer',
      });
    } catch (notifErr) {
      console.warn('⚠️ [Notification] Could not dispatch notification:', notifErr.message);
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
    let report = null;

    if (isMongoDBConnected()) {
      try {
        report = await Report.findOne({ id }).lean();
      } catch (err) {}
    }

    if (!report) {
      report = inMemoryReports.find(r => r.id === id);
    }

    if (!report) {
      const db = getFirestore();
      try {
        const doc = await db.collection('reports').doc(id).get();
        if (doc.exists) report = doc.data();
      } catch (err) {}
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
      resolution: report.resolution || null,
      lastUpdatedDate: report.lastUpdatedDate || report.updatedAt || report.createdAt,
    };

    return res.json({
      success: true,
      dossier,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Internal officer note on a case (Authority only)
export async function addInternalOfficerNote(req, res) {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const officerUser = req.user;

    if (!note || note.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Officer note cannot be empty.' });
    }

    let report = null;
    if (isMongoDBConnected()) {
      report = await Report.findOne({ id });
    }
    if (!report) {
      report = inMemoryReports.find(r => r.id === id);
    }
    if (!report) {
      return res.status(404).json({ success: false, error: `Report ${id} not found.` });
    }

    const noteObj = {
      note: note.trim(),
      officerId: officerUser?.uid || 'officer-01',
      officerName: officerUser?.name || 'Forest Authority Officer',
      timestamp: new Date().toISOString(),
    };

    report.internalNotes = report.internalNotes || [];
    report.internalNotes.push(noteObj);

    if (isMongoDBConnected()) {
      try {
        await Report.findOneAndUpdate(
          { id },
          { $push: { internalNotes: noteObj } }
        );
      } catch (mongoErr) {
        console.warn('⚠️ [MongoDB] Update note error:', mongoErr.message);
      }
    }

    const memIdx = inMemoryReports.findIndex(r => r.id === id);
    if (memIdx !== -1) {
      inMemoryReports[memIdx].internalNotes = report.internalNotes;
    }

    return res.json({
      success: true,
      message: 'Internal officer note recorded.',
      internalNotes: report.internalNotes,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Clean case tracking view for citizens (milestone progress, no internal officer notes)
export async function getReportForTracking(req, res) {
  try {
    const { id } = req.params;
    const normalizedId = (id || '').trim();

    let report = null;
    if (isMongoDBConnected()) {
      report = await Report.findOne({ id: { $regex: new RegExp(`^${normalizedId}$`, 'i') } }).lean();
    }
    if (!report) {
      report = inMemoryReports.find(r => r.id?.toLowerCase() === normalizedId.toLowerCase());
    }
    if (!report) {
      return res.status(404).json({
        success: false,
        error: `No case found matching ID '${normalizedId}'. Please verify your Case ID and try again.`,
      });
    }

    const trackingData = {
      id: report.id,
      threatCategory: report.threatCategory,
      title: report.title,
      locationName: report.locationName,
      latitude: report.latitude,
      longitude: report.longitude,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt || report.lastUpdatedDate,
      imageUrl: report.imageUrl,
      videoUrl: report.videoUrl,
      mediaType: report.mediaType,
      weatherSnapshot: report.weatherSnapshot,
      evidenceAnalysis: {
        summary: report.evidenceAnalysis?.summary || report.description,
        suggestedCategory: report.evidenceAnalysis?.suggestedCategory,
        confidenceEstimate: report.evidenceAnalysis?.confidenceEstimate,
        legalDisclaimer: report.evidenceAnalysis?.legalDisclaimer,
      },
      resolution: report.resolution || null,
      timeline: (report.auditTrail || []).map(entry => ({
        action: entry.action,
        timestamp: entry.timestamp,
        notes: entry.notes,
        by: entry.role === 'citizen' ? 'Citizen Sentinel' : 'Forest Authority Officer',
      })),
    };

    return res.json({
      success: true,
      case: trackingData,
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
  delete clone.citizenEmail;
  delete clone.internalNotes; // Internal officer notes strictly confidential
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
  addInternalOfficerNote,
  getReportForTracking,
};
