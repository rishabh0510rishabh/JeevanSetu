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
    <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-lg sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand with Clay Emblem */}
          <div
            onClick={() => onSelectTab('first-aid')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-400 p-0.5 shadow-md shadow-red-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1 font-['Plus_Jakarta_Sans']">
                  jeevansetu
                </span>
                <span className="clay-badge bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 tracking-wider uppercase border border-red-200">
                  Emergency
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Accessible Multimodal Health &amp; Safety Companion
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Online/Offline status badge */}
            <div
              className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                  : 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Online AI Active</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700" />
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
              className="clay-btn-amber flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm cursor-pointer"
              title="Send one-tap emergency alert to pre-configured contacts"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden xs:inline">Alert Contacts</span>
            </button>

            {/* Prominent Emergency 911 Call Button */}
            <button
              id="header-emergency-call-btn"
              onClick={onOpenEmergencyModal}
              className="clay-btn-red flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm cursor-pointer ring-2 ring-red-300/60 animate-pulse"
              title="Direct call to Emergency Services / Campus Security"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Help</span>
            </button>

            {/* Privacy Modal trigger */}
            <button
              onClick={onOpenPrivacyModal}
              className="clay-btn bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 p-2 text-xs cursor-pointer border border-slate-200"
              title="Privacy & Ephemeral Session Information"
              aria-label="Privacy settings"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Claymorphism Tab Navigation Bar */}
        <nav
          aria-label="Primary Navigation"
          className="mt-2.5 flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-slate-200/70"
        >
          <button
            id="tab-first-aid"
            onClick={() => onSelectTab('first-aid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              currentTab === 'first-aid'
                ? 'clay-btn-red text-white'
                : 'clay-surface text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>First-Aid Guidance</span>
          </button>

          <button
            id="tab-translate"
            onClick={() => onSelectTab('translate')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              currentTab === 'translate'
                ? 'clay-btn-blue text-white'
                : 'clay-surface text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Translate Warnings</span>
          </button>

          <button
            id="tab-protocols"
            onClick={() => onSelectTab('protocols')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              currentTab === 'protocols'
                ? 'clay-btn-emerald text-white'
                : 'clay-surface text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Offline Protocols</span>
          </button>

          <button
            id="tab-contacts"
            onClick={() => onSelectTab('contacts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 relative cursor-pointer ${
              currentTab === 'contacts'
                ? 'clay-btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/30'
                : 'clay-surface text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Emergency Contacts</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold shadow-inner ${
              currentTab === 'contacts' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {contactCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
