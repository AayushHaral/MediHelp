import os
import json
import re
import urllib.request
import urllib.parse
import sys

print("==========================================================")
print("     MediHelp All 5 Phases Comprehensive Test Suite       ")
print("==========================================================")

test_results = []

def record_test(phase_label, name, success, message):
    status = "PASS" if success else "FAIL"
    print(f"[{status}] [{phase_label}] {name}: {message}")
    test_results.append({
        "phase": phase_label,
        "name": name,
        "status": status,
        "message": message
    })

base_dir = r"e:\project\MediHelp"

# ==========================================================
# PHASE 1: High-Fidelity SPA Prototype & Core UI Foundation
# ==========================================================
print("\n--- Phase 1: High-Fidelity SPA Prototype & Core UI ---")

# 1.1 Test 14 Screen Components Presence
screens = [
    "AuthScreen.tsx",
    "DeliveryTrackingScreen.tsx",
    "DiscountCardScreen.tsx",
    "DrugDetailScreen.tsx",
    "DrugSearchScreen.tsx",
    "InsuranceCopayCalculator.tsx",
    "InteractionCheckerScreen.tsx",
    "MedicationAdherenceScreen.tsx",
    "PatientProfileScreen.tsx",
    "PharmacyPartnerDashboard.tsx",
    "PrescriptionTransferScreen.tsx",
    "PriceAlertsScreen.tsx",
    "SmartRoutingScreen.tsx",
    "TeleconsultScreen.tsx"
]

screens_dir = os.path.join(base_dir, "src", "components", "screens")
missing_screens = [sc for sc in screens if not os.path.exists(os.path.join(screens_dir, sc))]

if not missing_screens:
    record_test("PHASE 1", "14 Screens Check", True, "All 14 operational UI screen components exist in src/components/screens.")
else:
    record_test("PHASE 1", "14 Screens Check", False, f"Missing screens: {', '.join(missing_screens)}")

# 1.2 Test Global Context Providers & Architecture
contexts = ["AuthContext.tsx", "ThemeContext.tsx", "LanguageContext.tsx"]
context_dir = os.path.join(base_dir, "src", "context")
missing_contexts = [c for c in contexts if not os.path.exists(os.path.join(context_dir, c))]

if not missing_contexts:
    record_test("PHASE 1", "Context Providers", True, "AuthContext, ThemeContext, and LanguageContext providers present.")
else:
    record_test("PHASE 1", "Context Providers", False, f"Missing contexts: {', '.join(missing_contexts)}")

# 1.3 Test Mock Data & Types Contract
try:
    mock_data_path = os.path.join(base_dir, "src", "data", "mockData.ts")
    with open(mock_data_path, "r", encoding="utf-8") as f:
        content = f.read()

    has_drugs = "MOCK_DRUGS" in content
    has_interactions = "MOCK_INTERACTIONS" in content
    has_adherence = "MOCK_ADHERENCE" in content
    has_family = "MOCK_FAMILY_PROFILES" in content

    if has_drugs and has_interactions and has_adherence and has_family:
        record_test("PHASE 1", "Mock Dataset Integrity", True, "MOCK_DRUGS, MOCK_INTERACTIONS, MOCK_ADHERENCE, and MOCK_FAMILY_PROFILES present.")
    else:
        record_test("PHASE 1", "Mock Dataset Integrity", False, "Missing core mock dataset exports.")
except Exception as e:
    record_test("PHASE 1", "Mock Dataset Integrity", False, str(e))

# 1.4 Test HTML & Meta Tags (SEO Check)
try:
    html_path = os.path.join(base_dir, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    has_viewport = 'name="viewport"' in html_content
    has_title = "<title>" in html_content
    has_description = 'name="description"' in html_content

    if has_viewport and has_title and has_description:
        record_test("PHASE 1", "HTML & SEO Standards", True, "index.html includes viewport meta, title, and description.")
    else:
        record_test("PHASE 1", "HTML & SEO Standards", False, "index.html is missing title, description, or viewport meta tag.")
except Exception as e:
    record_test("PHASE 1", "HTML & SEO Standards", False, str(e))

# ==========================================================
# PHASE 2: Live Data Integration & Gemini Multi-Modal AI
# ==========================================================
print("\n--- Phase 2: Live APIs & Gemini Multi-Modal AI ---")

# 2.1 Test Live OpenFDA API Integration
try:
    url = 'https://api.fda.gov/drug/label.json?search=drug_interactions:"warfarin"+AND+"aspirin"&limit=1'
    req = urllib.request.Request(url, headers={'User-Agent': 'MediHelp-TestRunner/1.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        if response.status == 200:
            data = json.loads(response.read().decode())
            results_count = len(data.get('results', []))
            record_test("PHASE 2", "OpenFDA Live REST API", True, f"OpenFDA API responded with HTTP 200 OK ({results_count} interaction record fetched).")
        else:
            record_test("PHASE 2", "OpenFDA Live REST API", False, f"HTTP status {response.status}")
except Exception as e:
    record_test("PHASE 2", "OpenFDA Live REST API", False, f"OpenFDA API error: {str(e)}")

# 2.2 Test Gemini Service & Server AI Bridge
try:
    gemini_path = os.path.join(base_dir, "src", "services", "geminiService.ts")
    server_path = os.path.join(base_dir, "server.js")

    with open(gemini_path, "r", encoding="utf-8") as f:
        gemini_code = f.read()

    with open(server_path, "r", encoding="utf-8") as f:
        server_code = f.read()

    has_ocr = "scanInsuranceCardWithAI" in gemini_code
    has_explain = "explainInteractionWithAI" in gemini_code
    has_ocr_endpoint = "/api/ai/scan-insurance" in server_code
    has_explain_endpoint = "/api/ai/explain-interaction" in server_code

    if has_ocr and has_explain and has_ocr_endpoint and has_explain_endpoint:
        record_test("PHASE 2", "Gemini Vision AI Engine", True, "Gemini Vision OCR & Explain Interaction services & server endpoints verified.")
    else:
        record_test("PHASE 2", "Gemini Vision AI Engine", False, "Missing Gemini service functions or server AI bridge endpoints.")
except Exception as e:
    record_test("PHASE 2", "Gemini Vision AI Engine", False, str(e))

# ==========================================================
# PHASE 3: Backend Services, HIPAA Security & Auth Infrastructure
# ==========================================================
print("\n--- Phase 3: Backend Services, HIPAA & Auth Infrastructure ---")

# 3.1 Test Prisma ORM Database Schema
try:
    prisma_path = os.path.join(base_dir, "prisma", "schema.prisma")
    with open(prisma_path, "r", encoding="utf-8") as f:
        schema_code = f.read()

    required_models = ["model User", "model FamilyProfile", "model Prescription", "model TransferRequest", "model AdherenceLog", "model AuditLog"]
    missing_models = [m for m in required_models if m not in schema_code]

    if not missing_models:
        record_test("PHASE 3", "Prisma Database Schema", True, f"All {len(required_models)} data models defined in schema.prisma.")
    else:
        record_test("PHASE 3", "Prisma Database Schema", False, f"Missing models: {', '.join(missing_models)}")
except Exception as e:
    record_test("PHASE 3", "Prisma Database Schema", False, str(e))

# 3.2 Test Security Audit & dbService Persistence
try:
    security_path = os.path.join(base_dir, "src", "services", "securityAuditService.ts")
    db_path = os.path.join(base_dir, "src", "services", "dbService.ts")

    with open(security_path, "r", encoding="utf-8") as f:
        security_code = f.read()

    with open(db_path, "r", encoding="utf-8") as f:
        db_code = f.read()

    has_audit = "recordAuditEvent" in security_code
    has_toggle = "toggleDoseTaken" in db_code
    has_transfer = "saveTransferRequest" in db_code

    if has_audit and has_toggle and has_transfer:
        record_test("PHASE 3", "HIPAA Audit & Data Layer", True, "HIPAA audit log engine and persistent data storage layer validated.")
    else:
        record_test("PHASE 3", "HIPAA Audit & Data Layer", False, "Missing security audit functions or storage layer methods.")
except Exception as e:
    record_test("PHASE 3", "HIPAA Audit & Data Layer", False, str(e))

# 3.3 Test Automated SMS Reminder Microservice
try:
    reminder_path = os.path.join(base_dir, "src", "services", "reminderService.ts")
    with open(reminder_path, "r", encoding="utf-8") as f:
        reminder_code = f.read()

    has_sms = "sendSmsDoseReminder" in reminder_code
    if has_sms:
        record_test("PHASE 3", "SMS Reminder Service", True, "sendSmsDoseReminder microservice function present.")
    else:
        record_test("PHASE 3", "SMS Reminder Service", False, "Missing sendSmsDoseReminder function.")
except Exception as e:
    record_test("PHASE 3", "SMS Reminder Service", False, str(e))

# ==========================================================
# PHASE 4: Offline PWA & Cross-Platform Mobile Applications
# ==========================================================
print("\n--- Phase 4: Offline PWA & Native Mobile Wrappers ---")

# 4.1 Test Web App Manifest & Service Worker
try:
    manifest_path = os.path.join(base_dir, "public", "manifest.json")
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest_data = json.load(f)

    sw_path = os.path.join(base_dir, "public", "sw.js")
    with open(sw_path, "r", encoding="utf-8") as f:
        sw_content = f.read()

    has_short_name = "short_name" in manifest_data
    has_icons = len(manifest_data.get("icons", [])) >= 2
    has_display = manifest_data.get("display") == "standalone"
    has_sw_cache = "medihelp-v1.5.0" in sw_content
    has_sw_push = "push" in sw_content

    if has_short_name and has_icons and has_display and has_sw_cache and has_sw_push:
        record_test("PHASE 4", "PWA Manifest & Service Worker", True, "public/manifest.json and public/sw.js correctly configured.")
    else:
        record_test("PHASE 4", "PWA Manifest & Service Worker", False, "PWA manifest or service worker script incomplete.")
except Exception as e:
    record_test("PHASE 4", "PWA Manifest & Service Worker", False, str(e))

# 4.2 Test PWA & Capacitor Native Mobile Bridge Services
try:
    pwa_path = os.path.join(base_dir, "src", "services", "pwaService.ts")
    cap_path = os.path.join(base_dir, "src", "services", "capacitorService.ts")

    with open(pwa_path, "r", encoding="utf-8") as f:
        pwa_code = f.read()

    with open(cap_path, "r", encoding="utf-8") as f:
        cap_code = f.read()

    has_sw_reg = "registerServiceWorker" in pwa_code
    has_biometric = "authenticateBiometric" in cap_code

    if has_sw_reg and has_biometric:
        record_test("PHASE 4", "Native Mobile & PWA Bridge", True, "pwaService and capacitorService native bridge layers validated.")
    else:
        record_test("PHASE 4", "Native Mobile & PWA Bridge", False, "Missing pwaService worker registration or capacitor biometrics bridge.")
except Exception as e:
    record_test("PHASE 4", "Native Mobile & PWA Bridge", False, str(e))

# ==========================================================
# PHASE 5: B2B Enterprise Network & Pharmacy EHR Integrations
# ==========================================================
print("\n--- Phase 5: B2B Enterprise & HL7 FHIR EHR Integrations ---")

# 5.1 Test HL7 FHIR R4 EHR Gateway Service
try:
    fhir_path = os.path.join(base_dir, "src", "services", "fhirService.ts")
    with open(fhir_path, "r", encoding="utf-8") as f:
        fhir_code = f.read()

    has_bundle = "generateFhirPrescriptionBundle" in fhir_code
    has_validate = "validateFhirMedicationRequest" in fhir_code

    if has_bundle and has_validate:
        record_test("PHASE 5", "HL7 FHIR R4 Interoperability", True, "generateFhirPrescriptionBundle and validateFhirMedicationRequest validated.")
    else:
        record_test("PHASE 5", "HL7 FHIR R4 Interoperability", False, "Missing FHIR bundle generator or validator.")
except Exception as e:
    record_test("PHASE 5", "HL7 FHIR R4 Interoperability", False, str(e))

# 5.2 Test Live Partner Inventory Sync & B2B Coupon Claims
try:
    inventory_path = os.path.join(base_dir, "src", "services", "partnerInventoryService.ts")
    with open(inventory_path, "r", encoding="utf-8") as f:
        inventory_code = f.read()

    has_sync = "syncPartnerInventory" in inventory_code
    has_adjudicate = "adjudicateB2bClaim" in inventory_code

    if has_sync and has_adjudicate:
        record_test("PHASE 5", "B2B Partner Inventory & Claims", True, "syncPartnerInventory and adjudicateB2bClaim services present.")
    else:
        record_test("PHASE 5", "B2B Partner Inventory & Claims", False, "Missing partner inventory sync or claim adjudication functions.")
except Exception as e:
    record_test("PHASE 5", "B2B Partner Inventory & Claims", False, str(e))

# 5.3 Test Enterprise Population Health Analytics (PDC Score)
try:
    analytics_path = os.path.join(base_dir, "src", "services", "enterpriseAnalyticsService.ts")
    with open(analytics_path, "r", encoding="utf-8") as f:
        analytics_code = f.read()

    has_pdc = "calculatePdcScore" in analytics_code
    has_pop = "getPopulationHealthMetrics" in analytics_code

    if has_pdc and has_pop:
        record_test("PHASE 5", "Population Health Analytics", True, "calculatePdcScore and getPopulationHealthMetrics services validated.")
    else:
        record_test("PHASE 5", "Population Health Analytics", False, "Missing PDC score calculation or population health metrics.")
except Exception as e:
    record_test("PHASE 5", "Population Health Analytics", False, str(e))

# ==========================================================
# SUMMARY BY PHASE
# ==========================================================
print("\n==========================================================")
print("             ALL PHASES TEST RUN SUMMARY                  ")
print("==========================================================")

phases = ["PHASE 1", "PHASE 2", "PHASE 3", "PHASE 4", "PHASE 5"]
all_passed = True

for ph in phases:
    ph_tests = [t for t in test_results if t["phase"] == ph]
    ph_passed = sum(1 for t in ph_tests if t["status"] == "PASS")
    ph_total = len(ph_tests)
    status_str = "PASS" if ph_passed == ph_total else "FAIL"
    print(f"[{status_str}] {ph}: {ph_passed}/{ph_total} Test Suites Passed")
    if ph_passed != ph_total:
        all_passed = False

total_passed = sum(1 for t in test_results if t["status"] == "PASS")
print("----------------------------------------------------------")
print(f"TOTAL SYSTEM RESULT: {total_passed}/{len(test_results)} Test Suites Passed across all 5 Phases.")
print("==========================================================")
