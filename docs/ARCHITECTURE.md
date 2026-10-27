# ARAVALLI SENTINEL — System Architecture & Design Specification

> **Tagline:** See the Threat. Predict the Risk. Protect the Aravallis.  
> **Operational Workflow:** DETECT → VERIFY → PRIORITIZE → ACT  

```mermaid
flowchart TD
    subgraph B1["BLOCK 1: DETECT (Citizen Field Sourcing)"]
        direction TB
        IN1["Ground Observation<br/>• Illegal Mining & Blasting<br/>• Tree Felling & Dhau Loss<br/>• Waste Dumping & Encroachment"]
        CAPTURE["Evidence Packaging<br/>• Geotagged Field Photographs<br/>• GPS Lat/Long Coordinates<br/>• Timestamp & Incident Context"]
        IN1 --> CAPTURE
    end

    subgraph B2["BLOCK 2: VERIFY (Dual-Track Automated Intelligence)"]
        direction TB
        GEMINI_BLOCK["Track A: Gemini 2.0 Multimodal Vision<br/>• Visual Indicator Extraction<br/>• Excavation / Clearance Detection<br/>• Technical Uncertainty Flags<br/>• Ranger Verification Checklist"]
        SENTINEL_BLOCK["Track B: Sentinel-2 Remote Sensing<br/>• 10m NDVI Vegetation Anomaly<br/>• Surface Water Stress Index<br/>• Multi-Month Degradation Curve"]
    end

    subgraph B3["BLOCK 3: PRIORITIZE (Explainable Risk Engine)"]
        direction TB
        CALC_BLOCK["5-Factor Mathematical Index<br/>Score = (M×0.30) + (V×0.25) + (W×0.20) + (C×0.15) + (H×0.10)"]
        CLASS_BLOCK["Classification Bands & Transparency<br/>• SAFE: 0–30 • WATCH: 31–50<br/>• HIGH RISK: 51–75 • CRITICAL: 76–100<br/>• Proportional Re-normalization for Missing Signals"]
        CALC_BLOCK --> CLASS_BLOCK
    end

    subgraph B4["BLOCK 4: ACT (Authority Enforcement & Remediation)"]
        direction TB
        TRIAGE_BLOCK["Authority Operations Desk<br/>• Priority Enforcement Triage<br/>• Ranger Verification Protocol"]
        DOSSIER_BLOCK["Legal & Field Action<br/>• Non-Repudiable Audit Logging<br/>• Printable Official Incident Dossier (PDF)<br/>• Ground Raids & Machinery Seizures"]
        TRIAGE_BLOCK --> DOSSIER_BLOCK
    end

    CAPTURE -->|"HTTPS Multipart POST"| GEMINI_BLOCK
    CAPTURE -->|"Zone Sector Query"| SENTINEL_BLOCK
    GEMINI_BLOCK -->|"Visual Impact Factor"| CALC_BLOCK
    SENTINEL_BLOCK -->|"Spectral & Water Telemetry"| CALC_BLOCK
    CLASS_BLOCK -->|"Prioritized Case Dossier"| TRIAGE_BLOCK

    classDef b1Style stroke:#10b981,stroke-width:2px;
    classDef b2Style stroke:#06b6d4,stroke-width:2px;
    classDef b3Style stroke:#f59e0b,stroke-width:2px;
    classDef b4Style stroke:#ef4444,stroke-width:2px;

    B1:::b1Style
    B2:::b2Style
    B3:::b3Style
    B4:::b4Style
```  
> **Biogeographical Scope:** The Aravalli Mountain Range spanning Gujarat, Rajasthan, Haryana, and Delhi NCR.

---

## 1. Architectural Philosophy

The Aravalli Range is one of the oldest geological mountain formations on Earth and serves as northwest India's primary ecological shield against the eastern expansion of the Thar Desert. It functions as the critical groundwater recharge aquifer for Delhi NCR and surrounding states, and acts as an unbroken wildlife corridor between Sariska, Asola Bhatti, and Kumbhalgarh.

### The Core Challenges:
1. **Illegal Mining & Quarrying:** Mechanical stone excavation and unpermitted deep pit blasting.
2. **Deforestation:** Systematic felling of native climax *Anogeissus pendula* (Dhau) woodlands.
3. **Leachate & Waste Dumping:** Unregulated toxic dumping into abandoned mining pits.
4. **Encroachment:** Urban real estate speculation across notified Punjab Land Preservation Act (PLPA) lands.

### Engineering Response:
ARAVALLI SENTINEL bridges grassroots citizen observations with satellite remote sensing and Google Gemini AI to equip Forest Departments and Mining Task Forces with actionable, defensible intelligence without premature legal determinations.

---

## 2. High-Level System Architecture (Block Flowchart)

```mermaid
flowchart TD
    subgraph TIER1["BLOCK LAYER 1: CLIENT PRESENTATION TIER"]
        direction LR
        UI_CITIZEN["<b>Citizen Reporting Portal</b><br/>• Geotagged Photo Upload<br/>• Interactive GPS Pin Picker<br/>• Real-Time Gemini AI Preview"]
        UI_MAP["<b>Geospatial Operations Map</b><br/>• Dual Mode: Satellite / Street<br/>• 8 Monitored Eco-Zones<br/>• Zone Telemetry Slide Drawer"]
        UI_AUTH["<b>Authority Triage Desk</b><br/>• Status & Priority Queue<br/>• Mandatory Action Notes<br/>• Printable Official Dossier (PDF)"]
        UI_ASK["<b>Ask Aravalli AI Assistant</b><br/>• Grounded Law & Telemetry<br/>• PII Privacy Safeguard"]
    end

    subgraph TIER2["BLOCK LAYER 2: API GATEWAY & SECURITY ENFORCEMENT"]
        direction LR
        GW_RATE["<b>Rate Limiter</b><br/>• 300 req / 15-min window<br/>• Endpoint DDoS Shield"]
        GW_SEC["<b>Auth & Role Guard</b><br/>• JWT Bearer Verification<br/>• requireAuthority Middleware<br/>• Privilege Escalation Block"]
        GW_UPLOAD["<b>Upload Pipeline</b><br/>• Multer Memory Stream<br/>• MIME Verification (JPEG/PNG/WEBP)<br/>• 10MB Strict Ceiling"]
        GW_REDACT["<b>PII Privacy Redactor</b><br/>• Citizen Anonymization<br/>• Public Feed Sanitizer"]
    end

    subgraph TIER3["BLOCK LAYER 3: INTELLIGENCE & TELEMETRY PROCESSORS"]
        direction LR
        PROC_GEMINI["<b>Google Gemini 2.0 AI Engine</b><br/>• Multimodal Evidence Vision<br/>• Structured JSON Extraction<br/>• Uncertainty Disclaimers<br/>• Ranger Verification Steps"]
        PROC_GEO["<b>Geospatial Telemetry Provider</b><br/>• Copernicus Sentinel-2 MSI<br/>• Landsat-9 OLI-2 Telemetry<br/>• 10m NDVI Time-Series<br/>• Hydrological Stress Index"]
        PROC_RISK["<b>Explainable Risk Engine</b><br/>• Mining Risk (30%)<br/>• Vegetation Loss (25%)<br/>• Water Stress (20%)<br/>• Citizen Evidence (15%)<br/>• Historical Trend (10%)"]
    end

    subgraph TIER4["BLOCK LAYER 4: DATA PERSISTENCE & AUDIT VAULT"]
        direction LR
        STORE_DB["<b>Cloud Firestore / Local Store</b><br/>• Verified Zones Collection<br/>• Ingested Reports Collection<br/>• Least-Privilege Rules"]
        STORE_FILE["<b>Firebase Storage / Vault</b><br/>• Encrypted Evidence Photos<br/>• Forensic Image Hashes"]
        STORE_AUDIT["<b>Forensic Audit Trail</b><br/>• Officer Identity & Timestamp<br/>• Action Notes & Memo Trail<br/>• Non-Repudiable History"]
    end

    %% Client to Gateway Connections
    UI_CITIZEN -->|"POST /api/reports (Multipart)"| GW_UPLOAD
    UI_MAP -->|"GET /api/zones"| GW_RATE
    UI_AUTH -->|"PATCH /api/reports/:id/status"| GW_SEC
    UI_ASK -->|"POST /api/ai/ask-aravalli"| GW_RATE

    %% Gateway to Processing Connections
    GW_UPLOAD -->|"Validate Image Buffer"| GW_SEC
    GW_SEC -->|"Sanitized Image & Context"| PROC_GEMINI
    GW_SEC -->|"Zone Coordinates & Bounds"| PROC_GEO

    %% Processing to Risk Engine
    PROC_GEMINI -->|"Visual Threat Impact (0–100)"| PROC_RISK
    PROC_GEO -->|"NDVI & Aquifer Anomaly Index"| PROC_RISK

    %% Processing to Persistence
    PROC_RISK -->|"Computed Score & Breakdown"| STORE_DB
    GW_UPLOAD -->|"Stream Raw Evidence"| STORE_FILE
    GW_SEC -->|"Log Status Change & Notes"| STORE_AUDIT

    %% Persistence Feedback to UI
    STORE_DB -.->|"Raw Report Data"| GW_REDACT
    GW_REDACT -.->|"Redacted Public Feed"| UI_MAP
    STORE_DB -.->|"Priority Case Queue"| UI_AUTH
    STORE_AUDIT -.->|"Audit Chain of Custody"| UI_AUTH

    %% Styling
    classDef t1 stroke:#38bdf8,stroke-width:2px;
    classDef t2 stroke:#818cf8,stroke-width:2px;
    classDef t3 stroke:#f59e0b,stroke-width:2px;
    classDef t4 stroke:#10b981,stroke-width:2px;

    TIER1:::t1
    TIER2:::t2
    TIER3:::t3
    TIER4:::t4
```

<details>
<summary>View ASCII Text Topology</summary>

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT PRESENTATION LAYER                       │
│  React 18 + Vite + Tailwind CSS + Lucide Icons + Leaflet / Google Maps │
├────────────────────────────────────────────────────────────────────────┤
│  • Public Ecological Landing Page                                      │
│  • Geospatial Risk Operations Map (Topographic / Satellite)            │
│  • Citizen Threat Reporting Portal (Photo Upload & GPS Pin Picker)     │
│  • Authority Enforcement Triage Desk (Role-Gated Case Management)      │
│  • Grounded "Ask Aravalli" AI Ecological Law Assistant                 │
│  • Printable Official Incident Dossier Generator                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / REST API
┌──────────────────────────────────▼─────────────────────────────────────┐
│                       BACKEND API & SECURITY LAYER                     │
│               Node.js 24 + Express (ES Modules) + Helmet + Zod         │
├────────────────────────────────────────────────────────────────────────┤
│  • Auth & Role Guard Middleware (Prevents Citizen Privilege Escalation)│
│  • Multer Memory Upload Pipeline (Max 10MB, Strict Image MIME Checks)  │
│  • Rate Limiter (300 requests / 15 min window)                         │
│  • Public Citizen Privacy Redactor (Redacts Phone/Email/Identity)      │
└───────────────────┬─────────────────────────────────┬──────────────────┘
                    │                                 │
     ┌──────────────▼──────────────┐   ┌──────────────▼─────────────┐
     │       AI INTELLIGENCE       │   │    GEOSPATIAL & TELEMETRY  │
     │      Google Gemini API      │   │ Copernicus Sentinel-2 / EE │
     ├─────────────────────────────┤   ├────────────────────────────┤
     │ • Multimodal Evidence Vision│   │ • 10m Multispectral Bands  │
     │ • Visual Indicator Extractor│   │ • Mean NDVI Anomaly Time-  │
     │ • Limitations & Uncertainty │   │   Series                   │
     │ • Ranger Verification Steps │   │ • Surface Water Indices    │
     │ • Strict Non-Defamation     │   │ • Eco-Sensitive Boundaries │
     └──────────────┬──────────────┘   └──────────────┬─────────────┘
                    │                                 │
                    └────────────────┬────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                 THE EXPLAINABLE ARAVALLI RISK ENGINE                   │
├────────────────────────────────────────────────────────────────────────┤
│  Formula:                                                              │
│  Risk = (Mining * 0.30) + (VegLoss * 0.25) + (Water * 0.20) +          │
│         (Citizen * 0.15) + (History * 0.10)                            │
│                                                                        │
│  Classification Bands:                                                 │
│  • SAFE: 0–30 | WATCH: 31–50 | HIGH RISK: 51–75 | CRITICAL: 76–100     │
│  • Proportional Re-normalization with Missing-Factor Transparency      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                     DATA PERSISTENCE & AUDIT STORE                     │
├────────────────────────────────────────────────────────────────────────┤
│  • Primary: Firebase Cloud Firestore & Firebase Storage Bucket         │
│  • Fallback: High-Fidelity Local In-Memory Development Store           │
│  • Chain of Custody: Non-repudiable audit logs with officer IDs        │
└────────────────────────────────────────────────────────────────────────┘
```
</details>

---

## 3. The Explainable Risk Engine Mathematical Specification

The platform rejects opaque machine learning scoring in favor of an **explainable, deterministic, multi-factor ecological index** that can be presented in court or at regulatory hearings.

$$\text{Risk Score} = \sum_{i=1}^{5} (F_i \times W_i)$$

| Factor ($F_i$) | Weight ($W_i$) | Ecological & Remote Sensing Basis |
| :--- | :---: | :--- |
| **Illegal Mining Risk** | **30%** | Proximity to unpermitted quarry cuts, blasting acoustic events, and heavy 10-wheeler dumper haul trails. |
| **Vegetation & Canopy Loss** | **25%** | Copernicus Sentinel-2 NDVI degradation index, canopy fragmentation, and native Dhau tree felling. |
| **Aquifer & Water Stress** | **20%** | Groundwater table drawdown, check-dam breach, and seasonal nallah blockage from quarry overburden. |
| **Citizen Ground Evidence** | **15%** | Density, frequency, and corroborated proximity of citizen alerts logged within the past 30 days. |
| **Historical Land Cover Trend**| **10%** | Decadal transition rate from protected deemed forest to degraded rocky scrub. |

### Handling Missing Telemetry Transparently:
If one or more vectors are unavailable (e.g. cloud cover obscuring optical NDVI), the engine does not fabricate values. It calculates:

$$\text{Available Weight Sum } \Omega = \sum_{k \in \text{available}} W_k$$
$$\text{Adjusted Factor Weight } W'_k = \frac{W_k}{\Omega}$$

The calculation output explicitly sets `transparency.isComplete = false`, lists every missing factor, and includes a prominent notice:
`"Score recalculated across 80% available weight. Missing: waterStress."`

---

## 4. Google Gemini Multimodal Vision Integration

Evidence analysis runs on the backend server (`POST /api/reports` and `/api/ai/analyze-evidence`) to guarantee that client applications never possess or expose Gemini API keys.

### Strict Legal & Scientific Constraints:
1. **Assessment, Not Conviction:** Output is marked as an *AI Ecological Assessment* and explicitly disclaims being a judicial finding of guilt.
2. **Technical Limitations Disclosed:** Optical ambiguity, lack of elevation models, and seasonal dry deciduous leaf shedding are clearly reported.
3. **Actionable Ranger Protocol:** Generates a human-in-the-loop field verification checklist (e.g., *Check Khasra revenue map for PLPA Section 4 status*, *Total-station boundary survey*).

---

## 5. Security & Role Architecture

- **Least Privilege:** Public users cannot register as authorities or pass an authority role token.
- **Server Verification:** Authority status is checked on the server using verified institutional credentials or `AUTHORITY_INVITE_SECRET`.
- **Citizen Anonymity:** Citizen names, phone numbers, and IP addresses are completely redacted from public APIs.
- **Audit Immutability:** Case status updates require mandatory action notes, officer timestamps, and cannot be deleted from the audit trail.
