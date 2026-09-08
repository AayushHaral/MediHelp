import React, { useState } from 'react';
import { ScreenType, DrugItem, PharmacyQuote } from './types';
import { MOCK_DRUGS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { SeniorAssistanceBar } from './components/SeniorAssistanceBar';
import { ScreenSwitcherModal } from './components/ScreenSwitcherModal';
import { ScreenQuickBar } from './components/ScreenQuickBar';

// 13 Screen Components
import { DrugSearchScreen } from './components/screens/DrugSearchScreen';
import { DrugDetailScreen } from './components/screens/DrugDetailScreen';
import { SmartRoutingScreen } from './components/screens/SmartRoutingScreen';
import { DiscountCardScreen } from './components/screens/DiscountCardScreen';
import { TeleconsultScreen } from './components/screens/TeleconsultScreen';
import { PrescriptionTransferScreen } from './components/screens/PrescriptionTransferScreen';
import { PharmacyPartnerDashboard } from './components/screens/PharmacyPartnerDashboard';
import { InsuranceCopayCalculator } from './components/screens/InsuranceCopayCalculator';
import { MedicationAdherenceScreen } from './components/screens/MedicationAdherenceScreen';
import { DeliveryTrackingScreen } from './components/screens/DeliveryTrackingScreen';
import { InteractionCheckerScreen } from './components/screens/InteractionCheckerScreen';
import { PriceAlertsScreen } from './components/screens/PriceAlertsScreen';
import { PatientProfileScreen } from './components/screens/PatientProfileScreen';
import { AuthScreen } from './components/screens/AuthScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('catalog');
  const [selectedDrug, setSelectedDrug] = useState<DrugItem>(MOCK_DRUGS[0]);
  const [selectedPharmacyQuote, setSelectedPharmacyQuote] = useState<PharmacyQuote | undefined>(
    MOCK_DRUGS[0].quotes[0]
  );
  const [isScreenModalOpen, setIsScreenModalOpen] = useState<boolean>(false);
  const [activeZip, setActiveZip] = useState<string>('94103');
  const [isEnterpriseMode, setIsEnterpriseMode] = useState<boolean>(false);

  // Handle drug selection and transition to detail
  const handleSelectDrug = (drug: DrugItem) => {
    setSelectedDrug(drug);
    setSelectedPharmacyQuote(drug.quotes[0]);
    setCurrentScreen('drug-detail');
  };

  const handleSelectPharmacyForCoupon = (quote: PharmacyQuote) => {
    setSelectedPharmacyQuote(quote);
    setCurrentScreen('discount-card');
  };

  const handleSelectPharmacyForTransfer = (quote: PharmacyQuote) => {
    setSelectedPharmacyQuote(quote);
    setCurrentScreen('transfer-concierge');
  };

  const handleToggleEnterprise = () => {
    if (!isEnterpriseMode) {
      setIsEnterpriseMode(true);
      setCurrentScreen('b2b-dashboard');
    } else {
      setIsEnterpriseMode(false);
      setCurrentScreen('catalog');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Senior Citizen Accessibility & Multilanguage Bar */}
      <SeniorAssistanceBar />

      {/* Top Application Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenScreenModal={() => setIsScreenModalOpen(true)}
        activeZip={activeZip}
        onChangeZip={setActiveZip}
        isEnterpriseMode={isEnterpriseMode}
        onToggleEnterprise={handleToggleEnterprise}
      />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {currentScreen === 'catalog' && (
          <DrugSearchScreen
            onSelectDrug={handleSelectDrug}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'drug-detail' && (
          <DrugDetailScreen
            drug={selectedDrug}
            onNavigate={setCurrentScreen}
            onSelectPharmacyForCoupon={handleSelectPharmacyForCoupon}
            onSelectPharmacyForTransfer={handleSelectPharmacyForTransfer}
          />
        )}

        {currentScreen === 'smart-routing' && (
          <SmartRoutingScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'discount-card' && (
          <DiscountCardScreen
            drug={selectedDrug}
            pharmacyQuote={selectedPharmacyQuote}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'teleconsult' && (
          <TeleconsultScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'transfer-concierge' && (
          <PrescriptionTransferScreen
            targetPharmacy={selectedPharmacyQuote}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'b2b-dashboard' && (
          <PharmacyPartnerDashboard onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'copay-calculator' && (
          <InsuranceCopayCalculator onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'adherence-schedule' && (
          <MedicationAdherenceScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'delivery-tracking' && (
          <DeliveryTrackingScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'interaction-checker' && (
          <InteractionCheckerScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'price-alerts' && (
          <PriceAlertsScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'patient-wallet' && (
          <PatientProfileScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen onNavigate={setCurrentScreen} />
        )}
      </main>

      {/* Floating Bottom Quick Bar */}
      <ScreenQuickBar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenModal={() => setIsScreenModalOpen(true)}
      />

      {/* 13-Screen Directory Modal */}
      <ScreenSwitcherModal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          setIsEnterpriseMode(screen === 'b2b-dashboard');
        }}
      />
    </div>
  );
}
