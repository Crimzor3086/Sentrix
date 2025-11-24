import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import env from './config/env.js';
import { authRoutes } from './modules/auth/routes.js';
import { ipRoutes } from './modules/ip/routes.js';
import { licenseRoutes } from './modules/license/routes.js';
import { reportRoutes } from './modules/guard/routes.js';
import { analyticsRoutes } from './modules/analytics/routes.js';

/**
 * Create and configure Fastify app
 */
export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // Register CORS
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  // Register JWT
  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Register multipart for file uploads
  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // Register Swagger
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Sentrix API',
        description: 'Decentralized IP License Guard API',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register routes
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(ipRoutes, { prefix: '/ip' });
  await app.register(licenseRoutes, { prefix: '/license' });
  await app.register(reportRoutes, { prefix: '/report' });
  await app.register(analyticsRoutes, { prefix: '/analytics' });

  return app;
}

