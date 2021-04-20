import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import './tasks';

import routes from './api/routes/index';

dotenv.config();

const app = express(); // initialize the express server

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Set security HTTP headers
app.use(helmet());

// Implement Cors
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a test route
app.get('/', (req: Request, res: Response) => {
	res.send('Api live!');
});

app.use('/', routes);

// to handle 404 errors
app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Page not found' }));

export default app;
