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

export async function resetCitizenPassword(email) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
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
  registerCitizen,
  registerAuthority,
  resetCitizenPassword,
  generateAreaProblemStatement,
  logoutUser,
};
