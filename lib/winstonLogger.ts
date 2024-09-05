import winston from "winston";
import "winston-daily-rotate-file";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "cyan",
  debug: "magenta",
};

winston.addColors(logColors);

const logger = winston.createLogger({
  levels: logLevels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.label({ label: process.env.NODE_ENV }),
        winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, label }) => {
          return `${label} | ${level} : ${message} | ${timestamp}`;
        })
      ),
    }),

    // Daily rotate file for errors
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: "./logs/error-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxFiles: "10d", // Keep logs for 14 days
      handleExceptions: true,
      maxSize: "20m", // Maximum size of each log file
    }),

    // Daily rotate file for combined logs
    new winston.transports.DailyRotateFile({
      filename: "./logs/combined-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxFiles: "5d", // Keep logs for 30 days
      maxSize: "20m", // Maximum size of each log file
    }),
  ],
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
