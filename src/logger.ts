import winston from 'winston';

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ message, timestamp, level, error, ...rest }) => {
      return `${timestamp} [${level}] ${message} - ${JSON.stringify({ ...rest })} ${error?.stack ? `- ${error.stack}` : ''}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
