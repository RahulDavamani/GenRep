export interface DatabaseProvider {
	name: string;
	client: string;
}

export const databaseProviders: DatabaseProvider[] = [
	{
		name: 'PostgreSQL',
		client: 'pg'
	},
	{
		name: 'MySQL',
		client: 'mysql'
	},
	{
		name: 'MSSQL / SQL Server',
		client: 'mssql'
	},
	{
		name: 'SQLite',
		client: 'sqlite3'
	},
	{
		name: 'Better-SQLite',
		client: 'better-sqlite3'
	},
	{
		name: 'Oracle DB',
		client: 'oracledb'
	}
];
