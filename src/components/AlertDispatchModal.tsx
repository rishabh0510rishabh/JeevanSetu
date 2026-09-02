import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  MapPin,
  Send,
  CheckCircle2,
  RefreshCw,
  Radio,
} from 'lucide-react';
import { EmergencyContact, LocationSnapshot, SeverityLevel } from '../types';
import { captureOneTimeLocation } from '../services/location';
import { dispatchEmergencyAlert } from '../services/api';
import { saveStoredAlert } from '../services/storage';

interface AlertDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  situationSummary: string;
  severity: SeverityLevel;
  category: string;
  guidanceGiven: string[];
}

export const AlertDispatchModal: React.FC<AlertDispatchModalProps> = ({
  isOpen,
  onClose,
  contacts,
  situationSummary,
  severity,
  category,
  guidanceGiven,
}) => {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationSnapshot | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentResult, setSentResult] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedContactIds(contacts.map((c) => c.id));
      setSentResult(null);
      requestLocation();
    }
  }, [isOpen, contacts]);

  const requestLocation = async () => {
    setIsLocating(true);
    const loc = await captureOneTimeLocation();
    setLocation(loc);
    setIsLocating(false);
  };

  const handleToggleContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    const selectedContacts = contacts.filter((c) => selectedContactIds.includes(c.id));
    if (selectedContacts.length === 0) {
      alert('Please select at least one emergency contact to notify.');
      return;
    }

    setIsSending(true);
    try {
      const res = await dispatchEmergencyAlert({
        contacts: selectedContacts,
        situationSummary: situationSummary || 'Emergency situation reported via JeevanSetu',
        severity,
        category: category || 'Emergency First-Aid',
        guidanceGiven: guidanceGiven.length > 0 ? guidanceGiven : ['Initiated emergency assistance.'],
        location,
        notes: customNote,
      });

      saveStoredAlert({
        id: res.alertId,
        timestamp: res.timestamp,
        situationSummary: situationSummary || 'Emergency situation',
        severity,
        category: category || 'General',
        guidanceGiven,
        location,
        contactsSentTo: selectedContacts,
        deliveryStatus: res.deliveryStatus,
        dispatchMethod: res.dispatchMethod,
        notes: res.notes || customNote || 'Emergency alert dispatched.',
      });

      setSentResult(res);
    } catch (err: any) {
      alert(`Alert dispatch failed: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="alert-dispatch-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 absolute top-5 right-5 cursor-pointer border border-slate-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Emergency Dispatch Console</h2>
            <p className="text-xs text-amber-700 font-bold">Transmit 1-tap incident status &amp; GPS snapshot to contacts</p>
          </div>
        </div>

        {sentResult ? (
          /* Sent Confirmation Screen */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-slate-900">Emergency Dispatch Sent!</h3>
              <p className="text-xs text-emerald-800 font-medium">
                {sentResult.notes || 'Alert successfully dispatched to designated contact endpoints.'}
              </p>
              <div className="text-[11px] text-slate-500 font-mono pt-1">
                Audit ID: {sentResult.alertId} • {new Date(sentResult.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {/* Formatted Message Payload Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Dispatched Payload Summary:
              </span>
              <pre className="text-xs font-mono text-slate-800 bg-white p-3 rounded-xl overflow-x-auto whitespace-pre-wrap border border-slate-200 shadow-2xs">
                {sentResult.formattedMessage}
              </pre>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl btn-emerald text-white font-black text-sm cursor-pointer shadow-md"
            >
              Done &amp; Close Console
            </button>
          </div>
        ) : (
          /* Compose & Send Screen */
          <div className="space-y-5">
            {/* Situation Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Incident Category: {category}
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                    severity === 'CRITICAL_EMERGENCY'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : severity === 'HIGH'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {severity.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">{situationSummary}</p>
            </div>

            {/* Recipient Selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Select Recipients ({selectedContactIds.length} of {contacts.length}):
              </label>
              {contacts.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500">
                  No emergency contacts configured yet. Go to the Emergency Contacts tab to add roommates or family.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contacts.map((contact) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <div
                        key={contact.id}
                        onClick={() => handleToggleContact(contact.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold block truncate text-slate-900">{contact.name}</span>
                          <span className="text-[10px] text-slate-500 block truncate font-medium">{contact.relationship}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleContact(contact.id)}
                          className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* One-Time Location Snapshot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>One-Time Emergency GPS Snapshot:</span>
                </span>
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>Refresh GPS</span>
                </button>
              </div>

              {location ? (
                <div className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                  <span>
                    Lat: {location.latitude?.toFixed(5)}, Long: {location.longitude?.toFixed(5)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-sans font-bold">
                    ±{location.accuracy?.toFixed(0)}m accuracy
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  {isLocating ? 'Acquiring GPS coordinates...' : 'GPS unavailable or permission denied.'}
                </div>
              )}
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Note (Optional):
              </label>
              <div className="glass-inset rounded-xl p-1 border border-slate-300 bg-white">
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. 'I am in Room 304 of Chemistry Hall with Alex'"
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Dispatch Action Button */}
            <div className="pt-2">
              <button
                onClick={handleSend}
                disabled={isSending || selectedContactIds.length === 0}
                className="w-full btn-amber py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none shadow-md"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Broadcasting Alert...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Emergency Alert ({selectedContactIds.length} Contacts)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
