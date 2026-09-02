import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, X, AlertTriangle, Building, Skull, HeartPulse, Edit2, Check } from 'lucide-react';
import { getCampusEmergencyNumber, setCampusEmergencyNumber } from '../services/storage';

interface EmergencyDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyDialerModal: React.FC<EmergencyDialerModalProps> = ({ isOpen, onClose }) => {
  const [campusNumber, setCampusNumState] = useState(getCampusEmergencyNumber());
  const [isEditingCampus, setIsEditingCampus] = useState(false);

  if (!isOpen) return null;

  const handleSaveCampusNum = () => {
    setCampusEmergencyNumber(campusNumber);
    setIsEditingCampus(false);
  };

  const emergencyNumbers = [
    {
      title: 'Emergency Services (911)',
      subtitle: 'Police, Fire, Paramedics (USA/Canada)',
      number: '911',
      color: 'bg-red-600 hover:bg-red-500',
      icon: ShieldAlert,
    },
    {
      title: 'International Emergency (112)',
      subtitle: 'Standard European & Global GSM SOS',
      number: '112',
      color: 'bg-rose-600 hover:bg-rose-500',
      icon: ShieldAlert,
    },
    {
      title: 'Campus Security & Police',
      subtitle: 'Campus emergency dispatch & security escort',
      number: campusNumber,
      color: 'bg-amber-600 hover:bg-amber-500',
      icon: Building,
      isCustomizable: true,
    },
    {
      title: 'Poison Control Hotline',
      subtitle: 'Chemical spills, toxic ingestion, overdose advice',
      number: '1-800-222-1222',
      color: 'bg-indigo-600 hover:bg-indigo-500',
      icon: Skull,
    },
    {
      title: 'Crisis & Mental Health Lifeline',
      subtitle: '24/7 free, confidential crisis counseling',
      number: '988',
      color: 'bg-teal-600 hover:bg-teal-500',
      icon: HeartPulse,
    },
  ];

  return (
    <div
      id="emergency-dialer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border-2 border-red-500/50 shadow-2xl p-4 sm:p-6 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 animate-pulse">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Emergency Call Center</h2>
            <p className="text-xs text-red-400 font-medium">Tap any number to initiate direct phone call</p>
          </div>
        </div>

        <div className="bg-red-950/60 border border-red-600/40 rounded-xl p-3 mb-5 flex items-start gap-2 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>
            If anyone is in immediate life-threatening danger, unconscious, unable to breathe, or bleeding profusely, tap <strong>Call 911</strong> immediately.
          </span>
        </div>

        <div className="space-y-3">
          {emergencyNumbers.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center text-slate-200 shrink-0">
                    <IconComponent className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                      {item.isCustomizable && (
                        <button
                          onClick={() => setIsEditingCampus(!isEditingCampus)}
                          className="text-slate-400 hover:text-slate-200 text-xs p-1"
                          title="Edit campus number"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {item.isCustomizable && isEditingCampus ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="text"
                          value={campusNumber}
                          onChange={(e) => setCampusNumState(e.target.value)}
                          className="bg-slate-900 border border-slate-600 rounded px-2 py-0.5 text-xs text-white w-36"
                          placeholder="e.g. 555-0199"
                        />
                        <button
                          onClick={handleSaveCampusNum}
                          className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-500"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                <a
                  href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                  className={`flex items-center gap-1.5 ${item.color} active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition shrink-0`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Return to Safety Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
