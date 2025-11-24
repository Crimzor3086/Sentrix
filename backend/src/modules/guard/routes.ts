import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { submitReport, getReportsByIP } from './service.js';
import { authenticate } from '../auth/middleware.js';
import type { MultipartFile, MultipartValue } from '@fastify/multipart';

const submitReportSchema = z.object({
  ipId: z.string(),
  url: z.string().url().optional(),
  screenshotUrl: z.string().url().optional(),
  fileUrl: z.string().url().optional(),
});

const getFieldValue = (field?: MultipartValue | MultipartValue[]): string | undefined => {
  if (!field) return undefined;
  const value = Array.isArray(field) ? field[0] : field;
  if (!value) return undefined;
  return typeof value.value === 'string' ? value.value : undefined;
};

export async function reportRoutes(fastify: FastifyInstance) {
  /**
   * POST /report/submit
   * Submit a violation report
   */
  fastify.post<{ Body: any }>(
    '/submit',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Submit a violation report',
        tags: ['report'],
        consumes: ['multipart/form-data'],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              confidenceScore: { type: 'number' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        const data = await request.file();
        
        if (!data) {
          return reply.status(400).send({ error: 'No file or content provided' });
        }

        const file = data as MultipartFile;
        const fields = file.fields as Record<string, MultipartValue | MultipartValue[]>;
        const ipId = getFieldValue(fields.ipId);
        const url = getFieldValue(fields.url);
        const screenshotUrl = getFieldValue(fields.screenshotUrl);
        const fileUrl = getFieldValue(fields.fileUrl);

        const validated = submitReportSchema.parse({
          ipId,
          url,
          screenshotUrl,
          fileUrl,
        });

        const buffer = await file.toBuffer();
        const reporterWallet = request.user.wallet;

        const report = await submitReport({
          ...validated,
          reporterWallet,
          fileContent: buffer,
        });

        return {
          id: report.id,
          ipId: report.ipId,
          confidenceScore: report.confidenceScore,
          status: report.status,
          createdAt: report.createdAt,
        };
      } catch (error: any) {
        return reply.status(400).send({
          error: error.message || 'Failed to submit report',
        });
      }
    }
  );

  /**
   * GET /report/ip/:id
   * Get reports for an IP Asset
   */
  fastify.get<{ Params: { id: string } }>(
    '/ip/:id',
    {
      schema: {
        description: 'Get reports for an IP Asset',
        tags: ['report'],
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
        const reports = await getReportsByIP(id);

        return { reports };
      } catch (error: any) {
        return reply.status(500).send({
          error: error.message || 'Failed to fetch reports',
        });
      }
    }
  );
}

