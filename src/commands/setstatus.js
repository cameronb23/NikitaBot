const { Command } = require('discord-akairo');

class TarkovCommand extends Command {

  constructor() {
    super('setstatus', {
      aliases: ['setstatus'],
      ownerOnly: true,
      split: 'quoted',
      args: [
        {
          id: 'status',
          type: 'string'
        }
      ]
    });
  }

  async exec(message, args) {
    try {
      await this.client.user.setPresence({ game: { name: ` ${args.status}` } });
      return message.reply('Status updated.');
    } catch (e) {
      return message.reply('Error setting status: ', e);
    }
  }

}

module.exports = TarkovCommand;