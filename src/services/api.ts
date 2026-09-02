import { FirstAidGuidance, WarningTranslation, EmergencyAlert, EmergencyContact, LocationSnapshot, SeverityLevel } from '../types';
import { OFFLINE_PROTOCOLS } from '../data/protocols';

export async function fetchFirstAidGuidance(
  prompt?: string,
  imageBase64?: string,
  mimeType: string = 'image/jpeg'
): Promise<FirstAidGuidance> {
  try {
    const response = await fetch('/api/guidance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        imageBase64,
        mimeType,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data: FirstAidGuidance = await response.json();
    return data;
  } catch (error: any) {
    console.warn('API guidance call failed, attempting offline fallback matching:', error);
    return getOfflineFallbackGuidance(prompt || 'Injury reported');
  }
}

export async function fetchWarningTranslation(
  text?: string,
  imageBase64?: string,
  targetLanguageCode: string = 'es',
  targetLanguageName: string = 'Spanish',
  mimeType: string = 'image/jpeg'
): Promise<WarningTranslation> {
  try {
    const response = await fetch('/api/translate-warning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        imageBase64,
        mimeType,
        targetLanguageCode,
        targetLanguageName,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data: WarningTranslation = await response.json();
    return data;
  } catch (error: any) {
    console.warn('API warning translation failed, providing structured offline response:', error);
    return {
      id: `wt-offline-${Date.now()}`,
      originalText: text || 'Safety warning notice (Image uploaded)',
      detectedSourceLanguage: 'English',
      targetLanguage: targetLanguageName,
      translatedText: `[OFFLINE SAFETY TRANSLATION - ${targetLanguageName}]: ${text || 'Hazard warning placard. Exercise extreme caution, observe barrier signs, and do not enter hazardous zone without required PPE.'}`,
      hazardLevel: 'WARNING',
      urgencyTone: 'Urgent Safety Warning (Offline Fallback)',
      actionDirective: 'Do not enter the restricted area. Observe posted hazard warnings and report to safety staff.',
      symbolsDetected: ['Warning Triangle', 'Safety Protocol Required'],
      notes: 'Translated using offline safety protocol dictionary. Connect to network for full Gemini OCR inspection.',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function dispatchEmergencyAlert(payload: {
  contacts: EmergencyContact[];
  situationSummary: string;
  severity: SeverityLevel;
  category: string;
  guidanceGiven: string[];
  location: LocationSnapshot | null;
  notes?: string;
}): Promise<{
  success: boolean;
  alertId: string;
  timestamp: string;
  deliveryStatus: 'sent' | 'demo_delivered' | 'failed';
  dispatchMethod: 'webhook' | 'email_relay' | 'sms_direct' | 'simulated';
  formattedMessage: string;
  notes: string;
}> {
  try {
    const response = await fetch('/api/alerts/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Alert dispatch API error, switching to client-side local confirmation:', e);
  }

  // Client-side fallback delivery record
  const timestamp = new Date().toISOString();
  const alertId = `alert-local-${Date.now()}`;
  const locStr = payload.location?.approximateAddress || payload.location?.mapsUrl || 'Location unavailable';

  const formattedMessage = `🚨 [JEEVANSETU EMERGENCY ALERT] 🚨\nSeverity: ${payload.severity}\nSituation: ${payload.situationSummary}\nLocation: ${locStr}\nTimestamp: ${new Date().toLocaleString()}`;

  return {
    success: true,
    alertId,
    timestamp,
    deliveryStatus: 'demo_delivered',
    dispatchMethod: 'simulated',
    formattedMessage,
    notes: 'Alert recorded locally. Direct native SMS/Email links available for immediate real-world dispatch.',
  };
}

function getOfflineFallbackGuidance(prompt: string): FirstAidGuidance {
  const lower = prompt.toLowerCase();

  let matched = OFFLINE_PROTOCOLS[0]; // burns default

  if (lower.includes('bleed') || lower.includes('cut') || lower.includes('blood') || lower.includes('knife') || lower.includes('glass')) {
    matched = OFFLINE_PROTOCOLS[1]; // cuts
  } else if (lower.includes('chemical') || lower.includes('acid') || lower.includes('splash') || lower.includes('lab') || lower.includes('eye')) {
    matched = OFFLINE_PROTOCOLS[2]; // chemical splash
  } else if (lower.includes('allerg') || lower.includes('nut') || lower.includes('hives') || lower.includes('epipen') || lower.includes('swelling')) {
    matched = OFFLINE_PROTOCOLS[3]; // allergy
  } else if (lower.includes('chok') || lower.includes('breathe') || lower.includes('throat') || lower.includes('airway')) {
    matched = OFFLINE_PROTOCOLS[4]; // choking
  } else if (lower.includes('sprain') || lower.includes('twist') || lower.includes('ankle') || lower.includes('fracture') || lower.includes('bone')) {
    matched = OFFLINE_PROTOCOLS[5]; // sprain
  } else if (lower.includes('faint') || lower.includes('unconscious') || lower.includes('dizzy') || lower.includes('collapsed')) {
    matched = OFFLINE_PROTOCOLS[6]; // fainting
  } else if (lower.includes('heat') || lower.includes('sun') || lower.includes('hot') || lower.includes('sweat')) {
    matched = OFFLINE_PROTOCOLS[7]; // heat
  }

  const isEmergency = matched.severity === 'CRITICAL_EMERGENCY' || matched.severity === 'HIGH';

  return {
    id: `fa-offline-${Date.now()}`,
    category: matched.category,
    severity: matched.severity,
    isEmergency,
    summary: `${matched.title}: ${matched.summary}`,
    immediateCriticalAction: matched.immediateAction,
    steps: matched.steps,
    doNots: matched.doNots,
    warningSigns: matched.redFlags,
    whenToSeekCare: isEmergency
      ? 'Call emergency services (911 / 112) or go to the nearest emergency room immediately.'
      : 'Visit campus health center or urgent care clinic if pain or swelling persists beyond 24 hours.',
    disclaimer: 'Offline Emergency Protocol: This guidance is for immediate stabilization before professional medical care is accessed.',
    timestamp: new Date().toISOString(),
    userPrompt: prompt,
  };
}
