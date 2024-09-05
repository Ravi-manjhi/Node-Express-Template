import { uncaughtException, unhandledRejection } from "./lib/serverError";
uncaughtException();
import app from "./app";
import logger from "./lib/winstonLogger";

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server is listen on http://localhost:${PORT}`);
});

unhandledRejection(server);
