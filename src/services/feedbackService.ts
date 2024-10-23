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
        this.bot.telegram.sendMessage(this.feedbackChatId, JSON.stringify(feedback));
    }
}
