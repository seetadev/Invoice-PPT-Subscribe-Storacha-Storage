import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { encryptString, decryptToString } from '@lit-protocol/encryption';
import { LIT_NETWORK } from '@lit-protocol/constants';
import { AccessControlConditions, ILitNodeClient } from '@lit-protocol/types';
import { ethers } from 'ethers';

let litNodeClient: ILitNodeClient | null = null;

// Helper function to get chain type from chain ID
function getChainType(chainId: number): 'ethereum' | 'polygon' | 'mumbai' | 'arbitrum' | 'optimism' {
  switch (chainId) {
    case 1: // Ethereum Mainnet
    case 5: // Goerli
    case 11155111: // Sepolia
      return 'ethereum';
    case 137: // Polygon Mainnet
      return 'polygon';
    case 80001: // Mumbai
      return 'mumbai';
    case 42161: // Arbitrum One
      return 'arbitrum';
    case 10: // Optimism
      return 'optimism';
    default:
      return 'ethereum'; // Default to ethereum if chain not recognized
  }
}

export async function getLitClient() {
  if (!litNodeClient) {
    litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: false
    });
    await litNodeClient.connect();
  }
  return litNodeClient;
}

export async function encryptData(data: string, spaceDid: string) {
  const litClient = await getLitClient();
  
  // Get the user's wallet from MetaMask
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const signer = provider.getSigner();
  const wallet = await signer.getAddress();
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  const chainType = getChainType(chainId);

  const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: chainType,
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: wallet
      }
    }
  ] as AccessControlConditions;

  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      dataToEncrypt: data,
      accessControlConditions
    },
    litClient
  );

  return {
    ciphertext,
    dataToEncryptHash,
    accessControlConditions,
    chainId
  };
}

export async function decryptData(
  ciphertext: string,
  dataToEncryptHash: string,
  accessControlConditions: AccessControlConditions,
  spaceDid: string
) {
  try {
    const litClient = await getLitClient();
    
    // Get the user's wallet from MetaMask
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const wallet = await signer.getAddress();
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const chainType = getChainType(chainId);
    
    // Create SIWE message
    const domain = 'localhost';
    const origin = 'https://localhost';
    const statement = 'Decrypting file from IPFS';
    const uri = origin;
    const version = '1';
    const nonce = Math.random().toString(36).substring(2, 15);
    const issuedAt = new Date().toISOString();
    const expirationTime = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour from now

    const message = `${domain} wants you to sign in with your Ethereum account:\n${wallet}\n\n${statement}\n\nURI: ${uri}\nVersion: ${version}\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expirationTime}`;

    // Get auth sig using MetaMask
    const signature = await signer.signMessage(message);
    
    const authSig = {
      sig: signature,
      derivedVia: 'web3.eth.personal.sign',
      signedMessage: message,
      address: wallet
    };

    // Update access control conditions to match the current wallet and chain
    const updatedAccessControlConditions = [
      {
        ...accessControlConditions[0],
        chain: chainType,
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: wallet
        }
      }
    ] as AccessControlConditions;
    
    // Decrypt the data
    const decryptedString = await decryptToString(
      {
        accessControlConditions: updatedAccessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain: chainType
      },
      litClient
    );
    
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
} 