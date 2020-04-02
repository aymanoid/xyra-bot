import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import Logger from '../util/Logger';
import Database from './Database';
import SettingsProvider from './SettingsProviders';
import Setting from '../models/settings';

class XyraClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: '628460617669410836',
      },
      {
        messageCacheMaxSize: 50,
        messageCacheLifetime: 300,
        messageSweepInterval: 900,
        disableEveryone: true,
        disabledEvents: ['TYPING_START'],
        partials: ['MESSAGE'],
      }
    );

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      ignoreCooldownID: [''],
      aliasReplacement: /-/g,
      prefix: (message) => this.settings.get(message.guild, 'prefix', '$$'),
      allowMention: true,
      commandUtil: true,
      commandUtilLifetime: 10000,
      commandUtilSweepInterval: 10000,
      storeMessages: true,
      handleEdits: true,
      defaultCooldown: 2500,
      argumentDefaults: {
        prompt: {
          start: 'start message.',
          retry: 'retry message.',
          timeout: 'Time ran out, command has been cancelled.',
          ended: 'Too many retries, command has been cancelled.',
          cancel: 'Command has been cancelled.',
          retries: 1,
          time: 30000,
        },
        modifyOtherwise: (msg, text) => `${msg.author}, ${text}`,
      },
    });

    // CUSTOM TYPES
    this.commandHandler.resolver.addType('emojiThingy', (message, phrase) => {
      if (!phrase) return null;
      const mention = phrase.match(/<(a?):(\w+):(\d+)>$/);
      if (!mention) return null;
      const emojiObj = {
        id: mention[3],
        name: mention[2],
        animated: !!mention[1],
        custom: true,
        url: `https://cdn.discordapp.com/emojis/${mention[3]}.${
          mention[1] ? 'gif' : 'png'
        }?v=1`,
      };

      let urlStatus;
      // eslint-disable-next-line global-require
      require('axios')({ url: emojiObj.url, method: 'HEAD' }).then(
        // eslint-disable-next-line no-return-assign
        (r) => (urlStatus = r.status)
      );
      emojiObj.valid = urlStatus !== 404;

      return emojiObj;
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: './inhibitors/',
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: './listeners/',
    });

    this.settings = new SettingsProvider(Setting);

    this.setup();
  }

  setup() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
    });

    this.commandHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  async start() {
    Logger.info('Ready!');
    await Database.authenticate();
    await this.settings.init();
    return this.login(process.env.TOKEN);
  }
}

export default XyraClient;
