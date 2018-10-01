const { Command } = require('discord-akairo');
const fs = require('fs');
const pako = require('pako');
const request = require('request-promise');

class GetItemsCommand extends Command {

  constructor() {
    super('items', {
      aliases: ['items'],
      ownerOnly: true,
      args: [
        {
          id: 'itemName',
          type: 'string',
          default: 'ifak'
        }
      ]
    });
  }

  async exec(message, args) {
    let token = this.client.getAuthToken();

    if (token == null) {
      return message.reply('API service unavailable at this time. Please try again later.');
    }
    
    let opts = {
      url: 'https://prod.escapefromtarkov.com/client/items',
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

      let length = Buffer.byteLength(body);

      let data = JSON.parse(
        pako.inflate(body, {
          to: 'string'
        })
      );

      if (data.err) {
        return message.reply(`\`${data.errmsg}\``);
      }
      
      let items = data.data;
      let query = args.itemName.trim();

      let found = null;

      Object.keys(items).forEach(async (id) => {
        let itemData = items[id]._props;
        if (itemData == null || itemData.ShortName == null)
          return;

        if (itemData.ShortName.toLowerCase().includes(query)) {
          found = items[id];
        }

        let item = items[id];

        try {
          await this.client.getDatabase().addItem(item);
        } catch(e) {
          console.log('Error adding item: ', e);
        }
      });

      fs.writeFile('items.json', JSON.stringify(data), (e) => {
        console.log(e);
      });

      if (found) {
        return message.reply(`Found item: ${found._props.ShortName} - ${found._name} - Price: ${found._props.CreditsPrice} [${length}]`);
      }
    } catch (e) {
      console.log(e);
      return message.reply('Error fetching EFT trader items.');
    }
  }

}

module.exports = GetItemsCommand;