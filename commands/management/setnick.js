import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class SetNickCommand extends Command {
  constructor() {
    super('setnick', {
      aliases: ['setnick'],
      description: {
        content: 'Changes the nickname of a member.',
        usage: '[member] [new nickname]',
      },
      category: 'management',
      channel: 'guild',
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      cooldown: 5000,
      args: [
        {
          id: 'member',
          type: 'member',
        },
        {
          id: 'nick',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.member)
      return msg.channel.send(`${EMOJIS.ERROR} No valid member was provided.`);
    if (!args.nick)
      return msg.channel.send(
        `${EMOJIS.ERROR} No valid nickname was provided.`
      );

    const trgMember = args.member;
    const trgNick = args.nick;

    if (!trgMember.manageable)
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like **\`${trgMember.user.tag}\`** has higher roles than mine.`
      );

    if (!msg.member.canManage(trgMember))
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like **\`${trgMember.user.tag}\`** has higher roles than yours.`
      );

    let editedMember;
    try {
      editedMember = await trgMember.setNickname(trgNick);
    } catch (err) {
      msg.channel.send(`${EMOJIS.ERROR} There was an error editing the role.`);
      throw err;
    }

    return msg.channel.send(
      `${EMOJIS.SUCCESS} \`${editedMember.user.tag}\`'s nickname has been changed to \`${editedMember.nickname}\`.`
    );
  }
}

export default SetNickCommand;
