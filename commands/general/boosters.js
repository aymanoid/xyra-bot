import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import Table from 'easy-table';

class BoostersCommand extends Command {
  constructor() {
    super('boosters', {
      aliases: ['boosters'],
      description: {
        content: 'Returns a list of all members boosting the server.',
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

    const boostersEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setAuthor(currGuild.name, iconURL)
      .setTitle(`Boosters of ${currGuild.name}`);

    if (!currGuild.premiumSubscriptionCount) {
      boostersEmbed.setDescription('This server has no boosters.');
      return msg.channel.send(boostersEmbed);
    }

    const sortedBoosters = currGuild.members.cache
      .filter((m) => m.premiumSince)
      .sort((a, b) => a.premiumSince - b.premiumSince);

    const t = new Table();

    sortedBoosters.forEach((booster) => {
      const username = booster.user.tag;
      const boostingSince = moment(booster.premiumSince).format('lll z');
      const boostingFor = moment
        .duration(moment().diff(booster.premiumSince))
        .format(
          'y [years], M [months], d [days], h [hours], m [minutes], s [seconds]',
          { largest: 3 }
        );

      t.cell('**Username**', username);
      t.cell('**Boosting Since**', boostingSince);
      t.cell('**Boosting For**', boostingFor);
      t.newRow();
    });

    const tableText = t.toString();
    boostersEmbed
      .setDescription(tableText)
      .setFooter(
        `There's a total of ${sortedBoosters.size} members boosting this server for a total of ${currGuild.premiumSubscriptionCount} boosts.`
      );

    return msg.channel.send(boostersEmbed);
  }
}

export default BoostersCommand;
