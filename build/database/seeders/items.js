"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Items", [
            {
                name: "carrot",
                quantity: 20,
                expiry: 1618502191,
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                name: "orange",
                quantity: 7,
                expiry: 1618502191,
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                name: "water melon",
                quantity: 2,
                expiry: 1618502191,
                createdAt: new Date,
                updatedAt: new Date
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Items", null, {});
    },
};
