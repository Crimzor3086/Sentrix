import { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    wallet: string;
    userId: string;
  };
}

/**
 * JWT authentication middleware
 */
export async function authenticate(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({
      error: 'Unauthorized - Invalid or missing token',
    });
  }
}

