import { MyContext } from "src/bot";
import { Telegraf } from "telegraf";

interface Feedback {
  username: string;
  message: string;
}

export interface IFeedbackService {
  sendFeedback(feedback: Feedback): void;
}

export class FeedbackService implements IFeedbackService {
  private bot: Telegraf<MyContext>;
  private feedbackChatId: number;

  constructor(bot: Telegraf<MyContext>, feedbackChatId: number) {
    this.bot = bot;
    this.feedbackChatId = feedbackChatId;
  }

  sendFeedback(feedback: Feedback): void {
    const escapeMarkdown = (text: string): string =>
      text.replace(/([*_[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

    const username = escapeMarkdown(feedback.username);
    const messageText = escapeMarkdown(feedback.message);

    const message = `💌 **Feedback from ${username}**\n\n${messageText}`;
    this.bot.telegram.sendMessage(this.feedbackChatId, message, {
      parse_mode: "MarkdownV2",
    });
  }
}
