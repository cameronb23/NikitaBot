const { Command } = require('discord-akairo');

class AboutCommand extends Command {

  constructor() {
    super('about', {
      aliases: ['about'],
    });
  }

  exec(message) {
    return message.reply('Nikita is currently 0.0.1 years old.');
  }

}

module.exports = AboutCommand;