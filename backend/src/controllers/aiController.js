import { analyzeEvidence, askAravalliAssistant } from '../services/geminiService.js';
import { aravalliZones } from '../data/aravalliZones.js';
import { seedReports } from '../data/seedReports.js';
import { getFirestore } from '../config/firebase.js';

export async function analyzeUploadedEvidence(req, res) {
  try {
    const { threatCategory, userDescription } = req.body;
    let imageBuffer = null;
    let mimeType = null;

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    }

    const analysis = await analyzeEvidence({
      imageBuffer,
      mimeType,
      threatCategory: threatCategory || 'Illegal Mining & Quarrying',
      userDescription: userDescription || 'Field photographic sample submitted for preliminary review.',
      location: null,
    });

    return res.json({
      success: true,
      analysis,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function askAssistant(req, res) {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Question is required.' });
    }

    // Ground context from available zones and reports
    let reports = [...seedReports];
    try {
      const db = getFirestore();
      const snap = await db.collection('reports').get();
      if (!snap.empty) {
        reports = [];
        snap.forEach(d => reports.push(d.data()));
      }
    } catch (e) {
      // Use seedReports
    }

    const contextData = {
      zones: aravalliZones,
      reports,
    };

    const userRole = req.user?.role || 'citizen';

    const response = await askAravalliAssistant({
      question,
      contextData,
      userRole,
    });

    return res.json({
      success: true,
      ...response,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  analyzeUploadedEvidence,
  askAssistant,
};
