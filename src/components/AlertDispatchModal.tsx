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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg clay-card p-5 sm:p-7 text-slate-800 relative max-h-[92vh] overflow-y-auto border border-amber-300">
        <button
          onClick={onClose}
          className="clay-btn bg-white hover:bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-slate-800 absolute top-4 right-4 cursor-pointer border border-slate-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm shadow-amber-500/20">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Emergency Contact Alert</h2>
            <p className="text-xs text-amber-800 font-bold">Instant structured alert with situation &amp; location</p>
          </div>
        </div>

        {sentResult ? (
          /* Confirmation View */
          <div className="space-y-4 py-2 text-center animate-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              sentResult.dispatchMethod === 'webhook'
                ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700 shadow-emerald-500/20'
                : 'bg-amber-100 border-2 border-amber-500 text-amber-700 shadow-amber-500/20'
            }`}>
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {sentResult.dispatchMethod === 'webhook'
                  ? 'Emergency Alert Dispatched via Webhook'
                  : 'Demo Mode: Alert Simulated Successfully'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-medium">
                {sentResult.dispatchMethod === 'webhook'
                  ? 'Payload forwarded to your configured emergency webhook endpoint.'
                  : 'Simulated alert delivery completed. Note: In demo mode, no real SMS or email was transmitted automatically.'}
              </p>
            </div>

            <div className="clay-inset p-3.5 text-left text-xs font-mono text-slate-700 space-y-1.5 border border-slate-200">
              <div>
                <strong className="text-slate-500 font-sans">Mode: </strong>
                <span className={sentResult.dispatchMethod === 'webhook' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                  {sentResult.dispatchMethod === 'webhook' ? 'Live Webhook Active' : 'Demo Mode (Simulated Dispatch)'}
                </span>
              </div>
              <div><strong className="text-slate-500 font-sans">Delivery Status:</strong> {sentResult.deliveryStatus === 'sent' ? 'Webhook HTTP 200 OK' : 'Simulated (Safe Demo Mode)'}</div>
              <div><strong className="text-slate-500 font-sans">Target Contacts:</strong> {targetContacts.map(c => c.name).join(', ')} ({targetContacts.length})</div>
              <div><strong className="text-slate-500 font-sans">Alert ID:</strong> {sentResult.alertId}</div>
              <div><strong className="text-slate-500 font-sans">Timestamp:</strong> {new Date(sentResult.timestamp).toLocaleTimeString()}</div>
              {sentResult.notes && (
                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 font-sans">
                  ℹ️ {sentResult.notes}
                </div>
              )}
            </div>

            {/* Direct Device Action Links */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-bold text-slate-700">
                To send a real message now, tap your device app:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={smsUrl}
                  className="clay-btn-emerald py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open in SMS</span>
                </a>
                <a
                  href={mailtoUrl}
                  className="clay-btn-blue py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Email</span>
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="clay-btn bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 mt-4 w-full py-2.5 text-sm font-bold cursor-pointer"
            >
              Done &amp; Return to Guidance
            </button>
          </div>
        ) : (
          /* Dispatch Form */
          <div className="space-y-4">
            {/* Situation Context preview */}
            <div className="clay-surface bg-white/90 border border-slate-200 p-3.5 rounded-xl text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Situation Summary</span>
                <span
                  className={`px-2 py-0.5 rounded font-black uppercase text-[10px] ${
                    severity === 'CRITICAL_EMERGENCY'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : severity === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {severity}
                </span>
              </div>
              <p className="text-slate-900 font-bold">{situationSummary || 'Emergency reported on campus'}</p>
            </div>

            {/* One-time Location Snapshot Section */}
            <div className="clay-card-blue p-3.5 border border-sky-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-700" />
                  <span className="text-xs font-black text-sky-950">One-Time Location Snapshot</span>
                </div>
                <button
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Refresh'}</span>
                </button>
              </div>

              {isLocating ? (
                <div className="text-xs text-sky-800 flex items-center gap-2 py-1 font-medium">
                  <div className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
                  <span>Acquiring GPS coordinates from browser...</span>
                </div>
              ) : location?.error ? (
                <div className="text-xs text-amber-800 flex items-center gap-1.5 py-1 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{location.error} (Alert will send without GPS)</span>
                </div>
              ) : location?.latitude ? (
                <div className="text-xs space-y-1 text-slate-800">
                  <p className="font-bold text-sky-900">
                    {location.approximateAddress || `GPS: ${location.latitude.toFixed(5)}, ${location.longitude?.toFixed(5)}`}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                    <span>Accuracy: ±{location.accuracy}m</span>
                    {location.mapsUrl && (
                      <a
                        href={location.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-700 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        <span>View Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 font-medium">Location not captured.</p>
              )}
            </div>

            {/* Target Emergency Contacts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Select Recipients to Notify</label>
                <span className="text-xs text-slate-500 font-bold">
                  {selectedContactIds.length}/{contacts.length} Selected
                </span>
              </div>

              {contacts.length === 0 ? (
                <div className="clay-card-amber p-3 text-xs text-amber-900 font-semibold border border-amber-300">
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
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition ${
                          isSelected
                            ? 'clay-surface bg-amber-50 border-2 border-amber-400'
                            : 'clay-surface bg-white/70 border border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 border-slate-300 cursor-pointer"
                          />
                          <div>
                            <div className="text-xs font-black text-slate-900">{c.name}</div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              {c.relationship} • {c.phone || c.email}
                            </div>
                          </div>
                        </div>
                        {c.isPrimary && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
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
              <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                Add Instant Note / Room Number (Optional)
              </label>
              <div className="clay-inset p-1">
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. In Science Hall Room 304, bleeding under control"
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Privacy & Dispatch Safety Notice */}
            <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">
                Contacts receive a structured alert immediately without needing the app installed. Location snapshot is shared one-time only.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClose}
                className="clay-btn bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex-1 py-3 text-xs sm:text-sm font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || selectedContactIds.length === 0}
                className="clay-btn-amber flex-2 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-black disabled:opacity-50 cursor-pointer"
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
