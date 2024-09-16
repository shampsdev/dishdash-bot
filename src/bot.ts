import { Context, session, Telegraf } from 'telegraf';
import { BOT_TOKEN, DEBUG, REPORT_CHAT_ID } from './config';
import logger from './utils/logger';
import { loggerMiddleware } from './middlewares/loggerMiddleware';

import { setupStartCommand } from './commands/start';
import { setupHelpCommand } from './commands/help';
import { setupInlineQuery } from './commands/inline';
import { setupReportCommand } from './commands/report';
import { TelegramTransport } from './utils/telegramTransport';

interface SessionData {
  report_mode: boolean;
}

// Define your own context type
export interface MyContext extends Context {
  session?: SessionData;
}

const bot = new Telegraf<MyContext>(BOT_TOKEN);

logger.info('Bot is starting...');

logger.add(
  new TelegramTransport({
    bot,
    debug: DEBUG,
    level: 'report',
    chat_id: REPORT_CHAT_ID,
  })
);

bot.use(loggerMiddleware);
bot.use(session({ defaultSession: () => ({ report_mode: false }) }));

setupStartCommand(bot);
setupHelpCommand(bot);
setupInlineQuery(bot);
setupReportCommand(bot);

bot
  .launch({
    webhook: {
      domain: 'https://1b6d-195-2-92-192.ngrok-free.app',
      port: 3500,
    },
  })
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
