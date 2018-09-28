const { Command } = require('discord-akairo');
const moment = require('moment');
const pako = require('pako');
const request = require('request-promise');

const { prepareEmbed } = require('../util');

class TarkovCommand extends Command {

  constructor() {
    super('tarkov', {
      aliases: ['tarkov'],
      ownerOnly: true
    });
  }

  async exec(message) {
    let token = this.client.getAuthToken();

    if (token == null) {
      return message.reply('API service unavailable at this time. Please try again later.');
    }

    let opts = {
      url: 'https://prod.escapefromtarkov.com/client/weather',
      method: 'POST',
      gzip: true,
      encoding: null,
      headers: {
        Host: 'prod.escapefromtarkov.com',
        'User-Agent': 'UnityPlayer/5.6.6f2 (http://unity3d.com)',
        accept: '*/*',
        Connection: 'Keep-Alive',
        Cookie: `PHPSESSID=${token}`,
        'X-Unity-Version': '5.6.6f2',
        'Content-Type': 'application/json',
      }
    };

    try {
      let body = await request(opts);

      // let length = Buffer.byteLength(body);

      let data = JSON.parse(
        pako.inflate(body, {
          to: 'string'
        })
      );

      if (data.err) {
        return message.reply(`\`${data.errmsg}\``);
      }

      data = data.data;

      let time = moment(data.weather.time).format('h:mma');
      let temp = data.weather.temp;
      let serverTime = moment(`${data.date} ${data.time}`);

      const embed = prepareEmbed();

      embed
        .setTitle('Tarkov Status')
        .setDescription(`It is currently ${time} in Tarkov. The temperature is ${temp} degrees celsius.`)
        .addField('Server times', `${serverTime.format('h:mma')} or ${serverTime.add(12, 'h').format('h:mma')}`);
    
      return message.reply({ embed });
    } catch (e) {
      console.log(e);
      return message.reply('Error fetching Tarkov weather information.');
    }
  }

}

module.exports = TarkovCommand;