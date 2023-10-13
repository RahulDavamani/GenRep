import knex from 'knex';

interface ConnectionOption {
	host: string;
	port: number;
	databaseName: string;
	username: string;
	password: string;
}

export const testDBConnection = async (
	provider: string,
	connectionString: string | undefined | null,
	connectionOption: ConnectionOption | undefined | null
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
		} else return '';

		await db.raw('SELECT 1 as test');
	} catch (error) {
		return String(error);
	}
};
