import React, { useState } from 'react';
import {
  Globe,
  Camera,
  Upload,
  Sparkles,
  Volume2,
  Square,
  AlertOctagon,
  Flame,
  Zap,
  Biohazard,
  ShieldAlert,
  ArrowRight,
  Trash2,
  Languages,
  CheckCircle2,
  Info,
  Bell,
} from 'lucide-react';
import { WarningTranslation, SupportedLanguage, SeverityLevel } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/protocols';
import { WARNING_SIGN_PRESETS, WarningSignPreset } from '../data/presets';
import { fetchWarningTranslation } from '../services/api';
import { speechService } from '../services/speech';
import { CameraCaptureModal } from './CameraCaptureModal';

interface WarningTranslateViewProps {
  onOpenAlertModal: (context: {
    summary: string;
    severity: SeverityLevel;
    category: string;
    guidance: string[];
  }) => void;
  preferredLang: string;
  onLanguageChange: (code: string) => void;
}

export const WarningTranslateView: React.FC<WarningTranslateViewProps> = ({
  onOpenAlertModal,
  preferredLang,
  onLanguageChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [targetLangCode, setTargetLangCode] = useState(preferredLang || 'hi');
  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState<WarningTranslation | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLangCode) || SUPPORTED_LANGUAGES[0];

  const handleLanguageSelect = (code: string) => {
    setTargetLangCode(code);
    onLanguageChange(code);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: WarningSignPreset) => {
    setInputText(preset.originalText);
    if (preset.targetLangSuggestion) {
      handleLanguageSelect(preset.targetLangSuggestion);
    }
    handleSubmitWithData(preset.originalText, null, preset.targetLangSuggestion || targetLangCode);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage) {
      setErrorMsg('Please enter warning sign text or upload a photo of the sign.');
      return;
    }
    handleSubmitWithData(inputText, selectedImage, targetLangCode);
  };

  const handleSubmitWithData = async (text: string, image: string | null, langCode: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    speechService.stop();
    setIsPlayingAudio(false);

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || currentLang;

    try {
      const result = await fetchWarningTranslation(
        text,
        image || undefined,
        langObj.code,
        langObj.name
      );
      setTranslation(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to translate warning sign.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else if (translation) {
      const speechText = `${translation.translatedText}. ${translation.actionDirective}`;
      const started = speechService.speak(
        speechText,
        targetLangCode,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
      if (started) setIsPlayingAudio(true);
    }
  };

  const handleClear = () => {
    speechService.stop();
    setIsPlayingAudio(false);
    setInputText('');
    setSelectedImage(null);
    setTranslation(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 border border-sky-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                Multilingual Safety Warning &amp; Sign Translator
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Photograph campus hazard signs, chemical labels, or evacuation notices to instantly translate them with preserved urgency into your native language.
            </p>
          </div>

          {/* Target Language Selector */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-xl p-1.5 shadow-inner shrink-0">
            <Languages className="w-4 h-4 text-sky-400 ml-1.5" />
            <select
              value={targetLangCode}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none pr-2 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Warning Signs */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Sample Campus Warning Signs:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {WARNING_SIGN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700/80 hover:border-sky-500/50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
              >
                <span>{preset.simulatedVisual.split(' ')[0]}</span>
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div>
          <label htmlFor="warning-sign-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Enter warning sign text or upload photo:
          </label>
          <textarea
            id="warning-sign-input"
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 'DANGER: FLAMMABLE CHEMICALS & BIOHAZARD. EYE PROTECTION REQUIRED' or 'EMERGENCY EVACUATION STAIRWELL NOTICE'..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition resize-none"
          />
        </div>

        {/* Media / Camera Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition"
            >
              <Camera className="w-4 h-4 text-sky-400" />
              <span>Photograph Sign</span>
            </button>

            <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {selectedImage && (
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(inputText || selectedImage || translation) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl transition"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-lg shadow-sky-900/40 active:scale-95 transition"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Translating Sign...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Translate to {currentLang.name}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {selectedImage && (
          <div className="relative inline-block mt-2 border-2 border-sky-500/40 rounded-xl overflow-hidden bg-black max-w-xs shadow-md">
            <img src={selectedImage} alt="Warning Sign Preview" className="max-h-40 w-auto object-cover" />
            <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
              Ready for OCR
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/50 rounded-xl p-3 text-xs text-red-200">
            {errorMsg}
          </div>
        )}
      </form>

      {/* Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setSelectedImage(img)}
        title="Photograph Safety Sign / Hazard Label"
      />

      {/* Translation Result Card */}
      {translation && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Action Directive Highlight Banner */}
          <div className="bg-slate-900 border-2 border-sky-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
            {/* Top Badge & Urgency Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${
                    translation.hazardLevel === 'DANGER' || translation.hazardLevel === 'BIOHAZARD'
                      ? 'bg-red-600 text-white animate-pulse'
                      : translation.hazardLevel === 'WARNING' || translation.hazardLevel === 'FLAMMABLE'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  {translation.hazardLevel}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {translation.urgencyTone}
                </span>
              </div>

              {/* Audio Listen */}
              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  isPlayingAudio
                    ? 'bg-sky-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title="Listen to translated warning"
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Listen ({currentLang.name})</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Safety Action Directive */}
            <div className="bg-sky-950/40 border border-sky-500/40 rounded-xl p-3.5">
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block mb-1">
                Immediate Required Action ({currentLang.nativeName}):
              </span>
              <p className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
                {translation.actionDirective}
              </p>
            </div>

            {/* Side-by-Side Comparison: Original vs Translated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Text */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>Original Sign Text</span>
                  <span className="text-slate-500">{translation.detectedSourceLanguage}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {translation.originalText}
                </p>
              </div>

              {/* Translated Text */}
              <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-sky-400 font-bold uppercase tracking-wider">
                  <span>Translated Output</span>
                  <span className="text-sky-300">{currentLang.flag} {translation.targetLanguage}</span>
                </div>
                <p className="text-xs sm:text-sm text-sky-100 font-semibold whitespace-pre-wrap leading-relaxed">
                  {translation.translatedText}
                </p>
              </div>
            </div>

            {/* Detected Symbols / Pictograms */}
            {translation.symbolsDetected && translation.symbolsDetected.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Recognized Safety Symbols &amp; Hazards:
                </span>
                <div className="flex flex-wrap gap-2">
                  {translation.symbolsDetected.map((sym, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{sym}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Safety Notes */}
            {translation.notes && (
              <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{translation.notes}</span>
              </div>
            )}

            {/* Alert Option */}
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() =>
                  onOpenAlertModal({
                    summary: `Encountered Safety Warning: ${translation.hazardLevel} - ${translation.actionDirective}`,
                    severity: translation.hazardLevel === 'DANGER' ? 'HIGH' : 'MEDIUM',
                    category: 'Hazard Sign Translation',
                    guidance: [translation.actionDirective, translation.translatedText],
                  })
                }
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition shadow"
              >
                <Bell className="w-4 h-4" />
                <span>Alert Emergency Contact About This Hazard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
