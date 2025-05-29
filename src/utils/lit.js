import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LIT_NETWORK } from '@lit-protocol/constants';

let litNodeClientInstance = null;

export async function getLitNodeClient() {
  if (!litNodeClientInstance) {
    litNodeClientInstance = new LitNodeClient({ 
      litNetwork: LIT_NETWORK.DatilDev,
      debug: true 
    });
    await litNodeClientInstance.connect();
  }
  return litNodeClientInstance;
}