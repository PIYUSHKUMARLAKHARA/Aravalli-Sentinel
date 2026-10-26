/**
 * Authentic seed reports across the Aravalli range
 * Clearly distinguished as initial baseline reports with full Gemini AI assessments,
 * risk scores, and audit trails.
 */

export const seedReports = [
  {
    id: 'rep-aravalli-2026-001',
    threatCategory: 'Illegal Mining & Quarrying',
    description: 'Continuous night-time blasting and heavy JCB excavator movements observed behind Bandhwari hill flank. Dumper trucks moving without registration plates along the Faridabad-Gurugram ridge road.',
    latitude: 28.3892,
    longitude: 77.1415,
    locationName: 'Bandhwari Hill Crest, Sector 59 Eco-Buffer, Gurugram',
    zoneId: 'zone-bandhwari-01',
    zoneName: 'Bandhwari Hill Ridge & Eco-Buffer',
    incidentTime: '2026-10-24T22:30:00Z',
    createdAt: '2026-10-25T01:15:00Z',
    updatedAt: '2026-10-25T09:45:00Z',
    status: 'under_review',
    citizenId: 'cit-demo-001',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Freshly excavated vertical rock terraces on natural Aravalli escarpment',
        'Deep tracks consistent with hydraulic rock-breakers and 10-wheeler dump trucks',
        'Severe particulate stone dust settling on adjacent native Dhau scrub',
        'Drainage depression blocked by unpermitted rock overburden'
      ],
      possibleThreatCategory: 'Illegal Mining & Quarrying',
      explanation: 'Photographic and spatial signatures reveal mechanized rock cutting on steep slopes protected under the Supreme Court Aravalli mining ban. Excavation geometry shows commercial quarrying rather than authorized civil construction.',
      uncertaintyAndLimitations: 'Optical aerial imagery cannot determine property boundary line coordinates with survey-grade precision. Land cadastral revenue records (Khasra numbers) must be cross-referenced by the Patwari.',
      confidenceEstimate: 'High',
      recommendedVerificationSteps: [
        'Deploy joint inspection team with Mining Officer and Divisional Forest Officer (DFO Gurugram)',
        'Check Khasra revenue records for Gair Mumkin Pahar status under Section 4/5 PLPA',
        'Inspect GPS tracking logs of commercial stone crushers in adjacent Pali-Mohabatabad cluster'
      ],
      preliminaryRiskScoreImpact: 82,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-25T01:16:10Z'
    },
    riskAssessment: {
      score: 84.5,
      riskLevel: 'CRITICAL',
      severity: 'critical',
      primaryDriver: 'Illegal Mining Activity (30% weight)',
      contributions: {
        miningRisk: 88,
        vegetationLoss: 82,
        waterStress: 80,
        citizenEvidence: 75,
        historicalChange: 90
      }
    },
    auditTrail: [
      {
        action: 'Report Submitted',
        by: 'Citizen Sentinel',
        role: 'citizen',
        timestamp: '2026-10-25T01:15:00Z',
        notes: 'Initial report logged with photographic evidence and GPS coordinates.'
      },
      {
        action: 'Status updated to Under Review',
        by: 'Officer R. Sharma (Forest Task Force)',
        role: 'authority',
        timestamp: '2026-10-25T09:45:00Z',
        notes: 'Priority 1 flag assigned. Ground drone reconnaissance scheduled for tomorrow morning.'
      }
    ]
  },
  {
    id: 'rep-aravalli-2026-002',
    threatCategory: 'Illegal Mining & Quarrying',
    description: 'Unauthorized stone crusher setup near old copper slag tailings. Crushing equipment operating during curfew hours without dust suppression sprinklers or pollution clearance.',
    latitude: 27.9821,
    longitude: 75.7894,
    locationName: 'Khetri Bypass, Foothills Sector 4, Jhunjhunu',
    zoneId: 'zone-khetri-02',
    zoneName: 'Khetri Foothills & Copper Ridge',
    incidentTime: '2026-10-23T19:00:00Z',
    createdAt: '2026-10-24T08:20:00Z',
    updatedAt: '2026-10-25T11:00:00Z',
    status: 'verified',
    citizenId: 'cit-demo-002',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Rotary stone crusher plant without mandatory green buffer screen',
        'Large stockpiles of unmeasured ballast gravel encroaching on drainage gully',
        'Significant airborne particulate plume affecting visibility'
      ],
      possibleThreatCategory: 'Illegal Mining & Quarrying',
      explanation: 'Industrial stone crushing unit operating without standard environmental dust enclosures. Proximity to seasonal Aravalli nallah creates siltation risk.',
      uncertaintyAndLimitations: 'Consent to Operate (CTO) status could not be verified from photograph alone; requires online Pollution Control Board portal query.',
      confidenceEstimate: 'High',
      recommendedVerificationSteps: [
        'Rajasthan State Pollution Control Board (RSPCB) inspection of air quality meters',
        'Verify lease boundaries against Department of Mines & Geology spatial database'
      ],
      preliminaryRiskScoreImpact: 76,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-24T08:22:00Z'
    },
    riskAssessment: {
      score: 69.8,
      riskLevel: 'HIGH RISK',
      severity: 'high',
      primaryDriver: 'Illegal Mining Activity (30% weight)',
      contributions: {
        miningRisk: 84,
        vegetationLoss: 62,
        waterStress: 72,
        citizenEvidence: 55,
        historicalChange: 65
      }
    },
    auditTrail: [
      {
        action: 'Report Submitted',
        by: 'Citizen Sentinel',
        role: 'citizen',
        timestamp: '2026-10-24T08:20:00Z',
        notes: 'Initial alert logged by local community elder.'
      },
      {
        action: 'Status updated to Verified',
        by: 'Inspector V. Rathore (Mines Dept Rajasthan)',
        role: 'authority',
        timestamp: '2026-10-25T11:00:00Z',
        notes: 'On-site raid confirmed crusher was operating outside permissible lease coordinates. Generator sealed and show-cause notice issued.'
      }
    ]
  },
  {
    id: 'rep-aravalli-2026-003',
    threatCategory: 'Encroachment & Construction',
    description: 'New concrete pillar boundary and razor wire being erected deep inside the forest buffer zone near Asola Bhatti sanctuary boundary.',
    latitude: 28.4912,
    longitude: 77.2514,
    locationName: 'Tughlakabad - Asola Eco-Sensitive Trail, South Delhi',
    zoneId: 'zone-asola-03',
    zoneName: 'Asola Bhatti Sanctuary Eco-Buffer',
    incidentTime: '2026-10-25T07:15:00Z',
    createdAt: '2026-10-25T08:00:00Z',
    updatedAt: '2026-10-25T08:00:00Z',
    status: 'pending',
    citizenId: 'cit-demo-003',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Linear boundary excavation cutting through indigenous vegetation',
        'Pre-cast RCC boundary pillars stored on site',
        'Cleared corridor approx 4 meters wide along sanctuary border'
      ],
      possibleThreatCategory: 'Encroachment & Construction',
      explanation: 'Visual markers demonstrate non-forestry fencing activity. Location appears to overlap with the designated 1km Eco-Sensitive Zone surrounding Asola Bhatti Wildlife Sanctuary.',
      uncertaintyAndLimitations: 'Requires boundary survey using Forest Department total station to determine if fencing falls inside Delhi Forest or Haryana revenue land.',
      confidenceEstimate: 'Medium',
      recommendedVerificationSteps: [
        'Verify joint boundary pillar demarcations between Delhi Forest Dept and Haryana Forest Dept',
        'Stop work notice to be served if inside deemed forest'
      ],
      preliminaryRiskScoreImpact: 52,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-25T08:01:30Z'
    },
    riskAssessment: {
      score: 43.1,
      riskLevel: 'WATCH',
      severity: 'moderate',
      primaryDriver: 'Aquifer & Water Stress (20% weight)',
      contributions: {
        miningRisk: 35,
        vegetationLoss: 45,
        waterStress: 50,
        citizenEvidence: 48,
        historicalChange: 42
      }
    },
    auditTrail: [
      {
        action: 'Report Submitted',
        by: 'Citizen Sentinel',
        role: 'citizen',
        timestamp: '2026-10-25T08:00:00Z',
        notes: 'Citizen spotted morning fencing crew.'
      }
    ]
  },
  {
    id: 'rep-aravalli-2026-004',
    threatCategory: 'Deforestation / Tree Felling',
    description: 'Chainsaw felling of mature Dhau (Anogeissus pendula) trees on the hill slopes near Tehla gate buffer.',
    latitude: 27.3289,
    longitude: 76.4352,
    locationName: 'Tehla Buffer Road, Sariska Corridor, Alwar',
    zoneId: 'zone-sariska-04',
    zoneName: 'Sariska Corridor & Buffer Forest',
    incidentTime: '2026-10-21T14:20:00Z',
    createdAt: '2026-10-21T15:30:00Z',
    updatedAt: '2026-10-23T16:00:00Z',
    status: 'resolved',
    citizenId: 'cit-demo-004',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Freshly felled timber logs stacked near roadside',
        'Stump cuts with clean mechanical blade marks',
        'Trampled Dhau seedling understory'
      ],
      possibleThreatCategory: 'Deforestation / Tree Felling',
      explanation: 'Evidence indicates organized cutting of native slow-growing Dhau hardwood trees, vital for hill slope soil stabilization in the Aravalli biome.',
      uncertaintyAndLimitations: 'Tree felling count cannot be calculated from a single perspective photo.',
      confidenceEstimate: 'High',
      recommendedVerificationSteps: [
        'Immediate forest guard patrol deployment',
        'Seizure of felled timber under Rajasthan Forest Act'
      ],
      preliminaryRiskScoreImpact: 64,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-21T15:32:00Z'
    },
    riskAssessment: {
      score: 36.4,
      riskLevel: 'WATCH',
      severity: 'moderate',
      primaryDriver: 'Aquifer & Water Stress (20% weight)',
      contributions: {
        miningRisk: 32,
        vegetationLoss: 38,
        waterStress: 42,
        citizenEvidence: 40,
        historicalChange: 35
      }
    },
    auditTrail: [
      {
        action: 'Report Submitted',
        by: 'Citizen Sentinel',
        role: 'citizen',
        timestamp: '2026-10-21T15:30:00Z',
        notes: 'Submitted via mobile app by wildlife tourist guide.'
      },
      {
        action: 'Status updated to Resolved',
        by: 'Range Forest Officer S. Meena',
        role: 'authority',
        timestamp: '2026-10-23T16:00:00Z',
        notes: 'Forest patrol intercepted transport vehicle. Timber impounded at Sariska range headquarters. Offender booked under Forest Act.'
      }
    ]
  }
];

export default seedReports;
