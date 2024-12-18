import { BOT_USERNAME } from "src/config";
import { IMetricService } from "src/services/metricService";
import { Context, Telegraf } from "telegraf";

export function setupStartCommand(
  bot: Telegraf<Context>,
  metricService: IMetricService,
) {
  bot.start(async (ctx) => {
    const userId = ctx.from.id;
    metricService.sendTagEvent(userId, ctx.payload);

    await ctx.replyWithPhoto(
      "https://storage.yandexcloud.net/dishash-s3/assets/bot/cover.jpeg",
      {
        caption: `*Как найти идеальное место для встречи?*\n\n1\\. Нажмите кнопку «Open»\n2\\. Создайте лобби\n3\\. Отправьте приглашения, если будете выбирать вместе\n4\\. Настройте параметры поиска под ваши цели и бюджет\n5\\. Все готово – начинайте свайпать\\!`,
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
