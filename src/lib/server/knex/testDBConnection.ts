import knex from 'knex';
import type { UpsertDatabase } from '../../../trpc/routers/database.router';
import { TRPCError } from '@trpc/server';

export const testDBConnection = async (
	provider: string,
	connectionString: string | undefined | null,
	connectionOption: UpsertDatabase['connectionOption'] | undefined | null
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

		await db.raw('SELECT 1 as test');
		await db.destroy();
		return { success: true };
	} catch (error) {
		throw new TRPCError({ code: 'BAD_REQUEST', message: String(error) });
	}
};
