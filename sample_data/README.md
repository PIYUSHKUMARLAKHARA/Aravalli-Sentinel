# Sample Environmental Incident Datasets

> **⚠️ DEMONSTRATION NOTICE:**  
> All records in this directory (`environmental_incidents.json` and `environmental_incidents.csv`) contain **entirely synthetic demonstration data** created for software testing, hackathon evaluation, and local development.  
> - None of these records represent verified real-world legal infractions against specific private individuals or corporations.  
> - Locations represent plausible ecological sectors across the Aravalli Mountain Range (spanning Rajasthan, Haryana, Delhi NCR, and Gujarat).  
> - Unknown or unverified attributes (such as unassigned enforcement officers) are represented as `null` (or empty strings in CSV) rather than fabricated values.

---

## 1. File Inventory

| File | Format | Record Count | Description |
| :--- | :---: | :---: | :--- |
| [`environmental_incidents.json`](environmental_incidents.json) | JSON | 12 | Canonical array of structured incident objects matching the application data model. |
| [`environmental_incidents.csv`](environmental_incidents.csv) | CSV | 12 | RFC 4180 compliant tabular export with identical records and field mappings. |

---

## 2. Schema Specification & Field Definitions

| Field Name | Type | Allowed Values / Constraints | Description |
| :--- | :---: | :--- | :--- |
| `incident_id` | String | `INC-ARV-YYYY-XXX` format | Unique synthetic tracking identifier for the report. |
| `title` | String | Max 150 characters | Brief descriptive summary of the observed activity. |
| `incident_type` | String | Enum: `Illegal Mining & Quarrying`, `Deforestation / Tree Felling`, `Encroachment & Construction`, `Toxic Waste Dumping`, `Ground Water Depletion / Deep Boring`, `Other Ecological Threat` | Primary environmental threat category as recognized by the Aravalli Sentinel classification engine. |
| `description` | String | 10 to 2000 characters | Ground observation notes provided by the reporting citizen sentinel. |
| `location_name` | String | Text description | Named sector, landmark, or village vicinity. |
| `zone_id` | String | `zone-*-*` reference | Associated Aravalli ecological monitoring zone ID. |
| `latitude` | Float | `-90.0` to `90.0` (Aravalli range: ~24.0° to 28.5°N) | Decimal GPS latitude coordinate. |
| `longitude` | Float | `-180.0` to `180.0` (Aravalli range: ~72.5° to 77.3°E) | Decimal GPS longitude coordinate. |
| `reported_at` | ISO 8601 | UTC Timestamp (e.g., `2026-10-24T22:30:00Z`) | Timestamp when the citizen logged the alert. |
| `evidence_reference`| String | Relative path URI | Simulated photographic evidence artifact reference. |
| `risk_score` | Float | `0.0` to `100.0` | Explainable Risk Engine composite index computed from the 5 environmental vectors. |
| `risk_level` | String | Enum: `SAFE`, `WATCH`, `HIGH RISK`, `CRITICAL` | Severity classification band based on the risk score. |
| `verification_status`| String | Enum: `pending`, `under_review`, `verified`, `resolved`, `rejected` | Official administrative case workflow status. |
| `assigned_authority`| String or `null` | Institutional authority title or `null` | Acting officer or agency handling field inspection. |
| `is_synthetic` | Boolean | `true` | Marker flag explicitly distinguishing demo data. |

---

## 3. Threat Types & Severity Distribution in Sample Data

The 12 sample incidents cover the primary ecological pressures confronting the Aravalli ecosystem:

| Threat Category | Incident Count | Sample Zones Covered |
| :--- | :---: | :--- |
| **Illegal Mining & Quarrying** | 3 | Bandhwari Ridge (HR), Khetri Belt (RJ), Nuh Ridge (HR) |
| **Deforestation / Tree Felling** | 2 | Sariska Corridor (RJ), Jamwa Ramgarh (RJ) |
| **Encroachment & Construction** | 2 | Asola Bhatti Buffer (DL/HR), Mangar Bani Sacred Grove (HR) |
| **Toxic Waste Dumping** | 2 | Bandhwari Leachate Pit (HR), Ambaji Foothills (GJ) |
| **Ground Water Depletion / Deep Boring** | 2 | Jalore Granite Outcrops (RJ), Kumbhalgarh Foothills (RJ) |
| **Other Ecological Threat** | 1 | Mount Abu Eco-Sensitive Zone (RJ) |

---

## 4. How to Use This Sample Data

### In Local Development
The sample datasets can be used for:
1. **API Testing:** Seeding test environments or mocking HTTP payloads for `/api/reports`.
2. **Geospatial Plotting:** Loading sample coordinates onto GIS platforms (QGIS, ArcGIS, Mapbox, Leaflet).
3. **Data Science & Analytics:** Validating statistical distributions of risk scores against spatial clustering.

### Example: Querying via Node.js
```javascript
import fs from 'fs';

const incidents = JSON.parse(
  fs.readFileSync('./sample_data/environmental_incidents.json', 'utf8')
);

// Filter critical priority incidents requiring immediate enforcement
const criticalIncidents = incidents.filter(i => i.risk_level === 'CRITICAL');
console.log(`Found ${criticalIncidents.length} critical priority incidents.`);
```
