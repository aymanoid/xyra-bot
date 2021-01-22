import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class GlobalUserInfoCommand extends Command {
  constructor() {
    super('globaluserinfo', {
      aliases: [
        'globaluserinfo',
        'globaluinfo',
        'globalmemberinfo',
        'globalminfo',
        'globalwhois',
      ],
      description: {
        content:
          'Toggles the setting of whether the userinfo command works with non members or not.',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async exec(msg) {
    const currSetting = this.client.settings.get(
      msg.guild,
      'globalUserInfo',
      true
    );
    await this.client.settings.set(msg.guild, 'globalUserInfo', !currSetting);

    return msg.channel.send(
      `${EMOJIS.CHECKED} The userinfo command will now ${
        currSetting
          ? 'work with server members only.'
          : 'also work with non server members.'
      }`
    );
  }
}

export default GlobalUserInfoCommand;
