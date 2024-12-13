import { MyContext } from "src/bot";
import { IFeedbackService } from "src/services/feedbackService";
import logger from "src/utils/logger";
import { Context, Telegraf } from "telegraf";
import { FEEDBACK_CHAT_ID } from "src/config";
import { CommandContextExtn } from "node_modules/telegraf/typings/telegram-types";
import { Update, Message } from "telegraf/types";
// TODO: voice message transcription
export function setupFeedbackCommand(
  bot: Telegraf<MyContext>,
  fbService: IFeedbackService,
) {
  const stopFeedback = (
    ctx: Context<{
      message: Update.New & Update.NonChannel & Message.TextMessage;
      update_id: number;
    }> &
      Omit<MyContext, keyof Context<Update>> &
      CommandContextExtn,
  ) => {
    if (ctx.session !== undefined) {
      if (ctx.session.feedback_mode) {
        logger.info(
          `Feedback mode set to false for user ${ctx.from.username ?? ctx.from.first_name}`,
        );
        ctx.reply("Ты перестал делиться фидбэком");
        ctx.session.feedback_mode = false;

        fbService.sendFeedbackEnd({
          username: ctx.message.from.username
            ? `@${ctx.message.from.username}`
            : ctx.message.from.id.toString(),
        });
        setTimeout(() => {
          stopFeedback(ctx);
        }, 1000 * 90);
      }
    }
  };

  bot.command("feedback", async (ctx) => {
    if (ctx.session?.feedback_mode) {
      return;
    }
    logger.info(
      `Feedback mode set to true for user ${ctx.from.username ?? ctx.from.first_name}`,
    );
    ctx.reply(
      "Пришли свой фидбэк в любом формате!\nДля того, чтобы перестать делиться, напиши команду /stop_feedback",
    );
    ctx.session = {
      feedback_mode: true,
    };
    fbService.sendFeedback({
      username: ctx.message.from.username
        ? `@${ctx.message.from.username}`
        : ctx.message.from.id.toString(),
    });
  });

  bot.command("stop_feedback", async (ctx) => {
    stopFeedback(ctx);
  });

  bot.on("message", async (ctx, next) => {
    if (ctx.session === undefined || ctx.session.feedback_mode !== true)
      return next();

    const targetChatId = FEEDBACK_CHAT_ID;
    if (targetChatId === undefined) {
      return next();
    }

    await ctx.forwardMessage(targetChatId);

    return next();
  });
}
