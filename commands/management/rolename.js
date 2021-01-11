import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class RoleNameCommand extends Command {
  constructor() {
    super('rolename', {
      aliases: ['rolename'],
      description: {
        content: 'Changes the name of a role.',
        usage: '[name] [--name=new name]',
      },
      category: 'management',
      channel: 'guild',
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      cooldown: 6000,
      args: [
        {
          id: 'role',
          type: 'role',
          match: 'text',
        },
        {
          id: 'name',
          type: 'string',
          match: 'option',
          flag: ['--name=', '-n='],
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.role)
      return msg.channel.send(`${EMOJIS.ERROR} No valid role was provided.`);
    if (!args.name)
      return msg.channel.send(`${EMOJIS.ERROR} No valid name was provided.`);

    const trgRole = args.role;
    const trgName = args.name;

    if (!trgRole.editable)
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like the role **\`${trgRole.name}\`** is higher than mine.`
      );

    if (!msg.member.canEdit(trgRole))
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like the role **\`${trgRole.name}\`** is higher than yours.`
      );

    let editedRole;
    try {
      editedRole = await trgRole.setColor(trgName);
    } catch (err) {
      msg.channel.send(`${EMOJIS.ERROR} There was an error editing the role.`);
      throw err;
    }

    return msg.channel.send(
      `${EMOJIS.CHECKED} \`${editedRole.name}\` role has been edited.`
    );
  }
}

export default RoleNameCommand;
