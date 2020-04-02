import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class SlapCommand extends Command {
  constructor() {
    super('slap', {
      aliases: ['slap'],
      description: {
        content: 'Slap someone.',
        usage: '<member>',
      },
      category: 'Reactions',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'meOrMember',
          type: Argument.union(['me'], 'member'),
          otherwise: 'You need to mention someone to slap them.',
        },
      ],
    });
  }

  async exec(msg, args) {
    const botColor = msg.guild.me.displayColor;

    const trgMember = args.meOrMember === 'me' ? msg.member : args.meOrMember;

    const description =
      msg.member.id === trgMember.id
        ? `**${msg.member.displayName}** slaps themselves`
        : `**${msg.member.displayName}** slaps **${trgMember.displayName}**`;

    const nekosClient = new NekosLife();
    const imageURL = (await nekosClient.sfw.slap()).url;

    const actionEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setDescription(description)
      .setImage(imageURL);

    return msg.channel.send(actionEmbed);
  }
}

export default SlapCommand;
