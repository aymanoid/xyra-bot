import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class HugCommand extends Command {
  constructor() {
    super('hug', {
      aliases: ['hug'],
      description: {
        content: 'Hug someone.',
        usage: '<member>',
      },
      category: 'reactions',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'meOrMember',
          type: Argument.union(['me'], 'member'),
          otherwise: 'You need to mention someone to hug them.',
        },
      ],
    });
  }

  async exec(msg, args) {
    const embedColor = msg.guild.me.displayColor;

    const trgMember = args.meOrMember === 'me' ? msg.member : args.meOrMember;

    const description =
      msg.member.id === trgMember.id
        ? `**${msg.member.displayName}** hugs themselves`
        : `**${msg.member.displayName}** hugs **${trgMember.displayName}**`;

    const nekosClient = new NekosLife();
    const imageURL = (await nekosClient.sfw.hug()).url;

    const actionEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(description)
      .setImage(imageURL);

    return msg.channel.send(actionEmbed);
  }
}

export default HugCommand;
