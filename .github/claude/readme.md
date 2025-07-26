# Invoice PPT Subscribe Storacha Storage

A comprehensive blockchain-powered invoice and spreadsheet management system built with Ionic React, featuring Web3 integration, decentralized storage, and multi-platform support. This application combines traditional spreadsheet functionality with modern blockchain technology for secure document management and payment processing.

## 🚀 Features

### Core Functionality
- **Interactive Spreadsheet Editor**: Built-in SocialCalc integration for creating and editing invoices
- **Multi-Platform Support**: Cross-platform compatibility (Web, Android, iOS)
- **Blockchain Integration**: MetaMask wallet connectivity with multi-chain support
- **Decentralized Storage**: Storacha (Web3.Storage) integration for secure file storage
- **Smart Contract Integration**: Token-based subscription system with automated payments
- **Email Integration**: Direct invoice sharing via email
- **Print Support**: Native printing capabilities for invoices
- **PWA Ready**: Progressive Web App with offline capabilities

### Blockchain Features
- **Multi-Chain Support**: Filecoin, Optimism, Calibration, Linea Sepolia, Base Sepolia, and more
- **Token Payments**: MEDT token integration for subscription payments
- **Smart Contracts**: Automated invoice management and subscription handling
- **Wallet Integration**: Seamless MetaMask connectivity
- **Decentralized File Storage**: IPFS-based storage through Storacha

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Offline Capability**: Local storage with cloud synchronization
- **File Management**: Create, edit, save, and organize invoice files
- **Real-time Updates**: Live spreadsheet editing and calculation
- **Dark/Light Theme**: Customizable UI themes

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and functional components
- **Ionic 7.0.0** - Cross-platform UI framework
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with CSS variables

### Blockchain & Web3
- **MetaMask SDK** - Wallet integration and Web3 connectivity
- **Ethers.js 5.6.0** - Ethereum interaction library
- **Wagmi** - React hooks for Ethereum
- **Smart Contracts** - Custom ERC-20 token and invoice management contracts

### Storage & Data
- **Storacha (Web3.Storage)** - Decentralized file storage
- **Capacitor Preferences** - Local data persistence
- **LocalStorage** - Browser-based storage
- **IPFS** - Distributed file system

### Development Tools
- **Vite** - Build tool and development server
- **ESLint** - Code linting and formatting
- **TypeScript Compiler** - Type checking and compilation
- **PWA Assets Generator** - Progressive Web App asset generation

### Mobile/Desktop
- **Capacitor 5.7.0** - Native mobile app wrapper
- **Android SDK** - Android platform support
- **Ionic Native** - Native device features access
- **Email Composer** - Native email integration
- **Printer Plugin** - Native printing support

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Files/          # File management interface
│   ├── Menu/           # Application menu and actions
│   ├── NewFile/        # New file creation
│   ├── Storage/        # Local storage utilities
│   └── socialcalc/     # Spreadsheet engine
├── pages/              # Main application pages
├── utils/              # Utility functions and constants
│   ├── constants.ts    # Blockchain addresses and configuration
│   ├── medinvoiceabi.json  # Smart contract ABI
│   └── meditokenabi.json   # Token contract ABI
├── theme/              # UI theme and styling
└── app-data.ts         # Application data and templates
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- MetaMask wallet
- Git

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/anisharma07/Invoice-PPT-Subscribe-Storacha-Storage.git

# Navigate to project directory
cd Invoice-PPT-Subscribe-Storacha-Storage

# Install dependencies
npm install
# or
yarn install

# Install Capacitor dependencies
npx cap sync
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_INFURA_API_KEY=your_infura_api_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🎯 Usage

### Development
```bash
# Start development server
npm run dev
# or
yarn dev

# Open in browser at http://localhost:5173
```

### Production
```bash
# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

### Mobile Development
```bash
# Add Android platform
npx cap add android

# Add iOS platform
npx cap add ios

# Build and sync
npm run build
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

### PWA Assets Generation
```bash
# Generate PWA assets
npm run generate-pwa-assets
```

## 📱 Platform Support

- **Web Browsers**: Chrome, Firefox, Safari, Edge
- **Android**: Android 7.0+ (API level 24+)
- **iOS**: iOS 13.0+
- **Desktop**: Progressive Web App installation
- **Blockchain Networks**: 
  - Filecoin Mainnet & Calibration
  - Optimism & Optimism Sepolia
  - Linea Sepolia
  - Base Sepolia
  - Polygon Amoy
  - Celo Alfajores

## 🧪 Testing

```bash
# Run unit tests
npm run test.unit

# Run end-to-end tests
npm run test.e2e

# Lint code
npm run lint
```

## 🔄 Deployment

### Web Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting service
```

### Mobile App Deployment
```bash
# Build and prepare for mobile
npm run build
npx cap sync

# Generate signed APK (Android)
npx cap open android
# Use Android Studio to build signed APK

# Generate iOS build
npx cap open ios
# Use Xcode to build and archive
```

## 📊 Performance & Optimization

- **Code Splitting**: Vendor chunks separation for optimized loading
- **PWA Caching**: Service worker for offline functionality
- **Lazy Loading**: Component-based code splitting
- **Bundle Analysis**: Optimized build output with manual chunks
- **BigInt Support**: ES2020 target for modern JavaScript features

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Ionic components for UI consistency
- Maintain responsive design principles
- Test on multiple platforms before submitting
- Document any new blockchain integrations
- Follow the existing code structure and naming conventions

### Code Style
- Use ESLint configuration provided
- Follow React functional component patterns
- Maintain TypeScript type safety
- Use meaningful variable and function names

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Manu Sheel Gupta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **SocialCalc** - Spreadsheet engine integration
- **Ionic Team** - Cross-platform framework
- **MetaMask** - Web3 wallet integration
- **Storacha** - Decentralized storage solution
- **Filecoin** - Blockchain storage network
- **React Community** - Frontend framework ecosystem

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/anisharma07/Invoice-PPT-Subscribe-Storacha-Storage/issues)
- **Discussions**: [GitHub Discussions](https://github.com/anisharma07/Invoice-PPT-Subscribe-Storacha-Storage/discussions)
- **Email**: Contact through GitHub profile
- **Documentation**: Check the `/docs` folder for additional documentation

---

**Note**: This application integrates with blockchain networks and requires MetaMask wallet for full functionality. Ensure you have test tokens for development and understand the associated gas costs for blockchain transactions.