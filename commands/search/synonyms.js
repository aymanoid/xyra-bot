import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';
import TheSaurus from '../../util/TheSaurus';
import { EMOJIS } from '../../util/Constants';

class SynonymsCommand extends Command {
  constructor() {
    super('synonyms', {
      aliases: ['synonyms', 'synonym', 'synos', 'syno'],
      description: {
        content: 'Looks up for synonyms of a word.',
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

    let { synonyms } = await TheSaurus(args.word);
    if (!synonyms.length)
      return msg.channel.send(
        `${EMOJIS.ERROR} No synonyms found for that word.`
      );

    synonyms = _.truncate(synonyms.join(', '), {
      length: 2048,
      separator: /,? +/,
      omission: ' [...]',
    });

    const synonymsEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle(`Synonyms for ${args.word}`)
      .setDescription(synonyms)
      .setFooter('Synonyms are sorted by relevancy.');

    return msg.channel.send(synonymsEmbed);
  }
}

export default SynonymsCommand;
