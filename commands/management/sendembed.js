import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class SendEmbedCommand extends Command {
  constructor() {
    super('sendembed', {
      aliases: ['sendembed'],
      description: {
        content: 'Sends an embed from a JSON file to a channel',
        usage: '<url | attachment> [channel]',
        examples: ['(link) #announcements'],
      },
      category: 'management',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'MANAGE_GUILD'],
      userPermissions: ['EMBED_LINKS', 'MANAGE_GUILD'],
      cooldown: 7000,
      args: [
        {
          id: 'embed',
          type: Argument.union('url', 'attachment'),
          otherwise: (msg) =>
            CommandHelp(msg.util.parsed.command, msg, this.client.user),
        },
        {
          id: 'channel',
          type: 'channel',
        },
      ],
    });
  }

  async exec(msg, args) {
    const embedURL = args.embed.url || args.embed.href || args.embed;
    const trgChannel = args.channel || msg.channel;
    const embedInfo = await axios({
      url: embedURL,
      method: 'HEAD',
    });

    if (!embedInfo.headers['content-type'].includes('text/plain'))
      return msg.channel.send(`${EMOJIS.ERROR} The file must be a text file.`);

    if (embedInfo.headers['content-length'] >= 256000)
      return msg.channel.send(
        `${EMOJIS.ERROR} The file must be under 256kb in size.`
      );

    const embedData = (await axios(embedURL)).data;

    const embed = new MessageEmbed(embedData);

    if (!embed.length)
      return msg.channel.send(
        `${EMOJIS.ERROR} The file doesn't have a valid embed JSON.`
      );

    return trgChannel.send(embed);
  }
}

export default SendEmbedCommand;
