import { MyContext } from "src/bot";
import { IFeedbackService } from "src/services/feedbackService";
import logger from "src/utils/logger";
import { Telegraf } from "telegraf";
import { FEEDBACK_CHAT_ID } from "src/config";
// TODO: voice message transcription
export function setupFeedbackCommand(
  bot: Telegraf<MyContext>,
  fbService: IFeedbackService,
) {
  bot.command("feedback", async (ctx) => {
    if (ctx.session?.feedback_mode) {
      return;
    }
    logger.info(
      `Feedback mode set to true for user ${ctx.from.username ?? ctx.from.first_name}`,
    );
    ctx.reply("Пришли свой фидбэк в любом формате!\n");
    ctx.session = {
      feedback_mode: true,
    };
  });

  bot.on("message", async (ctx, next) => {
    if (ctx.session === undefined || ctx.session.feedback_mode !== true)
      return next();

    const targetChatId = FEEDBACK_CHAT_ID;
    if (targetChatId === undefined) {
      return next();
    }
    fbService.sendFeedback({
      username: ctx.message.from.username
        ? `@${ctx.message.from.username}`
        : ctx.message.from.id.toString(),
    });
    await ctx.forwardMessage(targetChatId);
    ctx.reply("Спасибо за фидбек!");
    ctx.session.feedback_mode = false;
    return next();
  });
}
