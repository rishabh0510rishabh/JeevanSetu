export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_EMERGENCY';

export interface FirstAidGuidance {
  id: string;
  category: string;
  severity: SeverityLevel;
  isEmergency: boolean;
  summary: string;
  immediateCriticalAction: string;
  steps: string[];
  doNots: string[];
  warningSigns: string[];
  whenToSeekCare: string;
  disclaimer: string;
  timestamp: string;
  imageUrl?: string;
  userPrompt?: string;
}

export type HazardLevel = 'DANGER' | 'WARNING' | 'CAUTION' | 'NOTICE' | 'BIOHAZARD' | 'FLAMMABLE' | 'GENERAL_SAFETY';

export interface WarningTranslation {
  id: string;
  originalText: string;
  detectedSourceLanguage: string;
  targetLanguage: string;
  translatedText: string;
  hazardLevel: HazardLevel;
  urgencyTone: string;
  actionDirective: string;
  symbolsDetected: string[];
  notes: string;
  timestamp: string;
  imageUrl?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: 'Roommate' | 'RA / Dorm Staff' | 'Parent / Family' | 'Campus Security' | 'Friend' | 'Doctor / Clinic' | 'Other';
  isPrimary: boolean;
}

export interface LocationSnapshot {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: string;
  approximateAddress: string | null;
  campusLandmark: string | null;
  mapsUrl: string | null;
  error?: string | null;
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  situationSummary: string;
  severity: SeverityLevel;
  category: string;
  guidanceGiven: string[];
  location: LocationSnapshot | null;
  contactsSentTo: EmergencyContact[];
  deliveryStatus: 'sent' | 'demo_delivered' | 'failed';
  dispatchMethod: 'webhook' | 'email_relay' | 'sms_direct' | 'simulated';
  notes: string;
}

export interface FirstAidProtocolItem {
  id: string;
  title: string;
  category: string;
  severity: SeverityLevel;
  iconName: string;
  summary: string;
  immediateAction: string;
  steps: string[];
  doNots: string[];
  redFlags: string[];
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
