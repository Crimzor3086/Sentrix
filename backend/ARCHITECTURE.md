# Architecture Overview

## 🏗️ System Architecture

```
┌─────────────┐
│   Frontend  │ (React/TypeScript)
│  (Port 5173)│
└──────┬──────┘
       │ HTTP/REST
       │ JWT Auth
       ▼
┌─────────────────────────────────────┐
│         Sentrix Backend              │
│         (Port 3001)                  │
│                                       │
│  ┌──────────┐  ┌──────────┐          │
│  │   Auth   │  │    IP    │          │
│  │  Module  │  │  Module  │          │
│  └──────────┘  └──────────┘          │
│                                       │
│  ┌──────────┐  ┌──────────┐          │
│  │ License │  │  Guard   │          │
│  │ Module  │  │  Module  │          │
│  └──────────┘  └──────────┘          │
│                                       │
│  ┌──────────┐  ┌──────────┐          │
│  │  Sync    │  │Analytics │          │
│  │  Worker  │  │  Module  │          │
│  └──────────┘  └──────────┘          │
└──────┬───────────────────┬───────────┘
       │                   │
       ▼                   ▼
┌─────────────┐    ┌──────────────┐
│  PostgreSQL │    │ Story Protocol│
│  Database   │    │    L1 Chain   │
└─────────────┘    └──────────────┘
       │
       ▼
┌─────────────┐
│    Pinata   │
│    IPFS     │
└─────────────┘
```

## 📦 Module Structure

### Authentication Module (`/modules/auth`)
- **Purpose**: Wallet-only authentication
- **Flow**: Nonce → Signature → JWT Token
- **Files**:
  - `service.ts` - Nonce generation, signature verification
  - `routes.ts` - `/auth/nonce`, `/auth/verify`
  - `middleware.ts` - JWT authentication middleware

### IP Module (`/modules/ip`)
- **Purpose**: IP Asset registration and management
- **Flow**: Upload → IPFS → Story Protocol → Database
- **Files**:
  - `service.ts` - IP creation, retrieval
  - `routes.ts` - `/ip/register`, `/ip/:id`, `/ip/user/:wallet`

### License Module (`/modules/license`)
- **Purpose**: License creation and sales
- **Flow**: Create License → Story Protocol → Purchase → Certificate
- **Files**:
  - `service.ts` - License creation, purchase logic
  - `routes.ts` - `/license/create`, `/license/purchase`, `/license/user/:wallet`

### Guard Module (`/modules/guard`)
- **Purpose**: IP violation detection
- **Flow**: Report → Analysis → Authenticity Report
- **Files**:
  - `service.ts` - Report submission, authenticity analysis
  - `routes.ts` - `/report/submit`, `/report/ip/:id`

### Sync Module (`/modules/sync`)
- **Purpose**: Story Protocol event synchronization
- **Flow**: Poll Events → Store → Process → Update DB
- **Files**:
  - `service.ts` - Event syncing logic
  - `worker.ts` - Cron job for periodic syncing

### Analytics Module (`/modules/analytics`)
- **Purpose**: Platform analytics and metrics
- **Files**:
  - `routes.ts` - `/analytics/ip/created`, `/analytics/licenses/sold`, `/analytics/revenue`

## 🔄 Data Flow

### IP Registration Flow
```
1. User uploads content
2. Backend uploads to IPFS (Pinata)
3. Metadata created and uploaded to IPFS
4. Story Protocol: Register IP Asset
5. Store in PostgreSQL
6. Return IP Asset ID
```

### License Purchase Flow
```
1. User selects license
2. Backend creates certificate
3. Certificate uploaded to IPFS
4. Story Protocol: Purchase license
5. Update license in database
6. Return certificate
```

### Authentication Flow
```
1. Client requests nonce
2. User signs message with wallet
3. Backend verifies signature (viem)
4. Generate JWT token
5. Return token to client
```

## 🗄️ Database Schema

### Core Models
- **User**: Wallet addresses
- **IPAsset**: IP registrations with Story Protocol IDs
- **License**: License contracts and purchases
- **Report**: Violation reports
- **StoryEvent**: Synced blockchain events

### Relationships
```
User 1:N IPAsset (creator)
User 1:N License (creator/buyer)
IPAsset 1:N License
IPAsset 1:N Report
```

## 🔐 Security

### Authentication
- Wallet signature verification (no passwords)
- JWT tokens for session management
- Nonce-based challenge-response

### Data Protection
- Environment variables for secrets
- Prisma ORM for SQL injection prevention
- Input validation with Zod

### API Security
- CORS configuration
- JWT middleware for protected routes
- Rate limiting (can be added)

## 🔌 External Integrations

### Story Protocol
- **Purpose**: On-chain IP registration and licensing
- **Integration**: viem + Story Protocol SDK (requires implementation)
- **Events**: IPRegistered, LicenseCreated, LicensePurchased

### Pinata / IPFS
- **Purpose**: Decentralized content storage
- **Integration**: @pinata/sdk
- **Storage**: Content files, metadata, certificates

### PostgreSQL
- **Purpose**: Relational data storage
- **ORM**: Prisma
- **Use**: User data, IP assets, licenses, reports, events

## 🚀 Deployment

### Development
- Local PostgreSQL
- Hot reload with `tsx watch`
- Prisma Studio for DB inspection

### Production
- Docker containers
- Environment-based configuration
- Database migrations on startup
- Event sync worker running

## 📊 Monitoring

### Logging
- Fastify built-in logger
- Error tracking
- Event sync status

### Analytics
- IP creation metrics
- License sales tracking
- Revenue analytics (calculated from license prices)

## 🔮 Future Enhancements

1. **Payment Integration**: Real revenue tracking
2. **AI/ML**: Enhanced violation detection
3. **Real-time**: WebSocket support for live updates
4. **Caching**: Redis for nonce storage
5. **Rate Limiting**: API rate limiting middleware
6. **Monitoring**: Prometheus metrics, health checks

