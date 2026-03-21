import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; // Import 'vi' for mocking
import PatientDashboard from './PatientDashboard';

// FIX #1: Mock the fetch call at the top of the file
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

// FIX: Mock cryptoDetails so the test doesn't load OpenPGP
vi.mock('./utils/cryptoDetails', () => ({
  encryptFile: vi.fn(),
  decryptFile: vi.fn(),
  getMimeTypeFromUrl: vi.fn(() => 'application/pdf')
}));

describe('PatientDashboard Component', () => {
  it('should display the Medical Records heading', async () => {
    render(<PatientDashboard />);

    // FIX #2: Use getByRole + level: 3 to target the specific <h3> heading
    // FIX #3: Use waitFor + async/await to handle the background fetch state update
    await waitFor(() => {
      const headingElement = screen.getByRole('heading', {
        name: /Medical Records/i,
        level: 3
      });
      expect(headingElement).toBeInTheDocument();
    });
  });
});