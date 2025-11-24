FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sentrix

COPY --from=builder --chown=sentrix:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sentrix:nodejs /app/dist ./dist
COPY --from=builder --chown=sentrix:nodejs /app/prisma ./prisma
COPY --from=builder --chown=sentrix:nodejs /app/package.json ./package.json

USER sentrix

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/server.js"]

