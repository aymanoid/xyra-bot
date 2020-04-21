import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import { EMOJIS } from '../../util/Constants';

class UrbanCommand extends Command {
  constructor() {
    super('urban', {
      aliases: ['urban'],
      description: {
        content: 'Searchs a word on Urban Dictionnary.',
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

    let req;
    try {
      req = await axios.get(
        `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(
          args.word
        )}`
      );
    } catch (err) {
      return msg.channel.send(`${EMOJIS.ERROR} No definition found.`);
    }

    let data = req.data.list;
    if (!data || !data.length)
      return msg.channel.send(`${EMOJIS.ERROR} No definition found.`);
    [data] = data;

    const urbanEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle(`Urban Definition of ${data.word}`)
      .setURL(data.permalink)
      .setThumbnail('https://i.imgur.com/VFXr0ID.jpg')
      .setDescription(data.definition)
      .addField('Example', data.example)
      .addField('👍', data.thumbs_up, true)
      .addField('👎', data.thumbs_down, true)
      .setFooter(`Sent by ${data.author}`);

    return msg.channel.send(urbanEmbed);
  }
}

export default UrbanCommand;
