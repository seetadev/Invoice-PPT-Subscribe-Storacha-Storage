import { describe, it, expect } from 'vitest';
import {
  MEDT_TOKEN_ADDRESSES,
  MEDI_INVOICE_ADDRESSES,
  SUPPORTED_NETWORKS,
  TOKEN_COST,
} from '../../src/utils/constants';

describe('Constants', () => {
  describe('MEDT_TOKEN_ADDRESSES', () => {
    it('should contain addresses for all supported networks', () => {
      expect(MEDT_TOKEN_ADDRESSES).toHaveProperty('CALIBRATION');
      expect(MEDT_TOKEN_ADDRESSES).toHaveProperty('FILECOIN');
      expect(MEDT_TOKEN_ADDRESSES).toHaveProperty('OPTIMISM_SEPOLIA');
      expect(MEDT_TOKEN_ADDRESSES).toHaveProperty('OPTIMISM');
      expect(MEDT_TOKEN_ADDRESSES).toHaveProperty('POLYGON_AMOY');
    });

    it('should have valid Ethereum addresses', () => {
      Object.values(MEDT_TOKEN_ADDRESSES).forEach(address => {
        if (address) { // Some networks might have empty addresses
          expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
        }
      });
    });

    it('should have Calibration testnet address', () => {
      expect(MEDT_TOKEN_ADDRESSES.CALIBRATION).toBe('0xb83bFF8Fdbe7C27B06E5f83D38881fB03A518B78');
    });

    it('should have Filecoin mainnet address', () => {
      expect(MEDT_TOKEN_ADDRESSES.FILECOIN).toBe('0xC00BBC9A2C88712dC1e094866973F036373C7134');
    });
  });

  describe('MEDI_INVOICE_ADDRESSES', () => {
    it('should contain addresses for all supported networks', () => {
      expect(MEDI_INVOICE_ADDRESSES).toHaveProperty('CALIBRATION');
      expect(MEDI_INVOICE_ADDRESSES).toHaveProperty('FILECOIN');
      expect(MEDI_INVOICE_ADDRESSES).toHaveProperty('OPTIMISM_SEPOLIA');
      expect(MEDI_INVOICE_ADDRESSES).toHaveProperty('OPTIMISM');
    });

    it('should have valid Ethereum addresses', () => {
      Object.values(MEDI_INVOICE_ADDRESSES).forEach(address => {
        if (address) {
          expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
        }
      });
    });

    it('should have different addresses from token contract', () => {
      Object.keys(MEDT_TOKEN_ADDRESSES).forEach(network => {
        if (MEDT_TOKEN_ADDRESSES[network] && MEDI_INVOICE_ADDRESSES[network]) {
          expect(MEDT_TOKEN_ADDRESSES[network]).not.toBe(MEDI_INVOICE_ADDRESSES[network]);
        }
      });
    });
  });

  describe('SUPPORTED_NETWORKS', () => {
    it('should contain chain IDs for all networks', () => {
      expect(SUPPORTED_NETWORKS).toHaveProperty('CALIBRATION');
      expect(SUPPORTED_NETWORKS).toHaveProperty('FILECOIN');
      expect(SUPPORTED_NETWORKS).toHaveProperty('LINEA_SEPOLIA');
      expect(SUPPORTED_NETWORKS).toHaveProperty('BASE_SEPOLIA');
      expect(SUPPORTED_NETWORKS).toHaveProperty('OPTIMISM_SEPOLIA');
      expect(SUPPORTED_NETWORKS).toHaveProperty('OPTIMISM');
      expect(SUPPORTED_NETWORKS).toHaveProperty('POLYGON_AMOY');
      expect(SUPPORTED_NETWORKS).toHaveProperty('CELO_ALFAJORES');
    });

    it('should have valid hex chain IDs', () => {
      Object.values(SUPPORTED_NETWORKS).forEach(network => {
        expect(network.chainId).toMatch(/^0x[a-fA-F0-9]+$/);
      });
    });

    it('should have correct Filecoin Calibration chain ID', () => {
      expect(SUPPORTED_NETWORKS.CALIBRATION.chainId).toBe('0x4cb2f');
    });

    it('should have correct Filecoin mainnet chain ID', () => {
      expect(SUPPORTED_NETWORKS.FILECOIN.chainId).toBe('0x13a');
    });

    it('should have correct Optimism chain ID', () => {
      expect(SUPPORTED_NETWORKS.OPTIMISM.chainId).toBe('0xa');
    });

    it('should have unique chain IDs', () => {
      const chainIds = Object.values(SUPPORTED_NETWORKS).map(network => network.chainId);
      const uniqueChainIds = new Set(chainIds);
      expect(uniqueChainIds.size).toBe(chainIds.length);
    });
  });

  describe('TOKEN_COST', () => {
    it('should define costs for all operations', () => {
      expect(TOKEN_COST).toHaveProperty('SAVE');
      expect(TOKEN_COST).toHaveProperty('SAVE_AS');
      expect(TOKEN_COST).toHaveProperty('PRINT');
      expect(TOKEN_COST).toHaveProperty('EMAIL');
    });

    it('should have string values for all costs', () => {
      Object.values(TOKEN_COST).forEach(cost => {
        expect(typeof cost).toBe('string');
      });
    });

    it('should have consistent costs', () => {
      expect(TOKEN_COST.SAVE).toBe('1');
      expect(TOKEN_COST.SAVE_AS).toBe('1');
      expect(TOKEN_COST.PRINT).toBe('1');
      expect(TOKEN_COST.EMAIL).toBe('1');
    });

    it('should have numeric string values', () => {
      Object.values(TOKEN_COST).forEach(cost => {
        expect(cost).toMatch(/^\d+$/);
        expect(Number(cost)).toBeGreaterThan(0);
      });
    });
  });

  describe('Network and Contract Address Consistency', () => {
    it('should have contract addresses for networks where needed', () => {
      const networksWithAddresses = ['CALIBRATION', 'FILECOIN', 'OPTIMISM_SEPOLIA', 'OPTIMISM'];
      
      networksWithAddresses.forEach(network => {
        expect(MEDT_TOKEN_ADDRESSES[network]).toBeTruthy();
        expect(MEDI_INVOICE_ADDRESSES[network]).toBeTruthy();
      });
    });

    it('should have all contract address networks in supported networks', () => {
      Object.keys(MEDT_TOKEN_ADDRESSES).forEach(network => {
        expect(SUPPORTED_NETWORKS).toHaveProperty(network);
      });

      Object.keys(MEDI_INVOICE_ADDRESSES).forEach(network => {
        expect(SUPPORTED_NETWORKS).toHaveProperty(network);
      });
    });
  });
});