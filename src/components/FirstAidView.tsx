import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  PhoneCall,
  Volume2,
  Square,
  Bell,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ShieldAlert,
  Flame,
  Activity,
  Trash2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { FirstAidGuidance, SeverityLevel, EmergencyContact } from '../types';
import { FIRST_AID_PRESETS, FirstAidPreset } from '../data/presets';
import { fetchFirstAidGuidance } from '../services/api';
import { speechService } from '../services/speech';
import { CameraCaptureModal } from './CameraCaptureModal';

interface FirstAidViewProps {
  onOpenDialer: () => void;
  onOpenAlertModal: (context: {
    summary: string;
    severity: SeverityLevel;
    category: string;
    guidance: string[];
  }) => void;
  emergencyContacts: EmergencyContact[];
  emergencyNumber: string;
}

export const FirstAidView: React.FC<FirstAidViewProps> = ({
  onOpenDialer,
  onOpenAlertModal,
  emergencyContacts,
  emergencyNumber,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<FirstAidGuidance | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleApplyPreset = (preset: FirstAidPreset) => {
    setInputText(preset.textPrompt);
    handleSubmitWithData(preset.textPrompt, null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage) {
      setErrorMsg('Please describe the situation or provide a photo of the injury.');
      return;
    }
    handleSubmitWithData(inputText, selectedImage);
  };

  const handleSubmitWithData = async (text: string, image: string | null) => {
    setErrorMsg(null);
    setIsLoading(true);
    speechService.stop();
    setIsPlayingAudio(false);

    try {
      const result = await fetchFirstAidGuidance(text, image || undefined);
      setGuidance(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to analyze situation. Please check basic protocols or call emergency services.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else if (guidance) {
      const speechText = `First-aid guidance for ${guidance.category}. ${guidance.immediateCriticalAction}. Step 1: ${guidance.steps.join('. Step ')}. Precautions to avoid: ${guidance.doNots.join('. ')}.`;
      const started = speechService.speak(
        speechText,
        'en-US',
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
    setGuidance(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Hero Intro */}
      <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                Multimodal Emergency &amp; First-Aid Assistant
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Describe what happened or take a photo of an injury (cut, burn, spill, reaction) to get immediate plain-language steps within seconds.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenDialer}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-red-900/40"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call {emergencyNumber}</span>
            </button>
          </div>
        </div>

        {/* Rapid Test Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Instant Test Scenarios:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {FIRST_AID_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700/80 hover:border-red-500/50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div>
          <label htmlFor="first-aid-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Describe the situation or injury:
          </label>
          <textarea
            id="first-aid-input"
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 'I burned my hand on the stove and blisters are forming', 'deep kitchen knife cut with continuous bleeding', 'someone is coughing and choking'..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition resize-none"
          />
        </div>

        {/* Media / Photo Upload Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition"
            >
              <Camera className="w-4 h-4 text-red-400" />
              <span>Use Camera</span>
            </button>

            <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition">
              <Upload className="w-4 h-4 text-sky-400" />
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
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(inputText || selectedImage || guidance) && (
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
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-lg shadow-red-900/40 active:scale-95 transition"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Emergency...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Get Step-by-Step Guidance</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Image Thumbnail */}
        {selectedImage && (
          <div className="relative inline-block mt-2 border-2 border-red-500/40 rounded-xl overflow-hidden bg-black max-w-xs shadow-md">
            <img
              src={selectedImage}
              alt="Injury Preview"
              className="max-h-40 w-auto object-cover"
            />
            <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
              Ready for AI Inspection
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/50 rounded-xl p-3 text-xs text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setSelectedImage(img)}
        title="Capture Injury or Hazard Photo"
      />

      {/* Results Display */}
      {guidance && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Conservative Severity Escalation Prominent Header */}
          {guidance.isEmergency || guidance.severity === 'CRITICAL_EMERGENCY' || guidance.severity === 'HIGH' ? (
            <div className="bg-red-600 border-2 border-red-400 text-white rounded-2xl p-4 sm:p-5 shadow-2xl shadow-red-950 animate-pulse">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-md">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 text-white text-[11px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                        High Severity Alert
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                      {guidance.immediateCriticalAction || 'Potential Life-Threatening Emergency Detected'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onOpenDialer}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-red-600 font-extrabold px-4 py-2.5 rounded-xl text-sm shadow-lg transition active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call {emergencyNumber} Now</span>
                  </button>
                  <button
                    onClick={() =>
                      onOpenAlertModal({
                        summary: guidance.summary,
                        severity: guidance.severity,
                        category: guidance.category,
                        guidance: guidance.steps,
                      })
                    }
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-amber-300 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Alert Contacts</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Core Guidance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
            {/* Meta Header & Audio Reader */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Category:
                  </span>
                  <span className="text-sm font-extrabold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {guidance.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${
                      guidance.severity === 'CRITICAL_EMERGENCY'
                        ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                        : guidance.severity === 'HIGH'
                        ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    Severity: {guidance.severity.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-200 mt-2 font-medium">
                  {guidance.summary}
                </p>
              </div>

              {/* Audio Listen Button */}
              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                  isPlayingAudio
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title="Listen to instructions read aloud"
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-sky-400" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Step-by-Step First-Aid Protocol:</span>
              </h3>
              <div className="space-y-2.5">
                {guidance.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-slate-100 text-sm leading-relaxed"
                  >
                    <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DO NOTS Warning Box */}
            {guidance.doNots && guidance.doNots.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <XCircle className="w-4 h-4 text-amber-400" />
                  <span>Crucial: What NOT To Do</span>
                </div>
                <ul className="space-y-1.5 text-xs text-amber-200/90 pl-1">
                  {guidance.doNots.map((dont, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{dont}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red Flag Warning Signs */}
            {guidance.warningSigns && guidance.warningSigns.length > 0 && (
              <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-red-300 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Red Flag Warning Signs (Seek ER If Observed)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-red-200/90 pl-1">
                  {guidance.warningSigns.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* When to Seek Care Info */}
            {guidance.whenToSeekCare && (
              <div className="flex items-start gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 font-semibold">When to seek professional clinic care: </strong>
                  <span>{guidance.whenToSeekCare}</span>
                </div>
              </div>
            )}

            {/* Bottom Contact Alert Button */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Need to keep a roommate or RA updated on your status?
              </span>
              <button
                onClick={() =>
                  onOpenAlertModal({
                    summary: guidance.summary,
                    severity: guidance.severity,
                    category: guidance.category,
                    guidance: guidance.steps,
                  })
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <Bell className="w-4 h-4" />
                <span>Alert Emergency Contact ({emergencyContacts.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
