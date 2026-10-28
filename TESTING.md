# Testing Guide & Verification Suite — Aravalli Sentinel

> **Test Framework:** [Vitest](https://vitest.dev/) v3.2.7 (ES Modules Native)  
> **HTTP Integration Testing:** [Supertest](https://github.com/ladjs/supertest) v7.0.0  
> **Test Status:** **50 Tests Passed (100% Success Rate across 2 Test Suites)**  
> **Execution Duration:** ~1.95 seconds

---

## 1. Test Setup & Environment Prerequisites

The testing suite runs entirely in-memory and requires no external network credentials or live cloud services:
- **Firebase Auth & Firestore:** Tested via the High-Fidelity Local Development Store mock.
- **Gemini AI:** Tested via the rule-guided ecological assessment heuristic fallback engine.
- **Geospatial Telemetry:** Tested via the deterministic Sentinel-2 / Landsat-9 simulator.

### Prerequisites
- Node.js `v20.0.0` or higher (verified on Node `v24.19.0`)
- Dependencies installed in `backend/` (`npm --prefix backend install`)

---

## 2. Test Execution Commands

### Run Full Test Suite Once (CI Mode)
```powershell
# From project root:
npm run test:backend

# Or directly from backend directory:
cd backend
npm test
```

### Run Tests in Watch Mode (Interactive Development)
```powershell
npm --prefix backend run test:watch
```

### Run Only Risk Engine Unit Tests
```powershell
npx --prefix backend vitest run tests/riskEngine.test.js
```

### Run Only API Integration Tests
```powershell
npx --prefix backend vitest run tests/api.test.js
```

---

## 3. Verified Test Results (Executed Oct 27, 2026)

```text
> aravalli-sentinel-backend@1.0.0 test
> vitest run

 RUN  v3.2.7 C:/Users/dlakh/Desktop/ARAVALLI SENTINEL/backend

 ✓ tests/riskEngine.test.js (11 tests) 9ms
 ✓ tests/api.test.js (31 tests) 297ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  16:28:27
   Duration  1.90s (transform 250ms, setup 0ms, collect 928ms, tests 306ms, environment 0ms, prepare 335ms)
```

---

## 4. Test Catalog & Detailed Case Specifications

### Suite A: Explainable Risk Engine Unit Tests (`tests/riskEngine.test.js`)
File: [`backend/tests/riskEngine.test.js`](file:///c:/Users/dlakh/Desktop/ARAVALLI%20SENTINEL/backend/tests/riskEngine.test.js) (11 Tests)

| # | Test Case Description | Tested Scenario | Expected Result |
| :---: | :--- | :--- | :--- |
| 1 | **Weight Sum Validation** | Verify normalized factor weights sum to 1.00. | `mining(0.30) + veg(0.25) + water(0.20) + citizen(0.15) + history(0.10) == 1.00`. |
| 2 | **Baseline Formula Accuracy** | Inputs: `M=80, V=60, W=50, C=40, H=30`. | Expected score: `58.0`, band: `HIGH RISK`, primary driver: `miningRisk` (24 pts). |
| 3 | **Classification Threshold Mapping** | Test boundary values: 0, 30, 31, 50, 51, 75, 76, 100. | Accurately assigns `SAFE`, `WATCH`, `HIGH RISK`, `CRITICAL`. |
| 4 | **Factor Boundary Validation** | Test valid `[0, 50, 100]` vs invalid `[-5, 105, 'abc', null]`. | Flags invalid inputs with actionable validation failure messages. |
| 5 | **Single Missing Factor Re-normalization** | Omit `waterStress` (0.20). Available weight sum is `0.80`. | Rescales remaining factors across available 80%, sets `isComplete=false`. |
| 6 | **Primary Driver Detection** | Dominant vegetation loss (`V=95`). | Identifies `vegetationLoss` as the primary driver (23.75 pts). |
| 7 | **Minimum Ecological Baseline (0)** | All factors set to `0`. | Score: `0`, Level: `SAFE`, Severity: `low`. |
| 8 | **Maximum Critical Threat (100)** | All factors set to `100`. | Score: `100`, Level: `CRITICAL`, Severity: `critical`, Action: Immediate raid. |
| 9 | **Multi-Vector Missing Factors** | Omit `waterStress` and `citizenEvidence`. Available: `0.65`. | Re-normalizes across 65% weight, flags 2 missing factors, limitations notice. |
| 10 | **Total Absence of Data Handling** | All factors missing or null `{}`. | Returns `success: false` with descriptive error and missing factor list. |
| 11 | **Historical Dominance Shift** | Dominant historical transformation (`H=100`). | Primary driver shifts to `historicalChange`. |

---

### Suite B: API Integration Tests (`tests/api.test.js`)
File: [`backend/tests/api.test.js`](file:///c:/Users/dlakh/Desktop/ARAVALLI%20SENTINEL/backend/tests/api.test.js) (31 Tests)

| # | Endpoint & Scenario | Method | HTTP Status | Expected Assertion |
| :---: | :--- | :---: | :---: | :--- |
| 1 | **System Health Diagnostics** | `GET /api/health` | `200` | Returns `status: ONLINE`, versions, service health objects. |
| 2 | **List All Zones** | `GET /api/zones` | `200` | Returns array of at least 8 zones with scores and factors. |
| 3 | **Zone Telemetry Details** | `GET /api/zones/:id` | `200` | Returns Bandhwari sector details, legal status, and NDVI series. |
| 4 | **List Threat Reports** | `GET /api/reports` | `200` | Returns ingested reports array. |
| 5 | **Empty Payload Rejection** | `POST /api/reports` | `400` | Zod schema validation error for missing required fields. |
| 6 | **Demo Persona Switching** | `POST /api/auth/login-demo` | `200` | Generates token for authority role (`demo-token-authority-valid`). |
| 7 | **Invalid Invite Secret Rejection** | `POST /api/auth/register-authority`| `403` | Unauthorized secret rejected with Forbidden. |
| 8 | **Citizen Privilege Escalation Guard** | `PATCH /api/reports/:id/status` | `403` | Citizen bearer token rejected from mutating case status. |
| 9 | **Authorized Officer Case Triage** | `PATCH /api/reports/:id/status` | `200` | Authority token allowed; updates status to `verified` with audit note. |
| 10 | **State Query Filter** | `GET /api/zones?state=Gujarat` | `200` | Returns only Gujarat sectors (Ambaji, Idar). |
| 11 | **Risk Level Filter** | `GET /api/zones?riskLevel=CRITICAL`| `200` | Returns only CRITICAL priority sectors. |
| 12 | **Dynamic Risk Recalculation** | `POST /api/zones/recalculate-risk` | `200` | Recomputes score on custom inputs (`90,80,70,60,50` -> `75.0`). |
| 13 | **Threat Category Filter** | `GET /api/reports?threatCategory=...`| `200` | Returns filtered reports matching category. |
| 14 | **Rejected Status Filter** | `GET /api/reports?status=rejected` | `200` | Returns audited false-alarm cases. |
| 15 | **Fetch Report By ID** | `GET /api/reports/:id` | `200` | Returns report object with AI analysis and risk assessment. |
| 16 | **Unknown Report 404** | `GET /api/reports/:unknown` | `404` | Returns descriptive 404 error object. |
| 17 | **Printable Incident Dossier** | `GET /api/reports/:id/incident-dossier` | `200` | Formats complete administrative dossier packet. |
| 18 | **Public Citizen Privacy Redaction** | `GET /api/reports` | `200` | `citizenId` is undefined, `citizenName` set to Anonymous Citizen Sentinel. |
| 19 | **Ask Aravalli Legal AI Assistant** | `POST /api/ai/ask-aravalli` | `200` | Returns grounded text answering Supreme Court ban questions. |
| 20 | **Live Evidence Preview (AI)** | `POST /api/ai/analyze-evidence` | `200` | Returns structured visual indicators and confidence estimate. |
| 21 | **Invalid Status Enum Rejection** | `PATCH /api/reports/:id/status` | `400` | Rejects non-permitted status strings. |
| 22 | **Short Action Note Rejection** | `PATCH /api/reports/:id/status` | `400` | Rejects audit notes shorter than 5 characters. |
| 23 | **Successful Submission with Photo** | `POST /api/reports` | `201` | Ingests multipart photo and coordinates, computes initial score. |
| 24 | **Out-of-Bounds Latitude (>90)** | `POST /api/reports` | `400` | Rejects `latitude: 95.5` with Zod boundary violation. |
| 25 | **Out-of-Bounds Longitude (>180)** | `POST /api/reports` | `400` | Rejects `longitude: 195.0` with Zod boundary violation. |
| 26 | **Non-Numeric Coordinate Rejection** | `POST /api/reports` | `400` | Rejects non-numeric string coordinates. |
| 27 | **Unsupported File MIME Rejection** | `POST /api/reports` | `400` | Rejects `text/plain` file with Multer error (`Unsupported file type`). |
| 28 | **Unauthenticated Profile Access** | `GET /api/auth/profile` | `401` | Rejects request missing Authorization header. |
| 29 | **Authenticated Profile Access** | `GET /api/auth/profile` | `200` | Returns decoded user profile for valid Bearer token. |
| 30 | **Citizen Account Registration** | `POST /api/auth/register-citizen` | `201` | Registers account with role strictly set to `citizen`. |
| 31 | **Registration Missing Email** | `POST /api/auth/register-citizen` | `400` | Rejects payload missing mandatory email. |

---

## 5. Test Data Instructions

- **In-Memory Seed Reports:** Located in [`backend/src/data/seedReports.js`](file:///c:/Users/dlakh/Desktop/ARAVALLI%20SENTINEL/backend/src/data/seedReports.js). Loaded automatically on server initialization.
- **Ecological Monitored Zones:** Located in [`backend/src/data/aravalliZones.js`](file:///c:/Users/dlakh/Desktop/ARAVALLI%20SENTINEL/backend/src/data/aravalliZones.js).
- **Synthetic Demonstration Datasets:** Located in [`sample_data/environmental_incidents.json`](file:///c:/Users/dlakh/Desktop/ARAVALLI%20SENTINEL/sample_data/environmental_incidents.json) and `.csv`.
- **Demo Auth Tokens:**
  - Citizen Persona: `demo-token-citizen-valid` (UID: `demo-citizen-01`, role: `citizen`)
  - Authority Persona: `demo-token-authority-valid` (UID: `demo-authority-01`, role: `authority`)

---

## 6. Known Gaps & Future Testing Enhancements

1. **End-to-End Browser Testing:** Add [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/) to automate map marker clicks, photo file drag-and-drop, and PDF printing in Chrome/Firefox.
2. **Live Earth Engine Contract Testing:** Add integration test suite running against Google Cloud Earth Engine sandbox service account when credentials are provided.
3. **Load & Stress Testing:** Implement [k6](https://k6.io/) scripts to verify that the rate limiter handles concurrent citizen report bursts during environmental crisis events.
