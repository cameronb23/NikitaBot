const { Command } = require('discord-akairo');

const { User } = require('../models');
const { prepareEmbed } = require('../util');

function showRep(message, dbUser, user) {
  const embed = prepareEmbed();

  embed
    .setAuthor(`${user.username}#${user.discriminator}`, user.displayAvatarURL)
    .setDescription(`User has ${dbUser.get('reputation_count')} reputation points.`);

  return message.reply({ embed });
}

class RepCommand extends Command {

  constructor() {
    super('rep', {
      aliases: ['rep'],
      args: [
        {
          id: 'user',
          type: 'member',
          default: null
        }
      ]
    });
  }

  async exec(message, args) {
    if (args.user == null) {
      return message.reply('Please tag a valid user to view their reputation.');
    }
    
    try {
      let user = args.user.user;
      let dbUser = await User.findOne({discordId: args.user.id});

      return showRep(message, dbUser, user);

    } catch (e) {
      let user = args.user.user;
      let dbUser = new User({
        discordId: user.id,
        reputation_count: 0,
      });

      await dbUser.save();

      return showRep(message, dbUser, user);
    }
  }

}

module.exports = RepCommand;