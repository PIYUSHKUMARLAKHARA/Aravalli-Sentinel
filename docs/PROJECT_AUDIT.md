# ARAVALLI SENTINEL — Project Defect, Security & Architecture Audit

**Project:** Aravalli Sentinel — See the Threat. Predict the Risk. Protect the Aravallis.  
**Audit Date:** October 2026  
**Auditor:** Full-Stack & Security Engineering Architecture Team  
**Status:** Audit Complete — All Critical & High Defects Resolved  

---

## 1. Executive Summary

Aravalli Sentinel is an AI-assisted environmental monitoring and risk prioritization platform designed for the Aravalli range across Rajasthan, Haryana, Gujarat, and Delhi NCR. This comprehensive engineering audit systematically analyzed the codebase across frontend, backend, database layers, telemetry pipelines, and security controls to identify root causes of reported bugs, evaluate architectural integrity, and verify all remediation steps.

---

## 2. Technology Stack Verification

| Tier | Technologies Applied | Operational Role |
| :--- | :--- | :--- |
| **Frontend Web Client** | React 18, Vite 6, Tailwind CSS, Lucide React, Recharts | Interactive citizen reporting, GIS risk maps, DFO triage console |
| **Mapping Engine** | Leaflet 1.9, Esri World Imagery, CartoDB Voyager | Dual-layer satellite imagery & dynamic risk hotspot pin cluster |
| **Backend REST API** | Node.js (ESM), Express.js, Multer, Helmet, Morgan | REST endpoints, file streaming, rate limiting, and RBAC guards |
| **Authentication & RBAC** | Firebase Auth / High-Fidelity Local Session Registry | Dual-path persona separation, token verification, authority registry |
| **AI Vision Engine** | Google Gemini 2.0 Flash multimodal API + Ecological Fallback | Excavation detection, visual cues, legal limitation disclosures |
| **Risk Scoring Engine** | Custom 5-Factor Weighted Engine (0–100 scale) | Mathematical explainability: Mining (30%), Trees (25%), Water (20%), Citizen (15%), History (10%) |
| **Geospatial Telemetry** | Sentinel-2 MSI Surface Reflectance Simulator / GEE boundary | 10m NDVI calculation, multi-temporal pass comparison, GeoJSON exports |

---

## 3. Comprehensive Defect Registry & Root Causes

### Defect 1: Forest Authority Login Error — `Invalid Authority Invitation Secret`
* **Severity:** CRITICAL
* **Discovered Behavior:** Whenever an officer entered valid credentials or attempted to sign in via the Forest Authority portal, the application threw `403 Forbidden: Invalid Authority Invitation Secret. Authority access must be provisioned through a verified Forest Department or State Environmental Agency administrator.`
* **Actual Root Cause:**
  1. The backend previously only implemented `POST /api/auth/register-authority` without a corresponding `POST /api/auth/login-authority` route for already-provisioned officers.
  2. In `LoginPage.jsx` and `AuthContext.jsx`, the single unified authority form submitted directly to `registerAuthority`, requiring `inviteSecret` unconditionally on every login attempt.
  3. No persistent officer registry existed on the server to store provisioned officers.
* **Resolution:**
  1. Created a dual-mode UI experience in `LoginPage.jsx`: **Officer Sign In** (Email + Password) and **Officer Provisioning** (Full Name, Department, Designation, Email, Password, and `inviteSecret`).
  2. Implemented `loginAuthority(req, res)` on `POST /api/auth/login-authority`, authenticating officers against the server-side `officerRegistry`.
  3. Added `DEMO_BOOTSTRAP_ENABLED` toggle allowing an evaluation bootstrap account (`officer.sharma@forest.haryana.gov.in`) for hackathons while disabling it in production.
* **Status:** **RESOLVED & VERIFIED** (Unit & Integration tests passing).

---

### Defect 2: Citizen Report Submit Button Not Responding
* **Severity:** HIGH
* **Discovered Behavior:** Users reported that clicking the "Submit Official Threat Report" button in `ReportThreatPage.jsx` appeared non-responsive.
* **Actual Root Cause:**
  1. Client-side validation in `validateForm()` aborted execution when description (< 10 chars) or locationName (< 2 chars) were invalid, but error notifications were rendered at the top of the page (line 415), outside the user's viewport when scrolled down to the submit button.
  2. The button lacked an immediate visual error notice adjacent to the trigger.
* **Resolution:**
  1. Enhanced `validateForm()` to assemble specific, actionable error text: `setSubmissionError(...)`.
  2. Injected a prominent warning card immediately above the Submit button so users immediately see which field requires attention.
  3. Added submission progress states (`isSubmitting` with loading spinner, step indicators, and disabled pointer state) to prevent duplicate clicks.
* **Status:** **RESOLVED & VERIFIED**.

---

### Defect 3: Uploaded Evidence Images Failing to Serve or Display (404)
* **Severity:** HIGH
* **Discovered Behavior:** Newly uploaded images in citizen reports resulted in broken image icons or 404 responses.
* **Actual Root Cause:**
  1. **Path Resolution Discrepancy:** In `reportsController.js`, `localUploadsDir` resolved to `path.resolve(__dirname, '../uploads/evidence')` (which evaluates to `backend/src/uploads/evidence`). However, in `server.js`, `express.static` was mounted to `path.resolve(__dirname, '../uploads')` (evaluating to `backend/uploads`). Consequently, uploaded files were stored in a directory that Express was not serving.
  2. **Vite Proxy Omission:** In `frontend/vite.config.js`, the development proxy only forwarded `/api`. Requests for `/uploads/...` and `/datasets/images/...` were captured by Vite instead of the backend server.
* **Resolution:**
  1. Corrected `localUploadsDir` in `reportsController.js` to `path.resolve(__dirname, '../../uploads/evidence')`, aligning disk writes with `backend/uploads/evidence`.
  2. Mounted `/api/uploads` and `/api/datasets/images` in `server.js` in addition to root routes.
  3. Configured `frontend/vite.config.js` to proxy `/uploads`, `/datasets/images`, and `/images` directly to `http://localhost:5050`.
  4. Updated `ImageWithFallback.jsx` to immediately handle missing sources gracefully without layout disruption.
* **Status:** **RESOLVED & VERIFIED**.

---

### Defect 4: Inadequate Role-Based Authorization & Privilege Escalation Risks
* **Severity:** HIGH
* **Discovered Behavior:** The frontend previously allowed switching personas locally; backend routes needed to guarantee that client state cannot override server role enforcement.
* **Actual Root Cause:** While middleware checked tokens, public registration routes needed to enforce that a citizen can never submit `{ role: 'authority' }` in `req.body`.
* **Resolution:**
  1. In `authController.js`, `registerCitizen` strictly hardcodes `role: 'citizen'`, ignoring any client-provided role parameters.
  2. In `auth.js`, `requireAuthority` strictly checks `req.user.role === 'authority' || req.user.role === 'admin'`.
  3. In `reportsController.js`, `updateReportStatus` is guarded by `requireAuthority`, rejecting citizen tokens with `403 Forbidden`.
* **Status:** **RESOLVED & VERIFIED** (Tested via automated supertest suites).

---

### Defect 5: Risk Map Telemetry Real-Time Synchronization
* **Severity:** MEDIUM
* **Discovered Behavior:** Map markers required manual browser refresh to reflect newly submitted threat reports.
* **Actual Root Cause:** Real-time polling was not initialized with an automatic fallback ticker.
* **Resolution:**
  1. In `RiskMapPage.jsx`, implemented a 15-second background synchronization ticker with visual countdown and last-synced timestamp.
  2. Built `loadData(silent)` to seamlessly refresh zones and reports without flashing loading skeletons.
  3. Map popups dynamically show evidence thumbnails, severity badges, and direct navigation links to official case dossiers.
* **Status:** **RESOLVED & VERIFIED**.

---

## 4. Remediation Verification Matrix

| Area | Test / Verification Method | Expected Result | Actual Result |
| :--- | :--- | :--- | :---: |
| **Officer Provisioning** | `POST /api/auth/register-authority` with valid secret | 201 Created with role `authority` | **PASS** |
| **Officer Provisioning** | `POST /api/auth/register-authority` with invalid secret | 403 Forbidden with exact security disclaimer | **PASS** |
| **Officer Sign In** | `POST /api/auth/login-authority` with provisioned credentials | 200 OK with session token & DFO profile | **PASS** |
| **Unprovisioned Login** | `POST /api/auth/login-authority` with unprovisioned email | 404 Not Found with provisioning guidance | **PASS** |
| **Citizen RBAC Guard** | `PATCH /api/reports/:id/status` using citizen token | 403 Forbidden: Access Denied | **PASS** |
| **Authority Triage** | `PATCH /api/reports/:id/status` using authority token | 200 OK with updated status & audit log | **PASS** |
| **Form Submit** | Client form validation with inline warnings | Blocks submission & highlights missing fields | **PASS** |
| **Static Images** | Fetch `/uploads/...` and `/datasets/images/...` | 200 OK with image MIME headers | **PASS** |
| **Risk Engine** | 5-Factor mathematical calculation across 11 test cases | Boundary scores 0–100 strictly normalized | **PASS** |
| **Dataset Integrity** | Automated audit script (`scripts/validate_dataset.js`) | 0 errors, 0 warnings across all 4 datasets | **PASS** |
| **Production Build** | `npm --prefix frontend run build` via Vite | 0 build errors; minified bundle created | **PASS** |

---

## 5. Security & Privacy Highlights

1. **Citizen Protection Protocol:**
   - Public feeds (`GET /api/reports`) automatically redact citizen names (`Anonymous Sentinel`), contact emails, and personal identification to protect whistleblowers.
2. **Cryptographic Case Identifiers:**
   - Collision-safe Case IDs (`ARV-YYYY-XXXX`) generated using microsecond timestamps and random entropy.
3. **Immutable Audit Trails:**
   - Every status mutation in `reportsController.js` logs officer UID, name, role, timestamp, and formal action notes into the case record.
4. **Statutory Non-Government Disclaimers:**
   - Prominently displayed across UI, authentication modals, and documentation stating that Aravalli Sentinel is an academic and civic hackathon platform and not an official government agency portal.
