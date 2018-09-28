const { AkairoHandler } = require('discord-akairo');
const Module = require('./module');

class ModuleHandler extends AkairoHandler {
    constructor(client, options) {
        super(client, options.moduleDirectory, Module);

        this.customOption = options.customOption || 'something';
    }
}

module.exports = ModuleHandler;