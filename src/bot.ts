import { Context, session, Telegraf } from "telegraf";
import {
  BOT_TOKEN,
  BOT_URL,
  DEBUG,
  FRONTEND_URL,
  HTTP_PORT,
  FEEDBACK_CHAT_ID,
} from "./config";
import logger from "./utils/logger";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";

import { setupStartCommand } from "./commands/start";
import { setupHelpCommand } from "./commands/help";
import { setupInlineQuery } from "./commands/inline";
import { TelegramTransport } from "./utils/telegramTransport";

import express from "express";
import { setupJoinCommand } from "./commands/join";
import { setupFeedbackCommand } from "./commands/feedback";
import { FeedbackService } from "./services/feedbackService";

// Telegraf
interface SessionData {
  feedback_mode: boolean;
}

export interface MyContext extends Context {
  session?: SessionData;
}

const bot = new Telegraf<MyContext>(BOT_TOKEN);

logger.info("Bot is starting...");

logger.add(
  new TelegramTransport({
    bot,
    debug: DEBUG,
    level: "report",
    chat_id: FEEDBACK_CHAT_ID,
  }),
);

bot.use(loggerMiddleware);
bot.use(
  session({
    defaultSession: () => ({
      feedback_mode: false,
    }),
  }),
);

setupJoinCommand(bot);
setupStartCommand(bot);
setupFeedbackCommand(bot, new FeedbackService(bot, FEEDBACK_CHAT_ID ?? 0));
setupHelpCommand(bot);
setupInlineQuery(bot);

bot
  .launch()
  .then(() => {
    logger.info("Bot is running");
  })
  .catch((err) => {
    logger.error("Failed to launch bot: " + err);
  });

bot.telegram.setWebhook(`${BOT_URL}/webhook`);

process.once("SIGINT", () => {
  logger.info("Bot is stopping due to SIGINT...");
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  logger.info("Bot is stopping due to SIGTERM...");
  bot.stop("SIGTERM");
});

// Express

var options = {
  dotfiles: "ignore",
};

const app = express();
app.use(express.static("public", options));

app.use(bot.webhookCallback("/webhook"));

app.get("/app", (req, res) => {
  res.redirect(
    `${FRONTEND_URL}${req.query.tgWebAppStartParam ? "/" + req.query.tgWebAppStartParam.toString() : ""}`,
  );
});

app.listen(HTTP_PORT, () => {
  logger.info(`Server is running on port ${HTTP_PORT}`);
});
