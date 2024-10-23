import { MyContext } from "src/bot";
import logger from "src/utils/logger";
import { Telegraf } from "telegraf";

export function setupReportCommand(bot: Telegraf<MyContext>) {
  bot.command("report", async (ctx) => {
    logger.info(
      `Report mode set to true for user ${ctx.from.username ?? ctx.from.first_name}`,
    );
    ctx.session = {
        report_mode: true,
        feedback_mode: false
    };
  });

  bot.on("message", async (ctx, next) => {
    if (ctx.session === undefined || ctx.session.report_mode !== true) return next();

    const message = ctx.message as { text: string };
    logger.report({ message: message.text, level: "report" });

    ctx.session = {
        report_mode: false,
        feedback_mode: false
    };

    return next();
  });
}
