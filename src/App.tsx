import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Header } from './components/Header';
import { FirstAidView } from './components/FirstAidView';
import { WarningTranslateView } from './components/WarningTranslateView';
import { OfflineProtocolsView } from './components/OfflineProtocolsView';
import { EmergencyContactsView } from './components/EmergencyContactsView';
import { EmergencyDialerModal } from './components/EmergencyDialerModal';
import { AlertDispatchModal } from './components/AlertDispatchModal';
import { PrivacyInfoModal } from './components/PrivacyInfoModal';
import { EmergencyContact, SeverityLevel } from './types';
import {
  getStoredContacts,
  getPreferredLanguage,
  setPreferredLanguage,
  getCampusEmergencyNumber,
} from './services/storage';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'first-aid' | 'translate' | 'protocols' | 'contacts'>('first-aid');
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [preferredLang, setPreferredLang] = useState<string>('hi');
  const [emergencyNumber, setEmergencyNumber] = useState<string>('911');

  const [alertContext, setAlertContext] = useState<{
    summary: string;
    severity: SeverityLevel;
    category: string;
    guidance: string[];
  }>({
    summary: 'Emergency assistance requested via JeevanSetu',
    severity: 'HIGH',
    category: 'First-Aid Guidance',
    guidance: ['Initiated rapid first-aid companion.'],
  });

  useEffect(() => {
    setContacts(getStoredContacts());
    setPreferredLang(getPreferredLanguage());
    setEmergencyNumber(getCampusEmergencyNumber());
  }, []);

  const handleOpenAlertModalWithContext = (context: {
    summary: string;
    severity: SeverityLevel;
    category: string;
    guidance: string[];
  }) => {
    setAlertContext(context);
    setIsAlertModalOpen(true);
  };

  const handleQuickAlert = () => {
    setAlertContext({
      summary: 'QUICK EMERGENCY ALERT: Immediate assistance or check-in requested.',
      severity: 'HIGH',
      category: 'Emergency Dispatch',
      guidance: ['User activated quick-alert SOS button on JeevanSetu.'],
    });
    setIsAlertModalOpen(true);
  };

  const handleLanguageChange = (code: string) => {
    setPreferredLang(code);
    setPreferredLanguage(code);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Radial Gradient Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[15%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[25%] right-[-5%] w-[450px] h-[450px] bg-sky-200/35 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* 1. Safety Notice Ribbon */}
        <DisclaimerBanner
          emergencyNumber={emergencyNumber}
          onOpenDialer={() => setIsDialerOpen(true)}
        />

        {/* 2. Top App Navigation Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenEmergencyModal={() => setIsDialerOpen(true)}
          onOpenQuickAlert={handleQuickAlert}
          onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
          contactCount={contacts.length}
        />

        {/* 3. Main Dynamic Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {currentTab === 'first-aid' && (
            <FirstAidView
              onOpenDialer={() => setIsDialerOpen(true)}
              onOpenAlertModal={handleOpenAlertModalWithContext}
              onSelectTab={setCurrentTab}
              emergencyContacts={contacts}
              emergencyNumber={emergencyNumber}
            />
          )}

          {currentTab === 'translate' && (
            <WarningTranslateView
              onOpenAlertModal={handleOpenAlertModalWithContext}
              preferredLang={preferredLang}
              onLanguageChange={handleLanguageChange}
            />
          )}

          {currentTab === 'protocols' && (
            <OfflineProtocolsView
              onOpenDialer={() => setIsDialerOpen(true)}
              onOpenAlertModal={handleOpenAlertModalWithContext}
              emergencyNumber={emergencyNumber}
            />
          )}

          {currentTab === 'contacts' && (
            <EmergencyContactsView
              contacts={contacts}
              onUpdateContacts={setContacts}
              onTriggerTestAlert={handleOpenAlertModalWithContext}
            />
          )}
        </main>

        {/* 4. Modern Footer */}
        <footer className="mt-12 border-t border-slate-200/80 bg-white/80 backdrop-blur-xl py-6 px-4 text-xs text-slate-500 shadow-2xs">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">JeevanSetu</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Accessible Multimodal Health &amp; Safety First-Aid Companion</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-slate-600 hover:text-slate-900 transition underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-Retention Privacy Guarantees</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">Gemini 3.7 / 2.5 Flash</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals & Dialogs */}
      <EmergencyDialerModal
        isOpen={isDialerOpen}
        onClose={() => setIsDialerOpen(false)}
      />

      <AlertDispatchModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        contacts={contacts}
        situationSummary={alertContext.summary}
        severity={alertContext.severity}
        category={alertContext.category}
        guidanceGiven={alertContext.guidance}
      />

      <PrivacyInfoModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onSessionCleared={() => setContacts(getStoredContacts())}
      />
    </div>
  );
}

export default App;
