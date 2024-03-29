import { Command } from 'discord-akairo';
import * as soap from 'soap';
import { EMOJIS } from '../../util/Constants';

class YodaCommand extends Command {
  constructor() {
    super('yoda', {
      aliases: ['yoda'],
      description: {
        content:
          'Converts the given text to Yoda-speak, or the message above yours if no text was given.',
        usage: '[text]',
      },
      category: 'fun',
      args: [
        {
          id: 'text',
          match: 'content',
        },
      ],
    });
  }

  async exec(msg, args) {
    let text;
    let author;

    if (!args.text) {
      const msgs = await msg.channel.messages.fetch(
        {
          limit: 1,
          before: msg.id,
        },
        false
      );
      if (!msgs || !msgs[0] || !msgs[0].content)
        return msg.channel.send(`There is no message before yours.`);
      text = msgs[0].content;
      author = msgs[0].member.displayName;
    } else {
      text = args.text;
    }

    let client;
    try {
      client = await soap.createClientAsync(
        'https://www.yodaspeak.co.uk/webservice/yodatalk.php?wsdl'
      );
    } catch {
      return msg.channel.send(`${EMOJIS.ERROR} Yoda API error.`);
    }
    const response = await client.yodaTalkAsync({ inputText: text });

    text = response[0].return;

    if (author) text = `**\`${author}:\`** ${text}`;

    return msg.channel.send(text);
  }
}

export default YodaCommand;
