const { AkairoModule } = require('discord-akairo');

class ApiModule extends AkairoModule {

  // error code 201 - not authorized
  // {"err":0,"errmsg":null,"data":{"token":"token_1819811","aid":1819811,"lang":"en","languages":{"en":"English","ge":"German","ru":"Русский"},"ndaFree":false,"queued":false,"taxonomy":266,"activeProfileId":"5bad877c8ed239298479ade3","backend":{"Trading":"http://prod.escapefromtarkov.com","Messaging":"http://prod.escapefromtarkov.com","Main":"http://prod.escapefromtarkov.com"},"utc_time":1538108130.2321,"twitchEventMember":false}}


  constructor(id, exec, options) {
    super(id, exec, options);

    this.color = options.color || 'red';
  }
}

module.exports = ApiModule;