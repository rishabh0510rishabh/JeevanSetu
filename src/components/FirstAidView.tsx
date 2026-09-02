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
      {/* Top Clay Banner / Hero Intro */}
      <div className="clay-card-red p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Multimodal Emergency &amp; First-Aid Assistant
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium leading-relaxed">
              Describe what happened or take a photo of an injury (cut, burn, spill, reaction) to get immediate plain-language steps within seconds.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenDialer}
              className="clay-btn-red flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call {emergencyNumber}</span>
            </button>
          </div>
        </div>

        {/* Rapid Test Presets */}
        <div className="mt-4 pt-3.5 border-t border-red-200/80">
          <span className="text-[11px] font-extrabold text-red-900/80 uppercase tracking-wider block mb-2">
            Instant Test Scenarios:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {FIRST_AID_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="clay-btn bg-white hover:bg-red-50 text-slate-800 border border-red-200/80 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section - Tactile Clay Card */}
      <form onSubmit={handleSubmit} className="clay-card p-4 sm:p-6 space-y-4">
        <div>
          <label htmlFor="first-aid-input" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
            Describe the situation or injury:
          </label>
          <div className="clay-inset p-1">
            <textarea
              id="first-aid-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'I burned my hand on the stove and blisters are forming', 'deep kitchen knife cut with continuous bleeding', 'someone is coughing and choking'..."
              className="w-full bg-transparent p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none font-medium"
            />
          </div>
        </div>

        {/* Media / Photo Upload Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="clay-btn bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-red-500" />
              <span>Use Camera</span>
            </button>

            <label className="clay-btn bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-sky-600" />
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
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 p-1.5 cursor-pointer ml-1"
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
                className="clay-btn bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 px-3.5 py-2 text-xs font-bold border border-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="clay-btn-red flex items-center gap-2 px-5 py-2.5 text-sm font-black cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Emergency...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Get Step-by-Step Guidance</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Image Thumbnail */}
        {selectedImage && (
          <div className="clay-card p-2 inline-block mt-2 max-w-xs">
            <div className="relative rounded-xl overflow-hidden border border-red-200">
              <img
                src={selectedImage}
                alt="Injury Preview"
                className="max-h-40 w-auto object-cover"
              />
              <div className="absolute top-1 right-1 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Ready for AI Inspection
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="clay-card-red p-3 text-xs text-red-900 font-medium flex items-center gap-2 border border-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
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
            <div className="clay-btn-red p-4 sm:p-5 rounded-3xl animate-pulse">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/20">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-inner">
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
                    className="flex-1 sm:flex-initial clay-btn bg-white hover:bg-slate-50 text-red-600 font-black px-4 py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <PhoneCall className="w-4 h-4 text-red-600" />
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
                    className="flex-1 sm:flex-initial clay-btn-amber px-4 py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Alert Contacts</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Core Guidance Card */}
          <div className="clay-card p-4 sm:p-6 space-y-5">
            {/* Meta Header & Audio Reader */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Category:
                  </span>
                  <span className="text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                    {guidance.category}
                  </span>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-xl uppercase ${
                      guidance.severity === 'CRITICAL_EMERGENCY'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : guidance.severity === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    Severity: {guidance.severity.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-2 font-semibold">
                  {guidance.summary}
                </p>
              </div>

              {/* Audio Listen Button */}
              <button
                onClick={handleToggleAudio}
                className={`clay-btn px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer ${
                  isPlayingAudio
                    ? 'clay-btn-amber animate-pulse'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
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
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Step-by-Step First-Aid Protocol:</span>
              </h3>
              <div className="space-y-2.5">
                {guidance.steps.map((step, index) => (
                  <div
                    key={index}
                    className="clay-inset-white p-3.5 flex items-start gap-3 text-slate-800 text-sm leading-relaxed"
                  >
                    <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-semibold text-slate-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DO NOTS Warning Box */}
            {guidance.doNots && guidance.doNots.length > 0 && (
              <div className="clay-card-amber p-4 space-y-2 border border-amber-300">
                <div className="flex items-center gap-2 text-amber-950 text-xs font-black uppercase tracking-wider">
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span>Crucial: What NOT To Do</span>
                </div>
                <ul className="space-y-1.5 text-xs text-amber-900 font-medium pl-1">
                  {guidance.doNots.map((dont, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{dont}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red Flag Warning Signs */}
            {guidance.warningSigns && guidance.warningSigns.length > 0 && (
              <div className="clay-card-red p-4 space-y-2 border border-red-300">
                <div className="flex items-center gap-2 text-red-950 text-xs font-black uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Red Flag Warning Signs (Seek ER If Observed)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-red-900 font-medium pl-1">
                  {guidance.warningSigns.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* When to Seek Care Info */}
            {guidance.whenToSeekCare && (
              <div className="clay-card-blue p-3.5 flex items-start gap-2.5 text-xs text-sky-950 border border-sky-200">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-900 font-bold">When to seek professional clinic care: </strong>
                  <span className="font-medium">{guidance.whenToSeekCare}</span>
                </div>
              </div>
            )}

            {/* Bottom Contact Alert Button */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
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
                className="w-full sm:w-auto clay-btn-amber px-4 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
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
