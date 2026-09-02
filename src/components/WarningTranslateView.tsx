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
      {/* Top Clay Banner */}
      <div className="clay-card-blue p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30">
                <Globe className="w-5 h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Multilingual Safety Warning &amp; Sign Translator
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium leading-relaxed">
              Photograph campus hazard signs, chemical labels, or evacuation notices to instantly translate them with preserved urgency into your native language.
            </p>
          </div>

          {/* Target Language Selector */}
          <div className="clay-inset p-1.5 flex items-center gap-2 shrink-0">
            <Languages className="w-4 h-4 text-sky-600 ml-1.5" />
            <select
              value={targetLangCode}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-black text-slate-900 focus:outline-none pr-2 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-slate-900">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Warning Signs */}
        <div className="mt-4 pt-3.5 border-t border-sky-200/80">
          <span className="text-[11px] font-extrabold text-sky-950 uppercase tracking-wider block mb-2">
            Sample Campus Warning Signs:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {WARNING_SIGN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="clay-btn bg-white hover:bg-sky-50 text-slate-800 border border-sky-200 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>{preset.simulatedVisual.split(' ')[0]}</span>
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="clay-card p-4 sm:p-6 space-y-4">
        <div>
          <label htmlFor="warning-sign-input" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
            Enter warning sign text or upload photo:
          </label>
          <div className="clay-inset p-1">
            <textarea
              id="warning-sign-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'DANGER: FLAMMABLE CHEMICALS & BIOHAZARD. EYE PROTECTION REQUIRED' or 'EMERGENCY EVACUATION STAIRWELL NOTICE'..."
              className="w-full bg-transparent p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none font-medium"
            />
          </div>
        </div>

        {/* Media / Camera Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="clay-btn bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-sky-600" />
              <span>Photograph Sign</span>
            </button>

            <label className="clay-btn bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-600" />
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
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 p-1.5 cursor-pointer ml-1"
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
                className="clay-btn bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 px-3.5 py-2 text-xs font-bold border border-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="clay-btn-blue flex items-center gap-2 px-5 py-2.5 text-sm font-black cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Translating Sign...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Translate to {currentLang.name}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {selectedImage && (
          <div className="clay-card p-2 inline-block mt-2 max-w-xs">
            <div className="relative rounded-xl overflow-hidden border border-sky-200">
              <img src={selectedImage} alt="Warning Sign Preview" className="max-h-40 w-auto object-cover" />
              <div className="absolute top-1 right-1 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Ready for OCR
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="clay-card-red p-3 text-xs text-red-900 font-medium flex items-center gap-2 border border-red-300">
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
          <div className="clay-card p-4 sm:p-6 space-y-4">
            {/* Top Badge & Urgency Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black px-3 py-1 rounded-xl uppercase tracking-wider ${
                    translation.hazardLevel === 'DANGER' || translation.hazardLevel === 'BIOHAZARD'
                      ? 'clay-btn-red text-white'
                      : translation.hazardLevel === 'WARNING' || translation.hazardLevel === 'FLAMMABLE'
                      ? 'clay-btn-amber text-slate-900'
                      : 'clay-btn-blue text-white'
                  }`}
                >
                  {translation.hazardLevel}
                </span>
                <span className="text-xs text-slate-600 font-bold">
                  {translation.urgencyTone}
                </span>
              </div>

              {/* Audio Listen */}
              <button
                onClick={handleToggleAudio}
                className={`clay-btn px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  isPlayingAudio
                    ? 'clay-btn-blue text-white animate-pulse'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
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
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Listen ({currentLang.name})</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Safety Action Directive */}
            <div className="clay-card-blue p-4">
              <span className="text-[11px] font-black text-sky-950 uppercase tracking-wider block mb-1">
                Immediate Required Action ({currentLang.nativeName}):
              </span>
              <p className="text-sm sm:text-base font-black text-slate-900 leading-relaxed">
                {translation.actionDirective}
              </p>
            </div>

            {/* Side-by-Side Comparison: Original vs Translated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Text */}
              <div className="clay-inset p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-black uppercase tracking-wider">
                  <span>Original Sign Text</span>
                  <span className="text-slate-400 font-bold">{translation.detectedSourceLanguage}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {translation.originalText}
                </p>
              </div>

              {/* Translated Text */}
              <div className="clay-inset-white p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-sky-700 font-black uppercase tracking-wider">
                  <span>Translated Output</span>
                  <span className="text-sky-800 font-bold">{currentLang.flag} {translation.targetLanguage}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 font-bold whitespace-pre-wrap leading-relaxed">
                  {translation.translatedText}
                </p>
              </div>
            </div>

            {/* Detected Symbols / Pictograms */}
            {translation.symbolsDetected && translation.symbolsDetected.length > 0 && (
              <div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                  Recognized Safety Symbols &amp; Hazards:
                </span>
                <div className="flex flex-wrap gap-2">
                  {translation.symbolsDetected.map((sym, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 clay-surface bg-white text-slate-800 text-xs px-3 py-1 rounded-xl font-bold border border-slate-200"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                      <span>{sym}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Safety Notes */}
            {translation.notes && (
              <div className="clay-card-blue p-3.5 flex items-start gap-2 text-xs text-slate-700 border border-sky-200">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span className="font-medium">{translation.notes}</span>
              </div>
            )}

            {/* Alert Option */}
            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() =>
                  onOpenAlertModal({
                    summary: `Encountered Safety Warning: ${translation.hazardLevel} - ${translation.actionDirective}`,
                    severity: translation.hazardLevel === 'DANGER' ? 'HIGH' : 'MEDIUM',
                    category: 'Hazard Sign Translation',
                    guidance: [translation.actionDirective, translation.translatedText],
                  })
                }
                className="clay-btn-amber text-xs sm:text-sm px-4 py-2.5 flex items-center gap-2 cursor-pointer"
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
