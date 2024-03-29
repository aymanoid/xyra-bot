import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { EMOJIS } from '../../util/Constants';

class EmojiCommand extends Command {
  constructor() {
    super('emoji', {
      aliases: ['emoji', 'emote', 'enlarge'],
      description: {
        content: 'Enlarges an emoji.',
        usage: '<emoji>',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'emoji',
          type: Argument.union('emoji', 'emojiMentionG'),
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.emoji || (args.emoji.custom && !args.emoji.valid))
      return msg.channel.send(`${EMOJIS.ERROR} No valid emoji was provided.`);

    const embedColor = msg.guild.me.displayColor;

    const trgEmoji = args.emoji;

    const emojiEmbed = new MessageEmbed()
      .setColor(embedColor)
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
