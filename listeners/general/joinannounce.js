/* eslint-disable no-cond-assign */
import { Listener } from 'discord-akairo';

class JoinAnnounceListener extends Listener {
  constructor() {
    super('joinannounce', {
      event: 'guildMemberAdd',
      emitter: 'client',
      category: 'general',
    });
  }

  async exec(member) {
    const announceChannelId = await this.client.settings.get(
      member.guild.id,
      'announceChannel',
      null
    );
    if (!announceChannelId) return;

    const joinMessage = await this.client.settings.get(
      member.guild.id,
      'joinMessage',
      { enabled: false, message: 'Welcome {tag} to {server}!' }
    );
    if (!joinMessage.enabled || !joinMessage.message) return;

    const processMessage = (message) => {
      const ordinal = (n) => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      let joinMsg = message
        .replaceAll('{user}', member.toString())
        .replaceAll('{tag}', member.user.tag)
        .replaceAll('{server}', member.guild.name)
        .replaceAll('{membercount}', member.guild.memberCount)
        .replaceAll('{ordinalmembercount}', ordinal(member.guild.memberCount));

      const channelRegex = /{#([^}]+)}/g;
      const roleRegex = /{@([^}]+)}/g;
      const emojiRegex = /{:([^}]+)}/g;
      let arr;

      while ((arr = channelRegex.exec(joinMsg)) !== null) {
        const trgChannel = this.client.util.resolveChannel(
          arr[1],
          member.guild.channels.cache
        );
        if (trgChannel)
          joinMsg = joinMsg.replaceAll(arr[0], trgChannel.toString());
      }

      while ((arr = roleRegex.exec(joinMsg)) !== null) {
        const trgRole = this.client.util.resolveRole(
          arr[1],
          member.guild.roles.cache
        );
        if (trgRole) joinMsg = joinMsg.replaceAll(arr[0], trgRole.toString());
      }

      while ((arr = emojiRegex.exec(joinMsg)) !== null) {
        const trgEmoji = this.client.util.resolveEmoji(
          arr[1],
          member.guild.emojis.cache
        );
        if (trgEmoji) joinMsg = joinMsg.replaceAll(arr[0], trgEmoji.toString());
      }

      return joinMsg;
    };

    const announceChannel = this.client.channels.cache.get(announceChannelId);
    if (
      announceChannel &&
      announceChannel.viewable &&
      announceChannel.postable
    ) {
      // eslint-disable-next-line no-await-in-loop
      await announceChannel.send(processMessage(joinMessage.message));
    }
  }
}

export default JoinAnnounceListener;
