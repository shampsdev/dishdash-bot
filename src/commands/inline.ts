import { BOT_URL, BOT_USERNAME } from 'src/config';
import { findLobby } from 'src/services/lobbyService';
import { Context, Telegraf } from 'telegraf';
import {
  InlineKeyboardButton,
  InlineQueryResult,
  Location,
} from 'telegraf/types';

export function setupInlineQuery(bot: Telegraf<Context>) {
  bot.on('inline_query', async (ctx) => {
    const button: InlineKeyboardButton = {
      text: 'создаем лобби...',
      callback_data: 'creating-lobby',
    };

    const results: InlineQueryResult[] = [
      {
        type: 'article',
        id: 'create-lobby',
        title: 'Создать Лобби',
        description:
          'Создать новое лобби, чтобы легко и быстро выбрать место для встречи в компании.',
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

  bot.on('chosen_inline_result', async (ctx) => {
    const messageId = ctx.chosenInlineResult.inline_message_id;

    const getLobbyUrl = async (location: Location) => {
      const lobby = await findLobby({
        location: {
          lat: location.latitude,
          lon: location.longitude,
        },
      });

      return lobby?.data.lobby.id;
    };

    // const coords = ctx.chosenInlineResult.location;
    const coords = {
      latitude: 59.9311,
      longitude: 30.3609,
    };

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (coords) {
      const lobbyId = await getLobbyUrl(coords);

      const button: InlineKeyboardButton = {
        text: 'Присоединится',
        url: `https://t.me/${BOT_USERNAME}/app?startapp=${lobbyId}`,
      };

      await bot.telegram.editMessageText(
        undefined,
        undefined,
        messageId,
        'kek',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[button]],
          },
        }
      );
    }
  });
}
