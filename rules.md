# AI Coding & Development Rules (rules.md)

This document contains mandatory guidelines, coding standards, and architectural constraints for human developers and AI coding assistants working on the **MediHelp** repository. All instructions in this file must be strictly followed.

---

## 1. Core Mandate & Non-Negotiables

> [!CRITICAL]
> **NEVER BREAK EXISTING FUNCTIONALITY**
> Do not remove, alter, or break existing working features, export signatures, or UI flows unless explicitly instructed by the user. Always verify that new additions preserve all existing screens, contexts, and mock data types.

---

## 2. Coding Standards & Best Practices

### 2.1 TypeScript & Type Safety
- **Strict Typing**: Never use `any` or implicit `any`. Always define explicit interfaces or imports from `src/types.ts`.
- **Interface Centralization**: Place all shared domain models (e.g., `DrugItem`, `PharmacyQuote`, `AuthUser`, `RoutingPlan`) in `src/types.ts`.
- **Null & Undefined Safety**: Always handle optional fields cleanly with optional chaining (`user?.name`) and nullish coalescing (`value ?? 'Default'`).
- **Export Discipline**: Use named exports for components and utility functions (`export const DrugCard = ...`). Avoid default exports for components to ensure refactoring consistency.

### 2.2 React & Hooks Guidelines
- **Functional Components**: Use standard React functional components with explicit type definitions (`React.FC<Props>` or typed props destructuring).
- **Hook Rules**: Follow the Rules of Hooks strictly. Never call hooks inside loops, conditions, or nested functions.
- **Context Usage**: Access global state via standard custom hooks (`useAuth()`, `useTheme()`, `useLanguage()`).
- **Performance**: Wrap expensive filter or sorting calculations in `useMemo`, and callbacks passed deep into subcomponents in `useCallback`.

### 2.3 CSS & Styling Guidelines
- **Tailwind CSS v4**: Use Tailwind utility classes for all component styling. Avoid custom inline style objects unless calculating dynamic positioning or CSS variables.
- **Dark Mode Compatibility**: Every component MUST support both light and dark modes using Tailwind `dark:` prefixes or CSS variables defined in `index.css`.
- **Accessibility & Contrast**: Ensure text has sufficient color contrast. Interactive elements must include hover, focus-visible, and active states.

---

## 3. Folder Structure & Modular Organization

Maintain strict file organization across the codebase:

```
MediHelp/
├── public/                # Static assets, favicons, public images
├── src/
│   ├── components/        # Reusable UI components & modals
│   │   ├── screens/       # Full-page application screens (14 core screens)
│   │   │   ├── AuthScreen.tsx
│   │   │   ├── DrugSearchScreen.tsx
│   │   │   ├── DrugDetailScreen.tsx
│   │   │   ├── SmartRoutingScreen.tsx
│   │   │   ├── DiscountCardScreen.tsx
│   │   │   ├── TeleconsultScreen.tsx
│   │   │   ├── PrescriptionTransferScreen.tsx
│   │   │   ├── PharmacyPartnerDashboard.tsx
│   │   │   ├── InsuranceCopayCalculator.tsx
│   │   │   ├── MedicationAdherenceScreen.tsx
│   │   │   ├── DeliveryTrackingScreen.tsx
│   │   │   ├── InteractionCheckerScreen.tsx
│   │   │   ├── PriceAlertsScreen.tsx
│   │   │   └── PatientProfileScreen.tsx
│   │   ├── BiometricSecurityModal.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── Navbar.tsx
│   │   ├── ScreenQuickBar.tsx
│   │   ├── ScreenSwitcherModal.tsx
│   │   ├── SeniorAssistanceBar.tsx
│   │   ├── SeniorGuideModal.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/           # React context providers
│   │   ├── AuthContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/              # Mock dataset definitions & fallbacks
│   │   └── mockData.ts
│   ├── App.tsx            # Main application router & shell layout
│   ├── main.tsx           # React root entry point
│   ├── index.css          # Tailwind CSS directives, font imports, design system tokens
│   └── types.ts           # Central TypeScript interfaces & types
├── .env.example           # Template for environment variables
├── decisions.md           # Technical decision records (ADR)
├── rules.md               # AI context rules and development guidelines
├── memory.md              # Long-term project memory & domain knowledge
├── changelog.md           # Chronological project version history
├── package.json           # Scripts and dependency declarations
├── tsconfig.json          # TypeScript compiler configuration
└── vite.config.ts         # Vite bundler configuration
```

---

## 4. Naming Conventions

| Entity Category | Convention | Example |
| :--- | :--- | :--- |
| **Components** | PascalCase | `DrugDetailScreen.tsx`, `Navbar.tsx` |
| **Context Providers** | PascalCase + Context | `AuthContext.tsx`, `LanguageContext.tsx` |
| **Types & Interfaces** | PascalCase | `PharmacyQuote`, `AdherenceDose` |
| **Utility Files / Helpers** | camelCase | `mockData.ts`, `formatCurrency.ts` |
| **CSS Classes** | kebab-case or Tailwind utility | `bg-emerald-600`, `glass-card` |
| **Enums & Constants** | SCREAMING_SNAKE_CASE | `MAX_REFILL_DAYS`, `DEFAULT_LANGUAGE` |
| **State Variables** | camelCase | `selectedDrug`, `isBiometricOpen` |

---

## 5. UI/UX Consistency Rules

- **Design System Palette**:
  - Primary Accent: Teal / Emerald (`emerald-600`, `teal-500`) representing health & medical trust.
  - Secondary Accent: Blue / Indigo (`blue-600`, `indigo-500`) for technology & telemetry.
  - Warning / Caution: Amber / Orange (`amber-500`) for drug interactions & low inventory.
  - Error / Critical: Rose / Red (`rose-600`) for major drug interactions or expired prescriptions.
- **Glassmorphism & Cards**: Use consistent backdrop blur (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50`).
- **Icons**: Exclusively use icons from `lucide-react`. Keep stroke width standard at `1.75` or `2`.
- **Senior Accessibility**: Ensure text scaling and simplified navigation controls operate smoothly when `SeniorAssistanceBar` toggles high-contrast mode.

---

## 6. Security & Environment Variable Rules

> [!WARNING]
> **PROTECT SENSITIVE CREDENTIALS**
> Never hardcode API keys, secret tokens, or private endpoints in frontend code or commit them to version control.

- **Environment Variables**:
  - All client-accessible environment variables must be prefixed with `VITE_` (e.g., `VITE_GEMINI_API_KEY`).
  - Keep `.env` listed in `.gitignore`.
  - Always update `.env.example` when introducing a new required environment variable.
- **Data Privacy (HIPAA Alignment)**:
  - Do not send real Protected Health Information (PHI) to external API calls.
  - Use simulated mock profiles for testing family cards, insurance BIN/PCN numbers, and prescription history.

---

## 7. Git Commit Rules

Follow standard Conventional Commits for clear history:

- `feat: <description>` - A new screen or user feature
- `fix: <description>` - A bug fix or layout correction
- `docs: <description>` - Documentation updates (e.g., `memory.md`, `decisions.md`)
- `style: <description>` - UI polishing, tailwind formatting, code style tweaks
- `refactor: <description>` - Code restructuring without changing component behavior
- `test: <description>` - Adding or updating automated verification scripts

---

## 8. Verification Before Output

Before finalizing any task:
1. Run `npm run lint` or `npx tsc --noEmit` to ensure zero TypeScript errors.
2. Run `npm run build` or verify dev server stability.
3. Confirm all existing navigation tabs and modal dialogs function cleanly.
