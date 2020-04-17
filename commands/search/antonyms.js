import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';
import TheSaurus from '../../util/TheSaurus';
import { EMOJIS } from '../../util/Constants';

class AntonymsCommand extends Command {
  constructor() {
    super('antonyms', {
      aliases: ['antonyms', 'antonym', 'antos', 'anto'],
      description: {
        content: 'Looks up for antonyms of a word.',
        usage: '[word]',
      },
      category: 'search',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'word',
          match: 'content',
        },
      ],
    });
  }

  async exec(msg, args) {
    const embedColor = msg.guild.me.displayColor;
    if (!args.word)
      return msg.channel.send(`${EMOJIS.ERROR} No word was provided.`);

    let { antonyms } = await TheSaurus(args.word);
    if (!antonyms.length)
      return msg.channel.send(
        `${EMOJIS.ERROR} No antonyms found for that word.`
      );

    antonyms = _.truncate(antonyms.join(', '), {
      length: 2048,
      separator: /,? +/,
      omission: ' [...]',
    });

    const antonymsEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle(`Antonyms for ${args.word}`)
      .setDescription(antonyms)
      .setFooter('Antonyms are sorted by relevancy.');

    return msg.channel.send(antonymsEmbed);
  }
}

export default AntonymsCommand;
