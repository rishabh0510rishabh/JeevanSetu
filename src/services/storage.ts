import { EmergencyContact, EmergencyAlert, FirstAidGuidance, WarningTranslation } from '../types';

const STORAGE_KEYS = {
  CONTACTS: 'jeevansetu_contacts',
  SETTINGS: 'jeevansetu_settings',
  ALERTS: 'jeevansetu_alerts',
  TARGET_LANG: 'jeevansetu_target_lang',
  CAMPUS_NUMBER: 'jeevansetu_campus_number',
};

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-1',
    name: 'Alex Rivera (Roommate)',
    phone: '+1 (555) 234-5678',
    email: 'roommate.alex@campus.edu',
    relationship: 'Roommate',
    isPrimary: true,
  },
  {
    id: 'contact-2',
    name: 'Sarah Chen (Resident Advisor)',
    phone: '+1 (555) 876-5432',
    email: 'ra.sarah@campus.edu',
    relationship: 'RA / Dorm Staff',
    isPrimary: false,
  },
  {
    id: 'contact-3',
    name: 'Campus Safety & Escort Service',
    phone: '+1 (555) 911-0000',
    email: 'campus.security@university.edu',
    relationship: 'Campus Security',
    isPrimary: false,
  },
];

export function getStoredContacts(): EmergencyContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
      return DEFAULT_CONTACTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONTACTS;
  }
}

export function saveStoredContacts(contacts: EmergencyContact[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch (err) {
    console.error('Failed to save contacts:', err);
  }
}

export function getStoredAlerts(): EmergencyAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredAlert(alert: EmergencyAlert): void {
  try {
    const existing = getStoredAlerts();
    const updated = [alert, ...existing].slice(0, 20); // keep recent 20 in session
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save alert:', err);
  }
}

export function clearSessionData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    sessionStorage.clear();
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

export function getPreferredLanguage(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.TARGET_LANG) || 'hi';
  } catch {
    return 'hi';
  }
}

export function setPreferredLanguage(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TARGET_LANG, code);
  } catch (err) {
    console.error('Failed to save language:', err);
  }
}

export function getCampusEmergencyNumber(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CAMPUS_NUMBER) || '911';
  } catch {
    return '911';
  }
}

export function setCampusEmergencyNumber(number: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CAMPUS_NUMBER, number);
  } catch (err) {
    console.error('Failed to save campus number:', err);
  }
}
