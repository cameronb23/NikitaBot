require('dotenv').config();

const { Database } = require('mongorito');

const Client = require('./client');

// models
const { User, Item } = require('./models');


const client = new Client({
  ownerID: '325986883366551555',
  prefix: '!!!',
  commandDirectory: './src/commands/',
  moduleDirectory: './src/modules',
}, {
  disableEveryone: true,
});

const database = new Database(process.env.MONGO_URL, {
  reconnectTries: 5
});

function registerModels() {
  database.register(User);
  database.register(Item);
}

client.login(process.env.DISCORD_KEY).then(async (str) => {
  try {
    client.user.setPresence({ game: { name: ' with Mosin scavs' } });
  } catch (e) {
    console.log('Error setting rich presence: ', e);
  }

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