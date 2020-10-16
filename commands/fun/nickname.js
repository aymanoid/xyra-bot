import { Command } from 'discord-akairo';
import { EMOJIS } from '../../util/Constants';
import * as nicks from '../../assets/arrays/nicks.json';

class NicknameCommand extends Command {
  constructor() {
    super('nickname', {
      aliases: ['nickname'],
      description: {
        content: 'Gives you a random nickname.',
      },
      category: 'fun',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async exec(msg) {
    const trgMember = msg.member;
    const nick = nicks[Math.floor(Math.random() * nicks.length)];

    if (!trgMember.manageable)
      return msg.channel.send(
        `I can't change your nickname, but I would name you **\`${nick}\`** if I could.`
      );

    try {
      await trgMember.setNickname(nick);
    } catch (err) {
      msg.channel.send(
        `${EMOJIS.ERROR} There was an error changing your nickname.`
      );
      throw err;
    }

    return msg.channel.send(`I changed your nickname to **\`${nick}\`**`);
  }
}

export default NicknameCommand;
