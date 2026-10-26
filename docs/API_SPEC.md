# ARAVALLI SENTINEL — REST API Specification

Base Endpoint: `http://localhost:5000/api`

---

## 1. System Health & Diagnostics

### `GET /api/health`
Returns system operational state, active Gemini model, Firebase connection status, and geospatial telemetry provider.

**Response `200 OK`:**
```json
{
  "status": "ONLINE",
  "platform": "ARAVALLI SENTINEL",
  "version": "1.0.0",
  "tagline": "See the Threat. Predict the Risk. Protect the Aravallis.",
  "timestamp": "2026-10-26T06:15:00.000Z",
  "services": {
    "firebase": {
      "connected": false,
      "mode": "Local Fallback / High-Fidelity Store"
    },
    "geminiAI": {
      "active": true,
      "model": "gemini-2.0-flash",
      "mode": "Live Gemini 2.0 Flash Engine"
    },
    "geospatialTelemetry": {
      "provider": "Copernicus Sentinel-2 & Landsat-9 Telemetry Simulator (Demonstration Dataset)",
      "live": false
    }
  }
}
```

---

## 2. Monitored Ecological Zones

### `GET /api/zones`
Lists all monitored Aravalli sectors with scores and risk levels.
- **Query Parameters:**
  - `riskLevel`: `CRITICAL` | `HIGH RISK` | `WATCH` | `SAFE`
  - `state`: `Haryana` | `Rajasthan` | `Delhi NCR`

### `GET /api/zones/:id`
Returns detailed telemetry for a single zone, including 5-factor breakdown, NDVI time-series, and legal notifications.

### `POST /api/zones/recalculate-risk`
Allows testing factor weight variations against the Risk Engine.
- **Body:** `{ factors: { miningRisk, vegetationLoss, waterStress, citizenEvidence, historicalChange } }`

---

## 3. Threat Reports & Citizen Ingestion

### `GET /api/reports`
Lists ingested threat reports with automatic citizen privacy redaction for public callers.
- **Query Parameters:** `status`, `threatCategory`, `zoneId`, `riskLevel`

### `POST /api/reports`
Submits a citizen threat report with image evidence and GPS coordinates.
- **Headers:** `Content-Type: multipart/form-data`
- **Fields:**
  - `evidenceImage`: Binary image file (JPEG, PNG, WEBP, max 10MB)
  - `threatCategory`: One of permitted threat enums
  - `description`: String (10 to 2000 chars)
  - `latitude`: Float (-90 to 90)
  - `longitude`: Float (-180 to 180)
  - `locationName`: String landmark name
  - `incidentTime`: ISO datetime string

### `PATCH /api/reports/:id/status`
**Role Required:** `authority` or `admin` (Enforced via JWT / Bearer Token)
Updates case status and appends a non-repudiable audit log entry.
- **Body:**
```json
{
  "status": "verified",
  "actionNotes": "Joint inspection with Mining Officer confirmed unpermitted hill cutting. Seizure memo prepared.",
  "assignedOfficer": "Officer Rajesh Sharma (DFO)"
}
```

### `GET /api/reports/:id/incident-dossier`
Returns a formatted, structured incident dossier suitable for printing or legal case filing.

---

## 4. AI & Conversational Assistant

### `POST /api/ai/analyze-evidence`
Analyzes uploaded image and text description without saving a report. Useful for live preview.

### `POST /api/ai/ask-aravalli`
Conversational endpoint grounded in active application zones, reports, and Indian environmental jurisprudence.
- **Body:** `{ "question": "Why is Bandhwari ridge critical risk?" }`

---

## 5. Authentication & Role Provisioning

### `POST /api/auth/login-demo`
Allows instant persona toggling for local testing and evaluation.
- **Body:** `{ "role": "citizen" | "authority" }`

### `POST /api/auth/register-citizen`
Public registration for citizen sentinels (role strictly locked to `citizen`).

### `POST /api/auth/register-authority`
Secure registration requiring verified `inviteSecret`. Rejects unauthorized elevation with `403 Forbidden`.
