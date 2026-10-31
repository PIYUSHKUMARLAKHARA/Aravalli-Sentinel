import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { calculateNDVI } from '../src/services/earthEngineService.js';
import {
  calculateSilicaDustDispersion,
  calculateQuarryRunoff,
  calculateCanopyDryness,
} from '../src/services/weatherNextService.js';
import {
  calculateSixFactorRiskScore,
  SIX_FACTOR_WEIGHTS,
  getContestRiskClassification,
} from '../src/services/riskEngine.js';

describe('Sentinel 2.0 Feature Tests', () => {
  it('calculateNDVI computes NDVI correctly with formula (B8 - B4) / (B8 + B4)', () => {
    // Standard healthy canopy: NIR=0.5, Red=0.1 -> (0.5 - 0.1) / (0.5 + 0.1) = 0.4 / 0.6 = 0.6667
    const ndvi = calculateNDVI(0.5, 0.1);
    expect(ndvi).toBeCloseTo(0.6667, 4);

    // Degraded land: NIR=0.2, Red=0.2 -> 0
    expect(calculateNDVI(0.2, 0.2)).toBe(0);

    // Division by zero safeguard
    expect(calculateNDVI(0, 0)).toBe(0);
  });

  it('calculates 6-factor risk score according to Phase 11 formula', () => {
    const totalWeights = Object.values(SIX_FACTOR_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(Number(totalWeights.toFixed(2))).toBe(1.00);

    // Score = 0.25*100 + 0.20*80 + 0.15*60 + 0.15*40 + 0.15*80 + 0.10*50
    //       = 25 + 16 + 9 + 6 + 12 + 5 = 73.0
    const result = calculateSixFactorRiskScore({
      miningForensics: 100,
      ndviLoss: 80,
      aquiferStress: 60,
      weatherHazard: 40,
      evidenceCredibility: 80,
      sectorRecurrence: 50,
    });

    expect(result.success).toBe(true);
    expect(result.score).toBe(73);
    expect(result.classification).toBe('HIGH');
    expect(result.formula).toContain('0.25M + 0.20N');
    expect(result.isComplete).toBe(true);
  });

  it('correctly maps Phase 11 risk classification thresholds', () => {
    expect(getContestRiskClassification(90).level).toBe('CRITICAL');
    expect(getContestRiskClassification(85).level).toBe('CRITICAL');
    expect(getContestRiskClassification(75).level).toBe('HIGH');
    expect(getContestRiskClassification(70).level).toBe('HIGH');
    expect(getContestRiskClassification(65).level).toBe('MEDIUM');
    expect(getContestRiskClassification(50).level).toBe('MEDIUM');
    expect(getContestRiskClassification(45).level).toBe('LOW');
  });

  it('calculates weather hazard indicators (silica dust, quarry runoff, canopy dryness)', () => {
    const dust = calculateSilicaDustDispersion(25, 270);
    expect(dust.dispersionRisk).toBe('CRITICAL');
    expect(dust.downwindHeading).toBe('W');

    const runoff = calculateQuarryRunoff(85, 40);
    expect(runoff.runoffLevel).toBe('CRITICAL');

    const dryness = calculateCanopyDryness(40, 20);
    expect(dryness.drynessIndex).toBeGreaterThan(60);
  });

  it('authenticates contest evaluator demo accounts (user@aravalli.sentinel & admin@aravalli.sentinel)', async () => {
    // Citizen demo login
    const citRes = await request(app)
      .post('/api/auth/login-citizen')
      .send({ email: 'user@aravalli.sentinel', password: 'Citizen@123' });

    expect(citRes.status).toBe(200);
    expect(citRes.body.success).toBe(true);
    expect(citRes.body.user.role).toBe('citizen');

    // Officer demo login
    const offRes = await request(app)
      .post('/api/auth/login-authority')
      .send({ email: 'admin@aravalli.sentinel', password: 'Admin@Aravalli2026!' });

    expect(offRes.status).toBe(200);
    expect(offRes.body.success).toBe(true);
    expect(['authority', 'admin']).toContain(offRes.body.user.role);
  });

  it('GET /api/weather/current returns atmospheric context', async () => {
    const res = await request(app)
      .get('/api/weather/current?lat=28.38&lng=77.14');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.weather).toBeDefined();
    expect(res.body.weather.coordinates).toBeDefined();
    expect(res.body.weather.temperatureC).toBeDefined();
  });

  it('GET /api/satellite/analysis/:caseId returns honest Sentinel-2 telemetry or configured state', async () => {
    const authRes = await request(app)
      .post('/api/auth/login-demo')
      .send({ role: 'authority' });

    const res = await request(app)
      .get('/api/satellite/analysis/rep-aravalli-2026-001')
      .set('Authorization', `Bearer ${authRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.satellite).toBeDefined();
    expect(res.body.satellite.formula).toContain('B8');
    expect(res.body.satellite.statutoryNotice.toUpperCase()).toContain('FIELD VERIFICATION');
  });

  it('GET /api/reports/track/:id provides citizen case tracking without leaking internal officer notes', async () => {
    const res = await request(app)
      .get('/api/reports/track/rep-aravalli-2026-001');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.case).toBeDefined();
    expect(res.body.case.id).toBe('rep-aravalli-2026-001');
    expect(res.body.case.status).toBeDefined();
    expect(res.body.case.timeline).toBeDefined();
    expect(res.body.case.internalNotes).toBeUndefined(); // Internal notes never leaked
  });

  it('POST /api/ai/draft-voice handles multilingual transcript drafting', async () => {
    const res = await request(app)
      .post('/api/ai/draft-voice')
      .send({
        transcript: 'Yahan par Bandhwari ridge ke paas raat ko illegal excavation aur blasting ho rahi hai.',
        location: { latitude: 28.38, longitude: 77.14, locationName: 'Bandhwari' },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.draft).toBeDefined();
    expect(res.body.draft.threatCategory).toBeDefined();
    expect(res.body.draft.summary).toBeDefined();
  });

  it('GET /api/rewards/wallet returns citizen points wallet with badges & tiers', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login-demo')
      .send({ role: 'citizen' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/rewards/wallet')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.wallet).toBeDefined();
    expect(res.body.wallet.balance).toBeGreaterThanOrEqual(0);
    expect(res.body.wallet.tier).toBeDefined();
    expect(Array.isArray(res.body.wallet.badges)).toBe(true);
  });
});
