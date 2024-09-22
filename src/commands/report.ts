import { MyContext } from "src/bot";
import logger from "src/utils/logger";
import { Telegraf } from "telegraf";

export function setupReportCommand(bot: Telegraf<MyContext>) {
  bot.command("report", (ctx) => {
    logger.info(
      `Report mode set to true for user ${ctx.from.username ?? ctx.from.first_name}`,
    );
    ctx.session = {
      report_mode: true,
    };
  });

  bot.on("message", (ctx) => {
    if (ctx.session === undefined || ctx.session.report_mode !== true) return;

    const message = ctx.message as { text: string };
    logger.report({ message: message.text, level: "report" });

    ctx.session = {
      report_mode: false,
    };
  });
}
