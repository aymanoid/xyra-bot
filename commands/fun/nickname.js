import { Command } from 'discord-akairo';
import * as nicks from '../../assets/arrays/nicks.json';

class NicknameCommand extends Command {
  constructor() {
    super('nickname', {
      aliases: ['nickname'],
      description: {
        content: 'Gives you a random nickname.',
      },
      category: 'Core',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg, args) {
    const trgMember = args.member;
    const nick = nicks[Math.floor(Math.random() * nicks.length)];

    if (!trgMember.manageable)
      return msg.channel.send(
        `I can't change your nickname, but I would name you **\`${nick}\`** if I could.`
      );

    try {
      await trgMember.setNicknem(nick);
    } catch {
      return msg.channel.send(`There was an error changing your nickname.`);
    }

    return msg.channel.send(`I changed your nickname to **\`${nick}\`**`);
  }
}

export default NicknameCommand;
