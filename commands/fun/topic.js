import { Command } from 'discord-akairo';
import axios from 'axios';
import cheerio from 'cheerio';
import _ from 'lodash';

class TopicCommand extends Command {
  constructor() {
    super('topic', {
      aliases: ['topic'],
      description: {
        content: 'Gives a random conversation topic.',
      },
      category: 'Core',
    });
  }

  async exec(msg) {
    const mode = _.random(0);
    let topic;
    switch (mode) {
      case 0: {
        const siteUrl = 'http://www.conversationstarters.com/generator.php';
        const result = await axios.get(siteUrl);
        const $ = cheerio.load(result.data);
        topic = $('#random').text();
        break;
      }
      default:
        topic = 'No topic was found.';
    }
    return msg.channel.send(topic);
  }
}

export default TopicCommand;
