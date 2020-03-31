import { Command } from 'discord-akairo';
import axios from 'axios';

class KayneWestCommand extends Command {
  constructor() {
    super('kaynewest', {
      aliases: ['kaynewest', 'kayne'],
      description: {
        content: 'Gives a random Kayne West quote.',
      },
      category: 'Fun',
    });
  }

  async exec(msg) {
    const response = await axios.get('https://api.kanye.rest/?format=text');
    const result = response.data;

    return msg.channel.send(result);
  }
}

export default KayneWestCommand;
