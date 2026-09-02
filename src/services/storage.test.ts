import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredContacts,
  saveStoredContacts,
  getPreferredLanguage,
  setPreferredLanguage,
  getCampusEmergencyNumber,
  setCampusEmergencyNumber,
  getStoredAlerts,
  saveStoredAlert,
  clearSessionData,
  DEFAULT_CONTACTS,
} from './storage';
import { EmergencyContact, EmergencyAlert } from '../types';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Emergency Contacts', () => {
    it('returns DEFAULT_CONTACTS when no contacts are stored', () => {
      const contacts = getStoredContacts();
      expect(contacts).toEqual(DEFAULT_CONTACTS);
      expect(contacts.length).toBeGreaterThan(0);
    });

    it('saves and retrieves custom emergency contacts', () => {
      const customContacts: EmergencyContact[] = [
        {
          id: 'test-1',
          name: 'Sarah Connor',
          phone: '555-0199',
          email: 'sarah@test.com',
          relationship: 'Roommate',
          isPrimary: true,
        },
      ];
      saveStoredContacts(customContacts);
      const retrieved = getStoredContacts();
      expect(retrieved).toEqual(customContacts);
    });
  });

  describe('Preferred Language', () => {
    it('defaults to Hindi (hi) when not set', () => {
      expect(getPreferredLanguage()).toBe('hi');
    });

    it('updates and persists preferred language', () => {
      setPreferredLanguage('es');
      expect(getPreferredLanguage()).toBe('es');
    });
  });

  describe('Campus Emergency Number', () => {
    it('defaults to 911 when not set', () => {
      expect(getCampusEmergencyNumber()).toBe('911');
    });

    it('updates and persists campus emergency number', () => {
      setCampusEmergencyNumber('555-0911');
      expect(getCampusEmergencyNumber()).toBe('555-0911');
    });
  });

  describe('Alert History & Session Clearing', () => {
    it('saves and retrieves emergency alert records', () => {
      const alertItem: EmergencyAlert = {
        id: 'alert-123',
        timestamp: new Date().toISOString(),
        situationSummary: 'Scald burn test',
        severity: 'MEDIUM',
        category: 'Burns',
        guidanceGiven: ['Cool under water for 15 mins'],
        location: null,
        contactsSentTo: [],
        deliveryStatus: 'demo_delivered',
        dispatchMethod: 'simulated',
        notes: 'Simulated alert',
      };

      saveStoredAlert(alertItem);
      const alerts = getStoredAlerts();
      expect(alerts.length).toBe(1);
      expect(alerts[0].id).toBe('alert-123');
    });

    it('clears ephemeral session data and resets state', () => {
      saveStoredAlert({
        id: 'alert-999',
        timestamp: new Date().toISOString(),
        situationSummary: 'Test',
        severity: 'LOW',
        category: 'General',
        guidanceGiven: [],
        location: null,
        contactsSentTo: [],
        deliveryStatus: 'demo_delivered',
        dispatchMethod: 'simulated',
        notes: 'Test',
      });

      clearSessionData();
      expect(getStoredAlerts()).toEqual([]);
    });
  });
});
