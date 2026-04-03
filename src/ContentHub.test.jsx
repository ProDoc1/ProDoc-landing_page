import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import ContentHub from './ContentHub';

const mockFetchResponse = (url, data, ok = true) => {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
  });
};

describe('ContentHub Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn((url) => {
      if (typeof url === 'string' && url.includes('/api/get-content-hub-posts')) {
        return mockFetchResponse(url, [
          {
            post_id: 1,
            full_name: "Dr. Smith",
            specialty: "Cardiologist",
            created_at: new Date().toISOString(),
            post_content: "This is a test post.",
            likes_count: 5,
            shares_count: 2
          }
        ]);
      }
      if (typeof url === 'string' && url.includes('/api/doctors')) {
        return mockFetchResponse(url, [
          { doctor_id: 1, full_name: "Dr. Jones", specialty: "Neurologist" }
        ]);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
    
    // Mock window.matchMedia if needed by lucide-react or framer-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test('should render ContentHub and fetch posts and doctors', async () => {
    render(<ContentHub userRole="patient" user={{ id: 1 }} />);

    // Wait for the post to be rendered
    const postContent = await screen.findByText("This is a test post.");
    expect(postContent).toBeInTheDocument();
    
    // Check doctor author
    expect(screen.getAllByText("Dr. Smith")[0]).toBeInTheDocument();

    // Wait for suggested doctors
    const suggestedDoctors = await screen.findAllByText("Dr. Jones");
    expect(suggestedDoctors[0]).toBeInTheDocument();
  });

  test('should show post creation form for doctors', async () => {
    render(<ContentHub userRole="doctor" user={{ id: 1, full_name: "Dr. Author" }} />);

    const publishButton = await screen.findByRole('button', { name: /Publish/i });
    expect(publishButton).toBeInTheDocument();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind, Doctor\?/i);
    expect(textarea).toBeInTheDocument();
  });

  test('should not show post creation form for patients', async () => {
    render(<ContentHub userRole="patient" user={{ id: 1, full_name: "Patient User" }} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Publish/i })).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/What's on your mind, Doctor\?/i)).not.toBeInTheDocument();
    });
  });
  
  test('should tab between Doctor Articles, Popular, and Saved', async () => {
    render(<ContentHub userRole="patient" user={{ id: 1 }} />);
    
    await screen.findByText("This is a test post.");
    
    const popularTab = screen.getAllByRole('button', { name: /Popular/i })[0];
    fireEvent.click(popularTab);
    
    // Content should still have the post since it's the only one
    expect(screen.getByText("This is a test post.")).toBeInTheDocument();
    
    const savedTab = screen.getAllByRole('button', { name: /Saved/i })[0];
    fireEvent.click(savedTab);
    
    // It shouldn't have the post in saved because we haven't mocked saving it yet
    expect(screen.queryByText("This is a test post.")).not.toBeInTheDocument();
  });
});
