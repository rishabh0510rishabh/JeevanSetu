import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchFirstAidGuidance,
  fetchWarningTranslation,
  dispatchEmergencyAlert,
} from './api';

describe('API Services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchFirstAidGuidance', () => {
    it('sends prompt and returns structured first aid guidance', async () => {
      const mockResponse = {
        id: 'guidance-1',
        category: 'Burns',
        severity: 'MEDIUM',
        isEmergency: false,
        summary: 'Scald burn on arm',
        immediateCriticalAction: 'Cool under water',
        steps: ['Cool for 15 mins', 'Cover with sterile dressing'],
        doNots: ['Do not apply ice'],
        warningSigns: ['Severe blistering'],
        whenToSeekCare: 'If pain persists',
        disclaimer: 'First-aid guidance only',
        timestamp: new Date().toISOString(),
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchFirstAidGuidance('Burned my arm on boiling water');
      expect(result.category).toBe('Burns');
      expect(result.steps.length).toBe(2);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/guidance',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('falls back to offline protocol guidance when API call fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network disconnected'));

      const result = await fetchFirstAidGuidance('burn');
      expect(result).toBeTruthy();
      expect(result.category).toBe('Burns');
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.id).toContain('offline');
    });
  });

  describe('fetchWarningTranslation', () => {
    it('sends sign text and target language, returning translation', async () => {
      const mockTranslation = {
        id: 'trans-1',
        originalText: 'DANGER: HIGH VOLTAGE',
        detectedSourceLanguage: 'en',
        targetLanguage: 'hi',
        translatedText: 'खतरा: उच्च वोल्टेज',
        hazardLevel: 'DANGER',
        urgencyTone: 'CRITICAL',
        actionDirective: 'DO NOT ENTER',
        symbolsDetected: ['⚡'],
        notes: 'High voltage electrical warning',
        timestamp: new Date().toISOString(),
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTranslation,
      });

      const result = await fetchWarningTranslation('DANGER: HIGH VOLTAGE', undefined, 'hi', 'Hindi');
      expect(result.translatedText).toBe('खतरा: उच्च वोल्टेज');
      expect(result.hazardLevel).toBe('DANGER');
    });

    it('falls back to structured offline translation when network fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      const result = await fetchWarningTranslation('DANGER: ACID', undefined, 'es', 'Spanish');
      expect(result).toBeTruthy();
      expect(result.targetLanguage).toBe('Spanish');
      expect(result.id).toContain('offline');
    });
  });

  describe('dispatchEmergencyAlert', () => {
    it('dispatches structured alert payload to backend endpoint', async () => {
      const mockResult = {
        success: true,
        alertId: 'alert-777',
        timestamp: new Date().toISOString(),
        isDemoMode: true,
        deliveryStatus: 'demo_delivered',
        dispatchMethod: 'simulated',
        recipientCount: 1,
        formattedMessage: 'EMERGENCY ALERT: Scald burn',
        notes: 'Demo mode delivery simulated',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });

      const result = await dispatchEmergencyAlert({
        contacts: [
          {
            id: 'c1',
            name: 'Alex',
            phone: '555-0100',
            email: 'alex@dorm.edu',
            relationship: 'Roommate',
            isPrimary: true,
          },
        ],
        situationSummary: 'Scald burn in kitchen',
        severity: 'MEDIUM',
        category: 'Burns',
        guidanceGiven: ['Cool under water'],
        location: null,
      });

      expect(result.success).toBe(true);
      expect(result.alertId).toBe('alert-777');
    });
  });
});
