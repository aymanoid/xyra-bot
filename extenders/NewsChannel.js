const { Structures, Permissions } = require('discord.js');

module.exports = Structures.extend(
  'NewsChannel',
  (NewsChannel) =>
    class extends NewsChannel {
      get postable() {
        if (this.client.user.id === this.guild.ownerID) return true;
        const permissions = this.permissionsFor(this.client.user);
        if (!permissions) return false;
        return permissions.has(Permissions.FLAGS.SEND_MESSAGES, false);
      }
    }
);
