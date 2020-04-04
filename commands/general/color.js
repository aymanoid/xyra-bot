import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

class ColorCommand extends Command {
  constructor() {
    super('color', {
      aliases: ['color', 'colour'],
      description: {
        content:
          'Gets information about a color, or gives a random color if no input was given.',
        usage: '[color]',
        examples: ['', 'e91e63', '#9b59b6'],
      },
      category: 'general',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'color',
          match: 'content',
          type: 'color',
          default: () => Math.floor(Math.random() * 16777215),
        },
      ],
    });
  }

  async exec(msg, args) {
    const trgColor = args.color.toString(16);

    const reqURL = `http://www.thecolorapi.com/id?hex=${trgColor}`;
    const imageURL = `https://serux.pro/rendercolour?rgb=${trgColor}&width=80&height=80`;

    const colorData = (await axios.get(reqURL)).data;

    const hex = colorData.hex.value;
    const rgb = colorData.rgb.value.match(/\((.*)\)/)[1];
    const hsl = colorData.hsl.value.match(/\((.*)\)/)[1];
    const hsv = colorData.hsv.value.match(/\((.*)\)/)[1];
    const cmyk = colorData.cmyk.value.match(/\((.*)\)/)[1];
    const xyz = colorData.XYZ.value.match(/\((.*)\)/)[1];

    const colorEmbed = new MessageEmbed()
      .setColor(trgColor)
      .setTitle(colorData.name.value)
      .setThumbnail(imageURL)
      .addField('Hex', hex, true)
      .addField('RGB', rgb, true)
      .addField('HSL', hsl, true)
      .addField('HSV', hsv, true)
      .addField('CMYK', cmyk, true)
      .addField('XYZ', xyz, true);

    return msg.channel.send(colorEmbed);
  }
}

export default ColorCommand;
