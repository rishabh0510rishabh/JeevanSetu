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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg clay-card p-5 sm:p-7 text-slate-800 relative max-h-[90vh] overflow-y-auto border border-red-300">
        <button
          onClick={onClose}
          className="clay-btn bg-white hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800 absolute top-4 right-4 cursor-pointer border border-slate-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shadow-sm shadow-red-500/20">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Emergency Call Center</h2>
            <p className="text-xs text-red-700 font-bold">Tap any number to initiate direct phone call</p>
          </div>
        </div>

        <div className="clay-card-red p-3.5 mb-5 flex items-start gap-2 text-xs border border-red-300">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="text-red-950 font-medium">
            If anyone is in immediate life-threatening danger, unconscious, unable to breathe, or bleeding profusely, tap <strong>Call 911</strong> immediately.
          </span>
        </div>

        <div className="space-y-3">
          {emergencyNumbers.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="clay-surface bg-white/90 border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
                    <IconComponent className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 truncate">{item.title}</h3>
                      {item.isCustomizable && (
                        <button
                          onClick={() => setIsEditingCampus(!isEditingCampus)}
                          className="text-slate-400 hover:text-slate-800 text-xs p-1"
                          title="Edit campus number"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {item.isCustomizable && isEditingCampus ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="clay-inset p-0.5">
                          <input
                            type="text"
                            value={campusNumber}
                            onChange={(e) => setCampusNumState(e.target.value)}
                            className="bg-transparent px-2 py-0.5 text-xs text-slate-900 font-bold w-32 focus:outline-none"
                            placeholder="e.g. 555-0199"
                          />
                        </div>
                        <button
                          onClick={handleSaveCampusNum}
                          className="clay-btn-emerald p-1 text-white cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 truncate font-medium">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                <a
                  href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                  className="clay-btn-red text-white px-3.5 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer shrink-0"
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
            className="clay-btn bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 w-full py-2.5 text-sm font-bold cursor-pointer"
          >
            Return to Safety Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
