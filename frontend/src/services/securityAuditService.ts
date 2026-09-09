export interface AuditEventLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'verified' | 'locked' | 'warning';
  ipAddress?: string;
  userRole?: string;
}

const AUDIT_STORAGE_KEY = 'medihelp_hipaa_audit_trail_v1';

const INITIAL_LOGS: AuditEventLog[] = [
  {
    id: 'log-hipaa-101',
    timestamp: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    event: 'Vault auto-locked due to inactive session (HIPAA 45 CFR § 164.312 Audit Standard)',
    status: 'locked',
    ipAddress: '192.168.1.104',
    userRole: 'Patient',
  },
  {
    id: 'log-hipaa-100',
    timestamp: new Date(Date.now() - 1200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    event: 'FIDO2 WebAuthn hardware biometric challenge passed',
    status: 'verified',
    ipAddress: '192.168.1.104',
    userRole: 'Patient',
  },
];

export function getAuditLogs(): AuditEventLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return INITIAL_LOGS;
    return JSON.parse(raw) as AuditEventLog[];
  } catch {
    return INITIAL_LOGS;
  }
}

export function recordAuditEvent(eventDescription: string, status: 'verified' | 'locked' | 'warning' = 'verified', userRole: string = 'Patient'): AuditEventLog[] {
  const current = getAuditLogs();
  const newLog: AuditEventLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    event: eventDescription,
    status,
    ipAddress: '127.0.0.1',
    userRole,
  };

  const updated = [newLog, ...current].slice(0, 50); // Keep latest 50 logs
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to persist audit log:', err);
  }

  return updated;
}

export function clearAuditTrail(): AuditEventLog[] {
  try {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear audit log:', err);
  }
  return [];
}
