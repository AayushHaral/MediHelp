import { AdherenceDose, TransferRequest, PriceAlert, FamilyProfile } from '../types';
import { MOCK_ADHERENCE, MOCK_TRANSFERS, MOCK_PRICE_ALERTS, MOCK_FAMILY_PROFILES } from '../data/mockData';

const KEYS = {
  ADHERENCE: 'medihelp_adherence_doses_v1',
  TRANSFERS: 'medihelp_transfers_v1',
  ALERTS: 'medihelp_price_alerts_v1',
  PROFILES: 'medihelp_family_profiles_v1',
  OFFLINE_QUEUE: 'medihelp_offline_queue_v1',
  OFFLINE_DISCOUNTS: 'medihelp_offline_discounts_v1'
};

export interface OfflineAction {
  id: string;
  type: 'TOGGLE_DOSE' | 'SUBMIT_TRANSFER' | 'UPDATE_PROFILE';
  payload: any;
  timestamp: number;
}

/**
 * Helper to safely query localStorage with fallback data
 */
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[dbService] Failed to load key ${key} from storage:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[dbService] Failed to save key ${key} to storage:`, err);
  }
}

// --- Offline Action Queue Operations ---

export function getOfflineQueue(): OfflineAction[] {
  return getItem<OfflineAction[]>(KEYS.OFFLINE_QUEUE, []);
}

export function queueOfflineAction(type: OfflineAction['type'], payload: any): OfflineAction[] {
  const current = getOfflineQueue();
  const newAction: OfflineAction = {
    id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    payload,
    timestamp: Date.now()
  };
  const updated = [...current, newAction];
  setItem(KEYS.OFFLINE_QUEUE, updated);
  console.log(`[dbService] Action queued for offline sync (${type}):`, newAction);
  return updated;
}

export function clearOfflineQueue(): void {
  setItem(KEYS.OFFLINE_QUEUE, []);
}

export function processOfflineQueue(): { count: number; actionsProcessed: string[] } {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { count: 0, actionsProcessed: [] };
  }

  const processed: string[] = [];
  queue.forEach((action) => {
    console.log(`[dbService] Processing queued offline action ${action.id} (${action.type})`);
    processed.push(action.type);
  });

  clearOfflineQueue();
  return { count: processed.length, actionsProcessed: processed };
}

// --- Adherence Doses Data Layer ---

export function getStoredAdherenceDoses(): AdherenceDose[] {
  return getItem<AdherenceDose[]>(KEYS.ADHERENCE, MOCK_ADHERENCE);
}

export function toggleDoseTaken(doseId: string, isOffline: boolean = false): AdherenceDose[] {
  const current = getStoredAdherenceDoses();
  const updated = current.map((dose) => {
    if (dose.id === doseId) {
      const nowTaken = !dose.taken;
      const newPills = nowTaken ? Math.max(0, dose.remainingPills - 1) : dose.remainingPills + 1;
      return {
        ...dose,
        taken: nowTaken,
        takenAt: nowTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        remainingPills: newPills,
      };
    }
    return dose;
  });

  setItem(KEYS.ADHERENCE, updated);

  if (isOffline) {
    queueOfflineAction('TOGGLE_DOSE', { doseId });
  }

  return updated;
}

export function resetAdherenceDoses(): AdherenceDose[] {
  setItem(KEYS.ADHERENCE, MOCK_ADHERENCE);
  return MOCK_ADHERENCE;
}

// --- Transfer Requests Data Layer ---

export function getStoredTransfers(): TransferRequest[] {
  return getItem<TransferRequest[]>(KEYS.TRANSFERS, MOCK_TRANSFERS);
}

export function saveTransferRequest(request: Omit<TransferRequest, 'id' | 'dateSubmitted'>, isOffline: boolean = false): TransferRequest[] {
  const current = getStoredTransfers();
  const newEntry: TransferRequest = {
    ...request,
    id: `tr-${Date.now()}`,
    dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  const updated = [newEntry, ...current];
  setItem(KEYS.TRANSFERS, updated);

  if (isOffline) {
    queueOfflineAction('SUBMIT_TRANSFER', newEntry);
  }

  return updated;
}

// --- Price Alerts Data Layer ---

export function getStoredPriceAlerts(): PriceAlert[] {
  return getItem<PriceAlert[]>(KEYS.ALERTS, MOCK_PRICE_ALERTS);
}

export function togglePriceAlertNotify(alertId: string): PriceAlert[] {
  const current = getStoredPriceAlerts();
  const updated = current.map((item) => (item.id === alertId ? { ...item, notifyOnDrop: !item.notifyOnDrop } : item));
  setItem(KEYS.ALERTS, updated);
  return updated;
}

// --- Family Profiles Data Layer ---

export function getStoredProfiles(): FamilyProfile[] {
  return getItem<FamilyProfile[]>(KEYS.PROFILES, MOCK_FAMILY_PROFILES);
}

export function saveProfile(updatedProfile: FamilyProfile): FamilyProfile[] {
  const current = getStoredProfiles();
  const updated = current.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
  setItem(KEYS.PROFILES, updated);
  return updated;
}
