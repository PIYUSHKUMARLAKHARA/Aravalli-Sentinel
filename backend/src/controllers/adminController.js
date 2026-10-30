import { Officer } from '../models/Officer.js';
import { isMongoDBConnected, getDatabaseStatus } from '../config/db.js';
import { officerRegistry, SUPER_ADMIN } from './authController.js';
import { getAllStoredReports } from './reportsController.js';
import { aravalliZones } from '../data/aravalliZones.js';

/**
 * Controller for Super Administrator Operations
 * Enforces: ONLY 1 Super Administrator exists in Aravalli Sentinel.
 */

export async function getOfficers(req, res) {
  try {
    const officersMap = new Map();

    // 1. Load from MongoDB if connected
    if (isMongoDBConnected()) {
      try {
        const mongoOfficers = await Officer.find({}).lean();
        mongoOfficers.forEach((off) => {
          officersMap.set(off.email, {
            uid: off.uid,
            email: off.email,
            name: off.name,
            department: off.department,
            designation: off.designation,
            role: off.role || 'authority',
            badge: off.badge,
            permissions: off.permissions || {
              canVerifyIncidents: true,
              canUpdateStatus: true,
              canDispatchPatrols: true,
              canExportDossiers: true,
              isActive: true,
            },
            verifiedAt: off.verifiedAt || off.createdAt,
            createdAt: off.createdAt,
          });
        });
      } catch (err) {
        console.warn('MongoDB officer fetch notice:', err.message);
      }
    }

    // 2. Merge from memory registry
    for (const [email, off] of officerRegistry.entries()) {
      if (!officersMap.has(email)) {
        officersMap.set(email, {
          uid: off.uid,
          email: off.email,
          name: off.name,
          department: off.department,
          designation: off.designation,
          role: off.role || 'authority',
          badge: off.badge,
          permissions: off.permissions || {
            canVerifyIncidents: true,
            canUpdateStatus: true,
            canDispatchPatrols: true,
            canExportDossiers: true,
            isActive: true,
          },
          verifiedAt: off.verifiedAt,
          createdAt: off.verifiedAt,
        });
      }
    }

    const officersList = Array.from(officersMap.values());

    return res.json({
      success: true,
      count: officersList.length,
      officers: officersList,
      adminPolicy: {
        model: 'SINGLE_SUPER_ADMINISTRATOR',
        superAdminEmail: SUPER_ADMIN.email,
        totalAllowedAdmins: 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateOfficerPermissions(req, res) {
  try {
    const { uid } = req.params;
    const { permissions, designation, department } = req.body;

    if (!permissions && !designation && !department) {
      return res.status(400).json({
        success: false,
        error: 'No permission updates provided.',
      });
    }

    let targetEmail = null;
    let targetOfficer = null;

    // Search in memory registry
    for (const [email, off] of officerRegistry.entries()) {
      if (off.uid === uid || off.email === uid) {
        targetEmail = email;
        targetOfficer = off;
        break;
      }
    }

    // Search in MongoDB if not found in memory
    if (isMongoDBConnected()) {
      try {
        const mongoOfficer = await Officer.findOne({ $or: [{ uid }, { email: uid }] });
        if (mongoOfficer) {
          targetEmail = mongoOfficer.email;
          targetOfficer = mongoOfficer;

          if (permissions) {
            mongoOfficer.permissions = {
              ...(mongoOfficer.permissions || {}),
              ...permissions,
            };
          }
          if (designation) mongoOfficer.designation = designation;
          if (department) mongoOfficer.department = department;

          await mongoOfficer.save();
        }
      } catch (err) {
        console.warn('MongoDB update notice:', err.message);
      }
    }

    if (targetOfficer) {
      targetOfficer.permissions = {
        ...(targetOfficer.permissions || {}),
        ...permissions,
      };
      if (designation) targetOfficer.designation = designation;
      if (department) targetOfficer.department = department;

      if (targetEmail) {
        officerRegistry.set(targetEmail, targetOfficer);
      }
    }

    if (!targetOfficer) {
      return res.status(404).json({
        success: false,
        error: `Officer with identifier '${uid}' not found.`,
      });
    }

    return res.json({
      success: true,
      message: 'Officer permissions successfully updated by Super Administrator.',
      officer: {
        uid: targetOfficer.uid,
        email: targetOfficer.email,
        name: targetOfficer.name,
        department: targetOfficer.department,
        designation: targetOfficer.designation,
        permissions: targetOfficer.permissions,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function provisionOfficer(req, res) {
  try {
    const { email, fullName, department, designation, password, permissions } = req.body;

    if (!email || !fullName || !department || !designation) {
      return res.status(400).json({
        success: false,
        error: 'Full Name, Official Email, Department, and Designation are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforce 1 Super Admin rule
    if (normalizedEmail === SUPER_ADMIN.email.toLowerCase() || req.body.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Cannot create an administrator. Only 1 Super Administrator is permitted in Aravalli Sentinel.',
      });
    }

    const officerUid = `auth-${Date.now()}`;
    const sessionToken = `demo-token-authority-${Date.now()}`;

    const defaultPermissions = {
      canVerifyIncidents: true,
      canUpdateStatus: true,
      canDispatchPatrols: true,
      canExportDossiers: true,
      isActive: true,
      ...permissions,
    };

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
      permissions: defaultPermissions,
      verifiedAt: new Date().toISOString(),
    };

    // Save to MongoDB if connected
    if (isMongoDBConnected()) {
      try {
        await Officer.findOneAndUpdate(
          { email: normalizedEmail },
          newOfficer,
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn('MongoDB provision notice:', err.message);
      }
    }

    // Save to server-side registry
    officerRegistry.set(normalizedEmail, newOfficer);

    return res.status(201).json({
      success: true,
      message: `Enforcement Officer '${fullName}' successfully provisioned by Super Administrator.`,
      officer: {
        uid: newOfficer.uid,
        email: newOfficer.email,
        name: newOfficer.name,
        department: newOfficer.department,
        designation: newOfficer.designation,
        badge: newOfficer.badge,
        permissions: newOfficer.permissions,
        verifiedAt: newOfficer.verifiedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteOfficer(req, res) {
  try {
    const { uid } = req.params;

    if (uid === SUPER_ADMIN.uid || uid === SUPER_ADMIN.email) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: The Super Administrator account cannot be deleted or revoked.',
      });
    }

    let deleted = false;

    // Remove from MongoDB
    if (isMongoDBConnected()) {
      try {
        const result = await Officer.deleteOne({ $or: [{ uid }, { email: uid }] });
        if (result.deletedCount > 0) deleted = true;
      } catch (err) {}
    }

    // Remove from memory
    for (const [email, off] of officerRegistry.entries()) {
      if (off.uid === uid || off.email === uid) {
        officerRegistry.delete(email);
        deleted = true;
        break;
      }
    }

    return res.json({
      success: true,
      message: `Officer '${uid}' successfully removed from authorized registry.`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getSystemStats(req, res) {
  try {
    const reports = getAllStoredReports();
    const totalReports = reports.length;
    const pendingCount = reports.filter((r) => r.status === 'pending').length;
    const underReviewCount = reports.filter((r) => r.status === 'under_review').length;
    const verifiedCount = reports.filter((r) => r.status === 'verified').length;
    const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
    const rejectedCount = reports.filter((r) => r.status === 'rejected').length;

    // Count officers
    let totalOfficers = officerRegistry.size;
    let activeOfficers = 0;
    for (const off of officerRegistry.values()) {
      if (off.permissions?.isActive !== false) activeOfficers++;
    }

    if (isMongoDBConnected()) {
      try {
        const count = await Officer.countDocuments();
        if (count > totalOfficers) totalOfficers = count;
      } catch (err) {}
    }

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      adminPolicy: {
        model: 'SINGLE_SUPER_ADMINISTRATOR',
        superAdmin: {
          name: SUPER_ADMIN.name,
          email: SUPER_ADMIN.email,
          role: SUPER_ADMIN.role,
          badge: SUPER_ADMIN.badge,
          policy: 'Strictly 1 Super Administrator permitted in Aravalli Sentinel',
        },
      },
      officers: {
        total: totalOfficers,
        active: activeOfficers,
      },
      incidents: {
        total: totalReports,
        pending: pendingCount,
        underReview: underReviewCount,
        verified: verifiedCount,
        resolved: resolvedCount,
        rejected: rejectedCount,
      },
      zones: {
        total: aravalliZones.length,
      },
      database: getDatabaseStatus(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  getOfficers,
  updateOfficerPermissions,
  provisionOfficer,
  deleteOfficer,
  getSystemStats,
};
