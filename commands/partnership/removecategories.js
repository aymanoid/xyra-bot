import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { EMOJIS } from '../../util/Constants';

class RemoveCategoriesCommand extends Command {
  constructor() {
    super('removecategories', {
      aliases: ['removecategories', 'removecategory'],
      description: {
        content: 'Removes categories.',
        usage: '[category IDs (separated with commas)]',
      },
      category: 'partnership',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'categoryIds',
          match: 'content',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.categoryIds) {
      return msg.channel.send(`${EMOJIS.ERROR} No category IDs were provided.`);
    }
    const embedColor = msg.guild.me.displayColor;

    const categoryIds = args.categoryIds.split(',');
    const validCategoryIds = [];
    const validCategoryNames = [];

    for (let i = 0; i < categoryIds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const categoryChannel = await msg.guild.channels.cache.get(
        categoryIds[i].trim()
      );
      if (categoryChannel && categoryChannel.type === 'category') {
        validCategoryIds.push(categoryChannel.id);
        validCategoryNames.push(categoryChannel.name);
      }
    }

    const oldCategoryIds = this.client.settings.get(
      msg.guild,
      'categoryIds',
      []
    );
    const newCategoryIds = oldCategoryIds.filter(
      (e) => !validCategoryIds.includes(e)
    );
    await this.client.settings.set(msg.guild, 'categoryIds', newCategoryIds);

    const categoriesEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle(`${EMOJIS.CHECKED} The following categories have been removed:`)
      .setDescription(validCategoryNames.join('\n'));

    return msg.channel.send(categoriesEmbed);
  }
}

export default RemoveCategoriesCommand;
