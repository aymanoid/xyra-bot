import { Inhibitor } from 'discord-akairo';

export default class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super('blacklist', {
      reason: 'blacklist',
    });
  }

  exec(msg) {
    const blacklist = [''];
    return blacklist.includes(msg.author.id);
  }
}
