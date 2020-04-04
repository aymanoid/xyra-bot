import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class BannerCommand extends Command {
  constructor() {
    super('banner', {
      aliases: ['banner'],
      description: {
        content: 'Displays the server banner image.',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const currGuild = msg.guild;
    const embedColor = msg.guild.me.displayColor;
    const bannerURL = currGuild.bannerURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });
    const iconURL = currGuild.iconURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    if (!bannerURL)
      return msg.channel.send(`This server has no banner image set.`);

    const bannerEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Banner URL')
      .setURL(bannerURL)
      .setAuthor(currGuild.name, iconURL)
      .setImage(bannerURL);

    return msg.channel.send(bannerEmbed);
  }
}

export default BannerCommand;
