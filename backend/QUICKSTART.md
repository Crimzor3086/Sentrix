# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment

```bash
cp env.example .env
# Edit .env with your configuration
```

**Minimum required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Any random 32+ character string
- `PINATA_API_KEY` & `PINATA_SECRET_KEY` - From pinata.cloud
- `STORY_RPC_URL` - Story Protocol RPC endpoint
- `STORY_PRIVATE_KEY` - Your wallet private key (0x...)

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed sample data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

### 5. Test the API

```bash
# Health check
curl http://localhost:3001/health

# Get nonce for wallet
curl "http://localhost:3001/auth/nonce?wallet=0x1234..."

# View API docs
open http://localhost:3001/docs
```

## 🐳 Docker Quick Start

```bash
# Start PostgreSQL and backend
docker-compose -f docker-compose.dev.yml up

# In another terminal, run migrations
docker exec -it sentrix-backend-dev npx prisma migrate dev
```

## 📝 Next Steps

1. **Configure Story Protocol**: Update Story Protocol addresses in `.env`
2. **Set up Pinata**: Get API keys from [pinata.cloud](https://pinata.cloud)
3. **Connect Frontend**: Update frontend to point to `http://localhost:3001`
4. **Test Authentication**: Use the wallet auth flow from your frontend

## 🔧 Common Issues

**Database connection error:**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`

**IPFS upload fails:**
- Verify Pinata API keys are correct
- Check your Pinata account has available storage

**Story Protocol errors:**
- Ensure RPC URL is accessible
- Verify contract addresses are correct for your network
- Check private key has sufficient funds for gas

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation.

