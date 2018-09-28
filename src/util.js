const { RichEmbed } = require('discord.js');

const prepareEmbed = () => {
  const embed = new RichEmbed();

  return embed
    .setColor('GOLD')
    .setFooter('Powered by Nikita Buyanov')
    .setTimestamp(Date.now());
}

module.exports = {
  prepareEmbed
};