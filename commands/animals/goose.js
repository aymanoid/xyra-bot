import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class GooseCommand extends Command {
  constructor() {
    super('goose', {
      aliases: ['goose'],
      description: {
        content: 'Posts a random image of a goose.',
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
        imageURL = (await new NekosLife().sfw.goose()).url;
        break;
      default:
        imageURL = 'https://i.imgur.com/suBBQf8.png';
    }

    const imageEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Goose <a:goose:699392479236980836>')
      .setImage(imageURL)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default GooseCommand;
