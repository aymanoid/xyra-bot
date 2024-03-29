import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import path from 'path';
import Logger from '../util/Logger';
import Database from './Database';
import SettingsProvider from './SettingsProviders';
import Setting from '../models/settings';

class XyraClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: ['772377509928370178'],
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
      directory: path.join(__dirname, '..', 'commands'),
      ignoreCooldownID: [''],
      aliasReplacement: /-/g,
      prefix: (message) => this.settings.get(message.guild, 'prefix', '$'),
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
        modifyOtherwise: (msg, text) =>
          typeof text === 'object' ? text : `${msg.author}, ${text}`,
      },
    });

    // CUSTOM TYPES
    this.commandHandler.resolver.addType('categoryName', (message, phrase) => {
      if (!phrase) return null;
      return this.commandHandler.findCategory(phrase) || null;
    });

    this.commandHandler.resolver.addType('attachment', (message) => {
      if (!message.attachments.size) return null;
      return message.attachments.array()[0] || null;
    });

    this.commandHandler.resolver.addType('emojiMentionG', (message, phrase) => {
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

    this.commandHandler.resolver.addType('userMentionG', (message, phrase) => {
      if (!phrase) return null;
      const id =
        phrase.match(/<@!?(\d{17,19})>/) || phrase.match(/^(\d{17,19})$/);
      if (!id) return null;
      return id[1] || null;
    });

    this.commandHandler.resolver.addType(
      'memberOrGlobalUser',
      async (message, phrase) => {
        if (!phrase) return null;
        if (message.guild) {
          const memberType = this.commandHandler.resolver.type('member');
          const member = memberType(message, phrase);
          if (member) return member;
        }
        const id =
          phrase.match(/<@!?(\d{17,19})>/) || phrase.match(/^(\d{17,19})$/);
        if (!id) return null;
        try {
          return await this.users.fetch(id[1]);
        } catch {
          return null;
        }
      }
    );

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: path.join(__dirname, '..', 'inhibitors'),
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(__dirname, '..', 'listeners'),
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
    return this.login(process.env.BOT_TOKEN);
  }
}

export default XyraClient;
