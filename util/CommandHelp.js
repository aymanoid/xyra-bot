const { MessageEmbed } = require('discord.js');

export default function (cmd, msg, botUser) {
  const aliase = cmd.aliases[0];
  const { prefix } = msg.util.parsed;
  const examples = cmd.description.examples || [];
  const avatarURL = botUser.displayAvatarURL({
    format: 'png',
    dynamic: true,
    size: 2048,
  });
  const color = msg.guild
    ? msg.guild.members.cache.get(botUser.id).displayColor
    : 16777215;
  const cmdInfoEmbed = new MessageEmbed()
    .setAuthor(`Help for ${aliase}`, avatarURL)
    .setDescription(cmd.description)
    .setColor(color);

  cmdInfoEmbed.description = `**Description:** ${cmd.description.content}\n`;

  cmdInfoEmbed.description += `**Cooldown:** ${cmd.cooldown / 1000}s\n`;

  cmdInfoEmbed.description += `**Usage:** ${aliase} ${
    cmd.description.usage || ''
  }\n`;

  if (examples && examples.length) {
    // eslint-disable-next-line no-unused-expressions
    examples.length > 1
      ? (cmdInfoEmbed.description += `\n**Examples:**\n${prefix}${aliase} ${examples.join(
          `\n${prefix}${aliase} `
        )}\n`)
      : (cmdInfoEmbed.description += `**Example:** ${prefix}${aliase} ${examples[0]}\n`);
  }

  /** Aliases */
  if (cmd.aliases.length > 1) {
    const aliases = cmd.aliases.filter((e) => e !== cmd.aliases[0]);
    cmdInfoEmbed.fields.push({
      name: 'Aliases:',
      value: aliases.join(', '),
      inline: true,
    });
  }

  return cmdInfoEmbed;
}
