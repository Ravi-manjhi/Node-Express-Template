import {
  setupUncaughtException,
  setupUnhandledRejection,
} from "./lib/serverError";
import logger from "./lib/winstonLogger";
setupUncaughtException();

import app from "./app";

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server is listen on http://localhost:${PORT}`);
});

setupUnhandledRejection(server);
