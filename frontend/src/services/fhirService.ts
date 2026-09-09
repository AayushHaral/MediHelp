/**
 * MediHelp HL7 FHIR R4 Interoperability Service
 * Implements 21st Century Cures Act compliant FHIR R4 resources for EHR integration
 * (Epic Systems, Cerner/Oracle Health, Surescripts, AthenaHealth).
 */

export interface FhirCoding {
  system: string;
  code: string;
  display: string;
}

export interface FhirCodeableConcept {
  coding: FhirCoding[];
  text: string;
}

export interface FhirIdentifier {
  system: string;
  value: string;
  use?: 'official' | 'temp' | 'secondary';
}

export interface FhirReference {
  reference: string;
  display?: string;
}

export interface FhirPatient {
  resourceType: 'Patient';
  id: string;
  identifier: FhirIdentifier[];
  active: boolean;
  name: Array<{
    use: 'official';
    family: string;
    given: string[];
  }>;
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
}

export interface FhirMedicationRequest {
  resourceType: 'MedicationRequest';
  id: string;
  identifier: FhirIdentifier[];
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';
  intent: 'order' | 'plan' | 'proposal';
  medicationCodeableConcept: FhirCodeableConcept;
  subject: FhirReference;
  authoredOn: string;
  dispenseRequest?: {
    numberOfRepeatsAllowed?: number;
    quantity?: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    expectedSupplyDuration?: {
      value: number;
      unit: 'days';
      system: string;
      code: 'd';
    };
  };
}

export interface FhirMedicationDispense {
  resourceType: 'MedicationDispense';
  id: string;
  identifier: FhirIdentifier[];
  status: 'completed' | 'in-progress' | 'on-hold';
  medicationCodeableConcept: FhirCodeableConcept;
  subject: FhirReference;
  whenHandedOver: string;
  quantity: {
    value: number;
    unit: string;
  };
}

export interface FhirBundleEntry {
  fullUrl: string;
  resource: FhirPatient | FhirMedicationRequest | FhirMedicationDispense;
}

export interface FhirBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'transaction' | 'collection' | 'document';
  timestamp: string;
  entry: FhirBundleEntry[];
}

/**
 * Validates whether a FHIR MedicationRequest resource satisfies mandatory FHIR R4 schema rules.
 */
export function validateFhirMedicationRequest(resource: FhirMedicationRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (resource.resourceType !== 'MedicationRequest') {
    errors.push('resourceType must be "MedicationRequest"');
  }
  if (!resource.id) {
    errors.push('Missing required element "id"');
  }
  if (!resource.status || !['active', 'completed', 'cancelled', 'on-hold'].includes(resource.status)) {
    errors.push('Invalid or missing element "status"');
  }
  if (!resource.intent || !['order', 'plan', 'proposal'].includes(resource.intent)) {
    errors.push('Invalid or missing element "intent"');
  }
  if (!resource.medicationCodeableConcept || !resource.medicationCodeableConcept.coding || resource.medicationCodeableConcept.coding.length === 0) {
    errors.push('Missing required element "medicationCodeableConcept.coding"');
  }
  if (!resource.subject || !resource.subject.reference) {
    errors.push('Missing required element "subject.reference"');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates an HL7 FHIR R4 Transaction Bundle for direct e-Prescribing transfer into EHR portals.
 */
export function generateFhirPrescriptionBundle(
  patientId: string,
  patientName: string,
  drugName: string,
  rxNormCode: string,
  quantity: number = 30,
  daysSupply: number = 30,
  targetPharmacyName: string = 'CVS Pharmacy #4928'
): FhirBundle {
  const timestamp = new Date().toISOString();
  const bundleId = `bundle-fhir-${Date.now()}`;
  const fhirPatientId = `pat-${patientId.replace(/[^a-zA-Z0-9-]/g, '')}`;
  const fhirMedReqId = `medreq-${Date.now()}`;

  const nameParts = patientName.trim().split(' ');
  const familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  const givenNames = nameParts.length > 1 ? nameParts.slice(0, -1) : [nameParts[0]];

  const patientResource: FhirPatient = {
    resourceType: 'Patient',
    id: fhirPatientId,
    identifier: [
      {
        system: 'urn:oid:2.16.840.1.113883.4.1',
        value: `MRN-${patientId}`,
        use: 'official'
      }
    ],
    active: true,
    name: [
      {
        use: 'official',
        family: familyName,
        given: givenNames
      }
    ],
    gender: 'male'
  };

  const medicationRequestResource: FhirMedicationRequest = {
    resourceType: 'MedicationRequest',
    id: fhirMedReqId,
    identifier: [
      {
        system: 'http://surescripts.com/e-prescribing/rxid',
        value: `RX-${Date.now()}`,
        use: 'official'
      }
    ],
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          code: rxNormCode || '310965',
          display: drugName
        }
      ],
      text: drugName
    },
    subject: {
      reference: `Patient/${fhirPatientId}`,
      display: patientName
    },
    authoredOn: timestamp,
    dispenseRequest: {
      numberOfRepeatsAllowed: 3,
      quantity: {
        value: quantity,
        unit: 'TAB',
        system: 'http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm',
        code: 'TAB'
      },
      expectedSupplyDuration: {
        value: daysSupply,
        unit: 'days',
        system: 'http://unitsofmeasure.org',
        code: 'd'
      }
    }
  };

  return {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'transaction',
    timestamp,
    entry: [
      {
        fullUrl: `urn:uuid:${fhirPatientId}`,
        resource: patientResource
      },
      {
        fullUrl: `urn:uuid:${fhirMedReqId}`,
        resource: medicationRequestResource
      }
    ]
  };
}
