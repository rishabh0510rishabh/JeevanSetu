import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Check,
  Star,
  Phone,
  Mail,
  Send,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { EmergencyContact, SeverityLevel } from '../types';
import { DEFAULT_CONTACTS, saveStoredContacts } from '../services/storage';

interface EmergencyContactsViewProps {
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  onTriggerTestAlert: (context: {
    summary: string;
    severity: SeverityLevel;
    category: string;
    guidance: string[];
  }) => void;
}

export const EmergencyContactsView: React.FC<EmergencyContactsViewProps> = ({
  contacts,
  onUpdateContacts,
  onTriggerTestAlert,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRel, setFormRel] = useState<EmergencyContact['relationship']>('Roommate');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormRel('Roommate');
  };

  const handleStartEdit = (c: EmergencyContact) => {
    setEditingId(c.id);
    setIsAddingNew(false);
    setFormName(c.name);
    setFormPhone(c.phone);
    setFormEmail(c.email);
    setFormRel(c.relationship);
  };

  const handleSaveContact = () => {
    if (!formName.trim()) {
      alert('Please enter contact name.');
      return;
    }
    if (!formPhone.trim() && !formEmail.trim()) {
      alert('Please enter at least a phone number or email address.');
      return;
    }

    let updated: EmergencyContact[];
    if (isAddingNew) {
      if (contacts.length >= 5) {
        alert('Maximum of 5 emergency contacts can be configured.');
        return;
      }
      const newContact: EmergencyContact = {
        id: `contact-${Date.now()}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        relationship: formRel,
        isPrimary: contacts.length === 0,
      };
      updated = [...contacts, newContact];
    } else if (editingId) {
      updated = contacts.map((c) =>
        c.id === editingId
          ? {
              ...c,
              name: formName.trim(),
              phone: formPhone.trim(),
              email: formEmail.trim(),
              relationship: formRel,
            }
          : c
      );
    } else {
      return;
    }

    onUpdateContacts(updated);
    saveStoredContacts(updated);
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this emergency contact?')) {
      const updated = contacts.filter((c) => c.id !== id);
      if (updated.length > 0 && !updated.some((c) => c.isPrimary)) {
        updated[0].isPrimary = true;
      }
      onUpdateContacts(updated);
      saveStoredContacts(updated);
    }
  };

  const handleSetPrimary = (id: string) => {
    const updated = contacts.map((c) => ({
      ...c,
      isPrimary: c.id === id,
    }));
    onUpdateContacts(updated);
    saveStoredContacts(updated);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset contacts to campus demo defaults (Roommate, RA, Security)?')) {
      onUpdateContacts(DEFAULT_CONTACTS);
      saveStoredContacts(DEFAULT_CONTACTS);
    }
  };

  const handleSendTestAlert = () => {
    onTriggerTestAlert({
      summary: 'TEST ALERT: Campus safety companion drill verification',
      severity: 'LOW',
      category: 'System Test',
      guidance: [
        'This is a verified test alert sent from JeevanSetu.',
        'No emergency assistance is needed. Contacts configuration is functional.',
      ],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg sm:text-xl font-extrabold text-white">
              Designated Emergency Contacts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Pre-configure 1 to 3 trusted people (Roommate, RA, Family, Campus Security). In any situation, alert them with a single tap including your current guidance and location snapshot.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSendTestAlert}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send Test Alert</span>
          </button>

          {!isAddingNew && contacts.length < 5 && (
            <button
              onClick={handleStartAdd}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Form Modal/Card */}
      {(isAddingNew || editingId) && (
        <div className="bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" />
              <span>{isAddingNew ? 'Add New Emergency Contact' : 'Edit Contact Details'}</span>
            </h2>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Relationship</label>
              <select
                value={formRel}
                onChange={(e) => setFormRel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Roommate">Roommate</option>
                <option value="RA / Dorm Staff">RA / Dorm Staff</option>
                <option value="Parent / Family">Parent / Family</option>
                <option value="Campus Security">Campus Security</option>
                <option value="Friend">Friend</option>
                <option value="Doctor / Clinic">Doctor / Clinic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number (SMS Alert)</label>
              <input
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="e.g. roommate@campus.edu"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContact}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Save Contact</span>
            </button>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  c.isPrimary
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                }`}
              >
                <Users className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">{c.name}</h3>
                  <span className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                    {c.relationship}
                  </span>
                  {c.isPrimary && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>Primary Contact</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  {c.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{c.phone}</span>
                    </span>
                  )}
                  {c.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{c.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {!c.isPrimary && (
                <button
                  onClick={() => handleSetPrimary(c.id)}
                  className="text-xs text-slate-400 hover:text-amber-300 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-amber-500/40 transition"
                  title="Make this primary contact"
                >
                  Make Primary
                </button>
              )}

              <button
                onClick={() => handleStartEdit(c)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Integration Mode Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <div>
            <div className="font-bold text-slate-200">
              Emergency Dispatch Channel: <span className="text-amber-400">Demo Mode Active</span>
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Alerts simulate delivery safely. No real SMS or email is transmitted automatically. Real webhooks can be attached via <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">EMERGENCY_WEBHOOK_URL</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Info & Privacy Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400">
        <div className="flex items-center gap-2 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Emergency contacts are securely stored on your device and are never shared or sold.
          </span>
        </div>
        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition text-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Defaults</span>
        </button>
      </div>
    </div>
  );
};
