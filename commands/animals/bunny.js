import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

class BunnyCommand extends Command {
  constructor() {
    super('bunny', {
      aliases: ['bunny', 'rabbit', 'bunbun'],
      description: {
        content: 'Posts a random image of a bunny.',
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
    const sourceNum = Math.floor(Math.random() * 1);
    switch (sourceNum) {
      case 0:
        imageURL = (
          await axios.get(
            'https://api.bunnies.io/v2/loop/random/?media=gif,png'
          )
        ).data.media.gif;
        break;
      default:
        imageURL = 'https://i.imgur.com/suBBQf8.png';
    }

    const imageEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Bunbun 🐇')
      .setImage(imageURL)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default BunnyCommand;
