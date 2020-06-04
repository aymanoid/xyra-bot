import { Command } from 'discord-akairo';
import axios from 'axios';
import { EMOJIS } from '../../util/Constants';

class KayneWestCommand extends Command {
  constructor() {
    super('kaynewest', {
      aliases: ['kaynewest', 'kayne'],
      description: {
        content: 'Gives a random Kayne West quote.',
      },
      category: 'fun',
    });
  }

  async exec(msg) {
    let response;
    try {
      response = await axios.get('https://api.kanye.rest/?format=text');
    } catch {
      return msg.channel.send(`${EMOJIS.ERROR} API error.`);
    }
    const result = response.data;

    return msg.channel.send(result);
  }
}

export default KayneWestCommand;
