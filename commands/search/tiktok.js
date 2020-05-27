import { Command } from 'discord-akairo';
import { MessageEmbed, Util } from 'discord.js';
import { getUserProfileInfo } from 'tiktok-scraper';
import { EMOJIS } from '../../util/Constants';

class TikTokCommand extends Command {
  constructor() {
    super('tiktok', {
      aliases: ['tiktok'],
      description: {
        content: 'Gets info about a TikTok account.',
        usage: '[username]',
      },
      category: 'search',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      cooldown: 5000,
      args: [
        {
          id: 'username',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.username)
      return msg.channel.send(`${EMOJIS.ERROR} No username was provided.`);

    let userProfileInfo;
    try {
      userProfileInfo = await getUserProfileInfo(args.username);
    } catch (error) {
      return msg.channel.send(
        `${EMOJIS.ERROR} No account found with that username.`
      );
    }

    const title = userProfileInfo.nickName
      ? `${userProfileInfo.nickName} (@${userProfileInfo.uniqueId})`
      : `@${userProfileInfo.uniqueId}`;
    const verified = userProfileInfo.verified
      ? ` ${EMOJIS.TIKTOK_VERIFIED}`
      : '';
    const profileURL = `https://www.tiktok.com/@${userProfileInfo.uniqueId}`;
    const { signature } = userProfileInfo;
    const profilePicURL = userProfileInfo.coversMedium[0];
    const videos = userProfileInfo.video.toLocaleString();
    const favorites = userProfileInfo.digg.toLocaleString();
    const privacy = userProfileInfo.isSecret ? 'Private' : 'Public';
    const following = userProfileInfo.following.toLocaleString();
    const followers = userProfileInfo.fans.toLocaleString();
    const likes = Number(userProfileInfo.heart).toLocaleString();
    const accountID = userProfileInfo.userId;

    const tiktokEmbed = new MessageEmbed()
      .setColor('#010101')
      .setTitle(Util.escapeMarkdown(`${title}${verified}`))
      .setURL(profileURL)
      .setDescription(Util.escapeMarkdown(signature))
      .setThumbnail(profilePicURL)
      .addField('Videos', videos, true)
      .addField('Favorites', favorites, true)
      .addField('Privacy', privacy, true)
      .addField('Following', following, true)
      .addField('Followers', followers, true)
      .addField('Likes', likes, true)
      .setFooter(
        `TikTok • ID: ${accountID}`,
        'https://logo.clearbit.com/tiktok.com'
      );

    return msg.channel.send(tiktokEmbed);
  }
}

export default TikTokCommand;
