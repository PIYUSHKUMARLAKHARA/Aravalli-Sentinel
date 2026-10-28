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

## 4. AI Analysis & Legal Assistant

### `POST /api/ai/analyze-evidence`
Performs standalone Gemini 2.0 multimodal analysis on an uploaded image without persisting a report.

### `POST /api/ai/ask-aravalli`
Interactive environmental and legal QA assistant grounded in live platform data and Supreme Court jurisprudence.

**Request Body:**
```json
{
  "message": "What are the Supreme Court restrictions on mining in the Aravalli hills of Haryana?",
  "history": []
}
```
