import { describe, it, expect } from 'vitest';
import { FIRST_AID_PRESETS, WARNING_SIGN_PRESETS } from './presets';

describe('First-Aid Presets', () => {
  it('contains simulation presets for rapid triage testing', () => {
    expect(FIRST_AID_PRESETS.length).toBeGreaterThan(0);
  });

  it('ensures each preset has valid severity and textPrompt', () => {
    FIRST_AID_PRESETS.forEach((preset) => {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(preset.textPrompt.length).toBeGreaterThan(15);
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL_EMERGENCY']).toContain(preset.severity);
      expect(preset.tag).toBeTruthy();
    });
  });
});

describe('Warning Sign Presets', () => {
  it('contains sample hazard signs for translation testing', () => {
    expect(WARNING_SIGN_PRESETS.length).toBeGreaterThan(0);
  });

  it('ensures each sign preset has hazard type, text, and target suggestion', () => {
    WARNING_SIGN_PRESETS.forEach((sign) => {
      expect(sign.id).toBeTruthy();
      expect(sign.title).toBeTruthy();
      expect(sign.originalText.length).toBeGreaterThan(10);
      expect(['DANGER', 'WARNING', 'CAUTION']).toContain(sign.hazardType);
      expect(sign.targetLangSuggestion).toBeTruthy();
    });
  });
});
