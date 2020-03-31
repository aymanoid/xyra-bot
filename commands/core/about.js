import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class AboutCommand extends Command {
  constructor() {
    super('about', {
      aliases: ['about', 'info'],
      description: {
        content: 'Displays information about the bot.',
      },
      category: 'Core',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const currGuild = msg.guild;
    const botColor = currGuild.me.displayColor;
    const avatarURL = currGuild.me.user.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    const aboutEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setAuthor(
        `${currGuild.me.user.username} v${process.env.npm_package_version}`,
        avatarURL
      )
      .setDescription(
        'The bot is currently at an early development stage, so you may experience many bugs and downtimes.'
      )
      .setThumbnail(avatarURL)
      .addField(
        'Creator',
        this.client.users.cache.get(this.client.ownerID).tag,
        true
      )
      .addField('Library', 'discord.js', true)
      .addField('Website', '[xyra.io](https://xyra.io)', true)
      .addField('Invite', '[xyra.io/invite](https://xyra.io/invite)', true)
      .addField('Server', '[xyra.io/server](https://xyra.io/server)', true)
      .addField(
        'Commands',
        '[xyra.io/commands](https://xyra.io/commands)',
        true
      );

    return msg.channel.send(aboutEmbed);
  }
}

export default AboutCommand;
