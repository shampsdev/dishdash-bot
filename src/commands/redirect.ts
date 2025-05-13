import { IRedirectService } from 'src/services/redirectService';
import { Context, Telegraf } from 'telegraf';

export function setupRedirectCommand(
  bot: Telegraf<Context>,
  redirectService: IRedirectService
) {
  bot.command('redirect', async (ctx) => {
    const redirect = ctx.message.text.split(' ')[1];
    const username = ctx.message.from.username;

    if (!redirect) {
      if (username !== undefined) {
        redirectService.resetRedirect(username);
        const currentRedirect = redirectService.getRedirect(username);
        return ctx.reply(
          `Redirect cleared. Current redirect: ${currentRedirect || 'none'}`
        );
      } else {
        return ctx.reply('Username not found. Cannot reset redirect.');
      }
    }

    if (username !== undefined) {
      redirectService.setRedirect(username, redirect);
    }

    await ctx.reply(`Redirecting set to ${redirect}`);
  });
}
