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
  RotateCcw,
  X,
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
      alert('Please enter a contact name.');
      return;
    }
    if (!formPhone.trim() && !formEmail.trim()) {
      alert('Please provide at least a phone number or email.');
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
    if (confirm('Delete this emergency contact from local records?')) {
      const updated = contacts.filter((c) => c.id !== id);
      onUpdateContacts(updated);
      saveStoredContacts(updated);
      if (editingId === id) {
        setEditingId(null);
      }
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
    if (confirm('Reset contacts to default simulated campus contacts?')) {
      onUpdateContacts(DEFAULT_CONTACTS);
      saveStoredContacts(DEFAULT_CONTACTS);
    }
  };

  const handleTestAlertContact = (c: EmergencyContact) => {
    onTriggerTestAlert({
      summary: `Test Check-In Alert for ${c.name} (${c.relationship})`,
      severity: 'LOW',
      category: 'Emergency Dispatch Verification',
      guidance: [
        'This is a verified test check-in confirming contact delivery channels and location accuracy.',
      ],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card-purple rounded-3xl p-5 sm:p-7 border border-purple-200 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-300 text-purple-700 flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Emergency Contact Dispatch Network
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Configure 1–5 designated campus contacts (Roommate, RA, Family, Campus Health). Contacts are stored strictly in your browser storage.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Reset to default sample contacts"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            {contacts.length < 5 && (
              <button
                onClick={handleStartAdd}
                className="btn-cyan flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Contact</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Contact Form Modal / Card */}
      {(isAddingNew || editingId) && (
        <div className="glass-card rounded-3xl p-5 sm:p-7 border border-purple-300 space-y-4 animate-in fade-in zoom-in duration-200 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-600" />
              <span>{isAddingNew ? 'Add New Emergency Contact' : 'Edit Contact Details'}</span>
            </h3>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="glass-inset rounded-xl p-1 border border-slate-300 bg-white">
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Alex Rivera (Roommate)"
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Relationship
              </label>
              <div className="glass-inset rounded-xl p-1 border border-slate-300 bg-white">
                <select
                  value={formRel}
                  onChange={(e) => setFormRel(e.target.value as any)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="Roommate">Roommate</option>
                  <option value="RA / Dorm Staff">RA / Dorm Staff</option>
                  <option value="Parent / Family">Parent / Family</option>
                  <option value="Campus Security">Campus Security</option>
                  <option value="Doctor / Clinic">Doctor / Clinic</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (SMS Alert)
              </label>
              <div className="glass-inset rounded-xl p-1 border border-slate-300 bg-white">
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="glass-inset rounded-xl p-1 border border-slate-300 bg-white">
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. alex.dorm@campus.edu"
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContact}
              className="btn-emerald px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Save Contact</span>
            </button>
          </div>
        </div>
      )}

      {/* Contacts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`glass-card rounded-3xl p-5 sm:p-6 border transition-all shadow-sm ${
              contact.isPrimary
                ? 'border-purple-300 bg-purple-50/40'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center font-black text-sm text-purple-700 shadow-2xs">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{contact.name}</h3>
                    {contact.isPrimary && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                        Primary SOS
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                    {contact.relationship}
                  </span>
                </div>
              </div>

              {/* Star Toggle for Primary */}
              <button
                onClick={() => handleSetPrimary(contact.id)}
                className={`p-1.5 rounded-xl border transition cursor-pointer ${
                  contact.isPrimary
                    ? 'bg-amber-100 text-amber-600 border-amber-300'
                    : 'bg-slate-100 text-slate-400 hover:text-slate-600 border-slate-200'
                }`}
                title={contact.isPrimary ? 'Primary SOS Contact' : 'Set as Primary SOS'}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="mt-4 space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200/80">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono">{contact.phone}</span>
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </a>
              )}
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => handleTestAlertContact(contact)}
                className="btn-amber px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Alert</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(contact)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                  title="Edit contact"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                  title="Delete contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
