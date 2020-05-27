import { Command } from 'discord-akairo';
import { MessageEmbed, Util } from 'discord.js';
import axios from 'axios';
import { EMOJIS } from '../../util/Constants';

class InstagramCommand extends Command {
  constructor() {
    super('instagram', {
      aliases: ['instagram'],
      description: {
        content: 'Gets info about an Instagram account.',
        usage: '[username]',
      },
      category: 'search',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
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

    let response;
    try {
      response = await axios.get(
        `https://www.instagram.com/${args.username}/?__a=1`
      );
    } catch (err) {
      if (err.response.status === 404)
        return msg.channel.send(
          `${EMOJIS.ERROR} No account found with that username.`
        );
      return msg.channel.send(
        `${EMOJIS.ERROR} There was an error finding the account.`
      );
    }

    const { data } = response;
    if (!data)
      return msg.channel.send(
        `${EMOJIS.ERROR} No account found with that username.`
      );

    const fullName = data.graphql.user.full_name;
    const { username } = data.graphql.user;
    const title = fullName ? `${fullName} (@${username})` : `@${username}`;
    const verified = data.graphql.user.is_verified
      ? ` ${EMOJIS.INSTAGRAM_VERIFIED}`
      : '';
    const profileURL = `https://www.instagram.com/${username}/`;
    const profilePicURL = data.graphql.user.profile_pic_url_hd;
    const { biography } = data.graphql.user;
    const externalURL = data.graphql.user.external_url;
    const externalURLText = externalURL
      ? `[${externalURL.replace(/(^\w+:|^)\/\//, '')}](${externalURL})`
      : '';
    const description =
      biography && externalURLText
        ? `${biography}\n${externalURLText}`
        : biography || externalURLText;
    const postsCount = data.graphql.user.edge_owner_to_timeline_media.count.toLocaleString();
    const followersCount = data.graphql.user.edge_followed_by.count.toLocaleString();
    const followingCount = data.graphql.user.edge_follow.count.toLocaleString();
    const privacy = data.graphql.user.is_private ? 'Private' : 'Public';
    const accountID = data.graphql.user.id;

    const instagramEmbed = new MessageEmbed()
      .setColor('#e4405f')
      .setTitle(Util.escapeMarkdown(`${title}${verified}`))
      .setURL(profileURL)
      .setThumbnail(profilePicURL)
      .setDescription(Util.escapeMarkdown(description))
      .addField('Posts', postsCount, true)
      .addField('Followers', followersCount, true)
      .addField('Following', followingCount, true)
      .addField('Privacy', privacy, true)
      .setFooter(
        `Instagram • ID: ${accountID}`,
        'https://logo.clearbit.com/instagram.com'
      );

    return msg.channel.send(instagramEmbed);
  }
}

export default InstagramCommand;
