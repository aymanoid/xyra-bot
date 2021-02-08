import { Inhibitor } from 'discord-akairo';

export default class AdminOnlyInhibitor extends Inhibitor {
  constructor() {
    super('adminonly', {
      reason: 'adminonly',
    });
  }

  exec(msg) {
    return !msg.guild.me.permissions.has('ADMINISTRATOR');
  }
}
