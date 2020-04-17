import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';

class StatsCommand extends Command {
  constructor() {
    super('stats', {
      aliases: ['stats'],
      description: {
        content: 'Displays some bot statistics.',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const embedColor = msg.guild.me.displayColor;

    const avatarURL = this.client.user.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    const uptime = moment
      .duration(this.client.uptime)
      .format('d [days], h [hours], m [minutes], s [seconds]', { largest: 3 });

    const statsEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setAuthor(this.client.user.username, avatarURL)
      .setTitle(`${this.client.user.username} Statistics`)
      .addField('Guilds', this.client.guilds.cache.size.toLocaleString(), true)
      .addField(
        'Channels',
        this.client.channels.cache.size.toLocaleString(),
        true
      )
      .addField('Users', this.client.users.cache.size.toLocaleString(), true)
      .addField('Uptime', uptime, true)
      .addField(
        'Memory',
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        true
      );

    return msg.channel.send(statsEmbed);
  }
}

export default StatsCommand;
