import { describe, it, expect } from 'vitest';
import {
  calculateRiskScore,
  validateFactor,
  getRiskLevel,
  WEIGHTS,
} from '../src/services/riskEngine.js';

describe('Aravalli Risk Engine - Unit Tests', () => {
  it('weights should sum to exactly 1.00', () => {
    const totalWeight = Object.values(WEIGHTS).reduce((sum, w) => sum + w, 0);
    expect(Number(totalWeight.toFixed(2))).toBe(1.00);
    expect(WEIGHTS.miningRisk).toBe(0.30);
    expect(WEIGHTS.vegetationLoss).toBe(0.25);
    expect(WEIGHTS.waterStress).toBe(0.20);
    expect(WEIGHTS.citizenEvidence).toBe(0.15);
    expect(WEIGHTS.historicalChange).toBe(0.10);
  });

  it('calculates baseline score accurately using exact formula', () => {
    // 80*0.30 (24) + 60*0.25 (15) + 50*0.20 (10) + 40*0.15 (6) + 30*0.10 (3) = 58.0
    const factors = {
      miningRisk: 80,
      vegetationLoss: 60,
      waterStress: 50,
      citizenEvidence: 40,
      historicalChange: 30,
    };

    const result = calculateRiskScore(factors);

    expect(result.success).toBe(true);
    expect(result.score).toBe(58);
    expect(result.riskLevel).toBe('HIGH RISK');
    expect(result.severity).toBe('high');
    expect(result.primaryDriver.factor).toBe('miningRisk');
    expect(result.primaryDriver.contribution).toBe(24);
  });

  it('correctly maps risk classifications across all bands', () => {
    expect(getRiskLevel(0).level).toBe('SAFE');
    expect(getRiskLevel(30).level).toBe('SAFE');
    expect(getRiskLevel(31).level).toBe('WATCH');
    expect(getRiskLevel(50).level).toBe('WATCH');
    expect(getRiskLevel(51).level).toBe('HIGH RISK');
    expect(getRiskLevel(75).level).toBe('HIGH RISK');
    expect(getRiskLevel(76).level).toBe('CRITICAL');
    expect(getRiskLevel(100).level).toBe('CRITICAL');
  });

  it('validates factor bounds correctly', () => {
    expect(validateFactor(50, 'miningRisk').valid).toBe(true);
    expect(validateFactor(0, 'miningRisk').valid).toBe(true);
    expect(validateFactor(100, 'miningRisk').valid).toBe(true);

    expect(validateFactor(-5, 'miningRisk').valid).toBe(false);
    expect(validateFactor(105, 'miningRisk').valid).toBe(false);
    expect(validateFactor('not_a_number', 'miningRisk').valid).toBe(false);
    expect(validateFactor(null, 'miningRisk').valid).toBe(false);
  });

  it('handles missing factors transparently with re-normalization and limitations notice', () => {
    // Omitting waterStress (weight 0.20). Remaining weights sum to 0.80.
    const partialFactors = {
      miningRisk: 100,
      vegetationLoss: 100,
      waterStress: null,
      citizenEvidence: 100,
      historicalChange: 100,
    };

    const result = calculateRiskScore(partialFactors);

    expect(result.success).toBe(true);
    expect(result.score).toBe(100);
    expect(result.transparency.isComplete).toBe(false);
    expect(result.transparency.missingFactorsCount).toBe(1);
    expect(result.transparency.missingFactors[0].factor).toBe('waterStress');
    expect(result.transparency.limitations).toContain('recalculated across 80% available weight');
  });

  it('identifies primary risk driver and explains contributions', () => {
    const factors = {
      miningRisk: 20,
      vegetationLoss: 95, // Primary driver
      waterStress: 30,
      citizenEvidence: 20,
      historicalChange: 10,
    };

    const result = calculateRiskScore(factors);

    expect(result.primaryDriver.factor).toBe('vegetationLoss');
    expect(result.contributions.vegetationLoss.contribution).toBe(23.75); // 95 * 0.25
    expect(result.contributions.vegetationLoss.explanation).toContain('NDVI decline');
  });
});
