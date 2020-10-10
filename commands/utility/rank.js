import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import cheerio from 'cheerio';
import { EMOJIS } from '../../util/Constants';

class RankCommand extends Command {
  constructor() {
    super('rank', {
      aliases: ['rank'],
      description: {
        content: 'Displays your rank in the Enguage bot.',
        usage: '[member]',
      },
      category: 'utility',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'member',
          match: 'content',
          type: 'member',
          default: (msg) => msg.member,
        },
      ],
    });
  }

  async exec(msg, args) {
    const currGuild = msg.channel.guild;
    const embedColor = msg.guild.me.displayColor;
    const trgMember = args.member;

    const expToLevel = (exp) => {
      let lvl = 1;
      let nextExp = 0;
      let totalExp = exp;

      while (totalExp > 0) {
        const rexp = 100 + 20 * (lvl - 1);
        nextExp = rexp;
        if (totalExp - rexp < 0) break;
        lvl += 1;
        totalExp -= rexp;
      }

      return { lvl, nextExp, totalExp };
    };

    const avatarURL = trgMember.user.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    const profileURL = `https://engau.ge/user/${trgMember.id}/server/${currGuild.id}`;
    const leaderboardURL = `https://engau.ge/server/${currGuild.id}/leaderboard`;
    let result;
    try {
      result = await axios.get(profileURL);
    } catch {
      return msg.channel.send(
        `${EMOJIS.ERROR} Either this user is not ranked yet or there's a problem with Engauge's server.`
      );
    }
    const $ = cheerio.load(result.data);

    const messagesSent = parseInt(
      $('h2:contains("Messages sent")').siblings('p').text().replace(/,/g, ''),
      10
    ).toLocaleString();
    const voiceMinutes = parseInt(
      $('h2:contains("Voice minutes")').siblings('p').text().replace(/,/g, ''),
      10
    ).toLocaleString();
    const totalXP = parseInt(
      $('h2:contains("Total XP")').siblings('p').text().replace(/,/g, ''),
      10
    );

    let { lvl, nextExp, totalExp } = expToLevel(totalXP);
    lvl = lvl.toLocaleString();
    nextExp = nextExp.toLocaleString();
    totalExp = totalExp.toLocaleString();

    const rankEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setAuthor(trgMember.user.tag, avatarURL)
      .setTitle(`${trgMember.displayName}'s stats`)
      .setDescription(
        `You can view the [leaderboard](${leaderboardURL}) or [your profile](${profileURL})!`
      )
      .setThumbnail(avatarURL)
      .addField(
        'Stats',
        `**${messagesSent}** messages\n**${voiceMinutes}** voice minutes`,
        true
      )
      .addField(
        'Experience',
        `Level **${lvl}**\n**${totalExp}**/${nextExp} XP`,
        true
      )
      .setTimestamp();

    return msg.channel.send(rankEmbed);
  }
}

export default RankCommand;
