# 🌿 ARAVALLI SENTINEL

> **See the Threat. Predict the Risk. Protect the Aravallis.**  
> *An AI-Assisted Environmental Threat Reporting & Explainable Ecological Risk Platform for the Aravalli Range.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: Vitest](https://img.shields.io/badge/Tests-50%20Passed-success.svg)](TESTING.md)
[![Backend: Node.js 24](https://img.shields.io/badge/Backend-Node.js%2024%20Express-emerald.svg)](backend/)
[![Frontend: React 18 / Vite](https://img.shields.io/badge/Frontend-React%2018%20Vite%20Tailwind-cyan.svg)](frontend/)
[![AI: Google Gemini](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-blue.svg)](https://aistudio.google.com/)
[![Geospatial: Sentinel-2 & Leaflet](https://img.shields.io/badge/Geospatial-Copernicus%20MSI%20%2F%20Leaflet-green.svg)](https://browser.dataspace.copernicus.eu/)

---

## 1. Project Title
**ARAVALLI SENTINEL: AI-Assisted Environmental Threat Reporting & Risk-Prioritization Platform**

---

## 2. Project Overview
The **Aravalli Mountain Range** spans over 690 kilometers across Gujarat, Rajasthan, Haryana, and Delhi NCR. As one of the oldest geological mountain formations on Earth, it serves as northwest India's primary ecological shield against the eastern expansion of the Thar Desert into the fertile Indo-Gangetic plains and the National Capital Region. It functions as the critical regional recharge aquifer for groundwater tables and hosts vital wildlife corridors connecting Sariska Tiger Reserve, Asola Bhatti Wildlife Sanctuary, and Kumbhalgarh.

**Aravalli Sentinel** is a full-stack, AI-powered early-warning platform that unites citizen field vigilance with satellite remote sensing and Google Gemini AI multimodal vision. The platform empowers communities to report suspected environmental hazards (such as illegal open-pit quarrying, commercial deforestation, and toxic dumping) while equipping authorized Forest Officers and District Task Forces with an **Explainable Ecological Risk Engine** to prioritize enforcement actions without premature legal determinations.

---

## 3. Problem Statement
Despite repeated bans imposed by the **Supreme Court of India** (*M.C. Mehta vs. Union of India*, 2002/2004/2009), the Aravalli ecosystem faces relentless ecological degradation:
1. **Unpermitted Open-Pit Quarrying & Blasting:** Mechanized stone extraction and hill flattening operating outside permissible lease boundaries.
2. **Deforestation of Indigenous Woodlands:** Felling of slow-growing native *Anogeissus pendula* (Dhau) tree stands on steep slopes, triggering soil erosion and desertification.
3. **Hydrological Disruption & Aquifer Stress:** Overburden dumping into seasonal drainage channels (*nallahs*), check-dam destruction, and unpermitted commercial borewell clusters.
4. **Toxic Waste Dumping:** Industrial rubble and leachate tipping into abandoned quarry pits, directly contaminating subterranean drinking aquifers.
5. **Enforcement Latency:** Fragmented reporting, lack of objective evidence verification, and delayed triage by limited forest ranger units.

---

## 4. Proposed Solution
Aravalli Sentinel deploys an end-to-end operational pipeline based on the **DETECT → VERIFY → PRIORITIZE → ACT** framework:
- **DETECT:** Authenticated citizens upload geotagged field photos, GPS coordinates, and descriptions of suspected threats.
- **VERIFY:** Server-side Google Gemini 2.0 Flash AI extracts objective visual indicators, surfaces technical limitations, and generates a ranger ground verification protocol. Remote sensing providers cross-reference 10-meter Sentinel-2 NDVI canopy decline.
- **PRIORITIZE:** The deterministic **Explainable Aravalli Risk Engine** calculates a composite score (0–100) using 5 normalized ecological vectors with transparent re-weighting for missing signals.
- **ACT:** Verified Forest Officers review cases in the triage portal, update workflow statuses (`pending`, `under_review`, `verified`, `resolved`, `rejected`), record immutable audit notes, and generate printable legal incident dossiers.

---

## 5. Project Objectives
1. Provide an accessible, privacy-preserving reporting portal for citizens living in the Aravalli belt.
2. Deliver defensible, explainable risk scoring that can be presented in administrative hearings or court proceedings.
3. Prevent citizen privacy leaks by redacting personal identifying information (PII) from public feeds.
4. Eliminate black-box AI decisions by explicitly detailing optical ambiguities, technical limitations, and human verification steps.
5. Accelerate official field response through structured case triage and printable incident dossiers.

---

## 6. Key Features & Implementation Status

| Feature / Module | Description | Implementation Status |
| :--- | :--- | :---: |
| **Public Ecological Landing Page** | Overview of Aravalli crisis, live telemetry stats, 4-step pipeline, and regulatory anchors | ✅ **Implemented** |
| **Citizen Threat Reporting Portal** | Collision-proof `ARV-2026-XXXXXX` Case ID, photo upload, interactive GPS map pin, validation | ✅ **Implemented** |
| **Dual Authentication Gateways** | Citizen email/password login/register & Forest Authority Portal with invitation token | ✅ **Implemented** |
| **Route Access Guards & Access Denied** | `RequireAuth`, `RequireAuthority`, and formal 403 Access Denied explanation screen | ✅ **Implemented** |
| **Evidence Storage & Serving Pipeline** | Local disk storage & Firebase Cloud Storage with category-mapped photographic fallback | ✅ **Implemented** |
| **Evidence Lightbox Viewer** | Fullscreen modal inspector with GPS metadata, timestamp, and aspect-ratio preservation | ✅ **Implemented** |
| **Live Updating Risk Map** | Auto-refreshing 15s polling countdown, stored incident popups, dual basemap toggle | ✅ **Implemented** |
| **Area Problem Statement Generator** | Dynamic area queries generating formal environmental problem statements from real records | ✅ **Implemented** |
| **Citizen Privacy Shield** | Automatic server-side redaction of citizen names, phone numbers, and UIDs on public endpoints | ✅ **Implemented** |
| **Gemini Multimodal Evidence Analysis** | Visual indicator extraction, confidence estimates, ranger checklist, legal disclaimers | ✅ **Implemented** |
| **Heuristic Fallback Engine** | Offline / no-key demo simulation ensuring zero broken screens if `GEMINI_API_KEY` is omitted | ✅ **Implemented** |
| **Explainable 5-Factor Risk Engine** | Deterministic score ($30\% / 25\% / 20\% / 15\% / 10\%$), primary driver detection, transparent re-scaling | ✅ **Implemented** |
| **Authority Triage Desk** | Role-gated case triage, search/filters, status mutation with mandatory audit notes | ✅ **Implemented** |
| **Printable Incident Dossier** | Government-formatted printable PDF incident packet with QR/hash headers and signature blocks | ✅ **Implemented** |
| **Grounded Ask Aravalli Assistant** | Conversational AI grounded in monitored zones, recent reports, and Supreme Court legal rulings | ✅ **Implemented** |
| **Role-Based Access Control (RBAC)** | Strict privilege escalation block; server-validated authority invite secret | ✅ **Implemented** |
| **Live Google Earth Engine Ingestion**| Real-time satellite time-series analysis via GEE service account | 🔄 *Boundary Implemented / Planned* |
| **Automated Push / SMS Alerts** | Direct dispatch notifications to ranger patrol units via Twilio / FCM | 🔄 *Planned* |

---

## 7. Target Users & Real-World Use Cases

1. **Local Citizens & Community Sentinels:** Residents of Gurugram, Faridabad, Alwar, Jhunjhunu, Sirohi, and surrounding rural panchayats who spot midnight blasting, tree cutting, or dumper convoys and need a safe, anonymous way to report them.
2. **Divisional Forest Officers (DFOs) & Field Rangers:** Enforcement personnel who require prioritized case lists, GPS coordinates, and structured ground verification checklists to deploy patrol units effectively.
3. **State Pollution Control Boards (RSPCB / HSPCB / GPCB):** Environmental scientists investigating industrial sludge tipping, stone crusher dust pollution, and groundwater contamination.
4. **District Task Forces & Magistrates:** Administrative authorities issuing show-cause notices, impounding heavy earthmovers, and enforcing Supreme Court mining bans.
5. **Environmental Researchers & Legal Advocates:** Conservationists monitoring long-term land-cover change, decadal degradation trends, and compliance with court directives.

---

## 8. Technology Stack

### Frontend Application (`frontend/`)
- **Core Framework:** React 18.3, Vite 6.2 (ES Modules)
- **Routing:** React Router DOM v6.29
- **Styling & Design System:** Tailwind CSS v3.4 with custom Aravalli ecological palette (`aravalli`, `risk`)
- **Icons:** Lucide React v1.16
- **Geospatial Mapping:** Leaflet v1.9 (with Esri World Imagery & CartoDB tiles) + Optional Google Maps JS API integration
- **State Management:** React Context API (`AuthContext`) with persistent localStorage sessions

### Backend REST API (`backend/`)
- **Runtime:** Node.js v24 (compatible with Node 20+)
- **Web Framework:** Express.js v4.21
- **Security:** Helmet v8.0 (HTTP headers), Express Rate Limit v7.5 (300 req/15 min)
- **Schema Validation:** Zod v3.24 (for reports, coordinates, status updates, and auth)
- **Upload Pipeline:** Multer v1.4 (Memory Storage, 10MB ceiling, strict JPEG/PNG/WEBP/HEIC MIME filter)
- **Testing Suite:** Vitest v3.2 + Supertest v7.0 (42 automated unit and integration tests)

### Cloud & AI Integrations
- **Database & ODM:** MongoDB with Mongoose v8 (Collections: `reports`, `officers`, `zones` with geospatial indexes and automatic baseline dataset seeding) + High-Fidelity Local Development Store fallback
- **AI Multimodal Vision:** Google Generative AI SDK (`@google/generative-ai`), default model `gemini-2.0-flash`
- **Legacy Cloud Support:** Firebase Admin SDK v13.1 (Cloud Firestore & Firebase Storage)
- **Remote Sensing Data:** Copernicus Sentinel-2 MSI (10m bands) & Landsat-9 OLI-2 Telemetry

---

## 9. System Architecture Overview

```mermaid
flowchart TD
    subgraph TIER1["BLOCK LAYER 1: CLIENT PRESENTATION"]
        direction LR
        UI_CITIZEN["<b>Citizen Reporting</b><br/>• Geotagged Photos<br/>• GPS Pin Picker<br/>• Gemini AI Preview"]
        UI_MAP["<b>Risk Operations Map</b><br/>• Dual: Satellite/Street<br/>• 8 Monitored Sectors<br/>• Telemetry Drawer"]
        UI_AUTH["<b>Authority Triage</b><br/>• Status & Priority Queue<br/>• Audit Trail Notes<br/>• Printable PDF Dossier"]
        UI_ASK["<b>Ask Aravalli AI</b><br/>• Grounded Telemetry<br/>• Privacy Safeguards"]
    end

    subgraph TIER2["BLOCK LAYER 2: API GATEWAY & SECURITY"]
        direction LR
        GW_RATE["<b>Rate Limiter</b><br/>• 300 req / 15m window<br/>• DDoS Protection"]
        GW_SEC["<b>Auth & Role Guard</b><br/>• JWT Token Verification<br/>• Privilege Escalation Block"]
        GW_UPLOAD["<b>Upload Pipeline</b><br/>• Multer Memory Stream<br/>• 10MB Strict Limit"]
        GW_REDACT["<b>PII Privacy Redactor</b><br/>• Public Anonymization"]
    end

    subgraph TIER3["BLOCK LAYER 3: INTELLIGENCE & TELEMETRY PROCESSORS"]
        direction LR
        PROC_GEMINI["<b>Google Gemini 2.0 AI</b><br/>• Multimodal Evidence Vision<br/>• Visual Indicator Extraction<br/>• Ranger Verification Steps"]
        PROC_GEO["<b>Geospatial Telemetry</b><br/>• Sentinel-2 MSI Bands<br/>• 10m NDVI Time-Series<br/>• Water Stress Index"]
        PROC_RISK["<b>Explainable Risk Engine</b><br/>• Mining (30%) + Veg (25%)<br/>• Water (20%) + Citizen (15%)<br/>• Historical Trend (10%)"]
    end

    subgraph TIER4["BLOCK LAYER 4: PERSISTENCE & AUDIT VAULT"]
        direction LR
        STORE_DB["<b>Cloud Firestore / Store</b><br/>• Zones & Reports Collection"]
        STORE_FILE["<b>Firebase Storage / Vault</b><br/>• Encrypted Evidence Photos"]
        STORE_AUDIT["<b>Forensic Audit Trail</b><br/>• Non-Repudiable Action Log"]
    end

    UI_CITIZEN -->|"POST /api/reports"| GW_UPLOAD
    UI_MAP -->|"GET /api/zones"| GW_RATE
    UI_AUTH -->|"PATCH /api/reports/:id/status"| GW_SEC
    UI_ASK -->|"POST /api/ai/ask-aravalli"| GW_RATE

    GW_UPLOAD --> GW_SEC
    GW_SEC -->|"Evidence Image & Text"| PROC_GEMINI
    GW_SEC -->|"Zone Sector Query"| PROC_GEO

    PROC_GEMINI -->|"Visual Impact Score"| PROC_RISK
    PROC_GEO -->|"NDVI & Aquifer Anomaly"| PROC_RISK

    PROC_RISK -->|"Computed Score & Breakdown"| STORE_DB
    GW_UPLOAD -->|"Raw Evidence Stream"| STORE_FILE
    GW_SEC -->|"Status Transitions & Notes"| STORE_AUDIT

    STORE_DB -.->|"Raw Reports"| GW_REDACT
    GW_REDACT -.->|"Sanitized Threat Feed"| UI_MAP
    STORE_DB -.->|"Priority Case Queue"| UI_AUTH
    STORE_AUDIT -.->|"Audit Chain of Custody"| UI_AUTH

    classDef t1 stroke:#38bdf8,stroke-width:2px;
    classDef t2 stroke:#818cf8,stroke-width:2px;
    classDef t3 stroke:#f59e0b,stroke-width:2px;
    classDef t4 stroke:#10b981,stroke-width:2px;

    TIER1:::t1
    TIER2:::t2
    TIER3:::t3
    TIER4:::t4
```

For the comprehensive design document with detailed workflows, see [`TECHNICAL_DESIGN.md`](TECHNICAL_DESIGN.md).

---

## 10. Repository Folder Structure

```
c:\Users\dlakh\Desktop\ARAVALLI SENTINEL/
├── .env.example                       # Master environment variable documentation
├── .gitignore                         # Excludes .env, node_modules, keys, credentials
├── firestore.rules                    # Least-privilege Firestore security rules
├── storage.rules                      # 10MB image limit Storage security rules
├── package.json                       # Monorepo orchestration scripts & ESM configuration
├── README.md                          # Master GitHub documentation (this file)
├── TECHNICAL_DESIGN.md                # 3D Isometric Architecture & Technical Design Document
├── TESTING.md                         # Complete test catalog & execution guide
├── LICENSE                            # MIT License
├── datasets/                          # Standardized Open Environmental Datasets
│   ├── citizen_reports/
│   │   ├── sample_citizen_reports.csv # 33 realistic citizen threat reports
│   │   └── images/                    # 33 verified sample JPEG evidence images
│   ├── environmental_observations/
│   │   └── sample_environmental_observations.csv # 52 Sentinel-2 / Landsat NDVI observations
│   ├── risk_zones/
│   │   └── sample_risk_zones.geojson  # 10 monitored Aravalli ecological zones (GeoJSON)
│   ├── image_metadata/
│   │   └── sample_image_metadata.csv  # Sourced licenses, URLs, and SHA-256 hashes
│   ├── data_dictionary.md             # Complete field-level schema definitions
│   ├── sources_and_licenses.md        # Provenance, open licenses, and legal terms
│   ├── validation_report.md           # Automated integrity and coordinate audit results
│   └── README.md                      # Dataset inventory & user guide
├── scripts/                           # Validation and automation scripts
│   ├── validate_dataset.js            # Automated dataset integrity & bounds validator
│   ├── seed_demo_data.js              # Runtime database synchronizer
│   └── generate_sample_images.js      # Evidence image generator
├── docs/                              # Comprehensive documentation suite
│   ├── ARCHITECTURE.md                # System topology & block flowcharts
│   ├── TECHNICAL_DESIGN.md            # 3D Isometric multi-tier architectural stack
│   ├── DATASET_GUIDE.md               # Guide to data collection & sampling methodology
│   ├── AI_METHODOLOGY.md              # Gemini 2.0 AI vision & Risk Engine formulation
│   ├── API_DOCUMENTATION.md           # Complete REST API reference with JSON payloads
│   ├── TESTING.md                     # Test execution & 42-test catalog
│   ├── DEMO_SCRIPT.md                 # 2-minute hackathon demo script & SDG alignment
│   ├── DEMO_WALKTHROUGH.md            # Step-by-step evaluator walkthrough
│   ├── DEPLOYMENT.md                  # Cloud Run & Firebase production deployment
│   └── FIREBASE_SETUP.md              # Firebase project configuration steps
├── backend/                           # Node.js Express REST API
│   ├── .env                           # Local environment file (git-ignored)
│   ├── .env.example                   # Backend environment template
│   ├── package.json                   # Backend dependencies & test scripts
│   ├── src/
│   │   ├── server.js                  # Express application entry point (Port 5050)
│   │   ├── config/
│   │   │   ├── env.js                 # Environment variable validation & defaults
│   │   │   ├── firebase.js            # Firebase Admin SDK & High-Fidelity Local Store
│   │   │   └── gemini.js              # Google Generative AI client setup
│   │   ├── controllers/
│   │   │   ├── aiController.js        # Evidence analysis & Ask Aravalli chat
│   │   │   ├── authController.js      # Citizen registration & demo persona switching
│   │   │   ├── reportsController.js   # Incident ingestion, risk scoring, legal dossiers
│   │   │   └── zonesController.js     # Ecological sectors & risk recalculator
│   │   ├── data/
│   │   │   ├── aravalliZones.js       # 8 monitored sectors with telemetry metadata
│   │   │   ├── seedReports.js         # Baseline reports with complete audit histories
│   │   │   └── seededDatasetSummary.json # Synchronized dataset manifest
│   │   ├── middleware/
│   │   │   ├── auth.js                # JWT verification & requireAuthority guard
│   │   │   └── upload.js              # Multer memory storage (JPEG/PNG/WEBP, 10MB limit)
│   │   ├── routes/
│   │   │   ├── aiRoutes.js            # /api/ai routes
│   │   │   ├── authRoutes.js          # /api/auth routes
│   │   │   ├── reportsRoutes.js       # /api/reports routes
│   │   │   └── zonesRoutes.js         # /api/zones routes
│   │   ├── services/
│   │   │   ├── geminiService.js       # Gemini 2.0 Flash multimodal vision engine
│   │   │   ├── geospatialProvider.js  # Sentinel-2 / Landsat simulator & GEE boundary
│   │   │   └── riskEngine.js          # Explainable 5-Factor Risk Engine (0–100)
│   │   └── validators/
│   │       └── reportValidator.js     # Zod input & status schemas
│   └── tests/                         # Vitest automated test suite
│       ├── api.test.js                # 31 integration tests for all REST endpoints
│       └── riskEngine.test.js         # 11 unit tests for risk formula & boundaries
└── frontend/                          # React 18 + Vite 6 + Tailwind CSS Client
    ├── .env                           # Local frontend environment (git-ignored)
    ├── .env.example                   # Frontend environment template
    ├── index.html                     # HTML5 shell with ecological branding & fonts
    ├── package.json                   # Frontend dependencies (Recharts, Leaflet, Lucide)
    ├── postcss.config.js              # PostCSS Tailwind plugins
    ├── tailwind.config.js             # Ecological palette configuration
    ├── vite.config.js                 # Vite configuration with proxy to Port 5050
    └── src/
        ├── App.jsx                    # Routing & global layout shell
        ├── main.jsx                   # React 18 DOM mount point
        ├── index.css                  # Tailwind styles & print media queries
        ├── context/
        │   └── AuthContext.jsx        # Session management & persona switcher
        ├── services/
        │   └── api.js                 # Centralized fetch API client
        ├── pages/
        │   ├── LandingLoginPage.jsx       # Starting dual-portal selection & login screen (/)
        │   ├── CitizenDashboardPage.jsx   # Citizen reports feed, stats & Recharts graphs
        │   ├── AuthorityDashboardPage.jsx # Role-gated case triage & audit note logger
        │   ├── DashboardPage.jsx          # Unified dashboard interface shell
        │   ├── RiskMapPage.jsx            # Interactive geospatial satellite risk map
        │   ├── ReportThreatPage.jsx       # Geotagged threat reporting form & AI preview
        │   ├── IncidentDossierPage.jsx    # Official printable legal incident dossier
        │   ├── AboutPage.jsx              # Supreme Court mandate, limitations & SDGs
        │   └── LoginPage.jsx              # Backward-compatible portal login alias
        └── components/
            ├── AIAnalysisCard.jsx     # Visual indicators, limitations, ranger checklist
            ├── Footer.jsx             # Regulatory references, credits, legal notice
            ├── MapView.jsx            # Dual-layer Leaflet & Google Maps component
            ├── Navbar.jsx             # Navigation header with active persona switcher
            ├── PrintableIncidentDossier.jsx # Official printable PDF case briefing
        │   ├── RiskBadge.jsx          # Color-coded severity badge (Safe to Critical)
        │   └── ZoneDetailDrawer.jsx   # Telemetry drawer with 5-factor breakdown
        └── pages/
            ├── AskAravalliPage.jsx    # Conversational assistant grounded in telemetry
            ├── AuthorityDashboardPage.jsx # Case triage, status mutation, audit trails
            ├── IncidentDossierPage.jsx    # Dedicated route for printing case dossiers
            ├── LandingPage.jsx        # Public overview, problem context, 4-step workflow
            ├── ReportThreatPage.jsx   # Citizen report form with GPS map pin picker
            └── RiskMapPage.jsx        # Full-featured geospatial operations center
```

---

## 11. Prerequisites & Software Requirements

- **Node.js:** `v20.0.0` or higher (tested on Node `v24.19.0`)
- **Package Manager:** `npm` v10+ (tested on npm `v11.17.0`)
- **Web Browser:** Any modern evergreen browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) supporting WebGL/Leaflet maps.
- **Operating System:** Cross-platform (Windows 10/11 PowerShell, macOS, Linux).

---

## 12. Installation & Setup Instructions

### Step 1: Clone or Open the Repository
```powershell
cd "c:\Users\dlakh\Desktop\ARAVALLI SENTINEL"
```

### Step 2: Install All Dependencies
Install dependencies for both frontend and backend using the root script:
```powershell
npm run install:all
```
*Alternatively, install individually:*
```powershell
cd backend && npm install
cd ../frontend && npm install
cd ..
```

---

## 13. Environment Variables Configuration

Copy the master `.env.example` template to local `.env` files:

```powershell
# Windows PowerShell:
cp .env.example backend/.env
cp .env.example frontend/.env

# Linux / macOS Bash:
cp .env.example backend/.env
cp .env.example frontend/.env
```

### Key Configuration Parameters:
| Variable | File | Description | Required? | Default / Example |
| :--- | :--- | :--- | :---: | :--- |
| `PORT` | `backend/.env` | Backend server listening port | Yes | `5050` |
| `NODE_ENV` | `backend/.env` | Runtime environment mode | Yes | `development` |
| `FRONTEND_URL` | `backend/.env` | Allowed CORS origin | Yes | `http://localhost:5173` |
| `GEMINI_API_KEY` | `backend/.env` | Google AI Studio key | Optional* | `AIzaSy...` (Uses heuristic fallback if empty) |
| `GEMINI_MODEL` | `backend/.env` | Gemini model name | Optional | `gemini-2.0-flash` |
| `MONGODB_URI` | `backend/.env` | MongoDB connection URI (Local or Atlas cluster) | Optional* | `mongodb://localhost:27017/aravalli_sentinel` (Uses High-Fidelity Local Store if empty) |
| `DATABASE_TYPE` | `backend/.env` | Database provider indicator | Optional | `mongodb` |
| `FIREBASE_PROJECT_ID` | `backend/.env` | Firebase project ID | Yes | `aravalli-sentinel-demo` |
| `INITIAL_OFFICER_NAME` | `backend/.env` | Pre-authorized officer name (Environment provisioning) | Optional | `Ranger Sunita Rao` |
| `INITIAL_OFFICER_EMAIL` | `backend/.env` | Pre-authorized officer email (Environment provisioning) | Optional | `officer@forest.rajasthan.gov.in` |
| `INITIAL_OFFICER_PASSWORD` | `backend/.env` | Pre-authorized officer password (hashed on save) | Optional | `SecurePass2026!` |
| `JWT_SECRET` | `backend/.env` | Cryptographic secret for HMAC-SHA256 JWT tokens | Yes | Strong 32+ char secret |
| `AUTHORITY_INVITE_SECRET` | `backend/.env` | Server-held secret to provision Forest Authority accounts | Yes | `AravalliEnforce2025SecureToken` |
| `DEMO_BOOTSTRAP_ENABLED` | `backend/.env` | Pre-seeds evaluation officer in non-prod environments | Yes | `true` (`false` in production) |
| `VITE_API_URL` | `frontend/.env` | Backend API proxy path | Yes | `/api` |
| `VITE_GOOGLE_MAPS_API_KEY` | `frontend/.env`| Google Maps JS key | Optional | Empty (Uses Leaflet & Esri Satellite if empty) |

*\*Note: The application operates completely out-of-the-box in **Demonstration Mode** with zero external API keys required!*

### Dual-Portal Architecture & Forest Authority Role Security
1. **Starting Page (`/`):**
   - The root URL opens the **Aravalli Sentinel Starting Page** featuring an atmospheric, Aravalli-inspired rocky mountain landscape and two prominent portal cards:
     - **PUBLIC CITIZEN PORTAL:** Open registration and login for citizens to report suspected environmental hazards (illegal mining, deforestation, toxic dumping), upload evidence, share GPS coordinates, and track their cases.
     - **FOREST AUTHORITY PORTAL:** Restricted portal for verified Forest Department and Task Force officers to review evidence, examine geospatial maps, inspect risk scores, and log field verifications.
2. **Strict Citizen / Officer Separation & Privilege Escalation Block:**
   - Public users can only register as `citizen` via `/api/auth/register-citizen`. Client-provided roles (`officer`, `admin`) are strictly rejected/ignored on the server.
   - **Cross-Portal Defense (TEST 4):** If a citizen account attempts to log in through the Forest Authority Portal, the server rejects the request with HTTP 403 Forbidden: *"Access Denied: This portal is restricted to authorized Forest Authority officers."*
   - Inactive or suspended officers are rejected with HTTP 403 Forbidden.
3. **Dual-Path Authority Officer Provisioning:**
   - **Method A — Environment Variable Provisioning (Automated Setup):**
     Configure `INITIAL_OFFICER_NAME`, `INITIAL_OFFICER_EMAIL`, and `INITIAL_OFFICER_PASSWORD` in `backend/.env`. On startup, the server automatically hashes the password using scrypt/salt and creates the authorized officer in MongoDB / officer registry without overwriting existing accounts on restart.
   - **Method B — Administrative Invitation Token (`POST /api/auth/register-authority`):**
     Authorized administrators provision officers using the secret `AUTHORITY_INVITE_SECRET`.
   - **Method C — Demo Bootstrap Mode (Evaluators & Judges):**
     When `DEMO_BOOTSTRAP_ENABLED=true`, the system pre-provisions:
     - **Officer Email:** `officer.sharma@forest.haryana.gov.in`
     - **Officer Password:** `Officer@Aravalli2026!`
     - **Citizen Email:** `citizen@aravalli.sentinel`
     - **Citizen Password:** `Citizen@Aravalli2026!`
     - **Admin Email:** `admin@aravalli.sentinel`
     - **Admin Password:** `Admin@Aravalli2026!`
4. **Statutory Non-Government Notice:**
   - *Aravalli Sentinel is an independent academic, civic, and hackathon project. It is not an official portal of the Ministry of Environment, Forest and Climate Change (MoEFCC) or State Forest Departments.*

### MongoDB Database Setup & Migration Guide
Aravalli Sentinel uses **MongoDB (via Mongoose)** as its persistent database layer, replacing external dependencies with a flexible document model ideal for geospatial coordinates, nested Gemini AI evidence metadata, and forensic audit logs.

#### Option A: Local MongoDB (Community Server)
1. Install MongoDB Community Edition and ensure the daemon is running:
   ```powershell
   # Start MongoDB service (Windows)
   net start MongoDB
   ```
2. In `backend/.env`, configure:
   ```ini
   MONGODB_URI=mongodb://localhost:27017/aravalli_sentinel
   DATABASE_TYPE=mongodb
   ```

#### Option B: MongoDB Atlas (Free Cloud Cluster)
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for development).
3. Copy the connection string and set it in `backend/.env`:
   ```ini
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aravalli_sentinel?retryWrites=true&w=majority
   DATABASE_TYPE=mongodb
   ```

#### Zero-Config Fallback & Auto-Seeding
- If `MONGODB_URI` is left blank or the database is temporarily unreachable, the backend automatically activates the **High-Fidelity Local Development Store** so the app and automated test suites run without errors.
- On your first connection to MongoDB, the backend automatically seeds the 33 baseline citizen reports and 10 Aravalli monitored zones directly into your MongoDB collections (`reports` and `zones`), requiring zero manual seeding scripts.

---

## 14. How to Run the Development Server

From the project root directory, run both servers in separate terminal windows:

### Terminal 1: Backend API Server
```powershell
npm run dev:backend
```
*Output:*
```text
🌿 ARAVALLI SENTINEL — Backend API Active
📡 Running at: http://localhost:5050
🗺️ Health: http://localhost:5050/api/health
```

### Terminal 2: Frontend Web Client
```powershell
npm run dev:frontend
```
*Output:*
```text
VITE v6.2.0  ready in 280 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 15. How to Run Backend and Frontend Separately

If you prefer operating inside individual service directories:

### Running Backend Only
```powershell
cd backend
npm run dev       # Starts Node with --watch at http://localhost:5050
# Or production mode:
npm start
```

### Running Frontend Only
```powershell
cd frontend
npm run dev       # Starts Vite dev server at http://localhost:5173
# Or build production static assets:
npm run build
npm run preview
```

---

## 16. Database and Firebase Setup

### Development / Demo Mode (Default)
No setup required. The application initializes an in-memory/disk **High-Fidelity Local Development Store** that seamlessly supports:
- Document creation, updating, and querying (`collection`, `doc`, `set`, `update`, `where`, `get`).
- File uploads formatted as base64 data URIs.
- Pre-seeded incident reports and telemetry sectors.

### Production Firebase Integration (Optional)
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project named `aravalli-sentinel`.
2. Enable **Cloud Firestore** in production mode in region `asia-south1` (Mumbai).
3. Enable **Firebase Storage**.
4. Deploy the security rules from this repository:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```
5. Generate a private service account key under **Project Settings → Service Accounts → Generate New Private Key**.
6. Save the key file to `backend/config/serviceAccountKey.json` (git-ignored) and update `backend/.env`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
   FIREBASE_PROJECT_ID=aravalli-sentinel
   ```

For detailed instructions, see [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md).

---

## 17. Google Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and generate a free API key.
2. Open `backend/.env` and paste your key:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   GEMINI_MODEL=gemini-2.0-flash
   ```
3. Restart the backend server. The console will display:
   ```text
   ✅ [Gemini AI] Google Generative AI initialized with model: gemini-2.0-flash
   ```
*If no key is configured, the system automatically runs the guided ecological heuristic engine and flags output as `isSimulated: true`.*

---

## 18. Maps and Geospatial Services Setup

The platform features a **Zero-Dependency Dual Map Engine**:
- **Default (Zero-Key):** Uses **Leaflet v1.9** with **Esri World Imagery** (15m-resolution satellite imagery) and **CartoDB Dark Matter** topographic tiles. It requires no API key, credit card, or cloud account.
- **Google Maps Integration (Optional):** If you provide `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env`, the client automatically loads the Google Maps JavaScript API with satellite hybrid terrain layers.

---

## 19. How to Run Tests

The repository includes **42 automated unit and integration tests** built with Vitest and Supertest:

```powershell
# Run all tests once:
npm run test:backend

# Or directly in backend directory:
cd backend
npm test
```

### Verified Test Run Output:
```text
✓ tests/riskEngine.test.js (11 tests) 9ms
✓ tests/api.test.js (31 tests) 297ms

Test Files  2 passed (2)
     Tests  42 passed (42)
  Duration  1.90s
```

For full test case specifications and coverage gaps, see [`TESTING.md`](TESTING.md).

---

## 20. Sample API Requests & Responses

### 1. Health Diagnostics
```http
GET http://localhost:5050/api/health
```
**Response `200 OK`:**
```json
{
  "status": "ONLINE",
  "platform": "ARAVALLI SENTINEL",
  "version": "1.0.0",
  "tagline": "See the Threat. Predict the Risk. Protect the Aravallis.",
  "timestamp": "2026-10-27T16:28:27.000Z",
  "services": {
    "firebase": {
      "connected": false,
      "mode": "Local Fallback / High-Fidelity Store"
    },
    "geminiAI": {
      "active": false,
      "model": "gemini-2.0-flash",
      "mode": "Heuristic Guided Ecological Assessment (Demo Fallback)"
    },
    "geospatialTelemetry": {
      "provider": "Copernicus Sentinel-2 & Landsat-9 Telemetry Simulator (Demonstration Dataset)",
      "live": false
    }
  }
}
```

### 2. Submit Citizen Threat Report
```http
POST http://localhost:5050/api/reports
Content-Type: multipart/form-data

threatCategory: "Illegal Mining & Quarrying"
description: "Night-time blasting observed near Bandhwari ridge slope. Two earthmovers operating."
latitude: 28.3892
longitude: 77.1415
locationName: "Bandhwari Hill Crest, Gurugram"
evidenceImage: [binary JPEG image]
```
**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Environmental threat report submitted and processed successfully.",
  "report": {
    "id": "rep-aravalli-2026-001",
    "threatCategory": "Illegal Mining & Quarrying",
    "description": "Night-time blasting observed near Bandhwari ridge slope...",
    "status": "pending",
    "citizenName": "Anonymous Citizen Sentinel",
    "citizenContactRedacted": true,
    "riskAssessment": {
      "score": 84.5,
      "riskLevel": "CRITICAL",
      "severity": "critical",
      "primaryDriver": "Illegal Mining Activity (30% weight)"
    }
  }
}
```

### 3. Update Official Case Status (Authority Only)
```http
PATCH http://localhost:5050/api/reports/rep-aravalli-2026-001/status
Authorization: Bearer demo-token-authority-valid
Content-Type: application/json

{
  "status": "verified",
  "actionNotes": "Joint inspection with Mining Officer completed. Unpermitted quarry cut verified and earthmover impounded.",
  "assignedOfficer": "Officer Rajesh Sharma (DFO)"
}
```
**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Report rep-aravalli-2026-001 status successfully updated to verified.",
  "report": {
    "id": "rep-aravalli-2026-001",
    "status": "verified",
    "updatedAt": "2026-10-27T16:28:28.000Z",
    "auditTrail": [
      {
        "action": "Status updated from 'under_review' to 'verified'",
        "by": "Officer Rajesh Sharma",
        "notes": "Joint inspection with Mining Officer completed..."
      }
    ]
  }
}
```

---

## 21. Sample Data Instructions

Synthetic demonstration datasets are provided in the [`sample_data/`](sample_data/) directory:
- [`environmental_incidents.json`](sample_data/environmental_incidents.json): 12 structured JSON incident records.
- [`environmental_incidents.csv`](sample_data/environmental_incidents.csv): Tabular RFC 4180 CSV export.
- [`sample_data/README.md`](sample_data/README.md): Field definitions, schemas, and synthetic data disclaimers.

All sample records are explicitly marked with `"is_synthetic": true` and represent plausible ecological sectors across Rajasthan, Haryana, Delhi NCR, and Gujarat.

---

## 22. Security and Privacy Considerations

1. **Citizen Anonymity & PII Protection:** The server strips `citizenId` and private contact metadata from public feeds. Citizen sentinels are attributed as `"Anonymous Citizen Sentinel"`.
2. **Role Escalation Prevention:** Public registration routes unconditionally assign `role: 'citizen'`. Supplying `role: 'authority'` in client payloads is rejected.
3. **Server-Side Authorization Guards:** Modifying report status (`PATCH /api/reports/:id/status`) strictly requires the `requireAuthority` middleware.
4. **Upload Hardening:** Multer memory storage validates MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/heic`) and enforces a strict 10MB ceiling.
5. **Rate Limiting:** Protects endpoints with a window of 300 requests per 15 minutes.
6. **Immutable Forensic Audit Trail:** Case status changes require non-empty action notes and preserve the acting officer's identity and timestamp.

---

## 23. Troubleshooting Common Errors

### Error 1: `listen EADDRINUSE: address already in use :::5050`
- **Cause:** Another process is running on port 5050.
- **Fix:** Terminate the conflicting process or change `PORT=5051` in `backend/.env` and update the proxy target in `frontend/vite.config.js`.

### Error 2: `[Gemini AI] No valid GEMINI_API_KEY detected in .env`
- **Cause:** Expected in demo mode.
- **Fix:** The app runs safely with heuristic fallback. To enable live Gemini 2.0 Flash vision, obtain an API key from Google AI Studio and configure `GEMINI_API_KEY` in `backend/.env`.

### Error 3: Map tiles appear blank or grey
- **Cause:** Network connectivity issue reaching OpenStreetMap or Esri tile servers.
- **Fix:** Check internet connection. In corporate networks, ensure tile domains (`server.arcgisonline.com`, `cartocdn.com`) are not blocked by firewalls.

---

## 24. Limitations and Future Improvements

### Completed in Current Implementation
- Full-stack working MVP with React 18, Vite, Node.js 24, and Express.
- Complete 5-factor Explainable Risk Engine with transparent re-weighting.
- Multimodal Google Gemini AI evidence analysis with non-defamation caveats.
- Role-gated authority triage desk with printable PDF incident dossiers.
- 42 automated unit and integration tests passing.

### Future Roadmap
- **Live Google Earth Engine Pipeline:** Automated weekly Sentinel-2 and Landsat-9 spectral pass ingestion via GEE Python/Node API.
- **Offline PWA Support:** Service worker background sync for citizens reporting in remote valleys without cellular coverage.
- **Multilingual Voice Assistant:** Speech-to-text queries in Hindi, Marwari, and Mewati for rural community elders.
- **Automated Ranger Push Notifications:** Real-time SMS and Firebase Cloud Messaging alerts dispatched to local ranger patrol handsets.

---

## 25. Contribution Guidelines

Contributions from developers, conservationists, and GIS specialists are welcome:
1. **Fork the Repository:** Create a feature branch (`git checkout -b feature/eco-restoration-tracker`).
2. **Adhere to Code Standards:** Use ES Modules, clean comments, and maintain documentation integrity.
3. **Add Tests:** Ensure all new services have corresponding Vitest unit tests in `backend/tests/`.
4. **Run Verification:** Verify that `npm run test:backend` and `npm run build:frontend` pass with zero errors.
5. **Submit a Pull Request:** Describe the ecological rationale and testing steps in your PR description.

---

## 26. License
This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for complete terms.

---

## 27. Project Acknowledgements & References

- **Supreme Court of India:** Landmark judgments in *M.C. Mehta vs. Union of India* (2002, 2004, 2009) establishing mining bans and eco-sensitive zones in the Aravallis.
- **Ministry of Environment, Forest and Climate Change (MoEFCC):** Guidelines on Eco-Sensitive Zones (ESZ) and the Forest (Conservation) Act, 1980.
- **European Space Agency (ESA) & Copernicus:** Sentinel-2 Multispectral Instrument (MSI) open optical remote sensing imagery.
- **ISRO & Bhuvan Geo-Portal:** Land Degradation and Desertification Atlases of India.
- **Google DeepMind & Google AI Studio:** Google Gemini 2.0 Flash developer platform.
