# Claude Generated Code

**Task**: Objective:
Scan the codebase with special attention to database models, queries, and data flow, in order to identify bugs, logic flaws, or edge-case issues that may not be tracked yet...

Claude Tasks:

🔍 Proactive Bug Hunting
Analyze the database layer: models, schema definitions, query builders (e.g., SQL, Prisma, Mongoose, etc.).

Identify:

Incorrect or unsafe queries (e.g., missing filters, hardcoded values, potential SQL injection)

Data validation gaps

Improper error handling

Logic inconsistencies between frontend/backend

🛠️ Fix or Suggest Improvements
Propose minimal, safe fixes or improvements.

Group bugs by type or severity (e.g., critical, warning, suggestion).

🧪 Add Safeguards
Recommend tests or validation layers to catch these bugs in the future.



**Generated on**: Mon Jul 28 10:45:56 UTC 2025

## Generated Content

```
Based on my analysis of the codebase, I've identified several critical issues and potential improvements. Let me provide a comprehensive bug analysis and fixes.

## 🔍 CRITICAL ISSUES IDENTIFIED

### **CRITICAL SEVERITY**

1. **Missing Environment Variables Validation**
   - `main.tsx` references `import.meta.env.VITE_INFURA_API_KEY` but it's not defined in `vite-env.d.ts`
   - Firebase environment variables are defined but never validated

2. **Unsafe Data Handling in Spreadsheet**
   - `encodeURIComponent` used without validation in `NewFile.tsx`
   - No sanitization of user input in spreadsheet content
   - Potential XSS vulnerabilities through HTML content in cells

3. **Missing Error Boundaries**
   - No error handling for failed MetaMask connections
   - No fallback for storage operations

### **HIGH SEVERITY**

1. **Storage Layer Issues**
   - No validation of data integrity when saving/loading files
   - Missing error handling for Capacitor Preferences operations
   - No backup/recovery mechanism for corrupted data

2. **TypeScript Configuration Issues**
   - `strict: false` in tsconfig.json reduces type safety
   - Missing proper type definitions for external libraries

### **MEDIUM SEVERITY**

1. **Performance Issues**
   - Large hardcoded data strings in app-data.ts files
   - No lazy loading of heavy components
   - Inefficient re-rendering patterns

## 🛠️ FIXES AND IMPROVEMENTS

### FILES_TO_CREATE

1. **src/types/index.ts** - Central type definitions
2. **src/utils/validation.ts** - Input validation utilities
3. **src/utils/errorHandling.ts** - Error handling utilities
4. **src/components/ErrorBoundary.tsx** - React error boundary
5. **src/hooks/useStorage.ts** - Storage hook with error handling
6. **src/utils/sanitization.ts** - Data sanitization utilities

### FILES_TO_MODIFY

1. **src/vite-env.d.ts** - Add missing environment variables
2. **src/main.tsx** - Add error boundary and environment validation
3. **src/components/Storage/LocalStorage.ts** - Add validation and error handling
4. **src/components/NewFile/NewFile.tsx** - Add input validation and sanitization
5. **tsconfig.json** - Enable strict mode and improve type safety
6. **src/utils/constants.ts** - Add validation for network configurations

### CODE_CHANGES

#### **src/types/index.ts**
```typescript
// Central type definitions
export interface SpreadsheetCell {
  value: string;
  formula?: string;
  format?: CellFormat;
}

export interface CellFormat {
  font?: string;
  color?: string;
  background?: string;
  border?: string;
}

export interface FileData {
  created: string;
  modified: string;
  content: string;
  name: string;
  billType: number;
  version: string;
  checksum?: string;
}

export interface NetworkConfig {
  chainId: string;
  name: string;
  rpcUrl?: string;
  blockExplorer?: string;
}

export interface StorageError {
  code: string;
  message: string;
  timestamp: Date;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

#### **src/utils/validation.ts**
```typescript
import { ValidationResult } from '../types';

export class ValidationUtils {
  static validateFileName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('File name cannot be empty');
    }
    
    if (name.length > 255) {
      errors.push('File name cannot exceed 255 characters');
    }
    
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(name)) {
      errors.push('File name contains invalid characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateSpreadsheetContent(content: string): ValidationResult {
    const errors: string[] = [];
    
    if (!content) {
      errors.push('Content cannot be empty');
    }
    
    try {
      // Validate content size (max 10MB)
      const sizeInBytes = new Blob([content]).size;
      if (sizeInBytes > 10 * 1024 * 1024) {
        errors.push('Content size exceeds 10MB limit');
      }
      
      // Check for potential XSS patterns
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi
      ];
      
      for (const pattern of xssPatterns) {
        if (pattern.test(content)) {
          errors.push('Content contains potentially unsafe elements');
          break;
        }
      }
      
    } catch (error) {
      errors.push('Invalid content format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateNetworkConfig(config: any): ValidationResult {
    const errors: string[] = [];
    
    if (!config.chainId || typeof config.chainId !== 'string') {
      errors.push('Invalid chain ID');
    }
    
    if (config.chainId && !config.chainId.startsWith('0x')) {
      errors.push('Chain ID must be in hex format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateEnvironmentVariables(): ValidationResult {
    const errors: string[] = [];
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID'
    ];
    
    for (const varName of requiredVars) {
      if (!import.meta.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

#### **src/utils/sanitization.ts**
```typescript
export class SanitizationUtils {
  static sanitizeHTML(input: string): string {
    // Remove script tags and event handlers
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
  }

  static sanitizeSpreadsheetContent(content: string): string {
    try {
      // Decode and re-encode to prevent double encoding
      const decoded = decodeURIComponent(content);
      const sanitized = this.sanitizeHTML(decoded);
      return encodeURIComponent(sanitized);
    } catch (error) {
      console.error('Sanitization error:', error);
      return encodeURIComponent(content);
    }
  }

  static generateChecksum(content: string): string {
    // Simple checksum for data integrity
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}
```

#### **src/utils/errorHandling.ts**
```typescript
import { StorageError } from '../types';

export class ErrorHandler {
  static createStorageError(code: string, message: string): StorageError {
    return {
      code,
      message,
      timestamp: new Date()
    };
  }

  static handleStorageError(error: any): StorageError {
    if (error.code === 'quota_exceeded') {
      return this.createStorageError(
        'STORAGE_QUOTA_EXCEEDED',
        'Storage quota exceeded. Please delete some files.'
      );
    }
    
    if (error.code === 'permission_denied') {
      return this.createStorageError(
        'STORAGE_PERMISSION_DENIED',
        'Permission denied. Please check app permissions.'
      );
    }
    
    return this.createStorageError(
      'STORAGE_UNKNOWN_ERROR',
      error.message || 'An unknown storage error occurred'
    );
  }

  static handleNetworkError(error: any): StorageError {
    if (error.code === 'NETWORK_ERROR') {
      return this.createStorageError(
        'NETWORK_ERROR',
        'Network connection failed. Please check your internet connection.'
      );
    }
    
    return this.createStorageError(
      'NETWORK_UNKNOWN_ERROR',
      error.message || 'An unknown network error occurred'
    );
  }

  static logError(error: StorageError): void {
    console.error(`[${error.code}] ${error.message}`, {
      timestamp: error.timestamp,
      stack: new Error().stack
    });
    
    // In production, send to error reporting service
    if (import.meta.env.PROD) {
      // TODO: Send to error reporting service
    }
  }
}
```

#### **src/components/ErrorBoundary.tsx**
```typescript
import React, { Component, ReactNode } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton } from '@ionic/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error reporting service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error reporting service
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Something went wrong</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            {import.meta.env.DEV && this.state.error && (
              <details style={{ marginTop: '1rem' }}>
                <summary>Error Details (Development)</summary>
                <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <IonButton 
              fill="clear" 
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem' }}
            >
              Refresh Page
            </IonButton>
          </IonCardContent>
        </IonCard>
      );
    }

    return this.props.children;
  }
}
```

#### **src/hooks/useStorage.ts**
```typescript
import { useState, useCallback } from 'react';
import { Files, Local } from '../components/Storage/LocalStorage';
import { ErrorHandler } from '../utils/errorHandling';
import { ValidationUtils } from '../utils/validation';
import { SanitizationUtils } from '../utils/sanitization';
import { FileData, StorageError } from '../types';

export const useStorage = (store: Local) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StorageError | null>(null);

  const saveFile = useCallback(async (fileData: FileData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validate file data
      const nameValidation = ValidationUtils.validateFileName(fileData.name);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors.join(', '));
      }

      const contentValidation = ValidationUtils.validateSpreadsheetContent(fileData.content);
      if (!contentValidation.isValid) {
        throw new Error(contentValidation.errors.join(', '));
      }

      // Sanitize content
      const sanitizedContent = SanitizationUtils.sanitizeSpreadsheetContent(fileData.content);
      
      // Add checksum for integrity
      const checksum = SanitizationUtils.generateChecksum(sanitizedContent);
      
      const file = new Files(
        fileData.created,
        fileData.modified,
        sanitizedContent,
        fileData.name,
        fileData.billType,
        checksum
      );

      await store._saveFile(file);
      return true;
    } catch (err: any) {
      const storageError = ErrorHandler.handleStorageError(err);
      setError(storageError);
      ErrorHandler.logError(storageError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [store]);

  const loadFile = useCallback(async (fileName: string): Promise<FileData | null> => {
    setLoading(true);
    setError(null);

    try {
      const file = await store._getFile(fileName);
      if (!file) {
        return null;
      }

      // Verify checksum if available
      if (file.checksum) {
        const expectedChecksum = SanitizationUtils.generateChecksum(file.content);
        if (file.checksum !== expectedChecksum) {
          throw new Error('File integrity check failed');
        }
      }

      return file;
    } catch (err: any) {
      const storageError = ErrorHandler.handleStorageError(err);
      setError(storageError);
      ErrorHandler.logError(storageError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [store]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    saveFile,
    loadFile,
    loading,
    error,
    clearError
  };
};
```

#### **src/vite-env.d.ts** (MODIFIED)
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_VITE_APP_TITLE: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_INFURA_API_KEY: string; // Added missing variable
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

#### **src/main.tsx** (MODIFIED)
```typescript
import React from "react";
import { createRoot } from "react-dom/client";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ValidationUtils } from "./utils/validation";
import { ErrorHandler } from "./utils/errorHandling";
import App from "./App";

// Validate environment variables on startup
const envValidation = ValidationUtils.validateEnvironmentVariables();
if (!envValidation.isValid) {
  console.error('Environment validation failed:', envValidation.errors);
  
  // In development, show errors
  if (import.meta.env.DEV) {
    alert(`Environment setup errors:\n${envValidation.errors.join('\n')}`);
  }
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);

// MetaMask configuration with error handling
const metaMaskConfig = {
  debug: import.meta.env.DEV,
  sdkOptions: {
    dappMetadata: {
      name: "Government Invoice Suite",
      url: window.location.href,
    },
    infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY || undefined,
    // Add error handling for connection failures
    logging: {
      developerMode: import.meta.env.DEV,
    },
  },
};

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <MetaMaskProvider {...metaMaskConfig}>
        <App />
      </MetaMaskProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
```

#### **src/components/Storage/LocalStorage.ts** (MODIFIED)
```typescript
import { Preferences } from "@capacitor/preferences";
import { ValidationUtils } from "../../utils/validation";
import { SanitizationUtils } from "../../utils/sanitization";
import { ErrorHandler } from "../../utils/errorHandling";

export class Files {
  created: string;
  modified: string;
  name: string;
  content: string;
  billType: number;
  checksum?: string;

  constructor(
    created: string,
    modified: string,
    content: string,
    name: string,
    billType: number,
    checksum?: string
  ) {
    this.created = created;
    this.modified = modified;
    this.content = content;
    this.name = name;
    this.billType = billType;
    this.checksum = checksum;
  }

  static create(
    created: string,
    modified: string,
    content: string,
    name: string,
    billType: number = 0,
    checksum?: string
  ): Files {
    // Validate inputs
    const nameValidation = ValidationUtils.validateFileName(name);
    if (!nameValidation.isValid) {
      throw new Error(`Invalid file name: ${nameValidation.errors.join(', ')}`);
    }

    const contentValidation = ValidationUtils.validateSpreadsheetContent(content);
    if (!contentValidation.isValid) {
      throw new Error(`Invalid content: ${contentValidation.errors.join(', ')}`);
    }

    // Sanitize content
    const sanitizedContent = SanitizationUtils.sanitizeSpreadsheetContent(content);
    
    // Generate checksum if not provided
    const finalChecksum = checksum || SanitizationUtils.generateChecksum(sanitizedContent);

    return new Files(created, modified, sanitizedContent, name, billType, finalChecksum);
  }
}

export class Local {
  async _saveFile(file: Files): Promise<void> {
    try {
      // Validate file before saving
      if (!file.name || !file.content) {
        throw new Error('File name and content are required');
      }

      // Check storage quota (approximate)
      const existingFiles = await this._getAllFiles();
      const totalSize = existingFiles.reduce((sum, f) => sum + f.content.length, 0);
      const newSize = file.content.length;
      
      // Rough estimate of 5MB limit for local storage
      if (totalSize + newSize > 5 * 1024 * 1024) {
        throw new Error('Storage quota would be exceeded');
      }

      const fileData = JSON.stringify(file);
      await Preferences.set({
        key: `file_${file.name}`,
        value: fileData,
      });

      // Update file list
      await this._updateFileList(file.name);
    } catch (error: any) {
      const storageError = ErrorHandler.handleStorageError(error);
      ErrorHandler.logError(storageError);
      throw storageError;
    }
  }

  async _getFile(name: string): Promise<Files | null> {
    try {
      const nameValidation = ValidationUtils.validateFileName(name);
      if (!nameValidation.isValid) {
        throw new Error(`Invalid file name: ${nameValidation.errors.join(', ')}`);
      }

      const { value } = await Preferences.get({ key: `file_${name}` });
      if (!value) {
        return null;
      }

      const fileData = JSON.parse(value);
      
      // Verify checksum if available
      if (fileData.checksum) {
        const expectedChecksum = SanitizationUtils.generateChecksum(fileData.content);
        if (fileData.checksum !== expectedChecksum) {
          console.warn(`File integrity check failed for ${name}`);
          // Don't throw error, but log warning
        }
      }

      return new Files(
        fileData.created,
        fileData.modified,
        fileData.content,
        fileData.name,
        fileData.billType,
        fileData.checksum
      );
    } catch (error: any) {
      const storageError = ErrorHandler.handleStorageError(error);
      ErrorHandler.logError(storageError);
      return null;
    }
  }

  async _getAllFiles(): Promise<Files[]> {
    try {
      const { value } = await Preferences.get({ key: 'file_list' });
      if (!value) {
        return [];
      }

      const fileNames = JSON.parse(value);
      const files: Files[] = [];

      for (const name of fileNames) {
        const file = await this._getFile(name);
        if (file) {
          files.push(file);
        }
      }

      return files;
    } catch (error: any) {
      const storageError = ErrorHandler.handleStorageError(error);
      ErrorHandler.logError(storageError);
      return [];
    }
  }

  async _deleteFile(name: string): Promise<void> {
    try {
      await Preferences.remove({ key: `file_${name}` });
      await this._removeFromFileList(name);
    } catch (error: any) {
      const storageError = ErrorHandler.handleStorageError(error);
      ErrorHandler.logError(storageError);
      throw storageError;
    }
  }

  private async _updateFileList(fileName: string): Promise<void> {
    const { value } = await Preferences.get({ key: 'file_list' });
    const fileList = value ? JSON.parse(value) : [];
    
    if (!fileList.includes(fileName)) {
      fileList.push(fileName);
      await Preferences.set({
        key: 'file_list',
        value: JSON.stringify(fileList),
      });
    }
  }

  private async _removeFromFileList(fileName: string): Promise<void> {
    const { value } = await Preferences.get({ key: 'file_list' });
    if (value) {
      const fileList = JSON.parse(value);
      const filteredList = fileList.filter((name: string) => name !== fileName);
      await Preferences.set({
        key: 'file_list',
        value: JSON.stringify(filteredList),
      });
    }
  }
}
```

#### **src/components/NewFile/NewFile.tsx** (MODIFIED)
```typescript
import React, { useState } from "react";
import * as AppGeneral from "../socialcalc/index.js";
import { useStorage } from "../../hooks/useStorage";
import { Local } from "../Storage/LocalStorage";
import { DATA } from "../../app-data.js";
import { ValidationUtils } from "../../utils/validation";
import { IonAlert, IonIcon, IonToast } from "@ionic/react";
import { add } from "ionicons/icons";

const NewFile: React.FC<{
  file: string;
  updateSelectedFile: Function;
  store: Local;
  billType: number;
}> = (props) => {
  const [showAlertNewFileCreated, setShowAlertNewFileCreated] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { saveFile, loading, error } = useStorage(props.store);

  const newFile = async () => {
    try {
      if (props.file !== "default") {
        const content = AppGeneral.getSpreadsheetContent();
        
        // Validate content before processing
        const contentValidation = ValidationUtils.validateSpreadsheetContent(content);
        if (!contentValidation.isValid) {
          setErrorMessage(contentValidation.errors.join(', '));
          setShowError(true);
          return;
        }

        const success = await saveFile({
          created: new Date().toString(),
          modified: new Date().toString(),
          content,
          name: props.file,
          billType: props.billType,
          version: '1.0'
        });

        if (success) {
          props.updateSelectedFile(props.file);
          setShowAlertNewFileCreated(true);
        } else if (error) {
          setErrorMessage(error.message);
          setShowError(true);
        }
      }

      // Load default template
      const msc = DATA["ledger"][AppGeneral.getDeviceType()]["msc"];
      AppGeneral.viewFile("default", JSON.stringify(msc));
      
    } catch (err: any) {
      console.error('Error creating new file:', err);
      setErrorMessage(err.message || 'Failed to create new file');
      setShowError(true);
    }
  };

  return (
    <>
      <IonIcon 
        icon={add} 
        onClick={newFile}
        style={{ 
          fontSize: '24px', 
          cursor: 'pointer',
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? 'none' : 'auto'
        }}
      />
      
      <IonAlert
        isOpen={showAlertNewFileCreated}
        onDidDismiss={() => setShowAlertNewFileCreated(false)}
        header="Success"
        message="New file created successfully!"
        buttons={['OK']}
      />
      
      <IonToast
        isOpen={showError}
        onDidDismiss={() => setShowError(false)}
        message={errorMessage}
        duration={3000}
        color="danger"
        position="top"
      />
    </>
  );
};

export default NewFile;
```

#### **tsconfig.json** (MODIFIED)
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### **src/utils/constants.ts** (MODIFIED)
```typescript
import { ValidationUtils } from './validation';

export const MEDT_TOKEN_ADDRESSES = {
  CALIBRATION: "0xb83bFF8Fdbe7C27B06E5f83D38881fB03A518B78",
  FILECOIN: "0xC00BBC9A2C88712dC1e094866973F036373C7134",
  LINEA_SEPOLIA: "",
  BASE_SEPOLIA: "",
  OPTIMISM_SEPOLIA: "0xc76F004CB35ec0971075060D4DBd6279d2252Acf",
  OPTIMISM: "0xc76F004CB35ec0971075060D4DBd6279d2252Acf",
  POLYGON_AMOY: "",
  CELO_ALFAJORES: ""
};

export const MEDI_INVOICE_ADDRESSES = {
  CALIBRATION: "0x01c7BAAFa38dd9B5B62FFB20f5228Dd0c63F6d70",
  FILECOIN: "0xb0Bda1Ad964a55ACB077587e42BDfeC587D7e520",
  LINEA_SEPOLIA: "",
  BASE_SEPOLIA: "",
  OPTIMISM_SEPOLIA: "0xEc490F81156e14A4b364E4fe5a3d116eFd697eED",
  OPTIMISM: "0x49009CD05805ce571DcE7b577677F73B5828aB53",
  POLYGON_AMOY: "",
  CELO_ALFAJORES: ""
};

export const SUPPORTED_NETWORKS = {
  CALIBRATION: {
    chainId: "0x4cb2f"
  },
  FILECOIN: {
    chainId: "0x13a"
  },
  LINEA_SEPOLIA: {
    chainId: "0xe704"
  },
  BASE_SEPOLIA: {
    chainId: "0x14a34"
  },
  OPTIMISM_SEPOLIA: {
    chainId: "0xaa37dc"
  },
  OPTIMISM: {
    chainId: "0xa"
  },
  POLYGON_AMOY: {
    chainId: "0x13882"
  },
  CELO_ALFAJORES: {
    chainId: "0xaef3"
  }
};

// Validate network configurations on module load
Object.entries(SUPPORTED_NETWORKS).forEach(([name, config]) => {
  const validation = ValidationUtils.validateNetworkConfig(config);
  if (!validation.isValid) {
    console.warn(`Invalid network configuration for ${name}:`, validation.errors);
  }
});

// Constants for validation
export const VALIDATION_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILENAME_LENGTH: 255,
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB total storage
  SUPPORTED
```
