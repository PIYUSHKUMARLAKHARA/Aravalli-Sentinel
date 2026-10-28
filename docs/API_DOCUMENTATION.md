# ARAVALLI SENTINEL — REST API Documentation

Base URL: `http://localhost:5050/api`

---

## 1. System Health

### `GET /api/health`
Checks server uptime, memory usage, and operational status of backend services.

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "platform": "ARAVALLI SENTINEL",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-10-28T12:00:00.000Z",
  "services": {
    "gemini": "simulated_ecological_heuristics",
    "firebase": "high_fidelity_local_store",
    "riskEngine": "operational",
    "geospatialProvider": "mock-gee"
  }
}
```

---

## 2. Monitored Eco-Zones

### `GET /api/zones`
Retrieves monitored Aravalli ecological sectors with optional state and risk filters.

**Query Parameters:**
- `state` (optional): Filter by state (`Haryana`, `Rajasthan`, `Delhi NCR`, `Gujarat`)
- `riskLevel` (optional): Filter by severity band (`SAFE`, `WATCH`, `HIGH RISK`, `CRITICAL`)

**Response `200 OK`:**
```json
{
  "success": true,
  "count": 8,
  "zones": [
    {
      "id": "zone-bandhwari-01",
      "name": "Bandhwari Hill Ridge & Eco-Buffer",
      "state": "Haryana",
      "latitude": 28.3842,
      "longitude": 77.1436,
      "overallRiskScore": 86.2,
      "riskLevel": "CRITICAL",
      "primaryThreat": "Illegal Mining & Leachate Dumping",
      "factors": {
        "miningRisk": 92.0,
        "vegetationLoss": 88.5,
        "waterStress": 84.0,
        "citizenEvidence": 85.0,
        "historicalChange": 76.0
      }
    }
  ]
}
```

### `GET /api/zones/:id`
Retrieves telemetry, 10-month NDVI time-series, and administrative protocol for a specific sector.

---

### `POST /api/zones/recalculate-risk`
Calculates dynamic risk score across custom factor weights with automatic proportional re-normalization.

**Request Body:**
```json
{
  "factors": {
    "miningRisk": 75,
    "vegetationLoss": 60,
    "waterStress": 45,
    "citizenEvidence": 80,
    "historicalChange": 50
  }
}
```

---

## 3. Incident Threat Reports

### `GET /api/reports`
Lists threat reports. **Automatically redacts citizen PII** (name, phone, user UID) when called without an authorized authority token.

**Query Parameters:**
- `status`: `pending` | `under_review` | `verified` | `resolved` | `rejected`
- `threatCategory`: Filter by category string

---

### `POST /api/reports`
Submits a new environmental incident report with photographic evidence.

**Headers:**
`Content-Type: multipart/form-data`

**Form Data Fields:**
- `image`: Image file (JPEG, PNG, WEBP, max 10MB)
- `threatCategory`: String enum
- `description`: Text (10 to 1000 characters)
- `latitude`: Number (-90 to +90)
- `longitude`: Number (-180 to +180)
- `locationName`: String
- `incidentTime`: ISO 8601 string (optional)

---

### `PATCH /api/reports/:id/status`
Updates report workflow status. **Requires Authority role authentication** (`Authorization: Bearer <token>`).

**Request Body:**
```json
{
  "status": "verified",
  "actionNotes": "Site inspected by Forest Range Officer. Illegal pit confirmed outside lease boundary. FIR filed under Forest Conservation Act."
}
```

---

### `POST /api/zones/problem-statement`
Generates a formal, machine-readable area-based environmental problem statement by spatially querying stored incident reports.

**Request Body (Optional Filters):**
```json
{
  "zoneId": "zone-bandhwari-01",
  "district": "Gurugram",
  "state": "Haryana",
  "radiusKm": 25
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "problemStatement": {
    "statementId": "PS-ARV-987654",
    "selectedArea": "Bandhwari Forest Corridor (Gurugram)",
    "totalReports": 7,
    "topThreatCategory": "Illegal Mining & Quarrying",
    "threatBreakdown": [
      { "category": "Illegal Mining & Quarrying", "count": 4, "percentage": 57 },
      { "category": "Toxic Waste Dumping", "count": 2, "percentage": 29 },
      { "category": "Deforestation", "count": 1, "percentage": 14 }
    ],
    "riskDistribution": { "critical": 4, "highRisk": 2, "watch": 1, "safe": 0 },
    "recentTrend": "Recurrent clustering of illegal mining observed across notified forest tracts...",
    "recommendedPriorities": [
      "Deploy joint DGPS demarcation patrol immediately...",
      "Cross-reference disputed khasra numbers against State Forest Registry under PLPA Section 4/5..."
    ],
    "dataLimitations": "Observations are synthesized from corroborated citizen optical submissions and Sentinel-2 deltas...",
    "representativeCases": []
  }
}
```

---

## 4. Authentication & Security Endpoints

### `POST /api/auth/login-citizen`
Authenticates a citizen sentinel using email and password. Role is strictly server-enforced as `citizen`.

### `POST /api/auth/register-citizen`
Registers a new citizen sentinel account. The `role` is strictly server-enforced as `citizen`. Client-supplied roles are ignored.

### `POST /api/auth/login-authority`
Authenticates an already-provisioned Forest Authority officer using official email and password. Does **not** require the invitation secret once provisioned.

**Request Body:**
```json
{
  "email": "officer.sharma@forest.haryana.gov.in",
  "password": "Officer@Aravalli2026!"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Enforcement credentials verified. Welcome, Officer Rajesh Sharma.",
  "token": "demo-token-authority-valid",
  "user": {
    "uid": "demo-authority-01",
    "email": "officer.sharma@forest.haryana.gov.in",
    "name": "Officer Rajesh Sharma",
    "department": "Haryana Forest Department & Aravalli Task Force",
    "designation": "Divisional Forest Officer (DFO)",
    "role": "authority",
    "badge": "Authorized Enforcement Officer"
  }
}
```

**Errors:**
- `400 Bad Request`: Validation failure (email/password missing or malformed).
- `401 Unauthorized`: Invalid password.
- `404 Not Found`: Officer account not found or not yet provisioned.

### `POST /api/auth/register-authority` / `POST /api/auth/provision-officer`
Provisions an authorized Forest Department enforcement account. Strictly requires a valid `inviteSecret` verified against the server configuration.

**Request Body:**
```json
{
  "email": "officer.verma@forest.rajasthan.gov.in",
  "fullName": "Officer Sunita Verma",
  "department": "Rajasthan Department of Environment & Forest",
  "designation": "Assistant Conservator of Forests (ACF)",
  "password": "SecurePassword2026!",
  "inviteSecret": "AravalliEnforce2025SecureToken"
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Forest Authority officer account successfully provisioned and verified.",
  "token": "demo-token-authority-1730164800000",
  "user": {
    "uid": "auth-1730164800000",
    "email": "officer.verma@forest.rajasthan.gov.in",
    "name": "Officer Sunita Verma",
    "department": "Rajasthan Department of Environment & Forest",
    "designation": "Assistant Conservator of Forests (ACF)",
    "role": "authority",
    "badge": "Authorized Enforcement Officer"
  }
}
```

**Errors:**
- `403 Forbidden`: `Invalid Authority Invitation Secret. Authority access must be provisioned through a verified Forest Department or State Environmental Agency administrator.`
- `500 Internal Server Error`: `Server configuration error: Authority Invitation Secret is not configured. Please set AUTHORITY_INVITE_SECRET in backend/.env.`

### `POST /api/auth/reset-password`
Dispatches a secure password recovery instruction email.

### `POST /api/auth/login-demo`
Allows 1-click persona switching (`citizen` or `authority`) for hackathon evaluation and demonstration.

---

## 5. Static Evidence & Media Serving

### `GET /uploads/evidence/:filename` (or `GET /api/uploads/evidence/:filename`)
Serves encrypted/sanitized local disk evidence images captured by citizen sentinels.

### `GET /datasets/images/:filename` (or `GET /api/datasets/images/:filename`)
Serves curated demonstration baseline evidence images documented in `datasets/image_credits.csv`.

---

## 5. AI Analysis & Legal Assistant

### `POST /api/ai/analyze-evidence`
Performs standalone Gemini 2.0 multimodal analysis on an uploaded image without persisting a report.

### `POST /api/ai/ask-aravalli`
Interactive environmental and legal QA assistant grounded in live platform data and Supreme Court jurisprudence.

**Request Body:**
```json
{
  "question": "What are the Supreme Court restrictions on mining in the Aravalli hills of Haryana?"
}
```
