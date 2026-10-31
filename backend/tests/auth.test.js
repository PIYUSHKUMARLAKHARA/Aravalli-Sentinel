import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerCitizen,
  loginCitizen,
  loginAuthority,
  loginAdmin,
  citizenRegistry,
  officerRegistry,
  SUPER_ADMIN,
  syncBootstrapOfficer,
} from '../src/controllers/authController.js';
import { hashPassword, verifyPassword, signJWT, verifyJWT } from '../src/utils/security.js';

// Mock Express req and res helper
function createMockReqRes(body = {}, headers = {}) {
  const req = {
    body,
    headers,
    user: null,
  };

  let statusCode = 200;
  let responseData = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    getStatusCode() {
      return statusCode;
    },
    getBody() {
      return responseData;
    },
  };

  return { req, res };
}

describe('Aravalli Sentinel — Security & Dual-Portal Authentication Tests', () => {
  beforeEach(async () => {
    await syncBootstrapOfficer();
  });

  it('TEST 1: Password hashing and verification using scrypt and salt', () => {
    const rawPass = 'EarthShield2026!';
    const hashed = hashPassword(rawPass);

    expect(hashed).toContain(':');
    expect(verifyPassword(rawPass, hashed)).toBe(true);
    expect(verifyPassword('WrongPassword!', hashed)).toBe(false);
  });

  it('TEST 2: RFC 7519 JWT Signing and Verification', () => {
    const payload = { uid: 'cit-test-01', email: 'sentinel@aravalli.in', role: 'citizen' };
    const token = signJWT(payload);

    expect(token.split('.').length).toBe(3);
    const decoded = verifyJWT(token);
    expect(decoded.uid).toBe('cit-test-01');
    expect(decoded.role).toBe('citizen');
  });

  it('TEST 3: Citizen registration creates role "citizen" and rejects role spoofing', async () => {
    const testEmail = `cit.test.${Date.now()}@aravalli.org`;
    const { req, res } = createMockReqRes({
      email: testEmail,
      fullName: 'Vigilant Citizen',
      password: 'CitizenPass2026!',
      role: 'officer', // Impostor attempting privilege escalation
    });

    await registerCitizen(req, res);

    expect(res.getStatusCode()).toBe(201);
    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.user.role).toBe('citizen'); // Server strictly forces 'citizen'
    expect(body.user.email).toBe(testEmail);
    expect(body.token).toBeDefined();

    // Verify stored account
    const stored = citizenRegistry.get(testEmail);
    expect(stored).toBeDefined();
    expect(stored.role).toBe('citizen');
  });

  it('TEST 4: Citizen login succeeds with correct credentials', async () => {
    const testEmail = `cit.login.${Date.now()}@aravalli.org`;
    const password = 'StrongPassword2026!';

    // Register citizen
    const { req: regReq, res: regRes } = createMockReqRes({
      email: testEmail,
      fullName: 'Active Sentinel',
      password,
    });
    await registerCitizen(regReq, regRes);

    // Login citizen
    const { req: loginReq, res: loginRes } = createMockReqRes({
      email: testEmail,
      password,
    });
    await loginCitizen(loginReq, loginRes);

    expect(loginRes.getStatusCode()).toBe(200);
    const body = loginRes.getBody();
    expect(body.success).toBe(true);
    expect(body.user.role).toBe('citizen');
    expect(body.token).toBeDefined();
  });

  it('TEST 5: Citizen login rejected with wrong password', async () => {
    const testEmail = `cit.wrong.${Date.now()}@aravalli.org`;
    const { req: regReq, res: regRes } = createMockReqRes({
      email: testEmail,
      fullName: 'Security Tester',
      password: 'CorrectPassword2026!',
    });
    await registerCitizen(regReq, regRes);

    const { req: loginReq, res: loginRes } = createMockReqRes({
      email: testEmail,
      password: 'IncorrectPassword!',
    });
    await loginCitizen(loginReq, loginRes);

    expect(loginRes.getStatusCode()).toBe(401);
    expect(loginRes.getBody().success).toBe(false);
  });

  it('TEST 6: DUAL-PORTAL RESTRICTION — Citizen tries Officer Portal and is REJECTED', async () => {
    const testEmail = `cit.crossportal.${Date.now()}@aravalli.org`;
    const password = 'CitizenPassword2026!';

    // Register citizen
    const { req: regReq, res: regRes } = createMockReqRes({
      email: testEmail,
      fullName: 'Inquisitive Citizen',
      password,
    });
    await registerCitizen(regReq, regRes);

    // Same citizen tries logging into Forest Authority Portal
    const { req: offReq, res: offRes } = createMockReqRes({
      email: testEmail,
      password,
    });
    await loginAuthority(offReq, offRes);

    expect(offRes.getStatusCode()).toBe(403);
    const body = offRes.getBody();
    expect(body.success).toBe(false);
    expect(body.error).toContain('restricted to authorized Forest Authority officers');
  });

  it('TEST 7: Pre-authorized Forest Authority officer logs in successfully', async () => {
    const { req, res } = createMockReqRes({
      email: 'officer.sharma@forest.haryana.gov.in',
      password: 'Officer@Aravalli2026!',
    });

    await loginAuthority(req, res);

    expect(res.getStatusCode()).toBe(200);
    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.user.role).toBe('authority');
    expect(body.token).toBeDefined();
  });

  it('TEST 8: Officer login with incorrect password is rejected', async () => {
    const { req, res } = createMockReqRes({
      email: 'officer.sharma@forest.haryana.gov.in',
      password: 'WrongOfficerPassword!',
    });

    await loginAuthority(req, res);

    expect(res.getStatusCode()).toBe(401);
    expect(res.getBody().success).toBe(false);
  });

  it('TEST 9: Deactivated / Inactive officer login is rejected', async () => {
    const deactivatedEmail = `suspended.officer.${Date.now()}@forest.gov.in`;
    officerRegistry.set(deactivatedEmail, {
      uid: 'suspended-officer-01',
      email: deactivatedEmail,
      password: hashPassword('SuspendedPass2026!'),
      name: 'Suspended Ranger',
      role: 'authority',
      permissions: {
        isActive: false, // Deactivated by Administrator
      },
    });

    const { req, res } = createMockReqRes({
      email: deactivatedEmail,
      password: 'SuspendedPass2026!',
    });

    await loginAuthority(req, res);

    expect(res.getStatusCode()).toBe(403);
    expect(res.getBody().error).toContain('suspended');
  });

  it('TEST 10: Super Administrator login succeeds and enforces single admin model', async () => {
    const { req, res } = createMockReqRes({
      email: SUPER_ADMIN.email,
      password: SUPER_ADMIN.password,
    });

    await loginAdmin(req, res);

    expect(res.getStatusCode()).toBe(200);
    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.user.role).toBe('admin');
  });
});
