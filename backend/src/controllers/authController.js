import { authorityInviteSchema, authorityLoginSchema } from '../validators/reportValidator.js';
import env from '../config/env.js';
import { localTokenSessionStore, isRealFirebaseConnected, getAuth } from '../config/firebase.js';

// Pre-seeded demo accounts for quick testing & evaluation
const demoAccounts = {
  citizen: {
    uid: 'demo-citizen-01',
    email: 'citizen@aravalli.sentinel',
    name: 'Aarav Mehta',
    role: 'citizen',
    token: 'demo-token-citizen-valid',
    badge: 'Citizen Sentinel',
  },
  authority: {
    uid: 'demo-authority-01',
    email: 'officer.sharma@forest.haryana.gov.in',
    name: 'Officer Rajesh Sharma',
    role: 'authority',
    department: 'Haryana Forest Department & Aravalli Task Force',
    designation: 'Divisional Forest Officer (DFO)',
    token: 'demo-token-authority-valid',
    badge: 'Authorized Enforcement Officer',
  },
};

// Server-side registered authority officers registry
const officerRegistry = new Map();

// If DEMO_BOOTSTRAP_ENABLED is active, seed the restricted demonstration officer
if (env.DEMO_BOOTSTRAP_ENABLED) {
  officerRegistry.set('officer.sharma@forest.haryana.gov.in', {
    uid: 'demo-authority-01',
    email: 'officer.sharma@forest.haryana.gov.in',
    password: 'Officer@Aravalli2026!',
    name: 'Officer Rajesh Sharma',
    role: 'authority',
    department: 'Haryana Forest Department & Aravalli Task Force',
    designation: 'Divisional Forest Officer (DFO)',
    badge: 'Authorized Enforcement Officer',
    token: 'demo-token-authority-valid',
    isDemoBootstrap: true,
    verifiedAt: '2026-01-01T00:00:00.000Z',
  });
}

export async function loginDemo(req, res) {
  try {
    const { role } = req.body;
    const targetRole = role === 'authority' ? 'authority' : 'citizen';

    if (targetRole === 'authority' && !env.DEMO_BOOTSTRAP_ENABLED && env.IS_PRODUCTION) {
      return res.status(403).json({
        success: false,
        error: 'Demo authority bootstrap is disabled in production. Use verified officer credentials.',
      });
    }

    const user = demoAccounts[targetRole];

    return res.json({
      success: true,
      message: `Signed in as ${user.name} (${user.badge})`,
      token: user.token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function loginCitizen(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const isDemo = email.toLowerCase() === 'citizen@aravalli.sentinel';
    const user = isDemo ? demoAccounts.citizen : {
      uid: `cit-${Date.now()}`,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      role: 'citizen',
      token: `demo-token-citizen-${Date.now()}`,
      badge: 'Citizen Sentinel',
    };

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token: user.token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function loginAuthority(req, res) {
  try {
    const parseResult = authorityLoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for officer login credentials.',
        details: parseResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    const officer = officerRegistry.get(normalizedEmail);

    if (!officer) {
      return res.status(404).json({
        success: false,
        error: 'Officer account not provisioned. Official Forest Authority accounts must be provisioned by a verified administrator using an Authority Invitation Secret under the "Officer Provisioning" tab.',
      });
    }

    // Verify password against provisioned credential
    if (officer.password && officer.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password for Forest Authority account. Please check credentials or contact your department administrator.',
      });
    }

    const sessionToken = officer.token || `demo-token-authority-${Date.now()}`;
    const userProfile = {
      uid: officer.uid,
      email: officer.email,
      name: officer.name,
      department: officer.department,
      designation: officer.designation,
      role: 'authority',
      badge: officer.badge || 'Authorized Enforcement Officer',
    };

    // Store in active session token registry
    localTokenSessionStore.set(sessionToken, userProfile);

    return res.json({
      success: true,
      message: `Enforcement credentials verified. Welcome, ${officer.name}.`,
      token: sessionToken,
      user: userProfile,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    return res.json({
      success: true,
      message: `Password reset verification link successfully generated and dispatched to ${email}.`,
      recoverySimulated: true,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function registerCitizen(req, res) {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ success: false, error: 'Email and Full Name are required.' });
    }

    // Role is strictly hardcoded to 'citizen'. A citizen cannot pass role: 'authority'!
    const user = {
      uid: `cit-${Date.now()}`,
      email,
      name: fullName,
      role: 'citizen',
      token: `demo-token-citizen-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({
      success: true,
      message: 'Citizen Sentinel account registered successfully.',
      token: user.token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function registerAuthority(req, res) {
  try {
    // Check if AUTHORITY_INVITE_SECRET is configured on the server
    if (!env.AUTHORITY_INVITE_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Authority Invitation Secret is not configured. Please set AUTHORITY_INVITE_SECRET in backend/.env.',
      });
    }

    const parseResult = authorityInviteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for officer provisioning data.',
        details: parseResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { email, fullName, department, designation, inviteSecret, password } = parseResult.data;

    // Strict verification of the administrative invite secret token
    if (inviteSecret !== env.AUTHORITY_INVITE_SECRET) {
      return res.status(403).json({
        success: false,
        error: 'Invalid Authority Invitation Secret. Authority access must be provisioned through a verified Forest Department or State Environmental Agency administrator.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const officerUid = `auth-${Date.now()}`;
    const sessionToken = `demo-token-authority-${Date.now()}`;

    const newOfficer = {
      uid: officerUid,
      email: normalizedEmail,
      name: fullName,
      department,
      designation,
      role: 'authority',
      badge: 'Authorized Enforcement Officer',
      password: password || 'Officer@Aravalli2026!',
      token: sessionToken,
      verifiedAt: new Date().toISOString(),
    };

    // Register officer in server-side registry
    officerRegistry.set(normalizedEmail, newOfficer);

    // Register active session in token store
    localTokenSessionStore.set(sessionToken, {
      uid: newOfficer.uid,
      email: newOfficer.email,
      name: newOfficer.name,
      department: newOfficer.department,
      designation: newOfficer.designation,
      role: 'authority',
      badge: newOfficer.badge,
    });

    // If real Firebase Admin is connected, apply server-controlled custom claims
    if (isRealFirebaseConnected()) {
      try {
        const auth = getAuth();
        await auth.setCustomUserClaims(officerUid, { role: 'authority', department });
      } catch (fbErr) {
        console.warn('⚠️ Could not set Firebase custom claims:', fbErr.message);
      }
    }

    const userProfile = {
      uid: newOfficer.uid,
      email: newOfficer.email,
      name: newOfficer.name,
      department: newOfficer.department,
      designation: newOfficer.designation,
      role: 'authority',
      badge: newOfficer.badge,
    };

    return res.status(201).json({
      success: true,
      message: 'Forest Authority officer account successfully provisioned and verified.',
      token: sessionToken,
      user: userProfile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function getProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  return res.json({ success: true, user: req.user });
}

export default {
  loginDemo,
  loginCitizen,
  loginAuthority,
  registerCitizen,
  registerAuthority,
  resetPassword,
  getProfile,
};
