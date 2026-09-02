import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
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
      // Auto-select all contacts by default
      setSelectedContactIds(contacts.map((c) => c.id));
      setSentResult(null);
      // Auto-request one-time location snapshot
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
        situationSummary: situationSummary || 'Medical emergency situation reported on campus',
        severity,
        category: category || 'Emergency First-Aid',
        guidanceGiven: guidanceGiven.length > 0 ? guidanceGiven : ['Initiated emergency assistance via JeevanSetu.'],
        location,
        notes: customNote,
      });

      // Save to local alert records
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
        notes: customNote,
      });

      setSentResult(res);
    } catch (err: any) {
      alert(`Error dispatching alert: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const targetContacts = contacts.filter((c) => selectedContactIds.includes(c.id));
  const locString = location?.mapsUrl
    ? `Location: ${location.mapsUrl}`
    : location?.approximateAddress
    ? `Location: ${location.approximateAddress}`
    : 'Location snapshot not provided';

  const fullMessageBody = `EMERGENCY ALERT via JeevanSetu:
Severity: ${severity}
Situation: ${situationSummary || 'Emergency situation on campus'}
${locString}
Time: ${new Date().toLocaleString()}
Top Guidance:
${guidanceGiven.slice(0, 2).map((s, i) => `${i + 1}. ${s}`).join('\n')}
${customNote ? `Note: ${customNote}` : ''}`;

  const mailtoUrl = `mailto:${targetContacts.map((c) => c.email).filter(Boolean).join(',')}?subject=${encodeURIComponent(
    `🚨 [EMERGENCY ALERT] ${severity} - JeevanSetu`
  )}&body=${encodeURIComponent(fullMessageBody)}`;

  const smsUrl = `sms:${targetContacts.map((c) => c.phone).filter(Boolean).join(',')}?&body=${encodeURIComponent(
    fullMessageBody
  )}`;

  return (
    <div
      id="alert-dispatch-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/50 shadow-2xl p-4 sm:p-6 text-slate-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Emergency Contact Alert</h2>
            <p className="text-xs text-amber-400 font-medium">Instant structured alert with situation &amp; location</p>
          </div>
        </div>

        {sentResult ? (
          /* Confirmation View */
          <div className="space-y-4 py-2 text-center animate-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              sentResult.dispatchMethod === 'webhook'
                ? 'bg-emerald-600/20 border-2 border-emerald-500 text-emerald-400'
                : 'bg-amber-600/20 border-2 border-amber-500 text-amber-400'
            }`}>
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {sentResult.dispatchMethod === 'webhook'
                  ? 'Emergency Alert Dispatched via Webhook'
                  : 'Demo Mode: Alert Simulated Successfully'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                {sentResult.dispatchMethod === 'webhook'
                  ? 'Payload forwarded to your configured emergency webhook endpoint.'
                  : 'Simulated alert delivery completed. Note: In demo mode, no real SMS or email was transmitted automatically.'}
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-left text-xs font-mono text-slate-300 space-y-1.5">
              <div>
                <strong className="text-slate-400">Mode: </strong>
                <span className={sentResult.dispatchMethod === 'webhook' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {sentResult.dispatchMethod === 'webhook' ? 'Live Webhook Active' : 'Demo Mode (Simulated Dispatch)'}
                </span>
              </div>
              <div><strong className="text-slate-400">Delivery Status:</strong> {sentResult.deliveryStatus === 'sent' ? 'Webhook HTTP 200 OK' : 'Simulated (Safe Demo Mode)'}</div>
              <div><strong className="text-slate-400">Target Contacts:</strong> {targetContacts.map(c => c.name).join(', ')} ({targetContacts.length})</div>
              <div><strong className="text-slate-400">Alert ID:</strong> {sentResult.alertId}</div>
              <div><strong className="text-slate-400">Timestamp:</strong> {new Date(sentResult.timestamp).toLocaleTimeString()}</div>
              {sentResult.notes && (
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 font-sans">
                  ℹ️ {sentResult.notes}
                </div>
              )}
            </div>

            {/* Direct Device Action Links */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-slate-300">
                To send a real message now, tap your device app:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={smsUrl}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open in SMS</span>
                </a>
                <a
                  href={mailtoUrl}
                  className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition shadow"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Email</span>
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              Done &amp; Return to Guidance
            </button>
          </div>
        ) : (
          /* Dispatch Form */
          <div className="space-y-4">
            {/* Situation Context preview */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 uppercase tracking-wider font-bold">Situation Summary</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    severity === 'CRITICAL_EMERGENCY'
                      ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                      : severity === 'HIGH'
                      ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {severity}
                </span>
              </div>
              <p className="text-slate-200 font-medium">{situationSummary || 'Emergency reported on campus'}</p>
            </div>

            {/* One-time Location Snapshot Section */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-white">One-Time Location Snapshot</span>
                </div>
                <button
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Refresh'}</span>
                </button>
              </div>

              {isLocating ? (
                <div className="text-xs text-slate-400 flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>Acquiring GPS coordinates from browser...</span>
                </div>
              ) : location?.error ? (
                <div className="text-xs text-amber-300 flex items-center gap-1.5 py-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{location.error} (Alert will send without GPS)</span>
                </div>
              ) : location?.latitude ? (
                <div className="text-xs space-y-1 text-slate-300">
                  <p className="font-semibold text-emerald-400">
                    {location.approximateAddress || `GPS: ${location.latitude.toFixed(5)}, ${location.longitude?.toFixed(5)}`}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Accuracy: ±{location.accuracy}m</span>
                    {location.mapsUrl && (
                      <a
                        href={location.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>View Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Location not captured.</p>
              )}
            </div>

            {/* Target Emergency Contacts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300">Select Recipients to Notify</label>
                <span className="text-xs text-slate-400">
                  {selectedContactIds.length}/{contacts.length} Selected
                </span>
              </div>

              {contacts.length === 0 ? (
                <div className="bg-slate-800/60 p-3 rounded-xl text-xs text-amber-300">
                  No emergency contacts configured. Please add contacts in the Emergency Contacts tab.
                </div>
              ) : (
                <div className="space-y-2">
                  {contacts.map((c) => {
                    const isSelected = selectedContactIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleToggleContact(c.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-slate-800 border-amber-500/60'
                            : 'bg-slate-900/60 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 bg-slate-900 border-slate-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{c.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {c.relationship} • {c.phone || c.email}
                            </div>
                          </div>
                        </div>
                        {c.isPrimary && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Optional Additional Note */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Add Instant Note / Room Number (Optional)
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. In Science Hall Room 304, bleeding under control"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Privacy & Dispatch Safety Notice */}
            <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Contacts receive a structured alert immediately without needing the app installed. Location snapshot is shared one-time only.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs sm:text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || selectedContactIds.length === 0}
                className="flex-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white py-3 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-900/40 active:scale-95 transition"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Dispatching Alert...' : 'Send Emergency Alert Now'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
