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
  ShieldAlert,
  Activity,
  Trash2,
  Info,
  Check,
} from 'lucide-react';
import { FirstAidGuidance, SeverityLevel, EmergencyContact } from '../types';
import { FIRST_AID_PRESETS, FirstAidPreset } from '../data/presets';
import { fetchFirstAidGuidance } from '../services/api';
import { speechService } from '../services/speech';
import { CameraCaptureModal } from './CameraCaptureModal';
import { HeroSection } from './HeroSection';

interface FirstAidViewProps {
  onOpenDialer: () => void;
  onOpenAlertModal: (context: {
    summary: string;
    severity: SeverityLevel;
    category: string;
    guidance: string[];
  }) => void;
  onSelectTab: (tab: 'first-aid' | 'translate' | 'protocols' | 'contacts') => void;
  emergencyContacts: EmergencyContact[];
  emergencyNumber: string;
}

export const FirstAidView: React.FC<FirstAidViewProps> = ({
  onOpenDialer,
  onOpenAlertModal,
  onSelectTab,
  emergencyContacts,
  emergencyNumber,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<FirstAidGuidance | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
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
    setCompletedSteps({});

    try {
      const result = await fetchFirstAidGuidance(text, image || undefined);
      setGuidance(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to analyze situation. Please check basic protocols or call emergency services.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
    setCompletedSteps({});
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Hero Section Showcase */}
      <HeroSection
        onOpenDialer={onOpenDialer}
        onOpenAlertModal={() =>
          onOpenAlertModal({
            summary: 'QUICK EMERGENCY ALERT: Immediate campus assistance requested.',
            severity: 'HIGH',
            category: 'Emergency Dispatch',
            guidance: ['User triggered quick SOS broadcast from JeevanSetu.'],
          })
        }
        onSelectTab={onSelectTab}
        onApplyPreset={handleApplyPreset}
        emergencyNumber={emergencyNumber}
      />

      {/* 2. Multimodal Input Card */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="first-aid-input" className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Describe the situation or injury:
            </label>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Natural language symptoms or chemical names
            </span>
          </div>

          <div className="glass-inset rounded-2xl p-2 focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 transition bg-white">
            <textarea
              id="first-aid-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'Boiling water spilled over forearm with immediate redness and blistering', 'Deep knife cut on hand with continuous bleeding', 'Someone is coughing and having severe difficulty breathing'..."
              className="w-full bg-transparent p-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* Media / Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs flex items-center gap-2 transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-rose-600" />
              <span>Take Photo</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs flex items-center gap-2 transition cursor-pointer">
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
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(inputText || selectedImage || guidance) && (
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
              className="btn-emergency flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition glow-red"
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

        {/* Selected Image Thumbnail Preview */}
        {selectedImage && (
          <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 inline-flex items-center gap-3">
            <div className="relative rounded-xl overflow-hidden border border-rose-300 max-w-[120px] shadow-2xs">
              <img
                src={selectedImage}
                alt="Injury Preview"
                className="h-20 w-28 object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Image Attached</span>
              <span className="text-[11px] text-slate-500 font-medium">Gemini multimodal vision triage active</span>
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
        title="Capture Injury or Hazard Photo"
      />

      {/* 3. Guidance Results Card */}
      {guidance && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Conservative Severity Escalation Card */}
          {guidance.isEmergency || guidance.severity === 'CRITICAL_EMERGENCY' || guidance.severity === 'HIGH' ? (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-lg shadow-rose-600/20 border border-rose-500 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-md">
                    <ShieldAlert className="w-7 h-7 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        High Severity Alert
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white mt-1">
                      {guidance.immediateCriticalAction || 'Potential Life-Threatening Emergency Detected'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={onOpenDialer}
                    className="flex-1 sm:flex-initial bg-white hover:bg-slate-50 text-rose-600 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
                  >
                    <PhoneCall className="w-4 h-4 text-rose-600" />
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
                    className="flex-1 sm:flex-initial btn-amber px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Alert Contacts</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Main Guidance Detail Card */}
          <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-6">
            {/* Meta Header & Audio Reader */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category:
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                    {guidance.category}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-xl uppercase border ${
                      guidance.severity === 'CRITICAL_EMERGENCY'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : guidance.severity === 'HIGH'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    Severity: {guidance.severity.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-800 font-semibold leading-relaxed">
                  {guidance.summary}
                </p>
              </div>

              {/* Audio Listen Bar */}
              <button
                onClick={handleToggleAudio}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition cursor-pointer border ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
                }`}
                title="Listen to step-by-step instructions read aloud"
              >
                {isPlayingAudio ? (
                  <>
                    <div className="flex items-center gap-0.5 h-4">
                      <span className="w-1 bg-white rounded-full wave-bar-1" />
                      <span className="w-1 bg-white rounded-full wave-bar-2" />
                      <span className="w-1 bg-white rounded-full wave-bar-3" />
                      <span className="w-1 bg-white rounded-full wave-bar-4" />
                    </div>
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Step-by-Step Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Step-by-Step Protocol (Tap to mark completed):</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {Object.values(completedSteps).filter(Boolean).length} of {guidance.steps.length} completed
                </span>
              </div>

              <div className="space-y-2.5">
                {guidance.steps.map((step, index) => {
                  const isDone = !!completedSteps[index];
                  return (
                    <div
                      key={index}
                      onClick={() => handleToggleStep(index)}
                      className={`p-3.5 sm:p-4 rounded-2xl flex items-start gap-3.5 transition-all cursor-pointer border ${
                        isDone
                          ? 'bg-emerald-50/80 border-emerald-300 text-slate-500'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 mt-0.5 transition ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-100 border border-rose-300 text-rose-700'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
                      </div>
                      <span className={`flex-1 text-sm leading-relaxed ${isDone ? 'line-through text-slate-400' : 'font-semibold'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warnings Grid (DO NOTS + Red Flags) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DO NOTS */}
              {guidance.doNots && guidance.doNots.length > 0 && (
                <div className="glass-card-amber rounded-2xl p-4 space-y-2 border border-amber-300">
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

              {/* Red Flag Signs */}
              {guidance.warningSigns && guidance.warningSigns.length > 0 && (
                <div className="glass-card-red rounded-2xl p-4 space-y-2 border border-rose-300">
                  <div className="flex items-center gap-2 text-rose-950 text-xs font-black uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Red Flags (Seek ER If Observed)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-900 font-medium pl-1">
                    {guidance.warningSigns.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* When to Seek Clinic Care */}
            {guidance.whenToSeekCare && (
              <div className="glass-card-blue rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-950 border border-sky-200">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-900 font-bold block mb-0.5">When to seek professional clinic care:</strong>
                  <span className="text-sky-800 font-medium">{guidance.whenToSeekCare}</span>
                </div>
              </div>
            )}

            {/* Bottom Contact Dispatch Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                Keep designated contacts or RA updated on your status?
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
                className="w-full sm:w-auto btn-amber px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Bell className="w-4 h-4" />
                <span>Alert Emergency Contacts ({emergencyContacts.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
