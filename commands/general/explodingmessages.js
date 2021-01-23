import { Command } from 'discord-akairo';
import parse from 'parse-duration';
import { EMOJIS } from '../../util/Constants';

class ExplodingMessagesCommand extends Command {
  constructor() {
    super('explodingmessages', {
      aliases: ['explodingmessages', 'xm'],
      description: {
        content: 'Adds or removes a channel for exploding messages.',
        usage: '[channel] [duration]',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channel',
          type: 'channel',
        },
        {
          id: 'duration',
          match: 'rest',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.channel && !args.channel.type === 'text')
      return msg.channel.send(
        `${EMOJIS.ERROR} No valid text channel was provided.`
      );

    const duration = [0, '0', 'delete', 'remove'].includes(args.duration)
      ? 0
      : parse(args.duration);

    if (duration !== 0 && !duration)
      return msg.channel.send(
        `${EMOJIS.ERROR} The duration doen't seem valid.`
      );

    const explodingChannels = await this.client.settings.get(
      msg.guild.id,
      'explodingChannels',
      {}
    );

    if (duration === 0) {
      delete explodingChannels[args.channel.id];
      return msg.channel.send(
        `${
          EMOJIS.CHECKED
        } Messages sent in ${args.channel.toString()} will no longer explode.`
      );
    }

    explodingChannels[args.channel.id] = duration;
    await this.client.settings.set(
      msg.guild,
      'explodingChannels',
      explodingChannels
    );

    return msg.channel.send(
      `${
        EMOJIS.CHECKED
      } Messages sent in ${args.channel.toString()} will now be deleted after ${duration}ms.`
    );
  }
}

export default ExplodingMessagesCommand;
