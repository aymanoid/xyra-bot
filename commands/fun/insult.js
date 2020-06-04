import { Command } from 'discord-akairo';
import axios from 'axios';
import { EMOJIS } from '../../util/Constants';

class InsultCommand extends Command {
  constructor() {
    super('insult', {
      aliases: ['insult'],
      description: {
        content: 'Gives a random evil insult.',
      },
      category: 'fun',
    });
  }

  async exec(msg) {
    let response;
    try {
      response = await axios.get(
        'https://evilinsult.com/generate_insult.php?lang=en'
      );
    } catch {
      return msg.channel.send(`${EMOJIS.ERROR} API error.`);
    }
    const result = response.data;

    return msg.channel.send(result);
  }
}

export default InsultCommand;
