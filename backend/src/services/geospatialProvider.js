/**
 * ARAVALLI SENTINEL - Modular Geospatial and Environmental Data Provider
 * 
 * Provides an abstract provider interface for satellite and environmental telemetry:
 * 1. SentinelHubSimulatorProvider: High-fidelity baseline data for local/demo operation.
 * 2. EarthEngineLiveProvider: Interface boundary for Google Earth Engine / Copernicus Data Space API.
 */

import { aravalliZones, getZoneById } from '../data/aravalliZones.js';
import env from '../config/env.js';

export class BaseGeospatialProvider {
  async getTelemetryForZone(zoneId) {
    throw new Error('Method getTelemetryForZone must be implemented by subclass');
  }

  async getNDVITimeSeries(zoneId, monthsBack = 6) {
    throw new Error('Method getNDVITimeSeries must be implemented by subclass');
  }

  async queryAreaOfInterest({ coordinates, polygon, startDate, endDate, maxCloudCoverage = 20 }) {
    throw new Error('Method queryAreaOfInterest must be implemented by subclass');
  }

  computeNDVI(nir, red) {
    if (nir + red === 0) return 0;
    const val = (nir - red) / (nir + red);
    return Math.max(-1.0, Math.min(1.0, Number(val.toFixed(4))));
  }

  async compareObservations({ baselineDate, comparisonDate, zoneId }) {
    throw new Error('Method compareObservations must be implemented by subclass');
  }

  async exportObservations({ format = 'geojson', zoneId }) {
    throw new Error('Method exportObservations must be implemented by subclass');
  }

  getProviderName() {
    return 'BaseGeospatialProvider';
  }

  isLiveProvider() {
    return false;
  }
}

/**
 * Sentinel Hub & In-Situ Sensor Simulator
 * Clearly labelled as demonstration dataset reflecting documented regional telemetry.
 */
export class SentinelHubSimulatorProvider extends BaseGeospatialProvider {
  getProviderName() {
    return 'Copernicus Sentinel-2 & Landsat-9 Telemetry Simulator (Demonstration Dataset)';
  }

  isLiveProvider() {
    return false;
  }

  async getTelemetryForZone(zoneId) {
    const zone = getZoneById(zoneId);
    if (!zone) {
      throw new Error(`Zone ${zoneId} not found`);
    }

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      provider: this.getProviderName(),
      isLive: false,
      provenanceNotice: 'DEMO — NOT LIVE SATELLITE DATA. Calibrated against published regional ecological literature and ISRO Bhuvan land degradation atlases. Connect live Earth Engine or Copernicus credentials in .env for production satellite ingestion.',
      telemetry: zone.telemetry,
      factors: zone.factors,
      computedRisk: {
        score: zone.score,
        riskLevel: zone.riskLevel,
        severity: zone.severity,
        primaryDriver: zone.primaryDriver,
      },
    };
  }

  async getNDVITimeSeries(zoneId, monthsBack = 6) {
    const zone = getZoneById(zoneId);
    if (!zone) {
      throw new Error(`Zone ${zoneId} not found`);
    }

    const baselineNDVI = zone.telemetry.ndviMean || 0.40;
    const isDegraded = zone.score > 50;
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

    const series = months.map((month, idx) => {
      const seasonalFactor = (idx >= 2 && idx <= 4) ? 0.12 : -0.04;
      const degradationTrend = isDegraded ? - (idx * 0.02) : +(idx * 0.01);
      const ndvi = Math.max(0.05, Math.min(0.85, baselineNDVI + seasonalFactor + degradationTrend));

      return {
        month,
        year: 2026,
        ndvi: Number(ndvi.toFixed(3)),
        status: ndvi < 0.25 ? 'Severe Stress' : (ndvi < 0.45 ? 'Moderate Scrub' : 'Healthy Canopy'),
      };
    });

    return {
      zoneId,
      zoneName: zone.name,
      timeSeries: series,
      sensor: 'Sentinel-2 Multispectral Instrument (MSI) - Band 8 (NIR) & Band 4 (Red)',
      resolution: '10-meter spatial resolution',
      isLive: false,
      provenanceLabel: 'DEMO — NOT LIVE SATELLITE DATA'
    };
  }

  async queryAreaOfInterest({ coordinates, polygon, startDate = '2026-05-01', endDate = '2026-10-25', maxCloudCoverage = 20 }) {
    const lat = coordinates?.latitude || 28.3842;
    const lng = coordinates?.longitude || 77.1436;

    // Simulate 3 multi-temporal satellite passes
    const passes = [
      {
        acquisitionDate: '2026-06-15T05:32:10Z',
        satellite: 'Sentinel-2A MSI L2A',
        cloudCoveragePercent: 4.2,
        bands: { B4_Red: 0.18, B8_NIR: 0.38 },
        ndvi: this.computeNDVI(0.38, 0.18),
        status: 'Processed (Cloud Free)'
      },
      {
        acquisitionDate: '2026-08-20T05:34:22Z',
        satellite: 'Sentinel-2B MSI L2A',
        cloudCoveragePercent: 12.8,
        bands: { B4_Red: 0.14, B8_NIR: 0.46 },
        ndvi: this.computeNDVI(0.46, 0.14),
        status: 'Processed (Monsoon Peak)'
      },
      {
        acquisitionDate: '2026-10-18T05:33:05Z',
        satellite: 'Sentinel-2A MSI L2A',
        cloudCoveragePercent: 2.1,
        bands: { B4_Red: 0.24, B8_NIR: 0.32 },
        ndvi: this.computeNDVI(0.32, 0.24),
        status: 'Processed (Post-Monsoon)'
      }
    ].filter(p => p.cloudCoveragePercent <= maxCloudCoverage);

    return {
      success: true,
      queryParameters: {
        center: { latitude: lat, longitude: lng },
        dateRange: { startDate, endDate },
        maxCloudCoverage
      },
      provenance: 'DEMO — NOT LIVE SATELLITE DATA',
      dataSource: 'Sentinel-2 MSI Surface Reflectance Simulator',
      observationCount: passes.length,
      observations: passes
    };
  }

  async compareObservations({ baselineDate = '2026-06-15', comparisonDate = '2026-10-18', zoneId = 'zone-bandhwari-01' }) {
    const zone = getZoneById(zoneId);
    const baselineNDVI = 0.3571;
    const compNDVI = 0.1429;
    const deltaNDVI = Number((compNDVI - baselineNDVI).toFixed(4));
    const percentChange = Number(((deltaNDVI / baselineNDVI) * 100).toFixed(1));

    return {
      success: true,
      zoneId,
      zoneName: zone ? zone.name : 'Aravalli Monitored Corridor',
      provenance: 'DEMO — NOT LIVE SATELLITE DATA',
      comparison: {
        baseline: { date: baselineDate, sensor: 'Sentinel-2A MSI', ndvi: baselineNDVI },
        current: { date: comparisonDate, sensor: 'Sentinel-2A MSI', ndvi: compNDVI },
        deltaNDVI,
        percentChange: `${percentChange}%`,
        ecologicalInterpretation: percentChange < -20
          ? 'Significant canopy loss detected. Spatial signature indicates mechanical vegetation clearing or quarry encroachment.'
          : 'Normal seasonal fluctuation within expected dry-deciduous parameters.',
        confidence: 'Demonstration Estimate'
      }
    };
  }

  async exportObservations({ format = 'geojson', zoneId = 'zone-bandhwari-01' }) {
    const zone = getZoneById(zoneId);
    const lat = zone ? zone.latitude : 28.3842;
    const lng = zone ? zone.longitude : 77.1436;

    if (format.toLowerCase() === 'csv') {
      const csv = `observation_id,zone_id,acquisition_date,sensor,ndvi,cloud_cover_pct,is_synthetic\n` +
        `OBS-01,${zoneId},2026-06-15,Sentinel-2A,0.3571,4.2,true\n` +
        `OBS-02,${zoneId},2026-08-20,Sentinel-2B,0.5333,12.8,true\n` +
        `OBS-03,${zoneId},2026-10-18,Sentinel-2A,0.1429,2.1,true\n`;
      return { format: 'csv', data: csv, contentType: 'text/csv' };
    }

    const geojson = {
      type: 'FeatureCollection',
      name: `Aravalli_Observations_${zoneId}`,
      provenance: 'DEMO — NOT LIVE SATELLITE DATA',
      features: [
        {
          type: 'Feature',
          properties: {
            observation_id: 'OBS-01',
            zone_id: zoneId,
            acquisition_date: '2026-10-18',
            sensor: 'Sentinel-2A MSI',
            ndvi: 0.1429,
            cloud_cover_pct: 2.1,
            is_synthetic: true
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      ]
    };
    return { format: 'geojson', data: geojson, contentType: 'application/geo+json' };
  }
}

/**
 * Google Earth Engine / Copernicus Live Provider Boundary
 * Ready to hook real satellite service credentials.
 */
export class EarthEngineLiveProvider extends BaseGeospatialProvider {
  constructor(apiKey, serviceAccount) {
    super();
    this.apiKey = apiKey;
    this.serviceAccount = serviceAccount;
  }

  getProviderName() {
    return 'Google Earth Engine & Copernicus Data Space Ecosystem (Live Satellite Ingestion)';
  }

  isLiveProvider() {
    return true;
  }

  async getTelemetryForZone(zoneId) {
    if (!this.apiKey && !this.serviceAccount) {
      throw new Error('Google Earth Engine credentials not supplied in environment configuration.');
    }
    throw new Error('Earth Engine Live provider requires active Google Cloud EE service account permissions.');
  }

  async getNDVITimeSeries(zoneId, monthsBack = 6) {
    if (!this.apiKey && !this.serviceAccount) {
      throw new Error('Google Earth Engine credentials not supplied.');
    }
    throw new Error('Earth Engine Live provider requires active Google Cloud EE service account permissions.');
  }

  async queryAreaOfInterest(params) {
    if (!this.apiKey && !this.serviceAccount) {
      throw new Error('Google Earth Engine credentials not supplied.');
    }
    throw new Error('Earth Engine Live query requires active Google Cloud EE service account permissions.');
  }

  async compareObservations(params) {
    if (!this.apiKey && !this.serviceAccount) {
      throw new Error('Google Earth Engine credentials not supplied.');
    }
    throw new Error('Earth Engine Live compare requires active Google Cloud EE service account permissions.');
  }

  async exportObservations(params) {
    if (!this.apiKey && !this.serviceAccount) {
      throw new Error('Google Earth Engine credentials not supplied.');
    }
    throw new Error('Earth Engine Live export requires active Google Cloud EE service account permissions.');
  }
}

// Factory to resolve active provider based on environment configuration
export function getActiveGeospatialProvider() {
  if (env.ENVIRONMENTAL_DATA_MODE === 'live' && process.env.GEE_SERVICE_ACCOUNT) {
    return new EarthEngineLiveProvider(process.env.GEE_API_KEY, process.env.GEE_SERVICE_ACCOUNT);
  }
  return new SentinelHubSimulatorProvider();
}

export default {
  getActiveGeospatialProvider,
  SentinelHubSimulatorProvider,
  EarthEngineLiveProvider,
};
