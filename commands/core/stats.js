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
      category: 'Core',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const currGuild = msg.guild;
    const botColor = currGuild.me.displayColor;

    const avatarURL = currGuild.me.user.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    const uptime = moment
      .duration(this.client.uptime)
      .format('d [days], h [hours], m [minutes], s [seconds]', { largest: 3 });

    const statsEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
      .setAuthor(currGuild.me.user.username, avatarURL)
      .setTitle(`${currGuild.me.user.username} Statistics`)
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
