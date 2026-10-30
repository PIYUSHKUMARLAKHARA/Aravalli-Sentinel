import { aravalliZones, getZoneById } from '../data/aravalliZones.js';
import { calculateRiskScore } from '../services/riskEngine.js';
import { getActiveGeospatialProvider } from '../services/geospatialProvider.js';
import { getAllStoredReports } from './reportsController.js';
import { isMongoDBConnected } from '../config/db.js';
import { Zone } from '../models/Zone.js';

let isZonesSeededInMongo = false;
async function syncMongoZones() {
  if (!isMongoDBConnected() || isZonesSeededInMongo) return;
  try {
    const count = await Zone.countDocuments();
    if (count === 0 && aravalliZones.length > 0) {
      await Zone.insertMany(aravalliZones, { ordered: false });
      console.log(`✅ [MongoDB] Seeded ${aravalliZones.length} ecological zones into MongoDB.`);
    }
    isZonesSeededInMongo = true;
  } catch (err) {
    console.warn('⚠️ [MongoDB] Zone seed sync notice:', err.message);
  }
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getZones(req, res) {
  try {
    const { riskLevel, state } = req.query;

    await syncMongoZones();

    let zones = [];
    if (isMongoDBConnected()) {
      try {
        const query = {};
        if (riskLevel && riskLevel !== 'all') {
          query.riskLevel = new RegExp(`^${riskLevel}$`, 'i');
        }
        if (state && state !== 'all') {
          query.state = new RegExp(`^${state}$`, 'i');
        }
        zones = await Zone.find(query).lean();
        if (!zones || zones.length === 0) {
          zones = [...aravalliZones];
        }
      } catch (err) {
        zones = [...aravalliZones];
      }
    } else {
      zones = [...aravalliZones];
    }

    if (!isMongoDBConnected()) {
      if (riskLevel && riskLevel !== 'all') {
        zones = zones.filter(z => z.riskLevel.toLowerCase() === riskLevel.toLowerCase());
      }
      if (state && state !== 'all') {
        zones = zones.filter(z => z.state.toLowerCase() === state.toLowerCase());
      }
    }

    return res.json({
      success: true,
      count: zones.length,
      zones,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getZoneDetails(req, res) {
  try {
    const { id } = req.params;
    let zone = null;

    if (isMongoDBConnected()) {
      try {
        zone = await Zone.findOne({ id }).lean();
      } catch (err) {}
    }

    if (!zone) {
      zone = getZoneById(id);
    }

    if (!zone) {
      return res.status(404).json({ success: false, error: `Zone ${id} not found.` });
    }

    const provider = getActiveGeospatialProvider();
    const timeSeries = await provider.getNDVITimeSeries(zone.id);

    return res.json({
      success: true,
      zone,
      timeSeries,
      geospatialProvider: {
        name: provider.getProviderName(),
        isLive: provider.isLiveProvider(),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function recalculateRisk(req, res) {
  try {
    const { factors, metadata } = req.body;
    const result = calculateRiskScore(factors, metadata);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function querySatellite(req, res) {
  try {
    const provider = getActiveGeospatialProvider();
    const result = await provider.queryAreaOfInterest(req.body || {});
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function compareSatellite(req, res) {
  try {
    const { id } = req.params;
    const { baselineDate, comparisonDate } = req.query;
    const provider = getActiveGeospatialProvider();
    const result = await provider.compareObservations({
      zoneId: id,
      baselineDate,
      comparisonDate
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportZoneObservations(req, res) {
  try {
    const { id } = req.params;
    const { format = 'geojson' } = req.query;
    const provider = getActiveGeospatialProvider();
    const exportResult = await provider.exportObservations({ format, zoneId: id });
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=observations_${id}.csv`);
      return res.send(exportResult.data);
    }
    return res.json(exportResult.data);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateProblemStatement(req, res) {
  try {
    const { zoneId, district, state, lat, lng, radiusKm = 25 } = req.body || {};
    const allReports = getAllStoredReports();

    let matchedReports = [...allReports];
    let selectedAreaName = 'Aravalli Range (All Sectors)';
    let selectedCoordinates = null;

    if (zoneId && zoneId !== 'all') {
      const zone = getZoneById(zoneId);
      if (zone) {
        selectedAreaName = `${zone.name} (${zone.stateDistrict})`;
        selectedCoordinates = zone.coordinates;
        matchedReports = allReports.filter(r => 
          r.zoneId === zone.id || 
          (r.locationName && r.locationName.toLowerCase().includes(zone.name.toLowerCase().split(' ')[0])) ||
          (zone.coordinates && calculateDistanceKm(r.latitude, r.longitude, zone.coordinates.lat, zone.coordinates.lng) <= 30)
        );
      }
    } else if (lat && lng) {
      selectedAreaName = `Custom Coordinate Radius (${radiusKm} km from ${lat}° N, ${lng}° E)`;
      selectedCoordinates = { lat: Number(lat), lng: Number(lng) };
      matchedReports = allReports.filter(r => 
        calculateDistanceKm(r.latitude, r.longitude, Number(lat), Number(lng)) <= Number(radiusKm)
      );
    } else if (district) {
      selectedAreaName = `${district} Forest Division`;
      matchedReports = allReports.filter(r => 
        (r.locationName && r.locationName.toLowerCase().includes(district.toLowerCase())) ||
        (r.zoneName && r.zoneName.toLowerCase().includes(district.toLowerCase()))
      );
    } else if (state && state !== 'all') {
      selectedAreaName = `${state} Ecological Segment`;
      matchedReports = allReports.filter(r => 
        (r.locationName && r.locationName.toLowerCase().includes(state.toLowerCase()))
      );
    }

    // Threat category distribution
    const threatCounts = {};
    matchedReports.forEach(r => {
      const cat = r.threatCategory || 'Other';
      threatCounts[cat] = (threatCounts[cat] || 0) + 1;
    });

    const threatFrequency = Object.entries(threatCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / (matchedReports.length || 1)) * 100),
    })).sort((a, b) => b.count - a.count);

    // Risk level counts
    let criticalCount = 0;
    let highRiskCount = 0;
    let watchCount = 0;
    let safeCount = 0;

    matchedReports.forEach(r => {
      const score = r.riskAssessment?.score || r.riskScore || 50;
      if (score >= 76) criticalCount++;
      else if (score >= 51) highRiskCount++;
      else if (score >= 31) watchCount++;
      else safeCount++;
    });

    // Time window
    const timestamps = matchedReports
      .map(r => new Date(r.createdAt || r.incidentTime).getTime())
      .filter(t => !isNaN(t));

    const earliest = timestamps.length ? new Date(Math.min(...timestamps)).toISOString().split('T')[0] : 'N/A';
    const latest = timestamps.length ? new Date(Math.max(...timestamps)).toISOString().split('T')[0] : 'N/A';

    // Top representative cases
    const representativeCases = [...matchedReports]
      .sort((a, b) => (b.riskAssessment?.score || 0) - (a.riskAssessment?.score || 0))
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        threatCategory: r.threatCategory,
        riskScore: r.riskAssessment?.score || 50,
        riskLevel: r.riskAssessment?.riskLevel || 'HIGH RISK',
        locationName: r.locationName,
        coordinates: `${r.latitude}° N, ${r.longitude}° E`,
        imageUrl: r.imageUrl,
        createdAt: r.createdAt,
      }));

    const topThreat = threatFrequency[0]?.category || 'Unclassified Threat';

    const problemStatement = {
      statementId: `PS-ARV-${Date.now().toString().slice(-6)}`,
      selectedArea: selectedAreaName,
      coordinates: selectedCoordinates,
      totalReports: matchedReports.length,
      timePeriodCovered: {
        from: earliest,
        to: latest,
      },
      topThreatCategory: topThreat,
      threatBreakdown: threatFrequency,
      riskDistribution: {
        critical: criticalCount,
        highRisk: highRiskCount,
        watch: watchCount,
        safe: safeCount,
      },
      recentTrend: matchedReports.length >= 3
        ? `Recurrent clustering of ${topThreat.toLowerCase()} observed across notified forest tracts, with ${criticalCount} active critical emergency escalations requiring immediate enforcement.`
        : 'Sparsely distributed early-warning signals detected. Increased sensor coverage advised.',
      recommendedPriorities: [
        `Deploy joint DGPS demarcation patrol immediately across ${selectedAreaName} to inspect suspected ${topThreat.toLowerCase()}.`,
        'Cross-reference disputed khasra numbers against Rajasthan/Haryana State Forest Registry under PLPA Section 4/5.',
        'Enforce Supreme Court directives (M.C. Mehta v. Union of India) restricting heavy machinery transit inside notified buffer zones.',
        'Issue formal show-cause notices for unpermitted commercial excavations identified in representative case dossiers.',
      ],
      dataLimitations: 'Geospatial problem statement is generated through an explainable multi-signal fusion of citizen ground photographs, Sentinel-2 multi-spectral NDVI baseline deltas, and Gemini 2.0 Flash preliminary screening. Field inspection by a certified Forest Range Officer is mandatory prior to legal confiscation or penal prosecution.',
      representativeCases,
      generatedAt: new Date().toISOString(),
      officer: req.user ? { name: req.user.name, role: req.user.role } : { name: 'Divisional Enforcement Desk', role: 'authority' },
    };

    return res.json({
      success: true,
      problemStatement,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  getZones,
  getZoneDetails,
  recalculateRisk,
  querySatellite,
  compareSatellite,
  exportZoneObservations,
  generateProblemStatement,
};
