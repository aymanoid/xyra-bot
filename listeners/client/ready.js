import { Listener } from 'discord-akairo';
import Logger from '../../util/Logger';

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client',
    });
  }

  exec() {
    Logger.info(`${this.client.user.tag} is ready!`);
    this.client.user.setActivity(`@${this.client.user.username} help`);
  }
}

export default ReadyListener;
