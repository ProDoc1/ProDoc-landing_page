import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import DoctorsPage from './doctor';


// Helper to mock the fetch response
const mockFetchResponse = (data, ok = true) => {
  global.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    })
  );
};

describe('DoctorsPage Live Site Scenarios', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should handle API failure by falling back to mock data', async () => {
    // Suppress expected console.error from being logged in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Simulate a 500 Internal Server Error
    mockFetchResponse({}, false);
    
    render(<DoctorsPage />);

    // Even if API fails, the component should show the hardcoded mock doctors
    const fallbackDoctor = await screen.findByText(/Dr. Anura Bandara/i);
    expect(fallbackDoctor).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('should open and select a specialty from the custom dropdown', async () => {
    mockFetchResponse([{ doctor_id: 1, full_name: "Dr. Test", specialty: "Neurologist" }]);
    render(<DoctorsPage />);

    await screen.findByText(/Dr. Test/i);

    // 1. Click the Specialty dropdown
    const specButton = screen.getByText(/Any Specialty/i);
    fireEvent.click(specButton);

    // 2. Select 'Neurologist' from the animated list
    const options = screen.getAllByText('Neurologist');
    // Click the button inside the dropdown (not the paragraph in the card)
    const dropdownOption = options.find(el => el.tagName === 'BUTTON');
    if (dropdownOption) fireEvent.click(dropdownOption);

    // 3. Verify the filter applied
    // After selection, the button that says 'Neurologist' as the selected filter will be rendered
    const selectedSpans = screen.getAllByText('Neurologist');
    const selectedFilterSpan = selectedSpans.find(el => el.tagName === 'SPAN' && el.className.includes('text-teal-700'));
    expect(selectedFilterSpan).toBeInTheDocument();
  });

  test('should filter by Hospital search suggestions', async () => {
    const complexData = [
      { doctor_id: 1, full_name: "A", associated_hospitals: [{ name: "City Clinic" }] },
      { doctor_id: 2, full_name: "B", associated_hospitals: [{ name: "General Hospital" }] }
    ];
    mockFetchResponse(complexData);
    render(<DoctorsPage />);

    const hospitalInput = screen.getByPlaceholderText(/Search hospitals.../i);
    
    // Type into hospital search
    fireEvent.change(hospitalInput, { target: { value: 'City' } });

    // Click the suggestion that appears
    const suggestion = await screen.findByText('City Clinic');
    fireEvent.click(suggestion);

    // Verify only the correct doctor remains
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
  });

  test('should close dropdowns when clicking outside', async () => {
    render(<DoctorsPage />);
    
    const specButton = screen.getByText(/Any Specialty/i);
    fireEvent.click(specButton);
    
    // Check if dropdown menu is visible (using the 'All' option which is always there)
    expect(screen.getAllByText('All').length).toBeGreaterThan(1);

    // Click on the body/background
    fireEvent.mouseDown(document.body);

    // Dropdown should close (wait for AnimatePresence/state update)
    await waitFor(() => {
      expect(screen.queryByText('Oncologist')).not.toBeInTheDocument();
    });
  });
});