import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Volume2,
  PhoneCall,
  Bell,
  ShieldAlert,
} from 'lucide-react';
import { OFFLINE_PROTOCOLS } from '../data/protocols';
import { FirstAidProtocolItem, SeverityLevel } from '../types';
import { speechService } from '../services/speech';

interface OfflineProtocolsViewProps {
  onOpenDialer: () => void;
  onOpenAlertModal: (context: {
    summary: string;
    severity: SeverityLevel;
    category: string;
    guidance: string[];
  }) => void;
  emergencyNumber: string;
}

export const OfflineProtocolsView: React.FC<OfflineProtocolsViewProps> = ({
  onOpenDialer,
  onOpenAlertModal,
  emergencyNumber,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(OFFLINE_PROTOCOLS[0].id);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(OFFLINE_PROTOCOLS.map((p) => p.category)))];

  const filtered = OFFLINE_PROTOCOLS.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.immediateAction.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeProtocol =
    OFFLINE_PROTOCOLS.find((p) => p.id === selectedProtocolId) || filtered[0] || OFFLINE_PROTOCOLS[0];

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      const speechText = `${activeProtocol.title}. Immediate action: ${activeProtocol.immediateAction}. Step 1: ${activeProtocol.steps.join('. Step ')}. What not to do: ${activeProtocol.doNots.join('. ')}.`;
      const started = speechService.speak(
        speechText,
        'en-US',
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
      if (started) setIsPlayingAudio(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card-emerald rounded-3xl p-5 sm:p-7 border border-emerald-200 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Instant Offline Emergency Protocols
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Cached locally in your browser storage. Access standardized medical first-aid steps instantly during power cuts, network blackouts, or dead zones.
            </p>
          </div>

          {/* Search Console */}
          <div className="w-full sm:w-72 relative shrink-0">
            <div className="glass-inset rounded-2xl flex items-center px-3 py-2 border border-slate-300 bg-white focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 transition shadow-2xs">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search burns, bleeding, CPR..."
                className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 pt-3.5 border-t border-emerald-200 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 shadow-2xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Protocols Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Protocols List Navigation (Left) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map((protocol) => {
            const isSelected = protocol.id === activeProtocol.id;
            return (
              <div
                key={protocol.id}
                onClick={() => {
                  setSelectedProtocolId(protocol.id);
                  if (isPlayingAudio) {
                    speechService.stop();
                    setIsPlayingAudio(false);
                  }
                }}
                className={`p-4 rounded-2xl transition cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                    : 'glass-card hover:bg-slate-50 border-slate-200/90 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {protocol.category}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      protocol.severity === 'CRITICAL_EMERGENCY'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : protocol.severity === 'HIGH'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {protocol.severity.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate">{protocol.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {protocol.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Protocol Detailed Reader (Right) */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg uppercase">
                    {activeProtocol.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">• Standardized Procedure</span>
                </div>
                <h2 className="text-xl font-black text-slate-900">{activeProtocol.title}</h2>
                <p className="text-xs text-slate-600 mt-1 font-medium">{activeProtocol.summary}</p>
              </div>

              {/* Listen Aloud Button */}
              <button
                onClick={handleToggleAudio}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition cursor-pointer border ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
                }`}
                title="Listen to offline protocol steps"
              >
                {isPlayingAudio ? (
                  <>
                    <div className="flex items-center gap-0.5 h-4">
                      <span className="w-1 bg-white rounded-full wave-bar-1" />
                      <span className="w-1 bg-white rounded-full wave-bar-2" />
                      <span className="w-1 bg-white rounded-full wave-bar-3" />
                      <span className="w-1 bg-white rounded-full wave-bar-4" />
                    </div>
                    <span>Pause Narration</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>
            </div>

            {/* Immediate Action Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-slate-50 border border-emerald-300 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                  Immediate 0-Second Action:
                </span>
                <p className="text-sm font-black text-emerald-950 mt-0.5">
                  {activeProtocol.immediateAction}
                </p>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Standardized Procedure Steps:</span>
              </h3>
              <div className="space-y-2.5">
                {activeProtocol.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="glass-inset rounded-2xl p-3.5 sm:p-4 flex items-start gap-3.5 text-slate-800 text-sm leading-relaxed bg-white"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-semibold flex-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DO NOTS and Red Flags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DO NOTS */}
              {activeProtocol.doNots && activeProtocol.doNots.length > 0 && (
                <div className="glass-card-amber rounded-2xl p-4 space-y-2 border border-amber-300">
                  <div className="flex items-center gap-2 text-amber-950 text-xs font-black uppercase tracking-wider">
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <span>Crucial: What NOT To Do</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-900 font-medium pl-1">
                    {activeProtocol.doNots.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flags */}
              {activeProtocol.redFlags && activeProtocol.redFlags.length > 0 && (
                <div className="glass-card-red rounded-2xl p-4 space-y-2 border border-rose-300">
                  <div className="flex items-center gap-2 text-rose-950 text-xs font-black uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Red Flag Warning Signs</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-900 font-medium pl-1">
                    {activeProtocol.redFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Emergency Actions Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onOpenDialer}
                className="w-full sm:w-auto btn-emergency px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer glow-red shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Emergency ({emergencyNumber})</span>
              </button>

              <button
                onClick={() =>
                  onOpenAlertModal({
                    summary: `Offline Protocol Review: ${activeProtocol.title} (${activeProtocol.immediateAction})`,
                    severity: activeProtocol.severity,
                    category: activeProtocol.category,
                    guidance: activeProtocol.steps,
                  })
                }
                className="w-full sm:w-auto btn-amber px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Bell className="w-4 h-4" />
                <span>Dispatch Alert to Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
