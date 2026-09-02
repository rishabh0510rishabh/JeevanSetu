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
      summary: 'QUICK EMERGENCY ALERT: Immediate campus assistance or check-in needed.',
      severity: 'HIGH',
      category: 'Emergency Dispatch',
      guidance: ['Student activated quick-alert button on JeevanSetu.'],
    });
    setIsAlertModalOpen(true);
  };

  const handleLanguageChange = (code: string) => {
    setPreferredLang(code);
    setPreferredLanguage(code);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* 1. Persistent Safety Disclaimer Banner per PRD 6.1 */}
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

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">JeevanSetu</span>
            <span>•</span>
            <span>Accessible Multimodal Health &amp; Safety Companion</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-slate-400 hover:text-slate-300 underline"
            >
              Privacy &amp; Data Guarantees
            </button>
            <span>•</span>
            <span>Powered by Gemini Multimodal AI</span>
          </div>
        </div>
      </footer>

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
