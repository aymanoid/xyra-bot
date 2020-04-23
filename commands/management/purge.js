import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class PurgeCommand extends Command {
  constructor() {
    super('purge', {
      aliases: ['purge', 'prune'],
      description: {
        content: 'Deletes a number of messages from the channel. (limit 100)',
        usage: '[count]',
      },
      category: 'management',
      channel: 'guild',
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      cooldown: 5000,
      args: [
        {
          id: 'count',
          type: 'integer',
          otherwise: (msg) =>
            CommandHelp(msg.util.parsed.command, msg, this.client.user),
        },
      ],
    });
  }

  async exec(msg, args) {
    const { count } = args;
    if (!(count >= 1 && count <= 100))
      return msg.channel.send(
        `${EMOJIS.ERROR} Count should be a number between 1 and 100.`
      );

    return msg.channel.bulkDelete(count + 1);
  }
}

export default PurgeCommand;
