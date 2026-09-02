import React from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Bell,
  Wifi,
  WifiOff,
  Users,
  BookOpen,
  Globe,
  Activity,
  Lock,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  currentTab: 'first-aid' | 'translate' | 'protocols' | 'contacts';
  onSelectTab: (tab: 'first-aid' | 'translate' | 'protocols' | 'contacts') => void;
  onOpenEmergencyModal: () => void;
  onOpenQuickAlert: () => void;
  onOpenPrivacyModal: () => void;
  contactCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenEmergencyModal,
  onOpenQuickAlert,
  onOpenPrivacyModal,
  contactCount,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-xl sticky top-[37px] sm:top-[33px] z-30 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Emblem */}
          <div
            onClick={() => onSelectTab('first-aid')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            role="button"
            tabIndex={0}
            aria-label="Go to First-Aid Home"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-500 p-0.5 shadow-md shadow-rose-500/20 flex items-center justify-center transition-all group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-600 transition-transform group-hover:rotate-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                  JeevanSetu
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                  Emergency AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Accessible Multimodal Health &amp; Emergency Companion
              </p>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2">
            {/* Online / Offline Status Chip */}
            <div
              className={`hidden md:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md transition-colors ${
                isOnline
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-300 text-amber-800 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>Gemini Multimodal Active</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span>Offline Protocol Mode</span>
                </>
              )}
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* 1-Tap Alert Contacts Button */}
            <button
              id="header-quick-alert-btn"
              onClick={onOpenQuickAlert}
              className="btn-amber flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs"
              title="Broadcast 1-tap emergency dispatch to your contacts"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden xs:inline font-bold">Alert Contacts</span>
            </button>

            {/* Emergency Dial Trigger */}
            <button
              id="header-emergency-call-btn"
              onClick={onOpenEmergencyModal}
              className="btn-emergency flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm cursor-pointer glow-red shadow-xs"
              title="Immediate call to emergency services or 911"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="font-extrabold">Call Help</span>
            </button>

            {/* Privacy Shield Info Modal */}
            <button
              onClick={onOpenPrivacyModal}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
              title="Privacy, zero cloud retention & local logs"
              aria-label="Privacy guarantees"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Deck */}
        <nav
          aria-label="Primary Navigation"
          className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar"
        >
          <button
            id="tab-first-aid"
            onClick={() => onSelectTab('first-aid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              currentTab === 'first-aid'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            <Activity className={`w-4 h-4 ${currentTab === 'first-aid' ? 'text-white' : 'text-rose-600'}`} />
            <span>First-Aid Guidance</span>
          </button>

          <button
            id="tab-translate"
            onClick={() => onSelectTab('translate')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              currentTab === 'translate'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            <Globe className={`w-4 h-4 ${currentTab === 'translate' ? 'text-white' : 'text-sky-600'}`} />
            <span>Translate Warnings</span>
          </button>

          <button
            id="tab-protocols"
            onClick={() => onSelectTab('protocols')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              currentTab === 'protocols'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${currentTab === 'protocols' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Offline Protocols</span>
          </button>

          <button
            id="tab-contacts"
            onClick={() => onSelectTab('contacts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              currentTab === 'contacts'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            <Users className={`w-4 h-4 ${currentTab === 'contacts' ? 'text-white' : 'text-purple-600'}`} />
            <span>Emergency Contacts</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                currentTab === 'contacts'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {contactCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
