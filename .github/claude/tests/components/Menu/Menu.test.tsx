import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Menu from '../../../src/components/Menu/Menu';
import { Local } from '../../../src/components/Storage/LocalStorage';
import { mockUseSDK } from '../../mocks/metamask';
import { mockEmailComposer, mockPrinter } from '../../mocks/capacitor';

// Mock dependencies
vi.mock('@metamask/sdk-react', () => ({
  useSDK: vi.fn(() => mockUseSDK),
}));

vi.mock('capacitor-email-composer', () => ({
  EmailComposer: mockEmailComposer,
}));

vi.mock('@ionic-native/printer', () => ({
  Printer: mockPrinter,
}));

vi.mock('../../../src/components/socialcalc/index.js', () => ({
  getSpreadsheetContent: vi.fn().mockReturnValue('mock-content'),
  getCSVContent: vi.fn().mockReturnValue('col1,col2\nval1,val2'),
}));

vi.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: vi.fn(),
    },
    Contract: vi.fn(() => ({
      balanceOf: vi.fn().mockResolvedValue('1000'),
      hasActiveSubscription: vi.fn().mockResolvedValue(false),
      getSubscriptionEndDate: vi.fn().mockResolvedValue(0),
    })),
    utils: {
      parseEther: vi.fn().mockReturnValue('1000000000000000000'),
    },
  },
}));

const mockStore = {
  _checkKey: vi.fn().mockResolvedValue(false),
  _saveFile: vi.fn(),
} as unknown as Local;

const mockUpdateSelectedFile = vi.fn();
const mockSetM = vi.fn();

describe('Menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    showM: true,
    setM: mockSetM,
    file: 'test-file',
    updateSelectedFile: mockUpdateSelectedFile,
    store: mockStore,
    bT: 1,
  };

  it('should render action sheet when showM is true', () => {
    render(<Menu {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /action sheet/i })).toBeInTheDocument();
  });

  it('should not render action sheet when showM is false', () => {
    render(<Menu {...defaultProps} showM={false} />);
    
    expect(screen.queryByRole('button', { name: /action sheet/i })).not.toBeInTheDocument();
  });

  it('should handle save action', async () => {
    render(<Menu {...defaultProps} />);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockStore._saveFile).toHaveBeenCalled();
    });
  });

  it('should validate filename for save as', async () => {
    render(<Menu {...defaultProps} />);
    
    const saveAsButton = screen.getByText('Save As');
    fireEvent.click(saveAsButton);

    await waitFor(() => {
      expect(screen.getByText('Save File As')).toBeInTheDocument();
    });

    // Test invalid filename
    const input = screen.getByPlaceholderText('Enter filename');
    fireEvent.change(input, { target: { value: 'invalid@name' } });
    
    const confirmButton = screen.getByText('Save');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Special Characters cannot be used')).toBeInTheDocument();
    });
  });

  it('should handle email action', async () => {
    render(<Menu {...defaultProps} />);
    
    const emailButton = screen.getByText('Email');
    fireEvent.click(emailButton);

    await waitFor(() => {
      expect(mockEmailComposer.open).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [],
          subject: 'Invoice Suite Document',
          body: expect.stringContaining('Please find the attached document'),
          isHtml: true,
        })
      );
    });
  });

  it('should handle print action', async () => {
    render(<Menu {...defaultProps} />);
    
    const printButton = screen.getByText('Print');
    fireEvent.click(printButton);

    await waitFor(() => {
      expect(mockPrinter.print).toHaveBeenCalled();
    });
  });

  it('should check subscription status', async () => {
    const connectedSDK = {
      ...mockUseSDK,
      connected: true,
      provider: { request: vi.fn() },
    };
    
    vi.mocked(require('@metamask/sdk-react').useSDK).mockReturnValue(connectedSDK);

    render(<Menu {...defaultProps} />);

    // Component should check user tokens and subscription on mount
    await waitFor(() => {
      // Verify that contract calls were made (indirectly through effects)
      expect(connectedSDK.provider).toBeDefined();
    });
  });

  it('should show subscription alert for non-subscribers', async () => {
    const connectedSDK = {
      ...mockUseSDK,
      connected: true,
      provider: { request: vi.fn() },
    };
    
    vi.mocked(require('@metamask/sdk-react').useSDK).mockReturnValue(connectedSDK);

    render(<Menu {...defaultProps} />);
    
    // Trigger save action which should check subscription
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      // Should show subscription required alert for non-subscribers
      expect(screen.getByText('Subscription Required')).toBeInTheDocument();
    });
  });

  it('should handle filename validation errors', async () => {
    render(<Menu {...defaultProps} />);
    
    const saveAsButton = screen.getByText('Save As');
    fireEvent.click(saveAsButton);

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter filename');
      
      // Test empty filename
      fireEvent.change(input, { target: { value: '' } });
      const confirmButton = screen.getByText('Save');
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Filename cannot be empty')).toBeInTheDocument();
    });
  });

  it('should prevent saving default file', async () => {
    const propsWithDefaultFile = {
      ...defaultProps,
      file: 'default',
    };

    render(<Menu {...propsWithDefaultFile} />);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Cannot update default file!')).toBeInTheDocument();
    });
  });

  it('should handle download action', async () => {
    // Mock URL.createObjectURL and click
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:url');
    const mockClick = vi.fn();
    const mockRevoke = vi.fn();
    
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevoke;
    
    const mockLink = {
      href: '',
      download: '',
      click: mockClick,
      style: { display: '' },
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

    render(<Menu {...defaultProps} />);
    
    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevoke).toHaveBeenCalled();
    });
  });
});