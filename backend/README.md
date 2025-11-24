# Sentrix Backend

Decentralized IP License Guard - Backend API

## 🚀 Overview

Sentrix is a platform that tokenizes intellectual property (IP) and stores IP metadata on Story Protocol L1. This backend provides:

- **Wallet-only authentication** (no email/password)
- **IP Asset registration** with IPFS storage and Story Protocol minting
- **License creation and sales** on-chain
- **IP violation detection** with automated proof reports
- **Story Protocol event syncing** for real-time analytics
- **RESTful API** with Swagger documentation

## 📋 Prerequisites

- **Node.js** 20+ or **Bun**
- **PostgreSQL** 16+
- **Pinata account** (for IPFS storage)
- **Story Protocol** testnet/mainnet access
- **Ethereum wallet** with private key

## 🛠️ Installation

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sentrix?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Story Protocol
STORY_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
STORY_CHAIN_ID=421614
STORY_IP_ASSET_REGISTRY_ADDRESS=0x...
STORY_LICENSING_MODULE_ADDRESS=0x...
STORY_PRIVATE_KEY=0x...

# IPFS / Pinata
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/

# Event Sync
SYNC_INTERVAL_SECONDS=30
SYNC_ENABLED=true
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

## 🏃 Running the Server

### Development

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## 🐳 Docker

### Development

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production

```bash
docker-compose up -d
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI JSON**: http://localhost:3001/docs/json

## 🔌 API Endpoints

### Authentication

- `GET /auth/nonce?wallet=0x...` - Generate authentication nonce
- `POST /auth/verify` - Verify wallet signature and get JWT token

### IP Assets

- `POST /ip/register` - Register a new IP Asset (requires auth)
- `GET /ip/:id` - Get IP Asset by ID
- `GET /ip/user/:wallet` - Get IP Assets by creator wallet

### Licensing

- `POST /license/create` - Create a license for an IP Asset (requires auth)
- `POST /license/purchase` - Purchase a license (requires auth)
- `GET /license/user/:wallet?type=created|purchased` - Get licenses by user

### Reports

- `POST /report/submit` - Submit a violation report (requires auth)
- `GET /report/ip/:id` - Get reports for an IP Asset

### Analytics

- `GET /analytics/ip/created?days=30` - IP creation analytics
- `GET /analytics/licenses/sold?days=30` - License sales analytics
- `GET /analytics/revenue?days=30` - Revenue analytics

## 🔐 Authentication Flow

1. **Request Nonce**:
   ```bash
   GET /auth/nonce?wallet=0x1234...
   ```
   Returns: `{ nonce: "...", message: "Sign in to Sentrix: ..." }`

2. **Sign Message** (client-side):
   ```javascript
   const signature = await signer.signMessage(message);
   ```

3. **Verify & Get Token**:
   ```bash
   POST /auth/verify
   {
     "wallet": "0x1234...",
     "signature": "0xabcd..."
   }
   ```
   Returns: `{ token: "jwt...", user: {...} }`

4. **Use Token**:
   Include in requests: `Authorization: Bearer <token>`

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Wallet authentication
│   │   ├── ip/            # IP Asset management
│   │   ├── license/       # License creation & sales
│   │   ├── guard/         # Violation detection
│   │   ├── sync/          # Story event syncer
│   │   └── analytics/     # Analytics endpoints
│   ├── utils/
│   │   ├── wallet.ts      # Wallet utilities
│   │   ├── ipfs.ts        # IPFS/Pinata integration
│   │   └── story.ts       # Story Protocol SDK
│   ├── config/
│   │   ├── env.ts         # Environment validation
│   │   └── database.ts    # Prisma client
│   ├── app.ts             # Fastify app setup
│   └── server.ts          # Server entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## 🔄 Story Protocol Integration

The backend integrates with Story Protocol for:

- **IP Asset Registration**: Minting IP tokens on-chain
- **License Creation**: Deploying license contracts
- **License Sales**: Recording purchases on-chain
- **Event Syncing**: Polling blockchain events and storing in PostgreSQL

### Event Sync Worker

The sync worker runs automatically and:
- Polls Story Protocol for new events
- Stores events in `story_events` table
- Processes events to update IP Assets and Licenses
- Runs every N seconds (configurable via `SYNC_INTERVAL_SECONDS`)

To run the worker manually:

```bash
npm run sync:events
```

## 📦 Database Models

- **User**: Wallet addresses and user data
- **IPAsset**: Registered IP assets with Story Protocol IDs
- **License**: License contracts and purchases
- **Report**: Violation reports with authenticity scores
- **StoryEvent**: Synced blockchain events

## 🔧 Development

### Adding New Endpoints

1. Create service in `src/modules/<module>/service.ts`
2. Create routes in `src/modules/<module>/routes.ts`
3. Register routes in `src/app.ts`

### Database Migrations

```bash
# Create migration
npm run prisma:migrate

# Apply migrations
npm run prisma:migrate deploy
```

## 🚨 Important Notes

1. **Story Protocol SDK**: The current implementation includes placeholder functions for Story Protocol integration. You'll need to integrate with the actual Story Protocol SDK when available.

2. **IPFS Upload**: Currently uses Pinata. You can switch to other IPFS providers by modifying `src/utils/ipfs.ts`.

3. **Security**: 
   - Never commit `.env` files
   - Use strong `JWT_SECRET` in production
   - Keep `STORY_PRIVATE_KEY` secure
   - Enable HTTPS in production

4. **CORS**: Configure `FRONTEND_URL` to match your frontend domain.

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.

