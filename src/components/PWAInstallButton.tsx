import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="btn-emerald flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
        title="Install JeevanSetu as PWA for offline emergency use"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
          title="Install on iOS device"
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden sm:inline">Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl glass-card bg-white p-6 border border-slate-200 text-slate-800 relative shadow-2xl">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-500 font-medium">Instant 1-tap emergency access</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <Share className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>1. Tap the <strong className="text-slate-900 font-bold">Share</strong> button at the bottom of Safari.</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <PlusSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>2. Scroll down and select <strong className="text-slate-900 font-bold">"Add to Home Screen"</strong>.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl btn-emergency py-2.5 text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
