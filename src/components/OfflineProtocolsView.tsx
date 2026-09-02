import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Volume2,
  Square,
  Flame,
  Droplets,
  Heart,
  Wind,
  Activity,
  Zap,
  PhoneCall,
  Bell,
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

  const filtered = OFFLINE_PROTOCOLS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.immediateAction.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const activeProtocol =
    OFFLINE_PROTOCOLS.find((p) => p.id === selectedProtocolId) || OFFLINE_PROTOCOLS[0];

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="clay-card-emerald p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Instant Offline Emergency Protocols
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium leading-relaxed">
            Cached directly in your device. Access life-saving first-aid steps immediately, even in basement labs, dead zones, or during network outages.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <div className="clay-inset flex items-center px-3 py-1.5">
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

      {/* Main Grid: Protocol Selector List + Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Protocols */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider block px-1 mb-2">
            Available Protocols ({filtered.length})
          </span>
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((protocol) => {
              const isSelected = protocol.id === activeProtocol.id;
              return (
                <div
                  key={protocol.id}
                  onClick={() => {
                    speechService.stop();
                    setIsPlayingAudio(false);
                    setSelectedProtocolId(protocol.id);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition ${
                    isSelected
                      ? 'clay-btn-emerald text-white'
                      : 'clay-surface bg-white text-slate-800 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {protocol.title}
                    </h3>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : protocol.severity === 'CRITICAL_EMERGENCY'
                          ? 'bg-red-100 text-red-700'
                          : protocol.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {protocol.severity === 'CRITICAL_EMERGENCY' ? 'Critical' : protocol.severity}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 line-clamp-2 leading-relaxed font-medium ${
                    isSelected ? 'text-emerald-100' : 'text-slate-600'
                  }`}>
                    {protocol.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Protocol Display */}
        <div className="lg:col-span-8 clay-card p-4 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                  {activeProtocol.category}
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-lg uppercase ${
                    activeProtocol.severity === 'CRITICAL_EMERGENCY'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : activeProtocol.severity === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {activeProtocol.severity.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                {activeProtocol.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {activeProtocol.summary}
              </p>
            </div>

            {/* Audio Button */}
            <button
              onClick={handleToggleAudio}
              className={`clay-btn px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer ${
                isPlayingAudio
                  ? 'clay-btn-emerald animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Listen Aloud</span>
                </>
              )}
            </button>
          </div>

          {/* Immediate Critical Action Box */}
          <div className="clay-card-red p-4 border border-red-300">
            <span className="text-[11px] font-black text-red-950 uppercase tracking-wider block mb-1">
              Immediate Critical Action:
            </span>
            <p className="text-sm font-black text-red-900">
              {activeProtocol.immediateAction}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Step-by-Step Procedure:</span>
            </h3>
            <div className="space-y-2.5">
              {activeProtocol.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="clay-inset-white p-3.5 flex items-start gap-3 text-slate-800 text-sm leading-relaxed"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-semibold text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Do Nots Precautions */}
          <div className="clay-card-amber p-4 space-y-2 border border-amber-300">
            <div className="flex items-center gap-2 text-amber-950 text-xs font-black uppercase tracking-wider">
              <XCircle className="w-4 h-4 text-amber-600" />
              <span>Critical: What NOT to do</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-900 font-medium pl-1">
              {activeProtocol.doNots.map((dont, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{dont}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flag Warning Signs */}
          <div className="clay-card-red p-4 space-y-2 border border-red-300">
            <div className="flex items-center gap-2 text-red-950 text-xs font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Red Flag Warning Signs (Seek ER If Observed)</span>
            </div>
            <ul className="space-y-1 text-xs text-red-900 font-medium pl-1">
              {activeProtocol.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions at bottom */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onOpenDialer}
              className="clay-btn-red px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency {emergencyNumber}</span>
            </button>

            <button
              onClick={() =>
                onOpenAlertModal({
                  summary: `Following Offline Protocol: ${activeProtocol.title}`,
                  severity: activeProtocol.severity,
                  category: activeProtocol.category,
                  guidance: activeProtocol.steps,
                })
              }
              className="clay-btn-amber px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Alert Emergency Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
