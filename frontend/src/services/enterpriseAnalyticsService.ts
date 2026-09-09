/**
 * MediHelp Enterprise Population Health & Adherence Analytics Service
 * Provides clinical sponsors, ACOs, and health plans with population adherence metrics
 * and CMS Star Rating (Proportion of Days Covered - PDC) analytics.
 */

export interface PopulationHealthMetrics {
  totalPatientsEnrolled: number;
  averagePdcAdherencePercent: number; // PDC >= 80% is CMS Star Rating threshold
  adherenceDistribution: {
    highAdherenceCount: number; // PDC >= 80%
    moderateAdherenceCount: number; // 50% <= PDC < 80%
    lowAdherenceCount: number; // PDC < 50%
  };
  totalAnnualSavingsGenerated: number;
  averageSavingsPerPatient: number;
  cmsStarRatingEstimate: number; // e.g. 4.8 out of 5.0
  activeTherapeuticCategories: Array<{
    category: string;
    patientCount: number;
    pdcRate: number;
  }>;
}

export interface PatientAdherenceRiskProfile {
  patientId: string;
  patientName: string;
  primaryCondition: string;
  currentPdcPercent: number;
  riskCategory: 'Low' | 'Moderate' | 'High';
  lastRefillDate: string;
  recommendedIntervention: string;
}

const MOCK_POPULATION_METRICS: PopulationHealthMetrics = {
  totalPatientsEnrolled: 14280,
  averagePdcAdherencePercent: 86.4,
  adherenceDistribution: {
    highAdherenceCount: 11850,
    moderateAdherenceCount: 1820,
    lowAdherenceCount: 610
  },
  totalAnnualSavingsGenerated: 3410500,
  averageSavingsPerPatient: 238.80,
  cmsStarRatingEstimate: 4.85,
  activeTherapeuticCategories: [
    { category: 'Statins / Cholesterol (HMG-CoA)', patientCount: 5120, pdcRate: 88.2 },
    { category: 'Diabetes (Oral Hypoglycemics)', patientCount: 4310, pdcRate: 85.7 },
    { category: 'Hypertension (RAS Antagonists)', patientCount: 4850, pdcRate: 87.1 }
  ]
};

const MOCK_RISK_PROFILES: PatientAdherenceRiskProfile[] = [
  {
    patientId: 'prof-1',
    patientName: 'Eleanor Vance',
    primaryCondition: 'Hyperlipidemia & Hypertension',
    currentPdcPercent: 92.5,
    riskCategory: 'Low',
    lastRefillDate: 'Sep 02, 2026',
    recommendedIntervention: 'Maintain current 90-day auto-refill mail order schedule.'
  },
  {
    patientId: 'prof-2',
    patientName: 'Marcus Vance',
    primaryCondition: 'Type 2 Diabetes Mellitus',
    currentPdcPercent: 74.0,
    riskCategory: 'Moderate',
    lastRefillDate: 'Aug 14, 2026',
    recommendedIntervention: 'Send automated SMS dose reminder and schedule teleconsult concierge review.'
  },
  {
    patientId: 'prof-3',
    patientName: 'Sophia Vance',
    primaryCondition: 'Asthma & Allergy',
    currentPdcPercent: 48.0,
    riskCategory: 'High',
    lastRefillDate: 'Jul 20, 2026',
    recommendedIntervention: 'Trigger pharmacist outreach for non-adherence intervention and copay assistance.'
  }
];

/**
 * Retrieves aggregate enterprise population health analytics metrics
 */
export function getPopulationHealthMetrics(): PopulationHealthMetrics {
  return MOCK_POPULATION_METRICS;
}

/**
 * Retrieves patient adherence risk profiles for clinical sponsor intervention
 */
export function getPatientAdherenceRiskProfiles(): PatientAdherenceRiskProfile[] {
  return MOCK_RISK_PROFILES;
}

/**
 * Calculates PDC (Proportion of Days Covered) for a specific patient given days covered and total period
 */
export function calculatePdcScore(daysCovered: number, totalObservationDays: number = 90): number {
  if (totalObservationDays <= 0) return 0;
  const ratio = (daysCovered / totalObservationDays) * 100;
  return Math.min(100, Math.round(ratio * 10) / 10);
}
