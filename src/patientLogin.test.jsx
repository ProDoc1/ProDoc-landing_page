import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import LoginPage from './patientLogin';

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  useGoogleLogin: vi.fn(() => vi.fn()),
}));
vi.mock('./components/Plasma', () => ({ default: () => <div data-testid="plasma" /> }));

describe('LoginPage Component', () => {
  test('renders login tabs', () => {
    localStorage.clear();
    const { container } = render(<LoginPage onBack={vi.fn()} onNavigateSignup={vi.fn()} onLoginSuccess={vi.fn()} />);
    expect(container).toBeTruthy();
  });
});