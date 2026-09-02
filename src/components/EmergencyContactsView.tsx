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
      <div className="clay-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-purple-500">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Designated Emergency Contacts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium leading-relaxed">
            Pre-configure 1 to 5 trusted people (Roommate, RA, Family, Campus Security). In any situation, alert them with a single tap including your current guidance and location snapshot.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSendTestAlert}
            className="clay-btn-amber px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Test Alert</span>
          </button>

          {!isAddingNew && contacts.length < 5 && (
            <button
              onClick={handleStartAdd}
              className="clay-btn bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Form Modal/Card */}
      {(isAddingNew || editingId) && (
        <div className="clay-card p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border border-purple-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-600" />
              <span>{isAddingNew ? 'Add New Emergency Contact' : 'Edit Contact Details'}</span>
            </h2>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-900 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">Full Name *</label>
              <div className="clay-inset p-1">
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">Relationship</label>
              <div className="clay-inset p-1">
                <select
                  value={formRel}
                  onChange={(e) => setFormRel(e.target.value as any)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
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
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">Phone Number (SMS Alert)</label>
              <div className="clay-inset p-1">
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">Email Address</label>
              <div className="clay-inset p-1">
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. roommate@campus.edu"
                  className="w-full bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="clay-btn bg-white hover:bg-slate-100 text-slate-600 px-4 py-2 text-xs font-bold border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContact}
              className="clay-btn bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-purple-500/30"
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
            className="clay-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200/80 transition"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  c.isPrimary
                    ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-sm'
                    : 'bg-purple-100 text-purple-700 border border-purple-300 shadow-sm'
                }`}
              >
                <Users className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">{c.name}</h3>
                  <span className="text-[11px] bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                    {c.relationship}
                  </span>
                  {c.isPrimary && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Primary Contact</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
                  {c.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{c.phone}</span>
                    </span>
                  )}
                  {c.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
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
                  className="clay-btn bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs px-3 py-1.5 border border-slate-200 cursor-pointer font-bold"
                  title="Make this primary contact"
                >
                  Make Primary
                </button>
              )}

              <button
                onClick={() => handleStartEdit(c)}
                className="clay-btn bg-white hover:bg-slate-100 p-2 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(c.id)}
                className="clay-btn bg-white hover:bg-red-50 p-2 text-rose-600 hover:text-rose-700 border border-slate-200 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Integration Mode Banner */}
      <div className="clay-card-amber p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border border-amber-300">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <div>
            <div className="font-black text-amber-950">
              Emergency Dispatch Channel: <span className="text-amber-800">Demo Simulation Active</span>
            </div>
            <div className="text-amber-900 text-[11px] mt-0.5 font-medium leading-relaxed">
              Alerts simulate delivery safely. No real SMS or email is transmitted automatically. Real webhooks can be attached via <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono font-bold">EMERGENCY_WEBHOOK_URL</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Info & Privacy Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 clay-surface bg-white/80 border border-slate-200 p-4 rounded-2xl text-xs text-slate-600">
        <div className="flex items-center gap-2 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Emergency contacts are securely stored on your device and are never shared or sold.
          </span>
        </div>
        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition text-xs shrink-0 font-bold underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Defaults</span>
        </button>
      </div>
    </div>
  );
};
