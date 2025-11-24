import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createIPAsset, getIPAssetById, getIPAssetsByCreator } from './service.js';
import { authenticate, AuthenticatedRequest } from '../auth/middleware.js';

const createIPSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  contentType: z.enum(['text', 'image', 'audio', 'file']),
});

export async function ipRoutes(fastify: FastifyInstance) {
  /**
   * POST /ip/register
   * Register a new IP Asset
   */
  fastify.post<{ Body: any }>(
    '/register',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Register a new IP Asset',
        tags: ['ip'],
        consumes: ['multipart/form-data'],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              ipfsHash: { type: 'string' },
              storyIpId: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: AuthenticatedRequest, reply) => {
      try {
        const data = await request.file();
        
        if (!data) {
          return reply.status(400).send({ error: 'No file or content provided' });
        }

        const fields = data.fields;
        const title = fields.title?.value as string;
        const description = fields.description?.value as string | undefined;
        const category = fields.category?.value as string | undefined;
        const tags = fields.tags?.value ? JSON.parse(fields.tags.value as string) : [];
        const contentType = (fields.contentType?.value as string) || 'file';

        const validated = createIPSchema.parse({
          title,
          description,
          category,
          tags,
          contentType,
        });

        const buffer = await data.toBuffer();
        const creatorWallet = request.user!.wallet;

        const ipAsset = await createIPAsset({
          ...validated,
          creatorWallet,
          content: buffer,
        });

        return {
          id: ipAsset.id,
          title: ipAsset.title,
          ipfsHash: ipAsset.ipfsHash,
          storyIpId: ipAsset.storyIpId,
          createdAt: ipAsset.createdAt,
        };
      } catch (error: any) {
        console.error('IP registration error:', error);
        return reply.status(400).send({
          error: error.message || 'Failed to register IP asset',
        });
      }
    }
  );

  /**
   * GET /ip/:id
   * Get IP Asset by ID
   */
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        description: 'Get IP Asset by ID',
        tags: ['ip'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const ipAsset = await getIPAssetById(id);

        if (!ipAsset) {
          return reply.status(404).send({ error: 'IP Asset not found' });
        }

        return ipAsset;
      } catch (error: any) {
        return reply.status(500).send({
          error: error.message || 'Failed to fetch IP asset',
        });
      }
    }
  );

  /**
   * GET /ip/user/:wallet
   * Get IP Assets by creator wallet
   */
  fastify.get<{ Params: { wallet: string } }>(
    '/user/:wallet',
    {
      schema: {
        description: 'Get IP Assets by creator wallet',
        tags: ['ip'],
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
      },
    },
    async (request, reply) => {
      try {
        const { wallet } = request.params;
        const assets = await getIPAssetsByCreator(wallet);

        return { assets };
      } catch (error: any) {
        return reply.status(500).send({
          error: error.message || 'Failed to fetch IP assets',
        });
      }
    }
  );
}

