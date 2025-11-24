import { FastifyRequest, FastifyReply } from 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      wallet: string;
      userId: string;
    };
    user: {
      wallet: string;
      userId: string;
    };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      wallet: string;
      userId: string;
    };
  }
}

/**
 * JWT authentication middleware
 */
export async function authenticate(
  request: FastifyRequest,
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

