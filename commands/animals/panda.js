import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

class PandaCommand extends Command {
  constructor() {
    super('panda', {
      aliases: ['panda'],
      description: {
        content: 'Posts a random image of a panda.',
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
        imageURL = (await axios.get('https://some-random-api.ml/img/panda'))
          .data.link;
        break;
      default:
        imageURL = 'https://i.imgur.com/suBBQf8.png';
    }

    const imageEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Panda 🐼')
      .setImage(imageURL)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default PandaCommand;
