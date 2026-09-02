import { describe, it, expect } from 'vitest';
import { OFFLINE_PROTOCOLS, SUPPORTED_LANGUAGES } from './protocols';

describe('Offline Protocols Data', () => {
  it('contains standardized offline first-aid protocols', () => {
    expect(OFFLINE_PROTOCOLS.length).toBeGreaterThan(0);
  });

  it('ensures each protocol has all required safety fields populated', () => {
    OFFLINE_PROTOCOLS.forEach((protocol) => {
      expect(protocol.id).toBeTruthy();
      expect(protocol.title).toBeTruthy();
      expect(protocol.category).toBeTruthy();
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL_EMERGENCY']).toContain(protocol.severity);
      expect(protocol.summary).toBeTruthy();
      expect(protocol.immediateAction).toBeTruthy();
      expect(protocol.steps.length).toBeGreaterThan(0);
      expect(protocol.doNots.length).toBeGreaterThan(0);
      expect(protocol.redFlags.length).toBeGreaterThan(0);
    });
  });

  it('contains essential campus emergency categories', () => {
    const categories = OFFLINE_PROTOCOLS.map((p) => p.category);
    expect(categories).toContain('Burns');
    expect(categories).toContain('Laceration / Trauma');
    expect(categories).toContain('Chemical Exposure');
    expect(categories).toContain('Allergic Reaction');
    expect(categories).toContain('Airway Obstruction');
    expect(categories).toContain('Orthopedic Injury');
    expect(categories).toContain('Neurological / Cardiovascular');
    expect(categories).toContain('Environmental Hazard');
  });
});

describe('Supported Languages Data', () => {
  it('includes key languages with native names and flags', () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(10);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('hi'); // Hindi
    expect(codes).toContain('zh'); // Mandarin
    expect(codes).toContain('es'); // Spanish
    expect(codes).toContain('fr'); // French
    expect(codes).toContain('ar'); // Arabic
  });

  it('validates each language definition has valid code, name, nativeName, and flag', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
      expect(lang.nativeName).toBeTruthy();
      expect(lang.flag).toBeTruthy();
    });
  });
});
