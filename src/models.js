const { Model } = require('mongorito');

class User extends Model {}
class Item extends Model {}

module.exports = {
  User,
  Item
};