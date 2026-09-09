# Architectural & Product Decision Log (decisions.md)

This log records all key technical, architectural, and product decisions made during the lifecycle of the **MediHelp** project. Every decision documented here serves as reference context for team members and AI coding assistants.

---

## Index of Decisions

- [ADR-001: Modern Web Architecture with Vite, React 19, and TypeScript](#adr-001-modern-web-architecture-with-vite-react-19-and-typescript)
- [ADR-002: Tailwind CSS v4 Engine for High-Performance UI Styling](#adr-002-tailwind-css-v4-engine-for-high-performance-ui-styling)
- [ADR-003: Modular React Context Architecture for Application State](#adr-003-modular-react-context-architecture-for-application-state)
- [ADR-004: Integrated Multi-lingual i18n & Senior Assistance Accessibility Engine](#adr-004-integrated-multi-lingual-i18n--senior-assistance-accessibility-engine)
- [ADR-005: Client-Side & Server-Side Gemini AI Integration Framework](#adr-005-client-side--server-side-gemini-ai-integration-framework)
- [ADR-006: Component-Driven Screen Architecture & Modal Manager](#adr-006-component-driven-screen-architecture--modal-manager)
- [ADR-007: Biometric Verification Modal & Security Policy](#adr-007-biometric-verification-modal--security-policy)

---

### ADR-001: Modern Web Architecture with Vite, React 19, and TypeScript

- **Decision Title**: Adoption of Vite, React 19, and TypeScript as Core Application Framework
- **Date**: 2026-03-01
- **Context/Problem**: MediHelp requires a fast, responsive, and type-safe front-end architecture capable of handling complex prescription management, pricing comparisons, and real-time interaction checks without UI latency.
- **Decision Taken**: Standardize on React 19 with Vite 6 as the build tool and TypeScript 5.8 for type safety.
- **Reasoning**:
  - React 19 provides enhanced rendering optimizations, concurrent features, and streamlined hooks.
  - Vite offers near-instantaneous hot module replacement (HMR) and fast build times compared to traditional bundle tools.
  - Strict TypeScript interfaces eliminate runtime type mismatches across complex medication, pharmacy, and patient data models.
- **Alternatives Considered**:
  - *Next.js (App Router)*: Deemed unnecessarily complex for the current SPA-first prescription comparison and patient dashboard scope.
  - *Vanilla JavaScript*: Rejected due to high risk of bugs in state-heavy UI components.
- **Impact on Project**: Established high developer velocity, full type safety across `types.ts`, and sub-second local dev server reloads.

---

### ADR-002: Tailwind CSS v4 Engine for High-Performance UI Styling

- **Decision Title**: Implementation of Tailwind CSS v4 with Motion Animations
- **Date**: 2026-03-05
- **Context/Problem**: The application needs a modern, polished aesthetic with dark mode support, fluid transitions, glassmorphism UI elements, and accessible high-contrast themes for senior patients.
- **Decision Taken**: Utilize Tailwind CSS v4 (`@tailwindcss/vite`) combined with `lucide-react` icons and `motion` (Framer Motion) for UI micro-interactions.
- **Reasoning**:
  - Tailwind v4 delivers superior CSS compilation speeds and clean CSS variable customization.
  - Utility-first approach ensures design consistency across all 14 screens.
  - Native CSS variable support facilitates instant dark mode and high-contrast senior theme switching without extra re-renders.
- **Alternatives Considered**:
  - *Styled Components / Emotion*: Higher runtime bundle size and runtime CSS-in-JS overhead.
  - *Plain CSS Modules*: Harder to maintain color tokens and glassmorphic utility classes uniformly.
- **Impact on Project**: Rapid UI development, uniform design design tokens in `index.css`, zero runtime CSS-in-JS performance penalty.

---

### ADR-003: Modular React Context Architecture for Application State

- **Decision Title**: Decoupled Context Providers for Auth, Theme, and Language
- **Date**: 2026-03-10
- **Context/Problem**: Application state spans global concerns (authentication status, theme mode, active language translations) alongside local screen state (drug filters, copay calculations).
- **Decision Taken**: Implement lightweight, focused React Context modules: `AuthContext`, `ThemeContext`, and `LanguageContext`.
- **Reasoning**:
  - Keeps state scoped cleanly without introducing heavy external state management libraries like Redux or Zustand for initial releases.
  - Allows components to consume only the context slice they require, minimizing unnecessary renders.
  - Integrates smoothly with localStorage for persistent theme and user session preferences.
- **Alternatives Considered**:
  - *Redux Toolkit*: Over-engineered for current scope; boilerplate heavy.
  - *Zustand*: Viable, but React Context satisfied all current needs without extra third-party state dependencies.
- **Impact on Project**: Simplified state debugging, explicit prop contracts, and seamless persistence across page reloads.

---

### ADR-004: Integrated Multi-lingual i18n & Senior Assistance Accessibility Engine

- **Decision Title**: Built-in Multi-Language Context and High-Contrast Senior Accessibility Mode
- **Date**: 2026-03-15
- **Context/Problem**: Healthcare applications must be accessible to diverse demographics, including non-English speakers and elderly patients with visual or cognitive impairments.
- **Decision Taken**: Create a dedicated `LanguageContext` supporting English, Spanish, Vietnamese, and Chinese, alongside a global `SeniorAssistanceBar` and `SeniorGuideModal`.
- **Reasoning**:
  - Embedded translation dictionaries provide instant string switching without network requests.
  - Senior assistance features (font size scaling, simplified navigation buttons, audio narration triggers) increase accessibility compliance and user trust.
- **Alternatives Considered**:
  - *i18next standard library*: Rejected to avoid external dependency overhead during rapid prototyping, using explicit TypeScript dictionary maps instead.
- **Impact on Project**: Inclusive UI supporting 4 languages and enhanced visual accessibility across all patient touchpoints.

---

### ADR-005: Client-Side & Server-Side Gemini AI Integration Framework

- **Decision Title**: Dual Integration Strategy for Google Gemini AI (`@google/genai`)
- **Date**: 2026-03-20
- **Context/Problem**: MediHelp provides intelligent medication recommendations, interaction analysis, and teleconsult draft summaries requiring LLM capabilities.
- **Decision Taken**: Configure `@google/genai` client-side API SDK along with an Express backend bridge (`server.js`) for secure key management and server-side processing when needed.
- **Reasoning**:
  - Direct client integration allows rapid interactive prototyping with user-provided or environment API keys.
  - Backend Express proxy ensures production readiness, rate-limiting capability, and security for private API keys.
- **Alternatives Considered**:
  - *OpenAI API*: Selected Gemini due to multi-modal potential, fast inference, and seamless Google Cloud ecosystem integration.
- **Impact on Project**: Enabled smart drug search insights, automated copay advice, and AI teleconsult assistant.

---

### ADR-006: Component-Driven Screen Architecture & Modal Manager

- **Decision Title**: Unified Screen Switcher and Overlay Modal Architecture
- **Date**: 2026-03-25
- **Context/Problem**: MediHelp features 14 operational screens spanning consumer healthcare, clinical delivery, and partner operations. SPA navigation must be seamless without full page reloads.
- **Decision Taken**: Map all views through a `ScreenType` union in `types.ts` managed by central layout controls and dedicated modal components (`ScreenSwitcherModal`, `BiometricSecurityModal`, `SeniorGuideModal`).
- **Reasoning**:
  - Facilitates instant tab switching and demo navigation across all 14 screens.
  - Keeps URL and state transitions predictable within the single-page shell.
- **Alternatives Considered**:
  - *React Router DOM*: Can be added in future iterations for deep-linking, but SPA screen state enum provided immediate execution velocity.
- **Impact on Project**: Smooth transition animations between screens with complete state retention.

---

### ADR-007: Biometric Verification Modal & Security Policy

- **Decision Title**: Simulated Biometric Security Check for Sensitive Patient Actions
- **Date**: 2026-04-01
- **Context/Problem**: Accessing prescription records, requesting transfers, and managing copay financial data requires high security trust indicators (HIPAA awareness).
- **Decision Taken**: Build a dedicated `BiometricSecurityModal` supporting TouchID / FaceID passkey simulation prior to confirming sensitive actions.
- **Reasoning**:
  - Reinforces security posture in user testing.
  - Prepares the app frontend for WebAuthn / FIDO2 integration in upcoming enterprise phases.
- **Alternatives Considered**:
  - *Basic Password Prompt*: Less modern user experience compared to biometric authorization patterns.
- **Impact on Project**: Enhanced trust metrics and clear security boundaries around financial and prescription transfers.
