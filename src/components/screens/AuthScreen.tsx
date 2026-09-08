import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  Phone,
  Calendar,
  KeyRound,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  LogOut,
  CreditCard,
  Volume2,
  Check,
  RefreshCw,
  Users,
  Building2,
  Stethoscope
} from 'lucide-react';
import { ScreenType, AuthUser } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface AuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

type AuthTab = 'login' | 'register' | 'biometric-otp';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate }) => {
  const { currentUser, isLoggedIn, login, loginWithCredentials, logout, registerUser, availableUsers } = useAuth();
  const { t, speakText, isSeniorMode } = useLanguage();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('sarah.jenkins@healthmail.com');
  const [loginPassword, setLoginPassword] = useState('SecurePass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessToast, setLoginSuccessToast] = useState<string | null>(null);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regRole, setRegRole] = useState<'patient' | 'caregiver' | 'clinician' | 'pharmacy'>('patient');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [regInsuranceName, setRegInsuranceName] = useState('Humana Medicare Advantage Part D');
  const [regMemberId, setRegMemberId] = useState('');
  const [regRxBin, setRegRxBin] = useState('610524');
  const [regRxGroup, setRegRxGroup] = useState('HUMANARX');
  const [agreeHipaa, setAgreeHipaa] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  // Biometric / OTP state
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(true);

  // Age calculation for senior eligibility
  const calculateAge = (dobString: string): number | null => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const calculatedAge = calculateAge(regDob);
  const isSeniorEligible = calculatedAge !== null && calculatedAge >= 65;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email, phone number, or Member ID.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      const success = loginWithCredentials(loginIdentifier, loginPassword);
      if (success) {
        setLoginSuccessToast('Authentication successful. Welcome back!');
        setTimeout(() => {
          setLoginSuccessToast(null);
        }, 3000);
      } else {
        setLoginError('Invalid credentials. You can use any of the quick demo accounts below.');
      }
    }, 600);
  };

  // Handle Quick Login
  const handleQuickLogin = (user: AuthUser) => {
    login(user);
    setLoginSuccessToast(`Signed in as ${user.name}`);
    setTimeout(() => {
      setLoginSuccessToast(null);
    }, 2500);
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFullName.trim()) {
      setRegError('Full legal name is required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please provide a valid email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (!agreeHipaa) {
      setRegError('You must agree to the HIPAA Health Privacy terms.');
      return;
    }

    setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false);
      const newUser = registerUser({
        name: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || '(415) 555-0199',
        dob: regDob || undefined,
        role: regRole,
        insuranceName: hasInsurance ? regInsuranceName : 'Self-Pay Cash Member',
        memberId: hasInsurance ? regMemberId || `MEM-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
        isSeniorEligible: isSeniorEligible || regDob.startsWith('195') || regDob.startsWith('194')
      });

      setLoginSuccessToast(`Account created! Welcome, ${newUser.name}.`);
      setActiveTab('login');
      setTimeout(() => {
        setLoginSuccessToast(null);
      }, 3500);
    }, 800);
  };

  // Handle Biometric simulation
  const triggerBiometricScan = () => {
    setIsScanningBiometric(true);
    setTimeout(() => {
      setIsScanningBiometric(false);
      // Log in as primary user
      const defaultUser = availableUsers[0];
      login(defaultUser);
      setLoginSuccessToast(`Biometric fingerprint verified: Welcome ${defaultUser.name}!`);
      setTimeout(() => {
        setLoginSuccessToast(null);
      }, 3000);
    }, 1400);
  };

  // Voice read aloud for accessibility
  const handleReadScreen = () => {
    const text = `PharmaCompare Secure Patient Portal. Current mode: ${activeTab === 'login' ? 'Sign in to your account' : 'Create a new patient or caregiver account'}. Fully HIPAA compliant with Medicare and senior prescription benefits.`;
    speakText(text);
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Header & Accessibility Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-outline/15">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-Bit HIPAA Encrypted Vault
              </span>
              {isSeniorMode && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Senior Mode Active
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              {t('auth.title', 'Patient Portal Login & Registration')}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Access wholesale prescription prices, manage Medicare Part D benefits, and sync family health profiles.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              id="auth-voice-read-btn"
              onClick={handleReadScreen}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors border border-outline/20"
              title="Listen to Instructions"
            >
              <Volume2 className="w-4 h-4 text-primary" />
              Listen to Instructions
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {loginSuccessToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium">{loginSuccessToast}</p>
          </div>
        )}

        {/* Active Logged-In User Banner */}
        {isLoggedIn && currentUser && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-md">
                  {currentUser.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                      {t('auth.loggedInAs', 'Signed in as')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/15 text-primary capitalize">
                      {currentUser.role}
                    </span>
                    {currentUser.isSeniorEligible && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        Senior Medicare
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-on-surface">{currentUser.name}</h2>
                  <p className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
                    <span>{currentUser.email}</span>
                    <span>•</span>
                    <span className="text-primary font-medium">{currentUser.insuranceName || 'Self-Pay'}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="auth-go-search-btn"
                  onClick={() => onNavigate('catalog')}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  Rx Drug Search
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="auth-go-wallet-btn"
                  onClick={() => onNavigate('patient-wallet')}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors border border-outline/20 flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  Health Wallet
                </button>
                <button
                  id="auth-logout-btn"
                  onClick={logout}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium transition-colors border border-red-500/20 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('auth.signOut', 'Sign Out')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auth Navigation Tabs */}
        <div className="flex border-b border-outline/20 mb-8">
          <button
            id="auth-tab-login"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3.5 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            <Lock className="w-4 h-4" />
            {t('auth.signIn', 'Sign In')}
          </button>
          <button
            id="auth-tab-register"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3.5 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            <User className="w-4 h-4" />
            {t('auth.signUp', 'Create Account')}
          </button>
          <button
            id="auth-tab-biometric"
            onClick={() => setActiveTab('biometric-otp')}
            className={`flex-1 py-3.5 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'biometric-otp'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Biometric &amp; OTP</span>
            <span className="sm:hidden">Biometric</span>
          </button>
        </div>

        {/* TAB 1: SIGN IN */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline/20 shadow-sm">
              <h3 className="text-xl font-bold text-on-surface mb-1">
                {t('auth.welcomeBack', 'Welcome Back to PharmaCompare')}
              </h3>
              <p className="text-xs text-on-surface-variant mb-6">
                Sign in using your registered email, mobile number, or Member ID.
              </p>

              {loginError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface mb-1.5">
                    {t('auth.emailOrPhone', 'Email address or Mobile phone')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="auth-login-identifier"
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. sarah.jenkins@healthmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-outline/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-on-surface">
                      {t('auth.password', 'Password')}
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered email.')}
                      className="text-xs text-primary hover:underline"
                    >
                      {t('auth.forgotPassword', 'Forgot password?')}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="auth-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface border border-outline/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-outline/40 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-on-surface-variant">
                      {t('auth.rememberMe', 'Remember this device')}
                    </span>
                  </label>
                </div>

                <div className="pt-3 space-y-3">
                  <button
                    id="auth-submit-login-btn"
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {t('auth.loginBtn', 'Sign In Securely')}
                      </>
                    )}
                  </button>

                  <button
                    id="auth-quick-biometric-btn"
                    type="button"
                    onClick={triggerBiometricScan}
                    disabled={isScanningBiometric}
                    className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors border border-outline/25 flex items-center justify-center gap-2"
                  >
                    <Fingerprint className="w-4 h-4 text-emerald-500" />
                    {isScanningBiometric ? 'Verifying Biometric Sensor...' : t('auth.biometricLogin', 'Biometric Touch/Face ID Unlock')}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-outline/15 text-center">
                <p className="text-xs text-on-surface-variant">
                  {t('auth.dontHaveAccount', "Don't have an account? Sign up free")}{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-primary font-semibold hover:underline ml-1"
                  >
                    {t('auth.signUp', 'Create Account')}
                  </button>
                </p>
              </div>
            </div>

            {/* Side Column: 1-Click Demo Profiles for Rapid Testing */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {t('auth.demoAccounts', 'Quick Demo 1-Click Accounts')}
                  </h4>
                  <span className="text-[11px] text-on-surface-variant font-mono">Test Mode</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-4">
                  Select any pre-configured persona to test pricing, senior mode, caregiver proxies, or prescriber tools:
                </p>

                <div className="space-y-3">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleQuickLogin(user)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                        currentUser?.id === user.id
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-outline/20 bg-surface hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                          {user.avatarInitials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                            {user.name}
                            {user.isSeniorEligible && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                                Senior (73)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-on-surface-variant">
                            {user.role === 'patient' && 'Standard Patient • BCBS PPO'}
                            {user.role === 'caregiver' && 'Senior Caregiver • Medicare Part D'}
                            {user.role === 'clinician' && 'Prescribing MD • NPI Active'}
                            {user.role === 'pharmacy' && 'Pharmacy Partner'}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {currentUser?.id === user.id ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security & Senior Compliance Card */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline/20">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-on-surface">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  HIPAA Security &amp; Medicare Integration
                </div>
                <ul className="text-xs text-on-surface-variant space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Real-time claim routing against 68,000+ certified retail pharmacies.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Automatic Medicare Part D coverage gap (donut hole) price comparison.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Caregiver proxy consent for authorized elderly parents or dependents.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER (CREATE ACCOUNT) */}
        {activeTab === 'register' && (
          <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline/20 shadow-sm">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-on-surface">
                  {t('auth.signUp', 'Create Your PharmaCompare Account')}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  {t(
                    'auth.createAccountDesc',
                    'Unlock personalized Rx discounts, family health wallet, and real-time refills.'
                  )}
                </p>
              </div>

              {regError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-2">
                    {t('auth.role', 'Account Role')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRegRole('patient')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        regRole === 'patient'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline/25 bg-surface text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <User className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs">Patient</div>
                      <div className="text-[10px] opacity-75 font-normal">Self / Individual</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('caregiver')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        regRole === 'caregiver'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline/25 bg-surface text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <HeartHandshake className="w-4 h-4 mx-auto mb-1 text-rose-500" />
                      <div className="text-xs">Caregiver</div>
                      <div className="text-[10px] opacity-75 font-normal">Elder / Dependent</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('clinician')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        regRole === 'clinician'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline/25 bg-surface text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                      <div className="text-xs">Clinician</div>
                      <div className="text-[10px] opacity-75 font-normal">Doctor / Nurse</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('pharmacy')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        regRole === 'pharmacy'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline/25 bg-surface text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                      <div className="text-xs">Pharmacy</div>
                      <div className="text-[10px] opacity-75 font-normal">Dispensing Partner</div>
                    </button>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1">
                      {t('auth.fullName', 'Full Legal Name')} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-reg-name"
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-outline/30 text-xs text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-reg-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. eleanor@vancecare.org"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-outline/30 text-xs text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Date of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1">
                      {t('auth.phone', 'Phone Number')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-reg-phone"
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="(415) 555-0192"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-outline/30 text-xs text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1">
                      {t('auth.dob', 'Date of Birth (YYYY-MM-DD)')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-reg-dob"
                        type="date"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-outline/30 text-xs text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Senior Medicare Alert if age >= 65 */}
                {isSeniorEligible && (
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="text-xs">
                      <span className="font-bold">
                        {t('auth.seniorEligible', 'Eligible for Senior Citizen & Medicare Part D Savings!')}
                      </span>
                      <p className="opacity-90 mt-0.5">
                        Age detected: {calculatedAge}. High-contrast display, speech synthesis, and Part D copay routing will be automatically optimized.
                      </p>
                    </div>
                  </div>
                )}

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1">
                      {t('auth.password', 'Password')} *
                    </label>
                    <div className="relative">
                      <input
                        id="auth-reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-outline/30 text-xs text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1">
                      {t('auth.confirmPassword', 'Confirm Password')} *
                    </label>
                    <div className="relative">
                      <input
                        id="auth-reg-confirm-password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-outline/30 text-xs text-on-surface outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Insurance Integration Toggle */}
                <div className="p-4 rounded-xl bg-surface border border-outline/20">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                      <CreditCard className="w-4 h-4 text-primary" />
                      {t('auth.insuranceOptional', 'Insurance Card Details (Optional)')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setHasInsurance(!hasInsurance)}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      {hasInsurance ? t('auth.skipInsurance', 'Skip insurance') : 'Add Insurance'}
                    </button>
                  </div>

                  {hasInsurance ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Payer / Insurance Name</label>
                        <input
                          type="text"
                          value={regInsuranceName}
                          onChange={(e) => setRegInsuranceName(e.target.value)}
                          placeholder="e.g. Humana Medicare Part D"
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline/25 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Member ID</label>
                        <input
                          type="text"
                          value={regMemberId}
                          onChange={(e) => setRegMemberId(e.target.value)}
                          placeholder="e.g. HUM-9041289-01"
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline/25 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Rx BIN</label>
                        <input
                          type="text"
                          value={regRxBin}
                          onChange={(e) => setRegRxBin(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline/25 text-xs text-on-surface font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Rx Group</label>
                        <input
                          type="text"
                          value={regRxGroup}
                          onChange={(e) => setRegRxGroup(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline/25 text-xs text-on-surface font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">
                      You will access unadvertised direct wholesale cash discounts without requiring commercial insurance.
                    </p>
                  )}
                </div>

                {/* HIPAA Consent */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      id="auth-reg-hipaa"
                      type="checkbox"
                      checked={agreeHipaa}
                      onChange={(e) => setAgreeHipaa(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-outline/40 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-on-surface-variant leading-relaxed">
                      {t(
                        'auth.hipaaConsent',
                        'I consent to HIPAA-compliant health record storage, prescription price monitoring, and caregiver authorizations.'
                      )}
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    id="auth-submit-reg-btn"
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {regLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        {t('auth.registerBtn', 'Complete Patient Registration')}
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-outline/15 text-center">
                <p className="text-xs text-on-surface-variant">
                  {t('auth.alreadyHaveAccount', 'Already have an account? Sign in')}{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-primary font-semibold hover:underline ml-1"
                  >
                    {t('auth.signIn', 'Sign In')}
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BIOMETRIC & OTP ACCESSIBILITY */}
        {activeTab === 'biometric-otp' && (
          <div className="max-w-xl mx-auto bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline/20 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <Fingerprint className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-on-surface mb-1">
              Senior &amp; Fast Biometric Authentication
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-6">
              Ideal for seniors who have difficulty remembering complex passwords. Use your device's fingerprint, Face ID, or a simple 6-digit text message code.
            </p>

            <div className="space-y-4 max-w-sm mx-auto">
              <button
                id="auth-biometric-touch-btn"
                type="button"
                onClick={triggerBiometricScan}
                disabled={isScanningBiometric}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isScanningBiometric ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Contacting Biometric Hardware...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    <span>Touch Sensor / Face ID Sign In</span>
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface-container-low px-3 text-on-surface-variant">Or SMS One-Time Passcode</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant mb-3">
                  Enter the 6-digit code sent to (415) ***-0192:
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otpCode[index]}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOtp = [...otpCode];
                        newOtp[index] = val;
                        setOtpCode(newOtp);
                        if (val && e.target.nextElementSibling) {
                          (e.target.nextElementSibling as HTMLInputElement).focus();
                        }
                      }}
                      className="w-10 h-12 text-center text-lg font-mono font-bold rounded-lg bg-surface border border-outline/30 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(['7', '2', '4', '8', '1', '9']);
                      alert('Simulated SMS OTP Code: 724819 autofilled.');
                    }}
                    className="text-primary hover:underline"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText('Your PharmaCompare security code is: 7 2 4 8 1 9')}
                    className="text-on-surface-variant hover:text-on-surface flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-primary" />
                    Speak Code Aloud
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const defaultUser = availableUsers[0];
                    login(defaultUser);
                    setLoginSuccessToast(`Passcode verified: Welcome ${defaultUser.name}!`);
                    setTimeout(() => {
                      setLoginSuccessToast(null);
                    }, 3000);
                  }}
                  className="w-full mt-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Verify Code &amp; Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
