const { Structures, Permissions } = require('discord.js');

module.exports = Structures.extend(
  'GuildMember',
  (GuildMember) =>
    class extends GuildMember {
      canManage(member) {
        if (member.user.id === this.guild.ownerID) return false;
        if (member.user.id === this.user.id) return false;
        if (this.user.id === this.guild.ownerID) return true;
        return this.roles.highest.comparePositionTo(member.roles.highest) > 0;
      }

      canKick(member) {
        return (
          this.canManage(member) &&
          this.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
        );
      }

      canBan(member) {
        return (
          this.canManage(member) &&
          this.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
        );
      }
    }
);
