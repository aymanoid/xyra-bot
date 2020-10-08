import { Command, Argument } from 'discord-akairo';

class PrefixCommand extends Command {
  constructor() {
    super('prefix', {
      aliases: ['prefix'],
      description: {
        content: 'Shows the current prefix, or sets a new one.',
        usage: '[prefix]',
      },
      category: 'general',
      channel: 'guild',
      clientPermissions: ['MANAGE_GUILD'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'prefix',
          match: 'content',
          type: Argument.validate(
            'string',
            (m, p) => !/\s/.test(p) && p.length <= 10
          ),
          prompt: {
            start: 'What would you like to set the prefix to?',
            retry:
              'Please provide a prefix without spaces and less than 10 characters.',
            optional: true,
          },
        },
      ],
    });
  }

  async exec(msg, { prefix }) {
    if (!prefix) {
      const currPrefix = this.client.settings.get(msg.guild, 'prefix', '$');
      return msg.channel.send(`The prefix of this server is \`${currPrefix}\``);
    }
    await this.client.settings.set(msg.guild, 'prefix', prefix);
    if (prefix === '$') return msg.channel.send('Prefix has been reset to `$`');
    return msg.channel.send(`Prefix has been set to \`${prefix}\``);
  }
}

export default PrefixCommand;
