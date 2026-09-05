import { Work } from '../types/work';

export const mockWorks: Work[] = [
  // CANONICAL SHOWCASE WORK 1: Village Road Construction (Uttar Pradesh) - Focus of Investigation
  {
    workId: 'WS/UP/2025/001',
    title: 'Village Road Construction',
    description: 'Widening, sub-base compaction, interlocking paver blocks, and covered roadside drainage across 3 connecting rural links in Varanasi Rural.',
    mpId: 'MP-058',
    mpName: 'Dr. Anandvardhan Mishra',
    state: 'Uttar Pradesh',
    constituency: 'Varanasi',
    house: 'LOK_SABHA',
    category: 'Roads, Pathways & Bridges',
    financialYear: '2024-2025',
    recommendationDate: '2024-03-15',
    sanctionDate: '2024-05-20',
    firstPaymentDate: '2024-07-10',
    latestPaymentDate: '2024-11-28',
    expectedCompletionDate: '2025-06-30',
    status: 'ONGOING',
    sanctionAmount: 100000000, // ₹10.0 Cr
    expenditure: 87000000,     // ₹8.7 Cr
    utilizationPercentage: 87.0,
    financialAnomalyScore: 91,
    paymentAnomalyScore: 74,
    delayProbability: 68,
    executionAnomalyScore: 41,
    duplicateSimilarityScore: 18,
    finalRiskScore: 82,
    finalRiskLevel: 'HIGH',
    riskReasons: [
      'Expenditure reached 87% of the sanctioned amount while the work remains ongoing with earthwork and surfacing incomplete.',
      'Multiple payments occurred within a short period with clustered release vouchers.',
      'The model predicts elevated probability of unusually long completion (68%).'
    ],
    signals: [
      {
        id: 'sig-fin-up-01',
        name: 'Financial Anomaly',
        score: 91,
        severity: 'HIGH',
        shortExplanation: 'Disbursement pace significantly outpaces physical milestone certifications.',
        evidence: 'Expenditure reached 87% (₹8.7 Cr of ₹10.0 Cr) while on-site physical progress is certified at approximately 42%.',
        whyItMatters: 'Large front-loaded disbursements before stage inspection expose public funds to incomplete asset delivery risk.',
        contributingWeight: 40
      },
      {
        id: 'sig-pay-up-01',
        name: 'Payment Anomaly',
        score: 74,
        severity: 'HIGH',
        shortExplanation: 'Multiple payment vouchers processed in rapid succession.',
        evidence: '6 consecutive tranches totaling ₹4.8 Cr cleared within 18 days to the primary civil contractor.',
        whyItMatters: 'Voucher clustering deviates from the standard 21-day milestone and measurement book verification cycle.',
        contributingWeight: 30
      },
      {
        id: 'sig-del-up-01',
        name: 'Delay Probability',
        score: 68,
        severity: 'HIGH',
        shortExplanation: 'Model projects elevated probability of unusually long completion.',
        evidence: 'Predicted delay probability of 68% based on sluggish earthwork progress versus elapsed calendar time.',
        whyItMatters: 'Rural link connectivity delays impair agricultural transport access during monsoon periods.',
        contributingWeight: 20
      },
      {
        id: 'sig-exe-up-01',
        name: 'Execution Anomaly',
        score: 41,
        severity: 'MEDIUM',
        shortExplanation: 'Initial mobilization lag followed by compressed expenditure releases.',
        evidence: '51 days elapsed from sanction before site demarcation, followed by an immediate multi-tranche advance.',
        whyItMatters: 'Dormancy followed by sudden disbursement surges warrants verification of contractor mobilization capacity.',
        contributingWeight: 10
      }
    ],
    timeline: [
      { date: '2024-03-15', title: 'Work Recommended', description: 'Formal proposal submitted by MP Dr. Anandvardhan Mishra for 3 village road links.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2024-05-20', title: 'Administrative & Technical Sanction', description: 'District Collectorate issued sanction order for ₹10,00,00,000.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2024-07-10', title: 'First Mobilization Payment', description: 'Initial mobilization tranche of ₹1,50,00,000 disbursed to M/s Purvanchal Highway Developers.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2024-08-25', title: 'Subgrade Earthwork Inspection', description: 'District Executive Engineer noted partial clearing of right-of-way.', type: 'INSPECTION', status: 'COMPLETED' },
      { date: '2024-09-14', title: 'Rapid Tranche Disbursements', description: '4 payment vouchers totaling ₹4,20,00,000 cleared across 18 days.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2024-11-28', title: 'Latest Payment Issued', description: 'Tranche of ₹3,00,00,000 released; total expenditure reached ₹8,70,00,000 (87.0%).', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2025-06-30', title: 'Scheduled Completion Deadline', description: 'Target date originally specified in the civil engineering contract schedule.', type: 'COMPLETION', status: 'IN_PROGRESS' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹10.00 Cr', peerAverageValue: '₹8.20 Cr', varianceNote: '+21.9% above regional road scheme average', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '87.0%', peerAverageValue: '69.0%', varianceNote: '+18.0 percentage points ahead of peer average at same phase', isSignificant: true },
      { metric: 'Payment Frequency', currentWorkValue: '2.4× higher', peerAverageValue: '1.0× baseline', varianceNote: '11 vouchers cleared versus peer average of 4.6 vouchers', isSignificant: true },
      { metric: 'Delay Probability', currentWorkValue: '68%', peerAverageValue: '47%', varianceNote: '+21 percentage points above cohort risk baseline', isSignificant: true },
      { metric: 'Overall Risk Score', currentWorkValue: '82 / 100', peerAverageValue: '47 / 100', varianceNote: 'Priority candidate for nodal inspection', isSignificant: true }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // CANONICAL SHOWCASE WORK 2: Primary School Building (Maharashtra) - Elevated Delay Risk
  {
    workId: 'WS/MH/2025/045',
    title: 'Primary School Building',
    description: 'Construction of 8-classroom modern primary school block with digital library, science laboratory, and inclusive sanitation facilities at Baramati.',
    mpId: 'MP-019',
    mpName: 'Smt. Supriya V. Patil',
    state: 'Maharashtra',
    constituency: 'Baramati',
    house: 'LOK_SABHA',
    category: 'Education & Libraries',
    financialYear: '2024-2025',
    recommendationDate: '2024-02-10',
    sanctionDate: '2024-04-18',
    firstPaymentDate: '2024-06-12',
    latestPaymentDate: '2024-10-15',
    expectedCompletionDate: '2025-03-31',
    status: 'ONGOING',
    sanctionAmount: 42000000, // ₹4.2 Cr
    expenditure: 21000000,    // ₹2.1 Cr
    utilizationPercentage: 50.0,
    financialAnomalyScore: 48,
    paymentAnomalyScore: 52,
    delayProbability: 79,
    executionAnomalyScore: 65,
    duplicateSimilarityScore: 14,
    finalRiskScore: 79,
    finalRiskLevel: 'HIGH',
    riskReasons: [
      'Elevated delay probability: project has completed only 30% civil masonry with 10 months elapsed since approval.',
      'Prolonged site dormancy recorded following initial foundation excavation.',
      'Model projects 79% probability of unusually long completion beyond target deadline.'
    ],
    signals: [
      {
        id: 'sig-del-mh-02',
        name: 'Predicted Delay Probability',
        score: 79,
        severity: 'HIGH',
        shortExplanation: 'Severe lag between calendar duration and superstructure progress.',
        evidence: 'Only 30% physical milestones cleared while 75% of scheduled contract time has elapsed.',
        whyItMatters: 'Incomplete educational facilities stall student enrollment and require budget escalation provisions.',
        contributingWeight: 45
      },
      {
        id: 'sig-exe-mh-02',
        name: 'Execution Timeline Stagnation',
        score: 65,
        severity: 'MEDIUM',
        shortExplanation: 'Contractor site activity dormant for 68 consecutive days.',
        evidence: 'No labor attendance or measurement book entries recorded since October 2024.',
        whyItMatters: 'Extended inactivity during peak construction months often signals contractor financial distress.',
        contributingWeight: 30
      },
      {
        id: 'sig-pay-mh-02',
        name: 'Payment Velocity Deviation',
        score: 52,
        severity: 'MEDIUM',
        shortExplanation: 'Payments stalled after initial 50% mobilization release.',
        evidence: '₹2.1 Cr released in 2 disbursements; subsequent milestone invoices pending submission.',
        whyItMatters: 'Stoppage in billing cycles typically correlates with on-ground execution impasses.',
        contributingWeight: 15
      },
      {
        id: 'sig-fin-mh-02',
        name: 'Financial Utilization',
        score: 48,
        severity: 'LOW',
        shortExplanation: 'Utilization roughly aligns with initial advance schedule.',
        evidence: '50% drawn against ₹4.2 Cr sanction.',
        whyItMatters: 'Standard initial drawdown.',
        contributingWeight: 10
      }
    ],
    timeline: [
      { date: '2024-02-10', title: 'Work Recommended', description: 'Recommended by MP Smt. Supriya V. Patil under rural education enhancement.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2024-04-18', title: 'Administrative Sanction', description: 'District Authority issued sanction for ₹4,20,00,000.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2024-06-12', title: 'First Mobilization Advance', description: '₹1,05,00,000 released to M/s Western Infra Projects.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2024-08-04', title: 'Foundation Level Inspection', description: 'Footing completed; structural steel verified by Junior Engineer.', type: 'INSPECTION', status: 'COMPLETED' },
      { date: '2024-10-15', title: 'Plinth Level Payment', description: 'Second tranche of ₹1,05,00,000 released; total expenditure ₹2,10,00,000.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2025-03-31', title: 'Scheduled Completion Deadline', description: 'Original target completion milestone specified in tender document.', type: 'COMPLETION', status: 'IN_PROGRESS' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹4.20 Cr', peerAverageValue: '₹3.90 Cr', varianceNote: 'Within normal educational building cost range', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '50.0%', peerAverageValue: '68.0%', varianceNote: 'Lags expected peer expenditure by 18%', isSignificant: true },
      { metric: 'Time Since Sanction', currentWorkValue: '10 Months', peerAverageValue: '10 Months', varianceNote: 'Standard elapsed duration', isSignificant: false },
      { metric: 'Delay Probability', currentWorkValue: '79%', peerAverageValue: '38%', varianceNote: '+41 percentage points above cohort delay rate', isSignificant: true },
      { metric: 'Overall Risk Score', currentWorkValue: '79 / 100', peerAverageValue: '35 / 100', varianceNote: 'High risk driven by projected schedule overrun', isSignificant: true }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // CANONICAL SHOWCASE WORK 3: Water Supply Scheme (Karnataka) - Unusual Expenditure Pattern
  {
    workId: 'WS/KA/2025/012',
    title: 'Water Supply Scheme',
    description: 'Deep hydro-geological borewell sinking, 1.5 lakh litre overhead service reservoir, and piped household drinking water distribution grid.',
    mpId: 'MP-031',
    mpName: 'Shri B. Suresh Kumar',
    state: 'Karnataka',
    constituency: 'Bangalore Rural',
    house: 'LOK_SABHA',
    category: 'Drinking Water',
    financialYear: '2024-2025',
    recommendationDate: '2024-01-22',
    sanctionDate: '2024-03-30',
    firstPaymentDate: '2024-05-18',
    latestPaymentDate: '2024-11-05',
    expectedCompletionDate: '2025-05-31',
    status: 'ONGOING',
    sanctionAmount: 85000000, // ₹8.5 Cr
    expenditure: 68000000,    // ₹6.8 Cr
    utilizationPercentage: 80.0,
    financialAnomalyScore: 76,
    paymentAnomalyScore: 65,
    delayProbability: 54,
    executionAnomalyScore: 48,
    duplicateSimilarityScore: 16,
    finalRiskScore: 76,
    finalRiskLevel: 'MEDIUM',
    riskReasons: [
      'Unusual expenditure pattern: 80% fund release ahead of pump house electrical clearance and pipeline pressure testing.',
      'Material procurement advance released in excess of standard rural water guidelines.',
      'Moderate probability (54%) of completion timeline extension.'
    ],
    signals: [
      {
        id: 'sig-fin-ka-03',
        name: 'Expenditure Timing Anomaly',
        score: 76,
        severity: 'HIGH',
        shortExplanation: 'Significant fund disbursement ahead of hydro-testing certification.',
        evidence: '₹6.8 Cr disbursed (80% of sanction) while distribution pipeline network is only 45% laid.',
        whyItMatters: 'Premature pipeline fund clearance before hydrostatic pressure tests risks non-functional pipeline leaks.',
        contributingWeight: 40
      },
      {
        id: 'sig-pay-ka-03',
        name: 'Voucher Advance Clustered',
        score: 65,
        severity: 'MEDIUM',
        shortExplanation: 'Large procurement tranches released in rapid intervals.',
        evidence: '₹3.4 Cr cleared across 2 vouchers in a single week for ductile iron pipe supplies.',
        whyItMatters: 'Requires verification of physical pipe yard receipt and district store registry.',
        contributingWeight: 30
      },
      {
        id: 'sig-del-ka-03',
        name: 'Predicted Delay Probability',
        score: 54,
        severity: 'MEDIUM',
        shortExplanation: 'Moderate delay risk driven by pending highway road crossing permission.',
        evidence: 'Right-of-way permission from state highway division pending for 4.2 km stretch.',
        whyItMatters: 'Inter-agency clearance bottlenecks can pause final commissioning.',
        contributingWeight: 20
      },
      {
        id: 'sig-exe-ka-03',
        name: 'Execution Alignment',
        score: 48,
        severity: 'LOW',
        shortExplanation: 'Reservoir structural civil work is progressing adequately.',
        evidence: 'Staging and column casting completed for overhead tank.',
        whyItMatters: 'Civil work on track; piping clearance requires coordination.',
        contributingWeight: 10
      }
    ],
    timeline: [
      { date: '2024-01-22', title: 'Work Recommended', description: 'Submitted by MP Shri B. Suresh Kumar to address fluoride mitigation.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2024-03-30', title: 'Administrative Sanction', description: 'District Collectorate issued sanction order for ₹8,50,00,000.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2024-05-18', title: 'First Mobilization Advance', description: '₹1,70,00,000 disbursed to M/s Deccan Water Solutions.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2024-08-10', title: 'Reservoir Foundation Inspection', description: 'RCC foundation depth and raft reinforcement approved by Executive Engineer.', type: 'INSPECTION', status: 'COMPLETED' },
      { date: '2024-11-05', title: 'Pipe Supply Tranche Cleared', description: '₹5,10,00,000 released; total expenditure reached ₹6,80,00,000 (80.0%).', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2025-05-31', title: 'Scheduled Completion Deadline', description: 'Target commissioning milestone.', type: 'COMPLETION', status: 'IN_PROGRESS' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹8.50 Cr', peerAverageValue: '₹7.80 Cr', varianceNote: 'Within normal rural piped water supply cost curve', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '80.0%', peerAverageValue: '62.0%', varianceNote: '+18 percentage points higher than peer progress at 8 months', isSignificant: true },
      { metric: 'Utilization Rate', currentWorkValue: '80.0%', peerAverageValue: '62.0%', varianceNote: 'Rapid budget depletion', isSignificant: true },
      { metric: 'Delay Probability', currentWorkValue: '54%', peerAverageValue: '32%', varianceNote: 'Moderate risk due to pending highway crossing NOC', isSignificant: true },
      { metric: 'Overall Risk Score', currentWorkValue: '76 / 100', peerAverageValue: '38 / 100', varianceNote: 'Medium priority surveillance', isSignificant: true }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // 4. High-Risk Work with Payment Anomaly + Delay Risk (Punjab Community Health Centre)
  {
    workId: 'MP-PUN-2023-089',
    title: 'Construction of 30-Bed Community Health Sub-Centre & Maternity Wing',
    description: 'Civil construction, plumbing, electrical installations, and maternal healthcare facilities at Majitha Block, Amritsar District.',
    mpId: 'MP-042',
    mpName: 'Sardar Gurmeet Singh',
    state: 'Punjab',
    constituency: 'Amritsar',
    house: 'LOK_SABHA',
    category: 'Health & Family Welfare',
    financialYear: '2023-2024',
    recommendationDate: '2023-04-12',
    sanctionDate: '2023-06-20',
    expectedCompletionDate: '2024-03-31',
    status: 'ONGOING',
    sanctionAmount: 4820000, // ₹48.20 Lakhs
    expenditure: 3980000,    // ₹39.80 Lakhs
    utilizationPercentage: 82.57,
    financialAnomalyScore: 74,
    paymentAnomalyScore: 88,
    delayProbability: 82,
    executionAnomalyScore: 61,
    duplicateSimilarityScore: 12,
    finalRiskScore: 82,
    finalRiskLevel: 'HIGH',
    riskReasons: [
      'Unusual payment frequency: 11 disbursements within 6 months compared to peer cohort average of 5.8.',
      'Substantial front-loading: 82.6% of budget disbursed while physical inspection reports show early-stage masonry (estimated ~35% physical progress).',
      'High predicted delay risk: Current pace and material delays indicate 82% probability of exceeding target deadline by >9 months.'
    ],
    signals: [
      {
        id: 'sig-pay-01',
        name: 'Payment Timing & Frequency Anomaly',
        score: 88,
        severity: 'HIGH',
        shortExplanation: 'Multiple rapid payments executed in short succession with unusual invoice clustering.',
        evidence: '11 payment vouchers cleared between Aug 2023 and Nov 2023, including 3 tranches disbursed within 72 hours to a single vendor.',
        whyItMatters: 'Standard public works contracting guidelines dictate milestone-verified tranches. Accelerated tranches prior to foundation curing deviate from typical civil schedules.',
        contributingWeight: 40
      },
      {
        id: 'sig-del-01',
        name: 'Predicted Delay Probability',
        score: 82,
        severity: 'HIGH',
        shortExplanation: 'AI trajectory model projects high likelihood of severe completion delay.',
        evidence: '18 months elapsed since sanction. Comparable 30-bed healthcare centres in Punjab average 11.2 months from sanction to lock-up stage; current milestone progress is lagging behind 78% of peers.',
        whyItMatters: 'Delays in maternal health infrastructure deprive rural populations of institutional delivery facilities and often lead to escalated cost overruns.',
        contributingWeight: 30
      },
      {
        id: 'sig-fin-01',
        name: 'Expenditure Progression Deviation',
        score: 74,
        severity: 'HIGH',
        shortExplanation: 'Expenditure rate severely outpaces reported civil milestone certifications.',
        evidence: '₹39.80L disbursed (82.6% of sanction), whereas peer works at equivalent structural stage have drawn only ₹18.5L - ₹24.0L (38%-50%).',
        whyItMatters: 'Financial outflow outpacing physical verification creates fiscal exposure before key completion milestones are inspected by district engineers.',
        contributingWeight: 20
      },
      {
        id: 'sig-exe-01',
        name: 'Execution Timeline Anomaly',
        score: 61,
        severity: 'MEDIUM',
        shortExplanation: 'Long gap between administrative approval and site mobilization.',
        evidence: '84 days elapsed between administrative sanction and site demarcation, followed by abrupt compressed disbursement.',
        whyItMatters: 'Long initial dormancy followed by sudden disbursement surges frequently warrants verification of contractor mobilization readiness.',
        contributingWeight: 10
      }
    ],
    timeline: [
      { date: '2023-04-12', title: 'Work Recommended', description: 'Formal recommendation letter submitted by MP for Majitha Block healthcare.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-06-20', title: 'Technical & Admin Sanction', description: 'District Collectorate issued sanction order for ₹48,20,000.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-08-14', title: 'First Mobilization Advance', description: '₹9,64,000 disbursed to M/s Apex Infra Buildtech.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-09-22', title: 'Plinth Level Inspection', description: 'District Sub-Divisional Engineer flagged minor structural reinforcement query.', type: 'INSPECTION', status: 'COMPLETED' },
      { date: '2023-10-05', title: 'Rapid Tranche Disbursements', description: '4 payment vouchers totaling ₹18,40,000 cleared across 12 days.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-11-18', title: 'Latest Payment Issued', description: '₹11,76,000 released; total expenditure reached ₹39,80,000 (82.6%).', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2024-03-31', title: 'Scheduled Completion Deadline', description: 'Target completion milestone originally specified in tender schedule.', type: 'COMPLETION', status: 'IN_PROGRESS' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹48.20 Lakhs', peerAverageValue: '₹43.70 Lakhs', varianceNote: '+10.3% above district average', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹39.80 Lakhs', peerAverageValue: '₹27.40 Lakhs', varianceNote: '+45.3% ahead of peer expenditure at same duration', isSignificant: true },
      { metric: 'Utilization Rate', currentWorkValue: '82.6%', peerAverageValue: '62.7%', varianceNote: '+19.9% faster budget depletion', isSignificant: true },
      { metric: 'Total Payments', currentWorkValue: '11 payments', peerAverageValue: '5.8 payments', varianceNote: 'Almost double the typical transaction count', isSignificant: true },
      { metric: 'Average Payment Amount', currentWorkValue: '₹3.62 Lakhs', peerAverageValue: '₹4.72 Lakhs', varianceNote: 'High frequency of split sub-5-lakh tranches', isSignificant: true },
      { metric: 'Time Since Sanction', currentWorkValue: '18 Months', peerAverageValue: '16 Months', varianceNote: 'Within normal elapsed window', isSignificant: false },
      { metric: 'Predicted Delay Probability', currentWorkValue: '82%', peerAverageValue: '31%', varianceNote: '+51 percentage points above cohort risk', isSignificant: true },
      { metric: 'Overall Risk Score', currentWorkValue: '82 / 100', peerAverageValue: '28 / 100', varianceNote: 'Marked as Priority Human Review Candidate', isSignificant: true }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // 2. High-Risk Work with Financial Anomaly (Front-Loaded Advance)
  {
    workId: 'MP-UP-2023-104',
    title: 'Installation of Solar Mini-Grid & Integrated Street Lighting in 14 Gram Panchayats',
    description: 'Deployment of centralized solar generation inverters, lithium batteries, and 320 high-efficiency solar street luminaires across Sevapuri block.',
    mpId: 'MP-018',
    mpName: 'Dr. Anandvardhan Mishra',
    state: 'Uttar Pradesh',
    constituency: 'Varanasi',
    house: 'LOK_SABHA',
    category: 'Electricity & Solar Lighting',
    financialYear: '2023-2024',
    recommendationDate: '2023-05-10',
    sanctionDate: '2023-07-02',
    expectedCompletionDate: '2024-01-15',
    status: 'ONGOING',
    sanctionAmount: 6500000, // ₹65.00 Lakhs
    expenditure: 5950000,    // ₹59.50 Lakhs
    utilizationPercentage: 91.54,
    financialAnomalyScore: 92,
    paymentAnomalyScore: 68,
    delayProbability: 46,
    executionAnomalyScore: 71,
    duplicateSimilarityScore: 19,
    finalRiskScore: 78,
    finalRiskLevel: 'HIGH',
    riskReasons: [
      'Unusual financial curve: 91.5% of total budget disbursed within 45 days of sanction order.',
      'Advance ratio anomaly: Single lump-sum advance payment representing 70% of contract value without stage certification on record.',
      'Equipment procurement documentation pending district nodal clearance.'
    ],
    signals: [
      {
        id: 'sig-fin-02',
        name: 'Front-Loaded Expenditure Surge',
        score: 92,
        severity: 'HIGH',
        shortExplanation: 'Severe advance disbursement anomaly exceeding standard state procurement guidelines.',
        evidence: '₹45,50,000 (70% of sanction) cleared to supplier 18 days after sanction without factory inspection certificate.',
        whyItMatters: 'MPLADS guidelines limit initial advances to 15-20% for material procurement. 70% unbonded disbursement exposes funds to vendor performance default.',
        contributingWeight: 50
      },
      {
        id: 'sig-exe-02',
        name: 'Verification Discrepancy',
        score: 71,
        severity: 'MEDIUM',
        shortExplanation: 'Third-party physical verification geotag photos incomplete for 9 out of 14 panchayats.',
        evidence: 'Only 5 Gram Panchayats have verified solar pole coordinates uploaded on the portal.',
        whyItMatters: 'Disbursement of full vendor claims before geotag verification risks non-installation in remote habitations.',
        contributingWeight: 25
      },
      {
        id: 'sig-pay-02',
        name: 'Single Vendor Concentration',
        score: 68,
        severity: 'MEDIUM',
        shortExplanation: '100% of disbursements routed to an enterprise registered less than 9 months prior to award.',
        evidence: 'Contractor incorporated in October 2022; tender awarded July 2023.',
        whyItMatters: 'Unusual vendor vintage combined with high advance disbursement warrants tender eligibility audit.',
        contributingWeight: 25
      }
    ],
    timeline: [
      { date: '2023-05-10', title: 'Work Recommended', description: 'Recommended by MP for solar electrification in Sevapuri.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-07-02', title: 'Sanction Issued', description: 'Sanction order issued for ₹65.00 Lakhs.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-07-20', title: 'Lump Sum Advance', description: '₹45.50L cleared as supply advance to SunBright Solutions.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-08-25', title: 'Second Tranche', description: '₹14.00L released upon delivery of pole assemblies.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2024-01-15', title: 'Original Deadline', description: 'Target date for full commissioning and grid integration.', type: 'COMPLETION', status: 'IN_PROGRESS' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹65.00 Lakhs', peerAverageValue: '₹58.20 Lakhs', varianceNote: '+11.7% variance', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹59.50 Lakhs', peerAverageValue: '₹34.10 Lakhs', varianceNote: '+74.5% faster financial clearance than comparable solar schemes', isSignificant: true },
      { metric: 'Utilization Rate', currentWorkValue: '91.5%', peerAverageValue: '58.6%', varianceNote: 'Near-total disbursement in initial phase', isSignificant: true },
      { metric: 'Total Payments', currentWorkValue: '2 payments', peerAverageValue: '5.2 payments', varianceNote: 'Highly concentrated lump sums', isSignificant: true },
      { metric: 'Predicted Delay Probability', currentWorkValue: '46%', peerAverageValue: '25%', varianceNote: 'Moderate delay risk', isSignificant: false },
      { metric: 'Overall Risk Score', currentWorkValue: '78 / 100', peerAverageValue: '24 / 100', varianceNote: 'High financial divergence', isSignificant: true }
    ],
    reviewStatus: 'UNDER_REVIEW',
    reviewNotes: ['2023-12-10: District Audit Officer noted lack of geotagged battery bank photos. Verification report requested.']
  },

  // 3. Potentially Similar / Duplicate Work Candidate A
  {
    workId: 'MP-MH-2023-042',
    title: 'Installation of High-Mast LED Lighting & Surrounding Paver Blocks at Shivaji Chowk',
    description: 'Erection of 16-metre octagonal high-mast pole with eight 400W LED floodlights and interlocked heavy paver tiles around Shivaji Chowk roundabout, Baramati.',
    mpId: 'MP-077',
    mpName: 'Smt. Supriya V. Patil',
    state: 'Maharashtra',
    constituency: 'Baramati',
    house: 'LOK_SABHA',
    category: 'Electricity & Solar Lighting',
    financialYear: '2023-2024',
    recommendationDate: '2023-02-14',
    sanctionDate: '2023-04-18',
    expectedCompletionDate: '2023-11-30',
    status: 'ONGOING',
    sanctionAmount: 1850000, // ₹18.50 Lakhs
    expenditure: 1200000,    // ₹12.00 Lakhs
    utilizationPercentage: 64.86,
    financialAnomalyScore: 28,
    paymentAnomalyScore: 22,
    delayProbability: 38,
    executionAnomalyScore: 30,
    duplicateSimilarityScore: 89,
    finalRiskScore: 68,
    finalRiskLevel: 'MEDIUM',
    riskReasons: [
      'High lexical and geospatial similarity (89%) to sanctioned work MP-MH-2022-077 within the same municipal circle.',
      'Potential overlapping scope with a municipal council scheme sanctioned in previous fiscal year.',
      'Requires spatial verification to ensure separate physical assets are being constructed.'
    ],
    signals: [
      {
        id: 'sig-dup-01',
        name: 'Potential Duplicate / Similar Work Match',
        score: 89,
        severity: 'HIGH',
        shortExplanation: 'High cosine similarity of title, location coordinates, and bill of quantities with an existing work.',
        evidence: 'Overlaps with Work MP-MH-2022-077 ("High Mast LED Lighting and Paver Blocks at Shivaji Chowk, Ward 4") located within 90 metres.',
        whyItMatters: 'MPLADS rules prohibit sanctioning identical asset creation in the exact same location if public funds were already utilized in the preceding 3 years.',
        contributingWeight: 65
      },
      {
        id: 'sig-del-02',
        name: 'Delay Probability',
        score: 38,
        severity: 'LOW',
        shortExplanation: 'Minor civil delay due to monsoon road excavation permits.',
        evidence: 'Work ongoing with reasonable structural progress.',
        whyItMatters: 'Presents standard seasonal execution profile.',
        contributingWeight: 15
      }
    ],
    timeline: [
      { date: '2023-02-14', title: 'Work Recommended', description: 'Recommended by MP for public safety at Shivaji Chowk.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-04-18', title: 'Sanction Granted', description: 'Sanctioned for ₹18.50 Lakhs by District Collector Pune.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-07-10', title: 'Mobilization Payment', description: '₹6,00,000 paid to Omkar Electricals.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-09-15', title: 'Civil Foundation Clearance', description: '₹6,00,000 disbursed following pole erection.', type: 'PAYMENT', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹18.50 Lakhs', peerAverageValue: '₹17.20 Lakhs', varianceNote: 'Standard market rate', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹12.00 Lakhs', peerAverageValue: '₹11.40 Lakhs', varianceNote: 'Normal progression', isSignificant: false },
      { metric: 'Duplicate Similarity', currentWorkValue: '89% (High)', peerAverageValue: '12%', varianceNote: 'Strong textual and geospatial proximity signal', isSignificant: true }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // 4. Potentially Similar / Duplicate Work Candidate B (Completed earlier work)
  {
    workId: 'MP-MH-2022-077',
    title: 'High Mast LED Lighting and Paver Blocks at Shivaji Chowk, Ward 4',
    description: 'Installation of high mast lighting tower and 80mm interlock concrete paving for traffic island embellishment at Shivaji Chowk, Baramati.',
    mpId: 'MP-077',
    mpName: 'Smt. Supriya V. Patil',
    state: 'Maharashtra',
    constituency: 'Baramati',
    house: 'LOK_SABHA',
    category: 'Electricity & Solar Lighting',
    financialYear: '2022-2023',
    recommendationDate: '2022-03-05',
    sanctionDate: '2022-05-12',
    actualCompletionDate: '2022-12-20',
    status: 'COMPLETED',
    sanctionAmount: 1680000, // ₹16.80 Lakhs
    expenditure: 1680000,    // ₹16.80 Lakhs
    utilizationPercentage: 100.0,
    financialAnomalyScore: 14,
    paymentAnomalyScore: 18,
    delayProbability: 12,
    executionAnomalyScore: 16,
    duplicateSimilarityScore: 89,
    finalRiskScore: 24,
    finalRiskLevel: 'LOW',
    riskReasons: [
      'Historical completed work serving as baseline candidate for similarity comparison.'
    ],
    signals: [
      {
        id: 'sig-dup-02',
        name: 'Matched Baseline Candidate',
        score: 89,
        severity: 'MEDIUM',
        shortExplanation: 'Matched asset for duplicate investigation of ongoing work MP-MH-2023-042.',
        evidence: 'Asset certified complete on 2022-12-20 by Baramati Municipal Engineer.',
        whyItMatters: 'Cross-referencing completion certificate and geotag will confirm if 2023 work is an extension or duplicate claim.',
        contributingWeight: 80
      }
    ],
    timeline: [
      { date: '2022-03-05', title: 'Work Recommended', description: 'Recommended in FY 22-23.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2022-05-12', title: 'Sanction Issued', description: 'Sanction issued for ₹16.80 Lakhs.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2022-12-20', title: 'Asset Commissioned & Completed', description: 'Work completed, full utilization reported.', type: 'COMPLETION', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹16.80 Lakhs', peerAverageValue: '₹16.50 Lakhs', varianceNote: 'Standard', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹16.80 Lakhs', peerAverageValue: '₹16.80 Lakhs', varianceNote: '100% utilized', isSignificant: false }
    ],
    reviewStatus: 'RESOLVED',
    reviewNotes: ['Completed asset. Cross-referenced in duplicate detection module.']
  },

  // 5. Normal, Low-Risk Exemplary Completed Work
  {
    workId: 'MP-KA-2022-018',
    title: 'Installation of 500 LPH Drinking Water Reverse Osmosis Plant & Water ATM',
    description: 'Construction of water treatment shed, installation of double-stage RO system, chilling unit, and smart-card water dispensing kiosk in Bilikere village.',
    mpId: 'MP-033',
    mpName: 'Shri Pratap Kumar Hegde',
    state: 'Karnataka',
    constituency: 'Mysuru',
    house: 'LOK_SABHA',
    category: 'Drinking Water',
    financialYear: '2022-2023',
    recommendationDate: '2022-04-10',
    sanctionDate: '2022-06-15',
    actualCompletionDate: '2023-01-25',
    status: 'COMPLETED',
    sanctionAmount: 1450000, // ₹14.50 Lakhs
    expenditure: 1425000,    // ₹14.25 Lakhs
    utilizationPercentage: 98.28,
    financialAnomalyScore: 12,
    paymentAnomalyScore: 15,
    delayProbability: 8,
    executionAnomalyScore: 10,
    duplicateSimilarityScore: 6,
    finalRiskScore: 14,
    finalRiskLevel: 'LOW',
    riskReasons: [
      'Normal progression adhering to standard civil timeline and milestone-linked payments.',
      'Third-party geotagged inspection confirmed operational status and water quality compliance.'
    ],
    signals: [
      {
        id: 'sig-norm-01',
        name: 'Regular Financial Velocity',
        score: 12,
        severity: 'LOW',
        shortExplanation: 'Disbursements followed 4 standard progressive milestones.',
        evidence: 'Payments matched 25%, 50%, 80%, and final 100% testing milestones.',
        whyItMatters: 'Demonstrates standard adherence to public procurement benchmarks.',
        contributingWeight: 20
      },
      {
        id: 'sig-norm-02',
        name: 'Low Delay Risk',
        score: 8,
        severity: 'LOW',
        shortExplanation: 'Completed within 7 months against standard 8-month timeline.',
        evidence: 'Commissioned on 2023-01-25 with water quality lab test certificate attached.',
        whyItMatters: 'Exemplary execution without cost or schedule overrun.',
        contributingWeight: 20
      }
    ],
    timeline: [
      { date: '2022-04-10', title: 'Work Recommended', description: 'Recommended by MP for Bilikere drinking water crisis.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2022-06-15', title: 'Sanction Order', description: '₹14,50,000 sanctioned by Deputy Commissioner Mysuru.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2022-08-02', title: 'Foundation & Shed Clearance', description: '₹3,62,500 released upon shed completion.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2022-10-14', title: 'RO Machinery Delivery', description: '₹5,80,000 released upon plant delivery and inspection.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-01-25', title: 'Commissioning & Handover', description: 'Final payment cleared; water ATM dedicated to public.', type: 'COMPLETION', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹14.50 Lakhs', peerAverageValue: '₹15.10 Lakhs', varianceNote: 'Below average cost', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹14.25 Lakhs', peerAverageValue: '₹14.80 Lakhs', varianceNote: 'Under budget by ₹25,000', isSignificant: false },
      { metric: 'Execution Duration', currentWorkValue: '7.3 Months', peerAverageValue: '8.4 Months', varianceNote: 'Completed faster than peer average', isSignificant: false }
    ],
    reviewStatus: 'RESOLVED',
    reviewNotes: ['Regular audit completed. Complies with all standards.']
  },

  // 6. Ongoing Work with High Predicted Delay Probability
  {
    workId: 'MP-TN-2023-055',
    title: 'Upgradation of Rural Link Road & Stormwater Drainage in Usilampatti',
    description: 'Black topping of 4.2 km rural agricultural link road, construction of concrete side drains, and 2 culvert cross-drainage structures connecting Usilampatti to State Highway 72.',
    mpId: 'MP-052',
    mpName: 'Thiru S. Venkatesan',
    state: 'Tamil Nadu',
    constituency: 'Madurai',
    house: 'LOK_SABHA',
    category: 'Roads, Pathways & Bridges',
    financialYear: '2023-2024',
    recommendationDate: '2023-03-01',
    sanctionDate: '2023-05-18',
    expectedCompletionDate: '2023-12-15',
    status: 'ONGOING',
    sanctionAmount: 5200000, // ₹52.00 Lakhs
    expenditure: 1820000,    // ₹18.20 Lakhs
    utilizationPercentage: 35.0,
    financialAnomalyScore: 42,
    paymentAnomalyScore: 35,
    delayProbability: 91,
    executionAnomalyScore: 84,
    duplicateSimilarityScore: 14,
    finalRiskScore: 75,
    finalRiskLevel: 'HIGH',
    riskReasons: [
      'Extreme projected delay: Machine learning model predicts 91% probability of exceeding target completion by >12 months.',
      'Execution velocity severely depressed: 19 months elapsed since sanction with only 35% financial utilization and zero tar layer applied.',
      'Pending forest/culvert clearance causing complete site shutdown for 110 consecutive days.'
    ],
    signals: [
      {
        id: 'sig-del-03',
        name: 'Critical Predicted Delay Risk',
        score: 91,
        severity: 'HIGH',
        shortExplanation: 'Model projects >90% likelihood of indefinite project stall.',
        evidence: 'Site inactive for 110 days. Culvert earthwork halted at Km 2.1 due to utility shifting and environmental right-of-way clearance.',
        whyItMatters: 'Rural link roads left incomplete through monsoon seasons suffer sub-base erosion, destroying previously executed gravel foundation.',
        contributingWeight: 50
      },
      {
        id: 'sig-exe-03',
        name: 'Execution Stall Anomaly',
        score: 84,
        severity: 'HIGH',
        shortExplanation: 'Zero contractor mobilization logs or daily labor muster reports recorded since September 2023.',
        evidence: 'No expenditure or measurement book entry in the last 180 days despite ₹18.20L advance disbursed.',
        whyItMatters: 'Prolonged contractor absence indicates potential dispute or contractor liquidity distress requiring executive intervention.',
        contributingWeight: 35
      }
    ],
    timeline: [
      { date: '2023-03-01', title: 'Work Recommended', description: 'Recommended by MP for agricultural transport connectivity.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-05-18', title: 'Sanction Granted', description: 'Sanction order issued for ₹52,00,000.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-07-12', title: 'Earthwork Advance', description: '₹18,20,000 released to Madurai Infrastructure Ltd.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-09-04', title: 'Execution Stoppage', description: 'Highway department halted culvert digging pending utility pipe relocation.', type: 'INSPECTION', status: 'COMPLETED' },
      { date: '2023-12-15', title: 'Original Deadline Missed', description: 'Target delivery milestone passed with work stalled.', type: 'COMPLETION', status: 'IN_PROGRESS' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹52.00 Lakhs', peerAverageValue: '₹49.50 Lakhs', varianceNote: 'Nominal variance', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹18.20 Lakhs', peerAverageValue: '₹41.20 Lakhs', varianceNote: 'Severely lagging peer expenditure (-55.8%)', isSignificant: true },
      { metric: 'Time Elapsed', currentWorkValue: '19 Months', peerAverageValue: '10.5 Months', varianceNote: 'Almost 2x standard duration', isSignificant: true },
      { metric: 'Delay Probability', currentWorkValue: '91%', peerAverageValue: '28%', varianceNote: 'Critical delay outlier in state road portfolio', isSignificant: true }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // 7. Work with Concentrated Rapid Payments (Medium-High Risk)
  {
    workId: 'MP-DL-2023-012',
    title: 'Modernization of Public Library, Digital Learning Center & Community Hall',
    description: 'Procurement of 50 desktop computer terminals, gigabit LAN cabling, library shelving, and interior acoustic retrofitting at Shakarpur, East Delhi.',
    mpId: 'MP-009',
    mpName: 'Shri Gautam Gambhir',
    state: 'Delhi',
    constituency: 'East Delhi',
    house: 'LOK_SABHA',
    category: 'Education & Libraries',
    financialYear: '2023-2024',
    recommendationDate: '2023-01-20',
    sanctionDate: '2023-03-30',
    expectedCompletionDate: '2023-10-31',
    status: 'ONGOING',
    sanctionAmount: 3800000, // ₹38.00 Lakhs
    expenditure: 3650000,    // ₹36.50 Lakhs
    utilizationPercentage: 96.05,
    financialAnomalyScore: 65,
    paymentAnomalyScore: 79,
    delayProbability: 25,
    executionAnomalyScore: 40,
    duplicateSimilarityScore: 8,
    finalRiskScore: 69,
    finalRiskLevel: 'MEDIUM',
    riskReasons: [
      'Unusual payment velocity: 8 separate disbursements completed in 14 days immediately prior to financial year end.',
      'Invoice splitting pattern detected: Several consecutive payments placed just below ₹5 Lakh statutory tender threshold.',
      'Single IT hardware supplier received 96% of total work funds.'
    ],
    signals: [
      {
        id: 'sig-pay-04',
        name: 'Fiscal Year-End Payment Rush',
        score: 79,
        severity: 'HIGH',
        shortExplanation: 'High clustering of transactions in the final two weeks of March.',
        evidence: '8 payment vouchers processed between March 18 and March 30, averaging ₹4.56L each.',
        whyItMatters: 'Transaction splitting just under statutory procurement threshold (₹5L) is an established indicator of circumventing open e-procurement mandates.',
        contributingWeight: 45
      },
      {
        id: 'sig-fin-03',
        name: 'Rapid Fund Exhaustion',
        score: 65,
        severity: 'MEDIUM',
        shortExplanation: '96% budget utilized within 3 weeks of sanction issuance.',
        evidence: 'Sanction issued March 30; total funds disbursed by April 20.',
        whyItMatters: 'Physical delivery and inspection of complex IT equipment generally requires 6-8 weeks minimum lead time.',
        contributingWeight: 35
      }
    ],
    timeline: [
      { date: '2023-01-20', title: 'Work Recommended', description: 'Recommended by MP for youth digital skills centre.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-03-30', title: 'Sanction Accorded', description: 'Sanction order released for ₹38.00 Lakhs.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-04-05', title: 'Hardware Tranches 1 & 2', description: 'Two payments of ₹4.85L cleared for servers and monitors.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-04-12', title: 'Furniture & Cabling Tranches', description: 'Three payments of ₹4.80L cleared on same day.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-04-19', title: 'Final Equipment Payment', description: 'Final voucher cleared, taking total expenditure to ₹36.50L.', type: 'PAYMENT', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹38.00 Lakhs', peerAverageValue: '₹35.00 Lakhs', varianceNote: 'Normal', isSignificant: false },
      { metric: 'Transaction Frequency', currentWorkValue: '8 in 14 days', peerAverageValue: '4 across 90 days', varianceNote: '3.2x faster clearing rate', isSignificant: true },
      { metric: 'Payment Splitting Signal', currentWorkValue: 'Present (sub-5L)', peerAverageValue: 'Absent', varianceNote: 'Requires procurement file review', isSignificant: true }
    ],
    reviewStatus: 'UNDER_REVIEW',
    reviewNotes: ['2023-11-04: Assigned to Internal Audit for e-tender threshold compliance verification.']
  },

  // 8. Normal Ongoing Work in Early Stage
  {
    workId: 'MP-RJ-2023-112',
    title: 'Construction of Sub-District Sports Complex, Badminton Courts & Athletic Track',
    description: 'Construction of 2 indoor synthetic badminton courts, 400-metre clay running track, boundary wall, and spectator seating at Pokhran.',
    mpId: 'MP-061',
    mpName: 'Shri Kailash Choudhary',
    state: 'Rajasthan',
    constituency: 'Barmer',
    house: 'LOK_SABHA',
    category: 'Sports & Youth Development',
    financialYear: '2023-2024',
    recommendationDate: '2023-08-15',
    sanctionDate: '2023-10-05',
    expectedCompletionDate: '2024-07-31',
    status: 'ONGOING',
    sanctionAmount: 7500000, // ₹75.00 Lakhs
    expenditure: 1500000,    // ₹15.00 Lakhs
    utilizationPercentage: 20.0,
    financialAnomalyScore: 18,
    paymentAnomalyScore: 12,
    delayProbability: 15,
    executionAnomalyScore: 14,
    duplicateSimilarityScore: 5,
    finalRiskScore: 16,
    finalRiskLevel: 'LOW',
    riskReasons: [
      'Normal early-stage mobilization conforming to planned engineering schedule.',
      'Initial 20% advance secured by bank guarantee and verified boundary demarcations.'
    ],
    signals: [
      {
        id: 'sig-norm-03',
        name: 'Standard Mobilization Ratio',
        score: 18,
        severity: 'LOW',
        shortExplanation: 'Initial payment conforms to standard 20% mobilization norm.',
        evidence: '₹15.00L advance against bank guarantee BG/2023/881.',
        whyItMatters: 'Represents model procurement process.',
        contributingWeight: 30
      }
    ],
    timeline: [
      { date: '2023-08-15', title: 'Work Recommended', description: 'Recommended on Independence Day for youth athletics.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-10-05', title: 'Sanction Order', description: 'Sanctioned for ₹75.00 Lakhs by District Collector Barmer.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-11-20', title: 'Mobilization Advance', description: '20% advance released following site takeover.', type: 'PAYMENT', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹75.00 Lakhs', peerAverageValue: '₹70.00 Lakhs', varianceNote: 'Standard for regional sports facility', isSignificant: false },
      { metric: 'Utilization Rate', currentWorkValue: '20.0%', peerAverageValue: '21.5%', varianceNote: 'Expected early-stage profile', isSignificant: false }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // 9. Completed School Lab Renovation (Normal, Clean)
  {
    workId: 'MP-WB-2022-031',
    title: 'Modern Science & STEM Laboratories Renovation in 3 Higher Secondary Schools',
    description: 'Renovation of chemistry, physics, and biology labs, supply of lab furniture, gas manifolds, and digital microscopes in Basirhat subdivision.',
    mpId: 'MP-088',
    mpName: 'Smt. Nusrat Jahan Ruhi',
    state: 'West Bengal',
    constituency: 'Basirhat',
    house: 'LOK_SABHA',
    category: 'Education & Libraries',
    financialYear: '2022-2023',
    recommendationDate: '2022-07-11',
    sanctionDate: '2022-09-08',
    actualCompletionDate: '2023-04-15',
    status: 'COMPLETED',
    sanctionAmount: 3200000, // ₹32.00 Lakhs
    expenditure: 3180000,    // ₹31.80 Lakhs
    utilizationPercentage: 99.38,
    financialAnomalyScore: 16,
    paymentAnomalyScore: 19,
    delayProbability: 10,
    executionAnomalyScore: 12,
    duplicateSimilarityScore: 4,
    finalRiskScore: 18,
    finalRiskLevel: 'LOW',
    riskReasons: [
      'Normal verified completion with end-user school principal satisfaction certificates.'
    ],
    signals: [
      {
        id: 'sig-norm-04',
        name: 'Regular Milestone Verification',
        score: 16,
        severity: 'LOW',
        shortExplanation: 'All tranches supported by school engineering division inspections.',
        evidence: '3 schools inspected by District Inspector of Schools prior to handover.',
        whyItMatters: 'Conforms strictly to state public works standards.',
        contributingWeight: 25
      }
    ],
    timeline: [
      { date: '2022-07-11', title: 'Work Recommended', description: 'Recommended by MP for STEM education in border blocks.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2022-09-08', title: 'Sanction Order', description: 'Sanctioned for ₹32.00 Lakhs.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-04-15', title: 'Handover & Completion', description: 'Labs inaugurated and commissioned.', type: 'COMPLETION', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹32.00 Lakhs', peerAverageValue: '₹30.50 Lakhs', varianceNote: 'Standard rate', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹31.80 Lakhs', peerAverageValue: '₹30.20 Lakhs', varianceNote: '99.4% budget fidelity', isSignificant: false }
    ],
    reviewStatus: 'RESOLVED',
    reviewNotes: ['Completed and verified. Satisfactory operational audit.']
  },

  // 10. Medium Risk Work with Execution Anomaly (Sanitation Infrastructure)
  {
    workId: 'MP-BR-2023-064',
    title: 'Community Bio-Toilets & Decentralized Wastewater Treatment System',
    description: 'Construction of 20 community bio-digester toilet complexes with solar powered pumping in low-income wards of Samastipur.',
    mpId: 'MP-025',
    mpName: 'Shri Prince Raj',
    state: 'Bihar',
    constituency: 'Samastipur',
    house: 'LOK_SABHA',
    category: 'Sanitation & Public Health',
    financialYear: '2023-2024',
    recommendationDate: '2023-02-18',
    sanctionDate: '2023-04-25',
    expectedCompletionDate: '2023-11-20',
    status: 'ONGOING',
    sanctionAmount: 4200000, // ₹42.00 Lakhs
    expenditure: 2940000,    // ₹29.40 Lakhs
    utilizationPercentage: 70.0,
    financialAnomalyScore: 48,
    paymentAnomalyScore: 52,
    delayProbability: 66,
    executionAnomalyScore: 74,
    duplicateSimilarityScore: 11,
    finalRiskScore: 62,
    finalRiskLevel: 'MEDIUM',
    riskReasons: [
      'Execution milestone bottleneck: Bio-digester components delivered but civil plumbing stalled across 12 sites.',
      'Delay projection indicates 66% probability of 6-month overrun.',
      'Contractor has not submitted mandatory effluent compliance testing certificate.'
    ],
    signals: [
      {
        id: 'sig-exe-04',
        name: 'Civil Installation Stall',
        score: 74,
        severity: 'MEDIUM',
        shortExplanation: 'Prefabricated materials delivered to site without installation for >90 days.',
        evidence: 'Bio-tanks resting in open storage since August 2023 with weathering risk.',
        whyItMatters: 'Prolonged open-air storage of polymer bio-digesters degrades seal integrity before commissioning.',
        contributingWeight: 40
      },
      {
        id: 'sig-del-04',
        name: 'Predicted Delay Risk',
        score: 66,
        severity: 'MEDIUM',
        shortExplanation: 'Behind milestone target by 4 months.',
        evidence: 'Target date 2023-11-20 passed without water connection hookup.',
        whyItMatters: 'Deprives community of promised sanitation facilities in flood-prone ward.',
        contributingWeight: 35
      }
    ],
    timeline: [
      { date: '2023-02-18', title: 'Work Recommended', description: 'Recommended by MP for Swachh Bharat urban convergence.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-04-25', title: 'Sanction Accorded', description: 'Sanctioned for ₹42.00 Lakhs.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-06-30', title: 'Material Advance', description: '₹21.00L released for bio-digester tank manufacturing.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-08-18', title: 'Delivery Disbursement', description: '₹8.40L cleared upon material arrival at municipal yard.', type: 'PAYMENT', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹42.00 Lakhs', peerAverageValue: '₹40.00 Lakhs', varianceNote: 'Normal', isSignificant: false },
      { metric: 'Expenditure', currentWorkValue: '₹29.40 Lakhs', peerAverageValue: '₹28.00 Lakhs', varianceNote: 'Expected financial progress', isSignificant: false },
      { metric: 'Delay Probability', currentWorkValue: '66%', peerAverageValue: '32%', varianceNote: '+34 percentage points over peer average', isSignificant: true }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // 11. Rajya Sabha Nominated MP - Irrigation & Check Dam Work (Medium Risk)
  {
    workId: 'MP-OD-2023-029',
    title: 'Construction of Check Dam & Lift Irrigation System on Baitarani Tributary',
    description: 'RCC check dam weir of 35-metre span, 50 HP solar submersible pump station, and 1.8 km underground PVC distribution pipeline for tribal farmers in Keonjhar.',
    mpId: 'MP-099',
    mpName: 'Dr. Sasmit Patra',
    state: 'Odisha',
    constituency: 'State-wide Nominated',
    house: 'RAJYA_SABHA',
    category: 'Irrigation & Flood Control',
    financialYear: '2023-2024',
    recommendationDate: '2023-01-15',
    sanctionDate: '2023-03-22',
    expectedCompletionDate: '2024-02-28',
    status: 'ONGOING',
    sanctionAmount: 5800000, // ₹58.00 Lakhs
    expenditure: 3200000,    // ₹32.00 Lakhs
    utilizationPercentage: 55.17,
    financialAnomalyScore: 38,
    paymentAnomalyScore: 44,
    delayProbability: 58,
    executionAnomalyScore: 50,
    duplicateSimilarityScore: 9,
    finalRiskScore: 48,
    finalRiskLevel: 'MEDIUM',
    riskReasons: [
      'Seasonal river flow disruption during monsoon paused masonry weir construction.',
      'Slight payment gap between civil work completion and electrical pump procurement.'
    ],
    signals: [
      {
        id: 'sig-del-05',
        name: 'Monsoon Seasonal Delay Risk',
        score: 58,
        severity: 'MEDIUM',
        shortExplanation: 'Civil weir construction affected by high water discharge.',
        evidence: 'River depth prevented underwater concrete pouring between July and October.',
        whyItMatters: 'Standard hydrological challenge; work can resume rapidly post-monsoon if mobilized.',
        contributingWeight: 40
      }
    ],
    timeline: [
      { date: '2023-01-15', title: 'Work Recommended', description: 'Recommended by Rajya Sabha MP for tribal agricultural irrigation.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-03-22', title: 'Sanction Issued', description: 'Sanction issued for ₹58.00 Lakhs by District Collector Keonjhar.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-05-10', title: 'Foundation Trenching Payment', description: '₹18.00L released for bedrock excavation.', type: 'PAYMENT', status: 'COMPLETED' },
      { date: '2023-11-25', title: 'Pump Procurement Release', description: '₹14.00L released for solar pump sets.', type: 'PAYMENT', status: 'COMPLETED' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹58.00 Lakhs', peerAverageValue: '₹55.00 Lakhs', varianceNote: 'Conforms to state water resources schedule', isSignificant: false },
      { metric: 'Delay Probability', currentWorkValue: '58%', peerAverageValue: '42%', varianceNote: 'Hydrological seasonal variance', isSignificant: false }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  },

  // 12. Newly Sanctioned Community Centre
  {
    workId: 'MP-GJ-2023-095',
    title: 'Construction of Multi-Purpose Cyclone Shelter & Community Center in Coastal Porbandar',
    description: 'RCC two-storey disaster resilient community refuge with rainwater harvesting, solar backup, and disaster supply storage at Madhavpur Ghed.',
    mpId: 'MP-014',
    mpName: 'Shri Ramesh Dhaduk',
    state: 'Gujarat',
    constituency: 'Porbandar',
    house: 'LOK_SABHA',
    category: 'Community Infrastructure',
    financialYear: '2023-2024',
    recommendationDate: '2023-09-01',
    sanctionDate: '2023-11-15',
    expectedCompletionDate: '2024-09-30',
    status: 'SANCTIONED',
    sanctionAmount: 8500000, // ₹85.00 Lakhs
    expenditure: 0,
    utilizationPercentage: 0.0,
    financialAnomalyScore: 10,
    paymentAnomalyScore: 0,
    delayProbability: 18,
    executionAnomalyScore: 12,
    duplicateSimilarityScore: 7,
    finalRiskScore: 14,
    finalRiskLevel: 'LOW',
    riskReasons: [
      'Recently sanctioned project currently in transparent e-tendering phase.'
    ],
    signals: [
      {
        id: 'sig-new-01',
        name: 'Pre-Execution Tender Phase',
        score: 10,
        severity: 'LOW',
        shortExplanation: 'Tender notices published in state gazette and e-procurement portal.',
        evidence: 'Tender open until end of December; zero disbursements made.',
        whyItMatters: 'Healthy pre-award statutory lifecycle.',
        contributingWeight: 100
      }
    ],
    timeline: [
      { date: '2023-09-01', title: 'Work Recommended', description: 'Recommended by MP following coastal resilience assessment.', type: 'RECOMMENDATION', status: 'COMPLETED' },
      { date: '2023-11-15', title: 'Administrative Sanction', description: 'Sanction order issued for ₹85.00 Lakhs.', type: 'SANCTION', status: 'COMPLETED' },
      { date: '2023-11-28', title: 'NIT Published', description: 'Notice Inviting Tender published on Gujarat State e-procurement.', type: 'INSPECTION', status: 'IN_PROGRESS' }
    ],
    benchmarks: [
      { metric: 'Sanction Amount', currentWorkValue: '₹85.00 Lakhs', peerAverageValue: '₹80.00 Lakhs', varianceNote: 'Standard disaster shelter norm', isSignificant: false }
    ],
    reviewStatus: 'NEW',
    reviewNotes: []
  }
];
