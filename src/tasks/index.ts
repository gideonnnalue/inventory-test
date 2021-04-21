import { Op } from 'sequelize';
import cron from 'node-cron';
import moment from 'moment';
import db from '../database/models';

const { Item } = db;

cron.schedule('59 23 * * *', async () => {
	await Item.destroy({
		where: {
			expiry: {
				[Op.lt]: moment().unix(),
			},
		},
	});
});
