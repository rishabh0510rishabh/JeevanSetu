import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmergencyContactsView } from './EmergencyContactsView';
import { EmergencyContact } from '../types';

describe('EmergencyContactsView Component', () => {
  const mockContacts: EmergencyContact[] = [
    {
      id: 'contact-1',
      name: 'Alex Rivera',
      phone: '+1 (555) 234-5678',
      email: 'alex@campus.edu',
      relationship: 'Roommate',
      isPrimary: true,
    },
    {
      id: 'contact-2',
      name: 'Morgan Chen (RA)',
      phone: '+1 (555) 345-6789',
      email: 'ra.morgan@campus.edu',
      relationship: 'RA / Dorm Staff',
      isPrimary: false,
    },
  ];

  const defaultProps = {
    contacts: mockContacts,
    onUpdateContacts: vi.fn(),
    onTriggerTestAlert: vi.fn(),
  };

  it('renders the contacts header and configured contact cards', () => {
    render(<EmergencyContactsView {...defaultProps} />);
    expect(screen.getByText(/Emergency Contact Dispatch Network/i)).toBeInTheDocument();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('Morgan Chen (RA)')).toBeInTheDocument();
  });

  it('indicates Primary SOS contact badge on the designated primary contact', () => {
    render(<EmergencyContactsView {...defaultProps} />);
    expect(screen.getByText(/Primary SOS/i)).toBeInTheDocument();
  });

  it('triggers test alert callback when clicking Test Alert button', () => {
    const handleTriggerTestAlert = vi.fn();
    render(<EmergencyContactsView {...defaultProps} onTriggerTestAlert={handleTriggerTestAlert} />);

    const testAlertButtons = screen.getAllByRole('button', { name: /Test Alert/i });
    fireEvent.click(testAlertButtons[0]);

    expect(handleTriggerTestAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        summary: expect.stringContaining('Alex Rivera'),
        severity: 'LOW',
      })
    );
  });

  it('opens add contact drawer when clicking Add Contact button', () => {
    render(<EmergencyContactsView {...defaultProps} />);
    const addBtn = screen.getByRole('button', { name: /Add Contact/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Add New Emergency Contact/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Alex Rivera/i)).toBeInTheDocument();
  });
});
