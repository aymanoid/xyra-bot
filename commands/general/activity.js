import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import momentDurationFormatSetup from 'moment-duration-format';
import { EMOJIS } from '../../util/Constants';

class ActivityCommand extends Command {
  constructor() {
    super('activity', {
      aliases: ['activity', 'status'],
      description: {
        content: 'Gets information about the activity of a member.',
        usage: '[member]',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'member',
          match: 'content',
          type: 'member',
          default: (msg) => msg.member,
        },
      ],
    });
  }

  async exec(msg, args) {
    const embedColor = msg.guild.me.displayColor;
    const trgMember = args.member;

    const imgOpts = { format: 'png', dynamic: true, size: 2048 };

    const avatarURL = trgMember.user.displayAvatarURL(imgOpts);

    let activities = [];
    if (trgMember.presence.activities)
      activities = trgMember.presence.activities;
    else
      return msg.channel.send(
        `${EMOJIS.ERROR} \`${trgMember.user.tag}\` isn't playing anything currently.`
      );

    const gameInfoEmbeds = [];
    activities.forEach((trgGame) => {
      const gameInfoEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setFooter(trgMember.user.tag, avatarURL);

      switch (trgGame.type) {
        case 'PLAYING': {
          gameInfoEmbed.setTitle('Playing a Game');
          let description = '';
          if (trgGame.name) description += `**${trgGame.name}**`;
          if (trgGame.details) description += `\n${trgGame.details}`;
          if (trgGame.state) description += `\n${trgGame.state}`;
          if (trgGame.timestamps) {
            if (trgGame.timestamps.start && trgGame.timestamps.end) {
              const end = moment(trgGame.timestamps.end);
              const duration = moment
                .duration(end.diff(moment()), 'milliseconds')
                .format('hh:*mm:ss');
              if (duration) description += `\n${duration} left`;
            } else if (trgGame.timestamps.start && trgGame.state) {
              const start = moment(trgGame.timestamps.start);
              const duration = moment
                .duration(moment().diff(start), 'milliseconds')
                .format('hh:*mm:ss');
              if (duration) description += `\n${duration} elapsed`;
            } else if (trgGame.timestamps.start) {
              const start = moment(trgGame.timestamps.start);
              const duration = moment
                .duration(moment().diff(start), 'milliseconds')
                .format('d [days], h [hours], m [minutes], s [seconds]', {
                  largest: 2,
                });
              if (duration) description += `\nfor ${duration}`;
            }
          }
          if (description.length) gameInfoEmbed.setDescription(description);
          if (trgGame.assets) {
            const upperText = [];
            const smallImage = trgGame.assets.smallImage
              ? trgGame.assets.smallImageURL(imgOpts)
              : null;
            if (trgGame.assets.smallText)
              upperText.push(trgGame.assets.smallText);
            if (trgGame.assets.largeText)
              upperText.push(trgGame.assets.largeText);
            if (trgGame.assets.largeImage)
              gameInfoEmbed.setThumbnail(trgGame.assets.largeImageURL(imgOpts));
            if (upperText || smallImage)
              gameInfoEmbed.setAuthor(upperText.join(' | '), smallImage);
          }
          break;
        }
        case 'STREAMING': {
          let description = '';
          gameInfoEmbed.setTitle(
            `Streaming${trgGame.name ? ` on ${trgGame.name}` : ''}`
          );
          if (trgGame.details) description += `**${trgGame.details}**`;
          if (trgGame.state) description += `\nplaying ${trgGame.state}`;
          if (trgGame.url) description += `\n[Watch](${trgGame.url})`;
          if (description.length) gameInfoEmbed.setDescription(description);
          if (trgGame.assets) {
            if (trgGame.assets.largeImage)
              gameInfoEmbed.setThumbnail(
                `https://static-cdn.jtvnw.net/previews-ttv/live_user_${
                  trgGame.assets.largeImage.split(':')[1]
                }-1080x600.jpg`
              );
          }
          break;
        }
        case 'LISTENING': {
          if (trgGame.name === 'Spotify') {
            gameInfoEmbed.setTitle(`Listening to ${trgGame.name}`);
            let description = '';
            if (trgGame.details)
              description += `**[${trgGame.details}](https://open.spotify.com/track/${trgGame.sync_id})**`;
            if (trgGame.state) description += `\nby ${trgGame.state}`;
            if (trgGame.assets.largeText)
              description += `\non ${trgGame.assets.largeText}`;
            if (description.length) gameInfoEmbed.setDescription(description);
            if (trgGame.assets) {
              if (trgGame.assets.largeText)
                gameInfoEmbed.setThumbnail(
                  trgGame.assets.largeImageURL(imgOpts)
                );
            }
          } else {
            gameInfoEmbed.setTitle(`Listening to ${trgGame.name}`);
            let description = '';
            if (trgGame.details) description += `**${trgGame.details}**\n`;
            if (trgGame.state) description += `by ${trgGame.state}\n`;
            if (trgGame.assets.largeText)
              description += `on ${trgGame.assets.largeText}`;
            if (description.length) gameInfoEmbed.setDescription(description);
            if (trgGame.assets) {
              if (trgGame.assets.largeText)
                gameInfoEmbed.setThumbnail(
                  trgGame.assets.largeImageURL(imgOpts)
                );
            }
          }
          break;
        }
        case 'WATCHING': {
          let description = '';
          gameInfoEmbed.setTitle('Watching');
          if (trgGame.name) description += `**${trgGame.name}**`;
          if (description.length) gameInfoEmbed.setDescription(description);
          break;
        }
        case 'CUSTOM_STATUS': {
          let description = '';
          gameInfoEmbed.setTitle(trgGame.name);
          if (trgGame.emoji) {
            description += `${trgGame.emoji.toString()} `;
          }
          if (trgGame.state) description += trgGame.state;
          if (description.length) gameInfoEmbed.setDescription(description);
          break;
        }
        default:
          break;
      }

      gameInfoEmbeds.push(gameInfoEmbed);
    });

    return gameInfoEmbeds.forEach((e) => msg.channel.send(e));
  }
}

export default ActivityCommand;
