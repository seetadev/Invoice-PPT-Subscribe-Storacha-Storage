import { vi } from 'vitest';

export const mockPreferences = {
  set: vi.fn().mockResolvedValue(undefined),
  get: vi.fn().mockResolvedValue({ value: null }),
  keys: vi.fn().mockResolvedValue({ keys: [] }),
  remove: vi.fn().mockResolvedValue(undefined),
};

export const mockEmailComposer = {
  open: vi.fn().mockResolvedValue({ result: 'sent' }),
};

export const mockPrinter = {
  print: vi.fn().mockResolvedValue(undefined),
  isAvailable: vi.fn().mockResolvedValue(true),
};