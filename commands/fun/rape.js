import { Command } from 'discord-akairo';

class RapeCommand extends Command {
  constructor() {
    super('rape', {
      aliases: ['rape'],
      description: {
        content: 'An actual useless command (tag a person to rape).',
      },
      category: 'fun',
      args: [
        {
          id: 'member',
          match: 'content',
          type: 'member',
        },
      ],
    });
  }

  async exec(msg, args) {
    const trgMember = args.member;

    return msg.channel.send(
      `*${msg.member.toString()} rapes ${trgMember.toString()}*`
    );
  }
}

export default RapeCommand;
