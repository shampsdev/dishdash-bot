import { Context, Telegraf } from 'telegraf';
import logger from '../utils/logger';

export function setupStartCommand(bot: Telegraf<Context>) {
    bot.start((ctx) => {
        const username = ctx.from?.username || 'unknown';
        logger.info(`User ${username} used /start.`);
        ctx.reply(`Добро пожаловать, @${username}!`);
    });
}
