import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class ForceUnbanCommand extends Command {
  constructor() {
    super('forceunban', {
      aliases: ['forceunban', 'funban'],
      description: {
        content: 'Unforce bans a member.',
        usage: '<user> [reason]',
      },
      category: 'moderation',
      channel: 'guild',
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'memberOrGlobalUser',
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
      let forceBanned = await this.client.settings.get(
        msg.guild.id,
        'forceBanned',
        []
      );
      forceBanned = forceBanned.filter((m) => m.id !== args.member.id);
      await this.client.settings.set(msg.guild.id, 'forceBanned', forceBanned);
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

export default ForceUnbanCommand;
