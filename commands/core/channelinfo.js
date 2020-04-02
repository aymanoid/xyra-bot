import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import numeral from 'numeral';

class ChannelInfoCommand extends Command {
  constructor() {
    super('channelinfo', {
      aliases: ['channelinfo', 'cinfo'],
      description: {
        content: 'Gets information about a channel.',
        usage: '[channel]',
      },
      category: 'Core',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'channel',
          match: 'content',
          type: 'channel',
          default: (msg) => msg.channel,
        },
      ],
    });
  }

  async exec(msg, args) {
    const currGuild = msg.guild;
    const botColor = currGuild.me.displayColor;
    const trgChannel = args.channel;

    const channelCategory = trgChannel.parent ? trgChannel.parent.name : 'None';

    const channelBitrate =
      trgChannel.type === 'voice'
        ? `${numeral(trgChannel.bitrate).format('0a')}bps`
        : null;

    const channelUserLimit =
      trgChannel.type === 'voice' ? trgChannel.userLimit || 'Unlimited' : null;

    const channelType = {
      dm: 'Direct Message Channel',
      text: 'Text Channel',
      voice: 'Voice Channel',
      category: 'Category',
      news: 'News Channel',
      store: 'Store Channel',
    }[trgChannel.type];

    const channelInfoEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setTitle(trgChannel.name)
      .addField('ID', trgChannel.id, true)
      .addField('Mention', `\`${trgChannel.toString()}\``, true);
    if (channelBitrate)
      channelInfoEmbed.addField('Bitrate', channelBitrate, true);
    else channelInfoEmbed.addField('\u200B', '\u200B', true);
    channelInfoEmbed
      .addField('Category', channelCategory, true)
      .addField('Type', channelType, true);
    if (channelUserLimit)
      channelInfoEmbed.addField('User Limit', channelUserLimit, true);
    else channelInfoEmbed.addField('\u200B', '\u200B', true);
    channelInfoEmbed.setFooter(
      `Channel Created On: ${moment(trgChannel.createdAt).format('llll z')}`
    );

    if (trgChannel.topic) channelInfoEmbed.setDescription(trgChannel.topic);

    return msg.channel.send(channelInfoEmbed);
  }
}

export default ChannelInfoCommand;
