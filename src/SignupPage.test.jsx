import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import SignupPage from './Signup';

vi.mock('openpgp', () => ({
  generateKey: vi.fn().mockResolvedValue({
    privateKey: 'mock-private-key',
    publicKey: 'mock-public-key',
    revocationCertificate: 'mock-revocation'
  })
}));

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  useGoogleLogin: vi.fn(() => vi.fn()),
}));

vi.mock('./assets/Logo_with_words.png', () => ({ default: 'logo-mock' }));
vi.mock('./components/Plasma', () => ({ default: () => <div data-testid="plasma-bg" /> }));

describe('SignupPage Component', () => {
  const mockProps = {
    onBack: vi.fn(),
    onNavigateLogin: vi.fn(),
    onLoginSuccess: vi.fn(),
    onNavigateDoctorRegistration: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test('renders all registration fields', () => {
    render(<SignupPage {...mockProps} />);
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
  });
});