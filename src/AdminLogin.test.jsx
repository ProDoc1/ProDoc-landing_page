import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import AdminLogin from './AdminLogin';

const mockFetchResponse = (data, ok = true) => {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
  });
};

describe('AdminLogin Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  test('should render the login form correctly', () => {
    render(<AdminLogin onLoginSuccess={vi.fn()} />);
    
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter access code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify Identity/i })).toBeInTheDocument();
  });

  test('should handle successful login', async () => {
    const mockOnLoginSuccess = vi.fn();
    global.fetch.mockImplementation(() =>
        mockFetchResponse({ success: true, token: 'fake-token', user: { id: 1, name: 'SuperAdmin' } })
    );

    render(<AdminLogin onLoginSuccess={mockOnLoginSuccess} />);
    
    // Fill the inputs
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter access code'), { target: { value: 'securepassword' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Verify Identity/i }));
    
    // Expect fetch to have been called with correct arguments
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/login', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ email: 'admin', password: 'securepassword', userType: 'admin' })
        }));
    });
    
    // Check localStorage storage
    expect(localStorage.getItem('adminToken')).toBe('fake-token');
    expect(localStorage.getItem('adminUser')).toBe(JSON.stringify({ id: 1, name: 'SuperAdmin' }));
    
    // Check callback invocation
    expect(mockOnLoginSuccess).toHaveBeenCalledWith({ id: 1, name: 'SuperAdmin' });
  });

  test('should display specific error message on failed login', async () => {
    global.fetch.mockImplementation(() =>
        mockFetchResponse({ success: false, error: 'Invalid credentials provided' })
    );

    render(<AdminLogin onLoginSuccess={vi.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'hacker' } });
    fireEvent.change(screen.getByPlaceholderText('Enter access code'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Verify Identity/i }));
    
    // Expect the custom error message to be displayed
    const errorMessage = await screen.findByText('Invalid credentials provided');
    expect(errorMessage).toBeInTheDocument();
  });
  
  test('should display default fallback error message if none is provided', async () => {
      global.fetch.mockImplementation(() =>
        mockFetchResponse({ success: false }) // no explicit error string
    );

    render(<AdminLogin onLoginSuccess={vi.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'hacker2' } });
    fireEvent.change(screen.getByPlaceholderText('Enter access code'), { target: { value: 'wrongpass2' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Verify Identity/i }));
    
    // Expect default error to be displayed
    const errorMessage = await screen.findByText('Identity verification failed');
    expect(errorMessage).toBeInTheDocument();
  });
});
