import { MyContext } from "src/bot";
import { IFeedbackService } from "src/services/feedbackService";
import logger from "src/utils/logger";
import { Telegraf } from "telegraf";

// TODO: voice message transcription
export function setupFeedbackCommand(
  bot: Telegraf<MyContext>,
  fbService: IFeedbackService,
) {
  bot.command("feedback", async (ctx) => {
    logger.info(
      `Feedback mode set to true for user ${ctx.from.username ?? ctx.from.first_name}`,
    );
    ctx.reply("Пришли свой фидбэк в текстовом формате!");
    ctx.session = {
      feedback_mode: true,
    };
  });

  bot.on("message", async (ctx, next) => {
    if (ctx.session === undefined || ctx.session.feedback_mode !== true)
      return next();

    if ("text" in ctx.message) {
      fbService.sendFeedback({
        username: ctx.message.from.username
          ? `@${ctx.message.from.username}`
          : ctx.message.from.id.toString(),
        message: ctx.message.text,
      });
    }

    ctx.session = {
      feedback_mode: false,
    };

    return next();
  });
}
