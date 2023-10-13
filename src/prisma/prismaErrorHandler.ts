import * as trpc from '@trpc/server';
import { Prisma } from '@prisma/client';

type trpcErrorCode =
	| 'PARSE_ERROR'
	| 'BAD_REQUEST'
	| 'INTERNAL_SERVER_ERROR'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'METHOD_NOT_SUPPORTED'
	| 'TIMEOUT'
	| 'CONFLICT'
	| 'PRECONDITION_FAILED'
	| 'PAYLOAD_TOO_LARGE'
	| 'CLIENT_CLOSED_REQUEST';

const prismaErrorHandler = (e: unknown) => {
	console.log(e);
	if (e instanceof Prisma.PrismaClientKnownRequestError) {
		let code: trpcErrorCode;
		switch (e.code) {
			case 'P2002':
				code = 'CONFLICT';
				break;
			case 'P2003':
				code = 'BAD_REQUEST';
				break;
			case 'P2025':
				code = 'NOT_FOUND';
				break;
			default:
				code = 'INTERNAL_SERVER_ERROR';
				break;
		}
		throw new trpc.TRPCError({ code, message: `Database Error ${e.code}: ${e.message}` });
	}
	throw e;
};

export default prismaErrorHandler;
