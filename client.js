import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';

class XyraClient extends AkairoClient {
  constructor() {
    super({
      ownerID: '628460617669410836',
    });

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      ignoreCooldownID: [''],
      aliasReplacement: /-/g,
      prefix: '$$',
      allowMention: true,
      commandUtil: true,
      commandUtilLifetime: 10000,
      commandUtilSweepInterval: 10000,
      storeMessages: true,
      handleEdits: true,
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

  async start(token) {
    await this.login(token);
    console.log('Ready!'); // eslint-disable-line no-console
  }
}

export default XyraClient;
