import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../src/pages/Home';
import { mockUseSDK } from '../mocks/metamask';

// Mock all dependencies
vi.mock('@metamask/sdk-react', () => ({
  useSDK: vi.fn(() => mockUseSDK),
}));

vi.mock('../../src/components/socialcalc/index.js', () => ({
  initializeApp: vi.fn(),
  getDeviceType: vi.fn().mockReturnValue('iPad'),
}));

vi.mock('../../src/components/Storage/LocalStorage');
vi.mock('../../src/components/Menu/Menu', () => ({
  default: ({ showM, setM }) => 
    showM ? <div data-testid="menu-component">Menu Component</div> : null,
}));
vi.mock('../../src/components/Files/Files', () => ({
  default: () => <div data-testid="files-component">Files Component</div>,
}));
vi.mock('../../src/components/NewFile/NewFile', () => ({
  default: () => <div data-testid="newfile-component">NewFile Component</div>,
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock DOM element for spreadsheet
    const mockTableEditor = document.createElement('div');
    mockTableEditor.id = 'tableeditor';
    document.body.appendChild(mockTableEditor);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render main components', () => {
    render(<Home />);
    
    expect(screen.getByText('Invoice Suite')).toBeInTheDocument();
    expect(screen.getByTestId('files-component')).toBeInTheDocument();
    expect(screen.getByTestId('newfile-component')).toBeInTheDocument();
  });

  it('should initialize with bill type 0', () => {
    render(<Home />);
    
    // Check that the first bill type button is active
    const billTypeButtons = screen.getAllByRole('button');
    const typeButton = billTypeButtons.find(btn => btn.textContent?.includes('Type I'));
    expect(typeButton).toHaveClass('segment-button-checked');
  });

  it('should handle network switching', async () => {
    const mockProvider = {
      request: vi.fn().mockResolvedValue(null),
    };
    
    const sdkWithProvider = {
      ...mockUseSDK,
      connected: true,
      provider: mockProvider,
    };
    
    vi.mocked(require('@metamask/sdk-react').useSDK).mockReturnValue(sdkWithProvider);

    render(<Home />);
    
    // Find and click network switcher
    const networkButton = screen.getByText(/Switch Network/i);
    fireEvent.click(networkButton);

    await waitFor(() => {
      expect(screen.getByText('Select Network')).toBeInTheDocument();
    });
  });

  it('should handle MetaMask connection', async () => {
    const mockConnect = vi.fn().mockResolvedValue(['0x123']);
    const sdkWithConnect = {
      ...mockUseSDK,
      sdk: { connect: mockConnect },
    };
    
    vi.mocked(require('@metamask/sdk-react').useSDK).mockReturnValue(sdkWithConnect);

    render(<Home />);
    
    const connectButton = screen.getByText(/Connect Wallet/i);
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalled();
    });
  });

  it('should show wallet info when connected', () => {
    const connectedSDK = {
      ...mockUseSDK,
      connected: true,
      account: '0x1234567890123456789012345678901234567890',
    };
    
    vi.mocked(require('@metamask/sdk-react').useSDK).mockReturnValue(connectedSDK);

    render(<Home />);
    
    expect(screen.getByText(/0x123.../)).toBeInTheDocument();
  });

  it('should handle bill type switching', async () => {
    render(<Home />);
    
    // Click on Type II button
    const typeIIButton = screen.getByText('Type II');
    fireEvent.click(typeIIButton);

    await waitFor(() => {
      expect(typeIIButton).toHaveClass('segment-button-checked');
    });
  });

  it('should open menu when settings icon clicked', async () => {
    render(<Home />);
    
    const settingsButton = screen.getByTestId('settings-icon');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByTestId('menu-component')).toBeInTheDocument();
    });
  });

  it('should handle popover opening and closing', async () => {
    render(<Home />);
    
    const walletIcon = screen.getByTestId('wallet-icon');
    fireEvent.click(walletIcon);

    await waitFor(() => {
      expect(screen.getByText(/Wallet Options/i)).toBeInTheDocument();
    });

    // Close popover
    fireEvent.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText(/Wallet Options/i)).not.toBeInTheDocument();
    });
  });

  it('should render spreadsheet editor container', () => {
    render(<Home />);
    
    const editorContainer = screen.getByTestId('tableeditor');
    expect(editorContainer).toBeInTheDocument();
  });

  it('should handle alert dismissal', async () => {
    render(<Home />);
    
    // Trigger an alert (e.g., through network switching error)
    const settingsButton = screen.getByTestId('settings-icon');
    fireEvent.click(settingsButton);

    // Simulate alert appearing
    await waitFor(() => {
      if (screen.queryByText('Alert')) {
        const okButton = screen.getByText('Ok');
        fireEvent.click(okButton);
      }
    });
  });

  it('should initialize spreadsheet on mount', () => {
    const initializeApp = vi.fn();
    vi.mocked(require('../../src/components/socialcalc/index.js')).initializeApp = initializeApp;

    render(<Home />);

    expect(initializeApp).toHaveBeenCalled();
  });

  it('should handle device type detection', () => {
    const getDeviceType = vi.fn().mockReturnValue('iPhone');
    vi.mocked(require('../../src/components/socialcalc/index.js')).getDeviceType = getDeviceType;

    render(<Home />);

    expect(getDeviceType).toHaveBeenCalled();
  });

  it('should display correct app title', () => {
    render(<Home />);
    
    expect(screen.getByText('Invoice Suite')).toBeInTheDocument();
  });

  it('should handle connection state changes', async () => {
    const { rerender } = render(<Home />);
    
    // Initially disconnected
    expect(screen.queryByText(/0x123.../)).not.toBeInTheDocument();

    // Update to connected state
    const connectedSDK = {
      ...mockUseSDK,
      connected: true,
      account: '0x1234567890123456789012345678901234567890',
    };
    
    vi.mocked(require('@metamask/sdk-react').useSDK).mockReturnValue(connectedSDK);

    rerender(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/0x123.../)).toBeInTheDocument();
    });
  });
});