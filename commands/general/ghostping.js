import { Command, Argument } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class GhostPingCommand extends Command {
  constructor() {
    super('ghostping', {
      aliases: ['ghostping'],
      description: {
        content: 'Sets the channel for ghost ping, or disables it.',
        usage: '[channel] | disable',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channel',
          match: 'content',
          type: Argument.union(['disable'], 'channel'),
        },
      ],
    });
  }

  async exec(msg, args) {
    if (args.channel === 'disable') {
      await this.client.settings.set(msg.guild, 'ghostPingChannel', null);
      return msg.channel.send(
        `${EMOJIS.CHECKED}  The ghost ping has been disabled in this server.`
      );
    }
    if (!args.channel)
      return msg.channel.send(`${EMOJIS.ERROR} No valid channel was provided.`);

    await this.client.settings.set(
      msg.guild,
      'ghostPingChannel',
      args.channel.id
    );
    return msg.channel.send(
      `${
        EMOJIS.CHECKED
      } ${args.channel.toString()} has been set as the ghost ping channel.`
    );
  }
}

export default GhostPingCommand;
