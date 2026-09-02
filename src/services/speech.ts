class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public speak(
    text: string,
    langCode: string = 'en-US',
    onEnd?: () => void,
    onError?: () => void
  ): boolean {
    if (!this.synth) return false;

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity in emergencies
      utterance.pitch = 1.0;
      utterance.lang = langCode;

      // Try to find matching voice
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.startsWith(langCode.substring(0, 2)) || v.lang === langCode
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event);
        this.isSpeakingState = false;
        this.currentUtterance = null;
        if (onError) onError();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.error('Speech synthesis failure:', e);
      return false;
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }
}

export const speechService = new SpeechService();
