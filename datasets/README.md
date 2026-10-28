# ARAVALLI SENTINEL — Datasets Repository

## Overview
This directory contains machine-readable, scientifically grounded demonstration datasets, geospatial boundaries, and image metadata for **ARAVALLI SENTINEL** — an AI-powered early-warning and ecological monitoring platform for the Aravalli ecosystem.

All records are structured to enable hackathon judges, GIS analysts, and machine learning researchers to inspect, benchmark, and evaluate the platform's decision pipeline.

---

## Directory Inventory

```
datasets/
├── citizen_reports/
│   ├── sample_citizen_reports.csv      # 33 realistic citizen threat reports
│   └── images/                         # 33 sample evidence JPEG images
├── environmental_observations/
│   └── sample_environmental_observations.csv # 52 remote sensing grid observations
├── risk_zones/
│   └── sample_risk_zones.geojson       # 10 monitored Aravalli ecological zones (GeoJSON)
├── image_metadata/
│   └── sample_image_metadata.csv       # Licenses, provenance, URLs, and hashes
├── data_dictionary.md                  # Comprehensive schema and unit specifications
├── sources_and_licenses.md             # Attribution, open-data sources, and legal terms
├── validation_report.md                # Automated integrity and coordinate audit results
└── README.md                           # This inventory guide
```

---

## Dataset Contents & Summary

### 1. Citizen Threat Reports (`citizen_reports/sample_citizen_reports.csv`)
- **Record Count:** 33 records (exceeds requirement of 30).
- **Spatial Bounds:** Latitude `24.18°N` to `28.88°N`, Longitude `72.84°E` to `77.34°E` (WGS 84).
- **Threat Categories Covered:**
  - `Illegal Mining`: Mechanized blasting, quarry cuts, granite cratering.
  - `Deforestation`: Indigenous *Anogeissus pendula* (Dhau) tree felling, road carving.
  - `Water Stress`: Check-dam blockage, spring desiccation, deep borewell drawdown.
  - `Toxic Dumping`: Solid waste leachate, slurry tipping, industrial effluent.
  - `Encroachment`: Masonry boundary walls, unauthorized scrap yards on PLPA lands.
  - `Land Degradation`: Mine tailing dust bowls, ridge gullying, soil crust erosion.
- **Verification Statuses:** `pending`, `under_review`, `verified`, `resolved`, `rejected`.
- **Provenance:** Tagged with `is_synthetic = true`.

### 2. Environmental Observations (`environmental_observations/sample_environmental_observations.csv`)
- **Record Count:** 52 records (exceeds requirement of 50).
- **Sensors Modeled:** Copernicus Sentinel-2 MSI (10m) and USGS Landsat-9 OLI-2 (30m).
- **Metrics Included:**
  - `vegetation_index` (Normalized Difference Vegetation Index, NDVI: `0.14` to `0.58`).
  - `water_stress_indicator` (`35.2` to `93.5`).
  - `land_disturbance_indicator` (`28.6` to `89.4`).
- **Provenance:** Tagged with `is_synthetic = true`.

### 3. Risk Zones GeoJSON (`risk_zones/sample_risk_zones.geojson`)
- **Format:** GeoJSON `FeatureCollection` (RFC 7946).
- **Corridors Included:** Bandhwari, Sariska Buffer, Asola Bhatti, Nahargarh Ridge, Tosham Hills, Kumbhalgarh, Khetri Copper Belt, Sirohi Foothills, Idar Granite, and Mangar Bani Sacred Grove.
- **Risk Distribution:**
  - `CRITICAL` (76–100): 4 zones (Bandhwari, Sariska Buffer, Tosham, Mangar Bani)
  - `HIGH RISK` (51–75): 3 zones (Asola Bhatti, Nahargarh, Kumbhalgarh)
  - `WATCH` (31–50): 3 zones (Khetri, Sirohi, Idar)

### 4. Photographic Evidence & Metadata (`citizen_reports/images/`, `image_metadata/`)
- Contains 33 valid demonstration JPEG images linked to every citizen report.
- Metadata table records provenance URLs, authors, licenses (`CC0`, `CC BY 4.0`, `CC BY-SA 4.0`), and SHA-256 integrity digests.

---

## How Data Was Generated
1. **Coordinate Verification:** Geographic centroids were chosen using real Aravalli topographic features across Haryana, Rajasthan, Delhi NCR, and Gujarat.
2. **Ecological Modeling:** NDVI and moisture stress distributions simulate post-monsoon (October) conditions based on published Forest Survey of India and ISRO Bhuvan surveys.
3. **Non-Defamation Constraint:** No specific real-world citizen names, phone numbers, or operational leaseholders are named.

---

## Dataset Validation

Validate the entire dataset suite at any time using the automated test runner:

```bash
npm run validate:dataset
# or directly:
node scripts/validate_dataset.js
```

Validation guarantees:
- ✅ Zero missing image references
- ✅ Zero out-of-bounds GPS coordinates
- ✅ Strict compliance with risk-band thresholds
- ✅ Zero duplicate report, observation, or zone IDs

---

## Seeding Demo Data into Local Database

To load these datasets into the application's runtime store:

```bash
npm run seed:data
# or directly:
node scripts/seed_demo_data.js
```
