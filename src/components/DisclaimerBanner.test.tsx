import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DisclaimerBanner } from './DisclaimerBanner';

describe('DisclaimerBanner Component', () => {
  it('renders the persistent medical safety disclaimer text', () => {
    render(<DisclaimerBanner emergencyNumber="911" onOpenDialer={() => {}} />);
    expect(screen.getByText(/Safety Notice:/i)).toBeInTheDocument();
    expect(screen.getByText(/First-aid stabilization bridge tool/i)).toBeInTheDocument();
  });

  it('displays the configured emergency phone number', () => {
    render(<DisclaimerBanner emergencyNumber="911" onOpenDialer={() => {}} />);
    expect(screen.getByText(/Call 911 Now/i)).toBeInTheDocument();
  });

  it('triggers onOpenDialer callback when the call button is clicked', () => {
    const handleDialer = vi.fn();
    render(<DisclaimerBanner emergencyNumber="911" onOpenDialer={handleDialer} />);
    const button = screen.getByRole('button', { name: /Call emergency number 911/i });
    fireEvent.click(button);
    expect(handleDialer).toHaveBeenCalledTimes(1);
  });
});
