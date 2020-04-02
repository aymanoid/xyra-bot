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
          retries: 0,
        },
        modifyOtherwise: (msg, text) => `${msg.author}, ${text}`,
      },
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
