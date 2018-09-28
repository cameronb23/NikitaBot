const { AkairoModule } = require('discord-akairo');

class CustomModule extends AkairoModule {
  constructor(id, exec, options) {
    super(id, exec, options);
  }
}

module.exports = CustomModule;