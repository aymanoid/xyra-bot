import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class DeleteRoleCommand extends Command {
  constructor() {
    super('deleterole', {
      aliases: ['deleterole', 'delrole'],
      description: {
        content: 'Deletes a role from the server.',
        usage: '[role]',
      },
      category: 'management',
      channel: 'guild',
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      cooldown: 5000,
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
    if (!args.role)
      return msg.channel.send(`${EMOJIS.ERROR} No valid role was provided.`);

    const trgRole = args.role;

    if (!trgRole.editable)
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like the role **\`${trgRole.name}\`** is higher than mine.`
      );

    if (!msg.member.canEdit(trgRole))
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like the role **\`${trgRole.name}\`** is higher than yours.`
      );

    let deletedRole;
    try {
      deletedRole = await trgRole.delete();
    } catch (err) {
      msg.channel.send(`${EMOJIS.ERROR} There was an error deleting the role.`);
      throw err;
    }

    return msg.channel.send(
      `${EMOJIS.SUCCESS} \`${deletedRole.name}\` role has been deleted.`
    );
  }
}

export default DeleteRoleCommand;
