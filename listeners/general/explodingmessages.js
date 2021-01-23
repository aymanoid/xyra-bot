import { Listener } from 'discord-akairo';

class ExplodingMessagesListener extends Listener {
  constructor() {
    super('explodingmessages', {
      event: 'message',
      emitter: 'client',
      category: 'general',
    });
  }

  async exec(message) {
    if (!message.guild) return;

    const explodingChannels = await this.client.settings.get(
      message.guild.id,
      'explodingChannels',
      {}
    );

    if (!explodingChannels[message.channel.id]) return;

    setTimeout(() => {
      if (!message.deleted) message.delete();
    }, explodingChannels[message.channel.id]);
  }
}

export default ExplodingMessagesListener;
