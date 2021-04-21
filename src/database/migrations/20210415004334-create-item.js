'use strict';
module.exports = {
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Items');
	},
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Items', {
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			expiry: {
				allowNull: false,
				defaultValue: 0,
				type: Sequelize.INTEGER,
			},
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			quantity: {
				allowNull: false,
				defaultValue: 0,
				type: Sequelize.INTEGER,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
};
