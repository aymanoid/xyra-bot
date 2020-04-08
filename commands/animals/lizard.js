import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class LizardCommand extends Command {
  constructor() {
    super('lizard', {
      aliases: ['lizard', 'geko'],
      description: {
        content: 'Posts a random image of a lizard.',
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
        imageURL = (await new NekosLife().sfw.lizard()).url;
        break;
      default:
        imageURL = 'https://i.imgur.com/suBBQf8.png';
    }

    const imageEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Geko 🦎')
      .setImage(imageURL)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default LizardCommand;
