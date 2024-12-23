import { createLogger, format, transports } from 'winston';

export const log = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, label, timestamp }) => {
      return `[${timestamp}]:[${level}]:[${label}]::${message}`;
    }),
  ),
  defaultMeta: { service: 'us' },
  transports: [
    new transports.File({
      filename:
        '/tmp/logs/integration' + new Date().toJSON().slice(0, 10) + '.log',
      maxsize: 524288000, // 500 MB
      tailable: true,
      zippedArchive: true,
    }),
  ],
});
