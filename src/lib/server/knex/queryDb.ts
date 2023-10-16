import type { ConnectionOption } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import knex from 'knex';

export const queryDB = async (
	provider: string,
	connectionString: string | undefined | null,
	connectionOption: ConnectionOption | undefined | null,
	query: string
) => {
	try {
		let db;
		if (connectionString) db = knex({ client: provider, connection: connectionString });
		else if (connectionOption) {
			db = knex({
				client: provider,
				connection: {
					...connectionOption,
					userName: connectionOption.username,
					database: connectionOption.databaseName
				}
			});
		} else throw 'Invalid Connection Type';

		const data = (await db.raw(query)) as { [k: string]: unknown }[];
		await db.destroy();
		return { data };
	} catch (error) {
		throw new TRPCError({ code: 'BAD_REQUEST', message: String(error) });
	}
};
