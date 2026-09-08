import { DrugItem, TeleconsultDoctor, TransferRequest, DrugInteraction, AdherenceDose, PriceAlert, FamilyProfile, RoutingPlan, ScreenMetadata, AuthUser } from '../types';

export const ALL_SCREENS: ScreenMetadata[] = [
  {
    id: 'catalog',
    title: 'Drug Search & Comparison',
    subtitle: 'Real-time multi-pharmacy pricing matrix',
    icon: 'search',
    category: 'Consumer Rx',
    badge: 'Popular'
  },
  {
    id: 'drug-detail',
    title: 'Medication & Dose Configurator',
    subtitle: 'Form, strength, and 30/90-day tier analysis',
    icon: 'medication',
    category: 'Consumer Rx'
  },
  {
    id: 'smart-routing',
    title: 'Algorithmic Rx Routing Engine',
    subtitle: 'Multi-script fulfillment & split-order optimizer',
    icon: 'alt_route',
    category: 'Consumer Rx',
    badge: 'AI Engine'
  },
  {
    id: 'discount-card',
    title: 'Digital Rx Discount Pass',
    subtitle: 'NCPDP claim pass with live barcode & BIN/PCN',
    icon: 'badge',
    category: 'Consumer Rx'
  },
  {
    id: 'teleconsult',
    title: 'Teleconsultation & Rx Renewal',
    subtitle: 'Board-certified clinical intake & virtual visit',
    icon: 'videocam',
    category: 'Clinical & Delivery',
    badge: 'Live MD'
  },
  {
    id: 'transfer-concierge',
    title: 'Rx Transfer Concierge',
    subtitle: 'Automated script transfer & pharmacy handoff',
    icon: 'sync_alt',
    category: 'Clinical & Delivery'
  },
  {
    id: 'delivery-tracking',
    title: 'Cold-Chain Delivery Tracking',
    subtitle: 'Real-time GPS dispatch & temp sensor monitor',
    icon: 'local_shipping',
    category: 'Clinical & Delivery',
    badge: 'Real-time'
  },
  {
    id: 'interaction-checker',
    title: 'Clinical Interaction Checker',
    subtitle: 'Pharmacodynamic contraindication scanner',
    icon: 'warning',
    category: 'Clinical & Delivery'
  },
  {
    id: 'adherence-schedule',
    title: 'Medication Adherence & Pillbox',
    subtitle: 'Intelligent dosing logs & auto-refill triggers',
    icon: 'calendar_month',
    category: 'Clinical & Delivery'
  },
  {
    id: 'copay-calculator',
    title: 'Deductible vs Cash Estimator',
    subtitle: 'Commercial copay vs direct cash cost modeler',
    icon: 'calculate',
    category: 'Operations & Wallet'
  },
  {
    id: 'price-alerts',
    title: 'Price Drop Watchlist',
    subtitle: 'Algorithmic price variance & trigger notifications',
    icon: 'trending_down',
    category: 'Operations & Wallet'
  },
  {
    id: 'patient-wallet',
    title: 'Family Health Wallet & Profiles',
    subtitle: 'HIPAA vault, dependents, & insurance cards',
    icon: 'wallet',
    category: 'Operations & Wallet'
  },
  {
    id: 'b2b-dashboard',
    title: 'Pharmacy Enterprise OS Console',
    subtitle: 'Multi-tenant script routing & claim reconciliation',
    icon: 'domain',
    category: 'Operations & Wallet',
    badge: 'Enterprise'
  },
  {
    id: 'auth',
    title: 'Patient Portal Login & Registration',
    subtitle: 'Secure HIPAA authentication, caregiver proxy & member signup',
    icon: 'lock',
    category: 'Operations & Wallet',
    badge: 'Security'
  }
];

export const MOCK_DRUGS: DrugItem[] = [
  {
    id: 'atorvastatin',
    name: 'Atorvastatin Calcium',
    brandName: 'Lipitor',
    genericName: 'Atorvastatin Calcium',
    isGenericAvailable: true,
    drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    typicalSavingsPercent: 88,
    lowestPrice: 8.40,
    averageRetailPrice: 124.50,
    description: 'First-line lipid-lowering therapy used to reduce LDL cholesterol and cardiovascular morbidity and mortality.',
    dosageForms: ['Oral Tablet'],
    strengths: ['10 mg', '20 mg', '40 mg', '80 mg'],
    quantities: [30, 60, 90],
    selectedStrength: '20 mg',
    selectedForm: 'Oral Tablet',
    selectedQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    requiresPrescription: true,
    controlledSubstance: false,
    popularityRank: 1,
    quotes: [
      {
        pharmacyId: 'cost-plus',
        pharmacyName: 'Mark Cuban Cost Plus Drug Co.',
        chainType: 'mail-order',
        distance: 'Mail Order',
        address: 'Direct to Consumer Delivery Hub',
        cashPrice: 8.40,
        discountPrice: 8.40,
        insuranceEstimatedCopay: 15.00,
        inStock: true,
        stockStatus: 'Free 2-Day Mail',
        bestValue: true,
        couponCode: 'COSTPLUS-DIRECT',
        bin: '015995',
        pcn: 'GDC',
        group: 'PRX902'
      },
      {
        pharmacyId: 'cvs-01',
        pharmacyName: 'CVS Pharmacy #4192',
        chainType: 'retail',
        distance: '0.8 mi',
        address: '1420 Market St, San Francisco, CA',
        cashPrice: 112.00,
        discountPrice: 11.20,
        insuranceEstimatedCopay: 10.00,
        inStock: true,
        stockStatus: 'Ready in 15 min',
        couponCode: 'PCVS-DISC88',
        bin: '003858',
        pcn: 'A4',
        group: 'PHARMA21'
      },
      {
        pharmacyId: 'walgreens-01',
        pharmacyName: 'Walgreens Pharmacy #883',
        chainType: 'retail',
        distance: '1.2 mi',
        address: '745 Mission St, San Francisco, CA',
        cashPrice: 124.50,
        discountPrice: 12.90,
        insuranceEstimatedCopay: 10.00,
        inStock: true,
        stockStatus: 'Ready in 15 min',
        couponCode: 'PWAG-SAVEX',
        bin: '015995',
        pcn: 'WAG',
        group: 'WAGSAVE'
      },
      {
        pharmacyId: 'capsule-01',
        pharmacyName: 'Capsule Same-Day Courier',
        chainType: 'courier',
        distance: 'Delivery to 94103',
        address: 'Courier Hub, San Francisco',
        cashPrice: 65.00,
        discountPrice: 14.50,
        insuranceEstimatedCopay: 10.00,
        inStock: true,
        stockStatus: 'Ready in 15 min',
        couponCode: 'CAPSULE-NOW',
        bin: '015995',
        pcn: 'CPS',
        group: 'CAPSULE7'
      },
      {
        pharmacyId: 'walmart-01',
        pharmacyName: 'Walmart Pharmacy #1004',
        chainType: 'retail',
        distance: '3.4 mi',
        address: '3255 Mission St, San Francisco, CA',
        cashPrice: 38.00,
        discountPrice: 9.00,
        insuranceEstimatedCopay: 10.00,
        inStock: true,
        stockStatus: 'In Stock',
        couponCode: 'WAL-VALUE4',
        bin: '003858',
        pcn: 'WMT',
        group: 'WMTTIER1'
      }
    ]
  },
  {
    id: 'ozempic',
    name: 'Ozempic (Semaglutide)',
    brandName: 'Ozempic',
    genericName: 'Semaglutide Subcutaneous',
    isGenericAvailable: false,
    drugClass: 'GLP-1 Receptor Agonist',
    typicalSavingsPercent: 24,
    lowestPrice: 892.00,
    averageRetailPrice: 1180.00,
    description: 'Weekly subcutaneous injection indicated for glycemic control in T2D and major cardiovascular risk reduction.',
    dosageForms: ['Pre-filled Pen Injector'],
    strengths: ['0.25 / 0.5 mg/dose (2mg/3ml)', '1 mg/dose (4mg/3ml)', '2 mg/dose (8mg/3ml)'],
    quantities: [1, 2, 3],
    selectedStrength: '1 mg/dose (4mg/3ml)',
    selectedForm: 'Pre-filled Pen Injector',
    selectedQuantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80',
    requiresPrescription: true,
    controlledSubstance: false,
    popularityRank: 2,
    quotes: [
      {
        pharmacyId: 'cvs-01',
        pharmacyName: 'CVS Pharmacy #4192',
        chainType: 'retail',
        distance: '0.8 mi',
        address: '1420 Market St, San Francisco, CA',
        cashPrice: 1145.00,
        discountPrice: 915.00,
        insuranceEstimatedCopay: 25.00,
        inStock: true,
        stockStatus: 'In Stock',
        couponCode: 'OZEMP-CARD',
        bin: '610524',
        pcn: 'NOVO',
        group: 'GLP1SAVE'
      },
      {
        pharmacyId: 'walgreens-01',
        pharmacyName: 'Walgreens Pharmacy #883',
        chainType: 'retail',
        distance: '1.2 mi',
        address: '745 Mission St, San Francisco, CA',
        cashPrice: 1180.00,
        discountPrice: 928.00,
        insuranceEstimatedCopay: 25.00,
        inStock: true,
        stockStatus: 'Ready in 15 min',
        couponCode: 'OZEMP-WAG',
        bin: '610524',
        pcn: 'NOVO',
        group: 'GLP1SAVE'
      },
      {
        pharmacyId: 'capsule-01',
        pharmacyName: 'Capsule Same-Day Courier (Cold-Chain)',
        chainType: 'courier',
        distance: 'Doorstep Courier',
        address: 'Insulated Cold-Pack Delivery',
        cashPrice: 1090.00,
        discountPrice: 892.00,
        insuranceEstimatedCopay: 25.00,
        inStock: true,
        stockStatus: 'Free 2-Day Mail',
        bestValue: true,
        couponCode: 'CAPSULE-COLD',
        bin: '610524',
        pcn: 'CAPS',
        group: 'NOVOCOURIER'
      }
    ]
  },
  {
    id: 'metformin',
    name: 'Metformin HCl ER',
    brandName: 'Glucophage XR',
    genericName: 'Metformin Extended Release',
    isGenericAvailable: true,
    drugClass: 'Biguanide Antidiabetic',
    typicalSavingsPercent: 92,
    lowestPrice: 4.80,
    averageRetailPrice: 62.00,
    description: 'First-line anti-hyperglycemic agent decreasing hepatic glucose production and intestinal absorption.',
    dosageForms: ['Extended-Release Tablet'],
    strengths: ['500 mg', '750 mg', '1000 mg'],
    quantities: [30, 60, 90, 180],
    selectedStrength: '500 mg',
    selectedForm: 'Extended-Release Tablet',
    selectedQuantity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    requiresPrescription: true,
    controlledSubstance: false,
    popularityRank: 3,
    quotes: [
      {
        pharmacyId: 'walmart-01',
        pharmacyName: 'Walmart Pharmacy #1004',
        chainType: 'retail',
        distance: '3.4 mi',
        address: '3255 Mission St, San Francisco, CA',
        cashPrice: 14.00,
        discountPrice: 4.80,
        insuranceEstimatedCopay: 5.00,
        inStock: true,
        stockStatus: 'In Stock',
        bestValue: true,
        couponCode: 'MET-WMT4',
        bin: '003858',
        pcn: 'WMT',
        group: '4DOLLAR'
      },
      {
        pharmacyId: 'cost-plus',
        pharmacyName: 'Mark Cuban Cost Plus Drug Co.',
        chainType: 'mail-order',
        distance: 'Mail Order',
        address: 'Direct to Consumer Delivery Hub',
        cashPrice: 5.10,
        discountPrice: 5.10,
        insuranceEstimatedCopay: 5.00,
        inStock: true,
        stockStatus: 'Free 2-Day Mail',
        couponCode: 'MET-COSTPLUS',
        bin: '015995',
        pcn: 'GDC',
        group: 'PRX902'
      },
      {
        pharmacyId: 'cvs-01',
        pharmacyName: 'CVS Pharmacy #4192',
        chainType: 'retail',
        distance: '0.8 mi',
        address: '1420 Market St, San Francisco, CA',
        cashPrice: 58.00,
        discountPrice: 8.90,
        insuranceEstimatedCopay: 5.00,
        inStock: true,
        stockStatus: 'Ready in 15 min',
        couponCode: 'CVS-METSAVE',
        bin: '003858',
        pcn: 'A4',
        group: 'PHARMA21'
      }
    ]
  },
  {
    id: 'adderall-xr',
    name: 'Dextroamphetamine-Amphetamine ER',
    brandName: 'Adderall XR',
    genericName: 'Amphetamine Mixed Salts ER',
    isGenericAvailable: true,
    drugClass: 'Central Nervous System Stimulant (Schedule II)',
    typicalSavingsPercent: 72,
    lowestPrice: 28.50,
    averageRetailPrice: 185.00,
    description: 'Prescription stimulant medication indicated for attention deficit hyperactivity disorder and narcolepsy.',
    dosageForms: ['Extended-Release Capsule'],
    strengths: ['10 mg', '15 mg', '20 mg', '25 mg', '30 mg'],
    quantities: [30, 60],
    selectedStrength: '20 mg',
    selectedForm: 'Extended-Release Capsule',
    selectedQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?w=600&auto=format&fit=crop&q=80',
    requiresPrescription: true,
    controlledSubstance: true,
    popularityRank: 4,
    quotes: [
      {
        pharmacyId: 'walgreens-01',
        pharmacyName: 'Walgreens Pharmacy #883',
        chainType: 'retail',
        distance: '1.2 mi',
        address: '745 Mission St, San Francisco, CA',
        cashPrice: 185.00,
        discountPrice: 28.50,
        insuranceEstimatedCopay: 20.00,
        inStock: true,
        stockStatus: 'In Stock',
        bestValue: true,
        couponCode: 'ADR-WAG28',
        bin: '015995',
        pcn: 'WAG',
        group: 'C2REFILL'
      },
      {
        pharmacyId: 'cvs-01',
        pharmacyName: 'CVS Pharmacy #4192',
        chainType: 'retail',
        distance: '0.8 mi',
        address: '1420 Market St, San Francisco, CA',
        cashPrice: 192.00,
        discountPrice: 34.00,
        insuranceEstimatedCopay: 20.00,
        inStock: false,
        stockStatus: 'Special Order',
        couponCode: 'ADR-CVS34',
        bin: '003858',
        pcn: 'A4',
        group: 'PHARMA21'
      }
    ]
  },
  {
    id: 'sertraline',
    name: 'Sertraline HCl',
    brandName: 'Zoloft',
    genericName: 'Sertraline Hydrochloride',
    isGenericAvailable: true,
    drugClass: 'Selective Serotonin Reuptake Inhibitor (SSRI)',
    typicalSavingsPercent: 91,
    lowestPrice: 7.20,
    averageRetailPrice: 84.00,
    description: 'Antidepressant indicated for major depressive disorder, obsessive-compulsive disorder, panic disorder, and PTSD.',
    dosageForms: ['Oral Tablet'],
    strengths: ['25 mg', '50 mg', '100 mg'],
    quantities: [30, 60, 90],
    selectedStrength: '50 mg',
    selectedForm: 'Oral Tablet',
    selectedQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
    requiresPrescription: true,
    controlledSubstance: false,
    popularityRank: 5,
    quotes: [
      {
        pharmacyId: 'cost-plus',
        pharmacyName: 'Mark Cuban Cost Plus Drug Co.',
        chainType: 'mail-order',
        distance: 'Mail Order',
        address: 'Direct to Consumer Delivery Hub',
        cashPrice: 7.20,
        discountPrice: 7.20,
        insuranceEstimatedCopay: 10.00,
        inStock: true,
        stockStatus: 'Free 2-Day Mail',
        bestValue: true,
        couponCode: 'SERT-COSTPLUS',
        bin: '015995',
        pcn: 'GDC',
        group: 'PRX902'
      },
      {
        pharmacyId: 'cvs-01',
        pharmacyName: 'CVS Pharmacy #4192',
        chainType: 'retail',
        distance: '0.8 mi',
        address: '1420 Market St, San Francisco, CA',
        cashPrice: 84.00,
        discountPrice: 9.80,
        insuranceEstimatedCopay: 10.00,
        inStock: true,
        stockStatus: 'Ready in 15 min',
        couponCode: 'SERT-CVS9',
        bin: '003858',
        pcn: 'A4',
        group: 'PHARMA21'
      }
    ]
  },
  {
    id: 'albuterol',
    name: 'Albuterol Sulfate HFA',
    brandName: 'ProAir HFA / Ventolin',
    genericName: 'Albuterol Sulfate Inhalation Aerosol',
    isGenericAvailable: true,
    drugClass: 'Short-Acting Beta-2 Agonist (SABA)',
    typicalSavingsPercent: 78,
    lowestPrice: 19.90,
    averageRetailPrice: 92.00,
    description: 'Bronchodilator indicated for rapid relief and prevention of bronchospasm in patients with reversible obstructive airway disease.',
    dosageForms: ['Inhalation Inhaler (8.5g / 200 actuations)'],
    strengths: ['90 mcg/actuation'],
    quantities: [1, 2, 3],
    selectedStrength: '90 mcg/actuation',
    selectedForm: 'Inhalation Inhaler (8.5g / 200 actuations)',
    selectedQuantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    requiresPrescription: true,
    controlledSubstance: false,
    popularityRank: 6,
    quotes: [
      {
        pharmacyId: 'walgreens-01',
        pharmacyName: 'Walgreens Pharmacy #883',
        chainType: 'retail',
        distance: '1.2 mi',
        address: '745 Mission St, San Francisco, CA',
        cashPrice: 88.00,
        discountPrice: 19.90,
        insuranceEstimatedCopay: 15.00,
        inStock: true,
        stockStatus: 'Ready in 15 min',
        bestValue: true,
        couponCode: 'ALB-WAG19',
        bin: '015995',
        pcn: 'WAG',
        group: 'ASTHMAREFILL'
      },
      {
        pharmacyId: 'walmart-01',
        pharmacyName: 'Walmart Pharmacy #1004',
        chainType: 'retail',
        distance: '3.4 mi',
        address: '3255 Mission St, San Francisco, CA',
        cashPrice: 65.00,
        discountPrice: 22.50,
        insuranceEstimatedCopay: 15.00,
        inStock: true,
        stockStatus: 'In Stock',
        couponCode: 'ALB-WMT22',
        bin: '003858',
        pcn: 'WMT',
        group: 'WMTTIER1'
      }
    ]
  }
];

export const MOCK_ROUTING_PLANS: RoutingPlan[] = [
  {
    id: 'plan-hybrid',
    strategyName: 'Hybrid Multi-Pharmacy Optimization',
    totalMonthlyCost: 40.50,
    retailTotal: 271.00,
    totalSavings: 230.50,
    savingsPercentage: 85,
    recommendedBadge: true,
    routes: [
      {
        drugId: 'atorvastatin',
        drugName: 'Atorvastatin Calcium 20mg (90-day)',
        dosage: '20 mg • 90 Tablets',
        recommendedPharmacy: 'Mark Cuban Cost Plus Drug Co.',
        monthlyCost: 8.40,
        savingsVsRetail: 116.10,
        fulfillmentMethod: 'Mail Order (Cold-Chain)',
        leadTime: 'Delivers Thursday via USPS Priority',
        reason: 'Lowest manufacturing cost tier + transparent 15% margin'
      },
      {
        drugId: 'adderall-xr',
        drugName: 'Adderall XR 20mg (30-day)',
        dosage: '20 mg • 30 Capsules',
        recommendedPharmacy: 'Walgreens Pharmacy (1.2 mi)',
        monthlyCost: 28.50,
        savingsVsRetail: 96.00,
        fulfillmentMethod: 'Local Pharmacy Counter',
        leadTime: 'Ready in 20 minutes',
        reason: 'Schedule II state regulatory requirement mandates physical counter ID verification'
      },
      {
        drugId: 'metformin',
        drugName: 'Metformin HCl ER 500mg (60-day)',
        dosage: '500 mg • 60 Tablets',
        recommendedPharmacy: 'Walmart Pharmacy (3.4 mi)',
        monthlyCost: 3.60,
        savingsVsRetail: 18.40,
        fulfillmentMethod: 'Local Pharmacy Counter',
        leadTime: 'In stock now',
        reason: '$4 tier generic retail discount program match'
      }
    ]
  },
  {
    id: 'plan-single-stop',
    strategyName: 'Single-Stop Retail Convenience',
    totalMonthlyCost: 68.20,
    retailTotal: 271.00,
    totalSavings: 202.80,
    savingsPercentage: 74,
    recommendedBadge: false,
    routes: [
      {
        drugId: 'all',
        drugName: 'All 3 Prescriptions Consolidated',
        dosage: 'Combined Regimen',
        recommendedPharmacy: 'CVS Pharmacy #4192 (0.8 mi)',
        monthlyCost: 68.20,
        savingsVsRetail: 202.80,
        fulfillmentMethod: 'Local Pharmacy Counter',
        leadTime: 'Single drive-thru pickup in 45 min',
        reason: 'Consolidates all items at single nearest location using digital coupon codes'
      }
    ]
  }
];

export const MOCK_DOCTORS: TeleconsultDoctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Elena Rostova, MD',
    title: 'Clinical Pharmacotherapist & Board-Certified Internist',
    specialty: 'Cardiometabolic Care & Preventive Medicine',
    rating: 4.96,
    reviewsCount: 1420,
    availableSlot: 'Today at 2:30 PM (in 12 min)',
    fee: 45,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    licenses: ['CA #A129048', 'NY #294012', 'TX #M89201'],
    education: 'Stanford University School of Medicine • Harvard Residency',
    bio: 'Specializes in medication therapy management (MTM), polypharmacy de-prescribing, and asynchronous refill renewals.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance, PharmD, MD',
    title: 'Integrative Medicine & Endocrine Specialist',
    specialty: 'GLP-1 Management & Diabetes Therapeutics',
    rating: 4.94,
    reviewsCount: 890,
    availableSlot: 'Today at 3:15 PM',
    fee: 55,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
    licenses: ['CA #C948201', 'FL #ME10948', 'WA #MD04921'],
    education: 'UCSF School of Pharmacy • Johns Hopkins Medicine',
    bio: 'Focuses on prior authorization approvals for high-cost biologic therapies, GLP-1 titrations, and chronic metabolic care.'
  }
];

export const MOCK_TRANSFERS: TransferRequest[] = [
  {
    id: 'TR-89214',
    patientName: 'Sarah Jenkins',
    rxNumber: 'RX-6849201-B',
    drugName: 'Atorvastatin 20mg',
    dosage: '1 tablet PO qHS (90 days)',
    sourcePharmacy: 'Walgreens Pharmacy #883',
    destinationPharmacy: 'Mark Cuban Cost Plus Drugs (Mail Order)',
    status: 'transferring',
    dateSubmitted: 'Sep 7, 2026',
    estimatedCompletion: 'Today at 4:00 PM'
  },
  {
    id: 'TR-89215',
    patientName: 'Sarah Jenkins',
    rxNumber: 'RX-4412093-X',
    drugName: 'Sertraline HCl 50mg',
    dosage: '1 tablet PO qAM (30 days)',
    sourcePharmacy: 'Independent Care Rx',
    destinationPharmacy: 'CVS Pharmacy #4192',
    status: 'ready_for_pickup',
    dateSubmitted: 'Sep 6, 2026',
    estimatedCompletion: 'Ready for Pickup at Counter'
  }
];

export const MOCK_INTERACTIONS: DrugInteraction[] = [
  {
    drugA: 'Atorvastatin Calcium',
    drugB: 'Clarithromycin',
    severity: 'major',
    title: 'CYP3A4 Inhibition — Severe Rhabdomyolysis Risk',
    clinicalImpact: 'Clarithromycin potently inhibits CYP3A4 metabolism of atorvastatin, escalating systemic statin AUC up to 4-fold. This substantially increases the hazard of severe myopathy, myoglobinuria, and fatal rhabdomyolysis.',
    management: 'Withhold atorvastatin during clarithromycin therapy, or substitute antibiotic with azithromycin which does not inhibit CYP3A4.',
    evidenceRating: 'Category X: Avoid Combination (FDA Black Box Warning)'
  },
  {
    drugA: 'Sertraline HCl',
    drugB: 'Adderall XR (Amphetamine)',
    severity: 'moderate',
    title: 'Serotonergic Potentiation & Autonomic Hyper-reflexia',
    clinicalImpact: 'Both compounds elevate central neurotransmitter release. Concurrent administration can infrequently precipitate Serotonin Syndrome manifested by tremor, clonus, diaphoresis, and pyrexia.',
    management: 'Monitor patient for autonomic instability and motor agitation during titration phases. Dose adjustments usually not required if monitored.',
    evidenceRating: 'Category C: Monitor Concomitantly'
  },
  {
    drugA: 'Metformin HCl',
    drugB: 'Iodinated Radiocontrast Agents',
    severity: 'major',
    title: 'Contrast-Induced Nephropathy & Lactic Acidosis',
    clinicalImpact: 'Intravascular iodinated contrast administration may lead to acute renal impairment, precipitating severe metformin retention and potentially lethal lactic acidosis.',
    management: 'Discontinue metformin prior to or at time of imaging procedure; withhold for 48 hours post-procedure until eGFR confirms stable renal clearance.',
    evidenceRating: 'Category D: Consider Therapy Modification'
  }
];

export const MOCK_ADHERENCE: AdherenceDose[] = [
  {
    id: 'dose-1',
    drugName: 'Metformin HCl ER',
    dosage: '500 mg (1 tab)',
    scheduledTime: '08:00 AM',
    instructions: 'Take with morning breakfast and water',
    taken: true,
    takenAt: '08:12 AM',
    colorHex: '#006a61',
    remainingPills: 42,
    refillDaysLeft: 21
  },
  {
    id: 'dose-2',
    drugName: 'Sertraline HCl',
    dosage: '500 mg (1 tab)',
    scheduledTime: '08:30 AM',
    instructions: 'Take with food to minimize GI distress',
    taken: true,
    takenAt: '08:34 AM',
    colorHex: '#497cff',
    remainingPills: 14,
    refillDaysLeft: 14
  },
  {
    id: 'dose-3',
    drugName: 'Atorvastatin Calcium',
    dosage: '20 mg (1 tab)',
    scheduledTime: '09:00 PM',
    instructions: 'Take at bedtime for maximal HMG-CoA inhibition',
    taken: false,
    colorHex: '#131b2e',
    remainingPills: 6,
    refillDaysLeft: 6
  }
];

export const MOCK_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    drugName: 'Ozempic (Semaglutide)',
    strength: '1 mg/dose (4mg/3ml)',
    currentLowest: 892.00,
    targetPrice: 850.00,
    notifyOnDrop: true,
    lastUpdated: '2 hours ago',
    changePercent: -4.2,
    historicalTrend: 'down'
  },
  {
    id: 'alert-2',
    drugName: 'Atorvastatin Calcium',
    strength: '20 mg • 90 count',
    currentLowest: 8.40,
    targetPrice: 10.00,
    notifyOnDrop: false,
    lastUpdated: 'Yesterday',
    changePercent: -12.5,
    historicalTrend: 'down'
  },
  {
    id: 'alert-3',
    drugName: 'Adderall XR',
    strength: '20 mg • 30 count',
    currentLowest: 28.50,
    targetPrice: 25.00,
    notifyOnDrop: true,
    lastUpdated: '3 days ago',
    changePercent: 1.8,
    historicalTrend: 'up'
  }
];

export const MOCK_FAMILY_PROFILES: FamilyProfile[] = [
  {
    id: 'prof-1',
    name: 'Sarah Jenkins (Self)',
    relation: 'Primary Policyholder',
    dob: 'May 14, 1988 (Age 38)',
    allergies: ['Penicillin V', 'Sulfa Antibiotics'],
    activePrescriptionsCount: 3,
    avatarColor: 'bg-secondary text-white',
    insuranceCard: {
      payerName: 'Blue Cross Blue Shield Gold PPO',
      rxBin: '003858',
      rxPcn: 'A4',
      rxGroup: 'PHARMA21-CAL',
      memberId: 'BCBS-8492048-01',
      status: 'Verified'
    }
  },
  {
    id: 'prof-2',
    name: 'Leo Jenkins',
    relation: 'Son (Dependent)',
    dob: 'Aug 22, 2017 (Age 9)',
    allergies: ['Amoxicillin Clavulanate'],
    activePrescriptionsCount: 1,
    avatarColor: 'bg-primary-container text-primary-fixed',
    insuranceCard: {
      payerName: 'Blue Cross Blue Shield Gold PPO',
      rxBin: '003858',
      rxPcn: 'A4',
      rxGroup: 'PHARMA21-CAL',
      memberId: 'BCBS-8492048-02',
      status: 'Verified'
    }
  },
  {
    id: 'prof-3',
    name: 'Eleanor Vance',
    relation: 'Mother (Elder Care Dependent)',
    dob: 'Nov 03, 1952 (Age 73)',
    allergies: ['Aspirin / NSAIDs', 'Codeine'],
    activePrescriptionsCount: 6,
    avatarColor: 'bg-tertiary-container text-tertiary-fixed',
    insuranceCard: {
      payerName: 'Humana Medicare Advantage Part D',
      rxBin: '610524',
      rxPcn: 'MEDD',
      rxGroup: 'HUMANARX',
      memberId: 'HUM-9041289-01',
      status: 'Verified'
    }
  }
];

export const DEFAULT_AUTH_USERS: AuthUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@healthmail.com',
    phone: '(415) 555-0192',
    dob: '1988-05-14',
    role: 'patient',
    insuranceName: 'Blue Cross Blue Shield Gold PPO',
    memberId: 'BCBS-8492048-01',
    isSeniorEligible: false,
    avatarInitials: 'SJ'
  },
  {
    id: 'user-2',
    name: 'Eleanor Vance',
    email: 'eleanor.vance1952@gmail.com',
    phone: '(415) 555-0481',
    dob: '1952-11-03',
    role: 'caregiver',
    insuranceName: 'Humana Medicare Advantage Part D',
    memberId: 'HUM-9041289-01',
    isSeniorEligible: true,
    avatarInitials: 'EV'
  },
  {
    id: 'user-3',
    name: 'Dr. Elena Rostova',
    email: 'dr.rostova@telehealthrx.org',
    phone: '(415) 555-0723',
    dob: '1982-03-29',
    role: 'clinician',
    insuranceName: 'NPI #1942859012 (DEA Active)',
    memberId: 'MD-CAL-84920',
    isSeniorEligible: false,
    avatarInitials: 'ER'
  }
];

