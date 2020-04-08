import { Command, Argument } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class SoftbanCommand extends Command {
  constructor() {
    super('softban', {
      aliases: ['softban'],
      description: {
        content: 'Softbans a member from the server.',
        usage: '<member> [reason]',
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
          `${EMOJIS.INFO} You have been softbanned from **\`${msg.guild.name}\`** | ${reason}`
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
        await msg.guild.members.unban(bannedMember.id, reason);
      } catch (err) {
        msg.channel.send(
          `${EMOJIS.ERROR} There was an error softbanning the user.`
        );
        throw err;
      }
      return msg.channel.send(
        `${EMOJIS.SUCCESS} **\`${bannedMember.user.tag}\` has been softbanned \`|\`** ${reason}`
      );
    }
    try {
      await msg.guild.members.ban(args.member, {
        days: deleteMessageDays,
        reason,
      });
      await msg.guild.members.unban(args.member, reason);
    } catch (err) {
      msg.channel.send(
        `${EMOJIS.ERROR} There was an error softbanning the user.`
      );
      throw err;
    }

    const bannedUser = (await msg.guild.fetchBan(args.member)).user;
    return msg.channel.send(
      `${EMOJIS.SUCCESS} **\`${bannedUser.tag}\` has been softbanned \`|\`** ${reason}`
    );
  }
}

export default SoftbanCommand;
