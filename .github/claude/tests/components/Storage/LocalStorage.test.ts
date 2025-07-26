import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Files, Local } from '../../../src/components/Storage/LocalStorage';
import { mockPreferences } from '../../mocks/capacitor';

vi.mock('@capacitor/preferences', () => ({
  Preferences: mockPreferences,
}));

describe('Files', () => {
  it('should create a Files instance with correct properties', () => {
    const created = '2024-01-01';
    const modified = '2024-01-02';
    const content = 'test content';
    const name = 'test-file';
    const billType = 1;

    const file = new Files(created, modified, content, name, billType);

    expect(file.created).toBe(created);
    expect(file.modified).toBe(modified);
    expect(file.content).toBe(content);
    expect(file.name).toBe(name);
    expect(file.billType).toBe(billType);
  });

  it('should create Files instance using static create method', () => {
    const file = Files.create('2024-01-01', '2024-01-02', 'content', 'name');
    
    expect(file).toBeInstanceOf(Files);
    expect(file.billType).toBe(0); // default value
  });
});

describe('Local', () => {
  let localStorage: Local;

  beforeEach(() => {
    localStorage = new Local();
    vi.clearAllMocks();
  });

  describe('_saveFile', () => {
    it('should save file to preferences', async () => {
      const file = new Files('2024-01-01', '2024-01-02', 'content', 'test', 1);
      
      await localStorage._saveFile(file);

      expect(mockPreferences.set).toHaveBeenCalledWith({
        key: 'test',
        value: JSON.stringify({
          created: '2024-01-01',
          modified: '2024-01-02',
          content: 'content',
          name: 'test',
          billType: 1,
        }),
      });
    });
  });

  describe('_getFile', () => {
    it('should retrieve file from preferences', async () => {
      const mockData = {
        created: '2024-01-01',
        modified: '2024-01-02',
        content: 'content',
        name: 'test',
        billType: 1,
      };
      mockPreferences.get.mockResolvedValueOnce({ value: JSON.stringify(mockData) });

      const result = await localStorage._getFile('test');

      expect(mockPreferences.get).toHaveBeenCalledWith({ key: 'test' });
      expect(result).toEqual(mockData);
    });

    it('should handle null value from preferences', async () => {
      mockPreferences.get.mockResolvedValueOnce({ value: null });

      const result = await localStorage._getFile('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('_getAllFiles', () => {
    it('should return all files with their modified dates', async () => {
      mockPreferences.keys.mockResolvedValueOnce({ keys: ['file1', 'file2'] });
      mockPreferences.get
        .mockResolvedValueOnce({ value: JSON.stringify({ modified: '2024-01-01' }) })
        .mockResolvedValueOnce({ value: JSON.stringify({ modified: '2024-01-02' }) });

      const result = await localStorage._getAllFiles();

      expect(result).toEqual({
        file1: '2024-01-01',
        file2: '2024-01-02',
      });
    });

    it('should handle empty keys array', async () => {
      mockPreferences.keys.mockResolvedValueOnce({ keys: [] });

      const result = await localStorage._getAllFiles();

      expect(result).toEqual({});
    });
  });

  describe('_deleteFile', () => {
    it('should remove file from preferences', async () => {
      await localStorage._deleteFile('test');

      expect(mockPreferences.remove).toHaveBeenCalledWith({ key: 'test' });
    });
  });

  describe('_checkKey', () => {
    it('should return true if key exists', async () => {
      mockPreferences.keys.mockResolvedValueOnce({ keys: ['file1', 'test', 'file2'] });

      const result = await localStorage._checkKey('test');

      expect(result).toBe(true);
    });

    it('should return false if key does not exist', async () => {
      mockPreferences.keys.mockResolvedValueOnce({ keys: ['file1', 'file2'] });

      const result = await localStorage._checkKey('nonexistent');

      expect(result).toBe(false);
    });
  });
});