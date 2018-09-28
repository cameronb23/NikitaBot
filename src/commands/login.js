const { Command } = require('discord-akairo');
const pako = require('pako');
const request = require('request-promise');

class LoginCommand extends Command {

  constructor() {
    super('login', {
      aliases: ['login'],
      ownerOnly: true
    });
  }

  async exec(message) {
    let payloadData = pako.deflate(process.env.LOGIN_PAYLOAD);

    let opts = {
      url: 'https://prod.escapefromtarkov.com/client/game/login',
      method: 'POST',
      gzip: true,
      encoding: null,
      headers: {
        Host: 'prod.escapefromtarkov.com',
        'User-Agent': 'UnityPlayer/5.6.6f2 (http://unity3d.com)',
        accept: '*/*',
        Connection: 'Keep-Alive',
        'X-Unity-Version': '5.6.6f2',
        'Content-Type': 'application/json',
      },
      body: payloadData,
      resolveWithFullResponse: true
    };

    try {
      let res = await request(opts);
      let body = res.body;

      // let length = Buffer.byteLength(body);

      let data = JSON.parse(
        pako.inflate(body, {
          to: 'string'
        })
      );

      if (data.err) {
        return message.reply(`Error logging into API: ${data.errmsg}`);
      }

      // get session auth
      let cookies = res.headers['set-cookie'];
      let cookie = cookies.find((e) => e.includes('PHPSESSID'));
      let sessionCookie = cookie.split(';')[0];

      // fetch profile id
      let profileId = data.data.activeProfileId;

      // select profile
      let selectOpts = Object.assign(opts, {
        url: 'https://prod.escapefromtarkov.com/client/game/profile/select',
        headers: {
          Cookie: sessionCookie,
        },
        body: pako.deflate(JSON.stringify({
          uid: profileId
        }))
      });

      let selectResponse = await request(selectOpts);

      let selectBody = selectResponse.body;

      let selectData = JSON.parse(
        pako.inflate(selectBody, {
          to: 'string'
        })
      );

      if (selectData.err) {
        return message.reply(`Error selecting game profile: ${selectData.errmsg}`);
      }

      return message.reply('Successfully logged into EFT API and obtained authorization token.')

    } catch (e) {
      console.log(e);
      return message.reply('Error sending login information.');
    }
  }

}

module.exports = LoginCommand;