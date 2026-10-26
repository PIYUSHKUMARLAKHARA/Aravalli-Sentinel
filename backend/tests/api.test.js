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
});
