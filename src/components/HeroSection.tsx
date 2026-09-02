import React from 'react';
import {
  Activity,
  ShieldAlert,
  PhoneCall,
  Bell,
  Sparkles,
  Zap,
  Globe,
  BookOpen,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { FIRST_AID_PRESETS, FirstAidPreset } from '../data/presets';

interface HeroSectionProps {
  onOpenDialer: () => void;
  onOpenAlertModal: () => void;
  onSelectTab: (tab: 'first-aid' | 'translate' | 'protocols' | 'contacts') => void;
  onApplyPreset: (preset: FirstAidPreset) => void;
  emergencyNumber: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDialer,
  onOpenAlertModal,
  onSelectTab,
  onApplyPreset,
  emergencyNumber,
}) => {
  return (
    <section aria-label="Hero Introduction" className="space-y-4 mb-6">
      {/* Main Hero Showcase */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-rose-50/40 to-slate-50 border border-slate-200/80 p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Multimodal AI Health &amp; Safety Companion</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Instant First-Aid Guidance &amp; Emergency Triage
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Equipping campuses, dorms, and labs with plain-language emergency triage, multilingual hazard sign translations, verified offline protocols, and 1-tap contact dispatch.
            </p>

            {/* Key Pillars Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 font-semibold shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Zero-Latency Plain Steps</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 font-semibold shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>10+ Languages OCR</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 font-semibold shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Offline Ready</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 font-semibold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Zero Cloud Photo Retention</span>
              </span>
            </div>
          </div>

          {/* Quick Action Floating Cards */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={onOpenDialer}
              className="btn-emergency flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-black cursor-pointer shadow-md glow-red"
              title="Immediate call to 911 or Campus Security"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency ({emergencyNumber})</span>
            </button>

            <button
              onClick={onOpenAlertModal}
              className="btn-amber flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold cursor-pointer shadow-md"
              title="Broadcast 1-tap alert with one-time GPS snapshot to contacts"
            >
              <Bell className="w-4 h-4" />
              <span>Broadcast 1-Tap SOS Alert</span>
            </button>
          </div>
        </div>

        {/* Rapid Test Scenarios Grid */}
        <div className="mt-6 pt-5 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Instant Simulation Scenarios (Tap to test):
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Pre-configured campus emergency prompts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {FIRST_AID_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="p-3 rounded-2xl bg-white hover:bg-rose-50/70 border border-slate-200/90 hover:border-rose-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {preset.tag}
                  </span>
                </div>
                <h2 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                  {preset.title}
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {preset.sampleDescription}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
