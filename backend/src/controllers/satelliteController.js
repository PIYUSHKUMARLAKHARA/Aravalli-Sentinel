import { getSatelliteAnalysis } from '../services/satelliteService.js';
import { Report } from '../models/Report.js';
import { isMongoDBConnected } from '../config/db.js';
import { seedReports } from '../data/seedReports.js';

export async function getCaseSatelliteAnalysis(req, res) {
  try {
    const { caseId } = req.params;
    let report = null;

    if (isMongoDBConnected()) {
      report = await Report.findOne({ id: caseId });
    }

    if (!report) {
      report = seedReports.find((r) => r.id === caseId);
    }

    const lat = report?.latitude || req.query.lat || 28.3842;
    const lng = report?.longitude || req.query.lng || 77.1436;
    const zoneId = report?.zoneId || req.query.zoneId || 'zone-aravalli-ridge';

    const satellite = await getSatelliteAnalysis({
      latitude: lat,
      longitude: lng,
      zoneId,
      reportId: caseId,
    });

    return res.json({
      success: true,
      caseId,
      satellite,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function runCaseSatelliteComparison(req, res) {
  try {
    const { caseId } = req.params;
    return getCaseSatelliteAnalysis(req, res);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  getCaseSatelliteAnalysis,
  runCaseSatelliteComparison,
};
