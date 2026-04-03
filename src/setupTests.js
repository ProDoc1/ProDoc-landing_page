import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock openpgp to prevent import failures in jsdom environment
vi.mock('openpgp', () => ({
  readKey: vi.fn(),
  readPrivateKey: vi.fn(),
  decryptKey: vi.fn(),
  readMessage: vi.fn(),
  decrypt: vi.fn(),
  encrypt: vi.fn(),
  createMessage: vi.fn(),
  generateKey: vi.fn(),
}));

class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    if (this.callback) {
      this.callback([
        {
          isIntersecting: true,
          target: element,
          intersectionRatio: 1,
          boundingClientRect: {},
          intersectionRect: {},
          rootBounds: {},
          time: Date.now(),
        },
      ]);
    }
  }
  disconnect() {}
  unobserve() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock matchMedia for responsive components
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

// Mock crypto for openpgp and other crypto tools
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: vi.fn(),
      importKey: vi.fn(),
      sign: vi.fn(),
      verify: vi.fn(),
    }
  };
}
