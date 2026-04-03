import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PatientProfilePage from './PatientProfilePage';

global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
global.window.scrollTo = vi.fn();

describe('PatientProfilePage Component', () => {
  const mockRequestData = { patientId: 'pat-999', patientName: 'Kamal Silva', email: 'kamal@example.com', bloodGroup: 'O+' };

  test('renders patient information', async () => {
    render(<PatientProfilePage requestData={mockRequestData} onBack={vi.fn()} />);
    await waitFor(() => {
        expect(screen.getByText(mockRequestData.patientName + "'s Profile")).toBeInTheDocument();
    });
  });
});