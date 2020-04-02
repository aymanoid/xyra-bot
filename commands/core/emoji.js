import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class EmojiCommand extends Command {
  constructor() {
    super('emoji', {
      aliases: ['emoji', 'enlarge'],
      description: {
        content: 'Enlarges an emoji.',
        usage: '[emoji]',
      },
      category: 'Core',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'emoji',
          type: Argument.union('emoji', 'emojiThingy'),
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.emoji || (args.emoji.custom && !args.emoji.valid))
      return msg.channel.send('No valid emoji was provided.');

    const botColor = msg.guild.me.displayColor;
    const trgEmoji = args.emoji;

    const emojiEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setTitle(trgEmoji.name)
      .setURL(trgEmoji.url)
      .setImage(trgEmoji.url);

    let emojiAuthor;
    if (trgEmoji.guild) emojiAuthor = await trgEmoji.fetchAuthor();
    if (emojiAuthor) emojiEmbed.setFooter(`Added by: ${emojiAuthor.tag}`);

    return msg.channel.send(emojiEmbed);
  }
}

export default EmojiCommand;
