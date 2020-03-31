import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import _ from 'lodash';

class UserInfoCommand extends Command {
  constructor() {
    super('userinfo', {
      aliases: ['userinfo', 'uinfo', 'memberinfo', 'minfo', 'whois'],
      description: {
        content: 'Gets information about a member.',
        usage: '[member]',
      },
      category: 'Core',
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
    const currGuild = msg.channel.guild;
    const botColor = currGuild.me.displayColor;
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
      size: 2048,
    });

    const statusText = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline',
    }[trgMember.presence.status];

    const statusIcon = {
      online: '<:online:644763235207217172>',
      idle: '<:idle:644763325921493006>',
      dnd: '<:dnd:644763407811215361>',
      offline: '<:offline:644763466598449154>',
    }[trgMember.presence.status];

    let trgMemberActivity;
    const activityText = {
      PLAYING: 'Playing',
      STREAMING: 'Streaming',
      LISTENING: 'Listening to',
      WATCHING: 'Watching',
    };

    if (trgMember.presence.activities.length) {
      if (trgMember.presence.activities[0].type !== 'CUSTOM_STATUS') {
        trgMemberActivity = `${
          activityText[trgMember.presence.activities[0].type]
        } **${trgMember.presence.activities[0].name}**`;
      } else {
        let activityEmoji = '';
        if (trgMember.presence.activities[0].emoji)
          activityEmoji = `${trgMember.presence.activities[0].emoji.toString()} `;

        const secondAcitvity = `${
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
          trgMember.presence.activities[0].state
            ? trgMember.presence.activities[0].state
            : secondAcitvity
        }`;
      }
    }

    const status = `${statusIcon} ${trgMemberActivity || statusText}`;

    const userInfoEmbed = new MessageEmbed()
      .setColor(botColor || 16777215)
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
        moment(trgMember.createdAt).format('lll z'),
        true
      )
      .addField('Account Age', accountAge, true)
      .addField('\u200B', '\u200B', true)
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

      userInfoEmbed.addField(
        `Roles [${trgMember.roles.cache.size}]`,
        roles,
        false
      );
    }

    return msg.channel.send(userInfoEmbed);
  }
}

export default UserInfoCommand;
