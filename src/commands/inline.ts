import { BOT_URL } from 'src/config';
import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardButton, InlineQueryResult } from 'telegraf/types';

export function setupInlineQuery(bot: Telegraf<Context>) {
  bot.on('inline_query', async (ctx) => {
    const button: InlineKeyboardButton = {
      text: 'создаем лобби...',
      callback_data: 'creating-lobby',
    };

    const results: InlineQueryResult[] = [
      {
        type: 'article',
        id: 'id',
        title: 'DishDash',
        description:
          'Чтобы легко и быстро выбрать место для встречи в компании.',
        thumbnail_url: `${BOT_URL}/cover.jpg`,
        input_message_content: {
          message_text: `Добро пожаловать, <b>${ctx.from.first_name}</b>!\n\nИспользуйте DishDash, чтобы легко и быстро выбрать место для встречи в компании. Упомяните бота в чате и введите <code>@dishdash_bot start</code> для создания лобби.\n\nБот <a href='https://dishdash.ru'>DishDash</a> разработан командой <a href='https://t.me/+4l8DChDSxMQxNWUy'>"Шампиньоны"</a>.`,
          parse_mode: 'HTML',
        },
        reply_markup: {
          inline_keyboard: [[button]],
        },
      },
    ];

    await ctx.answerInlineQuery(results, {
      button: {
        start_parameter: 'support',
        text: 'cвязатся с поддержкой',
      },
      cache_time: 0,
    });
  });
}
