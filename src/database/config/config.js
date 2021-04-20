// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
	development: {
		database: process.env.DB_NAME,
		dialect: 'postgres',
		host: '127.0.0.1',
		password: process.env.DB_PASS,
		username: process.env.DB_USER,
	},
	production: {
		database: 'database_production',
		dialect: 'postgres',
		host: '127.0.0.1',
		native: true,
		password: null,
		pool: {
			evict: 10000,
			idle: 10000,
			max: 5,
			min: 1,
		},
		ssl: true,
		use_env_variable: 'DATABASE_URL',
		username: 'root',
	},
	test: {
		database: process.env.DB_NAME_TEST,
		dialect: 'postgres',
		host: '127.0.0.1',
		password: 'gideon5053',
		username: 'postgres',
	},
};
