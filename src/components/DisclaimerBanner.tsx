import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';

interface DisclaimerBannerProps {
  emergencyNumber: string;
  onOpenDialer: () => void;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  emergencyNumber,
  onOpenDialer,
}) => {
  return (
    <aside
      id="jeevansetu-persistent-disclaimer"
      className="bg-amber-50 border-b border-amber-200/90 text-amber-950 px-3 sm:px-4 py-2 text-xs font-medium sticky top-0 z-40 backdrop-blur-md shadow-2xs"
      aria-label="Medical safety notice"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-left">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-amber-900">Safety Notice:</span>
            <span className="text-amber-800 text-[11px] sm:text-xs">
              First-aid stabilization bridge tool. Call emergency services immediately for life-threatening situations.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-amber-700 hidden md:inline text-[11px] font-semibold">Immediate danger?</span>
          <button
            onClick={onOpenDialer}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black btn-emergency cursor-pointer shrink-0 shadow-xs"
            aria-label={`Call emergency number ${emergencyNumber}`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call {emergencyNumber} Now</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
