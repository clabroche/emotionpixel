const {mongo} = require('../helpers/mongoConnect')
const User = require('../services/Users')
module.exports = async function(req, res, next) {
  const user = await mongo.collection('users').findOne({$and: [
    {token: req.headers.token},
    {token: {$exists: true}}
  ]})
  console.log(req.headers.token)
  if(!user) {
    return res.status(403).send('Not authorized')
  } 
  req.user = await User.getUser(user._id)
  delete req.user.password
  next()
}