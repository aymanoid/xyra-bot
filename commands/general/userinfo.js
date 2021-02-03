import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import _ from 'lodash';
import { EMOJIS } from '../../util/Constants';

class UserInfoCommand extends Command {
  constructor() {
    super('userinfo', {
      aliases: ['userinfo', 'uinfo', 'memberinfo', 'minfo', 'whois'],
      description: {
        content: 'Gets information about a member.',
        usage: '[member]',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'member',
          match: 'content',
          type: 'memberOrGlobalUser',
          default: (msg) => msg.member,
        },
      ],
    });
  }

  async exec(msg, args) {
    const currGuild = msg.channel.guild;
    const embedColor = msg.guild.me.displayColor;

    if (args.member.guild) {
      const trgMember = args.member;

      const joinPosition = trgMember.user.bot
        ? 'None'
        : currGuild.members.cache.filter(
            (m) => m.joinedAt < trgMember.joinedAt && !m.user.bot
          ).size + 1;

      const accountAge = moment
        .duration(moment().diff(trgMember.user.createdAt))
        .format(
          'y [years], M [months], d [days], h [hours], m [minutes], s [seconds]',
          { largest: 3 }
        );

      const joinAge = moment
        .duration(moment().diff(trgMember.joinedAt))
        .format(
          'y [years], M [months], d [days], h [hours], m [minutes], s [seconds]',
          { largest: 3 }
        );

      const avatarURL = trgMember.user.displayAvatarURL({
        format: 'png',
        dynamic: true,
        size: 4096,
      });

      const statusText = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Do Not Disturb',
        offline: 'Offline',
      }[trgMember.presence.status];

      const statusIcons = [];
      if (trgMember.presence.clientStatus) {
        if (trgMember.presence.clientStatus.web)
          statusIcons.push(
            EMOJIS[`WEB_${trgMember.presence.clientStatus.web.toUpperCase()}`]
          );
        if (trgMember.presence.clientStatus.mobile)
          statusIcons.push(
            EMOJIS[
              `MOBILE_${trgMember.presence.clientStatus.mobile.toUpperCase()}`
            ]
          );
        if (trgMember.presence.clientStatus.desktop)
          statusIcons.push(
            EMOJIS[
              `DESKTOP_${trgMember.presence.clientStatus.desktop.toUpperCase()}`
            ]
          );
      }
      const statusIcon = statusIcons.length
        ? statusIcons.join(' ')
        : EMOJIS.OFFLINE;

      let trgMemberActivity;
      const activityText = {
        PLAYING: 'Playing',
        STREAMING: 'Streaming',
        LISTENING: 'Listening to',
        WATCHING: 'Watching',
      };

      if (trgMember.presence.activities.length) {
        const firstActivity = trgMember.presence.activities[0];
        if (firstActivity.type !== 'CUSTOM_STATUS') {
          trgMemberActivity = `${activityText[firstActivity.type]} **${
            firstActivity.name
          }**`;
        } else {
          let activityEmoji = '';
          if (firstActivity.emoji) {
            activityEmoji = this.client.emojis.cache.get(firstActivity.emoji.id)
              ? `${firstActivity.emoji.toString()} `
              : `:${firstActivity.emoji.name}: `;
          }

          const secondActivity = `${
            // eslint-disable-next-line no-nested-ternary
            trgMember.presence.activities
              ? trgMember.presence.activities[1]
                ? `${activityText[trgMember.presence.activities[1].type]} **${
                    trgMember.presence.activities[1].name
                  }**`
                : ''
              : ''
          }`;
          trgMemberActivity = `${activityEmoji}${
            firstActivity.state ? firstActivity.state : secondActivity
          }`;
        }
      }

      const status = `${statusIcon} ${trgMemberActivity || statusText}`;

      const userInfoEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setAuthor(
          trgMember.user.tag +
            (trgMember.nickname ? ` | ${trgMember.nickname}` : ''),
          avatarURL
        )
        .setTitle('Avatar URL')
        .setDescription(status)
        .setURL(avatarURL)
        .setThumbnail(avatarURL)
        .addField('ID', trgMember.id, true)
        .addField(
          'Color',
          trgMember.displayHexColor.toUpperCase() || 'Default',
          true
        )
        .addField('Join Position', joinPosition, true)
        .addField(
          'Account Created On',
          moment(trgMember.user.createdAt).format('lll z'),
          true
        )
        .addField('Account Age', accountAge, true);

      if (trgMember.premiumSince) {
        const premiumAge = moment
          .duration(moment().diff(trgMember.premiumSince))
          .format(
            'y [years], M [months], d [days], h [hours], m [minutes], s [seconds]',
            { largest: 2 }
          );
        const premiumSince = moment(trgMember.premiumSince).format('lll z');
        const boosterSince = `${premiumSince} (${premiumAge} ago)`;

        userInfoEmbed.addField('Booster Since', boosterSince, true);
      } else {
        userInfoEmbed.addField('\u200B', '\u200B', true);
      }

      userInfoEmbed
        .addField(
          'Joined Server On',
          moment(trgMember.joinedAt).format('lll z'),
          true
        )
        .addField('Join Server Age', joinAge, true)
        .addField('\u200B', '\u200B', true);

      if (trgMember.roles.cache.size) {
        let roles = trgMember.roles.cache
          .array()
          .sort((a, b) => b.position - a.position)
          .slice(0, -1)
          .map((r) => r.toString());
        roles = _.truncate(roles.join(', '), {
          length: 1024,
          separator: /,? +/,
          omission: ' [...]',
        });

        if (roles.length) {
          userInfoEmbed.addField(
            `Roles [${trgMember.roles.cache.size - 1}]`,
            roles,
            false
          );
        }
      }

      return msg.channel.send(userInfoEmbed);
    }

    const globalUserInfo = this.client.settings.get(
      msg.guild,
      'globalUserInfo',
      true
    );
    if (!globalUserInfo)
      return msg.channel.send(
        `${EMOJIS.ERROR} The global userinfo setting is disabled. Server managers can toggle this setting using the \`globaluserinfo\` command.`
      );

    const trgUser = args.member;

    const accountAge = moment
      .duration(moment().diff(trgUser.createdAt))
      .format(
        'y [years], M [months], d [days], h [hours], m [minutes], s [seconds]',
        { largest: 3 }
      );

    const avatarURL = trgUser.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 4096,
    });

    const userInfoEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setAuthor(trgUser.tag, avatarURL)
      .setTitle('Avatar URL')
      .setURL(avatarURL)
      .setThumbnail(avatarURL)
      .addField('ID', trgUser.id, true)
      .addField(
        'Account Created On',
        moment(trgUser.createdAt).format('lll z'),
        true
      )
      .addField('Account Age', accountAge, true);

    return msg.channel.send(userInfoEmbed);
  }
}

export default UserInfoCommand;
