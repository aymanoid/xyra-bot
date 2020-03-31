import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';

class RoleInfoCommand extends Command {
  constructor() {
    super('roleinfo', {
      aliases: ['roleinfo', 'rinfo'],
      description: {
        content: 'Gets information about a role.',
        usage: '[role]',
      },
      category: 'Core',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'role',
          match: 'content',
          type: 'role',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.role) return msg.channel.send('No role was provided.');

    const trgRole = args.role;

    const roleInfoEmbed = new MessageEmbed()
      .setColor(trgRole.color || 16777215)
      .addField('Name', trgRole.name, true)
      .addField('ID', trgRole.id, true)
      .addField('Mention', `\`${trgRole.toString()}\``, true)
      .addField('Members', trgRole.members.size, true)
      .addField('Color', trgRole.hexColor.toUpperCase(), true)
      .addField('Position', trgRole.position, true)
      .addField('Managed', trgRole.managed ? 'Yes' : 'No', true)
      .addField('Hoisted', trgRole.hoist ? 'Yes' : 'No', true)
      .addField('Mentionable', trgRole.mentionable ? 'Yes' : 'No', true)
      .setFooter(
        `Role Created On: ${moment(trgRole.createdAt).format('llll z')}`
      );

    return msg.channel.send(roleInfoEmbed);
  }
}

export default RoleInfoCommand;
