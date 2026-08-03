import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp} [${level}]: ${stack || message}`;
        })
      )
    })
  ]
});

export default logger;
