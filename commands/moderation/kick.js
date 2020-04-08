import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick'],
      description: {
        content: 'Kicks a member from the server.',
        usage: '<member> [reason]',
        examples: ["@Clyde can't see the leave button"],
      },
      category: 'moderation',
      channel: 'guild',
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'member',
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

    const reason = args.reason || 'No reason provided.';
    const trgMember = args.member;

    if (!trgMember.kickable)
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like **\`${trgMember.user.tag}\`** has higher roles than mine.`
      );

    if (!msg.member.canKick(trgMember))
      return msg.channel.send(
        `${EMOJIS.ERROR} It seems like **\`${trgMember.user.tag}\`** has higher roles than yours.`
      );

    try {
      await trgMember.send(
        `${EMOJIS.INFO} You have been kicked from **\`${msg.guild.name}\`** | ${reason}`
      );
    } catch (err) {
      if (err.code !== 50007) throw err;
    }

    let kickedMember;
    try {
      kickedMember = await trgMember.kick({
        reason,
      });
    } catch (err) {
      msg.channel.send(`${EMOJIS.ERROR} There was an error kicking the user.`);
      throw err;
    }
    return msg.channel.send(
      `${EMOJIS.SUCCESS} **\`${kickedMember.user.tag}\` has been kicked \`|\`** ${reason}`
    );
  }
}

export default KickCommand;
