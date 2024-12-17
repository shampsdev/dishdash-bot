import { BOT_USERNAME } from "src/config";
import { IMetricService } from 'src/services/metricService';
import { Context, Telegraf } from "telegraf";

export function setupStartCommand(bot: Telegraf<Context>, metricService: IMetricService) {
  bot.start(async (ctx) => {
    const userId = ctx.from.id;
    metricService.sendTagEvent(userId, ctx.payload);

    await ctx.replyWithPhoto(
      "https://storage.yandexcloud.net/dishash-s3/assets/bot/cover.jpeg",
      {
        caption: `*Как свайпать?*\n\n• Чтобы посмотреть места в одиночку, запустите бота по кнопке ниже\n\n• Чтобы искать места вместе, запустите бота тут и отправьте приглашение в лобби, или тегните @dishdash\\_bot в любом чате`,
        parse_mode: "MarkdownV2",
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
