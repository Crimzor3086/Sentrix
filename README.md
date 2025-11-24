# Sentrix - Decentralized IP License Guard

**Decentralized IP License Guard** - Tokenize intellectual property and protect it on-chain with Story Protocol.

## 🚀 Overview

Sentrix is a comprehensive platform that enables creators to:
- **Tokenize IP** and store metadata on Story Protocol L1
- **Create and sell licenses** for their intellectual property
- **Detect violations** with automated authenticity reports
- **Track analytics** with real-time blockchain event syncing

## 🏗️ Architecture

This project consists of:
- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: Node.js + Fastify + TypeScript (Port 3001)
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Story Protocol L1 integration
- **Storage**: IPFS via Pinata

## 📋 Prerequisites

- **Node.js** 20+ or **Bun**
- **PostgreSQL** 16+
- **Pinata account** (for IPFS storage)
- **Story Protocol** testnet/mainnet access
- **Ethereum wallet** with private key

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd Sentrix
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Set Up Environment Variables

**Frontend**: Create `.env` in root (if needed)

**Backend**: Create `.env` in `backend/` directory:

```bash
cd backend
cp env.example .env
# Edit .env with your configuration
```

See [backend/README.md](./backend/README.md) for detailed environment setup.

### 5. Set Up Database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

### Production Build

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## 🐳 Docker Deployment

See [backend/README.md](./backend/README.md) for Docker setup instructions.

## 📚 Documentation

- **Backend API**: [backend/README.md](./backend/README.md)
- **API Documentation**: http://localhost:3001/docs (when backend is running)
- **Architecture**: [backend/ARCHITECTURE.md](./backend/ARCHITECTURE.md)
- **Quick Start**: [backend/QUICKSTART.md](./backend/QUICKSTART.md)

## 🔌 API Endpoints

### Authentication
- `GET /auth/nonce?wallet=0x...` - Generate authentication nonce
- `POST /auth/verify` - Verify wallet signature and get JWT token

### IP Assets
- `POST /ip/register` - Register a new IP Asset
- `GET /ip/:id` - Get IP Asset by ID
- `GET /ip/user/:wallet` - Get IP Assets by creator wallet

### Licensing
- `POST /license/create` - Create a license for an IP Asset
- `POST /license/purchase` - Purchase a license
- `GET /license/user/:wallet` - Get licenses by user

### Reports
- `POST /report/submit` - Submit a violation report
- `GET /report/ip/:id` - Get reports for an IP Asset

### Analytics
- `GET /analytics/ip/created` - IP creation analytics
- `GET /analytics/licenses/sold` - License sales analytics
- `GET /analytics/revenue` - Revenue analytics

## 🔐 Authentication

Sentrix uses **wallet-only authentication** (no email/password):

1. Request a nonce from `/auth/nonce`
2. Sign the message with your wallet
3. Verify signature and receive JWT token
4. Use token in `Authorization: Bearer <token>` header

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with TypeScript
- **Vite** for build tooling
- **shadcn-ui** components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching

### Backend
- **Fastify** web framework
- **Prisma** ORM
- **PostgreSQL** database
- **viem** for blockchain interactions
- **Story Protocol SDK** integration
- **Pinata SDK** for IPFS storage

## 📦 Project Structure

```
Sentrix/
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── ...
├── backend/               # Backend API
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── utils/        # Utilities
│   │   └── config/       # Configuration
│   └── prisma/           # Database schema
├── public/               # Static assets
└── package.json
```

## 🧪 Testing

**Frontend:**
```bash
npm run lint
```

**Backend:**
```bash
cd backend
npm test
```

## 🚀 Deployment

### Frontend Deployment

Build the frontend and deploy to your preferred hosting:
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting service

### Backend Deployment

See [backend/README.md](./backend/README.md) for deployment options including Docker.

## 🔧 Development

### Adding Features

1. **Frontend**: Add components in `src/components/` and pages in `src/pages/`
2. **Backend**: Create modules in `backend/src/modules/` following existing patterns
3. **Database**: Update Prisma schema and run migrations

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier (if configured) for formatting

## 🚨 Important Notes

1. **Story Protocol SDK**: Backend includes placeholder functions. Integrate actual SDK when available.
2. **Environment Variables**: Never commit `.env` files. Use `.env.example` as template.
3. **Security**: Use strong secrets in production, enable HTTPS.
4. **CORS**: Configure `FRONTEND_URL` in backend `.env` to match your frontend domain.

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in `backend/README.md`
- Review API docs at `/docs` endpoint when backend is running
