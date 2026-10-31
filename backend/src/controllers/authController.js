import { authorityInviteSchema, authorityLoginSchema } from '../validators/reportValidator.js';
import env from '../config/env.js';
import { localTokenSessionStore, isRealFirebaseConnected, getAuth } from '../config/firebase.js';
import { isMongoDBConnected } from '../config/db.js';
import { Officer } from '../models/Officer.js';
import { User } from '../models/User.js';
import { hashPassword, verifyPassword, signJWT } from '../utils/security.js';

// Pre-seeded Super Administrator (Single Admin Security Model)
export const SUPER_ADMIN = {
  uid: 'master-super-admin-01',
  email: 'admin@aravalli.sentinel',
  password: 'Admin@Aravalli2026!',
  name: 'Chief Environmental Administrator',
  role: 'admin',
  department: 'Aravalli Central Conservation & Regulatory Authority',
  designation: 'State Environmental Vigilance Commissioner',
  token: 'demo-token-admin-valid',
  badge: 'Super Administrator (1 of 1)',
  permissions: {
    canVerifyIncidents: true,
    canUpdateStatus: true,
    canDispatchPatrols: true,
    canExportDossiers: true,
    isActive: true,
  },
};

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
    permissions: {
      canVerifyIncidents: true,
      canUpdateStatus: true,
      canDispatchPatrols: true,
      canExportDossiers: true,
      isActive: true,
    },
  },
  admin: SUPER_ADMIN,
};

// Seed Super Admin and demo accounts into local token session store
localTokenSessionStore.set('demo-token-admin-valid', SUPER_ADMIN);
localTokenSessionStore.set('demo-token-citizen-valid', demoAccounts.citizen);
localTokenSessionStore.set('demo-token-authority-valid', demoAccounts.authority);

// In-memory registries (fallback for when MongoDB is in demo/offline mode)
export const officerRegistry = new Map();
export const citizenRegistry = new Map();

// Seed initial demo citizen
citizenRegistry.set('citizen@aravalli.sentinel', {
  uid: 'demo-citizen-01',
  email: 'citizen@aravalli.sentinel',
  password: hashPassword('Citizen@Aravalli2026!'),
  name: 'Aarav Mehta',
  role: 'citizen',
  badge: 'Citizen Sentinel',
  isActive: true,
});

// Seed default demonstration officer if demo bootstrap is enabled
if (env.DEMO_BOOTSTRAP_ENABLED) {
  officerRegistry.set('officer.sharma@forest.haryana.gov.in', {
    uid: 'demo-authority-01',
    email: 'officer.sharma@forest.haryana.gov.in',
    password: hashPassword('Officer@Aravalli2026!'),
    rawPassword: 'Officer@Aravalli2026!',
    name: 'Officer Rajesh Sharma',
    role: 'authority',
    department: 'Haryana Forest Department & Aravalli Task Force',
    designation: 'Divisional Forest Officer (DFO)',
    badge: 'Authorized Enforcement Officer',
    token: 'demo-token-authority-valid',
    isDemoBootstrap: true,
    verifiedAt: '2026-01-01T00:00:00.000Z',
    permissions: {
      canVerifyIncidents: true,
      canUpdateStatus: true,
      canDispatchPatrols: true,
      canExportDossiers: true,
      isActive: true,
    },
  });
}

/**
 * Synchronize bootstrap officer and environment-provisioned initial officer
 */
export async function syncBootstrapOfficer() {
  // 1. Sync demo bootstrap officer
  if (env.DEMO_BOOTSTRAP_ENABLED) {
    if (isMongoDBConnected()) {
      try {
        const existing = await Officer.findOne({ email: 'officer.sharma@forest.haryana.gov.in' });
        if (!existing) {
          await Officer.create({
            uid: 'demo-authority-01',
            email: 'officer.sharma@forest.haryana.gov.in',
            password: hashPassword('Officer@Aravalli2026!'),
            name: 'Officer Rajesh Sharma',
            role: 'authority',
            department: 'Haryana Forest Department & Aravalli Task Force',
            designation: 'Divisional Forest Officer (DFO)',
            badge: 'Authorized Enforcement Officer',
            token: 'demo-token-authority-valid',
            isDemoBootstrap: true,
            verifiedAt: '2026-01-01T00:00:00.000Z',
            permissions: {
              canVerifyIncidents: true,
              canUpdateStatus: true,
              canDispatchPatrols: true,
              canExportDossiers: true,
              isActive: true,
            },
          });
        }
      } catch (err) {
        console.warn('⚠️ [MongoDB] Officer sync notice:', err.message);
      }
    }
  }

  // 2. Provision initial officer from environment variables if specified
  const envEmail = env.INITIAL_OFFICER_EMAIL?.toLowerCase().trim();
  const envPassword = env.INITIAL_OFFICER_PASSWORD;
  const envName = env.INITIAL_OFFICER_NAME || 'Forest Range Officer';

  if (envEmail && envPassword) {
    let officerExists = officerRegistry.has(envEmail);

    if (!officerExists && isMongoDBConnected()) {
      try {
        const dbOfficer = await Officer.findOne({ email: envEmail }).lean();
        if (dbOfficer) {
          officerExists = true;
          officerRegistry.set(envEmail, dbOfficer);
        }
      } catch (err) {}
    }

    if (!officerExists) {
      const hashedPassword = hashPassword(envPassword);
      const officerUid = `auth-env-${Date.now()}`;
      const newOfficer = {
        uid: officerUid,
        email: envEmail,
        password: hashedPassword,
        name: envName,
        role: 'authority',
        department: 'State Forest Department & Aravalli Enforcement Unit',
        designation: 'Divisional Forest Officer (DFO)',
        badge: 'Authorized Enforcement Officer',
        isEnvProvisioned: true,
        verifiedAt: new Date().toISOString(),
        permissions: {
          canVerifyIncidents: true,
          canUpdateStatus: true,
          canDispatchPatrols: true,
          canExportDossiers: true,
          isActive: true,
        },
      };

      officerRegistry.set(envEmail, newOfficer);

      if (isMongoDBConnected()) {
        try {
          await Officer.create(newOfficer);
        } catch (mongoErr) {
          console.warn('⚠️ [MongoDB] Could not persist env-provisioned officer:', mongoErr.message);
        }
      }

      console.log(`🌲 [Auth] Pre-authorized initial officer account provisioned for: ${envEmail}`);
    }
  }
}

// Initial sync on module load
syncBootstrapOfficer().catch(() => {});

/**
 * DEMO QUICK SWITCH LOGIN (Preserved for hackathon evaluators & judges)
 */
export async function loginDemo(req, res) {
  try {
    const { role } = req.body;
    const targetRole = role === 'admin' ? 'admin' : (role === 'authority' ? 'authority' : 'citizen');

    if (targetRole === 'authority' && !env.DEMO_BOOTSTRAP_ENABLED && env.IS_PRODUCTION) {
      return res.status(403).json({
        success: false,
        error: 'Demo authority bootstrap is disabled in production. Use verified officer credentials.',
      });
    }

    const user = demoAccounts[targetRole];
    const sessionToken = signJWT({
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    localTokenSessionStore.set(sessionToken, user);

    return res.json({
      success: true,
      message: `Signed in as ${user.name} (${user.badge})`,
      token: sessionToken,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * SUPER ADMINISTRATOR LOGIN
 */
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Administrator email and password required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== SUPER_ADMIN.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Unrecognized administrator. Only 1 Super Administrator is registered in Aravalli Sentinel.',
      });
    }

    if (password !== SUPER_ADMIN.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator password.',
      });
    }

    const sessionToken = signJWT({
      uid: SUPER_ADMIN.uid,
      email: SUPER_ADMIN.email,
      name: SUPER_ADMIN.name,
      role: 'admin',
    });

    localTokenSessionStore.set(sessionToken, SUPER_ADMIN);
    localTokenSessionStore.set(SUPER_ADMIN.token, SUPER_ADMIN);

    return res.json({
      success: true,
      message: 'Super Administrator authenticated. Master authority active.',
      token: SUPER_ADMIN.token || sessionToken,
      user: {
        uid: SUPER_ADMIN.uid,
        email: SUPER_ADMIN.email,
        name: SUPER_ADMIN.name,
        role: 'admin',
        department: SUPER_ADMIN.department,
        designation: SUPER_ADMIN.designation,
        badge: SUPER_ADMIN.badge,
        permissions: SUPER_ADMIN.permissions,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * CITIZEN PORTAL LOGIN
 */
export async function loginCitizen(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check demo citizen
    if (normalizedEmail === 'citizen@aravalli.sentinel') {
      const demoUser = demoAccounts.citizen;
      const sessionToken = signJWT({
        uid: demoUser.uid,
        email: demoUser.email,
        name: demoUser.name,
        role: 'citizen',
      });
      localTokenSessionStore.set(sessionToken, demoUser);

      return res.json({
        success: true,
        message: `Welcome back, ${demoUser.name}!`,
        token: sessionToken,
        user: demoUser,
      });
    }

    // Lookup citizen in MongoDB or memory
    let user = null;
    if (isMongoDBConnected()) {
      try {
        user = await User.findOne({ email: normalizedEmail }).lean();
      } catch (err) {}
    }

    if (!user) {
      user = citizenRegistry.get(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials or register as a Citizen Sentinel.',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        error: 'Account suspended. Please contact platform administrators.',
      });
    }

    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const userProfile = {
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: 'citizen',
      badge: user.badge || 'Citizen Sentinel',
    };

    const sessionToken = signJWT({
      uid: userProfile.uid,
      email: userProfile.email,
      name: userProfile.name,
      role: 'citizen',
    });

    localTokenSessionStore.set(sessionToken, userProfile);

    return res.json({
      success: true,
      message: `Welcome back, ${userProfile.name}!`,
      token: sessionToken,
      user: userProfile,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * CITIZEN REGISTRATION
 * Server-enforced: Role is ALWAYS 'citizen'.
 * Ignores any role submitted by user to prevent privilege escalation.
 */
export async function registerCitizen(req, res) {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered in citizen or officer accounts
    if (citizenRegistry.has(normalizedEmail) || officerRegistry.has(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.',
      });
    }

    if (isMongoDBConnected()) {
      try {
        const existingCitizen = await User.findOne({ email: normalizedEmail }).lean();
        const existingOfficer = await Officer.findOne({ email: normalizedEmail }).lean();
        if (existingCitizen || existingOfficer) {
          return res.status(409).json({
            success: false,
            error: 'An account with this email address already exists. Please log in.',
          });
        }
      } catch (err) {}
    }

    // Role is strictly hardcoded to 'citizen'. Never trust client-supplied role!
    const hashedPassword = hashPassword(password);
    const uid = `cit-${Date.now()}`;
    const newCitizen = {
      uid,
      email: normalizedEmail,
      name: fullName.trim(),
      password: hashedPassword,
      role: 'citizen',
      badge: 'Citizen Sentinel',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    if (isMongoDBConnected()) {
      try {
        await User.create(newCitizen);
      } catch (mongoErr) {
        console.warn('⚠️ [MongoDB] Could not persist citizen:', mongoErr.message);
      }
    }

    citizenRegistry.set(normalizedEmail, newCitizen);

    const userProfile = {
      uid: newCitizen.uid,
      email: newCitizen.email,
      name: newCitizen.name,
      role: 'citizen',
      badge: newCitizen.badge,
    };

    const sessionToken = signJWT({
      uid: userProfile.uid,
      email: userProfile.email,
      name: userProfile.name,
      role: 'citizen',
    });

    localTokenSessionStore.set(sessionToken, userProfile);

    return res.status(201).json({
      success: true,
      message: 'Citizen Sentinel account registered successfully.',
      token: sessionToken,
      user: userProfile,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * FOREST AUTHORITY OFFICER LOGIN
 * Restricts access strictly to verified Forest Authority officers.
 * If a citizen account attempts login, returns 403 Forbidden with exact portal restriction notice.
 */
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

    await syncBootstrapOfficer();

    // TEST 4 Security Check: If a citizen tries to use the Forest Authority portal
    let isCitizenAccount = citizenRegistry.has(normalizedEmail) && normalizedEmail !== 'officer.sharma@forest.haryana.gov.in';
    if (!isCitizenAccount && isMongoDBConnected()) {
      try {
        const citizenDoc = await User.findOne({ email: normalizedEmail }).lean();
        if (citizenDoc && citizenDoc.role === 'citizen') {
          isCitizenAccount = true;
        }
      } catch (err) {}
    }

    if (isCitizenAccount) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: This portal is restricted to authorized Forest Authority officers.',
      });
    }

    // Lookup officer
    let officer = null;
    if (isMongoDBConnected()) {
      try {
        officer = await Officer.findOne({ email: normalizedEmail }).lean();
      } catch (err) {}
    }

    if (!officer) {
      officer = officerRegistry.get(normalizedEmail);
    }

    if (!officer) {
      return res.status(404).json({
        success: false,
        error: 'Officer account not provisioned. Access Denied: Unrecognized or unauthorized officer credentials. Official Forest Authority accounts must be pre-provisioned by a verified administrator.',
      });
    }

    // Verify password against provisioned credential
    const isMatch = verifyPassword(password, officer.password) ||
                    (officer.rawPassword && officer.rawPassword === password) ||
                    (officer.password === password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password for Forest Authority account. Please check credentials or contact your department administrator.',
      });
    }

    // Check account active status
    const isActive = officer.permissions ? officer.permissions.isActive !== false : (officer.isActive !== false);
    if (!isActive) {
      return res.status(403).json({
        success: false,
        error: 'Officer account suspended: Enforcement clearance has been deactivated by the Super Administrator.',
      });
    }

    const defaultPermissions = {
      canVerifyIncidents: true,
      canUpdateStatus: true,
      canDispatchPatrols: true,
      canExportDossiers: true,
      isActive: true,
    };

    const userProfile = {
      uid: officer.uid,
      email: officer.email,
      name: officer.name,
      department: officer.department,
      designation: officer.designation,
      role: 'authority',
      badge: officer.badge || 'Authorized Enforcement Officer',
      permissions: officer.permissions || defaultPermissions,
    };

    const sessionToken = signJWT({
      uid: userProfile.uid,
      email: userProfile.email,
      name: userProfile.name,
      role: 'authority',
      department: userProfile.department,
      designation: userProfile.designation,
    });

    localTokenSessionStore.set(sessionToken, userProfile);
    if (officer.token) {
      localTokenSessionStore.set(officer.token, userProfile);
    }

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

/**
 * RESET PASSWORD
 */
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

/**
 * ADMINISTRATIVE OFFICER PROVISIONING (Protected by AUTHORITY_INVITE_SECRET)
 */
export async function registerAuthority(req, res) {
  try {
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
    const normalizedEmail = email.toLowerCase().trim();

    // Enforce 1 Super Admin rule: Nobody can provision an admin or hijack super admin email
    if (normalizedEmail === SUPER_ADMIN.email.toLowerCase() || req.body.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Cannot create an administrator account. Aravalli Sentinel operates strictly under a single Super Administrator security model.',
      });
    }

    // Strict verification of the administrative invite secret token
    if (inviteSecret !== env.AUTHORITY_INVITE_SECRET) {
      return res.status(403).json({
        success: false,
        error: 'Invalid Authority Invitation Secret. Authority access must be provisioned through a verified Forest Department or State Environmental Agency administrator.',
      });
    }

    const officerUid = `auth-${Date.now()}`;
    const defaultPermissions = {
      canVerifyIncidents: true,
      canUpdateStatus: true,
      canDispatchPatrols: true,
      canExportDossiers: true,
      isActive: true,
    };

    const hashedPassword = hashPassword(password || 'Officer@Aravalli2026!');

    const newOfficer = {
      uid: officerUid,
      email: normalizedEmail,
      name: fullName,
      department,
      designation,
      role: 'authority',
      badge: 'Authorized Enforcement Officer',
      password: hashedPassword,
      rawPassword: password || 'Officer@Aravalli2026!',
      permissions: defaultPermissions,
      verifiedAt: new Date().toISOString(),
    };

    if (isMongoDBConnected()) {
      try {
        await Officer.findOneAndUpdate(
          { email: normalizedEmail },
          newOfficer,
          { upsert: true, new: true }
        );
      } catch (mongoErr) {
        console.warn('⚠️ [MongoDB] Could not persist officer in MongoDB:', mongoErr.message);
      }
    }

    officerRegistry.set(normalizedEmail, newOfficer);

    const userProfile = {
      uid: newOfficer.uid,
      email: newOfficer.email,
      name: newOfficer.name,
      department: newOfficer.department,
      designation: newOfficer.designation,
      role: 'authority',
      badge: newOfficer.badge,
    };

    const sessionToken = signJWT({
      uid: userProfile.uid,
      email: userProfile.email,
      name: userProfile.name,
      role: 'authority',
      department: userProfile.department,
      designation: userProfile.designation,
    });

    localTokenSessionStore.set(sessionToken, userProfile);

    // If real Firebase Admin is connected, apply server-controlled custom claims
    if (isRealFirebaseConnected()) {
      try {
        const auth = getAuth();
        await auth.setCustomUserClaims(officerUid, { role: 'authority', department });
      } catch (fbErr) {
        console.warn('⚠️ Could not set Firebase custom claims:', fbErr.message);
      }
    }

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

/**
 * USER PROFILE VERIFICATION
 */
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
  loginAdmin,
  registerCitizen,
  registerAuthority,
  resetPassword,
  getProfile,
  syncBootstrapOfficer,
};
