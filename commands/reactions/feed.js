import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class FeedCommand extends Command {
  constructor() {
    super('feed', {
      aliases: ['feed'],
      description: {
        content: 'Feed someone.',
        usage: '<member>',
      },
      category: 'Reactions',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'meOrMember',
          type: Argument.union(['me'], 'member'),
          otherwise: 'You need to mention someone to feed them.',
        },
      ],
    });
  }

  async exec(msg, args) {
    const botColor = msg.guild.me.displayColor;

    const trgMember = args.meOrMember === 'me' ? msg.member : args.meOrMember;

    const description =
      msg.member.id === trgMember.id
        ? `**${msg.member.displayName}** feeds themselves`
        : `**${msg.member.displayName}** feeds **${trgMember.displayName}**`;

    const nekosClient = new NekosLife();
    const imageURL = (await nekosClient.sfw.feed()).url;

    const actionEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setDescription(description)
      .setImage(imageURL);

    return msg.channel.send(actionEmbed);
  }
}

export default FeedCommand;
