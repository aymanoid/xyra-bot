import { Command } from 'discord-akairo';
import owo from '@zuzak/owo';

class OwOifyCommand extends Command {
  constructor() {
    super('owoify', {
      aliases: ['owoify'],
      description: {
        content:
          'OwOifies the given text, or the message above yours if no text was given.',
        usage: '[text]',
      },
      category: 'fun',
      args: [
        {
          id: 'text',
          match: 'content',
        },
      ],
    });
  }

  async exec(msg, args) {
    let text;
    let author;

    if (!args.text) {
      const msgs = await msg.channel.messages.fetch(
        {
          limit: 1,
          before: msg.id,
        },
        false
      );
      if (!msgs || !msgs[0] || !msgs[0].content)
        return msg.channel.send(`There is no message before yours.`);
      text = msgs[0].content;
      author = msgs[0].member.displayName;
    } else {
      text = args.text;
    }

    text = owo(text);

    if (author) text = `**\`${author}:\`** ${text}`;

    return msg.channel.send(text);
  }
}

export default OwOifyCommand;
