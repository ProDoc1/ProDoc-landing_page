import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import AboutPage from './About';
import emailjs from '@emailjs/browser';

// Mock the external emailjs library and child components that might interfere with unit testing
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));  

// Mocking framer-motion or complex animation components if they cause issues in JSDOM
vi.mock('./components/Aurora', () => ({ default: () => <div data-testid="aurora" /> }));
vi.mock('./components/Carousel', () => ({ default: () => <div data-testid="carousel" /> }));
vi.mock('./components/team', () => ({ default: () => <div data-testid="team-section" /> }));

describe('AboutPage Component Scenarios', () => {
  const mockNavigateDoctorRegistration = vi.fn();
  const mockNavigateDoctors = vi.fn();
  const mockNavigateHowitWorks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render hero section and mission/vision content', () => {
    render(
      <AboutPage 
        onNavigateDoctorRegistration={mockNavigateDoctorRegistration}
        onNavigateDoctors={mockNavigateDoctors}
        onNavigateHowitWorks={mockNavigateHowitWorks}
      />
    );

    // Verify main headings
    expect(screen.getAllByText(/About/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/ProDoc/i)[0]).toBeInTheDocument();
    
    // Verify Mission and Vision cards are present
    expect(screen.getByRole('heading', { name: 'Mission' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Vision' })).toBeInTheDocument();
    expect(screen.getByText(/To empower patients with transparent/i)).toBeInTheDocument();
  });

  test('should handle contact form submission successfully', async () => {
    // Mock successful email sending
    emailjs.send.mockResolvedValue({ status: 200, text: 'OK' });

    render(<AboutPage />);

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Nethmin' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Gomes' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'nethmin@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'General Inquiry' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello ProDoc team!' } });

    // Submit the form
    const submitBtn = screen.getByRole('button', { name: /Submit Message/i });
    fireEvent.click(submitBtn);

    // Verify loading state
    expect(screen.getByText(/Sending.../i)).toBeInTheDocument();

    // Verify success message appears
    await waitFor(() => {
      expect(screen.getByText(/Message sent successfully!/i)).toBeInTheDocument();
    });

    // Verify emailjs was called with correct parameters
    expect(emailjs.send).toHaveBeenCalledWith(
      'service_jajwzgf',
      'template_o75vnnp',
      expect.objectContaining({
        from_name: 'Nethmin Gomes',
        from_email: 'nethmin@example.com',
        subject: 'General Inquiry',
        message: 'Hello ProDoc team!'
      }),
      'LUysmcNbwO0ok5GAV'
    );
  });

  test('should trigger navigation when clicking footer links', () => {
    render(
      <AboutPage 
        onNavigateDoctors={mockNavigateDoctors}
        onNavigateHowitWorks={mockNavigateHowitWorks}
      />
    );

    // Test "Find a Doctor" footer link
    const findDoctorLink = screen.getByText('Find a Doctor');
    fireEvent.click(findDoctorLink);
    expect(mockNavigateDoctors).toHaveBeenCalled();

    // Test "How it Works" footer link
    const howItWorksLink = screen.getByText('How it Works');
    fireEvent.click(howItWorksLink);
    expect(mockNavigateHowitWorks).toHaveBeenCalled();
  });

  test('should trigger doctor registration navigation from the CTA button', () => {
    render(<AboutPage onNavigateDoctorRegistration={mockNavigateDoctorRegistration} />);

    // Find and click the "Join ProDoc Network" button
    const joinBtn = screen.getByRole('button', { name: /Join ProDoc Network/i });
    fireEvent.click(joinBtn);

    expect(mockNavigateDoctorRegistration).toHaveBeenCalled();
  });
});