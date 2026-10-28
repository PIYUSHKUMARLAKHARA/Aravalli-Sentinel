# ARAVALLI SENTINEL — Security, Authorization & Privacy Architecture

**Platform:** Aravalli Sentinel — See the Threat. Predict the Risk. Protect the Aravallis.  
**Classification:** Security Architecture & Operational Specification  
**Version:** 1.0.0 (Production & Demonstration Standard)  

---

## 1. Security Architecture Overview

Aravalli Sentinel processes sensitive environmental threat data, including citizen ground sightings of suspected illegal mining, excavation machinery, and tree felling. Security is built into every layer using a defense-in-depth posture:

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Layer (Browser / Mobile)             │
│  - Citizen Sentinel UI        - Forest Authority Console    │
│  - Identity Redaction Notice  - Local Session Token Storage │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / Bearer Token
┌──────────────────────────────▼──────────────────────────────┐
│                 Security Middleware Layer                   │
│  - Helmet (CSP, Frameguard, Cross-Origin-Resource-Policy)   │
│  - CORS (Restricted origin: FRONTEND_URL)                   │
│  - Rate Limiter (300 requests / 15 minutes per IP)          │
│  - Multer In-Memory Stream Buffer (10MB Max, MIME Whitelist)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│             Authentication & Role Enforcement (RBAC)        │
│  - authenticateUser: Cryptographic token validation         │
│  - requireAuthority: Gated role enforcement                 │
│  - Privacy Redaction Filter: Strips citizen contact details │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Persistence & Storage                    │
│  - Cloud Firestore / In-Memory Fallback                     │
│  - Firebase Storage / Local Disk Storage                    │
│  - Immutable Audit Trails for Status Mutations              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Role-Based Access Control (RBAC)

The platform enforces strict separation between **Citizen Sentinels** and **Forest Authority Officers**:

| Persona / Role | Intended Users | Registration / Provisioning | Permitted Actions |
| :--- | :--- | :--- | :--- |
| **`citizen`** | Public citizens, environmentalists, community sentinels | Public registration (`/api/auth/register-citizen`) or Demo Persona | Submit threat reports, view personal submissions, run AI preview, inspect public risk maps |
| **`authority`** | Divisional Forest Officers (DFO), Mining Task Forces, Wildlife Wardens | Administrative provisioning (`/api/auth/register-authority` with `inviteSecret`) | View unredacted evidence, update case statuses, log official action notes, generate incident dossiers |
| **`admin`** | Department IT & State Environmental System Administrators | Pre-configured environment credentials | Provision new officers, rotate invite secrets, inspect full system telemetry |

### Threat Mitigation: Client-Side Role Tampering
- **Vulnerability:** Malicious actors attempt to supply `role: "authority"` in public registration payloads or modify local storage tokens.
- **Server Enforcement:**
  - `registerCitizen` ignores any role field in `req.body` and hardcodes `role: 'citizen'`.
  - Authority tokens are issued only upon server-side verification of `AUTHORITY_INVITE_SECRET` or via authorized officer credential lookup in `officerRegistry`.
  - Sensitive routes (`PATCH /api/reports/:id/status`) invoke `requireAuthority` middleware:
    ```javascript
    export function requireAuthority(req, res, next) {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required.' });
      }
      if (req.user.role !== 'authority' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: This operation requires verified Environmental Authority or Forest Department credentials.',
        });
      }
      next();
    }
    ```

---

## 3. Citizen Protection & Identity Privacy Protocol

Whistleblowers reporting illegal mining and commercial deforestation face real-world intimidation and safety risks. Aravalli Sentinel implements proactive identity privacy:

1. **Automatic Public Feed Redaction:**
   When non-authority callers fetch reports via `GET /api/reports`, the server executes `sanitizeReportForPublic()`:
   ```javascript
   function sanitizeReportForPublic(report) {
     return {
       ...report,
       citizenId: 'cit-redacted',
       citizenEmail: undefined,
       citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
       citizenPhone: undefined,
     };
   }
   ```
2. **Owner Verification on Personal History:**
   Citizens querying `GET /api/reports?myReports=true` receive only reports matching their authenticated `uid` or verified token email.
3. **No Unencrypted Personal Identifiable Information (PII) Storage:**
   Contact details are stored strictly in protected internal documents accessible solely by authorized enforcement officers conducting formal inspections.

---

## 4. File Upload & Media Storage Hardening

Citizen evidence uploads (photographs of mining pits, felling, and encroachment) present potential attack vectors (malicious executables, Zip bombs, MIME confusion).

### Hardening Safeguards:
1. **Memory Storage Buffer:** Uploaded files are parsed in RAM using Multer memory storage (`multer.memoryStorage()`), preventing unvalidated executables from landing on the filesystem.
2. **Strict MIME Whitelist:** Only `image/jpeg`, `image/png`, `image/webp`, and `image/heic` are permitted:
   ```javascript
   const fileFilter = (req, file, cb) => {
     const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
     if (allowedMimes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(new Error(`Unsupported file type: ${file.mimetype}. Only JPEG, PNG, WEBP, and HEIC are accepted.`), false);
     }
   };
   ```
3. **Upload Size Limit:** Capped at 10 MB per file to prevent Denial-of-Service (DoS) memory exhaustion.
4. **Sanitized File Names:** When written to disk, files are renamed using a cryptographic UUID and timestamp:
   `evidence-${Date.now()}-${random4Digits}${safeExt}`
   Direct client filenames with directory traversal tokens (`../`) are never used.

---

## 5. Input Validation & Parameter Sanitization

All incoming API requests are validated with **Zod** schemas before reaching controllers:

- **Threat Reports (`validateCreateReport`):**
  - `threatCategory`: Refined against an approved list of 12 ecological threat categories.
  - `description`: Minimum 10 characters, maximum 2,000 characters.
  - `latitude`: Validated numeric float in range `[-90, 90]`.
  - `longitude`: Validated numeric float in range `[-180, 180]`.
  - `locationName`: Minimum 2 characters, maximum 200 characters.
- **Status Updates (`validateUpdateStatus`):**
  - `status`: Enum constrained to `pending | under_review | verified | resolved | rejected`.
  - `actionNotes`: Minimum 5 characters, maximum 1,000 characters for the immutable audit trail.
- **Officer Login (`authorityLoginSchema`):**
  - `email`: Validated email format.
  - `password`: Minimum 6 characters.
- **Officer Provisioning (`authorityInviteSchema`):**
  - Requires `inviteSecret`, `fullName`, `email`, `department`, `designation`.

---

## 6. Immutable Audit Trail Logging

For every administrative action, status mutation, or case triage performed by Forest Authority personnel, the system appends a cryptographic audit log:

```json
{
  "action": "Status updated to VERIFIED",
  "by": "Officer Rajesh Sharma",
  "role": "authority",
  "department": "Haryana Forest Department & Aravalli Task Force",
  "timestamp": "2026-10-28T18:45:00.000Z",
  "notes": "Field inspection completed by Forest Ranger. Machinery seized under Forest Conservation Act."
}
```

Audit trails are append-only. Once logged, records cannot be deleted or re-ordered by users.

---

## 7. Environment Secret Management

Sensitive configuration parameters are kept strictly on the backend:

| Environment Variable | Sensitivity | Security Guideline |
| :--- | :---: | :--- |
| `AUTHORITY_INVITE_SECRET` | **CONFIDENTIAL** | Stored in `backend/.env`. Never commit to Git or expose in frontend bundles. |
| `GEMINI_API_KEY` | **CONFIDENTIAL** | Backend-only. Multimodal AI queries run exclusively on the Express server. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **CRITICAL** | Kept in local environment or mounted via Cloud Secret Manager. |
| `DEMO_BOOTSTRAP_ENABLED` | **OPERATIONAL** | Set to `true` in local development / hackathon evaluations; set to `false` in production. |

---

## 8. Statutory Disclaimer

> **Statutory Notice:** Aravalli Sentinel is an independent academic, civic, and hackathon project. It is not an official portal of the Ministry of Environment, Forest and Climate Change (MoEFCC), Rajasthan Forest Department, or Haryana Forest Department. Official statutory environmental enforcement actions must be routed through respective government bodies.
