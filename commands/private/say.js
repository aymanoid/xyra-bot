import { Command } from 'discord-akairo';

class SayCommand extends Command {
  constructor() {
    super('say', {
      aliases: ['say'],
      description: {
        content: 'Returns the given text.',
        usage: '[text]',
      },
      category: 'Private',
      ownerOnly: true,
      quoted: false,
      args: [
        {
          id: 'text',
          match: 'content',
        },
      ],
    });
  }

  async exec(msg, args) {
    return msg.channel.send(args.text);
  }
}

export default SayCommand;
