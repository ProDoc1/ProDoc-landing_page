import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import DoctorDashboard from './DoctorDashboard';

vi.mock('./utils/cryptoDetails', () => ({
  decryptFile: vi.fn(() => Promise.resolve('decrypted-content-url')),
  getMimeTypeFromUrl: vi.fn(() => 'image/png'),
}));

vi.mock('./assets/doctor.png', () => ({ default: 'doctor-image-mock' }));
vi.mock('./components/Navbar', () => ({
  default: ({ onLogout }) => (
    <nav data-testid="navbar">
      <button onClick={onLogout}>Logout</button>
    </nav>
  ),
}));

describe('DoctorDashboard Component', () => {
  const mockUser = {
    full_name: "Dr. Anura Bandara",
    specialty: "Oncologist",
    years_of_experience: 18,
    is_verified: true,
    email: "anura@prodoc.lk"
  };

  const mockProps = {
    user: mockUser,
    onLogout: vi.fn(),
    onNavigateHome: vi.fn(),
    onViewPatientProfile: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<DoctorDashboard {...mockProps} />);
    expect(container).toBeTruthy();
  });
});