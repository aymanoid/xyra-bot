import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class EightBallCommand extends Command {
  constructor() {
    super('eightball', {
      aliases: ['eightball', '8ball', 'magic8ball'],
      description: {
        content: 'Ask the Magic 8-Ball a question.',
        examples: ['am I ugly? (yes u are)'],
      },
      category: 'fun',
      args: [
        {
          id: 'text',
        },
      ],
    });
  }

  async exec(msg, args) {
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const answers = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes – definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
    ];

    if (!args.text)
      return msg.channel.send(`${EMOJIS.ERROR} You have to ask something.`);

    const result = answers[Math.floor(Math.random() * answers.length)];

    const sent = await msg.channel.send(':8ball: | Shaking the ball...');
    await sleep(2000);
    return sent.edit(`:8ball: | ${result}`);
  }
}

export default EightBallCommand;
