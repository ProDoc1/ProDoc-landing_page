import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import AdminDashboard from './AdminDashboard';

const mockFetchResponse = (data, ok = true) => {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
  });
};

describe('AdminDashboard Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn((url, options) => {
      if (url.includes('/api/reviews')) {
        if (options && options.method === 'PUT') {
            return mockFetchResponse({ success: true });
        }
        return mockFetchResponse([
          { id: 1, user_name: 'John Doe', doctor_name: 'Dr. Smith', overall: 4, comment: 'Great service!', status: 'pending', proof_url: 'http://example.com/proof.jpg' }
        ]);
      }
      if (url.includes('/api/admin-directory')) {
        return mockFetchResponse({
          users: [{ id: 101, full_name: 'Jane Doe', email: 'jane@example.com' }],
          doctors: [{ id: 201, full_name: 'Dr. Strange', email: 'strange@example.com', specialty: 'Sorcerer' }]
        });
      }
      if (url.includes('/api/doctor-request')) {
         if (options && options.method === 'PUT') {
            return mockFetchResponse({ success: true });
        }
        return mockFetchResponse([
          { id: 301, full_name: 'Dr. Newbie', slmc_number: '12345', specialty: 'Neurologist', status: 'pending', email: 'newbie@example.com' }
        ]);
      }
      return mockFetchResponse({});
    });
  });

  test('should render and display Moderation Hub data', async () => {
    render(<AdminDashboard onBack={vi.fn()} />);

    // Wait for the review to appear
    const reviewUser = await screen.findByText('John Doe');
    expect(reviewUser).toBeInTheDocument();
    
    // Check comment (using text matcher string because it's wrapped in quotes)
    const reviewComment = screen.getByText(/"Great service!"/);
    expect(reviewComment).toBeInTheDocument();
  });

  test('should verify doctor request in Doctor Requests tab', async () => {
    render(<AdminDashboard onBack={vi.fn()} />);
    
    // Wait for initial loading to complete
    await screen.findByText('John Doe');

    // Switch to Doctor Requests tab
    const requestsTab = screen.getByText('Doctor Requests', { selector: 'button' });
    fireEvent.click(requestsTab);

    // Verify Dr. Newbie request is shown
    const newDocStr = await screen.findByText('Dr. Newbie');
    expect(newDocStr).toBeInTheDocument();
  });

  test('should search and find users in Directory Hub tab', async () => {
    render(<AdminDashboard onBack={vi.fn()} />);

    // Wait for initial loading to complete
    await screen.findByText('John Doe');

    // Switch to Directory Hub tab
    const directoryTab = screen.getByText('Directory Hub', { selector: 'button' });
    fireEvent.click(directoryTab);

    // Find Search input
    const searchInput = await screen.findByPlaceholderText(/Search patients by name, email, or ID.../i);
    fireEvent.change(searchInput, { target: { value: 'strange' } });

    // Verify Dr. Strange is shown and Jane Doe is not
    expect(screen.getByText('Dr. Strange')).toBeInTheDocument();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  test('should allow approving a review', async () => {
    render(<AdminDashboard onBack={vi.fn()} />);

    // Wait for the review to appear
    await screen.findByText('John Doe');
    
    const approveBtn = screen.getByRole('button', { name: 'Approve', exact: true });
    expect(approveBtn).toBeInTheDocument();
    
    // Click approve
    fireEvent.click(approveBtn);

    // Global fetch should have been called with PUT and /api/reviews
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/reviews', expect.objectContaining({
            method: 'PUT'
        }));
    });
  });
});
