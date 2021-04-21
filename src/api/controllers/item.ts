import { Op, Sequelize, Transaction } from 'sequelize';
import { Request, Response } from 'express';
import moment from 'moment';
import db from '../../database/models';
import utils from '../../utils';

const { Item } = db;
const { utilityResponse } = utils;

type ItemAttributes = {
	quantity: number;
	expiry: number;
};

export default {
	async addItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
		const { quantity, expiry } = req.body as ItemAttributes;
		const { item: itemName } = req.params;
		if (!quantity || !expiry) {
			return utilityResponse({ message: 'Invalid quantity or expiry date', res, statusCode: 400 });
		}

		if (expiry < moment().unix()) {
			return utilityResponse({ message: 'Expiry date invalid', res, statusCode: 400 });
		}

		try {
			await db.sequelize.transaction(async (t: Transaction) => {
				const user = await Item.create(
					{
						expiry,
						name: itemName,
						quantity,
					},
					{ transaction: t }
				);
				return user;
			});
			return utilityResponse({ message: 'Success adding item', res, statusCode: 201 });
		} catch (err) {
			return utilityResponse({ message: 'Internal server error', res, statusCode: 500 });
		}
	},

	async getItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
		const { item: itemName } = req.params;
		try {
			const [itemCount, getMaxExpiry] = await Promise.all([
				Item.findOne({
					attributes: ['name', [Sequelize.fn('sum', Sequelize.col('quantity')), 'total']],
					group: ['Item.name'],
					raw: true,
					where: {
						expiry: {
							[Op.gt]: moment().unix(),
						},
						name: {
							[Op.eq]: itemName,
						},
					},
				}),
				Item.findOne({
					attributes: [[Sequelize.fn('max', Sequelize.col('expiry')), 'maxExpiry']],
					group: ['Item.name'],
					raw: true,
					where: {
						name: {
							[Op.eq]: req.params.item,
						},
					},
				}),
			]);
			return utilityResponse({
				data: {
					quantity: Number(itemCount?.total) || 0,
					validTill: Number(itemCount?.total) ? getMaxExpiry?.maxExpiry : 0,
				},
				message: 'Success fetching item',
				res,
				statusCode: 200,
			});
		} catch (err) {
			return utilityResponse({ message: 'Internal server error', res, statusCode: 500 });
		}
	},

	async sellItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
		const { quantity }: { quantity: number } = req.body;
		const { item: itemName } = req.params;
		try {
			await db.sequelize.transaction(async (t: Transaction) => {
				const [items, availableItems] = await Promise.all([
					Item.findAll(
						{
							order: [['expiry', 'ASC']],
							where: {
								expiry: {
									[Op.gt]: moment().unix(),
								},
								name: {
									[Op.eq]: itemName,
								},
							},
						},
						{ transaction: t }
					),
					Item.findOne(
						{
							attributes: ['name', [Sequelize.fn('sum', Sequelize.col('quantity')), 'total']],
							group: ['Item.name'],
							raw: true,
							where: {
								expiry: {
									[Op.gt]: moment().unix(),
								},
								name: {
									[Op.eq]: req.params.item,
								},
							},
						},
						{ transaction: t }
					),
				]);

				if (items.length < 1) {
					return utilityResponse({ message: 'Item not in inventory', res, statusCode: 400 });
				}

				if (availableItems?.total < quantity) {
					return utilityResponse({ message: 'Insufficient items in inventory', res, statusCode: 400 });
				}

				const promises = [];

				let quantityToSell = quantity;
				for (let i = 0; i <= items.length - 1; i++) {
					if (items[i].quantity - quantityToSell >= 0) {
						if (items[i].quantity - quantityToSell === 0) {
							promises.push(Item.destroy({ where: { id: items[i].id } }, { transaction: t }));
						} else {
							promises.push(
								Item.update(
									{ quantity: items[i].quantity - quantityToSell },
									{ where: { id: items[i].id } },
									{ transaction: t }
								)
							);
						}

						break;
					} else if (items[i].quantity - quantityToSell < 0) {
						promises.push(Item.destroy({ where: { id: items[i].id } }, { transaction: t }));
						quantityToSell = quantityToSell - items[i].quantity;
					}
				}
				if (promises.length > 0) {
					await Promise.all(promises);
				}
			});
			return utilityResponse({ message: 'Success fetching item', res, statusCode: 200 });
		} catch (err) {
			return utilityResponse({ message: 'Internal server error', res, statusCode: 500 });
		}
	},
};
