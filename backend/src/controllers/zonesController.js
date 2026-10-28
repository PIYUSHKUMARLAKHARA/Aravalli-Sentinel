import { aravalliZones, getZoneById } from '../data/aravalliZones.js';
import { calculateRiskScore } from '../services/riskEngine.js';
import { getActiveGeospatialProvider } from '../services/geospatialProvider.js';

export async function getZones(req, res) {
  try {
    const { riskLevel, state } = req.query;

    let zones = [...aravalliZones];

    if (riskLevel && riskLevel !== 'all') {
      zones = zones.filter(z => z.riskLevel.toLowerCase() === riskLevel.toLowerCase());
    }
    if (state && state !== 'all') {
      zones = zones.filter(z => z.state.toLowerCase() === state.toLowerCase());
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
    const zone = getZoneById(id);

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

export default {
  getZones,
  getZoneDetails,
  recalculateRisk,
  querySatellite,
  compareSatellite,
  exportZoneObservations,
};
