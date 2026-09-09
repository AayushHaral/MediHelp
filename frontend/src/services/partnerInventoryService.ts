/**
 * MediHelp Partner Pharmacy Inventory & B2B Claim Settlement Service
 * Connects retail pharmacy management systems (PioneerRx, Rx30, McKesson, AmerisourceBergen)
 */

export interface PharmacyPartnerStock {
  pharmacyId: string;
  pharmacyName: string;
  chainType: 'retail' | 'independent' | 'mail-order' | 'courier';
  drugId: string;
  drugName: string;
  ndcCode: string;
  inStock: boolean;
  quantityOnHand: number;
  wholesaleAcquisitionCost: number;
  cashPrice: number;
  discountPrice: number;
  estimatedMarginPercent: number;
  lastInventorySync: string;
}

export interface CouponClaimSettlement {
  claimId: string;
  pharmacyId: string;
  pharmacyName: string;
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
  drugName: string;
  ndcCode: string;
  grossAmount: number;
  discountAmount: number;
  patientPaidCopay: number;
  pbmReimbursement: number;
  dispensingFee: number;
  settlementStatus: 'adjudicated' | 'pending_settlement' | 'settled';
  timestamp: string;
}

const MOCK_PARTNER_STOCKS: PharmacyPartnerStock[] = [
  {
    pharmacyId: 'ph-cvs-4928',
    pharmacyName: 'CVS Pharmacy #4928',
    chainType: 'retail',
    drugId: 'drug-1',
    drugName: 'Lipitor (Atorvastatin)',
    ndcCode: '00071-0155-23',
    inStock: true,
    quantityOnHand: 480,
    wholesaleAcquisitionCost: 8.50,
    cashPrice: 48.99,
    discountPrice: 12.40,
    estimatedMarginPercent: 31.4,
    lastInventorySync: 'Just now'
  },
  {
    pharmacyId: 'ph-walgreens-1204',
    pharmacyName: 'Walgreens Pharmacy #1204',
    chainType: 'retail',
    drugId: 'drug-1',
    drugName: 'Lipitor (Atorvastatin)',
    ndcCode: '00071-0155-23',
    inStock: true,
    quantityOnHand: 320,
    wholesaleAcquisitionCost: 8.50,
    cashPrice: 52.00,
    discountPrice: 14.50,
    estimatedMarginPercent: 41.3,
    lastInventorySync: '2 mins ago'
  },
  {
    pharmacyId: 'ph-walmart-8831',
    pharmacyName: 'Walmart Pharmacy #8831',
    chainType: 'retail',
    drugId: 'drug-1',
    drugName: 'Lipitor (Atorvastatin)',
    ndcCode: '00071-0155-23',
    inStock: true,
    quantityOnHand: 610,
    wholesaleAcquisitionCost: 8.50,
    cashPrice: 42.00,
    discountPrice: 10.99,
    estimatedMarginPercent: 22.6,
    lastInventorySync: '5 mins ago'
  }
];

const MOCK_CLAIMS: CouponClaimSettlement[] = [
  {
    claimId: 'clm-98271',
    pharmacyId: 'ph-cvs-4928',
    pharmacyName: 'CVS Pharmacy #4928',
    rxBin: '610014',
    rxPcn: 'MEDHELP',
    rxGroup: 'UHC99482',
    drugName: 'Atorvastatin 20mg (30 tabs)',
    ndcCode: '00071-0155-23',
    grossAmount: 48.99,
    discountAmount: 36.59,
    patientPaidCopay: 12.40,
    pbmReimbursement: 3.50,
    dispensingFee: 2.00,
    settlementStatus: 'adjudicated',
    timestamp: 'Today, 07:15 AM'
  },
  {
    claimId: 'clm-98272',
    pharmacyId: 'ph-walgreens-1204',
    pharmacyName: 'Walgreens Pharmacy #1204',
    rxBin: '610014',
    rxPcn: 'MEDHELP',
    rxGroup: 'UHC99482',
    drugName: 'Metformin 500mg ER (60 tabs)',
    ndcCode: '59746-0172-10',
    grossAmount: 38.00,
    discountAmount: 29.50,
    patientPaidCopay: 8.50,
    pbmReimbursement: 2.75,
    dispensingFee: 2.00,
    settlementStatus: 'settled',
    timestamp: 'Yesterday, 04:30 PM'
  }
];

/**
 * Fetch live inventory feeds for partner pharmacies
 */
export function getPartnerInventory(): PharmacyPartnerStock[] {
  return MOCK_PARTNER_STOCKS;
}

/**
 * Trigger live inventory sync with partner PMS (PioneerRx / Rx30 API endpoint)
 */
export async function syncPartnerInventory(pharmacyId: string): Promise<PharmacyPartnerStock[]> {
  console.log(`[PartnerInventoryService] Syncing live inventory feed for ${pharmacyId}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MOCK_PARTNER_STOCKS.map((stock) =>
          stock.pharmacyId === pharmacyId
            ? { ...stock, lastInventorySync: 'Just now', quantityOnHand: stock.quantityOnHand + 50 }
            : stock
        )
      );
    }, 600);
  });
}

/**
 * Fetch B2B coupon claim redemptions and settlements
 */
export function getB2bClaims(): CouponClaimSettlement[] {
  return MOCK_CLAIMS;
}

/**
 * Submit and adjudicate a new B2B coupon claim
 */
export function adjudicateB2bClaim(
  pharmacyName: string,
  drugName: string,
  grossAmount: number,
  discountPrice: number
): CouponClaimSettlement {
  const discountAmount = Math.max(0, grossAmount - discountPrice);
  const newClaim: CouponClaimSettlement = {
    claimId: `clm-${Date.now().toString().substr(7)}`,
    pharmacyId: `ph-${pharmacyName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    pharmacyName,
    rxBin: '610014',
    rxPcn: 'MEDHELP',
    rxGroup: 'UHC99482',
    drugName,
    ndcCode: '00071-0155-23',
    grossAmount,
    discountAmount,
    patientPaidCopay: discountPrice,
    pbmReimbursement: 3.50,
    dispensingFee: 2.00,
    settlementStatus: 'adjudicated',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  MOCK_CLAIMS.unshift(newClaim);
  return newClaim;
}
