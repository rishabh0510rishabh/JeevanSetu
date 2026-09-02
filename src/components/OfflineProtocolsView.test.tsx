import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OfflineProtocolsView } from './OfflineProtocolsView';

describe('OfflineProtocolsView Component', () => {
  const defaultProps = {
    onOpenDialer: vi.fn(),
    onOpenAlertModal: vi.fn(),
    emergencyNumber: '911',
  };

  it('renders offline protocols banner and search input', () => {
    render(<OfflineProtocolsView {...defaultProps} />);
    expect(screen.getByText(/Instant Offline Emergency Protocols/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search burns, bleeding, CPR/i)).toBeInTheDocument();
  });

  it('filters protocols dynamically based on search query', () => {
    render(<OfflineProtocolsView {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText(/Search burns, bleeding, CPR/i);
    fireEvent.change(searchInput, { target: { value: 'Sprains' } });

    expect(screen.getAllByText(/Sprains, Strains & Fractures/i).length).toBeGreaterThan(0);
  });

  it('displays category pills and switches category filter', () => {
    render(<OfflineProtocolsView {...defaultProps} />);
    const burnsPill = screen.getByRole('button', { name: 'Burns' });
    fireEvent.click(burnsPill);

    const burnElements = screen.getAllByText(/Thermal & Heat Burns/i);
    expect(burnElements.length).toBeGreaterThan(0);
  });
});
