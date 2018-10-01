const { AkairoClient } = require('discord-akairo');
const CustomHandler = require('./handler');

class NikitaClient extends AkairoClient {

  build() {
    this.authToken = null;

    if (this.akairoOptions.moduleDirectory) {
        this.customHandler = new CustomHandler(this, this.akairoOptions);
    }

    return super.build();
  }

  loadAll() {
    super.loadAll();
    if (this.customHandler) this.customHandler.loadAll();
  }

  /**
   * @returns the current (if any) session token for the EFT api authentication
   */
  getAuthToken() {
    return this.authToken;
  }

  /**
   * Sets the current authentication token for the API
   * @param {string} token the session token to be set 
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  getDatabase() {
    return this.database;
  }

  setDatabase(db) {
    this.database = db;
  }
}

module.exports = NikitaClient;