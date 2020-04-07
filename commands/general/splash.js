import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { EMOJIS } from '../../util/Constants';

class SplashCommand extends Command {
  constructor() {
    super('splash', {
      aliases: ['splash'],
      description: {
        content: 'Displays the server splash image.',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const currGuild = msg.guild;
    const embedColor = msg.guild.me.displayColor;
    const splashURL = currGuild.splashURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });
    const iconURL = currGuild.iconURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    if (!splashURL)
      return msg.channel.send(
        `${EMOJIS.ERROR} This server has no splash image set.`
      );

    const splashEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Splash URL')
      .setURL(splashURL)
      .setAuthor(currGuild.name, iconURL)
      .setImage(splashURL);

    return msg.channel.send(splashEmbed);
  }
}

export default SplashCommand;
