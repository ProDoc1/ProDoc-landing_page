import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import DoctorRegistration from './DoctorRegistration';

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('./assets/Logo_with_words.png', () => ({ default: 'logo-mock' }));

describe('DoctorRegistration Component', () => {
  test('renders registration step 1 initially', () => {
    // The component usually prints something like 'Personal Details' or 'Join ProDoc Network'
    render(<DoctorRegistration onBack={vi.fn()} onNavigateLogin={vi.fn()} onNavigateTerms={vi.fn()} />);
    expect(document.querySelector('input')).not.toBeNull();
  });
});