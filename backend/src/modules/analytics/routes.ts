import { FastifyInstance } from 'fastify';
import { prisma } from '../../config/database.js';

export async function analyticsRoutes(fastify: FastifyInstance) {
  /**
   * GET /analytics/ip/created
   * Get IP creation analytics
   */
  fastify.get(
    '/ip/created',
    {
      schema: {
        description: 'Get IP creation analytics',
        tags: ['analytics'],
        querystring: {
          type: 'object',
          properties: {
            days: { type: 'number', default: 30 },
          },
        },
      },
    },
    async (request: any, reply) => {
      try {
        const days = Number(request.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const [total, recent, byCategory] = await Promise.all([
          prisma.iPAsset.count(),
          prisma.iPAsset.count({
            where: {
              createdAt: {
                gte: startDate,
              },
            },
          }),
          prisma.iPAsset.groupBy({
            by: ['category'],
            _count: {
              id: true,
            },
            where: {
              category: {
                not: null,
              },
            },
          }),
        ]);

        return {
          total,
          recent,
          period: `${days} days`,
          byCategory: byCategory.map((item) => ({
            category: item.category,
            count: item._count.id,
          })),
        };
      } catch (error: any) {
        return reply.status(500).send({
          error: error.message || 'Failed to fetch IP analytics',
        });
      }
    }
  );

  /**
   * GET /analytics/licenses/sold
   * Get license sales analytics
   */
  fastify.get(
    '/licenses/sold',
    {
      schema: {
        description: 'Get license sales analytics',
        tags: ['analytics'],
        querystring: {
          type: 'object',
          properties: {
            days: { type: 'number', default: 30 },
          },
        },
      },
    },
    async (request: any, reply) => {
      try {
        const days = Number(request.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const [total, active, recent, byStatus] = await Promise.all([
          prisma.license.count({
            where: {
              buyerWallet: {
                not: null,
              },
            },
          }),
          prisma.license.count({
            where: {
              status: 'active',
            },
          }),
          prisma.license.count({
            where: {
              buyerWallet: {
                not: null,
              },
              createdAt: {
                gte: startDate,
              },
            },
          }),
          prisma.license.groupBy({
            by: ['status'],
            _count: {
              id: true,
            },
          }),
        ]);

        return {
          total,
          active,
          recent,
          period: `${days} days`,
          byStatus: byStatus.map((item) => ({
            status: item.status,
            count: item._count.id,
          })),
        };
      } catch (error: any) {
        return reply.status(500).send({
          error: error.message || 'Failed to fetch license analytics',
        });
      }
    }
  );

  /**
   * GET /analytics/revenue
   * Get revenue analytics
   */
  fastify.get(
    '/revenue',
    {
      schema: {
        description: 'Get revenue analytics',
        tags: ['analytics'],
        querystring: {
          type: 'object',
          properties: {
            days: { type: 'number', default: 30 },
          },
        },
      },
    },
    async (request: any, reply) => {
      try {
        const days = Number(request.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const activeLicenses = await prisma.license.count({
          where: {
            status: 'active',
            createdAt: {
              gte: startDate,
            },
          },
        });

        // Calculate revenue from license terms (price field)
        // Note: This assumes license terms include a 'price' field in wei or token amount
        const licensesWithPrice = await prisma.license.findMany({
          where: {
            status: 'active',
            createdAt: {
              gte: startDate,
            },
          },
          select: {
            termsJson: true,
          },
        });

        let totalRevenue = 0;
        for (const license of licensesWithPrice) {
          const terms = license.termsJson as any;
          if (terms?.price) {
            // Convert from wei to ETH (or handle token decimals)
            totalRevenue += Number(terms.price) / 1e18;
          }
        }

        return {
          period: `${days} days`,
          activeLicenses,
          totalRevenue: totalRevenue.toFixed(4),
          currency: 'ETH',
        };
      } catch (error: any) {
        return reply.status(500).send({
          error: error.message || 'Failed to fetch revenue analytics',
        });
      }
    }
  );
}

