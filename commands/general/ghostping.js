import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class GhostPingCommand extends Command {
  constructor() {
    super('ghostping', {
      aliases: ['ghostping'],
      description: {
        content: 'Adds or removes a channel for ghost ping.',
        usage: '[channel]',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channel',
          match: 'content',
          type: 'channel',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.channel)
      return msg.channel.send(`${EMOJIS.ERROR} No valid channel was provided.`);

    const ghostPingChannels = await this.client.settings.get(
      msg.guild,
      'ghostPingChannels',
      []
    );

    if (ghostPingChannels.includes(args.channel.id)) {
      const index = ghostPingChannels.indexOf(args.channel.id);
      if (index > -1) {
        ghostPingChannels.splice(index, 1);
      }
      await this.client.settings.set(
        msg.guild,
        'ghostPingChannels',
        ghostPingChannels
      );
      return msg.channel.send(
        `${
          EMOJIS.CHECKED
        } ${args.channel.toString()} has been removed as a ghost ping channel.`
      );
    }

    ghostPingChannels.push(args.channel.id);
    await this.client.settings.set(
      msg.guild,
      'ghostPingChannels',
      ghostPingChannels
    );
    return msg.channel.send(
      `${
        EMOJIS.CHECKED
      } ${args.channel.toString()} has been added as a ghost ping channel.`
    );
  }
}

export default GhostPingCommand;
