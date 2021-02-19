import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import * as paginationEmbed from 'discord.js-pagination';
import moment from 'moment';
import _ from 'lodash';

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

    const boostersList = [];

    sortedBoosters.forEach((booster) => {
      const userMention = booster.toString();
      const boostingSince = moment(booster.premiumSince).format('lll z');
      const boostingFor = moment
        .duration(moment().diff(booster.premiumSince))
        .format(
          'y [years], M [months], d [days], h [hours], m [minutes], s [seconds]',
          { largest: 3 }
        );

      boostersList.push(
        `${userMention}\nBoosting for \`${boostingFor}\` since \`${boostingSince}\``
      );
    });

    const boosterChks = _.chunk(boostersList, 10);

    const pages = [];

    boosterChks.forEach((boosterChk) => {
      pages.push(
        new MessageEmbed()
          .setColor(embedColor)
          .setAuthor(currGuild.name, iconURL)
          .setTitle(
            `${sortedBoosters.size} Boosters | ${currGuild.premiumSubscriptionCount} Boosts.`
          )
          .setDescription(boosterChk.join('\n'))
      );
    });

    return paginationEmbed(msg, pages);
  }
}

export default BoostersCommand;
