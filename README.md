# Invoice-PPT-Subscribe-Storacha-Storage

This project implements secure file storage using IPFS (Storacha) with Lit Protocol encryption for medical invoice data. The implementation ensures that only authorized users can access the encrypted data.

## Features

- Secure file encryption using Lit Protocol
- IPFS storage integration with Storacha
- Dynamic chain support for multiple networks (Ethereum, Polygon, Mumbai, Arbitrum, Optimism)
- MetaMask wallet integration for authentication
- Local storage backup with decryption

## Prerequisites

- Node.js (v16 or higher)
- MetaMask wallet installed
- Access to an Ethereum-compatible network (Mainnet, Goerli, Sepolia, Polygon, Mumbai, etc.)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Invoice-PPT-Subscribe-Storacha-Storage
```

2. Install dependencies:
```bash
yarn install
```

## Configuration

The project uses Lit Protocol for encryption. Make sure you have the following dependencies in your `package.json`:

```json
{
  "dependencies": {
    "@lit-protocol/lit-node-client": "^7.0.2",
    "@lit-protocol/encryption": "^7.0.2",
    "@lit-protocol/constants": "^7.0.2",
    "@lit-protocol/types": "^7.0.2",
    "siwe": "^2.6.0",
    "buffer": "^6.0.3"
  }
}
```

## Running the Application

1. Start the development server:
```bash
yarn dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Connect your MetaMask wallet to the application

## Usage

### Encrypting and Uploading Files

1. complete the invoice and use save as to upload
2. The file will be automatically encrypted using Lit Protocol
3. The encrypted file will be uploaded to IPFS via Storacha
4. The file metadata will be stored in your local state

### Accessing Encrypted Files

1. Files stored in IPFS can be accessed by authorized users
2. The system will automatically:
   - Retrieve the encrypted file from IPFS
   - Verify the user's wallet address against access control conditions
   - Decrypt the file using Lit Protocol
   - Display the decrypted content

### Moving Files to Local Storage

1. Select a file from IPFS storage
2. Click "Move to Local Storage"
3. The system will:
   - Retrieve the encrypted file from IPFS
   - Decrypt the file using your wallet signature
   - Save the decrypted file to local storage

## Supported Networks

The application supports multiple networks for encryption/decryption:

- Ethereum Mainnet (Chain ID: 1)
- Goerli Testnet (Chain ID: 5)
- Sepolia Testnet (Chain ID: 11155111)
- Polygon Mainnet (Chain ID: 137)
- Mumbai Testnet (Chain ID: 80001)
- Arbitrum One (Chain ID: 42161)
- Optimism (Chain ID: 10)

## Security Considerations

- Always ensure you're connected to the correct network in MetaMask
- Keep your wallet private keys secure
- The encryption is tied to your wallet address, so only you can decrypt the files
- Access control conditions are enforced at the protocol level

## Troubleshooting

### Common Issues

1. **MetaMask Not Connected**
   - Ensure MetaMask is installed and unlocked
   - Check if you're connected to a supported network

2. **Decryption Failed**
   - Verify you're using the same wallet that encrypted the file
   - Check if you're connected to the same network used for encryption
   - Ensure your wallet has the necessary permissions

3. **IPFS Upload Failed**
   - Check your internet connection
   - Verify your Storacha credentials
   - Ensure the file size is within limits

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.