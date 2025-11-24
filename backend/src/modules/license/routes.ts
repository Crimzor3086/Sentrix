import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createLicenseForIP, purchaseLicenseForUser, getLicensesByUser } from './service.js';
import { authenticate } from '../auth/middleware.js';

const createLicenseSchema = z.object({
  ipId: z.string(),
  terms: z.object({
    commercialRights: z.boolean(),
    distributionRights: z.boolean(),
    duration: z.number().optional(),
    exclusivity: z.boolean(),
    price: z.string().optional(),
  }),
});

const purchaseLicenseSchema = z.object({
  licenseId: z.string(),
});

export async function licenseRoutes(fastify: FastifyInstance) {
  /**
   * POST /license/create
   * Create a new license
   */
  fastify.post<{ Body: any }>(
    '/create',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Create a new license for an IP Asset',
        tags: ['license'],
        body: {
          type: 'object',
          properties: {
            ipId: { type: 'string' },
            terms: {
              type: 'object',
              properties: {
                commercialRights: { type: 'boolean' },
                distributionRights: { type: 'boolean' },
                duration: { type: 'number' },
                exclusivity: { type: 'boolean' },
                price: { type: 'string' },
              },
              required: ['commercialRights', 'distributionRights', 'exclusivity'],
            },
          },
          required: ['ipId', 'terms'],
        },
      },
    },
    async (request, reply) => {
      try {
        const validated = createLicenseSchema.parse(request.body);
        const creatorWallet = request.user?.wallet;

        if (!creatorWallet) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const license = await createLicenseForIP({
          ...validated,
          creatorWallet,
        });

        return {
          id: license.id,
          ipId: license.ipId,
          storyLicenseId: license.storyLicenseId,
          terms: license.termsJson,
          status: license.status,
          createdAt: license.createdAt,
        };
      } catch (error: any) {
        return reply.status(400).send({
          error: error.message || 'Failed to create license',
        });
      }
    }
  );

  /**
   * POST /license/purchase
   * Purchase a license
   */
  fastify.post<{ Body: any }>(
    '/purchase',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Purchase a license',
        tags: ['license'],
        body: {
          type: 'object',
          properties: {
            licenseId: { type: 'string' },
          },
          required: ['licenseId'],
        },
      },
    },
    async (request, reply) => {
      try {
        const { licenseId } = purchaseLicenseSchema.parse(request.body);
        const buyerWallet = request.user?.wallet;

        if (!buyerWallet) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const result = await purchaseLicenseForUser({
          licenseId,
          buyerWallet,
        });

        return {
          license: {
            id: result.license.id,
            ipId: result.license.ipId,
            status: result.license.status,
            certificateHash: result.certificateHash,
          },
          certificate: result.certificate,
        };
      } catch (error: any) {
        return reply.status(400).send({
          error: error.message || 'Failed to purchase license',
        });
      }
    }
  );

  /**
   * GET /license/user/:wallet
   * Get licenses by user wallet
   */
  fastify.get<{ Params: { wallet: string }; Querystring: { type?: string } }>(
    '/user/:wallet',
    {
      schema: {
        description: 'Get licenses by user wallet',
        tags: ['license'],
        params: {
          type: 'object',
          properties: {
            wallet: {
              type: 'string',
              pattern: '^0x[a-fA-F0-9]{40}$',
            },
          },
          required: ['wallet'],
        },
        querystring: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['created', 'purchased'],
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { wallet } = request.params;
        const type = (request.query.type as 'created' | 'purchased') || 'created';

        const licenses = await getLicensesByUser(wallet, type);

        return { licenses };
      } catch (error: any) {
        return reply.status(500).send({
          error: error.message || 'Failed to fetch licenses',
        });
      }
    }
  );
}

