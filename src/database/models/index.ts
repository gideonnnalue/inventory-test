/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config'))[env];

const db: any = {};

const fileType = process.env.NODE_ENV === 'development' ? '.ts' : '.js';

let sequelize: any;
if (config.use_env_variable) {
	sequelize = new Sequelize.Sequelize(process.env[config.use_env_variable] as string, config);
} else {
	sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
	.filter((file: string) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === fileType)
	.forEach((file: any) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
