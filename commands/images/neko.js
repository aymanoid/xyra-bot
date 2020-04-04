import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import NekosLife from 'nekos.life';

class NekoCommand extends Command {
  constructor() {
    super('neko', {
      aliases: ['neko', 'catgirl'],
      description: {
        content: 'Posts a random image of a catgirl.',
      },
      category: 'images',
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

    const nekosClient = new NekosLife();
    const imageURL = (await nekosClient.sfw.neko()).url;

    const imageEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setTitle('Nyaa')
      .setImage(imageURL)
      .setFooter(msg.author.tag, avatarURL);

    return msg.channel.send(imageEmbed);
  }
}

export default NekoCommand;
