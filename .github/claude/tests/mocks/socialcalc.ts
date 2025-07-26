import { vi } from 'vitest';

export const mockSocialCalc = {
  getDeviceType: vi.fn().mockReturnValue('default'),
  initializeApp: vi.fn(),
  activateFooterButton: vi.fn(),
  viewFile: vi.fn(),
  getCSVContent: vi.fn().mockReturnValue('col1,col2\nval1,val2'),
  getSpreadsheetContent: vi.fn().mockReturnValue('mock-content'),
  mustshowprompt: vi.fn().mockReturnValue(false),
};

vi.mock('../../../src/components/socialcalc/index.js', () => mockSocialCalc);