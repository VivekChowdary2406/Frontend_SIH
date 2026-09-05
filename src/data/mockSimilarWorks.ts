import { SimilarWorkPair } from '../types/investigator';

export const mockSimilarWorkPairs: SimilarWorkPair[] = [
  {
    pairId: 'PAIR-2024-UP-01',
    primaryWorkId: 'WS/UP/2025/001',
    comparisonWorkId: 'MP-UP-2023-104',
    similarityScore: 78,
    categoryMatch: false,
    geographicProximityKm: 2.1,
    timeWindowMonths: 16,
    matchedAttributes: [
      'Same District: Varanasi Rural Gram Panchayat cluster',
      'Geographic Proximity: 2.1 km shared corridor',
      'Overlapping Civil Agency: Rural Engineering Services (RES) Nodal Wing',
      'Co-located Right-of-Way: Road alignment crosses previously cleared solar mini-grid trench'
    ],
    explanation: 'Potential asset co-location overlap identified between the 2024 Village Road Construction alignment and a 2023 solar electrification trench on the same link route in Varanasi.',
    recommendation: 'District nodal officer should verify spatial demarcations with local Gram Panchayat registry to prevent double-billing of shoulder earthwork.',
    reviewStatus: 'UNDER_INVESTIGATION'
  },
  {
    pairId: 'PAIR-2023-01',
    primaryWorkId: 'MP-MH-2023-042',
    comparisonWorkId: 'MP-MH-2022-077',
    similarityScore: 89,
    categoryMatch: true,
    geographicProximityKm: 0.09, // 90 metres
    timeWindowMonths: 11,
    matchedAttributes: [
      'Identical Location: Shivaji Chowk, Baramati Ward 4',
      'Matching Scope: High-Mast LED Lighting & Interlock Paver Blocks',
      'Identical Executing Department: Baramati Municipal Council',
      'Overlapping Vendor: Omkar Electrical Works & Fabricators',
      'Lexical Title Overlap: 92% token overlap'
    ],
    explanation: 'The ongoing 2023 work is proposed at the exact traffic circle where an identical high-mast installation was sanctioned and completed 11 months prior under FY 2022-2023 funds. Bill of quantities specifies replacement and additional paver blocks within 90 metres.',
    recommendation: 'District authority should dispatch a technical audit engineer with GPS coordinates to verify whether the 2023 work is a separate expansion or an unauthorized re-sanction of existing infrastructure.',
    reviewStatus: 'UNDER_INVESTIGATION'
  },
  {
    pairId: 'PAIR-2023-02',
    primaryWorkId: 'MP-UP-2023-104',
    comparisonWorkId: 'MP-UP-2022-049',
    similarityScore: 76,
    categoryMatch: true,
    geographicProximityKm: 1.8,
    timeWindowMonths: 14,
    matchedAttributes: [
      'Same Block: Sevapuri Gram Panchayat cluster',
      'Matching Hardware: 320 Integrated Solar LED Street Luminaires',
      'Common Vendor: M/s SunBright Solutions LLP'
    ],
    explanation: 'Substantial overlap in Gram Panchayat list between the 2023 solar mini-grid work and a 2022 solar lighting scheme sanctioned by the preceding administrative year.',
    recommendation: 'Cross-verify Gram Panchayat resolution registers to confirm exact pole numbers and ward demarcations.',
    reviewStatus: 'PENDING_REVIEW'
  },
  {
    pairId: 'PAIR-2023-03',
    primaryWorkId: 'MP-TN-2023-055',
    comparisonWorkId: 'MP-TN-2021-082',
    similarityScore: 68,
    categoryMatch: true,
    geographicProximityKm: 0.4,
    timeWindowMonths: 22,
    matchedAttributes: [
      'Same Corridor: Usilampatti Link Road Km 0.0 to 4.2',
      'Matching Component: Stormwater culvert cross-drainage structures'
    ],
    explanation: 'Potential overlap between rural road upgradation and previously sanctioned district panchayat culvert repair work on the same link stretch.',
    recommendation: 'Examine road history register in State Highways / DRDA records before clearing next tranche.',
    reviewStatus: 'PENDING_REVIEW'
  }
];
