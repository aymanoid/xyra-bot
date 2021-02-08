import { Listener } from 'discord-akairo';

class ForceBanListener extends Listener {
  constructor() {
    super('forceban', {
      event: 'guildMemberAdd',
      emitter: 'client',
      category: 'general',
    });
  }

  async exec(member) {
    const forceBanned = await this.client.settings.get(
      member.guild.id,
      'forceBanned',
      []
    );

    for (let i = 0; i < forceBanned.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await member.guild.members.ban(forceBanned[i].id, {
        days: 7,
        reason: `Force banned: ${forceBanned[i].reason}`,
      });
    }
  }
}

export default ForceBanListener;
