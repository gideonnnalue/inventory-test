"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const models_1 = __importDefault(require("../../database/models"));
const utils_1 = __importDefault(require("../../utils"));
const { Item } = models_1.default;
const { utilityResponse } = utils_1.default;
exports.default = {
    addItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { quantity, expiry } = req.body;
            const { item: itemName } = req.params;
            if (!quantity || !expiry) {
                return utilityResponse({ message: 'Invalid quantity or expiry date', res, statusCode: 400 });
            }
            if (expiry < moment_1.default().unix()) {
                return utilityResponse({ message: 'Expiry date invalid', res, statusCode: 400 });
            }
            try {
                yield models_1.default.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield Item.create({
                        expiry,
                        name: itemName,
                        quantity,
                    }, { transaction: t });
                    return user;
                }));
                // console.log(result);
                return utilityResponse({ message: 'Success adding item', res, statusCode: 201 });
            }
            catch (err) {
                return utilityResponse({ message: 'Internal server error', res, statusCode: 500 });
            }
        });
    },
    getItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { item: itemName } = req.params;
            try {
                const [itemCount, getMaxExpiry] = yield Promise.all([
                    Item.findOne({
                        attributes: ['name', [sequelize_1.Sequelize.fn('sum', sequelize_1.Sequelize.col('quantity')), 'total']],
                        group: ['Item.name'],
                        raw: true,
                        where: {
                            expiry: {
                                [sequelize_1.Op.gt]: moment_1.default().unix(),
                            },
                            name: {
                                [sequelize_1.Op.eq]: itemName,
                            },
                        },
                    }),
                    Item.findOne({
                        attributes: [[sequelize_1.Sequelize.fn('max', sequelize_1.Sequelize.col('expiry')), 'maxExpiry']],
                        group: ['Item.name'],
                        raw: true,
                        where: {
                            name: {
                                [sequelize_1.Op.eq]: req.params.item,
                            },
                        },
                    }),
                ]);
                return utilityResponse({
                    data: {
                        quantity: Number(itemCount === null || itemCount === void 0 ? void 0 : itemCount.total) || 0,
                        validTill: Number(itemCount === null || itemCount === void 0 ? void 0 : itemCount.total) ? getMaxExpiry === null || getMaxExpiry === void 0 ? void 0 : getMaxExpiry.maxExpiry : 0,
                    },
                    message: 'Success fetching item',
                    res,
                    statusCode: 200,
                });
            }
            catch (err) {
                console.log(err);
                return utilityResponse({ message: 'Internal server error', res, statusCode: 500 });
            }
        });
    },
    sellItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { quantity } = req.body;
            const { item: itemName } = req.params;
            try {
                yield models_1.default.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const [items, availableItems] = yield Promise.all([
                        Item.findAll({
                            order: [['expiry', 'ASC']],
                            where: {
                                expiry: {
                                    [sequelize_1.Op.gt]: moment_1.default().unix(),
                                },
                                name: {
                                    [sequelize_1.Op.eq]: itemName,
                                },
                            },
                        }, { transaction: t }),
                        Item.findOne({
                            attributes: ['name', [sequelize_1.Sequelize.fn('sum', sequelize_1.Sequelize.col('quantity')), 'total']],
                            group: ['Item.name'],
                            raw: true,
                            where: {
                                expiry: {
                                    [sequelize_1.Op.gt]: moment_1.default().unix(),
                                },
                                name: {
                                    [sequelize_1.Op.eq]: req.params.item,
                                },
                            },
                        }, { transaction: t }),
                    ]);
                    if (items.length < 1) {
                        return utilityResponse({ message: 'Item not in inventory', res, statusCode: 400 });
                    }
                    if ((availableItems === null || availableItems === void 0 ? void 0 : availableItems.total) < quantity) {
                        return utilityResponse({ message: 'Insufficient items in inventory', res, statusCode: 400 });
                    }
                    const promises = [];
                    let quantityToSell = quantity;
                    for (let i = 0; i <= items.length - 1; i++) {
                        if (items[i].quantity - quantityToSell >= 0) {
                            if (items[i].quantity - quantityToSell === 0) {
                                promises.push(Item.destroy({ where: { id: items[i].id } }, { transaction: t }));
                            }
                            else {
                                promises.push(Item.update({ quantity: items[i].quantity - quantityToSell }, { where: { id: items[i].id } }, { transaction: t }));
                            }
                            break;
                        }
                        else if (items[i].quantity - quantityToSell < 0) {
                            promises.push(Item.destroy({ where: { id: items[i].id } }, { transaction: t }));
                            quantityToSell = quantityToSell - items[i].quantity;
                        }
                    }
                    if (promises.length > 0) {
                        yield Promise.all(promises);
                    }
                }));
                return utilityResponse({ message: 'Success fetching item', res, statusCode: 200 });
            }
            catch (err) {
                return utilityResponse({ message: 'Internal server error', res, statusCode: 500 });
            }
        });
    },
};
