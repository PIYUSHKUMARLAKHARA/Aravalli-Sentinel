import { isMongoDBConnected } from '../config/db.js';
import { Notification } from '../models/Notification.js';

// In-memory notifications store for fallback and speed
export const inMemoryNotifications = [
  {
    id: 'notif-welcome-01',
    citizenId: 'demo-citizen-01',
    citizenEmail: 'citizen@aravalli.sentinel',
    reportId: 'rep-aravalli-2026-001',
    reportTitle: 'Illegal Mining at Bandhwari',
    type: 'status_update',
    title: 'Case Under Review: rep-aravalli-2026-001',
    message: 'Your report rep-aravalli-2026-001 has been assigned to Range Forest Officer Rajesh Sharma for on-site inspection.',
    status: 'under_review',
    read: false,
    resolution: null,
    officerRemarks: 'Ground inspection team dispatched with GPS cameras.',
    updatedBy: 'Officer Rajesh Sharma',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

/**
 * Helper to dispatch in-app notification when an officer updates a case
 */
export async function createReportNotification({
  citizenId,
  citizenEmail,
  reportId,
  reportTitle,
  type,
  title,
  message,
  status,
  resolution,
  officerRemarks,
  updatedBy,
}) {
  const notif = {
    id: `notif-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    citizenId: citizenId || 'demo-citizen-01',
    citizenEmail: citizenEmail || null,
    reportId,
    reportTitle: reportTitle || `Report ${reportId}`,
    type: type || (status === 'resolved' ? 'case_resolved' : 'status_update'),
    title:
      title ||
      (status === 'resolved'
        ? `Case Resolved: ${reportId}`
        : `Case Status Update: ${reportId}`),
    message:
      message ||
      (status === 'resolved'
        ? `Your environmental report ${reportId} has been reviewed and marked as resolved by the authorized officer.`
        : `Your environmental report ${reportId} status has been updated to ${status.replace('_', ' ').toUpperCase()}.`),
    status,
    read: false,
    resolution: resolution || null,
    officerRemarks: officerRemarks || null,
    updatedBy: updatedBy || 'Authorized Forest Officer',
    createdAt: new Date().toISOString(),
  };

  inMemoryNotifications.unshift(notif);

  if (isMongoDBConnected()) {
    try {
      await Notification.create(notif);
    } catch (err) {
      console.warn('⚠️ [MongoDB] Notification persistence warning:', err.message);
    }
  }

  return notif;
}

/**
 * GET /api/notifications
 * Lists notifications for the authenticated citizen
 */
export async function getCitizenNotifications(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to access notifications.',
      });
    }

    let notifications = [];

    if (isMongoDBConnected()) {
      try {
        const query = {
          $or: [{ citizenId: user.uid }, { citizenEmail: user.email }],
        };
        notifications = await Notification.find(query).sort({ createdAt: -1 }).lean();
      } catch (err) {
        console.warn('⚠️ [MongoDB] Notification fetch fallback to memory:', err.message);
      }
    }

    if (!notifications || notifications.length === 0) {
      notifications = inMemoryNotifications.filter(
        (n) =>
          n.citizenId === user.uid ||
          (user.email && n.citizenEmail === user.email) ||
          (user.uid === 'demo-citizen-01' && (n.citizenId === 'cit-demo-001' || n.citizenId === 'demo-citizen-01'))
      );
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a specific notification as read
 */
export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    // Update in memory
    const memNotif = inMemoryNotifications.find((n) => n.id === id);
    if (memNotif) {
      memNotif.read = true;
    }

    // Update in MongoDB
    if (isMongoDBConnected()) {
      try {
        await Notification.findOneAndUpdate({ id }, { $set: { read: true } });
      } catch (err) {}
    }

    return res.json({
      success: true,
      message: 'Notification marked as read.',
      notificationId: id,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications for current user as read
 */
export async function markAllNotificationsAsRead(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    inMemoryNotifications.forEach((n) => {
      if (
        n.citizenId === user.uid ||
        (user.email && n.citizenEmail === user.email) ||
        (user.role === 'citizen' && n.citizenId === 'demo-citizen-01')
      ) {
        n.read = true;
      }
    });

    if (isMongoDBConnected()) {
      try {
        await Notification.updateMany(
          { $or: [{ citizenId: user.uid }, { citizenEmail: user.email }] },
          { $set: { read: true } }
        );
      } catch (err) {}
    }

    return res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  getCitizenNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createReportNotification,
};
