import { Listener } from 'discord-akairo';

class GhostPingListener extends Listener {
  constructor() {
    super('ghostping', {
      event: 'guildMemberAdd',
      emitter: 'client',
      category: 'ghostping',
    });
  }

  async exec(member) {
    const ghostPingChannelID = this.client.settings.get(
      member.guild.id,
      'ghostPingChannel'
    );
    if (!ghostPingChannelID) return;

    const ghostPingChannel = this.client.channels.cache.get(ghostPingChannelID);
    if (
      !ghostPingChannel ||
      !ghostPingChannel.viewable ||
      !ghostPingChannel.postable
    )
      return;

    const ghostPingMsg = await ghostPingChannel.send(member.toString());
    ghostPingMsg.delete();
  }
}

export default GhostPingListener;
