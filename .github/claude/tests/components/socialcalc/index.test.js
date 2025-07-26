import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as AppGeneral from '../../../src/components/socialcalc/index.js';

// Mock DOM elements
const mockElement = {
  style: { height: '' },
};

const mockTableEditor = { ...mockElement };

const mockSocialCalc = {
  SpreadsheetControl: vi.fn(() => ({
    InitializeSpreadsheetControl: vi.fn(),
    ExecuteCommand: vi.fn(),
    DoOnResize: vi.fn(),
  })),
  WorkBook: vi.fn(() => ({
    InitializeWorkBook: vi.fn(),
  })),
  WorkBookControl: vi.fn(() => ({
    InitializeWorkBookControl: vi.fn(),
  })),
  WorkBookControlLoad: vi.fn(),
  GetCurrentWorkBookControl: vi.fn(() => ({
    workbook: {
      spreadsheet: {
        formulabarDiv: { id: 'test-id' },
        editor: { state: 'start' },
        ExecuteCommand: vi.fn(),
      },
    },
    sheetButtonArr: { sheet1: {}, sheet2: {} },
    currentSheetButton: { id: 'sheet1' },
  })),
  WorkBookControlActivateSheet: vi.fn(),
  WorkBookControlInsertWorkbook: vi.fn(),
  WorkBookControlSaveSheet: vi.fn(() => JSON.stringify({
    sheetArr: {
      sheet1: { sheetstr: { savestr: 'test-data' } },
    },
  })),
  ConvertSaveToOtherFormat: vi.fn(() => 'csv,data\ntest,value'),
  ScrollRelativeBoth: vi.fn(),
  ToggleInputLineButtons: vi.fn(),
  EditableCells: { constraints: {} },
  oldBtnActive: 1,
};

// Mock the SocialCalc module
vi.mock('../../../src/components/socialcalc/aspiring/SocialCalc.js', () => mockSocialCalc);

describe('SocialCalc Integration', () => {
  beforeEach(() => {
    // Mock DOM methods
    global.document = {
      getElementById: vi.fn((id) => {
        if (id === 'tableeditor') return mockTableEditor;
        if (id === 'te_griddiv') return mockElement;
        return { firstChild: { style: { display: 'block' } } };
      }),
    } as any;

    global.navigator = {
      userAgent: 'Mozilla/5.0 (compatible; test)',
    } as any;

    global.window = {
      setTimeout: vi.fn((cb) => cb()),
    } as any;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDeviceType', () => {
    it('should return default for unknown device', () => {
      global.navigator.userAgent = 'Mozilla/5.0 (compatible; test)';
      const result = AppGeneral.getDeviceType();
      expect(result).toBe('default');
    });

    it('should detect iPad', () => {
      global.navigator.userAgent = 'Mozilla/5.0 (iPad; CPU iPad OS 14_0 like Mac OS X)';
      const result = AppGeneral.getDeviceType();
      expect(result).toBe('iPad');
    });

    it('should detect iPhone', () => {
      global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
      const result = AppGeneral.getDeviceType();
      expect(result).toBe('iPhone');
    });

    it('should detect Android', () => {
      global.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G975F)';
      const result = AppGeneral.getDeviceType();
      expect(result).toBe('Android');
    });
  });

  describe('initializeApp', () => {
    it('should initialize spreadsheet with data', () => {
      const testData = { sheets: ['sheet1'] };
      
      AppGeneral.initializeApp(testData);

      expect(mockSocialCalc.SpreadsheetControl).toHaveBeenCalled();
      expect(mockSocialCalc.WorkBook).toHaveBeenCalled();
      expect(mockSocialCalc.WorkBookControl).toHaveBeenCalled();
      expect(mockSocialCalc.WorkBookControlLoad).toHaveBeenCalledWith(testData);
    });

    it('should set grid height and resize', () => {
      const testData = {};
      
      AppGeneral.initializeApp(testData);

      expect(mockElement.style.height).toBe('1600px');
    });
  });

  describe('activateFooterButton', () => {
    it('should return early if index equals oldBtnActive', () => {
      AppGeneral.activateFooterButton(1);
      
      expect(mockSocialCalc.WorkBookControlActivateSheet).not.toHaveBeenCalled();
    });

    it('should activate different sheet', () => {
      mockSocialCalc.oldBtnActive = 2;
      
      AppGeneral.activateFooterButton(1);

      expect(mockSocialCalc.GetCurrentWorkBookControl).toHaveBeenCalled();
      expect(mockSocialCalc.WorkBookControlActivateSheet).toHaveBeenCalled();
    });
  });

  describe('viewFile', () => {
    it('should load workbook and redisplay', () => {
      const filename = 'test.xlsx';
      const data = { workbook: 'data' };

      AppGeneral.viewFile(filename, data);

      expect(mockSocialCalc.WorkBookControlInsertWorkbook).toHaveBeenCalledWith(data);
      expect(mockSocialCalc.GetCurrentWorkBookControl).toHaveBeenCalled();
    });

    it('should scroll after timeout', (done) => {
      const filename = 'test.xlsx';
      const data = { workbook: 'data' };
      
      global.window.setTimeout = vi.fn((callback) => {
        callback();
        expect(mockSocialCalc.ScrollRelativeBoth).toHaveBeenCalledTimes(2);
        done();
        return 1;
      });

      AppGeneral.viewFile(filename, data);
    });
  });

  describe('getCSVContent', () => {
    it('should return CSV data', () => {
      const result = AppGeneral.getCSVContent();

      expect(mockSocialCalc.WorkBookControlSaveSheet).toHaveBeenCalled();
      expect(mockSocialCalc.ConvertSaveToOtherFormat).toHaveBeenCalledWith(
        'test-data',
        'csv',
        false
      );
      expect(result).toBe('csv,data\ntest,value');
    });
  });

  describe('mustshowprompt', () => {
    it('should return false when no constraint exists', () => {
      const result = AppGeneral.mustshowprompt('A1');
      
      expect(result).toBe(false);
    });

    it('should handle constraints if they exist', () => {
      mockSocialCalc.EditableCells.constraints = {
        'sheet1!A1': { type: 'list', values: ['option1', 'option2'] },
      };
      mockSocialCalc.GetCurrentWorkBookControl = vi.fn(() => ({
        workbook: {
          spreadsheet: {
            editor: {
              workingvalues: { currentsheet: 'sheet1' },
              ecell: { coord: 'A1' },
            },
          },
        },
      }));

      const result = AppGeneral.mustshowprompt('A1');
      
      expect(result).toBe(true);
    });
  });
});