/**
 * ARAVALLI SENTINEL - Explainable Ecological Risk Engine
 * 
 * Computes an explainable ecological risk score (0-100) using normalized inputs:
 * - Mining risk: 30%
 * - Vegetation loss: 25%
 * - Water stress: 20%
 * - Citizen evidence: 15%
 * - Historical change: 10%
 * 
 * Formula:
 * overallScore = (miningRisk * 0.30) + 
 *                (vegetationLoss * 0.25) + 
 *                (waterStress * 0.20) + 
 *                (citizenEvidence * 0.15) + 
 *                (historicalChange * 0.10)
 */

export const WEIGHTS = {
  miningRisk: 0.30,
  vegetationLoss: 0.25,
  waterStress: 0.20,
  citizenEvidence: 0.15,
  historicalChange: 0.10,
};

export const RISK_LEVELS = {
  SAFE: {
    level: 'SAFE',
    min: 0,
    max: 30,
    color: '#10b981', // Emerald
    label: 'Ecological Equilibrium',
    severity: 'low',
    recommendedAction: 'Continue baseline satellite telemetry and periodic ecological surveys.',
  },
  WATCH: {
    level: 'WATCH',
    min: 31,
    max: 50,
    color: '#f59e0b', // Amber
    label: 'Early Warning',
    severity: 'moderate',
    recommendedAction: 'Deploy drone reconnaissance and schedule joint forest ranger patrol within 7 days.',
  },
  HIGH_RISK: {
    level: 'HIGH RISK',
    min: 51,
    max: 75,
    color: '#f97316', // Orange
    label: 'Elevated Threat',
    severity: 'high',
    recommendedAction: 'Issue formal inspection notice, mobilize field task force, and alert district magistrate.',
  },
  CRITICAL: {
    level: 'CRITICAL',
    min: 76,
    max: 100,
    color: '#ef4444', // Red
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
 * Determines the risk level object given a score between 0 and 100
 */
export function getRiskLevel(score) {
  const rounded = Math.round(Math.max(0, Math.min(100, score)));
  if (rounded <= 30) return RISK_LEVELS.SAFE;
  if (rounded <= 50) return RISK_LEVELS.WATCH;
  if (rounded <= 75) return RISK_LEVELS.HIGH_RISK;
  return RISK_LEVELS.CRITICAL;
}

/**
 * Calculates the comprehensive explainable risk score
 * 
 * @param {Object} factors - { miningRisk, vegetationLoss, waterStress, citizenEvidence, historicalChange }
 * @param {Object} metadata - Optional metadata about data provenance (sources, dates, isDemo)
 * @returns {Object} Comprehensive calculation result with breakdown and explanations
 */
export function calculateRiskScore(factors = {}, metadata = {}) {
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

  // Handle transparent missing data
  const isComplete = missingFactors.length === 0;
  let overallScore = 0;
  const contributions = {};

  if (isComplete) {
    // Standard formula: direct weighted sum
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
    // Proportional re-normalization with explicit transparency
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
    // All missing
    return {
      success: false,
      error: 'Cannot calculate risk score: All input factors are missing or invalid.',
      missingFactors,
    };
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(overallScore * 10) / 10));
  const roundedInt = Math.round(finalScore);
  const riskClassification = getRiskLevel(roundedInt);

  // Identify primary risk driver
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
  RISK_LEVELS,
  validateFactor,
  getRiskLevel,
  calculateRiskScore,
};
