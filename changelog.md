# Changelog (changelog.md)

All notable changes to the **MediHelp** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-09-09

### Added
- **HL7 FHIR R4 Interoperability Service**: Created `src/services/fhirService.ts` implementing 21st Century Cures Act compliant `MedicationRequest`, `MedicationDispense`, `Patient`, and `Bundle` resources for Epic, Cerner, and Surescripts EHR integrations.
- **HL7 FHIR R4 Bundle Exporter Modal**: Added interactive FHIR R4 JSON exporter modal and schema validator in `PharmacyPartnerDashboard.tsx`.
- **Live Partner Pharmacy Inventory Sync Service**: Created `src/services/partnerInventoryService.ts` for live stock feeds, WAC/AWP margin tracking, and NCPDP coupon claim adjudication.
- **Enterprise Population Health & PDC Analytics Suite**: Created `src/services/enterpriseAnalyticsService.ts` tracking Proportion of Days Covered (PDC >= 80%), CMS 5-Star Rating estimates, annual cost savings, and risk stratification.
- **Express Backend FHIR & B2B Endpoints**: Added `/api/fhir/r4/MedicationRequest`, `/api/b2b/claims/settle`, and `/api/b2b/inventory/sync` endpoints to `server.js`.

### Changed
- Upgraded `PharmacyPartnerDashboard.tsx` with 5-tab sub-navigation (Fulfillment Queue, HL7 FHIR EHR Gateway, Live Inventory Feed, B2B Claims Settlement, Population Health & PDC Analytics).
- Updated `test_medihelp.py`: Added Test Suite 8 for Phase 5 HL7 FHIR R4 & B2B Enterprise verification (8/8 test suites passing).
- Advanced project execution state in `phase.md` to 100% completion (All 5 development phases COMPLETED).

---

## [1.5.0] - 2026-09-09

### Added
- **Progressive Web App (PWA) Manifest & Icons**: Created `public/manifest.json` defining standalone app display, shortcuts, theme colors (`#0f172a`, `#2563eb`), and mobile icons.
- **Service Worker Offline Caching & Web Push**: Created `public/sw.js` with CacheFirst/NetworkFirst caching strategies, offline asset storage, and Web Push listeners.
- **PWA Service Worker Manager**: Created `src/services/pwaService.ts` for lifecycle registration, online/offline detection, deferred install prompts, and notification triggers.
- **Capacitor Cross-Platform Native Mobile Bridge**: Created `src/services/capacitorService.ts` providing native iOS/Android biometrics (FaceID/BiometricPrompt), local push notifications, device info, and haptics.
- **Offline Action Queue & Persistence Layer**: Extended `src/services/dbService.ts` with offline queueing (`queueOfflineAction`, `processOfflineQueue`) for pending dose check-offs and prescription transfers.
- **PWA Install Banner Component**: Created `src/components/pwa/InstallPwaBanner.tsx` prompting users to install MediHelp to their home screen.
- **Offline Network Status Banner & Sync Indicator**: Created `src/components/pwa/OfflineIndicator.tsx` displaying offline status, cached data access, and pending offline sync counts.
- **Server Web Push Endpoints**: Added `/api/push/subscribe` and `/api/push/send-notification` endpoints to Express server (`server.js`).

### Changed
- Updated `index.html` with PWA manifest link, theme colors, and mobile web app capability tags.
- Integrated PWA Service Worker initialization, `InstallPwaBanner`, and `OfflineIndicator` into `App.tsx`.
- Updated `test_medihelp.py`: Added Test Suite 7 for Phase 4 PWA & Service Worker capabilities verification (7/7 suites passing).
- Advanced project execution state in `phase.md` to ~95% completion (Phase 4 COMPLETED).

---

## [1.4.0] - 2026-09-08

### Added
- **Prisma Database Schema**: Created `prisma/schema.prisma` defining PostgreSQL data models (`User`, `FamilyProfile`, `Prescription`, `TransferRequest`, `AdherenceLog`, `AuditLog`).
- **Persistent Data Layer**: Created `src/services/dbService.ts` for IndexedDB/localStorage data persistence across adherence doses, transfer requests, and profiles.
- **HIPAA Compliance Audit Logging Engine**: Created `src/services/securityAuditService.ts` recording encrypted access events meeting HIPAA 45 CFR § 164.312 standards.
- **SMS Reminder Microservice**: Created `src/services/reminderService.ts` and Express backend endpoint `/api/reminders/send-sms`.

### Changed
- Connected `MedicationAdherenceScreen.tsx` to `dbService` so checking off doses decrements inventory and persists across browser refreshes.
- Connected `PatientProfileScreen.tsx` to `securityAuditService` for live audit log inspection.
- Advanced project progress in `phase.md` to ~80% completion.
- Executed automated Python test suite (`test_medihelp.py`): 6/6 verification suites passed (File Integrity, 14 Screens, OpenFDA Live API, Mock Data, TypeScript Contracts, HTML/SEO).

---

## [1.3.0] - 2026-09-08

### Added
- **OpenFDA Live REST API Service**: Created `src/services/openFdaService.ts` querying official FDA drug labeling contraindications and boxed warnings.
- **Gemini Vision Insurance Card OCR**: Created `src/services/geminiService.ts` utilizing `@google/genai` (`gemini-2.5-flash`) for multi-modal insurance card OCR parsing (`payerName`, `rxBin`, `rxPcn`, `rxGroup`, `memberId`).
- **AI Patient Health Assistant**: Added plain-language patient explanations and senior patient advice generator on interaction cards.
- **Express Backend Bridge**: Created `server.js` with `/api/ai/scan-insurance` and `/api/ai/explain-interaction` endpoints.
- **Patient Profile UI**: Added interactive "Scan Insurance Card" image upload and demo AI OCR trigger.

### Changed
- Connected `InteractionCheckerScreen.tsx` to live OpenFDA status indicator and Gemini AI advice modal.
- Advanced project execution state in `phase.md` to ~60% completion.

---

## [1.2.0] - 2026-09-08

### Added
- Created foundational AI persistent context files: `decisions.md`, `rules.md`, `memory.md`, `changelog.md`, and `phase.md` to guide ongoing development.
- Added explicit type contracts and documentation for all 14 application screens in project memory.

### Changed
- Refined component workspace documentation to adhere to strict TypeScript 5.8 standards.
- Standardized UI guidelines for dark mode compatibility and senior accessibility scaling.

### Fixed
- Verified TypeScript build integrity (`tsc --noEmit`) across all screen components and context providers.

---

## [1.1.0] - 2026-08-20

### Added
- **Multi-lingual i18n Engine**: Added `LanguageContext` supporting instant switching between English (`en`), Spanish (`es`), Vietnamese (`vi`), and Chinese (`zh`).
- **Senior Assistance Accessibility Bar**: Introduced top accessibility controls for high-contrast rendering, text magnification, and audio prompts.
- **Biometric Security Verification Modal**: Added TouchID/FaceID passkey simulation component for sensitive prescription transfers and wallet management.
- **Drug Interaction Checker**: Launched dedicated clinical screen for evaluating contraindications between active medications.

### Changed
- Upgraded UI design tokens in `index.css` to leverage Tailwind CSS v4 variables.
- Refactored `App.tsx` navigation shell to support 14 interactive screen types via `ScreenQuickBar` and `ScreenSwitcherModal`.

### Fixed
- Fixed dark mode toggle persistence issue in `ThemeContext`.
- Resolved responsive layout clipping on mobile viewports for pharmacy price comparison tables.

---

## [1.0.0] - 2026-06-15

### Added
- **Core Drug Catalog & Search**: Implemented generic vs. brand search, dosage selector, and pharmacy price comparison quotes.
- **Smart Fulfillment Routing**: Added multi-pharmacy routing optimizer comparing retail pickup, mail order, and courier delivery.
- **Digital Discount Card**: Added printable/scannable prescription discount cards with BIN, PCN, and Group details.
- **Teleconsult Scheduler**: Added virtual physician appointment booking for quick prescription refills.
- **Prescription Transfer Concierge**: Added automated transfer request workflow between retail pharmacies.
- **B2B Pharmacy Partner Dashboard**: Added order tracking, inventory updates, and margin analytics for partner pharmacies.
- **Copay Calculator**: Added out-of-pocket tier estimator for insured patients.
- **Medication Adherence Schedule**: Added daily pill schedule tracker with refill warnings.
- **Delivery Tracking Screen**: Added live courier map simulation and cold-chain temperature verification.
- **Price Alerts Manager**: Added target price tracker for generic prescription drops.
- **Patient Profile & Family Wallet**: Added family member management and insurance card digitizer.
- **Authentication Portal**: Added multi-role login screen supporting Patient, Caregiver, Clinician, and Pharmacy accounts.
- Initialized Vite + React 19 + TypeScript project setup.
