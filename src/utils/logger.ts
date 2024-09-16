import {
  createLogger,
  format,
  LeveledLogMethod,
  Logger,
  transports,
} from 'winston';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,
    report: 6,
  },
};

type CustomLogger = Logger &
  Record<keyof (typeof customLevels)['levels'], LeveledLogMethod>;

const logger: CustomLogger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [new transports.Console()],
}) as CustomLogger;

(
  Object.keys(customLevels.levels) as (keyof (typeof customLevels)['levels'])[]
).forEach((level) => {
  logger[level] = logger.log.bind(logger, level);
});

export default logger;
