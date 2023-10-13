import { z } from 'zod';
import { authProcedure, router } from '../trpc';
import prismaErrorHandler from '../../prisma/prismaErrorHandler';
import { testDBConnection } from '$lib/server/testDBConnection';
import { TRPCError } from '@trpc/server';

export const upsertDatabaseSchema = z.object({
	id: z.string().min(1).optional(),
	name: z.string().min(1),
	provider: z.string().min(1),
	connectionType: z.string().min(1),
	connectionString: z.string().min(1).optional(),
	connectionOption: z
		.object({
			host: z.string().min(1),
			port: z.number(),
			databaseName: z.string().min(1),
			username: z.string().min(1),
			password: z.string().min(1)
		})
		.optional()
});
export type UpsertDatabase = z.infer<typeof upsertDatabaseSchema>;

export const databaseRouter = router({
	getAll: authProcedure.query(async ({ ctx: { session } }) => {
		const databases = await prisma.database.findMany({
			where: { userId: session.user_id },
			include: { connectionOption: true }
		});
		return { databases };
	}),

	upsert: authProcedure
		.input(upsertDatabaseSchema)
		.query(
			async ({
				ctx: { session },
				input: { id, name, provider, connectionType, connectionString, connectionOption }
			}) => {
				const error = await testDBConnection(provider, connectionString, connectionOption);
				if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

				const dbConnectionOption = await prisma.connectionOption.findUnique({
					where: { databaseId: id ?? '' },
					select: { id: true }
				});
				const database = await prisma.database
					.upsert({
						where: { id: id ?? '' },
						create: {
							userId: session.user_id,
							name,
							provider,
							connectionType,
							connectionString,
							connectionOption: connectionOption ? { create: { ...connectionOption } } : undefined
						},
						update: {
							name,
							provider,
							connectionType,
							connectionString: connectionString ?? null,
							connectionOption: connectionOption
								? dbConnectionOption
									? { update: { ...connectionOption } }
									: { create: { ...connectionOption } }
								: dbConnectionOption
								? { delete: true }
								: undefined
						}
					})
					.catch(prismaErrorHandler);
				return { database };
			}
		),

	delete: authProcedure
		.input(
			z.object({
				id: z.string().min(1)
			})
		)
		.query(async ({ input: { id } }) => {
			await prisma.database.delete({ where: { id } });
			return { id };
		}),

	testDatabase: authProcedure
		.input(
			z.object({
				id: z.string().min(1)
			})
		)
		.query(async ({ input: { id } }) => {
			const { provider, connectionString, connectionOption } = await prisma.database
				.findUniqueOrThrow({
					where: { id },
					select: {
						provider: true,
						connectionString: true,
						connectionOption: {
							select: {
								host: true,
								port: true,
								databaseName: true,
								username: true,
								password: true
							}
						}
					}
				})
				.catch(prismaErrorHandler);

			return await testDBConnection(provider, connectionString, connectionOption);
		})
});
