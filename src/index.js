require('dotenv').config();

const { Database } = require('mongorito');
const { AkairoClient } = require('discord-akairo');

// models
const { User } = require('./models');


const client = new AkairoClient({
  ownerID: '325986883366551555',
  prefix: '!!!',
  commandDirectory: './src/commands/',
}, {
  disableEveryone: true,
});

const database = new Database(process.env.MONGO_URL, {
  reconnectTries: 5
});

function registerModels() {
  database.register(User);
}

client.login(process.env.DISCORD_KEY).then(async (str) => {
  // client has logged in, initialize database/
  console.log(`Discord client connected. Initializing database connection.`);
  try {
    await database.connect();
    console.log('Database connection established.');
    registerModels();
  } catch (e) {
    console.log('Error connecting to database: ', e);
    process.exit(0);
  }
}).catch((e) => {
  console.log(e);
  console.log('Error logging into discord.');
  process.exit(0);
});