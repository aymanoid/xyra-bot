/* eslint-disable prettier/prettier */
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { EMOJIS } from '../../util/Constants';

class AchievementCommand extends Command {
  constructor() {
    super('achievement', {
      aliases: ['achievement', 'achv'],
      description: {
        content: 'Generates a minecraft achievement.',
        usage: '<white text> | [icon] | [yellow title]',
      },
      category: 'fun',
      separator: '|',
      args: [
        {
          id: 'items',
          match: 'separate',
          type: 'string',
        },
      ],
    });
  }

  async exec(msg, args) {
    const botColor = msg.guild.me.displayColor;

    if (args.items[0] && args.items[0].length > 25)
      return msg.channel.send(
        `${EMOJIS.ERROR} White text can't be more than 25 characters long.`
      );
    if (args.items[2] && args.items[2].length > 25)
      return msg.channel.send(
        `${EMOJIS.ERROR} Yellow title can't be more than 25 characters long.`
      );

    const icons = {
      'stone': '20',
      'grass': '1',
      'wooden plank': '21',
      'crafting table': '13',
      'furnace': '18',
      'chest': '17',
      'bed': '9',
      'coal': '31',
      'iron': '22',
      'gold': '23',
      'diamond': '2',
      'sign': '11',
      'book': '19',
      'wooden door': '24',
      'iron door': '25',
      'redstone': '14',
      'rail': '12',
      'bow': '33',
      'arrow': '34',
      'iron sword': '32',
      'diamond sword': '3',
      'iron chestplate': '35',
      'diamond chestplate': '26',
      'tnt': '6',
      'flint and steel': '27',
      'fire': '15',
      'bucket': '36',
      'water bucket': '37',
      'lava bucket': '38',
      'cookie': '7',
      'cake': '10',
      'milk bucket': '39',
      'creeper': '4',
      'pig': '5',
      'spawn egg': '30',
      'heart': '8',
      'cobweb': '16',
      'potion': '28',
      'splash potion': '29'
    };

    const randomProperty = (obj) => {
      const keys = Object.keys(obj)
      // eslint-disable-next-line no-bitwise
      return obj[keys[ keys.length * Math.random() << 0]];
    };

    let iconID = randomProperty(icons);
    if (args.items[1] && args.items[1].length && icons[args.items[1].toLowerCase()]) iconID = icons[args.items[1].toLowerCase()];

    const yellowTitle = encodeURIComponent(args.items[2] || 'Achievement Get!');
    const whiteText = encodeURIComponent(args.items[0]);

    const imageURL = `https://minecraftskinstealer.com/achievement/${iconID}/${yellowTitle}/${whiteText}`;

    const achvEmbed = new MessageEmbed().setColor(botColor).setImage(imageURL);

    return msg.channel.send(achvEmbed);
  }
}

export default AchievementCommand;
