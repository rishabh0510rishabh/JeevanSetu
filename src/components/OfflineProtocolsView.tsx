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
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg sm:text-xl font-extrabold text-white">
              Instant Offline Emergency Protocols
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Cached directly in your device. Access life-saving first-aid steps immediately, even in basement labs, dead zones, or during network outages.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search burns, bleeding, choking..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Protocol Selector List + Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Protocols */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-2">
            Available Protocols ({filtered.length})
          </span>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
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
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{protocol.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        protocol.severity === 'CRITICAL_EMERGENCY'
                          ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                          : protocol.severity === 'HIGH'
                          ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {protocol.severity === 'CRITICAL_EMERGENCY' ? 'Critical' : protocol.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {protocol.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Protocol Display */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {activeProtocol.category}
                </span>
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded uppercase ${
                    activeProtocol.severity === 'CRITICAL_EMERGENCY'
                      ? 'bg-red-600 text-white'
                      : activeProtocol.severity === 'HIGH'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {activeProtocol.severity.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {activeProtocol.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {activeProtocol.summary}
              </p>
            </div>

            {/* Audio Button */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                isPlayingAudio
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Listen Aloud</span>
                </>
              )}
            </button>
          </div>

          {/* Immediate Critical Action Box */}
          <div className="bg-red-950/40 border-2 border-red-500/40 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider block mb-1">
              Immediate Critical Action:
            </span>
            <p className="text-sm font-bold text-white">
              {activeProtocol.immediateAction}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step Procedure:</span>
            </h3>
            <div className="space-y-2.5">
              {activeProtocol.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm leading-relaxed"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Do Nots Precautions */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <XCircle className="w-4 h-4 text-amber-400" />
              <span>Critical: What NOT to do</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-200/90 pl-1">
              {activeProtocol.doNots.map((dont, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{dont}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flag Warning Signs */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-red-300 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Red Flag Warning Signs (Seek ER If Observed)</span>
            </div>
            <ul className="space-y-1 text-xs text-red-200/90 pl-1">
              {activeProtocol.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions at bottom */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onOpenDialer}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition"
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
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition"
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
