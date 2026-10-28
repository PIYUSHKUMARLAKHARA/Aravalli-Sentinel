import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('datasets/citizen_reports/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Minimal valid single-pixel JPEG byte sequence
const validJpgHex = 
  'ffd8ffe000104a46494600010101006000600000ffdb004300080606070605080707070909080a0c140d0c0b0b0c1912130f141d1a1f1e1d1a1c1c20242e2720222c231c1c2837292c30313434341f27393d38323c2e333432ffc0000b080001000101011100ffc4001f0000010501010101010100000000000000000102030405060708090a0bffda0008010100003f007f00ffd9';
const baseBuffer = Buffer.from(validJpgHex, 'hex');

// Read CSV to get all image paths
const csvPath = path.resolve('datasets/citizen_reports/sample_citizen_reports.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Match all image references
const imageMatches = csvContent.match(/datasets\/citizen_reports\/images\/([a-zA-Z0-9_\-]+\.jpg)/g) || [];

let count = 0;
for (const match of imageMatches) {
  const fileName = path.basename(match);
  const targetPath = path.join(imagesDir, fileName);
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, baseBuffer);
    count++;
  }
}

// Also check sample_image_metadata.csv
const metaPath = path.resolve('datasets/image_metadata/sample_image_metadata.csv');
if (fs.existsSync(metaPath)) {
  const metaContent = fs.readFileSync(metaPath, 'utf-8');
  const metaMatches = metaContent.match(/datasets\/citizen_reports\/images\/([a-zA-Z0-9_\-]+\.jpg)/g) || [];
  for (const match of metaMatches) {
    const fileName = path.basename(match);
    const targetPath = path.join(imagesDir, fileName);
    if (!fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, baseBuffer);
      count++;
    }
  }
}

console.log(`Generated/verified ${count} sample demonstration JPEG image files in ${imagesDir}`);
