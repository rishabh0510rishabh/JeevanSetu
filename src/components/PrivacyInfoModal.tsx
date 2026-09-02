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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg clay-card p-5 sm:p-7 text-slate-800 relative max-h-[90vh] overflow-y-auto border border-emerald-300">
        <button
          onClick={onClose}
          className="clay-btn bg-white hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800 absolute top-4 right-4 cursor-pointer border border-slate-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Privacy &amp; Data Guarantees</h2>
            <p className="text-xs text-emerald-800 font-bold">Zero persistent cloud health records</p>
          </div>
        </div>

        {clearedNotice ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-base font-black text-slate-900">Session History Cleared!</p>
            <p className="text-xs text-slate-600 font-medium">All ephemeral queries have been removed from local storage.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-700 font-medium">
            <div className="flex items-start gap-3 clay-surface bg-white/90 p-3.5 rounded-2xl border border-slate-200">
              <EyeOff className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-black text-sm block">No Photo Storage</strong>
                Photos captured or uploaded for injury/sign inspection are processed ephemerally in-memory and are never permanently saved to any server disk or cloud database.
              </div>
            </div>

            <div className="flex items-start gap-3 clay-surface bg-white/90 p-3.5 rounded-2xl border border-slate-200">
              <ServerOff className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-black text-sm block">One-Time Location Snapshot</strong>
                GPS coordinates are only requested when you explicitly choose to dispatch an emergency alert to your designated contacts, and are not tracked in the background.
              </div>
            </div>

            <div className="flex items-start gap-3 clay-surface bg-white/90 p-3.5 rounded-2xl border border-slate-200">
              <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-black text-sm block">Client-Controlled Emergency Contacts</strong>
                Your 1–5 designated contacts reside exclusively on your local device storage.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClearAll}
                className="clay-btn bg-red-50 hover:bg-red-100 text-rose-700 border border-red-200 w-full flex items-center justify-center gap-2 py-2.5 text-xs font-black cursor-pointer shadow-sm"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Clear All Ephemeral Session Logs</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={onClose}
                className="clay-btn bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 w-full py-2.5 text-xs font-bold cursor-pointer"
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
