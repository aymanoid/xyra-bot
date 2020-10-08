import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { EMOJIS } from '../../util/Constants';

class OpinionCommand extends Command {
  constructor() {
    super('opinion', {
      aliases: ['opinion'],
      description: {
        content: 'Ask me a question.',
        examples: ['am I ugly? (yes u are)'],
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
    const botColor = msg.guild.me.displayColor;

    const randomItem = (items) => {
      return items[Math.floor(Math.random() * items.length)];
    };

    const positive = [
      'Absolutely',
      'Of course',
      'Obviously!',
      'My favourite',
      'Exceptional',
      'A luxury',
      'I love it!',
    ];
    const neutral = [
      'Mayhaps',
      'Maybe',
      'Not telling you...',
      'Yea no',
      'idk sksksk',
    ];
    const negative = [
      'Absolutely not!',
      'Hideous!',
      'I hate it',
      'I disagree',
      'Disgusts me',
      "It's not the greatest",
      'But on the other hand-',
    ];

    if (!args.text)
      return msg.channel.send(`${EMOJIS.ERROR} You have to ask something.`);

    const result = randomItem(randomItem([positive, neutral, negative]));

    const opinionEmbed = new MessageEmbed()
      .setColor(botColor)
      .setTitle(`Question: ${args.text}`)
      .setDescription(`**Answer: ${result}**`);

    return msg.channel.send(opinionEmbed);
  }
}

export default OpinionCommand;
