import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// 1. Mock the major sub-components
vi.mock('./PatientDashboard', () => ({
  default: () => <div data-testid="patient-dashboard">Patient Dashboard Mock</div>
}));

vi.mock('./DoctorDashboard', () => ({
  default: () => <div data-testid="doctor-dashboard">Doctor Dashboard Mock</div>
}));

vi.mock('./patientLogin', () => ({
  default: () => <div data-testid="login-page">Login Page Mock</div>
}));

vi.mock('./Signup', () => ({
  default: () => <div data-testid="signup-page">Signup Page Mock</div>
}));

// Mock WebGL shaders which are not supported in JS DOM
vi.mock('@paper-design/shaders-react', () => ({
  ShaderGradientCanvas: ({ children }) => <div data-testid="shader-canvas">{children}</div>,
  ShaderGradient: () => <div data-testid="shader-bg" />,
  Warp: () => <div data-testid="warp-shader" />
}));

// Mock the fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

// Mock Match Media
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('App Component Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Home view by default', async () => {
    localStorage.clear();
    render(<App />);
    await waitFor(() => {
      // It should display home hero section or similar. 
      // Using generic check that App loaded without crash
      expect(document.querySelector('nav')).not.toBeNull();
    });
  });
});