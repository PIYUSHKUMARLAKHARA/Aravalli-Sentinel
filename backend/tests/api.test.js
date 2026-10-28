import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Aravalli Sentinel API - Integration Tests', () => {
  it('GET /api/health returns 200 and system operational status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ONLINE');
    expect(res.body.platform).toBe('ARAVALLI SENTINEL');
    expect(res.body.services).toHaveProperty('geminiAI');
    expect(res.body.services).toHaveProperty('firebase');
    expect(res.body.services).toHaveProperty('geospatialTelemetry');
  });

  it('GET /api/zones returns full list of monitored Aravalli zones', async () => {
    const res = await request(app).get('/api/zones');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.zones.length).toBeGreaterThanOrEqual(6);
    expect(res.body.zones[0]).toHaveProperty('score');
    expect(res.body.zones[0]).toHaveProperty('riskLevel');
    expect(res.body.zones[0]).toHaveProperty('contributions');
  });

  it('GET /api/zones/:id returns zone details with telemetry', async () => {
    const res = await request(app).get('/api/zones/zone-bandhwari-01');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.zone.name).toContain('Bandhwari');
    expect(res.body).toHaveProperty('timeSeries');
  });

  it('GET /api/reports lists threat reports', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.reports)).toBe(true);
    expect(res.body.reports.length).toBeGreaterThan(0);
  });

  it('POST /api/reports rejects invalid payload lacking required fields', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({ description: 'Short' }); // Missing threatCategory, coordinates, etc.

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login-demo allows toggling between citizen and authority', async () => {
    const res = await request(app)
      .post('/api/auth/login-demo')
      .send({ role: 'authority' });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('authority');
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/register-authority rejects invalid invite secret', async () => {
    const res = await request(app)
      .post('/api/auth/register-authority')
      .send({
        email: 'fake.officer@domain.com',
        fullName: 'Impostor Officer',
        department: 'Unauthorized',
        designation: 'Infiltrator',
        inviteSecret: 'WrongSecretToken',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid Authority Invitation Secret');
  });

  it('PATCH /api/reports/:id/status rejects unauthorized citizen modification', async () => {
    const res = await request(app)
      .patch('/api/reports/rep-aravalli-2026-001/status')
      .set('Authorization', 'Bearer demo-token-citizen-valid')
      .send({
        status: 'verified',
        actionNotes: 'Trying to verify without authority role',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /api/reports/:id/status allows verified authority to update status', async () => {
    const res = await request(app)
      .patch('/api/reports/rep-aravalli-2026-001/status')
      .set('Authorization', 'Bearer demo-token-authority-valid')
      .send({
        status: 'verified',
        actionNotes: 'Field inspection completed by Forest Ranger. Evidence verified.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.report.status).toBe('verified');
  });

  it('GET /api/zones?state=Gujarat returns Gujarat Aravalli zones', async () => {
    const res = await request(app).get('/api/zones?state=Gujarat');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.zones.length).toBeGreaterThanOrEqual(2);
    expect(res.body.zones.some(z => z.name.includes('Ambaji'))).toBe(true);
    expect(res.body.zones.some(z => z.name.includes('Idar'))).toBe(true);
  });

  it('GET /api/zones?riskLevel=CRITICAL filters zones accurately', async () => {
    const res = await request(app).get('/api/zones?riskLevel=CRITICAL');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.zones.length).toBeGreaterThanOrEqual(1);
    expect(res.body.zones.every(z => z.riskLevel === 'CRITICAL')).toBe(true);
  });

  it('POST /api/zones/recalculate-risk recalculates risk score dynamically', async () => {
    const res = await request(app)
      .post('/api/zones/recalculate-risk')
      .send({
        factors: {
          miningRisk: 90,
          vegetationLoss: 80,
          waterStress: 70,
          citizenEvidence: 60,
          historicalChange: 50,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // 90*0.3 + 80*0.25 + 70*0.2 + 60*0.15 + 50*0.1 = 27 + 20 + 14 + 9 + 5 = 75.0
    expect(res.body.score).toBe(75);
    expect(res.body.riskLevel).toBe('HIGH RISK');
  });

  it('GET /api/reports?threatCategory=Toxic Waste Dumping filters reports', async () => {
    const res = await request(app).get('/api/reports?threatCategory=Toxic%20Waste%20Dumping');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reports.length).toBeGreaterThanOrEqual(1);
    expect(res.body.reports[0].threatCategory).toBe('Toxic Waste Dumping');
  });

  it('GET /api/reports?status=rejected returns audited non-violation reports', async () => {
    const res = await request(app).get('/api/reports?status=rejected');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reports.length).toBeGreaterThanOrEqual(1);
    expect(res.body.reports[0].status).toBe('rejected');
    expect(res.body.reports[0].auditTrail.some(a => a.action.includes('Rejected'))).toBe(true);
  });

  it('GET /api/reports/:id returns single report details', async () => {
    const res = await request(app).get('/api/reports/rep-aravalli-2026-001');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.report.id).toBe('rep-aravalli-2026-001');
    expect(res.body.report).toHaveProperty('evidenceAnalysis');
    expect(res.body.report).toHaveProperty('riskAssessment');
  });

  it('GET /api/reports/:id returns 404 for unknown report ID', async () => {
    const res = await request(app).get('/api/reports/rep-non-existent-999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/reports/:id/incident-dossier returns complete legal dossier', async () => {
    const res = await request(app).get('/api/reports/rep-aravalli-2026-001/incident-dossier');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.dossier).toBeDefined();
    expect(res.body.dossier.dossierId).toContain('DOSSIER-REP-ARAVALLI-2026-001');
    expect(res.body.dossier.incidentSummary.threatCategory).toBe('Illegal Mining & Quarrying');
    expect(res.body.dossier.aiAssessment).toHaveProperty('recommendedHumanActions');
    expect(res.body.dossier.riskScoreBreakdown).toHaveProperty('formula');
  });

  it('GET /api/reports enforces citizen privacy redaction for public callers', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(200);
    expect(res.body.reports.length).toBeGreaterThan(0);
    for (const report of res.body.reports) {
      expect(report.citizenId).toBeUndefined();
      expect(report.citizenContactRedacted).toBe(true);
      expect(report.citizenName).toBe('Anonymous Citizen Sentinel');
    }
  });

  it('POST /api/ai/ask-aravalli answers ecological legal queries', async () => {
    const res = await request(app)
      .post('/api/ai/ask-aravalli')
      .send({ question: 'What is the Supreme Court mandate on Aravalli mining?' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.answer).toBeDefined();
    expect(typeof res.body.answer).toBe('string');
  });

  it('POST /api/ai/analyze-evidence analyzes evidence without persisting', async () => {
    const res = await request(app)
      .post('/api/ai/analyze-evidence')
      .send({
        threatCategory: 'Illegal Mining & Quarrying',
        userDescription: 'Heavy stone crushing plant operating at night without dust barriers.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analysis).toBeDefined();
    expect(res.body.analysis).toHaveProperty('observedVisualIndicators');
    expect(res.body.analysis).toHaveProperty('confidenceEstimate');
  });

  it('PATCH /api/reports/:id/status rejects invalid status enum', async () => {
    const res = await request(app)
      .patch('/api/reports/rep-aravalli-2026-001/status')
      .set('Authorization', 'Bearer demo-token-authority-valid')
      .send({
        status: 'invalid_status_enum',
        actionNotes: 'Testing status schema validation error',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /api/reports/:id/status rejects action notes shorter than 5 characters', async () => {
    const res = await request(app)
      .patch('/api/reports/rep-aravalli-2026-001/status')
      .set('Authorization', 'Bearer demo-token-authority-valid')
      .send({
        status: 'verified',
        actionNotes: 'No', // Shorter than 5 chars
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/reports successfully creates an incident with evidence image', async () => {
    const fakeImageBuffer = Buffer.from('fake-pixel-data');
    const res = await request(app)
      .post('/api/reports')
      .field('threatCategory', 'Illegal Mining & Quarrying')
      .field('description', 'Unauthorized nighttime excavation and blasting spotted near ridge boundary.')
      .field('latitude', '28.3892')
      .field('longitude', '77.1415')
      .field('locationName', 'Bandhwari South Ridge Sector 3')
      .attach('evidenceImage', fakeImageBuffer, {
        filename: 'evidence.jpg',
        contentType: 'image/jpeg',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.report).toBeDefined();
    expect(res.body.report.id).toMatch(/^ARV-\d{4}-\d{6}$/);
    expect(res.body.report.status).toBe('pending');
    expect(res.body.report.evidenceAnalysis).toBeDefined();
    expect(res.body.report.riskAssessment).toBeDefined();
    expect(res.body.report.citizenContactRedacted).toBe(true);
    expect(res.body.report.imageUrl).toContain('/uploads/evidence/');
    expect(res.body.report.evidenceMetadata).toBeDefined();
    expect(res.body.report.evidenceMetadata.storageType).toBe('local-disk');
  });

  it('POST /api/reports rejects out-of-bounds latitude (> 90)', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({
        threatCategory: 'Deforestation / Tree Felling',
        description: 'Chainsaw felling of native Dhau forest trees.',
        latitude: 95.5, // Out of bounds
        longitude: 76.5,
        locationName: 'Sariska Core Boundary',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(JSON.stringify(res.body.details)).toContain('Latitude must be between -90 and 90');
  });

  it('POST /api/reports rejects out-of-bounds longitude (> 180)', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({
        threatCategory: 'Deforestation / Tree Felling',
        description: 'Chainsaw felling of native Dhau forest trees.',
        latitude: 27.5,
        longitude: 195.0, // Out of bounds
        locationName: 'Sariska Core Boundary',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(JSON.stringify(res.body.details)).toContain('Longitude must be between -180 and 180');
  });

  it('POST /api/reports rejects non-numeric coordinate types', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({
        threatCategory: 'Toxic Waste Dumping',
        description: 'Industrial waste dump near rainwater catchment.',
        latitude: 'not-a-coordinate',
        longitude: 77.14,
        locationName: 'Test Area',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/reports rejects unsupported file upload MIME types', async () => {
    const textBuffer = Buffer.from('malicious-or-text-payload');
    const res = await request(app)
      .post('/api/reports')
      .field('threatCategory', 'Illegal Mining & Quarrying')
      .field('description', 'Excavation detected with invalid file attachment.')
      .field('latitude', '28.3892')
      .field('longitude', '77.1415')
      .field('locationName', 'Test Sector')
      .attach('evidenceImage', textBuffer, {
        filename: 'payload.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Unsupported file type');
  });

  it('GET /api/auth/profile rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Authentication required');
  });

  it('GET /api/auth/profile returns verified profile for valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer demo-token-authority-valid');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe('authority');
  });

  it('POST /api/auth/register-citizen registers new citizen account with role strictly citizen', async () => {
    const res = await request(app)
      .post('/api/auth/register-citizen')
      .send({
        email: 'newcitizen@aravalli.community',
        fullName: 'Sunita Sharma',
        password: 'SecurePassword123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('citizen');
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/register-citizen rejects registration missing required email', async () => {
    const res = await request(app)
      .post('/api/auth/register-citizen')
      .send({
        fullName: 'Incomplete User',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/zones/satellite-query queries area of interest and returns observations', async () => {
    const res = await request(app)
      .post('/api/zones/satellite-query')
      .send({
        coordinates: { latitude: 28.3842, longitude: 77.1436 },
        startDate: '2026-06-01',
        endDate: '2026-10-20',
        maxCloudCoverage: 15,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.observations).toBeDefined();
    expect(Array.isArray(res.body.observations)).toBe(true);
    expect(res.body.provenance).toContain('DEMO');
  });

  it('GET /api/zones/:id/satellite-comparison compares baseline and post-monsoon observations', async () => {
    const res = await request(app)
      .get('/api/zones/zone-bandhwari-01/satellite-comparison')
      .query({ baselineDate: '2026-06-15', comparisonDate: '2026-10-18' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.comparison).toBeDefined();
    expect(res.body.comparison.deltaNDVI).toBeDefined();
    expect(res.body.comparison.percentChange).toBeDefined();
  });

  it('GET /api/zones/:id/export-observations returns GeoJSON format', async () => {
    const res = await request(app)
      .get('/api/zones/zone-bandhwari-01/export-observations')
      .query({ format: 'geojson' });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('FeatureCollection');
    expect(Array.isArray(res.body.features)).toBe(true);
  });

  it('GET /api/zones/:id/export-observations returns CSV format', async () => {
    const res = await request(app)
      .get('/api/zones/zone-bandhwari-01/export-observations')
      .query({ format: 'csv' });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('observation_id');
    expect(res.text).toContain('ndvi');
  });

  it('POST /api/auth/login-citizen authenticates valid citizen credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login-citizen')
      .send({ email: 'citizen@aravalli.sentinel', password: 'ValidPassword123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('citizen');
  });

  it('POST /api/auth/reset-password handles password reset requests', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'ranger.sentinel@aravalli.org' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Password reset');
  });

  it('POST /api/zones/problem-statement generates official area-based problem statement', async () => {
    const res = await request(app)
      .post('/api/zones/problem-statement')
      .send({ zoneId: 'zone-bandhwari-01' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.problemStatement).toBeDefined();
    expect(res.body.problemStatement.statementId).toMatch(/^PS-ARV-/);
    expect(res.body.problemStatement.threatBreakdown).toBeDefined();
    expect(Array.isArray(res.body.problemStatement.recommendedPriorities)).toBe(true);
    expect(res.body.problemStatement.dataLimitations).toBeDefined();
  });

  it('GET /api/reports?myReports=true filters reports submitted by authenticated user', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', 'Bearer demo-token-citizen-valid')
      .query({ myReports: 'true' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.reports)).toBe(true);
  });
});
