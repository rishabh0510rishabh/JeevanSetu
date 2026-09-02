import React from 'react';
import { ShieldAlert, PhoneCall, Bell, Wifi, WifiOff, Users, BookOpen, Globe, Activity, Lock } from 'lucide-react';
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
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 shadow-lg">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Brand */}
          <div
            onClick={() => onSelectTab('first-aid')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 p-0.5 shadow-lg shadow-red-900/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1 font-['Plus_Jakarta_Sans']">
                  jeevansetu
                </span>
                <span className="bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  Emergency
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Accessible Multimodal Health &amp; Safety Companion
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Online/Offline status */}
            <div
              className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                isOnline
                  ? 'bg-slate-900 border-slate-700 text-emerald-400'
                  : 'bg-amber-950/90 border-amber-500/50 text-amber-300 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online AI Active</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Offline Protocol Mode</span>
                </>
              )}
            </div>

            {/* In-app PWA install */}
            <PWAInstallButton />

            {/* Quick 1-Tap Alert Contacts Button */}
            <button
              id="header-quick-alert-btn"
              onClick={onOpenQuickAlert}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-amber-900/30"
              title="Send one-tap emergency alert to pre-configured contacts"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden xs:inline">Alert Contacts</span>
            </button>

            {/* Prominent Emergency 911 Call Button */}
            <button
              id="header-emergency-call-btn"
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-lg shadow-red-900/40 ring-2 ring-red-500/40 animate-pulse"
              title="Direct call to Emergency Services / Campus Security"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Help</span>
            </button>

            {/* Privacy Modal trigger */}
            <button
              onClick={onOpenPrivacyModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Privacy & Ephemeral Session Information"
              aria-label="Privacy settings"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="mt-3 flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800/80 pt-2"
        >
          <button
            id="tab-first-aid"
            onClick={() => onSelectTab('first-aid')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              currentTab === 'first-aid'
                ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>First-Aid Guidance</span>
          </button>

          <button
            id="tab-translate"
            onClick={() => onSelectTab('translate')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              currentTab === 'translate'
                ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Translate Warnings</span>
          </button>

          <button
            id="tab-protocols"
            onClick={() => onSelectTab('protocols')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              currentTab === 'protocols'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Offline Protocols</span>
          </button>

          <button
            id="tab-contacts"
            onClick={() => onSelectTab('contacts')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 relative ${
              currentTab === 'contacts'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Emergency Contacts</span>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {contactCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
