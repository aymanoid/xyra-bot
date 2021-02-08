import { Command, Argument } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class AnnounceChannelCommand extends Command {
  constructor() {
    super('announcechannel', {
      aliases: ['announcechannel', 'ac'],
      description: {
        content: 'Edit the announce channel for joins.',
        usage: '<channel>',
        examples: ['#Welcome', 'remove'],
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channelOrRemove',
          match: 'content',
          type: Argument.union(['remove'], 'channel'),
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.channelOrRemove)
      return msg.channel.send(`${EMOJIS.ERROR} No valid channel was provided.`);

    if (args.channelOrRemove === 'remove') {
      await this.client.settings.delete(msg.guild.id, 'announceChannel');
      return msg.channel.send(
        `${EMOJIS.CHECKED} The announce channel has been removed.`
      );
    }

    await this.client.settings.set(
      msg.guild.id,
      'announceChannel',
      args.channelOrRemove.id
    );
    return msg.channel.send(
      `${
        EMOJIS.CHECKED
      } ${args.channelOrRemove.toString()} has been set as the announce channel.`
    );
  }
}

export default AnnounceChannelCommand;
