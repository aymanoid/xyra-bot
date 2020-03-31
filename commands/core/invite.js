import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class InviteCommand extends Command {
  constructor() {
    super('invite', {
      aliases: ['invite'],
      description: {
        content: 'Gives you an invite link for the bot.',
      },
      category: 'Core',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const botColor = msg.guild.me.displayColor;

    const inviteEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setDescription(
        "Here's the invite link: [xyra.io/invite](https://xyra.io/invite)"
      );

    return msg.channel.send(inviteEmbed);
  }
}

export default InviteCommand;
