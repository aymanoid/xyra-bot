/* eslint-disable no-cond-assign */
import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';

class JoinMessageCommand extends Command {
  constructor() {
    super('joinmessage', {
      aliases: ['joinmessage', 'joinmsg'],
      description: {
        content: 'Edit the announce channel for joins.',
        usage: '<new message>',
        examples: ['Welcome {tag} to {server}!', 'off', 'on', 'test', 'remove'],
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'text',
          match: 'content',
        },
      ],
    });
  }

  async exec(msg, args) {
    if (!args.text)
      return msg.channel.send(`${EMOJIS.ERROR} No valid message was provided.`);

    const processMessage = (message) => {
      const ordinal = (n) => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      let joinMsg = message
        .replace(/{user}/g, msg.member.toString())
        .replace(/{tag}/g, msg.author.tag)
        .replace(/{server}/g, msg.guild.name)
        .replace(/{membercount}/g, msg.guild.memberCount)
        .replace(/{ordinalmembercount}/g, ordinal(msg.guild.memberCount));

      const channelRegex = /{#([^}]+)}/g;
      const roleRegex = /{@([^}]+)}/g;
      const emojiRegex = /{:([^}]+)}/g;
      let arr;

      while ((arr = channelRegex.exec(joinMsg)) !== null) {
        const trgChannel = this.client.util.resolveChannel(
          arr[1],
          msg.guild.channels.cache
        );
        if (trgChannel)
          joinMsg = joinMsg.replace(arr[0], trgChannel.toString());
      }

      while ((arr = roleRegex.exec(joinMsg)) !== null) {
        const trgRole = this.client.util.resolveRole(
          arr[1],
          msg.guild.roles.cache
        );
        if (trgRole) joinMsg = joinMsg.replace(arr[0], trgRole.toString());
      }

      while ((arr = emojiRegex.exec(joinMsg)) !== null) {
        const trgEmoji = this.client.util.resolveEmoji(
          arr[1],
          msg.guild.emojis.cache
        );
        if (trgEmoji) joinMsg = joinMsg.replace(arr[0], trgEmoji.toString());
      }

      return joinMsg;
    };

    if (args.text === 'off') {
      const joinMessage = await this.client.settings.get(
        msg.guild.id,
        'joinMessage',
        { enabled: false, message: 'Welcome {tag} to {server}!' }
      );
      joinMessage.enabled = false;
      await this.client.settings.set(msg.guild.id, 'joinMessage', joinMessage);
      return msg.channel.send(
        `${EMOJIS.CHECKED} The join message has been disabled.`
      );
    }

    if (args.text === 'on') {
      const joinMessage = await this.client.settings.get(
        msg.guild.id,
        'joinMessage',
        { enabled: false, message: 'Welcome {tag} to {server}!' }
      );
      joinMessage.enabled = true;
      await this.client.settings.set(msg.guild.id, 'joinMessage', joinMessage);
      return msg.channel.send(
        `${EMOJIS.CHECKED} The join message has been enabled.`
      );
    }

    if (args.text === 'test') {
      const joinMessage = await this.client.settings.get(
        msg.guild.id,
        'joinMessage',
        { enabled: false, message: 'Welcome {tag} to {server}!' }
      );
      return msg.channel.send(processMessage(joinMessage.message));
    }

    if (args.text === 'remove') {
      const joinMessage = await this.client.settings.get(
        msg.guild.id,
        'joinMessage',
        { enabled: false, message: 'Welcome {tag} to {server}!' }
      );
      joinMessage.message = 'Welcome {tag} to {server}!';
      await this.client.settings.set(msg.guild.id, 'joinMessage', joinMessage);
      return msg.channel.send(
        `${EMOJIS.CHECKED} The join message has been reset.`
      );
    }

    const joinMessage = await this.client.settings.get(
      msg.guild.id,
      'joinMessage',
      { enabled: false, message: 'Welcome {tag} to {server}!' }
    );
    joinMessage.message = args.text;
    await this.client.settings.set(msg.guild.id, 'joinMessage', joinMessage);

    return msg.channel.send(`${EMOJIS.CHECKED} The join message has been set.`);
  }
}

export default JoinMessageCommand;
