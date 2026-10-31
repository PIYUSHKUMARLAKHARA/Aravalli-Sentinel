const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('aravalli_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}

export async function fetchZones(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/zones${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchZoneDetails(zoneId) {
  const res = await fetch(`${BASE_URL}/zones/${zoneId}`);
  return res.json();
}

export async function recalculateZoneRisk(factors, metadata) {
  const res = await fetch(`${BASE_URL}/zones/recalculate-risk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ factors, metadata }),
  });
  return res.json();
}

export async function fetchReports(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/reports${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function fetchReportById(reportId) {
  const res = await fetch(`${BASE_URL}/reports/${reportId}`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function submitThreatReport(formData) {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      // Note: Do NOT set Content-Type for FormData, browser sets multipart boundary
    },
    body: formData,
  });
  return res.json();
}

export async function updateReportStatus(reportId, updateData) {
  const res = await fetch(`${BASE_URL}/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(updateData),
  });
  return res.json();
}

export async function fetchIncidentDossier(reportId) {
  const res = await fetch(`${BASE_URL}/reports/${reportId}/incident-dossier`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function previewAnalyzeEvidence(formData) {
  const res = await fetch(`${BASE_URL}/ai/analyze-evidence`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function askAravalli(question) {
  const res = await fetch(`${BASE_URL}/ai/ask-aravalli`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ question }),
  });
  return res.json();
}

export const askAiAssistant = askAravalli;

export async function loginCitizen(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login-citizen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('aravalli_auth_token', data.token);
    localStorage.setItem('aravalli_auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function loginAuthority(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login-authority`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('aravalli_auth_token', data.token);
    localStorage.setItem('aravalli_auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function resetCitizenPassword(email, newPassword) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });
  return res.json();
}

export async function generateAreaProblemStatement(payload) {
  const res = await fetch(`${BASE_URL}/zones/problem-statement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function loginDemoUser(role) {
  const res = await fetch(`${BASE_URL}/auth/login-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('aravalli_auth_token', data.token);
    localStorage.setItem('aravalli_auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function registerCitizen(email, fullName, password) {
  const res = await fetch(`${BASE_URL}/auth/register-citizen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName, password }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('aravalli_auth_token', data.token);
    localStorage.setItem('aravalli_auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function registerAuthority(payload) {
  const res = await fetch(`${BASE_URL}/auth/register-authority`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('aravalli_auth_token', data.token);
    localStorage.setItem('aravalli_auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function loginAdmin(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('aravalli_auth_token', data.token);
    localStorage.setItem('aravalli_auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function fetchAdminOfficers() {
  const res = await fetch(`${BASE_URL}/admin/officers`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function updateOfficerPermissions(uid, payload) {
  const res = await fetch(`${BASE_URL}/admin/officers/${uid}/permissions`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function adminProvisionOfficer(payload) {
  const res = await fetch(`${BASE_URL}/admin/officers/provision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function adminDeleteOfficer(uid) {
  const res = await fetch(`${BASE_URL}/admin/officers/${uid}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function fetchAdminSystemStats() {
  const res = await fetch(`${BASE_URL}/admin/system-stats`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${BASE_URL}/notifications`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function trackCaseById(caseId) {
  const res = await fetch(`${BASE_URL}/reports/track/${encodeURIComponent(caseId)}`);
  return res.json();
}

export async function addOfficerInternalNote(reportId, note) {
  const res = await fetch(`${BASE_URL}/reports/${reportId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ note }),
  });
  return res.json();
}

export async function fetchWeather(lat, lng) {
  const res = await fetch(`${BASE_URL}/weather/current?lat=${lat}&lng=${lng}`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function fetchSatelliteAnalysis(caseId) {
  const res = await fetch(`${BASE_URL}/satellite/analysis/${encodeURIComponent(caseId)}`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function fetchRewardWallet() {
  const res = await fetch(`${BASE_URL}/rewards/wallet`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function claimChallengeReward(challengeId, stepsCount) {
  const res = await fetch(`${BASE_URL}/rewards/challenges/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ challengeId, stepsCount }),
  });
  return res.json();
}

export async function draftVoiceReport(transcript, location) {
  const res = await fetch(`${BASE_URL}/ai/draft-voice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ transcript, location }),
  });
  return res.json();
}

export function logoutUser() {
  localStorage.removeItem('aravalli_auth_token');
  localStorage.removeItem('aravalli_auth_user');
}

export default {
  fetchHealth,
  fetchZones,
  fetchZoneDetails,
  recalculateZoneRisk,
  fetchReports,
  fetchReportById,
  submitThreatReport,
  updateReportStatus,
  fetchIncidentDossier,
  previewAnalyzeEvidence,
  askAravalli,
  loginDemoUser,
  loginCitizen,
  loginAuthority,
  registerCitizen,
  registerAuthority,
  resetCitizenPassword,
  generateAreaProblemStatement,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  trackCaseById,
  addOfficerInternalNote,
  fetchWeather,
  fetchSatelliteAnalysis,
  fetchRewardWallet,
  claimChallengeReward,
  draftVoiceReport,
  logoutUser,
};
