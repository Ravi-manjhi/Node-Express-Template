import './utils/uncaughtException';
import app from './app';
import connectDB from './lib/connectDB';
import logger from './lib/logger';

const PORT = parseInt(process.env.PORT as string);

const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

// catch uncaughtException
process.on('unhandledRejection', (error: Error) => {
  logger.warn('Name: %s, message: %s', { name: error.name, message: error.message });
  logger.info('stack: %s', error.stack);

  let timer = 5;
  const startTimer = setInterval(() => {
    logger.alert(`Server closing in ${timer} seconds`);
    timer--;
  }, 1000);

  setTimeout(() => {
    server.close(() => {
      process.exit(1);
    });

    return clearInterval(startTimer);
  }, 5000);
});
