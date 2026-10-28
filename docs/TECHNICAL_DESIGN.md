# ARAVALLI SENTINEL — Technical Design Document (TDD)

**Project:** Aravalli Sentinel — See the Threat. Predict the Risk. Protect the Aravallis.  
**Version:** 1.0.0  
**Classification:** Technical Architecture & System Specification  
**Focus Region:** Aravalli Ecological Range (Rajasthan, Haryana, Gujarat, Delhi NCR)  

---

## 1. System Architecture & Topology

Aravalli Sentinel is engineered as an end-to-end, decoupled multi-tier environmental intelligence and risk prioritization platform:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      TIER 1: PRESENTATION LAYER                         │
│  ┌───────────────────────────┐         ┌─────────────────────────────┐  │
│  │   Citizen Sentinel Portal │         │   Forest Authority Console  │  │
│  │  - GPS Incident Reporting │         │  - Case Triage & Workflow   │  │
│  │  - Image Evidence Upload  │         │  - Immutable Audit Trails   │  │
│  │  - Personal Report Feed   │         │  - Printable Dossiers (PDF) │  │
│  └─────────────┬─────────────┘         └──────────────┬──────────────┘  │
│                │                                      │                 │
│                └──────────────────┬───────────────────┘                 │
│                                   │                                     │
│  ┌────────────────────────────────┴──────────────────────────────────┐  │
│  │             Interactive Geospatial Risk Operations Center         │  │
│  │  - Leaflet / Esri World Imagery / CartoDB Basemaps                │  │
│  │  - Real-Time Marker Clustering & Telemetry Overlays               │  │
│  │  - Area-Based Environmental Problem Statement Generator           │  │
│  └────────────────────────────────┬──────────────────────────────────┘  │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │ HTTPS / REST (JSON + Multipart)
┌───────────────────────────────────▼─────────────────────────────────────┐
│                      TIER 2: APPLICATION & API LAYER                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Express REST Server (Port 5050)               │  │
│  │  - Rate Limiting (express-rate-limit: 300 req / 15 min)           │  │
│  │  - Security Headers (Helmet CSP, Cross-Origin-Resource-Policy)    │  │
│  │  - Input Validation (Zod Schemas: Report, Status, Officer Auth)   │  │
│  │  - Upload Handling (Multer In-Memory Buffer: JPEG/PNG/WEBP/HEIC)  │  │
│  └─────────────┬──────────────────┬───────────────────┬──────────────┘  │
│                │                  │                   │                 │
│  ┌─────────────▼──────┐    ┌──────▼────────┐   ┌──────▼──────────────┐  │
│  │ Authentication &   │    │ Explainable   │   │ Geospatial Provider │  │
│  │ RBAC Guard         │    │ Risk Engine   │   │ Interface           │  │
│  │ - Token Verifier   │    │ - 5 Weighted  │   │ - Sentinel-2 NDVI   │  │
│  │ - Dual-Path Auth   │    │   Vectors     │   │ - Landsat-9 Telemetry│  │
│  │ - Privacy Stripper │    │ - 0–100 Scale │   │ - Multi-Temporal    │  │
│  │ - Officer Registry │    │ - Primary     │   │   Pass Comparison   │  │
│  │                    │    │   Driver Log  │   │ - GEE Adapter       │  │
│  └────────────────────┘    └───────────────┘   └─────────────────────┘  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────┐
│                 TIER 3: AI INTELLIGENCE & SATELLITE ENGINE              │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────┐  │
│  │  Google Gemini 2.0 Flash Vision │   │ Copernicus Sentinel-2 MSI   │  │
│  │  - Multimodal Evidence Analysis │   │ - Band 4 (Red) & Band 8     │  │
│  │  - Visual Indicator Extraction  │   │   (NIR)                     │  │
│  │  - Legal Limitation Disclaimers │   │ - 10-meter NDVI Calculation │  │
│  │  - Conversational Assistant     │   │ - Cloud-Filtered Time Series│  │
│  └─────────────────────────────────┘   └─────────────────────────────┘  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────┐
│                 TIER 4: PERSISTENCE & STORAGE LAYER                     │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────┐  │
│  │  Firebase Firestore / Local Store│   │ Firebase Storage / Local Disk│ │
│  │  - Monitored Aravalli Sectors   │   │ - Cryptographic Filename    │  │
│  │  - Incident Case Documents      │   │   Sanitization              │  │
│  │  - Append-Only Audit Logs       │   │ - Dual-Path Static Delivery │  │
│  └─────────────────────────────────┘   └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 5-Factor Weighted Risk Engine Formulation

The Aravalli Sentinel Risk Engine converts multimodal environmental signals into a normalized, explainable 0–100 risk score:

$$\text{Risk Score} = \sum_{i=1}^{5} w_i \cdot F_i$$

### Factor Breakdown:
| Factor ($F_i$) | Weight ($w_i$) | Signal Sources | Range |
| :--- | :---: | :--- | :---: |
| **Mining Risk** | **0.30** | Optical quarry signatures, drill scars, proximity to legal lease boundaries | 0–100 |
| **Vegetation Loss** | **0.25** | Sentinel-2 NDVI multi-temporal delta ($NIR - Red) / (NIR + Red)$ | 0–100 |
| **Water Stress** | **0.20** | Check-dam dry basin anomalies, aquifer depletion telemetry | 0–100 |
| **Citizen Ground Evidence**| **0.15** | Corroborating verified citizen incident reports & field sightings | 0–100 |
| **Historical Land Change** | **0.10** | Multi-year Landsat / ISRO Bhuvan land degradation trend | 0–100 |

### Severity Thresholds:
- **`0 – 30` (SAFE):** Natural climax scrub/forest vegetation; no anomalous mechanized disturbance detected.
- **`31 – 50` (WATCH):** Seasonal dryness, low-intensity grazing, or moderate biomass variation.
- **`51 – 75` (HIGH RISK):** Documented tree felling, boundary encroachment, or severe ground water stress.
- **`76 – 100` (CRITICAL):** Active heavy excavation, blasting debris, unpermitted quarrying, or toxic leachate pooling.

---

## 3. Citizen Report Ingestion & Evidence Pipeline

```
Citizen Uploads Photo & Sets Location
                 │
                 ▼
         Client Validation
    (Description >= 10 chars,
     Coordinates within bounds)
                 │
                 ▼
     Multipart Form Streaming
  (Multer Memory Buffer, Max 10MB)
                 │
                 ▼
      MIME Type Whitelist Check
    (image/jpeg, png, webp, heic)
                 │
        ┌────────┴────────┐
        ▼                 ▼
   Gemini Vision    Local / Cloud Disk
   Ecological Cues    Storage (/uploads)
        └────────┬────────┘
                 │
                 ▼
      Risk Engine Calculation
     (Combines Regional Telemetry)
                 │
                 ▼
   Collision-Safe Case ID Created
         (ARV-YYYY-XXXX)
                 │
                 ▼
    Persisted to Database & Logs
  (Public Feed Strips Citizen PII)
```

---

## 4. Forest Authority Triage & Audit Trail

When an authorized officer updates the status of an incident:
1. Request arrives at `PATCH /api/reports/:id/status` with `Authorization: Bearer <token>`.
2. Middleware validates token and enforces `req.user.role === 'authority' || req.user.role === 'admin'`.
3. Zod schema `validateUpdateStatus` ensures `status` is one of `pending | under_review | verified | resolved | rejected` and `actionNotes` has at least 5 characters.
4. Controller updates status, writes timestamp, and appends immutable audit entry:
   - Action Name
   - Performed By (Officer Name & UID)
   - Official Designation & Department
   - Action Context & Legal Inspection Notes
5. Generates printable PDF-ready Incident Legal Dossier under Section 4/5 Punjab Land Preservation Act (PLPA) & Rajasthan Forest Act standards.

---

## 5. Area-Based Problem Statement Generator

Authorized officers can select any monitored sector or spatial bounding box to generate a structured intelligence briefing:
- **Aggregated Case Counts:** Total incidents, pending verification, confirmed violations, and false alarms.
- **Threat Taxonomy Breakdown:** Percentage distribution of mining vs. deforestation vs. water stress.
- **Severity Concentration:** Ratio of Critical/High-risk hotspots.
- **Recommended Action Priorities:** Recommended patrol dispatches and satellite re-observation schedules.
- **Limitations & Disclosures:** Explicit statements regarding data limitations to prevent unverified citizen sightings from being treated as judicial proof of an offense.

---

## 6. Statutory Disclaimer

> **Statutory Notice:** Aravalli Sentinel is an academic, civic, and hackathon demonstration platform created for ecological threat monitoring. It is not an official portal of the Ministry of Environment, Forest and Climate Change (MoEFCC), Rajasthan Forest Department, or Haryana Forest Department. Official statutory environmental enforcement actions must be routed through respective government bodies.
