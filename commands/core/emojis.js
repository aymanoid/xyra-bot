import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class EmojisCommand extends Command {
  constructor() {
    super('emojis', {
      aliases: ['emojis', 'emotes'],
      description: {
        content: 'Gets a list of the emotes in a server.',
      },
      category: 'core',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const currGuild = msg.guild;
    const currEmojis = currGuild.emojis.cache.array();
    const embedColor = msg.guild.me.displayColor;

    const iconURL = currGuild.iconURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    const chks = [];
    chks.push('');
    let n = 0;
    for (let i = 0; i < currEmojis.length; i += 1) {
      chks[n] += `${currEmojis[i].toString()} `;
      if (chks[n].length > 2048) {
        chks[n] = chks[n].replace(`${currEmojis[i].toString()} `, '');
        chks.push('');
        n += 1;
        i -= 1;
      }
    }
    const emotesEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setAuthor(currGuild.name, iconURL)
      .setTitle(
        `${currEmojis.filter((e) => !e.animated).length} Static, ${
          currEmojis.filter((e) => e.animated).length
        } Animated`
      )
      .setDescription(chks[0] || 'None');

    msg.channel.send(emotesEmbed);

    if (chks.length > 1) {
      for (let i = 1; i < chks.length; i += 1) {
        const embed = new MessageEmbed()
          .setColor(embedColor)
          .setDescription(chks[i]);
        msg.channel.send(embed);
      }
    }
  }
}

export default EmojisCommand;
