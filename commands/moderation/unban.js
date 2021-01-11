import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class UnbanCommand extends Command {
  constructor() {
    super('unban', {
      aliases: ['unban'],
      description: {
        content: 'Unbans a member from the server.',
        usage: '<user> [reason]',
      },
      category: 'moderation',
      channel: 'guild',
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'userMentionG',
          otherwise: (msg) =>
            CommandHelp(msg.util.parsed.command, msg, this.client.user),
        },
        {
          id: 'reason',
          match: 'rest',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.member)
      return msg.channel.send(
        `${EMOJIS.ERROR} That doesn't seem like a valid user ID or mention.`
      );

    const reason = args.reason || 'No reason provided.';

    let unbannedUser;
    try {
      unbannedUser = await msg.guild.members.unban(args.member, reason);
    } catch {
      return msg.channel.send(
        `${EMOJIS.ERROR} There was an error unbanning the user.`
      );
    }

    return msg.channel.send(
      `${EMOJIS.CHECKED} **\`${unbannedUser.tag}\` has been unbanned \`|\`** ${reason}`
    );
  }
}

export default UnbanCommand;
