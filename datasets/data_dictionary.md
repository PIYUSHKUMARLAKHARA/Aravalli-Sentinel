# ARAVALLI SENTINEL — Dataset Data Dictionary

## 1. Overview
This document specifies the exact schema, data types, value constraints, coordinate reference systems (CRS), and semantic descriptions for all tabular and geospatial data packages in `datasets/`.

All spatial coordinates adhere to the **WGS 84 (EPSG:4326)** Coordinate Reference System, representing the Aravalli biogeographical corridor across Gujarat, Rajasthan, Haryana, and Delhi NCR.

---

## 2. Table: Citizen Reports (`datasets/citizen_reports/sample_citizen_reports.csv`)

| Field Name | Type | Allowed Values / Range | Nullable | Description & Domain Meaning |
| :--- | :--- | :--- | :---: | :--- |
| `report_id` | String | `CR-YYYY-XXX` (e.g., `CR-2026-001`) | No | Unique alphanumeric incident report identifier. |
| `reported_at` | ISO 8601 String | `YYYY-MM-DDTHH:mm:ssZ` | No | UTC timestamp when the observation was logged. |
| `latitude` | Float | `24.0000` to `28.9000` | No | Latitude in decimal degrees (WGS 84). Validated within Aravalli belt. |
| `longitude` | Float | `72.5000` to `77.5000` | No | Longitude in decimal degrees (WGS 84). Validated within Aravalli belt. |
| `location_name` | String | UTF-8 Text (max 255 chars) | No | Recognized administrative sector, ridge, or village name. |
| `threat_type` | Enum | `Illegal Mining`, `Deforestation`, `Water Stress`, `Toxic Dumping`, `Encroachment`, `Land Degradation` | No | Primary suspected environmental threat category. |
| `description` | String | Free text (10–1000 chars) | No | Field description of observed damage, machinery, or impacts. |
| `image_path` | String | Relative path (e.g., `datasets/citizen_reports/images/...`) | No | Local relative filepath to photographic evidence. |
| `source_type` | Enum | `citizen_mobile`, `field_ranger`, `community_ngo`, `patrol_unit` | No | Origin and collection method of the field sighting. |
| `verification_status` | Enum | `pending`, `under_review`, `verified`, `resolved`, `rejected` | No | State of official Forest Department / Taskforce auditing. |
| `evidence_quality` | Enum | `high`, `medium`, `low` | No | Quality assessment based on resolution, clarity, and geotag. |
| `ai_confidence` | Float | `0.00` to `1.00` | No | Confidence estimate returned by Gemini 2.0 multimodal analysis. |
| `risk_score` | Float | `0.0` to `100.0` | No | Deterministic risk score computed by the Explainable Risk Engine. |
| `risk_level` | Enum | `SAFE` (0–30), `WATCH` (31–50), `HIGH RISK` (51–75), `CRITICAL` (76–100) | No | Operational priority band. |
| `is_synthetic` | Boolean | `true`, `false` | No | Provenance flag. `true` indicates realistic synthetic demo data. |

---

## 3. Table: Environmental Observations (`datasets/environmental_observations/sample_environmental_observations.csv`)

| Field Name | Type | Allowed Values / Range | Units | Description & Scientific Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `observation_id` | String | `EO-YYYY-XXX` | None | Unique remote sensing observation identifier. |
| `observation_date`| Date String | `YYYY-MM-DD` | None | Date of satellite pass or sensor capture. |
| `latitude` | Float | `24.0000` to `28.9000` | Decimal Degrees | Center latitude of the observed 100m grid cell. |
| `longitude` | Float | `72.5000` to `77.5000` | Decimal Degrees | Center longitude of the observed 100m grid cell. |
| `region` | String | Free text | None | Named physiographic or ecological zone. |
| `vegetation_index`| Float | `0.00` to `1.00` | Normalized NDVI | Sentinel-2 / Landsat Normalized Difference Vegetation Index. Higher = denser canopy. |
| `water_stress_indicator` | Float | `0.0` to `100.0` | Normalized Index | Aquifer drawdown, nallah blockage, and check-dam desiccation index. Higher = more stress. |
| `land_disturbance_indicator` | Float | `0.0` to `100.0` | Normalized Index | Soil exposure, rock excavation, and mechanical clearing index. Higher = severe disturbance. |
| `data_source` | String | `Sentinel-2 MSI`, `Landsat-9 OLI-2`, `ISRO Bhuvan` | None | Satellite sensor or ground telemetry provider. |
| `dataset_id` | String | Catalog URN (e.g. `COPERNICUS/S2_SR_HARMONIZED`) | None | Earth observation archive asset collection ID. |
| `observation_quality` | Enum | `HIGH`, `MEDIUM`, `CLOUD_FILTERED` | None | Quality flag after cloud and atmospheric filtering. |
| `is_synthetic` | Boolean | `true`, `false` | None | Provenance flag indicating whether observation is modeled. |

---

## 4. GeoJSON: Risk Zones (`datasets/risk_zones/sample_risk_zones.geojson`)

- **Format:** GeoJSON `FeatureCollection` (RFC 7946).
- **Coordinate Reference System:** WGS 84 (`EPSG:4326`), `[longitude, latitude]`.
- **Geometry Types:** `Polygon` defining monitored ridge corridors.
- **Properties:**
  - `zone_id` (String): e.g. `ZONE-BANDHWARI-01`
  - `zone_name` (String): e.g. `Bandhwari Leachate & Quarry Sector`
  - `state` (String): `Haryana`, `Rajasthan`, `Delhi NCR`, `Gujarat`
  - `threat_category` (Enum): Corresponding primary threat
  - `risk_score` (Float): 0.0 to 100.0
  - `risk_level` (Enum): `SAFE`, `WATCH`, `HIGH RISK`, `CRITICAL`
  - `source_type` (String): `hybrid_sentinel_field`
  - `observation_date` (String): `YYYY-MM-DD`
  - `is_synthetic` (Boolean): Explicit provenance flag

---

## 5. Table: Image Metadata (`datasets/image_metadata/sample_image_metadata.csv`)

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `image_id` | String | Unique image asset identifier (e.g. `IMG-001`). |
| `file_name` | String | Base filename of the image in `datasets/citizen_reports/images/`. |
| `relative_path` | String | Relative disk path from workspace root. |
| `category` | String | Environmental threat or control category depicted. |
| `source_url` | String | Public archival or open-access provenance URL. |
| `creator` | String | Originating agency, researcher, or open contributor. |
| `license` | String | Permissive license (e.g. `CC0 1.0 Universal`, `CC BY 4.0`, `Public Domain`). |
| `attribution_requirements` | String | Required citation text. |
| `sha256_hash` | String | SHA-256 cryptographic digest ensuring file integrity. |
| `description` | String | Forensic description of visual features in the photograph. |
