import { vi } from 'vitest';

export const mockSDK = {
  connect: vi.fn().mockResolvedValue(['0x123']),
  disconnect: vi.fn().mockResolvedValue(undefined),
  getProvider: vi.fn(),
};

export const mockProvider = {
  getNetwork: vi.fn().mockResolvedValue({ chainId: 1 }),
  getSigner: vi.fn().mockReturnValue({
    getAddress: vi.fn().mockResolvedValue('0x123'),
    getBalance: vi.fn().mockResolvedValue('1000000000000000000'),
  }),
  send: vi.fn(),
};

export const mockUseSDK = {
  sdk: mockSDK,
  connected: false,
  connecting: false,
  provider: null,
  chainId: null,
};