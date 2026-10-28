import fs from 'fs';
import path from 'path';

console.log('🌱 ARAVALLI SENTINEL — Demo Data Seeder');
console.log('Reading standardized datasets from datasets/ ...\n');

const citizenCsv = path.resolve('datasets/citizen_reports/sample_citizen_reports.csv');
const envCsv = path.resolve('datasets/environmental_observations/sample_environmental_observations.csv');
const zonesGeoJson = path.resolve('datasets/risk_zones/sample_risk_zones.geojson');

if (!fs.existsSync(citizenCsv) || !fs.existsSync(envCsv) || !fs.existsSync(zonesGeoJson)) {
  console.error('❌ Missing core dataset files. Please run validation first.');
  process.exit(1);
}

const citizenLines = fs.readFileSync(citizenCsv, 'utf-8').split(/\r?\n/).filter(Boolean).slice(1);
const envLines = fs.readFileSync(envCsv, 'utf-8').split(/\r?\n/).filter(Boolean).slice(1);
const zonesData = JSON.parse(fs.readFileSync(zonesGeoJson, 'utf-8'));

console.log(`✅ Loaded ${citizenLines.length} Citizen Reports from datasets/citizen_reports/`);
console.log(`✅ Loaded ${envLines.length} Environmental Observations from datasets/environmental_observations/`);
console.log(`✅ Loaded ${zonesData.features.length} GeoJSON Risk Zones from datasets/risk_zones/`);

// Generate runtime seed summary JSON
const seedSummary = {
  timestamp: new Date().toISOString(),
  datasetProvenance: 'synthetic_demonstration',
  citizenReportsCount: citizenLines.length,
  environmentalObservationsCount: envLines.length,
  riskZonesCount: zonesData.features.length,
  zones: zonesData.features.map(f => ({
    zoneId: f.properties.zone_id,
    zoneName: f.properties.zone_name,
    riskLevel: f.properties.risk_level,
    riskScore: f.properties.risk_score
  }))
};

const outputPath = path.resolve('backend/src/data/seededDatasetSummary.json');
fs.writeFileSync(outputPath, JSON.stringify(seedSummary, null, 2), 'utf-8');
console.log(`\n💾 Saved runtime dataset seed manifest to: ${outputPath}`);
console.log('🚀 Local runtime store is synchronized with datasets/');
