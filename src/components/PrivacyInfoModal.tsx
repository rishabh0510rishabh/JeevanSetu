import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, X, CheckCircle2, EyeOff, ServerOff, Database } from 'lucide-react';
import { clearSessionData } from '../services/storage';

interface PrivacyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCleared: () => void;
}

export const PrivacyInfoModal: React.FC<PrivacyInfoModalProps> = ({
  isOpen,
  onClose,
  onSessionCleared,
}) => {
  const [clearedNotice, setClearedNotice] = useState(false);

  if (!isOpen) return null;

  const handleClearAll = () => {
    if (confirm('Clear all ephemeral guidance records and temporary session logs from this device?')) {
      clearSessionData();
      setClearedNotice(true);
      setTimeout(() => {
        setClearedNotice(false);
        onSessionCleared();
        onClose();
      }, 1200);
    }
  };

  return (
    <div
      id="privacy-info-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 absolute top-5 right-5 cursor-pointer border border-slate-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Privacy &amp; Data Guarantees</h2>
            <p className="text-xs text-emerald-700 font-bold">Zero persistent cloud health or image records</p>
          </div>
        </div>

        {clearedNotice ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-base font-black text-slate-900">Session History Cleared!</p>
            <p className="text-xs text-slate-500 font-medium">All local queries and temporary cache have been cleared.</p>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs text-slate-600 font-medium">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <EyeOff className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold text-sm block mb-0.5">No Cloud Photo Storage</strong>
                Photos captured or uploaded for injury/sign inspection are processed ephemerally in-memory and are never saved to cloud databases or server disk.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <ServerOff className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold text-sm block mb-0.5">One-Time Location Snapshot</strong>
                GPS coordinates are only retrieved on-demand when you explicitly broadcast an emergency alert to your designated contacts. No background tracking.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold text-sm block mb-0.5">Device-Exclusive Contacts</strong>
                Your 1–5 designated emergency contacts reside exclusively on your local browser cache.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClearAll}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Clear All Ephemeral Session Data</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
              >
                Close Privacy View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
