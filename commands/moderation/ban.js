import { Command, Argument } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban'],
      description: {
        content: 'Bans a member from the server.',
        usage: '<member> [reason]',
        examples: ['@Clyde deserved'],
      },
      category: 'moderation',
      channel: 'guild',
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'member',
          type: Argument.union('member', 'userMentionG'),
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
      return msg.channel.send(`${EMOJIS.ERROR} I can't find that member.`);

    const deleteMessageDays = 7;
    const reason = args.reason || 'No reason provided.';

    if (args.member.guild) {
      const trgMember = args.member;
      if (!trgMember.bannable)
        return msg.channel.send(
          `${EMOJIS.ERROR} It seems like **\`${trgMember.user.tag}\`** has higher roles than mine.`
        );

      if (!msg.member.canBan(trgMember))
        return msg.channel.send(
          `${EMOJIS.ERROR} It seems like **\`${trgMember.user.tag}\`** has higher roles than yours.`
        );

      try {
        await trgMember.send(
          `${EMOJIS.INFO} You have been banned from **\`${msg.guild.name}\`** | ${reason}`
        );
      } catch (err) {
        if (err.code !== 50007) throw err;
      }

      let bannedMember;
      try {
        bannedMember = await trgMember.ban({
          days: deleteMessageDays,
          reason,
        });
      } catch (err) {
        msg.channel.send(
          `${EMOJIS.ERROR} There was an error banning the user.`
        );
        throw err;
      }
      return msg.channel.send(
        `${EMOJIS.CHECKED} **\`${bannedMember.user.tag}\` has been banned \`|\`** ${reason}`
      );
    }
    try {
      await msg.guild.members.ban(args.member, {
        days: deleteMessageDays,
        reason,
      });
    } catch (err) {
      msg.channel.send(`${EMOJIS.ERROR} There was an error banning the user.`);
      throw err;
    }

    const bannedUser = (await msg.guild.fetchBan(args.member)).user;
    return msg.channel.send(
      `${EMOJIS.CHECKED} **\`${bannedUser.tag}\` has been banned \`|\`** ${reason}`
    );
  }
}

export default BanCommand;
