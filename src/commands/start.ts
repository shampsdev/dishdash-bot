import { BOT_USERNAME } from "src/config";
import { Context, Telegraf } from "telegraf";

export function setupStartCommand(bot: Telegraf<Context>) {
  bot.start(async (ctx) => {
    const username = ctx.from.username || "unknown";
    await ctx.reply(
      `Добро пожаловать, @${username}!\nЧтобы воспользоваться ботом, тгени его в любой беседе @${BOT_USERNAME}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Открыть DishDash 🥪",
                switch_inline_query: "",
              },
            ],
          ],
        },
      },
    );
  });
}
