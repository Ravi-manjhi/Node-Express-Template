import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { morganStream } from './lib/logger';
import GlobalErrorHandler, { undefinedRouterHandler } from './middlewares/errorHandler';
import router from './routers';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL as string, credentials: true }));
app.use(morgan('dev', { stream: morganStream }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: false }));
app.use(cookieParser());

// routers
app.use('/api', router);

// Error handlers
app.all('*', undefinedRouterHandler);
app.use(GlobalErrorHandler);

export default app;
