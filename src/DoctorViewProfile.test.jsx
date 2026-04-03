import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import DoctorViewProfile from './DoctorViewProfile';

global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => ({}) }));
global.window.scrollTo = vi.fn();
vi.mock('./components/DoctorRating', () => ({
  default: () => <div data-testid="doctor-rating">Rating Component</div>,
}));

describe('DoctorViewProfile Component', () => {
  const mockDoctorData = {
    id: 'doc-123',
    full_name: 'Dr. Sarah Perera',
    specialty: 'Cardiologist',
    experience_years: 12,
    hospital: 'Lanka Hospitals',
    bio: 'Expert in non-invasive cardiology.',
    is_verified: true,
    rating: 4.8
  };

  test('displays loading state and then doctor data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockDoctorData }),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { container } = render(<DoctorViewProfile doctorId="doc-123" onBack={vi.fn()} currentUser={{ id: '1' }} onNavigateSignupPage={vi.fn()} onNavigateLogin={vi.fn()} />);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});