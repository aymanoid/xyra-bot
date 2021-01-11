import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class GlobalAvatarCommand extends Command {
  constructor() {
    super('globalavatar', {
      aliases: ['globalavatar', 'globalav', 'globalicon', 'globalpfp'],
      description: {
        content:
          'Toggles the setting of whether the avatar command works with non members or not.',
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
      'globalAvatar',
      true
    );
    await this.client.settings.set(msg.guild, 'globalAvatar', !currSetting);

    return msg.channel.send(
      `${EMOJIS.CHECKED} The avatar command will now ${
        currSetting
          ? 'work with server members only.'
          : 'also work with non server members.'
      }`
    );
  }
}

export default GlobalAvatarCommand;
