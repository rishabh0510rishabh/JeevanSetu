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
      subtitle: 'Police, Fire & Paramedics (USA/Canada)',
      number: '911',
      badge: 'Immediate Life Threat',
      icon: ShieldAlert,
    },
    {
      title: 'International Emergency (112)',
      subtitle: 'Standard European & Global GSM SOS',
      number: '112',
      badge: 'Global SOS',
      icon: ShieldAlert,
    },
    {
      title: 'Campus Security & Police',
      subtitle: 'Campus emergency dispatch & security escort',
      number: campusNumber,
      badge: 'Campus Safety',
      icon: Building,
      isCustomizable: true,
    },
    {
      title: 'Poison Control Center',
      subtitle: 'Chemical spills, toxic ingestion & overdose advice',
      number: '1-800-222-1222',
      badge: 'Toxicology',
      icon: Skull,
    },
    {
      title: 'Crisis & Mental Health Lifeline',
      subtitle: '24/7 free, confidential crisis counseling',
      number: '988',
      badge: 'Mental Health SOS',
      icon: HeartPulse,
    },
  ];

  return (
    <div
      id="emergency-dialer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 absolute top-5 right-5 cursor-pointer border border-slate-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shadow-xs">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Emergency Call Center</h2>
            <p className="text-xs text-rose-700 font-bold">Tap any number to initiate an immediate direct phone call</p>
          </div>
        </div>

        {/* Urgent Disclaimer Banner */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>
            If someone is unresponsive, unable to breathe, or bleeding profusely, tap <strong>Call 911</strong> immediately without delay.
          </span>
        </div>

        {/* Emergency Call Options */}
        <div className="space-y-3">
          {emergencyNumbers.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-3 transition shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>
                      {item.isCustomizable && (
                        <button
                          onClick={() => setIsEditingCampus(!isEditingCampus)}
                          className="text-slate-400 hover:text-slate-700 text-xs p-1"
                          title="Edit campus security phone number"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {item.isCustomizable && isEditingCampus ? (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="glass-inset rounded-lg p-0.5 border border-slate-300 bg-white">
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
                          className="btn-emerald p-1 rounded-lg text-white cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                <a
                  href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                  className="btn-emergency px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0 glow-red shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Return Button */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
          >
            Return to Safety Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
