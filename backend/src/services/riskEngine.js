/**
 * ARAVALLI SENTINEL: GOOGLE COMMUNITY CONTEST EDITION
 * riskEngine.js — Deterministic, Explainable Multi-Factor Ecological Risk Engine
 * 
 * Supports both:
 * 1. Six-Factor Ecological Risk Formula (Phase 11 Specification):
 *    Score = 0.25M + 0.20N + 0.15A + 0.15W + 0.15C + 0.10R
 *    - 25% Mining Forensics (M)
 *    - 20% NDVI Loss (N)
 *    - 15% Aquifer Stress (A)
 *    - 15% Weather Hazard (W)
 *    - 15% Evidence Quality & Citizen Credibility (C)
 *    - 10% Sector Recurrence (R)
 * 
 * 2. Five-Factor Backward Compatibility Formula:
 *    Score = 0.30M + 0.25V + 0.20W + 0.15C + 0.10H
 * 
 * Risk Classifications (Phase 11):
 * - CRITICAL: 85–100
 * - HIGH:     70–84.99
 * - MEDIUM:   50–69.99
 * - LOW:      0–49.99
 */

// 5-Factor legacy weights (backward compatibility)
export const WEIGHTS = {
  miningRisk: 0.30,
  vegetationLoss: 0.25,
  waterStress: 0.20,
  citizenEvidence: 0.15,
  historicalChange: 0.10,
};

// 6-Factor Contest Edition weights (Phase 11 specification)
export const SIX_FACTOR_WEIGHTS = {
  miningForensics: 0.25,
  ndviLoss: 0.20,
  aquiferStress: 0.15,
  weatherHazard: 0.15,
  evidenceCredibility: 0.15,
  sectorRecurrence: 0.10,
};

// Phase 11 Risk Classification Bands
export const CONTEST_RISK_BANDS = {
  LOW: {
    level: 'LOW',
    min: 0,
    max: 49.99,
    color: '#2E8B57', // Emerald
    label: 'Low Environmental Impact',
    recommendedAction: 'Continue baseline satellite telemetry and routine periodic monitoring.',
  },
  MEDIUM: {
    level: 'MEDIUM',
    min: 50,
    max: 69.99,
    color: '#D97706', // Amber/Sandstone
    label: 'Moderate Ecological Concern',
    recommendedAction: 'Deploy drone reconnaissance and schedule ranger field inspection within 7 days.',
  },
  HIGH: {
    level: 'HIGH',
    min: 70,
    max: 84.99,
    color: '#EA580C', // Orange
    label: 'High Threat Level',
    recommendedAction: 'Mobilize district task force, issue field inspection notice, and alert district authorities.',
  },
  CRITICAL: {
    level: 'CRITICAL',
    min: 85,
    max: 100,
    color: '#DC2626', // Red
    label: 'Critical Environmental Crime',
    recommendedAction: 'Immediate enforcement raid required. Supreme Court mining ban enforcement and legal FIR filing.',
  },
};

// Legacy risk levels (for backward compatibility with existing tests)
export const RISK_LEVELS = {
  SAFE: {
    level: 'SAFE',
    min: 0,
    max: 30,
    color: '#10b981',
    label: 'Ecological Equilibrium',
    severity: 'low',
    recommendedAction: 'Continue baseline satellite telemetry and periodic ecological surveys.',
  },
  WATCH: {
    level: 'WATCH',
    min: 31,
    max: 50,
    color: '#f59e0b',
    label: 'Early Warning',
    severity: 'moderate',
    recommendedAction: 'Deploy drone reconnaissance and schedule joint forest ranger patrol within 7 days.',
  },
  HIGH_RISK: {
    level: 'HIGH RISK',
    min: 51,
    max: 75,
    color: '#f97316',
    label: 'Elevated Threat',
    severity: 'high',
    recommendedAction: 'Issue formal inspection notice, mobilize field task force, and alert district magistrate.',
  },
  CRITICAL: {
    level: 'CRITICAL',
    min: 76,
    max: 100,
    color: '#ef4444',
    label: 'Imminent Destruction',
    severity: 'critical',
    recommendedAction: 'Immediate enforcement raid required. Supreme Court ban enforcement, machinery seizure, and FIR filing.',
  },
};

/**
 * Validates a single factor value (must be numeric between 0 and 100)
 */
export function validateFactor(value, factorName) {
  if (value === null || value === undefined) {
    return { valid: false, reason: `${factorName} is missing.` };
  }
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, reason: `${factorName} must be a valid number.` };
  }
  if (num < 0 || num > 100) {
    return { valid: false, reason: `${factorName} must be between 0 and 100. Received ${num}.` };
  }
  return { valid: true, value: num };
}

/**
 * Determines risk level for legacy 5-factor engine
 */
export function getRiskLevel(score) {
  const rounded = Math.round(Math.max(0, Math.min(100, score)));
  if (rounded <= 30) return RISK_LEVELS.SAFE;
  if (rounded <= 50) return RISK_LEVELS.WATCH;
  if (rounded <= 75) return RISK_LEVELS.HIGH_RISK;
  return RISK_LEVELS.CRITICAL;
}

/**
 * Determines risk level for Phase 11 Contest 6-Factor bands
 */
export function getContestRiskClassification(score) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  if (s >= 85) return CONTEST_RISK_BANDS.CRITICAL;
  if (s >= 70) return CONTEST_RISK_BANDS.HIGH;
  if (s >= 50) return CONTEST_RISK_BANDS.MEDIUM;
  return CONTEST_RISK_BANDS.LOW;
}

/**
 * Calculates the Phase 11 Explainable Six-Factor Risk Score
 * Formula: Score = 0.25M + 0.20N + 0.15A + 0.15W + 0.15C + 0.10R
 */
export function calculateSixFactorRiskScore(factors = {}, metadata = {}) {
  const factorKeys = ['miningForensics', 'ndviLoss', 'aquiferStress', 'weatherHazard', 'evidenceCredibility', 'sectorRecurrence'];

  // Map from legacy/alternative keys if provided
  const normalizedInputs = {
    miningForensics: factors.miningForensics ?? factors.miningRisk,
    ndviLoss: factors.ndviLoss ?? factors.vegetationLoss,
    aquiferStress: factors.aquiferStress ?? factors.waterStress,
    weatherHazard: factors.weatherHazard ?? factors.weatherStress ?? 25,
    evidenceCredibility: factors.evidenceCredibility ?? factors.citizenEvidence,
    sectorRecurrence: factors.sectorRecurrence ?? factors.historicalChange,
  };

  const validatedFactors = {};
  const missingFactors = [];
  let availableWeightSum = 0;

  for (const key of factorKeys) {
    const rawVal = normalizedInputs[key];
    const validation = validateFactor(rawVal, key);

    if (validation.valid) {
      validatedFactors[key] = validation.value;
      availableWeightSum += SIX_FACTOR_WEIGHTS[key];
    } else {
      missingFactors.push({
        factor: key,
        expectedWeight: SIX_FACTOR_WEIGHTS[key],
        reason: validation.reason,
      });
    }
  }

  const isComplete = missingFactors.length === 0;
  const completenessPercent = Math.round(availableWeightSum * 100);

  if (availableWeightSum === 0) {
    return {
      success: false,
      error: 'Cannot calculate risk score: All six factors are missing.',
      missingFactors,
      dataCompleteness: '0%',
    };
  }

  let overallScore = 0;
  const factorBreakdown = {};

  for (const key of factorKeys) {
    const rawWeight = SIX_FACTOR_WEIGHTS[key];
    if (validatedFactors[key] !== undefined) {
      const val = validatedFactors[key];
      // When data is incomplete, re-normalize across available weight transparently
      const adjustedWeight = rawWeight / availableWeightSum;
      const contribution = Number((val * adjustedWeight).toFixed(2));
      overallScore += contribution;

      factorBreakdown[key] = {
        value: val,
        rawWeight,
        adjustedWeight: Number(adjustedWeight.toFixed(4)),
        weightPercent: `${Math.round(adjustedWeight * 100)}%`,
        contribution,
        status: 'MEASURED',
        explanation: getSixFactorExplanation(key, val),
      };
    } else {
      factorBreakdown[key] = {
        value: null,
        rawWeight,
        adjustedWeight: 0,
        weightPercent: '0% (missing)',
        contribution: 0,
        status: 'DATA_UNAVAILABLE',
        explanation: 'Factor data missing; omitted from proportional calculation.',
      };
    }
  }

  const finalScore = Number(Math.min(100, Math.max(0, overallScore)).toFixed(1));
  const classification = getContestRiskClassification(finalScore);

  return {
    success: true,
    score: finalScore,
    classification: classification.level,
    color: classification.color,
    label: classification.label,
    recommendedAction: classification.recommendedAction,
    formula: 'Score = 0.25M + 0.20N + 0.15A + 0.15W + 0.15C + 0.10R',
    dataCompleteness: `${completenessPercent}%`,
    isComplete,
    missingFactors,
    factors: factorBreakdown,
    confidence: isComplete ? 'HIGH' : (completenessPercent >= 60 ? 'MODERATE' : 'LOW_PROVISIONAL'),
    recommendedHumanReview: finalScore >= 70 || !isComplete,
    statutoryNotice: 'Risk score is an investigative prioritization aid, not a judicial finding of guilt.',
    timestamp: new Date().toISOString(),
  };
}

function getSixFactorExplanation(key, val) {
  if (key === 'miningForensics') {
    if (val >= 75) return 'Active earthmoving machinery, pit excavation, or blasting signatures identified.';
    if (val >= 45) return 'Moderate proximity to known stone crusher hubs or historical quarry leases.';
    return 'Minimal or no mechanical excavation indicators detected.';
  }
  if (key === 'ndviLoss') {
    if (val >= 75) return 'Severe multispectral NDVI drop; significant canopy loss compared to baseline pass.';
    if (val >= 45) return 'Noticeable scrub decline or seasonal moisture stress on hill slopes.';
    return 'Stable vegetative cover consistent with native dry-deciduous Aravalli flora.';
  }
  if (key === 'aquiferStress') {
    if (val >= 75) return 'Severe groundwater table depression and critical recharge zone disturbance.';
    if (val >= 45) return 'Moderate reduction in surface check-dam water storage and nala flow.';
    return 'Stable hydrological balance in local catchment aquifer.';
  }
  if (key === 'weatherHazard') {
    if (val >= 75) return 'High wind speeds generating severe downwind silica dust plumes or intense rain-wash risk.';
    if (val >= 45) return 'Moderate atmospheric conditions with potential for localized dust migration.';
    return 'Calm weather conditions with low particulate dispersal risk.';
  }
  if (key === 'evidenceCredibility') {
    if (val >= 75) return 'High-resolution geotagged imagery corroborated by multiple citizen testimonies.';
    if (val >= 45) return 'Single citizen submission with verified GPS ground coordinates.';
    return 'Preliminary or unverified citizen evidence sample.';
  }
  if (key === 'sectorRecurrence') {
    if (val >= 75) return 'Chronic violation hotspot with repeated historical mining or tree felling alerts.';
    if (val >= 45) return 'Occasional past alerts logged in this forest division.';
    return 'Historically preserved zone with low incidence recurrence.';
  }
  return `Factor evaluated at ${val}/100.`;
}

/**
 * Legacy 5-factor calculateRiskScore preserved for full backward compatibility
 */
export function calculateRiskScore(factors = {}, metadata = {}) {
  // If user passed the 6-factor keys, delegate to 6-factor calculation
  if (factors.miningForensics !== undefined || factors.weatherHazard !== undefined) {
    const res = calculateSixFactorRiskScore(factors, metadata);
    // Format to match legacy expectations if needed
    return {
      ...res,
      riskLevel: res.classification === 'CRITICAL' ? 'CRITICAL' : (res.classification === 'HIGH' ? 'HIGH RISK' : 'WATCH'),
      severity: res.classification.toLowerCase(),
    };
  }

  const factorKeys = ['miningRisk', 'vegetationLoss', 'waterStress', 'citizenEvidence', 'historicalChange'];
  
  const validatedFactors = {};
  const missingFactors = [];
  const errors = [];
  
  let availableWeightSum = 0;

  for (const key of factorKeys) {
    const rawVal = factors[key];
    const validation = validateFactor(rawVal, key);
    
    if (validation.valid) {
      validatedFactors[key] = validation.value;
      availableWeightSum += WEIGHTS[key];
    } else {
      missingFactors.push({
        factor: key,
        expectedWeight: WEIGHTS[key],
        reason: validation.reason,
      });
      errors.push(validation.reason);
    }
  }

  const isComplete = missingFactors.length === 0;
  let overallScore = 0;
  const contributions = {};

  if (isComplete) {
    for (const key of factorKeys) {
      const weight = WEIGHTS[key];
      const val = validatedFactors[key];
      const contribution = Number((val * weight).toFixed(2));
      contributions[key] = {
        value: val,
        weight: weight,
        weightPercent: `${Math.round(weight * 100)}%`,
        contribution: contribution,
        normalizedFactor: Number((val / 100).toFixed(4)),
        explanation: getFactorExplanation(key, val),
      };
      overallScore += contribution;
    }
  } else if (availableWeightSum > 0) {
    for (const key of factorKeys) {
      if (validatedFactors[key] !== undefined) {
        const rawWeight = WEIGHTS[key];
        const adjustedWeight = rawWeight / availableWeightSum;
        const val = validatedFactors[key];
        const contribution = Number((val * adjustedWeight).toFixed(2));
        contributions[key] = {
          value: val,
          weight: Number(adjustedWeight.toFixed(4)),
          rawWeight: rawWeight,
          weightPercent: `${Math.round(adjustedWeight * 100)}% (adjusted)`,
          contribution: contribution,
          normalizedFactor: Number((val / 100).toFixed(4)),
          explanation: getFactorExplanation(key, val),
        };
        overallScore += contribution;
      } else {
        contributions[key] = {
          value: null,
          weight: 0,
          rawWeight: WEIGHTS[key],
          weightPercent: '0% (missing)',
          contribution: 0,
          normalizedFactor: 0,
          explanation: `Factor data unavailable; omitted from proportional calculation.`,
        };
      }
    }
  } else {
    return {
      success: false,
      error: 'Cannot calculate risk score: All input factors are missing or invalid.',
      missingFactors,
    };
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(overallScore * 10) / 10));
  const roundedInt = Math.round(finalScore);
  const riskClassification = getRiskLevel(roundedInt);

  const sortedContributions = Object.entries(contributions)
    .filter(([_, data]) => data.value !== null)
    .sort((a, b) => b[1].contribution - a[1].contribution);

  const primaryDriverKey = sortedContributions.length > 0 ? sortedContributions[0][0] : null;
  const primaryDriver = primaryDriverKey ? {
    factor: primaryDriverKey,
    displayName: formatFactorName(primaryDriverKey),
    contribution: contributions[primaryDriverKey].contribution,
    value: contributions[primaryDriverKey].value,
  } : null;

  return {
    success: true,
    score: finalScore,
    scoreInteger: roundedInt,
    riskLevel: riskClassification.level,
    severity: riskClassification.severity,
    color: riskClassification.color,
    label: riskClassification.label,
    recommendedAction: riskClassification.recommendedAction,
    formula: 'overallScore = miningRisk*0.30 + vegetationLoss*0.25 + waterStress*0.20 + citizenEvidence*0.15 + historicalChange*0.10',
    contributions,
    primaryDriver,
    transparency: {
      isComplete,
      missingFactorsCount: missingFactors.length,
      missingFactors,
      isProvisional: !isComplete || Boolean(metadata.isDemo),
      dataSource: metadata.dataSource || 'Sentinel Remote Sensing & Aravalli Citizen Grid',
      observationDate: metadata.observationDate || new Date().toISOString(),
      coverage: metadata.coverage || 'Aravalli Range Eco-Sensitive Buffer',
      limitations: !isComplete
        ? `Score recalculated across ${Math.round(availableWeightSum * 100)}% available weight. Missing: ${missingFactors.map(m => m.factor).join(', ')}.`
        : (metadata.isDemo ? 'Demonstration baseline dataset - verify against field sensor data.' : 'Validated inputs across all 5 ecological vectors.')
    }
  };
}

function formatFactorName(key) {
  const names = {
    miningRisk: 'Illegal Mining Activity',
    vegetationLoss: 'Vegetation & Canopy Loss',
    waterStress: 'Aquifer & Water Stress',
    citizenEvidence: 'Citizen Threat Reports',
    historicalChange: 'Historical Degradation Trend',
  };
  return names[key] || key;
}

function getFactorExplanation(key, value) {
  if (key === 'miningRisk') {
    if (value >= 70) return 'Severe indicators of heavy machinery, pit expansion, or unauthorized quarrying.';
    if (value >= 40) return 'Moderate proximity to known stone-crushing clusters or historical lease boundaries.';
    return 'Minimal or no illegal excavation signatures detected in recent satellite passes.';
  }
  if (key === 'vegetationLoss') {
    if (value >= 70) return 'Significant NDVI decline and severe forest canopy fragmentation observed.';
    if (value >= 40) return 'Noticeable scrub degradation or seasonal drying across hill slopes.';
    return 'Healthy canopy density consistent with native Dhau (Anogeissus pendula) woodlands.';
  }
  if (key === 'waterStress') {
    if (value >= 70) return 'Critical groundwater table depletion and seasonal drainage basin interruption.';
    if (value >= 40) return 'Moderate reduction in surface water bodies and dry check-dam retention.';
    return 'Stable hydrological balance and natural percolation in hill aquifers.';
  }
  if (key === 'citizenEvidence') {
    if (value >= 70) return 'Dense cluster of corroborating citizen reports submitted within the last 30 days.';
    if (value >= 40) return 'Multiple citizen alerts logged regarding vehicular or tree cutting activities.';
    return 'Low citizen incident reporting volume in this immediate patrol sector.';
  }
  if (key === 'historicalChange') {
    if (value >= 70) return 'Aggressive multi-year transformation from protected ridge to denuded topography.';
    if (value >= 40) return 'Gradual encroachment on foothills over the past 5-10 year satellite timeline.';
    return 'Sustained conservation baseline with negligible historical land-use divergence.';
  }
  return `Factor measured at ${value}/100.`;
}

export default {
  WEIGHTS,
  SIX_FACTOR_WEIGHTS,
  CONTEST_RISK_BANDS,
  RISK_LEVELS,
  validateFactor,
  getRiskLevel,
  getContestRiskClassification,
  calculateRiskScore,
  calculateSixFactorRiskScore,
};
