import { Command } from 'discord-akairo';
import axios from 'axios';
import NekosLife from 'nekos.life';

class CustomScriptCommand extends Command {
  constructor() {
    super('customscript', {
      aliases: ['customscript', 'c'],
      description: {
        content: 'Executes a premade script.',
      },
      category: 'private',
      ownerOnly: true,
      quoted: false,
      args: [
        {
          id: 'script',
        },
        {
          id: 'text1',
        },
        {
          id: 'text2',
        },
      ],
    });
  }

  async exec(msg, args) {
    switch (args.script.toLowerCase()) {
      case ('nekoslife', 'nl'): {
        const imageURL = (await new NekosLife()[args.text1][args.text2]()).url;
        return msg.channel.send(imageURL);
      }
      case ('nekobot', 'nb'): {
        const imageURL = (
          await axios.get(`https://nekobot.xyz/api/image?type=${args.text1}`)
        ).data.message;
        return msg.channel.send(imageURL);
      }
      default:
        return null;
    }
  }
}

export default CustomScriptCommand;
