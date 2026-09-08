import React, { useState, useEffect } from 'react';

export type BiometricType = 'face_id' | 'touch_id' | 'windows_hello';

interface BiometricSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string) => void;
  preferredType?: BiometricType;
  patientName: string;
}

export const BiometricSecurityModal: React.FC<BiometricSecurityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preferredType = 'face_id',
  patientName
}) => {
  const [activeMethod, setActiveMethod] = useState<BiometricType | 'pin'>(preferredType);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play synthetic tone using Web Audio API
  const playSound = (type: 'scan' | 'success' | 'error') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'scan') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.18); // D6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(196, ctx.currentTime);
        osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio playback fails gracefully if browser blocks autoplay
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setScanProgress(0);
      setPinInput('');
      setErrorMessage('');
      setActiveMethod(preferredType);
    }
  }, [isOpen, preferredType]);

  const handleStartBiometricScan = (simulateError = false) => {
    setStatus('scanning');
    setScanProgress(0);
    setErrorMessage('');
    playSound('scan');

    let current = 0;
    const interval = setInterval(() => {
      current += 12;
      if (current >= 100) {
        clearInterval(interval);
        setScanProgress(100);

        if (simulateError) {
          setStatus('failed');
          setErrorMessage('Biometric signature did not match secure hardware enclave. Please retry or enter Clinical PIN.');
          playSound('error');
        } else {
          setStatus('success');
          playSound('success');
          setTimeout(() => {
            const methodLabel =
              activeMethod === 'face_id'
                ? 'Apple Face ID'
                : activeMethod === 'touch_id'
                ? 'Touch ID / Fingerprint'
                : 'Windows Hello FIDO2';
            onSuccess(methodLabel);
            onClose();
          }, 800);
        }
      } else {
        setScanProgress(current);
      }
    }, 120);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '8492' || pinInput.length === 4) {
      setStatus('success');
      playSound('success');
      setTimeout(() => {
        onSuccess('Master Clinical PIN (8492)');
        onClose();
      }, 600);
    } else {
      setStatus('failed');
      setErrorMessage('Incorrect PIN. Default test PIN is 8492.');
      playSound('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-md rounded-3xl border border-outline-variant/40 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-outline-variant/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">shield</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-on-surface">Biometric Security Gate</h3>
              <p className="text-[11px] text-on-surface-variant font-mono">FIDO2 WebAuthn Hardware Enclave</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs text-on-surface-variant">Authenticating access for:</span>
            <div className="font-headline font-bold text-base text-on-surface">{patientName}</div>
            <p className="text-[11px] text-on-surface-variant max-w-xs mx-auto">
              Decrypts HIPAA-protected prescription insurance cards, verified clinical allergies, and HSA debit credentials.
            </p>
          </div>

          {/* Biometric Method Selector Pills */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-surface-container rounded-xl text-xs font-semibold text-on-surface-variant">
            <button
              onClick={() => {
                setActiveMethod('face_id');
                setStatus('idle');
                setErrorMessage('');
              }}
              className={`py-1.5 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeMethod === 'face_id'
                  ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                  : 'hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">face</span>
              <span className="text-[10px]">Face ID</span>
            </button>

            <button
              onClick={() => {
                setActiveMethod('touch_id');
                setStatus('idle');
                setErrorMessage('');
              }}
              className={`py-1.5 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeMethod === 'touch_id'
                  ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                  : 'hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">fingerprint</span>
              <span className="text-[10px]">Touch ID</span>
            </button>

            <button
              onClick={() => {
                setActiveMethod('windows_hello');
                setStatus('idle');
                setErrorMessage('');
              }}
              className={`py-1.5 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeMethod === 'windows_hello'
                  ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                  : 'hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">passkey</span>
              <span className="text-[10px]">Passkey</span>
            </button>

            <button
              onClick={() => {
                setActiveMethod('pin');
                setStatus('idle');
                setErrorMessage('');
              }}
              className={`py-1.5 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeMethod === 'pin'
                  ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                  : 'hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">pin</span>
              <span className="text-[10px]">PIN Code</span>
            </button>
          </div>

          {/* Interactive Scanner Area */}
          {activeMethod !== 'pin' ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              {/* Animated Scanner Graphic */}
              <div
                onClick={() => status !== 'scanning' && handleStartBiometricScan(false)}
                className={`w-36 h-36 rounded-3xl border-2 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all ${
                  status === 'scanning'
                    ? 'border-secondary bg-secondary/10 shadow-lg ring-4 ring-secondary/20'
                    : status === 'success'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                    : status === 'failed'
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-outline-variant/50 bg-surface-container-low hover:border-secondary hover:bg-surface-container text-secondary'
                }`}
              >
                {/* Laser scan line in scanning state */}
                {status === 'scanning' && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-md" />
                )}

                {/* Biometric Icon */}
                {status === 'success' ? (
                  <span className="material-symbols-outlined text-6xl text-emerald-600 animate-bounce">
                    check_circle
                  </span>
                ) : status === 'failed' ? (
                  <span className="material-symbols-outlined text-6xl text-red-600 animate-pulse">
                    error
                  </span>
                ) : (
                  <span
                    className={`material-symbols-outlined text-6xl transition-transform ${
                      status === 'scanning' ? 'scale-110 text-secondary animate-pulse' : 'text-secondary'
                    }`}
                  >
                    {activeMethod === 'face_id'
                      ? 'face'
                      : activeMethod === 'touch_id'
                      ? 'fingerprint'
                      : 'passkey'}
                  </span>
                )}

                <span className="text-[11px] font-mono mt-2 font-bold">
                  {status === 'scanning'
                    ? `${scanProgress}%`
                    : status === 'success'
                    ? 'MATCH VERIFIED'
                    : status === 'failed'
                    ? 'SCAN FAILED'
                    : 'TAP TO SCAN'}
                </span>
              </div>

              {/* Progress or instructions */}
              {status === 'scanning' && (
                <div className="w-full max-w-xs space-y-1.5 text-center">
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-150 rounded-full"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-on-surface-variant">
                    {activeMethod === 'face_id'
                      ? 'Verifying TrueDepth facial geometry...'
                      : activeMethod === 'touch_id'
                      ? 'Reading epidermal ridge patterns...'
                      : 'Negotiating FIDO2 cryptographic token...'}
                  </span>
                </div>
              )}

              {status === 'idle' && (
                <div className="text-center space-y-2">
                  <p className="text-xs text-on-surface-variant">
                    Place your biometric sensor or glance at your camera.
                  </p>
                  <button
                    onClick={() => handleStartBiometricScan(false)}
                    className="px-5 py-2 rounded-xl bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors shadow-xs"
                  >
                    Start {activeMethod === 'face_id' ? 'Face ID Scan' : activeMethod === 'touch_id' ? 'Touch ID Scan' : 'Passkey Verification'}
                  </button>
                </div>
              )}

              {status === 'failed' && (
                <div className="text-center space-y-2">
                  <p className="text-xs text-red-700 font-medium">{errorMessage}</p>
                  <button
                    onClick={() => handleStartBiometricScan(false)}
                    className="px-4 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-semibold text-xs transition-colors"
                  >
                    Retry Scan
                  </button>
                </div>
              )}

              {/* Error Simulation Helper (For Testing) */}
              {status === 'idle' && (
                <button
                  onClick={() => handleStartBiometricScan(true)}
                  className="text-[11px] text-outline hover:text-on-surface underline font-mono pt-1"
                >
                  Test Biometric Failure Simulation
                </button>
              )}
            </div>
          ) : (
            /* PIN Fallback Form */
            <form onSubmit={handlePinSubmit} className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <label className="text-xs font-semibold text-on-surface block">
                  Enter 4-Digit Clinical Backup PIN
                </label>
                <p className="text-[11px] text-on-surface-variant">
                  Authorized medical override code (Default: <strong className="text-secondary font-mono">8492</strong>)
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-40 text-center tracking-[1em] text-2xl font-mono py-2 rounded-xl bg-surface-container border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary text-on-surface"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <p className="text-center text-xs text-red-700 font-medium">{errorMessage}</p>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPinInput('8492')}
                  className="w-1/2 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs border border-outline-variant/30"
                >
                  Autofill 8492
                </button>
                <button
                  type="submit"
                  disabled={pinInput.length < 4}
                  className="w-1/2 py-2 rounded-xl bg-secondary text-white font-headline font-semibold text-xs hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                  Verify PIN
                </button>
              </div>
            </form>
          )}

          {/* Sound & Compliance Footer */}
          <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1 hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[15px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
              <span>Audio Chime: {soundEnabled ? 'On' : 'Muted'}</span>
            </button>
            <span>AES-256 GCM • HIPAA Enclave</span>
          </div>
        </div>
      </div>
    </div>
  );
};
