export type ScreenType =
  | 'catalog'
  | 'drug-detail'
  | 'smart-routing'
  | 'discount-card'
  | 'teleconsult'
  | 'transfer-concierge'
  | 'b2b-dashboard'
  | 'copay-calculator'
  | 'adherence-schedule'
  | 'delivery-tracking'
  | 'interaction-checker'
  | 'price-alerts'
  | 'patient-wallet';

export interface ScreenMetadata {
  id: ScreenType;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  category: 'Consumer Rx' | 'Clinical & Delivery' | 'Operations & Wallet';
}

export interface PharmacyQuote {
  pharmacyId: string;
  pharmacyName: string;
  chainType: 'retail' | 'independent' | 'mail-order' | 'courier';
  logoUrl?: string;
  distance: string;
  address: string;
  cashPrice: number;
  discountPrice: number;
  insuranceEstimatedCopay: number;
  inStock: boolean;
  stockStatus: 'Ready in 15 min' | 'In Stock' | 'Special Order' | 'Free 2-Day Mail';
  bestValue?: boolean;
  couponCode?: string;
  bin?: string;
  pcn?: string;
  group?: string;
}

export interface DrugItem {
  id: string;
  name: string;
  brandName: string;
  genericName: string;
  isGenericAvailable: boolean;
  drugClass: string;
  typicalSavingsPercent: number;
  lowestPrice: number;
  averageRetailPrice: number;
  description: string;
  dosageForms: string[];
  strengths: string[];
  quantities: number[];
  selectedStrength: string;
  selectedForm: string;
  selectedQuantity: number;
  imageUrl: string;
  requiresPrescription: boolean;
  controlledSubstance: boolean;
  popularityRank: number;
  quotes: PharmacyQuote[];
}

export interface RoutingOption {
  drugId: string;
  drugName: string;
  dosage: string;
  recommendedPharmacy: string;
  monthlyCost: number;
  savingsVsRetail: number;
  fulfillmentMethod: 'Mail Order (Cold-Chain)' | 'Local Pharmacy Counter' | 'Same-Day Courier';
  leadTime: string;
  reason: string;
}

export interface RoutingPlan {
  id: string;
  strategyName: string;
  totalMonthlyCost: number;
  retailTotal: number;
  totalSavings: number;
  savingsPercentage: number;
  routes: RoutingOption[];
  recommendedBadge: boolean;
}

export interface TeleconsultDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  availableSlot: string;
  fee: number;
  avatarUrl: string;
  licenses: string[];
  education: string;
  bio: string;
}

export interface TransferRequest {
  id: string;
  patientName: string;
  rxNumber: string;
  drugName: string;
  dosage: string;
  sourcePharmacy: string;
  destinationPharmacy: string;
  status: 'submitted' | 'pharmacist_review' | 'transferring' | 'ready_for_pickup' | 'completed';
  dateSubmitted: string;
  estimatedCompletion: string;
}

export interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: 'major' | 'moderate' | 'minor';
  title: string;
  clinicalImpact: string;
  management: string;
  evidenceRating: string;
}

export interface AdherenceDose {
  id: string;
  drugName: string;
  dosage: string;
  scheduledTime: string;
  instructions: string;
  taken: boolean;
  takenAt?: string;
  colorHex: string;
  remainingPills: number;
  refillDaysLeft: number;
}

export interface PriceAlert {
  id: string;
  drugName: string;
  strength: string;
  currentLowest: number;
  targetPrice: number;
  notifyOnDrop: boolean;
  lastUpdated: string;
  changePercent: number;
  historicalTrend: 'up' | 'down' | 'stable';
}

export interface FamilyProfile {
  id: string;
  name: string;
  relation: string;
  dob: string;
  allergies: string[];
  activePrescriptionsCount: number;
  avatarColor: string;
  insuranceCard: {
    payerName: string;
    rxBin: string;
    rxPcn: string;
    rxGroup: string;
    memberId: string;
    status: 'Verified' | 'Pending';
  };
}
