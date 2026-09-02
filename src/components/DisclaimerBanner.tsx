import React from 'react';
import { AlertCircle, PhoneCall } from 'lucide-react';

interface DisclaimerBannerProps {
  emergencyNumber: string;
  onOpenDialer: () => void;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  emergencyNumber,
  onOpenDialer,
}) => {
  return (
    <div
      id="jeevansetu-persistent-disclaimer"
      className="bg-[#fffbeb] border-b border-amber-200/90 text-amber-950 px-4 py-2 text-xs md:text-sm font-medium sticky top-0 z-40 backdrop-blur-md shadow-sm"
      role="alert"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="text-amber-900 font-bold">Immediate Safety Notice:</strong> This assistant is an immediate first-aid bridge tool, not a substitute for professional medical care.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-amber-800 hidden md:inline font-medium text-xs">Life-threatening emergency?</span>
          <button
            onClick={onOpenDialer}
            className="inline-flex items-center gap-1.5 clay-btn-red px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer"
            aria-label={`Call emergency number ${emergencyNumber}`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call {emergencyNumber} Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
