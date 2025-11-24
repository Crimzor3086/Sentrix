import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { generateAuthNonce, verifyWalletAuth } from './service.js';
import jwt from '@fastify/jwt';

const nonceSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

const verifySchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().startsWith('0x'),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register JWT plugin if not already registered
  if (!fastify.hasDecorator('jwt')) {
    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  /**
   * GET /auth/nonce
   * Generate a nonce for wallet authentication
   */
  fastify.get<{ Querystring: { wallet: string } }>(
    '/nonce',
    {
      schema: {
        description: 'Generate authentication nonce',
        tags: ['auth'],
        querystring: {
          type: 'object',
          properties: {
            wallet: {
              type: 'string',
              pattern: '^0x[a-fA-F0-9]{40}$',
            },
          },
          required: ['wallet'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              nonce: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { wallet } = nonceSchema.parse({ wallet: request.query.wallet });
        const nonce = await generateAuthNonce(wallet);
        const message = `Sign in to Sentrix: ${nonce}`;

        return {
          nonce,
          message,
        };
      } catch (error: any) {
        return reply.status(400).send({
          error: error.message || 'Failed to generate nonce',
        });
      }
    }
  );

  /**
   * POST /auth/verify
   * Verify wallet signature and authenticate user
   */
  fastify.post<{ Body: { wallet: string; signature: string } }>(
    '/verify',
    {
      schema: {
        description: 'Verify wallet signature and authenticate',
        tags: ['auth'],
        body: {
          type: 'object',
          properties: {
            wallet: {
              type: 'string',
              pattern: '^0x[a-fA-F0-9]{40}$',
            },
            signature: {
              type: 'string',
              pattern: '^0x[a-fA-F0-9]{130}$',
            },
          },
          required: ['wallet', 'signature'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  walletAddress: { type: 'string' },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { wallet, signature } = verifySchema.parse(request.body);
        const { user, token: _ } = await verifyWalletAuth(wallet, signature);

        // Generate JWT token
        const token = fastify.jwt.sign(
          {
            wallet: user.walletAddress,
            userId: user.id,
          },
          {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h',
          }
        );

        return {
          token,
          user,
        };
      } catch (error: any) {
        return reply.status(401).send({
          error: error.message || 'Authentication failed',
        });
      }
    }
  );
}

