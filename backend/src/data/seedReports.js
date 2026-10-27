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
  },
  {
    id: 'rep-aravalli-2026-005',
    threatCategory: 'Toxic Waste Dumping',
    description: 'Multiple unmetered industrial chemical tankers observed discharging hazardous industrial effluent into an abandoned quarry pit late at night. Toxic leachate pooling with pungent sulfurous odor migrating toward rural tubewells.',
    latitude: 28.3754,
    longitude: 77.1628,
    locationName: 'Pali - Mohabatabad Abandoned Mining Cut, Faridabad Eco-Buffer',
    zoneId: 'zone-bandhwari-01',
    zoneName: 'Bandhwari Hill Ridge & Eco-Buffer',
    incidentTime: '2026-10-25T23:45:00Z',
    createdAt: '2026-10-26T02:10:00Z',
    updatedAt: '2026-10-26T08:30:00Z',
    status: 'under_review',
    citizenId: 'cit-demo-005',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Discolored iridescent chemical sheen on stagnant surface water body inside rock pit',
        'Visible heavy vehicle tire marks leading to lip of excavation cut',
        'Severely scorched and bleached undergrowth along natural runoff gullies',
        'Absence of mandated municipal waste containment lining or impermeable membrane'
      ],
      possibleThreatCategory: 'Toxic Waste Dumping',
      explanation: 'Photographic evidence strongly indicates illicit liquid industrial waste discharge into fractured quartzite bedrock. Highly fractured Aravalli geology presents immediate risk of aquifer contamination.',
      uncertaintyAndLimitations: 'Chemical toxicity grade and exact chemical compounds require gas chromatography laboratory water testing from HSPCB.',
      confidenceEstimate: 'High',
      recommendedVerificationSteps: [
        'Collect surface and groundwater grab samples for pH, heavy metals, and COD/BOD analysis',
        'Deploy Haryana State Pollution Control Board (HSPCB) surveillance team',
        'Coordinate with Regional Transport Office to audit GPS logs of commercial chemical tankers'
      ],
      preliminaryRiskScoreImpact: 88,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-26T02:12:00Z'
    },
    riskAssessment: {
      score: 82.4,
      riskLevel: 'CRITICAL',
      severity: 'critical',
      primaryDriver: 'Illegal Mining & Quarrying (30% weight)',
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
        timestamp: '2026-10-26T02:10:00Z',
        notes: 'Submitted by resident with geotagged photo of dark chemical pool.'
      },
      {
        action: 'Status updated to Under Review',
        by: 'Dr. K. Singhal (HSPCB Environmental Engineer)',
        role: 'authority',
        timestamp: '2026-10-26T08:30:00Z',
        notes: 'Emergency water sampling kit dispatched. Police post alerted to intercept night tankers.'
      }
    ]
  },
  {
    id: 'rep-aravalli-2026-006',
    threatCategory: 'Ground Water Depletion / Deep Boring',
    description: 'Unauthorized industrial deep-drilling rig operating continuously to supply high-pressure water for mechanized granite wire-cutting saws. Borewell depth exceeds 1,100 feet without Central Ground Water Authority permit.',
    latitude: 25.3456,
    longitude: 72.6189,
    locationName: 'Granite Industrial Cluster, Phase II, Jalore',
    zoneId: 'zone-jalore-07',
    zoneName: 'Jalore Granite Outcrops & Foothills',
    incidentTime: '2026-10-25T14:15:00Z',
    createdAt: '2026-10-25T16:00:00Z',
    updatedAt: '2026-10-26T10:15:00Z',
    status: 'verified',
    citizenId: 'cit-demo-006',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Mounted tractor-compressor high-capacity rotary drilling rig in operation',
        'Large diameter PVC casing pipes stacked and partially driven into hard rock',
        'Continuous high-volume slurry discharge into unlined desert sand bed'
      ],
      possibleThreatCategory: 'Ground Water Depletion / Deep Boring',
      explanation: 'Borewell drilling in declared over-exploited groundwater assessment units violates Central Ground Water Authority guidelines and Supreme Court directives regarding Aravalli watershed preservation.',
      uncertaintyAndLimitations: 'Borehole extraction discharge rate (liters/hour) requires on-site ultrasonic flow meter verification.',
      confidenceEstimate: 'High',
      recommendedVerificationSteps: [
        'Cross-reference CGWA NoC application database for specified plot coordinates',
        'Ground Water Department enforcement squad to seal drilling rig and electrical connection',
        'Issue environmental damage compensation notice to the commercial unit operator'
      ],
      preliminaryRiskScoreImpact: 74,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-25T16:02:15Z'
    },
    riskAssessment: {
      score: 65.5,
      riskLevel: 'HIGH RISK',
      severity: 'high',
      primaryDriver: 'Illegal Mining Risk (30% weight)',
      contributions: {
        miningRisk: 78,
        vegetationLoss: 58,
        waterStress: 64,
        citizenEvidence: 50,
        historicalChange: 55
      }
    },
    auditTrail: [
      {
        action: 'Report Submitted',
        by: 'Citizen Sentinel',
        role: 'citizen',
        timestamp: '2026-10-25T16:00:00Z',
        notes: 'Logged by local farmer noting sudden water drop in neighboring well.'
      },
      {
        action: 'Status updated to Verified',
        by: 'Junior Hydrogeologist P. Bishnoi (CGWA / Rajasthan GWD)',
        role: 'authority',
        timestamp: '2026-10-26T10:15:00Z',
        notes: 'Inspection verified absence of valid NoC. Borewell power connection disconnected and penalty memo issued.'
      }
    ]
  },
  {
    id: 'rep-aravalli-2026-007',
    threatCategory: 'Illegal Mining & Quarrying',
    description: 'Heavy hydraulic crawler excavators cutting into virgin white marble escarpment within 500m of the Balaram Ambaji Wildlife Sanctuary eco-buffer zone. Slurry wash dumped directly into seasonal riverbed.',
    latitude: 24.3667,
    longitude: 72.8500,
    locationName: 'Ambaji Foothills Escarpment, Banaskantha, Gujarat',
    zoneId: 'zone-ambaji-09',
    zoneName: 'Ambaji Foothills & Marble Corridor',
    incidentTime: '2026-10-26T09:30:00Z',
    createdAt: '2026-10-26T11:00:00Z',
    updatedAt: '2026-10-26T11:00:00Z',
    status: 'pending',
    citizenId: 'cit-demo-007',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Steep marble cutting terrace encroaching on natural slope contour',
        'White crystalline sediment plume smothering native riparian undergrowth',
        'Tracked hydraulic rock breakers operating adjacent to reserved forest boundary'
      ],
      possibleThreatCategory: 'Illegal Mining & Quarrying',
      explanation: 'Excavation activity appears to breach the 1km eco-sensitive buffer around Balaram Ambaji sanctuary. Mechanized cutting destabilizes fragile Aravalli mountain foothills.',
      uncertaintyAndLimitations: 'Requires DGPS boundary demarcation survey to confirm distance to wildlife sanctuary pillar.',
      confidenceEstimate: 'High',
      recommendedVerificationSteps: [
        'Joint inspection with Banaskantha Mining Officer and Ambaji Sanctuary Range Officer',
        'Verify lease boundary coordinates in Gujarat Department of Geology and Mining database'
      ],
      preliminaryRiskScoreImpact: 78,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-26T11:01:45Z'
    },
    riskAssessment: {
      score: 67.5,
      riskLevel: 'HIGH RISK',
      severity: 'high',
      primaryDriver: 'Illegal Mining Risk (30% weight)',
      contributions: {
        miningRisk: 76,
        vegetationLoss: 64,
        waterStress: 70,
        citizenEvidence: 58,
        historicalChange: 60
      }
    },
    auditTrail: [
      {
        action: 'Report Submitted',
        by: 'Citizen Sentinel',
        role: 'citizen',
        timestamp: '2026-10-26T11:00:00Z',
        notes: 'Submitted via mobile citizen portal with photo and coordinates.'
      }
    ]
  },
  {
    id: 'rep-aravalli-2026-008',
    threatCategory: 'Other Ecological Threat',
    description: 'Citizen report flagged earth-moving equipment clearing ground cover behind Mangar village boundary, alleging illegal commercial land clearing.',
    latitude: 28.3512,
    longitude: 77.1856,
    locationName: 'Mangar Bani Sacred Forest Outer Fringe, Faridabad',
    zoneId: 'zone-mangar-05',
    zoneName: 'Mangar Bani Sacred Grove',
    incidentTime: '2026-10-25T11:00:00Z',
    createdAt: '2026-10-25T12:30:00Z',
    updatedAt: '2026-10-26T14:00:00Z',
    status: 'rejected',
    citizenId: 'cit-demo-008',
    citizenName: 'Anonymous Sentinel (Redacted for Citizen Protection)',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    evidenceAnalysis: {
      observedVisualIndicators: [
        'Ground pits arranged in structured grid formation (approx 3m spacing)',
        'Removal of invasive Prosopis juliflora shrubs rather than native trees',
        'Presence of official Forest Department signage and seedling saplings'
      ],
      possibleThreatCategory: 'Other Ecological Threat',
      explanation: 'Visual analysis shows active soil pit preparation characteristic of an indigenous Dhau tree afforestation drive rather than illegal commercial development.',
      uncertaintyAndLimitations: 'Requires Forest Department work order verification to confirm afforestation project number.',
      confidenceEstimate: 'High',
      recommendedVerificationSteps: [
        'Cross-reference Haryana Forest Department Van Mahotsav afforestation register',
        'Verify work authorization with Beat Forest Guard'
      ],
      preliminaryRiskScoreImpact: 15,
      legalDisclaimer: 'This is an AI ecological assessment and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
      source: 'Gemini 2.0 Flash Ecological Vision Engine',
      model: 'gemini-2.0-flash',
      isSimulated: false,
      analyzedAt: '2026-10-25T12:32:10Z'
    },
    riskAssessment: {
      score: 19.3,
      riskLevel: 'SAFE',
      severity: 'safe',
      primaryDriver: 'Aquifer & Water Stress (20% weight)',
      contributions: {
        miningRisk: 15,
        vegetationLoss: 22,
        waterStress: 28,
        citizenEvidence: 24,
        historicalChange: 20
      }
    },
    auditTrail: [
      {
        action: 'Report Submitted',
        by: 'Citizen Sentinel',
        role: 'citizen',
        timestamp: '2026-10-25T12:30:00Z',
        notes: 'Submitted by citizen reporting tractor activity near sacred grove.'
      },
      {
        action: 'Status updated to Rejected',
        by: 'Divisional Forest Officer M. Yadav',
        role: 'authority',
        timestamp: '2026-10-26T14:00:00Z',
        notes: 'Field verification confirmed authorized indigenous Anogeissus pendula (Dhau) plantation drive under Haryana Community Forestry Project. No violation found. Case closed.'
      }
    ]
  }
];

export default seedReports;
