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
        .replace(/{user}/g, member.toString())
        .replace(/{tag}/g, member.user.tag)
        .replace(/{server}/g, member.guild.name)
        .replace(/{membercount}/g, member.guild.memberCount)
        .replace(/{ordinalmembercount}/g, ordinal(member.guild.memberCount));

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
          joinMsg = joinMsg.replace(arr[0], trgChannel.toString());
      }

      while ((arr = roleRegex.exec(joinMsg)) !== null) {
        const trgRole = this.client.util.resolveRole(
          arr[1],
          member.guild.roles.cache
        );
        if (trgRole) joinMsg = joinMsg.replace(arr[0], trgRole.toString());
      }

      while ((arr = emojiRegex.exec(joinMsg)) !== null) {
        const trgEmoji = this.client.util.resolveEmoji(
          arr[1],
          member.guild.emojis.cache
        );
        if (trgEmoji) joinMsg = joinMsg.replace(arr[0], trgEmoji.toString());
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
