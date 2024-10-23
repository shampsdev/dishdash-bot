import { MyContext } from "src/bot";
import { transcribe } from "src/services/transcriptionService";
import { IFeedbackService } from "src/services/feedbackService";
import logger from "src/utils/logger";
import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "src/config";

export function setupFeedbackCommand(bot: Telegraf<MyContext>, fbService: IFeedbackService) {
    bot.command("feedback", async (ctx) => {
        logger.info(
            `Feedback mode set to true for user ${ctx.from.username ?? ctx.from.first_name}`,
        );
        ctx.session = {
            feedback_mode: true,
        };
    });

    bot.on("message", async (ctx, next) => {
        if (ctx.session === undefined || ctx.session.feedback_mode !== true) return next();

        if ('voice' in ctx.message) {
            const fileInfo = await ctx.telegram.getFile(ctx.message.voice.file_id);
            const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;

            transcribe(fileUrl).then((transcription) => {
                fbService.sendFeedback({
                    username: ctx.message.from.username ?? ctx.message.from.id.toString(),
                    message: transcription.output.transcription
                })
            })
        } else if ('text' in ctx.message) {
            fbService.sendFeedback({
                username: ctx.message.from.username ? 
                    `@${ctx.message.from.username}` : ctx.message.from.id.toString(),
                message: ctx.message.text
            })
        }

        ctx.session = {
            feedback_mode: false,
        };

        return next();
    });
}
