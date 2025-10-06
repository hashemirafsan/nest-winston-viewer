import * as winston from 'winston';
import 'winston-daily-rotate-file';

export type CreateLoggerOptions = {
  dir?: string;        // default: ./logs
  level?: string;      // default: info
  maxFiles?: string;   // e.g., '14d'
  json?: boolean;      // default: true
};

export function buildWinstonTransports(opts: CreateLoggerOptions = {}) {
  const {
    dir = './logs',
    level = 'info',
    maxFiles = '14d',
    json = true,
  } = opts;

  const consoleFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format.printf(({ level, message, timestamp, context, ...meta }) =>
      `[${timestamp}] ${level.toUpperCase()} ${context ? '[' + context + '] ' : ''}${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ''
      }`
    )
  );

  const jsonFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'context'] }),
    winston.format.json()
  );

  const DailyRotate = (winston.transports as any).DailyRotateFile;

  const fileTransport = new DailyRotate({
    dirname: dir,
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxFiles,
    level,
    format: json ? jsonFormat : consoleFormat,
  });

  return {
    level,
    transports: [
      new winston.transports.Console({ format: consoleFormat }),
      fileTransport,
    ],
  } satisfies winston.LoggerOptions;
}
