import logger from "./winstonLogger";

export const setupUncaughtException = () => {
  process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception", error);
    process.exit(1);
  });
};

export const setupUnhandledRejection = (server: any) => {
  process.on("unhandledRejection", (reason: any, p: Promise<any>) => {
    logger.error("Unhandled Rejection", reason);

    let time = 5;
    const interval = setInterval(() => {
      logger.info(`Server will close in ${time} seconds...`);
      time--;
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      server.close(() => {
        logger.alert("Server closed gracefully.");
        process.exit(1);
      });
    }, 5000);
  });
};
