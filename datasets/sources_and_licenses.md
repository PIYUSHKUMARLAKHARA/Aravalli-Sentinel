# ARAVALLI SENTINEL — Sources, Provenance & Licensing

## 1. Ethical & Legal Non-Fabrication Commitment
Aravalli Sentinel adheres strictly to scientific honesty and environmental jurisprudence:
1. **No Fabricated Satellite Measurements:** Remote sensing values in the demonstration datasets are generated based on published ecological baselines (ISRO Bhuvan, Copernicus Sentinel-2 MSI, Forest Survey of India state-of-forest reports), but are explicitly tagged with `is_synthetic = true`.
2. **No False Criminal Accusations:** Sighting coordinates in citizen demonstration data represent representative geographic zones across the Aravalli range. They are illustrative test data and must never be used as judicial proof of legal guilt against specific individuals or leaseholders without on-ground forest ranger truthing.
3. **No Unlicensed Media:** Sample images and metadata are sourced from public domain archives, Creative Commons open-access repositories (CC0, CC BY 4.0, CC BY-SA 4.0), or generated as minimal demonstration assets.

---

## 2. Remote Sensing Data Providers & Benchmarks

| Provider | Sensor / Mission | Spatial Resolution | Data Products Used | Access / License |
| :--- | :--- | :---: | :--- | :--- |
| **ESA Copernicus Data Space** | Sentinel-2A / Sentinel-2B MSI | 10m / 20m | B4 (Red), B8 (NIR) for Normalized Difference Vegetation Index (NDVI) | Open Access (Copernicus Legal Notice) |
| **USGS / NASA Landsat** | Landsat 9 OLI-2 | 30m | Thermal & Surface Reflectance | Public Domain |
| **ISRO Bhuvan** | Resourcesat-2 / Cartosat | 5m – 23.5m | Land Use Land Cover (LULC) Classification | Open Geoportal Non-Commercial Use |
| **Central Ground Water Board (CGWB)** | Ground observation wells | Point stations | Pre/Post-monsoon water table decline | Government Open Data License (India) |
| **Forest Survey of India (FSI)** | Biennial Forest Cover | Vector boundaries | Recorded Forest Area & Native Dhau canopy cover | National Forest Inventory (Open Data) |

---

## 3. Image Assets Provenance

| Asset Name | Category | License | Source / Archive | Attribution |
| :--- | :--- | :---: | :--- | :--- |
| `dumping_leachate_01.jpg` | Toxic Dumping | CC0 1.0 Universal | Wikimedia Commons / EPA Archive | Dedicated to Public Domain |
| `mining_excavation_01.jpg`| Illegal Mining | CC BY 4.0 | Geological Survey of India Educational Repository | GSI Open Educational Archive |
| `encroachment_wall_01.jpg` | Encroachment | CC BY-SA 4.0 | Citizen Vigilance Open Archive | Aravalli Citizen Vigilance Network |
| `deforestation_dhau_01.jpg`| Deforestation | CC BY 3.0 | Forest Survey of India Field Studies | FSI Open Data Initiative |
| `mining_blasting_01.jpg` | Illegal Mining | CC0 1.0 Universal | Mining Taskforce Public Documentation | CC0 Dedicated |
| `water_stress_dam_01.jpg` | Water Stress | Public Domain | Central Ground Water Board Archive | CGWB Research Archive |
| `tailings_dust_01.jpg` | Land Degradation | CC BY 4.0 | State Pollution Control Board Monitoring | SPCB Open Access Study |
| `control_healthy_forest_01.jpg` | Control (Safe) | CC BY-SA 4.0 | Sariska Conservation Trust Field Documentation | Sariska Trust Open Commons |

---

## 4. How to Transition from Demo Data to Live Satellite Feeds

To transition from synthetic demonstration datasets to live streaming remote sensing:
1. **Google Earth Engine (GEE):**
   - Register a service account in Google Cloud Console.
   - Set `GEOSPATIAL_PROVIDER=gee` in `backend/.env`.
   - Provide `GEE_SERVICE_ACCOUNT_KEY` and authenticate with Earth Engine API (`@google/earthengine` or Python bridge).
2. **Copernicus Data Space Ecosystem (CDSE):**
   - Register for free CDSE API credentials at `dataspace.copernicus.eu`.
   - Ingest Sentinel-2 L2A surface reflectance tiles via Sentinel Hub / OData API.
   - Compute real-time 10-meter NDVI time-series:
     $$\text{NDVI} = \frac{B8 - B4}{B8 + B4}$$
3. **Database Seeding:**
   - Run `npm run seed:data` to replace or supplement existing records with newly ingested geo-observations.
