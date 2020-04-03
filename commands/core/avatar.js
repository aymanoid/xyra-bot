import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class AvatarCommand extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar', 'av', 'icon', 'pfp'],
      description: {
        content: 'Displays the avatar of a member.',
        usage: '[member]',
        examples: ['', '@User', 'server'],
      },
      category: 'core',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'serverOrMember',
          match: 'content',
          type: Argument.union(['server', 'guild'], 'member'),
          default: (msg) => msg.member,
        },
      ],
    });
  }

  async exec(msg, args) {
    const currGuild = msg.guild;
    const embedColor = msg.guild.me.displayColor;

    let isGuild = false;
    let iconURL;
    let trgMember;

    if (typeof args.serverOrMember === 'string') {
      if (!currGuild.iconURL())
        return msg.channel.send('This server has no icon set.');
      isGuild = true;
      iconURL = currGuild.iconURL({
        format: 'png',
        dynamic: true,
        size: 2048,
      });
    } else {
      trgMember = args.serverOrMember;
      iconURL = trgMember.user.displayAvatarURL({
        format: 'png',
        dynamic: true,
        size: 2048,
      });
    }

    const iconEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle(isGuild ? 'Icon URL' : 'Avatar URL')
      .setURL(iconURL)
      .setAuthor(isGuild ? currGuild.name : trgMember.user.tag, iconURL)
      .setImage(iconURL);

    return msg.channel.send(iconEmbed);
  }
}

export default AvatarCommand;
