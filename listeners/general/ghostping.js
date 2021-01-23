import { Listener } from 'discord-akairo';

class GhostPingListener extends Listener {
  constructor() {
    super('ghostping', {
      event: 'guildMemberAdd',
      emitter: 'client',
      category: 'general',
    });
  }

  async exec(member) {
    const ghostPingChannelIDS = await this.client.settings.get(
      member.guild.id,
      'ghostPingChannels',
      []
    );
    if (!ghostPingChannelIDS.length) return;

    for (let i = 0; i < ghostPingChannelIDS.length; i += 1) {
      const ghostPingChannel = this.client.channels.cache.get(
        ghostPingChannelIDS[i]
      );
      if (
        !ghostPingChannel ||
        !ghostPingChannel.viewable ||
        !ghostPingChannel.postable
      )
        return;

      // eslint-disable-next-line no-await-in-loop
      const ghostPingMsg = await ghostPingChannel.send(member.toString());
      ghostPingMsg.delete();
    }
  }
}

export default GhostPingListener;
