import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

class CatCommand extends Command {
  constructor() {
    super('cat', {
      aliases: ['cat', 'kitty', 'kitten', 'meow'],
      description: {
        content: 'Posts a random image of a cat.',
      },
      category: 'animals',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const embedColor = msg.guild.me.displayColor;
    const avatarURL = msg.author.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    let imageURL;
    const sources = [0];
    const sourceNum = sources[Math.floor(Math.random() * sources.length)];
    switch (sourceNum) {
      case 0:
        imageURL = (await axios.get('https://aws.random.cat/meow')).data.file;
        break;
      default:
        imageURL = 'https://i.imgur.com/suBBQf8.png';
    }

    const imageEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Meow 🐱')
      .setImage(imageURL)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default CatCommand;
