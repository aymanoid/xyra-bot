import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import CommandHelp from '../../util/CommandHelp';

class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'commands'],
      description: {
        content: '',
        usage: '[category | command]',
        examples: ['', 'general', 'avatar'],
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'text',
          type: Argument.union('categoryName', 'commandAlias'),
        },
      ],
    });
  }

  async exec(msg, args) {
    let helpEmbed = new MessageEmbed();
    const currPrefix = this.client.settings.get(msg.guild, 'prefix', '$$');
    if (!args.text) {
      const embedColor = msg.guild ? msg.guild.me.displayColor : null;
      const cmdCount = (categoryID) =>
        this.client.commandHandler.categories.get(categoryID).size;
      const totalCount =
        cmdCount('general') +
        cmdCount('utility') +
        cmdCount('fun') +
        cmdCount('reactions') +
        cmdCount('animals') +
        cmdCount('images') +
        cmdCount('management');
      helpEmbed
        .setTitle('Xyra Command List')
        .setDescription(`The prefix for ${msg.guild.name} is \`${currPrefix}\``)
        .setColor(embedColor)
        .addField(
          `General (${cmdCount('general')})`,
          `\`${currPrefix}help general\``,
          true
        )
        .addField(
          `Utility (${cmdCount('utility')})`,
          `\`${currPrefix}help utility\``,
          true
        )
        .addField(`Fun (${cmdCount('fun')})`, `\`${currPrefix}help fun\``, true)
        .addField(
          `Reactions (${cmdCount('reactions')})`,
          `\`${currPrefix}help reactions\``,
          true
        )
        .addField(
          `Animals (${cmdCount('animals')})`,
          `\`${currPrefix}help animals\``,
          true
        )
        .addField(
          `Images (${cmdCount('images')})`,
          `\`${currPrefix}help images\``,
          true
        )
        .addField(
          `Management (${cmdCount('management')})`,
          `\`${currPrefix}help management\``,
          true
        )
        .setFooter(`There's a total of ${totalCount} commands currently.`);
    } else if (!args.text.categoryID) {
      helpEmbed
        .setTitle(`${args.text.id} commands`)
        .setDescription(
          `\`${args.text.map((cmd) => cmd.aliases[0]).join('` `')}\``
        );
    } else {
      helpEmbed = CommandHelp(args.text, msg, this.client.user);
    }
    return msg.channel.send(helpEmbed);
  }
}

export default HelpCommand;
