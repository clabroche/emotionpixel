const {mongo} = require('../helpers/mongoConnect')
const PromiseB = require('bluebird')
/**
 * @param {User} user 
 */
function User(user) {
  this._id = mongo.getID(user._id)
  this.email = user.email || ''
  this.token = user.token || ''
  this.locations = user.locations || []
  this.lastLocation = user.lastLocation || null
  this.shared = user.shared || []
}

User.prototype.loadLocations = async function (limit = 30) {
  const locations = await mongo
    .collection('locations')
    .find({userId: mongo.getID(this._id)})
    .sort({_id: 1})
    .toArray()
  this.locations = locations.slice(locations.length - 30)
  this.lastLocation = locations.pop()
  return this
}
User.getUser = async function(userId) {
  const user = await mongo
    .collection('users')
    .findOne(userId)
  return new User(user).loadLocations()
}

User.prototype.getMyFriends = async function() {
  const friends = await mongo.collection('users').aggregate([
    {$match: {shared: {$in: [this._id]}}}    
  ]).toArray()
  return PromiseB.map(friends, friend => User.getUser(friend._id))
}
module.exports = User