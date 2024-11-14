import { BOT_USERNAME } from "src/config";
import { Context, Telegraf } from "telegraf";

export function setupStartCommand(bot: Telegraf<Context>) {
  bot.start(async (ctx) => {
    const username = ctx.from.username || "unknown";
    await ctx.reply(
      `Добро пожаловать, @${username}!\nЧтобы воспользоваться ботом, откройте мини-приложение DishDash:`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Открыть DishDash 🤌",
                url: `https://t.me/${BOT_USERNAME}/app`,
              },
            ],
          ],
        },
      },
    );
  });
}
