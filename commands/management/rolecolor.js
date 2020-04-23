import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class RoleColorCommand extends Command {
  constructor() {
    super('rolecolor', {
      aliases: ['rolecolor'],
      description: {
        content: 'Changes the color of a role.',
        usage: '[name] [--color=hex color]',
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
          id: 'color',
          type: 'color',
          match: 'option',
          flag: ['--color=', '-c='],
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.role)
      return msg.channel.send(`${EMOJIS.ERROR} No valid role was provided.`);
    if (!args.color)
      return msg.channel.send(`${EMOJIS.ERROR} No valid color was provided.`);

    const trgRole = args.role;
    const trgColor = args.color;

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
      editedRole = await trgRole.setColor(trgColor);
    } catch (err) {
      msg.channel.send(`${EMOJIS.ERROR} There was an error editing the role.`);
      throw err;
    }

    return msg.channel.send(
      `${EMOJIS.SUCCESS} \`${editedRole.name}\` role has been edited.`
    );
  }
}

export default RoleColorCommand;
