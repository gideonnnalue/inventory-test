import * as dotenv from 'dotenv';
import app from './app';

import db from './database/models';

dotenv.config();

const port = process.env.PORT || 5000;

db.sequelize
	.sync()
	.then(() => {
		app.listen(port || 5000, () => {
			console.log(`app listening on ports ${port}`);
		});
		return true;
	})
	.catch((err: Error) => console.log(err));
