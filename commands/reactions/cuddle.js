import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class CuddleCommand extends Command {
  constructor() {
    super('cuddle', {
      aliases: ['cuddle'],
      description: {
        content: 'Cuddle someone.',
        usage: '<member>',
      },
      category: 'reactions',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'meOrMember',
          type: Argument.union(['me'], 'member'),
          otherwise: 'You need to mention someone to cuddle them.',
        },
      ],
    });
  }

  async exec(msg, args) {
    const botColor = msg.guild.me.displayColor;

    const trgMember = args.meOrMember === 'me' ? msg.member : args.meOrMember;

    const description =
      msg.member.id === trgMember.id
        ? `**${msg.member.displayName}** cuddles themselves`
        : `**${msg.member.displayName}** cuddles **${trgMember.displayName}**`;

    const nekosClient = new NekosLife();
    const imageURL = (await nekosClient.sfw.cuddle()).url;

    const actionEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setDescription(description)
      .setImage(imageURL);

    return msg.channel.send(actionEmbed);
  }
}

export default CuddleCommand;
