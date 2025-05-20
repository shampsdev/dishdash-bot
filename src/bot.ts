import { Context, session, Telegraf } from 'telegraf';
import {
  BOT_TOKEN,
  BOT_URL,
  DEBUG,
  FRONTEND_URL,
  HTTP_PORT,
  FEEDBACK_CHAT_ID,
} from './config';
import logger from './utils/logger';
import { loggerMiddleware } from './middlewares/loggerMiddleware';

import { setupStartCommand } from './commands/start';
import { setupInlineQuery } from './commands/inline';
import { TelegramTransport } from './utils/telegramTransport';

import express from 'express';
import { setupJoinCommand } from './commands/join';
import { setupFeedbackCommand } from './commands/feedback';
import { FeedbackService } from './services/feedbackService';
import { MetricService } from './services/metricService';
import { RedirectService } from './services/redirectService';
import { setupRedirectCommand } from './commands/redirect';

// Telegraf
interface SessionData {
  feedback_mode: boolean;
}

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
    chat_id: FEEDBACK_CHAT_ID,
  })
);

bot.use(loggerMiddleware);
bot.use(
  session({
    defaultSession: () => ({
      feedback_mode: false,
    }),
  })
);

const apiUrl = 'https://plausible.shamps.dev/api/event';
const domain = 'dishdash.ru';

const metricService = new MetricService(apiUrl, domain);
const feedbackService = new FeedbackService(bot, FEEDBACK_CHAT_ID ?? 0);
const redirectService = new RedirectService(FRONTEND_URL ?? '');

setupJoinCommand(bot);
setupStartCommand(bot, metricService);
setupFeedbackCommand(bot, feedbackService);
setupInlineQuery(bot);
setupRedirectCommand(bot, redirectService);

bot
  .launch()
  .then(() => {
    logger.info('Bot is running');
  })
  .catch((err) => {
    logger.error('Failed to launch bot: ' + err);
  });

bot.telegram.setWebhook(`${BOT_URL}/webhook`);

process.once('SIGINT', () => {
  logger.info('Bot is stopping due to SIGINT...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  logger.info('Bot is stopping due to SIGTERM...');
  bot.stop('SIGTERM');
});

// Express

var options = {
  dotfiles: 'ignore',
};

const app = express();
app.use(express.static('public', options));

app.use(bot.webhookCallback('/webhook'));

app.get('/app', (req, res) => {
  logger.info('Requested app...')
  res.type('html').send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Redirecting...</title>
      <script>
        (function () {
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          const tgWebAppData = hashParams.get('tgWebAppData');

          if (!tgWebAppData) {
            window.location.replace('${FRONTEND_URL}');
            return;
          }

          try {
            const data = decodeURIComponent(decodeURIComponent(tgWebAppData))

            const params = new URLSearchParams(data);

            const userRaw = params.get('user');
            const user = JSON.parse(userRaw);

            const username = user.username;

            if (!username) {
              window.location.replace('${FRONTEND_URL}');
              return;
            }

            fetch('/redirect/' + username)
              .then(res => res.json())
              .then(data => {
                const redirectUrl = data.redirect || '${FRONTEND_URL}';
                window.location.replace(redirectUrl);
              })
              .catch(() => {
                window.location.replace('${FRONTEND_URL}');
              });
          } catch (err) {
            console.warn('Failed to parse tgWebAppData:', err);
            // window.location.replace('${FRONTEND_URL}');
          }
        })();
      </script>
    </head>
    <body>
      <p>Redirecting…</p>
    </body>
    </html>
  `);
});

app.get('/redirect/:username', (req, res) => {
  const username = req.params.username;
  const path = redirectService.getRedirect(username);
  logger.info(`Redirect found ${username} to ${path}`);
  res.json({ redirect: path });
});

app.listen(HTTP_PORT, () => {
  logger.info(`Server is running on port ${HTTP_PORT}`);
});
