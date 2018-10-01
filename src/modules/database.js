const Sequelize = require('sequelize');

const Module = require('../module');

var Item = null;


const ItemSchema = {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  tag: {
    type: Sequelize.STRING
  },
  parent: {
    type: Sequelize.STRING
  },
  meta: {
    type: Sequelize.STRING
  }
};


class DatabaseModule extends Module {
  constructor() {
    super('db', null, {
      logging: false,
      pool: {
        max: 10,
        idle: 30000,
        acquire: 60000
      }
    });

    // set up local database
    this.sql = new Sequelize('sqlite:db/items.db');

    // define item schema
    Item = this.sql.define('item', ItemSchema);
    
    // fetch session auth
    this.testConnection();
  }

  async testConnection() {
    try {
      await this.sql.authenticate();

      this.client.setDatabase(this);
      console.log('Successfully connected to local database.');

      await Item.sync();
    } catch (e) {
      console.log('Error connecting to local database: ', e);
    }
  }

  async addItem(item) {
    if (Item == null) {
      throw 'Error defining schema in database.';
    }
  
    return Item.create({
      id: item._id,
      tag: item._name,
      parent: item._parent,
      meta: JSON.stringify(item._props)
    });
  }
}

module.exports = DatabaseModule;