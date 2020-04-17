import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class InviteCommand extends Command {
  constructor() {
    super('invite', {
      aliases: ['invite'],
      description: {
        content: 'Gives you an invite link for the bot.',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const embedColor = msg.guild.me.displayColor;

    const inviteEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(
        "Here's the invite link: [xyra.io/invite](https://xyra.io/invite)"
      );

    return msg.channel.send(inviteEmbed);
  }
}

export default InviteCommand;
