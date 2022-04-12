const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/lfg'

mongoose.connect(MONGODB_URI)

const db = mongoose.connection 

db.once('open', () => {
  console.log(`Connected to ${MONGODB_URI} at ${db.host}:${db.port}`)
})

db.on('error', (err)=> {
  console.error(`Database error: \n ${err}`)
})

module.exports.User = require('./user')
module.exports.Game = require('./game')
module.exports.Party = require('./party')