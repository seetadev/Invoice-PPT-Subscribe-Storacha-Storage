import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Capacitor plugins
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    set: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({ value: '{}' }),
    keys: vi.fn().mockResolvedValue({ keys: [] }),
    remove: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}));

vi.mock('capacitor-email-composer', () => ({
  EmailComposer: {
    open: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@ionic-native/printer', () => ({
  Printer: {
    print: vi.fn().mockResolvedValue(undefined),
    isAvailable: vi.fn().mockResolvedValue(true),
  },
}));

// Mock MetaMask SDK
vi.mock('@metamask/sdk-react', () => ({
  useSDK: vi.fn(() => ({
    sdk: { connect: vi.fn() },
    connected: false,
    connecting: false,
    provider: null,
    chainId: null,
  })),
  MetaMaskProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: vi.fn(),
    },
    Contract: vi.fn(),
    utils: {
      parseEther: vi.fn(),
      formatEther: vi.fn(),
    },
  },
}));

// Mock W3UP client
vi.mock('@web3-storage/w3up-client', () => ({
  create: vi.fn().mockResolvedValue({
    login: vi.fn().mockResolvedValue({}),
    setCurrentSpace: vi.fn().mockResolvedValue({}),
    spaces: vi.fn().mockResolvedValue([]),
    uploadFile: vi.fn().mockResolvedValue({ cid: 'test-cid' }),
  }),
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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