import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class FlagCountCommand extends Command {
  constructor() {
    super('flagcount', {
      aliases: ['flagcount', 'fcount'],
      description: {
        content: 'Gets the count of flags or whatever.',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const currGuild = msg.guild;
    const embedColor = msg.guild.me.displayColor;

    const discordEmployee = currGuild.members.cache.filter(
      (m) => m.user.flags.serialize().DISCORD_EMPLOYEE
    );
    const partneredServerOwner = currGuild.members.cache.filter(
      (m) => m.user.flags.serialize().PARTNERED_SERVER_OWNER
    );
    const hypeSquadEvents = currGuild.members.cache.filter(
      (m) => m.user.flags.serialize().HYPESQUAD_EVENTS
    );
    const bugHunterLevel1 = currGuild.members.cache.filter(
      (m) => m.user.flags.serialize().BUGHUNTER_LEVEL_1
    );

    const tagCountEmbed = new MessageEmbed()
      .setColor(embedColor)
      .addField('Discord Employee', discordEmployee, true)
      .addField('Partnered Server Owner', partneredServerOwner, true)
      .addField('HypeSquad Events', hypeSquadEvents, true)
      .addField('Bug Hunter Level 1', bugHunterLevel1, true);
    return msg.channel.send(tagCountEmbed);
  }
}
export default FlagCountCommand;
