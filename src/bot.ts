import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import logger from './utils/logger';
import { loggerMiddleware } from './middlewares/loggerMiddleware';

import { setupStartCommand } from './commands/start';
import { setupHelpCommand } from './commands/help';

const bot = new Telegraf(BOT_TOKEN);
logger.info('Bot is starting...');

bot.use(loggerMiddleware);

setupStartCommand(bot);
setupHelpCommand(bot);

bot
  .launch()
  .then(() => {
    logger.info('Bot is running');
  })
  .catch((err) => {
    logger.error('Failed to launch bot: ' + err);
  });

process.once('SIGINT', () => {
  logger.info('Bot is stopping due to SIGINT...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  logger.info('Bot is stopping due to SIGTERM...');
  bot.stop('SIGTERM');
});
