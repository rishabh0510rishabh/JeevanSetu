import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header Component', () => {
  const defaultProps = {
    currentTab: 'first-aid' as const,
    onSelectTab: vi.fn(),
    onOpenEmergencyModal: vi.fn(),
    onOpenQuickAlert: vi.fn(),
    onOpenPrivacyModal: vi.fn(),
    contactCount: 3,
  };

  it('renders JeevanSetu brand title and badge', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('JeevanSetu')).toBeInTheDocument();
    expect(screen.getByText('Emergency AI')).toBeInTheDocument();
  });

  it('displays the contact count in the Emergency Contacts tab', () => {
    render(<Header {...defaultProps} contactCount={4} />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('triggers onSelectTab when clicking a navigation tab', () => {
    const handleSelectTab = vi.fn();
    render(<Header {...defaultProps} onSelectTab={handleSelectTab} />);

    const translateTab = screen.getByRole('button', { name: /Translate Warnings/i });
    fireEvent.click(translateTab);
    expect(handleSelectTab).toHaveBeenCalledWith('translate');
  });

  it('triggers onOpenEmergencyModal when clicking Call Help', () => {
    const handleOpenDialer = vi.fn();
    render(<Header {...defaultProps} onOpenEmergencyModal={handleOpenDialer} />);

    const callBtn = screen.getByRole('button', { name: /Call Help/i });
    fireEvent.click(callBtn);
    expect(handleOpenDialer).toHaveBeenCalledTimes(1);
  });

  it('triggers onOpenQuickAlert when clicking Alert Contacts', () => {
    const handleQuickAlert = vi.fn();
    render(<Header {...defaultProps} onOpenQuickAlert={handleQuickAlert} />);

    const alertBtn = screen.getByRole('button', { name: /Alert Contacts/i });
    fireEvent.click(alertBtn);
    expect(handleQuickAlert).toHaveBeenCalledTimes(1);
  });
});
