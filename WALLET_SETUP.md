# Wallet Connection Setup

## Overview

Sentrix uses wallet-only authentication. Users connect their Ethereum wallet and sign a message to authenticate.

## Features

- **Multiple Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet
- **Auto-authentication**: Automatically authenticates when wallet connects
- **JWT Token Management**: Stores and manages authentication tokens
- **Persistent Sessions**: Remembers authentication state

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# WalletConnect (optional - for WalletConnect support)
# Get your project ID from https://cloud.walletconnect.com
VITE_WALLETCONNECT_PROJECT_ID=your-project-id
```

### 3. WalletConnect (Optional)

If you want to support WalletConnect (for mobile wallets):

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a project
3. Copy your Project ID
4. Add it to `.env` as `VITE_WALLETCONNECT_PROJECT_ID`

## Usage

### Connecting a Wallet

1. Click the "Connect Wallet" button in the navbar
2. Select your wallet provider (MetaMask, WalletConnect, etc.)
3. Approve the connection in your wallet
4. Sign the authentication message
5. You're now authenticated!

### Disconnecting

1. Click on your wallet address in the navbar
2. Select "Disconnect"
3. Your session will be cleared

## Architecture

### Components

- **WalletButton** (`src/components/wallet/WalletButton.tsx`): UI component for wallet connection
- **WalletContext** (`src/contexts/WalletContext.tsx`): React context for wallet state
- **wallet.ts** (`src/lib/wallet.ts`): Wallet utilities and API integration

### Flow

1. User clicks "Connect Wallet"
2. Wagmi connects to wallet provider
3. Wallet address is obtained
4. Backend generates nonce for authentication
5. User signs message with wallet
6. Backend verifies signature
7. JWT token is stored in localStorage
8. User is authenticated

## API Integration

The wallet connection integrates with the backend authentication API:

- `GET /auth/nonce?wallet=0x...` - Get authentication nonce
- `POST /auth/verify` - Verify signature and get JWT token

All authenticated API requests include the JWT token in the `Authorization` header.

## Supported Wallets

- **MetaMask** (via Injected connector)
- **WalletConnect** (mobile wallets)
- **Coinbase Wallet**
- Any wallet that supports EIP-1193

## Troubleshooting

### Wallet Not Connecting

- Ensure your wallet extension is installed and unlocked
- Check browser console for errors
- Try refreshing the page

### Authentication Failing

- Verify backend is running on `VITE_API_URL`
- Check that wallet signature is valid
- Ensure nonce hasn't expired (5 minutes)

### Token Not Persisting

- Check browser localStorage is enabled
- Verify token is being stored correctly
- Clear localStorage and reconnect if needed

## Development

### Testing Wallet Connection

1. Install MetaMask browser extension
2. Create or import a test account
3. Connect to the app
4. Sign the authentication message

### Mock/Test Mode

For development without a real wallet, you can:
- Use a test account on a testnet
- Use MetaMask's test accounts
- Connect to Sepolia testnet

## Security Notes

- Never expose private keys
- Always verify signatures on the backend
- Use HTTPS in production
- Validate wallet addresses
- Implement rate limiting for authentication

