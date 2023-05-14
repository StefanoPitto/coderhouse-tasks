import winston from "winston";

export const logger = winston.createLogger({
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...args } = info;
      const log = `[${timestamp}] [${level.toUpperCase()}] ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
      }`;
      switch (level) {
        case "debug":
          return `\x1b[34m${log}\x1b[0m`;
        case "http":
          return `\x1b[36m${log}\x1b[0m`;
        case "info":
          return `\x1b[32m${log}\x1b[0m`;
        case "warning":
          return `\x1b[33m${log}\x1b[0m`;
        case "error":
          return `\x1b[31m${log}\x1b[0m`;
        case "fatal":
          return `\x1b[35m${log}\x1b[0m`;
        default:
          return log;
      }
    }),
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
    new winston.transports.File({
      filename: "http.log",
      level: "http",
    }),
    new winston.transports.File({
      filename: "app.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "warning",
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: "fatal.log",
      level: "fatal",
      handleExceptions: true,
    }),
  ],
});
