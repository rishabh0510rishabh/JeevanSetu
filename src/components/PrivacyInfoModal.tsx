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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 sm:p-6 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Privacy &amp; Data Guarantees</h2>
            <p className="text-xs text-emerald-400 font-medium">Zero persistent cloud health records</p>
          </div>
        </div>

        {clearedNotice ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-white">Session History Cleared!</p>
            <p className="text-xs text-slate-400">All ephemeral queries have been removed from local storage.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <EyeOff className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">No Photo Storage</strong>
                Photos captured or uploaded for injury/sign inspection are processed ephemerally in-memory and are never permanently saved to any server disk or cloud database.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <ServerOff className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">One-Time Location Snapshot</strong>
                GPS coordinates are only requested when you explicitly choose to dispatch an emergency alert to your designated contacts, and are not tracked in the background.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">Client-Controlled Emergency Contacts</strong>
                Your 1–3 designated contacts reside exclusively on your local device storage.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClearAll}
                className="w-full flex items-center justify-center gap-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-200 py-2.5 rounded-xl text-xs font-bold transition"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Clear All Ephemeral Session Logs</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
