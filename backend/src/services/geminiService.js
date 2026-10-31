import { getGeminiClient, isGeminiLive, getActiveModelName } from '../config/gemini.js';

const SYSTEM_PROMPT_EVIDENCE = `
You are the Senior Geospatial and Ecological Evidence Analyst for ARAVALLI SENTINEL.
Your task is to analyze user-submitted photographs, videos, audio/voice transcripts, and environmental coordinates from the Aravalli Ecological Range in India (spanning Gujarat, Rajasthan, Haryana, and Delhi NCR).

CRITICAL LEGAL & ETHICAL CONSTRAINTS:
1. You MUST NEVER state that an image or video legally proves an offence or illegal mining.
2. Frame all findings strictly as an "AI Ecological Observation" and "suspected visual indicators".
3. Ground verification by forest rangers, mining officers, or state authorities is always mandatory.
4. Highlight technical limitations such as optical resolution, lack of elevation data, seasonal drying, or perspective bias.

OUTPUT FORMAT:
You MUST respond with valid JSON matching this schema ONLY (no Markdown fences, no extraneous preamble):
{
  "suggestedTitle": "Short 4-8 word descriptive incident title",
  "suggestedCategory": "Illegal Mining & Quarrying | Deforestation / Tree Felling | Encroachment & Construction | Toxic Waste Dumping | Ground Water Depletion / Deep Boring | Land Degradation | Other Ecological Threat",
  "possibleThreatCategory": "Same as suggestedCategory",
  "summary": "Clear, objective, scientific explanation of observed landscape changes.",
  "explanation": "Same as summary",
  "observedVisualIndicators": ["item 1", "item 2", "item 3"],
  "potentialEnvironmentalImpact": "Estimated scientific impact on biodiversity, water table, or forest corridor.",
  "suggestedPriority": "CRITICAL | HIGH | MEDIUM | LOW",
  "confidenceEstimate": "High | Medium | Low",
  "uncertaintyAndLimitations": "Explicit notes on optical ambiguity, seasonal variance, and non-conclusive nature of media alone.",
  "uncertainties": "Same as uncertaintyAndLimitations",
  "humanReviewRequirement": "Mandatory on-site field verification required by Forest Department personnel under Indian Forest Act.",
  "recommendedVerificationSteps": [
    "Step 1: Check cadastral revenue map for ridge/forest notification status",
    "Step 2: Dispatch drone survey or field ranger team with GPS tracker",
    "Step 3: Cross-reference regional satellite Sentinel-2 NDVI change"
  ],
  "preliminaryRiskScoreImpact": 65,
  "legalDisclaimer": "This is an AI ecological observation and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory."
}
`;

/**
 * Analyzes uploaded image evidence and text description
 */
export async function analyzeEvidence({ imageBuffer, mimeType, threatCategory, userDescription, location }) {
  if (isGeminiLive()) {
    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({
        model: getActiveModelName(),
        systemInstruction: SYSTEM_PROMPT_EVIDENCE,
      });

      const parts = [];

      if (imageBuffer) {
        parts.push({
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: mimeType || 'image/jpeg',
          },
        });
      }

      const promptText = `
Citizen Report Metadata:
- Reported Threat Category: ${threatCategory || 'Unspecified'}
- Citizen Description: ${userDescription || 'No description provided'}
- Coordinates / Location: ${location ? JSON.stringify(location) : 'Unspecified'}

Please inspect the photographic evidence and textual cues, and provide the structured JSON assessment.
`;
      parts.push({ text: promptText });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.response.text();
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      return {
        ...parsed,
        source: 'Gemini Live AI Engine',
        model: getActiveModelName(),
        isSimulated: false,
        analyzedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('⚠️ [Gemini AI] API Call failed, falling back to heuristic simulation:', err.message);
      return generateSimulatedAnalysis(threatCategory, userDescription, err.message);
    }
  }

  // Demo Fallback Mode
  return generateSimulatedAnalysis(threatCategory, userDescription, 'Live Gemini API key not configured in .env');
}

/**
 * High-fidelity heuristic simulation for demo/development environments
 */
function generateSimulatedAnalysis(threatCategory = 'Illegal Mining', userDescription = '', reason = '') {
  const category = threatCategory.toLowerCase();

  let indicators = [];
  let possibleThreat = 'Illegal Mining';
  let scoreImpact = 70;
  let explanation = '';

  if (category.includes('mining') || category.includes('quarry')) {
    possibleThreat = 'Illegal Mining & Quarrying';
    scoreImpact = 78;
    indicators = [
      'Visible terraced excavation cut into natural rocky hill slope',
      'Presence of compacted earth roads indicative of heavy dumper movement',
      'Exposed sub-surface bedrock strata without standard environmental terracing',
      'Accumulation of stone powder and quarry dust near ridge perimeter',
    ];
    explanation = 'Visual signals indicate surface excavation and rock extraction on the hillside. Patterns are consistent with mechanized stone quarrying operations.';
  } else if (category.includes('deforest') || category.includes('tree') || category.includes('forest')) {
    possibleThreat = 'Deforestation / Tree Felling';
    scoreImpact = 65;
    indicators = [
      'Discontinuous canopy patches with freshly cleared undergrowth',
      'Absence of indigenous Dhau (Anogeissus pendula) tree stands in cleared pocket',
      'Visible vehicular access paths cut into protected eco-sensitive buffer',
    ];
    explanation = 'Satellite and ground visual signatures display canopy fragmentation and clearings atypical of natural seasonal leaf shedding in dry deciduous Aravalli scrub.';
  } else if (category.includes('waste') || category.includes('dump')) {
    possibleThreat = 'Toxic Waste Dumping';
    scoreImpact = 62;
    indicators = [
      'Unorganized heaps of construction & demolition (C&D) debris and municipal waste',
      'Discoloration of soil substrate near seasonal drainage channel',
      'Potential leachate contamination hazard toward adjacent groundwater recharge zone',
    ];
    explanation = 'Deposited materials appear to consist of non-biodegradable debris and industrial rubble placed within a natural depression or abandoned quarry basin.';
  } else if (category.includes('encroach') || category.includes('construct')) {
    possibleThreat = 'Encroachment & Construction';
    scoreImpact = 58;
    indicators = [
      'Boundary wall construction or barbed wire fencing on deemed forest land',
      'Levelling of undulating hill terrain using earthmovers',
      'Erection of temporary or permanent sheds within eco-sensitive buffer',
    ];
    explanation = 'Site morphology shows active land parcel boundary creation and vegetation clearing for non-forestry structural use.';
  } else if (category.includes('water') || category.includes('boring') || category.includes('aquifer')) {
    possibleThreat = 'Ground Water Depletion / Deep Boring';
    scoreImpact = 68;
    indicators = [
      'Mounted hydraulic or rotary compressor borewell drilling rig on site',
      'High-pressure groundwater extraction piping without mandated telemetry flow meters',
      'Unpermitted industrial water tankers drawing from localized fracture aquifer',
    ];
    explanation = 'Visual observations and report context suggest deep mechanical groundwater extraction within a declared over-exploited Aravalli hydrogeological block.';
  } else {
    possibleThreat = 'Suspected Ecological Disturbance';
    scoreImpact = 50;
    indicators = [
      'Unusual ground disturbance along the Aravalli hill flank',
      'Noticeable deviation from surrounding natural scrub vegetation',
    ];
    explanation = 'Preliminary photographic review shows localized environmental alteration requiring ground-truthing by forest officials.';
  }

  const titles = {
    'Illegal Mining & Quarrying': 'Mechanized Ridge Quarrying & Stone Excavation',
    'Deforestation / Tree Felling': 'Canopy Clearance & Native Dhau Felling',
    'Toxic Waste Dumping': 'Unregulated Debris & Chemical Dumping Basin',
    'Encroachment & Construction': 'Structural Boundary Construction on Forest Land',
    'Ground Water Depletion / Deep Boring': 'Unauthorized Heavy Borewell Extraction Grid',
  };

  const priority = scoreImpact >= 75 ? 'CRITICAL' : scoreImpact >= 60 ? 'HIGH' : 'MEDIUM';

  return {
    suggestedTitle: titles[possibleThreat] || `${possibleThreat} Activity Observed`,
    suggestedCategory: possibleThreat,
    possibleThreatCategory: possibleThreat,
    summary: explanation,
    explanation,
    observedVisualIndicators: indicators,
    potentialEnvironmentalImpact:
      scoreImpact >= 70
        ? 'Severe disruption to regional groundwater recharge zone and loss of critical wildlife corridor buffer.'
        : 'Localized flora degradation and accelerated topsoil erosion along rocky escarpments.',
    suggestedPriority: priority,
    confidenceEstimate: 'High',
    uncertaintyAndLimitations: `Assessment derived using ecological computer vision heuristics. ${reason ? `[Note: ${reason}]` : ''} High-resolution aerial LIDAR, land revenue records, and GPS field verification are mandatory to determine legal non-compliance.`,
    uncertainties: `Optical indicators are decision-support clues. Ground-truthing required under Forest Conservation Act.`,
    humanReviewRequirement: 'Mandatory field verification required by authorized Forest Authority officers before statutory enforcement.',
    recommendedVerificationSteps: [
      'Verify land classification in District Revenue / Forest Department Records (Punjab Land Preservation Act / Forest Conservation Act notifications)',
      'Dispatch field task force equipped with handheld DGPS for boundary demarcation',
      'Cross-check drone multispectral imagery for excavation volume calculation',
      'Examine whether valid mining lease or environmental clearance (EC) exists for this survey number',
    ],
    preliminaryRiskScoreImpact: scoreImpact,
    legalDisclaimer: 'This is an AI ecological observation and does NOT constitute official legal proof or judicial evidence. Field verification by authorized government authorities is mandatory under Indian environmental laws.',
    source: 'Aravalli Sentinel Ecological Assessment Engine (Demo Fallback)',
    model: 'Rule-Guided Ecological Heuristic v1.2',
    isSimulated: true,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Drafts an environmental incident report from voice transcripts (Hindi, English, Hinglish)
 */
export async function draftReportFromVoice({ transcript, location }) {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Voice transcript is empty.');
  }

  const text = transcript.toLowerCase();
  let threatCategory = 'Other Ecological Threat';

  if (text.includes('mining') || text.includes('khanan') || text.includes('patthar') || text.includes('quarry') || text.includes('blasting')) {
    threatCategory = 'Illegal Mining & Quarrying';
  } else if (text.includes('tree') || text.includes('ped') || text.includes('katayi') || text.includes('jungle') || text.includes('deforest')) {
    threatCategory = 'Deforestation / Tree Felling';
  } else if (text.includes('kachra') || text.includes('dump') || text.includes('waste') || text.includes('plastic') || text.includes('toxic')) {
    threatCategory = 'Toxic Waste Dumping';
  } else if (text.includes('kabza') || text.includes('encroach') || text.includes('wall') || text.includes('deewar') || text.includes('building')) {
    threatCategory = 'Encroachment & Construction';
  } else if (text.includes('paani') || text.includes('water') || text.includes('boring') || text.includes('borewell') || text.includes('aquifer')) {
    threatCategory = 'Ground Water Depletion / Deep Boring';
  }

  const simulated = generateSimulatedAnalysis(threatCategory, transcript, 'Voice input transcribed');

  return {
    success: true,
    transcript,
    draft: {
      title: `${threatCategory} reported via Voice Sentinel`,
      threatCategory,
      summary: transcript,
      aiObservations: simulated.observedVisualIndicators,
      suggestedPriority: simulated.suggestedPriority,
      location: location || null,
      disclaimer: 'AI-drafted from spoken testimony. Citizen confirmation required before official case registration.',
    },
  };
}

/**
 * Conversational Assistant: Ask Aravalli
 */
export async function askAravalliAssistant({ question, contextData, userRole = 'citizen' }) {
  const cleanContext = {
    zonesSummary: contextData?.zones?.map(z => ({
      name: z.name,
      location: z.stateDistrict,
      riskLevel: z.riskLevel,
      score: z.score,
      primaryDriver: z.primaryDriver,
    })) || [],
    recentReportsSummary: (contextData?.reports || []).map(r => ({
      id: r.id,
      threatCategory: r.threatCategory,
      zoneName: r.zoneName || 'General Aravalli Sector',
      status: r.status,
      timestamp: r.createdAt,
      // Strictly redact citizen personal identity
    })),
    userRole,
  };

  const SYSTEM_PROMPT_CHAT = `
You are "Ask Aravalli", the specialized AI Ecological & Environmental Law Assistant for ARAVALLI SENTINEL.
Your mission is to provide accurate, grounded, and scientifically rigorous information regarding:
1. The Aravalli Range ecology (Rajasthan, Haryana, Delhi NCR, Gujarat).
2. Key environmental protection frameworks in India (Supreme Court of India mining bans, Punjab Land Preservation Act - PLPA, Forest Conservation Act 1980, Environment Protection Act 1986, Eco-Sensitive Zones - ESZ).
3. The platform's currently monitored risk zones, recent threats, and explainable risk scores.

CRITICAL PRIVACY & SECURITY RULES:
- Never disclose citizen identities (names, phone numbers, email addresses).
- Disclose when data is simulated or missing.
- When asked "Why is this zone high risk?", explain the 5-factor model: Mining (30%), Vegetation loss (25%), Water stress (20%), Citizen evidence (15%), Historical change (10%).
- If asked for legal advice, clarify that you provide ecological and regulatory intelligence, not official legal counsel.
`;

  if (isGeminiLive()) {
    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({
        model: getActiveModelName(),
        systemInstruction: SYSTEM_PROMPT_CHAT,
      });

      const prompt = `
System Knowledge Context:
${JSON.stringify(cleanContext, null, 2)}

User Question:
"${question}"

Provide a structured, helpful, professional, and grounded response. Mention specific zones or factors when relevant.
`;

      const result = await model.generateContent(prompt);
      return {
        answer: result.response.text(),
        source: 'Gemini Live Assistant',
        model: getActiveModelName(),
        isSimulated: false,
      };
    } catch (err) {
      console.error('⚠️ [Ask Aravalli] API call failed:', err.message);
      return generateSimulatedChatResponse(question, cleanContext);
    }
  }

  return generateSimulatedChatResponse(question, cleanContext);
}

function generateSimulatedChatResponse(question, context) {
  const q = question.toLowerCase();

  let answer = '';
  if (q.includes('why') && (q.includes('risk') || q.includes('high') || q.includes('critical') || q.includes('bandhwari') || q.includes('mangar') || q.includes('sariska'))) {
    answer = `**Risk Engine Breakdown:**
In ARAVALLI SENTINEL, risk scores (0–100) are evaluated across 5 explainable factors:
1. **Illegal Mining & Quarrying (30% weight):** Assesses blasting proximity, heavy vehicle trails, and terraced hill cuts.
2. **Vegetation & Canopy Loss (25% weight):** Measures NDVI drop and native Dhau forest clearing.
3. **Aquifer & Water Stress (20% weight):** Evaluates water table decline and seasonal nallah disruption.
4. **Citizen Reports (15% weight):** Density of field reports verified in the last 30 days.
5. **Historical Degradation (10% weight):** Multi-year land cover transformation trends.

Zones like **Bandhwari Ridge** and **Khetri Foothills** exhibit HIGH RISK or CRITICAL levels predominantly due to heavy excavation anomalies and critical water table drawdown.`;
  } else if (q.includes('law') || q.includes('supreme court') || q.includes('ban') || q.includes('plpa') || q.includes('legal')) {
    answer = `**Aravalli Legal & Regulatory Framework:**
- **Supreme Court of India (M.C. Mehta vs Union of India, 2002 & 2009):** Imposed a comprehensive ban on mining activities across the Aravalli range in Haryana (Faridabad, Gurugram, Mewat).
- **Eco-Sensitive Zone (ESZ):** 10km buffers around sanctuaries like Asola Bhatti and Sariska Tiger Reserve prohibit polluting industries, new commercial quarries, and large-scale construction.
- **Punjab Land Preservation Act (PLPA) Section 4 & 5:** Restricts non-forestry activities on notified ridge land.
- **Role of ARAVALLI SENTINEL:** Serves as an early-warning telemetry bridge. All flagged incidents must be validated on-ground by the Forest Department and State Pollution Control Board before legal enforcement notices are issued.`;
  } else if (q.includes('report') || q.includes('how to report') || q.includes('citizen')) {
    answer = `**How Citizens Can Protect the Aravallis:**
1. Navigate to the **"Report Threat"** tab.
2. Upload photographic evidence of suspected mining, tree felling, or dumping.
3. Select your location via GPS or pin the location on the map.
4. Add descriptive details (e.g., presence of JCBs, nighttime truck movement).
5. Submit securely: Your report is immediately analyzed by our Gemini ecological vision model and forwarded to verified authorities for field inspection.`;
  } else {
    answer = `**ARAVALLI SENTINEL Ecological Intelligence:**
I am monitoring **${context.zonesSummary.length || 8} key ecological zones** across Rajasthan, Haryana, and Delhi NCR. 
Current surveillance indicators show active monitoring for:
- **Bandhwari Ridge & Asola Buffer:** Urban encroachment & quarrying stress.
- **Sariska Buffer (Alwar):** Forest canopy preservation & wildlife corridor connectivity.
- **Mangar Bani:** Sacred grove protection under Haryana eco-restoration orders.

Feel free to ask about specific risk scores, contributing signals, or legal safeguards protecting the Aravallis!`;
  }

  return {
    answer,
    source: 'Ask Aravalli Knowledge Base (Demo Mode)',
    model: 'Grounded Environmental Engine v1.0',
    isSimulated: true,
  };
}

export default {
  analyzeEvidence,
  askAravalliAssistant,
};
