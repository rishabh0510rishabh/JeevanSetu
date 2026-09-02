import React, { useState } from 'react';
import {
  Globe,
  Camera,
  Upload,
  Sparkles,
  Volume2,
  AlertOctagon,
  Languages,
  CheckCircle2,
  Bell,
  AlertTriangle,
  Trash2,
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Hero */}
      <div className="glass-card-blue rounded-3xl p-5 sm:p-7 border border-sky-200 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center shadow-xs">
                <Globe className="w-5 h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Multilingual Safety Warning &amp; Sign Translator
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Photograph campus hazard signs, chemical labels, or evacuation notices to instantly translate them with preserved urgency into your native language.
            </p>
          </div>

          {/* Language Selector Dropdown */}
          <div className="glass-inset rounded-2xl p-1.5 flex items-center gap-2 shrink-0 border border-slate-300 bg-white shadow-xs">
            <Languages className="w-4 h-4 text-sky-600 ml-2 shrink-0" />
            <select
              value={targetLangCode}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none pr-3 cursor-pointer py-1"
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
        <div className="mt-4 pt-3.5 border-t border-sky-200">
          <span className="text-[10px] font-extrabold text-sky-900 uppercase tracking-wider block mb-2">
            Sample Campus Hazard Notices (Tap to test):
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {WARNING_SIGN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-sky-50 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-sky-300 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>{preset.simulatedVisual.split(' ')[0]}</span>
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-4">
        <div>
          <label htmlFor="warning-sign-input" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
            Enter warning sign text or upload sign photo:
          </label>
          <div className="glass-inset rounded-2xl p-2 focus-within:border-sky-500/80 focus-within:ring-2 focus-within:ring-sky-500/20 transition bg-white">
            <textarea
              id="warning-sign-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'DANGER: HIGHLY FLAMMABLE LIQUIDS & CORROSIVE CHEMICALS. RESPIRATOR MANDATORY. IN CASE OF SPILL, PULL EMERGENCY SHOWER'..."
              className="w-full bg-transparent p-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs flex items-center gap-2 transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-sky-600" />
              <span>Photograph Sign</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs flex items-center gap-2 transition cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Upload Photo</span>
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
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 cursor-pointer"
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
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="btn-cyan flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Translating Sign...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Translate &amp; Clarify Hazard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Image Thumbnail */}
        {selectedImage && (
          <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 inline-flex items-center gap-3">
            <div className="relative rounded-xl overflow-hidden border border-sky-300 max-w-[120px] shadow-2xs">
              <img
                src={selectedImage}
                alt="Sign Preview"
                className="h-20 w-28 object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Sign Photo Attached</span>
              <span className="text-[11px] text-slate-500 font-medium">OCR &amp; visual hazard analysis active</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setSelectedImage(img)}
        title="Photograph Hazard Sign or Label"
      />

      {/* Translation Result View */}
      {translation && (
        <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hazard Classification:
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-xl uppercase border ${
                    translation.hazardType === 'DANGER'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : translation.hazardType === 'WARNING'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}
                >
                  {translation.hazardType}
                </span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.name}</span>
                </span>
              </div>
            </div>

            {/* Audio Voice Player */}
            <button
              onClick={handleToggleAudio}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition cursor-pointer border ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
              }`}
              title="Listen to translation read in target language"
            >
              {isPlayingAudio ? (
                <>
                  <div className="flex items-center gap-0.5 h-4">
                    <span className="w-1 bg-white rounded-full wave-bar-1" />
                    <span className="w-1 bg-white rounded-full wave-bar-2" />
                    <span className="w-1 bg-white rounded-full wave-bar-3" />
                    <span className="w-1 bg-white rounded-full wave-bar-4" />
                  </div>
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Listen in {currentLang.name}</span>
                </>
              )}
            </button>
          </div>

          {/* Immediate Action Directive Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border border-red-200 flex items-start gap-3.5">
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                Immediate Action Directive:
              </span>
              <p className="text-sm sm:text-base font-black text-rose-950 mt-0.5">
                {translation.actionDirective}
              </p>
            </div>
          </div>

          {/* Translation Split Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Translated Sign (Primary) */}
            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-sky-200 space-y-2 bg-sky-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>Translated Meaning ({currentLang.name}):</span>
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {translation.translatedText}
              </p>
              {translation.phoneticText && (
                <p className="text-xs text-slate-500 font-mono italic pt-1">
                  Pronunciation: {translation.phoneticText}
                </p>
              )}
            </div>

            {/* Original Sign (Source) */}
            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-2 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Original Sign Wording:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono font-medium">
                {translation.originalText}
              </p>
            </div>
          </div>

          {/* Safety Precautions List */}
          {translation.precautions && translation.precautions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mandatory Safety Precautions:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {translation.precautions.map((precaution, idx) => (
                  <div
                    key={idx}
                    className="glass-inset rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-800 bg-white"
                  >
                    <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 border border-sky-200">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{precaution}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Alert Dispatch Link */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Hazard poses imminent danger to students or lab mates?
            </span>
            <button
              onClick={() =>
                onOpenAlertModal({
                  summary: `Hazard Sign Alert: ${translation.actionDirective} (${translation.hazardType})`,
                  severity: translation.hazardType === 'DANGER' ? 'HIGH' : 'MEDIUM',
                  category: 'Campus Hazard Warning',
                  guidance: translation.precautions || [translation.actionDirective],
                })
              }
              className="w-full sm:w-auto btn-amber px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Bell className="w-4 h-4" />
              <span>Broadcast Alert to Contacts</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
