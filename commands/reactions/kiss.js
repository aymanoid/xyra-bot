import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class KissCommand extends Command {
  constructor() {
    super('kiss', {
      aliases: ['kiss'],
      description: {
        content: 'Kiss someone.',
        usage: '<member>',
      },
      category: 'reactions',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'meOrMember',
          type: Argument.union(['me'], 'member'),
          otherwise: 'You need to mention someone to kiss them.',
        },
      ],
    });
  }

  async exec(msg, args) {
    const botColor = msg.guild.me.displayColor;

    const trgMember = args.meOrMember === 'me' ? msg.member : args.meOrMember;

    const description =
      msg.member.id === trgMember.id
        ? `**${msg.member.displayName}** kisses themselves`
        : `**${msg.member.displayName}** kisses **${trgMember.displayName}**`;

    const nekosClient = new NekosLife();
    const imageURL = (await nekosClient.sfw.kiss()).url;

    const actionEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setDescription(description)
      .setImage(imageURL);

    return msg.channel.send(actionEmbed);
  }
}

export default KissCommand;
