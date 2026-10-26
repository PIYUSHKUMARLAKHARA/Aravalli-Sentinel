import { authorityInviteSchema } from '../validators/reportValidator.js';
import env from '../config/env.js';

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

export async function loginDemo(req, res) {
  try {
    const { role } = req.body;
    const targetRole = role === 'authority' ? 'authority' : 'citizen';
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
    const validated = authorityInviteSchema.parse(req.body);

    // Verify secret invite token server-side
    if (validated.inviteSecret !== env.AUTHORITY_INVITE_SECRET) {
      return res.status(403).json({
        success: false,
        error: 'Invalid Authority Invitation Secret. Authority access must be provisioned through a verified Forest Department or State Environmental Agency administrator.',
      });
    }

    const user = {
      uid: `auth-${Date.now()}`,
      email: validated.email,
      name: validated.fullName,
      department: validated.department,
      designation: validated.designation,
      role: 'authority',
      token: `demo-token-authority-${Date.now()}`,
      verifiedAt: new Date().toISOString(),
    };

    return res.status(201).json({
      success: true,
      message: 'Authority account successfully provisioned and verified.',
      token: user.token,
      user,
    });
  } catch (err) {
    return res.status(400).json({
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
  registerCitizen,
  registerAuthority,
  getProfile,
};
