import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class ShowCategoriesCommand extends Command {
  constructor() {
    super('showcategories', {
      aliases: ['showcategories', 'showcategory'],
      description: {
        content: 'Shows categories.',
      },
      category: 'partnership',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async exec(msg) {
    const embedColor = msg.guild.me.displayColor;

    const categoryIds = this.client.settings.get(msg.guild, 'categoryIds', []);
    const categoryNames = [];

    for (let i = 0; i < categoryIds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const categoryChannel = await msg.guild.channels.cache.get(
        categoryIds[i].trim()
      );
      if (categoryChannel && categoryChannel.type === 'category') {
        categoryNames.push(categoryChannel.name);
      }
    }

    const categoriesEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Currently added categories:')
      .setDescription(
        categoryNames.length ? categoryNames.join('\n') : 'None.'
      );

    return msg.channel.send(categoriesEmbed);
  }
}

export default ShowCategoriesCommand;
