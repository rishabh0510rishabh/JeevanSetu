import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection Component', () => {
  const defaultProps = {
    onOpenDialer: vi.fn(),
    onOpenAlertModal: vi.fn(),
    onSelectTab: vi.fn(),
    onApplyPreset: vi.fn(),
    emergencyNumber: '911',
  };

  it('renders the main emergency headline and value propositions', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText(/Instant First-Aid Guidance & Emergency Triage/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero-Latency Plain Steps/i)).toBeInTheDocument();
    expect(screen.getByText(/10\+ Languages OCR/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Offline Ready/i)).toBeInTheDocument();
  });

  it('triggers emergency call action when clicking Call Emergency button', () => {
    const handleDialer = vi.fn();
    render(<HeroSection {...defaultProps} onOpenDialer={handleDialer} />);

    const callBtn = screen.getByRole('button', { name: /Call Emergency \(911\)/i });
    fireEvent.click(callBtn);
    expect(handleDialer).toHaveBeenCalledTimes(1);
  });

  it('triggers preset application when clicking an instant simulation scenario card', () => {
    const handleApplyPreset = vi.fn();
    render(<HeroSection {...defaultProps} onApplyPreset={handleApplyPreset} />);

    const presetBtn = screen.getByRole('button', { name: /Deep Kitchen Knife Cut/i });
    fireEvent.click(presetBtn);
    expect(handleApplyPreset).toHaveBeenCalledTimes(1);
  });
});
