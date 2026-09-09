# Project Memory & Domain Knowledge (memory.md)

This document functions as the persistent long-term memory for the **MediHelp** application. It provides AI coding assistants and developers with a complete overview of the architecture, tech stack, data models, completed features, business logic, known issues, and strategic roadmap.

---

## 1. Project Overview

**MediHelp** is an advanced, AI-powered prescription savings, smart pharmacy routing, and patient management platform. It bridges the gap between consumers, clinical providers, and retail/mail-order pharmacies by offering price transparency, drug interaction checks, senior assistance modes, and instant copay optimization.

- **Primary Goal**: Lower prescription costs for patients by up to 80% through real-time discount card aggregation, smart fulfillment routing, insurance copay calculations, and teleconsult concierges.
- **Target Audience**: Patients, caregivers, seniors, clinical staff, and retail pharmacy partners.

---

## 2. Tech Stack Summary

| Layer | Technology / Library | Version / Details |
| :--- | :--- | :--- |
| **Framework & Core** | React | `^19.0.1` |
| **Build System** | Vite | `^6.2.3` |
| **Language** | TypeScript | `~5.8.2` (Strict Mode) |
| **Styling** | Tailwind CSS | `@tailwindcss/vite ^4.1.14` |
| **Animations** | Motion (Framer Motion) | `^12.23.24` |
| **Icons** | Lucide React | `^0.546.0` |
| **AI Capabilities** | Google Gen AI SDK | `@google/genai ^2.4.0` |
| **Backend / Bridge** | Express & tsx | `Express ^4.21.2`, `tsx ^4.21.0` |
| **State Management** | React Context API | `AuthContext`, `ThemeContext`, `LanguageContext` |

---

## 3. Features Completed (14 Active Screens)

The application currently delivers 14 fully interactive operational screens accessible via the quick screen navigation bar or screen switcher modal:

| # | Screen Name | Key Functionality |
| :-: | :--- | :--- |
| 1 | **Drug Search (`catalog`)** | Searchable prescription catalog with popularity ranking, generic availability badges, dosage forms, strength selectors, and pharmacy price comparisons. |
| 2 | **Drug Detail (`drug-detail`)** | In-depth drug profile showing manufacturer details, side effects, controlled substance indicators, and interactive quantity selectors. |
| 3 | **Smart Routing (`smart-routing`)** | AI-driven fulfillment optimizer comparing multi-pharmacy split strategies, cold-chain mail order, local pickup, and courier delivery. |
| 4 | **Discount Card (`discount-card`)** | Digital pharmacy coupon card with BIN, PCN, Group, and Member ID for immediate scanning at pharmacy checkout counters. |
| 5 | **Teleconsult Concierge (`teleconsult`)** | Virtual doctor consultation scheduler for fast prescription renewals, specialist reviews, and fee comparisons. |
| 6 | **Prescription Transfer (`transfer-concierge`)** | Step-by-step concierge transfer workflow moving existing prescriptions between retail pharmacies to unlock lower rates. |
| 7 | **Pharmacy Dashboard (`b2b-dashboard`)** | B2B analytics portal for partner pharmacies to monitor incoming orders, inventory status, fulfillment speed, and margin metrics. |
| 8 | **Copay Calculator (`copay-calculator`)** | Insurance tier estimator calculating out-of-pocket expenses, deductible progress, and manufacturer copay card savings. |
| 9 | **Adherence Schedule (`adherence-schedule`)** | Daily pill reminder tracker with visual dosage colors, refill countdowns, and pill inventory counts. |
| 10 | **Delivery Tracking (`delivery-tracking`)** | Live GPS-style courier status tracking with real-time ETA, driver details, and temperature-controlled cold-chain verification. |
| 11 | **Interaction Checker (`interaction-checker`)** | Clinical drug-drug interaction checker evaluating major, moderate, and minor contraindications with clinical management steps. |
| 12 | **Price Alerts (`price-alerts`)** | Automated price drop tracker notifying users when generic equivalents or pharmacy discounts drop below target thresholds. |
| 13 | **Patient Profile & Wallet (`patient-wallet`)** | Family member profile switcher, insurance digital card wallet, saved payment methods, and notification preferences. |
| 14 | **Authentication (`auth`)** | User login and registration portal supporting patient, caregiver, clinician, and pharmacy roles. |

---

## 4. Global Modals & Utilities

- **`BiometricSecurityModal`**: TouchID / FaceID passkey authorization dialog for sensitive operations.
- **`SeniorAssistanceBar` & `SeniorGuideModal`**: High-contrast text scaling, audio narration triggers, and simplified UI controls for elderly patients.
- **`LanguageSelector`**: Instant i18n switching between English (`en`), Spanish (`es`), Vietnamese (`vi`), and Chinese (`zh`).
- **`ThemeToggle`**: Dark / Light theme switcher persisted in browser storage.

---

## 5. Completed & Active Services (Phase 1 & Phase 2)

- [x] **OpenFDA REST API Integration**: `src/services/openFdaService.ts` queries `api.fda.gov/drug/label.json` for live contraindications and boxed warnings.
- [x] **Gemini Vision Multi-Modal OCR**: `src/services/geminiService.ts` parses insurance card photos for `payerName`, `rxBin`, `rxPcn`, `rxGroup`, and `memberId`.
- [x] **Gemini AI Plain-Language Health Assistant**: Generates patient safety summaries and senior patient advice for drug interactions.
- [x] **PWA & Service Worker Offline Caching**: `public/sw.js` and `src/services/pwaService.ts` for offline adherence tracking and manifest.
- [x] **Capacitor Cross-Platform Native Mobile Bridge**: `src/services/capacitorService.ts` supporting FaceID biometrics, local notifications, and haptics on iOS & Android.
- [x] **Offline Action Queue & Persistence Layer**: `src/services/dbService.ts` queueing offline dose check-offs and prescription transfer submissions.
- [x] **HL7 FHIR R4 Interoperability Engine**: `src/services/fhirService.ts` for 21st Century Cures Act compliant `MedicationRequest` and `Bundle` exports to Epic and Cerner EHR portals.
- [x] **Live Partner Inventory Feed & B2B Claims**: `src/services/partnerInventoryService.ts` for PioneerRx/Rx30 stock sync and NCPDP coupon claim adjudication.
- [x] **Enterprise Population Health & PDC Analytics**: `src/services/enterpriseAnalyticsService.ts` for Proportion of Days Covered (PDC) and CMS Star Rating metrics.
- [x] **Express Backend API Bridge**: `server.js` providing `/api/ai/scan-insurance`, `/api/ai/explain-interaction`, `/api/reminders/send-sms`, `/api/push/subscribe`, `/api/push/send-notification`, `/api/fhir/r4/MedicationRequest`, `/api/b2b/claims/settle`, and `/api/b2b/inventory/sync`.

---

## 6. Completed Development Lifecycle (Phases 1 - 5)

All 5 core development roadmap phases defined in `phase.md` are **100% COMPLETED** and verified.

---

## 6. API Endpoints & Services Summary

Currently, MediHelp operates on a client-side mock service architecture with an optional Express backend bridge (`server.js`).

### Simulated Client Services (`src/data/mockData.ts`)
- `getMockDrugs()`: Fetches drug list with embedded pricing quotes across retail chains (CVS, Walgreens, Walmart, CostCo, Mail-Order).
- `getMockRoutingPlans()`: Generates optimized routing combinations for multi-medication patient regimens.
- `getMockInteractions()`: Returns severity ratings and clinical guidelines for drug pairs.
- `getMockAdherenceDoses()`: Returns patient dose schedule, remaining pill counts, and refill warnings.

### Server API Bridge (`server.js`)
- `POST /api/ai/recommendations`: Interfaces with `@google/genai` to generate personalized medication savings advice based on patient profile and prescription history.
- `POST /api/ai/interaction-explain`: Generates plain-language interaction safety summaries for patients.

---

## 7. Database Schema Summary (Conceptual Data Models)

All application data structures are strictly defined in `src/types.ts`:

```typescript
// Key Data Contracts
DrugItem {
  id: string;
  name: string;
  brandName: string;
  genericName: string;
  isGenericAvailable: boolean;
  drugClass: string;
  typicalSavingsPercent: number;
  lowestPrice: number;
  averageRetailPrice: number;
  quotes: PharmacyQuote[];
}

PharmacyQuote {
  pharmacyId: string;
  pharmacyName: string;
  chainType: 'retail' | 'independent' | 'mail-order' | 'courier';
  cashPrice: number;
  discountPrice: number;
  insuranceEstimatedCopay: number;
  inStock: boolean;
  couponCode?: string;
  bin?: string;
  pcn?: string;
  group?: string;
}

AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'caregiver' | 'clinician' | 'pharmacy';
  insuranceName?: string;
  memberId?: string;
  isSeniorEligible?: boolean;
}

FamilyProfile {
  id: string;
  name: string;
  relation: string;
  allergies: string[];
  insuranceCard: { payerName; rxBin; rxPcn; rxGroup; memberId; status };
}
```

---

## 8. Important Business Logic

1. **Best Savings Calculation**:
   - `Best Value` tag is assigned to quotes where `discountPrice` offers the highest percentage delta against `averageRetailPrice` while keeping `inStock = true`.
2. **Smart Routing Algorithm**:
   - Multi-drug optimization splits orders into (a) Urgent Maintenance via Local Courier, and (b) Non-Urgent Maintenance via Cold-Chain Mail Order to maximize annual dollar savings.
3. **Drug Interaction Severity Matrix**:
   - `Major`: Requires immediate clinician alert; triggers visual rose badge and mandatory warning text before transfer.
   - `Moderate`: Recommends dosage timing separation; displays amber notification.
   - `Minor`: Informational note on mild symptom monitoring.
4. **Senior Mode Logic**:
   - Scaling factor increases root font sizes from `16px` to `20px` and forces `contrast-125` visual adjustments across screen components.

---

## 9. Known Issues & Tech Debt

- **Mock Data Persistence**: Changes to adherence doses (e.g., marking a pill as taken) are stored in React component state rather than persisted to IndexedDB or localStorage.
- **Express Server Dev Script**: Node server setup in `server.js` requires running separately or through `tsx` during full-stack testing.

---

## 10. Future Strategic Roadmap

- **Phase 1 (Current)**: High-fidelity SPA prototype with 14 interactive screens, mock data engine, i18n, senior assistance, and Gemini AI endpoints.
- **Phase 2**: Integration with real-world GoodRx / SingleCare API feeds and OpenFDA database queries for live drug interactions.
- **Phase 3**: HIPAA-compliant backend with PostgreSQL database, Prisma ORM, JWT/OAuth2 authentication, and Twilio SMS dose reminders.
- **Phase 4**: Native iOS/Android app wrappers via Capacitor / React Native.
