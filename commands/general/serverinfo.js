import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';

class ServerInfoCommand extends Command {
  constructor() {
    super('serverinfo', {
      aliases: ['serverinfo', 'sinfo'],
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

    const iconURL = currGuild.iconURL({
      format: 'png',
      dynamic: true,
      size: 2048,
    });

    const serverAge = moment
      .duration(moment().diff(currGuild.createdAt))
      .format(
        'y [years], M [months], d [days], h [hours], m [minutes], s [seconds]',
        { largest: 2 }
      );

    const serverRegion =
      {
        'eu-central': 'Central Europe',
        india: 'India',
        london: 'London',
        japan: 'Japan',
        amsterdam: 'Amsterdam',
        brazil: 'Brazil',
        'us-west': 'US West',
        hongkong: 'Hong Kong',
        southafrica: 'South Africa',
        sydney: 'Sydney',
        europe: 'Europe',
        singapore: 'Singapore',
        'us-central': 'US Central',
        'eu-west': 'Western Europe',
        dubai: 'Dubai',
        'us-south': 'US South',
        'us-east': 'US East',
        frankfurt: 'Frankfurt',
        russia: 'Russia',
      }[currGuild.region] || currGuild.region;

    const { memberCount } = currGuild;
    const botCount = currGuild.members.cache.filter((m) => m.user.bot).size;
    const humanCount = memberCount - botCount;
    const onlineCount = currGuild.members.cache.filter(
      (m) => m.presence.status !== 'offline'
    ).size;

    const serverInfoEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setAuthor(currGuild.name, iconURL)
      .addField('Owner', currGuild.owner.user.tag, true)
      .addField('Region', serverRegion, true)
      .addField('Members', memberCount, true)
      .addField('Humans', humanCount, true)
      .addField('Bots', botCount, true)
      .addField('Online', onlineCount, true)
      .addField(
        `Level ${currGuild.premiumTier}`,
        `${
          currGuild.premiumSubscriptionCount
            ? currGuild.premiumSubscriptionCount
            : 0
        } Boosts`,
        true
      )
      .addField('Roles', currGuild.roles.cache.size, true)
      .addField('Emotes', currGuild.emojis.cache.size, true)
      .addField(
        'Channel Categories',
        currGuild.channels.cache.filter((c) => c.type === 'category').size,
        true
      )
      .addField(
        'Text Channels',
        currGuild.channels.cache.filter((c) => c.type === 'text').size,
        true
      )
      .addField(
        'Voice Channels',
        currGuild.channels.cache.filter((c) => c.type === 'voice').size,
        true
      )
      .setFooter(
        `ID: ${currGuild.id} | Created On: ${moment(currGuild.createdAt).format(
          'llll z'
        )} (${serverAge} ago)`
      );

    if (iconURL) serverInfoEmbed.setTitle('Icon URL').setURL(iconURL);

    return msg.channel.send(serverInfoEmbed);
  }
}

export default ServerInfoCommand;
