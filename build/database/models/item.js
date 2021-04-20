'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Item extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    Item.init({
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
    }, {
        modelName: 'Item',
        sequelize,
    });
    return Item;
};
