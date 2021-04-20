'use strict';
import { Model, Optional, Sequelize } from 'sequelize';

interface ItemAttributes {
	id: number;
	name: string;
	quantity: number;
	expiry: number;
}

type ItemCreationAttributes = Optional<ItemAttributes, 'id'>;

module.exports = (sequelize: Sequelize, DataTypes: any) => {
	class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		id!: number;
		name!: string;
		quantity!: number;
		expiry!: number;
		static associate(models: any) {
			// define association here
		}
	}
	Item.init(
		{
			expiry: {
				allowNull: false,
				defaultValue: 0,
				type: DataTypes.INTEGER,
			},
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			quantity: {
				defaultValue: 0,
				type: DataTypes.INTEGER,
			}
		},
		{
			modelName: 'Item',
			sequelize,
		}
	);
	return Item;
};
