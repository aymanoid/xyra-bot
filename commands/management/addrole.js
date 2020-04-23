import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class AddRoleCommand extends Command {
  constructor() {
    super('addrole', {
      aliases: ['addrole'],
      description: {
        content: 'Adds a role to the server.',
        usage: '[name] <--color=color code> <--hoist>',
        examples: ['cutie --color=#000001 --hoist'],
      },
      category: 'management',
      channel: 'guild',
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      cooldown: 5000,
      args: [
        {
          id: 'name',
          match: 'text',
          otherwise: (msg) =>
            CommandHelp(msg.util.parsed.command, msg, this.client.user),
        },
        {
          id: 'color',
          type: 'color',
          match: 'option',
          flag: ['--color=', '-c='],
        },
        {
          id: 'hoist',
          match: 'flag',
          flag: ['--hoist', '-h'],
        },
      ],
    });
  }

  async exec(msg, args) {
    let addedRole;
    try {
      addedRole = await msg.guild.roles.create({
        data: { name: args.name, color: args.color, hoist: args.hoist },
      });
    } catch (err) {
      msg.channel.send(`${EMOJIS.ERROR} There was an error adding the role.`);
      throw err;
    }

    return msg.channel.send(
      `${EMOJIS.SUCCESS} \`${addedRole.name}\` role has been added.`
    );
  }
}

export default AddRoleCommand;
