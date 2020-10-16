import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class MemberCountCommand extends Command {
  constructor() {
    super('membercount', {
      aliases: ['membercount', 'mcount'],
      description: {
        content: 'Gets information about the server.',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const currGuild = msg.guild;
    const embedColor = msg.guild.me.displayColor;

    const { memberCount } = currGuild;
    const botCount = currGuild.members.cache.filter((m) => m.user.bot).size;
    const onlineCount = currGuild.members.cache.filter(
      (m) => m.presence.status === 'online'
    ).size;
    const idleCount = currGuild.members.cache.filter(
      (m) => m.presence.status === 'idle'
    ).size;
    const dndCount = currGuild.members.cache.filter(
      (m) => m.presence.status === 'dnd'
    ).size;
    const offlineCount = memberCount - (onlineCount + idleCount + dndCount);

    const memberCountEmbed = new MessageEmbed()
      .setColor(embedColor)
      .addField('Total', memberCount, true)
      .addField('Online', onlineCount, true)
      .addField('Idle', idleCount, true)
      .addField('Do Not Disturb', dndCount, true)
      .addField('Offline', offlineCount, true)
      .addField('Bots', botCount, true);

    return msg.channel.send(memberCountEmbed);
  }
}

export default MemberCountCommand;
