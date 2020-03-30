import { Command } from 'discord-akairo';

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping', 'peepee'],
      description: {
        content: 'idk what this cmd actually does.',
      },
      category: 'Core',
      ratelimit: 2,
    });
  }

  async exec(msg) {
    const word = {
      ping: 'Pong!',
      peepee: 'Poopoo!',
    }[msg.util.parsed.alias.toLowerCase()];

    const sent = await msg.channel.send(word);
    const timeDiff =
      (sent.editedAt || sent.createdAt) - (msg.editedAt || msg.createdAt);

    return sent.edit(
      `${word} \`RTT: ${timeDiff}ms\` \`Heartbeat: ${this.client.ws.ping}ms\``
    );
  }
}

export default PingCommand;
