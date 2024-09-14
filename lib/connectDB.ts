import mongoose from 'mongoose';
import logger from './logger';

const MONGODB_URI = process.env.MONGODB_URI as string;

export default () => {
  const db = mongoose.connection;
  mongoose.connect(MONGODB_URI, { dbName: 'authTest' }).catch(() => {
    logger.error('DB Disconnected');
  });

  db.on('connected', () => logger.info('DB connected'));
  db.on('open', () => logger.info('DB open'));
  db.on('disconnected', () => logger.error('DB Disconnected'));
  db.on('reconnected', () => logger.info('DB reconnected'));
  db.on('disconnecting', () => logger.warn('DB disconnecting'));

  db.on('close', () => {
    logger.error('DB closed');
    process.exit(1);
  });
};
