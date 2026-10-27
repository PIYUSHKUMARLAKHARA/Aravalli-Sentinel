# ARAVALLI SENTINEL — End-to-End Evaluation & Demo Script

Follow this 5-minute walkthrough to test all core capabilities of ARAVALLI SENTINEL:

---

## Prerequisites & Launch

1. Start Backend in one terminal:
   ```powershell
   npm run dev:backend
   ```
   *(Running at `http://localhost:5000`)*

2. Start Frontend in a second terminal:
   ```powershell
   npm run dev:frontend
   ```
   *(Running at `http://localhost:5173`)*

3. Open your browser to `http://localhost:5173`.

---

## Step 1: Open the Geospatial Risk Map & Select a Risk Zone

1. Click **"Risk Map"** in the top navigation bar.
2. Observe the interactive Aravalli map displaying all 10 monitored sectors across Gujarat, Rajasthan, Haryana, and Delhi NCR with color-coded risk circles:
   - Green (SAFE: 0–30)
   - Amber (WATCH: 31–50)
   - Orange (HIGH RISK: 51–75)
   - Pulsing Red (CRITICAL: 76–100)
3. Click on the marker for **Bandhwari Hill Ridge & Eco-Buffer** (Score: 84.5 / 100, CRITICAL).
4. **Inspect the Zone Drawer:**
   - Observe the 5-factor breakdown bars: Illegal Mining (88/100), Vegetation Loss (82/100), Water Stress (80/100), Citizen Evidence (75/100), Historical Change (90/100).
   - Review the Satellite Telemetry card showing Copernicus Sentinel-2 NDVI Anomaly (`-34.2%`).
   - Notice the Mandatory Action Protocol: *"Immediate enforcement raid required. Supreme Court ban enforcement, machinery seizure, and FIR filing."*
5. Click **"Submit Citizen Report in this Sector"** at the bottom of the drawer.

---

## Step 2: Submit Threat Evidence & Coordinates

1. You are automatically routed to the **Report Threat** page with coordinates pre-populated.
2. Select Threat Category: **"Illegal Mining & Quarrying"**.
3. Upload an evidence image or select any sample image (e.g., photo of quarry excavation or hill cutting).
4. Enter Ground Observations:
   > *"Continuous night-time blasting and heavy hydraulic excavator movement observed near hill cutting. Three dumpers without registration plates were seen exiting toward the ridge bypass."*
5. Notice the **Interactive Map Pin Picker**: click anywhere on the mini-map to fine-tune the GPS coordinates.
6. Click **"Preview Gemini AI Assessment Before Submitting"**.
7. Inspect the real-time AI response:
   - **Observed Visual Indicators:** Terraced excavation cuts, rock overburden, excavator tracks.
   - **Technical Uncertainty:** Disclaims precision boundaries without cadastral revenue maps.
   - **Verification Checklist:** Actionable 4-step checklist for forest rangers.
   - **Legal Disclaimer:** Prominent notice confirming AI is not legal proof.
8. Click **"Submit Official Threat Report"**.
9. Observe the confirmation banner with unique tracking reference (e.g. `rep-aravalli-XXXXXX`) and the notice that citizen personal identity is redacted for safety.

---

## Step 3: Authority Triage & Case Status Update

1. In the top right corner of the navbar, click the **Persona Selector** and click:
   **"Forest Authority (Officer)"** (Officer Rajesh Sharma, DFO).
2. Click **"Authority Triage"** in the navigation bar.
3. Observe the operations metrics banner: Total Ingested, Critical Risk Flagged, Pending Triage.
4. Locate the newly submitted report or select **`rep-aravalli-2026-001`**.
5. Click **"Inspect"** to open the case dossier modal.
6. Scroll down to the **"Update Official Case Status & Dispatch Notes"** form:
   - Change Status from `under_review` to **`verified`**.
   - Enter Action Notes:
     > *"On-site raid conducted with Mining Inspector. Illegal quarrying operation halted and 2 hydraulic excavators impounded at Gurugram forest post. FIR registered."*
   - Click **"Confirm Status Update & Save Audit Log"**.
7. Observe the updated audit log displaying the acting authority's name, timestamp, and action notes.

---

## Step 4: Generate Printable Incident Dossier

1. In the triage modal or table, click the **"Dossier"** button.
2. Inspect the official printable dossier formatted for administrative action:
   - Official Decision-Support Header
   - Field coordinates & threat category
   - Evidence photograph thumbnail
   - Gemini AI ecological assessment
   - 5-factor Risk Engine score table
   - Chain of Custody & Enforcement Audit Log
   - Officer Signature & Countersignature blocks.
3. Click **"Print / Save as PDF"** to trigger the browser's clean print dialog.

---

## Step 5: Ask Aravalli Conversational AI

1. Click **"Ask Aravalli"** in the navigation bar.
2. Click the suggested pill: *"Why is Bandhwari Hill Ridge at Critical Risk?"*
3. Observe the AI explanation citing the specific 5 weights, quarrying proximity, and aquifer depletion.
4. Ask a legal question: *"What did the Supreme Court order regarding Aravalli mining?"*
5. Review the grounded response citing the landmark *M.C. Mehta vs Union of India* judgment and the Punjab Land Preservation Act (PLPA).
