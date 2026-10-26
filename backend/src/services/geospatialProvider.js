/**
 * ARAVALLI SENTINEL - Modular Geospatial and Environmental Data Provider
 * 
 * Provides an abstract provider interface for satellite and environmental telemetry:
 * 1. SentinelHubSimulatorProvider: High-fidelity baseline data for local/demo operation.
 * 2. EarthEngineProvider: Interface boundary for Google Earth Engine / Copernicus Data Space API.
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
      provenanceNotice: 'Demonstration telemetry calibrated against published regional ecological literature and ISRO Bhuvan land degradation atlases. Connect live Earth Engine or Copernicus credentials in .env for production satellite ingestion.',
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
      // Monsoon bump in Jul-Sep, degradation curve if degraded
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
    };
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
    // In production, instantiate Earth Engine Python/Node wrapper or Copernicus REST API
    throw new Error('Earth Engine Live provider requires active Google Cloud EE service account permissions.');
  }

  async getNDVITimeSeries(zoneId, monthsBack = 6) {
    if (!this.apiKey && !this.serviceAccount) {
      throw new Error('Google Earth Engine credentials not supplied.');
    }
    throw new Error('Earth Engine Live provider requires active Google Cloud EE service account permissions.');
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
