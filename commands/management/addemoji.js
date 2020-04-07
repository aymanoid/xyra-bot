import { Command, Argument } from 'discord-akairo';
import axios from 'axios';
import path from 'path';
import { EMOJIS } from '../../util/Constants';
import CommandHelp from '../../util/CommandHelp';

class AddEmojiCommand extends Command {
  constructor() {
    super('addemoji', {
      aliases: ['addemoji', 'addemote'],
      description: {
        content: 'Adds an emoji to the server.',
        usage: '<emoji | url | attachment> [name]',
        examples: [
          '<a:MochaBike:652010655704154112>',
          '<:Loli:652015224102060043> Loli',
          'https://i.imgur.com/BRZGbzm.png mk',
        ],
      },
      category: 'management',
      channel: 'guild',
      clientPermissions: ['MANAGE_EMOJIS'],
      userPermissions: ['MANAGE_EMOJIS'],
      args: [
        {
          id: 'emoji',
          type: Argument.union('emojiMentionG', 'url', 'attachment'),
          otherwise: (msg) =>
            CommandHelp(msg.util.parsed.command, msg, this.client.user),
        },
        {
          id: 'name',
          type: 'string',
        },
      ],
    });
  }

  async exec(msg, args) {
    let emojiURL;
    let emojiName;
    if (args.emoji.valid || args.emoji.href || args.emoji.url) {
      if (args.name && !args.name.match(/^[a-z0-9_]{2,32}$/i))
        return msg.channel.send(
          `${EMOJIS.ERROR} Emoji name must be between 2 and 32 characters long, and can only contain alphanumeric characters and underscores.`
        );

      emojiURL = args.emoji.valid
        ? args.emoji.url
        : args.emoji.href || args.emoji.url;
      const imageInfo = await axios({
        url: emojiURL,
        method: 'HEAD',
      });
      if (
        !imageInfo.headers['content-type'].match(
          /image\/jpg|image\/jpeg|image\/png|image\/gif/
        )
      )
        return msg.channel.send(
          `${EMOJIS.ERROR} Emoji must be in type jpg, jpeg, png, or gif.`
        );
      if (imageInfo.headers['content-length'] >= 256000)
        return msg.channel.send(
          `${EMOJIS.ERROR} Emoji image must be under 256kb in size.`
        );
      let filename = path.parse(emojiURL).name;
      filename = filename.match(/^[a-z0-9_]{2,32}$/i) ? filename : 'emoji';
      emojiName = args.name || (args.emoji.valid ? args.emoji.name : filename);

      const finalMsg = await msg.channel.send(
        `${EMOJIS.LOADING} Adding the emoji, please wait...`
      );

      let emoji;
      try {
        emoji = await msg.guild.emojis.create(emojiURL, emojiName);
      } catch (err) {
        msg.channel.send(
          `${EMOJIS.ERROR} There was an error adding the emoji.`
        );
        throw err;
      }

      return finalMsg.edit(
        `${
          EMOJIS.SUCCESS
        } \`${emojiName}\` emoji has been added. ${emoji.toString()}`
      );
    }
    return msg.channel.send(
      `${EMOJIS.ERROR} The provided emoji/url seems invalid.`
    );
  }
}

export default AddEmojiCommand;
