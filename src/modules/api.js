const pako = require('pako');
const request = require('request-promise');

const Module = require('../module');

class ApiModule extends Module {
    constructor() {
      super('api', null, {});
      
      // fetch session auth
      this.exec();
    }

    async exec() {
      console.log('Initializing Escape from Tarkov API module.');
      try {
        await this.sendLogin();
        console.log('EFT API module loaded. Current auth token: ', this.client.getAuthToken());
      } catch (e) {
        this.client.setAuthToken(null);
        console.log('Error loading API module: ', e);
      }
    }

    async sendLogin() {
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

        console.log('Sending login information to server...');

        let res = await request(opts);
        let body = res.body;
  
        let data = JSON.parse(
          pako.inflate(body, {
            to: 'string'
          })
        );
  
        if (data.err) {
          throw 'Error logging into API: ' + data.errmsg;
        }
  
        // get session auth
        let cookies = res.headers['set-cookie'];
        let cookie = cookies.find((e) => e.includes('PHPSESSID'));
        let sessionCookie = cookie.split(';')[0];
  
        // fetch profile id
        let profileId = data.data.activeProfileId;

        return this.selectProfile(opts, sessionCookie, profileId);
      } catch (e) {
        throw 'Error sending login information: ' + e;
      }
    }

    async selectProfile(requestOpts, sessionCookie, profileId) {
      let opts = Object.assign(requestOpts, {
        url: 'https://prod.escapefromtarkov.com/client/game/profile/select',
        headers: {
          Cookie: sessionCookie,
        },
        body: pako.deflate(JSON.stringify({
          uid: profileId
        }))
      });

      try {
        console.log('Selecting game profile...');

        let res = await request(opts);
  
        let body = res.body;
  
        let data = JSON.parse(
          pako.inflate(body, {
            to: 'string'
          })
        );
  
        if (data.err) {
          throw 'Error selecting game profile: ' + data.errmsg;
        }

        this.client.setAuthToken(sessionCookie.split('PHPSESSID=')[1]);
        return;
      } catch (e) {
        throw 'Error selecting game profile: ' + e;
      }
    }
}

module.exports = ApiModule;