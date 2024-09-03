import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';
import Transport from 'winston-transport';

export class TelegramTransport extends Transport {
  debug: boolean;
  bot: Telegraf<Context<Update>>;
  constructor(
    opts: Transport.TransportStreamOptions & {
      debug: boolean;
      bot: Telegraf<Context<Update>>;
    }
  ) {
    super(opts);
    this.debug = opts.debug;
    this.bot = opts.bot;
  }

  log(info: unknown, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Perform the writing to the remote service
    if (!this.debug) {
      console.log(info);
      // this.bot.telegram.sendMessage()
    }

    callback();
  }
}
