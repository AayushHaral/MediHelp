import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, FamilyProfile } from '../../types';
import { MOCK_FAMILY_PROFILES } from '../../data/mockData';
import { BiometricSecurityModal, BiometricType } from '../BiometricSecurityModal';
import { ThemeToggle } from '../ThemeToggle';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { scanInsuranceCardWithAI } from '../../services/geminiService';
import { getAuditLogs, recordAuditEvent, AuditEventLog } from '../../services/securityAuditService';

interface PatientProfileScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'verified' | 'locked' | 'warning';
}

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({ onNavigate }) => {
  const [profiles, setProfiles] = useState<FamilyProfile[]>(MOCK_FAMILY_PROFILES);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('prof-1');
  const { language, setLanguage, textSize, setTextSize, isSeniorMode, toggleSeniorMode, t } = useLanguage();

  // OCR & Gemini Vision State
  const [isScanningOcr, setIsScanningOcr] = useState<boolean>(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Biometric Layer State
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [preferredBiometric, setPreferredBiometric] = useState<BiometricType>('face_id');
  const [lastAuthMethod, setLastAuthMethod] = useState<string | null>(null);
  const [autoLockSeconds, setAutoLockSeconds] = useState<number>(180);
  const [requireBiometrics, setRequireBiometrics] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAuditTrail, setShowAuditTrail] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditEventLog[]>(getAuditLogs());

  const currentProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];
  const isProtected = requireBiometrics && isLocked;

  // Auto-lock countdown timer when unlocked
  useEffect(() => {
    if (isLocked || !requireBiometrics) return;

    const timer = setInterval(() => {
      setAutoLockSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(true);
          const updated = recordAuditEvent('Auto-locked after inactivity timeout (Protected PHI Vault)', 'locked');
          setAuditLogs(updated);
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, requireBiometrics]);

  // Handle successful biometric unlock
  const handleBiometricSuccess = (method: string) => {
    setIsLocked(false);
    setLastAuthMethod(method);
    setAutoLockSeconds(180);
    const updated = recordAuditEvent(`Biometric authentication challenge passed via ${method}`, 'verified');
    setAuditLogs(updated);
  };

  const handleManualLock = () => {
    setIsLocked(true);
    const updated = recordAuditEvent('Manual security vault lock requested by user', 'locked');
    setAuditLogs(updated);
  };

  const handleFileUploadAndOcr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningOcr(true);
    setOcrSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const extracted = await scanInsuranceCardWithAI(base64, file.type);

      setProfiles((prevProfiles) =>
        prevProfiles.map((p) => {
          if (p.id === selectedProfileId) {
            return {
              ...p,
              insuranceCard: {
                ...p.insuranceCard,
                payerName: extracted.payerName,
                rxBin: extracted.rxBin,
                rxPcn: extracted.rxPcn,
                rxGroup: extracted.rxGroup,
                memberId: extracted.memberId,
                status: 'Verified',
              },
            };
          }
          return p;
        })
      );

      setIsScanningOcr(false);
      setOcrSuccessMsg(`Successfully scanned insurance card via Gemini AI! BIN: ${extracted.rxBin}, PCN: ${extracted.rxPcn}`);
      setTimeout(() => setOcrSuccessMsg(null), 6000);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulatedOcrScan = async () => {
    setIsScanningOcr(true);
    setOcrSuccessMsg(null);
    const dummyBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...';
    const extracted = await scanInsuranceCardWithAI(dummyBase64);

    setProfiles((prevProfiles) =>
      prevProfiles.map((p) => {
        if (p.id === selectedProfileId) {
          return {
            ...p,
            insuranceCard: {
              ...p.insuranceCard,
              payerName: extracted.payerName,
              rxBin: extracted.rxBin,
              rxPcn: extracted.rxPcn,
              rxGroup: extracted.rxGroup,
              memberId: extracted.memberId,
              status: 'Verified',
            },
          };
        }
        return p;
      })
    );

    setIsScanningOcr(false);
    setOcrSuccessMsg(`Simulated AI OCR Scan Complete! Updated BIN: ${extracted.rxBin}, PCN: ${extracted.rxPcn}`);
    setTimeout(() => setOcrSuccessMsg(null), 6000);
  };

  const handleToggleBiometrics = () => {
    const nextState = !requireBiometrics;
    setRequireBiometrics(nextState);
    if (nextState) {
      setIsLocked(true);
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          event: 'Biometric security enabled on wallet. Hardware authentication enforced.',
          status: 'locked'
        },
        ...prev
      ]);
    } else {
      setIsLocked(false);
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          event: 'Biometric security disabled. Sensitive pharmacy numbers in standard view.',
          status: 'warning'
        },
        ...prev
      ]);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (isProtected) {
      setIsModalOpen(true);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Banner with Biometric Status */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
              <span>HIPAA-Encrypted Health Wallet</span>
            </div>

            {/* Biometric Shield Pill */}
            {!requireBiometrics ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold font-mono">
                <span className="material-symbols-outlined text-[15px]">lock_open_right</span>
                <span>Security Disabled</span>
              </div>
            ) : isLocked ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold font-mono">
                <span className="material-symbols-outlined text-[15px] text-amber-800">lock</span>
                <span>Vault Locked</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold font-mono">
                <span className="material-symbols-outlined text-[15px] text-emerald-800">lock_open</span>
                <span>Unlocked ({formatTimer(autoLockSeconds)})</span>
              </div>
            )}
          </div>

          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
            Family Rx Wallet & Biometric Vault
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl">
            Manage prescription benefits, copay assistance cards, and verified dependents protected by biometric hardware enclave encryption.
          </p>
        </div>

        {/* Lock/Unlock Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          {!requireBiometrics ? (
            <button
              onClick={handleToggleBiometrics}
              className="w-full md:w-auto px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-xs rounded-xl border border-outline-variant/30 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-base text-secondary">fingerprint</span>
              <span>Enable Biometrics</span>
            </button>
          ) : isLocked ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-4 py-2.5 bg-secondary text-white font-headline font-semibold text-xs rounded-xl hover:bg-secondary/90 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">fingerprint</span>
              <span>Authenticate to Unlock</span>
            </button>
          ) : (
            <button
              onClick={handleManualLock}
              className="w-full md:w-auto px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-xs rounded-xl border border-outline-variant/30 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base text-secondary">lock</span>
              <span>Lock Health Vault</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('discount-card')}
            className="px-3.5 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl border border-outline-variant/30 transition-colors shrink-0"
            title="View Active Rx Pass"
          >
            <span className="material-symbols-outlined text-base">badge</span>
          </button>
        </div>
      </div>

      {/* Biometric Security Toggle Switch Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 md:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              requireBiometrics ? 'bg-secondary/15 text-secondary' : 'bg-surface-container text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {requireBiometrics ? 'fingerprint' : 'lock_open_right'}
            </span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-headline font-bold text-sm md:text-base text-on-surface">
                Extra Biometric Security on Wallet
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  requireBiometrics
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/40'
                }`}
              >
                {requireBiometrics ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-xl">
              {requireBiometrics
                ? 'Requires Apple Face ID, Touch ID, Windows Hello, or Master PIN to unmask Member IDs, pharmacy routing numbers, and clinical allergy contraindications.'
                : 'Biometric challenge is disabled. Prescription routing numbers and medical records are unmasked in standard browsing mode.'}
            </p>
          </div>
        </div>

        {/* Toggle Switch Component */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <label
            htmlFor="wallet-biometric-toggle"
            className="text-xs font-semibold text-on-surface select-none cursor-pointer"
          >
            {requireBiometrics ? 'Biometrics Active' : 'Biometrics Off'}
          </label>
          <button
            id="wallet-biometric-toggle"
            type="button"
            role="switch"
            aria-checked={requireBiometrics}
            onClick={handleToggleBiometrics}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
              requireBiometrics ? 'bg-secondary' : 'bg-surface-container-highest'
            }`}
          >
            <span className="sr-only">Toggle Biometric Authentication for Wallet</span>
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                requireBiometrics ? 'translate-x-5 text-secondary' : 'translate-x-0 text-outline'
              }`}
            >
              <span className="material-symbols-outlined text-[13px] font-bold">
                {requireBiometrics ? 'lock' : 'lock_open'}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Biometric Status / Alert Card */}
      {!requireBiometrics ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container text-outline flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">info</span>
            </div>
            <div>
              <span className="font-bold text-on-surface">Standard Wallet Access (Unprotected)</span>
              <p className="text-on-surface-variant text-[11px]">
                Health card numbers and allergies are currently open. Use the switch above to re-enable biometric protection at any time.
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleBiometrics}
            className="px-3 py-1.5 rounded-lg bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition-colors shrink-0 shadow-xs"
          >
            Turn On Protection
          </button>
        </div>
      ) : isLocked ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">security</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-amber-950">
                Sensitive Health & Payment Data Masked
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5 max-w-xl">
                Member ID, prescription routing BIN/PCN numbers, clinical drug allergies, and HSA card details are protected by biometric passkey encryption.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setPreferredBiometric('face_id');
                setIsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[16px]">face</span>
              <span>Scan Face ID</span>
            </button>
            <button
              onClick={() => {
                setPreferredBiometric('touch_id');
                setIsModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-amber-300"
              title="Touch ID / Fingerprint"
            >
              <span className="material-symbols-outlined text-[16px]">fingerprint</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">verified_user</span>
            </div>
            <div>
              <span className="font-bold text-emerald-950">
                Biometric Session Active ({lastAuthMethod || 'FIDO2 Hardware Enclave'})
              </span>
              <p className="text-emerald-800 text-[11px]">
                Full medical chart and pharmacy routing numbers unmasked. Auto-locking in{' '}
                <strong className="font-mono">{formatTimer(autoLockSeconds)}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="text-emerald-900 hover:underline font-semibold text-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span>{showAuditTrail ? 'Hide Audit Log' : 'View Audit Log'}</span>
            </button>
            <button
              onClick={handleManualLock}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors"
            >
              Lock Now
            </button>
          </div>
        </div>
      )}

      {/* Optional Audit Trail Drawer */}
      {showAuditTrail && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-bold text-xs text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">receipt_long</span>
              HIPAA Cryptographic Security & Access Trail
            </h4>
            <span className="text-[10px] font-mono text-on-surface-variant">NIST SP 800-63B Compliant</span>
          </div>

          <div className="divide-y divide-outline-variant/15 text-xs font-mono">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 material-symbols-outlined text-sm ${
                      log.status === 'verified'
                        ? 'text-emerald-700'
                        : log.status === 'locked'
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {log.status === 'verified' ? 'check_circle' : 'lock'}
                  </span>
                  <div>
                    <span className="text-on-surface block font-sans font-medium">{log.event}</span>
                    <span className="text-[10px] text-on-surface-variant">{log.timestamp}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container text-on-surface font-semibold shrink-0">
                  {log.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Family Member Profiles Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-sm text-on-surface">Family Members & Dependents</h2>
          <span className="text-xs text-on-surface-variant font-mono">
            {profiles.length} Active Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profiles.map((prof) => {
            const isSelected = selectedProfileId === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() => {
                  setSelectedProfileId(prof.id);
                  if (requireBiometrics && !isLocked) {
                    // Refresh timer on profile switch
                    setAutoLockSeconds(180);
                  }
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-surface-container-lowest border-secondary ring-2 ring-secondary/30 shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/30 hover:border-secondary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-sm ${prof.avatarColor}`}
                  >
                    {prof.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-on-surface">{prof.name}</h3>
                    <p className="text-[11px] text-on-surface-variant">{prof.relation}</p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs text-on-surface-variant font-mono">
                  <span>{prof.activePrescriptionsCount} active scripts</span>
                  <span className="text-secondary font-semibold">
                    {isSelected ? 'Selected' : 'Switch'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Profile Detail & Insurance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Insurance Card Visual (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">badge</span>
              Primary Insurance Benefit Card
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUploadAndOcr}
                accept="image/*"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanningOcr}
                className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-headline font-semibold text-[11px] hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">document_scanner</span>
                <span>{isScanningOcr ? 'Scanning AI OCR...' : 'Scan Card Image'}</span>
              </button>

              <button
                onClick={handleSimulatedOcrScan}
                disabled={isScanningOcr}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-headline font-semibold text-[11px] hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                <span>Demo AI OCR</span>
              </button>
            </div>
          </div>

          {ocrSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
              <span>{ocrSuccessMsg}</span>
            </div>
          )}

          {/* Realistic Digital Insurance Card Graphic */}
          <div className="bg-gradient-to-tr from-[#14233c] via-[#1e3458] to-[#0f1a2e] rounded-3xl p-6 text-white border border-white/10 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-fixed block">
                  Commercial Pharmacy Benefit
                </span>
                <h4 className="font-headline font-bold text-lg text-white">
                  {currentProfile.insuranceCard.payerName}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-white">
                {currentProfile.insuranceCard.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/60 block">Member Name & ID</span>
                  {!isProtected && (
                    <button
                      onClick={() => handleCopy(currentProfile.insuranceCard.memberId, 'memberId')}
                      className="text-[10px] text-secondary-fixed hover:underline flex items-center gap-0.5"
                    >
                      {copiedField === 'memberId' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <strong className="text-sm text-white block mt-0.5">{currentProfile.name}</strong>

                {/* Member ID masked or unmasked */}
                <div className="mt-1.5 flex items-center justify-between">
                  {isProtected ? (
                    <div
                      onClick={() => setIsModalOpen(true)}
                      className="cursor-pointer group flex items-center gap-1.5 text-secondary-fixed hover:text-white"
                    >
                      <span className="tracking-wider">ID: ••••••••••••••</span>
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                    </div>
                  ) : (
                    <span className="text-secondary-fixed font-bold tracking-wide">
                      ID: {currentProfile.insuranceCard.memberId}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/60 block">Rx Routing Protocol</span>
                  {!isProtected && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
                      Decrypted
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-white/90 space-y-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-white/60">BIN:</span>
                    {isProtected ? (
                      <span className="text-white/40 tracking-widest font-bold">••••••</span>
                    ) : (
                      <strong className="text-secondary-fixed">{currentProfile.insuranceCard.rxBin}</strong>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">PCN:</span>
                    {isProtected ? (
                      <span className="text-white/40 tracking-widest font-bold">••••••</span>
                    ) : (
                      <strong className="text-secondary-fixed">{currentProfile.insuranceCard.rxPcn}</strong>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">GRP:</span>
                    {isProtected ? (
                      <span className="text-white/40 tracking-widest font-bold">••••••</span>
                    ) : (
                      <strong className="text-secondary-fixed">{currentProfile.insuranceCard.rxGroup}</strong>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/10">
              <span>Customer Care: 1-800-555-BCBS</span>
              <span className="font-mono">Copay: Tier 1 Generic $10 • Tier 2 $35</span>
            </div>
          </div>

          {/* Quick Lock/Unlock Prompt under card */}
          {isProtected && (
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-base">fingerprint</span>
                Tap to decrypt routing numbers for the pharmacist
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-secondary font-bold hover:underline"
              >
                Scan Biometrics
              </button>
            </div>
          )}
        </div>

        {/* Clinical Profile Info & Allergies (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm text-on-surface">Patient Health Profile</h3>
            {!requireBiometrics ? (
              <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-semibold">
                Standard View
              </span>
            ) : !isProtected ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                ✓ Medical Chart Unlocked
              </span>
            ) : (
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                Protected Chart
              </span>
            )}
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-on-surface-variant block font-medium">Date of Birth & Age</span>
              <p className="font-semibold text-on-surface mt-0.5">
                {isProtected ? '••/••/•••• (Protected)' : currentProfile.dob}
              </p>
            </div>

            {/* Verified Drug Allergies */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant block font-medium">Verified Drug Allergies</span>
                {isProtected && (
                  <span className="text-[10px] text-amber-700 font-mono">2 Shielded</span>
                )}
              </div>

              {isProtected ? (
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="mt-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-secondary text-xl">lock</span>
                  <p className="text-[11px] font-semibold text-on-surface mt-0.5">
                    Biometric Authentication Required
                  </p>
                  <span className="text-[10px] text-on-surface-variant block">
                    Tap to verify identity and reveal allergy contraindications
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentProfile.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="px-2.5 py-1 rounded-md bg-red-100 text-red-900 font-semibold font-mono text-[11px]"
                    >
                      ⚠️ {allergy}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Payment Method */}
            <div className="pt-2 border-t border-outline-variant/15 space-y-2">
              <span className="text-on-surface-variant block font-medium">Saved Payment Method</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">credit_card</span>
                  <div>
                    <h5 className="font-headline font-bold text-xs text-on-surface">Optum Health HSA Debit</h5>
                    <p className="text-[11px] text-on-surface-variant font-mono">
                      {isProtected ? '•••• •••• •••• ••••' : '•••• 9014 (Exp 08/28)'}
                    </p>
                  </div>
                </div>

                {isProtected ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-secondary text-[11px] font-bold hover:underline"
                  >
                    Unlock
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Biometric Preferences Box */}
            <div className="pt-2 border-t border-outline-variant/15 space-y-2">
              <span className="text-on-surface-variant block font-medium">Biometric Security Config</span>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-on-surface font-semibold block">Require Biometric Lock</span>
                    <span className="text-[10px] text-on-surface-variant block">Enforce Face ID / PIN on wallet</span>
                  </div>
                  <button
                    id="biometric-config-toggle"
                    type="button"
                    role="switch"
                    aria-checked={requireBiometrics}
                    onClick={handleToggleBiometrics}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
                      requireBiometrics ? 'bg-secondary' : 'bg-surface-container-highest'
                    }`}
                  >
                    <span className="sr-only">Toggle Biometric Lock</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                        requireBiometrics ? 'translate-x-5 text-secondary' : 'translate-x-0 text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px] font-bold">
                        {requireBiometrics ? 'lock' : 'lock_open'}
                      </span>
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant">Default Sensor</span>
                  <select
                    value={preferredBiometric}
                    onChange={(e) => setPreferredBiometric(e.target.value as BiometricType)}
                    className="bg-surface-container text-on-surface px-2 py-1 rounded text-[10px] font-semibold border border-outline-variant/30 focus:outline-none"
                  >
                    <option value="face_id">Apple Face ID</option>
                    <option value="touch_id">Touch ID / Fingerprint</option>
                    <option value="windows_hello">Windows Hello / Passkey</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Appearance & Theme */}
            <div className="pt-2 border-t border-outline-variant/15 space-y-2">
              <span className="text-on-surface-variant block font-medium">Interface Appearance</span>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">Theme Mode</span>
                    <span className="text-[10px] text-on-surface-variant block">Light, Dark, or System Match</span>
                  </div>
                  <ThemeToggle variant="segmented" />
                </div>
              </div>
            </div>

            {/* Senior Citizen & Multilanguage Preferences */}
            <div className="pt-2 border-t border-outline-variant/15 space-y-2">
              <span className="text-on-surface-variant block font-medium">Senior Care & Accessibility</span>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 space-y-3.5">
                {/* Senior Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-base">elderly</span>
                      <span>Senior Mode</span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant block">
                      Enlarged high-contrast text and audio reader
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isSeniorMode}
                    onClick={toggleSeniorMode}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
                      isSeniorMode ? 'bg-secondary' : 'bg-surface-container-highest'
                    }`}
                  >
                    <span className="sr-only">Toggle Senior Citizen Mode</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                        isSeniorMode ? 'translate-x-5 text-secondary' : 'translate-x-0 text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px] font-bold">
                        {isSeniorMode ? 'check' : 'close'}
                      </span>
                    </span>
                  </button>
                </div>

                {/* Font Scaling */}
                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/15">
                  <span className="text-xs text-on-surface-variant">Text Scaling</span>
                  <div className="flex items-center rounded-lg bg-surface-container p-0.5 border border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => setTextSize('normal')}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                        textSize === 'normal'
                          ? 'bg-secondary text-white'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextSize('large')}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                        textSize === 'large'
                          ? 'bg-secondary text-white'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      115%
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextSize('xlarge')}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                        textSize === 'xlarge'
                          ? 'bg-secondary text-white'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      130%
                    </button>
                  </div>
                </div>

                {/* Language Select */}
                <div className="pt-1 border-t border-outline-variant/15 space-y-1.5">
                  <span className="text-xs text-on-surface-variant block">Active Language (6 Options)</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.code)}
                          className={`px-2 py-1.5 rounded-lg text-left text-xs flex items-center gap-1.5 border transition-all ${
                            isSelected
                              ? 'bg-secondary/15 border-secondary text-secondary font-bold'
                              : 'bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          <span role="img" aria-label={lang.label}>
                            {lang.flag}
                          </span>
                          <span className="truncate">{lang.nativeLabel.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('copay-calculator')}
                className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs border border-outline-variant/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                <span>Estimate Deductible for {currentProfile.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Security Gate Modal */}
      <BiometricSecurityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBiometricSuccess}
        preferredType={preferredBiometric}
        patientName={currentProfile.name}
      />
    </div>
  );
};

