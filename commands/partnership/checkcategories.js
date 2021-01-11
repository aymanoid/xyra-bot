/* eslint-disable no-await-in-loop */
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { EMOJIS } from '../../util/Constants';

class CheckCategoriesCommand extends Command {
  constructor() {
    super('checkcategories', {
      aliases: ['checkcategories', 'checkcategory', 'checkinvites'],
      description: {
        content: 'Checks categories.',
      },
      category: 'partnership',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async exec(msg) {
    const categoryIds = this.client.settings.get(msg.guild, 'categoryIds', []);
    if (!categoryIds.length) {
      return msg.channel.send(`${EMOJIS.ERROR} No categories to check.`);
    }
    const start = new Date().getTime();

    const embedColor = msg.guild.me.displayColor;

    const checkEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(
        `${EMOJIS.INFO} ${this.client.user.username} is currently checking all the invite links within your categories, please wait...`
      );
    const startMsg = await msg.channel.send(checkEmbed);

    let categoryCount = 0;
    let channelCount = 0;

    for (let i = 0; i < categoryIds.length; i += 1) {
      const categoryChannel = await msg.guild.channels.cache.get(
        categoryIds[i].trim()
      );
      if (categoryChannel && categoryChannel.type === 'category') {
        const checkInfo = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const textChannel of categoryChannel.children.filter(
          (e) => e.type === 'text'
        )) {
          const channelMention = textChannel[1].toString();
          const latestMessages = await textChannel[1].messages.fetch({
            limit: 10,
          });
          const messagesText = latestMessages.map((m) => m.content).join('');
          const inviteLinks = messagesText.match(
            /(https?:\/\/)?(www\.)?(discord\.(gg)|discordapp\.com\/invite)\/.+[a-zA-Z0-9]/g
          );

          const inviteCount = inviteLinks.length;
          let validCount = 0;
          let memberCount = 0;

          for (let a = 0; a < inviteLinks.length; a += 1) {
            let inv;
            try {
              inv = await this.client.fetchInvite(inviteLinks[a]);
            } catch {
              // eslint-disable-next-line no-continue
              continue;
            }
            validCount += 1;
            memberCount = inv.memberCount;
          }

          checkInfo.push(
            `${
              validCount === inviteCount ? EMOJIS.OK : EMOJIS.CANCEL
            } ${channelMention} | ${validCount}/${inviteCount} ${
              validCount === inviteCount ? 'good' : 'bad'
            } \`${memberCount} members\``
          );

          channelCount += 1;
        }

        const categoryEmbed = new MessageEmbed()
          .setColor(embedColor)
          .setTitle(`The ${categoryChannel.name} category`)
          .setDescription(checkInfo.join('\n'));

        await msg.channel.send(categoryEmbed);
      }

      categoryCount += 1;
    }

    const end = new Date().getTime();
    const time = end - start;

    const doneEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(
        `${EMOJIS.CHECKED} ${
          this.client.user.username
        } has finished checking the invite links in ${channelCount} ${
          channelCount > 1 ? 'channels' : 'channel'
        } from ${categoryCount} ${
          categoryCount > 1 ? 'categories' : 'category'
        }. (took ${time / 1000}s)`
      );

    return startMsg.edit(doneEmbed);
  }
}

export default CheckCategoriesCommand;
