import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

class DuckCommand extends Command {
  constructor() {
    super('duck', {
      aliases: ['duck', 'ducc'],
      description: {
        content: 'Posts a random image of a duck.',
      },
      category: 'animals',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const botColor = msg.guild.me.displayColor;
    const avatarURL = msg.author.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    let imageURL;
    const sources = [0, 1];
    const sourceNum = sources[Math.floor(Math.random() * sources.length)];
    switch (sourceNum) {
      case 0:
        imageURL = (await axios.get('https://random-d.uk/api/v1/random')).data
          .url;
        break;
      case 1:
        imageURL = (
          await axios.get('https://random-d.uk/api/v1/random?type=gif')
        ).data.url;
        break;
      default:
        imageURL = 'https://i.imgur.com/suBBQf8.png';
    }

    const imageEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setTitle('Quack quack 🦆')
      .setImage(imageURL)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default DuckCommand;
