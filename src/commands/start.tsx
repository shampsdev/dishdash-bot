import { Context, Telegraf } from 'telegraf';
import logger from '../utils/logger';
import { adminMiddleware } from '../middlewares/adminMiddleware';

export function setupStartCommand(bot: Telegraf<Context>) {
    bot.start(adminMiddleware, (ctx) => {
        const username = ctx.from.username || 'unknown';
        logger.info(`Admin ${username} used /start.`);
        ctx.reply(`Добро пожаловать, @${username}!`);
    });
}
