import { Command } from 'discord-akairo';
import { MessageEmbed, Util } from 'discord.js';
import { getVideoMeta } from 'tiktok-scraper';
import moment from 'moment';
import { EMOJIS } from '../../util/Constants';

class TikTokVideoCommand extends Command {
  constructor() {
    super('tiktokvideo', {
      aliases: ['tiktokvideo', 'ttv'],
      description: {
        content:
          'Gets video meta info, including video url without the watermark.',
        usage: '[video url]',
      },
      category: 'search',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      cooldown: 5000,
      args: [
        {
          id: 'query',
          type: 'url',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.query)
      return msg.channel.send(`${EMOJIS.ERROR} No valid input was provided.`);

    let videoMeta;
    try {
      videoMeta = await getVideoMeta(args.query);
    } catch (error) {
      return msg.channel.send(
        `${EMOJIS.ERROR} The provided link doesn't seem like a valid TikTok Video link.`
      );
    }

    /* const userProfileInfo = await getUserProfileInfo(
      videoMeta.authorMeta.name
    );

    const title = userProfileInfo.nickName
      ? `${userProfileInfo.nickName} (@${userProfileInfo.uniqueId})`
      : `@${userProfileInfo.uniqueId}`;
    const profileURL = `https://www.tiktok.com/@${userProfileInfo.uniqueId}`;
    const profilePicURL = userProfileInfo.coversMedium[0]; */

    const username = videoMeta.authorMeta.name;
    const videoTitle = videoMeta.text;
    const videoThumb = videoMeta.imageUrl;
    const createdOn = moment.unix(videoMeta.createTime).format('lll z');
    const { musicName } = videoMeta.musicMeta;
    const { musicAuthor } = videoMeta.musicMeta;
    const playCount = videoMeta.playCount.toLocaleString();
    const { videoUrl } = videoMeta;
    const { videoUrlNoWaterMark } = videoMeta;
    const likeCount = videoMeta.diggCount.toLocaleString();
    const commentCount = videoMeta.commentCount.toLocaleString();
    const shareCount = videoMeta.shareCount.toLocaleString();

    const tiktokVideoEmbed = new MessageEmbed()
      .setColor('#010101')
      .setAuthor(`@${username}`, null, `https://www.tiktok.com/@${username}`)
      .setDescription(Util.escapeMarkdown(videoTitle))
      .setThumbnail(videoThumb)
      .addField('Created On', createdOn, true)
      .addField('Music Name', musicName, true)
      .addField('Music Author', musicAuthor, true)
      .addField('Play Count', playCount, true)
      .addField('Video', `[URL](${videoUrl})`, true)
      .addField('Video No Watermark', `[URL](${videoUrlNoWaterMark})`, true)
      .addField('Like Count', likeCount, true)
      .addField('Comment Count', commentCount, true)
      .addField('Share Count', shareCount, true)
      .setFooter('TikTok', 'https://logo.clearbit.com/tiktok.com');

    return msg.channel.send(tiktokVideoEmbed);
  }
}

export default TikTokVideoCommand;
