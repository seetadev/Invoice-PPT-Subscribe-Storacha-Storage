import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Files from '../../../src/components/Files/Files';
import { Local } from '../../../src/components/Storage/LocalStorage';

// Mock dependencies
vi.mock('../../../src/components/socialcalc/index.js', () => ({
  viewFile: vi.fn(),
}));

vi.mock('@web3-storage/w3up-client', () => ({
  create: vi.fn().mockResolvedValue({
    login: vi.fn().mockResolvedValue({}),
    setCurrentSpace: vi.fn().mockResolvedValue({}),
    uploadFile: vi.fn().mockResolvedValue({ cid: 'test-cid' }),
    spaces: vi.fn().mockResolvedValue([]),
  }),
}));

const mockStore = {
  _getAllFiles: vi.fn().mockResolvedValue({}),
  _getFile: vi.fn(),
  _saveFile: vi.fn(),
  _deleteFile: vi.fn(),
} as unknown as Local;

const mockUpdateSelectedFile = vi.fn();
const mockUpdateBillType = vi.fn();

describe('Files', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const defaultProps = {
    store: mockStore,
    file: 'current-file',
    updateSelectedFile: mockUpdateSelectedFile,
    updateBillType: mockUpdateBillType,
  };

  it('should render files icon', () => {
    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    expect(filesIcon).toBeInTheDocument();
  });

  it('should open modal when files icon clicked', async () => {
    mockStore._getAllFiles = vi.fn().mockResolvedValue({
      'file1': '2024-01-01',
      'file2': '2024-01-02',
    });

    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    await waitFor(() => {
      expect(screen.getByText('Local')).toBeInTheDocument();
      expect(screen.getByText('IPFS')).toBeInTheDocument();
    });
  });

  it('should display local files when loaded', async () => {
    const mockFiles = {
      'invoice1': '2024-01-01',
      'invoice2': '2024-01-02',
    };
    mockStore._getAllFiles = vi.fn().mockResolvedValue(mockFiles);

    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    await waitFor(() => {
      expect(screen.getByText('invoice1')).toBeInTheDocument();
      expect(screen.getByText('invoice2')).toBeInTheDocument();
    });
  });

  it('should handle file selection', async () => {
    const mockFiles = {
      'selected-file': '2024-01-01',
    };
    const mockFileData = {
      content: 'file-content',
      billType: 1,
    };
    
    mockStore._getAllFiles = vi.fn().mockResolvedValue(mockFiles);
    mockStore._getFile = vi.fn().mockResolvedValue(mockFileData);

    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    await waitFor(() => {
      const fileItem = screen.getByText('selected-file');
      fireEvent.click(fileItem);
    });

    await waitFor(() => {
      expect(mockUpdateSelectedFile).toHaveBeenCalledWith('selected-file');
      expect(mockUpdateBillType).toHaveBeenCalledWith(1);
    });
  });

  it('should handle file deletion', async () => {
    const mockFiles = {
      'file-to-delete': '2024-01-01',
    };
    mockStore._getAllFiles = vi.fn().mockResolvedValue(mockFiles);

    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    await waitFor(() => {
      const deleteButton = screen.getAllByText('🗑️')[0]; // trash icon
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Delete File')).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockStore._deleteFile).toHaveBeenCalledWith('file-to-delete');
    });
  });

  it('should toggle between local and IPFS views', async () => {
    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    await waitFor(() => {
      const ipfsTab = screen.getByText('IPFS');
      fireEvent.click(ipfsTab);
    });

    await waitFor(() => {
      expect(screen.getByText('Connect to IPFS')).toBeInTheDocument();
    });
  });

  it('should handle IPFS email input', async () => {
    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    await waitFor(() => {
      const ipfsTab = screen.getByText('IPFS');
      fireEvent.click(ipfsTab);
    });

    await waitFor(() => {
      const connectButton = screen.getByText('Connect to IPFS');
      fireEvent.click(connectButton);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });
  });

  it('should show loading spinner during operations', async () => {
    mockStore._getAllFiles = vi.fn(() => new Promise(resolve => setTimeout(() => resolve({}), 100)));

    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle empty file list', async () => {
    mockStore._getAllFiles = vi.fn().mockResolvedValue({});

    render(<Files {...defaultProps} />);
    
    const filesIcon = screen.getByRole('button');
    fireEvent.click(filesIcon);

    await waitFor(() => {
      expect(screen.getByText('No files found')).toBeInTheDocument();
    });
  });
});