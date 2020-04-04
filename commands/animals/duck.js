import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

class DuckCommand extends Command {
  constructor() {
    super('duck', {
      aliases: ['duck', 'ducc'],
      description: {
        content: 'Posts a random image/gif of a duck.',
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

    const sources = [
      'https://random-d.uk/api/v1/random',
      'https://random-d.uk/api/v1/random?type=gif',
    ];

    const { url } = (
      await axios.get(sources[Math.floor(Math.random() * sources.length)])
    ).data;

    const imageEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setTitle('Quack quack 🦆')
      .setImage(url)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default DuckCommand;
