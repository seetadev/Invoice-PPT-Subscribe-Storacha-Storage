import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewFile from '../../../src/components/NewFile/NewFile';
import { Local } from '../../../src/components/Storage/LocalStorage';
import * as AppGeneral from '../../../src/components/socialcalc/index.js';

// Mock dependencies
vi.mock('../../../src/components/socialcalc/index.js', () => ({
  getSpreadsheetContent: vi.fn().mockReturnValue('mock-content'),
  getDeviceType: vi.fn().mockReturnValue('iPad'),
  viewFile: vi.fn(),
}));

vi.mock('../../../src/components/Storage/LocalStorage');

const mockStore = {
  _getFile: vi.fn(),
  _saveFile: vi.fn(),
} as unknown as Local;

const mockUpdateSelectedFile = vi.fn();

describe('NewFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    file: 'test-file',
    updateSelectedFile: mockUpdateSelectedFile,
    store: mockStore,
    billType: 1,
  };

  it('should render add icon', () => {
    render(<NewFile {...defaultProps} />);
    
    const addIcon = screen.getByRole('button');
    expect(addIcon).toBeInTheDocument();
  });

  it('should create new file when clicked with non-default file', async () => {
    const mockFileData = {
      created: '2024-01-01',
      modified: '2024-01-02',
      content: 'existing-content',
    };
    mockStore._getFile = vi.fn().mockResolvedValue(mockFileData);

    render(<NewFile {...defaultProps} />);
    
    const addIcon = screen.getByRole('button');
    fireEvent.click(addIcon);

    await waitFor(() => {
      expect(AppGeneral.getSpreadsheetContent).toHaveBeenCalled();
      expect(mockStore._getFile).toHaveBeenCalledWith('test-file');
      expect(mockStore._saveFile).toHaveBeenCalled();
    });
  });

  it('should handle default file case', async () => {
    const propsWithDefaultFile = {
      ...defaultProps,
      file: 'default',
    };

    render(<NewFile {...propsWithDefaultFile} />);
    
    const addIcon = screen.getByRole('button');
    fireEvent.click(addIcon);

    await waitFor(() => {
      expect(AppGeneral.viewFile).toHaveBeenCalledWith('default', expect.any(String));
      expect(mockUpdateSelectedFile).toHaveBeenCalledWith('default');
    });
  });

  it('should display success alert after file creation', async () => {
    render(<NewFile {...defaultProps} />);
    
    const addIcon = screen.getByRole('button');
    fireEvent.click(addIcon);

    await waitFor(() => {
      expect(screen.getByText('Alert Message')).toBeInTheDocument();
      expect(screen.getByText('New file created!')).toBeInTheDocument();
    });
  });

  it('should close alert when dismissed', async () => {
    render(<NewFile {...defaultProps} />);
    
    const addIcon = screen.getByRole('button');
    fireEvent.click(addIcon);

    await waitFor(() => {
      const okButton = screen.getByText('Ok');
      fireEvent.click(okButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Alert Message')).not.toBeInTheDocument();
    });
  });

  it('should pass correct billType to Files constructor', async () => {
    const propsWithBillType = {
      ...defaultProps,
      billType: 2,
    };

    const mockFileData = {
      created: '2024-01-01',
      modified: '2024-01-02',
      content: 'existing-content',
    };
    mockStore._getFile = vi.fn().mockResolvedValue(mockFileData);

    render(<NewFile {...propsWithBillType} />);
    
    const addIcon = screen.getByRole('button');
    fireEvent.click(addIcon);

    await waitFor(() => {
      expect(mockStore._saveFile).toHaveBeenCalledWith(
        expect.objectContaining({
          billType: 2,
        })
      );
    });
  });
});